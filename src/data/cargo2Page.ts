/**
 * Copy and data for /cargo-2, the new Cargo sales page. /cargo stays as it was until Nate picks one.
 *
 * v3 (2026-11-20). Rebuilt on the same pattern as /workstation-2, at Nate's request: each feature is
 * said once, in one place, packaged under a few big ideas the way the Tesla Cybertruck page does it.
 * v2's click-to-open cards repeated the options checklist, the steel frame was said twice and tool
 * charging was in two places. What stays Cargo's own is the real photo hero with the price, the 3D
 * model of the real Cargo, the fuel savings section and Nate's build heading. The copy is in Notion
 * (Company Roadmap > Website Build > Cargo, Draft v3).
 * Cargo is SPOG's most utility trailer (Nate): blue-collar, ready to get dirty, Ford vibes.
 *
 * Copy marks:
 *   NATE     his own words, or his pick
 *   SOURCE   an approved line or fact: the Cargo Trailer Messaging Report, the Objections & FAQ doc,
 *            the Warranty Policy, or the Trailer Customization Options sheet (SPOG-D-0001)
 *   NEW      written for this page (v3 approved by Nate to go live, 2026-11-20)
 *   GAP      a [BRACKET] fact Joe still has to supply. Brackets show highlighted on the page on purpose.
 *
 * Rules this page keeps:
 *   - One price only, Nate's "Starting at $10,000" in the hero.
 *   - Only facts the options sheet or Nate confirmed. No solar watts, width, lead time or payload.
 *   - The 3D model is labeled computer-generated, and its optional extras are named.
 */
import { shoot } from './content';
import type { Card, Media } from './workstation2Page';

export const meta = {
  title: 'SPOG Cargo | Enclosed cargo trailer with solar power', // NATE ("enclosed", 2026-11-19)
  description: 'The SPOG Cargo is an enclosed cargo trailer with solar power, lockable storage and a welded steel frame, built to order in Middletown, New York, in 10 or 20 ft.', // NEW (v2)
};

/** Where the two main buttons go on this page. */
export const design = { label: 'Design yours', href: '/configure/cargo' }; // NATE (button), link per his 2026-11-18 flow
export const demo = { label: 'Book a demo', href: '/demo' }; // NATE

export const hero = {
  name: 'Cargo',
  line: 'Haul all your gear, lock it up at night and run your job on solar power, all on a welded steel frame.', // NATE approved (v2)
  price: 'Starting at $10,000', // NATE (Notion, 2026-11-19: one price under the line, like Rivian)
  image: shoot.cargoHero,
  alt: 'Black SPOG Cargo trailer parked outside the SPOG shop in Middletown, New York',
};

/** Section bar that replaces the masthead once the hero scrolls away. */
export const subnavLinks: [string, string][] = [
  ['Overview', '#overview'],
  ['Tour', '#tour'],
  ['Savings', '#savings'],
  ['Anywhere', '#anywhere'],
  ['Build', '#built'],
  ['Options', '#options'],
  ['Specs', '#specs'],
  ['FAQ', '#faq'],
];

// ---------------------------------------------------------------- Redefining the job site trailer (Cybertruck: Redefining the Pickup Truck)

