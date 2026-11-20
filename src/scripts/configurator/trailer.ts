/**
 * Procedural 3D model of the SPOG Cargo trailer, built to match Nate's photos of the finished
 * black 20 ft (_photos-original/2026-11-17/Black Cargo Trailer). It's modeled in code, not CAD,
 * so treat it as a close stand-in until real 3D files exist.
 *
 * Sizes follow SPOG's price sheet (2026-11-20, see dims.ts): the 10 ft is 6.5 ft wide and the
 * 20 ft is 8 ft wide, and both run two axles. The 10 ft is drawn from the same parts, scaled down.
 *
 * Units are feet. Axes: +x is the front (V nose and tongue), +y is up, +z is the curb side.
 *   Curb side (+z):   entry door with a window, right behind the nose.
 *   Street side (-z): sliding window over the axles, a low two-door equipment compartment at the
 *                     front (it holds the AC or an air compressor, never call it storage).
 *   Rear (-x):        barn doors with twin chrome lock bars, four oval tail lights.
 *   Nose:             two flat panels with a black tread-plate stone guard, spare on the tongue.
 *   Wheels:           two axles under the body, outer faces flush with the walls, in aluminum radius fenders.
 *   Roof:             silver, with solar panels laid across it and a low vent over the nose.
 * The body is hollow with a finished interior, so the doors can open and the camera can go inside.
 * The inside follows Nate's Better Interior photos (same folder, rebuilt 2026-11-19): glossy white
 * wall panels with faint seams, a black diamond-plate angle where walls meet the ceiling, two rows of
 * black-rimmed puck lights, a smooth charcoal vinyl floor, a white nose wall with the climate control
 * head and a single-panel closet door, and open-cage battery units on the low white platforms that
 * box in the wheels. Every Cargo has the built-in front corner work desk, so it's always drawn.
 * Add-ons on the roof and tongue follow the price sheet: the 6 ft telescopic light (a light only)
 * and, on the 20 ft only, the 28 ft light tower with one camera, lights and a horn.
 * // SOURCE (price sheet 2026-11-20) and NATE (2026-11-20 answers)
 */
import * as THREE from 'three';
import { FLOOR, NOSE, PANEL_ALONG, PANEL_PITCH, WALL, axleCenter, gearFor, heightFor, panelAcross, roofFor, sideLength, widthFor } from './dims';

/**
 * What the buyer picked. The options follow SPOG's price sheet (2026-11-20) plus the extras Nate
 * kept that aren't on it (see data.ts). Cabinets, shelving, overhead storage, the small security
 * cameras and the horn and strobe system were removed. // NATE (2026-11-20 answers)
 */
export interface TrailerConfig {
  /** Which trailer. 'cargo' (the default) builds the Cargo. 'workstation' builds the white 20 ft
   *  Workstation from Nate's drone photos, or on the 10 ft the Cargo body with climate control. */
  kind?: 'cargo' | 'workstation';
  /** Workstation interior: white composite, or premium wood (20 ft only). */
  interior?: 'composite' | 'wood';
  length: number;
  paint: string;
  paintDark: boolean;
  matte: boolean;
  /** 5 kWh battery units, 1 to 4 (20 kWh is the most on any model). */
  batteryModules: number;
  doorsOpen: boolean;
  /** Logo spots as a sorted, comma-joined list: noseLeft, noseRight, left, right, rear. */
  logoSpots: string;
  brand: string;
  /** Width over height of the logo art, so the decal keeps its shape. */
  logoAspect: number;
  /** Climate control (heating and cooling), the wall head on the nose wall. */
  hvac: boolean;
  /** EXTRA desks, beyond the built-in front corner desk every Cargo has. */
  desks: number;
  benchLength: number;
  whiteboard: boolean;
  tv: boolean;
  fridge: boolean;
  microwave: boolean;
  counter: boolean;
  etrackWalls: boolean;
  etrackFloor: boolean;
  starlink: boolean;
  cellular: boolean;
  /** The 6 ft telescopic light at the nose: work lights only, no camera. */
  light6: boolean;
  /** The 28 ft light tower with one camera, lights and a horn. 20 ft only, so it's ignored on the 10 ft. */
  tower: boolean;
}

type Mat = THREE.Material;

// ---------------------------------------------------------------- textures

function canvasTexture(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void, color = true) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext('2d')!);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Tile a texture so one image covers `feet` of surface. Box and shape UVs here are in feet. */
function tile(tex: THREE.Texture, feet: number, feetV = feet) {
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1 / feet, 1 / feetV);
  return tex;
}

function diamondPlateTexture() {
  return canvasTexture(128, 128, (c) => {
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
  }, false);
}

function coinTexture() {
  return canvasTexture(64, 64, (c) => {
    c.fillStyle = '#5a5a5a';
    c.fillRect(0, 0, 64, 64);
    const g = c.createRadialGradient(32, 32, 2, 32, 32, 22);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.8, '#e0e0e0');
    g.addColorStop(1, '#5a5a5a');
    c.fillStyle = g;
    c.beginPath();
    c.arc(32, 32, 22, 0, Math.PI * 2);
    c.fill();
  }, false);
}

/**
 * Sheet aluminum is never dead flat. This is the faint, slow ripple that bends reflections across
 * each wall, as in the photos. It's a sum of whole-number waves, so it tiles without a seam, and
 * it's stored at half-float precision because an 8-bit height map this gentle shows as stripes.
 */
function rippleTexture() {
  const size = 128;
  const data = new Uint16Array(size * size);
  const waves = [[1, 0, 0.9, 0.3], [0, 1, 0.5, 1.1], [1, 1, 0.45, 2.0], [2, 1, 0.4, 0.7], [1, 2, 0.3, 4.1], [3, 0, 0.28, 5.2], [2, 3, 0.2, 3.3], [4, 1, 0.14, 1.7]];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    let h = 0;
    for (const [kx, ky, amp, phase] of waves) h += amp * Math.sin((Math.PI * 2 * (kx * x + ky * y)) / size + phase);
    data[y * size + x] = THREE.DataUtils.toHalfFloat(0.5 + h * 0.1);
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RedFormat, THREE.HalfFloatType);
  tex.magFilter = tex.minFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

/** Tire tread and sidewall rings. u runs around the tire, v across it from bead to bead. */
function tireTexture() {
  return canvasTexture(128, 256, (c) => {
    c.fillStyle = '#9a9a9a';
    c.fillRect(0, 0, 128, 256);
    // sidewall rings
    c.fillStyle = '#6f6f6f';
    for (const v of [34, 52, 204, 222]) c.fillRect(0, v, 128, 3);
    // tread: raised blocks cut by three grooves around and angled sipes across
    c.fillStyle = '#d2d2d2';
    c.fillRect(0, 92, 128, 72);
    c.fillStyle = '#1e1e1e';
    for (const v of [108, 126, 144]) c.fillRect(0, v, 128, 5);
    c.strokeStyle = '#1e1e1e';
    c.lineWidth = 5;
    for (let x = -32; x < 160; x += 32) {
      c.beginPath(); c.moveTo(x, 92); c.lineTo(x + 18, 110); c.stroke();
      c.beginPath(); c.moveTo(x + 18, 146); c.lineTo(x, 164); c.stroke();
    }
  }, false);
}

/** Seeded random numbers, so the procedural textures look the same on every load. */
function seeded(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Charcoal vinyl floor: smooth and matte, with a fine speckle and a few soft scuffs, the look of the
 * Better Interior photos (2026-11-19). Every model gets vinyl flooring (Nate, 2026-11-20: the sheet's
 * plywood and the earlier "rubber floor" were both wrong). // NATE (2026-11-20 answers)
 */
function vinylFloorTexture() {
  return canvasTexture(256, 256, (c) => {
    const rnd = seeded(7);
    c.fillStyle = '#2c2d30';
    c.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2600; i++) {
      const v = 34 + Math.floor(rnd() * 22);
      c.fillStyle = `rgba(${v},${v + 1},${v + 3},${0.35 + rnd() * 0.4})`;
      c.fillRect(rnd() * 256, rnd() * 256, 1 + rnd() * 1.4, 1 + rnd() * 1.4);
    }
    c.globalAlpha = 0.06;
    c.strokeStyle = '#8a8c90';
    for (let i = 0; i < 9; i++) {
      c.lineWidth = 1 + rnd() * 3;
      c.beginPath();
      const x = rnd() * 256, y = rnd() * 256;
      c.moveTo(x, y);
      c.quadraticCurveTo(x + rnd() * 60 - 30, y + rnd() * 40 - 20, x + rnd() * 90 - 45, y + rnd() * 50 - 25);
      c.stroke();
    }
  });
}

/**
 * Black E-track with its open slots. The slots show the white wall behind, as in the photos.
 * One image is one 2 in slot pitch along the rail and the full 5 in rail height.
 */
function etrackTexture() {
  return canvasTexture(48, 120, (c) => {
    c.fillStyle = '#121315';
    c.fillRect(0, 0, 48, 120);
    c.fillStyle = '#e9eaea';
    c.beginPath();
    c.roundRect(15, 26, 18, 68, 4);
    c.fill();
    c.fillStyle = '#3a3c40';
    c.fillRect(0, 8, 48, 3);
    c.fillRect(0, 109, 48, 3);
  });
}

/** The slots of a tie-down track, as a bump pattern. */
function slotTexture() {
  return canvasTexture(64, 48, (c) => {
    c.fillStyle = '#bdbdbd';
    c.fillRect(0, 0, 64, 48);
    c.fillStyle = '#1a1a1a';
    c.fillRect(22, 8, 20, 32);
  }, false);
}

/** Wood for the plank floor and the plywood walls. `planks` draws board gaps. */
function woodTexture(base: [number, number, number], planks: number) {
  return canvasTexture(512, 512, (c) => {
    const [r, g, b] = base;
    c.fillStyle = `rgb(${r},${g},${b})`;
    c.fillRect(0, 0, 512, 512);
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 420; i++) {
      const y = rnd() * 512;
      const shade = rnd() * 0.16 - 0.08;
      c.strokeStyle = `rgba(${shade > 0 ? 255 : 60},${shade > 0 ? 240 : 40},${shade > 0 ? 210 : 20},${Math.abs(shade) * 1.6})`;
      c.lineWidth = 0.6 + rnd() * 1.6;
      c.beginPath();
      c.moveTo(0, y);
      c.bezierCurveTo(170, y + rnd() * 8 - 4, 340, y + rnd() * 8 - 4, 512, y + rnd() * 6 - 3);
      c.stroke();
    }
    if (planks) {
      c.strokeStyle = 'rgba(40,26,12,.55)';
      c.lineWidth = 3;
      for (let i = 0; i <= planks; i++) {
        const y = (512 / planks) * i;
        c.beginPath(); c.moveTo(0, y); c.lineTo(512, y); c.stroke();
      }
    }
  });
}

/** All-black panel, as on the roof in the photos: dark cells, thin bus lines, black frame. */
function solarCellTexture() {
  return canvasTexture(640, 340, (c) => {
    c.fillStyle = '#07080b';
    c.fillRect(0, 0, 640, 340);
    const cols = 12;
    const rows = 6;
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      const x = 10 + (620 / cols) * i;
      const y = 10 + (320 / rows) * j;
      const g = c.createLinearGradient(x, y, x + 52, y + 54);
      g.addColorStop(0, '#12151d');
      g.addColorStop(1, '#0a0c11');
      c.fillStyle = g;
      c.fillRect(x + 1, y + 1, 620 / cols - 2, 320 / rows - 2);
    }
    c.strokeStyle = 'rgba(150,165,190,.16)';
    c.lineWidth = 1;
    for (let i = 0; i < cols * 4; i++) {
      const x = 10 + (620 / (cols * 4)) * i;
      c.beginPath(); c.moveTo(x, 10); c.lineTo(x, 330); c.stroke();
    }
    c.strokeStyle = '#15171b';
    c.lineWidth = 12;
    c.strokeRect(5, 5, 630, 330);
  });
}

/** The buyer's company name as a decal, until they upload their own logo art. */
export async function decalTexture(text: string, onDark: boolean) {
  try { await document.fonts.load('900 120px Montserrat'); } catch { /* fall back to whatever loaded */ }
  return canvasTexture(2048, 420, (c) => {
    c.clearRect(0, 0, 2048, 420);
    const label = text.trim().toUpperCase();
    let size = 250;
    c.font = `900 ${size}px Montserrat, Arial, sans-serif`;
    while (c.measureText(label).width > 1940 && size > 60) {
      size -= 6;
      c.font = `900 ${size}px Montserrat, Arial, sans-serif`;
    }
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillStyle = onDark ? '#f3f3f1' : '#141518';
    c.fillText(label, 1024, 215);
  });
}

// ---------------------------------------------------------------- materials

