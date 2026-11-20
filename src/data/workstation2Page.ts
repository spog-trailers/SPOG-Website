/**
 * Copy and data for /workstation-2, the new Workstation sales page draft. /workstation stays as
 * it was until Nate picks one.
 *
 * v3 (2026-11-20). Nate found v1 said the same thing over and over. The copy was rebuilt one-to-one
 * on the Tesla Cybertruck page and reviewed in Notion (Company Roadmap > Website Build > "Workstation"),
 * where every line below was approved. Each feature is said once, in one place. Each block names the
 * Cybertruck section it mirrors.
 *
 * Copy marks:
 *   NATE     his own words, or his pick (Notion comments, 2026-11-19 and 20)
 *   SOURCE   an approved fact: the Workstation Trailer Messaging Report, the Product Wiki, the
 *            Warranty Policy, the Trailer Customization Options sheet or the SPOG runtime guide
 *   NEW      written for this page and approved by Nate in the Notion doc (v3)
 *   GAP      a [BRACKET] fact Joe still has to supply. Brackets show on the page on purpose.
 *
 * Facts from Nate's comments: the 6 ft mast with work lights and a camera is standard, the 28 ft
 * mast, a 360 camera and a horn are options. Outlets are 120, 208 or 240 V, as on Cargo. People
 * power lights and laptops more than they charge tools. Joby gave permission for the case study.
 */
import { shoot } from './content';
import { tour as cargoTour } from './cargo2Page';
import { productPages, type ProductPage } from './productPages';

export const meta = {
  title: 'SPOG Workstation | Solar power site office trailer', // SOURCE (current /workstation)
  description: 'The SPOG Workstation is a site office trailer with its own solar power, heat and AC and a security mast, built on a welded steel frame in Middletown, New York, in 10 or 20 ft.', // NEW
};

/** Workstation has no builder yet, so "Design yours" opens the build request form with Workstation picked. */
export const design = { label: 'Design yours', href: '/?trailer=Workstation#design' }; // NATE (button and flow, 2026-11-18)
export const demo = { label: 'Book a demo', href: '/demo' }; // NATE

/** A photo or a looping video, with the words that go with it. */
export type Media = { src?: string; video?: string; poster?: string; alt: string; position?: string };
export type Card = { title: string; body: string; media: Media };

// ---------------------------------------------------------------- hero (Cybertruck: the hero)

export const hero = {
  name: 'Workstation',
  line: 'Your site office shows up with its own solar power, heat and AC and a security mast, so you can run the job without relying on anyone else.', // NATE (Notion, 2026-11-20)
  price: null as string | null, // Ask Nate before showing a price (see CLAUDE.md)
  video: '/images/ws2-hero-rivian.mp4', // Nate's Rivian clip (2026-11-20), the drone following the tow through the snow
  poster: '/images/ws2-hero-rivian.jpg',
  alt: 'Drone view of a SPOG Workstation on tow behind an SUV on a snowy mountain road',
  stats: [
    ['Battery', '5 to 40 kWh'], // SOURCE (Product Wiki)
    ['Length', '10 or 20 ft'], // NATE
    ['Structural warranty', '3-year'], // SOURCE (Warranty Policy)
  ] as [string, string][],
};

export const subnavLinks: [string, string][] = [
  ['Overview', '#overview'],
  ['Tour', '#tour'],
  ['Inside', '#inside'],
  ['Anywhere', '#anywhere'],
  ['Build', '#built'],
  ['Power', '#runtime'],
  ['Specs', '#specs'],
  ['FAQ', '#faq'],
];

// ---------------------------------------------------------------- Redefining the site office (Cybertruck: Redefining the Pickup Truck)

