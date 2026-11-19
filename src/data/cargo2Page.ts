/**
 * Copy and data for /cargo-2, the new Cargo sales page (Nate, 2026-11-19), after the Tesla
 * Model Y and Rivian R1T product pages. /cargo stays as it was until Nate picks one.
 *
 * v2 (2026-11-19). Nate found v1 repeated "a trailer you need anyway, with power" in nearly
 * every section. v2 is built around what GCs and subs buy (power, security and storage, with
 * heat and AC, Starlink and a custom look as add-ons), tied together by build quality. The
 * core pitch appears four times only: the hero line, the Power card, the savings section and
 * the close. The copy was reviewed in Notion (Company Roadmap > Website Build > Cargo).
 * Cargo is SPOG's most utility trailer (Nate): blue-collar, ready to get dirty, Ford vibes.
 * Keep the polish for Workstation and Event.
 *
 * Copy marks:
 *   NATE     his own words, or his pick
 *   SOURCE   an approved line. Where it comes from is named: the Cargo Trailer Messaging Report,
 *            the Objections & FAQ doc and the Warranty Policy (Notion, Foundations Documents
 *            Database), or the Trailer Customization Options sheet (SPOG-D-0001, Nov 17 2026)
 *   NEW      written for this page, needs Nate's approval
 *   CONFIRM  a fact someone still has to confirm before launch
 *
 * Rules this page keeps (CLAUDE.md and the messaging report's guardrails):
 *   - One price only, Nate's "Starting at $10,000" in the hero.
 *   - Only facts the options sheet or Nate confirmed. No solar watts, width, lead time, payload,
 *     tow weight or delivery, because none of those are settled.
 *   - Options shown as options. "Storage" always sits in a sentence with power.
 *   - The 3D model is labeled computer-generated, and its optional extras are named.
 */
import { img, shoot } from './content';
import type { Feature } from './features';

export const meta = {
  title: 'SPOG Cargo | Enclosed cargo trailer with solar power', // NATE ("enclosed", 2026-11-19)
  description: 'The SPOG Cargo is an enclosed cargo trailer with solar power, lockable storage and a welded steel frame, built to order in Middletown, New York, in 10 or 20 ft.', // NEW (v2)
};

/** Where the two main buttons go on this page. */
export const design = { label: 'Design yours', href: '/configure/cargo' }; // NATE (button), link per his 2026-11-18 flow
export const demo = { label: 'Book a demo', href: '/demo' }; // NATE

export const hero = {
  name: 'Cargo', // The "Enclosed cargo trailer" line under it was cut at Nate's call (v2). The phrase stays in the title, description and specs.
  line: 'Haul all your gear, lock it up at night and run your job on solar power, all on a welded steel frame.', // NEW. Nate asked to merge his line and the subhead into one (v2)
  price: 'Starting at $10,000', // NATE (Notion, 2026-11-19: one price under the line, like Rivian)
  image: shoot.cargoHero,
  alt: 'Black SPOG Cargo trailer parked outside the SPOG shop in Middletown, New York',
};

/** Section bar that replaces the masthead once the hero scrolls away. */
export const subnavLinks: [string, string][] = [
  ['Overview', '#overview'],
  ['Build', '#build'],
  ['Tour', '#tour'],
  ['Savings', '#savings'],
  ['Options', '#options'],
  ['Specs', '#specs'],
  ['FAQ', '#faq'],
];

// ---------------------------------------------------------------- Get to know Cargo

/** One card per thing a contractor is buying, after Tesla's "Meet Model Y" cards (v2). */
export const featuresHead = {
  kicker: 'Get to know Cargo',
  heading: ['Power, security and storage', 'in one enclosed trailer.'], // NEW (v2)
};

