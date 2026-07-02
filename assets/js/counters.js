// Count-up hero stats, once, on first view. Tabular figures (CSS) keep width
// stable while animating. Reduced-motion → jump straight to the final value.
import { $$, reduceMotion, hasIO } from './util.js';

function animate(el) {
  const target = parseFloat(el.getAttribute('data-count'));
  const suffix = el.getAttribute('data-suffix') || '';
  const prefix = el.getAttribute('data-prefix') || '';
  if (reduceMotion) {
    el.innerHTML = prefix + target + suffix;
    return;
  }
  let start = null;
  const dur = 900;
  function frame(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = target < 5 ? Math.round(target * eased * 10) / 10 : Math.round(target * eased);
    el.innerHTML = prefix + val + suffix;
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

export function initCounters() {
  const nums = $$('.stat .num[data-count]');
  if (!hasIO || reduceMotion) {
    nums.forEach(animate);
    return;
  }
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animate(e.target);
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  nums.forEach((n) => io.observe(n));
}
