/**
 * Homepage content for SPOG Trailers (Daybreak E).
 *
 * Copy marked PLACEHOLDER was written for the design mockup and must be
 * replaced with real, approved content before launch. See CLAUDE.md.
 */

export const img = {
  logoWhite: '/images/spog-logo-white.png',
  logoDark: '/images/spog-logo-dark.png',
  hero: '/images/field-workstation-sunrise.jpg',
  statementBg: '/images/bg-statement-trailers.jpg',
  storyBg: '/images/bg-story-open-wall.jpg',
  // PLACEHOLDER from spogtrailers.com: real shop-floor photo, stands in for Robert's Middletown shot.
  builtBg: '/images/shop-floor.jpg',
  explore: '/images/field-workstation-sunrise.jpg',
  office: '/images/workstation-office.jpg',
  workstationStudio: '/images/workstation-studio.jpg',
  cargo34: '/images/cargo-render-three-quarter.jpg',
  cargoFront: '/images/cargo-render-front.jpg',
  joby: '/images/custom-joby-hangar.jpg', // PLACEHOLDER: needs Joby's written permission
  cardWing: '/images/card-solar-wing.jpg',
  cardSide: '/images/card-side-gear.jpg',
  cardOpenWall: '/images/card-open-wall.jpg',
  // PLACEHOLDER imagery pulled from spogtrailers.com on 2026-11-16. Renders unless noted.
  eventLedDusk: '/images/event-led-dusk.jpg',
  eventMovieNight: '/images/event-movie-night.jpg', // real photo
  garageEv: '/images/garage-ev-inside.jpg',
  disasterSolar: '/images/disaster-relief-solar-deployed.jpg',
  camperCampfire: '/images/camper-campfire.jpg',
  statementVideo: '/images/statement-solar-unfold.mp4', // concept render, trimmed to 17s, no audio
  statementPoster: '/images/statement-solar-unfold.jpg',
};

/**
 * Real SPOG photos Nate added on 2026-11-17. Each is a 2400 px web copy with a `-1200` copy
 * next to it for cards and phones (see `small`). Full-size originals are in _photos-original/
 * (git-ignored). Held back on purpose: the Joby hangar shot (needs Joby's written permission),
 * a navy Workstation with a customer's BSW branding (needs their permission) and an Event
 * render with a basketball broadcast on the screen (rights).
 */
