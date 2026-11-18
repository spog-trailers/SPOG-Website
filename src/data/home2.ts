/**
 * Test homepage 2 at /test-home-2 (draft, 2026-11-18). The live homepage and /test-home are untouched.
 *
 * The copy is the "Home Page" item under Website Build in Notion's Company Roadmap, as Nate
 * left it on 2026-11-18 after working through it in comments. Edit copy there first, then here.
 *
 * Copy marks:
 *   NATE         his own words, or his pick, from the Notion comments
 *   SOURCE       an approved line (tagline, messaging reports, content.ts)
 *   NEW          written for this draft, needs Nate's approval
 *   CONFIRM      a number someone still has to confirm before launch
 *   PLACEHOLDER  stands in until the real thing exists
 */
import { closing, phone, shoot } from './content';
import type { Feature } from './features';

export const hero = {
  eyebrow: { gold: 'Powering the Builders of America' }, // SOURCE (tagline)
  heading: ['The trailer', 'that powers', 'your job.'], // NATE
  sub: 'All-electric, solar-charged trailers with battery storage sized to your work, for hauling gear, running a site office or hosting an event. Built in the USA.', // NATE
  primary: { label: 'Design your trailer', href: '#design' }, // NATE
  secondary: { label: 'Book a walkthrough', href: '#walkthrough' }, // SOURCE
};

/**
 * Thin strip under the hero. PLACEHOLDER: no approved quotes yet, so each slot only names who
 * the quote will come from (Nate: two contractors and one event customer). Never invent one.
 * Add `quote` and `name` to a slot when the real quote is signed off.
 */
export const proof: { badge: string; slots: { who: string; quote?: string; name?: string }[] } = {
  badge: 'Built in the USA', // SOURCE
  slots: [{ who: 'General contractor' }, { who: 'Subcontractor' }, { who: 'Event customer' }],
};

/**
 * The lineup, after Rivian's homepage: the name set huge behind the trailer, one sentence, one
 * line of facts and two buttons. The trailers are cut out of their photos (see CLAUDE.md).
 * Prices are the starting prices Nate gave on 2026-11-18. Never add or change one without him.
 *
 * Sizing per panel, in % of the stage (the area above the sentence), so it scales with the screen:
 *   fit:  [width, height] limits for the name's font size      shot: [width, height] limits for the trailer
 *   lap:  how far the trailer rides up over the name, as a share of the name's font size
 * Keep 0.8 * fit[1] - lap * fit[1] + shot[1] under 100, or the stack won't fit the stage.
 */
export type Tone = 'studio' | 'night';
export const lineup = {
  heading: 'Our 2027 lineup.', // NATE
  explore: 'Explore', // NATE (Rivian's pair)
  design: 'Design yours', // NATE
  panels: [
    {
      id: 'cargo', name: 'Cargo', tone: 'studio' as Tone, href: '/cargo',
      line: 'Haul all your gear, with the power to run your job.', // NATE
      facts: ['From $10,000', '10 or 20 ft', 'Up to 40 kWh'], // NATE. CONFIRM 40 kWh with Joe (the Product Wiki lists Cargo at 5 to 20 kWh)
      image: '/images/lineup-cargo.webp', width: 811, height: 928, // PLACEHOLDER: a render. Swap for a real Cargo photo.
      alt: 'SPOG Cargo trailer with a solar roof and a light mast',
      fit: [22, 46], shot: [80, 78], lap: 0.42,
    },
    {
      id: 'workstation', name: 'Workstation', tone: 'studio' as Tone, href: '/workstation',
      line: 'The site office that works the day it lands.', // SOURCE
      facts: ['From $15,000', '10 or 20 ft', 'Built-in climate control'], // NATE
      image: '/images/lineup-workstation.webp', width: 1700, height: 783,
      alt: 'Navy SPOG Workstation trailer with two doors and steps',
      fit: [10.6, 30], shot: [92, 80], lap: 0.42,
    },
    {
      id: 'event', name: 'Event', tone: 'night' as Tone, href: '/event',
      line: 'Own the night. Power it with the sun.', // SOURCE
      facts: ['Buy from $150,000, or rent one', '20 ft', 'Up to 40 kWh', 'Built-in LED screen'], // NATE. CONFIRM 40 kWh with Joe (the Product Wiki lists Event at 50 to 100 kWh)
      image: '/images/lineup-event.webp', width: 1800, height: 1055,
      alt: 'Black SPOG Event trailer with its solar wings open',
      fit: [15, 38], shot: [94, 76], lap: 0.3,
    },
  ],
  // The Coming Next page isn't built yet, so the tile points at the Coming next block on the live homepage.
  next: { kicker: 'Coming next', line: 'Garage, Disaster Relief and Camper are next.', cta: "See what's next", href: '/#next' }, // NEW
};

/** Three problems, one card each (Nate, 2026-11-18): power, security and comfort. */
export const problem = {
  heading: ['One trailer.', 'Three problems solved.'], // SOURCE (approved Workstation line)
  cards: [
    {
      icon: 'battery', title: 'Power',
      line: "Stop guessing where you'll get your power.", // NATE
      body: "Today it comes from a gas generator, a fuel run, a truck left idling or the homeowner's outlet. Each one costs you money, time or goodwill.", // NEW
    },
    {
      icon: 'camera', title: 'Security',
      line: 'Stop hauling your gear home every night.', // NEW
      body: 'A job site is an easy target after dark, so crews lose the end of the day loading tools out and the start of the next one loading them back in.', // NEW
    },
    {
      icon: 'climate', title: 'Comfort',
      line: 'Stop working through the heat and the cold.', // NEW
      body: 'Plans, calls and paperwork end up in a hot truck cab or a cold site office. Heat and AC come standard on the Workstation and are available on Cargo.', // NEW, facts from Nate
    },
  ],
};