export const overview = {
  heading: ['Redefining the', 'job site trailer.'], // NEW (v3)
  sub: 'Built around what your crew does every day, from loading out in the morning to locking up at night.', // NEW (v3)
  cards: [
    {
      title: 'Haul it all', // NEW (Cybertruck: Bring It All)
      body: 'Up to 20 ft of enclosed space holds the tools and materials for the whole job, so nothing gets lost in the shuffle between sites. The rear barn doors swing wide for carts, ladders and gear.', // NEW, "lost in the shuffle" SOURCE (messaging report)
      media: { src: shoot.cargoStorage, alt: 'A black SPOG Cargo with both barn doors swung open, the lit interior behind them', position: '50% 50%' },
    },
    {
      title: 'Power on tap', // NEW (Cybertruck: Power On Tap)
      body: "Up to 40 kWh of battery storage runs 120, 208 or 240 V outlets for the tools, lights and chargers on your site. Pick the battery and the voltage that fit your crew, and plug into site power with a 30, 50 or 100 amp connection when it's there. [40 kWh on Cargo: confirm with Joe]", // NEW, facts SOURCE (options sheet). GAP
      media: { src: '/images/cargo2-battery-card.jpg', alt: 'Two SPOG battery units in their open aluminum cages on a low white platform inside a Cargo' }, // Better Interior 60, cropped to the batteries
    },
    {
      title: 'Set it up your way', // NEW (Cybertruck: Full Range of Motion)
      body: 'Lay out the inside with shelving, cabinets, overhead storage, a workbench and E-track, so every tool has a place. Your SPOG contact helps you plan it around how your crew works.', // NEW, options SOURCE (options sheet)
      media: { src: shoot.cargoEtrackCard, alt: 'E-track rails down the white wall of a SPOG Cargo, with the battery units on their platform', position: '50% 50%' },
    },
    {
      title: 'Lock down the site', // NEW (Cybertruck: Lockable Storage), Nate's security direction from /workstation-2
      body: "Full-height bars lock the rear doors at night, and you can add security cameras, an AI job site camera system and a horn and strobe that scare off anyone who shouldn't be there. [SECURITY: is the 6 ft mast with work lights and a camera offered on Cargo too?]", // NEW, add-ons SOURCE (options sheet). GAP
      media: { src: shoot.cargoDoorsCard, alt: 'The rear barn doors of a black SPOG Cargo, locked with two full-height bars', position: '50% 50%' },
    },
    {
      title: 'Throw the job at it', // NEW (Cybertruck: Throw Anything at It)
      body: 'Every Cargo rides on a welded steel frame with steel crossmembers across the floor, built to carry the weight of its solar and battery. Gravel lots, muddy driveways and a season of snow come with the job, and the frame is built to take them.', // NATE (steel frame), SOURCE (frame line)
      media: { video: '/images/cargo2-weld-loop.mp4', poster: '/images/cargo2-weld-loop.jpg', alt: 'A welder joining the steel frame of a SPOG trailer in the Middletown shop' },
    },
  ] as Card[],
};

// ---------------------------------------------------------------- 3D tour

export const tour = {
  kicker: 'Take a tour',
  heading: ['See how it works', 'for you.'], // NATE (Notion, 2026-11-19)
  views: [['front', 'Front'], ['side', 'Side'], ['rear', 'Rear'], ['street', 'Street side'], ['top', 'Roof'], ['interior', 'Inside']] as [string, string][],
  model: 'Computer-generated model. The finished trailer may differ.', // NATE asked for this notice (2026-11-18)
  extras: 'Shown with optional heat and AC, an office desk and tie-down track on the walls.', // NEW, names the optional items the model shows
  poster: '/images/configure-cargo.jpg',
};

// ---------------------------------------------------------------- what it saves you (Tesla: More Affordable Than a Gas Car), unchanged from v2

/** The one place the page argues the money. Tool charging lives only here (v3). */
export const replaces = {
  heading: ['Spend less on fuel', 'and on hours lost to charging.'], // NEW (v2)
  body: 'A gas generator at half load burns half to three quarters of a gallon an hour, and charging tool batteries in an idling truck burns fuel a second time.', // NEW on SOURCE (messaging report fuel math and charging)
  items: [
    { icon: 'fuel', title: 'Fewer generator hours', body: 'Your tools run on stored solar, so the generator runs less and you buy and haul less fuel.' }, // NEW
    { icon: 'battery', title: 'Charging on site', body: 'Charge tool batteries at the trailer, which keeps the truck engine off and the charging off your home power bill.' }, // NEW on SOURCE (messaging report)
    { icon: 'plug', title: 'Your own power', body: "Your crew shows up with its own power and doesn't depend on the client's outlet or the GC to keep tools running." }, // SOURCE (messaging report, commercial jobs)
  ],
  fuel: {
    value: '$260 to $530',
    label: 'a month in fuel, estimated, for a 7,500W gas generator at half load at 2026 New York gas prices.', // SOURCE (messaging report, fuel math with Lowe's and AAA sources)
  },
};

// ---------------------------------------------------------------- Take it anywhere (Cybertruck: Take on Any Terrain)

