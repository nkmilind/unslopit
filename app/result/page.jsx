"use client";

import { useEffect, useMemo, useState } from "react";
import { wordDiff } from "../../lib/diff";
import { trackConversion } from "../../lib/analytics";
import SiteHeader from "../_components/SiteHeader";
import Footer from "../_components/Footer";

function renderWithTypo(text, typo) {
  if (!typo || typeof typo.index !== "number" || typo.index < 0) return text;
  const end = typo.index + (typo.word ? typo.word.length : 0);
  return (
    <>
      {text.slice(0, typo.index)}
      <span className="typo-mark" title="A human typo we slipped in">
        {text.slice(typo.index, end)}
      </span>
      {text.slice(end)}
    </>
  );
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
        if (d.typo) setViewMode("clean");
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
                      {diffOps.map((op, i) => {
                        if (op.type === "break") return <br key={i} />;
                        if (op.type === "del")
                          return (
                            <span key={i} className="rl-del">
                              {op.text}{" "}
                            </span>
                          );
                        if (op.type === "ins")
                          return (
                            <span key={i} className="rl-ins">
                              {op.text}{" "}
                            </span>
                          );
                        return <span key={i}>{op.text} </span>;
                      })}
                    </div>
                  ) : (
                    <div className="out-body">
                      {renderWithTypo(data.rewritten, data.typo)}
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
