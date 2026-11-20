/**
 * Cargo configurator data: options, prices, rules and run-time math.
 *
 * THE OPTIONS ARE REAL. They come from SPOG's "Trailer Customization Options" sheet
 * (SPOG-D-0001, Release 1, Nov 17 2026), the exterior color list Nate sent on 2026-11-18, and
 * SPOG's external price sheet of 2026-11-20 with Nate's answers to questions about it.
 *
 * THE PRICES ARE REAL (SOURCE price sheet 2026-11-20, which Nate approved for the site). A base
 * price is the trailer with everything on its Included list. Prices exclude tax, title,
 * registration and delivery. Options SPOG still offers that the sheet doesn't price (shore power,
 * workbench, extra desks, fixtures, E-track, cellular router, logo and lettering, delivery) show as
 * "Quoted" and stay out of the running total. Never invent a price for them.
 *
 * Still estimates or open to confirm (NEW 2026-11-20): the paint hex values (matched by eye), the
 * run-time assumptions (tool wattages and hours, the climate control draw, sun hours, solar derate
 * and usable battery share), the workbench lengths and the two-desk limit (CONFIRM with Alessandro).
 * There is no build time or lead time here on purpose: no source gives one (removed 2026-11-20).
 *
 * Removed on 2026-11-20 (NATE): the 35 ft Cargo, shelving, cabinets and overhead storage, 240 V,
 * the 40 kWh and "other" battery, the AI camera system, separate security cameras and the horn and
 * strobe audio system, plus the SAMPLE delivery fee and deposit. Left off because the sheets don't
 * offer them: trim and wheel choices, a ramp door, wall and floor finishes, and a choice of solar
 * panel count. Windows stay on the model as built (Nate: the sheet's "no windows" is wrong).
 */
import type { TrailerConfig } from './trailer';

/**
 * The two Cargo sizes (SOURCE price sheet 2026-11-20). Every model is dual axle. Battery, solar,
 * inverter, voltage and outlet counts are the sheet's per size. Max battery is 20 kWh on both.
 */
export const SIZES = [
  { ft: 10, name: 'Cargo 10', note: '10 ft, dual axle, 7,000 lbs max loaded weight', price: 15000, baseKwh: 5, solarW: 900, inverterW: 3000, volts: ['120'], outletsOut: 3, outletsIn: 5 }, // SOURCE price sheet 2026-11-20
  { ft: 20, name: 'Cargo 20', note: '20 ft, dual axle, 9,500 lbs max loaded weight', price: 50000, baseKwh: 10, solarW: 2800, inverterW: 6000, volts: ['120', '208'], outletsOut: 3, outletsIn: 5 }, // SOURCE price sheet 2026-11-20
];
export type Size = (typeof SIZES)[number];
export const sizeOf = (length: number): Size => SIZES.find((z) => z.ft === length) ?? SIZES[SIZES.length - 1];

/** Exterior colors, in the order Nate sent them. Hex values are matched by eye to the names. */
export const PAINTS = [
  { id: 'white', name: 'White', hex: '#e9e9e6', dark: false, matte: false },
  { id: 'black', name: 'Black', hex: '#141416', dark: true, matte: false },
  { id: 'charcoal', name: 'Charcoal Grey', hex: '#3b3e43', dark: true, matte: false },
  { id: 'silver', name: 'Silver', hex: '#b3b7bc', dark: false, matte: false },
  { id: 'red', name: 'Red', hex: '#a5161b', dark: true, matte: false },
  { id: 'pewter', name: 'Pewter', hex: '#8b887f', dark: true, matte: false },
  { id: 'indigo', name: 'Indigo Blue', hex: '#1c2847', dark: true, matte: false },
  { id: 'matte-black', name: 'Matte Black', hex: '#1b1b1d', dark: true, matte: true },
  { id: 'dove', name: 'Dove Grey', hex: '#c3c4c1', dark: false, matte: false },
  { id: 'yellow', name: 'Yellow', hex: '#e2b317', dark: false, matte: false },
  { id: 'brandywine', name: 'Brandywine', hex: '#5a1522', dark: true, matte: false },
  { id: 'blue', name: 'Blue', hex: '#1d4f9f', dark: true, matte: false },
];

