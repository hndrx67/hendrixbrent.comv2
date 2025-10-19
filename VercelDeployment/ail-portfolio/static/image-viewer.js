(function(){
  const doc = document; if (doc.getElementById('imgv-overlay')) return;
  const overlay = doc.createElement('div');
  overlay.className = 'imgv-overlay'; overlay.id = 'imgv-overlay';
  overlay.innerHTML = `
    <div class="imgv-dialog" role="dialog" aria-modal="true" aria-labelledby="imgv-title">
      <div class="imgv-header">
        <div class="imgv-title" id="imgv-title">Image Viewer</div>
        <div class="imgv-actions">
          <button class="imgv-btn" id="imgv-open-new" title="Open in new tab" aria-label="Open in new tab">↗</button>
          <button class="imgv-btn" id="imgv-close" title="Close" aria-label="Close">✕</button>
        </div>
      </div>
      <div class="imgv-body"><img id="imgv-img" alt="Image content" /></div>
      <div class="imgv-footer"><a class="imgv-download" id="imgv-download" target="_blank" rel="noopener"></a></div>
    </div>`;
  doc.body.appendChild(overlay);

  const img = overlay.querySelector('#imgv-img');
  const title = overlay.querySelector('#imgv-title');
  const btnClose = overlay.querySelector('#imgv-close');
  const btnOpen = overlay.querySelector('#imgv-open-new');
  const dl = overlay.querySelector('#imgv-download');

  function openImage(url, name){
    if(!url) return; img.src = url; dl.href = url; title.textContent = name || 'Image Viewer';
    overlay.classList.add('open'); try { doc.body.style.overflow = 'hidden'; } catch {}
  }
  function close(){ overlay.classList.remove('open'); try { doc.body.style.overflow = ''; } catch {} }

  overlay.addEventListener('click', (e)=>{ if(e.target === overlay) close(); });
  btnClose.addEventListener('click', close);
  btnOpen.addEventListener('click', ()=>{ if(img.src) window.open(img.src, '_blank', 'noopener'); });
  doc.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') close(); });

  window.__openImageViewer = openImage;
})();
