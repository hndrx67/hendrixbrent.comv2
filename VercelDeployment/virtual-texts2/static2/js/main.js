const STORAGE_USERS_KEY = 'vt2_users';
const STORAGE_CURRENT_KEY = 'vt2_current_user';

const missions = [
    { key: 'quiz', label: 'Visual Detective Quiz' },
    { key: 'match', label: 'Feature Finder Challenge' }
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

    const savedUser = getCurrentUser();
    updateLoginState(savedUser);
    renderScores(savedUser);

    const hasQuiz = Boolean(quizQuestionEl && quizOptionsEl && quizNextBtn && quizProgressEl && quizResultEl && quizCardEl && quizScoreEl);
    const hasMatch = Boolean(matchForm && matchSubmitBtn && matchFeedbackEl);
    const hasScores = Boolean(scoresBody && scoreUsername);
    const hasPrint = Boolean(printScoresBtn);

    if (hasQuiz) {
        renderQuizQuestion();
    }

    loginForm?.addEventListener('submit', event => {
        event.preventDefault();
        const formData = new FormData(loginForm);
        const username = sanitizeUsername(formData.get('username'));
        if (username) {
            completeLogin(username);
            loginForm.reset();
        }
    });

    modalLoginForm?.addEventListener('submit', event => {
        event.preventDefault();
        const formData = new FormData(modalLoginForm);
        const username = sanitizeUsername(formData.get('username'));
        if (username) {
            completeLogin(username);
            modalLoginForm.reset();
        }
    });

    loginToggle?.addEventListener('click', () => {
        if (!getCurrentUser() && loginCard) {
            const focusTarget = loginCard.querySelector('input');
            focusTarget?.focus();
        }
        showLoginModal();
    });

    modalClose?.addEventListener('click', hideLoginModal);

    loginModal?.addEventListener('click', event => {
        if (event.target === loginModal) {
            hideLoginModal();
        }
    });

    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem(STORAGE_CURRENT_KEY);
        updateLoginState(null);
        renderScores(null);
    });

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

            if (!getCurrentUser()) {
                matchFeedbackEl.textContent += ' Log in to save your score.';
                return;
            }

            recordMissionScore('match', percent, detail);
            renderScores(getCurrentUser());
        });
    }

    if (hasPrint) {
        printScoresBtn?.addEventListener('click', () => {
            window.print();
        });
    }

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

        if (!getCurrentUser()) {
            quizScoreEl.textContent += '. Log in to save your score.';
            return;
        }

        recordMissionScore('quiz', percent, detail);
        renderScores(getCurrentUser());
    }

    function showLoginModal() {
        loginModal?.removeAttribute('hidden');
        const input = loginModal?.querySelector('input');
        window.setTimeout(() => input?.focus(), 100);
    }

    function hideLoginModal() {
        loginModal?.setAttribute('hidden', '');
    }

    function completeLogin(username) {
        const users = loadUsers();
        if (!users[username]) {
            users[username] = { missions: {} };
        }
        saveUsers(users);
        localStorage.setItem(STORAGE_CURRENT_KEY, username);
        hideLoginModal();
        updateLoginState(username);
        renderScores(username);
    }

    function updateLoginState(username) {
        const loggedIn = Boolean(username);
        if (navWelcome) {
            navWelcome.textContent = loggedIn ? `Explorer ${username}` : 'Guest Explorer';
        }
        if (loginToggle) {
            loginToggle.textContent = loggedIn ? 'Switch User' : 'Login';
        }
        if (scoreUsername) {
            scoreUsername.textContent = loggedIn ? username : 'Guest';
        }

        if (!loginCard) {
            return;
        }

        const form = loginCard.querySelector('form');

        if (loggedIn) {
            form?.setAttribute('hidden', '');
            loginStatus?.removeAttribute('hidden');
            if (welcomeMessage) {
                welcomeMessage.textContent = `Explorer ${username}, your missions await!`;
            }
        } else {
            form?.removeAttribute('hidden');
            loginStatus?.setAttribute('hidden', '');
            if (welcomeMessage) {
                welcomeMessage.textContent = '';
            }
        }
    }

    function renderScores(username) {
        if (!hasScores || !scoresBody) {
            return;
        }

        if (!username) {
            scoresBody.innerHTML = `
                <tr>
                    <td colspan="4">Log in to view your missions.</td>
                </tr>
            `;
            return;
        }

        const users = loadUsers();
        const userRecord = users[username] ?? { missions: {} };

        scoresBody.innerHTML = '';

        missions.forEach(mission => {
            const data = userRecord.missions[mission.key] ?? createEmptyMission();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${mission.label}</td>
                <td>${formatScoreCell(data.best, data.bestDetail)}</td>
                <td>${formatScoreCell(data.last, data.lastDetail)}</td>
                <td>${data.attempts}</td>
            `;
            scoresBody.appendChild(row);
        });
    }

    function recordMissionScore(missionKey, percent, detail) {
        const username = getCurrentUser();
        if (!username) {
            return;
        }

        const users = loadUsers();
        const userRecord = users[username] ?? { missions: {} };
        const missionRecord = userRecord.missions[missionKey] ?? createEmptyMission();

        missionRecord.last = percent;
        missionRecord.lastDetail = detail;
        missionRecord.attempts += 1;

        if (percent > missionRecord.best) {
            missionRecord.best = percent;
            missionRecord.bestDetail = detail;
        }

        userRecord.missions[missionKey] = missionRecord;
        users[username] = userRecord;
        saveUsers(users);
    }
});

function getCurrentUser() {
    return localStorage.getItem(STORAGE_CURRENT_KEY);
}

function loadUsers() {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_USERS_KEY) ?? '{}');
        return typeof data === 'object' && data ? data : {};
    } catch (error) {
        console.warn('Resetting stored users', error);
        return {};
    }
}

function saveUsers(users) {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
}

function sanitizeUsername(raw) {
    if (!raw) {
        return '';
    }
    return String(raw).trim().replace(/\s+/g, ' ').slice(0, 18);
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
