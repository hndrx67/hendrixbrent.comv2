// ww-navbar-hide.js - hide/show top navbar on scroll
(function(){
  'use strict';
  const root = document.documentElement;
  const scrollContainer = document.querySelector('.scroll-root') || window;
  let lastScroll = 0;
  let ticking = false;
  const HIDE_THRESHOLD = 12;
  const TOP_THRESHOLD = 24;
  function onScrollPos(scrollTop){
    const goingDown = scrollTop > lastScroll;
    const delta = Math.abs(scrollTop - lastScroll);
    if (scrollTop < TOP_THRESHOLD) {
      root.classList.remove('nav-hidden');
    } else if (goingDown && delta > HIDE_THRESHOLD) {
      root.classList.add('nav-hidden');
    } else if (!goingDown && delta > 2) {
      root.classList.remove('nav-hidden');
    }
    lastScroll = scrollTop;
  }
  function onScroll(){
    if (!ticking){
      requestAnimationFrame(()=>{
        const scrollTop = scrollContainer === window ? window.scrollY : scrollContainer.scrollTop;
        onScrollPos(scrollTop);
        ticking = false;
      });
      ticking = true;
    }
  }
  scrollContainer.addEventListener('scroll', onScroll, { passive: true });
})();