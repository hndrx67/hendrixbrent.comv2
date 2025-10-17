// Mobile compatibility helpers for Anonymity
(function () {
  const doc = document;
  const root = doc.documentElement;

  // Detect touch/mobile and add classes for CSS hooks
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouch) {
    doc.documentElement.classList.add('touch');
    // Disable hover-only split animation on touch devices for better UX
    const noHoverStyle = doc.createElement('style');
    noHoverStyle.id = 'mh-no-hover-style';
    noHoverStyle.textContent = `
.touch .hero-pfp-wrap:hover .hero-pfp { opacity: 1 !important; }
.touch .hero-pfp-wrap:hover::before,
.touch .hero-pfp-wrap:hover::after { opacity: 0 !important; transform: none !important; }
`;
    doc.head.appendChild(noHoverStyle);
  }

  // iOS/Android viewport height unit fix: set --vh to 1% of innerHeight
  function setVhVar() {
    const vh = window.innerHeight * 0.01;
    doc.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  setVhVar();
  window.addEventListener('resize', setVhVar);
  window.addEventListener('orientationchange', setVhVar);

  // Keep a CSS var up to date for header height so layouts can align precisely
  function setHeaderHeightVar() {
    const header = doc.querySelector('.header');
    const h = header ? Math.round(header.getBoundingClientRect().height) : 56;
    root.style.setProperty('--header-h', `${h}px`);
  }
  setHeaderHeightVar();
  window.addEventListener('load', setHeaderHeightVar, { passive: true });
  window.addEventListener('resize', setHeaderHeightVar, { passive: true });
  window.addEventListener('orientationchange', setHeaderHeightVar, { passive: true });

  // Smooth anchor scrolling with sticky header offset
  function getHeaderOffset() {
    const header = doc.querySelector('.header');
    if (!header) return 0;
    const styles = getComputedStyle(header);
    const hidden = doc.documentElement.classList.contains('nav-hidden');
    // If header hidden, no offset; otherwise use its height + border
    return hidden ? 0 : header.getBoundingClientRect().height + parseFloat(styles.borderBottomWidth || '0');
  }

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function scrollToHash(hash) {
    const el = hash && doc.querySelector(hash);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const y = rect.top + window.scrollY - getHeaderOffset() - 8; // small margin
    window.scrollTo({ top: Math.max(0, y), behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }

  // Intercept in-page anchor clicks
  doc.addEventListener('click', (e) => {
    // Ignore clicks inside modals/overlays
    if (e.target.closest('.pdfv-overlay, .docu-modal-overlay')) return;
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname) return; // ignore external page anchors
    e.preventDefault();
    scrollToHash(url.hash);
    history.pushState(null, '', url.hash);
  });

  // If page loads with a hash, adjust scroll after paint
  if (location.hash) {
    requestAnimationFrame(() => scrollToHash(location.hash));
  }

  // ----------------------------------------------------------------------------
  // Mobile nav enhancer: collapses actions into a dropdown with a hamburger
  // ----------------------------------------------------------------------------

  let styleEl, menuBtn, menuPanel, originalActionsParent;
  let mobileSetup = false;

  function injectMobileStyles() {
    if (styleEl) return;
    styleEl = doc.createElement('style');
    styleEl.id = 'mh-mobile-style';
    styleEl.textContent = `
@media (max-width: 768px) {
  .header .brand { max-width: 55vw; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
  .header .actions { display: none !important; }
  .mh-menu-btn { display: inline-flex; align-items: center; justify-content: center; width: 38px; height: 34px; margin-left: 8px; border-radius: 8px; border: 1px solid color-mix(in oklab, var(--border, #1f2937) 70%, transparent); background: color-mix(in oklab, var(--surface, #101317) 55%, transparent); -webkit-backdrop-filter: blur(10px) saturate(140%); backdrop-filter: blur(10px) saturate(140%); color: var(--text, #e5e7eb); cursor: pointer; box-shadow: 0 6px 18px rgba(0,0,0,.25); }
  .mh-menu-btn .bar { display: block; width: 18px; height: 2px; background: currentColor; margin: 2px 0; border-radius: 1px; }
  .mh-menu { position: fixed; top: var(--header-h, 56px); left: 0; right: 0; z-index: 60; background: color-mix(in oklab, var(--surface, #101317) 78%, transparent); -webkit-backdrop-filter: blur(10px) saturate(140%); backdrop-filter: blur(10px) saturate(140%); border-bottom: 1px solid color-mix(in oklab, var(--border, #1f2937) 70%, transparent); transform: translateY(-8px); opacity: 0; pointer-events: none; transition: opacity .28s ease, transform .28s ease; }
  .mh-menu.open { transform: translateY(0); opacity: 1; pointer-events: auto; }
  .mh-menu .actions { display: flex !important; flex-direction: column; gap: 10px; padding: 12px 16px; }
  .mh-menu .actions .btn, .mh-menu .actions .link { width: 100%; display: inline-flex; justify-content: center; }
  .mh-scroll-lock, .mh-scroll-lock body { overflow: hidden !important; height: 100% !important; }
}
@media (min-width: 769px) { .mh-menu, .mh-menu-btn { display: none !important; } }
    `;
    doc.head.appendChild(styleEl);
  }

  function openMenu() {
    if (!menuPanel) return;
    menuPanel.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    root.classList.add('mh-scroll-lock');
  }
  function closeMenu() {
    if (!menuPanel) return;
    menuPanel.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    root.classList.remove('mh-scroll-lock');
  }
  function toggleMenu() {
    if (!menuPanel) return;
    if (menuPanel.classList.contains('open')) closeMenu(); else openMenu();
  }

  function setupMobileNav() {
    if (mobileSetup) return;
    const headerNav = doc.querySelector('.header .nav');
    const actions = headerNav && headerNav.querySelector('.actions');
    if (!headerNav || !actions) return;
    injectMobileStyles();

    // Create button
    menuBtn = doc.createElement('button');
    menuBtn.type = 'button';
    menuBtn.className = 'mh-menu-btn';
    menuBtn.setAttribute('aria-label', 'Open menu');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.innerHTML = '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';

    // Create panel and move actions into it
    menuPanel = doc.createElement('div');
    menuPanel.className = 'mh-menu';
    originalActionsParent = actions.parentElement;
    menuPanel.appendChild(actions);

    // Insert
    headerNav.appendChild(menuBtn);
    doc.body.appendChild(menuPanel);

    // Events
    menuBtn.addEventListener('click', toggleMenu);
    // Close on link click
    menuPanel.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (a) closeMenu();
    });
    // Close on Escape
    doc.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
    // Close on outside click
    doc.addEventListener('click', (e) => {
      if (!menuPanel.classList.contains('open')) return;
      const within = e.target === menuPanel || menuPanel.contains(e.target) || e.target === menuBtn || menuBtn.contains(e.target);
      if (!within) closeMenu();
    });

    // If a modal opens, close the mobile menu to avoid layered scroll locks
    function watchOverlays() {
      const closeIfOpen = () => { if (menuPanel.classList.contains('open')) closeMenu(); };
      const hook = (el) => {
        if (!el || el.__mhObserved) return; el.__mhObserved = true;
        new MutationObserver(() => { if (el.classList.contains('open')) closeIfOpen(); })
          .observe(el, { attributes: true, attributeFilter: ['class'] });
      };
      const tryHook = () => {
        hook(doc.getElementById('pdfv-overlay'));
        hook(doc.querySelector('.docu-modal-overlay'));
      };
      tryHook();
      new MutationObserver(tryHook).observe(doc.body, { childList: true, subtree: true });
    }
    watchOverlays();

    mobileSetup = true;
  }

  function teardownMobileNav() {
    if (!mobileSetup) return;
    // Move actions back
    const actions = menuPanel && menuPanel.querySelector('.actions');
    if (actions && originalActionsParent) originalActionsParent.appendChild(actions);
    // Remove panel and button
    if (menuPanel && menuPanel.parentElement) menuPanel.parentElement.removeChild(menuPanel);
    if (menuBtn && menuBtn.parentElement) menuBtn.parentElement.removeChild(menuBtn);
    root.classList.remove('mh-scroll-lock');
    menuPanel = null; menuBtn = null; originalActionsParent = null; mobileSetup = false;
    // Keep styles injected to avoid flicker; optional removal:
    // if (styleEl && styleEl.parentElement) styleEl.parentElement.removeChild(styleEl);
  }

  function updateResponsiveNav() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) setupMobileNav(); else teardownMobileNav();
  }

  // Run and listen
  updateResponsiveNav();
  window.addEventListener('resize', updateResponsiveNav, { passive: true });
  window.addEventListener('orientationchange', updateResponsiveNav, { passive: true });
})();
