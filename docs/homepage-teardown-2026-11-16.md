# Homepage Competitive Teardown

Eight reference sites, captured November 16, 2026, and what SPOG should take from each.

## Bottom line

The SPOG homepage is 12,590px tall at 1440 wide and runs 16 content sections. That is longer than every reference here except Ford (12,802px), and Ford is selling an entire retail lineup with offers, inventory and dealer search. The three closest analogs (Living Vehicle 8,425px, Imperial 8,142px, Pebble 10,672px) all land between 8,000 and 11,000px with 9 to 12 content blocks.

The extra length comes from two places. Three separate proof sections (SocialProof, ReviewQuote, CustomerStory) are all built on placeholder content, and the product tour is split across Highlights and Explore, which describe the same five features twice. Meanwhile the actual product lineup ("Pick your SPOG.") sits at 4,487px, almost six screens down. Every strong reference shows the product, cleanly and by name, within the first two screens.

The fix is a reorder and a consolidation, with no redesign of the approved visual system. Move the lineup up to the third section, merge the duplicate sections, hold the placeholder proof until real proof exists, and copy Living Vehicle's pre-launch structure for the close. The proposed order is at the end of this document and keeps the photo, dark, light rhythm rule intact.

## Method and limits

Each homepage was loaded in Chrome at desktop width, scrolled end to end to trigger lazy loading, and outlined by script (every heading with its page position and the buttons around it), then screenshotted at the key scroll points.

The limits matter for how much weight each finding gets.

- Everything was captured at desktop width. Rivian loaded at a 1920px viewport, so its 18,238px page height is left out of length comparisons. The browser would not resize to 390px, so mobile layouts were not captured. Contractors will read this page on a phone in a truck, so the mobile pass is the biggest open gap.
- Imperial scroll-locks the page during its series showcase, and the browser stayed frozen on that frame. Everything below it on Imperial comes from the heading outline, with no visual capture.
- Space Force below roughly 4,000px is also known from headings only.
- "Why it works" is design inference from structure and patterns. None of these brands publish conversion data, so nothing here is a measured result.

## Fit ranking

Each reference is weighted by how close its sales situation is to SPOG's (a pre-launch, high-consideration, made-in-America trailer bought for work), regardless of how famous the brand is.

| Site | What it sells | Fit to SPOG | Use it for |
|---|---|---|---|
| Living Vehicle | Off-grid luxury trailers, next generation in pre-launch reservations | Highest | Page structure, reservation block, labeled product elevation |
| Pebble | All-electric travel trailer with a large battery and solar | High | Power story, use-case selector, dual nav CTA, FAQ, closing section |
| Imperial Outdoors | Off-road trailer lineup sold through dealers | High | Lineup presentation, made-in-USA framing, "which one is right for me" helper |
| Ford | Trucks and work vehicles | Medium | Buying-process block, mobile service framing, work-truck tone |
| Rivian | Premium EVs | Medium | Studio lineup with giant model name, one-line spec strip, tab pills |
| Tesla | EVs and energy | Medium | Brevity, stats as proof, persistent bottom action bar |
| Genesis | Luxury cars | Low | Restraint, lineup cards with "starting at" line |
| Space Force | Military recruiting | Aesthetic only | Bold type treatments and spec-sheet framing. Page structure does not apply. |

## Site by site

### Living Vehicle (8,425px)

The closest match in the set. They are selling reservations for a product that isn't shipping yet, which is SPOG's exact situation with the 2027 Launch Edition. They also use Montserrat.

Section flow, top to bottom.

1. Nav with LV LINE, Features, Inventory, Journal and About, then Contact, a phone number, and a red "Reserve your place" pill.
2. Hero with a full-bleed sunset photo of truck and trailer, eyebrow "Since 2017", H1 "Luxury, unplugged.", one line of heritage ("Eight years and four generations"), and two buttons, Reserve your place and Join LV Insiders.
3. Press logo strip directly under the hero (MotorTrend, Dwell, Forbes, TIME, Gear Patrol, Uncrate), auto-scrolling with a pause button.
4. "Introducing The LV LINE" with a clean studio side elevation of the trailer and thin callout labels pointing at each feature (solar roof and awnings, aerodynamic profile, metal frame and aluminum skin, four-season capable).
5. "From four generations to the next." A horizontal timeline of every generation with photos.
6. "On the road with owners." Owner photo carousel above Google review cards with names and stars.
7. Dark section with a photo of the bare welded frame, then "See it first. Order first." The Insiders form sits beside a checklist of benefits (first invitations to tours, order before the public launch, build updates), with email and SMS opt-ins. Under it is a numbered three-step strip (Engineered, Tours early 2027, Insiders order first).
8. Pre-owned inventory with financing, then Journal, Guides, and "Visit the showroom" with a location line ("Just off I-5").

