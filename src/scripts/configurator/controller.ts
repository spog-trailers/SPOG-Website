/**
 * Keeps the 3D trailer in sync with a TrailerConfig. Rebuilds geometry only when the shape
 * changes, recolors in place, and swings the doors toward open or shut.
 */
import * as THREE from 'three';
import type { Stage } from './scene';
import { applyFinish, buildTrailer, createMaterials, decalTexture, poseDoors, type TrailerConfig, type TrailerParts } from './trailer';

/** Everything that only recolors, swings a door or redraws the decal. The rest reshapes the model. */
const SOFT_KEYS: (keyof TrailerConfig)[] = ['paint', 'paintDark', 'matte', 'doorsOpen', 'brand'];

/** Width over height of the typed company-name decal. */
export const TEXT_ASPECT = 2048 / 420;

export function createController(stage: Stage, initial: TrailerConfig, onBuild?: (parts: TrailerParts) => void) {
  const mats = createMaterials();
  let cfg: TrailerConfig = { ...initial };
  let parts: TrailerParts | null = null;
  let doorT = cfg.doorsOpen ? 1 : 0;
  let decalKey = '';
  let art: THREE.Texture | null = null;

  async function refreshDecal() {
    if (!cfg.brand) return;
    if (art) {
      if (mats.brand.map !== art) {
        if (mats.brand.map) mats.brand.map.dispose();
        mats.brand.map = art;
        mats.brand.needsUpdate = true;
        decalKey = 'art';
      }
      return;
    }
    const key = `${cfg.brand}|${cfg.paintDark}`;
    if (key === decalKey && mats.brand.map) return;
    decalKey = key;
    const tex = await decalTexture(cfg.brand, cfg.paintDark);
    if (key !== decalKey || art) { tex.dispose(); return; }
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
    stage.setTall(parts.tall, parts.top); // how high the 6 ft light or the 28 ft tower reaches, so the camera backs off far enough
    poseDoors(parts, doorT);
    onBuild?.(parts);
  }

  function apply(next: TrailerConfig) {
    const prev = cfg;
    cfg = { ...next };
    applyFinish(mats, cfg);
    const keys = Object.keys(cfg) as (keyof TrailerConfig)[];
    const shapeChanged = !parts || keys.some((k) => !SOFT_KEYS.includes(k) && prev[k] !== cfg[k]) || (!!prev.brand !== !!cfg.brand);
    if (shapeChanged) rebuild();
    refreshDecal();
  }

  /** Use the buyer's own logo file for the decal, or pass null to go back to the typed name. */
  function setArt(image: HTMLImageElement | null) {
    if (art) {
      if (mats.brand.map === art) mats.brand.map = null;
      art.dispose();
      art = null;
    }
    decalKey = '';
    if (image) {
      art = new THREE.Texture(image);
      art.colorSpace = THREE.SRGBColorSpace;
      art.anisotropy = 8;
      art.needsUpdate = true;
    }
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
  return { apply, setArt, get config() { return cfg; }, get anchors() { return parts?.anchors ?? {}; } };
}
