(function(){
  const doc = document; if (doc.getElementById('page-loader')) return;
  const overlay = doc.createElement('div');
  overlay.className = 'page-loader';
  overlay.id = 'page-loader';
  overlay.innerHTML = `
    <div class="spinner" aria-hidden="true">
      <span></span><span></span><span></span><span></span>
      <span></span><span></span><span></span><span></span>
    </div>
  `;
  function ready(fn){ if (doc.readyState !== 'loading') fn(); else doc.addEventListener('DOMContentLoaded', fn); }
  ready(() => {
    doc.body.appendChild(overlay);

    function showForTwoSeconds(cb){
      try { overlay.classList.add('show'); } catch {}
      setTimeout(() => { overlay.classList.remove('show'); cb && cb(); }, 600);
    }

    // Hook into link navigations within the portfolio
    doc.addEventListener('click', (e) => {
      if (e.defaultPrevented) return; // respect other handlers (e.g., modal viewers)
  const a = e.target.closest('a'); if (!a) return;
  if (a.hasAttribute('data-no-loader')) return; // let modal triggers work
      const href = a.getAttribute('href'); if (!href) return;
  if (a.target === '_blank') return; // let new tabs bypass (e.g., Download)
      if (href.startsWith('#')) return;  // anchors bypass
      if (/^(mailto:|tel:|javascript:)/i.test(href)) return; // non-page navigations
      // Keep same-origin simple navigations
      e.preventDefault();
      showForTwoSeconds(() => { window.location.href = href; });
    });

    // Also expose a global helper for script-driven navigations
    window.__showPageLoaderThen = function(callback){ showForTwoSeconds(callback); };
  });
})();
