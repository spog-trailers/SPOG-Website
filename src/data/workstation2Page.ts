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
 *            None are left after the 2026-11-20 facts pass.
 *
 * Facts pass (2026-11-20): rewritten to SPOG's external price sheet of 2026-11-20 and Nate's answers
 * to questions about it, which overrule the earlier notes here. Base prices $18,500 (10 ft) and
 * $75,000 (20 ft), shown with Nate's approval. Battery 5 kWh (10 ft) or 10 kWh (20 ft), up to 20 kWh.
 * 120 V on the 10 ft, 120 and 208 V on the 20 ft, no 240 V. Heating and cooling standard, a hyper-
 * heating heat pump on the 20 ft. No security mast comes standard: the 6 ft telescopic light (a light
 * only, no camera) is an add-on on both sizes, and the 28 ft light tower package (an AI or a regular
 * camera, a light and a horn) is 20 ft only. No 360 camera, no cameras on the 10 ft. Shelving,
 * cabinets and overhead storage are gone. Vinyl floor on every size. Add-on prices stay off the page
 * (as on Cargo 2) until Nate says to show them. People power lights and laptops more than they charge
 * tools. Joby gave permission for the case study.
 */
import type { Feature } from './features';
import { shoot } from './content';
import { tour as cargoTour } from './cargo2Page';
import { productPages, type ProductPage } from './productPages';

export const meta = {
  title: 'SPOG Workstation | Solar power site office trailer', // SOURCE (current /workstation)
  description: 'The SPOG Workstation is a site office trailer with its own solar power and climate control, built on a welded steel frame in Middletown, New York, in 10 or 20 ft.', // NEW, security mast dropped because it's an add-on now (NATE, 2026-11-20 answers)
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
  line: 'Your site office shows up with its own solar power and climate control, so you can run the job without relying on anyone else.', // NATE (Notion, 2026-11-20), "climate control" for "heat and AC" (Meeting with Alessandro and Joe, 2026-11-20). "And a security mast" dropped, the mast is an add-on (NATE, 2026-11-20 answers)
  price: 'Starting at $18,500' as string | null, // NATE (2026-11-20 answers), SOURCE (price sheet 2026-11-20: the 10 ft Workstation base price)
  video: '/images/ws2-hero-rivian.mp4', // Nate's Rivian clip (2026-11-20), the drone following the tow through the snow
  poster: '/images/ws2-hero-rivian.jpg',
  alt: 'Drone view of a SPOG Workstation on tow behind an SUV on a snowy mountain road',
  stats: [
    ['Battery', '5 to 20 kWh'], // SOURCE (price sheet 2026-11-20: 5 or 10 kWh base, 20 kWh max, no 40 kWh)
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
      body: 'Up to 20 ft of finished office gives your super, PM and the subs room to work, with a built-in work desk for plans, laptops and files. Daily reports, plan reviews and calls all happen in one place.', // NEW. One built-in desk SOURCE (price sheet 2026-11-20). Storage dropped: shelving, cabinets and overhead storage are removed (NATE, 2026-11-20 answers). Extra desks are a tile in Add what you need
      media: { src: shoot.wsInteriorOffice, alt: 'Inside a SPOG Workstation, white walls, built-in desks and monitors on a blue accent wall', position: '45% 50%' },
    },
    {
      title: 'Power on tap', // NEW (Cybertruck: Power On Tap)
      body: 'Every Workstation has 120 V outlets inside the office and on the outside of the trailer, and the 20 ft adds 208 V. Plug in work lights on the lot and the laptops, printers and monitors in the office, and the battery runs all of it on stored solar power.', // NEW. Voltages SOURCE (price sheet 2026-11-20: 120 V on the 10 ft, 120 and 208 V on the 20 ft, no 240 V). Battery sizes live in the Power section, outlet counts in Specs, so each is said once
      // Stand-in: SPOG's battery units, photographed in the black Cargo (the same system). Wanted (shot list): the batteries in a Workstation, and work lights plugged into the outside outlet.
      media: { src: shoot.cargoStorageCard, alt: 'SPOG battery units standing on a low platform inside a trailer', position: '50% 60%' },
    },
    {
      title: 'Make it yours', // NEW (Cybertruck: Full Range of Motion)
      body: 'Every Workstation is built to order, so the inside is laid out around how your team works. Pick the furniture, the screens and where everything goes with your SPOG contact.', // NEW. "The finish" dropped (2026-11-20 facts pass): the finish choice is 20 ft only and the comfort section says it
      // A push-in through the door into the empty office, from the influencer video (65 to 70 s), recut
      // 2026-11-20 because Nate found the wall screen crop poor. A real layout or walkthrough shot would still be stronger.
      media: { video: '/images/ws2-card-interior.mp4', poster: '/images/ws2-card-interior.jpg', alt: 'Moving through the door of a SPOG Workstation into a wood-walled office with a desk, two monitors and a chair' },
    },
    {
      title: 'Lock down the site', // NEW (Cybertruck: Lockable Storage), NATE's direction ("the full security system is what makes it unique")
      body: "Add the 28 ft light tower package to a 20 ft Workstation, and a security camera and a light watch the lot from high above after the crew goes home. Pick an AI camera or a regular one for the same price, and the horn scares off anyone who shouldn't be there.", // NEW. Facts SOURCE (price sheet 2026-11-20: the 28 ft light tower package, 20 ft only) and NATE (2026-11-20 answers: AI or regular camera, same price; no mast comes standard; no 360 camera; no cameras on the 10 ft)
      // The tower lives here and nowhere else on the page (it left the Add what you need carousel in the
      // 2026-11-20 facts pass, so it's said once). The 6 ft telescopic light, a light only, is a tile there.
      // Nate's raised-tower photo (ws2-opt-tower), cropped to the trailer and the mast. Wanted: a night video of the tower going up with the light on.
      media: { src: shoot.wsOptTower, alt: 'A white SPOG Workstation on an empty lot with its 28 ft light tower raised', position: '54% 50%' },
    },
    {
      title: 'Throw the job at it', // NEW (Cybertruck: Throw Anything at It)
      body: 'Every Workstation rides on a welded steel frame, drawn in CAD to carry the weight of the solar, the battery and the whole office. Gravel roads, muddy lots and a season of snow come with the job, and the frame is built to take them.', // NEW, steel frame NATE
      media: { video: '/images/cargo2-weld-loop.mp4', poster: '/images/cargo2-weld-loop.jpg', alt: 'A welder joining a steel trailer frame in the SPOG shop' },
    },
  ] as Card[],
};

