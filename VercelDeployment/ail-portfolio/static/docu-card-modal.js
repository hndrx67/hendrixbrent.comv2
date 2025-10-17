// Docu Card Modal: replaces inline expander. Mirrors expander style but larger.
(function(){
  const state = {
    overlay: null,
    titleEl: null,
    mediaEl: null,
    descEl: null,
    viewBtn: null,
    dlBtn: null,
    closeBtn: null,
  };

  function ensureModal(){
    if(state.overlay) return state.overlay;
    const overlay = document.createElement('div');
    overlay.className = 'docu-modal-overlay';
    overlay.setAttribute('data-no-loader', 'true');

    overlay.innerHTML = `
      <div class="docu-modal" role="dialog" aria-modal="true" aria-labelledby="docu-modal-title">
        <div class="docu-modal-header">
          <div class="docu-modal-title" id="docu-modal-title"></div>
          <button class="docu-modal-close" aria-label="Close">✕</button>
        </div>
        <div class="docu-modal-body">
          <div class="docu-modal-media" id="docu-modal-media"></div>
          <div class="docu-modal-info">
            <div class="docu-modal-desc" id="docu-modal-desc"></div>
            <div class="docu-modal-actions">
              <button class="docu-modal-view">View Document</button>
              <a class="docu-modal-download" target="_blank" rel="noopener">Download Document</a>
            </div>
          </div>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    state.overlay = overlay;
    state.titleEl = overlay.querySelector('#docu-modal-title');
    state.mediaEl = overlay.querySelector('#docu-modal-media');
    state.descEl = overlay.querySelector('#docu-modal-desc');
    state.viewBtn = overlay.querySelector('.docu-modal-view');
    state.dlBtn = overlay.querySelector('.docu-modal-download');
    state.closeBtn = overlay.querySelector('.docu-modal-close');

    // Close handlers
    overlay.addEventListener('click', (e)=>{
      if(e.target === overlay) close();
    });
    state.closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', (e)=>{
      if(!overlay.classList.contains('open')) return;
      if(e.key === 'Escape') close();
    });

    // Prevent loader interception when clicking the modal buttons
    overlay.querySelectorAll('button, a').forEach(el=>{
      el.setAttribute('data-no-loader','true');
    });

    // Wire actions
    state.viewBtn.addEventListener('click', (e)=>{
      e.preventDefault();
      e.stopPropagation();
      overlay.classList.remove('open');
      // Slight delay so fade-out finishes before opening viewer
      setTimeout(()=>{
        if(window.__openPdfViewer && state.dlBtn?.href){
          window.__openPdfViewer(state.dlBtn.href);
        } else if(state.dlBtn?.href){
          window.open(state.dlBtn.href, '_blank', 'noopener');
        }
      }, 150);
    });

    return overlay;
  }

  function isValidHref(href){
    if(!href) return false;
    if(href === '#' || href.trim() === '') return false;
    if(/^javascript:/i.test(href)) return false;
    return true;
  }

  function openFromCard(card){
    const overlay = ensureModal();
    // Pull from card dataset or child elements
    const title = card.getAttribute('data-title') 
      || card.querySelector('.project-title')?.textContent?.trim()
      || card.querySelector('.title')?.textContent?.trim() 
      || 'Document';
    const preview = card.getAttribute('data-preview') || card.querySelector('img')?.src || '';
    const desc = card.getAttribute('data-desc') || card.querySelector('.description')?.textContent?.trim() || '';
    const href = card.getAttribute('data-view') || card.getAttribute('data-download') || card.querySelector('a[href$=".pdf"]')?.href || '#';

    state.titleEl.textContent = title;
    state.mediaEl.style.backgroundImage = preview ? `url('${preview}')` : 'none';
    state.descEl.textContent = desc || 'No description available.';
    const ok = isValidHref(href);
    if (ok) {
      state.dlBtn.href = href;
      state.dlBtn.removeAttribute('aria-disabled');
      state.dlBtn.classList.remove('is-disabled');
      state.viewBtn.disabled = false;
    } else {
      state.dlBtn.removeAttribute('href');
      state.dlBtn.setAttribute('aria-disabled', 'true');
      state.dlBtn.classList.add('is-disabled');
      state.viewBtn.disabled = true;
    }

    overlay.classList.add('open');
    try { document.body.style.overflow = 'hidden'; } catch {}
  }

  function close(){
    if(state.overlay) state.overlay.classList.remove('open');
    try { document.body.style.overflow = ''; } catch {}
  }

  function bind(){
    // Replace expander behavior: clicking any .article-wrapper (or specific button) opens modal
    const cards = document.querySelectorAll('.article-wrapper');
    cards.forEach(card=>{
      // Avoid double-binding
      if(card.__docuModalBound) return; card.__docuModalBound = true;

      // Prefer explicit button if present
      const openBtn = card.querySelector('.docu-open-modal, .content-overlay button.view, .open-expander');
      const clickTarget = openBtn || card;

      clickTarget.addEventListener('click', (e)=>{
        // Ignore if clicking links that should navigate or buttons that have other handlers
        const t = e.target;
        if(t.closest('a')) return; // let anchors handle themselves
        if(t.closest('[data-no-modal]')) return; // opt-out
        e.preventDefault();
        e.stopPropagation();
        openFromCard(card);
      });
    });
  }

  function init(){
    ensureModal();
    bind();
    // Re-bind on DOM mutations if needed (simple interval-based safeguard)
    let lastCount = 0;
    setInterval(()=>{
      const count = document.querySelectorAll('.article-wrapper').length;
      if(count !== lastCount){ lastCount = count; bind(); }
    }, 1500);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