export function createMaterials() {
  const plate = tile(diamondPlateTexture(), 0.34);
  const plateFloor = tile(diamondPlateTexture(), 0.34);
  const coin = tile(coinTexture(), 0.16);
  const ripple = tile(rippleTexture(), 9, 7);
  const tread = tireTexture();
  tread.wrapS = tread.wrapT = THREE.RepeatWrapping;
  tread.repeat.set(44, 1);
  const planks = tile(woodTexture([166, 126, 76], 6), 4);
  const ply = tile(woodTexture([203, 168, 112], 0), 4);
  const loader = new THREE.TextureLoader();
  const logo = (src: string) => {
    const t = loader.load(src);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  };
  const decal = (extra: THREE.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial({ transparent: true, roughness: 0.55, metalness: 0, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4, depthWrite: false, ...extra });
  return {
    textures: { plate, plateFloor, coin, planks, ply, logoWhite: logo('/images/spog-logo-white.png'), logoDark: logo('/images/spog-logo-dark.png') },
    // Satin aluminum skin. A little clearcoat gives the long soft highlights of the studio look.
    paint: new THREE.MeshPhysicalMaterial({ color: '#141416', roughness: 0.34, metalness: 0.5, clearcoat: 0.6, clearcoatRoughness: 0.3, bumpMap: ripple, bumpScale: 3 }),
    seam: new THREE.MeshStandardMaterial({ color: '#050506', roughness: 0.6, metalness: 0.3, transparent: true, opacity: 0.55 }),
    trim: new THREE.MeshStandardMaterial({ color: '#1a1b1e', roughness: 0.46, metalness: 0.7, bumpMap: plate, bumpScale: 1.6 }),
    edge: new THREE.MeshStandardMaterial({ color: '#16171a', roughness: 0.5, metalness: 0.6 }),
    rivet: new THREE.MeshStandardMaterial({ color: '#2a2b2f', roughness: 0.35, metalness: 0.9 }),
    black: new THREE.MeshStandardMaterial({ color: '#111214', roughness: 0.55, metalness: 0.4 }),
    chassis: new THREE.MeshStandardMaterial({ color: '#0d0e10', roughness: 0.7, metalness: 0.4 }),
    aluminum: new THREE.MeshStandardMaterial({ color: '#c9ccd1', roughness: 0.32, metalness: 0.92 }),
    chrome: new THREE.MeshStandardMaterial({ color: '#e9ebee', roughness: 0.12, metalness: 1 }),
    roof: new THREE.MeshStandardMaterial({ color: '#d4d7db', roughness: 0.42, metalness: 0.75 }),
    glass: new THREE.MeshPhysicalMaterial({ color: '#07090c', roughness: 0.06, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.6 }),
    daylight: new THREE.MeshBasicMaterial({ color: '#f2f6fa' }),
    rubber: new THREE.MeshStandardMaterial({ color: '#151516', roughness: 0.86, metalness: 0, side: THREE.DoubleSide, bumpMap: tread, bumpScale: 5 }),
    rimBarrel: new THREE.MeshStandardMaterial({ color: '#0e0f11', roughness: 0.35, metalness: 0.85, side: THREE.DoubleSide }),
    spokeSide: new THREE.MeshStandardMaterial({ color: '#0e0f11', roughness: 0.3, metalness: 0.85 }),
    spokeFace: new THREE.MeshStandardMaterial({ color: '#d7dade', roughness: 0.2, metalness: 1 }),
    pvFrame: new THREE.MeshStandardMaterial({ color: '#0c0d0f', roughness: 0.45, metalness: 0.6 }),
    pvTop: new THREE.MeshPhysicalMaterial({ map: solarCellTexture(), roughness: 0.3, metalness: 0.2, clearcoat: 0.25, clearcoatRoughness: 0.2, envMapIntensity: 0.45 }),
    tail: new THREE.MeshStandardMaterial({ color: '#7a0c0c', emissive: '#d01208', emissiveIntensity: 0.35, roughness: 0.18, metalness: 0.2 }),
    marker: new THREE.MeshStandardMaterial({ color: '#9a5200', emissive: '#ff9a1a', emissiveIntensity: 0.45, roughness: 0.3 }),
    lamp: new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#fff4de', emissiveIntensity: 0.9, roughness: 0.3 }),
    top: new THREE.MeshPhysicalMaterial({ color: '#0d0d0f', roughness: 0.2, metalness: 0.2, clearcoat: 0.7 }),
    pack: new THREE.MeshStandardMaterial({ color: '#9da0a5', roughness: 0.45, metalness: 0.55 }),
    cable: new THREE.MeshStandardMaterial({ color: '#b3161a', roughness: 0.5, metalness: 0.1 }),
    track: new THREE.MeshStandardMaterial({ color: '#141518', roughness: 0.5, metalness: 0.6, bumpMap: tile(slotTexture(), 0.34, 0.26), bumpScale: 2 }),
    display: new THREE.MeshPhysicalMaterial({ color: '#0a0c10', roughness: 0.12, metalness: 0.3, clearcoat: 1 }),
    board: new THREE.MeshStandardMaterial({ color: '#fbfbfa', roughness: 0.22, metalness: 0 }),
    amber: new THREE.MeshStandardMaterial({ color: '#c46a00', emissive: '#ff8a00', emissiveIntensity: 0.5, roughness: 0.25, transparent: true, opacity: 0.92 }),
    screen: new THREE.MeshStandardMaterial({ color: '#0d1a14', emissive: '#58e39a', emissiveIntensity: 0.9, roughness: 0.3 }),
    gold: new THREE.MeshStandardMaterial({ color: '#EEA114', roughness: 0.4, metalness: 0.3 }),
    equipment: new THREE.MeshStandardMaterial({ color: '#f0f0ee', roughness: 0.5, metalness: 0.1 }),
    graphite: new THREE.MeshStandardMaterial({ color: '#2a2c30', roughness: 0.5, metalness: 0.5 }),
    steel: new THREE.MeshStandardMaterial({ color: '#3a3d42', roughness: 0.45, metalness: 0.7 }),
    benchTop: new THREE.MeshStandardMaterial({ map: planks, color: '#d8ccbc', roughness: 0.6, metalness: 0 }),
    // Interior, rebuilt from the Better Interior photos (2026-11-19): glossy white wall panels with
    // faint seams, a white ceiling, a smooth charcoal vinyl floor and open-slot black E-track.
    liner: new THREE.MeshStandardMaterial({ color: '#f2f3f2', roughness: 0.3, metalness: 0.02, envMapIntensity: 0.85 }),
    joint: new THREE.MeshStandardMaterial({ color: '#a9abaf', roughness: 0.5, metalness: 0.2, transparent: true, opacity: 0.2 }),
    ceiling: new THREE.MeshStandardMaterial({ color: '#eceeed', roughness: 0.48, metalness: 0.02, side: THREE.DoubleSide, envMapIntensity: 0.75 }),
    floor: new THREE.MeshStandardMaterial({ map: tile(vinylFloorTexture(), 3.2), roughness: 0.62, metalness: 0, envMapIntensity: 0.6 }),
    etrack: new THREE.MeshStandardMaterial({ map: tile(etrackTexture(), 1 / 6, 5 / 12), roughness: 0.42, metalness: 0.45 }),
    cage: new THREE.MeshStandardMaterial({ color: '#b7babe', roughness: 0.42, metalness: 0.72 }),
    module: new THREE.MeshStandardMaterial({ color: '#e7e8e6', roughness: 0.55, metalness: 0.05 }),
    logo: decal(),
    brand: decal(),
    // The Workstation (2026-11-20, from Nate's drone photos and the interior photos): gloss charcoal
    // fenders, a white roof deck, and the premium wood interior's oak walls, walnut ceiling, black
    // casework and warm light strip.
    fender: new THREE.MeshPhysicalMaterial({ color: '#1c1d20', roughness: 0.35, metalness: 0.3, clearcoat: 0.5, clearcoatRoughness: 0.3 }),
    roofWhite: new THREE.MeshStandardMaterial({ color: '#eceeed', roughness: 0.5, metalness: 0.1 }),
    veneer: new THREE.MeshStandardMaterial({ map: (() => { const t = tile(woodTexture([196, 140, 80], 0), 4); t.rotation = Math.PI / 2; return t; })(), roughness: 0.35, metalness: 0 }),
    walnut: new THREE.MeshStandardMaterial({ map: tile(woodTexture([110, 70, 40], 0), 4), roughness: 0.4, metalness: 0, side: THREE.DoubleSide }),
    casework: new THREE.MeshStandardMaterial({ color: '#18181a', roughness: 0.75, metalness: 0.05 }),
    amberStrip: new THREE.MeshStandardMaterial({ color: '#ffb366', emissive: '#ff9a3c', emissiveIntensity: 1.2, roughness: 0.4 }),
  };
}
export type Materials = ReturnType<typeof createMaterials>;

/** Recolor in place for everything that doesn't change the shape. */
export function applyFinish(m: Materials, cfg: TrailerConfig) {
  m.paint.color.set(cfg.paint);
  // Matte Black drops the clearcoat and scatters its reflections. Every other color is satin.
  m.paint.roughness = cfg.matte ? 0.8 : 0.4;
  m.paint.metalness = cfg.matte ? 0.1 : 0.32;
  m.paint.clearcoat = cfg.matte ? 0 : 0.8;
  m.paint.clearcoatRoughness = 0.13;
  // Satin black shows seams as faint lines. On light paint they read as darker joints.
  m.seam.color.set(cfg.paintDark ? '#050506' : '#2a2b2e');
  m.seam.opacity = cfg.paintDark ? 0.55 : 0.28;
  m.logo.map = cfg.paintDark ? m.textures.logoWhite : m.textures.logoDark;
  m.logo.needsUpdate = true;
}

// ---------------------------------------------------------------- helpers

/** Box with UVs in feet, so tiled textures keep their scale on any size. Faces: +x -x +y -y +z -z. */
function box(w: number, h: number, d: number, mat: Mat | Mat[], x = 0, y = 0, z = 0) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const uv = geo.attributes.uv;
  const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let i = 0; i < 4; i++) {
    const k = f * 4 + i;
    uv.setXY(k, uv.getX(k) * dims[f][0], uv.getY(k) * dims[f][1]);
  }
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

type Face = 'px' | 'nx' | 'py' | 'ny' | 'pz' | 'nz';
const faces = (base: Mat, over: Partial<Record<Face, Mat>>) =>
  (['px', 'nx', 'py', 'ny', 'pz', 'nz'] as Face[]).map((f) => over[f] ?? base);

function cyl(r: number, len: number, mat: Mat, x: number, y: number, z: number, axis: 'x' | 'y' | 'z' = 'y', seg = 20) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, seg), mat);
  if (axis === 'x') mesh.rotation.z = Math.PI / 2;
  if (axis === 'z') mesh.rotation.x = Math.PI / 2;
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function plane(w: number, h: number, mat: Mat, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  mesh.position.set(x, y, z);
  return mesh;
}

/** A rectangular frame of four bars, lying in the local xy plane and centered on the origin. */
function frame(w: number, h: number, bar: number, depth: number, mat: Mat) {
  const g = new THREE.Group();
  g.add(box(w, bar, depth, mat, 0, h / 2 - bar / 2, 0), box(w, bar, depth, mat, 0, -h / 2 + bar / 2, 0));
  g.add(box(bar, h - bar * 2, depth, mat, -w / 2 + bar / 2, 0, 0), box(bar, h - bar * 2, depth, mat, w / 2 - bar / 2, 0, 0));
  return g;
}

/** Oval tail light, facing -x. */
function ovalLight(m: Materials, w: number, h: number) {
  const g = new THREE.Group();
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.05, 28), m.tail);
  lens.rotation.z = Math.PI / 2;
  lens.scale.set(h, 1, w);
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.03, 28), m.chrome);
  ring.rotation.z = Math.PI / 2;
  ring.scale.set(h + 0.07, 1, w + 0.07);
  ring.position.x = 0.012;
  g.add(ring, lens);
  return g;
}

// ---------------------------------------------------------------- wheels and fenders

const TIRE_R = 1.1;

/** A wheel with its outer face toward +z. Black barrel, eight split spokes with machined faces. */
function wheel(m: Materials) {
  const g = new THREE.Group();
  // A smooth cross-section: bead, bulged sidewall, rounded shoulder, flat tread, and back.
  const half: [number, number][] = [[0.64, 0.25], [0.68, 0.285], [0.76, 0.31], [0.86, 0.322], [0.95, 0.318], [1.02, 0.3], [1.065, 0.265], [1.09, 0.215], [1.1, 0.15], [1.1, 0.05]];
  const prof = [...half.map(([r, a]) => [r, -a]), ...half.map(([r, a]) => [r, a]).reverse()].map(([r, a]) => new THREE.Vector2(r, a));
  const tire = new THREE.Mesh(new THREE.LatheGeometry(prof, 72), m.rubber);
  tire.rotation.x = Math.PI / 2;
  tire.castShadow = true;
  g.add(tire);

  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.64, 0.64, 0.52, 44, 1, true), m.rimBarrel);
  barrel.rotation.x = Math.PI / 2;
  g.add(barrel);
  const back = new THREE.Mesh(new THREE.CircleGeometry(0.64, 40), m.rimBarrel);
  back.position.z = -0.08;
  g.add(back);
  const lip = new THREE.Mesh(new THREE.TorusGeometry(0.612, 0.03, 10, 56), m.spokeFace);
  lip.position.z = 0.245;
  g.add(lip);

  const spokeMat = faces(m.spokeSide, { pz: m.spokeFace });
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    for (const s of [-1, 1]) {
      const a0 = a + s * 0.07;
      const a1 = a + s * 0.19;
      const x0 = Math.cos(a0) * 0.15, y0 = Math.sin(a0) * 0.15;
      const x1 = Math.cos(a1) * 0.6, y1 = Math.sin(a1) * 0.6;
      const spoke = box(Math.hypot(x1 - x0, y1 - y0), 0.05, 0.07, spokeMat, (x0 + x1) / 2, (y0 + y1) / 2, 0.19);
      spoke.rotation.z = Math.atan2(y1 - y0, x1 - x0);
      g.add(spoke);
    }
  }
  g.add(cyl(0.2, 0.1, m.spokeSide, 0, 0, 0.19, 'z', 28));
  g.add(cyl(0.085, 0.16, m.spokeFace, 0, 0, 0.2, 'z', 20));
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    g.add(cyl(0.024, 0.14, m.chrome, Math.cos(a) * 0.14, Math.sin(a) * 0.14, 0.2, 'z', 8));
  }
  return g;
}

/** The corner radius of a wheel arch. */
const ARCH_R = 0.8;

/**
 * An arch-shaped band: the outline of a wheel arch `len` long from `bottom` up to `top`, with
 * rounded top corners of radius `r`, and a band `t` thick running inside that outline.
 */
function archBand(len: number, bottom: number, top: number, r: number, t: number) {
  const s = new THREE.Shape();
  s.moveTo(-len / 2, bottom);
  s.lineTo(-len / 2, top - r);
  s.absarc(-len / 2 + r, top - r, r, Math.PI, Math.PI / 2, true);
  s.lineTo(len / 2 - r, top);
  s.absarc(len / 2 - r, top - r, r, Math.PI / 2, 0, true);
  s.lineTo(len / 2, bottom);
  s.lineTo(len / 2 - t, bottom);
  s.lineTo(len / 2 - t, top - r);
  s.absarc(len / 2 - r, top - r, r - t, 0, Math.PI / 2, false);
  s.lineTo(-len / 2 + r, top - t);
  s.absarc(-len / 2 + r, top - r, r - t, Math.PI / 2, Math.PI, false);
  s.lineTo(-len / 2 + t, bottom);
  s.closePath();
  return s;
}

/**
 * Aluminum radius fender around a wheel arch, as on the black Cargo and in Nate's close-up
 * (2026-11-20): the wheels sit under the body, flush with the wall, so the fender is a trim that
 * follows the arch cut into the wall. A narrow band lines the arch, rolled at its outer edge, with
 * a flat flange on the wall around it. Local x is centered on the arch, the wall's outer face is
 * at z = 0 and +z points outward.
 */
function archTrim(m: Materials, len: number, bottom: number, top: number, flange = 0.2, mat: Mat = m.aluminum) {
  const g = new THREE.Group();
  const part = (shape: THREE.Shape, depth: number, z: number) => {
    const p = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 20 }), mat);
    p.position.z = z;
    p.castShadow = true;
    p.receiveShadow = true;
    g.add(p);
  };
  part(archBand(len, bottom, top, ARCH_R, 0.06), 0.34, -0.24); // lines the arch
  part(archBand(len + 0.08, bottom, top + 0.04, ARCH_R + 0.04, 0.1), 0.06, 0.04); // rolled edge
  // flange on the wall, 0.2 ft wide as built, narrower on the 10 ft so it clears the rear corner and the door
  part(archBand(len + flange * 2, bottom, top + flange, ARCH_R + flange, flange), 0.035, 0.002);
  return g;
}

