/*
 * SimpMaintMobileHandler.js
 * Detects mobile view and optimizes layout for simple-maint page.
 */
(function () {
  const STATE = { applied: false };

  function isMobile() {
    try {
      return (
        window.matchMedia('(pointer: coarse), (max-width: 768px)').matches ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent || ''
        )
      );
    } catch (_) {
      return window.innerWidth <= 768; // safe fallback
    }
  }

  function debounce(fn, delay) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function applyMobileLayout() {
    const container = document.querySelector('.discord-and-flag');
    if (!container) return;

    const iframe = container.querySelector('iframe');
    const img = container.querySelector('img.flag-img');

    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';

    // 92vw with a practical upper cap to avoid extreme values
    const maxW = Math.min(Math.floor(window.innerWidth * 0.92), 600);

    if (img) {
      img.style.width = `${maxW}px`;
      img.style.height = 'auto';
    }

    if (iframe) {
      iframe.style.width = `${maxW}px`;
      iframe.style.height = `${maxW}px`; // keep widget square
      iframe.setAttribute('width', String(maxW));
      iframe.setAttribute('height', String(maxW));
    }

    STATE.applied = true;
  }

  function applyDesktopLayout() {
    const container = document.querySelector('.discord-and-flag');
    if (!container) return;

    const iframe = container.querySelector('iframe');
    const img = container.querySelector('img.flag-img');

    container.style.flexDirection = '';
    container.style.alignItems = '';

    if (img) {
      img.style.width = '';
      img.style.height = '';
    }

    if (iframe) {
      iframe.style.width = '';
      iframe.style.height = '';
      iframe.setAttribute('width', '350');
      iframe.setAttribute('height', '350');
    }

    STATE.applied = false;
  }

  function updateLayout() {
    if (isMobile()) {
      applyMobileLayout();
    } else {
      applyDesktopLayout();
    }
  }

  function init() {
    updateLayout();
    window.addEventListener('resize', debounce(updateLayout, 150));
    window.addEventListener('orientationchange', updateLayout);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
