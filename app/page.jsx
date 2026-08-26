"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase-browser";
import { BEFORE_AFTER, TAXONOMY } from "../lib/taxonomy";
import { FAQ } from "../lib/faq";
import { SAMPLES } from "../lib/samples";
import { trackConversion } from "../lib/analytics";
import Footer from "./_components/Footer";

const SAMPLE =
  "In today's fast-paced digital landscape, it's important to note that content creation isn't just about writing\u2014it's about crafting a narrative. Let's delve into how leveraging cutting-edge AI tools can unlock unprecedented synergies, streamline your workflow, and elevate your brand. Whether you're a seasoned professional or just starting your journey, these game-changing insights will empower you to take your content to the next level.";

function wordCount(t) {
  const m = t.trim().match(/\S+/g);
  return m ? m.length : 0;
}

export default function Home() {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [sampleNote, setSampleNote] = useState(false); // ?sample= pre-fill loaded
  const [view, setView] = useState("home"); // home | working | human | gate
  const [placeholder, setPlaceholder] = useState("Paste your AI-generated text here…");

  // AI pass state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Edit options
  const [level, setLevel] = useState("medium"); // light | medium | full
  const [addTypo, setAddTypo] = useState(false); // sprinkle one human typo

  // Before/after carousel
  const [baIdx, setBaIdx] = useState(0);
  const [baPaused, setBaPaused] = useState(false); // pause auto-advance on hover/focus
  const baGo = (d) =>
    setBaIdx((i) => (i + d + BEFORE_AFTER.length) % BEFORE_AFTER.length);

  // Free-edit metering state
  const [meter, setMeter] = useState(null); // {tier, used, remaining, limit, gate, email}
  const [gate, setGate] = useState(false); // true once the current tier is exhausted
  const [gateType, setGateType] = useState(null); // "signup" | "paywall"

  // Auth state — the browser client is built in an effect (client-only) so it
  // never runs during static prerender, where NEXT_PUBLIC_* env isn't present.
  const [supabase, setSupabase] = useState(null);
  const [user, setUser] = useState(null); // {email} once signed in
  const [authEmail, setAuthEmail] = useState("");
  const [authStatus, setAuthStatus] = useState("idle"); // idle | sending | sent | error
  const [authError, setAuthError] = useState("");

  // Pull the current tier + count from the server (honest counter on load,
  // and after sign-in/out the tier changes).
  async function refreshMeter() {
    try {
      const d = await fetch("/api/meter").then((r) => r.json());
      setMeter(d);
      setGate(Boolean(d.gate));
      setGateType(d.gate || null);
    } catch {}
  }

  useEffect(() => {
    // /result's "register" CTA links back with ?register=1 → open the form.
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("register") === "1") setView("human");
      // ?sample=<category-id> pre-fills the textarea from a spoke-page CTA.
      const slug = params.get("sample");
      if (slug && SAMPLES[slug]) {
        setDraft(SAMPLES[slug]);
        setSampleNote(true);
      }
    }
    refreshMeter();
    let client;
    try {
      client = createClient();
    } catch {
      client = null; // NEXT_PUBLIC_SUPABASE_* not configured — auth simply unavailable.
    }
    setSupabase(client);
    if (!client) return;

    // Track auth session; re-read the meter whenever it changes.
    client.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      refreshMeter();
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-advance the before/after carousel (pause on hover/focus; respect reduced motion).
  useEffect(() => {
    if (baPaused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const id = setInterval(
      () => setBaIdx((i) => (i + 1) % BEFORE_AFTER.length),
      6000
    );
    return () => clearInterval(id);
  }, [baPaused]);

  async function sendMagicLink() {
    if (!supabase || !authEmail.includes("@") || authStatus === "sending") return;
    setAuthStatus("sending");
    setAuthError("");
    const { error: err } = await supabase.auth.signInWithOtp({
      email: authEmail,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (err) {
      setAuthError(err.message);
      setAuthStatus("error");
    } else {
      setAuthStatus("sent");
      trackConversion("register"); // primary conversion — email submitted for signup
    }
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setView("home");
    refreshMeter();
  }

  // Interest capture state
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [interestStatus, setInterestStatus] = useState("idle"); // idle | loading | done | error
  const [interestError, setInterestError] = useState("");

  const words = useMemo(() => wordCount(draft), [draft]);

  function requireDraft() {
    if (words === 0) {
      setPlaceholder("Paste some text first — or hit “Try a sample.”");
      return false;
    }
    return true;
  }

  async function runAiPass() {
    if (!requireDraft()) return;
    // Already out of free edits — go straight to the gate, don't spend a call.
    if (gate) {
      setView("gate");
      return;
    }
    setView("working");
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/unslop", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: draft, level, addTypo }),
      });
      const data = await res.json();
      // Server says the current tier is exhausted (signup gate or paywall).
      if (res.status === 402 && data.gate) {
        setMeter(data);
        setGate(true);
        setGateType(data.gate);
        setView("gate");
        return;
      }
      if (!res.ok) throw new Error(data.error || "Request failed");
      if (typeof data.remaining === "number") {
        setMeter(data);
        if (data.remaining <= 0) {
          setGate(true);
          // Anon exhaustion → prompt signup; account exhaustion → paywall.
          setGateType(data.tier === "account" ? "paywall" : "signup");
        }
      }
      // Hand the result to /result via sessionStorage (no server storage — keeps
      // the "drafts aren't stored" promise) and navigate to the result page.
      sessionStorage.setItem("usi_result", JSON.stringify({ ...data, draft }));
      router.push("/result");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  function openInterest() {
    setInterestStatus("idle");
    setInterestError("");
    setView("human");
  }

  async function submitInterest() {
    if (!email.includes("@") || interestStatus === "loading") return;
    setInterestStatus("loading");
    setInterestError("");
    try {
      const res = await fetch("/api/interest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, notes, words }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't register your interest.");
      setInterestStatus("done");
      trackConversion("register"); // primary conversion — email captured
    } catch (err) {
      setInterestError(err.message);
      setInterestStatus("error");
    }
  }

  return (
    <>
      <header>
        <div className="wrap head-inner">
          <button
            type="button"
            className="wordmark"
            onClick={() => setView("home")}
            aria-label="UnSlopIt.ai — go to homepage"
          >
            Un<span className="slop">Slop</span>It.ai
          </button>
          <nav className="head-nav">
            <a className="head-nav-link" href="/learn">
              Learn
            </a>
            <a className="head-nav-link" href="/humanize-ai-text">
              Guide
            </a>
            {user && (
              <div className="head-note">
                <span className="auth-state">
                  {user.email}
                  <button className="link-btn" type="button" onClick={signOut}>
                    Sign out
                  </button>
                </span>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="wrap">
        {view === "home" && (
          <section className="stage active">
            <div className="hero">
              <div className="hero-copy">
                <h1>Remove AI slop.</h1>
                <div className="hero-gag" aria-hidden="true">
                  <span className="strike">
                    Let&apos;s delve into what makes your content truly resonate
                  </span>{" "}
                  <span className="fix">Here&apos;s how to write well</span>
                </div>
              </div>
              <img
                className="hero-art"
                src="/typewriter.svg"
                alt="A typewriter typing a page, with a red correction appearing"
                width="340"
                height="320"
              />
            </div>

            <div className="panel">
              <div className="panel-bar">
                <span className="label">Your draft</span>
                <button className="ghost-btn" type="button" onClick={() => setDraft(SAMPLE)}>
                  Try a sample
                </button>
              </div>
              {sampleNote && (
                <p className="sample-note">
                  Sample text loaded. Replace it with your own.
                </p>
              )}
              <textarea
                aria-label="Paste your draft"
                placeholder={placeholder}
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  if (sampleNote) setSampleNote(false);
                }}
              />
              <div className="panel-foot">
                <span className="count">{words} words</span>
                <span className="count">Drafts are processed, not stored</span>
              </div>
            </div>

            <div className="options">
              <div className="opt-group">
                <span className="opt-label">Edit strength</span>
                <div className="seg" role="tablist" aria-label="Edit strength">
                  {[
                    ["light", "Light touch"],
                    ["medium", "Medium touch"],
                    ["full", "Full rewrite"],
                  ].map(([val, label]) => (
                    <button
                      key={val}
                      type="button"
                      className={level === val ? "on" : ""}
                      aria-pressed={level === val}
                      onClick={() => setLevel(val)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="opt-group">
                <span className="opt-label">Add a typo</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={addTypo}
                  aria-label="Add a typo"
                  className={`switch ${addTypo ? "on" : ""}`}
                  onClick={() => setAddTypo((v) => !v)}
                  title="Slip in one natural typo so it reads as human-written"
                >
                  <span className="switch-track">
                    <span className="switch-knob" />
                  </span>
                </button>
              </div>
              <div className="go">
                <button className="primary go-btn" type="button" onClick={runAiPass}>
                  UnSlopIt now
                </button>
                <span className="go-meta">
                  {meter && typeof meter.remaining === "number"
                    ? `${meter.remaining} of ${meter.limit} free edit${
                        meter.limit === 1 ? "" : "s"
                      } left`
                    : "Instant AI edit — free in prototype"}
                </span>
              </div>
            </div>

            <div className="aside">
              <h3>Prefer a person?</h3>
              <p>
                A real editor rewrites it in your voice, flags anything unclear,
                and returns a tracked-changes summary.
              </p>
              <button className="text-link" type="button" onClick={openInterest}>
                Register your interest →
              </button>
            </div>

            <div className="ba-home">
              <h2 className="ba-home-title">Before &amp; after</h2>
              <div
                className="ba-carousel"
                onMouseEnter={() => setBaPaused(true)}
                onMouseLeave={() => setBaPaused(false)}
                onFocusCapture={() => setBaPaused(true)}
                onBlurCapture={() => setBaPaused(false)}
                aria-roledescription="carousel"
                aria-label="Before and after examples"
              >
                <div
                  className="ba"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${baIdx + 1} of ${BEFORE_AFTER.length}: ${
                    BEFORE_AFTER[baIdx].label
                  }`}
                >
                  <span className="ba-label">{BEFORE_AFTER[baIdx].label}</span>
                  <p className="ba-before">{BEFORE_AFTER[baIdx].before}</p>
                  <p className="ba-after">{BEFORE_AFTER[baIdx].after}</p>
                  <p className="ba-caught">
                    {BEFORE_AFTER[baIdx].caught.map((c, j) => (
                      <span className="tell" key={j}>
                        {c}
                      </span>
                    ))}
                  </p>
                </div>
                <div className="ba-controls">
                  <button
                    className="ba-arrow"
                    type="button"
                    onClick={() => baGo(-1)}
                    aria-label="Previous example"
                  >
                    ←
                  </button>
                  <div className="ba-dots">
                    {BEFORE_AFTER.map((_, i) => (
                      <button
                        key={i}
                        className={`ba-dot ${i === baIdx ? "on" : ""}`}
                        type="button"
                        onClick={() => setBaIdx(i)}
                        aria-label={`Go to example ${i + 1}`}
                        aria-current={i === baIdx}
                      />
                    ))}
                  </div>
                  <button
                    className="ba-arrow"
                    type="button"
                    onClick={() => baGo(1)}
                    aria-label="Next example"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            <div className="home-block">
              <h2 className="home-block-title">The AI slop taxonomy</h2>
              <p className="home-block-sub">
                The {TAXONOMY.length} tells the editor hunts for.{" "}
                <a href="/learn#taxonomy">See the full guide →</a>
              </p>
              <table className="tax-table">
                <thead>
                  <tr>
                    <th className="tt-n"></th>
                    <th className="tt-cat">Category</th>
                    <th className="tt-tells">Example tells</th>
                  </tr>
                </thead>
                <tbody>
                  {TAXONOMY.map((c, i) => (
                    <tr key={c.id}>
                      <td className="tt-n">{String(i + 1).padStart(2, "0")}</td>
                      <td className="tt-cat">
                        <a href={`/learn/${c.id}`}>{c.title}</a>
                      </td>
                      <td className="tt-tells">{c.tells.slice(0, 3).join(" · ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="home-block">
              <h2 className="home-block-title">FAQ</h2>
              <dl className="faq">
                {FAQ.slice(0, 3).map((item, i) => (
                  <div className="faq-item" key={i}>
                    <dt>{item.q}</dt>
                    <dd>{item.a}</dd>
                  </div>
                ))}
              </dl>
              <p className="home-block-sub" style={{ marginTop: 16, marginBottom: 0 }}>
                <a href="/about#faq">More questions →</a>
              </p>
            </div>
          </section>
        )}

        {view === "working" && (
          <section className="stage active">
            <button className="back" type="button" onClick={() => setView("home")}>
              ← Back to draft
            </button>
            {loading && (
              <div className="working">
                <img
                  className="working-art"
                  src="/typewriter.svg"
                  alt=""
                  aria-hidden="true"
                />
                <span>Applying the red pen…</span>
              </div>
            )}
            {error && (
              <div className="error-box">The edit didn&apos;t come back: {error}</div>
            )}
          </section>
        )}

        {view === "human" && (
          <section className="stage active">
            <button className="back" type="button" onClick={() => setView("home")}>
              ← Back to draft
            </button>
            <h2>Human editing — coming soon</h2>
            <p className="sub">
              Real editors, your voice, tracked changes. Interested? Leave your email
              and we&apos;ll tell you the moment it&apos;s live.
            </p>

            {interestStatus !== "done" ? (
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="h-email">Email</label>
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
                    What would you use it for?{" "}
                    <span style={{ textTransform: "none", letterSpacing: 0 }}>(optional)</span>
                  </label>
                  <textarea
                    id="h-notes"
                    placeholder="e.g. LinkedIn posts, cold emails, blog intros…"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                {interestStatus === "error" && (
                  <div className="error-box">{interestError}</div>
                )}
                <div>
                  <button
                    className="primary"
                    type="button"
                    onClick={submitInterest}
                    disabled={interestStatus === "loading" || !email.includes("@")}
                  >
                    {interestStatus === "loading" ? "Registering…" : "Register interest"}
                  </button>
                  <p className="demo-note">
                    No spam — just one email when human editing goes live.
                  </p>
                </div>
              </div>
            ) : (
              <div className="confirm">
                <span className="stamp">You&apos;re on the list</span>
                <h2 style={{ fontSize: 20 }}>Thanks — we&apos;ll be in touch.</h2>
                <p style={{ marginTop: 10, fontSize: 14 }}>
                  We&apos;ll email <strong>{email}</strong> the moment human editing
                  is available.
                </p>
              </div>
            )}
          </section>
        )}

        {view === "gate" && (
          <section className="stage active">
            <button className="back" type="button" onClick={() => setView("home")}>
              ← Back to draft
            </button>

            {gateType === "paywall" ? (
              <>
                <h2>You&apos;ve used all your free edits</h2>
                <p className="sub">
                  That&apos;s the full free allowance for <strong>{user?.email}</strong>.
                  Paid packages and subscriptions are coming next.
                </p>
                <div className="form-grid">
                  <div>
                    <button className="primary" type="button" disabled>
                      See plans
                    </button>
                    <p className="demo-note">
                      Checkout ships in the next update.
                    </p>
                  </div>
                </div>
              </>
            ) : authStatus === "sent" ? (
              <div className="confirm">
                <span className="stamp">Check your inbox</span>
                <h2 style={{ fontSize: 20 }}>Magic link sent.</h2>
                <p style={{ marginTop: 10, fontSize: 14 }}>
                  We emailed a sign-in link to <strong>{authEmail}</strong>. Click it and
                  you&apos;ll come back with {meter?.limit ?? 3} more free edits.
                </p>
              </div>
            ) : (
              <>
                <h2>You&apos;ve used your {meter?.limit ?? 3} free edits</h2>
                <p className="sub">
                  Create a free account for {meter?.limit ?? 3} more — no password, no
                  card. We&apos;ll email you a one-tap sign-in link.
                </p>
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="auth-email">Email</label>
                    <input
                      id="auth-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                    />
                  </div>
                  {authStatus === "error" && (
                    <div className="error-box">{authError}</div>
                  )}
                  <div>
                    <button
                      className="primary"
                      type="button"
                      onClick={sendMagicLink}
                      disabled={authStatus === "sending" || !authEmail.includes("@")}
                    >
                      {authStatus === "sending" ? "Sending…" : "Email me a magic link"}
                    </button>
                    <p className="demo-note">
                      Already have an account? The same link signs you back in.
                    </p>
                  </div>
                </div>
              </>
            )}
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