export const overview = {
  heading: ['Redefining the', 'site office.'], // NEW
  sub: 'Whatever the job, the lot or the crew, Workstation was built to be the office that runs it.', // NEW
  cards: [
    {
      title: 'Bring the whole team', // NEW (Cybertruck: Bring It All)
      body: 'Up to 20 ft of finished office gives your super, PM and the subs room to work, with built-in desks and storage for plans, laptops and files. Daily reports, plan reviews and calls all happen in one place.', // NEW
      media: { src: shoot.wsInteriorOffice, alt: 'Inside a SPOG Workstation, white walls, built-in desks and monitors on a blue accent wall', position: '45% 50%' },
    },
    {
      title: 'Power on tap', // NEW (Cybertruck: Power On Tap)
      body: 'Up to 40 kWh of battery storage runs 120, 208 or 240 V outlets inside the office and on the outside of the trailer. Plug in work lights on the lot and the laptops, printers and monitors at the desks, and the battery runs all of it on stored solar power.', // NEW, voltages NATE (same as Cargo)
      // Stand-in: SPOG's battery units, photographed in the black Cargo (the same system). Wanted (shot list): the batteries in a Workstation, and work lights plugged into the outside outlet.
      media: { src: shoot.cargoStorageCard, alt: 'SPOG battery units standing on a low platform inside a trailer', position: '50% 60%' },
    },
    {
      title: 'Make it yours', // NEW (Cybertruck: Full Range of Motion)
      body: 'Every Workstation is built to order, so the inside is laid out around how your team works. Pick the finish, the furniture and where everything goes with your SPOG contact.', // NEW
      // Stand-in: the wall screen in the wood office. Wanted: a layout or walkthrough shot.
      media: { video: '/images/ws2-card-interior.mp4', poster: '/images/ws2-card-interior.jpg', alt: 'A wall screen inside a wood-walled SPOG Workstation' },
    },
    {
      title: 'Lock down the site', // NEW (Cybertruck: Lockable Storage), NATE's direction ("the full security system is what makes it unique")
      body: "A 6 ft mast with work lights and a camera comes standard and keeps watch over the site after the crew goes home. Step up to the optional 28 ft mast to see more of the lot, and add a 360 camera and a horn that scares off anyone who shouldn't be there.", // NEW, facts NATE (2026-11-20)
      // Wanted: a night video of the mast going up with the lights on.
      media: { src: shoot.wsSecurityMast, alt: 'Work lights and two dome cameras on top of a SPOG security mast', position: '50% 45%' },
    },
    {
      title: 'Throw the job at it', // NEW (Cybertruck: Throw Anything at It)
      body: 'Every Workstation rides on a welded steel frame, drawn in CAD to carry the weight of the solar, the battery and the whole office. Gravel roads, muddy lots and a season of snow come with the job, and the frame is built to take them.', // NEW, steel frame NATE
      media: { video: '/images/cargo2-weld-loop.mp4', poster: '/images/cargo2-weld-loop.jpg', alt: 'A welder joining a steel trailer frame in the SPOG shop' },
    },
  ] as Card[],
};

// ---------------------------------------------------------------- 3D tour (no Cybertruck twin), placed by Nate after the overview

export const tour = {
  ...cargoTour,
  heading: ['See how it works', 'for you.'], // NATE (Cargo 2)
};
export const tourStandIn = 'This is the Cargo model, standing in until the Workstation model is built from the 360 shoot.'; // NEW, PLACEHOLDER (Nate: "Cargo 3d model for now")

// ---------------------------------------------------------------- Tough on the outside, comfortable on the inside (Cybertruck, one-to-one)

export const comfort = {
  heading: ['Tough on the outside,', 'comfortable on the inside.'], // NATE (Cybertruck's line)
  sub: 'The outside is built for the job site, and the inside is a premium office. Choose wood walls with warm strip lighting and dark cabinets, or bright white composite, both on insulated vinyl floors.', // NEW, finishes SOURCE (Product Wiki)
  lead: { video: '/images/ws2-comfort-loop.mp4', poster: '/images/ws2-comfort-loop.jpg', alt: 'The empty wood-walled office inside a SPOG Workstation, a desk and two monitors under warm light' } as Media, // Nate's Workstation Interior video, the empty office
  cards: [
    {
      title: 'Enter another world', // NEW (Cybertruck: Enter Another World)
      body: 'Step off a muddy lot, close the door and the job site goes quiet. With no generator running outside the window, you can take a client call at 6 a.m., and the crew can start early on a residential street without waking the neighbors.', // NEW on SOURCE (messaging report: generator noise at 5 or 6 a.m.)
      // Stand-in: the navy Workstation with its doors open. Wanted: early morning on a residential site.
      media: { src: shoot.wsNavyDoors, alt: 'A navy SPOG Workstation in the shop with both doors open and the lit wood interior showing', position: '50% 62%' },
    },
    {
      title: 'Bring the owner in', // NEW (Cybertruck: Have More Fun)
      body: "When the owner, the architect or the inspector stops by, they sit down in an office that shows your company runs a tight job. It's the room where the client meeting happens, so it's finished to look the part.", // NEW on SOURCE (messaging report)
      media: { src: shoot.wsInteriorPremium, alt: 'Inside a SPOG Workstation, wood walls, dark cabinets and warm strip lighting along the ceiling', position: '50% 50%' },
    },
  ] as Card[],
};

