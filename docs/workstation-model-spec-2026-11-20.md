# Workstation in the 3D model: build spec (2026-11-20)

Scope: add the Workstation to the procedural three.js model in `src/scripts/configurator/` so the tour on /workstation-2 can show a real Workstation instead of the Cargo stand-in. Event is not part of this job. No builder page for the Workstation in this job, and no prices go into the model.

Sources, in order of authority:
1. The price sheet (2026-11-20) for what is standard and what is offered.
2. Nate's drone photos of the white 20 ft Workstation, `_photos-original/2026-11-17/Website Photos/A013C0279_261120_9YYU13.jpg` to `A013C0321...` (called ws-279 to ws-321 below; working copies in `scratchpad/ws3d/mid/`), for shape and placement.
3. The reference photos in `scratchpad/ws3d/ref/`: ref1 Workstation Interior (blue unit, early build), ref2 premium interior (wood), ref3 heat pump compartment, ref4 interior or case study (white composite, Joby build), ref5 to ref7 the blue unit, ref8 security lights close-up, ref9 the optional generator hookup.

Where the sheet and the photos disagree on shape, the model follows the photos and the conflict goes in "Open questions for Nate". Where they disagree on what a package includes (the tower's camera count), the model follows the sheet.

Units are feet. Axes as today: +x is the front (nose and tongue), +y is up, +z is the curb side. On the Workstation, `r` below means feet forward from the rear outer corner along the flat side wall (r = 0 at the rear face, r = 20 where the flat wall meets the nose), so world x = xr + r.

Code comment tags for new lines: `SOURCE (price sheet 2026-11-20)` for sheet facts, `NATE (2026-11-20 answers)` for Nate's calls, `NEW 2026-11-20` for modeling choices, and "measured off the Workstation photos (ws-NNN)" for photo numbers. Comments follow the voice rules: no em or en dashes, "climate control" in prose (the `hvac` key keeps its name), never the edition name from the rear decal.

---

## 1. Contract

### 1.1 TrailerConfig (trailer.ts)

Add two fields:

```ts
/** Which trailer. 'cargo' builds exactly what it builds today. */
kind: 'cargo' | 'workstation';
/** Interior finish. 'wood' (premium wood) exists only on the 20 ft Workstation; anything else draws 'composite'. */
interior: 'composite' | 'wood';
```

- `length` stays the size as sold (10 or 20). Geometry comes from a profile (1.2), not from `length` directly.
- Routing, stated once in `buildTrailer`:
  - `kind === 'cargo'`: today's code path, unchanged.
  - `kind === 'workstation' && length >= 16`: the Workstation 20 body (sections 2 to 6).
  - `kind === 'workstation' && length < 16`: the Cargo 10 body (section 7) with `hvac` forced true and `interior` forced to 'composite'.
  - `interior` is forced to 'composite' unless the body is the Workstation 20. Enforce this in `buildTrailer` as well as in `data.ts`, so a bad URL hash can't draw a wood 10 ft.
- `kind` and `interior` are NOT added to `SOFT_KEYS` in `controller.ts`. Changing either rebuilds the geometry. That's intended.
- White is a data default, not trailer code: `paint` is a hex in `TrailerConfig`, so the Workstation defaults to `PAINTS` 'white' in `data.ts` and in `embed.ts`.

### 1.2 Body profile (dims.ts)

Add one function that every geometry consumer reads, so no Workstation literals spread through `buildTrailer`, `scene.ts` or `interiorView`:

```ts
export type Kind = 'cargo' | 'workstation';
export interface Profile {
  kind: Kind; length: number;
  S: number;          // flat side length
  nose: number;       // how far the nose reaches past the flat side
  noseFace: number;   // width of the flat front face; 0 = pointed V (Cargo)
  overall: number;    // S + nose, the body's length, rear face to front face
  W: number; H: number;
  floor: number;      // bottom of the body off the ground (today's FLOOR)
  roof: number;       // floor + H
  floorTop: number;   // top of the interior floor
  ceiling: number;    // underside of the ceiling
  wall: number;       // wall thickness
  tireR: number; archTop: number;
  gear: { door: number; spread: number; fender: number; flange: number; center: number };
  hitch: number;      // coupler tip ahead of the front face
  panels: { count: number; along: number; across: number; pitch: number; rearStart: number; rails: boolean }; // rearStart: rear edge of the last panel, feet forward of the rear face
}
export function profileFor(kind: Kind, length: number): Profile
```

Cargo branch, which must return exactly today's numbers (verify with the regression shots in section 10):
`S = length - NOSE`, `nose = NOSE (2)`, `noseFace = 0`, `overall = length`, `W = widthFor`, `H = heightFor`, `floor = FLOOR (1.25)`, `roof = roofFor`, `floorTop = FLOOR + 0.14`, `ceiling = roof - 0.11`, `wall = WALL (0.12)`, `tireR = 1.1`, `archTop = 2.3`, `gear = gearFor(length)`, `hitch = 3.3`, `panels = { count: maxPanels, along: PANEL_ALONG, across: panelAcross(length), pitch: PANEL_PITCH, rearStart: 0.12, rails: true }` (today's `xr + 0.12`).

Workstation 20 branch (photo numbers, see section 2 for where each comes from):

| Field | Value | Note |
|---|---|---|
| S | 20.0 | flat side; the nose is extra (ws-321, ws-282) |
| nose | 2.85 | truncated V |
| noseFace | 2.05 | flat front face, centered |
| overall | 22.85 | |
| W | 8.0 | SOURCE price sheet |
| floor | 1.75 | box bottom off the ground; notes gave 1.65, 1.75, 1.9 (plus or minus 0.2) |
| H | 8.05 | box height, rail bottom to roof cap top; sheet says 8 ft tall, photos say box 8.0 to 8.25 |
| roof | 9.8 | roof cap off the ground (notes: 9.7, 9.9, 10.0) |
| floorTop | 2.05 | door sill and third step rise at about 24.5 in |
| ceiling | 9.35 | insulated roof; interior about 7.3 ft, door-scaled from ref2 |
| wall | 0.2 | insulated walls (SOURCE: fully insulated) |
| tireR | 1.25 | 30 in tires (ws-282, ws-283, ws-296) |
| archTop | 2.9 | fender top 2.85 to 3.0 off the ground |
| gear.door | 3.15 | door leaf width (36 in door plus jamb, 37.6 to 37.8 in measured) |
| gear.spread | 1.35 | axle spacing 2.7 ft (33 in) |
| gear.fender | 5.6 | one-piece fender r 7.0 to 12.6 |
| gear.flange | 0.15 | |
| gear.center | 10.1 | front of the flat side back to the axle center (axle center at r 9.9) |
| hitch | 3.4 | coupler tip ahead of the front face |
| panels | count 5, along 3.76, across 6.8, pitch 3.82, rearStart 0.61, rails false | section 2.8; one code path lays out both arrays from `xr + rearStart` |

Workstation 10 returns the Cargo 10 profile with `kind: 'workstation'`.

Keep every existing export (`FLOOR`, `NOSE`, `W`, `H`, `ROOF`, `widthFor`, `heightFor`, `roofFor`, `sideLength`, `maxPanels`, `gearFor`, `axleCenter`) working as today. Only `scene.ts` and `trailer.ts` import dims, but keep them for safety.

### 1.3 World placement

The body (not the tongue) stays centered on the origin: `xr = -overall/2`, `xf = xr + S` (nose break), `tip = overall/2` (the front face plane, or the point of the V on the Cargo). For Cargo this is today's `xr = -L/2`, `xf = L/2 - NOSE`, `tip = L/2`. Workstation 20: xr = -11.425, xf = 8.575, tip = 11.425, coupler at 14.825.

### 1.4 TrailerParts and poseDoors

- Replace `sideDoor: Object3D` with `sideDoors: Object3D[]` (Cargo: one; Workstation 20: front then rear). Nothing outside trailer.ts reads `sideDoor`.
- `barn` is `[]` on the Workstation 20. `ramp` stays null. `rampAngle` is 0 there.
- Add `hatches: Object3D[]`: the rear climate control hatch on the Workstation 20 (top-hinged, ref3), `[]` on the Cargo.
- `poseDoors`: every side door gets `rotation.y = e * 1.7` (both Workstation doors hinge on their nose-side edge like the Cargo's, so the same sign works; the free end lands about 3.1 ft out and 0.4 ft forward, clear of the wall and the grab rail). Each hatch gets `rotation.z = -e * 1.25` so its bottom swings out toward -x (verify the sign on screen).
- `anchors` keep the same keys (`solar`, `door`, `power`, `wheels`), so the callout markup in `configure/cargo.astro` would work unchanged for a future Workstation builder. Workstation 20 values: `door` at the front curb door's center (r 17.7, floorTop, W/2); `power` on the nose roof (xf + 1.55, roof, 1.2); `solar` (xr + S * 0.42, roof + 0.2, 0.6); `wheels` (front axle, 0.6, wheel z + 0.3).
- `tall` and `top` use the same rule as today with the profile's roof.

### 1.5 interiorView

Change the signature to `interiorView(p: Profile)` (or `(length, kind)`). Cargo returns today's eye and look. Workstation 20 (section 5.9).

### 1.6 data.ts

- `BuildState` gains `kind?: 'cargo' | 'workstation'` and `interior?: 'composite' | 'wood'`. Missing means 'cargo' and 'composite', so old Cargo URL hashes still parse. The sanitizer resets anything else to those defaults.
- `toTrailerConfig` passes `kind` (default 'cargo'), `interior` (forced 'composite' unless kind is 'workstation' and length is 20), and `hvac: kind === 'workstation' ? true : has(s, 'hvac')` (SOURCE: heating and cooling is included on every Workstation).
- `etrackWalls` and `etrackFloor` are Cargo work options and are not drawn on the Workstation 20.
- `tower` keeps `&& s.length === 20`.
- No Workstation sizes or prices are added in this job (no builder yet). When a builder comes, its numbers are the sheet's, not new ones.

---

## 2. Workstation 20 exterior, compared with the 20 ft Cargo

### 2.1 Body and nose

| | Cargo 20 (today) | Workstation 20 |
|---|---|---|
| Length | 20 incl. a 2 ft pointed V | 20 ft flat side plus a 2.85 ft truncated V, 22.85 overall |
| Width | 8 | 8 |
| Body bottom / roof off the ground | 1.25 / 8.17 | 1.75 / 9.8 |
| Nose | two panels meeting at a point | three flat facets: a 2.05 ft front face and two chamfers about 46 deg off the long axis, each about 4.12 ft long |
| Lower nose | 1.5 ft tread-plate stone guard | 4.0 ft gloss black diamond-plate stone guard on all three faces |
| Paint default | black | white |

Nose geometry: the facets run from the body corners (xf, +/-4.0) to the front face corners (tip, +/-1.025). The front face is a flat panel at x = tip from z -1.025 to 1.025. The floor footprint, roof slab and ceiling shapes trace (xr,-W/2) to (xf,-W/2) to (tip,-1.025) to (tip,1.025) to (xf,W/2) to (xr,W/2).

On every nose face:
- Paint above, gloss black diamond plate from `floor` to `floor + 4.0` (new `guard` material: the tread-plate bump of `trim` with lower roughness, about 0.3, so it reads glossy as in ws-289 and ref9). Do not edit `trim` itself, the Cargo uses it.
- The guard wraps 0.25 ft past the nose break onto each side wall, from `floor` to `floor + 3.65`.
- Black diamond-plate roof cap, 0.31 tall, as on the Cargo.
- Vertical black trim at all four nose corners (the two body corners and the two front face corners).

On each chamfer facet (ws-289, nosepair.jpg):
- A vertical SPOG mark near its body-corner end, centered at `roof - 1.1`, as the Cargo's.
- Two amber clearance lights under the cap, at 20% and 75% of the facet from the body corner, at `roof - 0.42`.
- One small amber marker low on the guard, mid-facet, at `floor + 0.35`.
- Two small black covers, 0.22 wide by 0.42 tall by 0.06 deep, at 26% and 61% of the facet from the body corner, from `floor + 1.2` to `floor + 1.62`. Four in all. The sheet lists 4 outdoor outlets on the 20 ft and none show anywhere else, so these are most likely the outlets (open question).
- Not drawn: the Cargo's three hooded outlets, its aluminum box and black round fitting, and the gray generator inlet on the street facet (ref9; the generator hookup isn't on the Workstation price sheet).

The front face: guard on its lower 4 ft, paint above. The mast pedestal box sits at its base only when the tower is picked (2.9).

### 2.2 Sides: trim, seams, markers

- Top cap: black diamond plate, 0.31 tall, the full flat side.
- Bottom rail: black diamond plate, 0.26 tall, broken at the fender as on the Cargo.
- Rear corner posts: black diamond plate, 0.24 wide on each face, rising 0.2 above the roof cap as corner caps.
- Skin: smooth paint, no rivet lines. Keep the rivet row along the top and bottom rails.
- Seams: thin vertical lines every 3.75 ft from the rear, at r 3.88, 7.63, 11.38, 15.13 and 18.88, on both sides. A seam is split around any door frame, window frame, logo, hatch or vent it would cross, and over the fender it starts above the arch, as today.
- No tread plate behind the fender ends (the Cargo has it, the Workstation photos don't).
- Marker lights, small ovals about 0.25 by 0.125:
  - Top row, amber, both sides, at r 0.35, 4.75, 14.0 and 19.6, at `roof - 0.5`.
  - Low row, curb: red at r 0.43 and 4.81 (`floor + 0.4`), red over the fender at r 9.7 (`floor + 1.37`), amber at r 14.1 and 19.85 (`floor + 0.41`).
  - Low row, street: red at r 0.53 and 5.14 (`floor + 0.37`), red over the fender at r 9.86 (`floor + 1.37`), amber at r 14.16 (`floor + 0.41`).

### 2.3 Curb side (+z): two entry doors, steps and a grab rail

Photos (ws-282, ws-283, ws-280) and the blue unit (ref5 to ref7) both show two curb-side entry doors of the same size, one at each end. The street side has none. The model draws both (open question 1).

Both doors are identical:
- Leaf 3.15 wide by 6.6 tall, bottom at `floor + 0.30` (= floorTop, so the sill is flush with the floor), in paint (the white unit's leaves are a shade grayer than the skin; paint is close enough and follows a color change).
- Black diamond-plate trim around the opening, 0.19 wide on the sides and 0.25 on top, sitting on the bottom rail.
- Window in the leaf: 1.92 wide by 3.06 tall, centered across the leaf, its top 0.47 below the leaf top. White trim ring 0.1 wide (`board`), clear glass. Inside, a black-rimmed daylight pane as on the Cargo's door.
- Single black round knob on the rear-side stile, 0.31 in from the rear edge, at `floor + 3.66`. No lever.
- Three black butt hinges on the nose-side edge, at `floor + 1.1`, `3.7` and `6.6`.
- Hinged on the nose-side edge, opening outward (1.4).

Positions:
- Rear door: leaf r 0.77 to 3.92 (trim r 0.57 to 4.10).
- Front door: leaf r 16.10 to 19.25 (trim r 15.88 to 19.44), ending about 0.55 before the nose break.

The curb wall gets two openings, so it can't use the one-door code. Build the Workstation's side walls with a new `wallWithOpenings(x0, x1, sz, holes)`:
- One `THREE.Shape` for the whole wall: the outline from `floor` to `roof` with the arch notch, and a rectangular hole per door.
- Extruded in two skins (paint out, liner in), the way the over-arch piece is built today. UVs stay in feet.
- Leave the Cargo's `sideWall` path untouched.
- Windows are not holes. Draw them over the wall as the Cargo does.

Fold-down steps, under both doors (ws-280, ws-282, ref7):
- Centered under each leaf, at r 2.35 and r 17.68.
- Black side stringers, two ribbed aluminum treads 2.0 wide by 0.67 deep, at 0.67 and 1.33 off the ground.
- The upper tread's inner edge sits about 0.2 out from the wall, the lower tread about 0.9 out.
- Two chrome telescoping legs from the lower tread's outer corners, splayed out to the ground about 2.3 from the wall.
- A black bracket under the sill holds each step.
- Always drawn deployed. The configurator shows the trailer parked.

Grab rail, front door only:
- Two parallel stainless tubes (`chrome`, radius 0.04), 0.25 apart, joined by three rungs.
- It runs from the front door's rear trim edge at (r 15.95, `floor + 3.3`, wall) out and down over the steps to (r 17.1, `floor + 1.0`, W/2 + 1.3), about 2.9 long.
- Fixed to the wall, not the door. The rear door has no rail.

### 2.4 Windows, both sides

Photos show two windows, one per side, directly opposite each other over the axles. The sheet lists one (open question 2).
- Glass 5.0 by 2.5 (SOURCE: 60 by 30 in), centered at r 9.5, frame top at `floor + 7.05` (about 1 ft under the roof cap top), so the center is at `floor + 5.75`.
- Black frame with rounded corners, outer 5.1 by 2.6, corner radius 0.25, band 0.08 wide.
  - Needs a new `roundedFrame(w, h, r, band, depth, mat)` helper (ExtrudeGeometry of a rounded-rect ring). The Cargo's `frame()` is square.
- Dark tint (`glass`) with a black slider mullion at the center.
- Inside: the same rounded black frame and a `daylight` pane, as the Cargo does.
- Curtains (gray and white pleats in ws-282) are optional polish. Skip them in v1.

### 2.5 Logos and decals

- SPOG logo (`m.logo`, art aspect 960:288) under each window: 3.1 by 0.93, centered at r 9.6 and `floor + 3.6`. On the street side it is rotated so it reads left to right, as the Cargo's side logo is. This replaces the Cargo's position, high at the rear of each side.
- Nose facets: the vertical SPOG marks (2.1).
- Rear: a small SPOG mark and a grayscale US flag (2.7).
- Never draw the rear text decal. It carries the edition name the brand rules ban.
- Buyer logo spots (`logoSpots`). This placement is a modeling choice (open question 9):
  - `left` and `right`: high on the wall between the rear door trim and the window, after ref5 (where the BSW logo sits). Centered at r 5.5. Top aligned with the window frame top. Height up to 1.2, width up to 2.2, so it clears the rear door trim at r 4.10 and the window at r 6.95. The street side mirrors the curb side.
  - `noseLeft` and `noseRight`: on the white upper half of each facet, centered, under the clearance lights.
  - `rear`: on the curb half of the rear face, between `floor + 5.0` and `floor + 6.5`, clear of the latches and the small SPOG mark.

### 2.6 Street side (-z)

Items from the nose back to the rear (ws-295, ws-296):
1. The guard wrap at the nose break (2.1).
2. Low access hatch.
   - Black diamond-plate frame r 17.42 to 19.79, `floor + 0.36` to `floor + 2.30`.
   - Painted door r 17.72 to 19.65, `floor + 0.55` to `floor + 2.0`.
   - Round chrome T-lock at bottom center (r 18.7, `floor + 0.5`). Top-hinged. Drawn shut, not animated.
   - Inside, it backs onto a low box in the front street corner (5.6).
3. Window and SPOG logo (2.4, 2.5).
4. Louvered vent near the rear corner.
   - Black frame r 0.52 to 1.34, `floor + 0.86` to `floor + 2.26`, with 8 black horizontal louvers angled down.
   - It vents the climate control compartment behind it (ref3), so it sits in front of that compartment (2.7).
- No door, no steps, no second window.
- Skip the small certification sticker. It's too small to read at this scale.

### 2.7 Rear face, and where the "single rear door" goes

What the photos show (ws-300, ws-298, ref3):
- The rear face is one painted panel with no door.
- The only opening is the climate control compartment hatch at the lower street-side corner. It's top-hinged on gas struts, and the heat pump's outdoor unit stands inside it.
- The blue unit Nate pointed to (ref5 to ref7) also shows two curb-side doors. The most plausible reading is that the sheet's "single rear door" is the rearward curb door, which the model already draws (2.3).
- So the model draws no door in the rear face. This is flagged for Nate as a question, not settled (open question 1). If he confirms a rear-face door, it slots into the rear wall shape as another hole.

Rear face layout. Here `zs` is feet from the street-side edge (z = -W/2 + zs), and heights are above `floor`:
- Rear wall: a single panel `wall` thick, built as a Shape with one hole for the hatch. The outer face is paint. The inner face is the interior finish.
- Black diamond-plate corner posts at zs 0 to 0.24 and 7.76 to 8.0, with caps 0.2 above the roof.
- Header from `roof - 0.25` to `roof`.
- Bottom sill from -0.3 to 0.22. It runs 0.3 deeper than the side rail.
- Five red ovals at 7.70: corner clearance lights at zs 0.44 and 7.55, and a three-light ID bar at zs 2.98, 3.97 and 4.95.
- Grayscale US flag decal at zs 0.42 to 1.06, 7.06 to 7.40. It needs a small new canvas texture: 13 stripes and a canton with dot stars, in grays.
- Small SPOG logo (`m.logo`) at zs 6.53 to 7.47, centered at 7.12, 0.94 by 0.28.
- Two flush vertical oval latches with a stainless rim and dark inset, 0.13 by 0.75, at zs 0.24 to 0.37 and 7.55 to 7.67, 5.17 to 5.92.
- Climate control hatch:
  - Black diamond-plate frame zs 0.20 to 3.85, 0.36 to 4.08.
  - Painted door zs 0.40 to 3.52, 0.70 to 3.76.
  - Two black hinges at the top at zs 0.73 and 3.18, and a round chrome lock at bottom center (zs 1.96, 0.71).
  - It's a pivot group hinged along its top edge, added to `hatches`. It lifts with "Open doors".
- License plate lamp bracket, black, at zs 5.59 to 6.29, 1.36 to 1.56. No plate.
- No tail, stop or turn lamps on the face, since none show in any rear photo (open question 10). No barn doors, lock bars or strap hinges.

The compartment behind the hatch (ref3):
- Depth r 0 to 2.5, width zs 0.2 to 3.85, from the floor to `floor + 4.0`.
- Lined in black. The room side is clad in the interior finish (5.6).
- Inside it, the heat pump outdoor unit:
  - A white box (`module`) 2.7 wide by 2.1 tall by 1.0 deep.
  - Its fan grille faces the hatch: a dark disk with concentric rings.
  - It sits on four yellow coil-spring isolators on a low steel rail frame.
- No brand label. ref3's "HYPER" badge is a supplier name.
- This is what "heating and cooling unit outside if visible" means: it shows only when the hatch is open.

### 2.8 Roof

ws-321 at full resolution settles the solar layout as five crosswise panels, not ten:
- Mid-clamps sit only on the transverse seams.
- Nothing sits on the center line.
- The center line is the half-cut cell split.
- Two-across would make each module nearly square, which isn't a normal module.

This is the Cargo's five-across layout with bigger panels.

- Roof deck: white (new `roofWhite`, about #eceeed, roughness 0.5, metalness 0.1), flat, with a white margin about 0.45 ft each side. It stays white whatever the paint (open question 12).
- Five all-black panels, each 6.8 across by 3.76 along, frame 0.1 tall, mounted low (top at `roof + 0.17`).
  - Laid out from the rear like the Cargo's: `rearStart` 0.61, pitch 3.82. That puts the front edge of the first panel at r 19.65, about 0.35 behind the nose break, as in ws-321.
  - No aluminum rails (`panels.rails = false`).
  - Small black clamp blocks (0.25 by 0.06 by 0.12) on each transverse seam at z = +/-1.87, plus end clamps on the front and rear edges.
  - Panel top: a variant of `solarCellTexture` with a thin center line across the panel's long axis (the half-cut split, canvas x = 320). Keep the Cargo's texture as it is.
  - 5 panels of this size match the sheet's 2,800 W at about 560 W each. That's an inference, so don't put it in copy.
- Over the nose:
  - A white low-profile square roof vent replaces the Cargo's graphite dome: a 1.5 by 1.5 flange 0.06 tall and a 1.2 by 1.2 lid 0.3 tall, centered on z = 0 at x = tip - 1.7.
  - A black cable gland (0.3 by 0.15 by 0.25) just ahead of the array's street-side front corner (x = xf + 0.1, z = -(W/2 - 1.9)), with a red and a black lead running into the array.
- Nothing else on the roof: no roof air unit (the outdoor unit is in the rear compartment), no rack, no Starlink unless picked.

### 2.9 Running gear, tongue, lights and masts

Wheels and fenders:
- Two axles, center at r 9.9 (about midway on the flat side), 2.7 ft apart. The window is centered right over them.
- 30 in tires: scale the existing `wheel()` group uniformly by tireR / 1.1 (1.136).
  - The wheel center height becomes 1.25.
  - The flush offset uses the scaled half-width: `wz = W/2 + 0.02 - 0.322 * scale`.
  - Same black wheel with machined split spokes. The photos may show 8 lugs; keep the shared wheel.
- Flush with the walls (ws-300, ws-289), as on the Cargo.
- Fender: one piece r 7.0 to 12.6, its top at 2.9 off the ground.
  - Smooth gloss charcoal, a new `fender` material: about #1c1d20, roughness 0.35, metalness 0.3. Not aluminum, not tread plate.
  - Use `archTrim` with a material parameter (it hardcodes `m.aluminum` today; keep that as the Cargo's default).
  - The photo shows a shallow dip between the tires. Draw the existing flat-top arch, because the dip doesn't read at configurator distance.
- No spare tire anywhere.

Tongue:
- Black A-frame rails from under the nose, about 6 ft apart there (today's `tongueZ = W/2 - 1.0` gives that on the 8 ft body), meeting at the coupler at tip + 3.4. Height `floor - 0.16`, as today, which puts the coupler near 1.6 to 2.0 off the ground.
- Jack: the existing parts on the centerline at `hitch - 1.7`, with the tube running from 0.1 to `floor + 1.1` so the crank clears the higher tongue.
- Skip the safety chains, breakaway box and the plywood pad under the jack foot (site props).

Masts. The white unit's mast maps to the sheet's two options:

**tower (28 ft light tower package, 20 ft only).** The white unit in the photos carries this one, shown retracted. It stands free on the centerline 0.68 ahead of the front face, so mastX = tip + 0.68. Drawn raised to 28 ft like the Cargo's, so framing behaves the same.
- Pedestal on the A-frame apex: black diamond-plate box 2.0 wide (z) by 0.7 tall by 0.9 deep, from `floor - 0.3` to `floor + 0.4`, centered at tip + 0.45, with a silver toggle latch (ws-289, ref9).
- Stages: the Cargo's four (radii 0.26, 0.2, 0.15, 0.11) from the pedestal top to 28, with collars.
- A black cable coil (torus, radius 0.38, tube 0.04) at `floor + 5.3`.
- One clamp brace back to the front face at `floor + 3.8`. The face is flat at the centerline, so the brace runs to x = tip.
- Head, laid out as in ws-289 and ref8:
  - A transverse flat black crossbar plate, 2.3 wide (z) by 0.08 by 0.35, at 28 - 0.9, with square mount pads at each end.
  - Two black rectangular flood heads (0.92 by 0.67 by 0.3, `lamp` face forward) on a yoke above the crossbar center, top at 28, yawed about 12 deg outward.
  - ONE black PTZ dome hanging from the curb end of the crossbar: a drop tube 0.8 long, a bell 0.6 tall and 0.3 radius (`graphite`), and a lower-half glass ball of 0.24 radius. About 1.9 below the crossbar.
  - The horn: the Cargo's horn bell, hung at the crossbar center where the photo shows a small black box.
- The photos show two domes. The model draws one because the sheet says one camera (open question 3).
- `hasTower` stays `cfg.tower && length >= 20`.

**light6 (6 ft telescopic light, lights only, no camera).** Follows the blue unit (ref5, ref7): a short single black pole that rises from the roof just behind the nose cap, with no base on the tongue.
- Pole on the centerline at x = tip - 0.45, standing on a small black mount plate on the nose roof (clear of the vent at tip - 1.7).
- Two stages (radii 0.16 and 0.12), drawn raised so the head top is at `roof + 6.2`, the Cargo's `lightTop`. That keeps `liftFor` tuned. The photos show it retracted about 2.2 above the roof.
- Head: a black center bracket with four square black light heads (0.55 by 0.55 by 0.3, `lamp` face forward), two stacked on each side (z +/-0.42, stacked 0.62 apart).
- A cable coil just under the head.
- No camera, no horn.
- With both picked, light6 sits on the roof and the tower ahead of the face, both on the centerline, about 1.1 apart in x, with no clash. The Cargo's side-by-side offsets (`lightZ`, `towerZ`) are not used on the Workstation 20.

**starlink.** Same rule as the Cargo:
- On top of light6 when it's picked, at light6's own x and z (tip - 0.45, z 0) and `roof + 6.2 + 0.22`. Don't use the Cargo's `mastX` there: on the Workstation 20 that is the tower's spot over the tongue.
- Otherwise on its own short pole on the curb half of the nose roof at (xf + 0.45, z 1.25). That's clear of the vent and inside the facet at that x.
- Never on the tower.

**cellular.** The Cargo's roof antenna at (xf + 0.32, z 2.3) still sits inside the nose outline and ahead of the array. Keep it.

---

## 3. What is standard on the Workstation 20 (always drawn)

SOURCE price sheet 2026-11-20 unless noted:
- Climate control: the hyper-heating heat pump.
  - The indoor head on the nose wall (5.5).
  - The outdoor unit in the rear compartment behind its hatch (2.7, photo).
  - `hvac` is forced true.
- One built-in work desk (5.7).
- Insulated vinyl floor (5.3).
- White composite or premium wood interior (`interior`).
- Battery: base 10 kWh, max 20 kWh in 5 kWh units. `batteryModules` 2 to 4 is the sheet's range for the 20 ft. The model accepts 1 to 4 as today.
- 2,800 W roof solar (the five panels).
- Two curb entry doors with steps (photo), two windows (photo), and the rear climate control hatch (photo).

---

## 4. Materials to add (createMaterials)

New entries, leaving every existing one unchanged:
- Exterior and roof: `guard`, `fender`, `roofWhite`, `pvTopSplit`, `flagDecal`.
- Interior finishes:
  - `veneer`: honey oak, vertical grain. `woodTexture([196,140,80], 0)` rotated 90 deg (`tex.rotation = Math.PI/2`), tiled 4 ft, roughness 0.35.
  - `walnut`: `woodTexture([110,70,40], 0)`, roughness 0.4, DoubleSide like `ceiling`.
  - `oakPlank`: `woodTexture([190,150,95], 6)` tiled 3.5 ft, so boards are about 7 in and run lengthwise. Built but unused until open question 7 is answered.
  - `charcoalPlank`: a new canvas, #2e3034 with plank gaps every 7 in and faint grain, tiled 3.5 ft.
  - `casework`: matte black, about #18181a, roughness 0.75.
  - `amberStrip`: emissive #ff9a3c, intensity about 1.2.
  - `downlight`: white trim. The `board` and `lamp` pair will do.
- Fittings: `spring` (yellow #e8c21a), and `curtain` (optional, skipped in v1).

These cost a few canvases. If load time matters, create the Workstation-only ones lazily on the first Workstation build.

`applyFinish` is unchanged. Check that White at metalness 0.32 reads white and not gray in the studio. If it reads gray, raise that with Nate before touching the shared paint, because Cargo White uses the same material.

---

## 5. Interiors (Workstation 20)

Shared frame: floor top at y0 = floorTop (2.05), ceiling at 9.35, inside wall face zi = W/2 - wall = 3.8.
- The floor slab runs from `floor` to `floorTop`, so the door openings show no gap.
- A flat interior wall closes off the nose at the nose break (x = xf - 0.1), as on the Cargo.
- Black baseboard 0.25 tall on every wall (ref2, ref4).
- No shelving, cabinets or overhead storage (no longer offered).

### 5.1 White composite ('composite'; ref4, materials only)

- Walls: `liner` with faint `joint` seams every 4 ft.
- Black corner strips (0.12 wide) at the inside corners.
- A plain black angle (0.12 by 0.12, `black`) at the wall-ceiling joint, instead of the Cargo's tread-plate angle.
- Ceiling: flat white (`ceiling`).
- Floor: the Cargo's charcoal `floor` vinyl, the finish Nate approved for the Cargo's white interior and the one the 10 ft Workstation shows. ref4's light oak plank (`oakPlank`) belongs to the Joby build until Nate says otherwise (open question 7).
- Lights: two rows of round recessed downlights, 0.5 ft across with a white trim ring (not the Cargo's black-rimmed pucks), at z = +/-1.95, `Math.round(S / 2.8)` per row (7). Cool white point lights (#f6f8fc) as today.
- The blue accent wall, the wall TVs and the desk monitors in ref4 belong to that customer's build. Don't draw them.

### 5.2 Premium wood ('wood', 20 ft only; ref2)

- Walls: `veneer`, with darker hairline seams every 4 ft.
- Ceiling: `walnut`.
- A continuous warm LED strip (`amberStrip`, 0.05 by 0.05) in the wall-ceiling joint around the whole room, the nose wall included.
- Floor: `charcoalPlank`.
- Lights: the same two downlight rows. Warm point lights (#ffe2b8).
- Casework in `casework` matte black (5.4, 5.7). The closet door is black six-panel (5.5).
- ref1 (the blue unit) is an earlier build with a coin-pattern rubber floor and raw plywood boxes. Use it for proportions only.

### 5.3 Floor

Vinyl on both (SOURCE: insulated vinyl floor): the Cargo's charcoal vinyl on composite (5.1), charcoal plank on wood (5.2). The floor outline is notched around the wheel wells as today, with the Workstation's arch and well numbers.

### 5.4 Battery enclosures over the wheel wells

Both interiors show closed boxes along each side wall, centered under the windows, right over the axles: white with black banding and an E-stop in ref4, and matte black under the windows in ref2. No battery hardware is visible in any photo. The model therefore draws the battery units inside closed enclosures that box in the wheel wells (open question 6):
- One per side, r 6.8 to 13.0 (6.2 long, covering the fender span plus 0.3 each end), 1.2 deep from the inside wall face (the well reaches about 0.5 in), top overhang 0.08 on the front and ends.
- Height: 2.8 for composite (ref4), 3.4 for wood (ref2). Both stay under the window frame bottom, at about 4.2 above the floor.
- Composite:
  - `equipment` white with thin `black` banding on every visible edge.
  - An E-stop on the rear end panel of the street-side enclosure, at y0 + 1.9: a gray box 0.3 by 0.35 by 0.12 with a red mushroom button (radius 0.08).
- Wood: `casework` black.
- Battery count:
  - Units split as the Cargo does today, with the street side getting `ceil(n/2)`.
  - Each unit shows as one lift-out front panel with a black vertical slot pull, centered along its enclosure. An enclosure with no units is plain.
  - This is a modeling choice so the 10 to 20 kWh pick stays visible. Mark it `NEW 2026-11-20`.
- This departs on purpose from "battery units on the wheel well platforms" because the photos show closed boxes. Keep it a flag flip: if Nate wants them shown, reuse the Cargo's platform and cage code (`unit` 1.55, the open cages) over the same r 6.8 to 13.0 range and drop the enclosure shell.
- A duplex outlet on the wall just behind each enclosure (existing look).

### 5.5 Nose wall: climate control head and closet door

From ref2, read as looking forward. The exterior door sits on the right wall tight to the corner, which only fits the front curb door.
- Climate control indoor head (always drawn): a floor-console style unit, not the Cargo's high wall head.
  - A `module` white box 3.0 wide (z) by 2.2 tall by 0.7 deep, with a lighter `board` grille panel and a dark slot along the bottom.
  - Bottom at y0 + 2.7, centered at z = -1.0. It spans z -2.5 to 0.5, on the street half.
- Closet door on the curb half, into the nose:
  - 2.67 wide by 6.67 tall, centered at z = 2.07 (z 0.74 to 3.41), with black trim.
  - Hinged on the curb edge, with a round black knob on its street edge at 3.0.
  - Composite: a white leaf (`board`) with black trim.
  - Wood: a black six-panel leaf (`casework`), with six recessed panels in two columns of three.
- These finishes come from ref2 and the Cargo pattern (open question 8).

### 5.6 Corner boxes

- Front street corner, behind the street hatch (ref2's small box):
  - r 17.4 to the nose wall, 1.5 deep from the street wall, 1.8 tall.
  - Wood: `veneer` with black diamond-plate edging.
  - Composite: `equipment` with black banding.
- Rear street corner, the room side of the climate control compartment (2.7):
  - r from the rear wall to 2.6, z from -zi to -0.1, top at y0 + 3.9.
  - Clad in the interior finish, with a black top edge (composite) or a `casework` top (wood).

### 5.7 Built-in work desk (standard)

The sheet says one built-in work desk on the 20 ft. No photo of the white unit shows a sit-down desk, so placement is a modeling choice (open question 5).
- On the street wall, ahead of the street enclosure: r 13.3 to 17.15 (about 3.85 long), 2.0 deep, top at y0 + 2.5.
  - The street wall has no doors and this run is clear of the window (r 7.07 to 12.10) and the corner box.
- Form from ref4: a top 0.08 thick on two black steel L-brackets, open underneath for knees, and a duplex outlet on the wall under it.
  - Composite: an `equipment` white top with black edge banding.
  - Wood: a `casework` black top.
- Implement it with the existing `placeFront` on the street wall, after setting that wall's free stretch to end at the corner box. Give it its own `drawWsDesk`, because the Cargo's `drawDesk` has a solid base.

### 5.8 Other picked furniture (so nothing breaks)

The packer runs as today, on the Workstation's free stretches:
- Street: r 2.9 to 6.5 (between the rear corner box and the enclosure).
- Curb: r 4.35 to 6.5 (rear door trim to the enclosure) and r 13.3 to 15.63 (enclosure to the front door trim).

Extra desks, the counter, the fridge, the microwave and the bench place there or get reported as skipped, the same as on the Cargo. The windows take the wall-hung spots, so on the Workstation 20:
- The TV hangs on the rear wall's curb half (width up to 3.2).
- The whiteboard hangs on the rear wall above the corner box.
- E-track is not drawn.

None of these are on the tour.

### 5.9 Interior camera (interiorView)

Workstation 20: eye at (xr + 0.9, y0 + 4.3, 0.9), looking at (xf - 0.3, y0 + 3.0, -0.2), FOV 72 as today.
- It stands just inside the rear end, on the curb half, so it clears the climate control box in the rear street corner.
- It looks down the room at the nose wall: head, closet door, desk, enclosures and both windows, framed like ref2.
- Check the eye is not inside the corner box or the rear door's leaf.

---

## 6. Doors open ("Open doors" in the tour)

- Both curb doors swing out on their nose-side hinges.
- The rear climate control hatch lifts on its top hinge and shows the outdoor unit.
- The barn-door code is skipped (`barn = []`).
- The steps and grab rail stay put.

---

## 7. Workstation 10

SOURCE price sheet 2026-11-20: the 10 ft Workstation is everything on a 10 ft Cargo plus heating and cooling.
- Body: exactly the Cargo 10 profile and build (6.5 ft wide, dual axle, pointed 2 ft V, barn doors, one curb door, the street window and equipment compartment, the spare).
- Paint default white (data and embed).
- `hvac` forced true, so the Cargo's climate control wall head on the nose wall is always drawn.
- `interior` forced 'composite', which is the Cargo's white interior. The corner desk is as on the Cargo 10.
- `tower` is ignored (20 ft only, no cameras on the 10 ft). `light6` and `starlink` work as on the Cargo 10.

---

## 8. scene.ts and framing

- Replace `setLength(L)` with `setBody(kind, L)`. Keep `setLength(L)` as a wrapper for 'cargo'. `controller.rebuild()` calls `stage.setBody(cfg.kind, cfg.length)`.
- `viewPose` reads `p = profileFor(kind, L)`:
  - `r = (19 + p.overall * 0.6) * ...`. Same as today for the Cargo, about 5% farther for the Workstation 20.
  - The target height is `p.floor + p.H * (top ? 0.5 : 0.4) + lift * 2.2`. Today's version would aim about 0.5 low on the Workstation.
  - The `wheels` target is x = `xr + S - p.gear.center` (= today's for the Cargo), y 1.7 for the Cargo and 1.9 for the Workstation, z = p.W/2.
- `liftFor` uses `p.roof` (9.8), not `roofFor(L)` (8.17). With the tower that gives about 4.2 against the Cargo's 4.6, so check the head stays in frame.
- `interiorView(p)` (1.5).
- `VIEWS[*].x`: the Workstation's tongue tip reaches x 14.8 (Cargo 13.3). If the front, side or street views crowd the coupler or the tower pedestal, add a per-kind shift (start at +0.4) instead of retuning the Cargo's numbers.
- The contact shadow (40 by 18 ft plate, 3.4 ft deep camera) covers the longer body and the steps. Check the step legs and jack foot cast contact.
- The key light shadow box (+/-24) is unchanged.

Views to check, each shut and with doors open, at a 16:9 desktop stage, the tour's wide-short stage (distance 0.8) and a phone stage:
1. `front` (az 36): curb 3/4 with the nose. Check both doors, steps, the grab rail, the guard and covers, the nose decals, the pedestal and tower base, and that the callout anchors land on the body.
2. `side` (az 90): curb square-on. Check door, window and logo spacing against ws-282, the 30 in tires and the fender.
3. `rear` (az 152): the rear face. Check the hatch shut and lifted, the outdoor unit, the flag and the five red lights, and that no edition text appears.
4. `street` (az -46): the street hatch, window, logo and louvered vent, and the nose's street facet.
5. `top` (el 40): five crosswise panels, the clamps, the white roof, the nose vent and the cable gland.
6. `wheels`: the target is on the axles with the bigger tires.
7. `interior`: the eye placement, both finishes, the head, the closet door, the desk, the enclosures with 2 and 4 units, the E-stop, and the LED strip on wood.
8. Raised masts: tower alone, light6 alone, both, and light6 with Starlink. Check the 28 ft head and dome in frame on all three stages.

---

## 9. Integration outside the model (separate step, needs its own copy approval)

- `embed.ts`: `mountViewer(container, opts?: { kind?: 'cargo' | 'workstation'; interior?: 'composite' | 'wood' })`, defaulting to the Cargo exactly as today.
  - For the Workstation: length 20, paint 'white', battery '10' (the sheet's 20 ft base), interior 'composite', `hvac` on, no mast, no Starlink (the trailer as it comes; open question 13).
  - `setInterior()` would let the tour switch finishes.
- `Cargo2Tour.astro`:
  - Add a `model` (or `kind`) prop passed to `mountViewer`.
  - The `want.paint` default follows the model ('white' for the Workstation).
  - The poster image and its alt text need a Workstation still.
  - The "Open doors" label already fits.
- `/workstation-2`: drop `tourStandIn` once the model ships, and update its NEW and PLACEHOLDER comment in `workstation2Page.ts`.
- `CLAUDE.md`, Configurator section: document the Workstation profile, the photo sources and the open questions. That goes in the same change as the code.

---

## 10. Verification

- Typecheck and build: `npx astro check` (or `tsc --noEmit`) and `npm run build`.
- Cargo regression:
  - Before touching anything, use `scratchpad/ws3d/tools/shoot3d.mjs` to screenshot every view in `VIEW_ORDER` (plus `wheels` and doors open) for Cargo 10 and Cargo 20 on `/configure/cargo` and on `/cargo-2`.
  - Take the same shots after the change. They must match pixel for pixel. Any difference means the Cargo branch of `profileFor` or a shared helper changed.
- Workstation screenshots, every view, shut and open:
  - Workstation 10.
  - Workstation 20 composite.
  - Workstation 20 wood.
  - Workstation 20 with the tower.
  - Workstation 20 with light6 and Starlink.
  - Workstation 20 with batteryModules 2 and 4.
- Compare the Workstation 20 `side` and `street` shots against ws-282 and ws-296, `rear` against ws-300, `top` against ws-321, and `interior` against ref2 (wood) and ref4 (composite).
- Console clean: no NaN geometry warnings. `dispose()` still frees everything on a kind or interior switch (the controller rebuilds).

---

## 11. Open questions for Nate

1. **Doors.**
   - The sheet says one 36 in entry door plus a single rear door.
   - The white unit and the blue unit both show two entry doors on the curb side, one at each end, and no door in the rear face. The white unit's rear has only the hatch for the climate control unit.
   - The model draws what the photos show. Is the sheet's "rear door" the second curb door?
2. **Windows.** The sheet lists one 60 by 30 in window. The photos show two, one on each side, opposite each other. Does every 20 ft Workstation get two?
3. **Tower cameras.**
   - The 28 ft tower in the photos carries two dome cameras.
   - The sheet says one camera, a light and a horn, so the model draws one camera.
   - Is that right? Should the Cargo's tower switch to the same head as the Workstation photos so both match?
4. **Size (Joe).**
   - The photos put the 20 ft on the flat side, with the nose adding about 2 ft 10 in.
   - The 8 ft tall is the box itself, with the roof about 9 ft 10 in off the ground.
   - Is that how the sheet measures it?
5. **Desk.** No photo of the white unit shows the built-in work desk. The model puts it on the street wall, between the battery box and the front corner. Where does it go?
6. **Batteries.**
   - The model hides the batteries in the boxes over the wheels (white with an emergency stop, or black on the wood interior) and shows one panel per battery.
   - Is that where they live? Should the tour show them openly, as the Cargo does?
7. **Composite floor.** The model uses the Cargo's charcoal floor. The Joby trailer has a light oak floor. Which is standard with the white composite interior?
8. **Wood interior.**
   - The premium wood photo shows black boxes, a black six-panel closet door, a warm light strip and a charcoal floor.
   - Are those part of the wood package?
   - Is there a closet in the nose on every 20 ft Workstation?
9. **Your logo spot.** The model puts a buyer's side logo high between the rear door and the window, as on the BSW trailer, and keeps the SPOG logo under the window. Is that right?
10. **Rear lights.** No tail or brake lights show on the rear face in any photo, so the model draws only the five red lights along the top. Where are they?
11. **Tires.** The Workstation runs about 30 in tires. The 20 ft Cargo model uses 27 in. Does the 20 ft Cargo share the Workstation's wheels and axles?
12. **Colors.** Does the Workstation come in the same 12 colors as Cargo? Is the roof always white?
13. **Tour default.** Should the tour show the Workstation as it comes (no mast), or with the 28 ft tower as in the photos?
14. **Outlets and generator.**
   - Are the four small black covers on the nose the four outdoor outlets?
   - The generator inlet (ref9) is the optional generator hookup, so it isn't drawn. Is that right?
15. **Doors.** The white unit has plain doors. The blue unit has black tread-plate kick panels on its doors. Which is standard?
