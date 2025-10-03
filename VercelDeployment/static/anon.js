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

  function showContent() {
    doc.documentElement.classList.add('view-content');
    if (contentSections) contentSections.setAttribute('aria-hidden', 'false');
    // Move focus for a11y
    if (backBtn) backBtn.focus({ preventScroll: true });
  }

  function showHero() {
    doc.documentElement.classList.remove('view-content');
    if (contentSections) contentSections.setAttribute('aria-hidden', 'true');
    if (exploreBtn) exploreBtn.focus({ preventScroll: true });
    // Scroll to top for a clean hero view
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  }

  if (exploreBtn) exploreBtn.addEventListener('click', showContent);
  if (backBtn) backBtn.addEventListener('click', showHero);
})();