export const features: Feature[] = [
  {
    id: 'power',
    title: 'Power',
    line: 'Free power wherever you go.', // NATE (Notion, 2026-11-19)
    image: shoot.cargoSolarCard,
    alt: 'SPOG Cargo from above, solar panels across the whole roof',
    position: '50% 55%',
    panel: {
      intro: 'Solar panels on the roof charge the battery on board, and it runs your tools, lights and chargers through 120, 208 or 240 V outlets. When the site has power, plug in with a 30, 50 or 100 amp shore connection.', // NEW, facts SOURCE (options sheet)
      media: { src: shoot.cargoSolar, alt: 'Five solar panels across the roof of a black SPOG Cargo', width: 2400, height: 1600 },
      stats: [['Roof solar', 'Standard'], ['Battery', '5 to 40 kWh']], // SOURCE (options sheet). CONFIRM 40 kWh on Cargo with Joe
      link: { label: 'Battery and outlet options', href: '#options' }, // NEW
    },
  },
  {
    id: 'security',
    title: 'Security',
    line: 'Your tools stay locked inside, with optional cameras and lights to watch them.', // NEW, Nate's direction (v2)
    image: shoot.cargoSecurityCard,
    alt: 'Two dome cameras and work lights on a SPOG security mast',
    position: '50% 50%',
    panel: {
      intro: 'Full-height bars lock the barn doors shut, and you can add security cameras, the AI job site camera system, lights, and a horn and strobe that warn people away after hours.', // NEW. Lock bars from the photos, add-ons SOURCE (options sheet). CONFIRM lights, they aren't on the sheet
      media: { src: shoot.cargoDoors, alt: 'Rear barn doors of a black SPOG Cargo, locked with two full-height bars', width: 2400, height: 1600 },
      points: [{ title: 'Pick what you need', body: 'Cameras, lights and alarms are add-ons, and your SPOG contact will confirm what fits your build.' }], // NATE approved wording
      link: { label: 'See all the options', href: '#options' },
    },
  },
  {
    id: 'storage',
    title: 'Storage',
    line: 'Keep your tools and materials on site, with power right where you store them.', // NEW. Storage with power, per the messaging guardrail
    image: shoot.cargoStorageCard,
    alt: 'Inside a SPOG Cargo, E-track down both walls and battery units on low platforms',
    position: '50% 50%',
    panel: {
      intro: 'Up to 20 ft of enclosed space holds your tools and materials between jobs, so nothing gets lost in the shuffle. Large rear barn doors open wide for carts and gear, and you can lay out the inside with shelving, cabinets, a workbench and E-track to fit how your crew works.', // NEW. "Lost in the shuffle" from the messaging report, options SOURCE
      media: { src: shoot.cargoStorage, alt: 'A black SPOG Cargo with both barn doors swung open, the lit interior behind them', width: 2400, height: 1600 },
      stats: [['Length', '10 or 20 ft'], ['Doors', 'Rear barn doors, plus a side door on the 20 ft shown']], // NATE, SOURCE. CONFIRM the side door on the 10 ft
    },
  },
  {
    id: 'climate',
    title: 'Heat and AC',
    line: 'Every Cargo comes insulated, and you can add heating and cooling for bad weather.', // NEW, folds in the old Insulation card
    image: shoot.cargoHvacCard,
    alt: 'Wall-mounted heating and cooling unit inside a SPOG Cargo, over a black-topped desk',
    position: '50% 50%',
    panel: {
      intro: 'Rigid foam board lines the walls and roof of every trailer we build, and optional heating and cooling keeps the inside comfortable for your crew when the weather turns.', // NEW, built on Nate's "warmer in the winter"
      media: { src: shoot.cargoHvac, alt: 'Inside a SPOG Cargo, a heating and cooling unit on the wall over the desk and a closet door at the nose', width: 2400, height: 1600 },
      stats: [['Insulation', 'Standard'], ['Heating and cooling', 'Optional']], // SOURCE (options sheet)
    },
  },
  {
    id: 'starlink',
    title: 'Starlink',
    line: 'Stay connected on the job, even on the most rural sites, with optional Starlink.', // NATE (2026-11-19)
    image: shoot.cargoStarlinkCard,
    alt: 'Starlink dish on top of a SPOG mast against a blue sky',
    position: '50% 30%',
    panel: {
      intro: 'Add Starlink to keep your crew online where cell service is weak, or a cellular router where it is strong.', // NEW, options from the sheet
      media: { src: shoot.wsStarlink, alt: 'Starlink dish on a SPOG mast against the sky', width: 2400, height: 1600 },
      points: [{ title: 'Pick what you need', body: 'Internet is an add-on, and your SPOG contact will confirm what fits your build.' }], // NATE approved wording
      link: { label: 'See all the options', href: '#options' },
    },
  },
  {
    id: 'look',
    title: 'Your look',
    line: "Show up in your company's colors, with your logo on the trailer.", // NEW, Nate's direction (v2)
    image: shoot.cargoNoseCard,
    alt: 'The V nose of a black SPOG Cargo with the logo running down the corner',
    position: '50% 50%',
    panel: {
      intro: 'Your trailer is the first thing a client sees when you pull into the driveway, so you pick the color from twelve choices and put your company logo and lettering on it.', // NEW. Options SOURCE, the driveway point from the messaging report ("it's gotta look right")
      media: { src: shoot.cargoNose, alt: 'The nose of a black SPOG Cargo with its logo, tongue and spare', width: 2400, height: 1600 },
      points: [{ title: 'Color match', body: 'Your SPOG contact will confirm the color match before the build.' }], // NATE approved
      link: { label: 'See the colors', href: '#options' },
    },
  }, // CONFIRM the photo: a customer-branded Cargo or a model capture in a few colors would show "your look" better
];

// ---------------------------------------------------------------- built for the job site

