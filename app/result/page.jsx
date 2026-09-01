"use client";

import { useEffect, useMemo, useState } from "react";
import { wordDiff } from "../../lib/diff";
import { trackConversion } from "../../lib/analytics";
import SiteHeader from "../_components/SiteHeader";
import Footer from "../_components/Footer";

// Render the rewritten text with the human typo marked and any "flagged" tells
// highlighted in yellow — tells the editor detected but left in place because
// removing them would have changed the author's meaning.
function renderMarked(text, typo, flagged) {
  const marks = [];
  (Array.isArray(flagged) ? flagged : []).forEach((f) => {
    if (!f || typeof f.text !== "string" || !f.text) return;
    const start = text.indexOf(f.text);
    if (start >= 0) {
      marks.push({ start, end: start + f.text.length, type: "flag", why: f.why });
    }
  });
  if (typo && typeof typo.index === "number" && typo.index >= 0) {
    const end = typo.index + (typo.word ? typo.word.length : 0);
    marks.push({ start: typo.index, end, type: "typo" });
  }
  if (marks.length === 0) return text;

  // Sort by position and drop any overlaps (keep the earlier mark).
  marks.sort((a, b) => a.start - b.start);
  const kept = [];
  let lastEnd = 0;
  for (const m of marks) {
    if (m.start >= lastEnd) {
      kept.push(m);
      lastEnd = m.end;
    }
  }

  const out = [];
  let cursor = 0;
  kept.forEach((m, i) => {
    if (m.start > cursor) out.push(text.slice(cursor, m.start));
    const seg = text.slice(m.start, m.end);
    if (m.type === "flag") {
      out.push(
        <mark
          className="flag-mark"
          key={`f${i}`}
          title={m.why || "Flagged tell — left to preserve your meaning"}
        >
          {seg}
        </mark>
      );
    } else {
      out.push(
        <span className="typo-mark" key={`t${i}`} title="A human typo we slipped in">
          {seg}
        </span>
      );
    }
    cursor = m.end;
  });
  if (cursor < text.length) out.push(text.slice(cursor));
  return <>{out}</>;
}

// Render the word-diff redline, highlighting flagged tells in yellow and the
// injected human typo with a wavy underline. Works at the token level over the
// rewritten token stream (same + ins tokens): `flaggedSet` holds the indices
// inside a flagged phrase, `typoIdx` the single token that carries the typo —
// so both survive even when the diff splits or shifts text.
function renderRedline(ops, flaggedSet, typoIdx) {
  const out = [];
  let idx = 0; // position in the rewritten token stream
  ops.forEach((op, oi) => {
    if (op.type === "break") {
      out.push(<br key={`b${oi}`} />);
      return;
    }
    if (op.type === "del") {
      out.push(
        <span key={`d${oi}`} className="rl-del">
          {op.text}{" "}
        </span>
      );
      return; // deleted tokens aren't in the rewrite — don't advance idx
    }
    const insCls = op.type === "ins" ? "rl-ins" : "";
    const tokens = op.text.split(" ").filter(Boolean);
    tokens.forEach((t, ti) => {
      const isFlag = flaggedSet.has(idx);
      const isTypo = idx === typoIdx;
      idx++;
      const key = `${oi}-${ti}`;
      const txt = t + " ";
      let inner = insCls ? <span className={insCls}>{txt}</span> : txt;
      if (isTypo) {
        inner = (
          <span className="typo-mark" title="A human typo we slipped in">
            {inner}
          </span>
        );
      }
      out.push(
        isFlag ? (
          <mark className="flag-mark" key={key}>
            {inner}
          </mark>
        ) : (
          <span key={key}>{inner}</span>
        )
      );
    });
  });
  return out;
}

