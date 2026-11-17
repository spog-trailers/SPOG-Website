/**
 * Test homepage at /test-home (draft v2, 2026-11-17). The live homepage is untouched.
 *
 * v2 after Nate's review: the homepage only talks about what every SPOG shares (power,
 * freedom, utility, quality, American made) and shows each trailer once, Tesla style, as a
 * clean card in its own look. Feature selling moves to the product pages.
 *
 * Looks: Work (Cargo, Workstation share it), Event, Garage, Disaster Relief, Camper.
 * Montserrat, the color tokens, the nav and the button shapes stay the same everywhere.
 *
 * Copy marks:
 *   NEW     written for this draft, needs Nate's approval
 *   SOURCE  reused from content.ts, the brand kit's approved lines or the marketing plan
 * Coming-next trailers get no specs and no Reserve, only "Get first word".
 *
 * The v1 showcase data further down (cargo, workstation, event, garage, relief, camper) feeds
 * the held Show* components, kept as starting points for the product pages.
 */
import { img, products, nextUp, guarantees, shoot } from './content';
import type { Feature } from './features';

/** How each trailer's name is set. Same font, different weight, tracking, case and slant. */
export const wordmark: Record<string, string> = {
  cargo: 'font-black uppercase tracking-[-.045em]',
  workstation: 'font-black uppercase tracking-[-.045em]',
  event: 'font-light uppercase tracking-[.3em]',
  garage: 'text-steel font-extrabold uppercase tracking-[.1em] -skew-x-[9deg]',
  relief: 'font-black uppercase tracking-[.03em]',
  camper: 'font-medium tracking-[-.035em]',
};

export const product = (id: 'cargo' | 'workstation' | 'event') => products.find((p) => p.id === id)!;
const soon = (name: string) => ({ ...nextUp.products.find((p) => p.name === name)!, cta: nextUp.cta });

export const hero = {
  eyebrow: { gold: 'Solar Power Off Grid', text: 'Built in Middletown, New York' }, // NEW
  heading: ['Bring your', 'own power.'], // NEW
  sub: "Trailers that carry their own solar and battery, for the job site, the event and the places the grid doesn't reach.", // NEW
  primary: 'See the lineup', // NEW
};

/**
 * The lineup row, after Tesla's homepage cards: a category label, the name in that trailer's
 * own type, one status line and the buttons. Nothing else. `category` and `status` are NEW.
 * `size` is the name's font size in % of the card width, so every name fits its card.
 */
export type Look = 'studio' | 'work' | 'event' | 'garage' | 'relief' | 'camper';
export const cards: {
  id: string; name: string; category: string; status: string; live: boolean; href?: string;
  image: string; alt: string; position: string; look: Look; size: number;
}[] = [
  { id: 'cargo', name: 'Cargo', category: 'Utility trailer', status: 'Available now', live: true, href: '/cargo', image: img.cargoFront, alt: 'SPOG Cargo trailer from the front, solar roof and light mast', position: '50% 50%', look: 'studio', size: 10 },
  { id: 'workstation', name: 'Workstation', category: 'Mobile office', status: 'Available now', live: true, href: '/workstation', image: shoot.wsNavyStudio, alt: 'Navy SPOG Workstation in the Middletown shop', position: '50% 66%', look: 'work', size: 7.6 },
  { id: 'event', name: 'Event', category: 'LED screen trailer', status: 'Buy it or rent it', live: true, href: '/event', image: shoot.eventNightCrowd, alt: 'SPOG Event trailer lit up at night with a crowd on the lawn', position: '30% 62%', look: 'event', size: 8.4 },
  { id: 'garage', name: 'Garage', category: 'Enclosed car hauler', status: 'Coming next', live: false, image: img.garageEv, alt: 'Electric car inside a lit SPOG Garage trailer', position: '55% 50%', look: 'garage', size: 8.4 },
  { id: 'relief', name: 'Disaster Relief', category: 'Emergency power', status: 'Coming next', live: false, image: img.disasterSolar, alt: 'SPOG Disaster Relief trailer with solar panels deployed at a damaged site', position: '50% 50%', look: 'relief', size: 7.4 },
  { id: 'camper', name: 'Camper', category: 'Off-grid camper', status: 'Coming next', live: false, image: img.camperCampfire, alt: 'SPOG Camper trailer by a campfire in the mountains', position: '68% 55%', look: 'camper', size: 9.6 },
];

/**
 * What every SPOG shares (Nate's five: power, freedom, utility, quality, American made), as
 * feature cards after Rivian, Tesla and Pebble (see FeatureCards.astro). Shared facts only,
 * no specs for one trailer, per the homepage rule. Photos are Nate's (2026-11-17). Any SPOG
 * photo is honest here, because the values apply to every trailer.
 */
export const valuesHead = {
  kicker: 'Every SPOG', // NEW
  heading: ['What every trailer', 'is built on.'], // NEW
};

