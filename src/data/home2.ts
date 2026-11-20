/**
 * The homepage at / (built as Test homepage 2, made the homepage 2026-11-18). The old homepage is at /old-home.
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
import { closing, phone, shoot, nextUp, navLinks as siteLinks, footerColumns as siteFooter, faqs as siteFaqs } from './content';
import type { Feature } from './features';

export const hero = {
  eyebrow: { gold: 'Powering the Builders of America' }, // SOURCE (tagline)
  heading: ['The trailer', 'that powers', 'your job.'], // NATE
  sub: 'Trailers with their own solar power and battery on board, for hauling gear, running a site office or hosting an event. Built in the USA.', // NATE, plainer wording after the Meeting with Alessandro and Joe, 2026-11-20 (less techy, said in words a contractor already uses)
  primary: { label: 'Design your trailer', href: '/configure' }, // NATE. Opens the "which trailer" page.
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
 * Cargo and Workstation prices are the starting prices on SPOG's external price sheet (2026-11-20),
 * which Nate approved for the site that day. Event's are the ones he gave on 2026-11-18 (Event is not
 * on the sheet). Never add or change a price without him.
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
      id: 'cargo', name: 'Cargo', tone: 'studio' as Tone, href: '/cargo', builder: '/configure/cargo',
      line: 'Haul all your gear, with the power to run your job.', // NATE
      facts: ['From $15,000', '10 or 20 ft', 'Up to 20 kWh'], // NATE (2026-11-20 answers), price and battery SOURCE (price sheet 2026-11-20: 10 ft $15,000, 20 kWh max)
      image: '/images/lineup-cargo.webp', width: 1509, height: 786, // Nate's image (2026-11-19, 'Cargo trailer transparent background.png'). Its checkerboard was painted in, so Vision cut it out.
      alt: 'Black SPOG Cargo trailer with a side entry door and a spare wheel on the tongue',
      fit: [22, 46], shot: [92, 78], lap: 0.26,
    },
    {
      id: 'workstation', name: 'Workstation', tone: 'studio' as Tone, href: '/workstation', builder: '',
      line: 'The site office that works the day it lands.', // SOURCE. Nate wants a new line (2026-11-18, "sounds so AI"). Ten options went to him in chat.
      facts: ['From $18,500', '10 or 20 ft', 'Built-in climate control'], // NATE (2026-11-20 answers), price SOURCE (price sheet 2026-11-20: 10 ft $18,500)
      image: '/images/lineup-workstation.webp', width: 1495, height: 838, // Nate's own cut-out (2026-11-19, 'Workstation transparent background.png')
      alt: 'Navy SPOG Workstation trailer with two doors and steps',
      fit: [10.6, 30], shot: [92, 80], lap: 0.42,
    },
    {
      id: 'event', name: 'Event', tone: 'night' as Tone, href: '/event', builder: '',
      line: 'Own the night. Power it with the sun.', // SOURCE
      facts: ['Buy from $150,000, or rent', '20 ft', 'Built-in LED screen'], // NATE (2026-11-18: battery figure dropped, shorter price line)
      image: '/images/lineup-event.webp', width: 1800, height: 1055,
      alt: 'Black SPOG Event trailer with its solar wings open',
      fit: [15, 38], shot: [94, 76], lap: 0.3,
    },
  ],
  // The strip under the lineup jumps to "Our future lineup" further down this page (Nate, 2026-11-18).
  next: { line: 'See our future lineup', href: '#future' }, // NATE (his direction, "see our future product line")
};

/**
 * What a SPOG solves, one card each (Nate, 2026-11-18): power, security and comfort. Each card says
 * the fix, not the pain (his note on the first build), and carries a short looping video, after the
 * video cards on rivian.com. Videos are cut from Nate's 2026-11-17 footage (see CLAUDE.md).
 * `note` puts a visible tag on the card while its video is missing or a stand-in.
 */
