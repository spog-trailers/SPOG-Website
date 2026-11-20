/**
 * The 3D stage for the configurator: a white studio like Tesla's, with camera presets you can
 * drag away from and an interior view that puts the camera inside the trailer.
 *
 * What makes it read as a photo and not a diagram (the realism pass, 2026-11-18):
 *   - The canvas is see-through, so the page's own white is the backdrop and stays pure white.
 *   - A soft contact shadow is drawn fresh each frame from what actually sits near the ground,
 *     so it's darkest under the tires and follows open doors.
 *   - Ambient occlusion darkens the creases where parts meet (wider screens only, for speed).
 *   - The studio the paint reflects has a horizon and tall light panels (studioEnvironment).
 *
 * The framing follows the trailer's size: the 10 ft is narrower and lower than the 20 ft (dims.ts,
 * price sheet 2026-11-20), and the camera backs off further for the 6 ft light and further still
 * for the 28 ft light tower.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { HorizontalBlurShader } from 'three/addons/shaders/HorizontalBlurShader.js';
import { VerticalBlurShader } from 'three/addons/shaders/VerticalBlurShader.js';
import { FLOOR, NOSE, axleCenter, heightFor, roofFor, widthFor } from './dims';
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

export interface StageOptions {
  /** Wheel and pinch zoom. Off when the viewer sits inside a long page, so it can't trap the scroll. */
  zoom?: boolean;
  /** Camera distance for the outside views, as a share of the configurator's. Below 1 frames tighter. */
  distance?: number;
}

