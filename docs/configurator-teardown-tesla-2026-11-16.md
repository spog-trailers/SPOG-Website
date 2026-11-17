# Tesla Configurator Teardown

The Model 3 design page at tesla.com/model3/design, walked from first load to the order button on November 16, 2026, and what a SPOG version would take.

Screen recording, 36 frames, in `docs/research-media/tesla-model3-configurator-walkthrough.gif`.

## Bottom line

SPOG can build this. The deciding input is whether SPOG has clean 3D or CAD files for each trailer. The Cargo renders on the current site (`cargo-render-front.jpg`, `cargo-render-three-quarter.jpg`) look like they came from a 3D model, so one likely exists for Cargo. Nothing in the project shows a model for Workstation or Event. Confirming those files, and what format they're in, comes before any design or development work.

Tesla's configurator feels interactive because the image answers every click instantly, the camera moves to whatever you're editing, and the price is always on screen. None of that requires real-time 3D. The car never rotates freely. It swaps between six fixed camera angles. SPOG can reach the same experience with fixed-view renders, then add a rotatable 3D and AR view as a second phase if the 3D files are good enough.

The strongest idea for SPOG is one Tesla only hints at. Tesla shows range dropping when you pick bigger wheels. SPOG can show run time changing live as the buyer picks battery size and the tools they run. That turns the configurator into an answer to the question every buyer has ("will it run my stuff all day"), and it depends on the tool-load table that's already on the to-do list.

## Method and limits

The page was loaded in Chrome at desktop width and walked in order. I chose a trim, opened a feature callout, changed paint, wheels and interior, added a charging accessory, and scrolled to the order summary. I stopped at the order buttons. Nothing was ordered and no personal or payment details were entered.

- The mobile configurator was not captured.
- Lease, Finance, Compare Models, trade-in and prequalification were visible but not explored.
- Everything after the order buttons (account, payment, delivery scheduling) was deliberately not reached.

## Page anatomy

| Zone | What it holds | Behavior |
|---|---|---|
| Announcement bar | One financing offer line with a link | Static |
| Visual stage, left, about 70% of width | The car on white, with "+" callouts pinned to it | Stays fixed while the right side scrolls |
| Gallery controls | Arrows and six dots (front three-quarter, side, rear three-quarter, wheel close-up, two interior views) | Manual, and also driven by scroll position |
| Options rail, right, about 360px | Every choice, top to bottom | Scrolls independently |
| Sticky bottom bar | Model name, one line summarizing the build, live price, "Order Now" | Always visible until the final summary scrolls into view |
| Chat button | Bottom left | Opens a sales chat |

## The flow, top to bottom

1. **Model name and delivery ZIP.** ZIP is prefilled from the visitor's location and drives delivery dates and pricing.
2. **Payment tabs.** Cash, Lease and Finance. Switching rewrites every price on the page into that format (total vs per month).
3. **Three headline stats.** Range, top speed, 0 to 60. They update with every choice.
4. **Trim cards.** Three cards (standard, Premium, Performance), each with drivetrain and price. Choosing Premium opened a second choice inside the card (rear-wheel or all-wheel drive), changed the stats, renamed the image callouts to the Premium features, and swapped the wheels.
5. **Compare Models and trade-in.** Links out for buyers who need more.
6. **Full Self-Driving upsell.** Placed right after trim, before any cosmetic choice, as a monthly subscription with a free first month.
7. **Exterior.** Six paint swatches and two wheel swatches. The chosen name and its price sit above the swatches. The larger wheel shows its trade-off inline, with estimated range dropping from 363 to 343 miles.
8. **Interior.** Two swatches. Scrolling to this section switched the main image to the interior view without a click.
9. **Charging.** One included item marked with a check, and add-ons as checkbox cards with prices. Scrolling here replaced the car with charging product photos, a short bullet list, and tabs for each item.
10. **Accessories.** Five checkbox cards with prices.
11. **Summary.** Estimated delivery window, every line item with its price, destination fee, order fee, and estimated purchase price.
12. **Due today.** A small number (the non-refundable order fee plus any accessories) set apart from the full price, then the legal agreement line and two order buttons (Google Pay and card).

## What makes it work

**The image answers every click.** Paint, wheels and interior swapped instantly with no loading state in the capture. The buyer sees the result before they've finished deciding.

**The camera follows the buyer.** The stage shows the exterior while you pick paint, moves inside when you reach interior, and switches to product photos for charging. Nobody has to hunt for the right view.

**The feature story lives inside the configurator.** The "+" callouts open a full-bleed feature panel with a few bullets and tabs, right over the image. Buyers learn what Premium adds without leaving the page, which keeps them in the buying flow.

**The price is never hidden.** The bottom bar carries a one-line build summary and a live price the whole way down. Every option shows its price next to its name.

**Trade-offs are shown, not buried.** The wheel choice states its range cost in the same line as its price. Buyers trust a tool that tells them what they give up.

**The commitment shrinks at the end.** After a full build summary, the number in bold is "Due today," a few hundred dollars instead of the full price. The big decision feels small at the moment of action.

**The upsell comes early.** Full Self-Driving sits right after trim, while the buyer is still thinking about capability, before they reach cosmetic choices.

## How the images are produced

The car images load from an image service at `static-assets.tesla.com/configurator/compositor`. Each request carries the model, a list of option codes (one each for trim, paint, wheels and interior in the captured state), a named camera view (`STUD_FRONT34`, `STUD_SIDEVIEW`, `STUD_REAR34`, `STUD_RIMCLOSEUP` and interior views), an output size and a crop. The service returns a finished image of that exact combination from that angle, and the page draws it inside an SVG.

What I observed is the interface. Whether the service stacks transparent layers or stores one image per combination behind the scenes wasn't visible from the browser. Either way the pattern is the same, with fixed camera angles, an option code for every visible choice, and an image per combination per angle.

## Can SPOG do this

Yes. Two ways to build it, and a recommendation.

### Option A, fixed-view layered renders (Tesla's experience)

Render each trailer from three or four fixed angles in a 3D tool. Render every visible option as its own transparent layer from those same angles (light mast, solar wing open, side wall open, gear rail, Starlink dish, exterior color or wrap). In the browser, stack the layers for the current build. No image server is needed at SPOG's scale.

- Looks like a photo, loads fast, and works well on phones.
- The render count follows a formula. It's views multiplied by base body variants (each length is a different body, and solar panel count likely changes with length), plus one layer per visible option per view per body. Battery size, heat and AC, and anything inside a closed trailer add no exterior renders.
- Length is the expensive variable, so offering three or four standard lengths in the configurator instead of every foot keeps the count manageable.

### Option B, real-time 3D and AR

Convert the CAD to a lightweight web 3D file (glTF) and show it in a 3D viewer. Buyers can spin the trailer, open the side wall, unfold the solar wing, and on most phones place it in their own driveway in AR.

- This goes further than Tesla, and it's the closest match to "highly interactive."
- Quality depends heavily on the source files. CAD built for manufacturing usually needs cleanup, simplification and real materials before it looks good on the web.
- Heavier on older phones, and more work to get looking as good as a render.

### Recommendation

Build Option A first and add one Option B view later. The fixed-view configurator carries the buying decision, and a single "see it in 3D" or "see it in your driveway" button can sit on the stage once the 3D files are cleaned up. That order puts the sales tool live sooner and keeps the 3D work from blocking it.

## What a SPOG version contains

An example option list, drawn from the specs currently on the homepage. Workstation lengths are still a placeholder and Event has no specs yet, so this is a shape, not a final list.

| Step | Choices | Visible on the render |
|---|---|---|
| Trailer | Cargo, Workstation, Event | Yes, different body |
| Length | Standard lengths per trailer | Yes, different body |
| Battery | 5 to 20 kWh (Cargo), 5 to 40 kWh (Workstation) | No. Drives the run-time meter. |
| Solar | Up to the max per trailer | Yes, panel count and wing |
| Heat and AC | Cargo option, Workstation standard | Small exterior unit |
| Inside | Desk, racking, storage, display | Interior view only |
| Connectivity | Starlink option | Yes, roof dish |
| Exterior | Light mast, gear rail, spare | Yes, one layer each |
| Your tools | Pick from the tool-load table | No. Drives the run-time meter. |

Patterns to carry over from Tesla.
- Fixed stage on the left, options rail on the right, stacked on phones.
- The camera moves to the section being edited (exterior for solar and mast, interior for desk and racking).
- The "+" callouts already used in the homepage Explore section, reused on the configurator stage.
- A sticky bar with the build summary and the main action.
- Inline trade-offs, with the run-time meter in place of Tesla's range line.
- A build summary at the end, listing every choice.

Where SPOG should depart from Tesla.
- **End with a quote request unless pricing is decided.** Whether to show prices is still an open decision. Until it's made, the last step is "Send me this build," which captures name, company, contact and the full spec. That's also the strongest lead SPOG can get, because the buyer has already told you exactly what they want.
- **No "Due today" step and no offer framing.** The 2027 Launch Offer stays private, so the configurator carries no deposit perks, slots or scarcity.
- **Add "Book a walkthrough" beside the main action.** A trailer buyer still wants to see it run first.

## What has to be decided or supplied first

1. **3D source files** for Cargo, Workstation and Event, and their format. This decides cost and whether Option B is realistic.
2. **The option list with rules.** Which options apply to which trailer, which lengths are standard, and which combinations aren't allowed.
3. **Pricing decision.** Show prices, show "starting at," or quote only.
4. **The tool-load table** for the run-time meter.
5. **Where the build goes.** Sending each configured build into GoHighLevel as a lead with the full spec attached needs to be checked against the GoHighLevel SOP before it's designed.

## Cost drivers

There's no honest timeline without a quote from a 3D artist, so these are the variables that set the cost.

- Number of camera views (three or four is enough).
- Number of body variants (trailers multiplied by standard lengths).
- Number of visible options that need their own layer.
- How much cleanup the CAD needs before it renders well.
- Whether Option B (3D and AR) is in scope now or later.

The cheapest way to test the idea is a two-view prototype for Cargo, built on the existing renders, with paint or wrap left out and the run-time meter running on placeholder numbers. It would show the interaction and the layout before anyone pays for a full render set.