/** Where the buyer's logo goes (SHEET). Left is the street side, right is the curb side. */
export const LOGO_SPOTS = [
  { id: 'noseLeft', name: 'Nose left', view: 'street' },
  { id: 'noseRight', name: 'Nose right', view: 'front' },
  { id: 'left', name: 'Left side', view: 'street' },
  { id: 'right', name: 'Right side', view: 'side' },
  { id: 'rear', name: 'Rear', view: 'rear' },
];
export const LOGO_PRICE: number | null = null; // NATE (2026-11-20 answers): still offered, not on the price sheet, so quoted
export const LOGO_PLACEHOLDER = 'Your company';

/** Battery: 5 kWh steps from the size's base up to 20 kWh, $2,500 per 5 kWh above the base. SOURCE price sheet 2026-11-20 */
export const BATTERY_STEP = 5;
export const BATTERY_MAX = 20;
export const BATTERY_STEP_PRICE = 2500;
export const BATTERIES = [5, 10, 15, 20].map((kwh) => ({ id: String(kwh), kwh }));

/** Shore power stays available (NATE 2026-11-20) but isn't on the price sheet, so it's quoted. */
export const SHORE = [
  { id: '30', name: '30 amp', price: null as number | null },
  { id: '50', name: '50 amp', price: null as number | null },
  { id: '100', name: '100 amp', price: null as number | null },
];

/**
 * An option. `price` is the sheet's price, or null when SPOG quotes it. `bySize` overrides the
 * price per trailer length. `only` limits the option to one length.
 */
export interface Option { id: string; name: string; desc?: string; price: number | null; bySize?: Record<number, number>; only?: number; view: string; group: string }

/** Interior. The built-in front corner work desk is standard on every Cargo (SOURCE price sheet 2026-11-20). */
export const INTERIOR: Option[] = [
  { id: 'hvac', group: 'Climate', name: 'Climate control', desc: 'Heating and cooling keep the crew comfortable inside.', price: 3500, bySize: { 10: 3500, 20: 5000 }, view: 'street' }, // SOURCE price sheet 2026-11-20 (prices); NEW 2026-11-20 (desc)
  { id: 'extraDesk', group: 'Work surfaces', name: 'Extra desk', desc: 'Add one or two desks beside the battery units.', price: null, view: 'interior' }, // CONFIRM (Alessandro on the 2026-11-20 call: a desk can go on either side of the battery platform). Not on the price sheet, quoted
  { id: 'bench', group: 'Work surfaces', name: 'Workbench', price: null, view: 'interior' }, // NATE (2026-11-20 answers): still offered, quoted
  { id: 'whiteboard', group: 'Fixtures and appliances', name: 'Whiteboard', price: null, view: 'interior' }, // quoted
  { id: 'tv', group: 'Fixtures and appliances', name: 'TV or monitor', price: null, view: 'interior' }, // quoted
  { id: 'fridge', group: 'Fixtures and appliances', name: 'Refrigerator', price: null, view: 'interior' }, // quoted
  { id: 'microwave', group: 'Fixtures and appliances', name: 'Microwave', price: null, view: 'interior' }, // quoted
  { id: 'counter', group: 'Fixtures and appliances', name: 'Refreshment counter', desc: 'Coffee and snacks', price: null, view: 'interior' }, // quoted
  { id: 'etrackWalls', group: 'E-track', name: 'E-track on walls', desc: 'Rails for tying down equipment', price: null, view: 'interior' }, // quoted
  { id: 'etrackFloor', group: 'E-track', name: 'E-track on floor', desc: 'Rails for tying down equipment', price: null, view: 'interior' }, // quoted
];

/** Connectivity and security. SOURCE price sheet 2026-11-20 and NATE (2026-11-20 answers). */
export const CONNECT: Option[] = [
  { id: 'starlink', group: 'Internet', name: 'Starlink', desc: 'The price covers the dish and the install. You set up your own Starlink plan.', price: 850, view: 'street' }, // SOURCE price sheet (Workstation table), NATE: Starlink can go on Cargo
  { id: 'cellular', group: 'Internet', name: 'Cellular router', desc: 'Internet through cell towers', price: null, view: 'top' }, // quoted
  { id: 'light6', group: 'Security', name: '6 ft telescopic light', desc: 'Lights up the lot at night and lets the crew keep working after the sun goes down.', price: 3000, view: 'street' }, // SOURCE price sheet, NATE: a light only, no camera
  { id: 'tower', group: 'Security', name: '28 ft light tower', desc: 'A 28 ft tower with a security camera, a light and a horn.', price: 13300, only: 20, view: 'street' }, // SOURCE price sheet, NATE: AI or regular camera, same price, 20 ft only
];

