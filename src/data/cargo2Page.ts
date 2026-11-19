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
import { shoot } from './content';
import type { Feature } from './features';

export const meta = {
  title: 'SPOG Cargo | The trailer that powers your job', // NEW
  description: 'The SPOG Cargo hauls your gear with solar and a battery built in. 10 or 20 ft, built in Middletown, New York.', // NEW
};

/** Where the two main buttons go on this page. */
export const design = { label: 'Design yours', href: '/configure/cargo' }; // NATE (button), link per his 2026-11-18 flow
export const demo = { label: 'Book a demo', href: '/demo' }; // NATE

export const hero = {
  name: 'Cargo',
  line: 'Haul all your gear, with the power to run your job.', // NATE (homepage lineup)
  sub: "Solar and a battery run your tools, lights and chargers on stored power, so you burn less fuel and skip the homeowner's outlet.", // SOURCE (messaging report, hero sub)
  facts: [
    ['10 or 20 ft', 'Length'], // NATE
    ['Standard', 'Roof solar and battery'], // SOURCE (options sheet)
    ['Middletown, NY', 'Built by our crew'], // SOURCE
  ] as [string, string][],
  image: shoot.cargoHero,
  alt: 'Black SPOG Cargo trailer parked outside the SPOG shop in Middletown, New York',
};

/** Section bar that replaces the masthead once the hero scrolls away. */
export const subnavLinks: [string, string][] = [
  ['Overview', '#overview'],
  ['Tour', '#tour'],
  ['Power', '#power'],
  ['Options', '#options'],
  ['Specs', '#specs'],
  ['FAQ', '#faq'],
];

// ---------------------------------------------------------------- Get to know Cargo

export const featuresHead = {
  kicker: 'Get to know Cargo', // NEW, after Rivian's "Get to know the R1T"
  heading: ['The trailer you need anyway,', 'with the power built in.'], // NEW, from the messaging report's USP
};

const shown = 'On the 20 ft shown here. Your SPOG contact will confirm what comes on your build.'; // NEW

export const features: Feature[] = [
  {
    id: 'solar',
    title: 'Solar roof',
    line: 'A free recharge every day it sits in the sun.', // SOURCE (messaging report, transformation)
    image: shoot.cargoSolarCard,
    alt: 'SPOG Cargo from above, solar panels across the whole roof',
    position: '50% 55%',
    panel: {
      intro: 'Pull up and the power is already there. Tools, lights and chargers run off stored solar before anyone touches the generator.', // SOURCE (messaging report, transformation)
      media: { src: shoot.cargoSolar, alt: 'Five solar panels across the roof of a black SPOG Cargo', width: 2400, height: 1600 },
      stats: [['Roof solar', 'Standard'], ['Battery storage', 'Standard']], // SOURCE (options sheet: "Standard on every trailer")
      link: { label: 'See the power options', href: '#power' }, // NEW
    },
  },
  {
    id: 'doors',
    title: 'Rear double doors',
    line: 'Large doors that open wide for loading.', // SOURCE (options sheet, Cargo)
    image: shoot.cargoDoorsCard,
    alt: 'Rear barn doors of a black SPOG Cargo with two full-height chrome lock bars',
    position: '50% 50%',
    panel: {
      intro: 'Both doors swing wide for carts and gear, then lock with full-height bars when the day is done.', // NEW, from the photos
      media: { src: shoot.cargoDoors, alt: 'Rear three-quarter view of a black SPOG Cargo, barn doors closed', width: 2400, height: 1600 },
    },
  },
  {
    id: 'entry',
    title: 'Side entry door',
    line: 'Get in without opening the back.', // NEW
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
    id: 'nose',
    title: 'Nose and tongue',
    line: 'Tread plate up front, a spare on the tongue.', // NEW
    image: shoot.cargoNoseCard,
    alt: 'V nose of a black SPOG Cargo with black tread plate, the tongue and a spare wheel',
    position: '50% 50%',
    panel: {
      intro: 'The V nose wears black tread plate where the road throws stones, and a matching spare rides on the tongue.', // NEW, from the photos
      media: { src: shoot.cargoNose, alt: 'Front three-quarter of a black SPOG Cargo from the street side', width: 2400, height: 1600 },
      points: [{ title: 'The spare', body: shown }], // NEW. CONFIRM whether the spare is standard
    },
  },
  {
    id: 'built',
    title: 'Built in Middletown',
    line: 'Welded and wired by our own crew.', // NEW, from Nate's "from welding to wiring"
    image: shoot.shopWelding,
    alt: 'A welder at work in the SPOG shop in Middletown, New York',
    position: '50% 50%',
    panel: {
      intro: 'Other companies cut corners with staples and glue. Every SPOG is designed and built by our own crew in Middletown, New York, from welding to wiring.', // NATE
      points: [
        { title: 'A frame for the load', body: 'Every SPOG starts with a frame built to carry the weight of its solar and battery.' }, // SOURCE (Notion Home Page, saved for the Cargo page)
        { title: 'Tested before it leaves', body: 'Wiring, battery, solar and outlets are designed together and tested before it leaves Middletown.' }, // SOURCE (Objections & FAQ)
      ],
    },
  },
];