What to take.
- Two levels of commitment at the close. "Reserve" for buyers who are ready and "Join Insiders" for everyone else, with the benefits of joining spelled out next to the form. This maps directly onto SPOG's Launch Offer (hard) and run-time sheet (soft).
- The labeled studio elevation. It shows every feature on one clean image with nothing competing. SPOG's current hotspots sit on a field photo, and CLAUDE.md already flags those labels as placeholders, so this is the moment to switch.
- The bare-frame photo as a build-quality proof point. SPOG's Middletown shop floor shot (on Robert's list) does the same job.
- A phone number in the nav. High-consideration buyers call.

What to skip. Inventory, journal and guides, until SPOG has that content.

### Pebble (10,672px)

An electric trailer whose whole pitch is the onboard power system. That is the closest product-story match to SPOG.

Section flow, top to bottom.

1. Orange announcement bar with the current offer and a link.
2. Nav with Pebble Flow, Experience and Community on the left, then Support, Login, and two buttons that each carry a tiny label above the action. "SEE IT IN PERSON / Book a Tour" is neutral and "SHIPPING NOW / Order" is orange.
3. Hero with a small line ("The all-electric Pebble Flow"), a giant two-word headline ("Expand your range"), and a rounded full-width video of a family using the trailer.
4. A centered value statement in two big lines covering setup time and power duration, with Explore and Build buttons.
5. "Intelligent technology. Adventure made easy." Three tall photo cards (towing, campsite automation, hitch autonomy).
6. "One space. Many lives." A use-case carousel covering spontaneous travel, off-grid, backyard studio, remote work and home backup power, each card ending in a "Choose X" button.
7. "Self-Powered." Split image and copy with hard numbers (45 kWh battery, up to 4 kW of solar, run the AC indefinitely).
8. "Real stories from further and wider." Owner quote cards with photos and first names.
9. "Step inside. Feel at home." A full-bleed interior with one button, "See Pebble Flow in-person".
10. FAQ accordion.
11. A closing section that repeats the hero headline and both buttons.

An AI assistant panel opens on its own, asks for contact details and zip code, and covered about a third of the screen in every capture.

What to take.
- The dual nav CTA with micro-labels. It tells the visitor which action fits their stage before they click. SPOG's nav has only Reserve.
- "Self-Powered" framed with three hard numbers. SPOG already has those numbers (40 kWh, 0 gallons of fuel a day, 3-year warranty) sitting in a separate KeyNumbers section.
- Validation for UseCaseTabs. Pebble's strongest section uses the same idea, one product shown across five different lives.
- FAQ right before the close, then a closing section that repeats the hero promise.

What to skip. The auto-opening assistant. If SPOG adds chat, keep it closed until clicked.

### Imperial Outdoors (8,142px)

A trailer lineup sold through dealers, with American manufacturing as a core claim.

Section flow, top to bottom.

1. Red announcement bar ("NEW 2027 Models Now Available").
2. Black nav with Xplore, Sport and Outback Series, Support and Learn, then "Find A Dealer" (outline) and "Request Quote" (solid).
3. Hero with a dusk photo, eyebrow "Premium Off-Grid All-Terrain RV Trailers", H1 "Take the Road Less Traveled", and a subhead naming the town it's built in (St. Croix Falls, Wisconsin).
4. Series showcase. Each trailer appears as a side-profile cutout on a white topo-line background, with the series name set huge behind it, a one-line description, and Request Quote and View Series buttons. The page locks scrolling and moves through the three series sideways.
5. "Not sure what camper is right for you?" with a link to compare models.
6. Suspension and construction feature carousel.
7. Dealer finder and manuals cards.
8. Three trust pillars (Made in the USA, All Season, Quality Construction).
9. Customer testimonials, then the about section.

What to take.
- The lineup treatment of a side profile with the name set huge behind it. Rivian uses the same pattern, which makes two independent confirmations. With exactly two products, it gives Cargo and Workstation each a full-width moment.
- The "which one is right for me" helper. SPOG buyers will ask whether they need Cargo or Workstation.
- Naming the factory town in the hero subhead. "Built in Middletown" carries the same weight.

What to skip. The scroll lock. It trapped the browser during capture, and it does the same thing to a visitor who wants to get past it.

### Ford (12,802px)

A retail giant, so most of the page doesn't apply. A few blocks map cleanly onto a work-equipment buyer.

Section flow, top to bottom.

