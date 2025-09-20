
(function hideScrollbarsButAllowScroll() {
  try {
    var style = document.createElement('style');
    style.setAttribute('data-injected', 'hide-scrollbars');
    style.textContent = [
      '/* Hide scrollbar for Chrome, Safari and Opera */',
      'html::-webkit-scrollbar { width: 0px; height: 0px; }',
      'body::-webkit-scrollbar { width: 0px; height: 0px; }',
      '/* Hide scrollbar for Firefox */',
      'html, body { scrollbar-width: none; -ms-overflow-style: none; }',
      '/* Ensure thumbs/tracks don\'t show if forced by extensions */',
      'html::-webkit-scrollbar-thumb, body::-webkit-scrollbar-thumb { background: transparent; }'
    ].join('\n');
    (document.head || document.documentElement).appendChild(style);
  } catch (e) {
    // wtf fail
  }
})();

setTimeout(function() {
    window.location.href = "simple-maint.html"; // url
  }, 10); // Delay in milliseconds (ex 5000ms = 5 seconds)