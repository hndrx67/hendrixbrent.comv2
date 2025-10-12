const STORAGE_SCORES_KEY = 'vt2_anonymous_scores';

const missions = [
    { key: 'quiz', label: 'Visual Detective Quiz' },
    { key: 'match', label: 'Feature Finder Challenge' },
    { key: 'story', label: 'Story Sequencer' },
    { key: 'poster', label: 'Poster Painter' }
];

const quizQuestions = [
    {
        question: 'Which feature helps you understand who is speaking in a comic strip?',
        options: ['The color palette', 'The speech bubbles', 'The background pattern', 'The page number'],
        answer: 1
    },
    {
        question: 'When reading a poster, what should you scan first?',
        options: ['The tiny text at the bottom', 'The bright headline and image', "The designer's signature", "The printer's code"],
        answer: 1
    },
    {
        question: 'A virtual text often lets you click buttons. What is the main reason for this?',
        options: ['To change the background music', 'To add secret levels', 'To move to new information or actions', 'To make the screen brighter'],
        answer: 2
    },
    {
        question: 'What clue shows that a website is updated regularly?',
        options: ['Animated characters on the page', 'A navigation bar with glowing buttons', 'Fresh articles or videos with recent dates', 'A colorful wallpaper'],
        answer: 2
    },
    {
        question: 'Why do infographics use icons and symbols?',
        options: ['To give your eyes a break from text', 'To hide important facts', 'To make the page completely silent', 'To replace captions'],
        answer: 0
    }
];

const matchAnswers = {
    caption: 'Gives extra details about an image',
    navigation: 'Helps readers jump to different pages',
    callout: 'Shares a quick fact or fun extra',
    button: 'Starts an interactive action'
};