export const shoot = {
  wsHeroVideo: '/images/ws-hero-drone.mp4', // 10 s drone loop, cut from 0:10 to 0:20 where the clip has no burned-in text
  wsHeroPoster: '/images/ws-hero-drone.jpg',
  wsAerialMast: '/images/ws-aerial-mast.jpg', // from above: roof solar, mast up, parking lot
  wsLotMastSide: '/images/ws-lot-mast-side.jpg', // side view on a lot, mast up, blue sky
  wsMastTall: '/images/ws-mast-tall.jpg', // portrait, telescopic mast fully extended
  wsSecurityMast: '/images/ws-security-mast-closeup.jpg', // lights and cameras on the mast, in the shop
  wsStarlink: '/images/ws-starlink.jpg', // Starlink dish and cameras on the mast
  wsHvac: '/images/ws-hvac.jpg', // heat and AC unit in a side compartment
  wsInteriorOffice: '/images/ws-interior-office.jpg', // finished office, desks and monitors
  wsInteriorBase: '/images/ws-interior-base.jpg', // plywood interior, rubber floor
  wsInteriorPremium: '/images/ws-interior-premium.jpg', // wood walls, warm LED trim
  wsGenerator: '/images/ws-generator-hookup.jpg', // portable generator plugged into the trailer
  wsRuralSunset: '/images/ws-rural-sunset.jpg', // dark trailer at sunset by a farm field
  wsDusk: '/images/ws-dusk.jpg', // dark trailer at dusk. A Tesla Cybertruck is in the frame.
  wsNavyStudio: '/images/ws-navy-studio.jpg', // navy Workstation in the shop, side view
  wsNavyDoors: '/images/ws-navy-doors-open.jpg', // navy Workstation, doors open
  wsFlagShop: '/images/ws-flag-shop.jpg', // white Workstation in the shop under an American flag
  wsWarehouseMast: '/images/ws-warehouse-mast.jpg', // white Workstation with mast in the NY shop
  shopWelding: '/images/shop-welding.jpg', // welder at work, built by hand in America
  engineeringCad: '/images/engineering-cad.jpg', // engineer at CAD screens, trailer frame
  eventDayWings: '/images/event-day-wings.jpg', // Event trailer, wings open, daytime
  eventNightCrowd: '/images/event-night-crowd.jpg', // Event trailer lit at night, crowd on the lawn. Screen faces away.
  // The finished black 20 ft Cargo, shot 2026-11-17 (_photos-original/2026-11-17/Black Cargo Trailer/).
  // Numbers are the source photo. Cards are 2:3 crops, the others 3:2 or 16:9. Used on /cargo-2.
  cargoHero: '/images/cargo2-hero.jpg', // 13: street-side front three-quarter, SPOG doors behind
  cargoStatement: '/images/cargo2-statement.jpg', // 37: low drone, front three-quarter, SPOG painted on the bay doors
  cargoSolar: '/images/cargo2-solar.jpg', // 53: high drone, five panels across the roof
  cargoSolarCard: '/images/cargo2-solar-card.jpg',
  cargoFrame: '/images/cargo2-frame.jpg', // Nate 2026-11-19 (Steel Frames.png): a steel floor frame with its crossmembers on the shop floor, more frames behind
  cargoInsulation: '/images/cargo2-insulation.jpg', // Nate 2026-11-19 (Image.png): steel frame wrapped in rigid foam board in the shop. The boards carry Owens Corning's Pink Panther.
  cargoInsulationCard: '/images/cargo2-insulation-card.jpg',
  cargoSecurityCard: '/images/cargo2-security-card.jpg', // portrait crop of 'Close up of security lights and camera for workstation trailer and cargo trailer.jpg', same photo as wsSecurityMast
  cargoStarlinkCard: '/images/cargo2-starlink-card.jpg', // portrait crop of the Starlink mast shot (Zoom in on starlink.CR3), same photo as wsStarlink
  cargoDoors: '/images/cargo2-doors.jpg', // 7: rear barn doors. The license plate is painted out.
  cargoDoorsCard: '/images/cargo2-doors-card.jpg',
  cargoDoor: '/images/cargo2-door.jpg', // 23: curb side, entry door, backlit (sticker in the door glass)
  cargoDoorCard: '/images/cargo2-door-card.jpg',
  cargoStreet: '/images/cargo2-street.jpg', // 36: street side, sliding window (the low compartment is equipment, not storage)
  cargoStreetCard: '/images/cargo2-street-card.jpg',
  cargoNose: '/images/cargo2-nose.jpg', // 15: V nose, tongue and spare (cropped to clear parked cars)
  cargoNoseCard: '/images/cargo2-nose-card.jpg',
  cargoProfile: '/images/cargo2-profile.jpg', // 36: street-side profile, whole trailer
  cargoStorage: '/images/cargo2-storage.jpg', // Better Interior 61: barn doors swung open, the empty 20 ft inside
  cargoStorageCard: '/images/cargo2-storage-card.jpg', // Better Interior 60: E-track down both walls, batteries on their platforms
  cargoHvac: '/images/cargo2-hvac.jpg', // Better Interior 66: wall-mounted heating and cooling unit over the desk, closet door at the nose
  cargoHvacCard: '/images/cargo2-hvac-card.jpg',
  wsOptGenerator: '/images/ws2-opt-generator.jpg', // Nate 2026-11-20 (Optional generator hookuo.jpg): portable generator plugged into a white Workstation
  wsOptTv: '/images/ws2-opt-tv.jpg', // Nate 2026-11-20 (Interior or case study workstation trailer.jpg): same shot as wsInteriorOffice, cropped to the TV wall where it's used
  wsOptLogo: '/images/ws2-opt-logo.jpg', // Nate 2026-11-20 (Photo Jun 27 2026): navy Workstation with a customer's BSW branding. CONFIRM the customer's permission
  wsOptTower: '/images/ws2-opt-tower.jpg', // Nate 2026-11-20 (ROB_9652.CR3): white Workstation on the lot with the 28 ft mast raised
  cargoInterior: '/images/cargo2-interior.jpg', // Better Interior 62: the long black-topped desk down the curb wall, batteries behind it, barn doors open
  cargoInteriorCard: '/images/cargo2-interior-card.jpg', // Better Interior 63: the desk, the window and the battery units
};