export default function ResultPage() {
  const [data, setData] = useState(null); // { rewritten, changes, typo, draft }
  const [status, setStatus] = useState("loading"); // loading | ready | empty
  const [viewMode, setViewMode] = useState("redline"); // redline | clean
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("usi_result");
      if (raw) {
        const d = JSON.parse(raw);
        setData(d);
        setStatus("ready");
        trackConversion("edit"); // the "edit completed" micro-conversion
      } else {
        setStatus("empty");
      }
    } catch {
      setStatus("empty");
    }
  }, []);

  const diffOps = useMemo(
    () => (data ? wordDiff(data.draft, data.rewritten) : []),
    [data]
  );

  // Which tokens in the rewritten stream fall inside a flagged phrase, so the
  // redline can highlight flags the same way the clean view does.
  const flaggedTokenSet = useMemo(() => {
    const set = new Set();
    if (!data?.flagged?.length) return set;
    const toks = [];
    for (const op of diffOps) {
      if (op.type === "same" || op.type === "ins") {
        for (const t of op.text.split(" ")) if (t) toks.push(t);
      }
    }
    const tok = (s) =>
      (s || "")
        .replace(/\r/g, "")
        .replace(/\n/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
    for (const f of data.flagged) {
      const seq = tok(f && f.text);
      if (!seq.length) continue;
      for (let i = 0; i + seq.length <= toks.length; i++) {
        let ok = true;
        for (let k = 0; k < seq.length; k++)
          if (toks[i + k] !== seq[k]) {
            ok = false;
            break;
          }
        if (ok) {
          for (let k = 0; k < seq.length; k++) set.add(i + k);
          break;
        }
      }
    }
    return set;
  }, [data, diffOps]);

  // The single rewritten-token index that carries the injected typo (or -1),
  // derived from its character position — so the redline can mark it too.
  const typoTokenIdx = useMemo(() => {
    const t = data?.typo;
    if (!t || typeof t.index !== "number" || t.index < 0) return -1;
    const before = (data.rewritten || "").slice(0, t.index);
    return before
      .replace(/\r/g, "")
      .replace(/\n/g, " ⏎ ")
      .split(/[ \t]+/)
      .filter((x) => x && x !== "⏎").length;
  }, [data]);

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(data?.rewritten || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <>
      <SiteHeader action={{ href: "/", label: "New draft →" }} />

      <main className="wrap">
        <section className="stage active">
          <a className="back" href="/">
            ← New draft
          </a>

          {status === "empty" && (
            <p className="sub">
              No edit to show.{" "}
              <a className="inline-link" href="/">
                Start a draft →
              </a>
            </p>
          )}

          {status === "ready" && data && (
            <>
              <h2>Unslopped.</h2>
              <p className="sub">
                {data.changes.length > 0
                  ? `${data.changes.length} AI tell${
                      data.changes.length === 1 ? "" : "s"
                    } struck with your meaning intact`
                  : "Surprisingly clean — only light touch-ups needed."}
              </p>

              <div className="result-grid">
                <div className="out-panel">
                  <div className="panel-bar">
                    <span className="label">
                      {viewMode === "redline" ? "Redline" : "Unslopped"}
                    </span>
                    <div className="bar-tools">
                      <div className="seg" role="tablist" aria-label="Output view">
                        <button
                          type="button"
                          className={viewMode === "redline" ? "on" : ""}
                          onClick={() => setViewMode("redline")}
                        >
                          Redline
                        </button>
                        <button
                          type="button"
                          className={viewMode === "clean" ? "on" : ""}
                          onClick={() => setViewMode("clean")}
                        >
                          Clean
                        </button>
                      </div>
                      <button className="ghost-btn" type="button" onClick={copyResult}>
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                  {viewMode === "redline" ? (
                    <div className="out-body">
                      {renderRedline(diffOps, flaggedTokenSet, typoTokenIdx)}
                    </div>
                  ) : (
                    <div className="out-body">
                      {renderMarked(data.rewritten, data.typo, data.flagged)}
                    </div>
                  )}
                </div>
                {viewMode === "clean" && (
                  <div className="out-panel">
                    <div className="panel-bar">
                      <span className="label">What the red pen caught</span>
                    </div>
                    <ul className="changes">
                      {data.changes.length === 0 && (
                        <li>Surprisingly clean — only light touch-ups needed.</li>
                      )}
                      {data.changes.map((c, i) => (
                        <li key={i}>
                          <span className="was">{c.was}</span>
                          <span className="why">{c.why}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {data.flagged?.length > 0 && (
                <p className="flag-legend">
                  <mark className="flag-mark">Highlighted</mark> tells were
                  flagged but left in place — removing them would change your
                  meaning. Edit these by hand if you want them gone.
                </p>
              )}

              <p className="result-guide-note">
                Want to do this yourself?{" "}
                <a className="inline-link" href="/humanize-ai-text">
                  The five-step method
                </a>{" "}
                explains what the editor is doing and the two steps it can’t do
                for you.
              </p>

              <div className="result-cta">
                <h3>Keep the good drafts coming.</h3>
                <p>
                  Register your email for more free edits and to hear when human
                  editing goes live.
                </p>
                <a className="primary" href="/?register=1">
                  Register your email &rarr;
                </a>
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