document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    const loginForm = document.getElementById('loginForm');
    const modalLoginForm = document.getElementById('modalLoginForm');
    const loginToggle = document.getElementById('loginToggle');
    const loginModal = document.getElementById('loginModal');
    const modalClose = document.getElementById('modalClose');
    const loginStatus = document.getElementById('loginStatus');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginCard = document.getElementById('loginCard');
    const scoreUsername = document.getElementById('scoreUsername');
    const scoresBody = document.getElementById('scoresBody');
    const quizQuestionEl = document.getElementById('quizQuestion');
    const quizOptionsEl = document.getElementById('quizOptions');
    const quizNextBtn = document.getElementById('quizNextBtn');
    const quizProgressEl = document.getElementById('quizProgress');
    const quizResultEl = document.getElementById('quizResult');
    const quizCardEl = document.getElementById('quizCard');
    const quizScoreEl = document.getElementById('quizScore');
    const quizRetryBtn = document.getElementById('quizRetry');
    const matchForm = document.getElementById('matchForm');
    const matchSubmitBtn = document.getElementById('matchSubmit');
    const matchFeedbackEl = document.getElementById('matchFeedback');
    const printScoresBtn = document.getElementById('printScores');
    const resetScoresBtn = document.getElementById('resetScores');
    const navWelcome = document.getElementById('navWelcome');
    const navLinks = document.querySelectorAll('.nav-links a[data-page]');

    let quizState = {
        index: 0,
        score: 0
    };

    const currentPage = document.body?.dataset.page || 'home';
    navLinks.forEach(link => {
        if (link.dataset.page === currentPage) {
            link.classList.add('active');
        }
    });

    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Define page element checks first
    const hasQuiz = Boolean(quizQuestionEl && quizOptionsEl && quizNextBtn && quizProgressEl && quizResultEl && quizCardEl && quizScoreEl);
    const hasMatch = Boolean(matchForm && matchSubmitBtn && matchFeedbackEl);
    const hasScores = Boolean(scoresBody);
    const hasProgress = Boolean(document.getElementById('gamesCompleted'));
    const hasPrint = Boolean(printScoresBtn);

    // Initialize scores
    const scores = loadScores();
    console.log('Loaded scores:', scores);
    
    updateProgressDisplay();
    renderScores();

    if (hasQuiz) {
        renderQuizQuestion();
    }

    // Set up print functionality
    if (printScoresBtn) {
        printScoresBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // Set up reset scores functionality
    if (resetScoresBtn) {
        resetScoresBtn.addEventListener('click', () => {
            const confirmation = confirm('Are you sure you want to reset all scores? This action cannot be undone.');
            if (confirmation) {
                // Clear scores from localStorage
                localStorage.removeItem(STORAGE_SCORES_KEY);
                
                // Update display immediately
                updateProgressDisplay();
                renderScores();
                
                // Show success message
                alert('All scores have been reset successfully! Ready for a new student to compete.');
                
                console.log('Scores reset by user');
            }
        });
    }

    if (hasQuiz) {
        quizNextBtn?.addEventListener('click', () => {
            if (!quizOptionsEl || !quizProgressEl) {
                return;
            }

            const selected = quizOptionsEl.querySelector('input[name="quizOption"]:checked');
            if (!selected) {
                quizProgressEl.textContent = 'Select an answer to continue.';
                quizProgressEl.classList.add('quiz-warning');
                return;
            }

            quizProgressEl.classList.remove('quiz-warning');
            const answerIndex = Number(selected.value);
            if (answerIndex === quizQuestions[quizState.index].answer) {
                quizState.score += 1;
            }

            quizState.index += 1;

            if (quizState.index < quizQuestions.length) {
                renderQuizQuestion();
            } else {
                showQuizResults();
            }
        });

        quizRetryBtn?.addEventListener('click', () => {
            quizState = { index: 0, score: 0 };
            if (quizCardEl && quizResultEl) {
                quizCardEl.hidden = false;
                quizResultEl.hidden = true;
            }
            renderQuizQuestion();
        });
    }

    if (hasMatch) {
        matchSubmitBtn?.addEventListener('click', () => {
            if (!matchForm || !matchFeedbackEl) {
                return;
            }

            const selections = Object.keys(matchAnswers).reduce((acc, key) => {
                const selectEl = matchForm.elements.namedItem(key);
                acc[key] = selectEl?.value ?? '';
                return acc;
            }, {});

            const total = Object.keys(matchAnswers).length;
            let correct = 0;

            Object.entries(matchAnswers).forEach(([key, correctValue]) => {
                if (selections[key] === correctValue) {
                    correct += 1;
                }
            });

            const percent = Math.round((correct / total) * 100);
            const detail = `${correct}/${total} correct`;
            matchFeedbackEl.textContent = percent === 100
                ? 'Amazing! You matched every feature perfectly.'
                : `You matched ${detail}. Try again to beat your best!`;

            recordMissionScore('match', percent, detail);
            renderScores();
            updateProgressDisplay();
        });
    }

    // Remove duplicate print handler since we added it above

    function renderQuizQuestion() {
        if (!quizQuestionEl || !quizOptionsEl || !quizProgressEl || !quizNextBtn) {
            return;
        }

        const question = quizQuestions[quizState.index];
        quizQuestionEl.textContent = question.question;
        quizOptionsEl.innerHTML = '';

        question.options.forEach((option, idx) => {
            const label = document.createElement('label');
            label.innerHTML = `
                <input type="radio" name="quizOption" value="${idx}">
                <span>${option}</span>
            `;
            quizOptionsEl.appendChild(label);
        });

        quizProgressEl.textContent = `Question ${quizState.index + 1} of ${quizQuestions.length}`;
        quizNextBtn.textContent = quizState.index === quizQuestions.length - 1 ? 'Submit Quiz' : 'Next';
    }

    function showQuizResults() {
        if (!quizScoreEl || !quizCardEl || !quizResultEl) {
            return;
        }

        const total = quizQuestions.length;
        const percent = Math.round((quizState.score / total) * 100);
        const detail = `${quizState.score}/${total} correct`;
        quizScoreEl.textContent = `Your score: ${percent}% (${detail})`;
        quizCardEl.hidden = true;
        quizResultEl.hidden = false;

        recordMissionScore('quiz', percent, detail);
        renderScores();
        updateProgressDisplay();
    }

    function updateProgressDisplay() {
        if (!hasProgress) return;
        
        const scores = loadScores();
        const gamesCompletedEl = document.getElementById('gamesCompleted');
        const bestScoreEl = document.getElementById('bestScore');
        
        let totalAttempts = 0;
        let bestPercent = 0;
        
        missions.forEach(mission => {
            const data = scores[mission.key] || createEmptyMission();
            totalAttempts += data.attempts;
            if (data.best > bestPercent) {
                bestPercent = data.best;
            }
        });
        
        if (gamesCompletedEl) {
            gamesCompletedEl.textContent = totalAttempts;
        }
        if (bestScoreEl) {
            bestScoreEl.textContent = bestPercent > 0 ? `${bestPercent}%` : '--';
        }
    }

    function renderScores() {
        console.log('renderScores called, hasScores:', hasScores, 'scoresBody:', scoresBody); // Debug log
        if (!hasScores || !scoresBody) {
            console.log('No scores table found - hasScores:', hasScores, 'scoresBody element:', !!scoresBody); // Debug log
            return;
        }

        const scores = loadScores();
        console.log('Loading scores for display:', scores); // Debug log
        scoresBody.innerHTML = '';

        if (missions.length === 0) {
            console.log('No missions defined!'); // Debug log
            return;
        }

        missions.forEach(mission => {
            const data = scores[mission.key] || createEmptyMission();
            console.log(`Rendering mission ${mission.key}:`, data); // Debug log
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${mission.label}</td>
                <td>${formatScoreCell(data.best, data.bestDetail)}</td>
                <td>${formatScoreCell(data.last, data.lastDetail)}</td>
                <td>${data.attempts}</td>
            `;
            scoresBody.appendChild(row);
        });
        
        console.log('Scores rendered successfully, table has', scoresBody.children.length, 'rows'); // Debug log
    }

    function recordMissionScore(missionKey, percent, detail) {
        console.log('Recording score:', missionKey, percent, detail); // Debug log
        const scores = loadScores();
        const missionRecord = scores[missionKey] || createEmptyMission();

        missionRecord.last = percent;
        missionRecord.lastDetail = detail;
        missionRecord.attempts += 1;

        if (percent > missionRecord.best) {
            missionRecord.best = percent;
            missionRecord.bestDetail = detail;
        }

        scores[missionKey] = missionRecord;
        saveScores(scores);
        console.log('Saved scores:', scores); // Debug log
    }

    // Expose helpers for other pages/scripts (e.g., games.js)
    try {
        window.VE = window.VE || {};
        window.VE.recordMissionScore = recordMissionScore;
        window.VE.loadScores = loadScores;
        window.VE.saveScores = saveScores;
        window.VE.createEmptyMission = createEmptyMission;
        window.VE.testScore = () => {
            recordMissionScore('quiz', 85, '4/5 correct');
            updateProgressDisplay();
            renderScores();
        };
        console.log('VE helpers exposed:', window.VE);
    } catch (e) { 
        console.error('Error exposing VE helpers:', e);
    }
});

function loadScores() {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_SCORES_KEY) ?? '{}');
        return typeof data === 'object' && data ? data : {};
    } catch (error) {
        console.warn('Resetting stored scores', error);
        return {};
    }
}

function saveScores(scores) {
    localStorage.setItem(STORAGE_SCORES_KEY, JSON.stringify(scores));
}



function createEmptyMission() {
    return {
        best: 0,
        bestDetail: '--',
        last: 0,
        lastDetail: '--',
        attempts: 0
    };
}

function formatScoreCell(value, detail) {
    if (!value || value <= 0) {
        return '--';
    }
    return `${value}% (${detail})`;
}