/** The 1200 px copy of a photo from `shoot`, for cards and phones. Older images have none. */
export const small = (src: string) => (Object.values(shoot).includes(src) && src.endsWith('.jpg') ? src.replace(/\.jpg$/, '-1200.jpg') : src);
/** srcset for a `shoot` photo (1200 and 2400 px), or undefined for older single-size images. */
export const srcset = (src: string) => (small(src) !== src ? `${small(src)} 1200w, ${src} 2400w` : undefined);

export const phone = { display: '1 (855) 720-2290', href: 'tel:18557202290' };

// Absolute paths so the nav works on the homepage and the product pages.
// Site nav (Nate, 2026-11-18). Homepage anchors start with "/" so they work from every page.
export const navLinks = [
  { label: 'Cargo', href: '/cargo' },
  { label: 'Cargo 2', href: '/cargo-2' }, // TEMPORARY: the new Cargo page draft (2026-11-19). Remove once Nate picks a version.
  { label: 'Workstation', href: '/workstation' },
  { label: 'Workstation 2', href: '/workstation-2' }, // TEMPORARY: the new Workstation page draft (2026-11-19). Remove once Nate picks a version.
  { label: 'Event', href: '/event' },
  { label: 'Future lineup', href: '/#future' },
  { label: 'FAQ', href: '/#faq' },
  // TEMPORARY: the homepage before 2026-11-18, kept for inspiration (Nate). Remove when it's no longer needed.
  { label: 'Old home', href: '/old-home' },
];

// Thin bar above the nav. Tucks away once the page scrolls.
// The 2027 Launch Offer is for close contacts and partners only. Never mention it on the public site.
export const announcement = {
  gold: 'The 2027 lineup',
  text: 'Cargo, Workstation and Event, built in Middletown',
  cta: 'See the lineup',
  href: '/#lineup',
};

// PLACEHOLDER: rating, owner count and logos are invented for the mockup.
export const proof = {
  score: '4.9',
  caption: 'From 38 SPOG owners',
  logos: ['R&M Carpentry', 'Hudson Valley', 'KESTREL ELECTRIC', 'Northgate Builders', 'Tri/State Roofing'],
};

export const problem = {
  eyebrow: 'The problem',
  heading: 'Every site needs power. Today you pay for it four ways.',
  sub: 'Most crews piece it together every morning. It costs fuel, time and goodwill with the client.',
  stat: { value: '$260 to $530', title: 'A month on generator fuel', body: 'A 7,500W unit at half load, at New York gas prices.' },
  cards: [
    { icon: 'noise', title: 'Noise complaints', body: "A generator running under somebody's bedroom window." },
    { icon: 'battery', title: 'Idling to charge', body: 'Tool batteries charged in a truck left running all day.' },
    { icon: 'house', title: 'Asking to plug in', body: 'Every homeowner asked. Some of them say no.' },
  ],
};

export const statement = ['Pull in.', 'Plug in.', 'No generator.', 'No fuel run.'];

// PLACEHOLDER testimonial
export const review = {
  lead: 'We pull in, flip the breaker and go to work.',
  highlight: "I haven't bought generator gas since April.",
  initials: 'MR',
  name: 'Mike Russo',
  role: 'Owner, R&M Carpentry, Westchester',
};

