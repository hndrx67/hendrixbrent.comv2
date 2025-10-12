/**
 * Interactive Games for Learning Visual and Virtual Texts
 * Designed for Elementary Students - Fun and Educational!
 */

(function() {
    'use strict';

    // Game Data
    const gameData = {
        quiz: {
            questions: [
                {
                    question: "What grabs your attention first on a poster?",
                    options: [
                        "Small text at the bottom",
                        "Big, colorful headline",
                        "The border design",
                        "Page numbers"
                    ],
                    correct: 1,
                    explanation: "🎯 Correct! Headlines use big, bold text and bright colors to catch your eye first!"
                },
                {
                    question: "What do speech bubbles tell you in a comic?",
                    options: [
                        "Who is talking",
                        "What time it is", 
                        "The story's name",
                        "How loud it is"
                    ],
                    correct: 0,
                    explanation: "💬 Yes! Speech bubbles point to characters to show who's speaking!"
                },
                {
                    question: "Why do websites have menus at the top?",
                    options: [
                        "To look pretty",
                        "To help you find different pages",
                        "To show ads",
                        "To play sounds"
                    ],
                    correct: 1,
                    explanation: "🧭 Exactly! Navigation menus help you explore different parts of a website!"
                },
                {
                    question: "What makes infographics easy to read?",
                    options: [
                        "Lots of long sentences",
                        "Pictures, icons, and short text",
                        "Only black and white colors",
                        "No images at all"
                    ],
                    correct: 1,
                    explanation: "🌈 Perfect! Infographics use visuals and short text to make information fun and clear!"
                },
                {
                    question: "What is a 'call-to-action' button?",
                    options: [
                        "A phone to make calls",
                        "A button that tells you what to do next",
                        "A volume control",
                        "A game controller"
                    ],
                    correct: 1,
                    explanation: "🎯 Right! These buttons guide you to take action, like 'Click Here' or 'Learn More'!"
                },
                {
                    question: "Why do comic panels have spaces between them?",
                    options: [
                        "To waste paper",
                        "To show time passing",
                        "To add more colors", 
                        "To confuse readers"
                    ],
                    correct: 1,
                    explanation: "⏰ Correct! The spaces (called gutters) help show that time is passing between scenes!"
                },
                {
                    question: "What does a QR code do on a poster?",
                    options: [
                        "Decorates the poster",
                        "Links to more information online",
                        "Shows the date",
                        "Nothing special"
                    ],
                    correct: 1,
                    explanation: "📱 Yes! QR codes connect paper posters to digital content when you scan them!"
                },
                {
                    question: "How do colors help in visual design?",
                    options: [
                        "Colors don't matter",
                        "They create feelings and grab attention",
                        "They make things expensive",
                        "They only look nice"
                    ],
                    correct: 1,
                    explanation: "🎨 Amazing! Colors create emotions - red excites, blue calms, yellow grabs attention!"
                }
            ]
        },
        
        match: {
            rounds: [
                {
                    title: "Poster Parts",
                    pairs: [
                        { term: "Headline", definition: "Big text that tells the main idea" },
                        { term: "Caption", definition: "Small text explaining a picture" },
                        { term: "Icon", definition: "Small picture showing an idea" },
                        { term: "Logo", definition: "Symbol that represents a brand" }
                    ]
                },
                {
                    title: "Comic Elements",
                    pairs: [
                        { term: "Speech Bubble", definition: "Shows what characters are saying" },
                        { term: "Panel", definition: "Box containing one scene" },
                        { term: "Gutter", definition: "Space between comic panels" },
                        { term: "Sound Effect", definition: "Visual text showing noises like BOOM!" }
                    ]
                },
                {
                    title: "Website Features",
                    pairs: [
                        { term: "Navigation", definition: "Menu to move around the site" },
                        { term: "Hyperlink", definition: "Clickable text to go to another page" },
                        { term: "Button", definition: "Clickable element to do an action" },
                        { term: "Footer", definition: "Bottom section with extra information" }
                    ]
                }
            ]
        },

        story: {
            scenarios: [
                {
                    title: "Making a School Poster",
                    description: "Put these steps in the right order to create an awesome school poster:",
                    steps: [
                        "Choose your main message (what do you want to say?)",
                        "Pick eye-catching pictures or drawings",
                        "Write a big, bold headline",
                        "Add important details in smaller text",
                        "Include a call-to-action (what should people do?)"
                    ]
                },
                {
                    title: "Reading a Comic Strip",
                    description: "Put these steps in order to read a comic the right way:",
                    steps: [
                        "Start at the top-left panel",
                        "Read speech bubbles from left to right", 
                        "Look at character faces and emotions",
                        "Move to the next panel in order",
                        "Connect all the panels to understand the story"
                    ]
                },
                {
                    title: "Creating a Website",
                    description: "Order these steps to build a great website:",
                    steps: [
                        "Plan what visitors need to see first",
                        "Create a clear navigation menu",
                        "Add a welcoming main image",
                        "Include important content sections",
                        "Test it works on phones and computers"
                    ]
                }
            ]
        },

        design: { painter: true }
    };

    // Game State
    let currentGame = null;
    let gameStates = {
        quiz: { currentQuestion: 0, score: 0, answered: false },
        match: { currentRound: 0, matches: {}, selectedTerm: null },
        story: { currentScenario: 0, currentOrder: [] },
    design: { tool: 'brush', color: '#1f2937', size: 16, textSize: 48, undoStack: [], isDrawing: false, lastPoint: null }
    };

    // Initialize all games when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeGameSelection();
        initializeQuizGame();
        initializeMatchGame();
        initializeStoryGame();
    initializeDesignGame();
    });

    // Game Selection Functions
    function initializeGameSelection() {
        const gameCards = document.querySelectorAll('.game-card-preview');
        
        gameCards.forEach(card => {
            const playBtn = card.querySelector('.play-btn');
            const gameType = card.dataset.game;
            
            if (playBtn) {
                playBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    showGame(gameType);
                });
            }
            
            // Also make the whole card clickable
            card.addEventListener('click', (e) => {
                if (e.target === playBtn || e.target.closest('.play-btn')) return;
                showGame(gameType);
            });
        });
    }

    function showGame(gameType) {
        // Hide game selection
        const gameSelection = document.getElementById('gameSelection');
        if (gameSelection) {
            gameSelection.style.display = 'none';
        }

        // Show specific game container
        const gameContainer = document.getElementById(`${gameType}GameContainer`);
        if (gameContainer) {
            gameContainer.style.display = 'block';
            gameContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Initialize the specific game if needed
        switch(gameType) {
            case 'quiz':
                resetQuizGame();
                break;
            case 'match':
                loadMatchRound();
                break;
            case 'story':
                loadStoryScenario();
                break;
            case 'design':
                setupPosterPainter();
                break;
        }
    }

    // Global function to show game selection (called from back buttons)
    window.showGameSelection = function() {
        // Hide all game containers
        document.querySelectorAll('.game-container').forEach(container => {
            container.style.display = 'none';
        });

        // Show game selection
        const gameSelection = document.getElementById('gameSelection');
        if (gameSelection) {
            gameSelection.style.display = 'grid';
            gameSelection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Quiz Game Functions
    function initializeQuizGame() {
        const quizNextBtn = document.getElementById('quizNextBtn');
        const quizRetryBtn = document.getElementById('quizRetry');

        if (quizNextBtn) {
            quizNextBtn.addEventListener('click', handleQuizNext);
        }
        if (quizRetryBtn) {
            quizRetryBtn.addEventListener('click', resetQuizGame);
        }

        loadQuizQuestion();
    }

    function loadQuizQuestion() {
        const state = gameStates.quiz;
        const question = gameData.quiz.questions[state.currentQuestion];
        
        if (!question) {
            showQuizResults();
            return;
        }

        const questionEl = document.getElementById('quizQuestion');
        const optionsEl = document.getElementById('quizOptions');
        const progressEl = document.getElementById('quizProgress');
        const questionNumberEl = document.getElementById('questionNumber');
        const feedbackEl = document.getElementById('quizFeedback');

        if (questionNumberEl) {
            questionNumberEl.textContent = `Question ${state.currentQuestion + 1}`;
        }

        if (questionEl) {
            questionEl.textContent = question.question;
        }

        if (optionsEl) {
            optionsEl.innerHTML = '';
            question.options.forEach((option, index) => {
                const label = document.createElement('label');
                label.innerHTML = `
                    <input type="radio" name="quizAnswer" value="${index}">
                    <span>${option}</span>
                `;
                optionsEl.appendChild(label);
            });
        }

        if (progressEl) {
            progressEl.textContent = `${state.currentQuestion + 1} of ${gameData.quiz.questions.length}`;
        }

        if (feedbackEl) {
            feedbackEl.textContent = '';
            feedbackEl.className = 'feedback-box';
        }

        state.answered = false;
        updateQuizButton();
    }

    function handleQuizNext() {
        const state = gameStates.quiz;
        
        if (!state.answered) {
            checkQuizAnswer();
        } else {
            state.currentQuestion++;
            loadQuizQuestion();
        }
    }

    function checkQuizAnswer() {
        const selectedOption = document.querySelector('input[name="quizAnswer"]:checked');
        const feedbackEl = document.getElementById('quizFeedback');
        
        if (!selectedOption) {
            showFeedback(feedbackEl, '❗ Please select an answer!', 'error');
            return;
        }

        const state = gameStates.quiz;
        const question = gameData.quiz.questions[state.currentQuestion];
        const isCorrect = parseInt(selectedOption.value) === question.correct;

        if (isCorrect) {
            state.score++;
            showFeedback(feedbackEl, question.explanation, 'success');
            playSound('correct');
        } else {
            showFeedback(feedbackEl, `❌ ${question.explanation}`, 'error');
            playSound('incorrect');
        }

        // Disable all options
        document.querySelectorAll('input[name="quizAnswer"]').forEach(input => {
            input.disabled = true;
        });

        state.answered = true;
        updateQuizButton();
    }

    function updateQuizButton() {
        const button = document.getElementById('quizNextBtn');
        if (!button) return;

        const state = gameStates.quiz;
        const isLastQuestion = state.currentQuestion >= gameData.quiz.questions.length - 1;
        
        if (state.answered) {
            if (isLastQuestion) {
                button.innerHTML = '<span>See Results</span><span class="btn-icon">🏆</span>';
            } else {
                button.innerHTML = '<span>Next Question</span><span class="btn-icon">➡️</span>';
            }
        } else {
            button.innerHTML = '<span>Check Answer</span><span class="btn-icon">🔎</span>';
        }
    }

    function showQuizResults() {
        const cardEl = document.getElementById('quizCard');
        const resultEl = document.getElementById('quizResult');
        const scoreEl = document.getElementById('quizScore');
        
        if (cardEl) cardEl.hidden = true;
        if (resultEl) resultEl.hidden = false;
        
        const state = gameStates.quiz;
        const totalQuestions = gameData.quiz.questions.length;
        const percentage = Math.round((state.score / totalQuestions) * 100);
        
        if (scoreEl) {
            scoreEl.innerHTML = `
                You solved <strong>${state.score} out of ${totalQuestions}</strong> mysteries!<br>
                That's ${percentage}%! 
                ${percentage >= 80 ? '🌟 Outstanding Detective!' : 
                  percentage >= 60 ? '🕵️ Good Detective Work!' : 
                  '🔍 Keep Investigating!'}
            `;
        }

        if (percentage >= 80) {
            createCelebration();
            playSound('victory');
        }

        // Record score if login is available
        safeRecordScore('quiz', percentage, `${state.score}/${totalQuestions} correct`);
    }

    function resetQuizGame() {
        gameStates.quiz = { currentQuestion: 0, score: 0, answered: false };
        const cardEl = document.getElementById('quizCard');
        const resultEl = document.getElementById('quizResult');
        
        if (cardEl) cardEl.hidden = false;
        if (resultEl) resultEl.hidden = true;
        
        loadQuizQuestion();
    }

    // Match Game Functions
    function initializeMatchGame() {
        const checkBtn = document.getElementById('matchCheckBtn');
        const newBtn = document.getElementById('matchNewBtn');

        if (checkBtn) {
            checkBtn.addEventListener('click', checkMatches);
        }
        if (newBtn) {
            newBtn.addEventListener('click', loadNewMatchRound);
        }

        loadMatchRound();
    }

    function loadMatchRound() {
        const state = gameStates.match;
        const round = gameData.match.rounds[state.currentRound];
        
        const termsEl = document.getElementById('matchTerms');
        const definitionsEl = document.getElementById('matchDefinitions');
        const feedbackEl = document.getElementById('matchFeedback');

        if (feedbackEl) {
            feedbackEl.textContent = `Match each ${round.title.toLowerCase()} with its meaning:`;
            feedbackEl.className = 'feedback-box info';
        }

        // Reset state
        state.matches = {};
        state.selectedTerm = null;

        if (termsEl && definitionsEl) {
            termsEl.innerHTML = '<h4>Terms</h4>';
            definitionsEl.innerHTML = '<h4>Definitions</h4>';

            // Create shuffled arrays
            const shuffledTerms = shuffle([...round.pairs]);
            const shuffledDefs = shuffle(round.pairs.map(pair => pair.definition));

            // Create term buttons
            shuffledTerms.forEach(pair => {
                const button = document.createElement('button');
                button.className = 'match-item';
                button.textContent = pair.term;
                button.dataset.term = pair.term;
                button.addEventListener('click', () => selectTerm(button));
                termsEl.appendChild(button);
            });

            // Create definition buttons
            shuffledDefs.forEach(definition => {
                const button = document.createElement('button');
                button.className = 'match-item';
                button.textContent = definition;
                button.dataset.definition = definition;
                button.addEventListener('click', () => selectDefinition(button));
                definitionsEl.appendChild(button);
            });
        }
    }

    function selectTerm(button) {
        const state = gameStates.match;
        
        // Clear previous selection
        document.querySelectorAll('.match-item.selected').forEach(item => {
            item.classList.remove('selected');
        });
        
        button.classList.add('selected');
        state.selectedTerm = button.dataset.term;
    }

    function selectDefinition(button) {
        const state = gameStates.match;
        
        if (!state.selectedTerm) {
            showFeedback(document.getElementById('matchFeedback'), '👆 Select a term first!', 'error');
            return;
        }

        // Make the match
        state.matches[state.selectedTerm] = button.dataset.definition;
        
        // Update UI
        const termButton = document.querySelector(`[data-term="${state.selectedTerm}"]`);
        if (termButton) {
            termButton.classList.remove('selected');
            termButton.classList.add('matched');
            termButton.disabled = true;
        }
        
        button.classList.add('matched');
        button.disabled = true;

        state.selectedTerm = null;
        
        showFeedback(document.getElementById('matchFeedback'), `✅ Matched: ${Object.keys(state.matches).length} of ${gameData.match.rounds[state.currentRound].pairs.length}`, 'info');
    }

    function checkMatches() {
        const state = gameStates.match;
        const round = gameData.match.rounds[state.currentRound];
        const feedbackEl = document.getElementById('matchFeedback');
        
        let correct = 0;
        
        round.pairs.forEach(pair => {
            const matched = state.matches[pair.term];
            const termButton = document.querySelector(`[data-term="${pair.term}"]`);
            const defButton = document.querySelector(`[data-definition="${matched}"]`);
            
            if (matched === pair.definition) {
                correct++;
                if (termButton) termButton.classList.add('correct');
                if (defButton) defButton.classList.add('correct');
            } else {
                if (termButton) termButton.classList.add('incorrect');
                if (defButton) defButton.classList.add('incorrect');
            }
        });

        const total = round.pairs.length;
        if (correct === total) {
            showFeedback(feedbackEl, `🏆 Perfect! All ${total} matches are correct!`, 'success');
            playSound('victory');
            createCelebration();
        } else {
            showFeedback(feedbackEl, `💪 You got ${correct} out of ${total} correct. Try the next round!`, 'error');
            playSound('incorrect');
        }

        const percent = Math.round((correct / total) * 100);
        safeRecordScore('match', percent, `${correct}/${total} correct`);
    }

    function loadNewMatchRound() {
        const state = gameStates.match;
        state.currentRound = (state.currentRound + 1) % gameData.match.rounds.length;
        loadMatchRound();
    }

    // Story Game Functions
    function initializeStoryGame() {
        const checkBtn = document.getElementById('storyCheckBtn');
        const newBtn = document.getElementById('storyNewBtn');

        if (checkBtn) {
            checkBtn.addEventListener('click', checkStoryOrder);
        }
        if (newBtn) {
            newBtn.addEventListener('click', loadNewStoryScenario);
        }

        loadStoryScenario();
    }

    function loadStoryScenario() {
        const state = gameStates.story;
        const scenario = gameData.story.scenarios[state.currentScenario];
        
        const promptEl = document.getElementById('storyPrompt');
        const containerEl = document.getElementById('panelsContainer');
        const feedbackEl = document.getElementById('storyFeedback');

        if (promptEl) {
            promptEl.innerHTML = `<strong>${scenario.title}</strong><br>${scenario.description}`;
        }

        if (feedbackEl) {
            feedbackEl.textContent = 'Drag the panels to arrange them in the correct order!';
            feedbackEl.className = 'feedback-box info';
        }

        if (containerEl) {
            containerEl.innerHTML = '';
            
            // Shuffle the steps
            const shuffledSteps = shuffle([...scenario.steps]);
            state.currentOrder = [...shuffledSteps];
            
            shuffledSteps.forEach((step, index) => {
                const panel = document.createElement('div');
                panel.className = 'story-panel';
                panel.textContent = step;
                panel.dataset.number = index + 1;
                panel.dataset.step = step;
                panel.draggable = true;
                
                panel.addEventListener('dragstart', handleDragStart);
                panel.addEventListener('dragover', handleDragOver);
                panel.addEventListener('drop', handleDrop);
                panel.addEventListener('dragend', handleDragEnd);
                
                containerEl.appendChild(panel);
            });
        }
    }

    let draggedElement = null;

    function handleDragStart(e) {
        draggedElement = e.target;
        e.target.classList.add('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDrop(e) {
        e.preventDefault();
        if (draggedElement !== e.target) {
            swapElements(draggedElement, e.target);
        }
    }

    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
        draggedElement = null;
    }

    function swapElements(elem1, elem2) {
        const parent = elem1.parentNode;
        const next1 = elem1.nextSibling;
        const next2 = elem2.nextSibling;
        
        if (next1 === elem2) {
            parent.insertBefore(elem2, elem1);
        } else if (next2 === elem1) {
            parent.insertBefore(elem1, elem2);
        } else {
            if (next1) {
                parent.insertBefore(elem2, next1);
            } else {
                parent.appendChild(elem2);
            }
            
            if (next2) {
                parent.insertBefore(elem1, next2);
            } else {
                parent.appendChild(elem1);
            }
        }
        
        updateStoryOrder();
    }

    function updateStoryOrder() {
        const panels = document.querySelectorAll('.story-panel');
        const state = gameStates.story;
        
        state.currentOrder = Array.from(panels).map(panel => panel.dataset.step);
        
        // Update panel numbers
        panels.forEach((panel, index) => {
            panel.dataset.number = index + 1;
        });
    }

    function checkStoryOrder() {
        const state = gameStates.story;
        const scenario = gameData.story.scenarios[state.currentScenario];
        const feedbackEl = document.getElementById('storyFeedback');
        
        const correct = state.currentOrder.every((step, index) => step === scenario.steps[index]);
        
        if (correct) {
            showFeedback(feedbackEl, '🎯 Perfect! You created the story in the right order!', 'success');
            playSound('victory');
            createCelebration();
        } else {
            const correctCount = state.currentOrder.filter((step, index) => step === scenario.steps[index]).length;
            showFeedback(feedbackEl, `📝 You have ${correctCount} out of ${scenario.steps.length} panels in the right place. Keep trying!`, 'error');
            playSound('incorrect');
        }

        const correctCount = state.currentOrder.filter((step, index) => step === scenario.steps[index]).length;
        const percent = Math.round((correctCount / scenario.steps.length) * 100);
        safeRecordScore('story', percent, `${correctCount}/${scenario.steps.length} correct order`);
    }

    function loadNewStoryScenario() {
        const state = gameStates.story;
        state.currentScenario = (state.currentScenario + 1) % gameData.story.scenarios.length;
        loadStoryScenario();
    }

    // Design Game Functions
    function initializeDesignGame() {
        // No-op on load; actual setup happens when the section is shown
        setupPosterPainter();
    }

    // Poster Painter Implementation
    let canvas, ctx, wrap, textOverlay;
    let pointerDown = false;
    let emojiMode = false;

    function setupPosterPainter() {
        canvas = document.getElementById('posterCanvas');
        wrap = document.getElementById('posterCanvasWrap');
        textOverlay = document.getElementById('textOverlay');

        if (!canvas || !wrap) return;

        ctx = canvas.getContext('2d');
        setCanvasSize();
    drawPosterBackground();
        bindPainterUI();
        window.addEventListener('resize', setCanvasSize);
    }

    function setCanvasSize() {
        if (!wrap || !canvas) return;
    // Maintain a 16:3 ultra-wide canvas with high pixel density for crisp lines
    const containerWidth = wrap.clientWidth;
    let width = containerWidth - 16; // account for inner padding
    let height = Math.round(width * 5 / 16);

        // Prevent canvas from exceeding viewport height (minus header/toolbars)
        const maxHeight = Math.max(320, Math.floor(window.innerHeight * 0.7));
        if (height > maxHeight) {
            height = maxHeight;
            width = Math.round(height * 16 / 5);
        }
        const dpr = window.devicePixelRatio || 1;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        if (ctx) {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            redrawFromStack();
        }
    }

    function drawPosterBackground() {
        if (!ctx || !canvas) return;
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
        pushUndo();
    }

    function bindPainterUI() {
        const toolbar = document.getElementById('posterToolbar');
        const emojiGrid = document.getElementById('emojiGrid');
        const colorPicker = document.getElementById('colorPicker');
        const sizeRange = document.getElementById('sizeRange');
        const textSizeRange = document.getElementById('textSizeRange');
        const undoBtn = document.getElementById('undoBtn');
        const clearBtn = document.getElementById('clearBtn');
        const saveBtn = document.getElementById('saveBtn');

        // Tools
        toolbar?.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
            btn.addEventListener('click', () => {
                toolbar.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const tool = btn.getAttribute('data-tool');
                gameStates.design.tool = tool;
                emojiMode = tool === 'emoji';
                if (tool !== 'text' && textOverlay) {
                    textOverlay.hidden = true;
                }
            });
        });

        colorPicker?.addEventListener('input', e => {
            gameStates.design.color = e.target.value;
        });
        sizeRange?.addEventListener('input', e => {
            gameStates.design.size = parseInt(e.target.value, 10) || 16;
        });
        textSizeRange?.addEventListener('input', e => {
            gameStates.design.textSize = parseInt(e.target.value, 10) || 48;
        });

        // Emoji picker
        emojiGrid?.addEventListener('click', e => {
            const btn = e.target.closest('.emoji-btn');
            if (!btn) return;
            selectedEmoji = btn.textContent;
            gameStates.design.tool = 'emoji';
            toolbar?.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
            toolbar?.querySelector('.tool-btn[data-tool="emoji"]').classList.add('active');
            emojiMode = true;
        });

        // Undo / Clear / Save
        undoBtn?.addEventListener('click', undo);
        clearBtn?.addEventListener('click', () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawPosterBackground();
        });
        saveBtn?.addEventListener('click', saveImage);

        // Canvas interactions
        canvas.addEventListener('pointerdown', onPointerDown);
        canvas.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);

        // Keyboard shortcuts
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                undo();
            }
            if (e.key.toLowerCase() === 'b') setTool('brush');
            if (e.key.toLowerCase() === 'e') setTool('eraser');
            if (e.key.toLowerCase() === 't') setTool('text');
            if (e.key.toLowerCase() === 'm') setTool('emoji');
        });

        // Text overlay confirm
        textOverlay?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                placeTextFromOverlay();
            } else if (e.key === 'Escape') {
                textOverlay.hidden = true;
            }
        });
    }

    function setTool(tool) {
        const toolbar = document.getElementById('posterToolbar');
        const btn = toolbar?.querySelector(`.tool-btn[data-tool="${tool}"]`);
        if (btn) btn.click();
    }

    function canvasPoint(evt) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: Math.round(evt.clientX - rect.left),
            y: Math.round(evt.clientY - rect.top)
        };
    }

    function onPointerDown(evt) {
        if (!ctx) return;
        const state = gameStates.design;
        const p = canvasPoint(evt);
        pointerDown = true;
        state.lastPoint = p;

        if (state.tool === 'emoji') {
            stampEmoji(p.x, p.y);
            pushUndo();
            pointerDown = false;
            return;
        }

        if (state.tool === 'text') {
            showTextOverlay(p.x, p.y);
            return;
        }

        // Start path for brush/eraser
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        drawStroke(p.x, p.y, true);
    }

    function onPointerMove(evt) {
        if (!pointerDown || !ctx) return;
        const p = canvasPoint(evt);
        drawStroke(p.x, p.y, false);
    }

    function onPointerUp() {
        if (!pointerDown) return;
        pointerDown = false;
        pushUndo();
    }

    function drawStroke(x, y, start) {
        const state = gameStates.design;
        if (!ctx) return;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = state.size;
        if (state.tool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0,0,0,1)';
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = state.color;
        }
        if (start) return; // already movedTo
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    let selectedEmoji = '⭐️';
    function stampEmoji(x, y) {
        if (!ctx) return;
        const size = gameStates.design.size * 2;
        ctx.save();
        ctx.font = `${size}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(selectedEmoji, x, y);
        ctx.restore();
    }

    function showTextOverlay(x, y) {
        if (!textOverlay) return;
        textOverlay.hidden = false;
        textOverlay.style.left = x + 'px';
        textOverlay.style.top = y + 'px';
        textOverlay.value = '';
        textOverlay.focus();
    }

    function placeTextFromOverlay() {
        if (!ctx || !textOverlay) return;
        const value = textOverlay.value.trim();
        textOverlay.hidden = true;
        if (!value) return;
        const x = parseInt(textOverlay.style.left, 10);
        const y = parseInt(textOverlay.style.top, 10);
        const size = gameStates.design.textSize;
        ctx.save();
        ctx.fillStyle = gameStates.design.color;
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.lineWidth = Math.max(1, Math.round(size / 12));
        ctx.font = `bold ${size}px "Baloo 2", "Nunito", sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.strokeText(value, x, y);
        ctx.fillText(value, x, y);
        ctx.restore();
        pushUndo();
    }

    function pushUndo() {
        if (!canvas) return;
        try {
            const data = canvas.toDataURL('image/png');
            const stack = gameStates.design.undoStack;
            stack.push(data);
            if (stack.length > 20) stack.shift();
        } catch {}
    }

    function undo() {
        const stack = gameStates.design.undoStack;
        if (stack.length <= 1 || !ctx) return;
        // pop current, restore previous
        stack.pop();
        const url = stack[stack.length - 1];
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width / (window.devicePixelRatio||1), canvas.height / (window.devicePixelRatio||1));
        };
        img.src = url;
    }

    function redrawFromStack() {
        const stack = gameStates.design.undoStack;
        if (!ctx) return;
        if (!stack.length) {
            drawPosterBackground();
            return;
        }
        const url = stack[stack.length - 1];
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width / (window.devicePixelRatio||1), canvas.height / (window.devicePixelRatio||1));
        };
        img.src = url;
    }

    function saveImage() {
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = 'my-poster.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        // Count a successful poster as a completed attempt
        safeRecordScore('poster', 100, 'Poster saved');
    }

    function safeRecordScore(key, percent, detail) {
        console.log('safeRecordScore called:', key, percent, detail); // Debug log
        try {
            if (window.VE && typeof window.VE.recordMissionScore === 'function') {
                window.VE.recordMissionScore(key, percent, detail);
                console.log('Successfully called VE.recordMissionScore'); // Debug log
            } else {
                console.log('VE.recordMissionScore not available:', window.VE); // Debug log
            }
        } catch (e) {
            console.error('Error recording score:', e); // Debug log
        }
    }

    // Utility Functions
    function shuffle(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    function showFeedback(element, message, type) {
        if (!element) return;
        
        element.textContent = message;
        element.className = `feedback-box ${type}`;
        
        // Add some animation
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 100);
    }

    function playSound(type) {
        // Create audio context for sound effects
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            try {
                const audioContext = new (AudioContext || webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                let frequency = 440; // Default
                let duration = 0.3;
                
                switch(type) {
                    case 'correct':
                        frequency = 523.25; // C5
                        break;
                    case 'incorrect':
                        frequency = 220; // A3
                        duration = 0.5;
                        break;
                    case 'victory':
                        frequency = 659.25; // E5
                        duration = 0.6;
                        break;
                }
                
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
            } catch (e) {
                // Audio not supported, silently fail
            }
        }
    }

    function createCelebration() {
        // Create confetti effect
        const celebration = document.createElement('div');
        celebration.className = 'celebration';
        document.body.appendChild(celebration);
        
        const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 2 + 's';
                confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
                celebration.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.remove();
                }, 5000);
            }, i * 50);
        }
        
        // Remove celebration container after animation
        setTimeout(() => {
            celebration.remove();
        }, 8000);
    }

})();
