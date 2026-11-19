/**
 * Page wiring for the Cargo configurator: build state, option buttons, the price bar, camera
 * views that follow the section you're in, the callouts pinned to the model, and the order steps.
 * The build is saved in the URL hash so it can be shared. ZIP and contact details never go there.
 */
import { createController } from './controller';
import {
  BATTERIES, DEFAULT_BUILD, FLOORS, PAINTS, PANELS_INCLUDED, PANEL_PRICE, SIZES, TRIMS, WALLS, WHEELS,
  buildCode, enforceRules, leadTime, money, moneyTotal, runtime, solarWatts, summaryLine, toTrailerConfig, totals, type BuildState,
} from './data';
import { maxPanels } from './dims';
import { VIEW_ORDER, createStage, type ViewName } from './scene';

type Step = 'design' | 'order' | 'done';
const SHARED: (keyof BuildState)[] = ['length', 'paint', 'trim', 'wheels', 'battery', 'panels', 'rear', 'addons', 'walls', 'floor', 'inside', 'brandOn', 'brandText', 'tools'];

function loadState(): BuildState {
  const state: BuildState = structuredClone(DEFAULT_BUILD);
  try {
    const m = location.hash.match(/build=([^&]+)/);
    if (m) {
      const saved = JSON.parse(decodeURIComponent(escape(atob(m[1].replace(/-/g, '+').replace(/_/g, '/')))));
      for (const k of SHARED) if (k in saved && typeof saved[k] === typeof state[k]) (state as any)[k] = saved[k];
    }
  } catch { /* a bad link falls back to the default build */ }
  if (!SIZES.some((s) => s.ft === state.length)) state.length = DEFAULT_BUILD.length;
  enforceRules(state);
  return state;
}