export type Solution = {
  id: string; icon: string; title: string; line: string; body: string;
  video?: string; poster: string; alt: string; position?: string;
  note?: { tag: string; shot: string };
};
export const solutions: { heading: string[]; cards: Solution[] } = {
  heading: ['One trailer.', 'Three problems solved.'], // SOURCE (approved Workstation line)
  // Order (Nate, 2026-11-18): the Power video sits in the middle, flanked by the two photos.
  cards: [
    {
      id: 'security', icon: 'camera', title: 'Security',
      line: 'Lock up your gear and leave it on site.', // NEW
      // NEW (2026-11-20), facts SOURCE (price sheet 2026-11-20) and NATE (2026-11-20 answers). The 6 ft light has no camera.
      // The camera (28 ft light tower, 20 ft only) is said once, in the Security panel of "What SPOG is made of".
      body: 'Your crew skips the load-out at the end of the day. Add a telescopic light to any Cargo or Workstation to keep the lot lit after dark.', // NEW (2026-11-20): no longer repeats the line
      poster: shoot.wsSecurityMast, position: '50% 40%',
      // CONFIRM with Nate (2026-11-20 facts pass): the copy sells the 6 ft light, which has no camera, but this photo shows the
      // tower's dome cameras under the lights. No light-only mast shot exists yet; swap when one does (a night shot of it at work).
      alt: 'Work lights on the telescopic mast of a SPOG trailer', // NATE (2026-11-20 answers: the 6 ft light has no camera)
    },
    {
      id: 'power', icon: 'battery', title: 'Power',
      line: 'Power where you need it.', // NATE, minus "ever" from his "wherever" (the guardrail on "anywhere" claims). Easy to put back.
      body: "Solar panels charge the battery on board, so you can run your tools and lights without a generator, a fuel run or the homeowner's outlet.", // NEW
      video: '/images/solution-power.mp4', poster: '/images/solution-power.jpg', // Nate's full welding clip at 0.75x, smoothed (2026-11-18)
      alt: 'Crew welding beside an open SPOG trailer, then a close-up of the welder',
    },
    {
      id: 'comfort', icon: 'climate', title: 'Climate control', // "Climate control", never "HVAC" (Meeting with Alessandro and Joe, 2026-11-20)
      line: 'Work in comfort on site.', // NEW
      body: 'Take calls and review plans in a room with heat and AC. It comes standard on the Workstation and is available on Cargo.', // NEW, facts from Nate
      poster: shoot.wsHvac, position: '60% 50%', // Nate's pick (2026-11-18)
      alt: 'Heat and AC unit in an open side compartment of a white SPOG Workstation',
    },
  ],
};

/**
 * Our future lineup (Nate, 2026-11-18): Garage, Disaster Relief and Camper, one compact card each in
 * the looks he liked on /test-home. No specs, no prices and no Reserve, only a signup. The lineup
 * strip and the footer jump here until the Coming Next page exists.
 */
const soon = (name: string) => nextUp.products.find((p) => p.name === name)!;
export const future = {
  heading: 'Our future lineup.', // NEW, after "Our 2027 lineup."
  sub: "Tell us which one you want and we'll let you know when it's ready.", // NEW, from nextUp.sub without "first word"
  cta: 'Join the waitlist', // NATE (2026-11-18)
  dialogHeading: 'Join the waitlist.', // NATE
  // Nate (2026-11-18): say plainly that these are renderings of trailers that don't exist yet.
  disclaimer: "Images are concept renderings. Garage, Disaster Relief and Camper aren't built or for sale yet.", // NEW wording, NATE's direction
  cards: [
    // `size` is the name's font size in % of the card width. PLACEHOLDER: all three one-liners need approval.
    { id: 'garage', name: 'Garage', look: 'garage', line: soon('Garage').body, image: soon('Garage').image, alt: soon('Garage').alt, position: '55% 50%', size: 15 }, // the render shows a Tesla inside, swap before launch
    { id: 'relief', name: 'Disaster Relief', look: 'relief', line: soon('Disaster Relief').body, image: soon('Disaster Relief').image, alt: soon('Disaster Relief').alt, position: '50% 50%', size: 13 },
    { id: 'camper', name: 'Camper', look: 'camper', line: 'Camp on solar power, with walls that fold out.', image: soon('Camper').image, alt: soon('Camper').alt, position: '68% 55%', size: 16 }, // NEW line, written without "off-grid" (guardrail)
  ],
};

/**
 * Self-powered statement, in the look of the live homepage's "Pull in. Plug in." band. Nate likes
 * the look and not the copy (2026-11-18). The four pieces light up on scroll and the last turns
 * gold. Background is his snowy drone shot of a Workstation on tow, at 0.75x, smoothed and looped.
 * The live homepage's "100 kWh across the lineup" number is left out (stale). Its "0 gal fuel per day"
 * was swapped for the 20 ft's roof solar on 2026-11-20, because it read as a winter claim over the snow.
 */
