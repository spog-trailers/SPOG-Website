/**
 * The Cargo 3D model as a viewer you can drop into any page section, with no option panel.
 * Used by the "Take a tour" section on /cargo-2. The page loads this file only when the section
 * comes near, because it pulls in three.js, and stops the drawing when the section leaves.
 *
 * It shows the trailer as built in Nate's photos: black, 20 ft, with the climate control head and
 * the tie-down track that the finished trailer has inside. The built-in corner work desk is standard
 * on every Cargo (SOURCE price sheet 2026-11-20), so the model always draws it and it is no longer
 * an option here. The battery is the 20 ft's standard 10 kWh. Colors are the real 12.
 */
import { TEXT_ASPECT, createController } from './controller';
import { DEFAULT_BUILD, PAINTS, toTrailerConfig, type BuildState } from './data';
import { createStage, type ViewName } from './scene';

export { PAINTS };

export function mountViewer(container: HTMLElement, opts: { kind?: 'cargo' | 'workstation' } = {}) {
  const state: BuildState = structuredClone(DEFAULT_BUILD);
  state.battery = '10'; // SOURCE price sheet 2026-11-20: the 20 ft's standard battery, so the tour shows the trailer as it comes
  state.options = ['hvac', 'etrackWalls']; // 2026-11-20: the desk is standard now, so it's not an option
  if (opts.kind === 'workstation') {
    // The white 20 ft Workstation as it comes: climate control included, the white composite
    // interior, no mast (Nate's drone photos, 2026-11-20). /workstation-2's tour.
    state.kind = 'workstation';
    state.paint = 'white';
    state.options = [];
  }
  let doorsOpen = false;
  const config = () => toTrailerConfig(state, { doorsOpen, logoAspect: TEXT_ASPECT });

  // No wheel zoom: on a long page the wheel has to keep scrolling the page.
  // A little closer than the configurator, because this stage is wide and short.
  const stage = createStage(container, { zoom: false, distance: 0.8 });
  const controller = createController(stage, config());

  return {
    setPaint(id: string) {
      if (!PAINTS.some((p) => p.id === id)) return;
      state.paint = id;
      controller.apply(config());
    },
    setDoors(open: boolean) {
      doorsOpen = open;
      controller.apply(config());
    },
    setView: (view: ViewName) => stage.setView(view),
    setActive: stage.setActive,
    onUserMove: stage.onUserMove,
    get view() { return stage.view; },
    get doorsOpen() { return doorsOpen; },
  };
}
export type Viewer = ReturnType<typeof mountViewer>;
