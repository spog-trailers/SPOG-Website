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
 *            the Warranty Policy, the Trailer Customization Options sheet (SPOG-D-0001), or SPOG's
 *            external price sheet (2026-11-20)
 *   NEW      written for this page (v3 approved by Nate to go live, 2026-11-20)
 *   CONFIRM  a line someone still has to sign off
 *   GAP      a [BRACKET] fact Joe still has to supply. Brackets show highlighted on the page on purpose.
 *            None are left since the 2026-11-20 price sheet and Nate's answers (weight, battery, side door
 *            and security settled; the tow vehicle dropped, since the page never claims what can tow it).
 *
 * Facts pass (2026-11-20). Every spec and price follows SPOG's external price sheet of 2026-11-20 and
 * Nate's answers to questions about it. Where the older options sheet (SPOG-D-0001) disagrees, the
 * price sheet wins: no 240 V, battery 5 to 20 kWh, vinyl floor, no shelving, cabinets or overhead
 * storage, the desk is standard, cameras only on the 20 ft's 28 ft light tower.
 *
 * Rules this page keeps:
 *   - Prices are the sheet's base prices only, "Starting at $15,000" in the hero and both sizes in
 *     Specs, with the line that they exclude tax, title, registration and delivery. Add-on prices
 *     stay in the builder at /configure/cargo, so none are shown here.
 *   - Only facts from the price sheet, the Warranty Policy or Nate. No 10 ft height (under research),
 *     no lead time, no payload, and never a claim about what vehicle can tow it.
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
  price: 'Starting at $15,000', // NATE (2026-11-20 answers), SOURCE (price sheet 2026-11-20: the 10 ft Cargo). One price under the line, like Rivian (Notion, 2026-11-19)
  image: shoot.cargoHero,
  alt: 'Black SPOG Cargo trailer parked outside the SPOG shop in Middletown, New York',
};

/** Section bar that replaces the masthead once the hero scrolls away. */
export const subnavLinks: [string, string][] = [
  ['Overview', '#overview'],
  ['Power', '#power'], // Nate 2026-11-20: the power system gets its own section
  ['Tour', '#tour'],
  ['Savings', '#savings'],
  ['Anywhere', '#anywhere'],
  ['Build', '#built'],
  ['Options', '#options'],
  ['Specs', '#specs'],
  ['FAQ', '#faq'],
];

// ---------------------------------------------------------------- Redefining the enclosed cargo trailer (Cybertruck: Redefining the Pickup Truck)

export const overview = {
  heading: ['Redefining the', 'enclosed cargo trailer.'], // NATE (2026-11-20)
  sub: 'Built around what your crew does every day, from loading out in the morning to locking up at night.', // NEW (v3)
  cards: [
    {
      title: 'Haul it all', // NEW (Cybertruck: Bring It All)
      body: 'Up to 20 ft of enclosed space holds the tools and materials for the whole job, so nothing gets lost in the shuffle between sites. The rear barn doors swing wide for carts, ladders and gear, and a side entry door lets the crew in without opening up the back.', // NEW, "lost in the shuffle" SOURCE (messaging report). Side door on both sizes SOURCE (price sheet 2026-11-20)
      media: { src: shoot.cargoStorage, alt: 'A black SPOG Cargo with both barn doors swung open, the lit interior behind them', position: '50% 50%' },
    },
    {
      title: 'Set it up your way', // NEW (Cybertruck: Full Range of Motion)
      body: 'Every Cargo comes with a built-in work desk in the front corner for paperwork and a laptop. Add a workbench and E-track on the walls and floor, which takes the fold-down tables, tool holders and straps crews already buy, so every tool has a place and every load stays put.', // NEW. Desk standard SOURCE (price sheet 2026-11-20). Shelving, cabinets and overhead storage removed NATE (2026-11-20 answers). Workbench and E-track still offered (options sheet), E-track accessories from Joe (Meeting with Alessandro and Joe, 2026-11-20)
      media: { src: shoot.cargoEtrackCard, alt: 'E-track rails down the white wall of a SPOG Cargo, with the battery units on their platform', position: '50% 50%' },
    },
    {
      title: 'Lock down the site', // NEW (Cybertruck: Lockable Storage), Nate's security direction from /workstation-2
      body: 'Full-height bars lock the rear doors at night, so the tools and materials stay on site. Either size can add a 6 ft telescopic light that lights up the lot and lets the crew keep working after the sun goes down.', // NEW (2026-11-20). Light SOURCE (price sheet 2026-11-20, a light only, NATE: work after dark). The 28 ft tower and its camera are their own card in Add what you need (Nate, 2026-11-20)
      media: { src: shoot.cargoDoorsCard, alt: 'The rear barn doors of a black SPOG Cargo, locked with two full-height bars', position: '50% 50%' },
    },
    {
      title: 'Throw the job at it', // NEW (Cybertruck: Throw Anything at It)
      body: 'Every Cargo rides on a welded steel frame with steel crossmembers across the floor, built to carry its solar and battery over gravel lots and muddy driveways. Inside, plywood backs the white composite walls so they take the knocks of a working day, and the floor is vinyl.', // NATE (steel frame), Joe (composite panels over plywood, standard, Meeting with Alessandro and Joe, 2026-11-20). Vinyl floor NATE (2026-11-20 answers: vinyl on every model, not rubber or plywood)
      media: { video: '/images/cargo2-weld-loop.mp4', poster: '/images/cargo2-weld-loop.jpg', alt: 'A welder joining the steel frame of a SPOG trailer in the Middletown shop' },
    },
  ] as Card[],
};