1. Split hero with two trucks side by side (F-150 and Super Duty) and "Nothing Worth Doing Comes Easy" over a JD Power quality claim.
2. Featured offers in three cards, localized by zip code.
3. "Pick Up Where You Left Off," a recently viewed rail.
4. "Find Your Ford," a dark section with category tabs and an image carousel.
5. Feature banner, then a technology section with tabs.
6. "Get a Quote. Get Keys. Get Going." One large blue Build and Price card, with three tiles under it (Find a Dealer, Pre-Qualify, Search Inventory).
7. "The Ford Owner Experience," built around mobile service, pickup and delivery, and rewards.
8. Parts, news, vehicle spotlight, and a signup.

What to take.
- The buying-process block of one big primary card plus three secondary tiles. It turns "how do I buy this" into one glance. SPOG's Process section can borrow the hierarchy, with Reserve as the big card.
- Owner experience built around mobile service. SPOG's mobile service fleet is the same promise, and Ford proves contractors respond to it.
- The headline register. "Nothing Worth Doing Comes Easy" is the tone a contractor trusts.

What to skip. Offers, personalization, news and inventory.

### Rivian (captured at 1920 wide)

Section flow, top to bottom.

1. A floating pill-shaped nav bar with a yellow "Demo drive" button.
2. A five-slide hero carousel mixing an award, an event, an APR offer, a wish list and a dealer finder.
3. The lineup. Each vehicle is a studio side profile on light gray with its model name set enormous behind it ("R1S"), one sentence, and one small line of numbers ("From $83,990 · Est. lease $1,209/mo · EPA est. range 410 mi"), then Explore and Design yours.
4. "Electric vehicles designed for adventure," with tab pills (Technology, Performance, Design) that swap a row of photo cards.
5. Full-bleed landscape with an IIHS safety award badge.
6. A local showroom card next to a "Keep up with Rivian" form.
7. Charging, as three photo cards with one-line captions.
8. "Designed to get better with time," black background, full video about software updates.
9. "Keep exploring," four colored tiles (Shop, Get updates, Trade in, Service) over an email signup.
10. Mission statement with a video link.

The page background shifts color as you scroll, from light gray through sky blue to black.

What to take.
- One line of numbers under each product. A buyer comparing two trailers wants battery, solar, length and starting price in one glance.
- Tab pills to keep a section short. Three topics fit in one screen of height.
- Proof that names its source (IIHS, MotorTrend).

What to skip. The five-slide hero carousel. Slides two through five are rarely seen, and SPOG has one message to lead with.

### Tesla (4,122px)

The shortest page in the set. Every block ends in a transaction.

Section flow, top to bottom.

1. Full-bleed hero carousel with the model name, one offer line, and Order Now and Learn More.
2. Full Self-Driving block. A headline, two huge stats (7x fewer collisions, 17.6 billion miles), two buttons, and a vertical rail of short owner reaction videos on the right.
3. Model cards, two across, each with name, price line and two buttons.
4. Two half-width tiles (Current Offers, Shareholder Meeting).
5. A full-width Supercharger map dense with red dots.
6. Energy products carousel (Solar, Powerwall, Megapack).

A bar pinned to the bottom of the screen carries "Ask a question" and "Schedule a drive today" the whole way down.

What to take.
- The persistent bottom bar. On mobile, a pinned Reserve and Book a walkthrough bar keeps the action one tap away on a long page.
- Huge stats as proof. Two numbers carry the whole FSD argument.
- The map as proof of coverage. A map of the SPOG mobile service area across the Tri-State would answer "will they service me out here" before it's asked. This needs real service-area data first.

What to skip. Carousels as the main way to show products.

### Genesis (6,175px)

Section flow, top to bottom.

1. Five-slide full-bleed hero carousel led by a seasonal sales event.
2. "The Genesis Collection," a grid of studio cutouts with filter tabs (All, SUV, Sedan, Electric), each card showing the model, "Starting MSRP," and two text links (Explore, Build).
3. Full-bleed reveal of a flagship model.
4. Brand story, split headline and paragraph.
5. News carousel and a signup.

What to take. Restraint and white space, and lineup cards that state a starting price.

What to skip. Events and news.

### Space Force (8,057px)

A recruiting site, so use it for type treatment and visual framing only.

What stands out.
- A giant wide uppercase headline where the first half is solid and the second half is outline type ("SPACE IS CLOSER / THAN YOU THINK").
- Headlines that type themselves out as you scroll.
- Cards with clipped corners, monospace micro-labels and arrow links, styled like a heads-up display.
- An intent survey in the corner ("What brought you here today?") with four options that route the visitor.

