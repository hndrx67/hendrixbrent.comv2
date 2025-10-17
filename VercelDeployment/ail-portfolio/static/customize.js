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
    accent: '--accent'
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
  }

  // Create gear button
  const gear = doc.createElement('button');
  gear.id = 'customize-btn';
  gear.className = 'customize-btn';
  gear.type = 'button';
  gear.setAttribute('aria-label', 'Customize page');
  gear.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 8.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5m0-2a1 1 0 0 1 .95.68l.46 1.35a7.78 7.78 0 0 1 1.55.9l1.4-.52a1 1 0 0 1 1.16.43l1 1.73a1 1 0 0 1-.21 1.26l-1.11 1a6.72 6.72 0 0 1 0 1.8l1.11 1a1 1 0 0 1 .21 1.26l-1 1.73a1 1 0 0 1-1.16.43l-1.4-.52a7.78 7.78 0 0 1-1.55.9l-.46 1.35A1 1 0 0 1 12 21.5h-2a1 1 0 0 1-.95-.68l-.46-1.35a7.78 7.78 0 0 1-1.55-.9l-1.4.52a1 1 0 0 1-1.16-.43l-1-1.73a1 1 0 0 1 .21-1.26l1.11-1a6.72 6.72 0 0 1 0-1.8l-1.11-1a1 1 0 0 1-.21-1.26l1-1.73a1 1 0 0 1 1.16-.43l1.4.52a7.78 7.78 0 0 1 1.55-.9l.46-1.35A1 1 0 0 1 10 6.5Z"/>
    </svg>
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
