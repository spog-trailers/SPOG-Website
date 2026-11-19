/**
 * Procedural 3D model of a SPOG Cargo trailer (concept model, not CAD).
 *
 * Units are feet. Axes: +x is the front (V-nose and tongue), +y is up, +z is the curb side
 * (door side). The street side (-z) carries the company decal. The solar wing hinges on the
 * street-side roof edge and folds back over the roof when stowed.
 */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export interface TrailerConfig {
  length: number;
  paint: string;
  paintDark: boolean;
  trim: 'black' | 'aluminum';
  roofPanels: number;
  wing: boolean;
  wingOpen: boolean;
  mast: boolean;
  mastUp: boolean;
  led: boolean;
  gearRail: boolean;
  hvac: boolean;
  brand: string;
}

import { FLOOR, H, NOSE, PANEL_X, PANEL_Z, ROOF, ROW_PITCH, W, roofRows } from './dims';
export { FLOOR, H, NOSE, ROOF, W, roofRows };
const R = 0.35;

// ---------------------------------------------------------------- textures

function canvasTexture(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext('2d')!);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function diamondPlateTexture() {
  const tex = canvasTexture(128, 128, (c) => {
    c.fillStyle = '#6a6a6a';
    c.fillRect(0, 0, 128, 128);
    const diamond = (x: number, y: number, rot: number) => {
      c.save();
      c.translate(x, y);
      c.rotate(rot);
      const g = c.createLinearGradient(-18, 0, 18, 0);
      g.addColorStop(0, '#9a9a9a');
      g.addColorStop(1, '#ffffff');
      c.fillStyle = g;
      c.beginPath();
      c.ellipse(0, 0, 20, 5, 0, 0, Math.PI * 2);
      c.fill();
      c.restore();
    };
    for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) {
      diamond(32 + x * 64, 32 + y * 64, Math.PI / 4);
      diamond(x * 64, y * 64, -Math.PI / 4);
      diamond(64 + x * 64, y * 64, -Math.PI / 4);
      diamond(x * 64, 64 + y * 64, -Math.PI / 4);
    }
  });
  tex.colorSpace = THREE.NoColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1.2, 1.2);
  return tex;
}

function solarCellTexture() {
  return canvasTexture(560, 340, (c) => {
    const g = c.createLinearGradient(0, 0, 560, 340);
    g.addColorStop(0, '#0d1626');
    g.addColorStop(0.5, '#16233a');
    g.addColorStop(1, '#0b1322');
    c.fillStyle = g;
    c.fillRect(0, 0, 560, 340);
    c.strokeStyle = 'rgba(170,185,210,.35)';
    c.lineWidth = 2;
    const cols = 10;
    const rows = 6;
    for (let i = 1; i < cols; i++) {
      c.beginPath(); c.moveTo((560 / cols) * i, 0); c.lineTo((560 / cols) * i, 340); c.stroke();
    }
    for (let j = 1; j < rows; j++) {
      c.beginPath(); c.moveTo(0, (340 / rows) * j); c.lineTo(560, (340 / rows) * j); c.stroke();
    }
    c.strokeStyle = 'rgba(200,210,225,.12)';
    c.lineWidth = 1;
    for (let i = 0; i < cols * 3; i++) {
      c.beginPath(); c.moveTo((560 / (cols * 3)) * i, 0); c.lineTo((560 / (cols * 3)) * i, 340); c.stroke();
    }
    c.strokeStyle = '#c9ced6';
    c.lineWidth = 10;
    c.strokeRect(5, 5, 550, 330);
  });
}

