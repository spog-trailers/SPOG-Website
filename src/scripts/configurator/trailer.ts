/**
 * Procedural 3D model of the SPOG Cargo trailer, built to match Nate's photos of the finished
 * black 20 ft (_photos-original/2026-11-17/Black Cargo Trailer). It's modeled in code, not CAD,
 * so treat it as a close stand-in until real 3D files exist.
 *
 * Units are feet. Axes: +x is the front (V nose and tongue), +y is up, +z is the curb side.
 *   Curb side (+z):   entry door with a window, right behind the nose.
 *   Street side (-z): sliding window over the axles, two-door storage hatch low at the front.
 *   Rear (-x):        barn doors with twin chrome lock bars (or a ramp door), four oval tail lights.
 *   Nose:             two flat panels with a black tread-plate stone guard, spare on the tongue.
 *   Roof:             silver, with solar panels laid across it and a low vent over the nose.
 * The body is hollow with a finished interior, so the doors can open and the camera can go inside.
 */
import * as THREE from 'three';
import { FLOOR, H, NOSE, PANEL_ACROSS, PANEL_ALONG, PANEL_PITCH, ROOF, W, WALL, axleCenter, sideLength, tandem } from './dims';

export interface TrailerConfig {
  length: number;
  paint: string;
  paintDark: boolean;
  trim: 'black' | 'aluminum';
  wheels: 'machined' | 'black' | 'silver';
  panels: number;
  batteryModules: number;
  rear: 'barn' | 'ramp';
  doorsOpen: boolean;
  window: boolean;
  hatch: boolean;
  spare: boolean;
  vent: boolean;
  floods: boolean;
  cameras: boolean;
  hvac: boolean;
  walls: 'white' | 'plywood' | 'black';
  floor: 'rubber' | 'wood' | 'plate';
  shelving: boolean;
  bench: boolean;
  cabinets: boolean;
  etrack: boolean;
  brand: string;
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

/** Company name decal for the sides. */
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
    paint: new THREE.MeshPhysicalMaterial({ color: '#141416', roughness: 0.34, metalness: 0.5, clearcoat: 0.6, clearcoatRoughness: 0.3 }),
    seam: new THREE.MeshStandardMaterial({ color: '#050506', roughness: 0.6, metalness: 0.3, transparent: true, opacity: 0.55 }),
    trim: new THREE.MeshStandardMaterial({ color: '#1a1b1e', roughness: 0.46, metalness: 0.7, bumpMap: plate, bumpScale: 1.6 }),
    edge: new THREE.MeshStandardMaterial({ color: '#16171a', roughness: 0.5, metalness: 0.6 }),
    black: new THREE.MeshStandardMaterial({ color: '#111214', roughness: 0.55, metalness: 0.4 }),
    chassis: new THREE.MeshStandardMaterial({ color: '#0d0e10', roughness: 0.7, metalness: 0.4 }),
    aluminum: new THREE.MeshStandardMaterial({ color: '#c9ccd1', roughness: 0.32, metalness: 0.92 }),
    chrome: new THREE.MeshStandardMaterial({ color: '#e9ebee', roughness: 0.12, metalness: 1 }),
    roof: new THREE.MeshStandardMaterial({ color: '#d4d7db', roughness: 0.42, metalness: 0.75 }),
    glass: new THREE.MeshPhysicalMaterial({ color: '#07090c', roughness: 0.06, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.6 }),
    daylight: new THREE.MeshBasicMaterial({ color: '#f2f6fa' }),
    rubber: new THREE.MeshStandardMaterial({ color: '#131314', roughness: 0.9, metalness: 0, side: THREE.DoubleSide }),
    rimBarrel: new THREE.MeshStandardMaterial({ color: '#0e0f11', roughness: 0.35, metalness: 0.85, side: THREE.DoubleSide }),
    spokeSide: new THREE.MeshStandardMaterial({ color: '#0e0f11', roughness: 0.3, metalness: 0.85 }),
    spokeFace: new THREE.MeshStandardMaterial({ color: '#d7dade', roughness: 0.2, metalness: 1 }),
    pvFrame: new THREE.MeshStandardMaterial({ color: '#0c0d0f', roughness: 0.45, metalness: 0.6 }),
    pvTop: new THREE.MeshPhysicalMaterial({ map: solarCellTexture(), roughness: 0.14, metalness: 0.3, clearcoat: 1, clearcoatRoughness: 0.05 }),
    tail: new THREE.MeshStandardMaterial({ color: '#7a0c0c', emissive: '#d01208', emissiveIntensity: 0.35, roughness: 0.18, metalness: 0.2 }),
    marker: new THREE.MeshStandardMaterial({ color: '#9a5200', emissive: '#ff9a1a', emissiveIntensity: 0.45, roughness: 0.3 }),
    lamp: new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#fff4de', emissiveIntensity: 0.9, roughness: 0.3 }),
    screen: new THREE.MeshStandardMaterial({ color: '#0d1a14', emissive: '#58e39a', emissiveIntensity: 0.9, roughness: 0.3 }),
    gold: new THREE.MeshStandardMaterial({ color: '#EEA114', roughness: 0.4, metalness: 0.3 }),
    equipment: new THREE.MeshStandardMaterial({ color: '#f0f0ee', roughness: 0.5, metalness: 0.1 }),
    graphite: new THREE.MeshStandardMaterial({ color: '#2a2c30', roughness: 0.5, metalness: 0.5 }),
    steel: new THREE.MeshStandardMaterial({ color: '#3a3d42', roughness: 0.45, metalness: 0.7 }),
    benchTop: new THREE.MeshStandardMaterial({ map: planks, color: '#d8ccbc', roughness: 0.6, metalness: 0 }),
    liner: new THREE.MeshStandardMaterial({ color: '#e2e2de', roughness: 0.6, metalness: 0.1, envMapIntensity: 0.7 }),
    joint: new THREE.MeshStandardMaterial({ color: '#8d8f93', roughness: 0.5, metalness: 0.4, transparent: true, opacity: 0.5 }),
    ceiling: new THREE.MeshStandardMaterial({ color: '#dededa', roughness: 0.7, metalness: 0.05, side: THREE.DoubleSide, envMapIntensity: 0.7 }),
    floor: new THREE.MeshStandardMaterial({ color: '#232427', roughness: 0.75, metalness: 0.05, bumpMap: coin, bumpScale: 1.2 }),
    logo: decal(),
    brand: decal(),
  };
}
export type Materials = ReturnType<typeof createMaterials>;

