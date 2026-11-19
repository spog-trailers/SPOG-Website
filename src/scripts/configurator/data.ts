/**
 * Cargo configurator data: options, SAMPLE pricing, rules and run-time math.
 *
 * What's real: the two lengths (10 and 20 ft, Nate 2026-11-18), "From $10,000" for the Cargo
 * (Nate, same day), the 5 to 20 kWh battery range, the two-week standard lead time and the look
 * of the as-built black 20 ft (five roof panels, side window, storage hatch, spare, roof vent,
 * barn doors, black machined wheels).
 *
 * EVERYTHING ELSE IS A GUESS for the demo (Nate asked for guesses until he sends the real list):
 * every other price, the color names, the add-ons, the interior options, the panel wattage,
 * tool wattages, the delivery fee and the deposit. Never reuse these numbers on the live site.
 */
import { maxPanels } from './dims';

export const PANEL_WATTS = 420;
export const DEPOSIT = 500;
export const DELIVERY_FEE = 650;

export const SIZES = [
  { ft: 10, name: 'Cargo 10', note: 'Single axle', price: 10000 }, // price is Nate's "From $10,000"
  { ft: 20, name: 'Cargo 20', note: 'Tandem axle', price: 18500 }, // SAMPLE
];

export const BATTERIES = [
  { kwh: 5, price: 0, minLength: 10 },
  { kwh: 10, price: 4800, minLength: 10 },
  { kwh: 15, price: 9200, minLength: 20 },
  { kwh: 20, price: 13400, minLength: 20 },
];

export const PANELS_INCLUDED = 2;
export const PANEL_PRICE = 950;

export const PAINTS = [
  { id: 'black', name: 'Satin Black', hex: '#141416', dark: true, price: 0 },
  { id: 'white', name: 'Bright White', hex: '#e8e8e5', dark: false, price: 0 },
  { id: 'charcoal', name: 'Charcoal', hex: '#3c3f45', dark: true, price: 600 },
  { id: 'silver', name: 'Silver Frost', hex: '#a9adb3', dark: false, price: 600 },
  { id: 'navy', name: 'Midnight Navy', hex: '#172438', dark: true, price: 900 },
  { id: 'green', name: 'Forest Green', hex: '#26382c', dark: true, price: 900 },
];

export const TRIMS = [
  { id: 'black' as const, name: 'Blackout trim', hex: '#1b1c1f', price: 0 },
  { id: 'aluminum' as const, name: 'Polished aluminum trim', hex: '#c6c9ce', price: 450 },
];

export const WHEELS = [
  { id: 'machined' as const, name: '15 in Black Machined', note: 'All-season trailer tires', price: 0 },
  { id: 'black' as const, name: '15 in Gloss Black', note: 'All-season trailer tires', price: 0 },
  { id: 'silver' as const, name: '15 in Silver', note: 'All-season trailer tires', price: 250 },
];

export const REARS = [
  { id: 'barn' as const, name: 'Barn doors', desc: 'Two doors that swing wide, with twin lock bars.', price: 0 },
  { id: 'ramp' as const, name: 'Ramp door', desc: 'One door that drops to the ground for carts and equipment.', price: 900 },
];

export const ADDONS = [
  { id: 'window', name: 'Side window', desc: 'A sliding window on the street side.', price: 650, view: 'street' },
  { id: 'hatch', name: 'Storage hatch', desc: 'Two lockable doors to reach cords and hoses from outside.', price: 850, view: 'street' },
  { id: 'spare', name: 'Spare tire', desc: 'A matching wheel mounted on the tongue.', price: 350, view: 'street' },
  { id: 'vent', name: 'Roof vent', desc: 'A low vent over the nose to move air through.', price: 300, view: 'top' },
  { id: 'floods', name: 'Flood lights', desc: 'LED work lights on both sides.', price: 700, view: 'front' },
  { id: 'cameras', name: 'Security cameras', desc: 'Cameras on the rear corners and the nose.', price: 1800, view: 'rear' },
  { id: 'hvac', name: 'Heat and AC', desc: 'A heat pump on the tongue. Adds about 5 kWh a day of load.', price: 3900, view: 'street' },
];

