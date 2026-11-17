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
  builtBg: '/images/bg-built-side-panel.jpg',
  explore: '/images/field-workstation-sunrise.jpg',
  office: '/images/workstation-office.jpg',
  workstationStudio: '/images/workstation-studio.jpg',
  cargo34: '/images/cargo-render-three-quarter.jpg',
  cargoFront: '/images/cargo-render-front.jpg',
  joby: '/images/custom-joby-hangar.jpg', // PLACEHOLDER: needs Joby's written permission
  cardWing: '/images/card-solar-wing.jpg',
  cardSide: '/images/card-side-gear.jpg',
  cardOpenWall: '/images/card-open-wall.jpg',
};

export const phone = { display: '1 (855) 720-2290', href: 'tel:18557202290' };

export const navLinks = [
  { label: 'Cargo', href: '#specs' },
  { label: 'Workstation', href: '#specs' },
  { label: 'Specs', href: '#specs' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'About', href: '#built' },
  { label: 'Contact', href: '#cta' },
];

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
    cta: 'See Cargo', image: img.cargo34, alt: 'SPOG Cargo trailer', studio: true,
  },
  {
    id: 'commercial', tab: 'Commercial sites', title: 'Your own power before temp power',
    body: "On a ground-up build there's often no power until permanent service comes in. Your crew shows up with its own and doesn't wait on the GC.",
    cta: 'See Cargo', image: img.workstationStudio, alt: 'SPOG Workstation trailer',
  },
  {
    id: 'office', tab: 'Site office', title: 'The office that works the day it lands',
    body: 'Heat, AC, desks and optional Starlink ride on the trailer. The super runs the job from day one instead of waiting on a generator hookup.',
    cta: 'See Workstation', image: img.office, alt: 'Inside a SPOG Workstation',
  },
  {
    id: 'rural', tab: 'Rural jobs', title: 'Power and signal past the grid',
    body: 'Solar refills the battery on site and Starlink keeps the phone ringing where cell service drops out.',
    cta: 'See Workstation', image: img.hero, alt: 'SPOG trailers in the field', position: '60% 60%',
  },
  {
    id: 'custom', tab: 'Custom builds', title: "Built to spec when standard won't do",
    body: 'Our in-house crew builds from the frame up for teams with a specific job to do.',
    cta: 'Talk to us', image: img.joby, alt: 'Custom SPOG trailer in an aircraft hangar',
  },
];

export const products = [
  {
    name: 'Cargo', badge: 'For the crew', tag: 'Haul the tools. Power the job.',
    image: img.cargoFront, alt: 'SPOG Cargo', studio: true,
    specs: [
      ['Battery', '5 to 20 kWh'], ['Solar', 'Up to 3,360W'], ['Length', '8 to 24 ft'],
      ['Inside', 'Corner desk, racking'], ['Heat and AC', 'Option'], ['Lead time', '2 weeks'],
    ],
    cta: 'Reserve Cargo',
  },
  {
    name: 'Workstation', badge: 'For the site office', tag: 'The office that works the day it lands.',
    image: img.office, alt: 'SPOG Workstation interior',
    specs: [
      ['Battery', '5 to 40 kWh'], ['Solar', 'Up to 5,600W'], ['Length', '8 to 40 ft'],
      ['Inside', 'Desks, storage, display'], ['Heat and AC', 'Standard'], ['Internet', 'Starlink option'],
    ],
    cta: 'Reserve Workstation',
  },
];

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
export const hotspots = [
  { label: 'Solar wing', title: 'Solar wing', body: 'Folds out on site to catch more sun. Folds flat to tow.', left: 59, top: 28 },
  { label: 'Spare', title: 'Full-size spare', body: 'Mounted where you can reach it on the shoulder.', left: 39, top: 48 },
  { label: 'Gear rail', title: 'Gear rail', body: 'Hang tools and cords on the outside wall.', left: 55, top: 62 },
  { label: 'Storage bays', title: 'Storage bays', body: 'Lockable bays under the floor line.', left: 51, top: 71 },
  { label: 'Open-wall office', title: 'Open-wall office', body: 'The side opens up for work in good weather.', left: 74, top: 52 },
];

export const numbers = [
  { label: 'Battery up to', value: '40 kWh', note: 'across the lineup' },
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
  { n: '01', title: 'Walkthrough', body: 'We bring a trailer to your site and run your tools off it.' },
  { n: '02', title: 'Spec it', body: 'Pick the size and battery that fit your crew and your load.' },
  { n: '03', title: 'Reserve', body: 'A deposit locks your build slot in Middletown.', key: true },
  { n: '04', title: 'Hook up and go', body: 'Standard Cargo trailers ship in two weeks.' },
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

export const footerColumns = [
  { title: 'Trailers', links: [['Cargo', '#specs'], ['Workstation', '#specs'], ['Specs', '#specs'], ['Custom builds', '#']] },
  { title: 'Company', links: [['About', '#built'], ['Reviews', '#reviews'], ['Press', '#'], ['Careers', '#']] },
  { title: 'Support', links: [['FAQ', '#'], ['Warranty', '#'], ['Service', '#'], ['Contact', '#cta']] },
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
};
