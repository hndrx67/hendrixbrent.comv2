// uma-tierlist.js - interactive logic for Uma Musume Tier List
(function(){
  'use strict';

  const perPage = 10; // Show 10 ranks per page
  const tbody = document.getElementById('tierlist-body');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const pageIndicator = document.getElementById('page-indicator');
  const yearEls = document.querySelectorAll('[data-year]');

  // Real data list (ranks 1..25). Image paths intentionally left blank for now —
  // set each `image` to a valid path later, e.g. "./static/img/umas/maruzensky.png".
  // Note: `gooned` supports number | string. Strings (e.g., '?', 'N/A') will be shown as-is.
const umas = [
  // Added trend property: 'up' | 'down' | 'flat'. Adjust as needed.
  { rank: 1,  name: 'Maruzensky',           image: './umas/mommymaruzenskyyyyy.jpg', note: '', gooned: 150, trend: 'up' },
  { rank: 2,  name: 'TM Opera O',           image: './umas/tm opera o-pfpf1.jpg', note: '', gooned: '?', trend: 'up' },
  { rank: 3,  name: 'Daiwa Scarlet',        image: './umas/daiwa-scarlet-wife.jpg', note: '', gooned: 20, trend: 'flat' },
  { rank: 4,  name: 'Kitasan Black',        image: './umas/KitasanBlackIcon1.jpg', note: '', gooned: 16, trend: 'flat' },
  { rank: 5,  name: 'Satono Diamond',       image: './umas/SatonoDiamond.jpg', note: '', gooned: 16, trend: 'flat' },
  { rank: 6,  name: 'Tokai Teio',           image: './umas/tokaiteiomybeloved1.jpg', note: '', gooned: 13, trend: 'flat' },
  { rank: 7,  name: 'Rice Shower',          image: './umas/riceshowermydaughter.jpg', note: '', gooned: 13, trend: 'flat' },
  { rank: 8,  name: 'Special Week',         image: './umas/specialweeksegs1.jpg', note: '', gooned: 12, trend: 'flat' },
  { rank: 9,  name: 'Oguri Cap',            image: './umas/oguricap1.jpg', note: '', gooned: -1, trend: 'flat' },
  { rank: 10, name: 'Mejiro McQueen',       image: './umas/mejiromcqueensegs1.jpg', note: '', gooned: 12, trend: 'flat' },
  { rank: 11, name: 'Symboli Rudolph',      image: './umas/SymboliRudolf.jpg', note: '', gooned: 11, trend: 'flat' },
  { rank: 12, name: 'Tamamo Cross',         image: './umas/', note: '', gooned: 11, trend: 'flat' },
  { rank: 13, name: 'Biwa Hayahide',        image: './umas/', note: '', gooned: 10, trend: 'flat' },
  { rank: 14, name: 'Mayano Top Gun',       image: './umas/', note: '', gooned: 10, trend: 'flat' },
  { rank: 15, name: 'Manhattan Café',       image: './umas/', note: '', gooned: 9, trend: 'flat' },
  { rank: 16, name: 'Agnes Tachyon',        image: './umas/', note: '', gooned: 8, trend: 'flat' },
  { rank: 17, name: 'Gold City',            image: './umas/', note: '', gooned: 7, trend: 'flat' },
  { rank: 18, name: 'Sweep Tosho',          image: './umas/', note: '', gooned: 7, trend: 'flat' },
  { rank: 19, name: 'Tosen Jordan',         image: './umas/', note: '', gooned: 7, trend: 'flat' },
  { rank: 20, name: 'Marvelous Sunday',     image: './umas/', note: '', gooned: 7, trend: 'flat' },
  { rank: 21, name: 'Meisho Doto',          image: './umas/', note: '', gooned: 7, trend: 'flat' },
  { rank: 22, name: 'Nice Nature',          image: './umas/', note: '', gooned: 6, trend: 'flat' },
  { rank: 23, name: 'Daitaku Helios',       image: './umas/', note: '', gooned: 6, trend: 'flat' },
  { rank: 24, name: 'Twin Turbo',           image: './umas/', note: '', gooned: 6, trend: 'flat' },
  { rank: 25, name: 'Matikanetannhauser',   image: './umas/', note: '', gooned: 6, trend: 'flat' },
  { rank: 26, name: 'Happy Meek',           image: './umas/', note: '', gooned: 1, trend: 'flat' },
];

  let page = 1;
  const totalPages = Math.ceil(umas.length / perPage);

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

    // Rank cell
    const tdRank = document.createElement('td');
    const badge = document.createElement('span');
    badge.className = 'rank-badge';
    badge.textContent = item.rank;
    tdRank.appendChild(badge);

    // Uma cell
    const tdUma = document.createElement('td');
    tdUma.className = 'uma-cell';

    let avatarEl;
    if (item.image) {
      // If you added a path, we'll render a real <img>
      avatarEl = document.createElement('img');
      avatarEl.src = item.image; // TODO: provide valid image path
      avatarEl.alt = item.name;
      avatarEl.className = 'uma-avatar';
    } else {
      // Placeholder blank square with dashed hint (styled in CSS)
      avatarEl = document.createElement('div');
      avatarEl.className = 'uma-avatar';
      // If you prefer to keep <img>, uncomment below and set a 1x1 data URI or placeholder path.
      // const img = document.createElement('img');
      // img.src = './static/img/placeholder.png'; // TODO: replace
      // img.alt = item.name;
      // img.className = 'uma-avatar';
      // avatarEl.appendChild(img);
    }

    const nameEl = document.createElement('span');
    nameEl.className = 'uma-name';
    nameEl.textContent = item.name;

    // Interaction: mobile press toggles zoom
    avatarEl.addEventListener('click', (e) => {
      // If it's an image or div, toggle zoom class (mobile friendly)
      avatarEl.classList.toggle('zoom');
    });
    // Optional: remove zoom when pointer leaves (desktop convenience)
    avatarEl.addEventListener('mouseleave', () => {
      avatarEl.classList.remove('zoom');
    });

    tdUma.appendChild(avatarEl);
    tdUma.appendChild(nameEl);

    // Notes cell
  const tdNote = document.createElement('td');
  const note = document.createElement('span');
  note.className = 'note-dim';
  note.textContent = item.note || '—';
  tdNote.appendChild(note);

  // Gooned count cell (4th column) — supports number or string
  const tdGooned = document.createElement('td');
  if (typeof item.gooned === 'number') {
    tdGooned.textContent = item.gooned.toString();
  } else if (typeof item.gooned === 'string') {
    tdGooned.textContent = item.gooned;
  } else {
    tdGooned.textContent = '—';
  }

  // Trend cell (5th column)
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
    tr.appendChild(tdUma);
    tr.appendChild(tdNote);
  tr.appendChild(tdGooned);
  tr.appendChild(tdTrend);

    // Row click opens modal
    tr.addEventListener('click', () => openModal(item));

    return tr;
  }

  function render(){
    clearBody();
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const slice = umas.slice(start, end);
    slice.forEach(item => tbody.appendChild(renderRow(item)));
    setPaginationState();
    // Dispatch event so animation script can hook into new rows
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
    backdrop.innerHTML = '<div class="uma-modal" role="dialog" aria-modal="true" aria-labelledby="uma-modal-title">\n <button class="close-btn" type="button" aria-label="Close">Close</button>\n <figure class="modal-avatar-wrapper"><img class="modal-avatar" alt="Uma avatar"></figure>\n <div class="modal-content">\n   <h2 id="uma-modal-title"></h2>\n   <div class="stat-grid"></div>\n   <p class="modal-note note-dim"></p>\n </div>\n</div>';
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

    // Populate
    title.textContent = item.name;
    avatar.src = item.image || ''; // If blank, could swap placeholder later
    avatar.alt = item.name;
    noteEl.textContent = item.note || 'No notes provided.';

    // Stats
    statGrid.innerHTML = '';
    const goonedDisplay = (typeof item.gooned === 'number') ? item.gooned : (typeof item.gooned === 'string') ? item.gooned : '—';
    const stats = [
      { label: 'Rank', value: item.rank },
      { label: 'Gooned', value: goonedDisplay },
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
