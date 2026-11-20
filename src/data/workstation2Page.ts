/**
 * Copy and data for /workstation-2, the new Workstation sales page draft (Nate, 2026-11-19).
 * /workstation stays as it was until Nate picks one.
 *
 * The brief (Nate, 2026-11-19): the buyers are general contractors and the business people
 * behind a construction job, and owners and executives visit the site, so comfort matters.
 * They care about power, security, connectivity and quality. Workstation is often the first
 * trailer on a site with no power. Heat and AC and the security mast come standard. It's also a
 * mobile office for content creators and digital nomads. It's rugged like every SPOG, and a step
 * more upscale than Cargo because of the premium, customizable interior.
 * He asked that the layout not copy Cargo 2. Tesla and Rivian only change a page's structure when
 * the buyer changes (research 2026-11-19), so this page is built from Cybertruck and Model S
 * chapters (one heading, one paragraph, big inset media, a stat row), R2's "Includes and
 * Optional" lists, Semi's service section and Fleet's "for" lines. No swipe cards, no options
 * checklist and no savings section, which are Cargo 2's.
 *
 * Copy marks:
 *   NATE     his own words, or his pick
 *   SOURCE   an approved line or fact. Where it comes from is named: the Workstation Trailer
 *            Messaging Report, the Product Wiki (Workstation Office SPOG Trailer), the Warranty
 *            Policy, the brand kit or the Trailer Customization Options sheet (SPOG-D-0001)
 *   NEW      written for this page, needs Nate's approval
 *   CONFIRM  a fact someone still has to confirm before launch
 *
 * Rules this page keeps:
 *   - Lead with what's running (power, heat, AC, security, internet), then the interior as
 *     reassurance that it's a real office (messaging report guardrails).
 *   - No "unlimited power" and no year-round or off-grid absolutes until winter run time is
 *     tested. "No generator outside the office window" is the report's own line.
 *   - Nate's lengths only (10 or 20 ft). No solar watts, no price until Nate confirms one.
 *   - Every size is a "Workstation trailer". No edition names.
 */
import { shoot } from './content';
import { productPages, type ProductPage } from './productPages';

export const meta = {
  title: 'SPOG Workstation | Solar power site office trailer', // SOURCE (current /workstation)
  description: 'The SPOG Workstation is a site office trailer with its own solar power, heat and AC and a security mast, built in Middletown, New York, in 10 or 20 ft.', // NEW
};

/** Workstation has no builder yet, so "Design yours" opens the build request form with Workstation picked. */
export const design = { label: 'Design yours', href: '/?trailer=Workstation#design' }; // NATE (button and flow, 2026-11-18)
export const demo = { label: 'Book a demo', href: '/demo' }; // NATE

export const hero = {
  name: 'Workstation',
  line: 'Your site office shows up with its own solar power, heat and AC and a security mast, so you can run the job from day one.', // NEW. Nate wants a new line in place of "the day it lands"
  // CONFIRM with Nate: "Starting at $15,000" as on Cargo 2? The homepage says "From $15,000" next to
  // "10 or 20 ft", but the messaging report puts $15,000 on the 8 ft build. Null shows no price.
  price: null as string | null,
  video: shoot.wsHeroVideo, // Nate's drone loop, a Workstation on tow on a snowy mountain road
  poster: shoot.wsHeroPoster,
  alt: 'Drone view of a SPOG Workstation on tow along a snowy mountain road',
  stats: [
    ['Length', '10 or 20 ft'], // NATE (homepage lineup)
    ['Battery', '5 to 40 kWh'], // SOURCE (Product Wiki, messaging report)
    ['Heat, AC and security mast', 'Standard'], // NATE (2026-11-19)
  ] as [string, string][],
};

export const subnavLinks: [string, string][] = [
  ['Overview', '#overview'],
  ['Power', '#power'],
  ['Security', '#security'],
  ['Internet', '#internet'],
  ['Inside', '#inside'],
  ['Uses', '#uses'],
  ['Specs', '#specs'],
  ['FAQ', '#faq'],
];

// ---------------------------------------------------------------- comes standard (R2 "Includes" and "Optional")

