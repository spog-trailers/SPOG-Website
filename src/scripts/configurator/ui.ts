/**
 * Wires the Cargo configurator page: build state, rules, 3D sync, camera-follows-section,
 * run-time meter, pricing and the four checkout steps. Demo only, nothing is sent anywhere.
 */
import { createStage, type ViewName } from './scene';
import { createController } from './controller';
import * as D from './data';

type Step = 'build' | 'delivery' | 'details' | 'review' | 'done';
const STEPS: Step[] = ['build', 'delivery', 'details', 'review', 'done'];
const NEXT_LABEL: Record<Step, string> = {
  build: 'Continue to delivery',
  delivery: 'Continue to your details',
  details: 'Review and deposit',
  review: 'Place demo deposit',
  done: 'Start a new build',
};

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];

function readHash(): D.BuildState | null {
  try {
    const m = location.hash.match(/build=([^&]+)/);
    if (!m) return null;
    const parsed = JSON.parse(atob(decodeURIComponent(m[1])));
    return { ...structuredClone(D.DEFAULT_BUILD), ...parsed, delivery: 'pickup', zip: '' };
  } catch {
    return null;
  }
}

function writeHash(s: D.BuildState) {
  const { delivery, zip, ...build } = s;
  const enc = encodeURIComponent(btoa(JSON.stringify(build)));
  history.replaceState(null, '', `#build=${enc}`);
}

