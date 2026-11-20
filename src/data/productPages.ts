/**
 * Product pages (/cargo, /workstation, /event). Layout follows the Rivian R1T page, see
 * docs/product-page-teardown-2026-11-16.md.
 *
 * Rules for this file:
 * - Headline numbers (battery, solar, length) and the short specs come from `products` in
 *   content.ts so a correction lands in one place. Don't retype them here.
 * - No prices on these pages. Nate approved the 2026-11-20 price sheet for the site, but these
 *   older pages keep their structure, so prices live on the homepage lineup and the builder.
 *   Cargo's "Design yours" opens /configure/cargo (Nate, 2026-11-18).
 * - Cargo and Workstation facts follow SPOG's external price sheet and Nate's answers (2026-11-20):
 *   10 or 20 ft, 5 to 20 kWh in 5 kWh steps. Event is not on the sheet and is unchanged.
 * - Every section is optional. A product renders only the sections it has real content for.
 * - Copy marked NEW was written for these pages and needs Nate's approval.
 *   Copy marked SOURCE says where the claim came from.
 */
import { img, products, faqs } from './content';

export type ProductId = 'cargo' | 'workstation' | 'event';

/**
 * Run times from SPOG's "Customize My Trailer Guide" (spogtrailers.com, read 2026-11-16),
 * table "Estimated Device Runtime by Battery Capacity". The table is linear (hours = kWh / kW),
 * so these draws reproduce every row of it exactly. One device at a time, full battery,
 * no solar recharge counted.
 */
export const devices = {
  saw: { name: 'Circular saw', kw: 1.2 },
  welder: { name: 'MIG welder', kw: 3 },
  lightTower: { name: 'Light tower', kw: 1 },
  computer: { name: 'Computer and Wi-Fi', kw: 0.15 },
  fridge: { name: 'Refrigerator', kw: 0.15 },
  airFryer: { name: 'Air fryer', kw: 1.5 },
} as const;
export type DeviceId = keyof typeof devices;

interface Tile { icon: string; title: string; body: string }

export interface ProductPage {
  id: ProductId;
  title: string;
  description: string;
  /** Font size of the giant hero name, in vw. Longer names need smaller values. */
  heroFit: number;
  hero: {
    kind: 'photo' | 'studio';
    image: string;
    alt: string;
    position?: string;
    proof: string;
  };
  overview?: {
    intro: [string, string];
    photo?: { image: string; alt: string; title: string; body: string; studio?: boolean };
    tiles: Tile[];
  };
  power: {
    batteries: number[];
    defaultBattery: number;
    devices: DeviceId[];
  };
  statement?: { image: string; alt: string; position?: string; heading: [string, string]; body: string };
  size: {
    /** Lengths in feet for the to-scale drawing. */
    lengths: number[];
    defaultLength: number;
  };
  /** Extra spec rows that aren't on the homepage. Each one needs a source. */
  extraSpecs?: [string, string][];
  faqHeading: string;
  /** Option in the walkthrough form's trailer select. */
  walkthroughTrailer: string;
}

