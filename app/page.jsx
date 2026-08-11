"use client";

import { useMemo, useState } from "react";
import { wordDiff } from "../lib/diff";

const SAMPLE =
  "In today's fast-paced digital landscape, it's important to note that content creation isn't just about writing\u2014it's about crafting a narrative. Let's delve into how leveraging cutting-edge AI tools can unlock unprecedented synergies, streamline your workflow, and elevate your brand. Whether you're a seasoned professional or just starting your journey, these game-changing insights will empower you to take your content to the next level.";

const PAGE_WORDS = 300; // ≈ one page, Times New Roman 11pt
const PAGE_RATE = 10; // $ per page
const TURNAROUND_MS = 60 * 60 * 1000; // 1 hour

function wordCount(t) {
  const m = t.trim().match(/\S+/g);
  return m ? m.length : 0;
}

export default function Home() {
  const [draft, setDraft] = useState("");
  const [view, setView] = useState("home"); // home | ai | human
  const [placeholder, setPlaceholder] = useState("Paste your AI-generated text here…");

  // AI pass state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // {rewritten, changes}
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState("redline"); // redline | clean

  const diffOps = useMemo(
    () => (result ? wordDiff(draft, result.rewritten) : []),
    [draft, result]
  );

  // Human pass state
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [order, setOrder] = useState(null); // {id, words, pages, price, eta, email}

  const words = useMemo(() => wordCount(draft), [draft]);
  const pages = Math.max(1, Math.ceil(words / PAGE_WORDS));
  const price = pages * PAGE_RATE;

  function requireDraft() {
    if (words === 0) {
      setPlaceholder("Paste some text first — or hit “Try a sample.”");
      return false;
    }
    return true;
  }

  async function runAiPass() {
    if (!requireDraft()) return;
    setView("ai");
    setResult(null);
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/unslop", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: draft }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function openHumanPass() {
    if (!requireDraft()) return;
    setOrder(null);
    setView("human");
  }

  function submitOrder() {
    if (!email.includes("@")) return;
    // TODO(production): POST to /api/order → Stripe Checkout → DB → editor notification.
    setOrder({
      id: "USI-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      words,
      pages,
      price,
      eta: new Date(Date.now() + TURNAROUND_MS),
      email,
    });
  }

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(result?.rewritten || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  const etaLabel = (d) =>
    d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) +
    (d.getDate() !== new Date().getDate() ? " tomorrow" : " today");

  return (
    <>
      <header>
        <div className="wrap head-inner">
          <div className="wordmark">
            Un<span className="slop">Slop</span>It.ai
          </div>
          <div className="head-note">prototype v0.2</div>
        </div>
      </header>

      <main className="wrap">
        {view === "home" && (
          <section className="stage active">
            <div className="hero">
              <div className="eyebrow">Human-sounding text, on demand</div>
              <h1>
                Your draft{" "}
                <span className="strike">leverages synergies to delve into</span>{" "}
                <span className="fix">says</span> what you mean.
              </h1>
              <p>
                Paste anything an AI wrote, then UnSlopIt. Instant by default —
                or hand it to a human editor and get it back in an hour.
              </p>
            </div>

            <div className="panel">
              <div className="panel-bar">
                <span className="label">Your draft</span>
                <button className="ghost-btn" type="button" onClick={() => setDraft(SAMPLE)}>
                  Try a sample
                </button>
              </div>
              <textarea
                aria-label="Paste your draft"
                placeholder={placeholder}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <div className="panel-foot">
                <span className="count">{words} words</span>
                <span className="count">Drafts are processed, not stored</span>
              </div>
            </div>

            <div className="go">
              <button className="primary go-btn" type="button" onClick={runAiPass}>
                ⚡ UnSlopIt now
                <span className="go-sub">Instant AI edit — free in prototype</span>
              </button>
            </div>

            <div className="modes">
              <button className="mode" type="button" onClick={openHumanPass}>
                <span className="tag">Prefer a person?</span>
                <h3>Request human editor</h3>
                <p>
                  A real editor rewrites it in your voice, flags anything
                  unclear, and returns a tracked-changes summary.
                </p>
                <span className="meta">✍️ 1-hour turnaround · $10/page*</span>
                <span className="meta fine">*Times New Roman, 11 pt font, approx. 300 words</span>
              </button>
            </div>
          </section>
        )}

        {view === "ai" && (
          <section className="stage active">
            <button className="back" type="button" onClick={() => setView("home")}>
              ← Back to draft
            </button>
            <h2>Machine pass</h2>
            <p className="sub">Rewritten by AI against UnSlopIt house rules.</p>

            {loading && (
              <div className="working">
                <span className="pen" />
                Applying the red pen…
              </div>
            )}
            {error && <div className="error-box">The edit didn&apos;t come back: {error}</div>}

            {result && (
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
                    <div className="out-body">{result.rewritten}</div>
                  )}
                </div>
                {viewMode === "clean" && (
                  <div className="out-panel">
                    <div className="panel-bar">
                      <span className="label">What the red pen caught</span>
                    </div>
                    <ul className="changes">
                      {result.changes.length === 0 && (
                        <li>Surprisingly clean — only light touch-ups needed.</li>
                      )}
                      {result.changes.map((c, i) => (
                        <li key={i}>
                          <span className="was">{c.was}</span>
                          <span className="why">{c.why}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {view === "human" && (
          <section className="stage active">
            <button className="back" type="button" onClick={() => setView("home")}>
              ← Back to draft
            </button>
            <h2>Human pass</h2>
            <p className="sub">An editor takes it from here. You&apos;ll have it back within 1 hour.</p>

            {!order ? (
              <div className="form-grid">
                <div className="quote">
                  <span>
                    <strong>
                      {words} words · {pages} {pages === 1 ? "page" : "pages"}
                    </strong>
                  </span>
                  <span>
                    Est. <strong>${price.toFixed(2)}</strong>
                  </span>
                  <span>
                    Due by <strong>{etaLabel(new Date(Date.now() + TURNAROUND_MS))}</strong>
                  </span>
                </div>
                <div className="field">
                  <label htmlFor="h-email">Email for delivery</label>
                  <input
                    id="h-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="h-notes">
                    Voice &amp; tone notes <span style={{ textTransform: "none", letterSpacing: 0 }}>(optional)</span>
                  </label>
                  <textarea
                    id="h-notes"
                    placeholder="e.g. Casual but sharp. First person. It's a LinkedIn post for founders."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                <div>
                  <button className="primary" type="button" onClick={submitOrder}>
                    Send to an editor
                  </button>
                  <p className="demo-note">
                    Prototype only — this creates a mock order and sends nothing anywhere.
                  </p>
                </div>
              </div>
            ) : (
              <div className="confirm">
                <span className="stamp">In the queue</span>
                <h2 style={{ fontSize: 20 }}>Your editor has it.</h2>
                <dl>
                  <dt>Order</dt>
                  <dd>{order.id}</dd>
                  <dt>Words</dt>
                  <dd>
                    {order.words} ({order.pages} {order.pages === 1 ? "page" : "pages"})
                  </dd>
                  <dt>Price</dt>
                  <dd>${order.price.toFixed(2)}</dd>
                  <dt>Delivery by</dt>
                  <dd>
                    {order.eta.toLocaleString([], {
                      weekday: "short",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </dd>
                  <dt>Sent to</dt>
                  <dd>{order.email}</dd>
                </dl>
                <p className="demo-note">
                  In production: order hits the editor queue, payment is captured, and the
                  finished edit lands in your inbox with a change summary.
                </p>
              </div>
            )}
          </section>
        )}
      </main>

      <footer>
        <div className="wrap">UnSlopIt.ai · Just UnSlopIt.</div>
      </footer>
    </>
  );
}