// ---------------------------------------------------------------- the trailer

/** The body's size and the inside camera, so the stage can frame any trailer (scene.ts). */
export interface Body {
  /** Overall body length, rear face to front face. */
  length: number;
  W: number;
  H: number;
  floor: number;
  roof: number;
  /** Where the wheels view looks. */
  wheels: THREE.Vector3;
  eye: THREE.Vector3;
  look: THREE.Vector3;
}

export interface TrailerParts {
  group: THREE.Group;
  body: Body;
  /** Other doors that swing like the side door (the Workstation's second curb door). */
  moreDoors?: THREE.Object3D[];
  barn: THREE.Object3D[];
  ramp: THREE.Object3D | null;
  sideDoor: THREE.Object3D;
  rampAngle: number;
  /** Points for the on-screen callouts, in world space. */
  anchors: Record<string, THREE.Vector3>;
  /** Picked items the preview had no room for, so the page can say so. */
  skipped: string[];
  /** True when something stands well above the roof, so the camera backs off. */
  tall: boolean;
  /** Height of the highest part off the ground, in feet, so the camera can back off far enough. */
  top: number;
  dispose: () => void;
}

export function buildTrailer(cfg: TrailerConfig, m: Materials): TrailerParts {
  // The 20 ft Workstation has its own body. The 10 ft Workstation is the 10 ft Cargo with climate
  // control included (SOURCE price sheet 2026-11-20), so it takes the Cargo path with hvac on.
  if (cfg.kind === 'workstation') {
    if (cfg.length >= 16) return buildWorkstation20(cfg, m);
    cfg = { ...cfg, hvac: true, interior: 'composite' };
  }
  const g = new THREE.Group();
  const L = cfg.length;
  // Width, height and running gear depend on the length (dims.ts). // SOURCE (price sheet 2026-11-20)
  const W = widthFor(L);
  const H = heightFor(L);
  const ROOF = roofFor(L);
  const gear = gearFor(L);
  const S = sideLength(L);
  const xr = -L / 2;          // rear face
  const xf = L / 2 - NOSE;    // where the flat sides meet the nose
  const tip = L / 2;          // point of the V
  const yc = FLOOR + H / 2;
  const y0 = FLOOR + 0.14;    // top of the floor
  const zi = W / 2 - WALL;    // inside face of a side wall
  const out = W / 2 + 0.02;   // just proud of a side wall
  const spots = new Set(cfg.brand ? cfg.logoSpots.split(',') : []);
  const aspect = cfg.logoAspect || 4.876;

  const paintOut = (outward: Face, inward: Face) => faces(m.edge, { [outward]: m.paint, [inward]: m.liner });

  // Running gear first, because the wheel arches cut into the floor and the side walls. The wheels
  // sit under the body with their outer faces flush with the walls, inside aluminum radius fenders,
  // and a boxed wheel well covers each set inside: the low white platforms the batteries stand on
  // in the Better Interior photos. Nate corrected the outboard wheels on 2026-11-20. Every size
  // runs two axles, the 10 ft too (price sheet, 2026-11-20). // SOURCE (price sheet 2026-11-20)
  const axleX = xf - axleCenter(L);
  const axles = [axleX - gear.spread, axleX + gear.spread];
  const fenderLen = gear.fender;
  const archX0 = axleX - fenderLen / 2;
  const archX1 = axleX + fenderLen / 2;
  const archTop = TIRE_R * 2 + 0.1;
  const wz = W / 2 + 0.02 - 0.322; // wheel center, so the tire's outer face sits flush with the wall
  const wellZ = wz - 0.322 - 0.08; // face of the wheel well, just inboard of the tire
  const inArch = (x: number, pad = 0) => x > archX0 - pad && x < archX1 + pad;

  // ------------------------------------------------------------ floor, roof, ceiling
  // The floor is notched around the wheels. The roof and ceiling keep the full outline.
  const floorPrint = new THREE.Shape();
  floorPrint.moveTo(xr, -W / 2);
  for (const [x, z] of [[archX0, -W / 2], [archX0, -wellZ], [archX1, -wellZ], [archX1, -W / 2], [xf, -W / 2], [tip, 0], [xf, W / 2], [archX1, W / 2], [archX1, wellZ], [archX0, wellZ], [archX0, W / 2], [xr, W / 2]]) floorPrint.lineTo(x, z);
  floorPrint.closePath();
  const footprint = new THREE.Shape();
  footprint.moveTo(xr, -W / 2);
  footprint.lineTo(xf, -W / 2);
  footprint.lineTo(tip, 0);
  footprint.lineTo(xf, W / 2);
  footprint.lineTo(xr, W / 2);
  footprint.closePath();
  const slab = (shape: THREE.Shape, depth: number, y: number, mat: Mat) => {
    const s = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false }), mat);
    s.rotation.x = -Math.PI / 2;
    s.position.y = y;
    s.castShadow = true;
    s.receiveShadow = true;
    return s;
  };
  g.add(slab(floorPrint, 0.13, FLOOR, m.chassis), slab(footprint, 0.1, ROOF - 0.1, m.roof));
  const floorTop = new THREE.Mesh(new THREE.ShapeGeometry(floorPrint), m.floor);
  floorTop.rotation.x = -Math.PI / 2;
  floorTop.position.y = y0;
  floorTop.receiveShadow = true;
  const ceiling = new THREE.Mesh(new THREE.ShapeGeometry(footprint), m.ceiling);
  ceiling.rotation.x = -Math.PI / 2;
  ceiling.position.y = ROOF - 0.11;
  g.add(floorTop, ceiling);

  // ------------------------------------------------------------ side walls, with the wheel arches
  /** A side wall from x0 to x1 (the arch lies between them), the arch cut out of its bottom edge. */
  const sideWall = (x0: number, x1: number, sz: number) => {
    const skin = sz > 0 ? paintOut('pz', 'nz') : paintOut('nz', 'pz');
    const cz = sz * (W / 2 - WALL / 2);
    g.add(box(archX0 - x0, H, WALL, skin, (x0 + archX0) / 2, yc, cz));
    g.add(box(x1 - archX1, H, WALL, skin, (archX1 + x1) / 2, yc, cz));
    // over the arch: the wall from the roof down to the arch, in two skins (paint out, liner in)
    const s = new THREE.Shape();
    s.moveTo(archX0, archTop - ARCH_R);
    s.lineTo(archX0, ROOF);
    s.lineTo(archX1, ROOF);
    s.lineTo(archX1, archTop - ARCH_R);
    s.absarc(archX1 - ARCH_R, archTop - ARCH_R, ARCH_R, 0, Math.PI / 2, false);
    s.lineTo(archX0 + ARCH_R, archTop);
    s.absarc(archX0 + ARCH_R, archTop - ARCH_R, ARCH_R, Math.PI / 2, Math.PI, false);
    const skins: [Mat, number][] = sz > 0 ? [[m.paint, W / 2 - WALL / 2], [m.liner, W / 2 - WALL]] : [[m.paint, -W / 2], [m.liner, -W / 2 + WALL / 2]];
    for (const [mat, z] of skins) {
      const p = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: WALL / 2, bevelEnabled: false, curveSegments: 16 }), [mat, m.edge]);
      p.position.z = z;
      p.castShadow = true;
      p.receiveShadow = true;
      g.add(p);
    }
  };

  // ------------------------------------------------------------ street-side wall (-z)
  sideWall(xr, xf, -1);

  // ------------------------------------------------------------ curb-side wall (+z), with the door opening
  // 35 in wide on the 20 ft as built, 30 in on the 10 ft so the two axles fit behind it (dims.ts).
  // The opening keeps the same header under the roof on both heights.
  const dw = gear.door;
  const dh = H - 1.25;
  const doorFront = xf - 0.14;
  const doorRear = doorFront - dw;
  const doorBottom = FLOOR + 0.6;
  const doorTop = doorBottom + dh;
  const cz = W / 2 - WALL / 2;
  sideWall(xr, doorRear, 1);
  g.add(box(dw, ROOF - doorTop, WALL, paintOut('pz', 'nz'), doorRear + dw / 2, (ROOF + doorTop) / 2, cz));
  g.add(box(dw, doorBottom - FLOOR, WALL, paintOut('pz', 'nz'), doorRear + dw / 2, (FLOOR + doorBottom) / 2, cz));
  g.add(box(xf - doorFront, H, WALL, paintOut('pz', 'nz'), (xf + doorFront) / 2, yc, cz));
  // aluminum frame around the opening, as in the photos
  const doorFrame = frame(dw + 0.16, dh + 0.16, 0.08, 0.05, m.aluminum);
  doorFrame.position.set(doorRear + dw / 2, doorBottom + dh / 2, out);
  g.add(doorFrame);

  // the door itself, hinged on its front edge
  const sideDoor = new THREE.Group();
  sideDoor.position.set(doorFront, doorBottom, W / 2 - 0.02);
  {
    const panel = box(dw - 0.04, dh - 0.04, 0.09, paintOut('pz', 'nz'), -dw / 2, dh / 2, 0);
    sideDoor.add(panel);
    // 1.7 ft glass on the 35 in door as built, narrower on the 10 ft's 30 in door so it clears the lever
    const gw = dw - 1.2, gh = 2.7, gy = dh - 0.5 - gh / 2;
    const glassFrame = frame(gw + 0.16, gh + 0.16, 0.08, 0.03, m.black);
    glassFrame.position.set(-dw / 2, gy, 0.055);
    sideDoor.add(glassFrame, plane(gw, gh, m.glass, -dw / 2, gy, 0.052));
    const inside = plane(gw, gh, m.daylight, -dw / 2, gy, -0.05);
    inside.rotation.y = Math.PI;
    const insideFrame = frame(gw + 0.16, gh + 0.16, 0.08, 0.02, m.black);
    insideFrame.position.set(-dw / 2, gy, -0.05);
    sideDoor.add(inside, insideFrame);
    // lever handle and latch plate on the rear edge
    sideDoor.add(box(0.14, 0.42, 0.03, m.black, -dw + 0.2, dh * 0.47, 0.06));
    sideDoor.add(box(0.34, 0.06, 0.05, m.black, -dw + 0.33, dh * 0.47, 0.1));
    sideDoor.add(box(0.14, 0.42, 0.03, m.black, -dw + 0.2, dh * 0.47, -0.06));
    // hinges on the front edge
    for (const hy of [0.7, dh / 2, dh - 0.7]) sideDoor.add(box(0.07, 0.3, 0.05, m.aluminum, -0.03, hy, 0.06));
  }
  g.add(sideDoor);

  // ------------------------------------------------------------ V nose
  const Ln = Math.hypot(NOSE, W / 2);
  const th = Math.atan2(W / 2, NOSE);
  for (const sz of [1, -1]) {
    // Local +z is outward on both panels. `corner` is the local x of the end at the body corner.
    const n = new THREE.Group();
    n.position.set(xf + NOSE / 2, 0, (sz * W) / 4);
    n.rotation.y = sz > 0 ? th : Math.PI - th;
    const corner = sz > 0 ? -1 : 1;
    n.add(box(Ln, H, WALL, paintOut('pz', 'nz'), 0, yc, -WALL / 2));
    n.add(box(Ln, 0.3, 0.035, m.trim, 0, ROOF - 0.15, 0.018));
    n.add(box(Ln, 1.5, 0.035, m.trim, 0, FLOOR + 0.75, 0.018)); // stone guard
    n.add(box(0.014, H - 1.8, 0.008, m.seam, 0, FLOOR + 1.5 + (H - 1.8) / 2, 0.004));
    const mark = plane(1.02, 0.306, m.logo, corner * (Ln / 2 - 0.42), ROOF - 1.02, 0.012);
    mark.rotation.z = -Math.PI / 2;
    n.add(mark);
    if (spots.has(sz > 0 ? 'noseRight' : 'noseLeft')) {
      const bw = Math.min(2.5, 1.5 * aspect);
      n.add(plane(bw, bw / aspect, m.brand, corner * -0.28, FLOOR + 4.3, 0.012));
    }
    // amber markers at the top corners
    n.add(cyl(0.035, 0.03, m.marker, corner * (Ln / 2 - 0.3), ROOF - 0.42, 0.012, 'z', 12));
    n.add(cyl(0.035, 0.03, m.marker, corner * (Ln / 2 - 0.3), FLOOR + 0.2, 0.03, 'z', 12));
    if (sz > 0) {
      // three hooded outlets above the stone guard, as on the curb-side panel
      [-0.95, 0, 0.95].forEach((ox, i) => {
        n.add(box(0.2, 0.28, 0.07, i === 1 ? m.aluminum : m.black, ox, FLOOR + 1.72, 0.04));
      });
    } else {
      n.add(box(0.26, 0.26, 0.05, m.aluminum, corner * (Ln / 2 - 1.3), FLOOR + 1.75, 0.03));
      n.add(cyl(0.05, 0.05, m.black, corner * (Ln / 2 - 0.75), FLOOR + 1.75, 0.03, 'z', 12));
    }
    g.add(n);
  }
  // corner posts: tread plate wrapped around the three nose edges
  g.add(cyl(0.085, H, m.trim, tip - 0.03, yc, 0));
  for (const sz of [1, -1]) g.add(cyl(0.08, H, m.trim, xf, yc, sz * (W / 2 - 0.03)));

  // ------------------------------------------------------------ side trim, seams and markers
  const winBottom = ROOF - 1.05 - 2.0 - 0.1; // bottom of the street-side window's frame (see below)
  for (const sz of [1, -1]) {
    g.add(box(S, 0.3, 0.035, m.trim, xr + S / 2, ROOF - 0.15, sz * out));
    // bottom rail, broken by the wheel arch and its fender flange
    const a0 = archX0 - gear.flange - 0.02, a1 = archX1 + gear.flange + 0.02;
    g.add(box(a0 - xr, 0.26, 0.035, m.trim, (xr + a0) / 2, FLOOR + 0.13, sz * out));
    g.add(box(xf - a1, 0.26, 0.035, m.trim, (a1 + xf) / 2, FLOOR + 0.13, sz * out));
    g.add(box(0.2, H, 0.035, m.trim, xr + 0.1, yc, sz * out));
    for (let x = xr + 4; x < xf - 0.6; x += 4) {
      if (sz > 0 && x > doorRear - 0.2) continue;
      // over the arch, a seam starts above the fender
      const y1 = inArch(x, 0.3) ? archTop + 0.3 : FLOOR + 0.26;
      const y2 = ROOF - 0.3;
      g.add(box(0.014, y2 - y1, 0.008, m.seam, x, (y1 + y2) / 2, sz * (W / 2 + 0.004)));
    }
    for (let x = xr + 2; x < xf; x += 4) g.add(cyl(0.03, 0.03, m.marker, x, ROOF - 0.4, sz * (W / 2 + 0.012), 'z', 10));
    g.add(cyl(0.035, 0.03, m.tail, xr + 0.35, ROOF - 0.4, sz * (W / 2 + 0.03), 'z', 10));
    // SPOG logo high at the rear of each side
    const logo = plane(2.0, 0.6, m.logo, xr + 1.55, ROOF - 1.08, sz * (W / 2 + 0.012));
    if (sz < 0) logo.rotation.y = Math.PI;
    g.add(logo);
    if (spots.has(sz > 0 ? 'right' : 'left')) {
      // Kept between the top of the fender and the bottom of the street-side window, on both sides
      // so they match. On the shorter 10 ft the window comes lower, so the decal sits lower too.
      const room = Math.min(S * 0.5, 9);
      const bh = Math.min(2.2, room / aspect, winBottom - 0.15 - (archTop + gear.flange + 0.1));
      const by = Math.min(FLOOR + 3.25, winBottom - 0.15 - bh / 2);
      const brand = plane(bh * aspect, bh, m.brand, xr + 0.9 + room / 2, by, sz * (W / 2 + 0.012));
      if (sz < 0) brand.rotation.y = Math.PI;
      g.add(brand);
    }
  }

  // small fasteners along the top and bottom rails, as one instanced mesh
  {
    const pts: [number, number, number][] = [];
    for (const sz of [1, -1]) for (let x = xr + 0.5; x < xf - 0.2; x += 0.72) {
      pts.push([x, ROOF - 0.07, sz * (out + 0.02)]);
      if (!inArch(x, 0.3)) pts.push([x, FLOOR + 0.2, sz * (out + 0.02)]);
    }
    const rivets = new THREE.InstancedMesh(new THREE.SphereGeometry(0.022, 8, 6), m.rivet, pts.length);
    const mat4 = new THREE.Matrix4();
    pts.forEach(([x, y, z], i) => rivets.setMatrixAt(i, mat4.makeTranslation(x, y, z)));
    g.add(rivets);
  }

  // ------------------------------------------------------------ street side: window and hatch
  // The window sits over the axles. On the 10 ft it moves forward to clear the logo.
  const winX = Math.max(axleX, xr + 4.9);
  {
    const ww = 3.6, wh = 2.0;
    const wy = ROOF - 1.05 - wh / 2;
    const win = new THREE.Group();
    win.position.set(winX, wy, -W / 2);
    const outerFrame = frame(ww + 0.2, wh + 0.2, 0.1, 0.05, m.aluminum);
    outerFrame.position.z = -0.03;
    const pane = plane(ww, wh, m.glass, 0, 0, -0.035);
    pane.rotation.y = Math.PI;
    win.add(outerFrame, pane, box(0.06, wh, 0.05, m.aluminum, 0, 0, -0.035));
    const innerFrame = frame(ww + 0.2, wh + 0.2, 0.1, 0.03, m.black);
    innerFrame.position.z = WALL + 0.012;
    win.add(innerFrame, plane(ww, wh, m.daylight, 0, 0, WALL + 0.01), box(0.05, wh, 0.03, m.black, 0, 0, WALL + 0.014));
    g.add(win);
  }
  // The equipment compartment, low at the front of the street side (it holds the AC or an air
  // compressor, so it's never called storage).
  const hw = Math.min(4.4, S * 0.3);
  const hatchRear = xf - 0.22 - hw;
  {
    const hh = 2.1;
    const hatch = new THREE.Group();
    hatch.position.set(xf - 0.22 - hw / 2, FLOOR + 0.42 + hh / 2, -out);
    const outer = frame(hw, hh, 0.09, 0.05, m.aluminum);
    hatch.add(outer, box(0.09, hh, 0.05, m.aluminum, 0, 0, 0));
    for (const s of [-1, 1]) hatch.add(box(hw / 2 - 0.16, hh - 0.2, 0.03, faces(m.edge, { nz: m.paint }), s * (hw / 4 - 0.01), 0, 0));
    hatch.add(box(0.14, 0.14, 0.03, m.chrome, -0.2, 0, -0.03));
    g.add(hatch);
  }

  // ------------------------------------------------------------ rear frame
  const sill = 0.35;
  const header = 0.55;
  const post = 0.75;
  const openW = W - post * 2;
  const openH = H - sill - header;
  const rearFace = faces(m.edge, { nx: m.paint, px: m.liner });
  for (const sz of [1, -1]) {
    g.add(box(0.14, H, post, rearFace, xr + 0.07, yc, sz * (W / 2 - post / 2)));
    g.add(box(0.03, H, 0.14, m.trim, xr - 0.01, yc, sz * (W / 2 - 0.07)));
    for (const ly of [FLOOR + 1.63, ROOF - 1.65]) {
      const light = ovalLight(m, 0.2, 0.5);
      light.position.set(xr - 0.02, ly, sz * (W / 2 - 0.45));
      g.add(light);
    }
  }
  g.add(box(0.14, header, openW, rearFace, xr + 0.07, ROOF - header / 2, 0));
  g.add(box(0.03, 0.3, W, m.trim, xr - 0.01, ROOF - 0.15, 0));
  g.add(box(0.16, sill, openW, m.trim, xr + 0.07, FLOOR + sill / 2, 0));
  for (const lz of [-0.36, 0, 0.36]) g.add(cyl(0.03, 0.03, m.tail, xr - 0.03, ROOF - 0.42, lz, 'x', 10));
  // license plate low on the street side
  g.add(box(0.02, 0.58, 1.08, m.black, xr - 0.035, FLOOR + 0.36, -(W / 2 - 0.6)));
  g.add(box(0.02, 0.48, 0.98, m.equipment, xr - 0.045, FLOOR + 0.36, -(W / 2 - 0.6)));

  // ------------------------------------------------------------ rear doors
  const doorY = FLOOR + sill;
  const barn: THREE.Object3D[] = [];
  const lockBar = (len: number, z: number) => {
    const bar = new THREE.Group();
    bar.add(cyl(0.035, len, m.chrome, -0.1, len / 2 - 0.12, z, 'y', 14));
    for (const t of [0.04, 0.3, 0.7, 0.96]) bar.add(box(0.07, 0.1, 0.18, m.chrome, -0.085, len * t - 0.12 + 0.05, z));
    return bar;
  };
  {
    const lw = openW / 2;
    for (const sz of [1, -1]) {
      // Pivot on the outer edge. The door reaches from there to the center line.
      const door = new THREE.Group();
      door.position.set(xr - 0.03, doorY, sz * (openW / 2));
      const dir = -sz;
      door.add(box(0.1, openH - 0.03, lw - 0.02, faces(m.edge, { nx: m.paint, px: m.liner }), 0, openH / 2, dir * (lw / 2)));
      door.add(lockBar(openH + 0.2, dir * (lw - 0.36)));
      // handle, swung toward the hinge side
      door.add(box(0.03, 0.07, 0.95, m.chrome, -0.13, openH * 0.49, dir * (lw - 0.36 - 0.5)));
      door.add(box(0.05, 0.09, 0.4, m.black, -0.135, openH * 0.49, dir * (lw - 0.36 - 0.9)));
      // three strap hinges
      for (const hy of [0.45, openH * 0.5, openH - 0.45]) {
        door.add(box(0.025, 0.11, 0.9, m.black, -0.065, hy, dir * 0.5));
        door.add(box(0.07, 0.34, 0.12, m.chrome, -0.05, hy, dir * 0.02));
      }
      if (sz > 0) {
        const logo = plane(1.8, 0.54, m.logo, -0.055, openH - 1.35, dir * (lw / 2 - 0.2));
        logo.rotation.y = -Math.PI / 2;
        door.add(logo);
      } else if (spots.has('rear')) {
        const bw = Math.min(1.9, 1.3 * aspect);
        const brand = plane(bw, bw / aspect, m.brand, -0.055, openH - 1.35, dir * (lw / 2 - 0.05));
        brand.rotation.y = -Math.PI / 2;
        door.add(brand);
      }
      g.add(door);
      barn.push(door);
    }
  }

  // ------------------------------------------------------------ roof: solar, vent
  const count = Math.floor((S - 0.15) / PANEL_PITCH);
  const across = panelAcross(L); // narrower on the 6.5 ft roof, so the panels clear its edges
  if (count > 0) {
    const run = count * PANEL_PITCH;
    for (const sz of [1, -1]) g.add(box(run, 0.07, 0.12, m.aluminum, xr + 0.12 + run / 2, ROOF + 0.035, sz * 2.3));
    for (let i = 0; i < count; i++) {
      const px = xr + 0.12 + PANEL_PITCH * (i + 0.5);
      g.add(box(PANEL_ALONG, 0.11, across, m.pvFrame, px, ROOF + 0.125, 0));
      const top = plane(across, PANEL_ALONG, m.pvTop, px, ROOF + 0.183, 0);
      top.rotation.x = -Math.PI / 2;
      top.rotation.z = Math.PI / 2;
      top.receiveShadow = true;
      g.add(top);
    }
  }
  {
    g.add(box(1.25, 0.1, 1.25, m.black, xf + 0.55, ROOF + 0.05, 0));
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.62, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), m.graphite);
    dome.scale.set(1, 0.42, 1);
    dome.position.set(xf + 0.55, ROOF + 0.1, 0);
    dome.castShadow = true;
    g.add(dome);
  }

  // ------------------------------------------------------------ running gear
  for (const sz of [1, -1]) g.add(box(S - 0.4, 0.3, 0.24, m.chassis, xr + S / 2 + 0.5, FLOOR - 0.15, sz * (W / 2 - 1.2)));
  for (const ax of axles) {
    g.add(cyl(0.12, wz * 2 - 0.3, m.chassis, ax, TIRE_R, 0, 'z', 12));
    for (const sz of [1, -1]) {
      const w = wheel(m);
      w.position.set(ax, TIRE_R, sz * wz);
      if (sz < 0) w.rotation.y = Math.PI;
      g.add(w);
    }
  }
  for (const sz of [1, -1]) {
    const f = archTrim(m, fenderLen, FLOOR, archTop, gear.flange);
    f.position.set(axleX, 0, sz > 0 ? W / 2 : -W / 2);
    if (sz < 0) f.rotation.y = Math.PI;
    g.add(f);
    // Tread plate behind the fender ends, as in the photos, 0.5 ft wide where there's room. On the
    // 10 ft the arch runs close to the rear corner, the door and the equipment compartment, so a
    // plate that would run into them is left off.
    const rearRoom = archX0 - (xr + 0.2);
    const aheadRoom = (sz > 0 ? doorRear - 0.1 : hatchRear - 0.02) - archX1;
    for (const [e, room] of [[-1, rearRoom], [1, aheadRoom]] as const) {
      const pw = Math.min(0.5, room);
      if (pw < 0.35) continue;
      g.add(box(pw, 0.75, 0.03, m.trim, e > 0 ? archX1 + pw / 2 : archX0 - pw / 2, FLOOR + 0.37, sz * out));
    }
  }

  // ------------------------------------------------------------ tongue, jack, spare
  const hitch = tip + 3.3;
  const tongueZ = W / 2 - 1.0; // where the tongue rails meet the frame, 2.5 ft off center on the 7 ft body as first built
  for (const sz of [1, -1]) {
    const x0 = xf - 0.6, z0 = sz * tongueZ;
    const len = Math.hypot(hitch - x0, z0);
    const rail = box(len, 0.3, 0.2, m.chassis, (x0 + hitch) / 2, FLOOR - 0.16, z0 / 2);
    rail.rotation.y = Math.atan2(z0, hitch - x0);
    g.add(rail);
  }
  g.add(box(0.9, 0.24, 0.3, m.chassis, hitch + 0.25, FLOOR - 0.16, 0));
  g.add(cyl(0.16, 0.2, m.chassis, hitch + 0.62, FLOOR - 0.2, 0, 'y', 14));
  g.add(box(0.4, 0.06, 1.5, m.chassis, tip + 1.2, FLOOR - 0.04, 0));
  // jack with its foot plate and crank
  const jackX = tip + 2.35;
  g.add(cyl(0.1, 2.3, m.chassis, jackX, 1.25, 0, 'y', 14));
  g.add(cyl(0.07, 0.5, m.aluminum, jackX, 0.3, 0, 'y', 12));
  g.add(box(0.42, 0.04, 0.42, m.aluminum, jackX, 0.03, 0));
  g.add(box(0.2, 0.16, 0.2, m.aluminum, jackX, 2.45, 0));
  g.add(cyl(0.02, 0.5, m.aluminum, jackX, 2.42, 0.3, 'z', 8));
  g.add(cyl(0.02, 0.3, m.aluminum, jackX, 2.28, 0.54, 'y', 8));
  {
    // The spare stands on a bracket on the street-side tongue rail, just ahead of the point of the
    // nose, as in photos 15 and 36. It used to sit beside the nose and clipped into it (Nate, 2026-11-20).
    const sx = tip + 0.5;
    const railZ = tongueZ * (hitch - sx) / (hitch - (xf - 0.6)); // the rail's distance off center here
    const sz0 = railZ + 0.45;
    const sy = FLOOR + 1.05;
    const spare = wheel(m);
    spare.position.set(sx, sy, -sz0);
    spare.rotation.y = Math.PI;
    g.add(spare);
    g.add(box(0.16, sy - FLOOR + 0.25, 0.16, m.chassis, sx, (FLOOR + sy + 0.25) / 2, -(sz0 - 0.38)));
    g.add(box(0.5, 0.12, 0.42, m.chassis, sx, FLOOR + 0.04, -(railZ + 0.12)));
  }
  // ------------------------------------------------------------ lights, tower and connectivity
  // NATE (2026-11-20 answers) and SOURCE (price sheet 2026-11-20). The only camera on any Cargo is
  // the one on the 28 ft tower. The small corner cameras and the horn and strobe system are gone.
  const mastX = tip + 0.42;
  const hasTower = cfg.tower && L >= 20; // the 28 ft tower is offered on the 20 ft only
  // Both can be picked. Then they stand side by side on the tongue, the tower on the street side,
  // clear of each other's heads and of the spare.
  const lightZ = hasTower ? 0.95 : 0;
  const towerZ = cfg.light6 ? -0.95 : 0;
  const lightTop = ROOF + 6.2;
  /**
   * A brace from the mast back to the nose, low and high. Each one runs to the nose face at its own
   * z, so the braces still touch the V when the light and the tower stand side by side.
   */
  const braces = (z: number) => {
    const face = tip - (NOSE * Math.abs(z)) / (W / 2) - 0.02;
    const len = mastX - face;
    for (const by of [FLOOR + 2.2, ROOF - 0.6]) g.add(box(len, 0.12, 0.3, m.black, (mastX + face) / 2, by, z));
  };
  if (cfg.light6) {
    // The 6 ft telescopic light: the same telescoping mast at the nose as on the Workstation photos
    // (ws-starlink.jpg), with work lights on a crossbar and no camera. It lights the lot at night
    // and lets the crew keep working after the sun goes down.
    g.add(box(0.55, 0.5, 0.55, m.chassis, mastX, FLOOR + 0.1, lightZ));
    g.add(cyl(0.2, 5.2, m.black, mastX, FLOOR + 2.8, lightZ, 'y', 16));
    g.add(cyl(0.15, 5.0, m.black, mastX, FLOOR + 7.4, lightZ, 'y', 16));
    g.add(cyl(0.1, lightTop - (FLOOR + 9.6), m.black, mastX, (lightTop + FLOOR + 9.6) / 2, lightZ, 'y', 14));
    braces(lightZ);
    const cy = lightTop - 1.5;
    g.add(box(0.14, 0.14, 2.6, m.black, mastX, cy, lightZ));
    for (const sz of [1, -1]) {
      g.add(box(0.5, 0.55, 0.75, m.black, mastX, cy + 0.45, lightZ + sz * 0.75));
      g.add(box(0.03, 0.42, 0.62, m.lamp, mastX + 0.26, cy + 0.45, lightZ + sz * 0.75));
    }
  }
  // The 28 ft light tower: a heavier four-stage mast than the 6 ft light, with a light bar, one
  // camera and a horn at the top. Drawn fully raised to 28 ft, and the camera backs off to fit it
  // (liftFor in scene.ts). // SOURCE (price sheet 2026-11-20)
  const towerTop = 28;
  if (hasTower) {
    const z = towerZ;
    g.add(box(0.75, 0.55, 0.75, m.chassis, mastX, FLOOR + 0.1, z));
    const stages: [number, number, number][] = [[0.26, FLOOR + 0.35, 13.0], [0.2, 12.6, 18.5], [0.15, 18.1, 23.5], [0.11, 23.1, towerTop]];
    for (const [r, y1, y2] of stages) {
      g.add(cyl(r, y2 - y1, m.black, mastX, (y1 + y2) / 2, z, 'y', 18));
      g.add(cyl(r + 0.04, 0.16, m.graphite, mastX, y2 - 0.08, z, 'y', 18)); // collar at the top of each stage
    }
    braces(z);
    // light bar: a crossbar with two lamp heads on each side, facing forward
    const by = towerTop - 0.3;
    g.add(box(0.16, 0.16, 3.0, m.black, mastX, by, z));
    for (const oz of [-1.25, -0.6, 0.6, 1.25]) {
      g.add(box(0.45, 0.5, 0.55, m.black, mastX, by + 0.38, z + oz));
      g.add(box(0.03, 0.38, 0.45, m.lamp, mastX + 0.24, by + 0.38, z + oz));
    }
    // the camera, on a short arm in front of the mast under the light bar
    const camY = towerTop - 1.15;
    g.add(box(0.42, 0.08, 0.1, m.black, mastX + 0.25, camY + 0.2, z));
    g.add(cyl(0.24, 0.24, m.graphite, mastX + 0.45, camY + 0.05, z, 'y', 20));
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), m.glass);
    dome.position.set(mastX + 0.45, camY - 0.07, z);
    dome.castShadow = true;
    g.add(dome);
    // the horn, lower on the mast, facing forward
    const hornY = towerTop - 2.1;
    g.add(box(0.36, 0.08, 0.12, m.black, mastX + 0.2, hornY + 0.2, z));
    const horn = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.26, 0.5, 22), m.equipment);
    horn.rotation.z = Math.PI / 2; // narrow end at the mast, bell facing forward
    horn.position.set(mastX + 0.55, hornY, z);
    horn.castShadow = true;
    g.add(horn);
  }
  if (cfg.starlink) {
    // The dish rides on top of the 6 ft light when there is one, as on the Workstation photos,
    // else on its own short pole on the curb half of the roof over the nose. It never goes on the
    // 28 ft tower: the old center pole stood a foot behind the tower and read as mounted on it
    // (Nate, 2026-11-20). Starlink can go on Cargo (Nate, 2026-11-20).
    const dish = new THREE.Group();
    if (cfg.light6) dish.position.set(mastX, lightTop + 0.22, lightZ);
    else {
      const px = xf + 0.45, pz = Math.min(1.25, (W / 2) * (1 - 0.45 / NOSE) - 0.9);
      g.add(cyl(0.06, 1.3, m.black, px, ROOF + 0.65, pz, 'y', 12));
      dish.position.set(px, ROOF + 1.4, pz);
    }
    dish.add(box(1.25, 0.09, 1.9, m.equipment, 0, 0, 0), box(0.3, 0.2, 0.3, m.graphite, 0, -0.13, 0));
    dish.rotation.z = -0.28;
    g.add(dish);
  }
  if (cfg.cellular) {
    // roof antenna over the nose
    g.add(cyl(0.28, 0.14, m.black, xf + 0.32, ROOF + 0.07, 2.3, 'y', 24));
    g.add(cyl(0.02, 0.9, m.black, xf + 0.32, ROOF + 0.55, 2.3, 'y', 8));
  }

  // ------------------------------------------------------------ interior
  // Rebuilt from Nate's Better Interior photos (2026-11-19). A flat white wall closes off the nose,
  // with the climate control head high on its street half and a white single-panel closet door on
  // its curb half. Glossy white wall panels with faint seams every 4 ft, a black diamond-plate angle
  // where the walls meet the ceiling, two rows of round puck lights with black rims, and a smooth
  // charcoal vinyl floor. The battery units stand mid-length on low white platforms. Sizes that
  // depend on the body's width and height follow it, so the 10 ft fits the same pieces.
  const px = xf - 0.06;
  g.add(box(0.12, H - 0.26, W - WALL * 2, faces(m.edge, { nx: m.liner, px: m.liner }), px, yc, 0));
  {
    // closet door: one recessed panel, three black hinges on the curb edge, a round black knob
    // 6.65 ft tall on the 20 ft as built, shorter on the lower 10 ft. It keeps the same distance
    // from the curb wall at any width.
    const dz = zi - 1.53, dw2 = 2.5, dh2 = H - 0.45;
    g.add(box(0.05, dh2 + 0.2, dw2 + 0.3, m.board, px - 0.07, y0 + dh2 / 2 + 0.05, dz));
    g.add(box(0.04, dh2, dw2, m.board, px - 0.11, y0 + dh2 / 2, dz));
    g.add(box(0.012, dh2 - 1.0, dw2 - 0.7, m.module, px - 0.13, y0 + dh2 / 2 + 0.05, dz));
    for (const hy of [0.7, dh2 / 2, dh2 - 0.7]) g.add(box(0.03, 0.32, 0.1, m.black, px - 0.13, y0 + hy, dz + dw2 / 2 - 0.05));
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), m.black);
    knob.position.set(px - 0.2, y0 + 3.0, dz - dw2 / 2 + 0.3);
    g.add(knob, cyl(0.04, 0.08, m.black, px - 0.14, y0 + 3.0, dz - dw2 / 2 + 0.3, 'x', 10));
  }
  // black diamond-plate angle where the walls meet the ceiling: a leg down the wall and one across the ceiling
  const bandY = ROOF - 0.11;
  for (const sz of [1, -1]) {
    g.add(box(S - 0.2, 0.34, 0.035, m.trim, xr + S / 2, bandY - 0.17, sz * (zi - 0.018)));
    g.add(box(S - 0.2, 0.035, 0.26, m.trim, xr + S / 2, bandY - 0.018, sz * (zi - 0.13)));
  }
  g.add(box(0.035, 0.34, W - WALL * 2 - 0.06, m.trim, px - 0.078, bandY - 0.17, 0));
  g.add(box(0.26, 0.035, W - WALL * 2 - 0.06, m.trim, px - 0.19, bandY - 0.018, 0));
  // puck lights: two rows of round lights with black rims, about one every 3 ft (six a row on the 20 ft)
  const perRow = Math.max(2, Math.round(S / 3));
  const puckZ = W / 2 - 1.9; // 1.6 ft off center on the 7 ft body as first built
  for (let i = 0; i < perRow; i++) for (const sz of [1, -1]) {
    const lx = xr + (S * (i + 0.5)) / perRow;
    g.add(cyl(0.31, 0.03, m.black, lx, bandY - 0.015, sz * puckZ, 'y', 32), cyl(0.255, 0.036, m.lamp, lx, bandY - 0.02, sz * puckZ, 'y', 32));
  }
  const glow = S > 12 ? [xr + S * 0.2, xr + S * 0.5, xr + S * 0.8] : [xr + S * 0.5];
  for (const lx of glow) {
    const light = new THREE.PointLight('#f6f8fc', S > 12 ? 7 : 9, 20, 1.6);
    light.position.set(lx, ROOF - 0.9, 0);
    g.add(light);
  }
  // faint panel seams: every 4 ft down the walls, and across the ceiling
  for (const sz of [1, -1]) {
    for (let x = xr + 4; x < xf - 0.6; x += 4) {
      if (sz > 0 && x > doorRear - 0.2) continue;
      g.add(box(0.025, H - 0.75, 0.012, m.joint, x, yc - 0.18, sz * (zi - 0.006)));
    }
  }
  for (let x = xr + 4; x < xf - 0.6; x += 4) g.add(box(0.025, 0.01, W - WALL * 2 - 0.6, m.joint, x, bandY - 0.006, 0));
  if (cfg.hvac) {
    // Climate control: the wall-mounted indoor head, high on the street half of the nose wall, just
    // under the trim, the same distance from the street wall at any width.
    const hz = -(zi - 1.63);
    const hy = bandY - 0.34 - 0.18 - 0.475;
    g.add(box(0.6, 0.95, 2.65, m.module, px - 0.36, hy, hz));
    g.add(box(0.04, 0.82, 2.55, m.board, px - 0.67, hy + 0.04, hz));
    g.add(box(0.06, 0.08, 2.35, m.graphite, px - 0.62, hy - 0.4, hz));
    g.add(box(0.012, 0.07, 0.34, m.display, px - 0.69, hy - 0.18, hz + 0.75));
  }

  // Each set of wheels is boxed in under a low white platform with black channel on top, and the
  // battery units, 5 kWh each, stand on those platforms, as in photo 60. On the 20 ft that puts them
  // mid-length under the window, with the desk running from them to the nose. A longer battery run
  // extends its platform toward the nose.
  const wallEnd: Record<number, number> = { [-1]: xf - 0.3, [1]: doorRear - 0.5 };
  /** Free stretches of each wall, rear to front, that the furniture packs into. */
  const free: Record<number, [number, number][]> = { [-1]: [[xr + 0.6, wallEnd[-1]]], [1]: [[xr + 0.6, wallEnd[1]]] };
  {
    const unit = 1.55;
    const ph = 1.0; // platform height over the floor, clear of the tires
    const x0 = archX0;
    let left = Math.max(1, Math.min(4, Math.round(cfg.batteryModules) || 1)); // 5 to 20 kWh. // SOURCE (price sheet 2026-11-20)
    for (const wall of [-1, 1]) {
      const room = Math.max(0, Math.floor((wallEnd[wall] - x0 - 0.5) / unit));
      const n = Math.min(wall < 0 ? Math.ceil(left / 2) : left, room, 4);
      left -= n;
      const len = Math.max(fenderLen, n * unit + 0.5);
      // The platform is hollow over the tires: an inner block, its outer face just inboard of the
      // tires and dark where it shows through the arch, and a lid out to the wall over the tires.
      const dark = wall > 0 ? { pz: m.chassis, ny: m.chassis } : { nz: m.chassis, ny: m.chassis };
      const inner = zi - 1.3;
      g.add(box(len, ph, wellZ - inner, faces(m.equipment, dark), x0 + len / 2, y0 + ph / 2, wall * (inner + wellZ) / 2));
      g.add(box(len, 0.08, zi - wellZ, faces(m.equipment, dark), x0 + len / 2, y0 + ph - 0.04, wall * (wellZ + zi) / 2));
      for (const off of [0.32, 1.05]) g.add(box(len - 0.12, 0.13, 0.15, m.black, x0 + len / 2, y0 + ph + 0.05, wall * (zi - off)));
      // the platform splits the wall into a stretch behind it and one in front of it
      free[wall] = [[xr + 0.6, x0 - 0.9], [x0 + len + 0.3, wallEnd[wall]]].filter(([a, b]) => b - a > 0.5) as [number, number][];
      if (!n) continue;
      // a duplex outlet on the wall just behind the platform, where there's wall behind it (not on the 10 ft)
      if (x0 - 0.6 > xr + 0.2) {
        g.add(box(0.24, 0.38, 0.02, m.board, x0 - 0.45, y0 + 1.3, wall * (zi - 0.01)));
        for (const oy of [1.21, 1.39]) g.add(box(0.1, 0.06, 0.012, m.graphite, x0 - 0.45, y0 + oy, wall * (zi - 0.022)));
      }
      for (let i = 0; i < n; i++) {
        // open aluminum cage around a white module, red terminal caps and cable on top
        const u = new THREE.Group();
        u.position.set(x0 + 0.25 + unit * (i + 0.5), y0 + ph + 0.12, wall * (zi - 0.48));
        if (wall > 0) u.rotation.y = Math.PI;
        const cw = 1.35, ch = 1.75, cd = 0.56;
        for (const ex of [-1, 1]) for (const ez of [-1, 1]) u.add(box(0.09, ch, 0.09, m.cage, ex * (cw / 2 - 0.045), ch / 2, ez * (cd / 2 - 0.045)));
        for (const ey of [0.05, ch - 0.05]) for (const ez of [-1, 1]) u.add(box(cw, 0.09, 0.09, m.cage, 0, ey, ez * (cd / 2 - 0.045)));
        for (const ey of [0.05, ch - 0.05]) for (const ex of [-1, 1]) u.add(box(0.09, 0.09, cd, m.cage, ex * (cw / 2 - 0.045), ey, 0));
        u.add(box(cw - 0.26, ch - 0.3, cd - 0.14, m.module, 0, ch / 2, -0.02));
        u.add(box(0.32, 0.12, 0.012, m.display, -0.18, ch - 0.38, cd / 2 - 0.08), box(0.04, 0.04, 0.012, m.screen, 0.12, ch - 0.38, cd / 2 - 0.08));
        for (const tx of [-0.35, 0.35]) {
          u.add(cyl(0.045, 0.08, m.cable, tx * 0.85, ch + 0.01, 0.12, 'y', 12));
          u.add(cyl(0.022, cd * 0.9, m.cable, tx * 0.85, ch + 0.06, -cd * 0.3, 'z', 8));
        }
        g.add(u);
      }
    }
  }

  // ------------------------------------------------------------ furniture, packed along the walls
  // Each piece takes the next free stretch of its preferred wall, or the other wall if that one
  // is full. Anything that fits neither is left out of the preview and reported back. The real
  // layout is worked out with the buyer, so this only shows that the pieces exist and their scale.
  // Inside a slot: x runs along the wall, y is up from the floor, z is out from the wall.
  const skipped: string[] = [];
  const slotAt = (x: number, wall: number) => {
    const slot = new THREE.Group();
    slot.position.set(x, y0, wall * zi);
    if (wall > 0) slot.rotation.y = Math.PI;
    g.add(slot);
    return slot;
  };
  /** Takes the first free stretch, rear to front, on the preferred wall and then the other one. */
  const place = (len: number, prefer: 1 | -1, label: string) => {
    for (const wall of [prefer, -prefer]) {
      const run = free[wall].find(([a, b]) => b - a >= len - 0.01);
      if (!run) continue;
      const x = run[0] + len / 2;
      run[0] += len + 0.25;
      return slotAt(x, wall);
    }
    skipped.push(label);
    return null;
  };
  /** The same, but from the front of the street-side wall, where the as-built desk sits. */
  const frontRoom = () => { const r = free[-1][free[-1].length - 1]; return r ? r[1] - r[0] : 0; };
  const placeFront = (len: number, label: string) => {
    const run = free[-1][free[-1].length - 1];
    if (!run || run[1] - run[0] < len - 0.01) return place(len, 1, label);
    const x = run[1] - len / 2;
    run[1] -= len + 0.25;
    return slotAt(x, -1);
  };
  // White casework with a black top, as on the desk in the interior photos.
  const casework = (slot: THREE.Group, len: number, depth: number, height: number, doors: number) => {
    slot.add(box(len, height - 0.3, depth, m.equipment, 0, 0.3 + (height - 0.3) / 2, depth / 2));
    slot.add(box(len - 0.1, 0.3, depth - 0.2, m.black, 0, 0.15, depth / 2 - 0.1));
    slot.add(box(len + 0.06, 0.1, depth + 0.06, m.top, 0, height + 0.05, depth / 2));
    for (let i = 0; i < doors; i++) {
      const cx = -len / 2 + (len / doors) * (i + 0.5);
      if (i > 0) slot.add(box(0.02, height - 0.4, 0.01, m.black, -len / 2 + (len / doors) * i, 0.3 + (height - 0.3) / 2, depth + 0.005));
      slot.add(box(0.04, 0.5, 0.04, m.black, cx + (len / doors) * 0.32, height * 0.72, depth + 0.03));
    }
  };

  /** Takes the longest free stretch on the preferred wall, then the other wall, at up to `max` and at least `min` long. */
  const placeFit = (max: number, min: number, prefer: 1 | -1, label: string) => {
    for (const wall of [prefer, -prefer]) {
      const run = free[wall].filter(([a, b]) => b - a >= min - 0.01).sort((p, q) => (q[1] - q[0]) - (p[1] - p[0]))[0];
      if (!run) continue;
      const len = Math.min(max, run[1] - run[0]);
      const x = run[0] + len / 2;
      run[0] += len + 0.25;
      return { slot: slotAt(x, wall), len };
    }
    skipped.push(label);
    return null;
  };
  /** As built: a black top on a solid white base, 2 ft deep, at desk height. */
  const drawDesk = (d: THREE.Group, len: number) => {
    const depth = 2.0;
    d.add(box(len + 0.04, 0.09, depth + 0.06, m.top, 0, 2.48, depth / 2 + 0.01));
    d.add(box(len - 0.06, 2.43, depth - 0.12, m.equipment, 0, 1.215, (depth - 0.12) / 2));
    for (const gx of [-len * 0.3, len * 0.3]) d.add(box(0.22, 0.012, 0.1, m.graphite, gx, 2.53, 0.35));
  };

  // The built-in front corner work desk, standard on every Cargo, so it's always drawn.
  // SOURCE (price sheet 2026-11-20)
  // On the 20 ft it's as built: from the batteries to the nose wall on the street side, as long as
  // the wall allows, up to 6.5 ft. On the 10 ft the battery platform leaves only about 2 ft of that
  // wall, so the desk turns and runs across the street half of the nose wall instead, in the same
  // front corner, under the climate control head and clear of the closet door.
  {
    const room = frontRoom();
    if (room >= 3.5) {
      const len = Math.min(6.5, room);
      const d = placeFront(len, 'the corner desk');
      if (d) drawDesk(d, len);
    } else {
      const depth = 2.0;
      const closetEdge = zi - 2.93; // the street-side edge of the closet door's frame
      const len = Math.min(3.2, closetEdge - 0.1 - (-zi + 0.05));
      const d = new THREE.Group();
      d.position.set(px - 0.06, y0, -zi + 0.05 + len / 2);
      d.rotation.y = -Math.PI / 2; // out from the nose wall, toward the rear
      g.add(d);
      drawDesk(d, len);
      // the desk now fills the front of the street wall
      const run = free[-1][free[-1].length - 1];
      if (run) run[1] = Math.min(run[1], px - 0.06 - depth - 0.25);
      free[-1] = free[-1].filter(([a, b]) => b - a > 0.5);
    }
  }

  // A tabletop host for the microwave: the counter first, then the fridge.
  let host: { slot: THREE.Group; x: number; top: number; depth: number } | null = null;

  if (cfg.benchLength) {
    const len = cfg.benchLength;
    const b = place(len, -1, 'the workbench');
    if (b) {
      b.add(box(len, 0.14, 1.9, m.benchTop, 0, 3.0, 0.95));
      for (const ex of [-1, 1]) for (const ez of [0.12, 1.78]) b.add(box(0.12, 2.93, 0.12, m.steel, ex * (len / 2 - 0.1), 1.465, ez));
      b.add(box(len - 0.2, 0.08, 1.7, m.steel, 0, 0.9, 0.95));
      b.add(box(len, 0.5, 0.06, m.steel, 0, 3.32, 0.04));
      for (const ox of [-0.8, 0.8]) b.add(box(0.36, 0.22, 0.03, m.equipment, ox, 3.34, 0.08));
    }
  }
  // Extra desks, beyond the standard one. On the 2026-11-20 call Alessandro described them going
  // beside the battery platforms, so each takes the longest free stretch of wall, the curb side
  // first: 4.5 ft where there's room, never under 2.5 ft. The 10 ft has no free wall left for one.
  // NATE (2026-11-20 answers)
  for (let i = 0; i < cfg.desks; i++) {
    const d = placeFit(4.5, 2.5, 1, cfg.desks > 1 ? 'an extra desk' : 'the extra desk');
    if (d) drawDesk(d.slot, d.len);
  }
  if (cfg.counter) {
    const c = place(4, 1, 'the refreshment counter');
    if (c) {
      casework(c, 4, 1.9, 3.0, 2);
      // coffee maker, a carafe and a stack of cups
      c.add(box(0.7, 1.1, 0.8, m.steel, -1.2, 3.66, 0.8), box(0.5, 0.08, 0.6, m.steel, -1.2, 3.31, 1.15));
      c.add(cyl(0.2, 0.5, m.display, -1.2, 3.39, 1.2, 'y', 16));
      for (let i = 0; i < 3; i++) c.add(cyl(0.12, 0.34, m.board, -0.35 + i * 0.3, 3.28, 0.7, 'y', 12));
      host = { slot: c, x: 1.05, top: 3.11, depth: 1.9 };
    }
  }
  if (cfg.fridge) {
    const f = place(2.1, 1, 'the refrigerator');
    if (f) {
      f.add(box(2.0, 2.85, 2.0, m.steel, 0, 1.45, 1.0));
      f.add(box(1.9, 2.6, 0.04, m.graphite, 0, 1.5, 2.02));
      f.add(box(0.05, 1.4, 0.07, m.chrome, 0.75, 1.7, 2.07));
      if (!host) host = { slot: f, x: 0, top: 2.88, depth: 2.0 };
    }
  }
  if (cfg.microwave) {
    // On the first tabletop there is. With none, it gets its own small stand.
    let spot = host;
    if (!spot) {
      const stand = place(1.9, 1, 'the microwave');
      if (stand) {
        for (const ex of [-1, 1]) for (const ez of [0.1, 1.4]) stand.add(box(0.08, 2.9, 0.08, m.steel, ex * 0.85, 1.45, ez));
        for (const sy of [0.9, 2.9]) stand.add(box(1.8, 0.06, 1.5, m.steel, 0, sy, 0.75));
        spot = { slot: stand, x: 0, top: 2.93, depth: 1.5 };
      }
    }
    if (spot) {
      const z = spot.depth / 2 + 0.1;
      spot.slot.add(box(1.6, 0.95, 1.2, m.graphite, spot.x, spot.top + 0.475, z));
      spot.slot.add(box(1.05, 0.62, 0.03, m.display, spot.x - 0.2, spot.top + 0.475, z + 0.61));
      spot.slot.add(box(0.05, 0.6, 0.05, m.chrome, spot.x + 0.4, spot.top + 0.475, z + 0.64));
    }
  }

  // Wall-hung pieces on the curb side: the whiteboard and the screen.
  const wallRun = doorRear - xr - 1.6;
  if (cfg.whiteboard) {
    const w = Math.min(4, wallRun * 0.46);
    const h = Math.min(2.0, w * 0.62);
    const wb = new THREE.Group();
    wb.position.set(xr + 0.8 + wallRun * 0.28, y0 + 4.2, zi - 0.03);
    wb.add(box(w + 0.1, h + 0.1, 0.04, m.aluminum, 0, 0, 0), box(w, h, 0.02, m.board, 0, 0, -0.025), box(w * 0.5, 0.05, 0.12, m.aluminum, 0, -h / 2 - 0.05, -0.07));
    g.add(wb);
  }
  if (cfg.tv) {
    const w = Math.min(3.4, wallRun * 0.4);
    const h = w * 0.5625;
    const tv = new THREE.Group();
    tv.position.set(xr + 0.8 + wallRun * 0.76, y0 + 4.3, zi - 0.06);
    tv.add(box(w, h, 0.1, m.black, 0, 0, 0), box(w - 0.1, h - 0.1, 0.02, m.display, 0, 0, -0.055));
    g.add(tv);
  }
  if (cfg.etrackWalls) {
    // Black open-slot track, 5 in tall, as photographed: a low row about 1 ft 8 in up and a high row
    // about 4 ft 10 in up, the length of both walls. The high row on the street side stops short of
    // the window, and the curb side stops at the entry door.
    for (const ty of [y0 + 1.65, y0 + 4.85]) {
      g.add(box(doorRear - xr - 0.8, 0.42, 0.04, m.etrack, (xr + doorRear) / 2, ty, zi - 0.02));
      const end = ty > y0 + 3 ? winX - 2.2 : xf - 0.5;
      if (end - xr > 1.5) g.add(box(end - xr - 0.4, 0.42, 0.04, m.etrack, (xr + end) / 2 + 0.2, ty, -(zi - 0.02)));
    }
  }
  if (cfg.etrackFloor) {
    for (const sz of [1, -1]) g.add(box(S - 2.4, 0.03, 0.26, m.track, xr + (S - 2.4) / 2 + 0.5, y0 + 0.016, sz * (W / 2 - 2.35)));
  }

  // Center the body (not the tongue) on the origin so it turns about its middle.
  const anchors = {
    solar: new THREE.Vector3(xr + S * 0.42, ROOF + 0.2, 0.6),
    door: new THREE.Vector3(doorRear + dw / 2, FLOOR, W / 2),
    power: new THREE.Vector3(xf + NOSE * 0.55, ROOF, (W / 2) * 0.45),
    wheels: new THREE.Vector3(axleX - gear.spread, 0.5, wz + 0.3),
  };

  const view = interiorView(L);
  return {
    group: g,
    body: { length: L, W, H, floor: FLOOR, roof: ROOF, wheels: new THREE.Vector3(xf - gear.center, 1.7, W / 2), eye: view.eye, look: view.look },
    barn,
    ramp: null,
    sideDoor,
    skipped,
    tall: cfg.light6 || hasTower,
    top: hasTower ? towerTop + 0.4 : cfg.light6 ? lightTop + 0.3 : ROOF + 1.5,
    rampAngle: Math.PI / 2 + Math.asin(Math.min(1, doorY / (openH - 0.03))),
    anchors,
    dispose() {
      g.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
      });
    },
  };
}

