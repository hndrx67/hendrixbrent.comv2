// timeline.js - Uma Musume Timeline logic
(function(){
  'use strict';
  const timeline = [
    // Future Banners
    { date: '2025-12-09', name: 'Manhattan Cafe', banner: 'https://uma.moe/assets/images/character/banner/2021_30048.png', desc: 'Character banner featuring: Manhattan Cafe', support: 'Sirius Symboli, Nakayama Festa', type: 'current' },
    { date: '2025-12-15', name: 'Symboli Rudolf, Gold City', banner: 'https://uma.moe/assets/images/character/banner/2021_30050.png', desc: 'Character banner featuring: Symboli Rudolf, Gold City', support: 'Curren Chan, Narita Brian', type: 'current' },
    { date: '2025-12-19', name: 'Tosen Jordan', banner: 'https://uma.moe/assets/images/character/banner/2021_30052.png', desc: 'Character banner featuring: Tosen Jordan', support: 'El Condor Pasa, Kitasan Black', type: 'current' },
    { date: '2025-12-29', name: 'Mejiro Dober', banner: 'https://uma.moe/assets/images/character/banner/2021_30054.png', desc: 'Character banner featuring: Mejiro Dober', support: 'Vodka, Daitaku Helios', type: 'current' },
    { date: '2026-01-04', name: 'Oguri Cap, Biwa Hayahide', banner: 'https://uma.moe/assets/images/character/banner/2021_30056.png', desc: 'Character banner featuring: Oguri Cap, Biwa Hayahide', support: 'Mayano Top Gun, Narita Taishin', type: 'current' },
    { date: '2026-01-15', name: 'Fine Motion', banner: 'https://uma.moe/assets/images/character/banner/2021_30058.png', desc: 'Character banner featuring: Fine Motion', support: 'Inari One, Manhattan Cafe', type: 'current' },
    { date: '2026-01-20', name: 'Tamamo Cross', banner: 'https://uma.moe/assets/images/character/banner/2021_30060.png', desc: 'Character banner featuring: Tamamo Cross', support: 'Oguri Cap, Nice Nature', type: 'current' },
    { date: '2026-01-27', name: 'Haru Urara, TM Opera O', banner: 'https://uma.moe/assets/images/character/banner/2021_30062.png', desc: 'Character banner featuring: Haru Urara, TM Opera O', support: 'Admire Vega, Matikanefukukitaru', type: 'current' },
    { date: '2026-02-09', name: 'Sakura Chiyono O', banner: 'https://uma.moe/assets/images/character/banner/2022_30066.png', desc: 'Character banner featuring: Sakura Chiyono O', support: 'Tazuna Hayakawa, Riko Kashimoto', type: 'current' },
    { date: '2026-02-15', name: 'Mihono Bourbon, Eishin Flash', banner: 'https://uma.moe/assets/images/character/banner/2022_30068.png', desc: 'Character banner featuring: Mihono Bourbon, Eishin Flash', support: 'Nishino Flower, Sakura Bakushin O', type: 'current' },
    { date: '2026-02-23', name: 'Mejiro Ardan', banner: 'https://uma.moe/assets/images/character/banner/2022_30070.png', desc: 'Character banner featuring: Mejiro Ardan', support: 'Ines Fujin, Agnes Digital', type: 'current' },
    { date: '2026-02-28', name: 'Admire Vega', banner: 'https://uma.moe/assets/images/character/banner/2022_30072.png', desc: 'Character banner featuring: Admire Vega', support: 'Fine Motion, Kawakami Princess', type: 'current' },
    { date: '2026-03-06', name: 'Matikanetannhauser, Kitasan Black', banner: 'https://uma.moe/assets/images/character/banner/2022_30074.png', desc: 'Character banner featuring: Matikanetannhauser, Kitasan Black', support: 'Mejiro Ryan, Admire Vega', type: 'current' },
    { date: '2026-03-13', name: 'Satono Diamond', banner: 'https://uma.moe/assets/images/character/banner/2022_30076.png', desc: 'Character banner featuring: Satono Diamond', support: 'Curren Chan, Marvelous Sunday', type: 'current' },
    { date: '2026-03-21', name: 'Mejiro Bright', banner: 'https://uma.moe/assets/images/character/banner/2022_30078.png', desc: 'Character banner featuring: Mejiro Bright', support: 'Zenno Rob Roy, Curren Chan', type: 'current' },
    
    // Past Banners
    { date: '2025-12-02', name: 'Kawakami Princess', banner: 'https://uma.moe/assets/images/character/banner/2021_30046.png', desc: 'Character banner featuring: Kawakami Princess', support: 'Seiun Sky, Yaeno Muteki', type: 'past' },
    { date: '2025-11-25', name: 'Rice Shower, Super Creek', banner: 'https://uma.moe/assets/images/character/banner/2021_30044.png', desc: 'Character banner featuring: Rice Shower, Super Creek', support: 'Tamamo Cross, Zenno Rob Roy', type: 'past' },
    { date: '2025-11-20', name: 'Agnes Digital', banner: 'https://uma.moe/assets/images/character/banner/2021_30042.png', desc: 'Character banner featuring: Agnes Digital', support: 'Fine Motion, Ikuno Dictus', type: 'past' },
    { date: '2025-11-12', name: 'Hishi Akebono', banner: 'https://uma.moe/assets/images/character/banner/2021_30040.png', desc: 'Character banner featuring: Hishi Akebono', support: 'Sakura Bakushin O, Biko Pegasus', type: 'past' },
    { date: '2025-11-07', name: 'Matikanefukukitaru', banner: 'https://uma.moe/assets/images/character/banner/2021_30038.png', desc: 'Character banner featuring: Matikanefukukitaru', support: 'Rice Shower, Riko Kashimoto', type: 'past' },
    { date: '2025-10-31', name: 'Eishin Flash', banner: 'https://uma.moe/assets/images/character/banner/2021_30036.png', desc: 'Character banner featuring: Eishin Flash', support: 'Tosen Jordan, Nice Nature', type: 'past' },
    { date: '2025-10-22', name: 'Meisho Doto', banner: 'https://uma.moe/assets/images/character/banner/2021_30034.png', desc: 'Character banner featuring: Meisho Doto', support: 'Special Week, Tokai Teio', type: 'past' },
    { date: '2025-10-15', name: 'Special Week, Maruzensky', banner: 'https://uma.moe/assets/images/character/banner/2021_30032.png', desc: 'Character banner featuring: Special Week, Maruzensky', support: 'Sweep Tosho, Winning Ticket', type: 'past' },
    { date: '2025-10-08', name: 'Gold City', banner: 'https://uma.moe/assets/images/character/banner/2021_30030.png', desc: 'Character banner featuring: Gold City', support: 'Vodka, Nishino Flower', type: 'past' },
    { date: '2025-10-03', name: 'Fuji Kiseki', banner: 'https://uma.moe/assets/images/character/banner/2021_30028.png', desc: 'Character banner featuring: Fuji Kiseki', support: 'Mejiro Ardan, Mejiro Ryan', type: 'past' },
    { date: '2025-09-22', name: 'El Condor Pasa, Grass Wonder', banner: 'https://uma.moe/assets/images/character/banner/2021_30026.png', desc: 'Character banner featuring: El Condor Pasa, Grass Wonder', support: 'Seiun Sky, King Halo', type: 'past' },
    { date: '2025-09-18', name: 'Hishi Amazon', banner: 'https://uma.moe/assets/images/character/banner/2021_30024.png', desc: 'Character banner featuring: Hishi Amazon', support: 'Shinko Windy, Bamboo Memory', type: 'past' },
    { date: '2025-09-08', name: 'Seiun Sky', banner: 'https://uma.moe/assets/images/character/banner/2021_30022.png', desc: 'Character banner featuring: Seiun Sky', support: 'Silence Suzuka, Tamamo Cross', type: 'past' },
    { date: '2025-08-29', name: 'Mayano Top Gun, Air Groove', banner: 'https://uma.moe/assets/images/character/banner/2021_30020.png', desc: 'Character banner featuring: Mayano Top Gun, Air Groove', support: 'Kawakami Princess, Hishi Akebono', type: 'past' },
    { date: '2025-08-21', name: 'Narita Brian', banner: 'https://uma.moe/assets/images/character/banner/2021_30018.png', desc: 'Character banner featuring: Narita Brian', support: 'Seeking the Pearl, Sakura Chiyono O', type: 'past' },
    { date: '2025-08-12', name: 'Smart Falcon', banner: 'https://uma.moe/assets/images/character/banner/2021_30016.png', desc: 'Character banner featuring: Smart Falcon', support: 'Super Creek, Tazuna Hayakawa', type: 'past' },
  ];

  const currentBanner = {
    name: 'Kawakami Princess',
    banner: 'https://uma.moe/assets/images/character/banner/2021_30046.png',
    desc: 'Character banner featuring: Kawakami Princess. Limited-time gacha event.',
    support: 'Seiun Sky, Yaeno Muteki',
    startDate: '2025-12-02',
    endDate: '2025-12-08',
  };

  const listEl = document.getElementById('timeline-list');
  const currentBannerEl = document.getElementById('current-banner');
  const searchInput = document.getElementById('timeline-search');
  let currentFilter = 'current';
  let searchQuery = '';
  
  function renderTimeline(){
    listEl.innerHTML = '';
    timeline.forEach((item, idx) => {
      if (currentFilter === 'current' && item.type !== 'current') return;
      if (currentFilter === 'past' && item.type !== 'past') return;
      
      // Search filter
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return;

      const itemWrapper = document.createElement('div');
      itemWrapper.className = 'timeline-item reveal-seed';
      itemWrapper.style.animationDelay = `${80 + idx * 45}ms`;

      const dot = document.createElement('div');
      dot.className = 'timeline-dot';
      itemWrapper.appendChild(dot);

      const dateBadge = document.createElement('div');
      dateBadge.className = 'timeline-date-badge';
      dateBadge.textContent = item.date;
      itemWrapper.appendChild(dateBadge);

      const card = document.createElement('div');
      card.className = 'timeline-card';
      
      const imgEl = document.createElement('img');
      imgEl.className = 'timeline-banner-img';
      imgEl.src = item.banner;
      imgEl.alt = `${item.name} banner`;
      
      const infoEl = document.createElement('div');
      infoEl.className = 'timeline-info';
      
      const nameEl = document.createElement('div');
      nameEl.className = 'timeline-name';
      nameEl.textContent = item.name;
      
      const descEl = document.createElement('div');
      descEl.className = 'timeline-desc';
      descEl.textContent = item.desc;
      
      infoEl.appendChild(nameEl);
      infoEl.appendChild(descEl);
      
      // Add support card category
      if (item.support) {
        const supportCategoryEl = document.createElement('div');
        supportCategoryEl.className = 'timeline-card-category';
        
        const supportLabelEl = document.createElement('div');
        supportLabelEl.className = 'timeline-category-label';
        supportLabelEl.textContent = 'Support Cards';
        
        const supportCardsEl = document.createElement('div');
        supportCardsEl.className = 'timeline-support-cards';
        supportCardsEl.textContent = item.support;
        
        supportCategoryEl.appendChild(supportLabelEl);
        supportCategoryEl.appendChild(supportCardsEl);
        infoEl.appendChild(supportCategoryEl);
      }
      
      card.appendChild(imgEl);
      card.appendChild(infoEl);
      card.addEventListener('click', () => openModal(item));
      
      itemWrapper.appendChild(card);
      listEl.appendChild(itemWrapper);
      
      setTimeout(() => itemWrapper.classList.add('reveal-on'), 120 + idx * 45);
    });
  }

  // Modal logic for timeline preview
  let backdrop;
  function ensureModalShell(){
    if(backdrop) return;
    backdrop = document.createElement('div');
    backdrop.className = 'timeline-modal-backdrop';
    backdrop.innerHTML = '<div class="timeline-modal" role="dialog" aria-modal="true" aria-labelledby="timeline-modal-title">\n <button class="close-btn" type="button" aria-label="Close">Close</button>\n <img class="modal-banner-img" alt="Banner">\n <div class="modal-content">\n   <h2 id="timeline-modal-title"></h2>\n   <div class="modal-date"></div>\n   <div class="modal-desc"></div>\n </div>\n</div>';
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', (e)=>{ if(e.target === backdrop) closeModal(); });
    backdrop.querySelector('.close-btn').addEventListener('click', closeModal);
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModal(); });
  }

  function openModal(item){
    ensureModalShell();
    const modal = backdrop.querySelector('.timeline-modal');
    const bannerImg = modal.querySelector('.modal-banner-img');
    const title = modal.querySelector('#timeline-modal-title');
    const dateEl = modal.querySelector('.modal-date');
    const descEl = modal.querySelector('.modal-desc');
    // Populate
    bannerImg.src = item.banner;
    bannerImg.alt = `${item.name} banner`;
    title.textContent = item.name;
    dateEl.textContent = item.date;
    descEl.textContent = item.desc;
    backdrop.classList.add('open');
    document.body.classList.add('no-scroll');
    modal.querySelector('.close-btn').focus();
  }

  function closeModal(){
    if(!backdrop) return;
    backdrop.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  renderTimeline();
  // Update year in footer
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  // Render current banner
  function renderCurrentBanner(){
    const label = document.createElement('span');
    label.className = 'current-banner-label';
    label.textContent = 'Current Banner';
    
    const card = document.createElement('div');
    card.className = 'current-banner-card';
    
    const datesEl = document.createElement('div');
    datesEl.className = 'current-banner-dates';
    const startDiv = document.createElement('div');
    startDiv.className = 'banner-date-item';
    startDiv.innerHTML = `<span class="banner-date-label">Started</span><span class="banner-date-value">${currentBanner.startDate}</span>`;
    const endDiv = document.createElement('div');
    endDiv.className = 'banner-date-item';
    endDiv.innerHTML = `<span class="banner-date-label">Ends</span><span class="banner-date-value">${currentBanner.endDate}</span>`;
    datesEl.appendChild(startDiv);
    datesEl.appendChild(endDiv);
    card.appendChild(datesEl);
    
    const imgEl = document.createElement('img');
    imgEl.className = 'current-banner-img';
    imgEl.src = currentBanner.banner;
    imgEl.alt = currentBanner.name;
    
    const infoEl = document.createElement('div');
    infoEl.className = 'current-banner-info';
    
    const nameEl = document.createElement('div');
    nameEl.className = 'current-banner-name';
    nameEl.textContent = currentBanner.name;
    
    const descEl = document.createElement('div');
    descEl.className = 'current-banner-desc';
    descEl.textContent = currentBanner.desc;
    
    infoEl.appendChild(nameEl);
    infoEl.appendChild(descEl);
    
    // Add support cards category
    if (currentBanner.support) {
      const supportCategoryEl = document.createElement('div');
      supportCategoryEl.className = 'current-banner-card-category';
      
      const supportLabelEl = document.createElement('div');
      supportLabelEl.className = 'current-banner-category-label';
      supportLabelEl.textContent = 'Support Cards';
      
      const supportCardsEl = document.createElement('div');
      supportCardsEl.className = 'current-banner-support-cards';
      supportCardsEl.textContent = currentBanner.support;
      
      supportCategoryEl.appendChild(supportLabelEl);
      supportCategoryEl.appendChild(supportCardsEl);
      infoEl.appendChild(supportCategoryEl);
    }
    
    card.appendChild(imgEl);
    card.appendChild(infoEl);
    card.addEventListener('click', () => openCurrentBannerModal(currentBanner));
    currentBannerEl.appendChild(label);
    currentBannerEl.appendChild(card);
  }
  renderCurrentBanner();

  // Modal for current banner
  let currentBannerBackdrop;
  function ensureCurrentBannerModal(){
    if(currentBannerBackdrop) return;
    currentBannerBackdrop = document.createElement('div');
    currentBannerBackdrop.className = 'timeline-modal-backdrop';
    currentBannerBackdrop.innerHTML = '<div class="timeline-modal" role="dialog" aria-modal="true" aria-labelledby="current-banner-modal-title">\n <button class="close-btn" type="button" aria-label="Close">Close</button>\n <img class="modal-banner-img" alt="Banner">\n <div class="modal-content">\n   <h2 id="current-banner-modal-title"></h2>\n   <div class="modal-date-range"></div>\n   <div class="modal-desc"></div>\n </div>\n</div>';
    document.body.appendChild(currentBannerBackdrop);
    currentBannerBackdrop.addEventListener('click', (e)=>{ if(e.target === currentBannerBackdrop) closeCurrentBannerModal(); });
    currentBannerBackdrop.querySelector('.close-btn').addEventListener('click', closeCurrentBannerModal);
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeCurrentBannerModal(); });
  }

  function openCurrentBannerModal(item){
    ensureCurrentBannerModal();
    const modal = currentBannerBackdrop.querySelector('.timeline-modal');
    const bannerImg = modal.querySelector('.modal-banner-img');
    const title = modal.querySelector('#current-banner-modal-title');
    const dateRangeEl = modal.querySelector('.modal-date-range');
    const descEl = modal.querySelector('.modal-desc');
    bannerImg.src = item.banner;
    bannerImg.alt = item.name;
    title.textContent = item.name;
    dateRangeEl.textContent = `${item.startDate} → ${item.endDate}`;
    descEl.textContent = item.desc;
    currentBannerBackdrop.classList.add('open');
    document.body.classList.add('no-scroll');
    modal.querySelector('.close-btn').focus();
  }

  function closeCurrentBannerModal(){
    if(!currentBannerBackdrop) return;
    currentBannerBackdrop.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  // Navigation filter
  document.querySelectorAll('.timeline-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.timeline-toggle').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTimeline();
    });
  });

  // Search filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderTimeline();
    });
  }
})();