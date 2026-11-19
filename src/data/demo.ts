/**
 * Book a demo at /demo (draft, 2026-11-18). "Book a demo" in the homepage nav lands here (Nate's
 * request): three ways to see a SPOG, in person, on a video call or by phone.
 *
 * Copy marks, as in home2.ts:
 *   NATE    his words   SOURCE  an approved line   NEW  written for this draft, needs his approval
 *
 * The two forms have no endpoint yet. TODO: connect them to GoHighLevel (a calendar booking may
 * replace the forms). Read the GoHighLevel SOP in Notion first.
 */
import { closing, phone } from './content';
import { footerColumns, navLinks } from './home2';

// This page has none of the homepage sections, so in-page links go to the homepage.
const toHome = (href: string) => (href.startsWith('#') && href.length > 1 ? `/${href}` : href);
export const demoNav = navLinks.map((l) => ({ ...l, href: toHome(l.href) }));
export const demoFooter = footerColumns.map((c) => ({ ...c, links: c.links.map(([label, href]) => [label, toHome(href)]) }));

export const demo = {
  heading: 'Book a demo.', // NATE (button label)
  sub: "Pick how you'd like to see a SPOG. We'll walk you through the trailer and answer your questions before your next job.", // NEW
  trailers: ['Cargo', 'Workstation', 'Event', 'Not sure yet'],
  options: [
    {
      id: 'in-person', icon: 'pin',
      title: 'Book an in-person demo', // NATE
      body: 'We bring a trailer to your site and run your tools off it.', // SOURCE (walkthrough card)
      cta: 'Book in person', // NEW
    },
    {
      id: 'virtual', icon: 'video',
      title: 'Book a virtual demo', // NATE
      body: 'A live video call with our team. We show you the trailer and the power system and answer your questions.', // NEW
      cta: 'Book a video call', // NEW
    },
    {
      id: 'call', icon: 'phone',
      title: 'Call now', // NATE
      body: `Talk to our team at ${phone.display}.`, // NEW, number SOURCE
      cta: `Call ${phone.display}`,
      href: phone.href,
    },
  ],
  forms: {
    'in-person': {
      title: 'Book an in-person demo', // NATE
      body: closing.walkthrough.body, // SOURCE
      place: 'Job site town or ZIP', // NEW
      cta: 'Request my demo', // NEW
    },
    virtual: {
      title: 'Book a virtual demo', // NATE
      body: "Tell us when suits you and we'll send a video call link.", // NEW
      cta: 'Request my video call', // NEW
    },
  },
  when: 'Best days and times', // NEW
};