export const WALLS = [
  { id: 'white' as const, name: 'White aluminum walls', hex: '#eeeeeb', price: 0 },
  { id: 'plywood' as const, name: 'Plywood walls', hex: '#c9a56e', price: 0 },
  { id: 'black' as const, name: 'Black walls', hex: '#1d1e21', price: 500 },
];

export const FLOORS = [
  { id: 'rubber' as const, name: 'Rubber coin floor', hex: '#232427', price: 0 },
  { id: 'wood' as const, name: 'Plank floor', hex: '#a9824f', price: 400 },
  { id: 'plate' as const, name: 'Aluminum tread floor', hex: '#b9bcc1', price: 800 },
];

export const INSIDE = [
  { id: 'shelving', name: 'Tool racking', desc: 'Steel shelving along the street-side wall.', price: 1600 },
  { id: 'bench', name: 'Workbench', desc: 'A wood-top bench with outlets under the window.', price: 1250 },
  { id: 'cabinets', name: 'Overhead cabinets', desc: 'Closed storage along the curb-side wall.', price: 1400 },
  { id: 'etrack', name: 'Tie-down track', desc: 'Two rows of track on each wall to strap gear down.', price: 400 },
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
  paint: string;
  trim: 'black' | 'aluminum';
  wheels: 'machined' | 'black' | 'silver';
  battery: number;
  panels: number;
  rear: 'barn' | 'ramp';
  addons: string[];
  walls: 'white' | 'plywood' | 'black';
  floor: 'rubber' | 'wood' | 'plate';
  inside: string[];
  brandOn: boolean;
  brandText: string;
  tools: string[];
  delivery: 'pickup' | 'delivery';
  zip: string;
}

/** The trailer in Nate's photos: black 20 ft, five panels, window, hatch, spare and vent. */
export const DEFAULT_BUILD: BuildState = {
  length: 20,
  paint: 'black',
  trim: 'black',
  wheels: 'machined',
  battery: 10,
  panels: 5,
  rear: 'barn',
  addons: ['window', 'hatch', 'spare', 'vent'],
  walls: 'white',
  floor: 'rubber',
  inside: [],
  brandOn: false,
  brandText: '',
  tools: ['miter', 'chargers', 'lights'],
  delivery: 'pickup',
  zip: '',
};

// ---------------------------------------------------------------- rules

/** Pull a build back inside the rules after any change. Returns notes about what changed. */
export function enforceRules(s: BuildState) {
  const notes: string[] = [];
  const max = maxPanels(s.length);
  if (s.panels > max) {
    s.panels = max;
    notes.push(`A ${s.length} ft roof fits ${max} panels, so solar was reduced.`);
  }
  if (s.panels < PANELS_INCLUDED) s.panels = Math.min(PANELS_INCLUDED, max);
  const bat = BATTERIES.find((b) => b.kwh === s.battery);
  if (bat && s.length < bat.minLength) {
    s.battery = 10;
    notes.push(`${bat.kwh} kWh needs the ${bat.minLength} ft, so the battery was set to 10 kWh.`);
  }
  return notes;
}

export const solarWatts = (s: BuildState) => s.panels * PANEL_WATTS;

// ---------------------------------------------------------------- run-time math (sample)

const SUN_HOURS = 4;
const SOLAR_DERATE = 0.8;
const USABLE = 0.9;
const HVAC_KWH = 4.8;

export function runtime(s: BuildState) {
  const tools = TOOLS.filter((t) => s.tools.includes(t.id));
  const toolKwh = tools.reduce((sum, t) => sum + (t.watts * t.hours) / 1000, 0);
  const load = toolKwh + (s.addons.includes('hvac') ? HVAC_KWH : 0);
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
    headline = `Covers your day, about ${days.toFixed(1)} days between charges`;
    detail = `${load.toFixed(1)} kWh a day of load, ${solar.toFixed(1)} kWh back from the sun.`;
  } else {
    headline = `Covers about ${Math.round(coverage * 100)}% of your day`;
    detail = `Add battery or solar, or plug in overnight. ${load.toFixed(1)} kWh a day of load.`;
  }
  return { load, battery, solar, coverage: Math.min(1, coverage), headline, detail };
}