// ---------------------------------------------------------------- Take it anywhere (Cybertruck: Take on Any Terrain, with its drive modes)

export const anywhere = {
  heading: ['Take it', 'anywhere.'], // NATE
  sub: 'Solar power and heat and AC come built in, Starlink is one add-on away, and the whole office hitches up and tows, so you stay comfortable and connected wherever the job is.', // NEW
  lead: { src: shoot.wsRuralSunset, alt: 'A dark SPOG Workstation at sunset beside a farm field, its solar awning open', position: '50% 55%' } as Media, // The Rivian clip moved to the hero (Nate, 2026-11-20)
  cards: [
    {
      title: 'Solar power',
      body: 'Panels across the roof recharge the battery every sunny day, and roof solar comes standard on every Workstation.', // NEW, SOURCE (Product Wiki)
      media: { src: '/images/ws2-card-roof.jpg', alt: 'Solar panels across the roof of a SPOG Workstation, seen from above' }, // Cropped from Nate's aerial photo (ws-aerial-mast), as approved in the doc
    },
    {
      title: 'Heat and AC',
      body: 'Heating and cooling come standard, with a hyper-heating heat pump on the larger Workstations for cold mornings. [HEAT PUMP: which model the 10 and 20 ft get]', // NEW on SOURCE (messaging report). GAP
      media: { src: shoot.wsHvac, alt: 'Heating and cooling unit in an open side compartment of a white SPOG Workstation', position: '62% 50%' },
    },
    {
      title: 'Stay connected',
      body: 'Add Starlink and the office has internet wherever you park it, even on rural lots where phones lose signal. The super sends the daily report from the desk, and the phone rings when the client calls.', // NEW, NATE's direction
      media: { src: shoot.cargoStarlinkCard, alt: 'Starlink dish on top of a SPOG mast against a blue sky', position: '50% 30%' },
    },
    {
      title: 'Hitch up and go',
      body: 'The office tows to the next job, so you skip the delivery and pickup fees a rented office charges each way.', // NEW on SOURCE (messaging report)
      media: { video: '/images/ws2-card-tow.mp4', poster: '/images/ws2-card-tow.jpg', alt: 'A dark SPOG Workstation parked on a hilltop with snowy mountains behind it' }, // Nate's mountain shot
    },
  ] as Card[],
  stats: [
    ['[WEIGHT] lbs', 'Weight'], // GAP
    ['10 or 20 ft', 'Length'], // NATE
    ['[TOW VEHICLE]', 'Tows behind'], // GAP
  ] as [string, string][],
};

// ---------------------------------------------------------------- Your office on the road (Cybertruck: The Future of Travel Is Autonomous)

export const road = {
  heading: ['Your office', 'on the road.'], // NEW
  body: 'The same office works for creators, consultants, digital nomads and anyone who runs a business from the road. Park it at a job, a campsite or your own driveway, open the door and get to work.', // NEW on NATE
  media: { video: '/images/ws2-road-loop.mp4', poster: '/images/ws2-road-loop.jpg', alt: 'Someone at work at a desk with two monitors inside a wood-walled SPOG Workstation, seen from behind' } as Media, // Nate's Workstation Interior video and the influencer footage. No faces or cars.
};