/** Recolor in place for everything that doesn't change the shape. */
export function applyFinish(m: Materials, cfg: TrailerConfig) {
  m.paint.color.set(cfg.paint);
  // Satin black shows seams as faint lines. On light paint they read as darker joints.
  m.seam.color.set(cfg.paintDark ? '#050506' : '#2a2b2e');
  m.seam.opacity = cfg.paintDark ? 0.55 : 0.28;
  if (cfg.trim === 'aluminum') {
    m.trim.color.set('#cdd0d4'); m.trim.roughness = 0.28; m.trim.metalness = 0.95;
    m.edge.color.set('#c9ccd1'); m.edge.roughness = 0.3; m.edge.metalness = 0.92;
  } else {
    m.trim.color.set('#1a1b1e'); m.trim.roughness = 0.46; m.trim.metalness = 0.7;
    m.edge.color.set('#16171a'); m.edge.roughness = 0.5; m.edge.metalness = 0.6;
  }
  const dark = '#0e0f11';
  const bright = '#d7dade';
  m.spokeFace.color.set(cfg.wheels === 'black' ? '#15161a' : bright);
  m.spokeFace.roughness = cfg.wheels === 'black' ? 0.18 : 0.2;
  m.spokeSide.color.set(cfg.wheels === 'silver' ? '#b9bcc1' : dark);
  m.rimBarrel.color.set(cfg.wheels === 'silver' ? '#b9bcc1' : dark);

  const wall = { white: '#e2e2de', plywood: '#f0e6d6', black: '#1d1e21' }[cfg.walls];
  m.liner.color.set(wall);
  m.liner.map = cfg.walls === 'plywood' ? m.textures.ply : null;
  m.liner.metalness = cfg.walls === 'plywood' ? 0 : 0.15;
  m.liner.needsUpdate = true;

  if (cfg.floor === 'rubber') {
    m.floor.color.set('#232427'); m.floor.map = null; m.floor.bumpMap = m.textures.coin; m.floor.bumpScale = 1.2; m.floor.metalness = 0.05; m.floor.roughness = 0.75;
  } else if (cfg.floor === 'wood') {
    m.floor.color.set('#cdbfae'); m.floor.map = m.textures.planks; m.floor.bumpMap = null; m.floor.metalness = 0; m.floor.roughness = 0.6;
  } else {
    m.floor.color.set('#c2c5ca'); m.floor.map = null; m.floor.bumpMap = m.textures.plateFloor; m.floor.bumpScale = 1.8; m.floor.metalness = 0.9; m.floor.roughness = 0.34;
  }
  m.floor.needsUpdate = true;

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
  const prof = [[0.64, -0.25], [0.7, -0.3], [0.86, -0.315], [1.0, -0.31], [1.07, -0.26], [1.1, -0.14], [1.1, 0.14], [1.07, 0.26], [1.0, 0.31], [0.86, 0.315], [0.7, 0.3], [0.64, 0.25]]
    .map(([r, a]) => new THREE.Vector2(r, a));
  const tire = new THREE.Mesh(new THREE.LatheGeometry(prof, 56), m.rubber);
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
    if (cfg.brand) {
      const bw = Math.min(S * 0.5, 9);
      const brand = plane(bw, bw * (420 / 2048), m.brand, xr + 0.9 + bw / 2, FLOOR + 3.25, sz * (W / 2 + 0.012));
      if (sz < 0) brand.rotation.y = Math.PI;
      g.add(brand);
    }
  }

  // ------------------------------------------------------------ street side: window and hatch
  const axleX = xf - axleCenter(L);
  // The window sits over the axles. On the 10 ft it moves forward to clear the logo.
  const winX = Math.max(axleX, xr + 4.9);
  if (cfg.window) {
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
  if (cfg.hatch) {
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
  let ramp: THREE.Object3D | null = null;
  const lockBar = (len: number, z: number) => {
    const bar = new THREE.Group();
    bar.add(cyl(0.035, len, m.chrome, -0.1, len / 2 - 0.12, z, 'y', 14));
    for (const t of [0.04, 0.3, 0.7, 0.96]) bar.add(box(0.07, 0.1, 0.18, m.chrome, -0.085, len * t - 0.12 + 0.05, z));
    return bar;
  };
  if (cfg.rear === 'barn') {
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
      }
      g.add(door);
      barn.push(door);
    }
  } else {
    const door = new THREE.Group();
    door.position.set(xr - 0.03, doorY, 0);
    door.add(box(0.1, openH - 0.03, openW - 0.03, faces(m.edge, { nx: m.paint, px: m.floor }), 0, openH / 2, 0));
    for (const sz of [1, -1]) {
      door.add(lockBar(openH + 0.2, sz * (openW / 2 - 0.5)));
      door.add(box(0.03, 0.07, 0.8, m.chrome, -0.13, openH * 0.49, sz * (openW / 2 - 0.95)));
      door.add(box(0.07, 0.2, 0.5, m.chrome, -0.03, 0.06, sz * (openW / 2 - 0.9)));
    }
    const logo = plane(1.8, 0.54, m.logo, -0.055, openH - 1.35, 1.3);
    logo.rotation.y = -Math.PI / 2;
    door.add(logo);
    g.add(door);
    ramp = door;
  }

  // ------------------------------------------------------------ roof: solar, vent
  const count = Math.min(cfg.panels, Math.floor((S - 0.15) / PANEL_PITCH));
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
  if (cfg.vent) {
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
  if (cfg.spare) {
    const sx = xf + 1.1;
    const nz = (W / 2) * (1 - (sx - xf) / NOSE);
    const spare = wheel(m);
    spare.position.set(sx, 1.72, -(nz + 0.52));
    spare.rotation.y = Math.PI;
    g.add(spare);
    g.add(box(0.16, 1.3, 0.16, m.chassis, sx, 1.55, -(nz + 0.14)));
    g.add(box(0.5, 0.12, 0.5, m.chassis, sx, 1.0, -(nz + 0.3)));
  }
  if (cfg.hvac) {
    // heat pump on the tongue, between the nose and the jack
    const u = new THREE.Group();
    u.position.set(tip + 1.0, FLOOR + 0.02, 0.15);
    u.add(box(1.0, 1.75, 2.5, m.equipment, 0, 0.875, 0));
    const grille = cyl(0.62, 0.03, m.graphite, 0.51, 0.95, -0.35, 'x', 32);
    const hub = cyl(0.16, 0.05, m.equipment, 0.52, 0.95, -0.35, 'x', 20);
    u.add(grille, hub);
    for (let i = 0; i < 6; i++) u.add(box(0.02, 0.03, 0.7, m.graphite, 0.51, 0.35 + i * 0.22, 0.82));
    g.add(u);
  }

  // ------------------------------------------------------------ flood lights and cameras
  if (cfg.floods) {
    for (const sz of [1, -1]) for (const fx of [xr + S * 0.28, xr + S * 0.78]) {
      if (sz > 0 && fx > doorRear - 0.8) continue;
      g.add(box(1.0, 0.24, 0.07, m.black, fx, ROOF - 0.62, sz * (W / 2 + 0.05)));
      g.add(box(0.88, 0.14, 0.02, m.lamp, fx, ROOF - 0.62, sz * (W / 2 + 0.09)));
    }
  }
  if (cfg.cameras) {
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

  // ------------------------------------------------------------ interior
  // ceiling light strips, and soft light so the inside reads when the camera is in there
  for (const sz of [1, -1]) g.add(box(S - 2.2, 0.03, 0.22, m.lamp, xr + S / 2, ROOF - 0.13, sz * 1.5));
  const glow = S > 12 ? [xr + S * 0.25, xr + S * 0.72] : [xr + S * 0.5];
  for (const lx of glow) {
    const light = new THREE.PointLight('#fff6e8', 9, 22, 1.6);
    light.position.set(lx, ROOF - 0.9, 0);
    g.add(light);
  }

  // liner joints every 4 ft and a dark kick strip, so the walls read as panels
  for (const sz of [1, -1]) {
    for (let x = xr + 4; x < xf - 0.6; x += 4) {
      if (sz > 0 && x > doorRear - 0.2) continue;
      g.add(box(0.03, H - 0.4, 0.012, m.joint, x, yc, sz * (zi - 0.006)));
    }
    const run = sz > 0 ? doorRear - xr - 0.1 : S;
    g.add(box(run, 0.32, 0.02, m.steel, xr + run / 2, y0 + 0.16, sz * (zi - 0.01)));
  }

  // power system in the nose: inverter on a board, battery modules stacked under it
  {
    const pz = -1.55;
    g.add(box(0.08, 5.2, 3.0, m.graphite, xf + 0.12, y0 + 2.6, pz));
    g.add(box(0.5, 2.1, 1.5, m.equipment, xf - 0.18, y0 + 4.0, pz));
    g.add(box(0.02, 0.36, 0.62, m.screen, xf - 0.44, y0 + 4.5, pz));
    g.add(box(0.02, 0.05, 1.5, m.gold, xf - 0.44, y0 + 3.1, pz));
    g.add(box(0.3, 0.9, 0.7, m.graphite, xf - 0.08, y0 + 4.2, pz + 1.25));
    for (let i = 0; i < cfg.batteryModules; i++) {
      const by = y0 + 0.36 + i * 0.58;
      g.add(box(1.25, 0.5, 1.9, m.graphite, xf - 0.62, by, pz));
      g.add(box(0.02, 0.06, 0.06, m.screen, xf - 1.255, by + 0.1, pz + 0.7));
      for (const hz of [-0.6, 0.6]) g.add(box(0.05, 0.08, 0.34, m.steel, xf - 1.27, by, pz + hz));
    }
    g.add(box(1.35, 0.12, 2.0, m.steel, xf - 0.62, y0 + 0.06, pz));
    for (const cz2 of [-0.5, 0.5]) g.add(cyl(0.05, 1.4, m.steel, xf - 0.1, y0 + 2.4, pz + cz2, 'y', 10));
  }

  const benchLen = Math.min(4.6, S * 0.4);
  if (cfg.bench) {
    const b = new THREE.Group();
    b.position.set(winX, y0, -zi);
    b.add(box(benchLen, 0.14, 1.9, m.benchTop, 0, 3.0, 0.95));
    for (const ex of [-1, 1]) for (const ez of [0.12, 1.78]) b.add(box(0.12, 2.93, 0.12, m.steel, ex * (benchLen / 2 - 0.1), 1.465, ez));
    b.add(box(benchLen - 0.2, 0.08, 1.7, m.steel, 0, 0.9, 0.95));
    b.add(box(benchLen, 0.5, 0.06, m.steel, 0, 3.32, 0.04));
    for (const ox of [-0.8, 0.8]) b.add(box(0.36, 0.22, 0.03, m.equipment, ox, 3.34, 0.08));
    g.add(b);
  }
  // Racking goes behind the bench on the street side when there's room, else on the curb side.
  const roomBehindBench = winX - benchLen / 2 - (xr + 0.6);
  const rackStreet = !cfg.bench || roomBehindBench >= 2.6;
  if (cfg.shelving) {
    const maxLen = rackStreet ? (cfg.bench ? roomBehindBench - 0.3 : S * 0.42) : doorRear - xr - 1.4;
    const len = Math.min(6, maxLen);
    const r = new THREE.Group();
    r.position.set(xr + 0.6 + len / 2, y0, rackStreet ? -zi : zi);
    const dz = rackStreet ? 1 : -1;
    const depth = 1.5;
    const bays = Math.max(1, Math.round(len / 3));
    for (let i = 0; i <= bays; i++) for (const ez of [0.08, depth - 0.08]) r.add(box(0.1, 5.2, 0.1, m.steel, -len / 2 + (len / bays) * i, 2.6, dz * ez));
    for (const sy of [0.5, 1.9, 3.3, 4.7]) r.add(box(len, 0.07, depth, m.steel, 0, sy, dz * (depth / 2)));
    // a few bins so the shelves read as storage
    for (let i = 0; i < bays * 2; i++) r.add(box(0.95, 0.62, 1.05, i % 3 === 0 ? m.gold : m.graphite, -len / 2 + 0.75 + i * (len / (bays * 2)), 2.26, dz * 0.72));
    g.add(r);
  }
  if (cfg.cabinets) {
    const len = Math.min(8, doorRear - xr - 1.2);
    const c = new THREE.Group();
    c.position.set(xr + 0.7 + len / 2, ROOF - 0.12, zi);
    const doors = Math.max(2, Math.round(len / 2));
    c.add(box(len, 1.4, 1.15, m.equipment, 0, -0.7, -0.575));
    for (let i = 0; i < doors; i++) {
      const cx = -len / 2 + (len / doors) * (i + 0.5);
      c.add(box(len / doors - 0.06, 1.3, 0.03, m.liner, cx, -0.7, -1.165));
      c.add(box(0.3, 0.04, 0.04, m.steel, cx, -1.22, -1.19));
    }
    g.add(c);
  }
  if (cfg.etrack) {
    for (const ty of [y0 + 1.6, y0 + 3.55]) {
      g.add(box(S - 0.8, 0.2, 0.03, m.aluminum, xr + S / 2, ty, -(zi - 0.016)));
      g.add(box(doorRear - xr - 0.8, 0.2, 0.03, m.aluminum, (xr + doorRear) / 2, ty, zi - 0.016));
    }
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
    ramp,
    sideDoor,
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
    eye: new THREE.Vector3(xr + 1.4, FLOOR + 4.7, 0.55),
    look: new THREE.Vector3(xf - 0.5, FLOOR + 3.2, -0.3),
  };
}