/**
 * "What SPOG is made of." The feature cards from /test-home with Nate's copy changes. The small
 * line above the heading spells out the name (his design note). It follows the logo and the
 * decal on the trailers, which read "Solar Power Off Grid".
 */
export const madeOf = {
  label: 'What SPOG is made of',
  stands: ['Solar', 'Power', 'Off', 'Grid'],
  heading: ['What SPOG', 'is made of.'], // NATE
};

export const values: Feature[] = [
  {
    id: 'power',
    title: 'Power',
    line: 'Harness free power from the sun and store it on board.', // NATE. "Harness" is his choice, keep it.
    image: shoot.wsAerialMast,
    alt: 'SPOG trailer from above, solar panels across the roof',
    position: '50% 50%',
    panel: { intro: 'Every SPOG turns sunlight into power and stores it on board, with a free recharge every day it sits in the sun.' }, // NEW, from the Cargo report
  },
  {
    id: 'mobility',
    title: 'Mobility',
    line: 'Power that goes where the job goes.', // NEW, Nate's direction
    image: shoot.wsRuralSunset,
    alt: 'SPOG trailer parked by a farm field at sunset',
    position: '40% 50%',
    panel: { intro: 'No need to haul a generator or plug in at the job site. Pull in and your power is available immediately.' }, // NATE
  },
  {
    id: 'security',
    title: 'Security',
    line: "Protect what's yours.", // NATE
    image: shoot.wsSecurityMast,
    alt: 'Lights and cameras on the mast of a SPOG trailer',
    position: '50% 40%',
    panel: { intro: 'Theft is a risk on every job site. Add cameras to any SPOG to keep watch on the trailer, your gear and the site around it.' }, // NATE. CONFIRM which cameras ship at V1.
  },
  {
    id: 'quality',
    title: 'Quality',
    line: 'We stand by our work.', // NATE
    image: shoot.engineeringCad,
    alt: 'Engineer working on a trailer frame in CAD',
    position: '30% 50%',
    panel: { intro: '3-year structural warranty, covering the solar, electrical, battery and HVAC on every SPOG.' }, // NATE, current terms kept for V1
  },
  {
    id: 'made',
    title: 'American made',
    line: 'Built in Middletown, New York.', // SOURCE
    image: shoot.shopWelding,
    alt: 'Welder joining a steel trailer frame in the SPOG shop',
    position: '35% 50%',
    panel: {
      intro: 'Other companies cut corners with staples and glue. Every SPOG is designed and built by our own crew in Middletown, New York, from welding to wiring.', // NATE
      link: { label: 'Meet the shop', href: '#built' },
    },
  },
];

/** Mini about. Carries the factory, the warranty and the service, since the Guarantee block was cut. */
export const about = {
  eyebrow: 'Middletown, New York',
  lead: 'Built in Middletown, New York,', // NATE (heading, first half)
  rest: 'and backed in writing.', // NATE (heading, second half)
  body: "Every SPOG comes out of our shop in Middletown, built by a crew that comes from commercial construction. It's backed by a 3-year structural warranty, and our mobile service fleet comes to your site if something needs work.", // NEW, terms kept for V1
  cta: { label: 'See the factory', href: '#' }, // PLACEHOLDER: the About page isn't built yet
  image: shoot.wsFlagShop,
  position: '62% 50%',
};

/**
 * Close. Repeats the hero line. The two buttons pick which form shows on the right.
 * "Design your trailer" is a build request for now. It can't open the configurator until real
 * pricing is approved, because /configure/cargo runs on made-up sample prices.
 */
export const close = {
  eyebrow: closing.eyebrow, // SOURCE
  heading: hero.heading,
  body: 'See a SPOG up close and get your questions answered before your next job.', // NEW
  call: { label: `Or call ${phone.display}`, href: phone.href }, // SOURCE
  design: {
    tab: 'Design your trailer',
    title: 'Design your trailer', // NATE (button label)
    body: "Pick a trailer and a length, and tell us what you need it to do. We'll send back a build and a price.", // NEW
    trailers: ['Cargo', 'Workstation', 'Event'],
    lengths: ['10 ft', '20 ft', 'Not sure yet'], // SOURCE (Nate: Cargo and Workstation 10 or 20 ft, Event 20 ft)
    cta: 'Send my build request', // NEW
  },
  walkthrough: { tab: 'Book a walkthrough', ...closing.walkthrough }, // SOURCE
};

/**
 * Footer links in the order of the sitemap (Nate, 2026-11-18).
 * PLACEHOLDER: every "#" is a page that isn't built yet.
 */
export const footerColumns = [
  { title: 'Trailers', links: [['Cargo', '/cargo'], ['Workstation', '/workstation'], ['Event', '/event'], ['Coming Next', '/#next']] },
  { title: 'Company', links: [['About', '#built'], ['Reviews', '#'], ['Become a Dealer', '#']] },
  { title: 'Support', links: [['FAQ', '/#faq'], ['Contact', '#walkthrough'], ['Warranty', '#'], ['Blog', '#']] },
];
