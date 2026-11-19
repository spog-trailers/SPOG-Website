/**
 * Procedural 3D model of the SPOG Cargo trailer, built to match Nate's photos of the finished
 * black 20 ft (_photos-original/2026-11-17/Black Cargo Trailer). It's modeled in code, not CAD,
 * so treat it as a close stand-in until real 3D files exist.
 *
 * Units are feet. Axes: +x is the front (V nose and tongue), +y is up, +z is the curb side.
 *   Curb side (+z):   entry door with a window, right behind the nose.
 *   Street side (-z): sliding window over the axles, two-door storage hatch low at the front.
 *   Rear (-x):        barn doors with twin chrome lock bars, four oval tail lights.
 *   Nose:             two flat panels with a black tread-plate stone guard, spare on the tongue.
 *   Roof:             silver, with solar panels laid across it and a low vent over the nose.
 * The body is hollow with a finished interior, so the doors can open and the camera can go inside.
 * The inside follows Nate's Better Interior photos (same folder, rebuilt 2026-11-19): glossy white
 * wall panels with faint seams, a black diamond-plate angle where walls meet the ceiling, two rows of
 * black-rimmed puck lights, a smooth charcoal rubber floor, a white nose wall with the heat and AC
 * head and a single-panel closet door, and open-cage battery units on low white platforms mid-length.
 */
import * as THREE from 'three';
import { FLOOR, H, NOSE, PANEL_ACROSS, PANEL_ALONG, PANEL_PITCH, ROOF, W, WALL, axleCenter, sideLength, tandem } from './dims';

