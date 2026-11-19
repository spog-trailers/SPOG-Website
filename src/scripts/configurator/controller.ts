/**
 * Keeps the 3D trailer in sync with a TrailerConfig. Rebuilds geometry only when the shape
 * changes, recolors in place, and swings the doors toward open or shut.
 */
import type { Stage } from './scene';
import { applyFinish, buildTrailer, createMaterials, decalTexture, poseDoors, type TrailerConfig, type TrailerParts } from './trailer';

const SHAPE_KEYS: (keyof TrailerConfig)[] = [
  'length', 'panels', 'batteryModules', 'rear', 'window', 'hatch', 'spare', 'vent', 'floods', 'cameras', 'hvac',
  'shelving', 'bench', 'cabinets', 'etrack',
];

export function createController(stage: Stage, initial: TrailerConfig) {
  const mats = createMaterials();
  let cfg: TrailerConfig = { ...initial };
  let parts: TrailerParts | null = null;
  let doorT = cfg.doorsOpen ? 1 : 0;
  let decalKey = '';

  async function refreshDecal() {
    if (!cfg.brand) return;
    const key = `${cfg.brand}|${cfg.paintDark}`;
    if (key === decalKey && mats.brand.map) return;
    decalKey = key;
    const tex = await decalTexture(cfg.brand, cfg.paintDark);
    if (key !== decalKey) { tex.dispose(); return; }
    mats.brand.map?.dispose();
    mats.brand.map = tex;
    mats.brand.needsUpdate = true;
  }

  function rebuild() {
    if (parts) {
      stage.scene.remove(parts.group);
      parts.dispose();
    }
    parts = buildTrailer(cfg, mats);
    stage.scene.add(parts.group);
    stage.setLength(cfg.length);
    poseDoors(parts, doorT);
  }

  function apply(next: TrailerConfig) {
    const prev = cfg;
    cfg = { ...next };
    applyFinish(mats, cfg);
    const shapeChanged = !parts || SHAPE_KEYS.some((k) => prev[k] !== cfg[k]) || (!!prev.brand !== !!cfg.brand);
    if (shapeChanged) rebuild();
    refreshDecal();
  }

  stage.onFrame((dt) => {
    if (!parts) return;
    const target = cfg.doorsOpen ? 1 : 0;
    if (doorT === target) return;
    const step = dt / 1.3;
    doorT = target > doorT ? Math.min(1, doorT + step) : Math.max(0, doorT - step);
    poseDoors(parts, doorT);
  });

  apply(cfg);
  return { apply, get config() { return cfg; }, get anchors() { return parts?.anchors ?? {}; } };
}