/** Swing the doors. t runs from 0 (shut) to 1 (open). */
export function poseDoors(parts: TrailerParts, t: number) {
  const e = t * t * (3 - 2 * t);
  parts.barn.forEach((door) => { door.rotation.y = Math.sign(door.position.z) * e * 1.95; });
  if (parts.ramp) parts.ramp.rotation.z = e * parts.rampAngle;
  parts.sideDoor.rotation.y = e * 1.7;
  parts.moreDoors?.forEach((d) => { d.rotation.y = e * 1.7; });
}

/** Where the interior camera stands and looks, for a given length. */
export function interiorView(length: number) {
  const xr = -length / 2;
  const xf = length / 2 - NOSE;
  return {
    // from the rear doors, at about chest height, looking straight down the middle (photo 60)
    eye: new THREE.Vector3(xr + 0.35, FLOOR + 4.7, 0),
    look: new THREE.Vector3(xf - 0.5, FLOOR + 3.3, 0),
  };
}

// ---------------------------------------------------------------- the 20 ft Workstation

/**
 * The white 20 ft Workstation, built from Nate's drone photos of the finished trailer
 * (_photos-original/2026-11-17/Website Photos, A013C0279 to A013C0321, 2026-11-20) and the interior
 * photos, measured off the 30 in tires and the price sheet's 20 ft and 8 ft. The full build spec
 * with every measurement and its photo is kept with the session notes; the main facts:
 *   Body:  a 20 ft flat side plus a 2.85 ft truncated V nose (a 2.05 ft flat front face between two
 *          chamfers), 8 ft wide (SOURCE price sheet), 8 ft tall box sitting 1.75 ft off the ground.
 *   Nose:  gloss black diamond plate on its lower 4 ft, vertical SPOG marks, amber lights, and four
 *          small black covers that are most likely the four outdoor outlets.
 *   Curb:  two entry doors with windows and fold-down steps, one at each end, as in the photos.
 *          (The sheet says one 36 in door plus a single rear door. Open question for Nate.)
 *   Sides: one window each side over the axles, the SPOG logo under it. A low hatch at the front
 *          of the street side and a louvered vent at its rear corner.
 *   Rear:  one painted face with the climate control hatch low on the street side, five red lights.
 *   Roof:  white, with five large all-black panels across it and a white vent over the nose.
 *   Gear:  two axles about midway, 30 in tires flush with the walls in gloss charcoal fenders.
 *   Masts: the 28 ft tower stands on the tongue just ahead of the face, with one camera, two
 *          flood lights and a horn (SOURCE price sheet: one camera). The 6 ft light rises from the
 *          nose roof. Starlink rides on the 6 ft light, else its own short pole, never the tower.
 *   Inside: white composite or premium wood (oak walls, walnut ceiling, black casework, a warm
 *          light strip), a vinyl floor, the climate control head and a closet door on the nose
 *          wall, the battery units in closed boxes over the wheels, and the built-in work desk on
 *          the street wall (placement is a modeling choice, no photo shows it).
 */
