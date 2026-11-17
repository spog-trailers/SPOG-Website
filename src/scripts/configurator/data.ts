/**
 * Cargo configurator data: options, SAMPLE pricing, rules and run-time math.
 *
 * Real Cargo limits (from the homepage specs): 8 to 24 ft, 5 to 20 kWh battery, solar up to
 * 3,360W, two-week lead time on standard builds, heat and AC optional, corner desk and racking
 * inside, company branding available. EVERYTHING ELSE here is made up for the demo:
 * prices, color names, tool wattages, delivery fee and deposit. Never reuse these on the live site.
 */
import { roofRows } from './dims';

export const PANEL_WATTS = 420;
export const SOLAR_CAP = 3360;
export const DEPOSIT = 500;
export const DELIVERY_FEE = 650;

export const LENGTHS = [
  { ft: 8, note: 'Single axle, fits a driveway', price: 19900 },
  { ft: 12, note: 'Tandem axle', price: 24900 },
  { ft: 16, note: 'Most popular for crews', price: 30900 },
  { ft: 20, note: 'Room for a full shop', price: 36500 },
  { ft: 24, note: 'Largest Cargo', price: 42900 },
];

export const BATTERIES = [
  { kwh: 5, price: 0, minLength: 8 },
  { kwh: 10, price: 4800, minLength: 8 },
  { kwh: 15, price: 9200, minLength: 12 },
  { kwh: 20, price: 13400, minLength: 12 },
];

export const PANEL_PAIR_PRICE = 1900;
export const WING = { price: 3800, panels: 2, minLength: 12 };

export const PAINTS = [
  { id: 'glacier', name: 'Glacier White', hex: '#e9e9e6', dark: false, price: 0 },
  { id: 'quarry', name: 'Quarry Grey', hex: '#7c7f84', dark: true, price: 900 },
  { id: 'basalt', name: 'Basalt Black', hex: '#1c1d20', dark: true, price: 1400 },
  { id: 'ridgeline', name: 'Ridgeline Green', hex: '#3b4a3a', dark: true, price: 1400 },
  { id: 'signal', name: 'Signal Orange', hex: '#d4571c', dark: true, price: 1800 },
  { id: 'daybreak', name: 'Daybreak Gold', hex: '#d99a1b', dark: false, price: 1800 },
];

export const TRIMS = [
  { id: 'black' as const, name: 'Black trim', swatch: '#141518', price: 0 },
  { id: 'aluminum' as const, name: 'Brushed aluminum trim', swatch: '#c3c6cb', price: 650 },
];

export const EQUIPMENT = [
  { id: 'mast', name: 'Light mast', desc: 'Telescoping LED tower, about 8 ft above the roof.', price: 2400 },
  { id: 'led', name: 'LED edge lighting', desc: 'Warm light along the roofline and skirt.', price: 1100 },
  { id: 'gearRail', name: 'Gear rail', desc: 'Hang cords and tools on the outside wall.', price: 450 },
  { id: 'hvac', name: 'Heat and AC', desc: 'Tongue-mounted heat pump. Adds about 5 kWh a day of load.', price: 3900 },
];

export const INSIDE = [
  { id: 'desk', name: 'Corner desk', desc: 'Fold-down work surface with outlets.', price: 1250 },
  { id: 'racking', name: 'Tool racking', desc: 'Adjustable shelving and bin rails.', price: 1600 },
  { id: 'outlets', name: 'Exterior outlet panel', desc: 'Four 20A outlets on the curb side.', price: 380 },
];

export const BRANDING = { price: 650, placeholder: 'Your company' };

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
  battery: number;
  roofPanels: number;
  wing: boolean;
  paint: string;
  trim: 'black' | 'aluminum';
  equipment: string[];
  inside: string[];
  brandOn: boolean;
  brandText: string;
  tools: string[];
  delivery: 'pickup' | 'delivery';
  zip: string;
}

export const DEFAULT_BUILD: BuildState = {
  length: 16,
  battery: 10,
  roofPanels: 4,
  wing: false,
  paint: 'glacier',
  trim: 'black',
  equipment: ['led'],
  inside: [],
  brandOn: false,
  brandText: '',
  tools: ['miter', 'chargers', 'lights'],
  delivery: 'pickup',
  zip: '',
};

// ---------------------------------------------------------------- rules

export const maxRoofPanels = (length: number) => roofRows(length) * 2;

/** Pull a build back inside the rules after any change. Returns notes about what changed. */
export function enforceRules(s: BuildState) {
  const notes: string[] = [];
  const maxPanels = maxRoofPanels(s.length);
  if (s.roofPanels > maxPanels) {
    s.roofPanels = maxPanels;
    notes.push(`A ${s.length} ft roof fits ${maxPanels} panels, so solar was reduced.`);
  }
  if (s.roofPanels < 2) s.roofPanels = 2;
  if (s.wing && s.length < WING.minLength) {
    s.wing = false;
    notes.push(`The solar wing needs ${WING.minLength} ft or longer, so it was removed.`);
  }
  const bat = BATTERIES.find((b) => b.kwh === s.battery);
  if (bat && s.length < bat.minLength) {
    s.battery = 10;
    notes.push(`${bat.kwh} kWh needs ${bat.minLength} ft or longer, so the battery was set to 10 kWh.`);
  }
  return notes;
}

export const solarWatts = (s: BuildState) => (s.roofPanels + (s.wing ? WING.panels : 0)) * PANEL_WATTS;