// ---------------------------------------------------------------- 3D tour

export const tour = {
  kicker: 'Take a tour', // NEW, after Rivian's "Take a tour"
  heading: ['Turn it around.', 'Step inside.'], // NEW
  body: 'Drag the trailer to see every side, open the doors, step inside and try the colors.', // NEW
  views: [['front', 'Front'], ['side', 'Side'], ['rear', 'Rear'], ['street', 'Street side'], ['top', 'Roof'], ['interior', 'Inside']] as [string, string][],
  stats: [
    ['10 or 20 ft', 'Length'], // NATE
    ['5 to 40 kWh', 'Battery choices'], // SOURCE (options sheet). CONFIRM 40 kWh on Cargo with Joe
    ['120, 208, 240 V', 'Output voltage'], // SOURCE (options sheet)
    ['30, 50, 100 amp', 'Shore power'], // SOURCE (options sheet)
  ] as [string, string][],
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
    { title: 'Fewer generator hours', body: 'Tools, lights and chargers run off stored solar before anyone touches the generator.' }, // SOURCE (messaging report)
    { title: 'Fewer fuel runs', body: 'The roof recharges the battery every day the trailer sits in the sun.' }, // SOURCE (messaging report)
    { title: 'Your own power', body: "Your crew shows up with its own power and doesn't depend on the client's outlet or the GC to keep tools running." }, // SOURCE (messaging report, commercial jobs)
  ],
  fuel: {
    value: '$260 to $530',
    label: 'a month in fuel for a 7,500W gas generator at half load, at 2026 New York gas prices.', // SOURCE (messaging report, fuel math with Lowe's and AAA sources)
  },
};

// ---------------------------------------------------------------- power

export const power = {
  kicker: 'Power', // NEW
  heading: ['Sized to', 'your work.'], // NEW
  body: 'Solar on the roof and a battery on board come standard. Pick the battery, the outlets and the plug-in that fit your crew.', // NEW
  groups: [
    { title: 'Battery storage', note: 'Energy stored on board.', options: ['5 kWh', '10 kWh', '20 kWh', '40 kWh', 'Other'] }, // SOURCE (options sheet)
    { title: 'Output voltage', note: 'The voltage at the outlets. Pick all you need.', options: ['120 V', '208 V', '240 V'] }, // SOURCE (options sheet)
    { title: 'Shore power connection', note: 'Plug-in size for site or grid power.', options: ['30 amp', '50 amp', '100 amp'] }, // SOURCE (options sheet)
  ],
  fine: 'Power options depend on trailer length. Your SPOG contact will confirm what fits your trailer.', // SOURCE (options sheet)
  runtime: {
    q: 'How long will it run your tools?', // NEW
    a: "It depends on the tools and the battery size. Book a demo and we'll show you the run time for the tools you use.", // NEW, as on the homepage FAQ
  },
};

// ---------------------------------------------------------------- options

export const options = {
  kicker: 'Options', // NEW
  heading: ['Build it', 'for your crew.'], // NEW
  body: 'Every Cargo is built to order. These are the options on our customization sheet.', // NEW
  exterior: [
    { name: 'Exterior color', desc: 'Twelve colors. Your SPOG contact will confirm the color.' }, // NATE (colors), SOURCE (sheet wording)
    { name: 'Company logo', desc: 'On the nose, either side or the rear.' }, // SOURCE (options sheet)
    { name: 'Vinyl lettering or numbers' }, // SOURCE (options sheet)
  ],
  fine: 'Options are for discussion. Availability, pricing and final specifications are confirmed in writing by SPOG.', // SOURCE (options sheet footer)
};

// ---------------------------------------------------------------- specs

export const specs = {
  kicker: 'Specs', // NEW
  heading: ['Cargo', 'at a glance.'], // NEW
  image: shoot.cargoProfile,
  alt: 'Street-side profile of a black 20 ft SPOG Cargo, window, storage hatch, tandem wheels and spare',
  rows: [
    ['Length', '10 or 20 ft'], // NATE
    ['Standard on every trailer', 'Roof solar panels, battery storage, and insulated roof and walls'], // SOURCE (options sheet)
    ['Battery storage', '5, 10, 20 or 40 kWh, or other'], // SOURCE (options sheet). CONFIRM 40 kWh on Cargo
    ['Output voltage', '120 V, 208 V, 240 V'], // SOURCE (options sheet)
    ['Shore power connection', '30, 50 or 100 amp'], // SOURCE (options sheet)
    ['Doors', 'Large rear double doors and a side entry door'], // SOURCE (options sheet, Product Wiki)
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
  body: 'See a SPOG up close and get your questions answered before your next job.', // NEW, as on the homepage close
};

/** Cargo questions. NEW answers need Nate's sign-off. */
export const faqs = [
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