export const useCases = [
  {
    id: 'residential', tab: 'Residential crews', title: 'No outlet to ask for',
    body: "Pull into the driveway and the saws, lights and chargers run off the trailer. No generator under the neighbor's window, no extension cord through the client's garage.",
    cta: 'See Cargo', href: '/cargo', image: img.cargo34, alt: 'SPOG Cargo trailer', studio: true,
  },
  {
    id: 'commercial', tab: 'Commercial sites', title: 'Your own power before temp power',
    body: "On a ground-up build there's often no power until permanent service comes in. Your crew shows up with its own and doesn't wait on the GC.",
    cta: 'See Cargo', href: '/cargo', image: img.workstationStudio, alt: 'SPOG Workstation trailer',
  },
  {
    id: 'office', tab: 'Site office', title: 'The office that works the day it lands',
    body: 'Heat, AC, desks and optional Starlink ride on the trailer. The super runs the job from day one instead of waiting on a generator hookup.',
    cta: 'See Workstation', href: '/workstation', image: img.office, alt: 'Inside a SPOG Workstation',
  },
  // PLACEHOLDER: Events copy needs approval. Photo is a real SPOG movie night from spogtrailers.com.
  {
    id: 'events', tab: 'Events', title: 'The screen and the power, in one tow',
    body: 'A built-in LED screen and the solar power to run it. Movie nights, promotions and game days go on without a generator rumbling next to the crowd.',
    cta: 'See Event', href: '/event', image: img.eventMovieNight, alt: 'Crowd watching an outdoor movie on a SPOG Event trailer at night',
  },
  {
    id: 'rural', tab: 'Rural jobs', title: 'Power and signal past the grid',
    body: 'Solar refills the battery on site and Starlink keeps the phone ringing where cell service drops out.',
    cta: 'See Workstation', href: '/workstation', image: img.hero, alt: 'SPOG trailers in the field', position: '60% 60%',
  },
  {
    id: 'custom', tab: 'Custom builds', title: "Built to spec when standard won't do",
    body: 'Our in-house crew builds from the frame up for teams with a specific job to do.',
    cta: 'Talk to us', href: '#walkthrough', image: img.joby, alt: 'Custom SPOG trailer in an aircraft hangar',
  },
];

// fit: font size of the giant name on phones, in % of the card width, so each name spans the card.
// PLACEHOLDER: Workstation "8 to 40 ft" and "racking" in the Cargo specs (see CLAUDE.md).
export const products = [
  {
    id: 'cargo', name: 'Cargo', fit: 26, badge: 'For the crew', tag: 'Haul the tools. Power the job.',
    image: img.cargo34, alt: 'SPOG Cargo trailer with solar roof and light mast', position: '50% 30%',
    stats: [['Battery', '5 to 20 kWh'], ['Solar up to', '3,360W'], ['Length', '8 to 24 ft']],
    specs: [['Inside', 'Corner desk, racking'], ['Heat and AC', 'Option'], ['Lead time', '2 weeks']],
    cta: 'Reserve Cargo',
  },
  {
    id: 'workstation', name: 'Workstation', fit: 12.4, badge: 'For the site office', tag: 'The office that works the day it lands.',
    // PHOTO: this render shows a door decal that breaks the naming rule. Reshoot or retouch before launch.
    image: img.workstationStudio, alt: 'SPOG Workstation trailer with a full solar roof', position: '50% 50%',
    stats: [['Battery', '5 to 40 kWh'], ['Solar up to', '5,600W'], ['Length', '8 to 40 ft']],
    specs: [['Inside', 'Desks, storage, display'], ['Heat and AC', 'Standard'], ['Internet', 'Starlink option']],
    cta: 'Reserve Workstation',
  },
  {
    // Specs from spogtrailers.com/event-spog-trailer (2026-11-16). PLACEHOLDER: tag copy needs approval,
    // and the image is a render. Set image: '' to fall back to the text-only row.
    id: 'event', name: 'Event', fit: 28.5, badge: 'For events', tag: 'The screen and the power, in one tow.',
    body: 'A built-in LED screen and the solar power to run it, for events, promotions and outdoor viewing.',
    image: img.eventLedDusk, alt: 'SPOG Event trailer with its LED screen lit at dusk', position: '42% 50%',
    stats: [['Battery', '50 to 100 kWh'], ['Solar up to', '15,500W'], ['Length', '20 to 35 ft']],
    specs: [['Display', 'Built-in LED screen'], ['Built for', 'Events, promotions, outdoor viewing']],
    cta: 'Reserve Event',
  },
];

