// Mobile compatibility helpers for Anonymity
(function () {
  const doc = document;

  // Detect touch/mobile and add classes for CSS hooks
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouch) {
    doc.documentElement.classList.add('touch');
  }

  // iOS/Android viewport height unit fix: set --vh to 1% of innerHeight
  function setVhVar() {
    const vh = window.innerHeight * 0.01;
    doc.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  setVhVar();
  window.addEventListener('resize', setVhVar);
  window.addEventListener('orientationchange', setVhVar);

  // Smooth anchor scrolling with sticky header offset
  function getHeaderOffset() {
    const header = doc.querySelector('.header');
    if (!header) return 0;
    const styles = getComputedStyle(header);
    const hidden = doc.documentElement.classList.contains('nav-hidden');
    // If header hidden, no offset; otherwise use its height + border
    return hidden ? 0 : header.getBoundingClientRect().height + parseFloat(styles.borderBottomWidth || '0');
  }

  function scrollToHash(hash) {
    const el = hash && doc.querySelector(hash);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const y = rect.top + window.scrollY - getHeaderOffset() - 8; // small margin
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  }

  // Intercept in-page anchor clicks
  doc.addEventListener('click', (e) => {
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
})();
