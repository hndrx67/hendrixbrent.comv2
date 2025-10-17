(function(){
  const SELECTOR_CARD = '.docuviewer .article-wrapper';
  const placeholder = './static/images/doc-placeholder.svg';

  function ensureExtra(card){
    if (card.querySelector('.expander-extra')) return;
    const extra = document.createElement('div');
    extra.className = 'expander-extra';

    // Details content (no explicit close button)
    extra.innerHTML = `
      <div class="expander-desc"></div>
      <div class="expander-actions">
        <a class="expander-view" href="#" role="button" data-no-loader="true">View Document</a>
        <a class="expander-download" href="#" target="_blank" rel="noopener">Download</a>
      </div>
    `;

    card.querySelector('.project-info')?.appendChild(extra);
  }

  function populate(card){
    // set preview image as background of container-project if provided
    const preview = card.dataset.preview || placeholder;
    const media = card.querySelector('.container-project');
    if (media && preview) media.style.backgroundImage = `url(${preview})`;

    // description and actions
    const descEl = card.querySelector('.expander-desc');
    const viewEl = card.querySelector('.expander-view');
    const dlnkEl = card.querySelector('.expander-download');
    if (descEl) descEl.textContent = card.dataset.desc || 'No description provided.';
    // Prefer explicit data-view, fallback to data-download
    const viewUrl = card.dataset.view || card.dataset.download || '';
    if (viewEl) {
      if (viewUrl) { viewEl.href = viewUrl; viewEl.removeAttribute('aria-disabled'); }
      else { viewEl.href = '#'; viewEl.setAttribute('aria-disabled','true'); }
    }
    if (dlnkEl) {
      const dl = card.dataset.download;
      if (dl) { dlnkEl.href = dl; dlnkEl.removeAttribute('aria-disabled'); }
      else { dlnkEl.href = '#'; dlnkEl.setAttribute('aria-disabled','true'); }
    }
  }

  function collapseAll(except){
    document.querySelectorAll(SELECTOR_CARD+'.expanded').forEach(c=>{
      if (c !== except) collapse(c);
    });
  }

  function expand(card){
    ensureExtra(card);
    populate(card);
    collapseAll(card);
    card.classList.add('expanded');
  }

  function collapse(card){
    card.classList.remove('expanded');
  }

  function bind(){
    document.querySelectorAll(SELECTOR_CARD).forEach(card=>{
      if (card.__expBound) return; card.__expBound = true;
      card.addEventListener('click', (e)=>{
        // ignore clicks on inner links/buttons
        if (e.target.closest('a,button')) return;
        if (card.classList.contains('expanded')) collapse(card);
        else expand(card);
      });
    });

    // click outside collapse
    document.addEventListener('click', (e)=>{
      if (!e.target.closest(SELECTOR_CARD)) collapseAll();
    });

  }


  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();
})();
