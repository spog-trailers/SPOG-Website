/** Shared Cargo dimensions in feet. No three.js here, so pages can import it on the server. */
export const W = 7;
export const H = 7;
export const FLOOR = 2.5;
export const NOSE = 2;
export const ROOF = FLOOR + H;
export const PANEL_X = 5.6;
export const PANEL_Z = 3.4;
export const ROW_PITCH = 5.75;

/** How many roof panel rows fit on the box part of the roof for a given length. */
export function roofRows(length: number) {
  return Math.max(1, Math.floor((length - NOSE - 0.2) / ROW_PITCH));
}