What to take.
- The spec-sheet framing (clipped corners, monospace labels) for the power and spec sections. It reads as engineered equipment, which suits a trailer built around a power plant.
- The intent question, built into the page. UseCaseTabs already asks "which of these is you," and it can route each tab to the right trailer.

What to skip. Page structure and heavy scroll animation.

## Patterns across the set

**1. The product appears early, by name, on a clean background.** Rivian, Imperial, Living Vehicle and Genesis all show a studio cutout of the product within the first two screens, and Tesla and Ford lead with the vehicle in the hero. SPOG shows the trailer in the hero photo, then makes the visitor scroll almost six screens to see the two products side by side.

**2. Two CTAs, one hard and one soft, everywhere.** Pebble pairs Book a Tour with Order, Imperial pairs Find A Dealer with Request Quote, Living Vehicle pairs Reserve with Join Insiders, Tesla pairs Order with Schedule a Drive, and Rivian pairs Design Yours with Book a Drive. Visitors who aren't ready to commit still get a next step. SPOG's soft step already exists as the walkthrough (Process step 01 and the "Walkthrough first" guarantee) but doesn't appear in the nav.

**3. One line of numbers per product.** Rivian, Genesis and Living Vehicle each give the product a single strip of facts (price, range, size). Buyers compare on those numbers, so they go right under the product name.

**4. Proof names its source.** IIHS, MotorTrend, JD Power, Google reviews, named press logos, odometer counts. A bare "4.9 rating" with no source reads weaker than no rating at all, and SPOG's version is invented placeholder content.

**5. Pre-launch brands sell access.** Living Vehicle's whole close is "See it first. Order first." The scarcity is real and specific (tours in early 2027, insiders order before public launch). SPOG's "Five slots. Claim one." is the same mechanism and should carry the same specifics.

**6. The close repeats the open.** Pebble ends with its hero headline and both buttons again. The visitor who scrolled the whole page gets the original promise and the action, with nothing new to process.

**7. Length discipline.** The closest analogs run 8,000 to 11,000px. Past that, the bottom of the page, where SPOG's reservation offer lives, gets seen by fewer people.

**Anti-patterns seen in the set.** Hero carousels (Rivian, Tesla, Genesis) work for brands with many products and paid traffic aimed at specific slides, and SPOG has neither. Scroll-jacking (Imperial) trapped the browser. The auto-opening assistant (Pebble) covered the content. Cookie banners pinned across the bottom (Ford, Genesis, Space Force) hid the lower third of every screen.

## Where SPOG stands today

| # | Section | Type | Top (px) | Verdict |
|---|---|---|---|---|
| 1 | Hero, "Built for the work day." | Photo | 0 | Keep. Add the walkthrough as a second CTA and "Built in Middletown" to the subhead. |
| 2 | SocialProof | Dark | ~800 | Hold until real ratings and logos exist. |
| 3 | Problem, "Every site needs power." | Light | 1,081 | Keep. |
| 4 | Statement | Photo | ~2,000 | Merge with KeyNumbers into one "self-powered" section. |
| 5 | ReviewQuote | Dark | ~2,900 | Hold. Placeholder testimonial. |
| 6 | UseCaseTabs, "One trailer. Many jobs." | Light | 3,385 | Keep. Pebble's strongest section uses the same idea. |
| 7 | Compare, "Pick your SPOG." | Dark | 4,487 | Move up to third. Add the giant name and one spec line per product. |
| 8 | CustomerStory | Photo | ~5,500 | Hold. Placeholder story and video. |
| 9 | Highlights, "Power on board." | Light | 6,622 | Fold into Explore. Same five features. |
| 10 | Explore, "Every part earns its keep." | Photo | 7,712 | Keep. Plan the move to a labeled studio elevation once hotspot labels are confirmed. |
| 11 | KeyNumbers | Dark | ~8,500 | Merge into the self-powered section. |
| 12 | Guarantee, "Backed in writing." | Light | 8,969 | Keep. |
| 13 | Built, "Built by our own crew." | Photo | 9,742 | Keep. |
| 14 | Process, "From walkthrough to working trailer." | Dark | 10,464 | Keep. Borrow Ford's big-card hierarchy with Reserve as the main card. |
| 15 | LeadMagnet, "Get the run-time sheet." | Light | 11,186 | Merge with LaunchCta. |
| 16 | LaunchCta, "Five slots. Claim one." | Dark | 11,882 | Merge with LeadMagnet into one Living Vehicle-style close. |

Positions marked with a tilde are estimates between measured headings.

## Proposed section order