/** Photo band (Nate, 2026-11-20: a giant photo with a little text, like /workstation's). */
export const band = {
  image: shoot.wsBand,
  alt: 'A white SPOG Workstation with its light mast raised, parked in front of a warehouse',
  position: '62% 55%',
  heading: 'Powering the Builders of America.', // SOURCE (tagline)
};

/**
 * The overview in the card look of /workstation's "Power, heat and air" section (Nate, 2026-11-20):
 * tall cards with the name and one short line on the photo or video, and a "+" that opens a panel
 * with the card's two sentences and the numbers. Built from `overview.cards` so the approved bodies
 * stay in one place. The short lines are NEW. Numbers SOURCE (price sheet 2026-11-20).
 */
const lines: Record<string, { line: string; stats?: [string, string][] }> = {
  'Bring the whole team': { line: 'An office the whole crew can work from.', stats: [['Length', '10 or 20 ft'], ['Desk', 'One built in, standard']] },
  'Power on tap': { line: 'Outlets inside and out, on stored solar power.', stats: [['Battery', '5 to 20 kWh'], ['Outlets', 'Up to 4 outside and 8 inside']] },
  'Make it yours': { line: 'Laid out around how your team works.', stats: [['Interior', 'White composite, or premium wood on the 20 ft']] },
  'Lock down the site': { line: 'A camera and a light high over the lot.', stats: [['Tower', '28 ft, on the 20 ft'], ['Camera', 'AI or regular, same price']] },
  'Throw the job at it': { line: 'A welded steel frame under the whole office.', stats: [['Frame', 'Welded steel'], ['Warranty', '3-year limited structural']] },
};
export const overviewFeatures: Feature[] = overview.cards.map((c, i) => {
  const extra = lines[c.title];
  return {
    id: `ws-${i + 1}`,
    title: c.title,
    line: extra?.line ?? '',
    image: c.media.video ? c.media.poster : c.media.src,
    video: c.media.video,
    alt: c.media.alt,
    position: c.media.position,
    panel: { intro: c.body, stats: extra?.stats },
  };
});

// ---------------------------------------------------------------- 3D tour (no Cybertruck twin), placed by Nate after the overview

