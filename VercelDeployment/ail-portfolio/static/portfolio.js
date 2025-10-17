// Anonymity page enhancements
(function () {
  const doc = document;
  doc.documentElement.classList.add('js');
  // If this page has a hero explore button, start in hero view; otherwise keep content view (e.g., news page)
  const hasExplore = !!doc.getElementById('explore-btn');
  if (hasExplore) {
    doc.documentElement.classList.remove('view-content');
  } else {
    doc.documentElement.classList.add('view-content');
  }

  // Set a CSS var for header height so the hero can fill the remaining viewport accurately
  function setHeaderVar() {
    const header = doc.querySelector('.header');
    const h = header ? Math.ceil(header.getBoundingClientRect().height) : 56;
    doc.documentElement.style.setProperty('--header-h', h + 'px');
  }
  setHeaderVar();
  window.addEventListener('resize', setHeaderVar, { passive: true });

  // Year injection
  const yearEl = doc.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Soft reveal on scroll
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    // immediate reveal as fallback
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
  }

  // Header hide on scroll down, show on scroll up; side-nav toggled accordingly
  let lastY = window.scrollY;
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const atTop = y < 12;
    const goingDown = y > lastY + 6; // threshold to reduce flicker
    const goingUp = y < lastY - 6;

    if (atTop || goingUp) {
      doc.documentElement.classList.remove('nav-hidden');
    } else if (goingDown) {
      doc.documentElement.classList.add('nav-hidden');
    }
    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (prefersReduced) return;
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  // Initialize state on load
  onScroll();

  // Explore / Back view toggle
  const exploreBtn = doc.getElementById('explore-btn');
  const backBtn = doc.getElementById('back-btn');
  const contentSections = doc.getElementById('content-sections');
  const titleEl = doc.querySelector('.title');

  function showContent(opts) {
    const fromHistory = !!(opts && opts.fromHistory);
    // Push a history state only when invoked by user (not when restoring via back/forward)
    if (!fromHistory) {
      try {
        // Keep URL unchanged; just push state
        history.pushState({ view: 'content' }, '');
      } catch {}
    }
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!contentSections) {
      doc.documentElement.classList.add('view-content');
      if (backBtn) backBtn.focus({ preventScroll: true });
      return;
    }
    contentSections.setAttribute('aria-hidden', 'false');
    if (prefersReduced) {
      doc.documentElement.classList.add('view-content');
      if (backBtn) backBtn.focus({ preventScroll: true });
      return;
    }
    // Start hero leaving, then reveal content
    const onEnd = () => {
      hero.removeEventListener('transitionend', onEnd);
      doc.documentElement.classList.add('view-content');
      if (backBtn) backBtn.focus({ preventScroll: true });
    };
    const hero = doc.querySelector('.hero');
    if (hero) {
      hero.classList.add('leaving');
      hero.addEventListener('transitionend', onEnd);
      // Safety timeout
      setTimeout(onEnd, 420);
      // force reflow
      hero.offsetHeight;
    } else {
      doc.documentElement.classList.add('view-content');
      if (backBtn) backBtn.focus({ preventScroll: true });
    }
  }

  function showHero() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hero = doc.querySelector('.hero');

    if (!contentSections) {
      doc.documentElement.classList.remove('view-content');
      if (exploreBtn) exploreBtn.focus({ preventScroll: true });
      return;
    }

    if (prefersReduced) {
      doc.documentElement.classList.remove('view-content');
      contentSections.setAttribute('aria-hidden', 'true');
      window.scrollTo({ top: 0, behavior: 'auto' });
      if (exploreBtn) exploreBtn.focus({ preventScroll: true });
      return;
    }

    // Prepare hero for entering
    if (hero) {
      hero.classList.remove('leaving', 'entering');
      hero.classList.add('pre-enter');
    }
    // Fade content out, then fade hero in (entering)
    contentSections.classList.add('leaving');
    const onContentEnd = (e) => {
      if (e && e.target !== contentSections) return;
      contentSections.removeEventListener('transitionend', onContentEnd);
      contentSections.classList.remove('leaving');
      // Remove content view first so hero becomes visible in layout
      doc.documentElement.classList.remove('view-content');
      contentSections.setAttribute('aria-hidden', 'true');
      // Scroll to top before animating hero in
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (hero) {
        // Force reflow then animate in
        hero.offsetHeight;
        hero.classList.remove('pre-enter');
        hero.classList.add('entering');
        const onHeroShown = () => {
          hero.removeEventListener('transitionend', onHeroShown);
          hero.classList.remove('entering');
          if (exploreBtn) exploreBtn.focus({ preventScroll: true });
        };
        hero.addEventListener('transitionend', onHeroShown);
        setTimeout(onHeroShown, 420);
      } else if (exploreBtn) {
        exploreBtn.focus({ preventScroll: true });
      }
    };
    contentSections.addEventListener('transitionend', onContentEnd);
    setTimeout(onContentEnd, 420);
    // force reflow so leaving transition applies immediately
    contentSections.offsetHeight;
  }

  if (exploreBtn) exploreBtn.addEventListener('click', showContent);
  if (backBtn) backBtn.addEventListener('click', (e) => {
    // Prefer popping history so browser Back behaves consistently
    try {
      if (history.state && history.state.view === 'content') {
        e.preventDefault();
        history.back();
        return;
      }
    } catch {}
    showHero();
  });

  // History state management: ensure initial state is 'hero' for reliable back behavior
  try {
    if (!history.state || history.state.view !== 'hero') {
      history.replaceState({ view: 'hero' }, '');
    }
  } catch {}

  // Handle browser back/forward to toggle between hero and content
  window.addEventListener('popstate', (e) => {
    const st = e.state;
    if (st && st.view === 'content') {
      // Show content without pushing a new state
      showContent({ fromHistory: true });
    } else {
      // Any other/initial state -> hero
      showHero();
    }
  });
  
  // Dock-like hover effect on the hero title
  (function initDockTitle() {
    const title = titleEl;
    if (!title) return;
    const original = title.textContent || '';
    if (!original.trim()) return;
    // Avoid double-initializing
    if (title.dataset.dockReady === '1') return;
    title.dataset.dockReady = '1';

    // Split into characters, preserving spaces with special spans
    const frag = doc.createDocumentFragment();
    for (const ch of original) {
      if (ch === ' ') {
        const sp = doc.createElement('span');
        sp.className = 'char-space';
        sp.textContent = ' ';
        frag.appendChild(sp);
        continue;
      }
      const span = doc.createElement('span');
      span.className = 'char';
      span.textContent = ch;
      frag.appendChild(span);
    }
    title.textContent = '';
    title.appendChild(frag);
    title.classList.add('dockified');

    const chars = Array.from(title.querySelectorAll('.char'));
    if (!chars.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const MAX_SCALE = 1.6; // peak scale at cursor
    const RADIUS = 80; // px influence radius

    let raf = 0;
    let lastX = 0, lastY = 0, inside = false;

    function update() {
      raf = 0;
      // Compute influence based on proximity to each char center
      chars.forEach(ch => {
        const rect = ch.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = lastX - cx;
        const dy = lastY - cy;
        const dist = Math.hypot(dx, dy);
        let scale = 1;
        if (inside && dist < RADIUS) {
          // Smooth falloff: cosine ease
          const t = 1 - dist / RADIUS; // 1 at center -> 0 at edge
          const ease = 0.5 - 0.5 * Math.cos(Math.PI * t);
          scale = 1 + (MAX_SCALE - 1) * ease;
        }
        ch.style.transform = `translateZ(0) scale(${scale})`;
        ch.style.filter = scale > 1.01 ? 'brightness(1.1)' : 'none';
      });
    }

    function onMove(e) {
      if (prefersReduced) return;
      lastX = e.clientX;
      lastY = e.clientY;
      inside = true;
      if (!raf) raf = requestAnimationFrame(update);
    }
    function onLeave() {
      inside = false;
      // Reset smoothly
      chars.forEach(ch => { ch.style.transform = 'translateZ(0) scale(1)'; ch.style.filter = 'none'; });
    }

    title.addEventListener('mousemove', onMove, { passive: true });
    title.addEventListener('mouseleave', onLeave, { passive: true });
  })();
})();
