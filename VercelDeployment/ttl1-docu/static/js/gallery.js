(function(){
  // Fallback media list (will be replaced by manifest.json if available)
  let media = [
    "552651347_1155840143415373_4247469740823637758_n.jpg",
    "552943478_2597303713989299_3707580407944511132_n.jpg",
    "553526947_1479913183222344_8221005686706340201_n.jpg",
    "553572034_1359634249020090_4931520771028398746_n.jpg",
    "553697828_815338994412606_4607164329181604409_n.jpg",
    "554288731_1341568760803400_17500872987322266_n.jpg",
    "557356454_802093625792560_1458526822603443965_n.jpg",
    "557485674_1450347739406388_7553919420030374761_n.jpg",
    "558051650_833509649246997_8532021478558090289_n.jpg",
    "562758274_1368881774851732_4338049766905645936_n.jpg",
    "562799080_2266936347079190_7589863099983679251_n.jpg",
    "562817600_880439434307985_3561579837045052476_n.jpg",
    "562848363_673556792060794_789787375068808860_n.jpg",
    "563219912_1474291507190090_5483281090105709219_n.jpg",
    "563846126_3091121304389669_1299790151139811080_n.jpg",
    "563883616_2051530862255037_4582907342640018803_n.jpg",
    "563917580_2057730581638145_3354829472549042867_n.jpg",
    "564107504_1336104588014273_2365613688543591340_n.jpg",
    "564295038_24887061630920641_4739399212901694629_n.jpg",
    "564323784_1151637749733172_5870141659426386942_n.jpg",
    "564519966_1517083759838125_8539760378670398463_n.jpg",
    "564600465_2442541296149286_999831022411801760_n.jpg",
    "564710848_1019274500284254_122608215191807906_n.jpg",
    "564998690_748145941591777_4738228601892447099_n.jpg",
    "565118438_829814549519821_1312004805275398374_n.jpg",
    "565730823_982885577349132_2555649088932863058_n.jpg",
    "566211662_1863580940937091_6378398674114312500_n.jpg",
    "566336625_1338777274702173_2573293904287535975_n.jpg",
    "566339774_1496625411483161_5071931155236125314_n.jpg",
    "566340638_680736051750281_1309547742922045352_n.jpg",
    "566388779_1310258030228820_2755217420922809704_n.jpg",
    "566395284_1750526642334016_4797982425357315429_n.jpg",
    "566496143_1522699002096926_3806278815142391549_n.jpg",
    "566501624_1870075643929593_2495465277353502184_n.jpg",
    "AQP6286eEPtn2PcCY3hqtR51Y0tWqAZ9ne-3u4gFGwNkVT-D2fxl_iEzvU0c6gHhb1YrTBwX5pedB2HiYN9GnIyS.mp4"
  ];

  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  const base = './static/images-gallery/';

  function render(){
    if (!media.length) {
      grid.innerHTML = '<p class="muted">No media found in ./static/images-gallery.</p>';
      return;
    }

    grid.innerHTML = '';
    const items = media.map(name => {
      const isVideo = /\.(mp4|webm|ogg)$/i.test(name);
      const wrapper = document.createElement('div');
      wrapper.className = 'gallery-item';
      const btn = document.createElement('button');
      btn.setAttribute('aria-label', 'Open media');
      if (isVideo){
        const v = document.createElement('video');
        v.src = base + name; v.muted = true; v.playsInline = true; v.preload = 'metadata';
        v.className = 'thumb';
        v.addEventListener('mouseenter', () => v.play());
        v.addEventListener('mouseleave', () => { v.pause(); v.currentTime = 0; });
        btn.appendChild(v);
        const overlay = document.createElement('div'); overlay.className = 'gallery-overlay';
        const badge = document.createElement('span'); badge.className = 'gallery-badge'; badge.textContent = 'Video';
        overlay.appendChild(badge);
        wrapper.appendChild(btn); wrapper.appendChild(overlay);
      } else {
        const img = document.createElement('img');
        img.loading = 'lazy'; img.src = base + name; img.alt = name; img.className = 'thumb';
        btn.appendChild(img);
        const overlay = document.createElement('div'); overlay.className = 'gallery-overlay';
        const badge = document.createElement('span'); badge.className = 'gallery-badge'; badge.textContent = 'Image';
        overlay.appendChild(badge);
        wrapper.appendChild(btn); wrapper.appendChild(overlay);
      }
      return { wrapper, name };
    });

    items.forEach(it => grid.appendChild(it.wrapper));

    // Modal controls
    const modal = document.getElementById('mediaModal');
    const modalImg = document.getElementById('modalImage');
    const modalVid = document.getElementById('modalVideo');
    const caption = document.getElementById('modalCaption');
    const prev = document.getElementById('prevBtn');
    const next = document.getElementById('nextBtn');

    let currentIndex = -1;

    function openIndex(i){
      const name = media[i]; if (!name) return;
      const isVideo = /\.(mp4|webm|ogg)$/i.test(name);
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
      if (isVideo){
        modalImg.style.display = 'none';
        modalVid.style.display = 'block';
        modalVid.src = base + name; modalVid.play(); modalVid.setAttribute('aria-label', name);
      } else {
        modalVid.pause(); modalVid.removeAttribute('src'); modalVid.load();
        modalVid.style.display = 'none';
        modalImg.style.display = 'block';
        modalImg.src = base + name; modalImg.alt = name;
      }
      caption.textContent = name;
      currentIndex = i;
      const nextBtn = document.getElementById('nextBtn');
      if (nextBtn) nextBtn.focus();
    }
    function closeModal(){
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
      modalVid.pause(); modalVid.removeAttribute('src'); modalVid.load();
    }
    function nextIndex(){
      openIndex((currentIndex + 1) % media.length);
    }
    function prevIndex(){
      openIndex((currentIndex - 1 + media.length) % media.length);
    }

    grid.querySelectorAll('.gallery-item').forEach((el, idx) => {
      el.addEventListener('click', () => openIndex(idx));
    });

    document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => {
      if (modal.getAttribute('aria-hidden') === 'true') return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') nextIndex();
      if (e.key === 'ArrowLeft') prevIndex();
    });
    next.addEventListener('click', nextIndex);
    prev.addEventListener('click', prevIndex);
  }

  // Try to load manifest.json for an up-to-date media list
  fetch(base + 'manifest.json')
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(list => { if (Array.isArray(list) && list.length) media = list; })
    .catch(() => {})
    .finally(render);
})();