// ---------------------------------------------------------------- Built to last (Cybertruck: Designed to Be the Safest Truck on the Road)

export const built = {
  heading: ['Built to last', 'on the job site.'], // NEW
  sub: 'Other companies cut corners with staples and glue. Every Workstation is engineered, welded and wired by our own crew.', // NATE's line (Cargo 2)
  cards: [
    {
      title: 'Built in Middletown, NY',
      body: 'Our own crew welds, wires and finishes every Workstation in our shop in Middletown, New York, USA. Book a demo and see one being built.', // NEW
      media: { video: '/images/about-shop-loop.mp4', poster: '/images/about-shop-loop.jpg', alt: 'Flying through the SPOG shop in Middletown, New York, past a welder at work' },
    },
    {
      title: 'Certified and tested',
      body: 'The wiring, battery, solar and outlets are designed together and tested as one system, and every Workstation is certified to [CERTIFICATION 1] and [CERTIFICATION 2].', // NEW on SOURCE (Objections & FAQ). GAP
      media: { src: shoot.engineeringCad, alt: 'A SPOG engineer working on a trailer frame in CAD', position: '30% 50%' }, // Wanted: a testing or inspection shot
    },
    {
      title: 'Service on site', // (Cybertruck: Full Self-Driving slot)
      body: 'If something needs work, we diagnose it remotely and send our mobile service fleet to your site. Every Workstation carries a 3-year limited structural warranty and a 1-year limited parts warranty.', // SOURCE (Warranty Policy)
      media: { src: shoot.wsFlagShop, alt: 'A white SPOG Workstation in the Middletown shop under an American flag', position: '62% 50%' }, // Wanted: a service truck on a site
    },
  ] as Card[],
};

// ---------------------------------------------------------------- Add what you need (Cybertruck: Add What You Need)

export const options = {
  heading: ['Add what', 'you need.'], // NEW
  sub: 'Pick the extras that fit your crew, and your SPOG contact will confirm what fits your build.', // NEW
  items: [
    { icon: 'desk', name: 'Office desks', line: 'Add desks when more of your team works out of the trailer.' },
    { icon: 'plug', name: 'Refrigerator and microwave', line: 'Keep lunch and cold drinks in the office so nobody has to drive into town.' },
    { icon: 'wifi', name: 'Starlink', line: 'Satellite internet comes installed on the trailer and ready to use.' },
    { icon: 'pulse', name: 'Cellular router', line: 'A router gives you fast internet on sites where the cell signal is strong.' },
    { icon: 'screen', name: 'TV or monitor', line: 'Put the drawings and the schedule up on a big screen for site meetings.' },
    { icon: 'check', name: 'Whiteboard', line: 'Plan the week where the whole crew can see it.' },
    { icon: 'tag', name: 'Company logo and colors', line: "Put your company's name on the trailer at the front of every job." },
    { icon: 'fuel', name: 'Generator hookup', line: 'Plug in a generator as a backup through a long stretch of cloudy days.' },
  ], // NEW lines, options SOURCE (options sheet, Product Wiki)
};

// ---------------------------------------------------------------- Power anything (Cybertruck: Power Anything With Cybertruck)

/** Battery sizes and devices for the run-time list. 30 kWh is off because it isn't on the options sheet. */
export const runtime: ProductPage = {
  ...productPages.workstation,
  power: { batteries: [5, 10, 20, 40], defaultBattery: 20, devices: ['computer', 'lightTower', 'saw', 'welder'] },
};
/**
 * Calmer layout (Nate, 2026-11-20, "it just feels kinda busy"): the welding clip on one side, and the
 * heading, battery sizes and one short list of run times on the other. The three-number row is gone,
 * because the list shows the same figures.
 */
export const power = {
  heading: ['Power anything', 'with Workstation.'], // NATE
  intro: 'Pick a battery size and see how long it runs the lights, laptops and equipment on your site.', // NEW
  media: { video: '/images/ws2-power-weld.mp4', poster: '/images/ws2-power-weld.jpg', alt: 'A welder in a flag-painted helmet at work behind a SPOG trailer' } as Media, // Nate's "Welding Outside" clip, the close-up half (the drone half shows other brands' trucks)
  fine: 'Hours of continuous use on a full battery, one device at a time, with no solar recharge counted. The figures come from the SPOG runtime guide.', // SOURCE (product pages)
};