/** The camera on the 28 ft tower. Same price either way (NATE 2026-11-20). */
export const TOWER_CAMERAS = [
  { id: 'ai', name: 'AI camera' },
  { id: 'regular', name: 'Regular camera' },
];

/** Workbench lengths to pick from. The sheet leaves width and length open. */
export const BENCH_LENGTHS = [4, 6, 8];
/** Extra desks beyond the standard one. CONFIRM: "two desks" on the 2026-11-20 call, one on either side of the batteries. */
export const MAX_DESKS = 2;

export const TOOLS = [
  { id: 'miter', name: 'Miter saw', watts: 1800, hours: 1.5 },
  { id: 'table', name: 'Table saw', watts: 1800, hours: 1 },
  { id: 'compressor', name: 'Air compressor', watts: 1500, hours: 2 },
  { id: 'chargers', name: 'Battery chargers (4)', watts: 600, hours: 6 },
  { id: 'lights', name: 'Work lights', watts: 400, hours: 8 },
  { id: 'heater', name: 'Space heater', watts: 1500, hours: 4 },
  { id: 'office', name: 'Laptop and printer', watts: 250, hours: 8 },
];

export interface BuildState {
  /** Which trailer. Missing means the Cargo, so old Cargo links still work. */
  kind?: 'cargo' | 'workstation';
  /** Workstation interior. Premium wood is a free choice on the 20 ft only (SOURCE price sheet 2026-11-20). */
  interior?: 'composite' | 'wood';
  length: number;
  paint: string;
  logoSpots: string[];
  brandText: string;
  lettering: boolean;
  letteringText: string;
  battery: string;
  shore: string;
  options: string[];
  /** Extra desks beyond the standard built-in desk, used when 'extraDesk' is checked. */
  desks: number;
  benchLength: number;
  towerCamera: string;
  tools: string[];
  delivery: 'pickup' | 'delivery';
  zip: string;
}

/** The trailer in Nate's photos: black, 20 ft. The battery starts at the 20 ft's base. Shore power is a starting pick. */
export const DEFAULT_BUILD: BuildState = {
  length: 20,
  paint: 'black',
  logoSpots: [],
  brandText: '',
  lettering: false,
  letteringText: '',
  battery: '10',
  shore: '30',
  options: [],
  desks: 1,
  benchLength: 6,
  towerCamera: 'ai',
  tools: ['miter', 'chargers', 'lights'],
  delivery: 'pickup',
  zip: '',
};

// ---------------------------------------------------------------- rules

export const batteryKwh = (s: BuildState) => Number(s.battery);
export const has = (s: BuildState, id: string) => s.options.includes(id);
/** True when an option can go on this length. */
export const fits = (s: BuildState, o: Option) => !o.only || o.only === s.length;

/** Pull a build back inside the rules after any change. Returns notes about what changed. */
export function enforceRules(s: BuildState) {
  const notes: string[] = [];
  if (!SIZES.some((z) => z.ft === s.length)) s.length = DEFAULT_BUILD.length;
  const size = sizeOf(s.length);
  if (!PAINTS.some((p) => p.id === s.paint)) s.paint = DEFAULT_BUILD.paint;
  if (!SHORE.some((x) => x.id === s.shore)) s.shore = DEFAULT_BUILD.shore;
  if (!TOWER_CAMERAS.some((c) => c.id === s.towerCamera)) s.towerCamera = DEFAULT_BUILD.towerCamera;

  // Battery: 5 kWh steps between the size's base and 20 kWh. Old links with 40 kWh or "other" land on the nearest step.
  const raw = Number(s.battery);
  const stepped = Number.isFinite(raw) && raw > 0 ? Math.round(raw / BATTERY_STEP) * BATTERY_STEP : size.baseKwh;
  const kwh = Math.max(size.baseKwh, Math.min(BATTERY_MAX, stepped));
  if (Number.isFinite(raw) && raw > 0 && raw < size.baseKwh) notes.push(`The ${size.ft} ft comes with ${size.baseKwh} kWh, so the battery moved up to ${size.baseKwh} kWh.`);
  s.battery = String(kwh);

  // Options that only fit one length come off when the length changes.
  const dropped = [...INTERIOR, ...CONNECT].filter((o) => has(s, o.id) && !fits(s, o));
  if (dropped.length) {
    s.options = s.options.filter((id) => !dropped.some((o) => o.id === id));
    dropped.forEach((o) => notes.push(`The ${o.name} is for the ${o.only} ft only, so it came off this build.`));
  }

  s.desks = Math.max(1, Math.min(MAX_DESKS, Math.round(s.desks) || 1));
  if (!BENCH_LENGTHS.includes(s.benchLength)) s.benchLength = DEFAULT_BUILD.benchLength;
  return notes;
}

