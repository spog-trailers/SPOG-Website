/**
 * Cargo configurator data: options, SAMPLE pricing, rules and run-time math.
 *
 * THE OPTIONS ARE REAL. They come from SPOG's "Trailer Customization Options" sheet
 * (SPOG-D-0001, Release 1, Nov 17 2026) and the exterior color list Nate sent on 2026-11-18.
 * Labels and the short descriptions marked SHEET are the sheet's own words.
 *
 * THE PRICES ARE NOT. The sheet has no prices ("pricing ... confirmed in writing by SPOG").
 * The only real number is "From $10,000" for the Cargo (Nate, 2026-11-18). Every other price
 * here is a SAMPLE so the running total works, and so are the paint hex values (matched by eye
 * to the color names), panel and tool wattages, the delivery fee and the deposit.
 * Never reuse these numbers on the live site.
 *
 * Left off because the sheet doesn't offer them: trim and wheel choices, a ramp door, wall and
 * floor finishes, and a choice of solar panel count (roof solar is standard on every trailer).
 * The side window, storage hatch, spare and roof vent stay on the model as built.
 */
import { maxPanels } from './dims';

export const PANEL_WATTS = 420; // SAMPLE, used only by the run-time estimate
export const DEPOSIT = 500;
export const DELIVERY_FEE = 650;

export const SIZES = [
  { ft: 10, name: 'Cargo 10', note: '10 ft, single axle', price: 10000 as number | null, soon: '' }, // price is Nate's "From $10,000"
  { ft: 20, name: 'Cargo 20', note: '20 ft, tandem axle', price: 18500, soon: '' }, // SAMPLE
  { ft: 35, name: 'Cargo 35', note: '35 ft', price: null, soon: 'Estimated availability summer 2027' }, // SHEET
];

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
export const LOGO_PRICE = 250; // SAMPLE, per spot
export const LOGO_PLACEHOLDER = 'Your company';

export const BATTERIES = [
  { id: '5', kwh: 5, price: 0 as number | null },
  { id: '10', kwh: 10, price: 4800 },
  { id: '20', kwh: 20, price: 13400 },
  { id: '40', kwh: 40, price: 26000 },
  { id: 'other', kwh: 0, price: null },
];
export const VOLTS = [
  { id: '120', name: '120 V', price: 0 },
  { id: '208', name: '208 V', price: 1200 },
  { id: '240', name: '240 V', price: 900 },
];
export const SHORE = [
  { id: '30', name: '30 amp', price: 0 },
  { id: '50', name: '50 amp', price: 450 },
  { id: '100', name: '100 amp', price: 1400 },
];

export interface Option { id: string; name: string; desc?: string; price: number; view: string; group: string }

/** Section 4 of the sheet. `desc` is the sheet's wording where it gives one. */
export const INTERIOR: Option[] = [
  { id: 'hvac', group: 'Climate', name: 'Heating and cooling', desc: 'Included on the Workstation. Optional on the Cargo.', price: 3900, view: 'street' },
  { id: 'desk', group: 'Work surfaces and storage', name: 'Office desk', price: 900, view: 'interior' },
  { id: 'bench', group: 'Work surfaces and storage', name: 'Workbench', price: 950, view: 'interior' },
  { id: 'cabinets', group: 'Work surfaces and storage', name: 'Cabinets', price: 700, view: 'interior' },
  { id: 'shelving', group: 'Work surfaces and storage', name: 'Shelving', price: 1600, view: 'interior' },
  { id: 'overhead', group: 'Work surfaces and storage', name: 'Overhead storage', price: 1400, view: 'interior' },
  { id: 'whiteboard', group: 'Fixtures and appliances', name: 'Whiteboard', price: 250, view: 'interior' },
  { id: 'tv', group: 'Fixtures and appliances', name: 'TV or monitor', price: 900, view: 'interior' },
  { id: 'fridge', group: 'Fixtures and appliances', name: 'Refrigerator', price: 650, view: 'interior' },
  { id: 'microwave', group: 'Fixtures and appliances', name: 'Microwave', price: 250, view: 'interior' },
  { id: 'counter', group: 'Fixtures and appliances', name: 'Refreshment counter', desc: 'Coffee and snacks', price: 1100, view: 'interior' },
  { id: 'etrackWalls', group: 'E-track', name: 'E-track on walls', desc: 'Rails for tying down equipment', price: 400, view: 'interior' },
  { id: 'etrackFloor', group: 'E-track', name: 'E-track on floor', desc: 'Rails for tying down equipment', price: 500, view: 'interior' },
];

