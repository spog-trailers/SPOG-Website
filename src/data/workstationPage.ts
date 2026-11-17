/**
 * Workstation product page draft at /test-workstation (2026-11-17). The live /workstation page
 * (shared template) is untouched until Nate picks a direction.
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
import { img, products } from './content';
import { productPages, type ProductPage } from './productPages';
import type { Feature } from './features';

const p = products.find((x) => x.id === 'workstation')!;
const stat = (k: string) => (p.stats as [string, string][]).find(([key]) => key === k)![1];
const spec = (k: string) => (p.specs as [string, string][]).find(([key]) => key === k)![1];

export const ws = {
  name: p.name,
  cta: p.cta, // SOURCE
  title: 'SPOG Workstation | Solar power site office trailer (draft)', // NEW
  description: 'A site office with its own solar, battery, heat and AC, for general contractors and subs. Built in Middletown, New York.', // NEW
};

export const hero = {
  // PHOTO: the Red Rocks sunrise shot, the only wide Workstation photo. Replace with Robert's site office shot.
  image: img.hero,
  alt: 'SPOG Workstation trailers on a lot at sunrise, solar wings open',
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
 * feature sections (see FeatureCards.astro). Each card is a feature plus the GC outcome it
 * delivers, and the panel holds the detail.
 * PHOTOS: there's no confirmed Workstation photo except the hero. The two photo cards show
 * hardware every SPOG shares (solar wing, trailers on a lot) from the Red Rocks shoot, with
 * neutral alt text. The three plates are waiting on Robert's shots (see CLAUDE.md).
 * Security is left off until cameras are confirmed.
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
    image: img.cardWing,
    alt: 'Solar panel raised on the roof of a SPOG trailer',
    position: '50% 30%',
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
    plate: { icon: 'desk' },
    panel: {
      intro: 'Desks, storage, a display for the plans, and heat and AC standard. Site meetings and paperwork move off the tailgate and into the office.', // NEW
      // PHOTO: 695 x 360 render from spogtrailers.com, shown at its own size. Replace with a real interior photo.
      media: { src: img.office, alt: 'Inside a SPOG Workstation with desks, chairs, storage and a wall display showing drawings', width: 695, height: 360, natural: true },
      points: [
        { title: 'Desks and storage', body: 'Built-in desks and storage for plans, files and laptops.' }, // SOURCE (products specs)
        { title: 'Wall display', body: 'A display for drawings, schedules and site meetings.' }, // SOURCE (products specs, "display")
      ],
    },
  },
  {
    id: 'generator',
    title: 'No generator',
    line: 'No fuel run before work.', // SOURCE (homepage statement)
    image: img.statementBg,
    alt: 'Two SPOG trailers parked with their solar panels raised',
    position: '32% 50%',
    panel: {
      intro: 'No utility hookup, no generator noise and no fuel run before work. The power is already on the trailer when it lands.', // first line SOURCE (brand kit), second NEW
    },
  },
  {
    id: 'climate',
    title: 'Heat and AC',
    line: 'Standard on every Workstation.', // SOURCE (brand guide)
    plate: { icon: 'climate' },
    panel: {
      intro: 'Every Workstation comes with heating and cooling, so the office works in July and in January.', // first half SOURCE (brand guide), second half NEW
      stats: [['Heat and AC', spec('Heat and AC')]], // SOURCE (products)
    },
  },
  {
    id: 'starlink',
    title: 'Starlink option',
    line: 'Signal past the grid.', // NEW
    plate: { icon: 'wifi' },
    panel: {
      intro: 'The Starlink option keeps email, plans and the phone working where cell service drops out.', // SOURCE (useCases, rural), reworded
    },
  },
];

/** The GC equation. Heading is the approved brand line (Office Trailer + Generator + Security = SPOG). */
export const equation = {
  kicker: 'What it replaces', // NEW
  heading: ['One trailer.', 'Three problems solved.'], // SOURCE (brand kit, approved)
  sub: 'The office, the power and the security, in one tow.', // NEW
  parts: [
    { icon: 'desk', title: 'Site office', body: 'Desks, storage and a display, with heat and AC standard.' }, // SOURCE (products specs, brand guide)
    { icon: 'battery', title: 'Generator', body: `${stat('Battery')} of battery, refilled by up to ${stat('Solar up to')} of solar.` }, // SOURCE (products)
    // PLACEHOLDER SOURCE: spogtrailers.com Workstation page ("optional jobsite lighting and security cameras"). Confirm.
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
  // PLACEHOLDER: point at the remote office landing page once it exists. Until then it opens the walkthrough form.
  cta: 'Ask about remote work', // NEW
  href: '#walkthrough',
};

export const close: [string, string] = ['Open on', 'day one.']; // NEW, echoes the first outcome

export const subnavLinks: [string, string][] = [
  ['Overview', '#overview'],
  ['Power', '#power'],
  ['Size', '#size'],
  ['Specs', '#specs'],
  ['FAQ', '#faq'],
];