// ---------------------------------------------------------------- the power system (Nate, 2026-11-20: its own section near the top)

/** The one place the page sells the power system: battery size, bigger tools, overnight charging. */
export const power = {
  heading: ['Power that', 'runs the job.'], // NEW (2026-11-20)
  intro: 'Every Cargo carries its own battery and inverter. The 10 ft comes with 5 kWh and the 20 ft with 10 kWh, and you can add 5 kWh at a time up to 20 kWh, so the power fits the work your crew does.', // NEW. Battery SOURCE (price sheet 2026-11-20)
  media: { src: shoot.cargoPowerWide, alt: 'Inside a SPOG Cargo, battery units in open aluminum cages on the platforms down both walls, E-track above them', position: '50% 55%' } as Media, // Better Interior 60, wide crop (2026-11-20, second layout)
  points: [
    { title: 'Bring the bigger tools', body: 'Plug full-size corded tools like a table saw into the 120 V outlets, three outside and five inside, so the crew gets more done than it would on battery tools alone.' }, // NEW on Joe (Meeting with Alessandro and Joe, 2026-11-20: corded tools and production). Outlets SOURCE (price sheet 2026-11-20)
    { title: 'Charge every battery overnight', body: "Leave the tool batteries charging in the locked trailer at the end of the day, and they're ready when the crew comes back in the morning." }, // NEW on Jay (Meeting with Alessandro and Joe, 2026-11-20)
  ],
  stats: [
    ['5 to 20 kWh', 'Battery storage'], // SOURCE (price sheet 2026-11-20)
    ['Up to 6,000 W', 'Inverter'], // SOURCE (price sheet 2026-11-20: 3,000 W on the 10 ft, 6,000 W on the 20 ft)
    ['208 V', 'Added on the 20 ft'], // SOURCE (price sheet 2026-11-20)
  ] as [string, string][],
};

// ---------------------------------------------------------------- 3D tour

export const tour = {
  kicker: 'Take a tour',
  heading: ['See how it works', 'for you.'], // NATE (Notion, 2026-11-19)
  views: [['front', 'Front'], ['side', 'Side'], ['rear', 'Rear'], ['street', 'Street side'], ['top', 'Roof'], ['interior', 'Inside']] as [string, string][],
  model: 'Computer-generated model. The finished trailer may differ.', // NATE asked for this notice (2026-11-18)
  extras: 'Shown with optional climate control and E-track on the walls.', // NEW (2026-11-20 facts pass): names the optional items the model shows. Battery SOURCE (price sheet 2026-11-20: base is 5 kWh on the 10 ft and 10 kWh on the 20 ft, 20 kWh max; embed.ts draws the 20 kWh). The desk is standard now (price sheet 2026-11-20), so it's no longer listed as optional; the "may differ" notice covers its shape. "Climate control", never "HVAC" (Meeting with Alessandro and Joe, 2026-11-20). /workstation-2 spreads this tour, so this line shows there too
  poster: '/images/configure-cargo.jpg',
};

// ---------------------------------------------------------------- what it saves you (Tesla: More Affordable Than a Gas Car), unchanged from v2

