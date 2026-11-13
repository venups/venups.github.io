/**
 * bridge-model.js: the engineering behind the hero drawing. No graphics code.
 *
 *   G                 the geometry: spans, tower height, cable sag, panel spacing
 *   buildBridge()     the bridge as lists of line segments, for BridgeScene to draw
 *   deflection(x, X)  how far station x moves vertically for a point load at X
 *
 * Units are arbitrary "drawing feet". x runs along the bridge (0 at midspan),
 * y is up (0 at deck level), z is across the deck.
 *
 * To change the look of the bridge, edit the numbers in G and save.
 */
export const G = {
  L: 74, // half the main span: the towers stand at x = -L and x = +L
  side: 28, // length of each side span, tower to anchorage
  towerTop: 29, // height of the cable saddles above the deck
  towerBase: -9, // tower foundations, below the deck
  sagClear: 3.2, // cable clearance above the deck at midspan
  deckY: 0,
  halfWidth: 5, // half the distance between the two cable planes
  trussDepth: 2.6, // depth of the stiffening truss under the deck
  panels: 24, // suspender panels in the main span
  sidePanels: 4, // floor-beam panels in each side span
};

const clamp01 = (v) => Math.max(0, Math.min(1, v));

/** Height of the main cable above the deck at station x (a parabola between the towers). */
export function cableY(x) {
  const t = clamp01(Math.abs(x) / G.L);
  return G.deckY + G.sagClear + (G.towerTop - G.sagClear) * t * t;
}

/* ── Deflected shape ──────────────────────────────────────────────────────
 *
 * A drawing aid, not an analysis. It reproduces what a suspension span does
 * under one heavy point load:
 *
 *   - the deck dips under the load;
 *   - the main cable is very stiff along its length, so it cannot simply get
 *     longer. The dip is paid for by a rise elsewhere, mostly in the far half
 *     of the main span;
 *   - the tower tops lean a little toward the load, which tightens the
 *     backstays, so the unloaded side spans lift slightly;
 *   - nothing moves at the towers or the anchorages.
 */
const DIP_WIDTH = 0.3; // half-width of the dip, as a fraction of the main span
const CABLE_STIFFNESS = 0.82; // 1 = a cable that cannot stretch at all (dip area = rise area)
const SIDE_LIFT = 0.14; // side-span lift as a fraction of the main-span dip

/** The dip: a smooth bump centred on the load, 1 at the load and 0 beyond DIP_WIDTH. */
function dip(xi, loadXi) {
  const u = (xi - loadXi) / DIP_WIDTH;
  if (u <= -1 || u >= 1) return 0;
  const c = Math.cos((Math.PI * u) / 2);
  return c * c;
}

/** Fades the movement out to zero at each tower. */
function towerTaper(xi) {
  const e = clamp01(Math.min(xi, 1 - xi) / 0.08);
  return e * e * (3 - 2 * e);
}

/** A load near a tower moves the span less than the same load at midspan. */
function loadEffect(loadXi) {
  return Math.pow(Math.sin(Math.PI * clamp01(loadXi)), 0.7);
}

// The average dip over the main span depends only on where the load is, so it
// is worked out once per load position and reused for every point of the bridge.
let cachedLoad = NaN;
let cachedMean = 0;
function meanDip(loadXi) {
  if (loadXi === cachedLoad) return cachedMean;
  const steps = 64;
  let sum = 0;
  for (let i = 0; i <= steps; i++) {
    const xi = i / steps;
    sum += dip(xi, loadXi) * towerTaper(xi) * (i === 0 || i === steps ? 0.5 : 1);
  }
  cachedLoad = loadXi;
  cachedMean = sum / steps;
  return cachedMean;
}

/**
 * Vertical movement at station x for a point load at station X.
 * Negative is down. `amplitude` is the dip directly under a midspan load.
 */
export function deflection(x, X, amplitude = 1) {
  if (!amplitude) return 0;
  const loadXi = clamp01((X + G.L) / (2 * G.L));
  const effect = loadEffect(loadXi);

  // Side spans: a slight lift, larger on the side nearer the load.
  if (Math.abs(x) >= G.L) {
    const s = clamp01((Math.abs(x) - G.L) / G.side);
    const nearness = x < 0 ? 1 - loadXi : loadXi;
    return amplitude * SIDE_LIFT * effect * (0.45 + 0.55 * nearness) * Math.sin(Math.PI * s);
  }

  // Main span: the dip, less the rise the stiff cable forces elsewhere.
  const xi = (x + G.L) / (2 * G.L);
  const down = dip(xi, loadXi) * towerTaper(xi);
  // The rise is a half sine wave pushed toward the half of the span away from the load.
  const away = 1 + 0.9 * (loadXi < 0.5 ? xi - 0.5 : 0.5 - xi) * Math.min(1, Math.abs(loadXi - 0.5) * 4);
  const riseShape = Math.sin(Math.PI * xi) * away; // its average over the span is 2 / π
  const up = CABLE_STIFFNESS * meanDip(loadXi) * (Math.PI / 2) * riseShape;
  return -amplitude * effect * (down - up);
}

/* ── Geometry ─────────────────────────────────────────────────────────────
 *
 * Each list is a flat run of numbers: x, y, z for one end of a segment, then
 * x, y, z for the other end. The matching `dyn` list says, point by point,
 * whether that point rides up and down with the deck (true) or stays put
 * (false): towers and anchorages do not move.
 */
