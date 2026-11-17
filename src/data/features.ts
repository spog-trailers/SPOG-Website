/**
 * Feature cards (FeatureCards.astro), after Rivian's "Get to know the R1T", Tesla's "Meet
 * Model Y" and Pebble's "Intelligent technology" sections. A row of tall cards you can swipe,
 * each with a name and one short line. Tapping a card opens a panel with the detail.
 *
 * A card shows a photo when there's an honest one, or a plate (a dark card with a large line
 * drawing or a mark) when there isn't. Every plate is waiting on a photo from Robert's shoot.
 */
export interface Feature {
  id: string;
  /** Name on the card and the panel. */
  title: string;
  /** One short outcome line under the name, as on Pebble's cards. */
  line: string;
  image?: string;
  alt?: string;
  position?: string;
  /** No-photo card: a large line icon (from `icons` in content.ts) or a mark set in type. */
  plate?: { icon?: string; mark?: string[] };
  panel: {
    intro: string;
    /** Wide photo in the panel. Defaults to the card photo. `natural` keeps a small image at its own size. */
    media?: { src: string; alt: string; width: number; height: number; natural?: boolean };
    stats?: [string, string][];
    points?: { title: string; body: string }[];
    link?: { label: string; href: string };
  };
}