/** The one place the page argues the money. The power system and tool charging live in the Power section (Nate, 2026-11-20). */
export const replaces = {
  heading: ['Spend less', 'on fuel.'], // NEW (v2, charging moved out 2026-11-20)
  body: 'A gas generator at half load burns half to three quarters of a gallon an hour.', // SOURCE (messaging report fuel math)
  items: [
    { icon: 'fuel', title: 'Fewer generator hours', body: 'Your tools run on stored solar, so the generator runs less and you buy and haul less fuel.' }, // NEW
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
  sub: 'Wherever the next job is, Cargo goes with it, and the crew gets to work from the first hour.', // NEW (2026-11-20 facts pass: solar, Starlink and towing are each said once, in their cards)
  lead: null, // Nate 2026-11-20: the statement drone photo is out, and the three cards run wider instead
  cards: [
    {
      title: 'Solar power',
      body: 'Every Cargo comes with solar panels across the roof, 900 W on the 10 ft and 2,800 W on the 20 ft, wired to its battery and inverter.', // NEW, watts SOURCE (price sheet 2026-11-20). No "every sunny day" recharge line (Nate's rule)
      media: { src: shoot.cargoSolar, alt: 'A SPOG Cargo from above, five solar panels across the whole roof', position: '36% 20%' },
    },
    {
      title: 'Stay connected',
      body: 'Add Starlink and we install the dish on the trailer (you set up your own Starlink plan), so your crew stays online on rural sites where phones lose signal and the daily report goes out from the job.', // NEW. Starlink on Cargo NATE (2026-11-20 answers), dish and install included, plan by the buyer NATE (2026-11-20 answers)
      media: { src: '/images/cargo2-starlink-dish-card.jpg', alt: 'Starlink dish on top of a SPOG mast against a blue sky', position: '50% 50%' }, // SOURCE (2026-11-20 facts pass: cropped above the dome cameras). Cut from cargo2-starlink-card.jpg so the dish and lights show and the cameras don't
    },
    {
      title: 'Hitch up and go',
      body: 'Cargo tows to the next site with everything already loaded, so nobody packs the truck at the end of the day and unpacks it again in the morning.', // NEW
      media: { src: shoot.cargoNoseCard, alt: 'The V nose of a black SPOG Cargo with the tongue, the jack and the spare', position: '50% 60%' },
    },
  ] as Card[],
  stats: [
    ['Up to 9,500 lbs', 'Max loaded weight'], // SOURCE (price sheet 2026-11-20, GVWR: 7,000 lbs on the 10 ft, 9,500 lbs on the 20 ft; both sizes in Specs). NATE (2026-11-20 answers: show the weight)
    ['10 or 20 ft', 'Length'], // NATE
    ['Dual axle', 'On both sizes'], // SOURCE (price sheet 2026-11-20). Replaced the tow vehicle stat: never claim what vehicle can tow it
  ] as [string, string][],
};

// ---------------------------------------------------------------- built (Cybertruck: Designed to Be the Safest Truck on the Road)

export const built = {
  heading: ['Built for whatever', 'the job site brings.'], // NATE (2026-11-19)
  sub: 'Other companies cut corners with staples and glue. Every SPOG is designed and built by our own crew in Middletown, New York, from welding to wiring.', // NATE. Insulation moved to its own card (Nate, 2026-11-20)
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
    {
      title: 'Insulated in the walls, floor and ceiling', // NEW (Nate, 2026-11-20: "talk about how every SPOG is insulated")
      body: 'Rigid foam board lines the walls, floor and ceiling of every SPOG we build, while most cargo trailers go without insulation, so the inside is easier to keep warm or cool.', // NEW. Insulation SOURCE (price sheet 2026-11-20), foam board from the photo, CONFIRM "most cargo trailers go without insulation" (Joe said regular cargo trailers aren't insulated)
      media: { src: shoot.cargoInsulation, alt: 'A SPOG trailer frame wrapped in rigid foam insulation board on the shop floor, an American flag on the far wall', position: '30% 50%' }, // Nate's photo. The boards carry Owens Corning's Pink Panther branding
    },
  ] as Card[],
};

// ---------------------------------------------------------------- Add what you need (Cybertruck: Add What You Need)

/**
 * Large photo cards, small tiles, then the builder, which has the full options list and the add-on
 * prices (it replaced v2's checklist). Facts pass 2026-11-20: the Office desk card is gone because the
 * desk is standard (Set it up your way says so), Starlink lives in Take it anywhere and the 6 ft light in
 * Lock down the site. The 28 ft tower with its camera is a photo card here (Nate, 2026-11-20). Extra desks took the Whiteboard tile's
 * place (the whiteboard is still in the builder) to keep the tile row at four.
 */
