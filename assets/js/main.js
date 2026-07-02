// Entry point. Loaded as <script type="module" defer> so it never blocks first
// paint. All behaviour is self-contained (no external hosts — CSP blocks CDNs).
import { initScrollSpy } from './scroll-spy.js';
import { initReveal } from './reveal.js';
import { initCounters } from './counters.js';
import { initDiagrams } from './diagram.js';

// swap the no-js sentinel so CSS knows JS is live (progressive enhancement:
// without this, every diagram detail stays expanded and readable).
document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js');

function boot() {
  initScrollSpy();
  initReveal();
  initCounters();
  initDiagrams();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
