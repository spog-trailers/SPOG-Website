/**
 * The 3D stage for the configurator: a white studio like Tesla's. Pure white background,
 * a shadow-only floor, soft studio reflections, camera presets and orbit controls.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { FLOOR, H } from './dims';

export type ViewName = 'front' | 'side' | 'rear' | 'street' | 'top';

const VIEWS: Record<ViewName, { az: number; el: number; zoom: number }> = {
  front: { az: 38, el: 11, zoom: 1 },
  side: { az: 90, el: 5, zoom: 1.02 },
  rear: { az: 142, el: 12, zoom: 1 },
  street: { az: -52, el: 13, zoom: 1.05 },
  top: { az: 25, el: 52, zoom: 1.08 },
};

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function createStage(container: HTMLElement) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor('#ffffff', 1);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.85;

  // shadow-only floor, so the background stays pure white
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.ShadowMaterial({ opacity: 0.13 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // soft contact shadow directly under the trailer
  const blobCanvas = document.createElement('canvas');
  blobCanvas.width = blobCanvas.height = 256;
  const bc = blobCanvas.getContext('2d')!;
  const bg = bc.createRadialGradient(128, 128, 8, 128, 128, 128);
  bg.addColorStop(0, 'rgba(0,0,0,.42)');
  bg.addColorStop(0.55, 'rgba(0,0,0,.16)');
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

  scene.add(new THREE.HemisphereLight('#ffffff', '#ece9e4', 1.1));
  const key = new THREE.DirectionalLight('#ffffff', 2.1);
  key.position.set(10, 38, 16);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  const sc = key.shadow.camera;
  sc.left = -26; sc.right = 26; sc.top = 26; sc.bottom = -26; sc.near = 1; sc.far = 120;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.03;
  scene.add(key);
  const fill = new THREE.DirectionalLight('#ffffff', 0.7);
  fill.position.set(-24, 14, -18);
  scene.add(fill);

  const camera = new THREE.PerspectiveCamera(32, 1, 0.5, 900);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 12;
  controls.maxDistance = 80;
  controls.maxPolarAngle = Math.PI * 0.485;
  controls.target.set(0, FLOOR + H * 0.42, 0);

  // ---------------------------------------------------------------- sizing
  let trailerLength = 16;
  const resize = () => {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(container);
  resize();

  // ---------------------------------------------------------------- camera views
  let tween: { from: THREE.Vector3; to: THREE.Vector3; tFrom: THREE.Vector3; tTo: THREE.Vector3; start: number; dur: number } | null = null;
  let currentView: ViewName = 'front';

  function viewPosition(name: ViewName) {
    const v = VIEWS[name];
    const narrow = camera.aspect < 1 ? 1.35 : 1;
    const r = (21 + trailerLength * 1.05) * v.zoom * narrow;
    const az = THREE.MathUtils.degToRad(v.az);
    const el = THREE.MathUtils.degToRad(v.el);
    const target = new THREE.Vector3(trailerLength * 0.08, FLOOR + H * 0.3, 0);
    const pos = new THREE.Vector3(Math.cos(el) * Math.cos(az), Math.sin(el), Math.cos(el) * Math.sin(az)).multiplyScalar(r).add(target);
    return { pos, target };
  }

  function setView(name: ViewName, instant = false) {
    currentView = name;
    const { pos, target } = viewPosition(name);
    if (instant || reduceMotion) {
      camera.position.copy(pos);
      controls.target.copy(target);
      tween = null;
      controls.update();
      return;
    }
    tween = { from: camera.position.clone(), to: pos, tFrom: controls.target.clone(), tTo: target, start: performance.now(), dur: 1100 };
  }
  controls.addEventListener('start', () => { tween = null; });

  function setLength(L: number) {
    trailerLength = L;
    blob.scale.set(L + 6, 1, 10);
    blob.position.x = 1.2;
  }

  // Lamps, LED strips and tail lights glow at a fixed, daylight level in the studio.
  function registerGlow(mat: THREE.MeshStandardMaterial, base = 1) { mat.emissiveIntensity = 0.55 * base; }

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
      if (p >= 1) tween = null;
    }
    frameHooks.forEach((f) => f(dt));
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  setLength(16);
  setView('front', true);
  requestAnimationFrame(frame);

  return {
    scene,
    camera,
    renderer,
    setView,
    setLength,
    registerGlow,
    // the mast spotlight stays off in the white studio
    registerSpot: (_light: THREE.SpotLight) => {},
    reapplyMood: () => {},
    onFrame: (f: (dt: number) => void) => frameHooks.push(f),
    setAutoRotate: (on: boolean) => {
      controls.autoRotate = on && !reduceMotion;
      controls.autoRotateSpeed = 0.5;
    },
    get view() { return currentView; },
  };
}
export type Stage = ReturnType<typeof createStage>;
