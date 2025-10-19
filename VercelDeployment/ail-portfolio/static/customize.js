(function(){
  const doc = document;
  const root = doc.documentElement;
  if (doc.getElementById('customize-btn')) return;

  const STORAGE_KEY = 'portfolio.customize';
  const heroVar = {
    bg: '--hero-bg-url',
    blur: '--hero-blur',
    saturate: '--hero-saturate',
    overlay: '--hero-overlay',
    accent: '--accent',
    bgSize: '--hero-bg-size',
    hd: '--hero-hd-filter'
  };

  function loadState(){
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
  }
  function saveState(state){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }
  function applyState(state){
    if (state.bg) root.style.setProperty(heroVar.bg, `url(${state.bg})`);
    if (state.blur) root.style.setProperty(heroVar.blur, state.blur);
    if (state.saturate) root.style.setProperty(heroVar.saturate, state.saturate);
    if (state.overlay) root.style.setProperty(heroVar.overlay, state.overlay);
    if (state.accent) root.style.setProperty(heroVar.accent, state.accent);
    if (state.bgContain === true) root.style.setProperty(heroVar.bgSize, 'contain');
    else if (state.bgContain === false) root.style.setProperty(heroVar.bgSize, 'cover');
    if (state.hdEnabled === true) root.style.setProperty(heroVar.hd, 'contrast(1.05) brightness(1.03) saturate(1.05)');
    else if (state.hdEnabled === false) root.style.setProperty(heroVar.hd, 'contrast(1) brightness(1)');
  }

  // Create gear button
  const gear = doc.createElement('button');
  gear.id = 'customize-btn';
  gear.className = 'social-btn customize-btn';
  gear.type = 'button';
  gear.setAttribute('aria-label', 'Customize page');
  gear.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
      <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/>
    </svg>
    <span>Customize</span>
  `;

  // Modal elements
  const overlay = doc.createElement('div');
  overlay.className = 'customize-overlay';
  overlay.innerHTML = `
    <div class="customize-dialog" role="dialog" aria-modal="true" aria-labelledby="cust-title">
      <div class="customize-header">
        <div class="customize-title" id="cust-title">Customize My Portfolio, yup u can do that here.</div>
        <button class="customize-close" aria-label="Close">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.71 2.89 18.3 9.17 12 2.89 5.71 4.3 4.29l6.29 6.3 6.3-6.3Z"/></svg>
        </button>
      </div>
      <div class="customize-body">
        <div class="field">
          <label>Pick a Wallpaper</label>
          <div class="select-grid">
            <label class="wall-card">
              <input type="radio" name="wall" value="bg/hero-bg.jpg" />
              <div class="thumb" style="background-image:url('./static/bg/hero-bg.jpg')"></div>
              <div class="badge">Default FireWatch</div>
            </label>
            <label class="wall-card">
              <input type="radio" name="wall" value="bg/hero-bg2.jpg" />
              <div class="thumb" style="background-image:url('./static/bg/hero-bg2.jpg')"></div>
              <div class="badge">Dark Seas</div>
            </label>
            <label class="wall-card">
              <input type="radio" name="wall" value="bg/hero-bg3.png" />
              <div class="thumb" style="background-image:url('./static/bg/hero-bg3.png')"></div>
              <div class="badge">Hatsune Miku</div>
            </label>
            <label class="wall-card">
              <input type="radio" name="wall" value="bg/twtw.gif" />
              <div class="thumb" style="background-image:url('./static/bg/twtw.gif')"></div>
              <div class="badge">Twin Towers</div>
            </label>
            <label class="wall-card">
              <input type="radio" name="wall" value="K/holo-en-council.jpg" />
              <div class="thumb" style="background-image:url('./static/K/holo-en-council.jpg')"></div>
              <div class="badge">Holo EN Council</div>
            </label>
            <!--
            <label class="wall-card">
              <input type="radio" name="wall" value="K/sakamatachloesegs.jpg" />
              <div class="thumb" style="background-image:url('./static/K/sakamatachloesegs.jpg')"></div>
              <div class="badge">Sakamata Chloe</div>
            </label>
            -->
          </div>
        </div>

        <div class="field">
          <label for="blurRange">Background blur (px)</label>
          <div class="range-row">
            <input id="blurRange" type="range" min="0" max="12" step="1" value="4" />
            <div class="val" id="blurVal">4px</div>
          </div>
        </div>

        <div class="field">
          <label for="satRange">Background saturate (×)</label>
          <div class="range-row">
            <input id="satRange" type="range" min="0.8" max="1.6" step="0.05" value="1.15" />
            <div class="val" id="satVal">1.15×</div>
          </div>
        </div>

        <div class="field">
          <label for="ovlRange">Overlay darkness</label>
          <div class="range-row">
            <input id="ovlRange" type="range" min="0" max="0.85" step="0.05" value="0.55" />
            <div class="val" id="ovlVal">0.55</div>
          </div>
        </div>

        <div class="field">
          <label for="accentColor">Accent color</label>
          <div class="color-row">
            <span class="val">Primary</span>
            <input id="accentColor" type="color" value="#7dd3fc" />
            <span class="val" id="accentVal">#7DD3FC</span>
          </div>
        </div>

        <div class="field">
          <label>Image Options</label>
          <div class="checkbox-row">
            <label class="checkbox">
              <input type="checkbox" id="bgContainChk" />
              <span>Preserve aspect ratio (contain)</span>
            </label>
          </div>
          <div class="checkbox-row">
            <label class="checkbox">
              <input type="checkbox" id="hdEnableChk" />
              <span>Enhance clarity (HD)</span>
            </label>
          </div>
        </div>
      </div>
      <div class="customize-footer">
        <button class="btn" type="button" id="resetBtn">Reset</button>
        <button class="btn primary" type="button" id="closeBtn">Done</button>
      </div>
    </div>
  `;

  function open(){ overlay.classList.add('open'); }
  function close(){ overlay.classList.remove('open'); }

  function initUI(){
    const state = loadState();
    // Normalize legacy bg paths that might include './static/'
    if (state.bg && state.bg.startsWith('./static/')) {
      state.bg = state.bg.replace(/^\.\/static\//, '');
      saveState(state);
    }
    applyState(state);
    const wallInputs = overlay.querySelectorAll('input[name="wall"]');
    const blurRange = overlay.querySelector('#blurRange');
    const blurVal = overlay.querySelector('#blurVal');
    const satRange = overlay.querySelector('#satRange');
    const satVal = overlay.querySelector('#satVal');
    const ovlRange = overlay.querySelector('#ovlRange');
    const ovlVal = overlay.querySelector('#ovlVal');
    const accColor = overlay.querySelector('#accentColor');
    const accVal = overlay.querySelector('#accentVal');
  const bgContainChk = overlay.querySelector('#bgContainChk');
  const hdEnableChk = overlay.querySelector('#hdEnableChk');

    // Pre-select wallpaper
    if (state.bg){
      for (const r of wallInputs){ if (r.value === state.bg) { r.checked = true; break; } }
    } else {
      wallInputs[0].checked = true;
    }

    // Init sliders
    blurRange.value = parseInt((state.blur || '4px'), 10);
    blurVal.textContent = blurRange.value + 'px';

    satRange.value = parseFloat(state.saturate || '1.15');
    satVal.textContent = satRange.value + '×';

    ovlRange.value = parseFloat(state.overlay || '0.55');
    ovlVal.textContent = String(ovlRange.value);

    accColor.value = (state.accent || '#7dd3fc');
    accVal.textContent = accColor.value.toUpperCase();

  // Checkboxes
  bgContainChk.checked = !!state.bgContain;
  hdEnableChk.checked = !!state.hdEnabled;

    // Bind changes
    wallInputs.forEach(r => r.addEventListener('change', () => {
      const val = r.value; // e.g., 'bg/hero-bg2.jpg' (CSS-file relative)
      const s = { ...loadState(), bg: val };
      root.style.setProperty(heroVar.bg, `url(${val})`);
      saveState(s);
    }));

    blurRange.addEventListener('input', () => {
      const val = blurRange.value + 'px';
      blurVal.textContent = val;
      root.style.setProperty(heroVar.blur, val);
      saveState({ ...loadState(), blur: val });
    });

    satRange.addEventListener('input', () => {
      const val = satRange.value;
      satVal.textContent = val + '×';
      root.style.setProperty(heroVar.saturate, val);
      saveState({ ...loadState(), saturate: val });
    });

    ovlRange.addEventListener('input', () => {
      const val = ovlRange.value;
      ovlVal.textContent = String(val);
      root.style.setProperty(heroVar.overlay, val);
      saveState({ ...loadState(), overlay: val });
    });

    accColor.addEventListener('input', () => {
      const val = accColor.value;
      accVal.textContent = val.toUpperCase();
      root.style.setProperty(heroVar.accent, val);
      saveState({ ...loadState(), accent: val });
    });

    bgContainChk.addEventListener('change', () => {
      const checked = bgContainChk.checked;
      root.style.setProperty(heroVar.bgSize, checked ? 'contain' : 'cover');
      saveState({ ...loadState(), bgContain: checked });
    });

    hdEnableChk.addEventListener('change', () => {
      const checked = hdEnableChk.checked;
      const filter = checked ? 'contrast(1.05) brightness(1.03) saturate(1.05)' : 'contrast(1) brightness(1)';
      root.style.setProperty(heroVar.hd, filter);
      saveState({ ...loadState(), hdEnabled: checked });
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
    overlay.querySelector('.customize-close').addEventListener('click', close);
    overlay.querySelector('#closeBtn').addEventListener('click', close);
    overlay.querySelector('#resetBtn').addEventListener('click', () => {
      const defaults = { bg: 'bg/hero-bg.jpg', blur: '4px', saturate: '1.15', overlay: '0.55', accent: '#7dd3fc' };
      applyState(defaults);
      saveState(defaults);
      initUI(); // re-init to sync controls
    });
  }

  function ready(fn){ if (doc.readyState !== 'loading') fn(); else doc.addEventListener('DOMContentLoaded', fn); }
  ready(() => {
    // Insert elements near trash button
    doc.body.appendChild(overlay);
    doc.body.appendChild(gear);
    // Stagger slight reveal
    requestAnimationFrame(() => gear.classList.add('ready'));

    gear.addEventListener('click', open);
    initUI();
  });
})();
