/**
 * Copy and data for /cargo-2, the new Cargo sales page (Nate, 2026-11-19), after the Tesla
 * Model Y and Rivian R1T product pages. /cargo stays as it was until Nate picks one.
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
 *   - No price. Product pages carry none, and only "From $10,000" is real. Ask Nate before adding it.
 *   - Only facts the options sheet or Nate confirmed. No solar watts, width, lead time, payload,
 *     tow weight or delivery, because none of those are settled.
 *   - Options shown as options. The black 20 ft in the photos has a side window, storage hatch
 *     and spare, which the sheet doesn't list, so the cards say "on the 20 ft shown".
 *   - The 3D model is labeled computer-generated, and its optional extras are named.
 */
import { img, shoot } from './content';
import type { Feature } from './features';

export const meta = {
  title: 'SPOG Cargo | Enclosed cargo trailer with solar power', // NEW. "Enclosed" at Nate's call (2026-11-19), the word every competitor uses
  description: 'The SPOG Cargo is an enclosed cargo trailer on a welded steel frame, with solar and a battery built in. 10 or 20 ft, built in Middletown, New York.', // NEW
};

/** Where the two main buttons go on this page. */
export const design = { label: 'Design yours', href: '/configure/cargo' }; // NATE (button), link per his 2026-11-18 flow
export const demo = { label: 'Book a demo', href: '/demo' }; // NATE

export const hero = {
  name: 'Cargo',
  type: 'Enclosed cargo trailer', // NATE (Notion, 2026-11-19): part of the h1 in small type, for search
  line: 'Haul all your gear, with the power to run your job.', // NATE (homepage lineup)
  sub: 'Built on a welded steel frame. Solar and a battery run your tools, lights and chargers on stored power, so you have power wherever your job takes you.', // NEW first sentence (Nate, 2026-11-19). Second sentence SOURCE (messaging report) with NATE's ending (Notion comment, 2026-11-19)
  price: 'Starting at $10,000', // NATE (Notion, 2026-11-19: one price under the line, like Rivian, in place of the four facts)
  image: shoot.cargoHero,
  alt: 'Black SPOG Cargo trailer parked outside the SPOG shop in Middletown, New York',
};

/** Section bar that replaces the masthead once the hero scrolls away. */
export const subnavLinks: [string, string][] = [
  ['Overview', '#overview'],
  ['Build', '#build'],
  ['Tour', '#tour'],
  ['Options', '#options'],
  ['Specs', '#specs'],
  ['FAQ', '#faq'],
];

// ---------------------------------------------------------------- Get to know Cargo

export const featuresHead = {
  kicker: 'Get to know Cargo', // NEW, after Rivian's "Get to know the R1T"
  heading: ['An enclosed cargo trailer,', 'with the power built in.'], // NEW, Nate's "enclosed" (2026-11-19) and the messaging report's USP
};

const shown = 'On the 20 ft shown here. Your SPOG contact will confirm what comes on your build.'; // NEW

