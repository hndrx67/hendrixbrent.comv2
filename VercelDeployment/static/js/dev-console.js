document.addEventListener('DOMContentLoaded', function() {
    const consoleToggle = document.getElementById('consoleToggle');
    const isMobile = window.innerWidth <= 768;

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
                Developer Console v2.0
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
                    <div class="console-category-title">Easter Eggs</div>
                    <div class="console-option" data-panel="eastereggs">Easter Egg Controls</div>
                    <div class="console-option" data-panel="matrix">Matrix Mode</div>
                    <div class="console-option" data-panel="particles">Particle Effects</div>
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

                <div class="console-output">
                    <div class="output-line">> Developer Console v2.0 initialized...</div>
                    <div class="output-line success">> Ready for input</div>
                    ${isMobile ? '<div class="output-line error">> Mobile device detected. Some features are disabled.</div>' : ''}
                </div>
                <div class="console-input-container">
                    <input type="text" class="console-input" placeholder="Enter command...">
                    <button class="console-enter-btn">Enter</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(consoleWindow);

    // Console toggle functionality
    consoleToggle.addEventListener('click', (e) => {
        e.preventDefault();
        consoleWindow.classList.add('active');
        logToConsole('Console opened');
    });

    // Console controls
    const closeConsole = document.getElementById('closeConsole');
    const minimizeConsole = document.getElementById('minimizeConsole');
    let isMinimized = false;

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
        logToConsole(`Console ${isMinimized ? 'minimized' : 'maximized'}`);
    });

    // Panel navigation
    const options = document.querySelectorAll('.console-option');
    const panels = document.querySelectorAll('.console-panel');

    options.forEach(option => {
        option.addEventListener('click', () => {
            const panelName = option.dataset.panel;
            
            // Check if feature is available on mobile
            if (isMobile && ['effects', 'matrix', 'particles'].includes(panelName)) {
                logToConsole(`${panelName} is not available on mobile devices`, 'error');
                return;
            }

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
    const enableAnimations = document.getElementById('enableAnimations');

    animationSpeed.addEventListener('input', (e) => {
        document.documentElement.style.setProperty('--transition-speed', `${e.target.value * 0.3}s`);
        document.getElementById('speedValue').textContent = `${e.target.value}x`;
        logToConsole(`Set animation speed to ${e.target.value}x`);
    });

    enableAnimations.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.documentElement.style.setProperty('--transition-speed', '0.3s');
        } else {
            document.documentElement.style.setProperty('--transition-speed', '0s');
        }
        logToConsole(`${e.target.checked ? 'Enabled' : 'Disabled'} animations`);
    });

    // Typography controls
    const fontSelect = document.getElementById('fontSelect');
    const fontSize = document.getElementById('fontSize');

    fontSelect.addEventListener('change', (e) => {
        document.documentElement.style.setProperty('--font-mono', e.target.value);
        logToConsole(`Changed font to ${e.target.value}`);
    });

    fontSize.addEventListener('input', (e) => {
        document.documentElement.style.setProperty('--base-font-size', `${e.target.value}px`);
        document.getElementById('fontSizeValue').textContent = `${e.target.value}px`;
        logToConsole(`Changed font size to ${e.target.value}px`);
    });

    // Effects controls
    const enableBloom = document.getElementById('enableBloom');
    const enableGlow = document.getElementById('enableGlow');
    const blurIntensity = document.getElementById('blurIntensity');

    enableBloom.addEventListener('change', (e) => {
        document.body.classList.toggle('bloom-effect', e.target.checked);
        logToConsole(`${e.target.checked ? 'Enabled' : 'Disabled'} bloom effect`);
    });

    enableGlow.addEventListener('change', (e) => {
        document.body.classList.toggle('glow-effect', e.target.checked);
        logToConsole(`${e.target.checked ? 'Enabled' : 'Disabled'} glow effect`);
    });

    blurIntensity.addEventListener('input', (e) => {
        document.documentElement.style.setProperty('--blur-intensity', `${e.target.value}px`);
        document.getElementById('blurValue').textContent = `${e.target.value}px`;
        logToConsole(`Set blur intensity to ${e.target.value}px`);
    });

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

    // Console input handling
    const consoleInput = document.querySelector('.console-input');
    const consoleEnterBtn = document.querySelector('.console-enter-btn');
    const consoleOutput = document.querySelector('.console-output');

    function handleCommand(command) {
        logToConsole(`$ ${command}`);
        
        switch(command.toLowerCase().trim()) {
            case 'houshou marine':
                logToConsole('Redirecting to VTuber Wiki...', 'success');
                setTimeout(() => {
                    window.location.href = 'vtubers-wiki.html';
                }, 1000);
                break;
                
            case 'sudo rm -rf':
                logToConsole('Initiating website destruction sequence...', 'error');
                document.body.classList.add('destroying');
                const elements = document.querySelectorAll('section, header, footer');
                elements.forEach((element, index) => {
                    setTimeout(() => {
                        element.classList.add('falling');
                    }, index * 200);
                });
                
                // Close console but don't move the icon
                setTimeout(() => {
                    consoleWindow.classList.remove('active');
                }, elements.length * 200 + 500);
                break;
                
            default:
                logToConsole(`Command not recognized: ${command}`, 'error');
                break;
        }
    }

    function processInput() {
        const command = consoleInput.value.trim();
        if (command) {
            handleCommand(command);
            consoleInput.value = '';
        }
    }

    consoleEnterBtn.addEventListener('click', processInput);
    consoleInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            processInput();
        }
    });

    // Console logging
    function logToConsole(message, type = 'info') {
        const output = document.querySelector('.console-output');
        const line = document.createElement('div');
        line.className = `output-line ${type}`;
        line.textContent = `> ${message}`;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    // Rainbow mode
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