export const productPages: Record<ProductId, ProductPage> = {
  cargo: {
    id: 'cargo',
    title: 'SPOG Cargo | Solar power work trailer, 10 or 20 ft', // SOURCE (price sheet 2026-11-20)
    description: "A work trailer for the crew's tools, with solar and battery power on board. Built in Middletown, New York.",
    heroFit: 17,
    hero: {
      kind: 'studio',
      image: img.cargo34,
      alt: 'SPOG Cargo trailer with solar roof and light mast',
      // SOURCE (Built). The "ships in about two weeks" lead time was cut (2026-11-20): it isn't on the price sheet.
      proof: 'Built in Middletown, New York.',
    },
    overview: {
      intro: ['Get to know Cargo.', "A work trailer for the crew's tools, with the power to run them on board."], // NEW
      // PHOTO: studio render. Replace with a real Cargo on a driveway (Robert's shot list #4).
      photo: { image: img.cargoFront, alt: 'Front of a SPOG Cargo trailer with diamond plate nose and light mast', title: 'Built to haul', body: 'Diamond plate up front and a full box behind it for the tools.', studio: true }, // NEW, describes the render
      tiles: [
        // SOURCE: price sheet 2026-11-20 (roof solar on every Cargo), spogtrailers.com Cargo page ("roof solar")
        { icon: 'sun', title: 'Solar on the roof', body: 'Panels on the roof refill the battery while the crew works.' }, // NEW
        // SOURCE: spogtrailers.com Cargo page ("integrated battery backup")
        { icon: 'battery', title: 'Battery on board', body: 'Stored power runs the job with no generator and no fuel run.' }, // NEW
        // SOURCE: price sheet 2026-11-20 (one built-in front corner work desk on every Cargo)
        { icon: 'desk', title: 'Corner desk', body: 'A work surface inside for plans, invoices and the laptop.' }, // NEW
        // SOURCE: spogtrailers.com Cargo page ("custom ordered with a company logo and branding")
        { icon: 'tag', title: 'Your branding', body: 'Order it with your company name and logo on the walls.' }, // NEW
      ],
    },
    power: { batteries: [5, 10, 15, 20], defaultBattery: 10, devices: ['saw', 'welder', 'lightTower', 'fridge', 'computer', 'airFryer'] }, // SOURCE (price sheet 2026-11-20: 5 kWh steps, 20 kWh max)
    statement: {
      // PHOTO: Red Rocks placeholder. The trailer in it may not be a Cargo. Replace before launch.
      image: img.statementBg,
      alt: 'Pickup towing a SPOG trailer with its solar panel tilted up',
      position: '30% 55%',
      heading: ['Pull in.', 'Plug in.'], // SOURCE: homepage statement
      // SOURCE: homepage use case "Residential crews"
      body: "The saws, lights and chargers run off the trailer. No generator under the neighbor's window.",
    },
    size: { lengths: [10, 20], defaultLength: 20 }, // SOURCE (price sheet 2026-11-20: 10 and 20 ft only, the 35 ft is not offered)
    // SOURCE (price sheet 2026-11-20). Max loaded weight is the GVWR. No tow vehicle claim, on purpose.
    extraSpecs: [
      ['Max loaded weight', '7,000 lbs (10 ft), 9,500 lbs (20 ft)'],
      ['Axles', 'Dual, on both sizes'],
      ['Inverter', '3,000W (10 ft), 6,000W (20 ft)'],
      ['Voltage', '120V (10 ft), 120V and 208V (20 ft)'], // SOURCE (price sheet 2026-11-20)
      ['Outlets', '3 outside and 5 inside'], // SOURCE (price sheet 2026-11-20)
      ['Floor', 'Vinyl'], // NATE (2026-11-20 answers: vinyl on every model)
      ['Insulation', 'Walls, floor and ceiling'],
    ],
    faqHeading: 'Questions crews ask.',
    walkthroughTrailer: 'Cargo',
  },

  workstation: {
    id: 'workstation',
    title: 'SPOG Workstation | Solar power site office trailer',
    description: 'A site office with its own power, heat and air from day one. Built in Middletown, New York.',
    heroFit: 11.2,
    hero: {
      kind: 'photo',
      // PHOTO: same Red Rocks photo as the homepage hero until Robert's shoot.
      image: img.hero,
      alt: 'SPOG Workstation trailers on a lot at sunrise, solar wings open',
      position: '52% 72%',
      proof: 'Built in Middletown, New York.',
    },
    overview: {
      intro: ['Get to know Workstation.', 'A site office that shows up with its own power, heat and air.'], // NEW
      // SOURCE: price sheet 2026-11-20 (one built-in work desk, climate control). Image is a render.
      photo: { image: img.office, alt: 'Inside a SPOG Workstation office', title: 'A real office on site', body: 'Every Workstation has a built-in work desk, and you can add more.' }, // NEW (2026-11-20). Storage and the standard display came off. Full sentence, alt no longer names the display.
      tiles: [
        // SOURCE: price sheet 2026-11-20 and the brand guide. "Climate control" NATE (2026-11-20 answers)
        { icon: 'climate', title: 'Climate control standard', body: 'Every Workstation comes with heating and cooling.' }, // NEW
        // SOURCE: price sheet 2026-11-20 (roof solar on every Workstation)
        { icon: 'sun', title: 'Solar on the roof', body: 'The battery refills from the roof while the office runs.' }, // NEW
        // SOURCE: homepage specs ("Internet: Starlink option"), use case "Rural jobs"
        { icon: 'wifi', title: 'Starlink option', body: 'Keeps email and plans moving where cell service drops out.' }, // NEW
        // SOURCE: price sheet 2026-11-20 (the only camera comes with the 28 ft light tower package, 20 ft only)
        { icon: 'camera', title: 'Light tower', body: 'On the 20 ft, the 28 ft light tower adds a security camera and a light over the site.' }, // NEW (2026-11-20)
      ],
    },
    power: { batteries: [5, 10, 15, 20], defaultBattery: 10, devices: ['computer', 'fridge', 'lightTower', 'airFryer', 'saw', 'welder'] }, // SOURCE (price sheet 2026-11-20: 5 kWh steps, 20 kWh max)
    statement: {
      // PHOTO: Red Rocks placeholder (open-wall trailer). Replace with Robert's site office shot.
      image: img.storyBg,
      alt: 'SPOG trailer with its side wall opened up on a gravel lot',
      position: '50% 45%',
      heading: ['One trailer.', 'Three problems solved.'], // SOURCE: approved brand phrase
      body: 'The office, the power and the security, in one tow.', // NEW
    },
    size: { lengths: [10, 20], defaultLength: 20 }, // SOURCE (price sheet 2026-11-20: 10 and 20 ft only)
    // SOURCE (price sheet 2026-11-20). Max loaded weight is the GVWR. No tow vehicle claim, on purpose.
    extraSpecs: [
      ['Max loaded weight', '7,000 lbs (10 ft), 14,000 lbs (20 ft)'],
      ['Axles', 'Dual, on both sizes'],
      ['Inverter', '3,000W (10 ft), 6,000W (20 ft)'],
      ['Voltage', '120V (10 ft), 120V and 208V (20 ft)'], // SOURCE (price sheet 2026-11-20)
      ['Outlets', '3 outside and 5 inside (10 ft), 4 outside and 8 inside (20 ft)'], // SOURCE (price sheet 2026-11-20)
      ['Floor', 'Insulated vinyl'], // NATE (2026-11-20 answers: vinyl on every model)
      // The Interior row (white panels or wood on the 20 ft) was cut 2026-11-20: options on /workstation says it.
    ],
    faqHeading: 'Questions crews ask.',
    walkthroughTrailer: 'Workstation',
  },

  event: {
    id: 'event',
    title: 'SPOG Event | Solar power LED screen trailer',
    description: 'A built-in LED screen and the solar power to run it, for events, promotions and outdoor viewing.',
    heroFit: 17.5,
    hero: {
      kind: 'photo',
      image: img.eventMovieNight, // real SPOG movie night from spogtrailers.com
      alt: 'Crowd watching an outdoor movie on a SPOG Event trailer at night',
      position: '50% 50%',
      proof: 'Built in Middletown, New York.',
    },
    overview: {
      intro: ['Get to know Event.', 'An outdoor screen with its own power on board, for wherever the crowd is.'], // NEW
      tiles: [
        // SOURCE: homepage Event specs ("Built-in LED screen")
        { icon: 'screen', title: 'Built-in LED screen', body: 'For movie nights, promotions and game days.' }, // NEW
        // SOURCE: homepage use case "Events"
        { icon: 'noise', title: 'No generator noise', body: 'Solar and battery power, with nothing rumbling next to the crowd.' }, // NEW
        // PLACEHOLDER SOURCE: spogtrailers.com Event page ("5G internet"). Confirm.
        { icon: 'wifi', title: '5G internet', body: 'Internet on board, wherever the trailer parks.' }, // NEW
        // PLACEHOLDER SOURCE: spogtrailers.com Event page ("360 camera system"). Confirm.
        { icon: 'camera', title: '360 camera system', body: 'Cameras on every side of the trailer.' }, // NEW
      ],
    },
    power: { batteries: [50, 60, 70, 80, 90, 100], defaultBattery: 70, devices: ['lightTower', 'fridge', 'airFryer', 'computer'] },
    statement: {
      // PHOTO: render from spogtrailers.com. The screen shows a video game, so check rights or swap the screen image.
      image: img.eventLedDusk,
      alt: 'SPOG Event trailer with its LED screen lit at dusk',
      position: '42% 50%',
      heading: ['Bring the big screen', 'anywhere.'], // SOURCE: approved brand phrase
      body: 'Pull in, set up and turn it on. The power is already on board.', // NEW
    },
    // UNCONFIRMED: only 20 and 35 ft are documented for Event. The stops in between are a guess.
    size: { lengths: [20, 24, 31, 35], defaultLength: 24 },
    faqHeading: 'Questions we get.',
    walkthroughTrailer: 'Event',
  },
};

