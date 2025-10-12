// Activities Page - Interactive Learning Games
class ActivitiesManager {
    constructor() {
        this.currentActivity = null;
        this.gameState = {
            blocks: { score: 0, lives: 3, level: 1, powerUps: [] },
            matcher: { score: 0, matches: 0, attempts: 0 },
            comic: { panels: [], currentPanel: 0 },
            typing: { score: 0, wpm: 0, accuracy: 100, currentWord: 0 }
        };
        this.animationFrameId = null;
        this.gameInterval = null;
        this.highScores = this.loadHighScores();
        this.init();
    }

    loadHighScores() {
        try {
            return JSON.parse(localStorage.getItem('activitiesHighScores')) || {
                blocks: 0,
                matcher: 0,
                comic: 0,
                typing: 0
            };
        } catch (e) {
            return { blocks: 0, matcher: 0, comic: 0, typing: 0 };
        }
    }

    saveHighScore(activity, score) {
        if (score > this.highScores[activity]) {
            this.highScores[activity] = score;
            localStorage.setItem('activitiesHighScores', JSON.stringify(this.highScores));
            this.showFeedback(`🎉 NEW HIGH SCORE: ${score}! 🎉`, 'success');
            return true;
        }
        return false;
    }

    init() {
        this.bindEvents();
        this.showActivitySelection();
        console.log('Activities Manager initialized');
    }

