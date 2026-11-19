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
| `src/components/features/FeatureCards.astro`, `src/data/features.ts` | Feature cards (after Rivian's "Get to know", Tesla's "Meet Model Y" and Pebble's feature section): a row of tall cards you can swipe, each opening a panel with the photo, numbers and detail. Used on `/workstation` and the homepage. Several can share a page. |
| `src/components/work/`, `src/data/workstationPage.ts` | The work look (Cargo and Workstation) and the Workstation draft's copy. Every line is marked NEW, SOURCE or PLACEHOLDER. |
| `docs/product-page-teardown-workstation-2026-11-17.md` | Ring Jobsite Security, Cybertruck, Rivian R2 and R1S research behind the Workstation draft, plus the Pebble, Rivian and Model Y feature sections behind the feature cards |
| `src/pages/cargo-2.astro`, `src/components/cargo2/`, `src/data/cargo2Page.ts` | Cargo 2, the new Cargo sales page draft at `/cargo-2` (see "Cargo 2"). Not indexed. Every line of copy is marked NATE, SOURCE, NEW or CONFIRM. |
| `src/scripts/configurator/embed.ts` | The 3D Cargo as a drop-in viewer with no option panel (`mountViewer`). Load it only with a dynamic `import()`, because it pulls in three.js. |
| `src/pages/[product].astro` | Product pages at `/cargo` and `/event`, one shared template (Workstation has its own page). Section order and rhythm in the comment at the top. |
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
- **Prices on the lineup panels are Nate's** (2026-11-18): Cargo from $10,000, Workstation from $15,000, Event "Buy from $150,000, or rent". The Event panel has no battery figure. Never add or change a price without him. The only other price on the site is "Starting at $10,000" in the Cargo 2 hero (Nate, 2026-11-19, after Rivian).
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
- No prices on product pages. The Cargo page's "Design yours" links to `/configure/cargo` (Nate, 2026-11-18), which still shows sample prices.
- Only the length is labeled in the size drawing. Heights, axles and panel layout are drawn for looks.
- Runtime figures reproduce SPOG's "Customize My Trailer Guide" table (continuous use, full battery, one device, no solar). Keep battery stops inside each product's range.
- Cargo uses the "studio" hero (render in a framed plate) because there's no wide Cargo photo yet. Switch `hero.kind` to `photo` when Robert's shot exists.
- Nav links now go to `/cargo`, `/workstation`, `/event` and `/#...` for homepage-only anchors. Keep the ids `top`, `cta`, `walkthrough`, `sheet` and `faq` on every page so Nav, MobileBar and Close keep working.

## Cargo 2 (draft, 2026-11-19)

- `/cargo-2` is Nate's new pass on the Cargo sales page, after the Tesla Model Y and Rivian R1T product pages. `/cargo` is untouched. The nav and the footer's Trailers column carry a temporary "Cargo 2" link (marked in `navLinks` in `content.ts`). Remove both once he picks a version.
- **v2 (2026-11-19).** Nate found v1 repeated "a trailer you need anyway, with power" in nearly every section. v2 is built around what GCs and subs buy: power, security and storage, with heat and AC, Starlink and a custom look as add-ons, tied together by build quality. The core pitch appears only in the hero line, the Power card, the savings section and the close. The copy was reviewed in the "Cargo" item in Notion (Company Roadmap > Website Build). Cargo is the most utility trailer in the lineup (Nate: blue-collar, ready to get dirty, "Ford vibes"); Workstation is a little more upscale and Event the most.
- **Order:** Hero (real photo, the name huge, one line, two buttons, "Starting at $10,000"), Get to know Cargo (six cards: Power, Security, Storage, Heat and AC, Starlink, Your look, after Tesla's "Meet Model Y"), Built for the job site ("Built to take a beating on the job site.", frame photo then three rows, two with video), Take a tour (the 3D model), What it saves you (`#savings`, fuel number and three icon tiles, after Tesla), Options (grouped like the cards), Specs, Close, FAQ (five questions). The statement photo and the shared shop video band were cut because they repeated the pitch and the Build section.
- **Photos** are Nate's black 20 ft (`cargo*` entries in `shoot`, made from `_photos-original/2026-11-17/Black Cargo Trailer/`). The Storage and Heat and AC cards use his "Better Interior" set (photos 60, 61 and 66). The Your look card uses the nose with the SPOG decal until a customer-branded Cargo exists. Cards are 2:3 crops and their panels use matching 3:2 crops. The rear doors photo (7) has the license plate painted out. Photos picked to avoid other brands' vehicles, people and plates.
- **The 3D tour** uses `embed.ts`. It loads only when the section comes near and stops drawing when it leaves the screen, so the page loads no three.js up front. It has views, open doors, the inside view and the 12 colors. The viewer is labeled "Computer-generated model", and a note under it names the optional extras the model shows (heat and AC, desk, wall track). Keep the tour on a light background, because the canvas is see-through.
- **It's a utility trailer first (Nate, 2026-11-19).** Say "enclosed cargo trailer", the term every competitor uses. Lead with durability and build quality for GCs and subs on job sites, not lifestyle. Built for the job site leads with Nate's steel floor frame photo (`cargoFrame`), with the welding and CAD shots beside it. Work options (storage, workbench, E-track) list before fixtures.
- **Copy rules kept:** the hero's "Starting at $10,000" is the only price (Nate's call, 2026-11-19), and only facts from the options sheet, the Warranty Policy or Nate. No solar watts, width, lead time, payload or delivery. The side window is on the 20 ft in the photos but not on the options sheet, so its card says "On the 20 ft shown here". The low two-door compartment on the street side holds equipment (the AC or air compressor, per Nate), so never call it storage.
- Nate's Cargo messaging report says never to make the empty trailer the main character. A Tesla or Rivian style page does that, so he should decide.

## Configurator (rebuilt 2026-11-18)

- `/configure/cargo` follows Tesla's design studio (tesla.com/model3/design), at Nate's request: a white viewer on the left that you drag all the way around, one scrolling column of choices on the right, and a bar along the bottom with the price and the order button. The first version is saved in `_archive/2026-11-18-configurator-v1/`.
- **Where "Design yours" goes (Nate, 2026-11-18):**
  - Anywhere general (nav, homepage hero, phone bar, `/demo`): `/configure`, which asks which trailer. Only Cargo has a builder, so Workstation and Event are greyed out there with a "Request a build" link.
  - On the Cargo lineup panel and the Cargo page: straight to `/configure/cargo`.
  - On Workstation and Event: the build request form on the homepage (`/?trailer=Workstation#design`), until they get builders. Add a builder by adding it to `builders` in `configure/index.astro` and `[product].astro`, and to `builder` in the lineup data in `home2.ts`.
- **The options are real.** They follow SPOG's "Trailer Customization Options" sheet (SPOG-D-0001, Release 1, Nov 17 2026), section by section and mostly in its words, plus the 12 exterior colors Nate sent:
  - Lengths 10 and 20 ft, with 35 ft shown as "Estimated availability summer 2027" and not selectable.
  - Colors: White, Black, Charcoal Grey, Silver, Red, Pewter, Indigo Blue, Matte Black, Dove Grey, Yellow, Brandywine, Blue. The hex values are matched by eye to the names.
  - Company logo by spot (nose left, nose right, left side, right side, rear, all), typed or uploaded. Vinyl lettering or numbers is a note only.
  - Power: battery 5, 10, 20, 40 kWh or other, output voltage 120, 208 and 240 V, shore power 30, 50 or 100 amp. Roof solar is standard, so there's no panel count to choose.
  - Interior: heating and cooling, office desk, workbench, cabinets, shelving, overhead storage, whiteboard, TV or monitor, refrigerator, microwave, refreshment counter, E-track on walls and floor.
  - Connectivity and security: Starlink ready, cellular router, AI job site camera system, security cameras, security audio system.
  - Not offered, because the sheet doesn't list them: trim and wheel choices, a ramp door, wall and floor finishes.
- **The prices are not real.** The sheet has no prices. Only "From $10,000" is Nate's. Every other price in `data.ts` is a sample so the running total works, as are the panel and tool wattages, the delivery fee and the deposit. The page is linked from the site now, so real prices (or hiding the prices) must happen before launch. Never copy the sample numbers anywhere else.
- **The 3D model** is built in code on three.js (used on this page only) from Nate's photos of the finished black 20 ft Cargo in `_photos-original/2026-11-17/Black Cargo Trailer/` (outside and `Interior/`). It's a close stand-in, not CAD. Measurements scaled from the photos are in `dims.ts`:
  - The 20 ft length includes the 2 ft V nose. The body is 7 ft wide with the wheels outside it.
  - Curb side: entry door with a window. Street side: sliding window over the axles and a two-door equipment compartment (not storage, Nate 2026-11-19).
  - Rear: barn doors with twin chrome lock bars and four oval tail lights. Roof: five solar panels and a low vent.
  - Black machined wheels under aluminum fenders, with a matching spare on the tongue.
  - Inside (rebuilt 2026-11-19 from Nate's "Better Interior" photos, `Black Cargo Trailer/Better Interior/` 60 to 66): glossy white wall panels with faint seams every 4 ft and across the ceiling, a black diamond-plate angle where the walls meet the ceiling, two rows of black-rimmed puck lights (about one every 3 ft), a smooth charcoal rubber floor, and a white nose wall with the heat and AC head high on its street half and a single-panel closet door (three black hinges, round black knob) on its curb half.
  - Battery units (5 kWh each) are open gray aluminum cages around a white module, red terminals and cable on top, standing on a low white platform with black channel. On the 20 ft they sit mid-length, about 6 ft in from the rear doors, as in photo 60, and the desk (solid white base, black top, up to 6.5 ft) runs from them to the nose wall. Short trailers keep the batteries at the rear. Furniture packs into the free wall stretches behind and in front of the batteries.
  - E-track is the open-slot kind (the white wall shows through), 5 in tall, at about 1 ft 8 in and 4 ft 10 in.
- **Realism pass (2026-11-18, Nate asked for it to look more like Tesla's):**
  - A soft contact shadow is redrawn every frame from what sits near the ground.
  - Ambient occlusion shades the creases (screens 900px and wider only).
  - The paint has a sharper clearcoat and a faint ripple so reflections bend like real sheet aluminum.
  - The tires have tread, and the rails have fasteners.
  - The canvas is see-through, so the page's white is the backdrop.
  - It's still simple shapes drawn live. Tesla-level pictures need the factory's CAD files or a 3D artist's model.
- Options are modeled from SPOG's own builds where photos exist: the security mast with dome cameras and the Starlink dish on top (Workstation photos), the black-topped white desk and black E-track (Cargo interior photos). The rest are simple stand-ins.
- Furniture is packed along the walls in the order it's picked up in `trailer.ts`. When a piece doesn't fit (mostly on the 10 ft), the preview leaves it out and a notice says so. The real layout is worked out with the buyer.
- "Open doors" swings the rear and side doors, and the Interior view puts the camera inside.
- The viewer carries the notice "Computer-generated model. The finished trailer may differ." (Nate, 2026-11-18), as does the Cargo card on `/configure`.
- **The viewer turns to the section you scroll to** and to the option you just picked. The dots under the viewer step through six views. **Callouts** on the first view are pinned to points on the model and hide once you drag.
- The picture on the `/configure` Cargo card is a capture of the model (`public/images/configure-cargo.jpg`). Remake it if the default look changes.
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
- The Joby hangar photo needs Joby's written permission
- Walkthrough form, run-time sheet form, Coming next signup and every "Reserve" button have no endpoints yet. Wire them to GoHighLevel.
- FAQ answers (drafted from existing homepage copy, each needs sign-off)
- The three points in the Close section (drafted from existing copy)
- Event trailer: row copy, Events tab copy, a real Event photo and a spec sheet. The row renders without a photo or specs until they exist.
- One-line descriptions for Garage, Disaster Relief and Camper
- Imagery pulled from spogtrailers.com on 2026-11-16 (all marked in `content.ts`). Renders: `event-led-dusk.jpg` (Event lineup row), `garage-ev-inside.jpg`, `disaster-relief-solar-deployed.jpg`, `camper-campfire.jpg` (Coming next cards), `statement-solar-unfold.mp4` + `.jpg` (Self-powered background loop, concept render). Real photos: `event-movie-night.jpg` (Events tab), `shop-floor.jpg` (Built section). Renders of trailers that are on sale should be swapped for real photos before launch.
- The Workstation page on spogtrailers.com uses an AI-generated header image. Don't reuse it as product imagery.
- The Workstation studio render used in Compare shows a door decal with an edition name the brand rules ban. Reshoot or retouch.
- Configurator prices: every price except "From $10,000" is a sample. Get real prices from Nate, or hide prices, before launch. Its paint colors are matched by eye and need checking against the real swatches. Its starting picks (10 kWh, 120 V, 30 amp) are assumptions.
- All `href="#"` links
- Product pages: every line marked NEW in `productPages.ts` needs approval, and so does the copy written into `src/components/product/` (section headings, the runtime footnote, button labels). Feature tiles marked PLACEHOLDER SOURCE (Workstation security cameras, Event 5G internet and 360 cameras) come from the old site and need confirming.
- Product page lengths: Cargo 12/16/20 ft and Event 24/31 ft stops are guesses between documented endpoints. Workstation stops come from the old configurator and Hybrid Fleet page.
- Product page photos: Cargo and Workstation statement photos are Red Rocks placeholders (the Cargo one may not show a Cargo). The Event dusk render shows a video game on the screen, so check rights or swap the screen image.
- The Garage render (`garage-ev-inside.jpg`) shows a Tesla Model S inside. Swap it for a neutral car before launch.
- Workstation page: every line marked NEW in `workstationPage.ts`. The remote office button opens the walkthrough form until its landing page exists.
- Workstation options to confirm: whether the premium interior is an option and what it includes, and how to present the generator hookup next to the approved line "No utility hookup, no generator noise."
- The Workstation dusk photo (`ws-dusk.jpg`, remote band) has a Tesla Cybertruck in the frame. Check that's fine before launch.
- Held out of `public/` until cleared: the Joby hangar shot (Joby's written permission) and a navy Workstation with a customer's BSW branding (the customer's permission). The Event render with a basketball broadcast on its screen is held for rights. All three are in `_photos-original/2026-11-17/`.
- Homepage (`home2.ts`):
  - Every line marked NEW needs approval.
  - The three customer quotes in the proof strip. The slots show as empty dashed boxes until real quotes are signed off.
  - "Up to 40 kWh" on the Cargo panel, to confirm with Joe. The Product Wiki lists Cargo at 5 to 20 kWh. (Event's figure was dropped.)
  - The Workstation panel line "The site office that works the day it lands." Nate wants a new one (it also runs on the old homepage in `content.ts`).
  - Solution cards: the Security photo is the mast in the shop, and a night shot of it at work would be stronger. The Power card's drone half shows an orange pickup and a Chevy in frame.
  - Statement: "0 gal fuel per day" over snow footage reads as a winter claim, so confirm it with Joe. A Rivian tows the trailer in the video.
  - The FAQ answers on the homepage are the old homepage's placeholders, still unapproved. The run-time answer points at `/demo` because the sheet was cut.
  - Our future lineup: the three one-liners and the renderings note. The Garage render shows a Tesla inside.
  - `/demo`: every line marked NEW in `demo.ts`, and both forms need endpoints (GoHighLevel, or a calendar booking).
  - "See the factory" and the footer's About, Reviews, Become a Dealer, Warranty and Blog links point nowhere until those pages exist. "See our future lineup" jumps to the row on this page until the Coming Next page exists.
  - The build request form and the walkthrough form have no endpoints yet. Wire them to GoHighLevel.
  - Which cameras ship at V1, for the Security card.
- Specs conflict between this site and spogtrailers.com (Cargo 8 to 35 ft, 5 to 64 kWh and up to 5,000W on the old site). The homepage numbers are used until the official spec sheet settles it.

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