export const anywhere = {
  heading: ['Take it', 'anywhere.'], // NATE (Workstation)
  sub: 'Solar comes standard, Starlink is one add-on away, and the whole trailer hitches up and tows to the next job with the gear already inside.', // NEW (v3)
  lead: { src: shoot.cargoStatement, alt: 'Low drone view of a black SPOG Cargo outside the SPOG shop, SPOG painted on the bay doors', position: '50% 55%' } as Media,
  cards: [
    {
      title: 'Solar power',
      body: 'Panels across the roof recharge the battery every sunny day, and roof solar comes standard on every Cargo.', // NEW, SOURCE (options sheet)
      media: { src: shoot.cargoSolar, alt: 'A SPOG Cargo from above, five solar panels across the whole roof', position: '36% 20%' },
    },
    {
      title: 'Stay connected',
      body: 'Add Starlink and your crew stays online on rural sites where phones lose signal, so the daily report goes out from the job.', // NEW, NATE (Starlink)
      media: { src: shoot.cargoStarlinkCard, alt: 'Starlink dish on top of a SPOG mast against a blue sky', position: '50% 30%' },
    },
    {
      title: 'Hitch up and go',
      body: 'Cargo tows to the next site with everything already loaded, so nobody packs the truck at the end of the day and unpacks it again in the morning.', // NEW
      media: { src: shoot.cargoNoseCard, alt: 'The V nose of a black SPOG Cargo with the tongue, the jack and the spare', position: '50% 60%' },
    },
  ] as Card[],
  stats: [
    ['[WEIGHT] lbs', 'Weight'], // GAP
    ['10 or 20 ft', 'Length'], // NATE
    ['[TOW VEHICLE]', 'Tows behind'], // GAP
  ] as [string, string][],
};

// ---------------------------------------------------------------- built (Cybertruck: Designed to Be the Safest Truck on the Road)

export const built = {
  heading: ['Built for whatever', 'the job site brings.'], // NATE (2026-11-19)
  sub: 'Other companies cut corners with staples and glue. Every SPOG is designed and built by our own crew in Middletown, New York, from welding to wiring.', // NATE
  lead: { src: shoot.cargoFrame, alt: 'A welded steel trailer floor frame with steel crossmembers on the floor of the SPOG shop', position: '50% 72%' } as Media, // Nate's photo (2026-11-19)
  cards: [
    {
      title: 'Designed and tested in Middletown, NY, USA', // NATE (2026-11-19)
      body: 'We draw the frame in CAD, and the wiring, battery, solar and outlets are designed together and tested before it leaves the shop.', // NATE approved (v2), on SOURCE (Objections & FAQ)
      media: { src: shoot.engineeringCad, alt: 'A SPOG engineer working on a trailer frame in CAD', position: '30% 50%' },
    },
    {
      title: 'Backed by a 3-year structural warranty', // NATE (2026-11-19)
      body: 'Every Cargo comes with a 3-year limited structural warranty and a 1-year limited parts warranty, and if something needs work we diagnose it remotely and send our mobile service fleet to your site.', // NATE approved, facts SOURCE (Warranty Policy)
      media: { video: '/images/cargo2-shop-loop.mp4', poster: '/images/cargo2-shop-loop.jpg', alt: 'Flying through the SPOG shop floor, SPOG painted on the wall and an American flag at the far end' },
    },
  ] as Card[],
};

// ---------------------------------------------------------------- Add what you need (Cybertruck: Add What You Need)