// Future trailers. Shown smaller than the lineup, with an interest signup instead of a Reserve button.
// PLACEHOLDER: descriptions are drawn from spogtrailers.com and need approval. Images are renders from the same site.
export const nextUp = {
  eyebrow: 'Coming next',
  heading: 'More trailers on the same power system.',
  sub: "Tell us which one you want and we'll send first word when it's ready.",
  products: [
    { name: 'Garage', body: 'Carries and charges your EV, with solar walls that fold out.', image: img.garageEv, alt: 'Electric car parked inside a lit SPOG Garage trailer' },
    { name: 'Disaster Relief', body: 'Solar power and shelter when the grid is down.', image: img.disasterSolar, alt: 'SPOG Disaster Relief trailer with solar panels deployed at a damaged site' },
    { name: 'Camper', body: 'Off-grid nights with solar walls that fold out.', image: img.camperCampfire, alt: 'SPOG Camper trailer by a campfire in the mountains' },
  ],
  cta: 'Get first word',
};

// PLACEHOLDER testimonial
export const story = {
  bold: '“The office was running before the electrician showed up.',
  rest: ' My super stopped driving to the diner to send reports.”',
  initials: 'DK',
  name: 'Dana Kowalski',
  role: 'Project Manager, Northgate Builders',
  videoLabel: 'Watch the story',
  videoLength: '2:14',
};

export const highlights = [
  { image: img.cardWing, alt: 'Solar wing folded open on a SPOG trailer', title: 'Solar on board', body: 'The battery refills while you work.' },
  { image: img.office, alt: 'Inside a SPOG Workstation office', title: 'A real site office', body: 'Heat, AC and a desk from day one.' },
  { image: img.cardSide, alt: 'Side of a SPOG trailer with spare tire and gear rail', title: 'Built to haul', body: 'Gear rail, spare and storage bays.' },
  { image: img.cargo34, alt: 'SPOG Cargo trailer', title: 'Cargo', body: "The crew's tools and power, one tow.", studio: true },
  { image: img.cardOpenWall, alt: 'SPOG trailer with its side wall opened', title: 'Opens up', body: 'Work out of the side in good weather.' },
];

// Hotspot positions are percentages of the field photo.
// image: optional close-up shown next to the hotspot copy (these replaced the old Highlights rail).
export const hotspots = [
  { label: 'Solar wing', title: 'Solar wing', body: 'Folds out on site to catch more sun. Folds flat to tow.', left: 59, top: 28, image: img.cardWing },
  { label: 'Spare', title: 'Full-size spare', body: 'Mounted where you can reach it on the shoulder.', left: 39, top: 48, image: img.cardSide },
  { label: 'Gear rail', title: 'Gear rail', body: 'Hang tools and cords on the outside wall.', left: 55, top: 62 },
  { label: 'Storage bays', title: 'Storage bays', body: 'Lockable bays under the floor line.', left: 51, top: 71 },
  { label: 'Open-wall office', title: 'Open-wall office', body: 'The side opens up for work in good weather.', left: 74, top: 52, image: img.cardOpenWall },
];

export const numbers = [
  { label: 'Battery up to', value: '100 kWh', note: 'across the lineup' }, // Event tops out at 100 kWh
  { label: 'Fuel per day', value: '0 gal', note: 'on solar recharge', gold: true },
  { label: 'Structural warranty', value: '3 yrs', note: 'with mobile service' },
];

