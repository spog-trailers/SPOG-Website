/**
 * Page wiring for the Cargo configurator: build state, option buttons, the price bar, camera
 * views that follow the section you're in, the callouts pinned to the model, and the order steps.
 * The build is saved in the URL hash so it can be shared. ZIP, contact details and an uploaded
 * logo file never go there.
 */
import { TEXT_ASPECT, createController } from './controller';
import {
  BATTERIES, CONNECT, DEFAULT_BUILD, INTERIOR, LOGO_PRICE, LOGO_SPOTS, MAX_CABINETS, MAX_DESKS, PAINTS, SHORE, SIZES, VOLTS,
  batteryKwh, buildCode, enforceRules, has, leadTime, money, moneyTotal, optionPrice, runtime, solarPanels, summaryLine, toTrailerConfig, totals,
  type BuildState,
} from './data';
import { VIEW_ORDER, createStage, type ViewName } from './scene';

type Step = 'design' | 'order' | 'done';
type ListKey = 'logoSpots' | 'volts' | 'options' | 'tools';
const SHARED: (keyof BuildState)[] = ['length', 'paint', 'logoSpots', 'brandText', 'lettering', 'letteringText', 'battery', 'batteryOther', 'volts', 'shore', 'options', 'desks', 'benchLength', 'cabinets', 'tools'];
const COUNT_MAX: Record<string, number> = { desks: MAX_DESKS, cabinets: MAX_CABINETS };

