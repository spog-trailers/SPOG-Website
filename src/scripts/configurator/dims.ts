/**
 * Cargo dimensions in feet, measured off Nate's photos of the finished black 20 ft Cargo
 * (_photos-original/2026-11-17/Black Cargo Trailer). No three.js here, so pages can import it.
 *
 * The 20 ft length includes the V nose: an 18 ft box plus a 2 ft nose. The body is 7 ft wide, with
 * the wheels tucked under it and their outer faces flush with the walls, inside aluminum radius
 * fenders (Nate, 2026-11-20). Heights are scaled from the tire (about 27 in).
 */
export const W = 7;
export const H = 7.1;
export const FLOOR = 1.25;
export const ROOF = FLOOR + H;
export const NOSE = 2;
export const WALL = 0.12;

export const PANEL_ALONG = 3.4;
export const PANEL_ACROSS = 6.3;
export const PANEL_PITCH = 3.56;

/** Length of the flat side, without the nose. */
export const sideLength = (length: number) => length - NOSE;
/** How many roof panels fit on the flat part of the roof. Five on the 20 ft, as built. */
export const maxPanels = (length: number) => Math.max(1, Math.floor((sideLength(length) - 0.15) / PANEL_PITCH));
/** Axles sit about 61% of the way back along the box. The 10 ft runs a single axle. */
export const axleCenter = (length: number) => sideLength(length) * 0.606;
export const tandem = (length: number) => length >= 16;
