/**
 * The 3D stage for the configurator: a white studio like Tesla's. Pure white background,
 * a shadow-only floor, soft studio reflections, camera presets you can drag away from,
 * and an interior view that puts the camera inside the trailer.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FLOOR, H, W, axleCenter, NOSE } from './dims';
import { interiorView } from './trailer';

export type ViewName = 'front' | 'side' | 'rear' | 'street' | 'top' | 'wheels' | 'interior';
export const VIEW_ORDER: ViewName[] = ['front', 'side', 'rear', 'street', 'top', 'interior'];

// `x` slides the aim point along the trailer, so the tongue doesn't push the body off center.
const VIEWS: Record<Exclude<ViewName, 'interior'>, { az: number; el: number; zoom: number; x: number }> = {
  front: { az: 36, el: 8, zoom: 1, x: 1.5 },
  side: { az: 90, el: 4, zoom: 0.98, x: 1.7 },
  rear: { az: 152, el: 9, zoom: 1.04, x: -0.6 },
  street: { az: -46, el: 9, zoom: 1, x: 1.5 },
  top: { az: 30, el: 40, zoom: 1.22, x: 0.6 },
  wheels: { az: 64, el: 5, zoom: 0.52, x: 0 },
};
const FOV = 30;
const FOV_INSIDE = 72;

/**
 * The studio the trailer reflects: a bright ceiling, a pale floor, a soft horizon and a few tall
 * light panels. Flat aluminum walls only show shape through what they reflect, so the gradients
 * and panels here are what give the black paint its long soft highlights.
 */
