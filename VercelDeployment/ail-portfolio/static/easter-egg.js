(function(){
  const doc = document;
  const root = doc.documentElement;
  // Avoid duplicate insertion
  if (doc.getElementById('trash-egg-btn')) return;

  // Create trash button
  const btn = doc.createElement('button');
  btn.id = 'trash-egg-btn';
  btn.className = 'trash-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Toggle trash mode');
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 3h6a1 1 0 0 1 1 1v1h4v2h-1v12a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7H4V5h4V4a1 1 0 0 1 1-1Zm1 3h4V5h-4v1ZM7 7v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7H7Zm3 3h2v8h-2v-8Zm4 0h2v8h-2v-8Z"/>
    </svg>
  `;

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