export function createStage(container: HTMLElement, options: StageOptions = {}) {
  const allowZoom = options.zoom ?? true;
  const distance = options.distance ?? 1;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
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

  // ---------------------------------------------------------------- contact shadow
  // A camera on the ground looks straight up and records how close everything is. Blurred, that
  // becomes the shadow: dark where the tires touch, lighter under the raised body.
  const CS = { w: 40, d: 18, h: 3.4, feet: 1.5, opacity: 0.62 };
  const shadowGroup = new THREE.Group();
  shadowGroup.position.set(1.5, 0.012, 0);
  scene.add(shadowGroup);
  const shadowRT = new THREE.WebGLRenderTarget(1024, 512);
  const blurRT = new THREE.WebGLRenderTarget(1024, 512);
  shadowRT.texture.generateMipmaps = blurRT.texture.generateMipmaps = false;
  const shadowGeo = new THREE.PlaneGeometry(CS.w, CS.d).rotateX(Math.PI / 2);
  const shadowPlane = new THREE.Mesh(shadowGeo, new THREE.MeshBasicMaterial({ map: shadowRT.texture, opacity: CS.opacity, transparent: true, depthWrite: false }));
  shadowPlane.scale.y = -1; // the target is upside down seen from above
  shadowPlane.renderOrder = -1;
  const blurPlane = new THREE.Mesh(shadowGeo);
  blurPlane.visible = false;
  const shadowCam = new THREE.OrthographicCamera(-CS.w / 2, CS.w / 2, CS.d / 2, -CS.d / 2, 0, CS.h);
  shadowCam.rotation.x = Math.PI / 2;
  shadowGroup.add(shadowPlane, blurPlane, shadowCam);
  const nearness = new THREE.MeshDepthMaterial();
  nearness.depthTest = false;
  nearness.depthWrite = false;
  nearness.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      'gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );',
      'gl_FragColor = vec4( vec3( 0.0 ), 1.0 - fragCoordZ );',
    );
  };
  const hBlur = new THREE.ShaderMaterial(HorizontalBlurShader);
  const vBlur = new THREE.ShaderMaterial(VerticalBlurShader);
  hBlur.depthTest = vBlur.depthTest = false;
  function blurShadow(feet: number) {
    blurPlane.visible = true;
    blurPlane.material = hBlur;
    hBlur.uniforms.tDiffuse.value = shadowRT.texture;
    hBlur.uniforms.h.value = feet / 4 / CS.w;
    renderer.setRenderTarget(blurRT);
    renderer.render(blurPlane, shadowCam);
    blurPlane.material = vBlur;
    vBlur.uniforms.tDiffuse.value = blurRT.texture;
    vBlur.uniforms.v.value = feet / 4 / CS.d;
    renderer.setRenderTarget(shadowRT);
    renderer.render(blurPlane, shadowCam);
    blurPlane.visible = false;
  }
  function drawContactShadow() {
    shadowPlane.visible = false;
    scene.overrideMaterial = nearness;
    renderer.setRenderTarget(shadowRT);
    renderer.clear();
    renderer.render(scene, shadowCam);
    scene.overrideMaterial = null;
    blurShadow(CS.feet);
    blurShadow(CS.feet * 0.4);
    renderer.setRenderTarget(null);
    shadowPlane.visible = true;
  }

  scene.add(new THREE.HemisphereLight('#ffffff', '#e9e7e2', 0.9));
  const key = new THREE.DirectionalLight('#ffffff', 2.3);
  key.position.set(3, 50, 7);
  key.castShadow = true; // parts shade each other. The ground shadow is the contact shadow above.
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

  // ---------------------------------------------------------------- ambient occlusion
  // Darkens the creases where parts meet: under the fenders, around trim, behind the wheels.
  // It costs a second pass over the scene, so phones skip it.
  let composer: EffectComposer | null = null;
  if (renderer.capabilities.isWebGL2 && !window.matchMedia('(max-width: 899px)').matches) {
    try {
      composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 }));
      composer.addPass(new RenderPass(scene, camera));
      const ao = new GTAOPass(scene, camera, 1, 1);
      ao.updateGtaoMaterial({ radius: 1.5, distanceExponent: 1.5, thickness: 1.2, scale: 1.15, samples: 16 });
      ao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 4, radiusExponent: 1, rings: 2, samples: 16 });
      ao.blendIntensity = 0.9;
      composer.addPass(ao);
      composer.addPass(new OutputPass());
    } catch {
      composer = null; // an older GPU: draw the plain picture
    }
  }

  // ---------------------------------------------------------------- sizing
  let trailerLength = 20;
  let tall = false; // a mast stands well above the roof, so the camera backs off and aims higher
  let tallTop = 0; // height of the highest part off the ground, in feet. // SOURCE (price sheet 2026-11-20): the 28 ft tower
  /**
   * How far to back off for what stands above the roof. 1 is the 6 ft light, as tuned before. The
   * 28 ft tower, drawn fully raised, needs about four and a half times that. The divisor is set so
   * the tower's light bar stays in frame on a 16:9 stage as well as on a phone.
   */
  // SOURCE (price sheet 2026-11-20): the tower is 28 ft, drawn at full height.
  const liftFor = () => (tall ? Math.max(1, 1 + (tallTop - roofFor(trailerLength) - 6.6) / 3.8) : 0);
  const resize = () => {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    composer?.setSize(w, h);
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
      controls.maxDistance = 140; // room to back off for the 28 ft tower on a tall, narrow phone stage
      controls.minPolarAngle = 0.12;
      controls.maxPolarAngle = Math.PI * 0.492;
      controls.enableZoom = allowZoom;
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
    const lift = name !== 'wheels' ? liftFor() : 0;
    // The 10 ft is 6.5 ft wide and lower, the 20 ft 8 ft wide. // SOURCE (price sheet 2026-11-20)
    const W = widthFor(trailerLength);
    const H = heightFor(trailerLength);
    const r = (19 + trailerLength * 0.6) * (1 + lift * 0.24) * distance * v.zoom * (name === 'wheels' ? Math.sqrt(narrow) : narrow);
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
    if (!userMoved) setView(currentView, true);
  }

  function setTall(v: boolean, top = 0) {
    if (v === tall && top === tallTop) return;
    tall = v;
    tallTop = top;
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
  let running = false;
  let raf = 0;
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
    drawContactShadow();
    if (composer) composer.render();
    else renderer.render(scene, camera);
    if (running) raf = requestAnimationFrame(frame);
  }
  /** Start or stop drawing. A viewer scrolled off screen should be stopped. */
  function setActive(on: boolean) {
    if (on === running) return;
    running = on;
    cancelAnimationFrame(raf);
    if (on) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }

  limits(false);
  resize();
  setLength(20);
  setView('front', true);
  setActive(true);

  return {
    scene,
    camera,
    renderer,
    setView,
    setLength,
    setTall,
    setActive,
    project,
    onFrame: (f: (dt: number) => void) => frameHooks.push(f),
    onUserMove: (f: () => void) => moveHooks.push(f),
    get view() { return currentView; },
    get moved() { return userMoved; },
    get moving() { return tween !== null; },
  };
}
export type Stage = ReturnType<typeof createStage>;