// ---------------------------------------------------------------- run-time math (sample)

const SUN_HOURS = 4;
const SOLAR_DERATE = 0.8;
const USABLE = 0.9;
const HVAC_KWH = 4.8;

export function runtime(s: BuildState) {
  const tools = TOOLS.filter((t) => s.tools.includes(t.id));
  const toolKwh = tools.reduce((sum, t) => sum + (t.watts * t.hours) / 1000, 0);
  const load = toolKwh + (s.equipment.includes('hvac') ? HVAC_KWH : 0);
  const battery = s.battery * USABLE;
  const solar = (solarWatts(s) / 1000) * SUN_HOURS * SOLAR_DERATE;
  const supply = battery + solar;
  const coverage = load > 0 ? supply / load : 0;
  let headline: string;
  let detail: string;
  if (load === 0) {
    headline = 'Pick your tools';
    detail = 'Choose what runs on a normal day to see how far this build goes.';
  } else if (solar >= load) {
    headline = 'Runs every day on sun';
    detail = `Solar refills about ${solar.toFixed(1)} kWh a day against a ${load.toFixed(1)} kWh load.`;
  } else if (coverage >= 1) {
    const days = battery / Math.max(0.1, load - solar);
    headline = `Covers your day, about ${days.toFixed(1)} days off the grid`;
    detail = `${load.toFixed(1)} kWh a day of load, ${solar.toFixed(1)} kWh back from the sun.`;
  } else {
    headline = `Covers about ${Math.round(coverage * 100)}% of your day`;
    detail = `Add battery or solar, or plug in overnight. ${load.toFixed(1)} kWh a day of load.`;
  }
  return { load, battery, solar, coverage: Math.min(1, coverage), headline, detail };
}

// ---------------------------------------------------------------- pricing (sample)

export interface Line { label: string; price: number }

export function priceLines(s: BuildState): Line[] {
  const lines: Line[] = [];
  const len = LENGTHS.find((l) => l.ft === s.length)!;
  lines.push({ label: `Cargo ${s.length} ft`, price: len.price });
  const bat = BATTERIES.find((b) => b.kwh === s.battery)!;
  lines.push({ label: `${bat.kwh} kWh battery`, price: bat.price });
  const extraPairs = Math.max(0, s.roofPanels - 2) / 2;
  lines.push({ label: `${(s.roofPanels * PANEL_WATTS).toLocaleString()}W roof solar`, price: extraPairs * PANEL_PAIR_PRICE });
  if (s.wing) lines.push({ label: 'Solar wing', price: WING.price });
  const paint = PAINTS.find((p) => p.id === s.paint)!;
  lines.push({ label: paint.name, price: paint.price });
  const trim = TRIMS.find((t) => t.id === s.trim)!;
  lines.push({ label: trim.name, price: trim.price });
  EQUIPMENT.filter((e) => s.equipment.includes(e.id)).forEach((e) => lines.push({ label: e.name, price: e.price }));
  INSIDE.filter((e) => s.inside.includes(e.id)).forEach((e) => lines.push({ label: e.name, price: e.price }));
  if (s.brandOn && s.brandText.trim()) lines.push({ label: `Company decal, "${s.brandText.trim()}"`, price: BRANDING.price });
  return lines;
}

export function totals(s: BuildState) {
  const lines = priceLines(s);
  const vehicle = lines.reduce((sum, l) => sum + l.price, 0);
  const delivery = s.delivery === 'delivery' ? DELIVERY_FEE : 0;
  return { lines, vehicle, delivery, total: vehicle + delivery, deposit: DEPOSIT };
}

export const money = (n: number) => (n === 0 ? 'Included' : `$${n.toLocaleString()}`);
export const moneyTotal = (n: number) => `$${n.toLocaleString()}`;

export function leadTime(s: BuildState) {
  const standard = s.paint === 'glacier' && s.trim === 'black' && !s.brandOn && s.inside.length === 0;
  return standard ? 'Ships in about 2 weeks' : 'Ships in about 4 to 6 weeks';
}

export function summaryLine(s: BuildState) {
  const paint = PAINTS.find((p) => p.id === s.paint)!;
  return [`${s.length} ft`, `${s.battery} kWh`, `${solarWatts(s).toLocaleString()}W solar`, paint.name].join(' · ');
}

/** Short shareable code for the confirmation screen. */
export function buildCode(s: BuildState) {
  const raw = JSON.stringify(s);
  let h = 0;
  for (let i = 0; i < raw.length; i++) h = (h * 31 + raw.charCodeAt(i)) >>> 0;
  return `SPOG-C${s.length}-${h.toString(36).toUpperCase().slice(0, 5)}`;
}

export function toTrailerConfig(s: BuildState, view: { wingOpen: boolean; mastUp: boolean }) {
  const paint = PAINTS.find((p) => p.id === s.paint)!;
  return {
    length: s.length,
    paint: paint.hex,
    paintDark: paint.dark,
    trim: s.trim,
    roofPanels: s.roofPanels,
    wing: s.wing,
    wingOpen: s.wing && view.wingOpen,
    mast: s.equipment.includes('mast'),
    mastUp: s.equipment.includes('mast') && view.mastUp,
    led: s.equipment.includes('led'),
    gearRail: s.equipment.includes('gearRail'),
    hvac: s.equipment.includes('hvac'),
    brand: s.brandOn ? s.brandText.trim() || BRANDING.placeholder : '',
  };
}
