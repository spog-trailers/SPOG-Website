# SPOG Trailers website

Astro 7 + Tailwind CSS 4 build of the approved homepage design ("Daybreak E").
The visual system (colors, type, photo grade, components) matches the approved mockup. On 2026-11-16 the section order was rebuilt from the competitive teardown in `docs/homepage-teardown-2026-11-16.md`. The pre-reorder source is saved in `_archive/2026-11-16-pre-reorder/`, from before this folder was in git.

Code lives in the private repo https://github.com/spog-trailers/SPOG-Website (branch `main`). This repo is pinned to the `nthor-spog` GitHub account through a local credential helper in `.git/config`, so it pushes as nthor-spog whatever the default `gh` account is. Creating or changing `.git` needs an unsandboxed command.

## Commands

- Double-click `Preview Site.command` (Mac) or `Preview Site.bat` (Windows) to install if needed and open a live preview

- `npm install`
- `npm run dev` for local dev at http://localhost:4321
- `npm run build` writes static output to `dist/`
- `npm run preview` serves the build

## Where things live

| Path | What it is |
|---|---|
| `src/pages/index.astro` | Homepage. Section order, the rhythm map and the list of held sections live in the comment at the top. |
| `src/pages/test-home.astro` | Draft homepage at `/test-home` with a look per buyer (see "Test homepage"). Not indexed. Rhythm map in the top comment. |
| `src/components/test-home/`, `src/data/testHome.ts` | Test homepage sections and their copy. Every line is marked NEW or SOURCE. |
| `docs/homepage-teardown-2026-11-16.md` | Competitor research behind the current section order |
| `src/pages/test-workstation.astro` | Draft Workstation page at `/test-workstation`, written for GCs (see "Workstation page draft"). Not indexed. Rhythm in the top comment. |
| `src/components/work/`, `src/data/workstationPage.ts` | The work look (Cargo and Workstation) and the Workstation draft's copy. Every line is marked NEW, SOURCE or PLACEHOLDER. |
| `docs/product-page-teardown-workstation-2026-11-17.md` | Ring Jobsite Security, Cybertruck, Rivian R2 and R1S research behind the Workstation draft |
| `src/pages/[product].astro` | Product pages at `/cargo`, `/workstation`, `/event`, one template. Section order and rhythm in the comment at the top. |
| `src/data/productPages.ts` | Product page content: hero, feature tiles, runtime devices, statement photo, lengths. Every line is marked NEW, SOURCE or PLACEHOLDER. |
| `src/components/product/` | Product page sections (Hero, Subnav, Overview, Power, Statement, Size, Lineup). Close, Faq, Nav, Footer and MobileBar are shared with the homepage. |
| `src/scripts/sizeDrawing.ts`, `src/scripts/runtime.ts` | The to-scale trailer and pickup drawing, and the runtime math (hours = kWh / kW) |
| `docs/product-page-teardown-2026-11-16.md` | Rivian R1T research behind the product page layout |
| `_archive/` | Snapshots of earlier source. Not built. |
| `src/pages/configure/cargo.astro` | Concept Cargo configurator and sample checkout at `/configure/cargo` |
| `src/scripts/configurator/` | Configurator code: `trailer.ts` (procedural 3D model), `scene.ts` (white studio stage, lighting, camera), `controller.ts` (keeps the model in sync), `data.ts` (options, SAMPLE prices, rules, run-time math), `ui.ts` (page wiring and checkout steps), `dims.ts` (shared dimensions) |
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
- Product names: Cargo, Workstation and Event are available now. Garage, Disaster Relief and Camper are coming next. All Workstation sizes are just "Workstation trailers". Never write "GC Edition" or "GT Edition".
- Positioning: SPOG sells utility, productivity and power wherever it's needed, not only construction. The shared message is the power system. Each trailer carries its own buyer message.
- The 2027 Launch Offer / Launch Edition is for close contacts and partners only. Never mention it on the public site. Talk about "the 2027 lineup" with no special-offer framing (no slots, no scarcity, no deposit perks). "Reserve" is fine as the normal ordering action. Never use "Founder" framing.
- Copy rules: no em dashes or en dashes. Avoid these words: unlock, empower, elevate, transform, disrupt, seamless, robust, innovative, comprehensive, journey, ecosystem, game-changer, crucial, pivotal. No hype claims. Sell the outcome.