export const guarantees = [
  { icon: 'shield', title: '3-year structural warranty', body: 'Covers solar, electrical, battery and HVAC.' },
  { icon: 'truck', title: 'Mobile service fleet', body: 'Repairs on your site. Nothing ships back.' },
  { icon: 'pulse', title: 'Remote diagnosis', body: 'We check the system before anyone drives out.' },
  { icon: 'walk', title: 'Walkthrough first', body: 'See it run your tools before you put down a deposit.' },
];

export const steps = [
  { n: '01', title: 'Walkthrough', body: 'We bring a trailer to your site and run your tools off it.', link: { label: 'Book a walkthrough', href: '#walkthrough' } },
  { n: '02', title: 'Spec it', body: 'Pick the size and battery that fit your crew and your load.' },
  { n: '03', title: 'Reserve', body: 'A deposit locks your build slot in Middletown.', key: true, cta: 'Reserve' },
  { n: '04', title: 'Hook up and go', body: 'Standard Cargo trailers ship in two weeks.' },
];

// Closing section. Repeats the hero promise. No special-offer framing (no slots, no scarcity, no perks).
// PLACEHOLDER: the three points are drawn from existing homepage copy. Confirm before launch.
export const closing = {
  eyebrow: 'The 2027 lineup',
  heading: ['Built for', 'the work day.'],
  points: [
    'A walkthrough on your site before any deposit',
    'Your deposit locks a build slot in our Middletown shop',
    '3-year structural warranty and mobile service',
  ],
  cta: 'Reserve yours',
  walkthrough: {
    title: 'Book a walkthrough',
    body: 'We bring a trailer to your site and run your tools off it. No deposit to book.',
    trailers: ['Cargo', 'Workstation', 'Event', 'Not sure yet'],
    cta: 'Book my walkthrough',
  },
  sheet: {
    title: 'Not ready yet? Get the run-time sheet.',
    body: "Every tool we've tested, on every battery size, in February. One page, sent to your inbox.",
    cta: 'Send it',
  },
};

// PLACEHOLDER: answers are drawn from existing homepage copy. Confirm each one before launch.
export const faqs = [
  {
    q: 'Can I see one run before I pay anything?',
    a: 'Yes. We bring a trailer to your site and run your tools off it before you put down a deposit.',
  },
  {
    q: 'Which trailer fits what I need?',
    a: "Cargo hauls the crew's tools and powers the job. Workstation is a site office with heat, AC and desks from day one. Event brings quiet power to your event. All three run on the same power system.",
  },
  {
    q: 'How long will it run my tools?',
    a: "It depends on the tools and the battery size. The run-time sheet lists every tool we've tested on every battery size.",
    link: { label: 'Get the run-time sheet', href: '#sheet' },
  },
  {
    q: 'What happens if something needs repair?',
    a: 'Our mobile service fleet comes to your site, and we check the system remotely before anyone drives out. The 3-year structural warranty covers solar, electrical, battery and HVAC.',
  },
  {
    q: 'How fast can I get one?',
    a: 'Standard Cargo trailers ship in two weeks. For Workstation and custom builds, your deposit locks a build slot in our Middletown shop.',
  },
  {
    q: 'Where do you work?',
    a: 'We build in Middletown, New York and serve contractor crews and site offices across the Tri-State.',
  },
];

// PLACEHOLDER bar widths until the tool-load table is done
export const runSheet = [
  { tool: 'Miter saw', a: 55, b: 90 },
  { tool: 'Table saw', a: 42, b: 78 },
  { tool: 'Compressor', a: 36, b: 66 },
  { tool: 'Chargers x4', a: 70, b: 100 },
  { tool: 'Work lights', a: 84, b: 100 },
  { tool: 'Heat, office', a: 30, b: 58 },
];

/**
 * Footer links in the order of the sitemap (Nate, 2026-11-18). Homepage anchors start with "/".
 * Contact opens the walkthrough form, which every page has. PLACEHOLDER: every "#" is a page that isn't built yet.
 */
