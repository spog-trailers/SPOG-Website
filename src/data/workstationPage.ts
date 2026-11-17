/**
 * Workstation product page at /workstation (2026-11-17). Started as the draft at
 * /test-workstation, which now redirects here.
 *
 * Written for general contractors and subs. Nate wants this page to lean heavily into the GC
 * benefit, with its own look (see docs/product-page-teardown-workstation-2026-11-17.md).
 * The look is the "work" look shared with Cargo: heavy uppercase type, warm daylight, a lot of
 * white space (after Ring's Jobsite Security page), and one dark chapter for the numbers
 * (after Tesla's Cybertruck page).
 *
 * Copy marks:
 *   NEW          written for this draft, needs Nate's approval
 *   SOURCE       reused from content.ts, the brand kit's approved lines or spogtrailers.com
 *   PLACEHOLDER  stands in until the real thing exists or is confirmed
 * Headline numbers come from `products` in content.ts. Don't retype them here.
 * No prices and no configurator link.
 */
import { products, shoot } from './content';
import { productPages, type ProductPage } from './productPages';
import type { Feature } from './features';

const p = products.find((x) => x.id === 'workstation')!;
const stat = (k: string) => (p.stats as [string, string][]).find(([key]) => key === k)![1];
const spec = (k: string) => (p.specs as [string, string][]).find(([key]) => key === k)![1];

export const ws = {
  name: p.name,
  cta: p.cta, // SOURCE
  title: 'SPOG Workstation | Solar power site office trailer', // NEW
  description: 'A site office with its own solar, battery, heat and AC, for general contractors and subs. Built in Middletown, New York.', // NEW
};

export const hero = {
  // Nate's drone footage (2026-11-17): an SUV towing a Workstation along a snowy mountain road.
  video: shoot.wsHeroVideo,
  poster: shoot.wsHeroPoster,
  alt: 'Drone view of an SUV towing a SPOG Workstation along a snowy mountain road',
  eyebrow: { gold: 'Mobile office', text: 'For general contractors and subs' }, // NEW (category matches the test homepage card)
  tag: p.tag, // SOURCE (homepage lineup tag)
  body: 'Heat, AC, desks and its own solar power ride on the trailer. The super runs the job from day one.', // NEW, adapted from useCases (office)
  stats: [
    ['Battery', stat('Battery')],
    ['Solar up to', stat('Solar up to')],
    ['Heat and AC', spec('Heat and AC')],
  ] as [string, string][], // SOURCE (products)
};

/**
 * "Get to know" cards right after the hero, after Rivian's R1T, Tesla's Model Y and Pebble's
 * feature sections (see FeatureCards.astro). Each card is a standard feature plus the GC
 * outcome it delivers, and the panel holds the detail. Photos are Nate's (2026-11-17).
 * Add-ons live in `options` below, with their own big photos.
 */
export const featuresHead = {
  kicker: 'Get to know Workstation', // NEW
  heading: ['Power, heat and air', 'from day one.'], // NEW
};

export const features: Feature[] = [
  {
    id: 'power',
    title: 'Solar and battery',
    line: 'Power before temp power.', // NEW
    image: shoot.wsAerialMast,
    alt: 'SPOG Workstation from above, solar panels across the roof and the mast raised',
    position: '50% 50%',
    panel: {
      // NEW, from useCases (commercial) and the old Workstation tile
      intro: "Ground-up builds often have no power until service comes in. Workstation brings its own, and the solar refills the battery while the office runs.",
      stats: [['Battery', stat('Battery')], ['Solar up to', stat('Solar up to')]], // SOURCE (products)
      link: { label: 'See what it runs', href: '#power' }, // NEW
    },
  },
  {
    id: 'office',
    title: 'The office',
    line: 'Open on day one.', // NEW
    image: shoot.wsInteriorOffice,
    alt: 'Inside a SPOG Workstation, desks along the walls and monitors on a blue accent wall',
    position: '45% 50%',
    panel: {
      intro: 'Desks, storage, a display for the plans, and heat and AC standard. Site meetings and paperwork move off the tailgate and into the office.', // NEW
      points: [
        { title: 'Desks and storage', body: 'Built-in desks and storage for plans, files and laptops.' }, // SOURCE (products specs)
        { title: 'Wall display', body: 'A display for drawings, schedules and site meetings.' }, // SOURCE (products specs, "display")
      ],
    },
  },
  {
    id: 'climate',
    title: 'Heat and AC',
    line: 'Standard on every Workstation.', // SOURCE (brand guide)
    image: shoot.wsHvac,
    alt: 'Heating and cooling unit in an open side compartment of a white SPOG Workstation',
    position: '62% 50%',
    panel: {
      intro: 'Every Workstation comes with heating and cooling, so the office works in July and in January.', // first half SOURCE (brand guide), second half NEW
      stats: [['Heat and AC', spec('Heat and AC')]], // SOURCE (products)
    },
  },
  {
    id: 'offgrid',
    title: 'Off the grid',
    line: 'No fuel run before work.', // SOURCE (homepage statement)
    image: shoot.wsRuralSunset,
    alt: 'SPOG trailer parked by a farm field at sunset, awning open',
    position: '40% 50%',
    panel: {
      // NEW. Was "No generator". Renamed because Nate's photos show an optional generator hookup (see options).
      intro: 'No utility hookup and no fuel run before work. Solar and battery run the office wherever it parks.',
    },
  },
  {
    id: 'built',
    title: 'Built in America',
    line: 'Welded and wired in Middletown.', // NEW, fact SOURCE (Built, Nate's photo labels)
    image: shoot.shopWelding,
    alt: 'Welder joining a steel trailer frame in the SPOG shop',
    position: '35% 50%',
    panel: {
      intro: 'Every Workstation is engineered in CAD, then welded, wired and finished by hand in Middletown, New York.', // NEW, from Nate's photo labels
      more: [
        { src: shoot.engineeringCad, alt: 'Engineer working on a trailer frame in CAD', position: '30% 50%' },
        { src: shoot.wsFlagShop, alt: 'White SPOG Workstation in the Middletown shop under an American flag', position: '62% 50%' },
      ],
    },
  },
];