/** Price of the battery above the size's included base. */
export const batteryPrice = (s: BuildState) => ((batteryKwh(s) - sizeOf(s.length).baseKwh) / BATTERY_STEP) * BATTERY_STEP_PRICE;

/** Output voltage is set by the length, not picked (SOURCE price sheet 2026-11-20). */
export const voltsLabel = (s: BuildState) => sizeOf(s.length).volts.map((v) => `${v} V`).join(' and ');

// ---------------------------------------------------------------- run-time math (estimate)

const SUN_HOURS = 4;
const SOLAR_DERATE = 0.8;
const USABLE = 0.9;
const HVAC_KWH = 4.8; // estimate

export function runtime(s: BuildState) {
  const tools = TOOLS.filter((t) => s.tools.includes(t.id));
  const toolKwh = tools.reduce((sum, t) => sum + (t.watts * t.hours) / 1000, 0);
  const load = toolKwh + (has(s, 'hvac') ? HVAC_KWH : 0);
  const battery = batteryKwh(s) * USABLE;
  const solar = (sizeOf(s.length).solarW / 1000) * SUN_HOURS * SOLAR_DERATE; // SOURCE price sheet roof solar watts
  const supply = battery + solar;
  const coverage = load > 0 ? supply / load : 0;
  let headline: string;
  let detail: string;
  if (load === 0) {
    headline = 'Pick your tools';
    detail = 'Choose what runs on a normal day to see how far this build goes.';
  } else if (solar >= load) {
    // NEW (2026-11-20: no off-grid run-time claims). CONFIRM wording with Nate.
    headline = 'The battery and roof solar cover this load in our estimate';
    detail = `Solar puts back about ${solar.toFixed(1)} kWh on a sunny day against a ${load.toFixed(1)} kWh load.`;
  } else if (coverage >= 1) {
    // NEW (2026-11-20: no off-grid run-time claims, no days-between-charges number). CONFIRM wording with Nate.
    // Coverage counts the roof's estimate too, so name it unless the battery covers the load by itself.
    headline = battery >= load
      ? 'The battery covers this day in our estimate'
      : 'The battery and roof solar cover this day in our estimate';
    detail = `${load.toFixed(1)} kWh a day of load, ${solar.toFixed(1)} kWh back from the sun.`;
  } else {
    headline = `Covers about ${Math.round(coverage * 100)}% of your day`;
    detail = `Pick a bigger battery or plug in overnight. ${load.toFixed(1)} kWh a day of load.`;
  }
  return { load, battery, solar, coverage: Math.min(1, coverage), headline, detail };
}

// ---------------------------------------------------------------- pricing (SOURCE price sheet 2026-11-20)

/** A null price is quoted by SPOG and left out of the running total. */
export interface Line { label: string; price: number | null }

const pick = <T extends { id: string }>(list: readonly T[], id: string) => list.find((x) => x.id === id) ?? list[0];

export function optionPrice(s: BuildState, o: Option): number | null {
  if (o.bySize) return o.bySize[s.length] ?? o.price;
  return o.price;
}

export function optionLabel(s: BuildState, o: Option) {
  if (o.id === 'extraDesk') return s.desks > 1 ? `${s.desks} extra desks` : 'Extra desk';
  if (o.id === 'bench') return `${s.benchLength} ft workbench`;
  if (o.id === 'tower') return `28 ft light tower, ${pick(TOWER_CAMERAS, s.towerCamera).name.toLowerCase()}`;
  return o.name;
}