async function decalTexture(text: string, onDark: boolean) {
  try { await document.fonts.load('900 120px Montserrat'); } catch { /* fall back to whatever loaded */ }
  return canvasTexture(2048, 512, (c) => {
    c.clearRect(0, 0, 2048, 512);
    const label = text.trim().toUpperCase();
    let size = 230;
    c.font = `900 ${size}px Montserrat, Arial, sans-serif`;
    while (c.measureText(label).width > 1900 && size > 60) {
      size -= 6;
      c.font = `900 ${size}px Montserrat, Arial, sans-serif`;
    }
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillStyle = onDark ? '#ffffff' : '#141518';
    c.fillText(label, 1024, 220);
    c.font = '700 54px Montserrat, Arial, sans-serif';
    c.fillStyle = '#EEA114';
    c.fillText('SOLAR POWERED BY SPOG', 1024, 420);
  });
}

// ---------------------------------------------------------------- materials

export function createMaterials() {
  const plateTex = diamondPlateTexture();
  const cell = solarCellTexture();
  const aluminum = new THREE.MeshStandardMaterial({ color: '#c3c6cb', roughness: 0.28, metalness: 0.9 });
  return {
    paint: new THREE.MeshPhysicalMaterial({ color: '#e9e9e6', roughness: 0.3, metalness: 0.2, clearcoat: 0.8, clearcoatRoughness: 0.16 }),
    trim: new THREE.MeshStandardMaterial({ color: '#141518', roughness: 0.5, metalness: 0.35 }),
    plate: new THREE.MeshStandardMaterial({ color: '#2b2d31', roughness: 0.3, metalness: 0.88, bumpMap: plateTex, bumpScale: 2.2 }),
    chassis: new THREE.MeshStandardMaterial({ color: '#0f1012', roughness: 0.7, metalness: 0.4 }),
    rubber: new THREE.MeshStandardMaterial({ color: '#111113', roughness: 0.92, metalness: 0 }),
    rim: new THREE.MeshStandardMaterial({ color: '#1c1d20', roughness: 0.25, metalness: 0.9 }),
    aluminum,
    pvTop: new THREE.MeshPhysicalMaterial({ map: cell, roughness: 0.18, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.05 }),
    pvUnder: new THREE.MeshStandardMaterial({ color: '#2a2c30', roughness: 0.6, metalness: 0.4 }),
    led: new THREE.MeshStandardMaterial({ color: '#fff3dc', emissive: '#ffd59a', emissiveIntensity: 0.6, roughness: 0.4 }),
    lamp: new THREE.MeshStandardMaterial({ color: '#f4f6ff', emissive: '#f4f6ff', emissiveIntensity: 0.4, roughness: 0.2 }),
    tail: new THREE.MeshStandardMaterial({ color: '#7a0d0d', emissive: '#ff2a1a', emissiveIntensity: 0.6, roughness: 0.3 }),
    marker: new THREE.MeshStandardMaterial({ color: '#8a4a00', emissive: '#ff9a1a', emissiveIntensity: 0.6, roughness: 0.3 }),
    hvac: new THREE.MeshStandardMaterial({ color: '#a9abae', roughness: 0.5, metalness: 0.35 }),
    grille: new THREE.MeshStandardMaterial({ color: '#202124', roughness: 0.6, metalness: 0.5 }),
    decal: new THREE.MeshStandardMaterial({ transparent: true, roughness: 0.45, metalness: 0.1, polygonOffset: true, polygonOffsetFactor: -2 }),
  };
}
export type Materials = ReturnType<typeof createMaterials>;

export function applyTrim(m: Materials, trim: TrailerConfig['trim']) {
  if (trim === 'aluminum') {
    m.trim.color.set('#b9bcc1'); m.trim.metalness = 0.9; m.trim.roughness = 0.28;
    m.plate.color.set('#c9ccd1'); m.rim.color.set('#c7cace');
  } else {
    m.trim.color.set('#141518'); m.trim.metalness = 0.35; m.trim.roughness = 0.5;
    m.plate.color.set('#2b2d31'); m.rim.color.set('#1c1d20');
  }
}

// ---------------------------------------------------------------- geometry helpers

