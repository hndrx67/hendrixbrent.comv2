// ww-tierlist.js - interactive logic for Wuthering Waves Tier List
(function(){
  'use strict';

  const perPage = 10;
  const tbody = document.getElementById('tierlist-body');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const pageIndicator = document.getElementById('page-indicator');
  const yearEls = document.querySelectorAll('[data-year]');

  // Example data: update with real Resonators and images
  const resonators = [
    { rank: 1, name: 'Jiyan', image: '', note: '', used: 120, trend: 'up' },
    { rank: 2, name: 'Verina', image: '', note: '', used: 110, trend: 'up' },
    { rank: 3, name: 'Calcharo', image: '', note: '', used: 100, trend: 'flat' },
    { rank: 4, name: 'Encore', image: '', note: '', used: 95, trend: 'flat' },
    { rank: 5, name: 'Lingyang', image: '', note: '', used: 90, trend: 'flat' },
    { rank: 6, name: 'Baizhi', image: '', note: '', used: 85, trend: 'down' },
    { rank: 7, name: 'Danjin', image: '', note: '', used: 80, trend: 'down' },
    { rank: 8, name: 'Chixia', image: '', note: '', used: 75, trend: 'down' },
    { rank: 9, name: 'Mortefi', image: '', note: '', used: 70, trend: 'down' },
    { rank: 10, name: 'Sanhua', image: '', note: '', used: 65, trend: 'down' },
    // Add more as needed
  ];

  let page = 1;
  const totalPages = Math.ceil(resonators.length / perPage);

  function updateYear(){
    const y = new Date().getFullYear();
    yearEls.forEach(el => el.textContent = y);
  }

  function setPaginationState(){
    pageIndicator.textContent = `Page ${page} / ${totalPages}`;
    prevBtn.disabled = page <= 1;
    nextBtn.disabled = page >= totalPages;
  }

  function clearBody(){
    while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
  }

  function renderRow(item){
    const tr = document.createElement('tr');
    const tdRank = document.createElement('td');
    const badge = document.createElement('span');
    badge.className = 'rank-badge';
    badge.textContent = item.rank;
    tdRank.appendChild(badge);
    const tdRes = document.createElement('td');
    tdRes.className = 'uma-cell';
    let avatarEl;
    if (item.image) {
      avatarEl = document.createElement('img');
      avatarEl.src = item.image;
      avatarEl.alt = item.name;
      avatarEl.className = 'uma-avatar';
    } else {
      avatarEl = document.createElement('div');
      avatarEl.className = 'uma-avatar';
    }
    const nameEl = document.createElement('span');
    nameEl.className = 'uma-name';
    nameEl.textContent = item.name;
    avatarEl.addEventListener('click', (e) => {
      avatarEl.classList.toggle('zoom');
    });
    avatarEl.addEventListener('mouseleave', () => {
      avatarEl.classList.remove('zoom');
    });
    tdRes.appendChild(avatarEl);
    tdRes.appendChild(nameEl);
    const tdNote = document.createElement('td');
    const note = document.createElement('span');
    note.className = 'note-dim';
    note.textContent = item.note || '—';
    tdNote.appendChild(note);
    const tdUsed = document.createElement('td');
    tdUsed.textContent = (typeof item.used === 'number') ? item.used.toString() : (typeof item.used === 'string' ? item.used : '—');
    const tdTrend = document.createElement('td');
    tdTrend.className = 'trend-cell';
    let trendChar = '–';
    let trendClass = 'trend-flat';
    if (item.trend === 'up') { trendChar = '▲'; trendClass = 'trend-up'; }
    else if (item.trend === 'down') { trendChar = '▼'; trendClass = 'trend-down'; }
    const spanTrend = document.createElement('span');
    spanTrend.className = `trend-icon ${trendClass}`;
    spanTrend.textContent = trendChar;
    const sr = document.createElement('span');
    sr.className = 'visually-hidden';
    sr.textContent = item.trend === 'up' ? 'Trending up' : item.trend === 'down' ? 'Trending down' : 'No change';
    tdTrend.appendChild(spanTrend);
    tdTrend.appendChild(sr);
    tr.appendChild(tdRank);
    tr.appendChild(tdRes);
    tr.appendChild(tdNote);
    tr.appendChild(tdUsed);
    tr.appendChild(tdTrend);
    tr.addEventListener('click', () => openModal(item));
    return tr;
  }

  function render(){
    clearBody();
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const slice = resonators.slice(start, end);
    slice.forEach(item => tbody.appendChild(renderRow(item)));
    setPaginationState();
    window.dispatchEvent(new CustomEvent('tierlist:rendered'));
  }

  prevBtn?.addEventListener('click', () => { if (page > 1) { page--; render(); }});
  nextBtn?.addEventListener('click', () => { if (page < totalPages) { page++; render(); }});

  updateYear();
  render();

  // Modal logic
  let backdrop;
  function ensureModalShell(){
    if(backdrop) return;
    backdrop = document.createElement('div');
    backdrop.className = 'uma-modal-backdrop';
    backdrop.innerHTML = '<div class="uma-modal" role="dialog" aria-modal="true" aria-labelledby="uma-modal-title">\n <button class="close-btn" type="button" aria-label="Close">Close</button>\n <figure class="modal-avatar-wrapper"><img class="modal-avatar" alt="Resonator avatar"></figure>\n <div class="modal-content">\n   <h2 id="uma-modal-title"></h2>\n   <div class="stat-grid"></div>\n   <p class="modal-note note-dim"></p>\n </div>\n</div>';
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', (e)=>{ if(e.target === backdrop) closeModal(); });
    backdrop.querySelector('.close-btn').addEventListener('click', closeModal);
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModal(); });
  }

  function openModal(item){
    ensureModalShell();
    const modal = backdrop.querySelector('.uma-modal');
    const avatar = modal.querySelector('.modal-avatar');
    const title = modal.querySelector('#uma-modal-title');
    const statGrid = modal.querySelector('.stat-grid');
    const noteEl = modal.querySelector('.modal-note');
    title.textContent = item.name;
    avatar.src = item.image || '';
    avatar.alt = item.name;
    noteEl.textContent = item.note || 'No notes provided.';
    statGrid.innerHTML = '';
    const stats = [
      { label: 'Rank', value: item.rank },
      { label: 'Times Used', value: (typeof item.used === 'number') ? item.used : (typeof item.used === 'string' ? item.used : '—') },
      { label: 'Trend', value: item.trend },
    ];
    stats.forEach(s => {
      const div = document.createElement('div');
      div.className = 'stat';
      div.innerHTML = `<strong>${s.label}</strong><span>${s.value}</span>`;
      statGrid.appendChild(div);
    });
    backdrop.classList.add('open');
    document.body.classList.add('no-scroll');
    modal.querySelector('.close-btn').focus();
  }

  function closeModal(){
    if(!backdrop) return;
    backdrop.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }
})();