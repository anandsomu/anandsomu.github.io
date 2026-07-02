// Highlight the nav link for the section currently in view.
import { $$, hasIO } from './util.js';

export function initScrollSpy() {
  const links = $$('.nav a[data-spy]');
  if (!links.length || !hasIO) return;
  const byId = {};
  links.forEach((a) => (byId[a.getAttribute('data-spy')] = a));
  const sections = links
    .map((a) => document.getElementById(a.getAttribute('data-spy')))
    .filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((l) => l.classList.remove('active'));
          if (byId[e.target.id]) byId[e.target.id].classList.add('active');
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );
  sections.forEach((s) => spy.observe(s));
}
