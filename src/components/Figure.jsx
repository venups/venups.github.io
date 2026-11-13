import { asset } from '../lib/content.js';

/**
 * Figure: the "plate" at the top of a card or a case study.
 *
 * If the content file has a `cover` image, that image is shown.
 * Otherwise a line drawing is shown, chosen by the `figure` name in the
 * front matter. To add a new drawing, add a function to DRAWINGS below.
 *
 * All drawings share one 480 × 300 sheet and four pen styles:
 *   .i  ink        .l  light ink        .f  faint ink        .g  gold
 */

const range = (n) => Array.from({ length: n }, (_, i) => i);
const W = 480;
const H = 300;

const Ground = ({ y, x1 = 20, x2 = 460 }) => (
  <g>
    <line className="i" x1={x1} y1={y} x2={x2} y2={y} />
    {range(Math.floor((x2 - x1) / 14)).map((i) => (
      <line key={i} className="f" x1={x1 + 6 + i * 14} y1={y} x2={x1 + i * 14} y2={y + 6} />
    ))}
  </g>
);

const Label = ({ x, y, children, anchor = 'start' }) => (
  <text className="t" x={x} y={y} textAnchor={anchor}>
    {children}
  </text>
);

const DRAWINGS = {
  /* Suspension bridge, elevation */
  suspension() {
    const tL = 150;
    const tR = 330;
    const deck = 196;
    const top = 78;
    const main = (x) => deck - 12 - (deck - 12 - top) * ((x - 240) / 90) ** 2;
    const sideL = (x) => top + ((deck - 4 - top) * (tL - x)) / (tL - 36);
    const sideR = (x) => top + ((deck - 4 - top) * (x - tR)) / (444 - tR);
    const pts = (fn, a, b) => range(31).map((i) => `${a + ((b - a) * i) / 30},${fn(a + ((b - a) * i) / 30)}`).join(' ');
    return (
      <g>
        <line className="f" x1="20" y1="232" x2="460" y2="232" strokeDasharray="10 6" />
        <line className="i" x1="24" y1={deck} x2="456" y2={deck} />
        <line className="l" x1="36" y1={deck + 7} x2="444" y2={deck + 7} />
        {[tL, tR].map((x) => (
          <g key={x}>
            <line className="i" x1={x - 3} y1={top - 6} x2={x - 3} y2="244" />
            <line className="i" x1={x + 3} y1={top - 6} x2={x + 3} y2="244" />
            {range(7).map((i) => (
              <line key={i} className="l" x1={x - 3} y1={top + 4 + i * 22} x2={x + 3} y2={top + 4 + i * 22} />
            ))}
            <rect className="i" x={x - 12} y="244" width="24" height="8" />
          </g>
        ))}
        {range(13).map((i) => {
          const x = tL + 12.86 * (i + 1);
          return <line key={i} className="l" x1={x} y1={main(x)} x2={x} y2={deck} />;
        })}
        {range(7).map((i) => {
          const x = 50 + i * 14;
          return <line key={i} className="l" x1={x} y1={sideL(x)} x2={x} y2={deck} />;
        })}
        {range(7).map((i) => {
          const x = 346 + i * 14;
          return <line key={i} className="l" x1={x} y1={sideR(x)} x2={x} y2={deck} />;
        })}
        <polyline className="g" points={pts(main, tL, tR)} />
        <polyline className="g" points={pts(sideL, 36, tL)} />
        <polyline className="g" points={pts(sideR, tR, 444)} />
        <path className="i" d="M24 196 l8 -12 h12 l6 12" />
        <path className="i" d="M456 196 l-8 -12 h-12 l-6 12" />
        <line className="l" x1={tL} y1="266" x2={tR} y2="266" />
        <line className="l" x1={tL} y1="261" x2={tL} y2="271" />
        <line className="l" x1={tR} y1="261" x2={tR} y2="271" />
        <Label x="240" y="280" anchor="middle">MAIN SPAN</Label>
      </g>
    );
  },

  /* Curved girders in plan, two construction stages */
  'curved-girder'() {
    const cx = 240;
    const cy = 590;
    const arc = (r, a0 = -0.42, a1 = 0.42) => {
      const p = (a) => `${cx + r * Math.sin(a)},${cy - r * Math.cos(a)}`;
      return `M${p(a0)} A${r} ${r} 0 0 1 ${p(a1)}`;
    };
    const radii = [400, 418, 436, 454, 472, 490];
    return (
      <g>
        {radii.map((r, i) => (
          <path key={r} className={i < 3 ? 'g' : 'i'} d={arc(r)} />
        ))}
        {range(15).map((i) => {
          const a = -0.42 + (0.84 * i) / 14;
          const pier = i === 4 || i === 10;
          return (
            <line
              key={i}
              className={pier ? 'i' : 'l'}
              x1={cx + (pier ? 390 : 400) * Math.sin(a)}
              y1={cy - (pier ? 390 : 400) * Math.cos(a)}
              x2={cx + (pier ? 500 : 490) * Math.sin(a)}
              y2={cy - (pier ? 500 : 490) * Math.cos(a)}
              strokeDasharray={pier ? '7 4' : undefined}
            />
          );
        })}
        <Label x="60" y="250">STAGE 1</Label>
        <line className="g" x1="112" y1="247" x2="140" y2="247" />
        <Label x="160" y="250">STAGE 2</Label>
        <line className="i" x1="212" y1="247" x2="240" y2="247" />
        <Label x="420" y="250" anchor="end">PLAN · 3 SPANS</Label>
      </g>
    );
  },

  /* Multi-span viaduct, elevation */
  viaduct() {
    const piers = [70, 155, 240, 325, 410];
    return (
      <g>
        <Ground y={236} />
        <line className="i" x1="20" y1="118" x2="460" y2="118" />
        <line className="l" x1="20" y1="112" x2="460" y2="112" />
        {range(5).concat([5]).map((i) => {
          const a = i === 0 ? 20 : piers[i - 1];
          const b = i === 5 ? 460 : piers[i];
          const m = (a + b) / 2;
          return <path key={i} className={i === 2 ? 'g' : 'i'} d={`M${a} 140 Q${m} 126 ${b} 140`} />;
        })}
        {piers.map((x) => (
          <g key={x}>
            <path className="i" d={`M${x - 14} 140 h28 l-6 10 v76 h-10 v-76 z`} />
            <rect className="i" x={x - 16} y="226" width="32" height="10" />
          </g>
        ))}
        {range(21).map((i) => (
          <line key={i} className="f" x1={30 + i * 21} y1="118" x2={30 + i * 21} y2="134" />
        ))}
        <Label x="240" y="270" anchor="middle">ELEVATION · STEEL I-GIRDERS</Label>
      </g>
    );
  },

  /* Interchange in plan, the new bridge in gold */
  interchange() {
    return (
      <g>
        <path className="i" d="M20 190 C150 180 330 150 460 96" />
        <path className="i" d="M20 206 C150 196 330 166 460 112" />
        <path className="l" d="M96 20 C120 110 190 210 300 280" />
        <path className="l" d="M112 20 C136 110 206 210 316 280" />
        <path className="f" d="M460 180 C380 200 300 150 262 80 C250 56 250 36 256 20" />
        <path className="f" d="M460 196 C372 216 286 160 248 84 C236 58 236 36 240 20" />
        <path className="g" d="M176 150 C210 186 240 196 286 176" strokeWidth="5" />
        <line className="i" x1="172" y1="142" x2="182" y2="160" />
        <line className="i" x1="282" y1="166" x2="290" y2="186" />
        <line className="l" x1="212" y1="170" x2="218" y2="190" strokeDasharray="4 3" />
        <line className="l" x1="246" y1="176" x2="250" y2="197" strokeDasharray="4 3" />
        <Label x="296" y="212">BRIDGE NO. 2</Label>
        <Label x="30" y="232">I-278</Label>
        <Label x="330" y="270">US 1&amp;9</Label>
      </g>
    );
  },

  /* Girder end lifted on jacks beside the bearing */
  jacking() {
    return (
      <g>
        <Ground y={250} x1={90} x2={390} />
        <path className="i" d="M150 250 V170 h-22 v-16 h224 v16 h-22 v80" />
        <path className="i" d="M40 78 H440 M40 86 H440 M40 132 H440 M40 140 H440" />
        <line className="i" x1="40" y1="86" x2="40" y2="132" />
        <line className="i" x1="440" y1="86" x2="440" y2="132" />
        {[120, 200, 280, 360].map((x) => (
          <line key={x} className="l" x1={x} y1="86" x2={x} y2="132" />
        ))}
        <rect className="l" x="222" y="140" width="36" height="14" />
        <Label x="240" y="172" anchor="middle">BEARING</Label>
        {[176, 304].map((x) => (
          <g key={x}>
            <rect className="g" x={x - 12} y="140" width="24" height="14" />
            <line className="g" x1={x} y1="126" x2={x} y2="100" />
            <path className="g" d={`M${x - 5} 108 L${x} 100 L${x + 5} 108`} />
          </g>
        ))}
        <path className="f" d="M40 62 H440" strokeDasharray="6 5" />
        <Label x="446" y="60" anchor="end">LIFT</Label>
        <Label x="240" y="280" anchor="middle">PIER · JACKS EACH SIDE OF BEARING</Label>
      </g>
    );
  },

  /* Through-girder railway bridge, cross-section */
  'through-girder'() {
    const girder = (x) => (
      <path className="i" d={`M${x - 22} 60 h44 v8 h-17 v150 h17 v8 h-44 v-8 h17 v-150 h-17 z`} />
    );
    return (
      <g>
        {girder(96)}
        {girder(384)}
        <path className="i" d="M101 176 H379 M101 196 H379" />
        <path className="l" d="M101 176 L119 150 M379 176 L361 150" />
        {[176, 304].map((cx) => (
          <g key={cx}>
            <rect className="l" x={cx - 46} y="164" width="92" height="12" />
            {[-24, 24].map((dx) => (
              <path key={dx} className="g" d={`M${cx + dx - 5} 164 h10 M${cx + dx} 164 v-12 M${cx + dx - 6} 152 h12`} />
            ))}
            <Label x={cx} y="140" anchor="middle">TRACK</Label>
          </g>
        ))}
        <Ground y={244} x1={56} x2={424} />
        <Label x="240" y="276" anchor="middle">SECTION · FLOORBEAM THROUGH-GIRDER</Label>
      </g>
    );
  },

  /* Land bridge: a field of arch girders forming a saddle */
  'land-bridge'() {
    return (
      <g>
        {range(16).map((i) => {
          const t = i / 15;
          const off = (t - 0.5) * 2;
          const x0 = 70 + i * 6;
          const x1 = 316 + i * 6;
          const base = 214 - i * 5.2;
          const rise = 58 + 34 * off * off;
          const mid = (x0 + x1) / 2;
          return <path key={i} className={i === 0 || i === 15 ? 'g' : i % 2 ? 'l' : 'i'} d={`M${x0} ${base} Q${mid} ${base - rise * 2} ${x1} ${base}`} />;
        })}
        <path className="i" d="M70 214 L160 136" />
        <path className="i" d="M316 214 L406 136" />
        <path className="f" d="M40 232 H330 L440 138" strokeDasharray="8 5" />
        <Label x="60" y="262">16 ARCH GIRDERS</Label>
        <Label x="420" y="262" anchor="end">150 FT × 150 FT</Label>
      </g>
    );
  },

  /* Skewed deck in plan */
  'skew-deck'() {
    const sk = 70;
    const xs = range(9).map((i) => 50 + i * 38);
    return (
      <g>
        <path className="i" d={`M${50 + sk} 70 H${354 + sk} L354 220 H50 Z`} />
        {range(7).map((i) => {
          const y = 88 + i * 19;
          const shift = sk * (1 - (y - 70) / 150);
          return <line key={i} className={i === 3 ? 'g' : 'l'} x1={50 + shift} y1={y} x2={354 + shift} y2={y} />;
        })}
        {xs.slice(1, -1).map((x, i) => (
          <line key={x} className={i === 2 || i === 4 ? 'i' : 'f'} x1={x + sk} y1="70" x2={x} y2="220" strokeDasharray={i === 2 || i === 4 ? '7 4' : undefined} />
        ))}
        <path className="l" d="M372 220 H430 M372 220 L442 70" />
        <path className="g" d="M408 220 A36 36 0 0 0 389 184" fill="none" />
        <Label x="420" y="196">SKEW</Label>
        <Label x="50" y="252">PLAN · DECK AND GIRDER LINES</Label>
      </g>
    );
  },

  /* Software pipeline: five stages */
  pipeline() {
    const steps = ['EXTRACT', 'STANDARDIZE', 'GENERATE', 'VALIDATE', 'REVIEW'];
    return (
      <g>
        <path className="l" d="M40 70 h66 M40 78 h66 M40 124 h66 M40 132 h66 M73 78 v46" />
        <Label x="73" y="152" anchor="middle">OPENBRIDGE</Label>
        <path className="i" d="M374 132 h66 M380 132 l10 -44 M434 132 l-10 -44 M390 88 h34" />
        <path className="l" d="M395 132 v-44 M407 132 v-44 M419 132 v-44 M385 110 h44" />
        <Label x="407" y="152" anchor="middle">CSIBRIDGE</Label>
        <path className="g" d="M120 101 H360" />
        <path className="g" d="M352 95 L360 101 L352 107" />
        {steps.map((s, i) => {
          const x = 26 + i * 88;
          const gold = i === 3;
          return (
            <g key={s}>
              <rect className={gold ? 'g' : 'i'} x={x} y="190" width="76" height="34" rx="2" />
              <Label x={x + 38} y="211" anchor="middle">{s}</Label>
              {i < 4 && <path className="l" d={`M${x + 78} 207 h8 m-4 -3 l4 3 l-4 3`} />}
              <Label x={x + 38} y="182" anchor="middle">{`0${i + 1}`}</Label>
            </g>
          );
        })}
        <path className="f" d="M26 244 H454" />
        <Label x="240" y="266" anchor="middle">MODEL IN · VALIDATED MODEL OUT · ENGINEER SIGNS</Label>
      </g>
    );
  },

  /* Application suite: one home, many tools */
  suite() {
    const tools = ['MODEL', 'WIND', 'STAAD', 'SHOP DWG', 'REVIEW', 'NEXT'];
    return (
      <g>
        <rect className="i" x="40" y="40" width="400" height="212" rx="3" />
        <line className="i" x1="40" y1="66" x2="440" y2="66" />
        <circle className="l" cx="54" cy="53" r="3" />
        <circle className="l" cx="66" cy="53" r="3" />
        <circle className="l" cx="78" cy="53" r="3" />
        <Label x="240" y="57" anchor="middle">GFT TRANSPORTATION</Label>
        <line className="l" x1="140" y1="66" x2="140" y2="252" />
        {range(5).map((i) => (
          <line key={i} className={i === 0 ? 'g' : 'l'} x1="56" y1={90 + i * 18} x2={i === 0 ? 124 : 108 + (i % 2) * 12} y2={90 + i * 18} />
        ))}
        {tools.map((t, i) => {
          const x = 158 + (i % 3) * 90;
          const y = 84 + Math.floor(i / 3) * 78;
          const last = i === 5;
          return (
            <g key={t}>
              <rect className={i === 0 ? 'g' : last ? 'f' : 'i'} x={x} y={y} width="76" height="62" rx="2" strokeDasharray={last ? '5 4' : undefined} />
              <path className="l" d={`M${x + 12} ${y + 22} h52 M${x + 12} ${y + 32} h34`} />
              <Label x={x + 12} y={y + 52}>{t}</Label>
            </g>
          );
        })}
        <Label x="240" y="278" anchor="middle">ONE HOME FOR THE PRACTICE’S TOOLS</Label>
      </g>
    );
  },

  /* Code: a script driving an analysis model */
  code() {
    const lines = [
      [0, 120, 'i'], [14, 180, 'l'], [14, 150, 'l'], [28, 110, 'g'], [28, 160, 'l'], [14, 90, 'l'], [0, 70, 'i'], [14, 170, 'l'], [14, 130, 'g'],
    ];
    return (
      <g>
        <rect className="i" x="36" y="44" width="246" height="212" rx="3" />
        <line className="i" x1="36" y1="68" x2="282" y2="68" />
        <Label x="50" y="60">MACRO · PYTHON · VBA</Label>
        {lines.map(([indent, len, cls], i) => (
          <line key={i} className={cls} x1={56 + indent} y1={90 + i * 18} x2={56 + indent + len} y2={90 + i * 18} />
        ))}
        <path className="g" d="M290 150 H330" />
        <path className="g" d="M323 144 L331 150 L323 156" />
        <path className="i" d="M340 190 H452 M340 110 H452" />
        {range(8).map((i) => (
          <path key={i} className="l" d={`M${340 + i * 14} 190 L${347 + i * 14} 110 L${354 + i * 14} 190`} />
        ))}
        <path className="i" d="M346 190 v24 M446 190 v24" />
        <Label x="396" y="236" anchor="middle">ANALYSIS MODEL</Label>
      </g>
    );
  },

  /* Chart: cost per token falls as the machine works more */
  chart() {
    const pts = range(40).map((i) => {
      const u = 0.06 + (i / 39) * 0.94;
      return `${64 + u * 370},${226 - Math.min(170, 13 / u)}`;
    });
    return (
      <g>
        <path className="i" d="M64 50 V226 H446" />
        {range(4).map((i) => (
          <line key={i} className="f" x1="64" y1={86 + i * 35} x2="446" y2={86 + i * 35} />
        ))}
        <line className="l" x1="64" y1="170" x2="446" y2="170" strokeDasharray="7 5" />
        <polyline className="g" points={pts.join(' ')} />
        <Label x="440" y="162" anchor="end">HOSTED PRICE</Label>
        <Label x="118" y="74">LOCAL</Label>
        <Label x="255" y="252" anchor="middle">HOURS OF USE PER DAY →</Label>
        <text className="t" transform="translate(46 138) rotate(-90)" textAnchor="middle">COST PER TOKEN</text>
      </g>
    );
  },

  /* Default: a simple girder span */
  girder() {
    return (
      <g>
        <Ground y={232} />
        <path className="i" d="M40 120 H440 M40 128 H440 M40 160 H440 M40 168 H440" />
        {range(11).map((i) => (
          <line key={i} className="l" x1={40 + i * 40} y1="128" x2={40 + i * 40} y2="160" />
        ))}
        {[70, 240, 410].map((x) => (
          <path key={x} className="i" d={`M${x - 16} 168 h32 l-6 10 v54 h-20 v-54 z`} />
        ))}
        <path className="g" d="M40 108 H440" />
        <Label x="240" y="266" anchor="middle">ELEVATION</Label>
      </g>
    );
  },
};

export const FIGURE_NAMES = Object.keys(DRAWINGS);

export default function Figure({ type = 'girder', cover, alt = '', caption, bare = false, className = '' }) {
  if (cover) {
    return (
      <figure className={`plate plate--photo ${className}`}>
        <img src={asset(cover)} alt={alt} loading="lazy" decoding="async" />
        {caption && <figcaption className="plate__caption label">{caption}</figcaption>}
      </figure>
    );
  }
  const draw = DRAWINGS[type] || DRAWINGS.girder;
  const svg = (
    <svg className="fig" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={alt || `Line drawing: ${type.replace(/-/g, ' ')}`} preserveAspectRatio="xMidYMid meet">
      {draw()}
    </svg>
  );
  if (bare) return svg;
  return (
    <figure className={`plate ${className}`}>
      {svg}
      {caption && <figcaption className="plate__caption label">{caption}</figcaption>}
    </figure>
  );
}
