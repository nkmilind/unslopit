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

// Slop dripping from under the number: a wet source line and drops that swell
// at the edge, then detach and fall.
function DripField() {
  const drips = Array.from({ length: 13 });
  const n = drips.length;
  return (
    <div className="drip-field" aria-hidden="true">
      <span className="drip-edge" />
      {drips.map((_, i) => (
        <span
          key={i}
          className="drip"
          style={{
            left: `${8 + (i / (n - 1)) * 84}%`,
            animationDelay: `${(i * 0.41) % 2.9}s`,
            animationDuration: `${2.2 + ((i * 5) % 6) * 0.28}s`,
          }}
        />
      ))}
    </div>
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
      <p className="eq-legend">Unedited AI words published per day.</p>

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
            The one term nobody measures. Drag it.
          </p>
        </div>
      </div>

      <div className="eq-result">
        <div className="eq-result-num">{fmt(perDay)}</div>
        <div className="eq-result-label">
          unedited AI words published per day
        </div>
        <DripField />
      </div>

      <p className="eq-ticker">
        Since you opened this page,{" "}
        <strong>{fmt(count)}</strong> unedited AI words have gone out — about{" "}
        {fmt(perSecond)} a second.
      </p>
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
