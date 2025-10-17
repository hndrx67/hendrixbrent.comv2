(function(){
  const SELECTOR_CARD = '.docuviewer .article-wrapper';
  const BODY_LOCK_CLASS = 'modal-open';
  let overlayEl, titleEl, metaEl, descEl, imgEl, dlnkEl, closeBtn;

  function ensureModal() {
    if (overlayEl) return overlayEl;
    overlayEl = document.createElement('div');
    overlayEl.className = 'docu-modal-overlay';
    overlayEl.setAttribute('role', 'dialog');
    overlayEl.setAttribute('aria-modal', 'true');
    overlayEl.innerHTML = `
      <div class="docu-modal">
        <div class="docu-modal-media">
          <img alt="Document preview" />
        </div>
        <div class="docu-modal-body">
          <div class="docu-modal-title"></div>
          <div class="docu-modal-meta"></div>
          <div class="docu-modal-desc"></div>
          <div class="docu-modal-actions">
            <a class="docu-modal-download" target="_blank" rel="noopener" href="#">Download</a>
          </div>
        </div>
        <button class="docu-modal-close" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    `;
    document.body.appendChild(overlayEl);

    titleEl = overlayEl.querySelector('.docu-modal-title');
    metaEl = overlayEl.querySelector('.docu-modal-meta');
    descEl = overlayEl.querySelector('.docu-modal-desc');
    imgEl = overlayEl.querySelector('img');
    dlnkEl = overlayEl.querySelector('.docu-modal-download');
    closeBtn = overlayEl.querySelector('.docu-modal-close');

    // Close interactions
    overlayEl.addEventListener('click', (e) => {
      if (e.target === overlayEl) close();
    });
    closeBtn.addEventListener('click', close);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlayEl.classList.contains('open')) close();
    });

    return overlayEl;
  }

  function open(data){
    ensureModal();
    titleEl.textContent = data.title || 'Untitled Document';
    metaEl.textContent = data.meta || '';
    descEl.textContent = data.desc || '';
    const placeholder = './static/images/doc-placeholder.svg';
    imgEl.src = data.preview || placeholder;
    imgEl.alt = data.title ? `Preview of ${data.title}` : 'Document preview';
    if (data.download) {
      dlnkEl.href = data.download;
      dlnkEl.removeAttribute('aria-disabled');
    } else {
      dlnkEl.href = '#';
      dlnkEl.setAttribute('aria-disabled', 'true');
    }

    overlayEl.classList.add('open');
    document.documentElement.classList.add(BODY_LOCK_CLASS);
    document.body.style.overflow = 'hidden';
    // focus close for a11y
    setTimeout(()=> closeBtn.focus(), 0);
  }

  function close(){
    if (!overlayEl) return;
    overlayEl.classList.remove('open');
    document.documentElement.classList.remove(BODY_LOCK_CLASS);
    document.body.style.overflow = '';
  }

  function cardData(card){
    const title = card.querySelector('.project-title')?.textContent?.trim();
    const types = Array.from(card.querySelectorAll('.types .project-type')).map(s=>s.textContent.trim()).join(' ');
    const meta = types || card.dataset.meta || '';
    return {
      title,
      meta,
      desc: card.dataset.desc || 'No description provided.',
      preview: card.dataset.preview,
      download: card.dataset.download
    };
  }

  function bind(){
    const cards = document.querySelectorAll(SELECTOR_CARD);
    if (!cards.length) return;
    cards.forEach(card => {
      // Avoid double-binding
      if (card.__dmBound) return;
      card.__dmBound = true;
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        // Allow inner links to function normally
        const a = e.target.closest('a');
        if (a) return;
        open(cardData(card));
      });
    });
  }

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
