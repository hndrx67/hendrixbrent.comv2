document.addEventListener('DOMContentLoaded', function() {
    // Create developer console button
    const consoleBtn = document.createElement('a');
    consoleBtn.href = '#';
    consoleBtn.className = 'cta-btn dev-console-btn';
    consoleBtn.textContent = 'Developer Console';
    
    // Add button to hero-btns
    const heroBtns = document.querySelector('.hero-btns');
    heroBtns.appendChild(consoleBtn);

    // Create console window
    const consoleWindow = document.createElement('div');
    consoleWindow.className = 'dev-console';
    consoleWindow.innerHTML = `
        <div class="console-header">
            <div class="console-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 18L22 12L16 6"></path>
                    <path d="M8 6L2 12L8 18"></path>
                </svg>
                Developer Console v1.0
            </div>
            <div class="console-controls">
                <button class="console-btn" id="minimizeConsole">_</button>
                <button class="console-btn" id="closeConsole">×</button>
            </div>
        </div>
        <div class="console-content">
            <div class="console-sidebar">
                <div class="console-category">
                    <div class="console-category-title">Theme</div>
                    <div class="console-option" data-panel="colors">Color Scheme</div>
                    <div class="console-option" data-panel="animations">Animations</div>
                    <div class="console-option" data-panel="effects">Effects</div>
                </div>
                <div class="console-category">
                    <div class="console-category-title">Layout</div>
                    <div class="console-option" data-panel="layout">Layout Options</div>
                    <div class="console-option" data-panel="typography">Typography</div>
                </div>
                <div class="console-category">
                    <div class="console-category-title">Fun Stuff</div>
                    <div class="console-option" data-panel="matrix">Matrix Mode</div>
                    <div class="console-option" data-panel="particles">Particle Effects</div>
                    <div class="console-option" data-panel="eastereggs">Easter Eggs</div>
                </div>
            </div>
            <div class="console-main">
                <!-- Colors Panel -->
                <div class="console-panel" data-panel="colors">
                    <h3>Color Scheme</h3>
                    <div class="color-picker-group">
                        <span class="color-picker-label">Accent Color:</span>
                        <input type="color" id="accentColor" value="#3CFFE2">
                    </div>
                    <div class="preset-buttons">
                        <button class="preset-btn" data-colors='{"accent": "#3CFFE2", "alt": "#ACFF3D"}'>Default</button>
                        <button class="preset-btn" data-colors='{"accent": "#FF0000", "alt": "#8B0000"}'>Blood Red</button>
                        <button class="preset-btn" data-colors='{"accent": "#00FF00", "alt": "#008000"}'>Matrix</button>
                        <button class="preset-btn" data-colors='{"accent": "#FF00FF", "alt": "#800080"}'>Synthwave</button>
                    </div>
                </div>

                <!-- Animations Panel -->
                <div class="console-panel" data-panel="animations">
                    <h3>Animation Settings</h3>
                    <div class="console-slider">
                        <div class="console-slider-label">
                            <span>Animation Speed</span>
                            <span id="speedValue">1x</span>
                        </div>
                        <input type="range" min="0.5" max="2" step="0.1" value="1" id="animationSpeed">
                    </div>
                    <div class="console-checkbox">
                        <input type="checkbox" id="enableAnimations" checked>
                        <label for="enableAnimations">Enable Animations</label>
                    </div>
                </div>

                <!-- Effects Panel -->
                <div class="console-panel" data-panel="effects">
                    <h3>Visual Effects</h3>
                    <div class="console-checkbox">
                        <input type="checkbox" id="enableBloom">
                        <label for="enableBloom">Bloom Effect</label>
                    </div>
                    <div class="console-checkbox">
                        <input type="checkbox" id="enableGlow" checked>
                        <label for="enableGlow">Glow Effect</label>
                    </div>
                    <div class="console-slider">
                        <div class="console-slider-label">
                            <span>Blur Intensity</span>
                            <span id="blurValue">0px</span>
                        </div>
                        <input type="range" min="0" max="20" value="0" id="blurIntensity">
                    </div>
                </div>

                <!-- Layout Panel -->
                <div class="console-panel" data-panel="layout">
                    <h3>Layout Options</h3>
                    <div class="console-checkbox">
                        <input type="checkbox" id="wideLayout">
                        <label for="wideLayout">Wide Layout</label>
                    </div>
                    <div class="console-checkbox">
                        <input type="checkbox" id="compactMode">
                        <label for="compactMode">Compact Mode</label>
                    </div>
                </div>

                <!-- Typography Panel -->
                <div class="console-panel" data-panel="typography">
                    <h3>Typography Settings</h3>
                    <select class="console-select" id="fontSelect">
                        <option value="JetBrains Mono">JetBrains Mono</option>
                        <option value="Fira Code">Fira Code</option>
                        <option value="Roboto Mono">Roboto Mono</option>
                    </select>
                    <div class="console-slider">
                        <div class="console-slider-label">
                            <span>Font Size</span>
                            <span id="fontSizeValue">16px</span>
                        </div>
                        <input type="range" min="12" max="24" value="16" id="fontSize">
                    </div>
                </div>

                <!-- Matrix Mode Panel -->
                <div class="console-panel" data-panel="matrix">
                    <h3>Matrix Rain Effect</h3>
                    <div class="console-checkbox">
                        <input type="checkbox" id="enableMatrix">
                        <label for="enableMatrix">Enable Matrix Rain</label>
                    </div>
                    <div class="console-slider">
                        <div class="console-slider-label">
                            <span>Rain Density</span>
                            <span id="rainDensityValue">50%</span>
                        </div>
                        <input type="range" min="10" max="100" value="50" id="rainDensity">
                    </div>
                </div>

                <!-- Particle Effects Panel -->
                <div class="console-panel" data-panel="particles">
                    <h3>Particle Effects</h3>
                    <div class="console-checkbox">
                        <input type="checkbox" id="enableParticles">
                        <label for="enableParticles">Enable Particles</label>
                    </div>
                    <select class="console-select" id="particleType">
                        <option value="dots">Dots</option>
                        <option value="lines">Lines</option>
                        <option value="triangles">Triangles</option>
                    </select>
                </div>

                <!-- Easter Eggs Panel -->
                <div class="console-panel" data-panel="eastereggs">
                    <h3>Easter Egg Controls</h3>
                    <div class="preset-buttons">
                        <button class="preset-btn" data-egg="blood">Toggle Blood Theme</button>
                        <button class="preset-btn" data-egg="strip">Toggle Strip Mode</button>
                        <button class="preset-btn" data-egg="invert">Invert Colors</button>
                        <button class="preset-btn" data-egg="rainbow">Rainbow Mode</button>
                    </div>
                </div>

                <div class="console-output">
                    <div class="output-line">> Developer Console initialized...</div>
                    <div class="output-line success">> Ready for input</div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(consoleWindow);

    // Show console button when blood theme is activated
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                if (document.body.classList.contains('blood-theme')) {
                    consoleBtn.classList.add('active');
                } else {
                    consoleBtn.classList.remove('active');
                }
            }
        });
    });

    observer.observe(document.body, { attributes: true });

    // Console functionality
    const closeConsole = document.getElementById('closeConsole');
    const minimizeConsole = document.getElementById('minimizeConsole');
    let isMinimized = false;

    consoleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        consoleWindow.classList.add('active');
        logToConsole('Console opened');
    });

    closeConsole.addEventListener('click', () => {
        consoleWindow.classList.remove('active');
        logToConsole('Console closed');
    });

    minimizeConsole.addEventListener('click', () => {
        if (isMinimized) {
            consoleWindow.style.height = '80vh';
            minimizeConsole.textContent = '_';
        } else {
            consoleWindow.style.height = '40px';
            minimizeConsole.textContent = '□';
        }
        isMinimized = !isMinimized;
    });

    // Panel navigation
    const options = document.querySelectorAll('.console-option');
    const panels = document.querySelectorAll('.console-panel');

    options.forEach(option => {
        option.addEventListener('click', () => {
            const panelName = option.dataset.panel;
            
            options.forEach(opt => opt.classList.remove('active'));
            panels.forEach(panel => panel.classList.remove('active'));
            
            option.classList.add('active');
            document.querySelector(`.console-panel[data-panel="${panelName}"]`).classList.add('active');
            
            logToConsole(`Opened ${panelName} panel`);
        });
    });

    // Theme controls
    const accentColor = document.getElementById('accentColor');
    accentColor.addEventListener('change', (e) => {
        document.documentElement.style.setProperty('--accent', e.target.value);
        logToConsole(`Changed accent color to ${e.target.value}`);
    });

    // Animation controls
    const animationSpeed = document.getElementById('animationSpeed');
    animationSpeed.addEventListener('input', (e) => {
        document.documentElement.style.setProperty('--transition-speed', `${e.target.value * 0.3}s`);
        document.getElementById('speedValue').textContent = `${e.target.value}x`;
        logToConsole(`Set animation speed to ${e.target.value}x`);
    });

    // Matrix rain effect
    const enableMatrix = document.getElementById('enableMatrix');
    let matrixRain;

    enableMatrix.addEventListener('change', (e) => {
        if (e.target.checked) {
            createMatrixRain();
            logToConsole('Matrix rain effect enabled');
        } else {
            if (matrixRain) {
                matrixRain.remove();
                logToConsole('Matrix rain effect disabled');
            }
        }
    });

    function createMatrixRain() {
        matrixRain = document.createElement('canvas');
        matrixRain.className = 'matrix-rain';
        document.body.appendChild(matrixRain);

        const ctx = matrixRain.getContext('2d');
        matrixRain.width = window.innerWidth;
        matrixRain.height = window.innerHeight;

        const chars = 'アィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロワヲンヴヵヶ';
        const columns = matrixRain.width / 20;
        const drops = new Array(Math.floor(columns)).fill(1);

        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, matrixRain.width, matrixRain.height);
            
            ctx.fillStyle = '#0F0';
            ctx.font = '15px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * 20, drops[i] * 20);
                
                if (drops[i] * 20 > matrixRain.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            
            requestAnimationFrame(draw);
        }
        
        draw();
    }

    // Console logging
    function logToConsole(message, type = 'info') {
        const output = document.querySelector('.console-output');
        const line = document.createElement('div');
        line.className = `output-line ${type}`;
        line.textContent = `> ${message}`;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    // Easter egg controls
    const eggButtons = document.querySelectorAll('[data-egg]');
    eggButtons.forEach(button => {
        button.addEventListener('click', () => {
            const egg = button.dataset.egg;
            switch (egg) {
                case 'blood':
                    document.body.classList.toggle('blood-theme');
                    logToConsole(`${document.body.classList.contains('blood-theme') ? 'Enabled' : 'Disabled'} blood theme`);
                    break;
                case 'strip':
                    document.body.classList.toggle('stripped');
                    logToConsole(`${document.body.classList.contains('stripped') ? 'Enabled' : 'Disabled'} strip mode`);
                    break;
                case 'invert':
                    document.body.style.filter = document.body.style.filter === 'invert(1)' ? '' : 'invert(1)';
                    logToConsole(`${document.body.style.filter ? 'Enabled' : 'Disabled'} color inversion`);
                    break;
                case 'rainbow':
                    startRainbowMode();
                    logToConsole('Toggled rainbow mode');
                    break;
            }
        });
    });

    let rainbowInterval;
    function startRainbowMode() {
        if (rainbowInterval) {
            clearInterval(rainbowInterval);
            rainbowInterval = null;
            document.documentElement.style.removeProperty('--accent');
            return;
        }

        let hue = 0;
        rainbowInterval = setInterval(() => {
            hue = (hue + 1) % 360;
            document.documentElement.style.setProperty('--accent', `hsl(${hue}, 100%, 50%)`);
        }, 50);
    }
});