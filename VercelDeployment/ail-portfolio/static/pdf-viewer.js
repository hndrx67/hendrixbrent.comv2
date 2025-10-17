(function(){
  const doc = document; if (doc.getElementById('pdfv-overlay')) return;

  // Create overlay once
  const overlay = doc.createElement('div');
  overlay.className = 'pdfv-overlay';
  overlay.id = 'pdfv-overlay';
  overlay.innerHTML = `
    <div class="pdfv-dialog" role="dialog" aria-modal="true" aria-labelledby="pdfv-title">
      <div class="pdfv-header">
        <div class="pdfv-title" id="pdfv-title">Document Viewer</div>
        <div class="pdfv-actions">
          <button class="pdfv-btn" id="pdfv-open-new" title="Open in new tab" aria-label="Open in new tab">↗</button>
          <button class="pdfv-btn" id="pdfv-close" title="Close" aria-label="Close">✕</button>
        </div>
      </div>
      <div class="pdfv-body">
        <div class="pdfv-loading" id="pdfv-loading" aria-hidden="true">
          <!-- Uiverse loader SVG -->
          <svg class="loader" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img">
            <g class="loader__model">
              <path class="loader__glare-top" d="M17.5 5.75c0 1.794.8 3.357 2.061 4.121 1.261.764 2.939.626 4.689-.788 1.75-1.414 3.108-3.61 3.61-5.992" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
              <path class="loader__glare-bottom" d="M17.5 5.75c0 1.794.8 3.357 2.061 4.121 1.261.764 2.939.626 4.689-.788 1.75-1.414 3.108-3.61 3.61-5.992" stroke="white" stroke-width="1.5" stroke-linecap="round" transform="matrix(1 0 0 -1 0 11.5)"/>
              <circle cx="26" cy="26" r="23.25" stroke="#2a2a2a" stroke-width="1.5"/>
              <circle class="loader__motion-thick" cx="26" cy="26" r="24.25" stroke="#202020" stroke-width="3" stroke-dasharray="153.94 153.94" stroke-linecap="round"/>
              <circle class="loader__motion-medium" cx="26" cy="26" r="24.25" stroke="white" stroke-width="2" stroke-dasharray="153.94 153.94" stroke-linecap="round"/>
              <circle class="loader__motion-thin" cx="26" cy="26" r="24.25" stroke="#353535" stroke-width="1" stroke-dasharray="153.94 153.94" stroke-linecap="round"/>
              <path class="loader__sand-drop" d="M26 18.5v15" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="1 107"/>
              <path class="loader__sand-fill" d="M20.5 32.5h11" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="55 55"/>
              <path class="loader__sand-grain-left" d="M23.5 29.5h5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="29 29"/>
              <path class="loader__sand-grain-right" d="M23.5 35.5h5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="27 27"/>
              <path class="loader__sand-line-left" d="M21.5 31.5h9" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="53 53"/>
              <path class="loader__sand-line-right" d="M22.5 33.5h7" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="14 24.5"/>
              <path class="loader__sand-mound-top" d="M26 18.5c0 2.5 0 5 0 7.5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
              <path class="loader__sand-mound-bottom" d="M14.5 31.5c0 3.314 5.148 6 11.5 6s11.5-2.686 11.5-6" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            </g>
          </svg>
        </div>
        <embed class="pdfv-embed" id="pdfv-embed" type="application/pdf" src="" />
      </div>
    </div>
  `;
  doc.body.appendChild(overlay);

  const embed = overlay.querySelector('#pdfv-embed');
  const title = overlay.querySelector('#pdfv-title');
  const loading = overlay.querySelector('#pdfv-loading');
  const btnClose = overlay.querySelector('#pdfv-close');
  const btnOpen = overlay.querySelector('#pdfv-open-new');

  function openPdf(url, name){
    if (!url) return;
    // If global page loader is being used, skip internal hourglass
    if (!window.__pdfViewerUseGlobalLoader) {
      if (loading) loading.classList.remove('hidden');
    }
    embed.src = url;
    title.textContent = name || 'Document Viewer';
    overlay.classList.add('open');
    try { doc.body.style.overflow = 'hidden'; } catch {}
  }
  function close(){
    overlay.classList.remove('open');
    try { doc.body.style.overflow = ''; } catch {}
    // Keep src set for faster reopen; clear if needed
  }

  // Hide loader when PDF signals load; fallback timeout as some browsers
  // may not fire load reliably on <embed>.
  embed.addEventListener('load', () => { if (loading) loading.classList.add('hidden'); });
  // Safety: hide after 3s if still visible
  function hideAfterDelay(){ setTimeout(() => { if (loading) loading.classList.add('hidden'); }, 3000); }
  hideAfterDelay();

  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  btnClose.addEventListener('click', close);
  btnOpen.addEventListener('click', () => { if (embed.src) window.open(embed.src, '_blank', 'noopener'); });
  doc.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  // Hook into expander 'View Document' buttons
  function wireViewButtons(){
    doc.querySelectorAll('.docuviewer .article-wrapper').forEach(card => {
      if (card.__pdfWired) return; card.__pdfWired = true;
      card.addEventListener('click', (e) => {
        const a = e.target.closest('.expander-view');
        if (!a) return; // let other clicks bubble
        e.preventDefault();
        const url = a.getAttribute('href');
        const titleEl = card.querySelector('.project-title');
        const name = titleEl ? titleEl.textContent.trim() : 'Document Viewer';
        openPdf(url, name);
      });
    });
  }

  function ready(fn){ if (doc.readyState !== 'loading') fn(); else doc.addEventListener('DOMContentLoaded', fn); }
  ready(wireViewButtons);
  // Also re-wire after a short delay in case cards are modified after DOMContentLoaded
  setTimeout(wireViewButtons, 500);

  // Expose a global opener for other components (e.g., docu card modal)
  window.__openPdfViewer = openPdf;
})();