export const features: Feature[] = [
  {
    id: 'doors',
    title: 'Rear barn doors', // NATE's term (Notion, 2026-11-19)
    line: 'Large barn doors that open wide for loading.', // SOURCE (options sheet), NATE's "barn doors"
    image: shoot.cargoDoorsCard,
    alt: 'Rear barn doors of a black SPOG Cargo with two full-height chrome lock bars',
    position: '50% 50%',
    panel: {
      intro: 'Both doors swing wide for carts and gear, then lock with full-height bars when the day is done.', // NEW, from the photos
      media: { src: shoot.cargoDoors, alt: 'Rear three-quarter view of a black SPOG Cargo, barn doors closed', width: 2400, height: 1600 },
    },
  },
  {
    id: 'insulated',
    title: 'Insulated walls and roof',
    line: 'Every SPOG comes insulated.', // NATE (2026-11-19)
    image: shoot.cargoInsulationCard,
    alt: 'A SPOG trailer on its steel frame in the Middletown shop, its walls lined with rigid foam insulation board',
    position: '50% 50%',
    panel: {
      intro: 'Rigid foam board lines the walls and roof, so the inside stays warmer in winter. It comes standard on every trailer we build.', // NEW, Nate's "warmer in the winter" (Notion, 2026-11-19). SOURCE for standard (options sheet)
      media: { src: shoot.cargoInsulation, alt: 'A SPOG trailer mid-build in the Middletown shop, rigid foam insulation fixed to the steel frame', width: 2400, height: 1600 },
    },
  },
  {
    id: 'entry',
    title: 'Side entry door',
    line: 'Easy access, with the barn doors shut.', // NATE's "easy access" (Notion, 2026-11-19)
    image: shoot.cargoDoorCard,
    alt: 'Curb side of a black SPOG Cargo with a white-framed entry door near the nose',
    position: '50% 50%',
    panel: {
      intro: 'Grab a tool or check the power system with the rear doors shut. The door has a window, so there is daylight inside.', // NEW
      media: { src: shoot.cargoDoor, alt: 'Curb side of a black SPOG Cargo on a lot at sunrise', width: 2400, height: 1600 },
      points: [{ title: 'Where it sits', body: shown }], // NEW. CONFIRM the side door on the 10 ft
    },
  },
  {
    id: 'street',
    title: 'Window and storage hatch',
    line: 'Daylight inside, and cords within reach outside.', // NEW
    image: shoot.cargoStreetCard,
    alt: 'Street side of a black SPOG Cargo with a sliding window and a two-door storage hatch',
    position: '50% 50%',
    panel: {
      intro: 'A sliding window lets light into the work space. The two-door hatch low on the street side reaches cords and hoses without climbing in.', // NEW
      media: { src: shoot.cargoStreet, alt: 'Street side of a black SPOG Cargo, window, storage hatch and tandem wheels', width: 2400, height: 1600 },
      points: [{ title: 'Where they sit', body: shown }], // NEW. CONFIRM whether the window and hatch are standard
    },
  },
  {
    id: 'security',
    title: 'Security',
    line: 'Optional cameras and lights to protect your gear.', // NATE (Notion, 2026-11-19)
    image: shoot.cargoSecurityCard,
    alt: 'Two dome cameras and work lights on a SPOG security mast',
    position: '50% 50%',
    panel: {
      intro: 'Add cameras and lights to watch the trailer and your gear after hours. A horn and strobe can warn people away.', // NEW, from Nate's note and the options sheet
      media: { src: shoot.wsSecurityMast, alt: 'Dome cameras and work lights on a SPOG security mast in the Middletown shop', width: 2400, height: 1600 },
      points: [{ title: 'Pick what you need', body: 'Security is an add-on. Your SPOG contact will confirm what fits your build.' }], // NEW
      link: { label: 'See all the options', href: '#options' }, // NEW
    },
  },
  {
    id: 'starlink',
    title: 'Starlink',
    line: 'Optional internet for your crew on site.', // NEW, Nate's direction (Notion, 2026-11-19)
    image: shoot.cargoStarlinkCard,
    alt: 'Starlink dish on top of a SPOG mast against a blue sky',
    position: '50% 30%',
    panel: {
      intro: 'Add Starlink to keep your crew online where cell service is weak, or a cellular router where it is strong.', // NEW, options from the sheet
      media: { src: shoot.wsStarlink, alt: 'Starlink dish on a SPOG mast against the sky', width: 2400, height: 1600 },
      points: [{ title: 'Pick what you need', body: 'Internet is an add-on. Your SPOG contact will confirm what fits your build.' }], // NEW
      link: { label: 'See all the options', href: '#options' }, // NEW
    },
  },
  {
    id: 'solar',
    title: 'Solar roof',
    line: 'Free power wherever you go.', // NATE (Notion, 2026-11-19)
    image: shoot.cargoSolarCard,
    alt: 'SPOG Cargo from above, solar panels across the whole roof',
    position: '50% 55%',
    panel: {
      intro: 'The power is wherever you go, enough to run your tools, lights and chargers without a generator or fixed power.', // NATE (Notion, 2026-11-19)
      media: { src: shoot.cargoSolar, alt: 'Five solar panels across the roof of a black SPOG Cargo', width: 2400, height: 1600 },
      stats: [['Roof solar', 'Standard'], ['Battery storage', 'Up to 40 kWh']], // SOURCE (options sheet), 40 kWh NATE (Notion, 2026-11-19). CONFIRM 40 kWh on Cargo with Joe
      link: { label: 'Battery and outlet options', href: '#options' }, // NEW. Closes the panel and jumps to the Options section
    },
  },
];