function saveState(state: BuildState) {
  const shared: Record<string, unknown> = {};
  for (const k of SHARED) shared[k] = state[k];
  const enc = btoa(unescape(encodeURIComponent(JSON.stringify(shared)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  history.replaceState(null, '', `#build=${enc}`);
}

export function initConfigurator() {
  const root = document.getElementById('cfg');
  const stageEl = document.getElementById('stage');
  if (!root || !stageEl) return;
  const $$ = <T extends HTMLElement>(sel: string) => [...root.querySelectorAll<T>(sel)];
  const out = (key: string, text: string) => $$(`[data-out="${key}"]`).forEach((el) => { el.textContent = text; });

  let state = loadState();
  let step: Step = 'design';
  let doorsOpen = false;

  const stage = createStage(stageEl);
  const controller = createController(stage, toTrailerConfig(state, { doorsOpen }));

  // ---------------------------------------------------------------- render
  const note = document.getElementById('note')!;
  let noteTimer = 0;
  function say(text: string) {
    note.textContent = text;
    note.style.opacity = '1';
    clearTimeout(noteTimer);
    noteTimer = window.setTimeout(() => { note.style.opacity = '0'; }, 4200);
  }

  const brandInput = document.getElementById('brand-text') as HTMLInputElement;
  const doorsBtn = document.getElementById('doors')!;
  const zipWrap = document.getElementById('zip-wrap')!;

  function render(save = true) {
    const notes = enforceRules(state);
    if (notes.length) say(notes.join(' '));
    controller.apply(toTrailerConfig(state, { doorsOpen }));

    $$<HTMLButtonElement>('[data-opt]').forEach((b) => {
      const key = b.dataset.opt as keyof BuildState;
      b.setAttribute('aria-pressed', String(String(state[key]) === b.dataset.value));
      if (b.dataset.min) b.disabled = state.length < Number(b.dataset.min);
    });
    $$<HTMLButtonElement>('[data-toggle]').forEach((b) => {
      const list = state[b.dataset.toggle as 'addons' | 'inside' | 'tools'];
      b.setAttribute('aria-pressed', String(list.includes(b.dataset.value!)));
    });
    $$<HTMLButtonElement>('[data-flag]').forEach((b) => b.setAttribute('aria-pressed', String(!!state[b.dataset.flag as 'brandOn'])));
    brandInput.classList.toggle('hidden', !state.brandOn);
    if (brandInput.value !== state.brandText) brandInput.value = state.brandText;

    const named = <T extends { id: string; name: string; price: number }>(key: string, list: readonly T[], id: string) => {
      const item = list.find((x) => x.id === id) ?? list[0];
      out(`name-${key}`, item.name);
      out(`price-${key}`, money(item.price));
    };
    named('paint', PAINTS, state.paint);
    named('trim', TRIMS, state.trim);
    named('wheels', WHEELS, state.wheels);
    named('walls', WALLS, state.walls);
    named('floor', FLOORS, state.floor);
    const bat = BATTERIES.find((b) => b.kwh === state.battery) ?? BATTERIES[0];
    out('name-battery', `${bat.kwh} kWh battery`);
    out('price-battery', money(bat.price));
    const watts = solarWatts(state);
    const max = maxPanels(state.length);
    out('name-solar', `${watts.toLocaleString()}W roof solar`);
    out('price-solar', money(Math.max(0, state.panels - PANELS_INCLUDED) * PANEL_PRICE));
    out('solar-note', `The ${state.length} ft roof fits up to ${max} panels. Each added panel is ${moneyTotal(PANEL_PRICE)}.`);
    out('panels', `${state.panels} panel${state.panels === 1 ? '' : 's'}`);
    $$<HTMLButtonElement>('[data-panels]').forEach((b) => {
      const next = state.panels + Number(b.dataset.panels);
      b.disabled = next < Math.min(PANELS_INCLUDED, max) || next > max;
    });

    out('stat-length', `${state.length} ft`);
    out('stat-battery', `${state.battery} kWh`);
    out('stat-solar', `${watts.toLocaleString()}W`);

    const run = runtime(state);
    $$('[data-out="run-bar"]').forEach((el) => { el.style.width = `${Math.round(run.coverage * 100)}%`; });
    out('run-head', run.headline);
    out('run-detail', run.detail);

    const t = totals(state);
    const lines = t.lines.map((l) => `<li class="flex justify-between gap-4"><span>${escapeHtml(l.label)}</span><span class="shrink-0 text-ink-soft">${money(l.price)}</span></li>`).join('');
    $$('[data-out="lines"]').forEach((el) => { el.innerHTML = lines; });
    out('vehicle', moneyTotal(t.vehicle));
    out('delivery', t.delivery ? moneyTotal(t.delivery) : 'Included');
    out('total', moneyTotal(t.total));
    out('lead', leadTime(state));
    out('summary', summaryLine(state));
    out('title', (SIZES.find((s) => s.ft === state.length) ?? SIZES[1]).name);
    out('code', buildCode(state));
    zipWrap.classList.toggle('hidden', state.delivery !== 'delivery');

    doorsBtn.textContent = doorsOpen ? 'Close doors' : 'Open doors';
    doorsBtn.setAttribute('aria-pressed', String(doorsOpen));
    if (save) saveState(state);
  }

  // ---------------------------------------------------------------- views
  const viewDots = $$<HTMLButtonElement>('[data-view]').filter((b) => b.tagName === 'BUTTON' && !b.hasAttribute('data-section'));
  const hint = document.getElementById('hint')!;
  function go(view: ViewName) {
    stage.setView(view);
    viewDots.forEach((d) => d.setAttribute('aria-pressed', String(d.dataset.view === view)));
    hint.textContent = view === 'interior' ? 'Drag to look around' : 'Drag to turn it around';
  }
  viewDots.forEach((d) => d.addEventListener('click', () => go(d.dataset.view as ViewName)));
  $$<HTMLButtonElement>('[data-view-step]').forEach((b) => b.addEventListener('click', () => {
    const i = VIEW_ORDER.indexOf(stage.view);
    const n = VIEW_ORDER.length;
    go(VIEW_ORDER[((i < 0 ? 0 : i) + Number(b.dataset.viewStep) + n) % n]);
  }));
  stage.onUserMove(() => { hint.style.opacity = '0'; });

  // The viewer turns to the section you scroll to, as Tesla's does.
  let scrollView: ViewName = 'front';
  const sections = $$('[data-section]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (step !== 'design') return;
      const hit = entries.filter((e) => e.isIntersecting).pop();
      const view = hit && ((hit.target as HTMLElement).dataset.view as ViewName);
      if (view && view !== scrollView) {
        scrollView = view;
        go(view);
      }
    }, { rootMargin: '-38% 0px -52% 0px' });
    sections.forEach((s) => io.observe(s));
  }

  doorsBtn.addEventListener('click', () => { doorsOpen = !doorsOpen; render(false); });

  // ---------------------------------------------------------------- callouts
  const callouts = $$('.co');
  callouts.forEach((c) => c.querySelector('.co-btn')!.addEventListener('click', () => {
    const open = c.hasAttribute('data-open');
    callouts.forEach((o) => o.removeAttribute('data-open'));
    c.toggleAttribute('data-open', !open);
  }));
  stage.onFrame(() => {
    const show = step === 'design' && stage.view === 'front' && !stage.moved && !stage.moving;
    const anchors = controller.anchors;
    callouts.forEach((c) => {
      const p = anchors[c.dataset.anchor!];
      if (!show || !p) { c.removeAttribute('data-on'); c.removeAttribute('data-open'); return; }
      const s = stage.project(p);
      c.style.setProperty('--x', `${s.x.toFixed(1)}px`);
      c.style.setProperty('--y', `${s.y.toFixed(1)}px`);
      c.toggleAttribute('data-on', s.visible);
    });
  });

  // ---------------------------------------------------------------- choices
  root.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLButtonElement>('button');
    if (!b || b.disabled) return;
    const d = b.dataset;
    let changed = false;
    if (d.opt) {
      const key = d.opt as keyof BuildState;
      (state as any)[key] = typeof state[key] === 'number' ? Number(d.value) : d.value;
      changed = true;
    } else if (d.toggle) {
      const list = state[d.toggle as 'addons' | 'inside' | 'tools'];
      const i = list.indexOf(d.value!);
      if (i >= 0) list.splice(i, 1); else list.push(d.value!);
      changed = true;
    } else if (d.flag) {
      state.brandOn = !state.brandOn;
      changed = true;
      if (state.brandOn) setTimeout(() => brandInput.focus(), 0);
    } else if (d.panels) {
      state.panels += Number(d.panels);
      changed = true;
      go('top');
    } else if (d.goto) {
      setStep(d.goto as Step);
      return;
    }
    if (!changed) return;
    if ('open' in d) doorsOpen = true;
    // Turn the viewer to what just changed. Removing an add-on doesn't need a look.
    const removed = d.toggle && !state[d.toggle as 'addons'].includes(d.value!);
    if (d.go && !removed && step === 'design') go(d.go as ViewName);
    render();
  });
  brandInput.addEventListener('input', () => { state.brandText = brandInput.value; render(); });

  const zip = document.getElementById('zip') as HTMLInputElement;
  zip.addEventListener('input', () => { state.zip = zip.value.replace(/\D/g, '').slice(0, 5); zip.value = state.zip; });

  // ---------------------------------------------------------------- steps
  const panels = $$('[data-panel]');
  function setStep(next: Step) {
    step = next;
    root!.dataset.step = next;
    panels.forEach((p) => { p.hidden = p.dataset.panel !== next; });
    if (next !== 'design') go('front');
    const top = document.getElementById('panel')!.getBoundingClientRect().top + window.scrollY - 56;
    window.scrollTo({ top: window.matchMedia('(min-width: 900px)').matches ? 0 : top, behavior: 'auto' });
    render(false);
  }
  const form = document.getElementById('order-form') as HTMLFormElement;
  const error = document.getElementById('order-error')!;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = form.checkValidity();
    error.classList.toggle('hidden', ok);
    if (ok) setStep('done');
  });
  document.getElementById('reset')!.addEventListener('click', () => {
    state = structuredClone(DEFAULT_BUILD);
    doorsOpen = false;
    form.reset();
    setStep('design');
    render();
  });
  const share = document.getElementById('share')!;
  share.addEventListener('click', async () => {
    saveState(state);
    try {
      await navigator.clipboard.writeText(location.href);
      share.textContent = 'Link copied';
    } catch {
      share.textContent = 'Copy the link from your address bar';
    }
    setTimeout(() => { share.textContent = 'Copy a link to this build'; }, 2600);
  });

  go('front');
  render(false);
  root.dataset.ready = 'true';
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]!));
}
