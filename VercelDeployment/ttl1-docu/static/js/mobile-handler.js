(function(){
  // Simple debounce
  function debounce(fn, wait){
    let t; return function(){ clearTimeout(t); t = setTimeout(fn, wait); };
  }

  // 1. Mobile 100vh fix: set --vh to real viewport height units
  function setViewportUnit(){
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
  }

  // 2. Apply compact layout tweaks for narrow screens
  function applyMobileTweaks(){
    const width = Math.min(window.innerWidth, document.documentElement.clientWidth || window.innerWidth);
    const isCompact = width <= 480;
    document.documentElement.classList.toggle('mobile-compact', isCompact);

    // Make navbar and hero actions wrap to avoid overflow
    const navInner = document.querySelector('.nav-inner');
    if (navInner) navInner.style.flexWrap = isCompact ? 'wrap' : '';
    const heroActions = document.querySelector('.hero-actions');
    if (heroActions) heroActions.style.flexWrap = isCompact ? 'wrap' : '';

    // Reduce .box padding slightly for very small screens
    document.querySelectorAll('.box').forEach(el => {
      el.style.padding = isCompact ? '16px 16px' : '';
    });

    // Gallery: adjust columns and thumb height to prevent squishing
    const grid = document.getElementById('galleryGrid');
    if (grid){
      grid.style.gridTemplateColumns = isCompact
        ? 'repeat(auto-fill, minmax(140px, 1fr))'
        : '';
      grid.querySelectorAll('.thumb').forEach(t => {
        t.style.height = isCompact ? '140px' : '';
        t.style.objectFit = 'cover';
      });
    }

    // Reflections post avatars: slightly smaller on compact
    document.querySelectorAll('.post-avatar').forEach(img => {
      img.style.width = isCompact ? '40px' : '';
      img.style.height = isCompact ? '40px' : '';
    });
  }

  // 3. Avoid address-bar jumps on orientation/resize
  const onResize = debounce(function(){ setViewportUnit(); applyMobileTweaks(); }, 100);

  // Initialize
  setViewportUnit();
  applyMobileTweaks();

  // Listeners
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('orientationchange', function(){
    setTimeout(function(){ setViewportUnit(); applyMobileTweaks(); }, 50);
  });
})();