export const standard = {
  heading: ['Power, heat, AC and security', 'come standard.'], // NEW
  body: 'Every Workstation trailer leaves Middletown with the essentials built in, and you add the rest to fit how your team works.', // NEW
  image: '/images/lineup-workstation.webp', // Nate's own cut-out of the navy Workstation (2026-11-19)
  imageSize: [1495, 838],
  alt: 'Navy SPOG Workstation trailer with two doors and steps',
  includes: [
    { icon: 'sun', name: 'Roof solar and battery storage' }, // SOURCE (Product Wiki)
    { icon: 'climate', name: 'Heating and cooling' }, // NATE, SOURCE (brand kit)
    { icon: 'camera', name: 'Security mast with lights and cameras' }, // NATE (2026-11-19). CONFIRM on every size, and which cameras ship
    { icon: 'desk', name: 'Built-in desks' }, // SOURCE (Product Wiki)
    { icon: 'house', name: 'Insulated walls and vinyl floor' }, // SOURCE (Product Wiki, messaging report)
    { icon: 'check', name: 'White composite or premium wood interior' }, // SOURCE (Product Wiki). CONFIRM whether wood is an upgrade
  ],
  optional: ['Starlink', 'Cellular router', 'TV or monitor', 'Refrigerator and microwave', 'Company logo and colors', 'Generator hookup'], // SOURCE (Product Wiki, options sheet, Nate's photo labels). CONFIRM the options sheet applies to Workstation
  fine: 'Your SPOG contact will confirm what fits your build.', // NATE approved wording (Cargo 2)
};

// ---------------------------------------------------------------- chapters (Cybertruck and Model S)

export const power = {
  heading: ['First on site,', 'running on its own power.'], // NEW
  body: 'On a ground-up job the site office is often the first thing on the lot, and permanent power comes much later. Solar on the roof charges the battery that runs the lights, outlets, heat and AC and internet, with no generator outside the office window.', // NEW, last phrase SOURCE (messaging report one-liner)
  media: { src: shoot.wsAerialMast, alt: 'SPOG Workstation from above, solar panels across the roof and the mast raised', position: '50% 50%' },
  stats: [
    ['5 to 40 kWh', 'Battery storage'], // SOURCE (Product Wiki)
    ['Standard', 'Roof solar'], // SOURCE (Product Wiki)
    ['Not needed', 'Utility hookup'], // SOURCE (brand kit, "No utility hookup, no generator noise.")
  ] as [string, string][],
};

/** The shared run-time tool, fed this page's battery sizes. 30 kWh is off because it isn't on the options sheet. */
export const runtime: ProductPage = {
  ...productPages.workstation,
  power: { batteries: [5, 10, 20, 40], defaultBattery: 20, devices: ['computer', 'lightTower', 'saw', 'welder'] },
};

export const security = {
  heading: ['Lights and cameras', 'over your site at night.'], // NEW
  body: "A telescopic mast comes standard on every Workstation. It raises work lights and dome cameras above the site, so you can keep an eye on the job and the trailer after the crew goes home.", // NEW on NATE (standard, 2026-11-19). CONFIRM every size, and the camera setup that ships
  media: [
    { src: shoot.wsWarehouseMast, alt: 'White SPOG Workstation in the Middletown shop with its security mast raised', position: '58% 50%', caption: 'Raised on a Workstation in the Middletown shop' }, // NEW captions
    { src: shoot.wsSecurityMast, alt: 'Work lights and two dome cameras on top of a SPOG security mast', position: '50% 45%', caption: 'Work lights and dome cameras' },
  ],
};

export const internet = {
  heading: ['Stay online where', 'cell service', 'drops out.'], // NEW
  body: 'Add Starlink to keep email, plans and calls working on rural sites, or a cellular router where the signal is strong. Your super stays on site and online instead of driving off to find a signal.', // NEW, last line SOURCE (messaging report). Options SOURCE (Product Wiki, options sheet)
  media: { src: shoot.wsStarlink, alt: 'Starlink dish on a SPOG mast against a blue sky', position: '50% 45%' },
  note: 'Starlink and the cellular router are options.', // NEW
};