/** Large photo cards, small tiles, then the builder, which has the full options list (it replaced v2's checklist). */
export const options = {
  heading: ['Add what', 'you need.'], // NEW (v3)
  sub: 'Pick the extras that fit your crew, or build your exact Cargo in the builder.', // NEW (v3)
  cards: [
    {
      title: 'Heat and AC',
      body: 'Add heating and cooling, and the trailer becomes a place to warm up, cool off or take a call out of the weather.', // NEW, option SOURCE (options sheet)
      media: { src: shoot.cargoHvac, alt: 'Inside a SPOG Cargo, a heating and cooling unit on the wall over the desk', position: '50% 35%' },
    },
    {
      title: 'Office desk',
      body: 'Add a desk for paperwork, plans and a laptop, so the trailer works as a small office between jobs.', // NEW, option SOURCE (options sheet)
      media: { src: shoot.cargoInterior, alt: 'A long black-topped desk down the wall of a SPOG Cargo, battery units behind it', position: '50% 62%' },
    },
    {
      title: "Your company's look",
      body: "Pick from twelve colors and put your logo and lettering on the nose, the sides or the rear, so the trailer looks right in the client's driveway.", // NEW, colors NATE, logo spots SOURCE (options sheet), driveway SOURCE (messaging report)
      media: { src: shoot.cargoProfile, alt: 'Street-side profile of a black 20 ft SPOG Cargo with the SPOG logo at the nose', position: '50% 58%' }, // A customer-branded Cargo would be stronger when one exists
    },
  ] as Card[],
  more: [
    { icon: 'pulse', name: 'Cellular router', line: 'A router gives you fast internet on sites where the cell signal is strong.' },
    { icon: 'plug', name: 'Refrigerator and microwave', line: 'Keep lunch and cold drinks on site so nobody has to drive into town.' },
    { icon: 'screen', name: 'TV or monitor', line: 'Put the drawings and the schedule up on a big screen.' },
    { icon: 'check', name: 'Whiteboard', line: 'Plan the week where the whole crew can see it.' },
  ], // NEW lines, options SOURCE (options sheet)
  link: { label: 'See every option in the builder', href: '/configure/cargo' }, // NEW
};

// ---------------------------------------------------------------- specs

export const specs = {
  heading: ['Cargo', 'at a glance.'], // NEW
  image: '/images/lineup-cargo.webp', // Nate's cut-out, on the light specs section (v3)
  alt: 'Black SPOG Cargo trailer with solar on the roof',
  rows: [
    ['Type', 'Enclosed cargo trailer'], // NATE (2026-11-19)
    ['Length', '10 or 20 ft'], // NATE
    ['Weight', '[WEIGHT] lbs'], // GAP
    ['Frame', 'Welded steel'], // NATE (2026-11-19)
    ['Standard on every trailer', 'Roof solar panels, battery storage, and insulated roof and walls'], // SOURCE (options sheet)
    ['Battery storage', '5, 10, 20 or 40 kWh, or other'], // SOURCE (options sheet). CONFIRM 40 kWh on Cargo
    ['Output voltage', '120 V, 208 V, 240 V'], // SOURCE (options sheet)
    ['Shore power connection', '30, 50 or 100 amp'], // SOURCE (options sheet)
    ['Doors', 'Large rear barn doors. Side entry door on the 20 ft shown'], // SOURCE (options sheet, Product Wiki). CONFIRM the side door on the 10 ft
    ['Interior', 'Basic, hardwearing finish'], // SOURCE (options sheet)
    ['Warranty', '1-year limited parts, 3-year limited structural'], // SOURCE (Warranty Policy)
    ['Service', 'Remote diagnosis and a mobile service fleet'], // SOURCE (Warranty Policy)
    ['Built in', 'Middletown, New York'], // SOURCE
  ] as [string, string][],
  fine: 'Options are for discussion. Availability, pricing and final specifications are confirmed in writing by SPOG.', // SOURCE (options sheet)
};

// ---------------------------------------------------------------- close and FAQ

export const close = {
  heading: 'The trailer that powers your job.', // NATE. The pitch comes back once, as a bookend
  body: 'See a SPOG up close and get your questions answered.', // NEW, as on the homepage close
};

/** Three questions (v3). The frame card and the warranty card now answer the two that were cut. */
export const faqs = [
  {
    q: 'Will it run my saws and compressor?', // SOURCE (Objections & FAQ)
    a: "It depends on the tools and the battery size. Book a demo and we'll show you the run time for the tools you use.", // NEW, as on the homepage
    link: { label: 'Book a demo', href: '/demo' },
  },
  {
    q: "Why don't I just build one myself?", // SOURCE (Objections & FAQ)
    a: "You'd have to build a frame that carries the solar and battery weight, design and test the wiring, battery, solar and outlets together, and make sure the whole build is compliant. Our crew does all of that before every Cargo leaves Middletown, so yours arrives working and compliant, with a warranty and a service team behind it.", // NATE approved. CONFIRM which standards to name
  },
  {
    q: 'Can I see one before I buy?', // NEW
    a: 'Yes, book an in-person demo or a video call, or call the shop at 1 (855) 720-2290.', // NEW
    link: { label: 'Book a demo', href: '/demo' },
  },
];