/** Section 5 of the sheet. */
export const CONNECT: Option[] = [
  { id: 'starlink', group: 'Internet', name: 'Starlink ready', desc: 'Set up for Starlink satellite internet', price: 600, view: 'street' },
  { id: 'cellular', group: 'Internet', name: 'Cellular router', desc: 'Internet through cell towers', price: 450, view: 'top' },
  { id: 'aiCameras', group: 'Security', name: 'AI job site camera system', price: 6500, view: 'street' },
  { id: 'cameras', group: 'Security', name: 'Security cameras', desc: 'Standard cameras without AI features', price: 1800, view: 'rear' },
  { id: 'audio', group: 'Security', name: 'Security audio system', desc: 'Horn and strobe light to warn people away', price: 900, view: 'street' },
];

/** Workbench lengths to pick from. The sheet leaves width and length open. Price is per bench. */
export const BENCH_LENGTHS = [4, 6, 8];
export const BENCH_STEP = 300; // SAMPLE, added per size up
export const MAX_DESKS = 2;
export const MAX_CABINETS = 4;

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
  length: number;
  paint: string;
  logoSpots: string[];
  brandText: string;
  lettering: boolean;
  letteringText: string;
  battery: string;
  batteryOther: number;
  volts: string[];
  shore: string;
  options: string[];
  desks: number;
  benchLength: number;
  cabinets: number;
  tools: string[];
  delivery: 'pickup' | 'delivery';
  zip: string;
}

/** The trailer in Nate's photos: black, 20 ft. Voltage, shore power and battery are starting picks. */
export const DEFAULT_BUILD: BuildState = {
  length: 20,
  paint: 'black',
  logoSpots: [],
  brandText: '',
  lettering: false,
  letteringText: '',
  battery: '10',
  batteryOther: 30,
  volts: ['120'],
  shore: '30',
  options: [],
  desks: 1,
  benchLength: 6,
  cabinets: 2,
  tools: ['miter', 'chargers', 'lights'],
  delivery: 'pickup',
  zip: '',
};

// ---------------------------------------------------------------- rules

export const batteryKwh = (s: BuildState) => (s.battery === 'other' ? Math.max(1, Math.min(200, Math.round(s.batteryOther) || 1)) : Number(s.battery));
export const has = (s: BuildState, id: string) => s.options.includes(id);

/** Pull a build back inside the rules after any change. Returns notes about what changed. */
export function enforceRules(s: BuildState) {
  const notes: string[] = [];
  if (!SIZES.some((z) => z.ft === s.length && !z.soon)) s.length = DEFAULT_BUILD.length;
  if (!PAINTS.some((p) => p.id === s.paint)) s.paint = DEFAULT_BUILD.paint;
  if (!BATTERIES.some((b) => b.id === s.battery)) s.battery = DEFAULT_BUILD.battery;
  if (!SHORE.some((x) => x.id === s.shore)) s.shore = DEFAULT_BUILD.shore;
  s.volts = VOLTS.map((v) => v.id).filter((id) => s.volts.includes(id));
  if (!s.volts.length) {
    s.volts = ['120'];
    notes.push('A trailer needs at least one output voltage, so 120 V stays on.');
  }
  s.desks = Math.max(1, Math.min(MAX_DESKS, Math.round(s.desks) || 1));
  s.cabinets = Math.max(1, Math.min(MAX_CABINETS, Math.round(s.cabinets) || 1));
  if (!BENCH_LENGTHS.includes(s.benchLength)) s.benchLength = DEFAULT_BUILD.benchLength;
  return notes;
}