export const options = {
  heading: ['Add what', 'you need.'], // NEW (v3)
  sub: 'Pick the extras that fit your crew, or build your exact Cargo in the builder.', // NEW (v3)
  cards: [
    {
      title: '28 ft light tower with a camera', // NATE (2026-11-20: add the camera on the telescopic pole as a photo card)
      body: 'On the 20 ft, add a 28 ft telescopic tower with a light, a horn and your pick of an AI or a regular security camera, so the camera keeps watch over the lot after the crew goes home.', // NEW. SOURCE (price sheet 2026-11-20: 20 ft only, AI or regular camera at the same price, light and horn)
      media: { src: shoot.wsSecurityMast, alt: 'Work lights and a dome camera at the top of a SPOG telescopic tower', position: '50% 40%' }, // Nate's close-up, filed for both trailers. It shows two dome cameras and the package has one
    },
    {
      title: 'Climate control', // Meeting with Alessandro and Joe, 2026-11-20
      body: 'Add heating and cooling, and the trailer becomes a place to warm up, cool off or take a call out of the weather.', // NEW, option SOURCE (price sheet 2026-11-20, an add-on on both Cargo sizes)
      media: { src: shoot.cargoHvac, alt: 'Inside a SPOG Cargo, a heating and cooling unit on the wall over the desk', position: '50% 35%' },
    },
    {
      title: "Your company's look",
      body: "Pick from twelve colors and put your logo and lettering on the nose, the sides or the rear, so the trailer looks right in the client's driveway.", // NEW, colors NATE, logo spots SOURCE (options sheet), driveway SOURCE (messaging report)
      media: { src: shoot.cargoProfile, alt: 'Street-side profile of a black 20 ft SPOG Cargo with the SPOG logo at the nose', position: '50% 58%' }, // A customer-branded Cargo would be stronger when one exists
    },
  ] as Card[],
  more: [
    { icon: 'desk', name: 'Extra desks', line: 'Add desks when more of the crew does paperwork in the trailer.' }, // NEW, NATE (2026-11-20 answers: extra desks, from Alessandro)
    { icon: 'plug', name: 'Refrigerator and microwave', line: 'Keep lunch and cold drinks on site so nobody has to drive into town.' },
    { icon: 'screen', name: 'TV or monitor', line: 'Put the drawings and the schedule up on a big screen.' },
    { icon: 'pulse', name: 'Cellular router', line: 'A router gives you fast internet on sites where the cell signal is strong.' },
  ], // NEW lines, options SOURCE (options sheet, still offered per the 2026-11-20 facts, no sheet price)
  link: { label: 'See every option in the builder', href: '/configure/cargo' }, // NEW
};

// ---------------------------------------------------------------- specs

export const specs = {
  heading: ['Cargo', 'at a glance.'], // NEW
  image: '/images/lineup-cargo.webp', // Nate's cut-out, on the light specs section (v3)
  alt: 'Black SPOG Cargo trailer with solar on the roof',
  // Rewritten to the price sheet (2026-11-20). Every row is SOURCE (price sheet 2026-11-20) unless marked.
  rows: [
    ['Type', 'Enclosed cargo trailer'], // NATE (2026-11-19)
    ['Outside size', '10 ft long and 6.5 ft wide, or 20 ft long, 8 ft wide and 8 ft 2 in tall'], // SOURCE. The 10 ft height is held until the research on how it's measured is done
    ['Max loaded weight (GVWR)', '7,000 lbs on the 10 ft, 9,500 lbs on the 20 ft'], // SOURCE, NATE (2026-11-20 answers)
    ['Axles', 'Dual axle on both sizes'], // SOURCE
    ['Frame', 'Welded steel'], // NATE (2026-11-19)
    ['Battery', '5 kWh on the 10 ft and 10 kWh on the 20 ft, adding 5 kWh at a time up to 20 kWh'], // SOURCE (no 40 kWh)
    ['Roof solar', '900 W on the 10 ft, 2,800 W on the 20 ft'], // SOURCE
    ['Inverter', '3,000 W on the 10 ft, 6,000 W on the 20 ft'], // SOURCE
    ['Electrical system', '48 V DC, with 120 V on the 10 ft and 120 V and 208 V on the 20 ft'], // SOURCE (no 240 V)
    ['Outlets', '3 outside and 5 inside'], // SOURCE (both Cargo sizes)
    ['Shore power connection', '30, 50 or 100 amp'], // SOURCE (options sheet). Not on the price sheet but still offered, unpriced (2026-11-20 facts)
    ['Insulation', 'Walls, floor and ceiling'], // SOURCE
    ['Interior walls', 'White composite panels over plywood'], // SOURCE, plywood from Joe (Meeting with Alessandro and Joe, 2026-11-20)
    ['Floor', 'Vinyl'], // NATE (2026-11-20 answers: vinyl on every model, the sheet's plywood is wrong)
    ['Desk', 'One built-in work desk in the front corner'], // SOURCE
    ['Doors', 'Side entry door and rear barn doors on both sizes'], // SOURCE
    ['Climate control', 'Heating and cooling, optional on both sizes'], // SOURCE
    ['Warranty', '1-year limited parts, 3-year limited structural'], // SOURCE (Warranty Policy)
    ['Service', 'Remote diagnosis and a mobile service fleet'], // SOURCE (Warranty Policy)
    ['Built in', 'Middletown, New York'], // SOURCE
    ['Base price', '$15,000 for the 10 ft, $50,000 for the 20 ft'], // SOURCE, NATE approved showing the sheet's prices (2026-11-20)
  ] as [string, string][],
  fine: 'Base prices include everything listed as standard and exclude tax, title, registration and delivery. Availability and final specifications are confirmed in writing by SPOG.', // SOURCE (price sheet 2026-11-20, options sheet)
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