export const tour = {
  ...cargoTour,
  heading: ['See how it works', 'for you.'], // NATE (Cargo 2)
  extras: 'Shown with optional E-track on the walls.', // NEW (2026-11-20 facts pass): overrides Cargo 2's line, because climate control is standard on every Workstation (price sheet 2026-11-20)
};
export const tourStandIn = 'This is the Cargo model, standing in until the Workstation model is built from the 360 shoot.'; // NEW, PLACEHOLDER (Nate: "Cargo 3d model for now")

// ---------------------------------------------------------------- Tough on the outside, comfortable on the inside (Cybertruck, one-to-one)

export const comfort = {
  heading: ['Tough on the outside,', 'comfortable on the inside.'], // NATE (Cybertruck's line)
  sub: 'The outside is built for the job site, and the inside is a premium office, insulated through the walls, floor and ceiling and finished with a vinyl floor. On the 20 ft, pick wood walls with warm strip lighting or bright white composite at no extra cost, and the 10 ft comes in white composite.', // NEW. Facts SOURCE (price sheet 2026-11-20: insulation, the 20 ft's free choice of white composite or premium wood, the 10 ft's white composite) and NATE (2026-11-20 answers: vinyl on every model). "Dark cabinets" dropped, cabinets are removed
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
      // CONFIRM: the photo still shows dark cabinets, which are no longer offered (NATE, 2026-11-20 answers).
      media: { src: shoot.wsInteriorPremium, alt: 'Inside a SPOG Workstation, wood walls and warm strip lighting along the ceiling', position: '50% 50%' },
    },
  ] as Card[],
};

// ---------------------------------------------------------------- Take it anywhere (Cybertruck: Take on Any Terrain, with its drive modes)