function segment(list, dyn, a, b, moveA = false, moveB = moveA) {
  list.push(a[0], a[1], a[2], b[0], b[1], b[2]);
  dyn.push(moveA, moveB);
}

export function buildBridge() {
  const strong = []; // heavy ink: deck chords, towers, backstays
  const dynStrong = [];
  const light = []; // light ink: suspenders, floor beams, truss web, bracing
  const dynLight = [];
  const faint = []; // faintest ink: ground line and foundations
  const cables = []; // the two gold main cables, as lists of [x, y, z] points
  const joints = []; // gold dots where the suspenders meet the cable

  const { L, side, towerTop, towerBase, deckY, halfWidth: w, trussDepth, panels, sidePanels } = G;
  const end = L + side;
  const low = deckY - trussDepth;
  const planes = [-w, w];

  // Stations: every panel point from one anchorage to the other.
  const mainStep = (2 * L) / panels;
  const sideStep = side / sidePanels;
  const stations = [];
  for (let i = 0; i <= sidePanels; i++) stations.push(-end + i * sideStep);
  for (let i = 1; i <= panels; i++) stations.push(-L + i * mainStep);
  for (let i = 1; i <= sidePanels; i++) stations.push(L + i * sideStep);
  const fixed = (x) => Math.abs(Math.abs(x) - L) < 1e-6 || Math.abs(Math.abs(x) - end) < 1e-6;

  // ── Deck and stiffening truss ──────────────────────────────────────────
  for (let i = 0; i < stations.length - 1; i++) {
    const a = stations[i];
    const b = stations[i + 1];
    const ma = !fixed(a);
    const mb = !fixed(b);
    for (const z of planes) {
      segment(strong, dynStrong, [a, deckY, z], [b, deckY, z], ma, mb); // top chord
      segment(strong, dynStrong, [a, low, z], [b, low, z], ma, mb); // bottom chord
      // Truss web: a Warren pattern, alternating panel by panel.
      if (i % 2 === 0) segment(light, dynLight, [a, low, z], [b, deckY, z], ma, mb);
      else segment(light, dynLight, [a, deckY, z], [b, low, z], ma, mb);
    }
  }
  for (const x of stations) {
    const m = !fixed(x);
    segment(light, dynLight, [x, deckY, -w], [x, deckY, w], m); // floor beam
    for (const z of planes) segment(light, dynLight, [x, deckY, z], [x, low, z], m); // truss vertical
  }

  // ── Towers ─────────────────────────────────────────────────────────────
  for (const x of [-L, L]) {
    for (const z of planes) segment(strong, dynStrong, [x, towerBase, z], [x, towerTop + 2.2, z]);
    // Portal struts: at the top, below the saddles, and under the deck.
    for (const y of [towerTop + 2.2, towerTop - 5, low - 1.2]) segment(strong, dynStrong, [x, y, -w], [x, y, w]);
    // Cross bracing between the upper struts, and between deck and foundation.
    segment(light, dynLight, [x, towerTop + 2.2, -w], [x, towerTop - 5, w]);
    segment(light, dynLight, [x, towerTop + 2.2, w], [x, towerTop - 5, -w]);
    segment(light, dynLight, [x, low - 1.2, -w], [x, towerBase, w]);
    segment(light, dynLight, [x, low - 1.2, w], [x, towerBase, -w]);
  }

  // ── Main cables, suspenders and backstays ──────────────────────────────
  for (const z of planes) {
    const points = [];
    for (let i = 0; i <= panels; i++) {
      const x = -L + i * mainStep;
      points.push([x, cableY(x), z]);
      if (i > 0 && i < panels) {
        segment(light, dynLight, [x, cableY(x), z], [x, deckY, z], true); // suspender
        joints.push(x, cableY(x), z);
      }
    }
    cables.push(points);
    // Backstays run straight from the tower top down to the anchorage.
    segment(strong, dynStrong, [-end, deckY, z], [-L, towerTop, z]);
    segment(strong, dynStrong, [L, towerTop, z], [end, deckY, z]);
  }

  // ── Anchorages, foundations and the ground line ────────────────────────
  for (const x of [-end, end]) {
    const out = Math.sign(x) * 5;
    for (const z of planes) {
      segment(strong, dynStrong, [x, deckY, z], [x, towerBase, z]);
      segment(strong, dynStrong, [x, deckY, z], [x + out, deckY, z]);
      segment(strong, dynStrong, [x + out, deckY, z], [x + out, towerBase, z]);
    }
    segment(light, dynLight, [x, deckY, -w], [x, deckY, w]);
    segment(light, dynLight, [x + out, deckY, -w], [x + out, deckY, w]);
  }
  const ground = towerBase;
  segment(faint, [], [-end - 30, ground, 0], [end + 30, ground, 0]);
  segment(faint, [], [-end - 22, ground, -w - 6], [end + 22, ground, -w - 6]);
  segment(faint, [], [-end - 22, ground, w + 6], [end + 22, ground, w + 6]);
  for (const x of [-L, L]) {
    segment(faint, [], [x - 4, ground, -w - 2.5], [x + 4, ground, -w - 2.5]);
    segment(faint, [], [x - 4, ground, w + 2.5], [x + 4, ground, w + 2.5]);
    segment(faint, [], [x - 4, ground, -w - 2.5], [x - 4, ground, w + 2.5]);
    segment(faint, [], [x + 4, ground, -w - 2.5], [x + 4, ground, w + 2.5]);
  }

  return { strong, dynStrong, light, dynLight, faint, cables, joints };
}
