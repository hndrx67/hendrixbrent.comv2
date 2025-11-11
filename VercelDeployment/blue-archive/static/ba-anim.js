// ba-anim.js - Staggered reveal for Blue Archive tier list (copied from uma-musume-anim.js)
(function(){
  'use strict';

  function animateOnLoad(){
    const banner = document.querySelector('.tier-banner');
    if (banner) {
      banner.classList.add('reveal-seed');
      void banner.offsetWidth;
      banner.classList.add('reveal-on');
    }

    const rows = Array.from(document.querySelectorAll('.tierlist-table tbody tr'));
    rows.forEach((tr, idx) => {
      tr.classList.add('reveal-seed');
      void tr.offsetWidth;
      tr.classList.add('reveal-on');
      tr.style.animationDelay = `${80 + idx * 45}ms`;
    });
  }

  window.addEventListener('tierlist:rendered', animateOnLoad);
  window.addEventListener('DOMContentLoaded', animateOnLoad);
})();