    bindEvents() {
        // Activity card clicks
        document.querySelectorAll('.activity-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const activity = card.dataset.activity;
                this.startActivity(activity);
            });
        });

        // Back button clicks
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => this.showActivitySelection());
        });
    }

    showActivitySelection() {
        // Hide all activity containers
        document.querySelectorAll('.activity-container').forEach(container => {
            container.style.display = 'none';
        });
        
        // Show activity selection
        const activityGrid = document.querySelector('.activities-grid');
        if (activityGrid) {
            activityGrid.style.display = 'grid';
        }
        this.currentActivity = null;
        this.stopAllGames();
    }

    startActivity(activity) {
        console.log(`Starting ${activity} activity`);
        
        // Hide activity selection
        const activityGrid = document.querySelector('.activities-grid');
        if (activityGrid) {
            activityGrid.style.display = 'none';
        }
        
        // Show specific activity container
        const container = document.querySelector(`#${activity}Activity`);
        if (container) {
            container.style.display = 'block';
            this.currentActivity = activity;
            
            // Initialize specific activity
            switch(activity) {
                case 'blocks':
                    this.initWordBlockBreaker();
                    break;
                case 'matcher':
                    this.initFeatureMatcher();
                    break;
                case 'comic':
                    this.initComicBuilder();
                    break;
                case 'typing':
                    this.initSpeedTyping();
                    break;
            }
        } else {
            console.error(`Activity container not found: #${activity}Activity`);
        }
    }

    stopAllGames() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }
    }

    // Word Block Breaker Game
    initWordBlockBreaker() {
        this.resetBlocksGame();
        this.setupBlocksCanvas();
        this.startBlocksGame();
    }

    resetBlocksGame() {
        const state = this.gameState.blocks;
        state.score = 0;
        state.lives = 3;
        state.level = 1;
        state.powerUps = [];
        state.isRunning = false;
        
        this.updateBlocksUI();
        this.clearBlocksCanvas();
    }

    setupBlocksCanvas() {
        const canvas = document.querySelector('.blocks-canvas');
        if (canvas) {
            canvas.innerHTML = '<div class="blocks-paddle"></div>';
            // Add game status display
            const statusDiv = document.createElement('div');
            statusDiv.className = 'game-status';
            statusDiv.style.cssText = `
                position: absolute;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                color: white;
                font-weight: bold;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                z-index: 15;
            `;
            statusDiv.textContent = 'Click blocks to catch them!';
            canvas.appendChild(statusDiv);
        }
    }

    clearBlocksCanvas() {
        const canvas = document.querySelector('.blocks-canvas');
        if (canvas) {
            // Remove all blocks and power-ups, keep paddle and status
            const blocks = canvas.querySelectorAll('.word-block, .power-up');
            blocks.forEach(block => block.remove());
        }
    }

    startBlocksGame() {
        console.log('Starting Word Block Breaker');
        const state = this.gameState.blocks;
        state.isRunning = true;
        
        // Start spawning blocks immediately
        this.spawnWordBlocks();
        
        // Set up regular spawning interval
        this.gameInterval = setInterval(() => {
            if (state.isRunning && this.currentActivity === 'blocks') {
                this.spawnWordBlocks();
            }
        }, 2000 + Math.random() * 2000); // Spawn every 2-4 seconds
        
        this.gameLoop();
    }

    spawnWordBlocks() {
        const words = [
            'VISUAL', 'TEXT', 'STORY', 'PICTURE', 'READ', 'LEARN',
            'WORD', 'BOOK', 'CHAPTER', 'HERO', 'ADVENTURE', 'MAGIC',
            'COMIC', 'PANEL', 'BUBBLE', 'CHARACTER', 'PLOT', 'SCENE'
        ];
        
        const canvas = document.querySelector('.blocks-canvas');
        if (!canvas) return;
        
        const canvasRect = canvas.getBoundingClientRect();
        const canvasWidth = canvas.offsetWidth;
        
        // Spawn 1-2 word blocks at a time to avoid mess
        const numBlocks = Math.floor(Math.random() * 2) + 1;
        
        for (let i = 0; i < numBlocks; i++) {
            const word = words[Math.floor(Math.random() * words.length)];
            const block = document.createElement('div');
            block.className = 'word-block';
            block.textContent = word;
            
            // Better positioning to avoid overlap
            const blockWidth = 100; // Approximate block width
            const leftPosition = Math.random() * (canvasWidth - blockWidth - 40) + 20;
            
            block.style.left = leftPosition + 'px';
            block.style.top = '-60px';
            
            // Controlled fall speed
            const fallDuration = 4 + Math.random() * 2; // 4-6 seconds
            block.style.animation = `fallDown ${fallDuration}s linear forwards, blockSpawn 0.5s ease-out`;
            
            block.addEventListener('click', () => this.hitWordBlock(block, word));
            canvas.appendChild(block);
            
            // Add small delay between blocks to prevent clustering
            if (i < numBlocks - 1) {
                setTimeout(() => {
                    // Continue spawning next block after delay
                }, 300 * (i + 1));
            }
        }
        
        // Spawn power-ups less frequently
        if (Math.random() < 0.15) {
            setTimeout(() => this.spawnPowerUp(), 1000);
        }
    }

    spawnPowerUp() {
        const powerTypes = [
            { type: 'speed', icon: '⚡', effect: 'Slow down blocks!' },
            { type: 'points', icon: '💎', effect: 'Double points!' },
            { type: 'life', icon: '❤️', effect: 'Extra life!' }
        ];
        
        const powerUp = powerTypes[Math.floor(Math.random() * powerTypes.length)];
        const canvas = document.querySelector('.blocks-canvas');
        const canvasRect = canvas.getBoundingClientRect();
        
        const powerElement = document.createElement('div');
        powerElement.className = `power-up ${powerUp.type}`;
        powerElement.textContent = powerUp.icon;
        powerElement.title = powerUp.effect;
        powerElement.style.left = Math.random() * (canvasRect.width - 40) + 'px';
        powerElement.style.top = '-50px';
        
        powerElement.addEventListener('click', () => this.collectPowerUp(powerElement, powerUp));
        canvas.appendChild(powerElement);
    }

    hitWordBlock(block, word) {
        const state = this.gameState.blocks;
        
        // Prevent multiple clicks on same block
        if (block.classList.contains('hit')) return;
        block.classList.add('hit');
        
        // Add points based on word length
        const points = word.length * 10;
        state.score += points;
        
        // Create floating score
        this.showFloatingScore(block, `+${points}`);
        
        // Remove block with destruction animation
        block.style.animation = 'blockDestroy 0.4s ease-out forwards';
        block.style.pointerEvents = 'none';
        
        setTimeout(() => {
            if (block.parentNode) {
                block.remove();
            }
        }, 400);
        
        this.updateBlocksUI();
        
        // Show brief success message
        const canvas = document.querySelector('.blocks-canvas .game-status');
        if (canvas) {
            canvas.textContent = `Great! +${points} points!`;
            setTimeout(() => {
                canvas.textContent = 'Click blocks to catch them!';
            }, 1500);
        }
    }

    collectPowerUp(element, powerUp) {
        const state = this.gameState.blocks;
        
        switch(powerUp.type) {
            case 'speed':
                // Slow down all blocks
                document.querySelectorAll('.word-block, .power-up').forEach(el => {
                    el.style.animationDuration = '6s';
                });
                break;
            case 'points':
                state.score += 100;
                break;
            case 'life':
                state.lives = Math.min(state.lives + 1, 5);
                break;
        }
        
        this.showFloatingScore(element, powerUp.effect);
        element.remove();
        this.updateBlocksUI();
    }

    gameLoop() {
        if (this.currentActivity !== 'blocks' || !this.gameState.blocks.isRunning) return;
        
        const canvas = document.querySelector('.blocks-canvas');
        if (!canvas) return;
        
        // Clean up blocks that fell off screen
        const blocks = canvas.querySelectorAll('.word-block, .power-up');
        
        blocks.forEach(block => {
            const blockTop = parseInt(block.style.top) || 0;
            
            // Check if block fell off screen (past canvas height)
            if (blockTop > 460) {
                if (block.classList.contains('word-block') && !block.classList.contains('hit')) {
                    // Only lose life for missed word blocks
                    this.gameState.blocks.lives--;
                    this.updateBlocksUI();
                    
                    // Show miss feedback
                    const statusEl = canvas.querySelector('.game-status');
                    if (statusEl) {
                        statusEl.textContent = `Missed! ${this.gameState.blocks.lives} lives left`;
                        statusEl.style.color = '#ff6b6b';
                        setTimeout(() => {
                            statusEl.textContent = 'Click blocks to catch them!';
                            statusEl.style.color = 'white';
                        }, 1500);
                    }
                    
                    if (this.gameState.blocks.lives <= 0) {
                        this.endBlocksGame();
                        return;
                    }
                }
                block.remove();
            }
        });
        
        this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
    }

    updateBlocksUI() {
        const state = this.gameState.blocks;
        const scoreEl = document.querySelector('#blocksScore');
        const livesEl = document.querySelector('#blocksLives');
        const levelEl = document.querySelector('#blocksLevel');
        
        if (scoreEl) scoreEl.textContent = state.score;
        if (livesEl) livesEl.textContent = state.lives;
        if (levelEl) levelEl.textContent = state.level;
    }

    endBlocksGame() {
        this.gameState.blocks.isRunning = false;
        this.stopAllGames();
        this.clearBlocksCanvas();
        
        const finalScore = this.gameState.blocks.score;
        const isNewRecord = this.saveHighScore('blocks', finalScore);
        
        // Show game over screen
        const canvas = document.querySelector('.blocks-canvas');
        if (canvas) {
            const statusEl = canvas.querySelector('.game-status');
            if (statusEl) {
                statusEl.innerHTML = `
                    <div style="text-align: center;">
                        <div style="font-size: 1.5rem; color: #ff6b6b; margin-bottom: 10px;">GAME OVER</div>
                        <div style="font-size: 1.2rem;">Final Score: ${finalScore}</div>
                        <div style="font-size: 0.9rem; margin-top: 5px;">
                            ${isNewRecord ? '🎉 NEW HIGH SCORE! 🎉' : `High Score: ${this.highScores.blocks}`}
                        </div>
                        <div style="font-size: 0.8rem; margin-top: 10px; color: #ccc;">
                            Click "Back to Activities" to play again
                        </div>
                    </div>
                `;
            }
        }
        
        if (!isNewRecord) {
            this.showFeedback(`Game Over! Final Score: ${finalScore} | High Score: ${this.highScores.blocks}`, 'info');
        }
    }

    // Feature Matcher Game
    initFeatureMatcher() {
        this.resetMatcherGame();
        this.setupMatcherTerms();
    }

    resetMatcherGame() {
        const state = this.gameState.matcher;
        state.score = 0;
        state.matches = 0;
        state.attempts = 0;
        state.selectedTerm = null;
        state.selectedDefinition = null;
        
        this.updateMatcherUI();
    }

    setupMatcherTerms() {
        const matchData = [
            { term: 'Visual Text', definition: 'Text that includes images, graphics, and visual elements' },
            { term: 'Virtual Text', definition: 'Digital or computer-based text content' },
            { term: 'Narrative', definition: 'A story or account of events' },
            { term: 'Character', definition: 'A person or being in a story' },
            { term: 'Setting', definition: 'Where and when a story takes place' },
            { term: 'Plot', definition: 'The main events of a story' }
        ];

        // Shuffle the arrays
        const shuffledTerms = [...matchData].sort(() => Math.random() - 0.5);
        const shuffledDefs = [...matchData].sort(() => Math.random() - 0.5);

        this.currentMatchData = matchData;
        this.renderMatcherItems(shuffledTerms, shuffledDefs);
    }

    renderMatcherItems(terms, definitions) {
        const termsContainer = document.querySelector('.matcher-terms');
        const defsContainer = document.querySelector('.matcher-definitions');
        
        termsContainer.innerHTML = '';
        defsContainer.innerHTML = '';

        terms.forEach((item, index) => {
            const termElement = document.createElement('div');
            termElement.className = 'matcher-item term';
            termElement.textContent = item.term;
            termElement.dataset.term = item.term;
            termElement.addEventListener('click', () => this.selectMatcherItem(termElement, 'term'));
            termsContainer.appendChild(termElement);
        });

        definitions.forEach((item, index) => {
            const defElement = document.createElement('div');
            defElement.className = 'matcher-item definition';
            defElement.textContent = item.definition;
            defElement.dataset.term = item.term;
            defElement.addEventListener('click', () => this.selectMatcherItem(defElement, 'definition'));
            defsContainer.appendChild(defElement);
        });
    }

    selectMatcherItem(element, type) {
        const state = this.gameState.matcher;
        
        // Remove previous selection of this type
        document.querySelectorAll(`.matcher-item.${type}.selected`).forEach(el => {
            el.classList.remove('selected');
        });
        
        // Select current item
        element.classList.add('selected');
        
        if (type === 'term') {
            state.selectedTerm = element;
        } else {
            state.selectedDefinition = element;
        }
        
        // Check for match if both selected
        if (state.selectedTerm && state.selectedDefinition) {
            this.checkMatch();
        }
    }

    checkMatch() {
        const state = this.gameState.matcher;
        const termData = state.selectedTerm.dataset.term;
        const defData = state.selectedDefinition.dataset.term;
        
        state.attempts++;
        
        if (termData === defData) {
            // Correct match!
            state.selectedTerm.classList.add('correct');
            state.selectedDefinition.classList.add('correct');
            state.matches++;
            state.score += 100;
            
            this.showFeedback('Perfect match! Well done! 🎉', 'success');
            
            // Remove matched items after animation
            setTimeout(() => {
                state.selectedTerm.style.opacity = '0.5';
                state.selectedDefinition.style.opacity = '0.5';
                state.selectedTerm.style.pointerEvents = 'none';
                state.selectedDefinition.style.pointerEvents = 'none';
            }, 500);
            
            // Check if all matches found
            if (state.matches === this.currentMatchData.length) {
                setTimeout(() => {
                    this.completeMatcherGame();
                }, 1500);
            }
        } else {
            // Incorrect match
            state.selectedTerm.classList.add('incorrect');
            state.selectedDefinition.classList.add('incorrect');
            
            this.showFeedback('Not quite right. Try again!', 'error');
            
            // Remove incorrect styling after animation
            setTimeout(() => {
                state.selectedTerm.classList.remove('incorrect', 'selected');
                state.selectedDefinition.classList.remove('incorrect', 'selected');
            }, 800);
        }
        
        // Clear selections
        state.selectedTerm = null;
        state.selectedDefinition = null;
        
        this.updateMatcherUI();
    }

    completeMatcherGame() {
        const state = this.gameState.matcher;
        const accuracy = Math.round((state.matches / state.attempts) * 100);
        const finalScore = state.score;
        const isNewRecord = this.saveHighScore('matcher', finalScore);
        
        if (!isNewRecord) {
            this.showFeedback(`Excellent! All matches found! Score: ${finalScore} | Accuracy: ${accuracy}%`, 'success');
        }
    }

    updateMatcherUI() {
        const state = this.gameState.matcher;
        const scoreEl = document.querySelector('#matcherScore');
        const matchesEl = document.querySelector('#matcherMatches');
        const attemptsEl = document.querySelector('#matcherAttempts');
        
        if (scoreEl) scoreEl.textContent = state.score;
        if (matchesEl) matchesEl.textContent = state.matches;
        if (attemptsEl) attemptsEl.textContent = state.attempts;
    }

    // Comic Panel Builder
    initComicBuilder() {
        this.resetComicBuilder();
        this.setupComicPanels();
    }

    resetComicBuilder() {
        const state = this.gameState.comic;
        state.panels = [];
        state.currentPanel = 0;
    }

    setupComicPanels() {
        const panels = document.querySelectorAll('.comic-panel .panel-content');
        
        panels.forEach((panel, index) => {
            panel.addEventListener('input', () => {
                this.updateComicProgress();
            });
            
            panel.addEventListener('focus', () => {
                panel.parentElement.style.transform = 'scale(1.05)';
                panel.parentElement.style.zIndex = '10';
            });
            
            panel.addEventListener('blur', () => {
                panel.parentElement.style.transform = 'scale(1)';
                panel.parentElement.style.zIndex = '1';
            });
        });
        
        // Add comic tools functionality
        this.addComicTools();
    }

    addComicTools() {
        const toolsContainer = document.querySelector('.comic-tools');
        
        const tools = [
            { name: 'Add Character', icon: '👤', action: () => this.addToPanel('New character enters...') },
            { name: 'Add Dialog', icon: '💬', action: () => this.addToPanel('"Hello there!"') },
            { name: 'Add Action', icon: '⚡', action: () => this.addToPanel('*Something exciting happens*') },
            { name: 'Clear Panel', icon: '🗑️', action: () => this.clearCurrentPanel() }
        ];
        
        toolsContainer.innerHTML = '';
        
        tools.forEach(tool => {
            const button = document.createElement('button');
            button.className = 'btn btn-secondary';
            button.innerHTML = `${tool.icon} ${tool.name}`;
            button.addEventListener('click', tool.action);
            toolsContainer.appendChild(button);
        });
    }

    addToPanel(text) {
        const activePanel = document.querySelector('.comic-panel .panel-content:focus') || 
                           document.querySelector('.comic-panel .panel-content');
        
        if (activePanel) {
            if (activePanel.textContent.trim()) {
                activePanel.textContent += '\n' + text;
            } else {
                activePanel.textContent = text;
            }
            this.updateComicProgress();
            this.showFeedback(`Added: ${text}`, 'success');
        }
    }

    clearCurrentPanel() {
        const activePanel = document.querySelector('.comic-panel .panel-content:focus') || 
                           document.querySelector('.comic-panel .panel-content');
        
        if (activePanel) {
            activePanel.textContent = '';
            this.updateComicProgress();
            this.showFeedback('Panel cleared!', 'info');
        }
    }

    updateComicProgress() {
        const panels = document.querySelectorAll('.comic-panel .panel-content');
        const filledPanels = Array.from(panels).filter(panel => panel.textContent.trim().length > 0);
        
        const progress = Math.round((filledPanels.length / panels.length) * 100);
        const progressEl = document.querySelector('#comicProgress');
        if (progressEl) {
            progressEl.textContent = `${progress}%`;
        }
        
        if (progress === 100 && !this.gameState.comic.completed) {
            this.gameState.comic.completed = true;
            // Calculate score based on content length and creativity
            const totalWords = Array.from(panels).reduce((total, panel) => {
                return total + panel.textContent.trim().split(/\s+/).length;
            }, 0);
            const comicScore = Math.min(totalWords * 10, 1000); // Max 1000 points
            
            this.saveHighScore('comic', comicScore);
            this.showFeedback(`Amazing! Your comic story is complete! Score: ${comicScore} points! 🎨`, 'success');
        }
    }

    // Speed Typing Challenge
    initSpeedTyping() {
        this.resetTypingGame();
        this.startTypingChallenge();
    }

    resetTypingGame() {
        const state = this.gameState.typing;
        state.score = 0;
        state.wpm = 0;
        state.accuracy = 100;
        state.currentWord = 0;
        state.startTime = null;
        state.errors = 0;
        state.totalTyped = 0;
        
        this.updateTypingUI();
    }

    startTypingChallenge() {
        this.typingWords = [
            { word: 'ADVENTURE', definition: 'An exciting journey or experience' },
            { word: 'MYSTERY', definition: 'Something that is difficult to understand' },
            { word: 'FRIENDSHIP', definition: 'A close relationship between people' },
            { word: 'COURAGE', definition: 'Bravery in the face of difficulty' },
            { word: 'IMAGINATION', definition: 'The ability to form mental images' },
            { word: 'DISCOVERY', definition: 'Finding something new' }
        ];
        
        this.showNextWord();
        this.setupTypingInput();
    }

    showNextWord() {
        const state = this.gameState.typing;
        
        if (state.currentWord >= this.typingWords.length) {
            this.completeTypingGame();
            return;
        }
        
        const currentWordData = this.typingWords[state.currentWord];
        const wordEl = document.querySelector('#currentWord');
        const defEl = document.querySelector('#wordDefinition');
        
        if (wordEl) wordEl.textContent = currentWordData.word;
        if (defEl) defEl.textContent = currentWordData.definition;
        
        // Update progress
        const progress = Math.round((state.currentWord / this.typingWords.length) * 100);
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('#typingProgress');
        
        if (progressFill) progressFill.style.width = progress + '%';
        if (progressText) progressText.textContent = `Word ${state.currentWord + 1} of ${this.typingWords.length}`;
    }

    setupTypingInput() {
        const input = document.querySelector('#typingInput');
        input.value = '';
        input.focus();
        
        input.addEventListener('input', (e) => {
            this.handleTypingInput(e.target.value);
        });
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitTypedWord();
            }
        });
    }

    handleTypingInput(value) {
        const state = this.gameState.typing;
        
        if (!state.startTime) {
            state.startTime = Date.now();
        }
        
        const currentWord = this.typingWords[state.currentWord].word;
        const input = document.querySelector('#typingInput');
        
        // Check if typed correctly so far
        const isCorrect = currentWord.startsWith(value.toUpperCase());
        
        if (isCorrect) {
            input.style.borderColor = '#51cf66';
            input.style.backgroundColor = '#f0f9ff';
        } else {
            input.style.borderColor = '#ff6b6b';
            input.style.backgroundColor = '#fef2f2';
        }
        
        state.totalTyped++;
    }

    submitTypedWord() {
        const state = this.gameState.typing;
        const input = document.querySelector('#typingInput');
        const typedWord = input.value.toUpperCase().trim();
        const correctWord = this.typingWords[state.currentWord].word;
        
        if (typedWord === correctWord) {
            // Correct!
            const timeBonus = this.calculateTimeBonus();
            const points = correctWord.length * 10 + timeBonus;
            state.score += points;
            
            this.showFeedback(`Perfect! +${points} points (including time bonus)`, 'success');
            
            state.currentWord++;
            this.showNextWord();
            
            // Reset input
            input.value = '';
            input.style.borderColor = '#667eea';
            input.style.backgroundColor = 'white';
            
        } else {
            // Incorrect
            state.errors++;
            this.showFeedback('Try again! Check the spelling.', 'error');
        }
        
        this.calculateStats();
        this.updateTypingUI();
    }

    calculateTimeBonus() {
        const state = this.gameState.typing;
        if (!state.startTime) return 0;
        
        const timeElapsed = (Date.now() - state.startTime) / 1000;
        const maxBonus = 50;
        const timeBonus = Math.max(0, maxBonus - Math.floor(timeElapsed * 2));
        
        return timeBonus;
    }

    calculateStats() {
        const state = this.gameState.typing;
        
        if (state.startTime && state.totalTyped > 0) {
            const timeElapsed = (Date.now() - state.startTime) / 1000 / 60; // minutes
            const wordsTyped = state.currentWord;
            
            state.wpm = Math.round(wordsTyped / timeElapsed) || 0;
            state.accuracy = Math.round(((state.totalTyped - state.errors) / state.totalTyped) * 100) || 100;
        }
    }

    completeTypingGame() {
        const state = this.gameState.typing;
        const finalScore = state.score;
        const isNewRecord = this.saveHighScore('typing', finalScore);
        
        if (!isNewRecord) {
            this.showFeedback(`Challenge Complete! Score: ${finalScore} | WPM: ${state.wpm} | Accuracy: ${state.accuracy}%`, 'success');
        }
        
        const input = document.querySelector('#typingInput');
        if (input) input.disabled = true;
    }

    updateTypingUI() {
        const state = this.gameState.typing;
        const scoreEl = document.querySelector('#typingScore');
        const wpmEl = document.querySelector('#typingWPM');
        const accuracyEl = document.querySelector('#typingAccuracy');
        
        if (scoreEl) scoreEl.textContent = state.score;
        if (wpmEl) wpmEl.textContent = state.wpm;
        if (accuracyEl) accuracyEl.textContent = state.accuracy + '%';
    }

    // Utility Functions
    showFloatingScore(element, text) {
        const floatingScore = document.createElement('div');
        floatingScore.textContent = text;
        floatingScore.style.cssText = `
            position: absolute;
            color: #ffd700;
            font-weight: bold;
            font-size: 1.2rem;
            pointer-events: none;
            z-index: 1000;
            animation: floatUp 2s ease-out forwards;
        `;
        
        const rect = element.getBoundingClientRect();
        floatingScore.style.left = rect.left + 'px';
        floatingScore.style.top = rect.top + 'px';
        
        document.body.appendChild(floatingScore);
        
        setTimeout(() => floatingScore.remove(), 2000);
        
        // Add CSS for floating animation if not exists
        if (!document.querySelector('#floatingAnimation')) {
            const style = document.createElement('style');
            style.id = 'floatingAnimation';
            style.textContent = `
                @keyframes floatUp {
                    0% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-50px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    showFeedback(message, type = 'info') {
        // Find the feedback box in the current activity
        let feedbackBox = null;
        if (this.currentActivity) {
            feedbackBox = document.querySelector(`#${this.currentActivity}Activity .feedback-box`);
        }
        
        // Fallback to any feedback box
        if (!feedbackBox) {
            feedbackBox = document.querySelector('.feedback-box');
        }
        
        if (feedbackBox) {
            feedbackBox.textContent = message;
            feedbackBox.className = `feedback-box ${type}`;
            
            // Auto-clear after 3 seconds
            setTimeout(() => {
                feedbackBox.textContent = '';
                feedbackBox.className = 'feedback-box';
            }, 3000);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.activitiesManager = new ActivitiesManager();
});

// Add keyboard controls for better accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && window.activitiesManager) {
        window.activitiesManager.showActivitySelection();
    }
});

// Add mouse paddle control for blocks game
document.addEventListener('mousemove', (e) => {
    if (window.activitiesManager && window.activitiesManager.currentActivity === 'blocks') {
        const paddle = document.querySelector('.blocks-paddle');
        const canvas = document.querySelector('.blocks-canvas');
        
        if (paddle && canvas) {
            const canvasRect = canvas.getBoundingClientRect();
            const paddleWidth = paddle.offsetWidth;
            const mouseX = e.clientX - canvasRect.left;
            const maxX = canvasRect.width - paddleWidth;
            
            const paddleX = Math.max(0, Math.min(maxX, mouseX - paddleWidth / 2));
            paddle.style.left = paddleX + 'px';
        }
    }
});

// Global function for back buttons (called from HTML onclick)
function showActivitySelection() {
    if (window.activitiesManager) {
        window.activitiesManager.showActivitySelection();
    }
}