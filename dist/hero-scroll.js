(() => {
  'use strict';
  if (!document.body.classList.contains('hero-experiment')) return;
  const header = document.querySelector('header');
  const progress = header.querySelector('.reading-progress');
  const sections = ['about', 'projects', 'experience', 'contact'].map(id => document.getElementById(id)).filter(Boolean);
  const nav = [...header.querySelectorAll('nav a[href^="#"]')];
  const languages = [...document.querySelectorAll('[data-language]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const editorial = document.body.classList.contains('section-transitions');
  const transitionTargets = new Set(editorial ? document.querySelectorAll('[data-section-transition]') : []);
  const finishHandlers = new WeakMap();
  const pending = new Set();
  const registered = new WeakSet();
  let headerHeight = 0;
  let frame = 0;
  let observer;
  let current = 'top';

  function finishReveal(element) {
    element.classList.remove('scroll-reveal-enter');
    const handler = finishHandlers.get(element);
    if (handler) element.removeEventListener('animationend', handler);
    finishHandlers.delete(element);
  }
  function reveal(element, immediate = false) {
    if (immediate && transitionTargets.has(element)) finishReveal(element);
    if (!pending.delete(element)) return;
    observer?.unobserve(element);
    element.classList.remove('scroll-reveal-pending');
    if (!immediate && !reduced.matches) {
      element.classList.add('scroll-reveal-enter');
      if (transitionTargets.has(element)) {
        const finish = event => {
          // The heading's line and label finish before its title. Their bubbled
          // events must not cut the final 300 ms sequence short.
          if (element.getAttribute('data-section-transition') === 'career' && event.animationName !== 'transition-title-enter') return;
          finishReveal(element);
        };
        finishHandlers.set(element, finish);
        element.addEventListener('animationend', finish);
      } else {
        element.addEventListener('animationend', () => element.classList.remove('scroll-reveal-enter'), {once:true});
      }
    }
  }
  function revealWithin(target) {
    if (target === document.body || target === document.documentElement) return;
    for (const element of pending) {
      if (target.contains(element) || element.contains(target)) reveal(element, true);
    }
    for (const element of transitionTargets) {
      if (target.contains(element) || element.contains(target)) finishReveal(element);
    }
  }
  function revealHash() {
    const target = document.getElementById(location.hash.slice(1));
    if (target) revealWithin(target);
  }
  function register(element) {
    if (!element || registered.has(element)) return;
    registered.add(element);
    // Never hide content that has already entered the viewport or has focus.
    if (!observer || reduced.matches || element.getBoundingClientRect().top < innerHeight || element.contains(document.activeElement)) return;
    pending.add(element);
    element.classList.add('scroll-reveal-pending');
    observer.observe(element);
  }
  function registerCards() {
    document.querySelectorAll('#projectsGrid .project-card').forEach(register);
    revealHash();
    schedule();
  }
  function sectionInView() {
    const bottom = document.documentElement.scrollHeight - innerHeight;
    if (bottom > 0 && scrollY >= bottom - 2) return 'contact';
    let active = 'top';
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= headerHeight + 24) active = section.id;
    }
    return active;
  }
  function syncLanguages(section) {
    for (const link of languages) {
      const destination = new URL(link.href, location.origin);
      destination.search = location.search;
      destination.hash = section;
      link.href = destination.pathname + destination.search + destination.hash;
    }
  }
  function update() {
    frame = 0;
    const height = header.getBoundingClientRect().height;
    if (height !== headerHeight) {
      headerHeight = height;
      document.documentElement.style.scrollPaddingTop = `${height + 16}px`;
    }
    // A large wheel/touch jump can skip an observer's intersection entirely.
    for (const element of transitionTargets) {
      if (pending.has(element)) {
        const rect = element.getBoundingClientRect();
        if (rect.top + rect.height <= headerHeight) reveal(element, true);
      }
    }
    current = sectionInView();
    for (const link of nav) {
      if (link.hash === '#' + current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    const range = document.documentElement.scrollHeight - innerHeight;
    const fraction = range > 0 ? (scrollY >= range - 2 ? 1 : Math.min(1, Math.max(0, scrollY / range))) : 0;
    progress.style.transform = `scaleX(${fraction})`;
    syncLanguages(current);
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  if ('IntersectionObserver' in window && !reduced.matches) {
    try {
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting) reveal(entry.target);
      }, {rootMargin:'0px 0px -10% 0px', threshold:0});
    } catch { /* All content stays visible when observation is unavailable. */ }
  }
  // Heading blocks only; Contact's wrapper also contains body copy, so select its title.
  for (const section of sections) {
    if (editorial && (section.id === 'experience' || section.id === 'contact')) continue;
    const title = section.querySelector('h2');
    register(title.parentElement.querySelector('p') ? title : title.parentElement);
  }
  transitionTargets.forEach(register);
  const grid = document.getElementById('projectsGrid');
  if (grid && 'MutationObserver' in window) new MutationObserver(registerCards).observe(grid, {childList:true});
  registerCards();
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule, {passive:true});
  addEventListener('load', registerCards);
  addEventListener('pageshow', () => { revealHash(); schedule(); });
  addEventListener('hashchange', () => { revealHash(); schedule(); });
  document.addEventListener('load', schedule, true);
  document.addEventListener('toggle', schedule, true);
  document.addEventListener('focusin', event => revealWithin(event.target));
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor) return;
    const target = document.getElementById(anchor.hash.slice(1));
    if (target) revealWithin(target);
    // The browser handles scrolling, focus and history normally.
  });
  for (const link of languages) link.addEventListener('click', () => syncLanguages(sectionInView()));
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      for (const element of pending) reveal(element, true);
      document.querySelectorAll('.scroll-reveal-enter').forEach(finishReveal);
    }
  });
  if ('ResizeObserver' in window) {
    const resize = new ResizeObserver(schedule);
    resize.observe(header);
    resize.observe(document.body);
  }
  document.fonts?.ready.then(schedule);
  update();
})();