export const solarPanels = (s: BuildState) => maxPanels(s.length);

// ---------------------------------------------------------------- run-time math (sample)

const SUN_HOURS = 4;
const SOLAR_DERATE = 0.8;
const USABLE = 0.9;
const HVAC_KWH = 4.8;

export function runtime(s: BuildState) {
  const tools = TOOLS.filter((t) => s.tools.includes(t.id));
  const toolKwh = tools.reduce((sum, t) => sum + (t.watts * t.hours) / 1000, 0);
  const load = toolKwh + (has(s, 'hvac') ? HVAC_KWH : 0);
  const battery = batteryKwh(s) * USABLE;
  const solar = ((solarPanels(s) * PANEL_WATTS) / 1000) * SUN_HOURS * SOLAR_DERATE;
  const supply = battery + solar;
  const coverage = load > 0 ? supply / load : 0;
  let headline: string;
  let detail: string;
  if (load === 0) {
    headline = 'Pick your tools';
    detail = 'Choose what runs on a normal day to see how far this build goes.';
  } else if (solar >= load) {
    headline = 'The roof refills what you use';
    detail = `Solar puts back about ${solar.toFixed(1)} kWh on a sunny day against a ${load.toFixed(1)} kWh load.`;
  } else if (coverage >= 1) {
    const days = battery / Math.max(0.1, load - solar);
    headline = `Covers your day, about ${days.toFixed(1)} days between charges`;
    detail = `${load.toFixed(1)} kWh a day of load, ${solar.toFixed(1)} kWh back from the sun.`;
  } else {
    headline = `Covers about ${Math.round(coverage * 100)}% of your day`;
    detail = `Pick a bigger battery or plug in overnight. ${load.toFixed(1)} kWh a day of load.`;
  }
  return { load, battery, solar, coverage: Math.min(1, coverage), headline, detail };
}

// ---------------------------------------------------------------- pricing (sample)

/** A null price is quoted by SPOG and left out of the running total. */
export interface Line { label: string; price: number | null }

const pick = <T extends { id: string }>(list: readonly T[], id: string) => list.find((x) => x.id === id) ?? list[0];

export function optionPrice(s: BuildState, o: Option) {
  if (o.id === 'desk') return o.price * s.desks;
  if (o.id === 'cabinets') return o.price * s.cabinets;
  if (o.id === 'bench') return o.price + BENCH_LENGTHS.indexOf(s.benchLength) * BENCH_STEP;
  return o.price;
}

export function optionLabel(s: BuildState, o: Option) {
  if (o.id === 'desk') return s.desks > 1 ? `${s.desks} office desks` : 'Office desk';
  if (o.id === 'cabinets') return `${s.cabinets} cabinet${s.cabinets > 1 ? 's' : ''}`;
  if (o.id === 'bench') return `${s.benchLength} ft workbench`;
  return o.name;
}

export function priceLines(s: BuildState): Line[] {
  const lines: Line[] = [];
  const size = SIZES.find((l) => l.ft === s.length) ?? SIZES[1];
  lines.push({ label: `${size.name}, ${size.ft} ft`, price: size.price });
  lines.push({ label: `${pick(PAINTS, s.paint).name} exterior`, price: 0 });
  lines.push({ label: 'Roof solar', price: 0 });
  const bat = pick(BATTERIES, s.battery);
  lines.push({ label: `${batteryKwh(s)} kWh battery`, price: bat.price });
  VOLTS.filter((v) => s.volts.includes(v.id)).forEach((v) => lines.push({ label: `${v.name} output`, price: v.price }));
  const shore = pick(SHORE, s.shore);
  lines.push({ label: `${shore.name} shore power`, price: shore.price });
  if (s.logoSpots.length) lines.push({ label: `Company logo, ${s.logoSpots.length} spot${s.logoSpots.length > 1 ? 's' : ''}`, price: s.logoSpots.length * LOGO_PRICE });
  if (s.lettering) lines.push({ label: 'Vinyl lettering or numbers', price: null });
  [...INTERIOR, ...CONNECT].filter((o) => has(s, o.id)).forEach((o) => lines.push({ label: optionLabel(s, o), price: optionPrice(s, o) }));
  return lines;
}

