import { useMemo, useRef, useState } from 'react';

/**
 * TokenCalculator: what does a locally generated token cost?
 *
 *   cost per day        = hardware / life + power × hours × electricity price
 *   cost per 1M tokens  = cost per day / tokens per day × 1,000,000
 *
 * Every assumption is an input. The defaults are illustrative, not measured.
 */

const FIELDS = [
  { key: 'hardware', label: 'Hardware price', unit: '$', min: 300, max: 12000, step: 100 },
  { key: 'life', label: 'Useful life', unit: 'years', min: 1, max: 8, step: 0.5 },
  { key: 'watts', label: 'Power while generating', unit: 'W', min: 10, max: 800, step: 5 },
  { key: 'kwh', label: 'Electricity price', unit: '$/kWh', min: 0.05, max: 0.6, step: 0.01 },
  { key: 'tps', label: 'Generation speed', unit: 'tokens/s', min: 2, max: 200, step: 1 },
  { key: 'hours', label: 'Hours generating per day', unit: 'h/day', min: 0.25, max: 24, step: 0.25 },
  { key: 'api', label: 'Hosted price to compare', unit: '$ per 1M tokens', min: 0.1, max: 80, step: 0.1 },
];

const DEFAULTS = { hardware: 2000, life: 4, watts: 60, kwh: 0.17, tps: 30, hours: 2, api: 10 };

const money = (v) => {
  if (!Number.isFinite(v)) return 'n/a';
  if (v >= 100) return `$${Math.round(v).toLocaleString('en-US')}`;
  return `$${v.toFixed(2)}`;
};

function costPerMillion(v, hours) {
  const perDay = v.hardware / (v.life * 365) + (v.watts / 1000) * hours * v.kwh;
  const tokens = v.tps * 3600 * hours;
  return (perDay / tokens) * 1e6;
}

