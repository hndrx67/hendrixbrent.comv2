(function(){
  const doc = document;
  const root = doc.documentElement;
  // Avoid duplicate insertion
  if (doc.getElementById('trash-egg-btn')) return;
/*
  // Create trash button
  const btn = doc.createElement('button');
  btn.id = 'trash-egg-btn';
  btn.className = 'trash-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Toggle trash mode');
  btn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
    </svg>
    <span>Trash</span>
  `;
*/
  // Insert after DOM ready
  function ready(fn){ if (doc.readyState !== 'loading') fn(); else doc.addEventListener('DOMContentLoaded', fn); }
  ready(() => {
    // Insert vortex overlay before the button so it sits below
    const overlay = doc.createElement('div');
    overlay.className = 'vortex-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    doc.body.appendChild(overlay);
    doc.body.appendChild(btn);
  });

  function toggleEgg(){
    const isActive = root.classList.toggle('egg-active');
    btn.classList.toggle('active', isActive);
    // When activating, ensure viewport is at top so shrink direction feels consistent
    if (isActive) {
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch {}
    }
  }

  btn.addEventListener('click', toggleEgg);
})();
