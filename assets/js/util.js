// Shared tiny helpers. No dependencies.
export const reduceMotion =
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const hasIO = 'IntersectionObserver' in window;

export const $$ = (sel, root = document) =>
  Array.prototype.slice.call(root.querySelectorAll(sel));