export function priceLines(s: BuildState): Line[] {
  const lines: Line[] = [];
  const size = sizeOf(s.length);
  lines.push({ label: `${size.name}, dual axle`, price: size.price }); // SOURCE price sheet 2026-11-20
  lines.push({ label: `${pick(PAINTS, s.paint).name} exterior`, price: 0 });
  lines.push({ label: `Roof solar, ${size.solarW.toLocaleString()} W`, price: 0 });
  lines.push({ label: `${batteryKwh(s)} kWh battery`, price: batteryPrice(s) });
  lines.push({ label: 'Built-in corner work desk', price: 0 });
  lines.push({ label: `${pick(SHORE, s.shore).name} shore power`, price: pick(SHORE, s.shore).price });
  if (s.logoSpots.length) lines.push({ label: `Company logo, ${s.logoSpots.length} spot${s.logoSpots.length > 1 ? 's' : ''}`, price: LOGO_PRICE });
  if (s.lettering) lines.push({ label: 'Vinyl lettering or numbers', price: null });
  [...INTERIOR, ...CONNECT].filter((o) => has(s, o.id) && fits(s, o)).forEach((o) => lines.push({ label: optionLabel(s, o), price: optionPrice(s, o) }));
  return lines;
}

/** The running total holds only priced lines. Tax, title, registration and delivery are extra. */
export function totals(s: BuildState) {
  const lines = priceLines(s);
  const vehicle = lines.reduce((sum, l) => sum + (l.price ?? 0), 0);
  return { lines, vehicle, quoted: lines.some((l) => l.price === null) };
}

export const money = (n: number | null) => (n === null ? 'Quoted' : n === 0 ? 'Included' : `$${n.toLocaleString()}`);
export const moneyTotal = (n: number) => `$${n.toLocaleString()}`;

export function summaryLine(s: BuildState) {
  const extras = s.options.length + (s.logoSpots.length ? 1 : 0) + (s.lettering ? 1 : 0);
  return [`${s.length} ft`, pick(PAINTS, s.paint).name, `${batteryKwh(s)} kWh`, sizeOf(s.length).volts.join('/') + ' V', `${s.shore} amp`, extras ? `${extras} option${extras > 1 ? 's' : ''}` : ''].filter(Boolean).join(' · ');
}

/** Short shareable code for the confirmation screen. */
export function buildCode(s: BuildState) {
  const raw = JSON.stringify({ ...s, zip: '' });
  let h = 0;
  for (let i = 0; i < raw.length; i++) h = (h * 31 + raw.charCodeAt(i)) >>> 0;
  return `SPOG-C${s.length}-${h.toString(36).toUpperCase().slice(0, 5)}`;
}

/** What the 3D model draws. `desks` is the EXTRA desks; the standard corner desk is always on the model. */
export function toTrailerConfig(s: BuildState, view: { doorsOpen: boolean; logoAspect: number }): TrailerConfig {
  const paint = pick(PAINTS, s.paint);
  const kind = s.kind === 'workstation' ? 'workstation' : 'cargo';
  return {
    kind,
    interior: kind === 'workstation' && s.length === 20 && s.interior === 'wood' ? 'wood' : 'composite',
    length: s.length,
    paint: paint.hex,
    paintDark: paint.dark,
    matte: paint.matte,
    batteryModules: Math.max(1, Math.min(BATTERY_MAX / BATTERY_STEP, Math.round(batteryKwh(s) / BATTERY_STEP))),
    doorsOpen: view.doorsOpen,
    logoSpots: [...s.logoSpots].sort().join(','),
    brand: s.logoSpots.length ? s.brandText.trim() || LOGO_PLACEHOLDER : '',
    logoAspect: view.logoAspect,
    hvac: kind === 'workstation' || has(s, 'hvac'), // SOURCE (price sheet 2026-11-20): heating and cooling is included on every Workstation
    desks: has(s, 'extraDesk') ? s.desks : 0,
    benchLength: has(s, 'bench') ? s.benchLength : 0,
    whiteboard: has(s, 'whiteboard'),
    tv: has(s, 'tv'),
    fridge: has(s, 'fridge'),
    microwave: has(s, 'microwave'),
    counter: has(s, 'counter'),
    etrackWalls: has(s, 'etrackWalls'),
    etrackFloor: has(s, 'etrackFloor'),
    starlink: has(s, 'starlink'),
    cellular: has(s, 'cellular'),
    light6: has(s, 'light6'),
    tower: has(s, 'tower') && s.length === 20,
  };
}