function buildWorkstation20(cfg: TrailerConfig, m: Materials): TrailerParts {
  const g = new THREE.Group();
  const S = 20, NZ = 2.85, FH = 1.025; // flat side, nose depth, half the front face
  const W = 8, H = 8.05, FL = 1.75, RF = FL + H, Y0 = 2.05, CEIL = 9.35, WL = 0.2;
  const xr = -(S + NZ) / 2, xf = xr + S, tip = xf + NZ;
  const zi = W / 2 - WL, out = W / 2 + 0.02;
  const at = (feet: number) => xr + feet; // feet forward of the rear corner
  const wood = cfg.interior === 'wood';
  const inner = wood ? m.veneer : m.liner;
  const spots = new Set(cfg.brand ? cfg.logoSpots.split(',') : []);
  const aspect = cfg.logoAspect || 4.876;

  // running gear: two axles about midway, 30 in tires flush with the walls
  const TR = 1.25, ts = TR / TIRE_R;
  const axleX = at(9.9), spread = 1.35;
  const archX0 = at(7.0), archX1 = at(12.6), archTop = 2.9;
  const wz = W / 2 + 0.02 - 0.322 * ts;
  const wellZ = wz - 0.322 * ts - 0.08;

  // ------------------------------------------------------------ floor, roof, ceiling
  const outline: [number, number][] = [[xr, -W / 2], [xf, -W / 2], [tip, -FH], [tip, FH], [xf, W / 2], [xr, W / 2]];
  const notched: [number, number][] = [[xr, -W / 2], [archX0, -W / 2], [archX0, -wellZ], [archX1, -wellZ], [archX1, -W / 2], [xf, -W / 2], [tip, -FH], [tip, FH], [xf, W / 2], [archX1, W / 2], [archX1, wellZ], [archX0, wellZ], [archX0, W / 2], [xr, W / 2]];
  const shapeOf = (pts: [number, number][]) => {
    const sh = new THREE.Shape();
    sh.moveTo(pts[0][0], pts[0][1]);
    pts.slice(1).forEach(([a, b]) => sh.lineTo(a, b));
    sh.closePath();
    return sh;
  };
  const slab = (sh: THREE.Shape, depth: number, y: number, mat: Mat) => {
    const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: false }), mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = y;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };
  g.add(slab(shapeOf(notched), Y0 - FL, FL, m.chassis), slab(shapeOf(outline), 0.1, RF - 0.1, m.roofWhite));
  const floorTop = new THREE.Mesh(new THREE.ShapeGeometry(shapeOf(notched)), m.floor);
  floorTop.rotation.x = -Math.PI / 2;
  floorTop.position.y = Y0 + 0.002;
  floorTop.receiveShadow = true;
  const ceiling = new THREE.Mesh(new THREE.ShapeGeometry(shapeOf(outline)), wood ? m.walnut : m.ceiling);
  ceiling.rotation.x = -Math.PI / 2;
  ceiling.position.y = CEIL;
  g.add(floorTop, ceiling);

  // ------------------------------------------------------------ side walls, with the arches and the curb doors cut out
  const doorSpans: [number, number][] = [[0.77, 3.92], [16.1, 19.25]]; // leaf, feet forward of the rear corner, measured off ws-282 and ws-283
  const DH = 6.6;
  const R = ARCH_R;
  const wallShape = (holes: [number, number, number, number][]) => {
    const sh = new THREE.Shape();
    sh.moveTo(xr, FL);
    sh.lineTo(archX0, FL);
    sh.lineTo(archX0, archTop - R);
    sh.absarc(archX0 + R, archTop - R, R, Math.PI, Math.PI / 2, true);
    sh.lineTo(archX1 - R, archTop);
    sh.absarc(archX1 - R, archTop - R, R, Math.PI / 2, 0, true);
    sh.lineTo(archX1, FL);
    sh.lineTo(xf, FL);
    sh.lineTo(xf, RF);
    sh.lineTo(xr, RF);
    sh.closePath();
    for (const [a, b, c, d] of holes) {
      const h = new THREE.Path();
      h.moveTo(a, c); h.lineTo(a, d); h.lineTo(b, d); h.lineTo(b, c); h.closePath();
      sh.holes.push(h);
    }
    return sh;
  };
  for (const sz of [1, -1]) {
    const sh = wallShape(sz > 0 ? doorSpans.map(([a, b]) => [at(a), at(b), Y0, Y0 + DH] as [number, number, number, number]) : []);
    const skins: [Mat, number][] = sz > 0 ? [[m.paint, W / 2 - WL / 2], [inner, W / 2 - WL]] : [[m.paint, -W / 2], [inner, -W / 2 + WL / 2]];
    for (const [mat, z] of skins) {
      const p = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: WL / 2, bevelEnabled: false, curveSegments: 16 }), [mat, m.edge]);
      p.position.z = z;
      p.castShadow = true;
      p.receiveShadow = true;
      g.add(p);
    }
    // black diamond-plate cap along the top, the bottom rail broken by the fender, and the rear corner post
    g.add(box(S, 0.31, 0.035, m.trim, xr + S / 2, RF - 0.155, sz * out));
    g.add(box(archX0 - 0.22 - xr, 0.26, 0.035, m.trim, (xr + archX0 - 0.22) / 2, FL + 0.13, sz * out));
    g.add(box(xf - archX1 - 0.22, 0.26, 0.035, m.trim, (archX1 + 0.22 + xf) / 2, FL + 0.13, sz * out));
    g.add(box(0.24, H + 0.2, 0.035, m.trim, xr + 0.12, FL + (H + 0.2) / 2, sz * out));
    // amber clearance lights along the top, red markers low at the rear
    for (const f of [0.35, 4.75, 14.0, 19.6]) g.add(cyl(0.045, 0.03, m.marker, at(f), RF - 0.5, sz * (W / 2 + 0.012), 'z', 10));
    for (const f of [0.45, 4.9]) g.add(cyl(0.045, 0.03, m.tail, at(f), FL + 0.4, sz * (W / 2 + 0.012), 'z', 10));
    g.add(cyl(0.045, 0.03, m.tail, at(9.8), FL + 1.37, sz * (W / 2 + 0.012), 'z', 10));
    // the window over the axles: 60 by 30 in (SOURCE price sheet), one on each side as in the photos
    const wx = at(9.5), wy = FL + 5.75, ww = 5.0, wh = 2.5;
    const fo = frame(ww + 0.2, wh + 0.2, 0.1, 0.05, m.black);
    fo.position.set(wx, wy, sz * (W / 2 + 0.03));
    const pane = plane(ww, wh, m.glass, wx, wy, sz * (W / 2 + 0.032));
    if (sz < 0) pane.rotation.y = Math.PI;
    g.add(fo, pane, box(0.06, wh, 0.04, m.black, wx, wy, sz * (W / 2 + 0.04)));
    const fi = frame(ww + 0.2, wh + 0.2, 0.1, 0.03, m.black);
    fi.position.set(wx, wy, sz * (zi - 0.02));
    const day = plane(ww, wh, m.daylight, wx, wy, sz * (zi - 0.012));
    if (sz > 0) day.rotation.y = Math.PI;
    g.add(fi, day);
    // the SPOG logo under the window, reading left to right on both sides
    const logo = plane(3.1, 0.93, m.logo, at(9.6), FL + 3.6, sz * (W / 2 + 0.012));
    if (sz < 0) logo.rotation.y = Math.PI;
    g.add(logo);
    // the buyer's logo, high between the rear door and the window, as on the BSW trailer
    if (spots.has(sz > 0 ? 'right' : 'left')) {
      const bh = Math.min(1.2, 2.2 / aspect);
      const brand = plane(bh * aspect, bh, m.brand, at(5.5), FL + 7.0 - bh / 2, sz * (W / 2 + 0.014));
      if (sz < 0) brand.rotation.y = Math.PI;
      g.add(brand);
    }
  }

  // ------------------------------------------------------------ street side: front hatch and rear vent
  {
    const hx = at(18.6);
    const hf = frame(2.37, 1.94, 0.15, 0.05, m.trim);
    hf.position.set(hx, FL + 1.33, -out);
    g.add(hf, box(1.93, 1.45, 0.03, faces(m.edge, { nz: m.paint }), at(18.69), FL + 1.275, -out));
    g.add(cyl(0.07, 0.06, m.chrome, at(18.7), FL + 0.62, -(out + 0.03), 'z', 16));
    g.add(box(0.82, 1.4, 0.04, m.black, at(0.93), FL + 1.56, -out));
    for (let i = 0; i < 8; i++) g.add(box(0.7, 0.05, 0.08, m.graphite, at(0.93), FL + 0.98 + i * 0.165, -(out + 0.03)));
  }

  // ------------------------------------------------------------ the two curb doors, steps and the grab rail
  const doors: THREE.Group[] = [];
  for (const [a, b] of doorSpans) {
    const x0 = at(a), x1 = at(b), dw = x1 - x0, cx = (x0 + x1) / 2;
    const tr = frame(dw + 0.38, DH + 0.25, 0.19, 0.05, m.trim);
    tr.position.set(cx, Y0 + DH / 2 + 0.06, out);
    g.add(tr);
    const door = new THREE.Group();
    door.position.set(x1, Y0, W / 2 - 0.02); // hinged on its nose-side edge, as in the photos
    door.add(box(dw - 0.04, DH - 0.04, 0.09, faces(m.edge, { pz: m.paint, nz: inner }), -dw / 2, DH / 2, 0));
    const gw = 1.92, gh = 3.06, gy = DH - 0.47 - gh / 2;
    const ring = frame(gw + 0.2, gh + 0.2, 0.1, 0.03, m.board);
    ring.position.set(-dw / 2, gy, 0.055);
    door.add(ring, plane(gw, gh, m.glass, -dw / 2, gy, 0.052));
    const inside = plane(gw, gh, m.daylight, -dw / 2, gy, -0.05);
    inside.rotation.y = Math.PI;
    door.add(inside);
    door.add(cyl(0.07, 0.1, m.black, -dw + 0.31, FL + 3.66 - Y0, 0.07, 'z', 16));
    for (const hy of [0.8, 3.4, 6.3]) door.add(box(0.07, 0.3, 0.05, m.black, -0.03, hy, 0.06));
    g.add(door);
    doors.push(door);
    // fold-down steps: two ribbed aluminum treads on black stringers, with telescoping legs
    g.add(box(dw - 0.9, 0.12, 0.3, m.black, cx, Y0 - 0.1, W / 2 + 0.15));
    for (const [ty, tz] of [[1.33, W / 2 + 0.55], [0.67, W / 2 + 1.25]]) g.add(box(2.0, 0.07, 0.67, m.aluminum, cx, ty, tz));
    for (const sx of [-1, 1]) {
      const st = box(0.06, 2.3, 0.14, m.black, cx + sx * 1.03, (Y0 + 0.35) / 2, W / 2 + 0.85);
      st.rotation.x = -Math.atan2(1.4, 1.7);
      g.add(st, cyl(0.03, 0.67, m.chrome, cx + sx * 0.95, 0.335, W / 2 + 1.5, 'y', 10));
    }
  }
  // a stainless grab rail at the front door, fixed to the wall
  {
    const a = new THREE.Vector3(at(15.95), FL + 3.3, W / 2 + 0.05), b = new THREE.Vector3(at(17.1), FL + 1.0, W / 2 + 1.3);
    for (const off of [-0.12, 0.12]) {
      const len = a.distanceTo(b);
      const rail = cyl(0.04, len, m.chrome, (a.x + b.x) / 2 + off, (a.y + b.y) / 2, (a.z + b.z) / 2, 'y', 10);
      rail.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
      g.add(rail);
    }
  }

  // ------------------------------------------------------------ the truncated V nose
  const Ln = Math.hypot(NZ, W / 2 - FH);
  const th = Math.atan2(W / 2 - FH, NZ);
  for (const sz of [1, -1]) {
    const n = new THREE.Group();
    n.position.set((xf + tip) / 2, 0, (sz * (W / 2 + FH)) / 2);
    n.rotation.y = sz > 0 ? th : Math.PI - th;
    const corner = sz > 0 ? -1 : 1; // which end of the facet meets the side wall
    n.add(box(Ln, H, WL, faces(m.edge, { pz: m.paint, nz: inner }), 0, FL + H / 2, -WL / 2));
    n.add(box(Ln, 4.0, 0.035, m.trim, 0, FL + 2.0, 0.018)); // gloss black diamond plate on the lower 4 ft
    n.add(box(Ln, 0.31, 0.035, m.trim, 0, RF - 0.155, 0.018));
    const mark = plane(1.02, 0.306, m.logo, corner * (Ln / 2 - 0.5), RF - 1.1, 0.012);
    mark.rotation.z = -Math.PI / 2;
    n.add(mark);
    for (const f of [0.2, 0.75]) n.add(cyl(0.04, 0.03, m.marker, corner * (Ln / 2 - f * Ln), RF - 0.42, 0.012, 'z', 10));
    for (const f of [0.26, 0.61]) n.add(box(0.22, 0.42, 0.06, m.black, corner * (Ln / 2 - f * Ln), FL + 1.41, 0.05)); // the outdoor outlets
    if (spots.has(sz > 0 ? 'noseRight' : 'noseLeft')) {
      const bw = Math.min(2.4, 1.3 * aspect);
      n.add(plane(bw, bw / aspect, m.brand, 0, FL + 5.6, 0.014));
    }
    g.add(n);
  }
  g.add(box(WL, H, FH * 2, faces(m.edge, { px: m.paint, nx: inner }), tip - WL / 2, FL + H / 2, 0));
  g.add(box(0.035, 4.0, FH * 2, m.trim, tip + 0.018, FL + 2.0, 0), box(0.035, 0.31, FH * 2, m.trim, tip + 0.018, RF - 0.155, 0));
  for (const sz of [1, -1]) g.add(cyl(0.07, H, m.trim, xf, FL + H / 2, sz * (W / 2 - 0.03)), cyl(0.07, H, m.trim, tip - 0.03, FL + H / 2, sz * (FH - 0.03)));

  // ------------------------------------------------------------ rear face: climate control hatch, lights, flag-side logo
  g.add(box(WL, H, W, faces(m.edge, { nx: m.paint, px: inner }), xr + WL / 2, FL + H / 2, 0));
  for (const sz of [1, -1]) g.add(box(0.05, H + 0.2, 0.24, m.trim, xr - 0.01, FL + (H + 0.2) / 2, sz * (W / 2 - 0.12)));
  g.add(box(0.05, 0.25, W, m.trim, xr - 0.01, RF - 0.125, 0), box(0.06, 0.4, W, m.trim, xr - 0.01, FL + 0.11, 0));
  for (const zs of [0.44, 2.98, 3.97, 4.95, 7.55]) g.add(cyl(0.045, 0.03, m.tail, xr - 0.03, FL + 7.7, -W / 2 + zs, 'x', 10));
  {
    const zc = -W / 2 + (0.2 + 3.85) / 2;
    const hf = frame(3.65, 3.72, 0.2, 0.05, m.trim);
    hf.position.set(xr - 0.03, FL + 2.22, zc);
    hf.rotation.y = Math.PI / 2;
    g.add(hf, box(0.04, 3.06, 3.12, faces(m.edge, { nx: m.paint }), xr - 0.035, FL + 2.23, -W / 2 + 1.96));
    g.add(cyl(0.07, 0.06, m.chrome, xr - 0.06, FL + 0.95, -W / 2 + 1.96, 'x', 16));
    const rl = plane(0.94, 0.28, m.logo, xr - 0.035, FL + 6.9, -W / 2 + 7.0);
    rl.rotation.y = -Math.PI / 2;
    g.add(rl);
    if (spots.has('rear')) {
      const bw = Math.min(2.6, 1.3 * aspect);
      const br = plane(bw, bw / aspect, m.brand, xr - 0.036, FL + 5.75, 1.8);
      br.rotation.y = -Math.PI / 2;
      g.add(br);
    }
  }

  // ------------------------------------------------------------ roof: five large black panels on a white deck, a white vent
  for (let i = 0; i < 5; i++) {
    const px = xr + 0.61 + 3.76 / 2 + i * 3.82;
    g.add(box(3.76, 0.1, 6.8, m.pvFrame, px, RF + 0.12, 0));
    const top = plane(6.8, 3.76, m.pvTop, px, RF + 0.172, 0);
    top.rotation.x = -Math.PI / 2;
    top.rotation.z = Math.PI / 2;
    top.receiveShadow = true;
    g.add(top);
  }
  g.add(box(1.5, 0.06, 1.5, m.roofWhite, tip - 1.7, RF + 0.03, 0), box(1.2, 0.3, 1.2, m.equipment, tip - 1.7, RF + 0.2, 0));

  // ------------------------------------------------------------ running gear and tongue
  for (const sz of [1, -1]) g.add(box(S - 0.4, 0.3, 0.24, m.chassis, xr + S / 2 + 0.3, FL - 0.15, sz * 2.6));
  for (const ax of [axleX - spread, axleX + spread]) {
    g.add(cyl(0.12, wz * 2 - 0.3, m.chassis, ax, TR, 0, 'z', 12));
    for (const sz of [1, -1]) {
      const w = wheel(m);
      w.scale.setScalar(ts);
      w.position.set(ax, TR, sz * wz);
      if (sz < 0) w.rotation.y = Math.PI;
      g.add(w);
    }
  }
  for (const sz of [1, -1]) {
    const f = archTrim(m, archX1 - archX0, FL, archTop, 0.2, m.fender);
    f.position.set((archX0 + archX1) / 2, 0, sz * W / 2);
    if (sz < 0) f.rotation.y = Math.PI;
    g.add(f);
  }
  const hitch = tip + 3.4;
  for (const sz of [1, -1]) {
    const x0 = xf - 0.4, z0 = sz * 3.0;
    const len = Math.hypot(hitch - x0, z0);
    const rail = box(len, 0.3, 0.2, m.chassis, (x0 + hitch) / 2, FL - 0.16, z0 / 2);
    rail.rotation.y = Math.atan2(z0, hitch - x0);
    g.add(rail);
  }
  g.add(box(0.9, 0.24, 0.3, m.chassis, hitch + 0.25, FL - 0.16, 0), cyl(0.16, 0.2, m.chassis, hitch + 0.62, FL - 0.2, 0, 'y', 14));
  const jackX = hitch - 1.7;
  g.add(cyl(0.1, FL + 1.0, m.chassis, jackX, (FL + 1.2) / 2, 0, 'y', 14), cyl(0.07, 0.5, m.aluminum, jackX, 0.3, 0, 'y', 12));
  g.add(box(0.42, 0.04, 0.42, m.aluminum, jackX, 0.03, 0), box(0.2, 0.16, 0.2, m.aluminum, jackX, FL + 1.25, 0));

  // ------------------------------------------------------------ the 6 ft light, the 28 ft tower, Starlink, cellular
  // SOURCE (price sheet 2026-11-20): the 6 ft light is lights only; the 28 ft tower carries one
  // camera, a light and a horn and is offered on the 20 ft. Both are drawn raised.
  const lightX = tip - 0.45, lightTop = RF + 6.2;
  if (cfg.light6) {
    g.add(box(0.6, 0.06, 0.6, m.black, lightX, RF + 0.03, 0));
    g.add(cyl(0.16, 3.2, m.black, lightX, RF + 1.66, 0, 'y', 16), cyl(0.12, 2.8, m.black, lightX, RF + 4.6, 0, 'y', 14));
    g.add(box(0.12, 0.12, 1.5, m.black, lightX, lightTop - 0.6, 0));
    for (const sz of [1, -1]) for (const dy of [-0.31, 0.31]) {
      g.add(box(0.3, 0.55, 0.55, m.black, lightX, lightTop - 0.6 + dy, sz * 0.42));
      g.add(box(0.02, 0.42, 0.42, m.lamp, lightX + 0.16, lightTop - 0.6 + dy, sz * 0.42));
    }
  }
  const towerTop = 28;
  if (cfg.tower) {
    const mx = tip + 0.68;
    g.add(box(0.9, 0.7, 2.0, m.trim, tip + 0.45, FL + 0.05, 0));
    const stages: [number, number, number][] = [[0.26, FL + 0.4, 13.0], [0.2, 12.6, 18.5], [0.15, 18.1, 23.5], [0.11, 23.1, towerTop - 0.4]];
    for (const [rr, y1, y2] of stages) {
      g.add(cyl(rr, y2 - y1, m.black, mx, (y1 + y2) / 2, 0, 'y', 18));
      g.add(cyl(rr + 0.04, 0.16, m.graphite, mx, y2 - 0.08, 0, 'y', 18));
    }
    g.add(box(mx - tip, 0.12, 0.3, m.black, (mx + tip) / 2, FL + 3.8, 0));
    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.04, 8, 28), m.black);
    torus.rotation.x = Math.PI / 2;
    torus.position.set(mx, FL + 5.3, 0);
    g.add(torus);
    // head: a crossbar, two flood lights above it, one camera hanging from the curb end, the horn in the middle
    const cy = towerTop - 0.9;
    g.add(box(0.35, 0.08, 2.3, m.black, mx, cy, 0));
    for (const sz of [1, -1]) {
      const fl = new THREE.Group();
      fl.position.set(mx, cy + 0.5, sz * 0.5);
      fl.rotation.y = sz * 0.2;
      fl.add(box(0.3, 0.67, 0.92, m.black, 0, 0, 0), box(0.02, 0.55, 0.8, m.lamp, 0.16, 0, 0));
      g.add(fl);
    }
    g.add(cyl(0.04, 0.8, m.black, mx, cy - 0.4, 1.05, 'y', 8), cyl(0.3, 0.6, m.graphite, mx, cy - 1.1, 1.05, 'y', 20));
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), m.glass);
    dome.position.set(mx, cy - 1.4, 1.05);
    g.add(dome);
    const horn = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.26, 0.5, 22), m.equipment);
    horn.rotation.z = Math.PI / 2;
    horn.position.set(mx + 0.4, cy - 0.35, 0);
    g.add(horn);
  }
  if (cfg.starlink) {
    const dish = new THREE.Group();
    if (cfg.light6) dish.position.set(lightX, lightTop + 0.22, 0);
    else {
      g.add(cyl(0.06, 1.3, m.black, xf + 0.45, RF + 0.65, 1.25, 'y', 12));
      dish.position.set(xf + 0.45, RF + 1.4, 1.25);
    }
    dish.add(box(1.25, 0.09, 1.9, m.equipment, 0, 0, 0), box(0.3, 0.2, 0.3, m.graphite, 0, -0.13, 0));
    dish.rotation.z = -0.28;
    g.add(dish);
  }
  if (cfg.cellular) g.add(cyl(0.28, 0.14, m.black, xf + 0.32, RF + 0.07, 2.3, 'y', 24), cyl(0.02, 0.9, m.black, xf + 0.32, RF + 0.55, 2.3, 'y', 8));

  // ------------------------------------------------------------ interior
  // The nose wall, with the climate control head on its street half and a closet door on its curb half
  const nwx = xf - 0.06;
  g.add(box(0.12, CEIL - Y0, zi * 2, faces(m.edge, { nx: inner, px: inner }), nwx, (Y0 + CEIL) / 2, 0));
  g.add(box(0.7, 2.2, 3.0, m.module, nwx - 0.41, Y0 + 3.8, -1.0));
  g.add(box(0.02, 1.7, 2.7, m.board, nwx - 0.77, Y0 + 3.9, -1.0), box(0.02, 0.12, 2.6, m.black, nwx - 0.77, Y0 + 2.9, -1.0));
  {
    const cd = box(0.05, 6.67, 2.67, faces(m.edge, { nx: wood ? m.casework : m.board }), nwx - 0.09, Y0 + 3.335, 2.07);
    const ct = frame(2.67 + 0.2, 6.67 + 0.15, 0.1, 0.03, m.black);
    ct.position.set(nwx - 0.08, Y0 + 3.4, 2.07);
    ct.rotation.y = Math.PI / 2;
    g.add(cd, ct, cyl(0.07, 0.1, m.black, nwx - 0.14, Y0 + 3.0, 0.9, 'x', 14));
  }
  // the battery units, in closed boxes over the wheels (white with black banding, or black on wood),
  // one lift-out panel per 5 kWh unit, street side first
  let left = cfg.batteryModules;
  for (const wall of [-1, 1]) {
    const n = Math.min(wall < 0 ? Math.ceil(left / 2) : left, 2);
    left -= n;
    const ex0 = at(6.8), ex1 = at(13.0), el = ex1 - ex0, eh = wood ? 3.4 : 2.8;
    const shell = wood ? m.casework : m.equipment;
    const dark = wall > 0 ? { pz: m.chassis, ny: m.chassis } : { nz: m.chassis, ny: m.chassis };
    const innerZ = zi - 1.2;
    g.add(box(el, eh, wellZ - innerZ, faces(shell, dark), (ex0 + ex1) / 2, Y0 + eh / 2, wall * (innerZ + wellZ) / 2));
    g.add(box(el, 0.08, zi - wellZ, faces(shell, dark), (ex0 + ex1) / 2, Y0 + eh - 0.04, wall * (wellZ + zi) / 2));
    g.add(box(el + 0.16, 0.06, 1.36, wood ? m.casework : m.black, (ex0 + ex1) / 2, Y0 + eh + 0.03, wall * (zi - 0.62)));
    // close the ends over the tire, so the wheel doesn't show from the room
    for (const ex of [ex0 + 0.03, ex1 - 0.03]) g.add(box(0.06, eh, zi - wellZ, shell, ex, Y0 + eh / 2, wall * (wellZ + zi) / 2));
    for (let i = 0; i < n; i++) {
      const ux = ex0 + (el * (i + 0.5)) / Math.max(n, 1) + (n === 1 ? 0 : 0);
      g.add(box(0.06, eh * 0.55, 0.02, m.black, ux, Y0 + eh * 0.5, wall * (innerZ - 0.012)));
    }
  }
  // the built-in work desk (standard), on the street wall ahead of the battery box
  {
    const d0 = at(13.3), d1 = at(17.15), dz = -(zi - 1.0);
    g.add(box(d1 - d0, 0.08, 2.0, wood ? m.casework : m.equipment, (d0 + d1) / 2, Y0 + 2.5, dz));
    for (const ex of [d0 + 0.25, d1 - 0.25]) {
      g.add(box(0.08, 0.08, 1.8, m.black, ex, Y0 + 2.42, dz));
      g.add(box(0.08, 1.2, 0.08, m.black, ex, Y0 + 1.86, -(zi - 0.06)));
    }
    // the front street corner box behind the street hatch, and the climate control box at the rear
    g.add(box(xf - 0.12 - at(17.4), 1.8, 1.5, wood ? m.veneer : m.equipment, (at(17.4) + xf - 0.12) / 2, Y0 + 0.9, -(zi - 0.75)));
    g.add(box(2.4, 3.9, zi - 0.1, faces(wood ? m.veneer : m.equipment, {}), xr + WL + 1.2, Y0 + 1.95, -(zi + 0.1) / 2));
  }
  // lights: two rows of round recessed downlights, and on wood a warm strip where the walls meet the ceiling
  for (let i = 0; i < 7; i++) for (const sz of [1, -1]) {
    const lx = xr + (S * (i + 0.5)) / 7;
    g.add(cyl(0.25, 0.03, m.board, lx, CEIL - 0.015, sz * 1.95, 'y', 28), cyl(0.2, 0.034, m.lamp, lx, CEIL - 0.02, sz * 1.95, 'y', 28));
  }
  if (wood) {
    for (const sz of [1, -1]) g.add(box(S - 0.4, 0.05, 0.05, m.amberStrip, xr + S / 2, CEIL - 0.04, sz * (zi - 0.04)));
    g.add(box(0.05, 0.05, zi * 2, m.amberStrip, xr + WL + 0.04, CEIL - 0.04, 0), box(0.05, 0.05, zi * 2, m.amberStrip, nwx - 0.1, CEIL - 0.04, 0));
  } else {
    for (const sz of [1, -1]) g.add(box(S - 0.2, 0.12, 0.12, m.black, xr + S / 2, CEIL - 0.06, sz * (zi - 0.06)));
  }
  for (const lx of [xr + S * 0.2, xr + S * 0.5, xr + S * 0.8]) {
    const light = new THREE.PointLight(wood ? '#ffe2b8' : '#f6f8fc', 7, 22, 1.6);
    light.position.set(lx, CEIL - 0.9, 0);
    g.add(light);
  }

  const eye = new THREE.Vector3(xr + 0.9, Y0 + 4.3, 0.9);
  const look = new THREE.Vector3(xf - 0.3, Y0 + 3.0, -0.2);
  return {
    group: g,
    body: { length: S + NZ, W, H, floor: FL, roof: RF, wheels: new THREE.Vector3(axleX, 1.9, W / 2), eye, look },
    barn: [],
    ramp: null,
    sideDoor: doors[1],
    moreDoors: [doors[0]],
    skipped: [],
    tall: !!(cfg.light6 || cfg.tower),
    top: cfg.tower ? towerTop + 0.4 : cfg.light6 ? lightTop + 0.3 : RF + 1.5,
    rampAngle: 0,
    anchors: {
      solar: new THREE.Vector3(xr + S * 0.42, RF + 0.2, 0.6),
      door: new THREE.Vector3(at(17.7), Y0, W / 2),
      power: new THREE.Vector3(xf + 1.55, RF, 1.2),
      wheels: new THREE.Vector3(axleX - spread, 0.6, wz + 0.3),
    },
    dispose() {
      g.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
      });
    },
  };
}