// ---------------------------------------------------------------- case study (Rivian Fleet: "Helping Amazon Electrify at Scale")

export const caseStudy = {
  heading: 'Ground control for Joby Aviation.', // NEW
  image: '/images/ws2-joby.jpg', // Joby gave permission (Nate, 2026-11-20)
  alt: 'A white SPOG trailer branded Joby Autonomy ground control station, parked beside an aircraft outside a hangar',
  rows: [
    ['The need', "A mobile ground control station for Joby Autonomy's flight program, able to set up on the flight line and run on its own power."],
    ['What we built', 'A custom SPOG trailer to their specs, with entry steps, a side door and full Joby branding.'],
    ['The result', 'The trailer served as ground control for the aircraft, running all analytics and communications and tracking the plane at all times. It never needed an outside power source.'],
  ] as [string, string][], // NATE (Notion, 2026-11-20)
};

// ---------------------------------------------------------------- specs, close and FAQ

export const specs = {
  heading: ['Workstation', 'at a glance.'], // NEW
  image: '/images/lineup-workstation.webp', // Nate's cut-out, on the light specs section (2026-11-20)
  alt: 'Navy SPOG Workstation trailer with two doors and steps',
  rows: [
    ['Type', 'Site office trailer'], // NEW
    ['Length', '10 or 20 ft'], // NATE
    ['Weight', '[WEIGHT] lbs'], // GAP
    ['Frame', 'Welded steel'], // NATE
    ['Battery storage', '5 to 40 kWh'], // SOURCE (Product Wiki)
    ['Roof solar', 'Standard'], // SOURCE (Product Wiki)
    ['Outlets', '120, 208 or 240 V, inside and outside'], // NATE (same as Cargo)
    ['Heating and cooling', 'Standard'], // NATE, SOURCE (brand kit)
    ['Security', '6 ft mast with work lights and a camera, standard. 28 ft mast, 360 camera and horn, optional'], // NATE (2026-11-20)
    ['Interior', 'White composite or premium wood, with built-in desks'], // SOURCE (Product Wiki)
    ['Floor', 'Insulated vinyl'], // SOURCE (Product Wiki)
    ['Internet', 'Starlink or a cellular router, optional'], // SOURCE (Product Wiki, options sheet)
    ['Certifications', '[CERTIFICATION 1] and [CERTIFICATION 2]'], // GAP
    ['Warranty', '1-year limited parts, 3-year limited structural'], // SOURCE (Warranty Policy)
    ['Service', 'Remote diagnosis and a mobile service fleet'], // SOURCE (Warranty Policy)
    ['Built in', 'Middletown, New York'], // SOURCE
  ] as [string, string][],
  fine: 'Options are for discussion. Availability, pricing and final specifications are confirmed in writing by SPOG.', // SOURCE (options sheet)
};

export const close = {
  heading: 'Run the job from day one.', // SOURCE (messaging report one-liner)
  body: 'See a Workstation up close and get your questions answered.', // NEW
};

/** Only what the page doesn't already answer (v3). */
export const faqs = [
  {
    q: 'Will the battery run the heat and AC all day?', // SOURCE (messaging report objection)
    a: "It depends on the battery size, the weather and how the office is used. Book a demo and we'll walk you through the run time for your site and season.", // NEW
    link: { label: 'Book a demo', href: '/demo' },
  },
  {
    q: 'Can I rent a Workstation instead of buying one?', // SOURCE (messaging report)
    a: 'Yes, Workstations can be bought or rented. Ask your SPOG contact about rental terms for your project.', // SOURCE (Product Wiki). Nate to confirm renting is ready
  },
  {
    q: 'Can I see one first?', // NEW
    a: 'Yes, book an in-person demo or a video call, or call the shop at 1 (855) 720-2290.', // NEW
    link: { label: 'Book a demo', href: '/demo' },
  },
];
