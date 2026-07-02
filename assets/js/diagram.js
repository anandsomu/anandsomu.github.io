// Interactive vertical-flow diagrams: detail-on-focus.
// Each `.vnode` carries its detail in the DOM (`.vdetail`). We toggle `.open`
// on hover/focus/click/keyboard so the reader can drill into any "system in
// focus". Content stays in the DOM for no-JS / screen-readers; we merely
// collapse it visually via CSS grid-rows. Respects reduced-motion (CSS handles
// the no-transition case; behaviour is identical).
import { $$, reduceMotion, hasIO } from './util.js';

function wireNode(node) {
  const detail = node.querySelector('.vdetail');
  if (!detail) return; // node with no extra detail — nothing to toggle

  node.setAttribute('tabindex', '0');
  node.setAttribute('role', 'button');
  node.setAttribute('aria-expanded', 'false');
  const more = node.querySelector('.more');
  if (more) more.setAttribute('aria-hidden', 'true');

  const open = () => {
    node.classList.add('open');
    node.setAttribute('aria-expanded', 'true');
  };
  const close = () => {
    node.classList.remove('open');
    node.setAttribute('aria-expanded', 'false');
  };
  const toggle = () => (node.classList.contains('open') ? close() : open());

  // hover = peek (pointer devices only), click = pin, so a reader can hover to
  // preview and click to keep it open while reading.
  node.addEventListener('mouseenter', () => {
    if (!node.dataset.pinned) open();
  });
  node.addEventListener('mouseleave', () => {
    if (!node.dataset.pinned) close();
  });
  node.addEventListener('click', () => {
    if (node.dataset.pinned) {
      delete node.dataset.pinned;
      close();
    } else {
      node.dataset.pinned = '1';
      open();
    }
  });
  node.addEventListener('focus', open);
  node.addEventListener('blur', () => {
    if (!node.dataset.pinned) close();
  });
  node.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (node.dataset.pinned) delete node.dataset.pinned;
      else node.dataset.pinned = '1';
      toggle();
    }
    if (e.key === 'Escape') {
      delete node.dataset.pinned;
      close();
    }
  });
}

// Cascade vertical-flow nodes in as their diagram scrolls into view.
function wireCascade() {
  const flows = $$('.vflow, .devsplit');
  flows.forEach((f) => {
    f.classList.add('flow-anim');
    let i = 0;
    for (const kid of f.children) kid.style.setProperty('--i', i++);
  });
  if (reduceMotion || !hasIO) {
    flows.forEach((f) => f.classList.add('flow-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('flow-in');
          obs.unobserve(e.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
  );
  flows.forEach((f) => io.observe(f));
}

// Grow the before/after metric bars once on first view.
function wireCharts() {
  const charts = $$('.chart-svg');
  charts.forEach((c) => c.classList.add('grow'));
  if (reduceMotion || !hasIO) {
    charts.forEach((c) => c.classList.add('in-view'));
    return;
  }
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  charts.forEach((c) => io.observe(c));
}

export function initDiagrams() {
  $$('.vnode').forEach(wireNode);
  wireCascade();
  wireCharts();
}