/** What the buyer picked. The options are the ones on SPOG's customization sheet (see data.ts). */
export interface TrailerConfig {
  length: number;
  paint: string;
  paintDark: boolean;
  matte: boolean;
  batteryModules: number;
  doorsOpen: boolean;
  /** Logo spots as a sorted, comma-joined list: noseLeft, noseRight, left, right, rear. */
  logoSpots: string;
  brand: string;
  /** Width over height of the logo art, so the decal keeps its shape. */
  logoAspect: number;
  hvac: boolean;
  desks: number;
  benchLength: number;
  cabinets: number;
  shelving: boolean;
  overhead: boolean;
  whiteboard: boolean;
  tv: boolean;
  fridge: boolean;
  microwave: boolean;
  counter: boolean;
  etrackWalls: boolean;
  etrackFloor: boolean;
  starlink: boolean;
  cellular: boolean;
  mast: boolean;
  cameras: boolean;
  audio: boolean;
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
 * Charcoal rubber floor, as in the Better Interior photos (2026-11-19): smooth and matte, with a
 * fine speckle and a few soft scuffs. No coin pattern, which the real floor doesn't have.
 */
function rubberFloorTexture() {
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
    // faint seams, a white ceiling, a smooth charcoal rubber floor and open-slot black E-track.
    liner: new THREE.MeshStandardMaterial({ color: '#f2f3f2', roughness: 0.3, metalness: 0.02, envMapIntensity: 0.85 }),
    joint: new THREE.MeshStandardMaterial({ color: '#a9abaf', roughness: 0.5, metalness: 0.2, transparent: true, opacity: 0.2 }),
    ceiling: new THREE.MeshStandardMaterial({ color: '#eceeed', roughness: 0.48, metalness: 0.02, side: THREE.DoubleSide, envMapIntensity: 0.75 }),
    floor: new THREE.MeshStandardMaterial({ map: tile(rubberFloorTexture(), 3.2), roughness: 0.62, metalness: 0, envMapIntensity: 0.6 }),
    etrack: new THREE.MeshStandardMaterial({ map: tile(etrackTexture(), 1 / 6, 5 / 12), roughness: 0.42, metalness: 0.45 }),
    cage: new THREE.MeshStandardMaterial({ color: '#b7babe', roughness: 0.42, metalness: 0.72 }),
    module: new THREE.MeshStandardMaterial({ color: '#e7e8e6', roughness: 0.55, metalness: 0.05 }),
    logo: decal(),
    brand: decal(),
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

/** Aluminum teardrop fender, a bent plate with a flat lip on its outer edge. Extends toward +z. */
function fender(m: Materials, len: number) {
  const top = TIRE_R * 2 + 0.2;
  const bottom = FLOOR;
  const r = 0.95;
  const ring = (t: number) => {
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
  };
  const g = new THREE.Group();
  const plate = new THREE.Mesh(new THREE.ExtrudeGeometry(ring(0.05), { depth: 0.86, bevelEnabled: false, curveSegments: 20 }), m.aluminum);
  const lip = new THREE.Mesh(new THREE.ExtrudeGeometry(ring(0.24), { depth: 0.045, bevelEnabled: false, curveSegments: 20 }), m.aluminum);
  lip.position.z = 0.83;
  [plate, lip].forEach((p) => { p.castShadow = true; p.receiveShadow = true; });
  g.add(plate, lip);
  return g;
}

// ---------------------------------------------------------------- the trailer

export interface TrailerParts {
  group: THREE.Group;
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
  dispose: () => void;
}

export function buildTrailer(cfg: TrailerConfig, m: Materials): TrailerParts {
  const g = new THREE.Group();
  const L = cfg.length;
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

  // ------------------------------------------------------------ floor, roof, ceiling
  const footprint = new THREE.Shape();
  footprint.moveTo(xr, -W / 2);
  footprint.lineTo(xf, -W / 2);
  footprint.lineTo(tip, 0);
  footprint.lineTo(xf, W / 2);
  footprint.lineTo(xr, W / 2);
  footprint.closePath();
  const slab = (depth: number, y: number, mat: Mat) => {
    const s = new THREE.Mesh(new THREE.ExtrudeGeometry(footprint, { depth, bevelEnabled: false }), mat);
    s.rotation.x = -Math.PI / 2;
    s.position.y = y;
    s.castShadow = true;
    s.receiveShadow = true;
    return s;
  };
  g.add(slab(0.13, FLOOR, m.chassis), slab(0.1, ROOF - 0.1, m.roof));
  const floorTop = new THREE.Mesh(new THREE.ShapeGeometry(footprint), m.floor);
  floorTop.rotation.x = -Math.PI / 2;
  floorTop.position.y = y0;
  floorTop.receiveShadow = true;
  const ceiling = new THREE.Mesh(new THREE.ShapeGeometry(footprint), m.ceiling);
  ceiling.rotation.x = -Math.PI / 2;
  ceiling.position.y = ROOF - 0.11;
  g.add(floorTop, ceiling);

  // ------------------------------------------------------------ street-side wall (-z)
  g.add(box(S, H, WALL, paintOut('nz', 'pz'), xr + S / 2, yc, -W / 2 + WALL / 2));

  // ------------------------------------------------------------ curb-side wall (+z), with the door opening
  const dw = 2.9;
  const dh = 5.85;
  const doorFront = xf - 0.14;
  const doorRear = doorFront - dw;
  const doorBottom = FLOOR + 0.6;
  const doorTop = doorBottom + dh;
  const cz = W / 2 - WALL / 2;
  g.add(box(doorRear - xr, H, WALL, paintOut('pz', 'nz'), (xr + doorRear) / 2, yc, cz));
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
    const gw = 1.7, gh = 2.7, gy = dh - 0.5 - gh / 2;
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
  for (const sz of [1, -1]) {
    g.add(box(S, 0.3, 0.035, m.trim, xr + S / 2, ROOF - 0.15, sz * out));
    g.add(box(S, 0.26, 0.035, m.trim, xr + S / 2, FLOOR + 0.13, sz * out));
    g.add(box(0.2, H, 0.035, m.trim, xr + 0.1, yc, sz * out));
    for (let x = xr + 4; x < xf - 0.6; x += 4) {
      if (sz > 0 && x > doorRear - 0.2) continue;
      g.add(box(0.014, H - 0.56, 0.008, m.seam, x, FLOOR + 0.26 + (H - 0.56) / 2, sz * (W / 2 + 0.004)));
    }
    for (let x = xr + 2; x < xf; x += 4) g.add(cyl(0.03, 0.03, m.marker, x, ROOF - 0.4, sz * (W / 2 + 0.012), 'z', 10));
    g.add(cyl(0.035, 0.03, m.tail, xr + 0.35, ROOF - 0.4, sz * (W / 2 + 0.03), 'z', 10));
    // SPOG logo high at the rear of each side
    const logo = plane(2.0, 0.6, m.logo, xr + 1.55, ROOF - 1.08, sz * (W / 2 + 0.012));
    if (sz < 0) logo.rotation.y = Math.PI;
    g.add(logo);
    if (spots.has(sz > 0 ? 'right' : 'left')) {
      const room = Math.min(S * 0.5, 9);
      const bh = Math.min(2.2, room / aspect);
      const brand = plane(bh * aspect, bh, m.brand, xr + 0.9 + room / 2, FLOOR + 3.25, sz * (W / 2 + 0.012));
      if (sz < 0) brand.rotation.y = Math.PI;
      g.add(brand);
    }
  }

  // small fasteners along the top and bottom rails, as one instanced mesh
  {
    const pts: [number, number, number][] = [];
    for (const sz of [1, -1]) for (let x = xr + 0.5; x < xf - 0.2; x += 0.72) {
      pts.push([x, ROOF - 0.07, sz * (out + 0.02)], [x, FLOOR + 0.2, sz * (out + 0.02)]);
    }
    const rivets = new THREE.InstancedMesh(new THREE.SphereGeometry(0.022, 8, 6), m.rivet, pts.length);
    const mat4 = new THREE.Matrix4();
    pts.forEach(([x, y, z], i) => rivets.setMatrixAt(i, mat4.makeTranslation(x, y, z)));
    g.add(rivets);
  }

  // ------------------------------------------------------------ street side: window and hatch
  const axleX = xf - axleCenter(L);
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
  {
    const hw = Math.min(4.4, S * 0.3), hh = 2.1;
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
    for (const ly of [FLOOR + 1.63, FLOOR + 5.45]) {
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
  if (count > 0) {
    const run = count * PANEL_PITCH;
    for (const sz of [1, -1]) g.add(box(run, 0.07, 0.12, m.aluminum, xr + 0.12 + run / 2, ROOF + 0.035, sz * 2.3));
    for (let i = 0; i < count; i++) {
      const px = xr + 0.12 + PANEL_PITCH * (i + 0.5);
      g.add(box(PANEL_ALONG, 0.11, PANEL_ACROSS, m.pvFrame, px, ROOF + 0.125, 0));
      const top = plane(PANEL_ACROSS, PANEL_ALONG, m.pvTop, px, ROOF + 0.183, 0);
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
  for (const sz of [1, -1]) g.add(box(S - 0.4, 0.3, 0.24, m.chassis, xr + S / 2 + 0.5, FLOOR - 0.15, sz * 2.3));
  const axles = tandem(L) ? [axleX - 1.2, axleX + 1.2] : [axleX];
  const wz = W / 2 + 0.45;
  for (const ax of axles) {
    g.add(cyl(0.12, W + 0.5, m.chassis, ax, TIRE_R, 0, 'z', 12));
    for (const sz of [1, -1]) {
      const w = wheel(m);
      w.position.set(ax, TIRE_R, sz * wz);
      if (sz < 0) w.rotation.y = Math.PI;
      g.add(w);
    }
  }
  const fenderLen = tandem(L) ? 5.3 : 2.9;
  for (const sz of [1, -1]) {
    const f = fender(m, fenderLen);
    f.position.set(axleX, 0, sz > 0 ? W / 2 : -W / 2);
    if (sz < 0) f.rotation.y = Math.PI;
    g.add(f);
    // tread plate behind the fender ends, as in the photos
    for (const e of [-1, 1]) g.add(box(0.5, 0.75, 0.03, m.trim, axleX + e * (fenderLen / 2 + 0.25), FLOOR + 0.37, sz * out));
  }

  // ------------------------------------------------------------ tongue, jack, spare
  const hitch = tip + 3.3;
  for (const sz of [1, -1]) {
    const x0 = xf - 0.6, z0 = sz * 2.5;
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
    const sx = xf + 1.1;
    const nz = (W / 2) * (1 - (sx - xf) / NOSE);
    const spare = wheel(m);
    spare.position.set(sx, 1.72, -(nz + 0.52));
    spare.rotation.y = Math.PI;
    g.add(spare);
    g.add(box(0.16, 1.3, 0.16, m.chassis, sx, 1.55, -(nz + 0.14)));
    g.add(box(0.5, 0.12, 0.5, m.chassis, sx, 1.0, -(nz + 0.3)));
  }
  // ------------------------------------------------------------ connectivity and security
  if (cfg.cameras) {
    // standard cameras: one on each rear corner and one on the nose
    const cam = (x: number, y: number, z: number, yaw: number) => {
      const c = new THREE.Group();
      c.position.set(x, y, z);
      c.rotation.y = yaw;
      c.add(box(0.12, 0.12, 0.12, m.equipment, 0, 0, 0));
      const body = cyl(0.085, 0.42, m.equipment, 0.26, -0.08, 0, 'x', 16);
      body.rotation.z = Math.PI / 2 + 0.3;
      c.add(body);
      const lens = cyl(0.06, 0.02, m.glass, 0.46, -0.14, 0, 'x', 16);
      lens.rotation.z = Math.PI / 2 + 0.3;
      c.add(lens);
      g.add(c);
    };
    cam(xr - 0.08, ROOF - 0.75, W / 2 - 0.28, Math.PI);
    cam(xr - 0.08, ROOF - 0.75, -(W / 2 - 0.28), Math.PI);
    cam(tip + 0.02, ROOF - 0.75, 0, 0);
  }
  const mastX = tip + 0.42;
  const mastTop = ROOF + 6.2;
  if (cfg.mast) {
    // AI job site camera system: the telescoping mast at the nose with two dome cameras under a
    // crossbar and work lights above it, as on the Workstation photos (ws-starlink.jpg).
    g.add(box(0.55, 0.5, 0.55, m.chassis, mastX, FLOOR + 0.1, 0));
    g.add(cyl(0.2, 5.2, m.black, mastX, FLOOR + 2.8, 0, 'y', 16));
    g.add(cyl(0.15, 5.0, m.black, mastX, FLOOR + 7.4, 0, 'y', 16));
    g.add(cyl(0.1, mastTop - (FLOOR + 9.6), m.black, mastX, (mastTop + FLOOR + 9.6) / 2, 0, 'y', 14));
    for (const by of [FLOOR + 2.2, ROOF - 0.6]) g.add(box(0.5, 0.12, 0.3, m.black, tip + 0.18, by, 0));
    const cy = mastTop - 1.5;
    g.add(box(0.14, 0.14, 2.6, m.black, mastX, cy, 0));
    for (const sz of [1, -1]) {
      g.add(cyl(0.05, 0.5, m.black, mastX, cy - 0.3, sz * 1.1, 'y', 10));
      g.add(cyl(0.3, 0.3, m.graphite, mastX, cy - 0.6, sz * 1.1, 'y', 20));
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), m.glass);
      dome.position.set(mastX, cy - 0.75, sz * 1.1);
      dome.castShadow = true;
      g.add(dome);
      g.add(box(0.5, 0.55, 0.75, m.black, mastX, cy + 0.45, sz * 0.75));
      g.add(box(0.03, 0.42, 0.62, m.lamp, mastX + 0.26, cy + 0.45, sz * 0.75));
    }
  }
  if (cfg.starlink) {
    // The dish rides on top of the mast when there is one, else on a short pole over the nose.
    const dish = new THREE.Group();
    if (cfg.mast) dish.position.set(mastX, mastTop + 0.22, 0);
    else {
      g.add(cyl(0.06, 1.3, m.black, xf + 1.45, ROOF + 0.65, 0, 'y', 12));
      dish.position.set(xf + 1.45, ROOF + 1.4, 0);
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
  if (cfg.audio) {
    // horn and strobe on a bracket at the front street-side corner
    const ax = xf - 0.9;
    const az = -(W / 2 + 0.3);
    g.add(box(0.5, 0.08, 0.6, m.black, ax, ROOF - 0.62, az));
    const horn = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.3, 0.6, 22), m.equipment);
    horn.rotation.x = Math.PI / 2;
    horn.position.set(ax, ROOF - 0.95, az - 0.12);
    horn.castShadow = true;
    g.add(horn, cyl(0.12, 0.1, m.black, ax, ROOF - 0.54, az - 0.1, 'y', 16));
    const strobe = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), m.amber);
    strobe.scale.y = 1.4;
    strobe.position.set(ax, ROOF - 0.5, az - 0.1);
    g.add(strobe);
  }

  // ------------------------------------------------------------ interior
  // Rebuilt from Nate's Better Interior photos (2026-11-19). A flat white wall closes off the nose,
  // with the heat and AC head high on its street half and a white single-panel closet door on its
  // curb half. Glossy white wall panels with faint seams every 4 ft, a black diamond-plate angle
  // where the walls meet the ceiling, two rows of round puck lights with black rims, and a smooth
  // charcoal rubber floor. The battery units stand mid-length on low white platforms.
  const px = xf - 0.06;
  g.add(box(0.12, H - 0.26, W - WALL * 2, faces(m.edge, { nx: m.liner, px: m.liner }), px, yc, 0));
  {
    // closet door: one recessed panel, three black hinges on the curb edge, a round black knob
    const dz = 1.85, dw2 = 2.5, dh2 = 6.65;
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
  for (let i = 0; i < perRow; i++) for (const sz of [1, -1]) {
    const lx = xr + (S * (i + 0.5)) / perRow;
    g.add(cyl(0.31, 0.03, m.black, lx, bandY - 0.015, sz * 1.6, 'y', 32), cyl(0.255, 0.036, m.lamp, lx, bandY - 0.02, sz * 1.6, 'y', 32));
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
    // the wall-mounted indoor head, high on the street half of the nose wall, just under the trim
    const hz = -1.75;
    const hy = bandY - 0.34 - 0.18 - 0.475;
    g.add(box(0.6, 0.95, 2.65, m.module, px - 0.36, hy, hz));
    g.add(box(0.04, 0.82, 2.55, m.board, px - 0.67, hy + 0.04, hz));
    g.add(box(0.06, 0.08, 2.35, m.graphite, px - 0.62, hy - 0.4, hz));
    g.add(box(0.012, 0.07, 0.34, m.display, px - 0.69, hy - 0.18, hz + 0.75));
  }

  // Battery units, 5 kWh each, stand on low white platforms with black channel on top. On the 20 ft
  // they sit mid-length by the window, with the desk running from them to the nose (as photographed).
  // Short trailers keep them at the rear so the front stays open.
  const wallEnd: Record<number, number> = { [-1]: xf - 0.3, [1]: doorRear - 0.5 };
  /** Free stretches of each wall, rear to front, that the furniture packs into. */
  const free: Record<number, [number, number][]> = { [-1]: [[xr + 0.6, wallEnd[-1]]], [1]: [[xr + 0.6, wallEnd[1]]] };
  {
    const unit = 1.55;
    const zone0 = S > 12 ? Math.max(xr + 5.8, winX - 1.0) : xr + 1.2; // about 6 ft in from the rear doors, as measured off photo 60
    let left = cfg.batteryModules;
    for (const wall of [-1, 1]) {
      const room = Math.max(0, Math.floor((wallEnd[wall] - zone0 - 0.5) / unit));
      const n = Math.min(wall < 0 ? Math.ceil(left / 2) : left, room, 4);
      left -= n;
      if (!n) continue;
      const len = n * unit + 0.5;
      const x0 = zone0;
      // platform with two runs of black channel along the top
      g.add(box(len, 0.95, 1.3, m.equipment, x0 + len / 2, y0 + 0.475, wall * (zi - 0.65)));
      for (const off of [0.32, 1.05]) g.add(box(len - 0.12, 0.13, 0.15, m.black, x0 + len / 2, y0 + 1.0, wall * (zi - off)));
      // a duplex outlet on the wall just behind the platform
      g.add(box(0.24, 0.38, 0.02, m.board, x0 - 0.45, y0 + 1.3, wall * (zi - 0.01)));
      for (const oy of [1.21, 1.39]) g.add(box(0.1, 0.06, 0.012, m.graphite, x0 - 0.45, y0 + oy, wall * (zi - 0.022)));
      for (let i = 0; i < n; i++) {
        // open aluminum cage around a white module, red terminal caps and cable on top
        const u = new THREE.Group();
        u.position.set(x0 + 0.25 + unit * (i + 0.5), y0 + 1.07, wall * (zi - 0.48));
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
      // the platform splits the wall into a stretch behind it and one in front of it
      free[wall] = [[xr + 0.6, x0 - 0.9], [x0 + len + 0.3, wallEnd[wall]]].filter(([a, b]) => b - a > 0.5) as [number, number][];
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

  // A tabletop host for the microwave: the counter first, then cabinets, then the fridge.
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
  if (cfg.shelving) {
    const len = S > 12 ? 3.6 : 2.6;
    const r = place(len, -1, 'the shelving');
    if (r) {
      const depth = 1.5;
      for (const ex of [-1, 1]) for (const ez of [0.08, depth - 0.08]) r.add(box(0.1, 5.2, 0.1, m.steel, ex * (len / 2 - 0.05), 2.6, ez));
      for (const sy of [0.5, 1.9, 3.3, 4.7]) r.add(box(len, 0.07, depth, m.steel, 0, sy, depth / 2));
      for (let i = 0; i < 3; i++) r.add(box(0.9, 0.62, 1.05, i === 1 ? m.gold : m.graphite, -len / 2 + 0.7 + i * ((len - 1.4) / 2), 2.26, 0.72));
    }
  }
  for (let i = 0; i < cfg.desks; i++) {
    // As built: a long black top on a solid white base, from the batteries to the nose wall on the
    // street side. It runs as long as the wall allows, up to 6.5 ft (about 4 ft on the 10 ft).
    const room = frontRoom();
    const len = i === 0 ? (room >= 3.5 ? Math.min(6.5, room) : 4.5) : 4.5;
    const d = i === 0 ? placeFront(len, cfg.desks > 1 ? 'an office desk' : 'the office desk') : place(len, -1, 'an office desk');
    if (!d) continue;
    const depth = 2.0;
    d.add(box(len + 0.04, 0.09, depth + 0.06, m.top, 0, 2.48, depth / 2 + 0.01));
    d.add(box(len - 0.06, 2.43, depth - 0.12, m.equipment, 0, 1.215, (depth - 0.12) / 2));
    for (const gx of [-len * 0.3, len * 0.3]) d.add(box(0.22, 0.012, 0.1, m.graphite, gx, 2.53, 0.35));
  }
  if (cfg.cabinets) {
    const len = cfg.cabinets * 2.4;
    const c = place(len, 1, cfg.cabinets > 1 ? 'the cabinets' : 'the cabinet');
    if (c) {
      casework(c, len, 1.9, 3.0, cfg.cabinets * 2);
      host = { slot: c, x: -len / 2 + 1.2, top: 3.11, depth: 1.9 };
    }
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

  // Wall-hung pieces on the curb side: overhead storage along the top, then the board and screen.
  const wallRun = doorRear - xr - 1.6;
  if (cfg.overhead) {
    const len = Math.min(8, doorRear - xr - 1.2);
    const c = new THREE.Group();
    c.position.set(xr + 0.7 + len / 2, ROOF - 0.12, zi);
    const doors = Math.max(2, Math.round(len / 2));
    c.add(box(len, 1.4, 1.15, m.equipment, 0, -0.7, -0.575));
    for (let i = 0; i < doors; i++) {
      const cx = -len / 2 + (len / doors) * (i + 0.5);
      c.add(box(len / doors - 0.06, 1.3, 0.03, m.board, cx, -0.7, -1.165));
      c.add(box(0.3, 0.04, 0.04, m.black, cx, -1.22, -1.19));
    }
    g.add(c);
  }
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
    for (const sz of [1, -1]) g.add(box(S - 2.4, 0.03, 0.26, m.track, xr + (S - 2.4) / 2 + 0.5, y0 + 0.016, sz * 1.15));
  }

  // Center the body (not the tongue) on the origin so it turns about its middle.
  const anchors = {
    solar: new THREE.Vector3(xr + S * 0.42, ROOF + 0.2, 0.6),
    door: new THREE.Vector3(doorRear + dw / 2, FLOOR, W / 2),
    power: new THREE.Vector3(xf + NOSE * 0.55, ROOF, (W / 2) * 0.45),
    wheels: new THREE.Vector3(axleX - 1.2, 0.5, wz + 0.3),
  };

  return {
    group: g,
    barn,
    ramp: null,
    sideDoor,
    skipped,
    tall: cfg.mast,
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