// ---------------------------------------------------------------- pricing (sample)

export interface Line { label: string; price: number }

const pick = <T extends { id: string }>(list: readonly T[], id: string) => list.find((x) => x.id === id) ?? list[0];

export function priceLines(s: BuildState): Line[] {
  const lines: Line[] = [];
  const size = SIZES.find((l) => l.ft === s.length) ?? SIZES[1];
  lines.push({ label: `${size.name}, ${size.ft} ft`, price: size.price });
  const paint = pick(PAINTS, s.paint);
  lines.push({ label: paint.name, price: paint.price });
  const trim = pick(TRIMS, s.trim);
  lines.push({ label: trim.name, price: trim.price });
  const wheels = pick(WHEELS, s.wheels);
  lines.push({ label: `${wheels.name} wheels`, price: wheels.price });
  const bat = BATTERIES.find((b) => b.kwh === s.battery) ?? BATTERIES[0];
  lines.push({ label: `${bat.kwh} kWh battery`, price: bat.price });
  lines.push({ label: `${solarWatts(s).toLocaleString()}W roof solar`, price: Math.max(0, s.panels - PANELS_INCLUDED) * PANEL_PRICE });
  const rear = pick(REARS, s.rear);
  lines.push({ label: rear.name, price: rear.price });
  ADDONS.filter((e) => s.addons.includes(e.id)).forEach((e) => lines.push({ label: e.name, price: e.price }));
  const walls = pick(WALLS, s.walls);
  lines.push({ label: walls.name, price: walls.price });
  const floor = pick(FLOORS, s.floor);
  lines.push({ label: floor.name, price: floor.price });
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
  const standard = (s.paint === 'black' || s.paint === 'white') && s.trim === 'black' && !s.brandOn && s.inside.length === 0 && s.walls === 'white';
  return standard ? 'About 2 weeks' : '4 to 6 weeks';
}

export function summaryLine(s: BuildState) {
  return [`${s.length} ft`, pick(PAINTS, s.paint).name, `${s.battery} kWh`, `${solarWatts(s).toLocaleString()}W solar`, pick(REARS, s.rear).name].join(' · ');
}

/** Short shareable code for the confirmation screen. */
export function buildCode(s: BuildState) {
  const raw = JSON.stringify({ ...s, zip: '' });
  let h = 0;
  for (let i = 0; i < raw.length; i++) h = (h * 31 + raw.charCodeAt(i)) >>> 0;
  return `SPOG-C${s.length}-${h.toString(36).toUpperCase().slice(0, 5)}`;
}

export function toTrailerConfig(s: BuildState, view: { doorsOpen: boolean }) {
  const paint = pick(PAINTS, s.paint);
  const has = (id: string) => s.addons.includes(id);
  const inside = (id: string) => s.inside.includes(id);
  return {
    length: s.length,
    paint: paint.hex,
    paintDark: paint.dark,
    trim: s.trim,
    wheels: s.wheels,
    panels: s.panels,
    batteryModules: Math.max(1, Math.round(s.battery / 5)),
    rear: s.rear,
    doorsOpen: view.doorsOpen,
    window: has('window'),
    hatch: has('hatch'),
    spare: has('spare'),
    vent: has('vent'),
    floods: has('floods'),
    cameras: has('cameras'),
    hvac: has('hvac'),
    walls: s.walls,
    floor: s.floor,
    shelving: inside('shelving'),
    bench: inside('bench'),
    cabinets: inside('cabinets'),
    etrack: inside('etrack'),
    brand: s.brandOn ? s.brandText.trim() || BRANDING.placeholder : '',
  };
}