export const statement = {
  eyebrow: { gold: 'Self-powered', text: 'Solar on board' }, // SOURCE
  words: ['Bring', 'your', 'own', 'power.'], // SOURCE (Nate approved "Bring your own power." on 2026-11-17)
  video: '/images/statement-snow-tow.mp4', poster: '/images/statement-snow-tow.jpg', // a Rivian tows it, check that's fine before launch
  numbers: [
    { label: 'Length up to', value: '20 ft', note: 'built at 10 or 20 ft' }, // NEW wording, Nate's sizes
    { label: 'Roof solar up to', value: '2,800W', note: 'on the 20 ft Cargo and Workstation', gold: true }, // SOURCE (price sheet 2026-11-20). Event isn't on the sheet, so the note names the two models it covers. Replaced "0 gal fuel per day", which read as a winter claim over the snow footage.
    { label: 'Structural warranty', value: '3 yrs', note: 'with mobile service' }, // SOURCE
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
    panel: { intro: 'Every SPOG turns sunlight into power and stores it on board.' }, // NEW. Daily recharge tail cut (Nate, 2026-11-19: reads as AI)
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
    // SOURCE (2026-11-20 facts pass): the raised 28 ft light tower, which the panel describes. Was the shop close-up of a short mast. CONFIRM with Nate.
    image: shoot.wsOptTower,
    alt: 'A white SPOG trailer on an empty lot with its 28 ft light tower raised',
    position: '46% 50%',
    // First sentence NATE. Second NEW (2026-11-20), facts SOURCE (price sheet 2026-11-20) and NATE (2026-11-20 answers).
    panel: { intro: 'Theft is a risk on every job site. On a 20 ft Cargo or Workstation, the 28 ft light tower adds a camera that keeps watch on the trailer, your gear and the site around it.' },
  },
  {
    id: 'quality',
    title: 'Quality',
    line: 'We stand by our work.', // NATE
    image: shoot.engineeringCad,
    alt: 'Engineer working on a trailer frame in CAD',
    position: '30% 50%',
    panel: { intro: '3-year structural warranty, covering the solar, electrical, battery and climate control on every SPOG.' }, // NATE, current terms kept for V1. "Climate control" for HVAC (Meeting with Alessandro and Joe, 2026-11-20)
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

/**
 * Mini about. Carries the factory, the warranty and the service, since the Guarantee block was cut.
 * The background is a slowed, looping shop video (Nate, 2026-11-18): his warehouse fly-through,
 * then a welder working on a frame on the shop floor, both at half speed, cross-faded into one loop.
 */
export const about = {
  eyebrow: 'Middletown, New York',
  lead: 'Built in Middletown, New York,', // NATE (heading, first half)
  rest: 'and backed by a 3-year structural warranty.', // NATE (2026-11-18)
  body: "Every SPOG comes out of our shop in Middletown, built by a crew that comes from commercial construction. If something needs work, our mobile service fleet comes to your site.", // NEW, terms kept for V1
  cta: { label: 'See the factory', href: '#' }, // PLACEHOLDER: the About page isn't built yet
  video: '/images/about-shop-loop.mp4', poster: '/images/about-shop-loop.jpg',
  position: '50% 50%',
};

/**
 * Close. Repeats the hero line. The two buttons pick which form shows on the right.
 * The "Design your trailer" tab here is the build request form. Since 2026-11-18 (Nate) the
 * "Design yours" buttons open /configure, and the Cargo ones go straight to /configure/cargo.
 * Workstation and Event have no builder yet, so their buttons open this form with the trailer picked.
 * /configure/cargo takes its prices from SPOG's price sheet (2026-11-20). Options the sheet doesn't
 * price show without a price.
 */
export const close = {
  eyebrow: closing.eyebrow, // SOURCE
  heading: hero.heading,
  body: 'See a SPOG up close and get your questions answered.', // NEW. "before your next job" cut per Nate's rule (2026-11-19)
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

/** The site nav and footer, with homepage anchors ("/#faq") made in-page ("#faq") on this page. */
const here = (href: string) => (href.startsWith('/#') ? href.slice(1) : href);
export const navLinks = siteLinks.map((l) => ({ ...l, href: here(l.href) }));

/**
 * The FAQ from the old homepage (Nate, 2026-11-18: "bring back the FAQ section"). Same questions
 * and answers. PLACEHOLDER: every answer still needs sign-off. The run-time sheet isn't on this
 * page, so that answer points at the demo page instead.
 */
export const faqs = siteFaqs.map((f) =>
  f.link?.href === '#sheet'
    ? { q: f.q, a: "It depends on the tools and the battery size. Book a demo and we'll show you the run time for the tools you use.", link: { label: 'Book a demo', href: '/demo' } } // NEW
    : f,
);

export const footerColumns = siteFooter.map((c) => ({ ...c, links: c.links.map(([label, href]) => [label, here(href)]) }));
