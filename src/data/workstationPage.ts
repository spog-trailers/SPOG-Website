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
 * Facts brought in line with SPOG's external price sheet and Nate's answers on 2026-11-20: 10 or 20 ft,
 * 5 to 20 kWh, climate control standard, one built-in work desk, no shelving, cabinets or overhead
 * storage, the 6 ft telescopic light is an add-on with no camera, and the only camera comes with the
 * 28 ft light tower package on the 20 ft.
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
  description: 'A site office with its own solar, battery and climate control, for general contractors and subs. Built in Middletown, New York.', // NATE (2026-11-20 answers: climate control)
};

export const hero = {
  // Nate's drone footage (2026-11-17): an SUV towing a Workstation along a snowy mountain road.
  video: shoot.wsHeroVideo,
  poster: shoot.wsHeroPoster,
  alt: 'Drone view of an SUV towing a SPOG Workstation along a snowy mountain road',
  eyebrow: { gold: 'Mobile office', text: 'For general contractors and subs' }, // NEW (category matches the test homepage card)
  tag: p.tag, // SOURCE (homepage lineup tag)
  body: 'Climate control, a built-in work desk and its own solar power ride on the trailer. The super runs the job from day one.', // NEW, adapted from useCases (office). One desk standard, "climate control" SOURCE (price sheet 2026-11-20), NATE (2026-11-20 answers)
  stats: [
    ['Battery', stat('Battery')],
    ['Solar up to', stat('Solar up to')],
    ['Climate control', spec('Climate control')],
  ] as [string, string][], // SOURCE (products). "Climate control" label NATE (2026-11-20 answers)
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
      intro: 'Every Workstation comes with a built-in work desk, so site meetings and paperwork move off the tailgate and into the office.', // NEW (2026-11-20), facts SOURCE (price sheet 2026-11-20). Storage and the standard display came off.
      points: [
        { title: 'More desks', body: 'Add more desks for the rest of the team.' }, // NEW (2026-11-20), NATE (2026-11-20 answers: extra desks stay available)
        { title: 'TV or monitor', body: 'Add a screen for drawings, schedules and site meetings.' }, // NEW (2026-11-20), NATE (2026-11-20 answers: TV or monitor is an add-on)
      ],
    },
  },
  {
    id: 'climate',
    title: 'Climate control', // NATE (2026-11-20 answers: "climate control", never HVAC)
    line: 'Standard on every Workstation.', // SOURCE (brand guide, price sheet 2026-11-20)
    image: shoot.wsHvac,
    alt: 'Heating and cooling unit in an open side compartment of a white SPOG Workstation',
    position: '62% 50%',
    panel: {
      // SOURCE (price sheet 2026-11-20). The card line already says it's standard, so the intro and the
      // "Climate control: Standard" stat that repeated it were cut (2026-11-20). The "July and January" tail was a year-round claim, cut.
      intro: 'The 20 ft heats and cools on a hyper-heating heat pump.',
    },
  },
  {
    id: 'offgrid',
    title: 'Off the grid',
    line: 'It brings its own power to the site.', // NEW (2026-11-20). Replaced "No fuel run before work.", a "before" line.
    image: shoot.wsRuralSunset,
    alt: 'SPOG trailer parked by a farm field at sunset, awning open',
    position: '40% 50%',
    panel: {
      // NEW. Was "No generator". Renamed because Nate's photos show an optional generator hookup (see options).
      // NEW (2026-11-20). Off-grid claim ("wherever it parks") and the "before work" line cut.
      intro: "The office runs on its own battery, and the roof solar refills it during the day, so there's no utility hookup to wait on and no fuel to haul.",
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
 * photo per option with a short line. Facts from SPOG's price sheet and Nate's answers (2026-11-20).
 * The premium wood interior is a free choice on the 20 ft, so it sits here as a choice, not an add-on.
 */
export const optionsHead = {
  kicker: 'Options', // NEW
  heading: ['Make it', 'your office.'], // NEW
};

export const options = [
  {
    id: 'security',
    title: 'Light tower',
    // NEW (2026-11-20), facts SOURCE (price sheet 2026-11-20) and NATE (2026-11-20 answers): the 6 ft light has no camera, the tower package is 20 ft only.
    body: 'Add a 6 ft telescopic light to keep the lot lit at night, for security and so the crew can keep working after the sun goes down. On the 20 ft, the 28 ft light tower package adds a security camera, AI or regular, and a horn.',
    // SOURCE (2026-11-20 facts pass): leads with the raised 28 ft light tower, which carries the one camera. Was the shop close-up
    // of a short mast with two dome cameras, which read as cameras on the 6 ft light. CONFIRM with Nate.
    image: shoot.wsOptTower,
    alt: 'A white SPOG Workstation on an empty lot with its 28 ft light tower raised',
    position: '50% 50%',
    more: { src: shoot.wsMastTall, alt: 'SPOG Workstation on a lot with its telescopic mast fully raised' },
  },
  {
    id: 'starlink',
    title: 'Starlink',
    body: 'The Starlink option keeps email, plans and the phone working where cell service drops out. We install the dish, and you set up your own Starlink plan.', // first sentence SOURCE (useCases, rural), reworded. Second NEW (2026-11-20), NATE (2026-11-20 answers: covers the dish and the install, the buyer gets the plan)
    image: '/images/cargo2-starlink-dish-card.jpg', // SOURCE (2026-11-20 facts pass): no cameras in frame. Same crop as the Cargo 2 Stay connected card.
    alt: 'Starlink dish on top of a SPOG mast against a blue sky',
    position: '50% 50%',
  },
  {
    id: 'premium',
    title: 'Premium wood interior', // SOURCE (price sheet 2026-11-20)
    // NEW (2026-11-20), facts SOURCE (price sheet 2026-11-20): on the 20 ft, white composite or premium wood is a free choice.
    // The photo shows dark cabinets, which are no longer offered. Swap the photo when a cabinet-free shot exists.
    body: 'On the 20 ft, pick wood walls in place of the white panels at no extra cost, for an office you can bring a client into.',
    image: shoot.wsInteriorPremium,
    alt: 'Workstation interior with wood walls and warm strip lighting',
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
    // NEW (2026-11-20): the outcome only. The desk and climate control are said in the hero and the feature cards.
    { icon: 'desk', title: 'Site office', body: "The trailer is the site office, so there's no separate office to rent and set up." },
    { icon: 'battery', title: 'Generator', body: `${stat('Battery')} of battery, refilled by up to ${stat('Solar up to')} of solar.` }, // SOURCE (products)
    // NEW (2026-11-20): the outcome only. The 6 ft light and the 28 ft tower are said once, in options (Light tower).
    { icon: 'camera', title: 'Security', body: 'Light and camera add-ons keep the lot lit and watched after the crew leaves.' },
  ],
  result: { label: 'Equals', body: 'All three in one tow.' }, // NEW
};

/**
 * The shared runtime and size sections, fed a Workstation page with office devices.
 * Devices come only from `devices` in productPages.ts (SPOG's runtime guide). The air fryer is
 * left off this page, and so is the fridge (same draw as the computer, so the same hours).
 * Battery stops stay inside 5 to 20 kWh, in the 5 kWh steps the price sheet sells (2026-11-20).
 */
export const page: ProductPage = {
  ...productPages.workstation,
  power: { batteries: [5, 10, 15, 20], defaultBattery: 10, devices: ['computer', 'lightTower', 'saw', 'welder'] }, // SOURCE (price sheet 2026-11-20: 5 or 10 kWh base, 20 kWh max)
};

/** Quiet band for the second buyer, after the GC story (Nate's sitemap). */
export const remote = {
  kicker: 'Also a remote office', // NEW
  heading: ['Take the office', 'on the road.'], // NEW
  body: 'The same work desk, power and Starlink option suit people who work from the road, from consultants to creators.', // NEW. "work desk" for "desks" (price sheet 2026-11-20: one desk standard)
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
