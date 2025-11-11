// ba-tierlist.js - interactive logic for Blue Archive Tier List (based on uma-tierlist.js)
(function(){
  'use strict';

  const perPage = 10; // Show 10 ranks per page
  const tbody = document.getElementById('tierlist-body');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const pageIndicator = document.getElementById('page-indicator');
  const yearEls = document.querySelectorAll('[data-year]');

  // Data list (example ranks 1..20). Image paths intentionally left blank for now —
  // For Blue Archive, set each `image` to a valid path later, e.g. "./ba/students/hibiki.png".
  // Note: `gooned` supports number | string | null. Use null to show a fast 0→10 loop animation,
  // a number to show a static count, or a string (e.g., '∞', 'N/A', 'Varies') to display text.
const students = [
    { rank: 1,  name: 'Kisaki Ryuuge',           image: './ba/kisakisegsuwogghhh.jpg', note: '', gooned: 247, trend: 'up' },
    { rank: 2,  name: 'Hikari Tachibana',            image: './ba/hikrai-uwogghhhh.jpg', note: '', gooned: 112, trend: 'up' },
    { rank: 3,  name: 'Nozomi Tachibana',               image: './ba/nozomi-uqoghghhh.jpg', note: '', gooned: 112, trend: 'up' },
    { rank: 4,  name: 'Rio Tsukatsuki',              image: './ba/riotsukatsuki-segs23234.jpg', note: '', gooned: 109, trend: 'flat' },
    // Example null gooned value to demonstrate counting animation feature.
    // Set gooned: null on any entry to display a fast looping 0→10 counter.
    { rank: 5,  name: 'Kirara Yozakura',              image: './ba/kirarasegsdasd.jpg', note: '', gooned: 'NO DATA YET', trend: 'up' },
    { rank: 6,  name: 'Kazusa Kyoyama',              image: './ba/kazusa123421.jpg', note: '', gooned: 'NO DATA YET', trend: 'up' },
    { rank: 7,  name: 'Kiryuu Kikyou',           image: './ba/Kiryuu kikyou.jpg', note: '', gooned: 'NO DATA YET', trend: 'up' },
    { rank: 8,  name: 'Tsubaki Kasuga',            image: './ba/Guide Tsubaki.jpg', note: '', gooned: 'NO DATA YET', trend: 'up' },
    { rank: 9,  name: 'Aru Rikuhachima',             image: './ba/aruuuu.jpg', note: '', gooned: 'NO DATA YET', trend: 'down' },
    { rank: 10, name: 'Ako Amau',             image: './ba/akoamau1.jpg', note: '', gooned: 'NO DATA YET', trend: 'down' },
    { rank: 11, name: 'Shun (small)',               image: './ba/', note: '', gooned: 'NO DATA YET', trend: 'down' },
    { rank: 12, name: 'Yuuka',              image: './ba/', note: '', gooned: 'NO DATA YET', trend: 'down' },
    { rank: 13, name: 'Saori',              image: './ba/', note: '', gooned: 'NO DATA YET', trend: 'down' },
    { rank: 14, name: 'Asuna',             image: './ba/', note: '', gooned: 'NO DATA YET', trend: 'down' },
    { rank: 15, name: 'Toki',            image: './ba/', note: '', gooned: 60, trend: 'up' },
    { rank: 16, name: 'Hanako',           image: './ba/', note: '', gooned: 'NO DATA YET', trend: 'down' },
    { rank: 17, name: 'Hina',            image: './ba/', note: '', gooned: 'NO DATA YET', trend: 'down' },
    { rank: 18, name: 'Suzumi',            image: './ba/', note: '', gooned: 'NO DATA YET', trend: 'down' },
    { rank: 19, name: 'Aris',              image: './ba/', note: '', gooned: 'NO DATA YET', trend: 'down' },
    { rank: 20, name: 'Miyako',           image: './ba/', note: '', gooned: 'NO DATA YET', trend: 'down' },
];

  let page = 1;
  const totalPages = Math.ceil(students.length / perPage);

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
    // Stop any active counting intervals before clearing rows
    activeCounters.forEach(id => clearInterval(id));
    activeCounters.length = 0;
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

    // Student cell
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
    }

    const nameEl = document.createElement('span');
    nameEl.className = 'uma-name';
    nameEl.textContent = item.name;

    // Interaction: mobile press toggles zoom
    avatarEl.addEventListener('click', (e) => {
      avatarEl.classList.toggle('zoom');
    });
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

    // Fav count cell (supports number | string | animated null)
    const tdGooned = document.createElement('td');
    if (item.gooned === null) {
      const animSpan = document.createElement('span');
      animSpan.className = 'count-anim';
      startCounting(animSpan); // starts 0→10 looping animation
      tdGooned.appendChild(animSpan);
    } else if (typeof item.gooned === 'string') {
      tdGooned.textContent = item.gooned;
    } else {
      tdGooned.textContent = (typeof item.gooned === 'number') ? item.gooned.toString() : '—';
    }

    // Trend cell
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

  // ===== Animated counting for null gooned values =====
  const activeCounters = []; // store interval IDs for cleanup
  function startCounting(el){
    let n = 0;
    // Fast cycle (0→10 then repeat). Adjust speed by changing interval ms.
    const id = setInterval(()=>{
      el.textContent = n.toString();
      n = (n + 1) % 11; // cycle 0..10
    }, 60); // 60ms per increment (~183 cycles/sec)
    activeCounters.push(id);
  }

  function render(){
    clearBody();
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const slice = students.slice(start, end);
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
    backdrop.innerHTML = '<div class="uma-modal" role="dialog" aria-modal="true" aria-labelledby="uma-modal-title">\n <button class="close-btn" type="button" aria-label="Close">Close</button>\n <figure class="modal-avatar-wrapper"><img class="modal-avatar" alt="Student avatar"></figure>\n <div class="modal-content">\n   <h2 id="uma-modal-title"></h2>\n   <div class="stat-grid"></div>\n   <p class="modal-note note-dim"></p>\n </div>\n</div>';
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
    avatar.src = item.image || '';
    avatar.alt = item.name;
    noteEl.textContent = item.note || 'No notes provided.';

    // Stats
    statGrid.innerHTML = '';
    const favDisplay = (item.gooned === null)
      ? 'Counting…'
      : (typeof item.gooned === 'string')
        ? item.gooned
        : (typeof item.gooned === 'number')
          ? item.gooned
          : '—';

    const stats = [
      { label: 'Rank', value: item.rank },
      { label: 'Fav Count', value: favDisplay },
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