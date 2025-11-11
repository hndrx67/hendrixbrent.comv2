// uma-musume-anim.js
// Staggered top-to-bottom reveal for banner and tier list rows
(function(){
  'use strict';

  function animateOnLoad(){
    const banner = document.querySelector('.tier-banner');
    if (banner) {
      banner.classList.add('reveal-seed');
      // Triggering reflow to restart animation when re-entering
      void banner.offsetWidth;
      banner.classList.add('reveal-on');
    }

    // Animate visible rows in order
    const rows = Array.from(document.querySelectorAll('.tierlist-table tbody tr'));
    rows.forEach((tr, idx) => {
      tr.classList.add('reveal-seed');
      // Force reflow per row to ensure animation kicks in after class is added
      void tr.offsetWidth;
      tr.classList.add('reveal-on');
      // Apply stagger using inline style to avoid limited class set
      tr.style.animationDelay = `${80 + idx * 45}ms`;
    });
  }

  // Re-animate when page content is (re)rendered by the tierlist script
  window.addEventListener('tierlist:rendered', animateOnLoad);
  // First load fallback
  window.addEventListener('DOMContentLoaded', animateOnLoad);
})();