Eleven content sections, down from sixteen. The first estimate was 8,500 to 9,500px. The built version measures 10,580px at 1440 wide, inside Pebble's range, with most of the remaining height in the lineup rows and the full-screen self-powered section.

| # | Section | Type | Source of the idea |
|---|---|---|---|
| 1 | Hero. Keep the headline. Buttons become Reserve yours and Book a walkthrough. Subhead names Middletown. | Photo | Imperial (factory town), Pebble and Living Vehicle (dual CTA) |
| 2 | Problem. Every site needs power, and today you pay for it four ways. | Light | Kept as is. A new category needs the problem named before the product. |
| 3 | Pick your SPOG. Cargo and Workstation as studio side profiles with the name set huge behind each, one line of numbers, and a "which one fits my crew" link. | Dark | Rivian, Imperial, Genesis |
| 4 | Self-powered. The Statement photo with the three key numbers set large on it. | Photo | Pebble ("Self-Powered"), Tesla (FSD stats) |
| 5 | Use cases. The five tabs, each ending in the trailer that fits. | Light | Pebble ("One space. Many lives."), Ford (tabs), Space Force (intent routing) |
| 6 | Explore. Hotspots, absorbing the Highlights cards. | Photo | Living Vehicle (labeled elevation, as the next step) |
| 7 | Process. From walkthrough to working trailer, with Reserve as the dominant card. | Dark | Ford ("Get a Quote. Get Keys. Get Going.") |
| 8 | Guarantee. Backed in writing. | Light | Imperial (trust pillars), Ford (mobile service) |
| 9 | Built in Middletown. | Photo | Living Vehicle (bare frame), Imperial (made in USA) |
| 10 | FAQ. Run time, towing, service area, financing, delivery. | Light | Pebble, Imperial |
| 11 | Launch close. "Five slots. Claim one." with the reservation as the main action, the run-time sheet form as the soft option, and the benefits listed beside the form. Repeats the hero promise. | Dark | Living Vehicle ("See it first. Order first."), Pebble (closing repeat) |
| | Footer | | |

Rhythm check against the rule in `index.astro`. Photo, light, dark, photo, light, photo, dark, light, photo, light, dark. No two photo sections touch, and no two sections of the same type sit next to each other.

When real proof arrives, add back a single proof section. The strongest slot is between the lineup (3) and self-powered (4), or between Built (9) and FAQ (10). It should be one named customer on their own site with a sourced number, like Tesla's owner videos or Living Vehicle's Google reviews.

## Additions outside the section order

- **Nav.** Add "Book a walkthrough" beside "Reserve." Pebble's micro-labels above each button ("SEE IT RUN" and "2027 LAUNCH EDITION") tell the visitor which button fits them.
- **Announcement bar.** One line for the 2027 Launch Offer above the nav, as Pebble and Imperial do. Use a black bar with gold text, since gold is an accent and never a background.
- **Mobile bottom bar.** Reserve and Book a walkthrough pinned to the bottom on phones, as Tesla does on desktop.
- **Service-area map.** A Tri-State map of the mobile service fleet's coverage, in the spirit of Tesla's Supercharger map, once real coverage data exists.

## Not copying

- Hero carousels.
- Scroll locking or horizontal scroll-jacking.
- Chat or survey panels that open on their own.
- Any proof without a source, including SPOG's current placeholder rating and logos.
- News, journal, inventory and offers rails until SPOG has that content.

## Decisions still open

- Whether to publish a "starting at" price per trailer. Rivian, Genesis and Living Vehicle all do, and it filters out tire-kickers before the walkthrough.
- Whether a phone number goes in the nav.
- When real proof lands (ratings, logos, testimonials, the customer video), which decides whether the proof section comes back at launch.
- The mobile capture, which still has to happen before the build.

## Update after review (November 16, 2026)

Two decisions changed the build after this document was written.

- **No launch offer on the public site.** The 2027 Launch Offer goes to close contacts and partners only. The Living Vehicle-style scarcity close ("Five slots. Claim one.") was replaced with a closing section that repeats the hero promise ("Built for the work day.") and talks about the 2027 lineup with no special-offer framing.
- **Six trailers, two tiers.** Cargo, Workstation and Event are on sale now. Garage, Disaster Relief and Camper are coming next. Following Tesla's model, the lineup section gives the three current trailers full rows with Reserve buttons and puts the three future trailers in a quieter "Coming next" block with an interest signup. The platform message (one power system for many jobs) moved into the use-case section heading so the homepage isn't positioned as construction only.

With the Event row and the Coming next block added, the built page measures 11,740px at 1440 wide.