function studioEnvironment(renderer: THREE.WebGLRenderer) {
  const env = new THREE.Scene();
  const c = document.createElement('canvas');
  c.width = 8;
  c.height = 256;
  const ctx = c.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(0.3, '#f4f4f4');
  g.addColorStop(0.47, '#c9c9c9');
  g.addColorStop(0.5, '#8f8f8f');
  g.addColorStop(0.54, '#b4b4b4');
  g.addColorStop(1, '#e2e2e2');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 8, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  env.add(new THREE.Mesh(new THREE.SphereGeometry(60, 32, 24), new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide })));
  const panel = (w: number, h: number, az: number, y: number, power: number, r = 34) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(power, power, power), side: THREE.DoubleSide }));
    const a = THREE.MathUtils.degToRad(az);
    m.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
    m.lookAt(0, y, 0);
    env.add(m);
  };
  panel(16, 26, 20, 12, 3.2);
  panel(10, 26, 75, 12, 2.2);
  panel(16, 26, 140, 12, 2.6);
  panel(16, 26, -35, 12, 2.8);
  panel(10, 26, -110, 12, 2.2);
  panel(16, 26, 180, 12, 2.4);
  const top = new THREE.Mesh(new THREE.PlaneGeometry(44, 30), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.6, 2.6, 2.6), side: THREE.DoubleSide }));
  top.rotation.x = Math.PI / 2;
  top.position.y = 36;
  env.add(top);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const out = pmrem.fromScene(env, 0.02).texture;
  pmrem.dispose();
  return out;
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function createStage(container: HTMLElement) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor('#ffffff', 1);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';

  const scene = new THREE.Scene();
  scene.environment = studioEnvironment(renderer);
  scene.environmentIntensity = 1;

  // shadow-only floor, so the background stays pure white
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.ShadowMaterial({ opacity: 0.09 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // soft contact shadow directly under the trailer
  const blobCanvas = document.createElement('canvas');
  blobCanvas.width = blobCanvas.height = 256;
  const bc = blobCanvas.getContext('2d')!;
  const bg = bc.createRadialGradient(128, 128, 8, 128, 128, 128);
  bg.addColorStop(0, 'rgba(0,0,0,.55)');
  bg.addColorStop(0.45, 'rgba(0,0,0,.26)');
  bg.addColorStop(1, 'rgba(0,0,0,0)');
  bc.fillStyle = bg;
  bc.fillRect(0, 0, 256, 256);
  const blob = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(blobCanvas), transparent: true, depthWrite: false, toneMapped: false }),
  );
  blob.rotation.x = -Math.PI / 2;
  blob.position.y = 0.02;
  scene.add(blob);

  scene.add(new THREE.HemisphereLight('#ffffff', '#e9e7e2', 0.9));
  const key = new THREE.DirectionalLight('#ffffff', 2.3);
  key.position.set(3, 50, 7);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  const sc = key.shadow.camera;
  sc.left = -24; sc.right = 24; sc.top = 24; sc.bottom = -24; sc.near = 1; sc.far = 120;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.03;
  key.shadow.radius = 6;
  scene.add(key);
  const fill = new THREE.DirectionalLight('#ffffff', 0.9);
  fill.position.set(-26, 12, -20);
  scene.add(fill);
  const rim = new THREE.DirectionalLight('#ffffff', 0.6);
  rim.position.set(-10, 16, 30);
  scene.add(rim);

  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.3, 500);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  // On a phone, a sideways drag turns the trailer and an up or down swipe still scrolls the page.
  renderer.domElement.style.touchAction = 'pan-y';

  // ---------------------------------------------------------------- sizing
  let trailerLength = 20;
  let tall = false; // a mast stands well above the roof, so the camera backs off and aims higher
  const resize = () => {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(() => { resize(); if (!userMoved) setView(currentView, true); }).observe(container);

  // ---------------------------------------------------------------- camera views
  type Tween = { from: THREE.Vector3; to: THREE.Vector3; tFrom: THREE.Vector3; tTo: THREE.Vector3; fovFrom: number; fovTo: number; start: number; dur: number };
  let tween: Tween | null = null;
  let currentView: ViewName = 'front';
  let userMoved = false;
  const moveHooks: (() => void)[] = [];

  function limits(inside: boolean) {
    if (inside) {
      controls.minDistance = controls.maxDistance = 0.6;
      controls.minPolarAngle = Math.PI * 0.28;
      controls.maxPolarAngle = Math.PI * 0.68;
      controls.enableZoom = false;
      controls.rotateSpeed = -0.35; // drag the room, not the camera
    } else {
      controls.minDistance = 13;
      controls.maxDistance = 90;
      controls.minPolarAngle = 0.12;
      controls.maxPolarAngle = Math.PI * 0.492;
      controls.enableZoom = true;
      controls.rotateSpeed = 0.8;
    }
  }

  function viewPose(name: ViewName) {
    if (name === 'interior') {
      const { eye, look } = interiorView(trailerLength);
      const dir = look.clone().sub(eye).normalize();
      return { pos: eye, target: eye.clone().add(dir.multiplyScalar(0.6)), fov: FOV_INSIDE };
    }
    const v = VIEWS[name];
    const narrow = Math.max(1, 1.5 / camera.aspect);
    const lift = tall && name !== 'wheels' ? 1 : 0;
    const r = (19 + trailerLength * 0.6) * (1 + lift * 0.24) * v.zoom * (name === 'wheels' ? Math.sqrt(narrow) : narrow);
    const az = THREE.MathUtils.degToRad(v.az);
    const el = THREE.MathUtils.degToRad(v.el);
    const target = name === 'wheels'
      ? new THREE.Vector3(trailerLength / 2 - NOSE - axleCenter(trailerLength), 1.7, W / 2)
      : new THREE.Vector3(v.x, FLOOR + H * (name === 'top' ? 0.5 : 0.4) + lift * 2.2, 0);
    const pos = new THREE.Vector3(Math.cos(el) * Math.cos(az), Math.sin(el), Math.cos(el) * Math.sin(az)).multiplyScalar(r).add(target);
    return { pos, target, fov: FOV };
  }

  function setView(name: ViewName, instant = false) {
    const wasInside = currentView === 'interior';
    currentView = name;
    userMoved = false;
    const { pos, target, fov } = viewPose(name);
    const inside = name === 'interior';
    // Going in or out passes through the wall, so cut instead of flying.
    if (instant || reduceMotion || inside !== wasInside) {
      limits(inside);
      camera.position.copy(pos);
      controls.target.copy(target);
      camera.fov = fov;
      camera.updateProjectionMatrix();
      tween = null;
      controls.update();
      return;
    }
    tween = { from: camera.position.clone(), to: pos, tFrom: controls.target.clone(), tTo: target, fovFrom: camera.fov, fovTo: fov, start: performance.now(), dur: 1100 };
  }
  controls.addEventListener('start', () => {
    tween = null;
    userMoved = true;
    moveHooks.forEach((f) => f());
  });

  function setLength(L: number) {
    trailerLength = L;
    blob.scale.set(L + 12, 1, 15);
    blob.position.x = 1.4;
    if (!userMoved) setView(currentView, true);
  }

  function setTall(v: boolean) {
    if (v === tall) return;
    tall = v;
    if (!userMoved) setView(currentView, currentView === 'interior');
  }

  /** Screen position of a world point, in CSS pixels inside the container. */
  const v3 = new THREE.Vector3();
  function project(p: THREE.Vector3) {
    v3.copy(p).project(camera);
    return { x: (v3.x * 0.5 + 0.5) * container.clientWidth, y: (-v3.y * 0.5 + 0.5) * container.clientHeight, visible: v3.z < 1 && Math.abs(v3.x) < 1 && Math.abs(v3.y) < 1 };
  }

  // ---------------------------------------------------------------- loop
  const frameHooks: ((dt: number) => void)[] = [];
  let last = performance.now();
  function frame(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (tween) {
      const p = Math.min(1, (now - tween.start) / tween.dur);
      const e = ease(p);
      camera.position.lerpVectors(tween.from, tween.to, e);
      controls.target.lerpVectors(tween.tFrom, tween.tTo, e);
      camera.fov = tween.fovFrom + (tween.fovTo - tween.fovFrom) * e;
      camera.updateProjectionMatrix();
      if (p >= 1) tween = null;
    }
    frameHooks.forEach((f) => f(dt));
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  limits(false);
  resize();
  setLength(20);
  setView('front', true);
  requestAnimationFrame(frame);

  return {
    scene,
    camera,
    renderer,
    setView,
    setLength,
    setTall,
    project,
    onFrame: (f: (dt: number) => void) => frameHooks.push(f),
    onUserMove: (f: () => void) => moveHooks.push(f),
    get view() { return currentView; },
    get moved() { return userMoved; },
    get moving() { return tween !== null; },
  };
}
export type Stage = ReturnType<typeof createStage>;