function loadState(): BuildState {
  const state: BuildState = structuredClone(DEFAULT_BUILD);
  try {
    const m = location.hash.match(/build=([^&]+)/);
    if (m) {
      const saved = JSON.parse(decodeURIComponent(escape(atob(m[1].replace(/-/g, '+').replace(/_/g, '/')))));
      for (const k of SHARED) {
        if (!(k in saved) || typeof saved[k] !== typeof state[k] || Array.isArray(saved[k]) !== Array.isArray(state[k])) continue;
        (state as any)[k] = saved[k];
      }
    }
  } catch { /* a bad link falls back to the default build */ }
  const known = new Set([...INTERIOR, ...CONNECT].map((o) => o.id));
  state.options = state.options.filter((id) => known.has(id));
  state.logoSpots = state.logoSpots.filter((id) => LOGO_SPOTS.some((l) => l.id === id));
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
  const byId = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
  const out = (key: string, text: string) => $$(`[data-out="${key}"]`).forEach((el) => { el.textContent = text; });

  let state = loadState();
  let step: Step = 'design';
  let doorsOpen = false;
  let logoAspect = TEXT_ASPECT;

  const note = byId('note');
  let noteTimer = 0;
  function say(text: string) {
    note.textContent = text;
    note.style.opacity = '1';
    clearTimeout(noteTimer);
    noteTimer = window.setTimeout(() => { note.style.opacity = '0'; }, 5200);
  }

  const config = () => toTrailerConfig(state, { doorsOpen, logoAspect });
  const stage = createStage(stageEl);
  // When the preview can't fit everything that's checked, say which pieces it left out.
  let lastSkipped = '';
  const controller = createController(stage, config(), (parts) => {
    const list = [...new Set(parts.skipped)].join(', ');
    if (list && list !== lastSkipped) say(`This preview has no room for ${list}. Your SPOG contact will work out the layout.`);
    lastSkipped = list;
  });

  // ---------------------------------------------------------------- render
  const brandInput = byId<HTMLInputElement>('brand-text');
  const letteringInput = byId<HTMLInputElement>('lettering-text');
  const otherInput = byId<HTMLInputElement>('battery-other');
  const logoFile = byId<HTMLInputElement>('logo-file');
  const logoClear = byId('logo-clear');
  const logoAll = byId('logo-all');
  const doorsBtn = byId('doors');
  const zipWrap = byId('zip-wrap');
  const sync = (input: HTMLInputElement, value: string) => { if (input.value !== value) input.value = value; };

  function render(save = true) {
    const notes = enforceRules(state);
    if (notes.length) say(notes.join(' '));
    controller.apply(config());

    $$<HTMLButtonElement>('[data-opt]').forEach((b) => {
      const key = b.dataset.opt as keyof BuildState;
      b.setAttribute('aria-pressed', String(String(state[key]) === b.dataset.value));
    });
    $$<HTMLButtonElement>('[data-toggle]').forEach((b) => {
      b.setAttribute('aria-pressed', String(state[b.dataset.toggle as ListKey].includes(b.dataset.value!)));
    });
    $$<HTMLButtonElement>('[data-flag]').forEach((b) => b.setAttribute('aria-pressed', String(!!state[b.dataset.flag as 'lettering'])));
    $$('[data-detail]').forEach((d) => {
      const on = has(state, d.dataset.detail!);
      d.classList.toggle('hidden', !on);
      d.classList.toggle('flex', on);
    });
    $$<HTMLButtonElement>('[data-step]').forEach((b) => {
      const key = b.dataset.step as 'desks' | 'cabinets';
      const next = state[key] + Number(b.dataset.delta);
      b.disabled = next < 1 || next > COUNT_MAX[key];
    });
    out('count-desks', String(state.desks));
    out('count-cabinets', String(state.cabinets));

    // exterior
    out('name-paint', (PAINTS.find((p) => p.id === state.paint) ?? PAINTS[0]).name);
    const spots = state.logoSpots.length;
    out('price-logo', spots ? moneyTotal(spots * LOGO_PRICE) : `${moneyTotal(LOGO_PRICE)} a spot`);
    logoAll.setAttribute('aria-pressed', String(spots === LOGO_SPOTS.length));
    byId('logo-fields').classList.toggle('hidden', !spots);
    sync(brandInput, state.brandText);
    letteringInput.classList.toggle('hidden', !state.lettering);
    sync(letteringInput, state.letteringText);

    // power
    const kwh = batteryKwh(state);
    const bat = BATTERIES.find((b) => b.id === state.battery) ?? BATTERIES[0];
    out('name-battery', `${kwh} kWh battery`);
    out('price-battery', money(bat.price));
    byId('battery-other-wrap').classList.toggle('hidden', state.battery !== 'other');
    if (document.activeElement !== otherInput) sync(otherInput, String(state.batteryOther));
    out('price-volts', money(VOLTS.filter((v) => state.volts.includes(v.id)).reduce((sum, v) => sum + v.price, 0)));
    out('price-shore', money((SHORE.find((x) => x.id === state.shore) ?? SHORE[0]).price));
    [...INTERIOR, ...CONNECT].forEach((o) => out(`price-opt-${o.id}`, moneyTotal(optionPrice(state, o))));

    out('stat-length', `${state.length} ft`);
    out('stat-battery', `${kwh} kWh`);
    out('stat-solar', `${solarPanels(state)} panels`);

    const run = runtime(state);
    $$('[data-out="run-bar"]').forEach((el) => { el.style.width = `${Math.round(run.coverage * 100)}%`; });
    out('run-head', run.headline);
    out('run-detail', run.detail);

    const t = totals(state);
    const lines = t.lines.map((l) => `<li class="flex justify-between gap-4"><span>${escapeHtml(l.label)}</span><span class="shrink-0 text-ink-soft">${money(l.price)}</span></li>`).join('');
    $$('[data-out="lines"]').forEach((el) => { el.innerHTML = lines; });
    out('vehicle', moneyTotal(t.vehicle));
    out('quoted', t.quoted ? 'Items marked Quoted are priced separately.' : '');
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
  const viewDots = $$<HTMLButtonElement>('button[data-view]');
  const hint = byId('hint');
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
    $$('[data-section]').forEach((s) => io.observe(s));
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
    let added = true;
    if (d.opt) {
      const key = d.opt as keyof BuildState;
      (state as any)[key] = typeof state[key] === 'number' ? Number(d.value) : d.value;
      if (key === 'battery' && d.value === 'other') setTimeout(() => otherInput.focus(), 0);
    } else if (d.toggle) {
      const list = state[d.toggle as ListKey];
      const i = list.indexOf(d.value!);
      if (i >= 0) { list.splice(i, 1); added = false; } else list.push(d.value!);
      if (d.toggle === 'logoSpots' && added && list.length === 1) setTimeout(() => brandInput.focus(), 0);
    } else if (d.flag) {
      state.lettering = !state.lettering;
      if (state.lettering) setTimeout(() => letteringInput.focus(), 0);
    } else if (d.step) {
      const key = d.step as 'desks' | 'cabinets';
      state[key] += Number(d.delta);
    } else if (b === logoAll) {
      state.logoSpots = state.logoSpots.length === LOGO_SPOTS.length ? [] : LOGO_SPOTS.map((l) => l.id);
    } else if (d.goto) {
      setStep(d.goto as Step);
      return;
    } else return;
    // Turn the viewer to what just changed. Unchecking something doesn't need a look.
    const view = d.go ?? (d.step ? 'interior' : b === logoAll ? 'front' : '');
    if (view && added && step === 'design') go(view as ViewName);
    render();
  });
  brandInput.addEventListener('input', () => { state.brandText = brandInput.value; render(); });
  letteringInput.addEventListener('input', () => { state.letteringText = letteringInput.value; render(); });
  otherInput.addEventListener('input', () => {
    const n = Number(otherInput.value);
    if (Number.isFinite(n) && n > 0) { state.batteryOther = Math.min(200, Math.round(n)); render(); }
  });

  // The buyer's own logo art. It's read in the browser and never uploaded or saved in the link.
  function setLogo(image: HTMLImageElement | null) {
    controller.setArt(image);
    logoAspect = image ? Math.max(0.4, Math.min(8, image.naturalWidth / Math.max(1, image.naturalHeight))) : TEXT_ASPECT;
    logoClear.classList.toggle('hidden', !image);
    brandInput.classList.toggle('hidden', !!image);
    render(false);
  }
  logoFile.addEventListener('change', () => {
    const file = logoFile.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => { setLogo(image); URL.revokeObjectURL(url); };
    image.onerror = () => { URL.revokeObjectURL(url); say("That file didn't open as an image. Try a PNG, JPG or SVG."); };
    image.src = url;
  });
  logoClear.addEventListener('click', () => { logoFile.value = ''; setLogo(null); });

  const zip = byId<HTMLInputElement>('zip');
  zip.addEventListener('input', () => { state.zip = zip.value.replace(/\D/g, '').slice(0, 5); zip.value = state.zip; });

  // ---------------------------------------------------------------- steps
  const panels = $$('[data-panel]');
  function setStep(next: Step) {
    step = next;
    root!.dataset.step = next;
    panels.forEach((p) => { p.hidden = p.dataset.panel !== next; });
    if (next !== 'design') go('front');
    const top = byId('panel').getBoundingClientRect().top + window.scrollY - 56;
    window.scrollTo({ top: window.matchMedia('(min-width: 900px)').matches ? 0 : top, behavior: 'auto' });
    render(false);
  }
  const form = byId<HTMLFormElement>('order-form');
  const error = byId('order-error');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = form.checkValidity();
    error.classList.toggle('hidden', ok);
    if (ok) setStep('done');
  });
  byId('reset').addEventListener('click', () => {
    state = structuredClone(DEFAULT_BUILD);
    doorsOpen = false;
    form.reset();
    logoFile.value = '';
    setLogo(null);
    setStep('design');
    render();
  });
  const share = byId('share');
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