export const values: Feature[] = [
  {
    id: 'power',
    title: 'Power',
    line: 'Up to 100 kWh on board.', // SOURCE (homepage numbers)
    image: shoot.wsAerialMast,
    alt: 'SPOG trailer from above, solar panels across the roof',
    position: '50% 50%',
    panel: {
      intro: 'Every SPOG carries its own solar and battery. The panels refill the battery wherever the trailer parks.', // NEW
      stats: [['Battery across the lineup', 'Up to 100 kWh']], // SOURCE (homepage numbers)
    },
  },
  {
    id: 'freedom',
    title: 'Freedom',
    line: 'Works wherever you park it.', // NEW
    image: shoot.wsRuralSunset,
    alt: 'SPOG trailer parked by a farm field at sunset',
    position: '40% 50%',
    panel: {
      intro: 'No hookup and no fuel run. Pull in, open the panels and the power is already there.', // NEW, from the homepage statement
    },
  },
  {
    id: 'utility',
    title: 'Utility',
    line: 'Built to work.', // NEW
    image: shoot.wsLotMastSide,
    alt: 'White SPOG trailer on a lot with its mast raised',
    position: '58% 60%',
    panel: {
      intro: 'Built to work, from the job site to the campsite. Each trailer is laid out for the people who use it.', // NEW
    },
  },
  {
    id: 'quality',
    title: 'Quality',
    line: 'Engineered before it\'s built.', // NEW, from Nate's photo label
    image: shoot.engineeringCad,
    alt: 'Engineer working on a trailer frame in CAD',
    position: '30% 50%',
    panel: {
      intro: 'Every SPOG is engineered in CAD before it\'s built, then backed by a 3-year structural warranty and service that comes to you.', // NEW, facts SOURCE (guarantees, Nate's photo label)
      points: guarantees.slice(0, 3).map((g) => ({ title: g.title, body: g.body })), // SOURCE (guarantees)
    },
  },
  {
    id: 'made',
    title: 'American made',
    line: 'Built in Middletown, New York.', // SOURCE (Built)
    image: shoot.shopWelding,
    alt: 'Welder joining a steel trailer frame in the SPOG shop',
    position: '35% 50%',
    panel: {
      intro: 'Welded, wired and finished in Middletown, New York.', // NEW, fact SOURCE (Built)
      link: { label: 'Meet the shop', href: '#built' }, // NEW
    },
  },
];

export const firstWordDialog = {
  heading: 'Get first word.', // NEW
  sub: nextUp.sub, // SOURCE
  cta: nextUp.cta, // SOURCE
  options: nextUp.products.map((p) => p.name),
};

// ---------- Work: Cargo and Workstation. Daylight, heavy type, a spec plate like a trailer's data plate.

export const cargo = {
  lane: 'For the job site', // NEW
  body: 'Pull into the driveway and the saws, lights and chargers run off the trailer.', // SOURCE (useCases, residential)
  plate: [...product('cargo').stats, ['Lead time', '2 weeks']] as [string, string][], // SOURCE
};

export const workstation = {
  lane: 'For the job site', // NEW
  body: 'Heat, AC, desks and optional Starlink ride on the trailer. The super runs the job from day one instead of waiting on a generator hookup.', // SOURCE (useCases, office)
  inside: 'Desks, storage and a display inside', // NEW, from the Workstation specs
  plate: [...product('workstation').stats, ['Heat and AC', 'Standard']] as [string, string][], // SOURCE
};

// ---------- Event. Night, light from the screen, wide thin type, a marquee of the nights it runs.

export const event = {
  eyebrow: { gold: 'Own the night', text: 'For venues, teams and event hosts' }, // gold line SOURCE (brand kit), rest NEW
  tagline: 'Bring the big screen anywhere.', // SOURCE (brand kit)
  body: 'A built-in LED screen and the solar power to run it, with no generator rumbling next to the crowd.', // SOURCE (useCases, events), trimmed
  buyRent: 'Buy one for your venue or rent one for the night.', // NEW
  rent: 'Ask about renting', // NEW. PLACEHOLDER: points at the walkthrough form until rental terms exist.
  marquee: ['Movie nights', 'Tailgates', 'Game days', 'Promotions', 'Corporate events', 'Outdoor viewing'], // NEW
};

// ---------- Garage. Black, one beam of light, a slanted metal name. Coming next: no specs, no Reserve.

export const garage = {
  ...soon('Garage'), // body SOURCE (nextUp, placeholder)
  eyebrow: 'For the car', // NEW
  features: [
    { icon: 'truck', label: 'Carries the car' },
    { icon: 'battery', label: 'Charges your EV' },
    { icon: 'sun', label: 'Solar walls fold out' },
  ], // NEW, drawn from the nextUp line
};

// ---------- Disaster Relief. Cool and desaturated, a field grid, framed corners, a readiness plate.

export const relief = {
  ...soon('Disaster Relief'), // body SOURCE (nextUp, placeholder)
  eyebrow: 'For agencies and relief teams', // NEW
  tagline: 'Power for the people who show up.', // NEW
  plate: [['Power', 'Solar and battery'], ['Shelter', 'On board'], ['Status', 'Coming next']] as [string, string][], // NEW, drawn from the nextUp line
  origin: 'Built in Middletown, NY', // NEW
  coords: '41.45° N  74.42° W', // Middletown, New York
};

// ---------- Camper. Light, quiet, sentence case, lots of room.

export const camper = {
  ...soon('Camper'), // body SOURCE (nextUp, placeholder)
  eyebrow: 'For off-grid nights', // NEW
  tagline: 'The camper that makes its own power.', // SOURCE (marketing plan draft lead line)
};

export const firstWord = {
  heading: 'Want first word on Garage, Disaster Relief or Camper?', // NEW
  sub: nextUp.sub, // SOURCE
  cta: nextUp.cta, // SOURCE
  options: nextUp.products.map((p) => p.name),
};