// ---------------------------------------------------------------- built for the job site

/** Nate, 2026-11-19: it's a utility trailer for job sites, so show it holds up. Facts only. */
export const build = {
  heading: ['Built for', 'the job site.'], // NEW, Nate's direction
  body: "It's a cargo trailer first, and it lives on the job site. Other companies cut corners with staples and glue. Every SPOG is designed and built by our own crew in Middletown, New York, from welding to wiring.", // NEW first sentence, NATE the rest
  hero: { src: shoot.cargoFrame, alt: 'A welded steel trailer floor frame with steel crossmembers on the floor of the SPOG shop', position: '50% 72%' }, // Nate's photo (2026-11-19)
  rows: [
    {
      title: 'Welded steel frame',
      body: 'Every Cargo starts on a welded steel frame, with steel crossmembers across the floor, built to carry the weight of its solar and battery.', // NATE (steel frame), SOURCE (frame line), crossmembers from Nate's frame photo
      src: shoot.shopWelding, alt: 'A welder joining the steel frame of a SPOG trailer in the Middletown shop', position: '50% 50%',
    },
    {
      title: 'Designed and tested in Middletown',
      body: 'We draw the frame in CAD, and the wiring, battery, solar and outlets are designed together and tested before it leaves the shop.', // NEW, built on SOURCE (Objections & FAQ)
      src: shoot.engineeringCad, alt: 'A SPOG engineer working on a trailer frame in CAD', position: '30% 50%',
    },
    {
      title: 'Backed in writing',
      body: 'A 3-year limited structural warranty and a 1-year limited parts warranty. We can diagnose problems remotely, and our mobile service fleet repairs on site.', // SOURCE (Warranty Policy)
      src: img.builtBg, alt: 'A finished SPOG trailer on the floor of the Middletown shop, SPOG painted on the wall behind it', position: '50% 50%',
    },
  ],
};

// ---------------------------------------------------------------- 3D tour

export const tour = {
  kicker: 'Take a tour', // NEW, after Rivian's "Take a tour"
  heading: ['See how it works', 'for you.'], // NATE (Notion, 2026-11-19)
  views: [['front', 'Front'], ['side', 'Side'], ['rear', 'Rear'], ['street', 'Street side'], ['top', 'Roof'], ['interior', 'Inside']] as [string, string][],
  model: 'Computer-generated model. The finished trailer may differ.', // NATE asked for this notice (2026-11-18)
  extras: 'Shown with optional heat and AC, an office desk and tie-down track on the walls.', // NEW, names the optional items the model shows
  poster: '/images/configure-cargo.jpg',
};

// ---------------------------------------------------------------- statement

export const statement = {
  heading: 'Every crew needs a trailer. Yours should run the job.', // SOURCE (messaging report, brand lines)
  image: shoot.cargoStatement,
  alt: 'Black SPOG Cargo on the lot in front of the SPOG shop, SPOG painted across the bay doors',
  position: '50% 62%',
};

// ---------------------------------------------------------------- what it replaces

export const replaces = {
  kicker: 'What it replaces', // NEW
  heading: ['One trailer.', 'Power on board.'], // NEW
  body: "Every crew already needs a trailer. SPOG turns that trailer into the job's power station, so there's no second unit to buy, tow, fuel or store.", // SOURCE (messaging report, USP)
  items: [
    { title: 'Fewer generator hours', body: 'Your tools, lights and chargers run on stored solar, so the generator runs less.' }, // NEW, plainer per Nate's rule (no "before X happens" lines)
    { title: 'Fewer fuel runs', body: 'The solar roof recharges the battery, so you haul less fuel.' }, // NEW, plainer per Nate (2026-11-19)
    { title: 'Your own power', body: "Your crew shows up with its own power and doesn't depend on the client's outlet or the GC to keep tools running." }, // SOURCE (messaging report, commercial jobs)
  ],
  fuel: {
    value: '$260 to $530',
    label: 'a month in fuel, estimated, for a 7,500W gas generator at half load. It burns about 1/2 to 3/4 gallon an hour at 2026 New York gas prices.', // SOURCE (messaging report, fuel math with Lowe's and AAA sources)
  },
};