/** Top-view outline of the body. Shape y maps to world -z after the rotation in prism(). */
function outline(L: number, grow: number) {
  const rear = -L / 2 - grow;
  const boxEnd = L / 2 - NOSE;
  const tip = L / 2 + grow;
  const hw = W / 2 + grow;
  const r = R;
  // round the nose tip slightly
  const t = 0.45;
  const dx = tip - boxEnd;
  const len = Math.hypot(dx, hw);
  const ux = dx / len;
  const uy = hw / len;
  const s = new THREE.Shape();
  s.moveTo(rear + r, -hw);
  s.lineTo(boxEnd, -hw);
  s.lineTo(tip - ux * t, -uy * t);
  s.quadraticCurveTo(tip, 0, tip - ux * t, uy * t);
  s.lineTo(boxEnd, hw);
  s.lineTo(rear + r, hw);
  s.quadraticCurveTo(rear, hw, rear, hw - r);
  s.lineTo(rear, -hw + r);
  s.quadraticCurveTo(rear, -hw, rear + r, -hw);
  return s;
}

/** Just the V-nose wedge, following the same edges and tip rounding as outline(). */
function noseOutline(L: number, grow: number) {
  const boxEnd = L / 2 - NOSE;
  const tip = L / 2 + grow;
  const hw = W / 2 + grow;
  const t = 0.45;
  const dx = tip - boxEnd;
  const len = Math.hypot(dx, hw);
  const ux = dx / len;
  const uy = hw / len;
  const s = new THREE.Shape();
  s.moveTo(boxEnd - 0.05, -hw);
  s.lineTo(boxEnd, -hw);
  s.lineTo(tip - ux * t, -uy * t);
  s.quadraticCurveTo(tip, 0, tip - ux * t, uy * t);
  s.lineTo(boxEnd, hw);
  s.lineTo(boxEnd - 0.05, hw);
  s.lineTo(boxEnd - 0.05, -hw);
  return s;
}

/** Extrude a top-view shape upward from y0 to y0 + h with softened top and bottom edges. */
function prism(shape: THREE.Shape, y0: number, h: number, bevel: number) {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.01, h - 2 * bevel),
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 10,
  });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, y0 + bevel, 0);
  return geo;
}

function mesh(geo: THREE.BufferGeometry, mat: THREE.Material | THREE.Material[], shadow = true) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = shadow;
  m.receiveShadow = true;
  return m;
}

function box(w: number, h: number, d: number, mat: THREE.Material, x: number, y: number, z: number, radius = 0) {
  const geo = radius > 0 ? new RoundedBoxGeometry(w, h, d, 2, radius) : new THREE.BoxGeometry(w, h, d);
  const m = mesh(geo, mat);
  m.position.set(x, y, z);
  return m;
}

/** A square bar running from a to b. */
function beam(a: THREE.Vector3, b: THREE.Vector3, size: number, mat: THREE.Material) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = mesh(new THREE.BoxGeometry(size, size, dir.length()), mat);
  m.position.copy(a).addScaledVector(dir, 0.5);
  m.lookAt(b);
  return m;
}

function tube(a: THREE.Vector3, b: THREE.Vector3, radius: number, mat: THREE.Material) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = mesh(new THREE.CylinderGeometry(radius, radius, dir.length(), 16), mat);
  m.position.copy(a).addScaledVector(dir, 0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return m;
}