export const footerColumns = [
  { title: 'Trailers', links: [['Cargo', '/cargo'], ['Cargo 2', '/cargo-2'], ['Workstation', '/workstation'], ['Workstation 2', '/workstation-2'], ['Event', '/event'], ['Future lineup', '/#future']] },
  { title: 'Company', links: [['About', '/#built'], ['Reviews', '#'], ['Become a Dealer', '#']] },
  { title: 'Support', links: [['FAQ', '/#faq'], ['Contact', '#walkthrough'], ['Warranty', '#'], ['Blog', '#']] },
];

/** Line icons (stroke only). viewBox per icon. */
export const icons: Record<string, { viewBox: string; body: string }> = {
  noise: { viewBox: '0 0 34 34', body: '<path d="M5 14v6h6l8 7V7l-8 7z"/><path d="M24 12l7 10M31 12l-7 10"/>' },
  battery: { viewBox: '0 0 34 34', body: '<rect x="4" y="12" width="22" height="12" rx="2"/><path d="M26 16h3v4h-3M9 16v4M14 16v4"/>' },
  house: { viewBox: '0 0 34 34', body: '<path d="M6 28V13l11-8 11 8v15"/><path d="M14 28v-8h6v8"/>' },
  shield: { viewBox: '0 0 38 38', body: '<path d="M19 4l12 5v9c0 8-5 13-12 16-7-3-12-8-12-16V9z"/><path d="M14 19l4 4 7-8"/>' },
  truck: { viewBox: '0 0 38 38', body: '<path d="M3 26h3l2-8h14l4 8h7"/><circle cx="11" cy="28" r="3"/><circle cx="27" cy="28" r="3"/><path d="M22 18V10h7l4 8"/>' },
  pulse: { viewBox: '0 0 38 38', body: '<path d="M3 20h8l4-10 6 18 4-8h10"/>' },
  walk: { viewBox: '0 0 38 38', body: '<path d="M6 34V14l13-9 13 9v20"/><path d="M15 34V24h8v10"/>' },
  check: { viewBox: '0 0 24 24', body: '<path d="M4 12.5l5 5L20 6"/>' },
  plus: { viewBox: '0 0 24 24', body: '<path d="M12 5v14M5 12h14"/>' },
  // Product page feature tiles
  sun: { viewBox: '0 0 34 34', body: '<circle cx="17" cy="17" r="6"/><path d="M17 3v4M17 27v4M3 17h4M27 17h4M7.1 7.1l2.8 2.8M24.1 24.1l2.8 2.8M7.1 26.9l2.8-2.8M24.1 9.9l2.8-2.8"/>' },
  desk: { viewBox: '0 0 34 34', body: '<path d="M3 12h28M6 12v17M28 12v17"/><path d="M18 12v9h10M22 16.5h2"/>' },
  tag: { viewBox: '0 0 34 34', body: '<path d="M5 5h11l13 13-11 11L5 16z"/><circle cx="11" cy="11" r="2"/>' },
  climate: { viewBox: '0 0 34 34', body: '<path d="M14 6.5a3 3 0 016 0v13.6a6.5 6.5 0 11-6 0z"/><path d="M17 13v12"/>' },
  wifi: { viewBox: '0 0 34 34', body: '<path d="M3.5 13a19 19 0 0127 0M8 18a13 13 0 0118 0M12.5 23a7 7 0 019 0"/><circle cx="17" cy="28" r="1.4"/>' },
  camera: { viewBox: '0 0 34 34', body: '<path d="M5 9l19 4.5-2 8L3 17z"/><path d="M24 13.5l5-1.5v8l-5.5-1.5M11 20l-2 9H4"/>' },
  screen: { viewBox: '0 0 34 34', body: '<rect x="3" y="6" width="28" height="18" rx="1.5"/><path d="M11 29h12M17 24v5"/>' },
  fuel: { viewBox: '0 0 34 34', body: '<path d="M7 9h13l7 7v15H7z"/><path d="M20 9v7h7M11 4h6v5M12 20l8 8M20 20l-8 8"/>' },
  plug: { viewBox: '0 0 34 34', body: '<path d="M12 3v7M22 3v7M8 10h18v6a9 9 0 01-18 0z"/><path d="M17 25v6"/>' },
};