/**
 * Options and add-ons, after the accessory sections on the Rivian and Tesla pages: one big
 * photo per option with a short line. Sources are Nate's photo labels (2026-11-17) and the
 * old spogtrailers.com Workstation page ("optional jobsite lighting and security cameras",
 * "Starlink option").
 */
export const optionsHead = {
  kicker: 'Options', // NEW
  heading: ['Make it', 'your office.'], // NEW
};

export const options = [
  {
    id: 'security',
    title: 'Security mast',
    body: 'A telescopic mast lifts lights and cameras above the site, so you can keep watch after the crew leaves.', // NEW
    image: shoot.wsSecurityMast,
    alt: 'Lights and security cameras on top of the mast on a white SPOG Workstation',
    position: '50% 40%',
    more: { src: shoot.wsMastTall, alt: 'SPOG Workstation on a lot with its telescopic mast fully raised' },
  },
  {
    id: 'starlink',
    title: 'Starlink',
    body: 'The Starlink option keeps email, plans and the phone working where cell service drops out.', // SOURCE (useCases, rural), reworded
    image: shoot.wsStarlink,
    alt: 'Starlink dish and cameras on top of a SPOG mast against a blue sky',
    position: '50% 45%',
  },
  {
    id: 'premium',
    title: 'Premium interior',
    // PLACEHOLDER: from Nate's photo label "Workstation premium interior". Confirm it's an option and what it includes.
    body: 'Wood walls, warm lighting and dark cabinets, for an office you can bring a client into.', // NEW
    image: shoot.wsInteriorPremium,
    alt: 'Workstation interior with wood walls, dark cabinets and warm strip lighting',
    position: '50% 50%',
  },
  {
    id: 'generator',
    title: 'Generator hookup',
    // PLACEHOLDER: from Nate's photo label "Optional generator hookup". It sits against the approved
    // line "No utility hookup, no generator noise." Nate to confirm how to present it.
    body: 'Solar and battery run the office. If you want a backup, a generator plugs into the trailer.', // NEW
    image: shoot.wsGenerator,
    alt: 'Portable generator plugged into a SPOG trailer on a lawn',
    position: '35% 60%',
  },
];

/** Full-width photo breaks, huge like the reference pages. */
export const showcase = {
  image: shoot.wsNavyStudio,
  alt: 'Navy SPOG Workstation in the Middletown shop',
  position: '50% 62%',
  caption: 'In the Middletown shop', // NEW
};

export const statement = {
  image: shoot.wsLotMastSide,
  alt: 'White SPOG Workstation on an empty lot with its mast raised under a blue sky',
  position: '50% 30%',
  heading: 'Powering the Builders of America.', // SOURCE (brand tagline)
};

/** The GC equation. Heading is the approved brand line (Office Trailer + Generator + Security = SPOG). */
export const equation = {
  kicker: 'What it replaces', // NEW
  heading: ['One trailer.', 'Three problems solved.'], // SOURCE (brand kit, approved)
  sub: 'The office, the power and the security, in one tow.', // NEW
  parts: [
    { icon: 'desk', title: 'Site office', body: 'Desks, storage and a display, with heat and AC standard.' }, // SOURCE (products specs, brand guide)
    { icon: 'battery', title: 'Generator', body: `${stat('Battery')} of battery, refilled by up to ${stat('Solar up to')} of solar.` }, // SOURCE (products)
    // SOURCE: spogtrailers.com Workstation page ("optional jobsite lighting and security cameras") and Nate's photo labels
    { icon: 'camera', title: 'Security', body: 'Optional cameras and jobsite lighting watch the site after the crew leaves.' }, // NEW
  ],
  result: { label: 'Equals', body: 'All three in one tow.' }, // NEW
};

/**
 * The shared runtime and size sections, fed a Workstation page with office devices.
 * Devices come only from `devices` in productPages.ts (SPOG's runtime guide). The air fryer is
 * left off this page, and so is the fridge (same draw as the computer, so the same hours). Battery stops stay inside 5 to 40 kWh.
 */
export const page: ProductPage = {
  ...productPages.workstation,
  power: { batteries: [5, 10, 20, 30, 40], defaultBattery: 20, devices: ['computer', 'lightTower', 'saw', 'welder'] },
};

/** Quiet band for the second buyer, after the GC story (Nate's sitemap). */
export const remote = {
  kicker: 'Also a remote office', // NEW
  heading: ['Take the office', 'on the road.'], // NEW
  body: 'The same desks, power and Starlink option suit people who work from the road, from consultants to creators.', // NEW
  // Nate's dusk shot. A Tesla Cybertruck is in the frame, so check that's fine before launch.
  image: shoot.wsDusk,
  alt: 'Dark SPOG trailer at dusk on a country road',
  // PLACEHOLDER: point at the remote office landing page once it exists. Until then it opens the walkthrough form.
  cta: 'Ask about remote work', // NEW
  href: '#walkthrough',
};

export const close: [string, string] = ['Open on', 'day one.']; // NEW, echoes the first outcome

export const subnavLinks: [string, string][] = [
  ['Overview', '#overview'],
  ['Options', '#options'],
  ['Power', '#power'],
  ['Size', '#size'],
  ['Specs', '#specs'],
  ['FAQ', '#faq'],
];