export function totals(s: BuildState) {
  const lines = priceLines(s);
  const vehicle = lines.reduce((sum, l) => sum + (l.price ?? 0), 0);
  const delivery = s.delivery === 'delivery' ? DELIVERY_FEE : 0;
  return { lines, vehicle, delivery, total: vehicle + delivery, deposit: DEPOSIT, quoted: lines.some((l) => l.price === null) };
}

export const money = (n: number | null) => (n === null ? 'Quoted' : n === 0 ? 'Included' : `$${n.toLocaleString()}`);
export const moneyTotal = (n: number) => `$${n.toLocaleString()}`;

export function leadTime(s: BuildState) {
  const standard = s.options.length === 0 && s.logoSpots.length === 0 && !s.lettering && s.battery !== 'other';
  return standard ? 'About 2 weeks' : '4 to 6 weeks';
}

export function summaryLine(s: BuildState) {
  const extras = s.options.length + (s.logoSpots.length ? 1 : 0) + (s.lettering ? 1 : 0);
  return [`${s.length} ft`, pick(PAINTS, s.paint).name, `${batteryKwh(s)} kWh`, `${s.volts.join('/')} V`, `${s.shore} amp`, extras ? `${extras} option${extras > 1 ? 's' : ''}` : ''].filter(Boolean).join(' · ');
}

/** Short shareable code for the confirmation screen. */
export function buildCode(s: BuildState) {
  const raw = JSON.stringify({ ...s, zip: '' });
  let h = 0;
  for (let i = 0; i < raw.length; i++) h = (h * 31 + raw.charCodeAt(i)) >>> 0;
  return `SPOG-C${s.length}-${h.toString(36).toUpperCase().slice(0, 5)}`;
}

export function toTrailerConfig(s: BuildState, view: { doorsOpen: boolean; logoAspect: number }) {
  const paint = pick(PAINTS, s.paint);
  return {
    length: s.length,
    paint: paint.hex,
    paintDark: paint.dark,
    matte: paint.matte,
    batteryModules: Math.max(1, Math.min(8, Math.round(batteryKwh(s) / 5))),
    doorsOpen: view.doorsOpen,
    logoSpots: [...s.logoSpots].sort().join(','),
    brand: s.logoSpots.length ? s.brandText.trim() || LOGO_PLACEHOLDER : '',
    logoAspect: view.logoAspect,
    hvac: has(s, 'hvac'),
    desks: has(s, 'desk') ? s.desks : 0,
    benchLength: has(s, 'bench') ? s.benchLength : 0,
    cabinets: has(s, 'cabinets') ? s.cabinets : 0,
    shelving: has(s, 'shelving'),
    overhead: has(s, 'overhead'),
    whiteboard: has(s, 'whiteboard'),
    tv: has(s, 'tv'),
    fridge: has(s, 'fridge'),
    microwave: has(s, 'microwave'),
    counter: has(s, 'counter'),
    etrackWalls: has(s, 'etrackWalls'),
    etrackFloor: has(s, 'etrackFloor'),
    starlink: has(s, 'starlink'),
    cellular: has(s, 'cellular'),
    mast: has(s, 'aiCameras'),
    cameras: has(s, 'cameras'),
    audio: has(s, 'audio'),
  };
}