export const productIds = Object.keys(productPages) as ProductId[];

/** Homepage lineup data for one product (name, tag, stats, specs). */
export const lineupEntry = (id: ProductId) => products.find((p) => p.id === id)!;

/** Spec table rows: homepage stats and specs, then any extras. */
export const specRows = (id: ProductId): [string, string][] => {
  const p = lineupEntry(id);
  return [...(p.stats as [string, string][]), ...(p.specs as [string, string][]), ...(productPages[id].extraSpecs ?? [])];
};

/** Lineup cards at the bottom of each page. Workstation avoids the studio render (banned decal). */
export const lineupCards: { id: ProductId; image: string; alt: string; position: string }[] = [
  { id: 'cargo', image: img.cargo34, alt: 'SPOG Cargo trailer', position: '50% 40%' },
  { id: 'workstation', image: img.hero, alt: 'SPOG Workstation trailers at sunrise', position: '52% 70%' },
  { id: 'event', image: img.eventMovieNight, alt: 'SPOG Event trailer showing a movie at night', position: '50% 50%' },
];

/** FAQs reused from the homepage. PLACEHOLDER until each answer is signed off. */
export const productFaqs = faqs.filter((f) => f.q !== 'Which trailer fits what I need?');

/** "5 to 20 kWh" style range for a list of numbers. */
export const range = (list: number[], unit: string) => `${list[0]} to ${list[list.length - 1]} ${unit}`;
