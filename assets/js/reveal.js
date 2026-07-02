// Reveal-on-scroll — opacity/transform only; content is always in the DOM.
import { $$, reduceMotion, hasIO } from './util.js';

export function initReveal() {
  const revs = $$('.reveal');
  if (reduceMotion || !hasIO) {
    revs.forEach((r) => r.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );
  revs.forEach((r) => io.observe(r));
}
