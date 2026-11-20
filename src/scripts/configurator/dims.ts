/**
 * Cargo dimensions in feet. No three.js here, so pages can import it.
 *
 * The shape was measured off Nate's photos of the finished black 20 ft Cargo
 * (_photos-original/2026-11-17/Black Cargo Trailer), and the sizes follow SPOG's price sheet
 * (2026-11-20). Both lengths include the 2 ft V nose. Every size runs two axles, with the wheels
 * tucked under the body, their outer faces flush with the walls, inside aluminum radius fenders
 * (Nate, 2026-11-20). Heights are scaled from the tire (about 27 in).
 *
 *   10 ft: 6.5 ft wide, dual axle.  // SOURCE (price sheet 2026-11-20)
 *   20 ft: 8 ft wide, 8 ft 2 in tall overall, dual axle.  // SOURCE (price sheet 2026-11-20)
 */
export const FLOOR = 1.25;
export const NOSE = 2;
export const WALL = 0.12;

/** A Cargo this long or longer is built like the 20 ft. Shorter ones are built like the 10 ft. */
const BIG = 16;

/** Body width, outside wall to outside wall. The wheels sit flush with the walls, so it's also the overall width. */
// SOURCE (price sheet 2026-11-20): 10 ft is 6.5 ft wide, 20 ft is 8 ft wide.
export const widthFor = (length: number) => (length >= BIG ? 8 : 6.5);

/**
 * Body height, floor to roof.
 * - 20 ft: 8 ft 2 in to the roof skin, per the price sheet (1.25 + 6.92 = 8.17 ft). The solar
 *   panels add about 2 in on top.
 * - 10 ft: the sheet's "6 ft" is under research (2026-11-20). Until it's settled, the model assumes
 *   6 ft is the inside height, so the body is about 6.45 ft and the roof about 7 ft 8 in off the
 *   ground. The site never states the 10 ft height.
 */
// SOURCE (price sheet 2026-11-20): 20 ft is 8 ft 2 in tall.
// CONFIRM (Joe): does 8 ft 2 in include the solar panels?
// CONFIRM (Joe): is the 10 ft's 6 ft measured inside or outside?
export const heightFor = (length: number) => (length >= BIG ? 6.92 : 6.45);
/** Height of the roof skin off the ground. */
export const roofFor = (length: number) => FLOOR + heightFor(length);

/** The 20 ft defaults, for anything that doesn't know the length. */
export const W = widthFor(20);
export const H = heightFor(20);
export const ROOF = roofFor(20);

export const PANEL_ALONG = 3.4;
export const PANEL_ACROSS = 6.3;
export const PANEL_PITCH = 3.56;
/** How far a roof panel reaches across the roof. Narrows on the 6.5 ft roof so it doesn't touch the edges. */
export const panelAcross = (length: number) => Math.min(PANEL_ACROSS, widthFor(length) - 0.7);

/** Length of the flat side, without the nose. */
export const sideLength = (length: number) => length - NOSE;
/** How many roof panels fit on the flat part of the roof. Five on the 20 ft, as built. */
export const maxPanels = (length: number) => Math.max(1, Math.floor((sideLength(length) - 0.15) / PANEL_PITCH));

/**
 * Running gear and the curb-side door, which compete for the same stretch of wall.
 *   door:   width of the curb-side entry door.
 *   spread: half the distance between the two axles.
 *   fender: length of the wheel arch along the wall.
 *   flange: how far the fender's flat flange reaches onto the wall around the arch.
 *   center: distance from the front of the flat side (where the nose starts) back to the middle of the axles.
 *
 * The 20 ft is as built: a 35 in door and the axles about 61% of the way back. The 10 ft is a
 * modeling choice, because the sheet gives no door size or axle spacing. Two 27 in tires and a
 * 35 in door don't fit on its 8 ft of flat side, so the 10 ft gets a 30 in door, the axles
 * closer together and a tighter fender, and the arch sits between the rear corner and the door.
 */
export function gearFor(length: number) {
  const S = sideLength(length);
  if (length >= BIG) return { door: 2.9, spread: 1.2, fender: 5.3, flange: 0.2, center: S * 0.606 };
  const door = 2.5;
  const flange = 0.12;
  // The arch runs from just ahead of the rear corner trim to just behind the door frame.
  const front = 0.14 + door + 0.08 + flange + 0.02; // from the front of the flat side to the arch's front edge
  const rear = S - 0.2 - flange - 0.02; // from there to the arch's rear edge
  return { door, spread: 1.15, fender: Math.min(4.78, rear - front), flange, center: (front + rear) / 2 };
}
/** Distance from the front of the flat side back to the middle of the axles. */
export const axleCenter = (length: number) => gearFor(length).center;
