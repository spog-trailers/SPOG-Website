/**
 * Product pages (/cargo, /workstation, /event). Layout follows the Rivian R1T page, see
 * docs/product-page-teardown-2026-11-16.md.
 *
 * Rules for this file:
 * - Headline numbers (battery, solar, length) and the short specs come from `products` in
 *   content.ts so a correction lands in one place. Don't retype them here.
 * - No prices anywhere. Pricing is private. Don't link the concept configurator from these
 *   pages either, because it shows made-up sample prices.
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
    title: 'SPOG Cargo | Solar power work trailer, 8 to 24 ft',
    description: "A work trailer for the crew's tools, with solar and battery power on board. Built in Middletown, New York.",
    heroFit: 17,
    hero: {
      kind: 'studio',
      image: img.cargo34,
      alt: 'SPOG Cargo trailer with solar roof and light mast',
      // SOURCE: homepage Cargo specs (lead time 2 weeks), FAQ ("Standard Cargo trailers ship in two weeks")
      proof: 'Standard builds ship in about two weeks. Built in Middletown, New York.',
    },
    overview: {
      intro: ['Get to know Cargo.', "A work trailer for the crew's tools, with the power to run them on board."], // NEW
      // PHOTO: studio render. Replace with a real Cargo on a driveway (Robert's shot list #4).
      photo: { image: img.cargoFront, alt: 'Front of a SPOG Cargo trailer with diamond plate nose and light mast', title: 'Built to haul', body: 'Diamond plate up front and a full box behind it for the tools.', studio: true }, // NEW, describes the render
      tiles: [
        // SOURCE: homepage (solar up to 3,360W), spogtrailers.com Cargo page ("roof solar")
        { icon: 'sun', title: 'Solar on the roof', body: 'Panels on the roof refill the battery while the crew works.' }, // NEW
        // SOURCE: spogtrailers.com Cargo page ("integrated battery backup")
        { icon: 'battery', title: 'Battery on board', body: 'Stored power runs the job with no generator and no fuel run.' }, // NEW
        // SOURCE: homepage Cargo specs ("Inside: corner desk")
        { icon: 'desk', title: 'Corner desk', body: 'A work surface inside for plans, invoices and the laptop.' }, // NEW
        // SOURCE: spogtrailers.com Cargo page ("custom ordered with a company logo and branding")
        { icon: 'tag', title: 'Your branding', body: 'Order it with your company name and logo on the walls.' }, // NEW
      ],
    },
    power: { batteries: [5, 10, 20], defaultBattery: 10, devices: ['saw', 'welder', 'lightTower', 'fridge', 'computer', 'airFryer'] },
    statement: {
      // PHOTO: Red Rocks placeholder. The trailer in it may not be a Cargo. Replace before launch.
      image: img.statementBg,
      alt: 'Pickup towing a SPOG trailer with its solar panel tilted up',
      position: '30% 55%',
      heading: ['Pull in.', 'Plug in.'], // SOURCE: homepage statement
      // SOURCE: homepage use case "Residential crews"
      body: "The saws, lights and chargers run off the trailer. No generator under the neighbor's window.",
    },
    // UNCONFIRMED: only 8 and 24 ft are documented for Cargo. The stops in between are a guess.
    size: { lengths: [8, 12, 16, 20, 24], defaultLength: 16 },
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
      // SOURCE: homepage Workstation specs ("Inside: desks, storage, display"). Image is a render.
      photo: { image: img.office, alt: 'Inside a SPOG Workstation with two desks and a wall display', title: 'A real office on site', body: 'Desks, storage and a display, built in.' }, // NEW
      tiles: [
        // SOURCE: homepage specs ("Heat and AC: Standard") and the brand guide
        { icon: 'climate', title: 'Heat and AC standard', body: 'Every Workstation comes with heating and cooling.' }, // NEW
        // SOURCE: homepage (solar up to 5,600W)
        { icon: 'sun', title: 'Solar on the roof', body: 'The battery refills from the roof while the office runs.' }, // NEW
        // SOURCE: homepage specs ("Internet: Starlink option"), use case "Rural jobs"
        { icon: 'wifi', title: 'Starlink option', body: 'Keeps email and plans moving where cell service drops out.' }, // NEW
        // PLACEHOLDER SOURCE: spogtrailers.com Workstation page ("optional jobsite lighting and security cameras"). Confirm.
        { icon: 'camera', title: 'Security cameras', body: 'Optional cameras watch the site after the crew leaves.' }, // NEW
      ],
    },
    power: { batteries: [5, 10, 20, 30, 40], defaultBattery: 20, devices: ['computer', 'fridge', 'lightTower', 'airFryer', 'saw', 'welder'] },
    statement: {
      // PHOTO: Red Rocks placeholder (open-wall trailer). Replace with Robert's site office shot.
      image: img.storyBg,
      alt: 'SPOG trailer with its side wall opened up on a gravel lot',
      position: '50% 45%',
      heading: ['One trailer.', 'Three problems solved.'], // SOURCE: approved brand phrase
      body: 'The office, the power and the security, in one tow.', // NEW
    },
    // SOURCE: spogtrailers.com Workstation configurator (8 to 35 ft) and Hybrid Fleet floor plans (40 ft).
    // The homepage says "8 to 40 ft", which is still flagged as unconfirmed.
    size: { lengths: [8, 10, 12, 16, 20, 24, 31, 35, 40], defaultLength: 24 },
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
