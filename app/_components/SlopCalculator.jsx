"use client";

import { useEffect, useRef, useState } from "react";
import { SLOP, slopPerDay, SECONDS_PER_DAY } from "../../lib/slop-equation";

const fmt = (n) => Math.round(n).toLocaleString("en-US");
const pct = (x) => `${Math.round(x * 100)}%`;

// S / L / O — fixed terms whose sources reveal on hover or keyboard focus.
function Term({ t }) {
  return (
    <div className="eq-term" tabIndex={0}>
      <div className="eq-term-main">
        <span className="eq-key">{t.key}</span>
        <span className="eq-term-name">
          {t.name}
          <span className="eq-term-sub"> — {t.sub}</span>
        </span>
        <span className="eq-term-val">{t.display}</span>
      </div>
      <div className="eq-src" role="note">
        <ul>
          {t.sources.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
        {t.sourceUrl && (
          <a href={t.sourceUrl} target="_blank" rel="noopener noreferrer">
            Source ↗
          </a>
        )}
      </div>
    </div>
  );
}

// Slop dripping like wet paint: a gooey filter fuses the edge and the blobs
// into one liquid mass. Each blob swells at the edge, detaches, and falls off
// the bottom (fading as it goes); it never rises back up. Big blobs.
const BLOBS = [
  { cx: 60, r: 19, dur: "3.4s", begin: "0s" },
  { cx: 155, r: 22, dur: "4.2s", begin: "1.5s" },
  { cx: 250, r: 17, dur: "3.7s", begin: "2.7s" },
  { cx: 340, r: 23, dur: "4.0s", begin: "0.8s" },
  { cx: 430, r: 18, dur: "4.4s", begin: "2.1s" },
  { cx: 510, r: 20, dur: "3.6s", begin: "1.1s" },
];

function SlopDrip() {
  return (
    <svg
      className="slop-drip"
      viewBox="0 0 560 96"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="slopgoo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="b" />
          <feColorMatrix
            in="b"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -12"
          />
        </filter>
        <linearGradient id="slopfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#615b4a" />
          <stop offset="1" stopColor="#35312a" />
        </linearGradient>
      </defs>
      <g filter="url(#slopgoo)" fill="url(#slopfill)">
        <rect x="6" y="0" width="548" height="16" />
        {BLOBS.map((b, i) => (
          <circle key={i} cx={b.cx} cy="16" r={b.r}>
            {/* swell at the edge, then accelerate downward off the bottom */}
            <animate
              attributeName="cy"
              values="16;26;110"
              keyTimes="0;0.18;1"
              calcMode="spline"
              keySplines="0.3 0 0.7 1;0.45 0 0.9 0.55"
              dur={b.dur}
              begin={b.begin}
              repeatCount="indefinite"
            />
            {/* invisible at the moment it resets to the top — no visible rise */}
            <animate
              attributeName="opacity"
              values="1;1;1;0"
              keyTimes="0;0.18;0.72;1"
              dur={b.dur}
              begin={b.begin}
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values={`${b.r};${b.r};${(b.r * 0.55).toFixed(1)}`}
              keyTimes="0;0.5;1"
              dur={b.dur}
              begin={b.begin}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>
    </svg>
  );
}

export default function SlopCalculator({ embed = false }) {
  const [p, setP] = useState(SLOP.P.value); // 0..1
  const [count, setCount] = useState(0); // words accumulated since mount

  const perDay = slopPerDay(p);
  const perSecond = perDay / SECONDS_PER_DAY;

  // The rAF loop is started once; it reads the latest rate through a ref so
  // moving the slider changes the speed without restarting or jumping the count.
  const rateRef = useRef(perSecond);
  rateRef.current = perSecond;

  useEffect(() => {
    let raf;
    let last = null;
    const tick = (now) => {
      if (last == null) last = now;
      const dt = (now - last) / 1000;
      last = now;
      setCount((c) => c + rateRef.current * dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const core = (
    <>
      <div className="eq-result">
        <div className="eq-result-num">{fmt(perDay)}</div>
        <SlopDrip />
        <div className="eq-result-label">
          unedited AI words published per day
        </div>
        <p className="eq-ticker">
          Since you opened this page, <strong>{fmt(count)}</strong> unedited AI
          words have gone out — about {fmt(perSecond)} a second.
        </p>
      </div>

      <div className="eq-formula">
        <span className="eq-lhs">SLOP</span>
        <span className="eq-eq">=</span>
        <span className="eq-var">S</span>
        <span className="eq-op">×</span>
        <span className="eq-var">L</span>
        <span className="eq-op">×</span>
        <span className="eq-var">O</span>
        <span className="eq-op">×</span>
        <span className="eq-var eq-var-p">P</span>
      </div>

      <div className="eq-terms">
        <Term t={SLOP.S} />
        <Term t={SLOP.L} />
        <Term t={SLOP.O} />

        <div className="eq-term eq-term-slider">
          <div className="eq-term-main">
            <span className="eq-key eq-key-p">P</span>
            <span className="eq-term-name">
              {SLOP.P.name}
              <span className="eq-term-sub"> — {SLOP.P.sub}</span>
            </span>
            <span className="eq-term-val eq-term-val-live">{pct(p)}</span>
          </div>
          <input
            className="eq-slider"
            type="range"
            min={SLOP.P.min}
            max={SLOP.P.max}
            step={SLOP.P.step}
            value={p}
            onChange={(e) => setP(parseFloat(e.target.value))}
            aria-label="Pass rate — fraction published with no human review"
          />
          <p className="eq-slider-note">
            The term that publishers are too embarrassed to report. Drag it.
          </p>
        </div>
      </div>
    </>
  );

  if (embed) {
    return (
      <div className="eq-embed">
        <div className="eq-embed-head">
          <span className="eq-embed-mark">
            Un<span className="slop">Slop</span>It.ai
          </span>
          <span className="eq-embed-title">The SLOP Equation</span>
        </div>
        <div className="eq-block">{core}</div>
        <a
          className="eq-embed-cite"
          href="https://unslopit.ai/slop-equation"
          target="_blank"
          rel="noopener noreferrer"
        >
          The SLOP Equation · UnSlopIt.ai →
        </a>
      </div>
    );
  }

  return <div className="eq-block">{core}</div>;
}