## Layout rules

- **Section rhythm:** never put two photo-background sections next to each other. Alternate photo, plain dark, light. The current pattern is documented in a comment at the top of `index.astro`.
- **Current order:** Nav (with announcement bar), Hero, Problem, Compare (2027 lineup + coming next), Statement (self-powered + key numbers), UseCaseTabs, Explore (hotspots + close-up photos), Process, Guarantee, Built, Faq, Close (reserve + walkthrough form + run-time sheet), Footer, MobileBar.
- **Lineup balance (Tesla model):** trailers you can sell now get full rows and Reserve buttons in Compare. Future trailers live in the quieter "Coming next" block under it, with an interest signup and no Reserve button. When a future trailer goes on sale, move it from `nextUp` to `products` in `content.ts`.
- **Held sections:** SocialProof, ReviewQuote and CustomerStory are built but not rendered because all their content is placeholder. When real proof exists, bring back ONE of them. Highlights, KeyNumbers, LeadMagnet and LaunchCta were merged into other sections and are kept only for reference (LaunchCta uses retired offer copy, so don't bring it back as is).
- **Two levels of CTA everywhere:** Reserve (gold, `#cta`) for buyers who are ready, Book a walkthrough (outline, `#walkthrough`) for everyone else. The run-time sheet (`#sheet`) is the softest option.
- Photo sections share one warm grade (`grade-*` utilities), the `grain` overlay and a scrim (`scrim-*`). Reuse those for new photo sections.
- Light sections use `bg-stone` with `bg-paper` cards. Dark sections use `bg-black`.
- Container is the `wrap` utility (1320px max, 36px gutters).

## Test homepage (draft, 2026-11-17)

- `/test-home` tries Nate's idea of one brand with a different look per buyer, the way Tesla's Roadster differs from the Model Y. The live homepage at `/` is untouched. The nav carries a temporary "Test home page" link (marked in `navLinks`). Remove it once a version is chosen.
- **The homepage rule (Nate, v2):** the homepage only talks about what every SPOG shares (power, freedom, utility, quality, American made) and shows each trailer once at a high level. Feature selling and buyer-specific messaging go on the product pages. v1 put six full showcases on the homepage, and Nate found it too busy.
- v2 order: Hero (brand promise, approved by Nate), Lineup cards, Pillars, Built, Close.
- **Lineup cards** follow Tesla's homepage card row. Each card has a category, the name in that trailer's own type (`wordmark` in `testHome.ts`), one status line and the buttons. The look per trailer lives in the photo grade and the name:
  - **Cargo and Workstation:** heavy uppercase, warm daylight. They share one utility look.
  - **Event:** night, with a thin wide name.
  - **Garage:** black vignette, a slanted metal name and a gold hairline.
  - **Disaster Relief:** a cool grade, a field grid and gold corner brackets.
  - **Camper:** natural light, sentence case.
- Coming-next cards have no Reserve. "Get first word" opens a small signup dialog with the trailer picked. Reserve on a card preselects that trailer in the walkthrough form.
- Nate liked the v1 Garage and Disaster Relief looks. The v1 showcases (`Show*.astro`, `SpecPlate`) are held, unrendered, as starting points for the product pages.

## Workstation page draft (2026-11-17)

- `/test-workstation` is the first page written for one buyer (GCs and subs). The live `/workstation` still uses the shared template and is untouched. On the test homepage, the Workstation card's "Learn more" points at the draft (marked TEMPORARY in `testHome.ts`).
- References from Nate:
  - Rivian R1T, R2 and R1S.
  - Tesla Cybertruck.
  - Ring Jobsite Security, which he loves for being "simple. Lots of whitespace. Very clean."
- **The work look**, shared with Cargo later:
  - heavy uppercase headings with a gold bar before a small gray label (`WorkTitle`)
  - light sections with a lot of space for the pitch (top half)
  - one dark chapter for the numbers, then the dark close
  - gold is never used as text on white, because it's too light to read
- **Order:** Hero (name, promise, three stats), Outcomes (Ring's four columns), What it replaces (the "One trailer. Three problems solved." sum), Inside (render plus a list where each row opens), Power, Size and Specs, Remote office band, Close ("Open on day one."), FAQ.
- **Shared sections take props with safe defaults.** `ProductSubnav` takes `links`, and `ProductPower` and `ProductSize` take `look="work"`. Without them, the live product pages render exactly as before.
- **Runtime devices** on this page are computer, light tower, saw and welder. The fridge is left off because it has the same draw as the computer, so it shows the same hours.

## Planned sitemap (Nate, 2026-11-17, not built yet)

- **Home**
- **Cargo**
- **Workstation:** includes a section on using it as a remote office (nomads, influencers), linking to its own landing page.
- **Event:** mostly about buying or renting it for your own events. A section covers buying one to rent out as an income stream, linking to its own landing page.
- **Garage**
- **Disaster Relief**
- **RV**
- **About:** factory, build quality, service.
- **Contact**
- **Support:** dropdown with Blog, FAQ, Warranty and Service.

Each product page is written for its own buyer. The single shared `[product].astro` template gets replaced.

## Product pages

- Order: Nav, Subnav (floating section bar that replaces the masthead after the hero), Hero, Overview (light), Power (dark), Statement (photo), Size + Specs (dark), Lineup (light), Close (dark), Faq (light), Footer, MobileBar. Overview and Statement are optional per product.
- Headline numbers and short specs come from `products` in `content.ts`. Don't retype them in `productPages.ts`, so a correction lands in one place.
- No prices on product pages, and no link to `/configure/cargo` until real pricing is approved (the configurator shows made-up sample prices).
- Only the length is labeled in the size drawing. Heights, axles and panel layout are drawn for looks.
- Runtime figures reproduce SPOG's "Customize My Trailer Guide" table (continuous use, full battery, one device, no solar). Keep battery stops inside each product's range.
- Cargo uses the "studio" hero (render in a framed plate) because there's no wide Cargo photo yet. Switch `hero.kind` to `photo` when Robert's shot exists.
- Nav links now go to `/cargo`, `/workstation`, `/event` and `/#...` for homepage-only anchors. Keep the ids `top`, `cta`, `walkthrough`, `sheet` and `faq` on every page so Nav, MobileBar and Close keep working.

## Configurator (concept)

- `/configure/cargo` is a demo built on three.js (a dependency added for this page only, it never loads on the homepage). The trailer is modeled in code, not from CAD, so it's a stand-in for real 3D files.
- Everything in `src/scripts/configurator/data.ts` except the Cargo limits (8 to 24 ft, 5 to 20 kWh, solar capped at 3,360W, two-week standard lead time) is made up: prices, color names, tool wattages, delivery fee, deposit. Never copy those numbers onto the live site.
- Nothing is sent anywhere and no payment is taken. The build is saved in the URL hash so it can be shared. Delivery, ZIP and contact details are never put in the URL.
- After adding a dependency or a new folder, restart the dev server (`npx astro dev stop`, then `npm run dev`) if new Tailwind classes don't show up.

## Gotchas

- **Scroll-driven CSS lives in `public/scroll-effects.css` on purpose.** The production CSS minifier folds `animation-timeline` into the `animation` shorthand, which browsers reject, and the effects silently stop. Don't move it into `src/styles`.
- **Montserrat 700 is not loaded on purpose.** The approved design rendered `font-bold` at 800 because 700 wasn't available. Loading 700 will make bold text slightly thinner than the approved design. Change it only as a deliberate design decision.
- **Grids use `grid-cols-[repeat(N,1fr)]`, not `grid-cols-N`.** Tailwind's default `minmax(0,1fr)` wraps text differently on mobile than the approved design. Exception: the Compare row uses `minmax(0,1fr)` on phones on purpose, because its no-wrap stat values otherwise push the panel wider than the card.
- **The giant names in Compare are sized in container units.** Desktop uses one size for every row (`12.4cqw`, set by WORKSTATION, the longest word). Phones use each product's `fit` value in `content.ts`. If a name changes, re-measure so it still fits the card.
- **The nav is a fixed `#masthead` with a 34px announcement bar on top.** It tucks the bar away after 40px of scroll. Anything pinned near the top of the hero needs to clear 98px.
- `leading-[normal]` is used where the mockup relied on the CSS `font:` shorthand. Tailwind's `leading-normal` is 1.5, which is not the same thing.

## Placeholder content to replace before launch

Everything below was invented for the mockup and must be replaced with real, approved content.

- Social proof: the 4.9 rating, "38 SPOG owners" and all five customer logos
- Both testimonials (Mike Russo, Dana Kowalski) and the 2:14 video
- Workstation "8 to 40 ft" lengths, and "racking" in the Cargo specs
- Run-time sheet bar widths (waiting on the tool-load table)
- Hotspot labels on the field photo (they describe what's visible, not confirmed features)
- The Joby hangar photo needs Joby's written permission
- Walkthrough form, run-time sheet form, Coming next signup and every "Reserve" button have no endpoints yet. Wire them to GoHighLevel.
- FAQ answers (drafted from existing homepage copy, each needs sign-off)
- The three points in the Close section (drafted from existing copy)
- Event trailer: row copy, Events tab copy, a real Event photo and a spec sheet. The row renders without a photo or specs until they exist.
- One-line descriptions for Garage, Disaster Relief and Camper
- Imagery pulled from spogtrailers.com on 2026-11-16 (all marked in `content.ts`). Renders: `event-led-dusk.jpg` (Event lineup row), `garage-ev-inside.jpg`, `disaster-relief-solar-deployed.jpg`, `camper-campfire.jpg` (Coming next cards), `statement-solar-unfold.mp4` + `.jpg` (Self-powered background loop, concept render). Real photos: `event-movie-night.jpg` (Events tab), `shop-floor.jpg` (Built section). Renders of trailers that are on sale should be swapped for real photos before launch.
- The Workstation page on spogtrailers.com uses an AI-generated header image. Don't reuse it as product imagery.
- The Workstation studio render used in Compare shows a door decal with an edition name the brand rules ban. Reshoot or retouch.
- All `href="#"` links
- Product pages: every line marked NEW in `productPages.ts` needs approval, and so does the copy written into `src/components/product/` (section headings, the runtime footnote, button labels). Feature tiles marked PLACEHOLDER SOURCE (Workstation security cameras, Event 5G internet and 360 cameras) come from the old site and need confirming.
- Product page lengths: Cargo 12/16/20 ft and Event 24/31 ft stops are guesses between documented endpoints. Workstation stops come from the old configurator and Hybrid Fleet page.
- Product page photos: Cargo and Workstation statement photos are Red Rocks placeholders (the Cargo one may not show a Cargo). The Event dusk render shows a video game on the screen, so check rights or swap the screen image.
- The Garage render (`garage-ev-inside.jpg`) shows a Tesla Model S inside. Swap it for a neutral car before launch.
- Test homepage: every line marked NEW in `testHome.ts`, including the card categories, status lines and the five pillars.
- Workstation draft: every line marked NEW in `workstationPage.ts`. The Security tile and the cameras row are PLACEHOLDER SOURCE (old site), so confirm cameras are offered. The remote office button opens the walkthrough form until its landing page exists. The interior render is only 695 px wide, so replace it with a real interior photo.
- Specs conflict between this site and spogtrailers.com (Cargo 8 to 35 ft, 5 to 64 kWh and up to 5,000W on the old site). The homepage numbers are used until the official spec sheet settles it.

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
