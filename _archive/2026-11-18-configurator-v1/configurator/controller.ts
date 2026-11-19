/**
 * Keeps the 3D trailer in sync with a TrailerConfig. Rebuilds geometry only when the shape
 * changes, recolors in place, and animates the wing and mast toward their targets.
 */
import type { Stage } from './scene';
import { applyTrim, buildTrailer, createMaterials, decalTexture, poseMast, poseWing, type TrailerConfig, type TrailerParts } from './trailer';

const SHAPE_KEYS: (keyof TrailerConfig)[] = ['length', 'roofPanels', 'wing', 'mast', 'led', 'gearRail', 'hvac'];

export function createController(stage: Stage, initial: TrailerConfig) {
  const mats = createMaterials();
  stage.registerGlow(mats.led, 1);
  stage.registerGlow(mats.lamp, 1.6);
  stage.registerGlow(mats.tail, 0.45);
  stage.registerGlow(mats.marker, 0.25);

  let cfg: TrailerConfig = { ...initial };
  let parts: TrailerParts | null = null;
  let wingT = cfg.wingOpen ? 1 : 0;
  let mastT = cfg.mastUp ? 1 : 0;
  let decalKey = '';

  async function refreshDecal() {
    if (!parts?.decal) return;
    const key = `${cfg.brand}|${cfg.paintDark}`;
    if (key === decalKey && mats.decal.map) return;
    decalKey = key;
    const tex = await decalTexture(cfg.brand, cfg.paintDark);
    mats.decal.map?.dispose();
    mats.decal.map = tex;
    mats.decal.needsUpdate = true;
  }

  function rebuild() {
    if (parts) {
      stage.scene.remove(parts.group);
      parts.dispose();
    }
    parts = buildTrailer(cfg, mats);
    stage.scene.add(parts.group);
    stage.setLength(cfg.length);
    if (parts.mastLight) {
      parts.mastLight.userData.on = cfg.mastUp;
      stage.registerSpot(parts.mastLight);
    }
    poseWing(parts, wingT);
    poseMast(parts, mastT);
    decalKey = '';
    refreshDecal();
    stage.reapplyMood();
  }

  function apply(next: TrailerConfig) {
    const prev = cfg;
    cfg = { ...next };
    mats.paint.color.set(cfg.paint);
    applyTrim(mats, cfg.trim);
    const shapeChanged = !parts || SHAPE_KEYS.some((k) => prev[k] !== cfg[k]) || (!!prev.brand.trim() !== !!cfg.brand.trim());
    if (shapeChanged) rebuild();
    else refreshDecal();
    if (parts?.mastLight) {
      parts.mastLight.userData.on = cfg.mastUp;
      stage.reapplyMood();
    }
  }

  stage.onFrame((dt) => {
    if (!parts) return;
    const k = Math.min(1, dt * 1.6);
    const wTarget = cfg.wingOpen ? 1 : 0;
    const mTarget = cfg.mastUp ? 1 : 0;
    if (Math.abs(wingT - wTarget) > 0.001) {
      wingT += (wTarget - wingT) * k + Math.sign(wTarget - wingT) * 0.004;
      wingT = Math.min(1, Math.max(0, wingT));
      poseWing(parts, wingT);
    }
    if (Math.abs(mastT - mTarget) > 0.001) {
      mastT += (mTarget - mastT) * k + Math.sign(mTarget - mastT) * 0.004;
      mastT = Math.min(1, Math.max(0, mastT));
      poseMast(parts, mastT);
    }
  });

  apply(cfg);
  return { apply, get config() { return cfg; } };
}
