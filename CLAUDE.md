# SPOG Trailers website

Astro 7 + Tailwind CSS 4 build of the approved homepage design ("Daybreak E").
The visual system (colors, type, photo grade, components) matches the approved mockup. On 2026-11-16 the section order was rebuilt from the competitive teardown in `docs/homepage-teardown-2026-11-16.md`. The pre-reorder source is saved in `_archive/2026-11-16-pre-reorder/`, from before this folder was in git.
On 2026-11-18 Nate made Test homepage 2 the homepage at `/`. The homepage before it moved to `/old-home` (linked as "Old home" in the nav, for inspiration), and the first test homepage was removed. `/test-home` and `/test-home-2` redirect to `/`.

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
| `src/pages/index.astro` | Homepage, built as Test homepage 2 (see "Homepage"). Section order and rhythm map in the comment at the top. |
| `src/components/home2/`, `src/data/home2.ts` | Homepage sections (proof strip, lineup scroll, solution video cards, future lineup, about band with the shop video, close with two forms) and their copy. Every line is marked NATE, SOURCE, NEW, CONFIRM or PLACEHOLDER. |
| `src/pages/old-home.astro` | The homepage before 2026-11-18, kept at `/old-home` for inspiration (see "Old homepage"). Not indexed. Section order, rhythm map and held sections in the top comment. |
| `src/components/test-home/`, `src/data/testHome.ts` | Pieces of the first test homepage (page removed 2026-11-18, see "First test homepage"). `TestHero` and the wordmarks are still used. The rest is held for reference. |
| `src/pages/demo.astro`, `src/data/demo.ts` | Book a demo page at `/demo`, where "Book a demo" in the homepage nav lands: in-person demo, virtual demo or call now. Not indexed. |
| `scripts/cutout.py` | Cuts a trailer out of its photo for the lineup panels (see Gotchas). |
| `docs/homepage-teardown-2026-11-16.md` | Competitor research behind the current section order |
| `src/pages/workstation.astro` | The Workstation page at `/workstation`, written for GCs (see "Workstation page"). Rhythm in the top comment. The old draft URL `/test-workstation` redirects here (`astro.config.mjs`). |
| `src/components/features/FeatureCards.astro`, `src/data/features.ts` | Feature cards (after Rivian's "Get to know", Tesla's "Meet Model Y" and Pebble's feature section): a row of tall cards you can swipe, each opening a panel with the photo, numbers and detail. In the panel, the card's line sits under the name as a subhead (Nate, 2026-11-19). Used on `/workstation`, `/cargo-2` and the homepage. Several can share a page. |
| `src/components/work/`, `src/data/workstationPage.ts` | The work look (Cargo and Workstation) and the Workstation draft's copy. Every line is marked NEW, SOURCE or PLACEHOLDER. |
| `docs/product-page-teardown-workstation-2026-11-17.md` | Ring Jobsite Security, Cybertruck, Rivian R2 and R1S research behind the Workstation draft, plus the Pebble, Rivian and Model Y feature sections behind the feature cards |
| `src/pages/cargo-2.astro`, `src/components/cargo2/`, `src/data/cargo2Page.ts` | Cargo 2, the new Cargo sales page draft at `/cargo-2` (see "Cargo 2"). Not indexed. Every line of copy is marked NATE, SOURCE, NEW or CONFIRM. |
| `src/pages/workstation-2.astro`, `src/components/ws2/`, `src/data/workstation2Page.ts` | Workstation 2, the new Workstation sales page draft at `/workstation-2` (see "Workstation 2"). Not indexed. Every line of copy is marked NATE, SOURCE, NEW or CONFIRM. |
| `src/scripts/configurator/embed.ts` | The 3D Cargo as a drop-in viewer with no option panel (`mountViewer`). Load it only with a dynamic `import()`, because it pulls in three.js. |
| `src/pages/[product].astro` | Product page at `/event`, from the shared template (Workstation has its own page; the old `/cargo` was retired on 2026-11-20 and redirects to `/cargo-2`). Section order and rhythm in the comment at the top. |
| `src/data/productPages.ts` | Product page content: hero, feature tiles, runtime devices, statement photo, lengths. Every line is marked NEW, SOURCE or PLACEHOLDER. |
| `src/components/product/` | Product page sections (Hero, Subnav, Overview, Power, Statement, Size, Lineup). Close, Faq, Nav, Footer and MobileBar are shared with the homepage. |
| `src/scripts/sizeDrawing.ts`, `src/scripts/runtime.ts` | The to-scale trailer and pickup drawing, and the runtime math (hours = kWh / kW) |
| `docs/product-page-teardown-2026-11-16.md` | Rivian R1T research behind the product page layout |
| `_archive/` | Snapshots of earlier source. Not built. |
| `src/pages/configure/index.astro` | "Which trailer are you designing?" at `/configure`, the first step of Design your trailer. Cargo is live, Workstation and Event are greyed out. Not indexed. |
| `src/pages/configure/cargo.astro` | Cargo configurator at `/configure/cargo`, laid out like Tesla's design studio (see "Configurator"). Not indexed. |
| `src/scripts/configurator/` | Configurator code: `trailer.ts` (the 3D Cargo, modeled in code from Nate's photos), `scene.ts` (white studio, reflections, camera views), `controller.ts` (keeps the model in sync, swings the doors), `data.ts` (options, SAMPLE prices, rules, run-time math), `ui.ts` (page wiring and order steps), `dims.ts` (measurements) |
| `src/components/sections/` | One component per section of the old homepage. Nav, Statement, Faq, Footer and MobileBar are shared by every page. |
| `src/components/ui/` | Button, Eyebrow (small tracked label), Heading, Stars, Icon, Person |
| `src/data/content.ts` | All copy, specs, lists, hotspot positions and icon paths, plus the site nav and footer links. Edit copy here first. |
| `src/styles/global.css` | Tailwind theme tokens (colors, font, keyframes) plus custom utilities |
| `public/scroll-effects.css` | Scroll-driven effects. Must stay in /public (see Gotchas). |
| `public/images/` | All photography and logos. Nate's real photos from 2026-11-17 are listed in `shoot` in `content.ts`, each with a `-1200` copy for cards and phones. |
| `_photos-original/` | Full-size photo and video originals (git-ignored, never deployed). Make web copies from here (see Gotchas). |

## Brand rules

- Colors: gold `#EEA114`, coal `#0A0A0B`, black, plus the stone neutrals in `@theme`. Gold is an accent only. Never make it a page background.
- Font: Montserrat only. A serif headline version was tested and rejected.
- Tagline: "Powering the Builders of America."
- Product names: Cargo, Workstation and Event are available now. Garage, Disaster Relief and Camper are coming next. All Workstation sizes are just "Workstation trailers". Never write "GC Edition" or "GT Edition".
- Positioning: SPOG sells utility, productivity and power wherever it's needed, not only construction. The shared message is the power system. Each trailer carries its own buyer message.
- The 2027 Launch Offer / Launch Edition is for close contacts and partners only. Never mention it on the public site. Talk about "the 2027 lineup" with no special-offer framing (no slots, no scarcity, no deposit perks). "Reserve" is fine as the normal ordering action. Never use "Founder" framing.
- Copy rules: no em dashes or en dashes. Avoid these words: unlock, empower, elevate, transform, disrupt, seamless, robust, innovative, comprehensive, journey, ecosystem, game-changer, crucial, pivotal. No hype claims. Sell the outcome.
- **Climate control (meeting with Alessandro and Joe, 2026-11-20).** Name the heating and cooling feature "climate control" in titles, hero lines, lists and the builder, never "HVAC". "Heat and AC" can still explain it inside a sentence, and FAQ questions keep the buyer's own words. The old `/workstation` and `/cargo` pages still say "heat and AC" and go away when Nate picks versions.
- **Keep off the site (same meeting):** home backup power, or a trailer as a shed with emergency power (Joe flagged the legal side, and inverter compliance isn't settled), and AI-made pictures of decked-out interiors. Those mockups belong in shot lists for Rob. The site shows real photos so nobody thinks SPOG is vaporware.
- **Positioning (same meeting):** the top of every page should show quickly that a SPOG is more than a box, in words a contractor already uses. Call it a trailer and name what it has (power, lockable storage, security, climate control). Nate warned against going techy. Never write "not a typical trailer", which is the banned negative shape. Cargo is the utility bet and needs the most work. Workstation buyers don't get their hands dirty and care about security and the interior.

## Layout rules

- **No small labels above headings (Nate, 2026-11-19).** He found the tracked eyebrow labels over every section heading looked AI-made, so they're gone from the homepage, Cargo 2, Workstation and the product template. `WorkTitle` has no kicker. `Faq` and `Close` show theirs only with the `eyebrow` prop, which only `/old-home` passes. The one exception kept is the "Solar Power Off Grid" line over "What SPOG is made of." because it spells out the name. Don't add new ones.
- **Type system (Nate, 2026-11-19).** Eight text styles in `global.css`, after Tesla's Model Y page. Use them, never a one-off `text-[..px]`:
  - `t-display` 144px desktop / up to 80px phone, 900 uppercase: the product name in a hero, one per page. Long names cap to fit (Workstation uses `min(..., 12.1cqw)`, the product template uses `heroFit`).
  - `t-h1` 56 / 36, 900 uppercase: a sentence headline (homepage hero), statement and photo bands, closes.
  - `t-h2` 40 / 28, 900 uppercase: every section heading and big numbers (add `normal-case` to numbers like "$260 to $530").
  - `t-h3` 24 / 20, 800 sentence case: card, row and tile titles.
  - `t-lead` 22 / 20, 600: the line under a hero, short intro lines.
  - `t-body` 18 (the body default), `t-body-sm` 16 for text in cards, tiles, lists and FAQ answers, `t-fine` 14 for fine print.
  - `t-label` 14, 600 sentence case: small labels and nav links. `t-btn` 14, 800 uppercase: buttons.
  - Nothing below 14px. Uppercase only for the display name, H1, H2 and buttons. Letter spacing is the font's own (option D). Headings drop their forced line breaks on phones (`WorkTitle`, Build) so they wrap cleanly.
  - Exempt: form inputs stay 16px so phones don't zoom, the giant lineup names on the homepage are artwork, and the configurator keeps its own compact sizes for now. /old-home picks the system up only through shared components.
- **Section rhythm:** never put two photo-background sections next to each other. Alternate photo, plain dark, light. Each page documents its pattern in a comment at the top.
- **Old homepage only:** the next four rules (order, Compare, held sections, the run-time sheet) describe `/old-home`, plus the Close section the product pages still use. The nav on every other page shows Book a demo and Design yours. The homepage's own rules are under "Homepage".
- **Old homepage order:** Nav (with announcement bar), Hero, Problem, Compare (2027 lineup + coming next), Statement (self-powered + key numbers), UseCaseTabs, Explore (hotspots + close-up photos), Process, Guarantee, Built, Faq, Close (reserve + walkthrough form + run-time sheet), Footer, MobileBar.
- **Lineup balance (Tesla model):** trailers you can sell now get full rows and Reserve buttons in Compare. Future trailers live in the quieter "Coming next" block under it, with an interest signup and no Reserve button. When a future trailer goes on sale, move it from `nextUp` to `products` in `content.ts`.
- **Held sections:** SocialProof, ReviewQuote and CustomerStory are built but not rendered because all their content is placeholder. When real proof exists, bring back ONE of them. Highlights, KeyNumbers, LeadMagnet and LaunchCta were merged into other sections and are kept only for reference (LaunchCta uses retired offer copy, so don't bring it back as is).
- **Two levels of CTA everywhere:** Reserve (gold, `#cta`) for buyers who are ready, Book a walkthrough (outline, `#walkthrough`) for everyone else. The run-time sheet (`#sheet`) is the softest option.
- Photo sections share one warm grade (`grade-*` utilities), the `grain` overlay and a scrim (`scrim-*`). Reuse those for new photo sections.
- Light sections use `bg-stone` with `bg-paper` cards. Dark sections use `bg-black`.
- Container is the `wrap` utility (1320px max, 36px gutters).

## Old homepage (`/old-home`, since 2026-11-18)

- This was the homepage at `/` until Nate made Test homepage 2 the homepage. He kept it for inspiration. The nav has a temporary "Old home" link to it (marked in `navLinks` in `content.ts`). Remove the link when he no longer needs it.
- It renders exactly as before, except its nav links and footer are the site's, so those lead to the new homepage. Its nav buttons, phone bar and announcement bar keep their old targets on the page (Reserve, Book a walkthrough, `#specs`).

## First test homepage (removed 2026-11-18)

- `/test-home` tried Nate's idea of one brand with a different look per buyer, the way Tesla's Roadster differs from the Model Y. Nate removed it when Test homepage 2 became the homepage. The page is in git history, and `/test-home` redirects to `/`. What follows is kept because the homepage still builds on it.
- **The homepage rule (Nate, v2):** the homepage only talks about what every SPOG shares (power, freedom, utility, quality, American made) and shows each trailer once at a high level. Feature selling and buyer-specific messaging go on the product pages. v1 put six full showcases on the homepage, and Nate found it too busy.
- v2 order: Hero (brand promise, approved by Nate), Lineup cards, Values (feature cards for power, freedom, utility, quality and American made), Built, Close. Since the 2026-11-17 photo pass the Workstation and Event lineup cards, all five value cards and Built (via its `image` prop, the flag shot) use Nate's real photos. Built's default image is unchanged, so the old homepage is too.
- **Lineup cards** follow Tesla's homepage card row. Each card has a category, the name in that trailer's own type (`wordmark` in `testHome.ts`), one status line and the buttons. The look per trailer lives in the photo grade and the name:
  - **Cargo and Workstation:** heavy uppercase, warm daylight. They share one utility look.
  - **Event:** night, with a thin wide name.
  - **Garage:** black vignette, a slanted metal name and a gold hairline.
  - **Disaster Relief:** a cool grade, a field grid and gold corner brackets.
  - **Camper:** natural light, sentence case.
- Coming-next cards have no Reserve. "Get first word" opens a small signup dialog with the trailer picked. Reserve on a card preselects that trailer in the walkthrough form.
- Nate liked the v1 Garage and Disaster Relief looks. The v1 showcases (`Show*.astro`, `SpecPlate`) are held, unrendered, as starting points for the product pages.

## Homepage (from Test homepage 2, 2026-11-18)

- The homepage at `/` is the one Nate wrote in Notion after the 2026-11-18 team call (the "Home Page" item under Website Build in the Company Roadmap). It was drafted at `/test-home-2` and replaced the old homepage the same day. `/test-home-2` redirects to `/`.
- **What changed from the first test homepage:** only Cargo, Workstation and Event get space, and about 75% of the page speaks to contractors. Garage, Disaster Relief and Camper shrink to one "Coming next" strip.
- **Order:** Hero (background video, "The trailer that powers your job."), Proof strip (a real US flag badge), Lineup (sticky scroll) with the "See our future lineup" strip, Solutions (security photo, power video, comfort photo), Statement ("Bring your own power." over the snow tow video, from the old homepage's "Pull in. Plug in." band), What SPOG is made of (feature cards), Our future lineup (Garage, Disaster Relief, Camper), About band (shop video), FAQ (from the old homepage, nav FAQ link jumps here), Close (two forms), Footer. Cut at Nate's call: Built different, Guarantee, How it works and the run-time sheet.
- **Nav buttons on every page (Nate, 2026-11-18):** two one-line buttons, "Book a demo" (to `/demo`) and "Design yours", with no small labels. The phone action bar matches. These are the Nav and MobileBar defaults. "Design yours" opens `/configure`. The product pages pass their own link (see "Configurator"). Only `/old-home` passes its old Reserve and Book a walkthrough buttons.
- **Site nav and footer links** live in `content.ts` and follow the sitemap. Homepage anchors start with "/" (`/#future`, `/#faq`, `/#built`) so they work from every page, and `home2.ts` turns them into in-page links on the homepage. Keep the ids `lineup`, `future`, `faq`, `built`, `design` and `walkthrough` on the homepage.
- **Solutions (`SolutionCards.astro`)** say the fix, not the pain (Nate, 2026-11-18), after the video cards on rivian.com. Nate's order (2026-11-18): Security (mast photo), Power (looping video) in the middle, Comfort (the HVAC photo). An icon sits next to each card's name. The section runs wider than `wrap` (24px gutters up to 1920px) so the videos get room. Power is Nate's full welding clip at 0.75x, each half slowed and smoothed separately so nothing morphs across the cut. Videos load only when a card scrolls into view and pause when it leaves. A card's `note` puts a visible tag on it while its video is missing or a stand-in.
- **Our future lineup (`FutureLineup.astro`)** is one wide row in the first test homepage's looks (Garage, Disaster Relief, Camper), with "Join the waitlist" opening a signup. No category labels, specs, prices or Reserve. A small note under the row says the images are concept renderings of trailers that aren't built or for sale yet (Nate's request). Nate dropped the "Coming next" and "Get first word" wording on this page.
- **Statement** reuses the old homepage's band through new props (`eyebrow`, `words`, `video`, `poster`, `numbers`, `lazy`). Nate liked the look and hated the copy, so the words are his approved "Bring your own power." and the stale "100 kWh" number became "Length up to 20 ft". The video is his snowy drone shot of a Workstation on tow at 0.75x, smoothed and looped. It loads only when the section comes near.
- **About band** runs `about-shop-loop.mp4`, Nate's warehouse fly-through and the welder on the shop floor at half speed (see Gotchas for how it was made).
- **Book a demo (`/demo`)** offers an in-person demo, a virtual demo and a call. The first two open a form under the cards (no endpoint yet). The hero and close on the homepage still say "Book a walkthrough".
- **Kept from the first test homepage because Nate likes them:** the hero look (`TestHero`, now with props), the feature cards and the look of the Built band.
- **Lineup (`LineupScroll.astro`)** follows the second section on rivian.com. The section pins to the screen and steps through Cargo, Workstation and Event as you scroll:
  - Each panel has the name set huge behind the trailer, one sentence, one line of facts split by thin dividers, then "Explore" (product page) and "Design yours".
  - The trailers are cut-outs (`public/images/lineup-*.webp`), so the name can sit behind them. Sizes per panel are in `home2.ts` (`fit`, `shot`, `lap`).
  - Cargo and Workstation stand on studio gray. Event goes to night, its own look.
  - Without JavaScript, with reduced motion or on a very short screen, the panels stack as three full screens.
  - Mark any other section `data-hide-mobilebar` to hide the phone action bar while it's on screen, as the lineup does.
- **Prices come from the price sheet** (see "Price sheet" below): Cargo from $15,000, Workstation from $18,500. Event keeps Nate's "Buy from $150,000, or rent" (Event is not on the sheet), and its panel has no battery figure. Never add or change a price without Nate or the sheet.
- **"Design your trailer" opens the builder flow** (see "Configurator" for where each button goes). The form in the close is the build request form, which Workstation and Event still use. Links to `#design` open that form, and links to `#walkthrough` open the walkthrough form in the same card. A link with `data-trailer="Workstation"` also picks that trailer.
- **Shared sections take props with safe defaults**, so the other pages render as before: `TestHero` (copy, buttons, heading size), `FeatureCards` (a `kicker` slot), `Nav` (`cta`, `lineupHref`), `MobileBar` (`cta`) and `Footer` (`columns`, `full`).
- **"Harness" stays** in the Power card line. Nate chose it over the copy rule, and it's marked in `home2.ts`. He also chose the blunt "Other companies cut corners with staples and glue."
- The small line above "What SPOG is made of." spells out the name. It reads "Solar Power Off Grid", as on the logo and the decal on the trailers.

## Workstation page (2026-11-17)

- `/workstation` is the first page written for one buyer (GCs and subs). It started as a draft at `/test-workstation`. Nate liked it more than the template version, so it replaced it the same day, and the draft URL redirects. Cargo and Event still use the shared template until their own pages are built.
- References from Nate:
  - Rivian R1T, R2 and R1S.
  - Tesla Cybertruck.
  - Ring Jobsite Security, which he loves for being "simple. Lots of whitespace. Very clean."
- **The work look**, shared with Cargo later:
  - heavy uppercase headings with no label above them (`WorkTitle`)
  - light sections with a lot of space for the pitch (top half)
  - one dark chapter for the numbers, then the dark close
  - gold is never used as text on white, because it's too light to read
- **Order:** Hero (drone video, name, promise, three stats), Feature cards ("Get to know Workstation": solar and battery, the office, heat and AC, off the grid, built in America), Showcase photo (navy Workstation in the shop), What it replaces (the "One trailer. Three problems solved." sum), Options (big photo rows: security mast, Starlink, premium interior, generator hookup), Power, Statement photo ("Powering the Builders of America."), Size and Specs, Remote office band (big photo), Close ("Open on day one."), FAQ.
- **Photos run big (Nate, 2026-11-17).** Like the reference pages, the product, the features and the add-ons each get a large photo. Full-width breaks use `WorkPhoto` (heading or caption, `align="top"` puts the words in the sky). Options use `WorkOptions`. Never put two photo sections next to each other.
- **Feature cards replaced the Ring-style outcome row and the Inside section** on 2026-11-17, at Nate's request. Each card pairs a standard feature with its GC outcome line. Add-ons (security mast, Starlink, premium interior, generator hookup) live in Options. The "No generator" card became "Off the grid" because Nate's photos show an optional generator hookup.
- **Shared sections take props with safe defaults.** `ProductSubnav` takes `links`, and `ProductPower` and `ProductSize` take `look="work"`. Without them, the live product pages render exactly as before.
- **Runtime devices** on this page are computer, light tower, saw and welder. The fridge is left off because it has the same draw as the computer, so it shows the same hours.

## Price sheet (source of truth since 2026-11-20)

SPOG's external price sheet (`SPOG Price Sheet EXTERNAL.xlsx`, 2026-11-20) plus Nate's answers to questions about it. Where the site disagrees, the sheet wins.
- **Prices:** 10 ft Cargo $15,000, 20 ft Cargo $50,000, 10 ft Workstation $18,500, 20 ft Workstation $75,000. They exclude tax, title, registration and delivery. Nate approved showing them on the site. Event is not on the sheet.
- **Every Cargo includes** roof solar, battery and inverter, outlets inside and outside, full insulation (walls, floor and ceiling), the white composite interior over plywood, one built-in front corner work desk, a side entry door and rear double doors, and a vinyl floor (every model is vinyl, Nate overrode the sheet's plywood). **Every Workstation** adds heating and cooling.
- **Size:** 10 ft is 6.5 ft wide, 20 ft is 8 ft wide, all dual axle. The sheet's 10 ft height of "6 ft" is likely the interior height, so the site doesn't state it until Joe confirms. 20 ft Cargo 8 ft 2 in tall, 20 ft Workstation 8 ft.
- **Max loaded weight (GVWR):** 7,000 lbs (10 ft), 9,500 lbs (20 ft Cargo), 14,000 lbs (20 ft Workstation). Never say what tows it.
- **Power:** base battery 5 kWh (10 ft) or 10 kWh (20 ft), max 20 kWh on every model, $2,500 per 5 kWh. Solar 900 W or 2,800 W. Inverter 3,000 W or 6,000 W. 48 V DC with 120 V (10 ft) or 120 and 208 V (20 ft). No 240 V. Outlets 3 outside and 5 inside, 4 and 8 on the 20 ft Workstation.
- **Add-ons:** climate control on Cargo $3,500 (10 ft) or $5,000 (20 ft). 6 ft telescopic light $3,000 (light only, no camera). 28 ft light tower $13,300, 20 ft only, with an AI or regular camera (same price), a light and a horn. Starlink $850 for the dish and install, on Cargo or Workstation; the buyer gets the plan. No other cameras exist.
- **20 ft Workstation:** hyper-heating heat pump, one 36 in entry door and a single rear door, one 60 x 30 in window, white composite or premium wood interior (free choice), one built-in work desk.
- **Gone:** shelving, cabinets, overhead storage, the 35 ft Cargo, 40 kWh, 240 V, the standard mast, the 360 and small cameras, the horn and strobe system.

## Sitemap (Nate, 2026-11-18, not built yet)

The source of truth is the "Sitemap" item under "Website Build" in Notion's Company Roadmap. It replaces the 2026-11-17 plan, which gave Garage, Disaster Relief and RV their own pages. The homepage for this sitemap is live at `/`. The other new pages (Coming Next, About, Reviews, Support, Become a Dealer) aren't built.

- **Home:** about 75% Cargo and Workstation, since most visitors are contractors shopping for those. Event keeps a lineup card. Homepage copy v1 is on the "Home Page" item in the same Notion board.
- **Cargo**
- **Workstation:** includes a section on using it as a remote office (nomads, influencers), linking to its own landing page.
- **Event:** mostly about buying or renting it for your own events. A section covers buying one to rent out as an income stream, linking to its own landing page.
- **Coming Next:** one page for Garage, Disaster Relief and Camper, with a short blurb and a waitlist form for each. The homepage gets one tile that links here.
- **About:** the factory is the feature (build quality, the crew, service).
- **Reviews**
- **Support:** dropdown with FAQ, Contact, Warranty and Blog.
- **Become a Dealer:** a dealer lead page in V1, linked from the footer (Nate, 2026-11-18). A separate government site for Disaster Relief comes later.

The homepage hero is a background video. The solar unfold render loop holds the spot until real footage of a crew on site exists.

Each product page is written for its own buyer. The single shared `[product].astro` template gets replaced.

## Product pages (shared template, Cargo and Event)

- Order: Nav, Subnav (floating section bar that replaces the masthead after the hero), Hero, Overview (light), Power (dark), Statement (photo), Size + Specs (dark), Lineup (light), Close (dark), Faq (light), Footer, MobileBar. Overview and Statement are optional per product.
- Headline numbers and short specs come from `products` in `content.ts`. Don't retype them in `productPages.ts`, so a correction lands in one place.
- The Cargo page's "Design yours" links to `/configure/cargo` (Nate, 2026-11-18), which shows the price sheet's real prices.
- Only the length is labeled in the size drawing. Heights, axles and panel layout are drawn for looks.
- Runtime figures reproduce SPOG's "Customize My Trailer Guide" table (continuous use, full battery, one device, no solar). Keep battery stops inside each product's range.
- Cargo uses the "studio" hero (render in a framed plate) because there's no wide Cargo photo yet. Switch `hero.kind` to `photo` when Robert's shot exists.
- Nav links now go to `/cargo`, `/workstation`, `/event` and `/#...` for homepage-only anchors. Keep the ids `top`, `cta`, `walkthrough`, `sheet` and `faq` on every page so Nav, MobileBar and Close keep working.

## Cargo 2 (draft, 2026-11-19)

- `/cargo-2` is the Cargo page. On 2026-11-20 Nate retired the old `/cargo`: it redirects to `/cargo-2` (`astro.config.mjs`), the nav, footer, homepage lineup, lineup cards and Compare all link to `/cargo-2`, and the temporary "Cargo 2" nav and footer links are gone. Its size drawing moved over (see Order).
- **v2 (2026-11-19).** Nate found v1 repeated "a trailer you need anyway, with power" in nearly every section. v2 is built around what GCs and subs buy: power, security and storage, with heat and AC, Starlink and a custom look as add-ons, tied together by build quality. The core pitch appears only in the hero line, the Power card, the savings section and the close. The copy was reviewed in the "Cargo" item in Notion (Company Roadmap > Website Build). Cargo is the most utility trailer in the lineup (Nate: blue-collar, ready to get dirty, "Ford vibes"); Workstation is a little more upscale and Event the most.
- **v3 (2026-11-20) uses the /workstation-2 pattern, at Nate's request.** He liked how Workstation packages its features, so Cargo now does the same with its own copy: each feature said once, in one place, under a few big ideas after the Cybertruck page. It reuses the `ws2/` section components (`Ws2Features`, `Ws2Anywhere`, `Ws2Built`, `Ws2Options`), which take copy as props. v2's click-to-open feature cards and the options checklist are gone (the checklist repeated the cards, and the builder at `/configure/cargo` has the full list). The copy is Draft v3 in the Cargo item in Notion.
- **Order (Nate, 2026-11-20):** Hero (real photo, the name huge, one line, two buttons, "Starting at $15,000"), Redefining the enclosed cargo trailer (four swipe cards: Haul it all, Set it up your way, Lock down the site, Throw the job at it), the power system (`#power`, `Cargo2Power`, dark, laid out as a spec band after Nate turned down the photo-beside-text version: a centered heading and battery line, one wide battery photo with the three numbers over its bottom edge, then bigger corded tools and overnight charging side by side; the one place the page sells power, so the overview has no power card), See how it works for you (the 3D model), Spend less on fuel (`#savings`: heading and burn rate in one row, then one panel with the fuel number and two points), Take it anywhere (no lead photo, three wider cards via `wide`, and the weight, length and axle row), Built for whatever the job site brings (in the page container via `contained`: the frame photo, then designed and tested, the warranty in the center, and insulation with Nate's foam board photo), Add what you need (photo carousel: the 28 ft tower with its camera, climate control and your company's look, then tiles and a link to the builder), Size and specs (`ProductSize` from the old /cargo, which Nate liked: the to-scale drawing with a pickup and the length picker, then Cargo 2's own spec rows in one column with its fine print), FAQ, then Close (after the FAQ so the dark size section and the close don't touch). Light and dark alternate all the way down.
- **After the meeting with Alessandro and Joe (2026-11-20):**
  - Power on tap sells two things. Running full-size corded tools comes from Joe, who said battery tools hold a crew's production back. Leaving tool batteries charging overnight in the locked trailer comes from Jay, a contractor they interviewed, and was called a major point for this buyer. Tool charging moved there from Spend less on fuel, which now has two tiles and the heading "Spend less on fuel."
  - Set it up your way names the off-the-shelf E-track accessories crews already buy (fold-down tables, tool holders, straps).
  - Throw the job at it says the white composite walls are backed by plywood and the floor is vinyl. Composite panels are standard on every trailer (Joe), and every model has a vinyl floor (Nate, 2026-11-20, overriding both the sheet's plywood and his earlier rubber).
  - The Built sub adds insulation, with "most cargo trailers go without insulation" marked CONFIRM.
  - Heat and AC became Climate control in the options and the tour note.
  - Every camera and security line stays as it is (Nate: assume what we have is right).
- **The bracket gaps are closed** by the price sheet (battery, weight, side door). Weight shows as max loaded weight. The tow vehicle stat is gone: never say what can tow it (9,500 and 14,000 lb loaded trailers need a capable truck).
- **Photos** are Nate's black 20 ft (`cargo*` entries in `shoot`, made from `_photos-original/2026-11-17/Black Cargo Trailer/`). The Storage, Custom interior and Heat and AC cards use his "Better Interior" set (photos 60 to 63 and 66). The Your look card uses the nose with the SPOG decal until a customer-branded Cargo exists. Cards are 2:3 crops and their panels use matching 3:2 crops. The rear doors photo (7) has the license plate painted out. Photos picked to avoid other brands' vehicles, people and plates.
- **The 3D tour** uses `embed.ts`. It loads only when the section comes near and stops drawing when it leaves the screen, so the page loads no three.js up front. It has views, open doors, the inside view and the 12 colors. The viewer is labeled "Computer-generated model", and a note under it names the optional extras the model shows (heat and AC, desk, wall track). Keep the tour on a light background, because the canvas is see-through.
- **It's a utility trailer first (Nate, 2026-11-19).** Say "enclosed cargo trailer", the term every competitor uses. Lead with durability and build quality for GCs and subs on job sites, not lifestyle. Built for the job site leads with Nate's steel floor frame photo (`cargoFrame`), with the welding and CAD shots beside it. Work options (storage, workbench, E-track) list before fixtures.
- **Copy rules kept:** prices and specs come only from the price sheet, the options sheet, the Warranty Policy or Nate. Base prices show in the hero and Specs. Add-on prices live in the builder, not on the page. The side window is on the 20 ft in the photos but not on the price sheet; Nate says the sheet is wrong, so leave windows as the site has them. The low two-door compartment on the street side holds equipment (the AC or air compressor, per Nate), so never call it storage.
- Nate's Cargo messaging report says never to make the empty trailer the main character. A Tesla or Rivian style page does that, so he should decide.

## Workstation 2 (draft, v3 built 2026-11-20)

- `/workstation-2` is Nate's new pass on the Workstation sales page. `/workstation` is untouched. The nav and the footer's Trailers column carry a temporary "Workstation 2" link (marked in `navLinks` in `content.ts`). Remove both once he picks a version.
- **Nate's brief:** the buyers are GCs and the business people behind a construction job, and owners and executives visit the site, so comfort matters. They care about power, security, connectivity and quality. It's often the first trailer on a site with no power. It's also a mobile office for content creators and digital nomads. Rugged like every SPOG, a step more upscale than Cargo because of the premium, customizable interior.
- **v3 is built one-to-one on the Tesla Cybertruck page (Nate, 2026-11-20).** v1 said the same things over and over, and Nate was angry about it. Each feature is said once, in one place, packaged under a few big ideas the way Cybertruck does. The copy was approved line by line in Notion (Company Roadmap > Website Build > "Workstation"). Change copy there first, then in `workstation2Page.ts`.
- **Order (Cybertruck section in brackets):** Hero (hero), Redefining the site office (Redefining the Pickup Truck: five swipe cards), See how it works for you (the 3D tour, Nate's call), Tough on the outside, comfortable on the inside (same section: interior video and two cards), Take it anywhere (Take on Any Terrain: Rivian clip, four cards, number row), Your office on the road (The Future of Travel Is Autonomous), Built to last on the job site (Designed to Be the Safest Truck: three cards that run wider than the page container, Nate 2026-11-20), Add what you need (Add What You Need: a carousel of wide photo cards for the 28 ft security tower, TV or monitor, company logo and colors and generator hookup, then small tiles for desks, fridge and microwave, Starlink and the cellular router; the tower replaced the whiteboard, Nate 2026-11-20), Power anything with Workstation (Power Anything With Cybertruck: Nate's welding clip beside the battery sizes and one list of run times, simplified 2026-11-20 because the tool felt busy), Ground control for Joby Aviation (Rivian Fleet's Amazon case study band), Specs, Close, FAQ (three questions).
- **Not too dark (Nate, 2026-11-20).** Four dark sections in a row at the bottom was too much, so Power (stone) and Specs (white, `Cargo2Specs tone="light"` with the cut-out) are light. Keep the bottom alternating.
- **Facts (price sheet and Nate, 2026-11-20):** the 6 ft telescopic light is a $3,000 add-on with a light only (sell it for lighting the lot and working after dark). The 28 ft light tower package (AI or regular camera, a light and a horn) is $13,300 and 20 ft only. No 360 camera, no cameras on the 10 ft. Outlets are 120 V on the 10 ft and 120 and 208 V on the 20 ft. People power lights and laptops on it more than they charge tools. The frame is welded steel. Joby gave permission for the case study.
- **[BRACKETS] are gaps Joe still has to fill** (weight, tow vehicle, which heat pump the 10 and 20 ft get, two certifications). `Ws2Text` highlights them on the page on purpose. Fill them in `workstation2Page.ts` and the highlight goes away.
- **Stand-in media (swap when the shots exist):** Power on tap shows SPOG's battery units in the black Cargo; Make it yours uses the wall screen clip; Enter another world uses the navy Workstation with its doors open; Service on site uses the flag shop photo; the 3D tour is the Cargo model with a tag saying so. The comments in `workstation2Page.ts` say what each card wants.
- **Videos** are Nate's: `ws2-comfort-loop` (the empty office from `Workstation Interior.mp4`, forward then back), `ws2-road-loop` (someone at the desk from behind, plus the monitors), `ws2-hero-rivian` (`Rivian Clip-1.mp4`, the hero since 2026-11-20; "Take it anywhere" leads with the rural sunset photo instead), `ws2-power-weld` (the close-up half of `Welding Outside (1)-1.mp4`; the drone half shows other brands' trucks), `ws2-card-tow` (`Mountain Shot-1.mp4`, cropped to keep the pickup out), `ws2-card-interior` (the influencer video) and `ws2-card-roof.jpg` (cropped from the aerial photo). No faces, house or Tesla. They play only while on screen (`[data-ws2-video]` script in the page).
- The hero shows "Starting at $18,500" (price sheet, Nate 2026-11-20).
- **After the meeting with Alessandro and Joe (2026-11-20):** "Certified and tested" became "Tested as one system", and the Certifications spec row is commented out until the NATM inspection passes. Climate control replaced "heat and AC" in the hero line (Nate's), the meta description, the Take it anywhere card and the specs. Make it yours now runs a push-in through the door into the empty office (65 to 70 s of the influencer video, forward then back) because Nate found the wall-screen crop poor.
- **Shared sections gained optional props** with defaults, so other pages render as before: `ProductPower` (`id`, `keys`, `sheet`, `heading`, `intro`, `figures`, `battery`), `WorkEquation` (`equation`, `name`), `Cargo2Specs` (`specs`), `Cargo2Close` (`close`, `demo`, `design`) and `Cargo2Tour` (`tour`, `design`, `standIn`). `ProductPower` numbers keep their case ("kWh"), and its battery buttons now find their section by `data-power-tool`, so the tool works whatever id a page gives it (it was dead on /workstation-2 v1).

## Configurator (rebuilt 2026-11-18)

- `/configure/cargo` follows Tesla's design studio (tesla.com/model3/design), at Nate's request: a white viewer on the left that you drag all the way around, one scrolling column of choices on the right, and a bar along the bottom with the price and the order button. The first version is saved in `_archive/2026-11-18-configurator-v1/`.
- **Where "Design yours" goes (Nate, 2026-11-18):**
  - Anywhere general (nav, homepage hero, phone bar, `/demo`): `/configure`, which asks which trailer. Only Cargo has a builder, so Workstation and Event are greyed out there with a "Request a build" link.
  - On the Cargo lineup panel and the Cargo page: straight to `/configure/cargo`.
  - On Workstation and Event: the build request form on the homepage (`/?trailer=Workstation#design`), until they get builders. Add a builder by adding it to `builders` in `configure/index.astro` and `[product].astro`, and to `builder` in the lineup data in `home2.ts`.
- **The options are real.** They follow SPOG's "Trailer Customization Options" sheet (SPOG-D-0001, Release 1, Nov 17 2026), section by section and mostly in its words, plus the 12 exterior colors Nate sent:
  - Lengths 10 ft ($15,000) and 20 ft ($50,000), both dual axle. The 35 ft is not offered now (Nate, 2026-11-20).
  - Colors: White, Black, Charcoal Grey, Silver, Red, Pewter, Indigo Blue, Matte Black, Dove Grey, Yellow, Brandywine, Blue. The hex values are matched by eye to the names.
  - Company logo by spot (nose left, nose right, left side, right side, rear, all), typed or uploaded. Vinyl lettering or numbers is a note only.
  - Power: battery in 5 kWh steps from the size's base (5 kWh on the 10 ft, 10 kWh on the 20 ft) to 20 kWh, $2,500 per step. Voltage is not a choice (120 V on the 10 ft, 120 and 208 V on the 20 ft). Shore power 30, 50 or 100 amp stays as an unpriced choice. Roof solar is standard (900 W or 2,800 W).
  - Interior: climate control ($3,500 on the 10 ft, $5,000 on the 20 ft). The built-in front corner desk is standard. Extra desks (up to two, on the battery platforms, per Alessandro on the 2026-11-20 call; CONFIRM), workbench, whiteboard, TV or monitor, refrigerator, microwave, refreshment counter and E-track on walls and floor stay as quoted options with no price. Shelving, cabinets and overhead storage are gone (Nate, 2026-11-20).
  - Connectivity and security: Starlink ready, cellular router, AI job site camera system, security cameras, security audio system.
  - Not offered, because the sheet doesn't list them: trim and wheel choices, a ramp door, wall and floor finishes.
- **The prices are real** (the price sheet, 2026-11-20). Options the sheet doesn't price show as quoted and stay out of the total. No delivery fee or deposit is shown. Prices exclude tax, title, registration and delivery. Security is the 6 ft telescopic light ($3,000) and the 28 ft light tower with an AI or regular camera, a light and a horn ($13,300, 20 ft only). Starlink is $850 for the dish and the install; the buyer sets up the plan. Only the paint hex values and the run-time wattages are estimates.
- **The 3D model** is built in code on three.js (used on this page only) from Nate's photos of the finished black 20 ft Cargo in `_photos-original/2026-11-17/Black Cargo Trailer/` (outside and `Interior/`). It's a close stand-in, not CAD. Measurements scaled from the photos are in `dims.ts`:
  - The 20 ft length includes the 2 ft V nose. Width is per size (price sheet): 6.5 ft on the 10 ft, 8 ft on the 20 ft. Both are dual axle. The 10 ft body is drawn for a 6 ft interior, since the sheet's "6 ft" can't be ground to roof (research 2026-11-20; CONFIRM with Joe). The 20 ft roof is about 8 ft 2 in.
  - Curb side: entry door with a window. Street side: sliding window over the axles and a two-door equipment compartment (not storage, Nate 2026-11-19).
  - Rear: barn doors with twin chrome lock bars and four oval tail lights. Roof: five solar panels and a low vent.
  - Black machined wheels tucked under the body, their outer faces flush with the walls, inside aluminum radius fenders around arches cut into the walls. Nate corrected the old outboard wheels on 2026-11-20 with a close-up photo. The spare stands on the street-side tongue rail just ahead of the point of the nose (it used to clip into the nose).
  - Inside (rebuilt 2026-11-19 from Nate's "Better Interior" photos, `Black Cargo Trailer/Better Interior/` 60 to 66): glossy white wall panels with faint seams every 4 ft and across the ceiling, a black diamond-plate angle where the walls meet the ceiling, two rows of black-rimmed puck lights (about one every 3 ft), a smooth charcoal vinyl floor, and a white nose wall with the heat and AC head high on its street half and a single-panel closet door (three black hinges, round black knob) on its curb half.
  - Battery units (5 kWh each) are open gray aluminum cages around a white module, red terminals and cable on top. They stand on the low white platforms with black channel that box in the wheels (the wheel wells, as in photo 60), so on the 20 ft they sit mid-length under the window and the desk (solid white base, black top, up to 6.5 ft) runs from them to the nose wall. The platforms are there with or without batteries. Furniture packs into the free wall stretches behind and in front of them.
  - Alessandro said the batteries don't look real yet (2026-11-20). Nate has reference photos to share before they're redone.
  - E-track is the open-slot kind (the white wall shows through), 5 in tall, at about 1 ft 8 in and 4 ft 10 in.
- **Realism pass (2026-11-18, Nate asked for it to look more like Tesla's):**
  - A soft contact shadow is redrawn every frame from what sits near the ground.
  - Ambient occlusion shades the creases (screens 900px and wider only).
  - The paint has a sharper clearcoat and a faint ripple so reflections bend like real sheet aluminum.
  - The tires have tread, and the rails have fasteners.
  - The canvas is see-through, so the page's white is the backdrop.
  - It's still simple shapes drawn live. Tesla-level pictures need the factory's CAD files or a 3D artist's model.
- Options are modeled from SPOG's own builds where photos exist: Starlink rides on the 6 ft light when it's picked, else on its own short pole on the curb half of the roof over the nose, never on the 28 ft tower (Nate, 2026-11-20); the 6 ft telescopic light (lights only), the 28 ft tower (drawn full height, so the camera backs off when it's picked), the Starlink dish, the black-topped white desk and black E-track. The rest are simple stand-ins.
- Furniture is packed along the walls in the order it's picked up in `trailer.ts`. When a piece doesn't fit (mostly on the 10 ft), the preview leaves it out and a notice says so. The real layout is worked out with the buyer.
- "Open doors" swings the rear and side doors, and the Interior view puts the camera inside.
- The viewer carries the notice "Computer-generated model. The finished trailer may differ." (Nate, 2026-11-18), as does the Cargo card on `/configure`.
- **The viewer turns to the section you scroll to** and to the option you just picked. The dots under the viewer step through six views. **Callouts** on the first view are pinned to points on the model and hide once you drag.
- The picture on the `/configure` Cargo card is a capture of the model (`public/images/configure-cargo.jpg`, 1037 x 640, also the Cargo 2 tour poster). Remake it if the default look changes. It was last remade on 2026-11-20 for the flush wheels, in headless Chrome: the front view, the page hidden around the canvas, then trimmed.
- Nothing is sent anywhere and no payment is taken. The build is saved in the URL hash so it can be shared. Delivery, ZIP, contact details and an uploaded logo file are never put in the URL.
- After adding a dependency or a new folder, restart the dev server (`npx astro dev stop`, then `npm run dev`) if new Tailwind classes don't show up.

## Gotchas

- **New photos.** Don't commit camera originals (they run 10 to 360 MB). Put originals in `_photos-original/<date>/`, then make web copies in `public/images/`: `sips -s format jpeg -Z 2400` (it reads .CR3 raw files too and bakes in rotation), then `ffmpeg -map_metadata -1 -q:v 4` for the 2400 px copy and `-vf scale=1200:-2` for the `-1200` copy. That strips location data. sips needs an unsandboxed shell. Videos: `ffmpeg -an -map_metadata -1 -vf scale=1600:-2 -c:v libx264 -crf 30 -movflags +faststart`, cut to a stretch with no burned-in text. Add the result to `shoot` in `content.ts`.
- **Slowed and looped videos.** Nate wants slow motion without stutter. Slow with `setpts=2*PTS` and fill the gaps with `minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1`, so every frame is new rather than repeated. Join clips with `xfade`. For a seamless loop, cross-fade the end of the joined video into its own first second and trim that second off the front. `about-shop-loop.mp4` was made this way. The card videos are cropped to 4:5 (`crop=864:1080:x:0`).

- **Cut-out trailers for the lineup.** `scripts/cutout.py` lifts the trailer out of a photo with Apple's Vision (setup and usage are at the top of the file). It runs on the Mac and needs an unsandboxed shell. Check the edges, then retouch by hand. On 2026-11-19 Nate supplied his own Workstation cut-out (`Workstation transparent background.png`), which replaced the script's version. It was only trimmed to its edges and saved as WebP. The same day his Cargo image (`Cargo trailer transparent background.png`) replaced the render. Its checkerboard was painted into the pixels, so it went through `cutout.py` like a photo. Check any "transparent" PNG for real alpha before using it. The Event one (from `event-day-wings.jpg`) had the table, jacks and tongue erased, and its left wing fades out where the photo cut it off. A clean Event side profile from Rob would replace the last one.

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
- Cargo 2 Built sub: "most cargo trailers go without insulation". Joe said regular cargo trailers aren't insulated, so confirm the wording before launch.
- Workstation certifications are held off the page until the NATM inspection passes. Name them in the Tested as one system card and the specs when it does.
- Joby: Nate has Joby's permission (2026-11-20) to use their name, logo and photo (`Case study trailer with joby.jpg`) for the Workstation case study.
- Walkthrough form, run-time sheet form, Coming next signup and every "Reserve" button have no endpoints yet. Wire them to GoHighLevel.
- FAQ answers (drafted from existing homepage copy, each needs sign-off)
- The three points in the Close section (drafted from existing copy)
- Event trailer: row copy, Events tab copy, a real Event photo and a spec sheet. The row renders without a photo or specs until they exist.
- One-line descriptions for Garage, Disaster Relief and Camper
- Imagery pulled from spogtrailers.com on 2026-11-16 (all marked in `content.ts`). Renders: `event-led-dusk.jpg` (Event lineup row), `garage-ev-inside.jpg`, `disaster-relief-solar-deployed.jpg`, `camper-campfire.jpg` (Coming next cards), `statement-solar-unfold.mp4` + `.jpg` (Self-powered background loop, concept render). Real photos: `event-movie-night.jpg` (Events tab), `shop-floor.jpg` (Built section). Renders of trailers that are on sale should be swapped for real photos before launch.
- The Workstation page on spogtrailers.com uses an AI-generated header image. Don't reuse it as product imagery.
- The Workstation studio render used in Compare shows a door decal with an edition name the brand rules ban. Reshoot or retouch.
- Configurator: options with no price on the sheet show as quoted. Its paint colors are matched by eye and need checking against the real swatches.
- All `href="#"` links
- Product pages: every line marked NEW in `productPages.ts` needs approval, and so does the copy written into `src/components/product/` (section headings, the runtime footnote, button labels). Feature tiles marked PLACEHOLDER SOURCE (Workstation security cameras, Event 5G internet and 360 cameras) come from the old site and need confirming.
- Product page lengths: Cargo and Workstation are 10 or 20 ft (price sheet). Event 24/31 ft stops are guesses between documented endpoints.
- Product page photos: Cargo and Workstation statement photos are Red Rocks placeholders (the Cargo one may not show a Cargo). The Event dusk render shows a video game on the screen, so check rights or swap the screen image.
- The Garage render (`garage-ev-inside.jpg`) shows a Tesla Model S inside. Swap it for a neutral car before launch.
- Workstation page: every line marked NEW in `workstationPage.ts`. The remote office button opens the walkthrough form until its landing page exists.
- Workstation options to confirm: whether the premium interior is an option and what it includes, and how to present the generator hookup next to the approved line "No utility hookup, no generator noise."
- The Workstation dusk photo (`ws-dusk.jpg`, remote band) has a Tesla Cybertruck in the frame. Check that's fine before launch.
- The navy Workstation with a customer's BSW branding was held for the customer's permission. Nate chose it for the Company logo and colors card on /workstation-2 on 2026-11-20 (`ws2-opt-logo`); confirm he has that permission.
- Held out of `public/` until cleared: the Event render with a basketball broadcast on its screen (rights). It is in `_photos-original/2026-11-17/`. The Joby shot was cleared on 2026-11-20 (Nate has Joby's permission).
- Homepage (`home2.ts`):
  - Every line marked NEW needs approval.
  - The three customer quotes in the proof strip. The slots show as empty dashed boxes until real quotes are signed off.
  - The Cargo panel reads "Up to 20 kWh" (price sheet).
  - The Workstation panel line "The site office that works the day it lands." Nate wants a new one (it also runs on the old homepage in `content.ts`).
  - Solution cards: the Security photo is the mast in the shop, and a night shot of it at work would be stronger. The Power card's drone half shows an orange pickup and a Chevy in frame.
  - Statement: "0 gal fuel per day" over snow footage reads as a winter claim, so confirm it with Joe. A Rivian tows the trailer in the video.
  - The FAQ answers on the homepage are the old homepage's placeholders, still unapproved. The run-time answer points at `/demo` because the sheet was cut.
  - Our future lineup: the three one-liners and the renderings note. The Garage render shows a Tesla inside.
  - `/demo`: every line marked NEW in `demo.ts`, and both forms need endpoints (GoHighLevel, or a calendar booking).
  - "See the factory" and the footer's About, Reviews, Become a Dealer, Warranty and Blog links point nowhere until those pages exist. "See our future lineup" jumps to the row on this page until the Coming Next page exists.
  - The build request form and the walkthrough form have no endpoints yet. Wire them to GoHighLevel.
  - Which cameras ship at V1, for the Security card.
- The old spogtrailers.com specs (Cargo 8 to 35 ft, 5 to 64 kWh, up to 5,000W) are superseded by the 2026-11-20 price sheet for Cargo and Workstation.

## Photography needed (Robert's shot list)

The dark half of the page reuses one Red Rocks photo. Replace with:

1. Hero: crew working out of a SPOG on a Tri-State site, 16:9, subject right of center
2. Statement: wide shot of a SPOG on site at first light, 21:9
3. Built: Middletown shop floor, welder or electrician at work, 4:5 portrait
4. Residential crews tab: Cargo on a real driveway
5. Highlights cards: roof solar close-up, crew charging tools, gear inside the trailer
6. Customer story: the actual customer on their site
7. Videos for the homepage solution cards (4:5 crop friendly, 5 to 10 seconds, no burned-in text): the security mast's cameras and lights working at night, and a crew member working inside a Workstation with the heat or AC running. A Power shot without other brands' vehicles in frame would also help.
8. Done 2026-11-17 (Nate's photos): Workstation office interior, heat and AC unit, Starlink, security mast, welding, CAD. Still nice to have: a super working at the desk, and the Workstation on a real job site.
9. Done 2026-11-17: homepage value cards. Still nice to have: a SPOG tech on a customer site for Quality.

## Next steps (suggested)

- Swap `<img>` for `astro:assets` `<Image>` to get responsive WebP output
- Add a real video embed for the customer story
- Split Cargo and Workstation into their own pages once copy is final