function wheel(m: Materials) {
  const g = new THREE.Group();
  // tire: lathe a rounded profile around the axle
  const pts: THREE.Vector2[] = [];
  const rOut = 1.12;
  const rIn = 0.66;
  const half = 0.38;
  const cr = 0.16;
  pts.push(new THREE.Vector2(rIn, -half));
  pts.push(new THREE.Vector2(rOut - cr, -half));
  for (let i = 0; i <= 6; i++) {
    const a = -Math.PI / 2 + (i / 6) * (Math.PI / 2);
    pts.push(new THREE.Vector2(rOut - cr + Math.cos(a) * cr, -half + cr + Math.sin(a) * cr));
  }
  for (let i = 0; i <= 6; i++) {
    const a = (i / 6) * (Math.PI / 2);
    pts.push(new THREE.Vector2(rOut - cr + Math.cos(a) * cr, half - cr + Math.sin(a) * cr));
  }
  pts.push(new THREE.Vector2(rIn, half));
  const tire = mesh(new THREE.LatheGeometry(pts, 48), m.rubber);
  tire.rotation.x = Math.PI / 2;
  g.add(tire);
  const rim = mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.62, 40), m.rim);
  rim.rotation.x = Math.PI / 2;
  g.add(rim);
  const face = mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.66, 6), m.chassis);
  face.rotation.x = Math.PI / 2;
  face.scale.set(1, 1, 1);
  g.add(face);
  const hub = mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.72, 20), m.aluminum);
  hub.rotation.x = Math.PI / 2;
  g.add(hub);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    const spoke = mesh(new THREE.BoxGeometry(0.1, 0.5, 0.06), m.rim);
    spoke.position.set(Math.cos(a) * 0.4, Math.sin(a) * 0.4, 0.33);
    spoke.rotation.z = a - Math.PI / 2;
    g.add(spoke);
  }
  return g;
}

function solarPanel(m: Materials) {
  const mats = [m.aluminum, m.aluminum, m.pvTop, m.pvUnder, m.aluminum, m.aluminum];
  return mesh(new THREE.BoxGeometry(PANEL_X, 0.1, PANEL_Z), mats);
}

// ---------------------------------------------------------------- the trailer

export interface TrailerParts {
  group: THREE.Group;
  wingPivot: THREE.Group | null;
  wingStruts: THREE.Group | null;
  mastStage: THREE.Object3D[];
  mastHead: THREE.Group | null;
  mastLight: THREE.SpotLight | null;
  decal: THREE.Mesh | null;
  dispose: () => void;
}