export default function TokenCalculator() {
  const [v, setV] = useState(DEFAULTS);
  const [hover, setHover] = useState(null);
  const svgRef = useRef(null);

  const set = (key) => (e) => {
    const n = parseFloat(e.target.value);
    if (Number.isFinite(n)) setV((prev) => ({ ...prev, [key]: n }));
  };

  const result = useMemo(() => {
    const local = costPerMillion(v, v.hours);
    const tokensDay = v.tps * 3600 * v.hours;
    // Hours per day at which local and hosted cost the same.
    const margin = (v.api * v.tps * 3600) / 1e6 - (v.watts / 1000) * v.kwh; // $ saved per hour of generating
    const breakEven = margin > 0 ? v.hardware / (v.life * 365) / margin : Infinity;
    return { local, tokensDay, breakEven };
  }, [v]);

  /* ── Chart geometry ─────────────────────────────────────────────── */
  const Wd = 640;
  const Ht = 310;
  const m = { l: 58, r: 20, t: 18, b: 42 };
  const iw = Wd - m.l - m.r;
  const ih = Ht - m.t - m.b;
  const hMin = 0.25;
  const hMax = 24;

  const chart = useMemo(() => {
    const samples = [];
    for (let i = 0; i <= 96; i++) {
      const h = hMin + ((hMax - hMin) * i) / 96;
      samples.push({ h, c: costPerMillion(v, h) });
    }
    const lo = Math.min(samples[samples.length - 1].c, v.api);
    const hi = Math.max(samples[0].c, v.api);
    const d0 = Math.floor(Math.log10(lo * 0.8));
    const d1 = Math.ceil(Math.log10(hi * 1.1));
    const x = (h) => m.l + ((h - 0) / (hMax - 0)) * iw;
    const y = (c) => m.t + ih - ((Math.log10(c) - d0) / (d1 - d0)) * ih;
    const ticks = [];
    for (let d = d0; d <= d1; d++) ticks.push(10 ** d);
    return { samples, x, y, ticks, path: samples.map((s, i) => `${i ? 'L' : 'M'}${x(s.h).toFixed(1)} ${y(s.c).toFixed(1)}`).join(' ') };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v]);

  const onMove = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * Wd;
    const h = Math.min(hMax, Math.max(hMin, ((px - m.l) / iw) * hMax));
    setHover({ h, c: costPerMillion(v, h) });
  };

  const tickLabel = (t) => (t >= 1 ? `$${t.toLocaleString('en-US')}` : `$${t}`);
  const cheaper = result.local < v.api;
  const hv = hover || { h: v.hours, c: result.local };
  const tipLeft = chart.x(hv.h) > Wd * 0.62;
  const localEndAbove = costPerMillion(v, 20) > v.api; // keep the two series labels apart

  return (
    <section className="calc" aria-label="Local token cost calculator">
      <header className="calc__head">
        <div className="label label--gold">Interactive</div>
        <h3>What does a local token cost?</h3>
      </header>

      <div className="calc__grid">
        <div className="calc__inputs">
          {FIELDS.map((f) => (
            <label className="calc__field" key={f.key}>
              <span className="calc__field-top">
                <span>{f.label}</span>
                <span className="calc__value">
                  <input type="number" value={v[f.key]} min={f.min} max={f.max} step={f.step} onChange={set(f.key)} aria-label={`${f.label} (${f.unit})`} />
                  <em>{f.unit}</em>
                </span>
              </span>
              <input type="range" value={v[f.key]} min={f.min} max={f.max} step={f.step} onChange={set(f.key)} tabIndex={-1} aria-hidden="true" />
            </label>
          ))}
          <button className="arrow-link calc__reset" onClick={() => setV(DEFAULTS)}>
            Reset to the illustrative defaults
          </button>
        </div>

        <div className="calc__out">
          <div className="calc__tiles">
            <div className="calc__tile">
              <span className="label">Local</span>
              <strong>{money(result.local)}</strong>
              <span>per million tokens</span>
            </div>
            <div className="calc__tile">
              <span className="label">Hosted</span>
              <strong>{money(v.api)}</strong>
              <span>per million tokens</span>
            </div>
            <div className="calc__tile">
              <span className="label">Break-even</span>
              <strong>{Number.isFinite(result.breakEven) && result.breakEven <= 24 ? `${result.breakEven.toFixed(1)} h` : 'Never'}</strong>
              <span>{Number.isFinite(result.breakEven) && result.breakEven <= 24 ? 'of generating per day' : 'at this speed and price'}</span>
            </div>
          </div>

          <figure className="calc__chart">
            <svg ref={svgRef} viewBox={`0 0 ${Wd} ${Ht}`} role="img" aria-label="Cost per million tokens against hours of use per day" onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
              {chart.ticks.map((t) => (
                <g key={t}>
                  <line className="calc__gridline" x1={m.l} x2={Wd - m.r} y1={chart.y(t)} y2={chart.y(t)} />
                  <text className="calc__tick" x={m.l - 8} y={chart.y(t) + 3.5} textAnchor="end">{tickLabel(t)}</text>
                </g>
              ))}
              {[0, 4, 8, 12, 16, 20, 24].map((h) => (
                <text key={h} className="calc__tick" x={chart.x(h)} y={Ht - m.b + 18} textAnchor="middle">{h}</text>
              ))}
              <line className="calc__axis" x1={m.l} x2={Wd - m.r} y1={m.t + ih} y2={m.t + ih} />
              <text className="calc__tick" x={m.l + iw / 2} y={Ht - 6} textAnchor="middle">hours generating per day</text>

              {/* Hosted price: a flat reference line */}
              <line className="calc__ref" x1={m.l} x2={Wd - m.r} y1={chart.y(v.api)} y2={chart.y(v.api)} />
              <text className="calc__series" x={Wd - m.r - 4} y={chart.y(v.api) - 7} textAnchor="end">Hosted</text>

              {/* Local cost curve */}
              <path className="calc__line" d={chart.path} />
              <text className="calc__series" x={chart.x(20)} y={chart.y(costPerMillion(v, 20)) + (localEndAbove ? -10 : 18)} textAnchor="middle">Local</text>

              {/* Crosshair and marker */}
              <line className="calc__cross" x1={chart.x(hv.h)} x2={chart.x(hv.h)} y1={m.t} y2={m.t + ih} />
              <circle className="calc__dot" cx={chart.x(hv.h)} cy={chart.y(hv.c)} r="5" />
              <g transform={`translate(${chart.x(hv.h) + (tipLeft ? -12 : 12)} ${Math.max(m.t + 14, chart.y(hv.c) - 34)})`}>
                <text className="calc__tip" textAnchor={tipLeft ? 'end' : 'start'}>
                  <tspan x="0" dy="0" className="calc__tip-strong">{money(hv.c)} per 1M</tspan>
                  <tspan x="0" dy="15">{hv.h.toFixed(hv.h < 10 ? 1 : 0)} h per day{hover ? '' : ' (your input)'}</tspan>
                </text>
              </g>
              <rect x={m.l} y={m.t} width={iw} height={ih} fill="transparent" />
            </svg>
            <figcaption>
              Cost per million tokens, on a logarithmic scale. {cheaper ? 'At your inputs the local machine is cheaper per token.' : 'At your inputs the hosted model is cheaper per token.'} The machine
              produces about {Math.round(result.tokensDay / 1000).toLocaleString('en-US')} thousand tokens a day.
            </figcaption>
          </figure>

          <details className="calc__table">
            <summary>Show the numbers as a table</summary>
            <table>
              <thead>
                <tr>
                  <th scope="col">Hours per day</th>
                  <th scope="col">Local, per 1M tokens</th>
                  <th scope="col">Hosted, per 1M tokens</th>
                </tr>
              </thead>
              <tbody>
                {[0.5, 1, 2, 4, 8, 16, 24].map((h) => (
                  <tr key={h}>
                    <td>{h}</td>
                    <td>{money(costPerMillion(v, h))}</td>
                    <td>{money(v.api)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </div>
      </div>
      <p className="calc__note">
        Simplifications: idle power, cooling, your own time and resale value are left out, and a hosted price usually differs for input and output tokens.
        Speed is treated as constant. Use measured numbers before making a decision.
      </p>
    </section>
  );
}