/** Build quality, the thread that ties the cards together (Nate, v2). Facts only. */
export const build = {
  heading: ['Built to take a beating', 'on the job site.'], // NEW, Nate's words ("can get, frankly, beat up")
  body: 'Other companies cut corners with staples and glue. Every SPOG is designed and built by our own crew in Middletown, New York, from welding to wiring.', // NATE
  hero: { src: shoot.cargoFrame, alt: 'A welded steel trailer floor frame with steel crossmembers on the floor of the SPOG shop', position: '50% 72%' }, // Nate's photo (2026-11-19)
  rows: [
    {
      title: 'Welded steel frame',
      body: 'Every Cargo starts on a welded steel frame, with steel crossmembers across the floor, built to carry the weight of its solar and battery.', // NATE (steel frame), SOURCE (frame line). The only place the page says this
      src: shoot.shopWelding, alt: 'A welder joining the steel frame of a SPOG trailer in the Middletown shop', position: '50% 50%',
      video: '/images/cargo2-weld-loop.mp4', poster: '/images/cargo2-weld-loop.jpg', // Nate's "welding on the ground" clip, half speed, smoothed and looped (2026-11-19)
    },
    {
      title: 'Designed and tested in Middletown',
      body: 'We draw the frame in CAD, and the wiring, battery, solar and outlets are designed together and tested before it leaves the shop.', // NEW, built on SOURCE (Objections & FAQ)
      src: shoot.engineeringCad, alt: 'A SPOG engineer working on a trailer frame in CAD', position: '30% 50%',
    },
    {
      title: 'Backed by a 3-year structural warranty', // NATE 2026-11-19
      body: 'Every Cargo comes with a 3-year limited structural warranty and a 1-year limited parts warranty, and if something needs work we diagnose it remotely and send our mobile service fleet to your site.', // NATE approved 2026-11-19, facts SOURCE (Warranty Policy)
      src: img.builtBg, alt: 'The Middletown shop floor, SPOG painted on the wall and an American flag at the far end', position: '50% 50%',
      video: '/images/cargo2-shop-loop.mp4', poster: '/images/cargo2-shop-loop.jpg', // Nate's warehouse fly-through, half speed, plays forward then back (2026-11-19)
    },
  ],
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

// ---------------------------------------------------------------- what it saves you

/** The one place the page argues the money, after Tesla's "More Affordable Than a Gas Car" (v2). */
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

// ---------------------------------------------------------------- options

export const power = {
  body: 'Pick the battery size, the outlet voltage and the plug-in that fit your crew.', // NEW (v2). "Come standard" lives in the Power card now
  groups: [
    { title: 'Battery storage', options: ['5 kWh', '10 kWh', '20 kWh', '40 kWh', 'Other'] }, // SOURCE (options sheet)
    { title: 'Output voltage', options: ['120 V', '208 V', '240 V'] }, // SOURCE (options sheet)
    { title: 'Shore power connection', options: ['30 amp', '50 amp', '100 amp'] }, // SOURCE (options sheet)
  ],
};

/** The full checklist, grouped like the cards (v2): power, security and internet, storage and interior, your look. */
export const options = {
  heading: ['Build it', 'for your crew.'], // NEW
  body: 'Every Cargo is built to order, so you pick the exact configuration that works for you and your crew.', // NATE 2026-11-19
  look: [
    { name: 'Exterior color', desc: 'Twelve choices' }, // NATE (colors)
    { name: 'Company logo', desc: 'On the nose, either side or the rear' }, // SOURCE (options sheet)
    { name: 'Vinyl lettering or numbers' }, // SOURCE (options sheet)
  ],
  fine: 'Power options depend on trailer length.', // SOURCE (options sheet). The rest prints once, under Specs
};

// ---------------------------------------------------------------- specs

export const specs = {
  heading: ['Cargo', 'at a glance.'], // NEW
  image: shoot.cargoProfile,
  alt: 'Street-side profile of a black 20 ft SPOG Cargo, sliding window, tandem wheels and spare',
  rows: [
    ['Type', 'Enclosed cargo trailer'], // NATE (2026-11-19)
    ['Length', '10 or 20 ft'], // NATE
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

/** Five Cargo questions (v2). Each answers its own question without repeating the Build section. */
export const faqs = [
  {
    q: 'Will it hold up on a job site?', // NEW (Nate, 2026-11-19)
    a: 'Yes, our own crew builds every Cargo on a welded steel frame in Middletown, and the structure is covered by a 3-year limited structural warranty.', // NATE approved, trimmed in v2
  },
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
    q: 'What happens if something needs repair?', // SOURCE (homepage FAQ question)
    a: 'We can diagnose problems remotely, and our mobile service fleet repairs on site.', // SOURCE (Warranty Policy). Warranty terms live in the Build section and the first answer
  },
  {
    q: 'Can I see one before I buy?', // NEW
    a: 'Yes, book an in-person demo or a video call, or call the shop at 1 (855) 720-2290.', // NEW
    link: { label: 'Book a demo', href: '/demo' },
  },
];