export function buildTrailer(cfg: TrailerConfig, m: Materials): TrailerParts {
  const L = cfg.length;
  const g = new THREE.Group();
  const boxEnd = L / 2 - NOSE;
  const hw = W / 2;

  // body, skirt, roof cap
  g.add(mesh(prism(outline(L, -0.14), FLOOR, H, 0.14), m.paint));
  g.add(mesh(prism(outline(L, 0.04 - 0.05), FLOOR - 0.06, 0.62, 0.05), m.trim));
  g.add(mesh(prism(outline(L, 0.05 - 0.06), ROOF - 0.34, 0.38, 0.06), m.trim));
  // diamond plate on the lower nose
  g.add(mesh(prism(noseOutline(L, 0.06 - 0.04), FLOOR + 0.5, 2.3, 0.04), m.plate));

  // corner posts
  for (const z of [-1, 1]) {
    g.add(box(0.3, H - 0.3, 0.3, m.trim, -L / 2 + 0.06, FLOOR + H / 2, z * (hw - 0.06), 0.06));
    g.add(box(0.26, H - 0.3, 0.26, m.trim, boxEnd, FLOOR + H / 2, z * (hw + 0.02), 0.06));
  }

  // LED edge strips
  if (cfg.led) {
    g.add(mesh(prism(outline(L, 0.075 - 0.02), FLOOR - 0.1, 0.07, 0.02), m.led, false));
    g.add(mesh(prism(outline(L, 0.075 - 0.02), ROOF - 0.38, 0.06, 0.02), m.led, false));
  }

  // rear barn doors
  const rearX = -L / 2 - 0.03;
  const dTop = ROOF - 0.55;
  const dBot = FLOOR + 0.62;
  const dH = dTop - dBot;
  const dW = W - 1.0;
  g.add(box(0.1, dH, 0.14, m.trim, rearX, dBot + dH / 2, -dW / 2));
  g.add(box(0.1, dH, 0.14, m.trim, rearX, dBot + dH / 2, dW / 2));
  g.add(box(0.1, 0.14, dW, m.trim, rearX, dTop, 0));
  g.add(box(0.1, dH, 0.05, m.trim, rearX - 0.01, dBot + dH / 2, 0));
  for (const z of [-0.5, 0.5]) g.add(tube(new THREE.Vector3(rearX - 0.12, dBot + 0.3, z), new THREE.Vector3(rearX - 0.12, dTop - 0.3, z), 0.045, m.aluminum));
  for (const z of [-1, 1]) {
    for (const y of [dBot + 0.8, dBot + dH / 2, dTop - 0.8]) g.add(box(0.08, 0.24, 0.5, m.aluminum, rearX - 0.04, y, z * (dW / 2 - 0.2)));
    g.add(box(0.14, 0.7, 0.32, m.tail, rearX - 0.04, FLOOR + 0.25, z * (hw - 0.45), 0.05));
    g.add(box(0.12, 0.12, 0.22, m.tail, rearX - 0.02, ROOF - 0.2, z * (hw - 0.4)));
  }

  // curb-side entry door (+z)
  const doorX = boxEnd - 2.1;
  const doorW = 3;
  const doorTop = FLOOR + 6.2;
  const doorBot = FLOOR + 0.62;
  const doorH = doorTop - doorBot;
  const sideZ = hw + 0.02;
  g.add(box(doorW, doorH, 0.08, m.paint, doorX, doorBot + doorH / 2, sideZ, 0.03));
  g.add(box(doorW + 0.24, 0.14, 0.16, m.trim, doorX, doorTop, sideZ));
  g.add(box(doorW + 0.24, 0.14, 0.16, m.trim, doorX, doorBot, sideZ));
  g.add(box(0.14, doorH, 0.16, m.trim, doorX - doorW / 2, doorBot + doorH / 2, sideZ));
  g.add(box(0.14, doorH, 0.16, m.trim, doorX + doorW / 2, doorBot + doorH / 2, sideZ));
  g.add(box(0.12, 0.42, 0.12, m.aluminum, doorX - doorW / 2 + 0.35, doorBot + 3.1, sideZ + 0.1, 0.03));
  g.add(box(1.6, 0.08, 0.9, m.plate, doorX, FLOOR - 0.55, hw + 0.25));
  // markers
  for (const z of [-1, 1]) g.add(box(0.22, 0.12, 0.12, m.marker, boxEnd + 0.15, ROOF - 0.2, z * (hw - 0.05)));
  g.add(box(0.12, 0.12, 0.3, m.marker, -L / 2 + 0.6, FLOOR + 0.3, -(hw + 0.04)));
  g.add(box(0.12, 0.12, 0.3, m.marker, -L / 2 + 0.6, FLOOR + 0.3, hw + 0.04));

  // chassis, axles, wheels
  for (const z of [-2.3, 2.3]) g.add(box(L - NOSE + 0.2, 0.36, 0.3, m.chassis, -L / 2 + (L - NOSE) / 2 + 0.2, FLOOR - 0.25, z));
  const axles = L <= 10 ? [-0.3] : [-L * 0.05 - 1.45, -L * 0.05 + 1.45];
  for (const ax of axles) {
    g.add(tube(new THREE.Vector3(ax, 1.12, -2.95), new THREE.Vector3(ax, 1.12, 2.95), 0.12, m.chassis));
    for (const z of [-1, 1]) {
      g.add(box(2.4, 0.18, 0.28, m.chassis, ax, 1.62, z * 2.3));
      const wh = wheel(m);
      wh.position.set(ax, 1.12, z * 2.98);
      if (z < 0) wh.rotation.y = Math.PI;
      g.add(wh);
    }
  }

  // tongue, coupler, jack
  const tipX = L / 2;
  const coupler = new THREE.Vector3(tipX + 4.2, 1.95, 0);
  for (const z of [-1, 1]) g.add(beam(new THREE.Vector3(boxEnd - 0.4, FLOOR - 0.25, z * 2.2), coupler.clone().add(new THREE.Vector3(-0.3, 0, z * 0.2)), 0.32, m.chassis));
  g.add(box(0.9, 0.36, 0.42, m.chassis, coupler.x, coupler.y, 0, 0.08));
  g.add(box(0.5, 0.22, 0.36, m.aluminum, coupler.x + 0.45, coupler.y - 0.1, 0, 0.08));
  const jackX = tipX + 2.9;
  g.add(tube(new THREE.Vector3(jackX, 0.35, 0.55), new THREE.Vector3(jackX, 3.0, 0.55), 0.13, m.aluminum));
  g.add(box(0.6, 0.08, 0.6, m.chassis, jackX, 0.06, 0.55));
  g.add(box(0.5, 0.3, 0.3, m.chassis, jackX, 3.1, 0.55, 0.06));

  // HVAC condenser on a tongue platform
  if (cfg.hvac) {
    g.add(box(1.5, 0.12, 2.6, m.chassis, tipX + 1.35, 2.05, 0));
    g.add(box(1.4, 2.0, 2.4, m.hvac, tipX + 1.35, 3.1, 0, 0.12));
    const fan = mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.05, 40), m.grille);
    fan.rotation.z = Math.PI / 2;
    fan.position.set(tipX + 2.07, 3.1, 0);
    g.add(fan);
  }

  // roof solar
  const rows = Math.min(cfg.roofPanels / 2, roofRows(L));
  for (let i = 0; i < rows; i++) {
    const x = -L / 2 + 0.35 + PANEL_X / 2 + i * ROW_PITCH;
    for (const z of [-1, 1]) {
      const p = solarPanel(m);
      p.position.set(x, ROOF + 0.17, z * (PANEL_Z / 2 + 0.03));
      g.add(p);
    }
    for (const dx of [-PANEL_X / 2 + 0.6, PANEL_X / 2 - 0.6]) g.add(box(0.2, 0.1, W - 0.6, m.aluminum, x + dx, ROOF + 0.07, 0));
  }

  // solar wing: hinged on the street-side roof edge, folds back over the roof when stowed
  let wingPivot: THREE.Group | null = null;
  let wingStruts: THREE.Group | null = null;
  if (cfg.wing) {
    const wx = -L / 2 + 0.35 + 3.45;
    wingPivot = new THREE.Group();
    wingPivot.position.set(wx, ROOF + 0.38, -(hw + 0.06));
    for (const dx of [-1.72, 1.72]) {
      const p = mesh(new THREE.BoxGeometry(PANEL_Z, 0.1, PANEL_X), [m.aluminum, m.aluminum, m.pvTop, m.pvUnder, m.aluminum, m.aluminum]);
      p.position.set(dx, 0.06, -PANEL_X / 2);
      wingPivot.add(p);
    }
    wingPivot.add(beam(new THREE.Vector3(-3.4, 0, 0), new THREE.Vector3(3.4, 0, 0), 0.14, m.trim));
    g.add(wingPivot);
    wingStruts = new THREE.Group();
    for (const dx of [-3.1, 3.1]) {
      wingStruts.add(tube(new THREE.Vector3(wx + dx, 0.02, -(hw + 5.4)), new THREE.Vector3(wx + dx, ROOF + 0.3, -(hw + 5.4)), 0.07, m.aluminum));
      wingStruts.add(box(0.5, 0.06, 0.5, m.chassis, wx + dx, 0.03, -(hw + 5.4)));
    }
    g.add(wingStruts);
  }

  // telescoping light mast on the nose roof
  const mastStage: THREE.Object3D[] = [];
  let mastHead: THREE.Group | null = null;
  let mastLight: THREE.SpotLight | null = null;
  if (cfg.mast) {
    const mx = boxEnd + 0.55;
    g.add(box(0.9, 0.5, 0.9, m.trim, mx, ROOF + 0.25, 0, 0.08));
    const radii = [0.16, 0.12, 0.085];
    radii.forEach((r) => {
      const s = mesh(new THREE.CylinderGeometry(r, r, 3, 20), m.aluminum);
      s.position.set(mx, ROOF + 0.5, 0);
      g.add(s);
      mastStage.push(s);
    });
    mastHead = new THREE.Group();
    mastHead.position.set(mx, ROOF + 1.2, 0);
    mastHead.add(box(0.14, 0.14, 2.2, m.trim, 0, 0, 0));
    for (const y of [0.35, -0.35]) for (const z of [-0.6, 0.6]) {
      // lamp housing tilted forward and down, with a glowing face on its front
      const lampBody = box(0.22, 0.6, 0.95, m.trim, 0, y, z, 0.05);
      lampBody.rotation.z = -0.35;
      const face = mesh(new THREE.PlaneGeometry(0.85, 0.5), m.lamp, false);
      face.rotation.y = Math.PI / 2;
      face.position.x = 0.115;
      lampBody.add(face);
      mastHead.add(lampBody);
    }
    mastLight = new THREE.SpotLight('#f4f6ff', 0, 110, Math.PI / 4.4, 0.6, 1.1);
    mastLight.position.set(0.3, 0, 0);
    mastLight.castShadow = false;
    mastHead.add(mastLight);
    const aim = new THREE.Object3D();
    aim.position.set(30, -16, 0);
    mastHead.add(aim);
    mastLight.target = aim;
    g.add(mastHead);
  }

  // gear rail on the curb side, behind the door
  if (cfg.gearRail) {
    const x0 = -L / 2 + 0.7;
    const x1 = doorX - doorW / 2 - 0.5;
    if (x1 - x0 > 1) {
      for (const y of [FLOOR + 1.5, FLOOR + 2.3]) {
        g.add(tube(new THREE.Vector3(x0, y, hw + 0.24), new THREE.Vector3(x1, y, hw + 0.24), 0.05, m.aluminum));
      }
      const posts = Math.max(2, Math.round((x1 - x0) / 2.5) + 1);
      for (let i = 0; i < posts; i++) {
        const x = x0 + ((x1 - x0) * i) / (posts - 1);
        g.add(box(0.08, 1.1, 0.24, m.trim, x, FLOOR + 1.9, hw + 0.12));
      }
    }
  }

  // company decal on the street side
  let decal: THREE.Mesh | null = null;
  if (cfg.brand.trim()) {
    const span = Math.min(L - NOSE - 1.4, 14);
    const dh = span / 4;
    decal = mesh(new THREE.PlaneGeometry(span, dh), m.decal, false);
    decal.position.set(-L / 2 + 0.7 + span / 2, FLOOR + 3.6, -(hw + 0.015));
    decal.rotation.y = Math.PI;
    g.add(decal);
  }

  const dispose = () => {
    g.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).geometry.dispose();
    });
  };

  return { group: g, wingPivot, wingStruts, mastStage, mastHead, mastLight, decal, dispose };
}

/** Wing angle: 0 is deployed flat, PI is folded back over the roof. */
export function poseWing(parts: TrailerParts, t: number) {
  if (!parts.wingPivot) return;
  const open = 0;
  const stowed = Math.PI;
  parts.wingPivot.rotation.x = stowed + (open - stowed) * t;
  if (parts.wingStruts) {
    parts.wingStruts.visible = t > 0.97;
  }
}

/** Mast extension: t from 0 (stowed) to 1 (raised about 8 ft above the roof). */
export function poseMast(parts: TrailerParts, t: number) {
  if (!parts.mastHead) return;
  // three 3 ft stages; each one's top rises a share of the total extension
  const ext = t * 7.6;
  const n = parts.mastStage.length;
  parts.mastStage.forEach((s, i) => {
    s.position.y = ROOF + 0.9 + (ext * (i + 1)) / n - 1.5;
  });
  parts.mastHead.position.y = ROOF + 1.1 + ext;
}

export { decalTexture };
