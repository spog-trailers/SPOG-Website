/**
 * Test homepage at /test-home (draft, 2026-11-17). The live homepage is untouched.
 *
 * One brand, a different look per buyer: Work (Cargo, Workstation), Event, Garage,
 * Disaster Relief and Camper. Montserrat, the color tokens, the nav and the button shapes
 * stay the same everywhere. What changes is the photo grade, how the name is set,
 * the light, the motion and the copy rhythm.
 *
 * Copy marks:
 *   NEW     written for this draft, needs Nate's approval
 *   SOURCE  reused from content.ts, the brand kit's approved lines or the marketing plan
 * Stats come only from `products` in content.ts. Coming-next trailers get no specs and no Reserve.
 */
import { img, products, nextUp, numbers, problem } from './content';

export { numbers, problem };

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
  primary: 'Find your SPOG', // NEW
};

export const lineup = {
  eyebrow: 'The lineup', // NEW
  heading: 'Find your SPOG.', // NEW
  sub: 'Every trailer runs on the same solar and battery system. Pick the one built for your work.', // NEW
  groups: [
    { label: 'On the job site', ids: ['cargo', 'workstation'] }, // NEW
    { label: 'At the event', ids: ['event'] }, // NEW
    { label: 'Coming next', ids: ['garage', 'relief', 'camper'] },
  ],
};

/** Lineup tiles. `for` lines are NEW. */
export const tiles: Record<string, { name: string; for: string; live: boolean; image: string; alt: string; position: string }> = {
  cargo: { name: 'Cargo', for: 'For the crew', live: true, image: img.cargo34, alt: 'SPOG Cargo trailer', position: '50% 45%' },
  workstation: { name: 'Workstation', for: 'For the site office', live: true, image: img.hero, alt: 'SPOG Workstation trailers on a lot at sunrise', position: '62% 62%' },
  event: { name: 'Event', for: 'For venues and hosts', live: true, image: img.eventMovieNight, alt: 'Crowd watching an outdoor movie on a SPOG Event trailer', position: '28% 60%' },
  garage: { name: 'Garage', for: 'For the car', live: false, image: img.garageEv, alt: 'Electric car inside a lit SPOG Garage trailer', position: '55% 50%' },
  relief: { name: 'Disaster Relief', for: 'For relief teams', live: false, image: img.disasterSolar, alt: 'SPOG Disaster Relief trailer with solar panels deployed', position: '50% 50%' },
  camper: { name: 'Camper', for: 'For off-grid nights', live: false, image: img.camperCampfire, alt: 'SPOG Camper trailer by a campfire', position: '70% 55%' },
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

export const jobsite = {
  eyebrow: { gold: 'For the job site', text: 'Why crews switch' }, // NEW
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
