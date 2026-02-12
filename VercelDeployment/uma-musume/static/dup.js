  function rendercurrentBanner2(){
    const label = document.createElement('span');
    label.className = 'current-banner2-label';
    label.textContent = 'Current Banner';
    
    const card = document.createElement('div');
    card.className = 'current-banner2-card';
    
    const datesEl = document.createElement('div');
    datesEl.className = 'current-banner2-dates';
    const startDiv = document.createElement('div');
    startDiv.className = 'banner-date-item';
    startDiv.innerHTML = `<span class="banner-date-label">Started</span><span class="banner-date-value">${currentBanner2.startDate}</span>`;
    const endDiv = document.createElement('div');
    endDiv.className = 'banner-date-item';
    endDiv.innerHTML = `<span class="banner-date-label">Ends</span><span class="banner-date-value">${currentBanner2.endDate}</span>`;
    datesEl.appendChild(startDiv);
    datesEl.appendChild(endDiv);
    card.appendChild(datesEl);
    
    const imgEl = document.createElement('img');
    imgEl.className = 'current-banner2-img';
    imgEl.src = currentBanner2.banner;
    imgEl.alt = currentBanner2.name;
    
    const infoEl = document.createElement('div');
    infoEl.className = 'current-banner2-info';
    
    const nameEl = document.createElement('div');
    nameEl.className = 'current-banner2-name';
    nameEl.textContent = currentBanner2.name;
    
    const descEl = document.createElement('div');
    descEl.className = 'current-banner2-desc';
    descEl.textContent = currentBanner2.desc;
    
    infoEl.appendChild(nameEl);
    infoEl.appendChild(descEl);
    
    // Add support cards category
    if (currentBanner2.support) {
      const supportCategoryEl = document.createElement('div');
      supportCategoryEl.className = 'current-banner2-card-category';
      
      const supportLabelEl = document.createElement('div');
      supportLabelEl.className = 'current-banner2-category-label';
      supportLabelEl.textContent = 'Support Cards';
      
      const supportCardsEl = document.createElement('div');
      supportCardsEl.className = 'current-banner2-support-cards';
      supportCardsEl.textContent = currentBanner2.support;
      
      supportCategoryEl.appendChild(supportLabelEl);
      supportCategoryEl.appendChild(supportCardsEl);
      infoEl.appendChild(supportCategoryEl);
    }
    
    card.appendChild(imgEl);
    card.appendChild(infoEl);
    card.addEventListener('click', () => opencurrentBanner2Modal(currentBanner2));
    currentBanner2El.appendChild(label);
    currentBanner2El.appendChild(card);
  }
  rendercurrentBanner2();

  // Modal for current banner
  let currentBanner2Backdrop;
  function ensurecurrentBanner2Modal(){
    if(currentBanner2Backdrop) return;
    currentBanner2Backdrop = document.createElement('div');
    currentBanner2Backdrop.className = 'timeline-modal-backdrop';
    currentBanner2Backdrop.innerHTML = '<div class="timeline-modal" role="dialog" aria-modal="true" aria-labelledby="current-banner2-modal-title">\n <button class="close-btn" type="button" aria-label="Close">Close</button>\n <img class="modal-banner-img" alt="Banner">\n <div class="modal-content">\n   <h2 id="current-banner2-modal-title"></h2>\n   <div class="modal-date-range"></div>\n   <div class="modal-desc"></div>\n </div>\n</div>';
    document.body.appendChild(currentBanner2Backdrop);
    currentBanner2Backdrop.addEventListener('click', (e)=>{ if(e.target === currentBanner2Backdrop) closecurrentBanner2Modal(); });
    currentBanner2Backdrop.querySelector('.close-btn').addEventListener('click', closecurrentBanner2Modal);
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closecurrentBanner2Modal(); });
  }

  function opencurrentBanner2Modal(item){
    ensurecurrentBanner2Modal();
    const modal = currentBanner2Backdrop.querySelector('.timeline-modal');
    const bannerImg = modal.querySelector('.modal-banner-img');
    const title = modal.querySelector('#current-banner2-modal-title');
    const dateRangeEl = modal.querySelector('.modal-date-range');
    const descEl = modal.querySelector('.modal-desc');
    bannerImg.src = item.banner;
    bannerImg.alt = item.name;
    title.textContent = item.name;
    dateRangeEl.textContent = `${item.startDate} → ${item.endDate}`;
    descEl.textContent = item.desc;
    currentBanner2Backdrop.classList.add('open');
    document.body.classList.add('no-scroll');
    modal.querySelector('.close-btn').focus();
  }

  function closecurrentBanner2Modal(){
    if(!currentBanner2Backdrop) return;
    currentBanner2Backdrop.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }