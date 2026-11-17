# SPOG Trailers website

Astro 7 + Tailwind CSS 4 build of the approved homepage design ("Daybreak E").
The current build renders the approved mockup to within anti-aliasing at 390, 820 and 1440px wide. Treat it as the visual source of truth.

## Commands

- Double-click `Preview Site.command` (Mac) or `Preview Site.bat` (Windows) to install if needed and open a live preview

- `npm install`
- `npm run dev` for local dev at http://localhost:4321
- `npm run build` writes static output to `dist/`
- `npm run preview` serves the build

## Where things live

| Path | What it is |
|---|---|
| `src/pages/index.astro` | Homepage. Section order lives here. |
| `src/components/sections/` | One component per homepage section |
| `src/components/ui/` | Button, Eyebrow (small tracked label), Heading, Stars, Icon, Person |
| `src/data/content.ts` | All copy, specs, lists, hotspot positions and icon paths. Edit copy here first. |
| `src/styles/global.css` | Tailwind theme tokens (colors, font, keyframes) plus custom utilities |
| `public/scroll-effects.css` | Scroll-driven effects. Must stay in /public (see Gotchas). |
| `public/images/` | All photography and logos |

## Brand rules

- Colors: gold `#EEA114`, coal `#0A0A0B`, black, plus the stone neutrals in `@theme`. Gold is an accent only. Never make it a page background.
- Font: Montserrat only. A serif headline version was tested and rejected.
- Tagline: "Powering the Builders of America."
- Product names: Cargo and Workstation. All Workstation sizes are just "Workstation trailers". Never write "GC Edition" or "GT Edition".
- Never use "Founder" framing for offers. The offer is the "2027 Launch Offer" / "2027 Launch Edition".
- Copy rules: no em dashes or en dashes. Avoid these words: unlock, empower, elevate, transform, disrupt, seamless, robust, innovative, comprehensive, journey, ecosystem, game-changer, crucial, pivotal. No hype claims. Sell the outcome.

## Layout rules

- **Section rhythm:** never put two photo-background sections next to each other. Alternate photo, plain dark, light. The current pattern is documented in a comment at the top of `index.astro`.
- Photo sections share one warm grade (`grade-*` utilities), the `grain` overlay and a scrim (`scrim-*`). Reuse those for new photo sections.
- Light sections use `bg-stone` with `bg-paper` cards. Dark sections use `bg-black`.
- Container is the `wrap` utility (1320px max, 36px gutters).

## Gotchas

- **Scroll-driven CSS lives in `public/scroll-effects.css` on purpose.** The production CSS minifier folds `animation-timeline` into the `animation` shorthand, which browsers reject, and the effects silently stop. Don't move it into `src/styles`.
- **Montserrat 700 is not loaded on purpose.** The approved design rendered `font-bold` at 800 because 700 wasn't available. Loading 700 will make bold text slightly thinner than the approved design. Change it only as a deliberate design decision.
- **Grids use `grid-cols-[repeat(N,1fr)]`, not `grid-cols-N`.** Tailwind's default `minmax(0,1fr)` wraps text differently on mobile than the approved design.
- `leading-[normal]` is used where the mockup relied on the CSS `font:` shorthand. Tailwind's `leading-normal` is 1.5, which is not the same thing.

## Placeholder content to replace before launch

Everything below was invented for the mockup and must be replaced with real, approved content.

- Social proof: the 4.9 rating, "38 SPOG owners" and all five customer logos
- Both testimonials (Mike Russo, Dana Kowalski) and the 2:14 video
- Workstation "8 to 40 ft" lengths, and "racking" in the Cargo specs
- Run-time sheet bar widths (waiting on the tool-load table)
- Hotspot labels on the field photo (they describe what's visible, not confirmed features)
- The Joby hangar photo needs Joby's written permission
- Lead magnet form and "Reserve" buttons have no endpoints yet. Wire them to GoHighLevel.
- All `href="#"` links

## Photography needed (Robert's shot list)

The dark half of the page reuses one Red Rocks photo. Replace with:

1. Hero: crew working out of a SPOG on a Tri-State site, 16:9, subject right of center
2. Statement: wide shot of a SPOG on site at first light, 21:9
3. Built: Middletown shop floor, welder or electrician at work, 4:5 portrait
4. Residential crews tab: Cargo on a real driveway
5. Highlights cards: roof solar close-up, crew charging tools, gear inside the trailer
6. Customer story: the actual customer on their site

## Next steps (suggested)

- Swap `<img>` for `astro:assets` `<Image>` to get responsive WebP output
- Add a real video embed for the customer story
- Split Cargo and Workstation into their own pages once copy is final
