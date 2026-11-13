export const G = { L: 74, towerY: 34, cableSag: 16, deckY: 0, sideSpan: 26 };

function addSegment(lines, dynamic, a, b, moves = false) {
  lines.push(...a, ...b);
  dynamic.push(moves, moves);
}

function curveY(x) {
  const t = Math.max(-1, Math.min(1, x / G.L));
  return G.towerY - G.cableSag * (1 - t * t);
}

export function deflection(x, loadX, amplitude) {
  const distance = Math.abs(x - loadX) / (G.L * 0.58);
  const influence = Math.max(0, 1 - distance);
  return -amplitude * Math.sin((Math.PI * influence) / 2);
}

export function buildBridge() {
  const strong = [];
  const dynStrong = [];
  const light = [];
  const dynLight = [];
  const faint = [];
  const cables = [];
  const joints = [];
  const deck = G.deckY;
  const towers = [-G.L, G.L];
  const cableXs = Array.from({ length: 49 }, (_, i) => -G.L + (2 * G.L * i) / 48);

  // Main deck and side spans.
  addSegment(strong, dynStrong, [-G.L - G.sideSpan, deck, 0], [G.L + G.sideSpan, deck, 0], true);
  addSegment(strong, dynStrong, [-G.L - G.sideSpan, deck - 2.4, -5], [G.L + G.sideSpan, deck - 2.4, -5], true);
  addSegment(strong, dynStrong, [-G.L - G.sideSpan, deck - 2.4, 5], [G.L + G.sideSpan, deck - 2.4, 5], true);

  // Towers, cross beams, and short tower caps.
  for (const x of towers) {
    for (const z of [-5, 5]) {
      addSegment(strong, dynStrong, [x, deck - 2, z], [x, G.towerY + 5, z], false);
    }
    addSegment(strong, dynStrong, [x, G.towerY, -7], [x, G.towerY, 7]);
    addSegment(strong, dynStrong, [x, G.towerY + 5, -7], [x, G.towerY + 5, 7]);
    addSegment(light, dynLight, [x - 1.2, deck - 2, 0], [x - 1.2, G.towerY, 0]);
    addSegment(light, dynLight, [x + 1.2, deck - 2, 0], [x + 1.2, G.towerY, 0]);
  }

  // Floor beams and truss diagonals move with the live load.
  for (let i = 0; i <= 32; i++) {
    const x = -G.L - G.sideSpan + ((2 * (G.L + G.sideSpan)) * i) / 32;
    addSegment(light, dynLight, [x, deck, -5], [x, deck, 5], true);
    addSegment(light, dynLight, [x, deck - 2.4, -5], [x, deck, 0], true);
    addSegment(light, dynLight, [x, deck - 2.4, 5], [x, deck, 0], true);
  }

  // Twin main cables and vertical suspenders.
  for (const z of [-5, 5]) {
    const points = cableXs.map((x) => [x, curveY(x), z]);
    cables.push(points);
    for (let i = 0; i < points.length; i += 3) joints.push(...points[i]);
    for (let i = 3; i < points.length - 1; i += 3) {
      const [x, y] = points[i];
      addSegment(light, dynLight, [x, y, z], [x, deck, z], true);
    }
    addSegment(strong, dynStrong, [-G.L - G.sideSpan, deck, z], [-G.L, G.towerY, z]);
    addSegment(strong, dynStrong, [G.L, G.towerY, z], [G.L + G.sideSpan, deck, z]);
  }

  // Ground and datum lines give the drawing a quiet baseline.
  addSegment(faint, [], [-G.L - G.sideSpan - 12, -8, -8], [G.L + G.sideSpan + 12, -8, -8]);
  for (const x of towers) {
    addSegment(faint, [], [x - 9, -7, -8], [x + 9, -7, -8]);
  }

  return { strong, dynStrong, light, dynLight, faint, cables, joints };
}