export const anywhere = {
  heading: ['Take it', 'anywhere.'], // NATE
  sub: "Wherever the job takes you, the office comes along and is ready to work the day it lands.", // NEW (2026-11-20 facts pass, review fix). The intro no longer previews the cards, so solar, climate control, Starlink and towing are each said once, in their own card below
  lead: { src: shoot.wsRuralSunset, alt: 'A dark SPOG Workstation at sunset beside a farm field, its solar awning open', position: '50% 55%' } as Media, // The Rivian clip moved to the hero (Nate, 2026-11-20)
  cards: [
    {
      title: 'Solar power',
      body: 'Every Workstation comes with roof solar that charges the battery, 900 W of panels on the 10 ft and 2,800 W on the 20 ft.', // NEW. Watts SOURCE (price sheet 2026-11-20)
      media: { src: '/images/ws2-card-roof.jpg', alt: 'Solar panels across the roof of a SPOG Workstation, seen from above' }, // Cropped from Nate's aerial photo (ws-aerial-mast), as approved in the doc
    },
    {
      title: 'Climate control',
      body: 'Heating and cooling come standard on every Workstation, and the 20 ft has a hyper-heating heat pump for cold mornings.', // NEW on SOURCE (messaging report). [HEAT PUMP] gap filled from the price sheet (2026-11-20): heating and cooling included on both sizes, a hyper-heating heat pump on the 20 ft
      media: { src: shoot.wsHvac, alt: 'Heating and cooling unit in an open side compartment of a white SPOG Workstation', position: '62% 50%' },
    },
    {
      title: 'Stay connected',
      body: 'Add Starlink and we install the dish on the trailer, so the office has internet even on rural lots where phones lose signal. You set up your own Starlink plan, and the super sends the daily report from the desk.', // NEW, NATE's direction. Dish and install included, plan set up by the buyer NATE (2026-11-20 answers). The one place Starlink is sold on the page (its options tile is gone)
      media: { src: '/images/cargo2-starlink-dish-card.jpg', alt: 'Starlink dish on top of a SPOG mast against a blue sky', position: '50% 50%' }, // SOURCE (2026-11-20 facts pass): the crop above the dome cameras, as on Cargo 2
    },
    {
      title: 'Hitch up and go',
      body: 'The office tows to the next job, so you skip the delivery and pickup fees a rented office charges each way.', // NEW on SOURCE (messaging report)
      media: { video: '/images/ws2-card-tow.mp4', poster: '/images/ws2-card-tow.jpg', alt: 'A dark SPOG Workstation parked on a hilltop with snowy mountains behind it' }, // Nate's mountain shot
    },
  ] as Card[],
  stats: [
    ['7,000 or 14,000 lbs', 'Max loaded weight'], // SOURCE (price sheet 2026-11-20: GVWR 7,000 lbs on the 10 ft, 14,000 lbs on the 20 ft), NATE (2026-11-20 answers: show the weight)
    ['10 or 20 ft', 'Length'], // NATE
    ['Dual axle', 'On both sizes'], // SOURCE (price sheet 2026-11-20). Replaces the tow vehicle gap: the page never claims what vehicle can tow it
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
      title: 'Tested as one system',
      body: 'The wiring, battery, solar and outlets are designed together and tested as one system in the shop.', // NEW on SOURCE (Objections & FAQ). Certifications held until the NATM inspection passes (Meeting with Alessandro and Joe, 2026-11-20). Name them here when it does
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

/**
 * Laid out like Cybertruck's "Add What You Need" (Nate, 2026-11-20): the options with a photo run as
 * a carousel of large cards, and the rest sit underneath as small tiles. Facts pass (2026-11-20): the
 * 28 ft tower card Nate added here moved to the Lock down the site card, so security is said once (as
 * on Cargo 2). The 6 ft telescopic light took the Starlink tile's place (Starlink is sold in Take it
 * anywhere), which keeps the tile row at four. Add-on prices stay off the page until Nate says.
 */
export const options = {
  heading: ['Add what', 'you need.'], // NEW
  sub: 'Pick the extras that fit your crew, and your SPOG contact will confirm what fits your build.', // NEW
  cards: [
    {
      title: 'TV or monitor',
      body: 'Put the drawings and the schedule up on a big screen for site meetings.', // NEW
      media: { src: shoot.wsOptTv, alt: 'A wall-mounted TV and four monitors on a blue wall inside a SPOG Workstation', position: '50% 18%' },
    },
    {
      title: 'Company logo and colors',
      body: "Pick the trailer color and put your company's name and logo on it, so everyone on the job knows whose office it is.", // NEW
      media: { src: shoot.wsOptLogo, alt: "A navy SPOG Workstation in the shop with a customer's logo on the side and both doors open", position: '50% 62%' }, // CONFIRM the customer's permission to show their branding
    },
    {
      title: 'Generator hookup',
      body: 'Plug in a generator as a backup through a long stretch of cloudy days.', // NEW
      media: { src: shoot.wsOptGenerator, alt: 'A portable generator on the grass plugged into a white SPOG Workstation', position: '50% 70%' },
    },
  ] as Card[],
  more: [
    { icon: 'desk', name: 'Office desks', line: 'Add desks when more of your team works out of the trailer.' }, // NEW, extra desks NATE (2026-11-20 answers, from Alessandro)
    { icon: 'plug', name: 'Refrigerator and microwave', line: 'Keep lunch and cold drinks in the office so nobody has to drive into town.' }, // NEW
    { icon: 'sun', name: '6 ft telescopic light', line: 'A light on a 6 ft mast lights up the lot at night, which helps keep the site secure and lets the crew keep working after the sun goes down.' }, // NEW. SOURCE (price sheet 2026-11-20: an add-on on both sizes), NATE (2026-11-20 answers: a light only, no camera, good for security and for working after dark)
    { icon: 'pulse', name: 'Cellular router', line: 'A router gives you fast internet on sites where the cell signal is strong.' }, // NEW
  ], // options SOURCE (options sheet, Product Wiki, price sheet 2026-11-20)
};

// ---------------------------------------------------------------- Power anything (Cybertruck: Power Anything With Cybertruck)

/**
 * Battery sizes and devices for the run-time list. Sizes follow the price sheet (2026-11-20): 5 kWh on
 * the 10 ft, 10 kWh on the 20 ft, adding 5 kWh at a time up to 20 kWh. The list opens on 10 kWh, the
 * 20 ft's standard battery.
 */
export const runtime: ProductPage = {
  ...productPages.workstation,
  power: { batteries: [5, 10, 15, 20], defaultBattery: 10, devices: ['computer', 'lightTower', 'saw', 'welder'] }, // SOURCE (price sheet 2026-11-20)
};
/**
 * Calmer layout (Nate, 2026-11-20, "it just feels kinda busy"): the welding clip on one side, and the
 * heading, battery sizes and one short list of run times on the other. The three-number row is gone,
 * because the list shows the same figures.
 */
export const power = {
  heading: ['Power anything', 'with Workstation.'], // NATE
  intro: 'The 10 ft comes with a 5 kWh battery and the 20 ft with 10 kWh, and either one adds 5 kWh at a time up to 20 kWh. Pick a size and see how long it runs the lights, laptops and equipment on your site.', // NEW. Battery sizes SOURCE (price sheet 2026-11-20)
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
  // Rewritten to the price sheet (2026-11-20), in the same pattern as Cargo 2's table. Every row is
  // SOURCE (price sheet 2026-11-20) unless marked. No 10 ft height until the research on how the sheet
  // measures it is done.
  rows: [
    ['Type', 'Site office trailer'], // NEW
    ['Outside size', '10 ft long and 6.5 ft wide, or 20 ft long, 8 ft wide and 8 ft tall'], // SOURCE
    ['Max loaded weight (GVWR)', '7,000 lbs on the 10 ft, 14,000 lbs on the 20 ft'], // SOURCE, NATE (2026-11-20 answers)
    ['Axles', 'Dual axle on both sizes'], // SOURCE
    ['Frame', 'Welded steel'], // NATE
    ['Battery', '5 kWh on the 10 ft and 10 kWh on the 20 ft, adding 5 kWh at a time up to 20 kWh'], // SOURCE (no 40 kWh)
    ['Roof solar', '900 W on the 10 ft, 2,800 W on the 20 ft'], // SOURCE
    ['Inverter', '3,000 W on the 10 ft, 6,000 W on the 20 ft'], // SOURCE
    ['Electrical system', '48 V DC, with 120 V on the 10 ft and 120 V and 208 V on the 20 ft'], // SOURCE (no 240 V)
    ['Outlets', '3 outside and 5 inside on the 10 ft, 4 outside and 8 inside on the 20 ft'], // SOURCE
    ['Shore power connection', '30, 50 or 100 amp, available on request'], // SOURCE (options sheet). Not on the price sheet but still offered
    ['Climate control', 'Heating and cooling, standard, with a hyper-heating heat pump on the 20 ft'], // SOURCE, "climate control" (Meeting with Alessandro and Joe, 2026-11-20)
    ['Insulation', 'Walls, floor and ceiling'], // SOURCE
    ['Interior walls', 'White composite on the 10 ft. White composite or premium wood on the 20 ft, at no extra cost'], // SOURCE, NATE (2026-11-20 answers: a free choice)
    ['Floor', 'Insulated vinyl'], // SOURCE, NATE (2026-11-20 answers: vinyl on every model)
    ['Desk', 'One built-in work desk, in the corner on the 10 ft'], // SOURCE
    ['Doors', 'Side entry door and rear double doors on the 10 ft, a 36 in entry door and a single rear door on the 20 ft'], // SOURCE, NATE (2026-11-20 answers: the 20 ft's single rear door, as in the blue Workstation photos)
    ['Window', 'One 60 in wide, 30 in tall window on the 20 ft'], // SOURCE
    ['Security', '6 ft telescopic light, optional on both sizes. 28 ft light tower package with a camera, a light and a horn, optional on the 20 ft'], // SOURCE, NATE (2026-11-20 answers: nothing standard, no camera on the 6 ft light, no 360 camera)
    ['Internet', 'Starlink or a cellular router, optional'], // SOURCE (options sheet, price sheet 2026-11-20)
    // ['Certifications', '[CERTIFICATION 1] and [CERTIFICATION 2]'], // held until the NATM inspection passes (Meeting with Alessandro and Joe, 2026-11-20)
    ['Warranty', '1-year limited parts, 3-year limited structural'], // SOURCE (Warranty Policy)
    ['Service', 'Remote diagnosis and a mobile service fleet'], // SOURCE (Warranty Policy)
    ['Built in', 'Middletown, New York'], // SOURCE
    ['Base price', '$18,500 for the 10 ft, $75,000 for the 20 ft'], // SOURCE, NATE approved showing the sheet's prices (2026-11-20)
  ] as [string, string][],
  fine: 'Base prices include everything listed as standard and exclude tax, title, registration and delivery. Availability and final specifications are confirmed in writing by SPOG.', // SOURCE (price sheet 2026-11-20, options sheet), same line as Cargo 2
};

export const close = {
  heading: 'Run the job from day one.', // SOURCE (messaging report one-liner)
  body: 'See a Workstation up close and get your questions answered.', // NEW
};

/** Only what the page doesn't already answer (v3). */
export const faqs = [
  {
    q: 'Will the battery run the climate control all day?', // SOURCE (messaging report objection), "climate control" for "heat and AC" (Meeting with Alessandro and Joe, 2026-11-20)
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
