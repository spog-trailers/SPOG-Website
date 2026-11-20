/**
 * Side-elevation line drawing for the "Size it up" section on product pages.
 * A full-size pickup (about 19 ft) drawn beside the trailer for scale, both at the same scale, so the
 * trailer grows as the visitor picks a length. The trailer stands unhitched on its tongue jack, with
 * a gap to the pickup, so the drawing makes no tow claim (2026-11-20). Pure string output so it runs on the server
 * (first paint) and in the browser (length changes).
 *
 * Only the length is real. Heights and panel layout are drawn for looks and are never labeled.
 * Axles: two up to 24 ft, since every Cargo and Workstation is dual axle (price sheet 2026-11-20).
 * The pickup is there for scale only. The site never says what vehicle can tow a SPOG (Nate, 2026-11-20).
 * Units: feet, ground at y = 0, x grows toward the back of the rig.
 */

const TOP = 10.4; // highest point drawn, in feet
const BOTTOM = -2.4; // room under the ground for the dimension line
const S = 10; // svg units per foot
const TRUCK_LEN = 19.3;
const HITCH_X = 20.1; // end of the pickup's receiver
const GAP = 3; // open ground between the pickup and the trailer's coupler, so the two stand apart (2026-11-20)
const TONGUE = 3.8;
const COUPLER_X = TRUCK_LEN + GAP; // front of the trailer's tongue, resting on its jack
export const BOX_X = COUPLER_X + TONGUE; // where the trailer box starts
const FLOOR = 1.5;
const BOX_H = 7.2;

const X = (x: number) => +(x * S).toFixed(1);
const Y = (y: number) => +((TOP - y) * S).toFixed(1);
const P = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${X(x)} ${Y(y)}`).join(' ');

export function viewBox(maxLength: number) {
  const width = BOX_X + maxLength + 2.5;
  return `${X(-1)} 0 ${X(width)} ${((TOP - BOTTOM) * S).toFixed(0)}`;
}

function truck() {
  const r = 1.7;
  const body =
    `${P([[0.3, 1.6], [0, 2.3], [0.15, 3.7], [5.3, 4.15], [7.7, 6.35], [11.5, 6.45], [11.8, 4.3], [19.1, 4.25], [TRUCK_LEN, 4.05], [TRUCK_LEN, 1.6], [17.0, 1.6]])}` +
    ` A${X(r)} ${X(r)} 0 0 0 ${X(13.6)} ${Y(1.6)} L${X(5.0)} ${Y(1.6)}` +
    ` A${X(r)} ${X(r)} 0 0 0 ${X(1.6)} ${Y(1.6)} Z`;
  const glass = `${P([[5.75, 4.35], [7.85, 6.05], [11.25, 6.1], [11.3, 4.35]])} Z M${X(9.4)} ${Y(4.35)} L${X(9.4)} ${Y(6.08)}`;
  const wheels = [3.3, 15.3]
    .map((cx) => `<circle cx="${X(cx)}" cy="${Y(1.38)}" r="${X(1.38)}"/><circle cx="${X(cx)}" cy="${Y(1.38)}" r="${X(0.55)}"/>`)
    .join('');
  const hitch = P([[TRUCK_LEN, 1.75], [HITCH_X, 1.75]]);
  return `<g class="sd-truck"><path d="${body}"/><path d="${glass}"/>${wheels}<path d="${hitch}"/><circle cx="${X(HITCH_X)}" cy="${Y(1.9)}" r="${X(0.18)}"/></g>`;
}

function trailer(L: number) {
  const x0 = BOX_X;
  const x1 = x0 + L;
  const top = FLOOR + BOX_H;
  const rc = 0.6;
  const box =
    `M${X(x0)} ${Y(FLOOR)} L${X(x0)} ${Y(top - rc)} Q${X(x0)} ${Y(top)} ${X(x0 + rc)} ${Y(top)}` +
    ` L${X(x1)} ${Y(top)} L${X(x1)} ${Y(FLOOR)} Z`;
  const nose = P([[x0 + 1.6, FLOOR], [x0 + 1.6, top]]);
  const plate = P([[x0, 3.9], [x0 + 1.6, 3.9]]);
  const rear = P([[x1 - 0.3, FLOOR + 0.3], [x1 - 0.3, top - 0.3]]);
  // Unhitched: the tongue ends on a jack standing on the ground, not on the pickup's ball (2026-11-20).
  const tongue = P([[COUPLER_X, 1.9], [x0, FLOOR + 0.1]]);
  const jx = COUPLER_X + 0.9;
  const jack = `${P([[jx, 2.5], [jx, 0.12]])} ${P([[jx - 0.35, 0.06], [jx + 0.35, 0.06]])}`;

  // running gear
  const axles = L <= 24 ? 2 : 3; // SOURCE (price sheet 2026-11-20): every Cargo and Workstation is dual axle, the 10 ft too
  const spacing = 2.75;
  const center = x0 + L * 0.56;
  const first = center - ((axles - 1) * spacing) / 2;
  const wheelX = Array.from({ length: axles }, (_, i) => first + i * spacing);
  const fa = wheelX[0] - 1.45;
  const fb = wheelX[wheelX.length - 1] + 1.45;
  const fender = `M${X(fa)} ${Y(FLOOR)} L${X(fa)} ${Y(2.6)} Q${X(fa)} ${Y(2.85)} ${X(fa + 0.25)} ${Y(2.85)} L${X(fb - 0.25)} ${Y(2.85)} Q${X(fb)} ${Y(2.85)} ${X(fb)} ${Y(2.6)} L${X(fb)} ${Y(FLOOR)}`;
  const wheels = wheelX
    .map((cx) => `<circle cx="${X(cx)}" cy="${Y(1.15)}" r="${X(1.15)}"/><circle cx="${X(cx)}" cy="${Y(1.15)}" r="${X(0.45)}"/>`)
    .join('');

  // side door behind the nose on 10 ft and up
  const door = L >= 10 ? `<rect x="${X(x0 + 2.3)}" y="${Y(FLOOR + 6.3)}" width="${X(2.6)}" height="${X(6.0)}" rx="2"/>` : '';

  // roof solar
  const panel = 5.4;
  const gap = 0.25;
  const n = Math.max(1, Math.floor((L - 0.8 + gap) / (panel + gap)));
  const run = n * panel + (n - 1) * gap;
  const start = x0 + (L - run) / 2;
  const panels = Array.from({ length: n }, (_, i) =>
    `<rect x="${X(start + i * (panel + gap))}" y="${Y(top + 0.26)}" width="${X(panel)}" height="${X(0.22)}"/>`,
  ).join('');

  return `<g class="sd-trailer"><path d="${tongue}"/><path d="${jack}"/><path d="${box}"/><path d="${nose}"/><path d="${plate}"/><path d="${rear}"/>${door}<path d="${fender}"/>${wheels}</g><g class="sd-solar">${panels}</g>`;
}

function dimension(L: number) {
  const x0 = BOX_X;
  const x1 = x0 + L;
  const y = -1.2;
  return `<g class="sd-dim"><path d="${P([[x0, y], [x1, y]])} M${X(x0)} ${Y(y + 0.5)} L${X(x0)} ${Y(y - 0.5)} M${X(x1)} ${Y(y + 0.5)} L${X(x1)} ${Y(y - 0.5)}"/></g>`;
}

/** Inner markup of the drawing for one trailer length. */
export function drawing(L: number, maxLength: number) {
  const ground = `<path class="sd-ground" d="${P([[-1, 0], [BOX_X + maxLength + 1.5, 0]])}"/>`;
  return ground + truck() + trailer(L) + dimension(L);
}