// ---------------------------------------------------------------- inside (Model S "interior" and R2 "Take a closer look")

/**
 * Two real builds side by side, one in each finish (they're different trailers with different
 * layouts, so this isn't a finish switch). The 3D interior goes here once the 360 shoot exists.
 */
export const inside = {
  heading: ['An office you can', 'bring the client into.'], // NEW, built on SOURCE (messaging report: "looks professional when the client or the inspector walks in")
  body: 'Your super spends the whole day in here, and owners, clients and inspectors walk through it, so every Workstation is insulated, heated and cooled and finished like a real office. Pick the interior that fits your company.', // NEW
  builds: [
    {
      name: 'White composite', // SOURCE (Product Wiki)
      body: 'Bright, wipe-clean walls with built-in desks and a display wall for drawings, schedules and site meetings.', // NEW, display SOURCE (homepage specs)
      src: shoot.wsInteriorOffice,
      alt: 'Inside a SPOG Workstation, white walls, built-in desks and monitors on a blue accent wall',
      position: '45% 50%',
    },
    {
      name: 'Premium wood', // SOURCE (Product Wiki, Nate's photo label). CONFIRM whether it's an upgrade
      body: 'Wood walls, warm strip lighting and dark cabinets, for an office that looks the part when the owner comes through.', // NEW
      src: shoot.wsInteriorPremium,
      alt: 'Inside a SPOG Workstation, wood walls, dark cabinets and warm strip lighting along the ceiling',
      position: '50% 50%',
    },
  ],
  fine: 'Two finished Workstations shown. Your SPOG contact works out the layout with you.', // NEW
};

// ---------------------------------------------------------------- who it's for (Fleet's "for" lines)

export const uses = {
  heading: ['Run a job site', 'or work from the road.'], // NEW
  items: [
    {
      title: 'Job site office', // NEW
      body: 'For general contractors, supers and project managers who need a working office from the first day of a project, from daily reports and calls to the client walkthrough.', // NEW on SOURCE (messaging report)
      src: shoot.wsLotMastSide,
      alt: 'White SPOG Workstation on an empty lot with its mast raised under a blue sky',
      position: '42% 50%',
      // CONFIRM: a Workstation on a real job site would be stronger (Robert's shot list)
    },
    {
      title: 'Mobile office', // NATE (2026-11-19)
      body: 'For content creators, consultants and digital nomads who want a real desk on the road, with heat and AC, a premium interior and optional Starlink.', // NEW on NATE
      video: '/images/ws2-remote-loop.mp4', // From Nate's influencer video: the empty wood office, someone at the desk from behind, the monitors. No faces, car or driveway.
      poster: '/images/ws2-remote-loop.jpg', // CONFIRM the person in it is cleared to appear
      alt: 'Inside a wood-walled SPOG Workstation, a desk with two monitors and someone at work',
    },
  ],
};

// ---------------------------------------------------------------- what it replaces (approved brand line)

export const equation = {
  heading: ['One trailer.', 'Three problems solved.'], // SOURCE (brand kit, approved)
  sub: 'The office, the power and the security, in one tow.', // SOURCE (current /workstation)
  parts: [
    { icon: 'desk', title: 'Site office', body: 'Built-in desks, an insulated interior and heat and AC as standard.' }, // SOURCE (Product Wiki, brand kit)
    { icon: 'battery', title: 'Generator', body: 'Roof solar and 5 to 40 kWh of battery run the office.' }, // SOURCE (Product Wiki)
    { icon: 'camera', title: 'Security', body: 'A mast with lights and cameras watches the site after the crew leaves.' }, // NATE (standard, 2026-11-19)
  ],
  result: { label: 'Equals', body: 'All three in one tow.' }, // SOURCE (current /workstation)
};

// ---------------------------------------------------------------- built and serviced (Semi "Service your fleet")