// ---------------------------------------------------------------- power

export const power = {
  body: 'Solar on the roof and a battery on board come standard. Pick the battery, the outlets and the plug-in.', // NEW
  groups: [
    { title: 'Battery storage', options: ['5 kWh', '10 kWh', '20 kWh', '40 kWh', 'Other'] }, // SOURCE (options sheet)
    { title: 'Output voltage', options: ['120 V', '208 V', '240 V'] }, // SOURCE (options sheet)
    { title: 'Shore power connection', options: ['30 amp', '50 amp', '100 amp'] }, // SOURCE (options sheet)
  ],
};

// ---------------------------------------------------------------- options

export const options = {
  kicker: 'Options', // NEW
  heading: ['Build it', 'for your crew.'], // NEW
  body: 'Every Cargo is built to order. Pick the power, the look and the gear inside.', // NEW (Power folded in, Nate 2026-11-19)
  exterior: [
    { name: 'Exterior color', desc: 'Twelve colors. Your SPOG contact will confirm the color.' }, // NATE (colors), SOURCE (sheet wording)
    { name: 'Company logo', desc: 'On the nose, either side or the rear.' }, // SOURCE (options sheet)
    { name: 'Vinyl lettering or numbers' }, // SOURCE (options sheet)
  ],
  fine: 'Power options depend on trailer length. Options are for discussion. Availability, pricing and final specifications are confirmed in writing by SPOG.', // SOURCE (options sheet)
};

// ---------------------------------------------------------------- specs

export const specs = {
  kicker: 'Specs', // NEW
  heading: ['Cargo', 'at a glance.'], // NEW
  image: shoot.cargoProfile,
  alt: 'Street-side profile of a black 20 ft SPOG Cargo, window, storage hatch, tandem wheels and spare',
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
  fine: 'Power options depend on trailer length. Availability, pricing and final specifications are confirmed in writing by SPOG.', // SOURCE (options sheet)
};

// ---------------------------------------------------------------- close and FAQ

export const close = {
  kicker: 'Cargo', // NEW
  heading: 'The trailer that powers your job.', // NATE
  body: 'See a SPOG up close and get your questions answered.', // NEW, as on the homepage close
};

/** Cargo questions. NEW answers need Nate's sign-off. */
export const faqs = [
  {
    q: 'Will it hold up on a job site?', // NEW (Nate, 2026-11-19: the question GCs and subs ask)
    a: "That's what it's built for. Every Cargo starts on a welded steel frame built to carry the weight of its solar and battery, and the structure is covered by a 3-year limited structural warranty.", // NEW, facts from Nate and the Warranty Policy
  },
  {
    q: 'Will it run my saws and compressor?', // SOURCE (buyer question, Objections & FAQ)
    a: "It depends on the tools and the battery size. Book a demo and we'll show you the run time for the tools you use.", // NEW, as on the homepage
    link: { label: 'Book a demo', href: '/demo' },
  },
  {
    q: "Why don't I just build one myself?", // SOURCE (Objections & FAQ)
    a: "It's more than panels on a roof. The frame, welding and structure are built to carry the solar and battery weight, and the wiring, battery, solar and outlets are designed together and tested before it leaves Middletown. It arrives working, with a warranty in writing and a team behind it.", // SOURCE (Objections & FAQ, trimmed)
  },
  {
    q: 'Can I plug it in?', // NEW
    a: 'Yes. Pick a 30, 50 or 100 amp shore power connection to charge from site or grid power.', // SOURCE (options sheet)
  },
  {
    q: 'What happens if something needs repair?', // SOURCE (homepage FAQ question)
    a: 'Every SPOG comes with a 1-year limited parts warranty and a 3-year limited structural warranty. We can diagnose problems remotely, and our mobile service fleet repairs on site.', // SOURCE (Warranty Policy)
  },
  {
    q: 'Can I see one before I buy?', // NEW
    a: 'Yes. Book an in-person demo or a video call, or call the shop.', // NEW
    link: { label: 'Book a demo', href: '/demo' },
  },
  {
    q: 'Where is it built?', // NEW
    a: 'In our shop in Middletown, New York, by our own crew, from welding to wiring.', // NATE
  },
];