export function initConfigurator() {
  const stage = createStage($('#stage'));
  const state: D.BuildState = readHash() ?? structuredClone(D.DEFAULT_BUILD);
  D.enforceRules(state);
  const view = { wingOpen: false, mastUp: true };
  let step: Step = 'build';
  const ctl = createController(stage, D.toTrailerConfig(state, view));
  (window as any).__cfg = { state, stage, ctl };

  // ---------------------------------------------------------------- toast for rule changes
  const toast = $('#toast');
  let toastTimer = 0;
  function notify(msg: string) {
    toast.textContent = msg;
    toast.setAttribute('data-show', '');
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.removeAttribute('data-show'), 3600);
  }

  // ---------------------------------------------------------------- render
  const out = (key: string) => $$(`[data-out="${key}"]`);
  const setText = (key: string, text: string) => out(key).forEach((el) => { el.textContent = text; });
  const press = (el: Element, on: boolean) => el.setAttribute('aria-pressed', on ? 'true' : 'false');

  function lineItems(lines: D.Line[]) {
    return lines.map((l) => `<li class="flex justify-between gap-4 text-[14.5px]"><span class="text-ink-soft">${escapeHtml(l.label)}</span><span class="shrink-0 text-ink">${D.money(l.price)}</span></li>`).join('');
  }

  function render() {
    const notes = D.enforceRules(state);
    if (notes.length) notify(notes.join(' '));

    const solar = D.solarWatts(state);
    const maxPanels = D.maxRoofPanels(state.length);
    const t = D.totals(state);
    const rt = D.runtime(state);
    const paint = D.PAINTS.find((p) => p.id === state.paint)!;
    const trim = D.TRIMS.find((x) => x.id === state.trim)!;

    // option states
    $$('[data-length]').forEach((b) => press(b, Number(b.dataset.length) === state.length));
    $$('[data-battery]').forEach((b) => {
      const bat = D.BATTERIES.find((x) => x.kwh === Number(b.dataset.battery))!;
      const blocked = state.length < bat.minLength;
      (b as HTMLButtonElement).disabled = blocked;
      press(b, bat.kwh === state.battery);
      $(`[data-battery-note="${bat.kwh}"]`).textContent = blocked ? `Needs ${bat.minLength} ft or longer` : D.money(bat.price);
    });
    ($('[data-panels="-2"]') as HTMLButtonElement).disabled = state.roofPanels <= 2;
    ($('[data-panels="2"]') as HTMLButtonElement).disabled = state.roofPanels >= maxPanels;
    setText('panels', `${state.roofPanels} panels · ${(state.roofPanels * D.PANEL_WATTS).toLocaleString()}W`);
    setText('panels-note', `A ${state.length} ft roof fits up to ${maxPanels}. ${D.money(D.PANEL_PAIR_PRICE)} per pair.`);
    const wingBtn = $('[data-toggle="wing"]') as HTMLButtonElement;
    wingBtn.disabled = state.length < D.WING.minLength;
    press(wingBtn, state.wing);
    setText('wing-note', wingBtn.disabled ? `Needs ${D.WING.minLength} ft or longer.` : 'Two more panels that fold out as an awning.');
    $$('[data-paint]').forEach((b) => press(b, b.dataset.paint === state.paint));
    $$('[data-trim]').forEach((b) => press(b, b.dataset.trim === state.trim));
    setText('paint-name', paint.name);
    setText('paint-price', D.money(paint.price));
    setText('trim-name', trim.name);
    setText('trim-price', D.money(trim.price));
    $$('[data-equip]').forEach((b) => press(b, state.equipment.includes(b.dataset.equip!)));
    $$('[data-inside]').forEach((b) => press(b, state.inside.includes(b.dataset.inside!)));
    $$('[data-tool]').forEach((b) => press(b, state.tools.includes(b.dataset.tool!)));
    press($('[data-toggle="brand"]'), state.brandOn);
    $$('[data-delivery]').forEach((b) => press(b, b.dataset.delivery === state.delivery));

    // stats and meter
    setText('stat-battery', `${state.battery} kWh`);
    setText('stat-solar', `${solar.toLocaleString()}W`);
    setText('stat-length', `${state.length} ft`);
    setText('length-big', `${state.length} ft`);
    setText('rt-headline', rt.headline);
    setText('rt-detail', rt.detail);
    out('rt-bar').forEach((el) => { el.style.width = `${Math.round(rt.coverage * 100)}%`; });

    // pricing
    out('lines').forEach((el) => { el.innerHTML = lineItems(t.lines); });
    out('review-lines').forEach((el) => { el.innerHTML = lineItems(t.lines); });
    setText('vehicle-total', D.moneyTotal(t.vehicle));
    setText('lead-time', D.leadTime(state));
    setText('lead-time-2', D.leadTime(state));
    setText('delivery-line', state.delivery === 'delivery' ? D.moneyTotal(D.DELIVERY_FEE) : 'Pickup, included');
    setText('grand-total', D.moneyTotal(t.total));
    setText('summary', D.summaryLine(state));
    setText('review-summary', D.summaryLine(state));
    setText('done-summary', `${D.summaryLine(state)} · estimated ${D.moneyTotal(t.total)}`);
    if (step === 'review' || step === 'done') {
      setText('bar-price', D.moneyTotal(t.deposit));
      setText('bar-price-label', `Due today · of ${D.moneyTotal(t.total)} est.`);
    } else {
      setText('bar-price', D.moneyTotal(step === 'build' ? t.vehicle : t.total));
      setText('bar-price-label', 'Estimated price · sample');
    }

    // stage actions
    const mastBtn = $('[data-stage-action="mast"]');
    mastBtn.hidden = !state.equipment.includes('mast');
    mastBtn.textContent = view.mastUp ? 'Lower mast' : 'Raise mast';
    const wingAct = $('[data-stage-action="wing"]');
    wingAct.hidden = !state.wing;
    wingAct.textContent = view.wingOpen ? 'Fold wing' : 'Open wing';

    ctl.apply(D.toTrailerConfig(state, view));
    writeHash(state);
  }

  // ---------------------------------------------------------------- camera follows the section in view
  let lastView: ViewName = 'front';
  function goView(v: ViewName) {
    if (v === lastView) return;
    lastView = v;
    stage.setView(v);
    $$('[data-view-btn]').forEach((b) => press(b, b.dataset.viewBtn === v));
  }
  const rail = $('#rail');
  const narrow = window.matchMedia('(max-width: 900px)');
  const io = new IntersectionObserver(
    (entries) => {
      if (step !== 'build') return;
      const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (hit) goView((hit.target as HTMLElement).dataset.view as ViewName);
    },
    { root: narrow.matches ? null : rail, rootMargin: narrow.matches ? '-55% 0px -30% 0px' : '-35% 0px -45% 0px', threshold: [0, 0.25, 0.5] },
  );
  $$('[data-step="build"] [data-view]').forEach((s) => io.observe(s));

  // ---------------------------------------------------------------- events
  document.addEventListener('click', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('button');
    if (!el || (el as HTMLButtonElement).disabled) return;
    const d = el.dataset;
    if (d.length) { state.length = Number(d.length); stage.setView(lastView); }
    else if (d.battery) state.battery = Number(d.battery);
    else if (d.panels) state.roofPanels += Number(d.panels);
    else if (d.toggle === 'wing') { state.wing = !state.wing; view.wingOpen = state.wing; if (state.wing) goView('street'); }
    else if (d.toggle === 'brand') {
      state.brandOn = !state.brandOn;
      if (state.brandOn) goView('street');
    }
    else if (d.paint) state.paint = d.paint;
    else if (d.trim) state.trim = d.trim as D.BuildState['trim'];
    else if (d.equip) {
      toggle(state.equipment, d.equip);
      if (d.equip === 'mast' && state.equipment.includes('mast')) view.mastUp = true;
    }
    else if (d.inside) toggle(state.inside, d.inside);
    else if (d.tool) toggle(state.tools, d.tool);
    else if (d.delivery) state.delivery = d.delivery as D.BuildState['delivery'];
    else if (d.stageAction === 'mast') view.mastUp = !view.mastUp;
    else if (d.stageAction === 'wing') view.wingOpen = !view.wingOpen;
    else if (d.viewBtn) { lastView = '' as ViewName; goView(d.viewBtn as ViewName); return; }
    else return;
    render();
  });

  const brandInput = $<HTMLInputElement>('#brand-text');
  brandInput.value = state.brandText;
  let brandTimer = 0;
  brandInput.addEventListener('input', () => {
    state.brandText = brandInput.value;
    if (!state.brandOn && brandInput.value.trim()) state.brandOn = true;
    goView('street');
    clearTimeout(brandTimer);
    brandTimer = window.setTimeout(render, 250);
  });
  $<HTMLInputElement>('#zip').addEventListener('input', (e) => { state.zip = (e.target as HTMLInputElement).value.replace(/\D/g, ''); });

  // ---------------------------------------------------------------- steps
  const next = $<HTMLButtonElement>('#next');
  const back = $<HTMLButtonElement>('#back');
  const agree = $<HTMLInputElement>('#agree');
  agree.addEventListener('change', () => { if (step === 'review') next.disabled = !agree.checked; });

  function showStep(s: Step) {
    step = s;
    $$('[data-step]').forEach((el) => { el.hidden = el.dataset.step !== s; });
    const idx = STEPS.indexOf(s);
    $$('[data-step-tab]').forEach((el) => {
      const i = STEPS.indexOf(el.dataset.stepTab as Step);
      el.toggleAttribute('data-active', i === idx);
      el.toggleAttribute('data-done', i < idx);
    });
    next.textContent = NEXT_LABEL[s];
    next.disabled = s === 'review' && !agree.checked;
    back.hidden = s === 'build' || s === 'done';
    rail.scrollTo({ top: 0 });
    if (narrow.matches) window.scrollTo({ top: 0 });
    stage.setAutoRotate(s === 'review' || s === 'done');
    if (s !== 'build') goView(s === 'delivery' ? 'side' : 'front');
    render();
  }

  next.addEventListener('click', () => {
    if (step === 'details') {
      const name = $<HTMLInputElement>('#d-name').value.trim();
      const email = $<HTMLInputElement>('#d-email').value.trim();
      const ok = name.length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      $('#details-error').hidden = ok;
      if (!ok) return;
    }
    if (step === 'done') {
      Object.assign(state, structuredClone(D.DEFAULT_BUILD));
      agree.checked = false;
      $<HTMLFormElement>('#details').reset();
      brandInput.value = '';
      showStep('build');
      return;
    }
    if (step === 'review') setText('code', D.buildCode(state));
    showStep(STEPS[STEPS.indexOf(step) + 1]);
  });
  back.addEventListener('click', () => showStep(STEPS[Math.max(0, STEPS.indexOf(step) - 1)]));

  $('#share').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      notify('Link copied. Anyone with it sees this build.');
    } catch {
      notify('Copy the address bar to share this build.');
    }
  });

  showStep('build');
}

function toggle(list: string[], id: string) {
  const i = list.indexOf(id);
  if (i >= 0) list.splice(i, 1);
  else list.push(id);
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}