export const built = {
  heading: ['Built in Middletown,', 'serviced on your site.'], // NEW
  body: 'Our own crew welds, wires and tests every Workstation in Middletown, New York. If something needs work, we diagnose it remotely and send our mobile service fleet to your site.', // NEW on SOURCE (Warranty Policy, Objections & FAQ)
  video: '/images/about-shop-loop.mp4', // Nate's warehouse fly-through and the welder on the shop floor (homepage About band)
  poster: '/images/about-shop-loop.jpg',
  stats: [
    ['3 years', 'Limited structural warranty'], // SOURCE (Warranty Policy)
    ['1 year', 'Limited parts warranty'], // SOURCE (Warranty Policy)
    ['On site', 'Mobile service fleet'], // SOURCE (Warranty Policy)
  ] as [string, string][],
};

// ---------------------------------------------------------------- specs, close and FAQ

export const specs = {
  heading: ['Workstation', 'at a glance.'], // NEW
  image: shoot.wsNavyStudio,
  alt: 'Navy SPOG Workstation in the Middletown shop, side view',
  rows: [
    ['Type', 'Site office trailer'], // NEW
    ['Length', '10 or 20 ft'], // NATE
    ['Battery storage', '5 to 40 kWh'], // SOURCE (Product Wiki)
    ['Roof solar', 'Standard'], // SOURCE (Product Wiki)
    ['Heating and cooling', 'Standard'], // NATE, SOURCE (brand kit)
    ['Security mast', 'Standard, with lights and cameras'], // NATE (2026-11-19). CONFIRM every size
    ['Interior', 'White composite or premium wood, with built-in desks'], // SOURCE (Product Wiki)
    ['Floor', 'Insulated vinyl'], // SOURCE (Product Wiki)
    ['Internet', 'Starlink or a cellular router, optional'], // SOURCE (Product Wiki, options sheet)
    ['Buy or rent', 'Both'], // SOURCE (Product Wiki). CONFIRM rental is offered publicly
    ['Warranty', '1-year limited parts, 3-year limited structural'], // SOURCE (Warranty Policy)
    ['Service', 'Remote diagnosis and a mobile service fleet'], // SOURCE (Warranty Policy)
    ['Built in', 'Middletown, New York'], // SOURCE
  ] as [string, string][],
  fine: 'Options are for discussion. Availability, pricing and final specifications are confirmed in writing by SPOG.', // SOURCE (options sheet)
};

export const close = {
  heading: 'Run the job from day one.', // SOURCE (messaging report one-liner, trimmed)
  body: 'See a Workstation up close and get your questions answered.', // NEW, as on Cargo 2
};

/** Six Workstation questions. The run-time answer is honest until winter run time is tested. */
export const faqs = [
  {
    q: 'Will the battery run the heat and AC all day?', // SOURCE (messaging report objection)
    a: "It depends on the battery size, the weather and how the office is used. Book a demo and we'll walk you through the run time for your site and season.", // NEW. CONFIRM: swap in tested winter and summer run times when they exist
    link: { label: 'Book a demo', href: '/demo' },
  },
  {
    q: 'Is the security mast included?', // NEW
    a: 'Yes, a telescopic mast with work lights and cameras comes standard on the Workstation.', // NATE (2026-11-19). CONFIRM every size
  },
  {
    q: 'Can I get internet on a site with no cell service?', // SOURCE (messaging report)
    a: 'Yes, add Starlink for rural sites, or a cellular router where the signal is strong.', // NEW, options SOURCE
  },
  {
    q: 'Can I add a generator hookup?', // NEW
    a: 'Yes, a generator hookup is available as an option if you want a backup.', // NEW, from Nate's photo label "Optional generator hookup". CONFIRM
  },
  {
    q: 'Can I rent a Workstation instead of buying one?', // SOURCE (messaging report, Most Aware)
    a: 'Yes, Workstations can be bought or rented. Ask your SPOG contact about rental terms for your project.', // SOURCE (Product Wiki). CONFIRM rental terms are ready
    link: { label: 'Book a demo', href: '/demo' },
  },
  {
    q: 'What happens if something needs repair?', // SOURCE (homepage FAQ question)
    a: 'Every Workstation comes with a 3-year limited structural warranty and a 1-year limited parts warranty. We diagnose problems remotely, and our mobile service fleet repairs on site.', // SOURCE (Warranty Policy)
  },
];
