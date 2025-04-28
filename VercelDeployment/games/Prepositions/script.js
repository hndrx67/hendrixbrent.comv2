// Game state
let currentQuestion = 0;
let score = 0;
let attempts = 0;
let timer = null;
let userInfo = {
    name: '',
    grade: '',
    difficulty: 'easy'
};

// Questions by difficulty
const questionsByDifficulty = {
    easy: [
        {
            image: 'https://i.imgur.com/8B5O9Sb.png',
            text: 'We sleep _____ night.',
            answer: 'at',
            correctPhrase: 'We sleep AT night! ⭐',
            explanation: 'We use "at" with specific times of the day like night, noon, midnight.'
        },
        {
            image: 'https://i.imgur.com/YQ2Qt6F.png',
            text: 'The cat is _____ the mat.',
            answer: 'on',
            correctPhrase: 'Yes! The cat is ON the mat! 🐱',
            explanation: 'We use "on" for surfaces.'
        },
        {
            image: 'https://i.imgur.com/JKYz8tt.png',
            text: 'The fish swims _____ the water.',
            answer: 'in',
            correctPhrase: 'Correct! The fish is IN the water! 🐠',
            explanation: 'We use "in" for things surrounded by something.'
        }
    ],
    medium: [
        {
            image: 'https://i.imgur.com/nPZxltN.png',
            text: 'We celebrate birthdays _____ June.',
            answer: 'in',
            correctPhrase: 'Great! We celebrate birthdays IN June! 🎂',
            explanation: 'We use "in" with months and years.'
        },
        {
            image: 'https://i.imgur.com/v9x64IV.png',
            text: 'The students are _____ school learning.',
            answer: 'at',
            correctPhrase: 'Perfect! Students are AT school! 📚',
            explanation: 'We use "at" with places where specific activities happen.'
        },
        {
            image: 'https://i.imgur.com/QGDv5h7.png',
            text: 'The monkey is climbing _____ the tree.',
            answer: 'in',
            correctPhrase: 'Yes! The monkey is IN the tree! 🐒',
            explanation: 'We use "in" when something is inside or surrounded by something else.'
        },
        {
            image: 'https://i.imgur.com/8B5O9Sb.png',
            text: 'The meeting starts _____ 3 o\'clock.',
            answer: 'at',
            correctPhrase: 'Correct! The meeting starts AT 3 o\'clock! ⏰',
            explanation: 'We use "at" with specific times.'
        }
    ],
    hard: [
        {
            image: 'https://i.imgur.com/nPZxltN.png',
            text: 'The concert will be _____ Saturday _____ 7 PM.',
            answer: ['on', 'at'],
            correctPhrase: 'Excellent! The concert will be ON Saturday AT 7 PM! 🎵',
            explanation: 'We use "on" with days and "at" with times.',
            multipleBlanks: true
        },
        {
            image: 'https://i.imgur.com/v9x64IV.png',
            text: 'I\'ll meet you _____ the library _____ the morning.',
            answer: ['at', 'in'],
            correctPhrase: 'Perfect! I\'ll meet you AT the library IN the morning! 📚',
            explanation: 'We use "at" with specific places and "in" with parts of the day.',
            multipleBlanks: true
        },
        {
            image: 'https://i.imgur.com/QGDv5h7.png',
            text: 'The birds are singing _____ the trees _____ sunrise.',
            answer: ['in', 'at'],
            correctPhrase: 'Amazing! The birds are singing IN the trees AT sunrise! 🐦',
            explanation: 'We use "in" for location within something and "at" for specific times.',
            multipleBlanks: true
        }
    ],
    veryHard: [
        {
            image: 'https://i.imgur.com/nPZxltN.png',
            text: 'We have classes _____ Monday _____ Friday _____ 9 AM.',
            answer: ['on', 'to', 'at'],
            correctPhrase: 'Perfect! We have classes ON Monday TO Friday AT 9 AM! 📚',
            explanation: 'We use "on" for days, "to" for ranges, and "at" for specific times.',
            multipleBlanks: true
        },
        {
            image: 'https://i.imgur.com/v9x64IV.png',
            text: 'The meeting _____ the office _____ next week will be held _____ noon.',
            answer: ['in', 'on', 'at'],
            correctPhrase: 'Excellent! The meeting IN the office ON next week will be held AT noon! 🏢',
            explanation: 'We use "in" for enclosed spaces, "on" for future dates/weeks, and "at" for specific times.',
            multipleBlanks: true
        },
        {
            image: 'https://i.imgur.com/QGDv5h7.png',
            text: 'The birds fly _____ the sky _____ sunrise _____ spring.',
            answer: ['in', 'at', 'in'],
            correctPhrase: 'Great! The birds fly IN the sky AT sunrise IN spring! 🐦',
            explanation: 'We use "in" for spaces and seasons, and "at" for specific times of day.',
            multipleBlanks: true
        }
        // Add more questions to reach 20 total for Very Hard mode
    ]
};

let currentQuestions = [];
let timeLeft = 60;

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
});

// Landing page handling
document.getElementById('startGame').addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    const grade = document.getElementById('grade').value;
    
    if (!username || !grade) {
        alert('Please enter your name and grade!');
        return;
    }
    
    userInfo.name = username;
    userInfo.grade = grade;
    
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    
    initGame();
});

// Difficulty selection
document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.difficulty-btn').forEach(b => b.style.opacity = '0.5');
        e.target.style.opacity = '1';
        userInfo.difficulty = e.target.dataset.difficulty;
    });
});

function initGame() {
    currentQuestion = 0;
    score = 0;
    attempts = 0;
    currentQuestions = [...questionsByDifficulty[userInfo.difficulty]];
    
    // Ensure 20 questions for Very Hard mode by duplicating existing questions
    if (userInfo.difficulty === 'veryHard') {
        while (currentQuestions.length < 20) {
            currentQuestions.push(...questionsByDifficulty.veryHard);
        }
        currentQuestions = currentQuestions.slice(0, 20);
        startTimer();
    }
    
    // Create progress bar and score display if they don't exist
    if (!document.querySelector('.progress-bar')) {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        document.querySelector('.question').before(progressBar);

        const scoreDisplay = document.createElement('div');
        scoreDisplay.className = 'score';
        document.querySelector('.question').before(scoreDisplay);
    }
    
    showQuestion();
    updateProgress();
    updateScore();
    
    // Set up next question button listener
    document.getElementById('nextQuestion').addEventListener('click', showNextQuestion);
}

function showQuestion() {
    const q = currentQuestions[currentQuestion];
    document.getElementById('question-image').src = q.image;
    
    // Update question number instead of creating new element
    let questionNumberDiv = document.querySelector('.question-number');
    if (!questionNumberDiv) {
        questionNumberDiv = document.createElement('div');
        questionNumberDiv.className = 'question-number';
        document.querySelector('.question').prepend(questionNumberDiv);
    }
    questionNumberDiv.textContent = `Question ${currentQuestion + 1} of ${currentQuestions.length}`;
    
    // Handle text with blanks
    let questionText = q.text;
    if (q.multipleBlanks) {
        questionText = questionText.replace(/___/g, '<span class="blank">___</span>');
    } else {
        questionText = questionText.replace('_____', '<span class="blank">___</span>');
    }
    
    document.getElementById('question-text').innerHTML = questionText;
    document.getElementById('result').innerText = '';
    document.getElementById('result').className = '';
    
    // Clear previous feedback
    const existingFeedback = document.querySelector('.feedback');
    if (existingFeedback) existingFeedback.remove();
    
    // Update choices for multiple blanks
    const choices = document.querySelector('.choices');
    choices.innerHTML = '';
    if (q.multipleBlanks) {
        choices.innerHTML = `
            <div class="blank-group">
                <span>First blank:</span>
                <button onclick="selectOption(this, 'in', 0)">IN</button>
                <button onclick="selectOption(this, 'on', 0)">ON</button>
                <button onclick="selectOption(this, 'at', 0)">AT</button>
            </div>
            <div class="blank-group">
                <span>Second blank:</span>
                <button onclick="selectOption(this, 'in', 1)">IN</button>
                <button onclick="selectOption(this, 'on', 1)">ON</button>
                <button onclick="selectOption(this, 'at', 1)">AT</button>
            </div>
        `;
        if (q.answer.length > 2) {
            choices.innerHTML += `
                <div class="blank-group">
                    <span>Third blank:</span>
                    <button onclick="selectOption(this, 'in', 2)">IN</button>
                    <button onclick="selectOption(this, 'on', 2)">ON</button>
                    <button onclick="selectOption(this, 'at', 2)">AT</button>
                    <button onclick="selectOption(this, 'to', 2)">TO</button>
                </div>
            `;
        }
    } else {
        choices.innerHTML = `
            <button onclick="selectOption(this, 'in')">IN</button>
            <button onclick="selectOption(this, 'on')">ON</button>
            <button onclick="selectOption(this, 'at')">AT</button>
        `;
    }
}

function selectOption(button, choice, blankIndex = 0) {
    // Remove selection from other buttons in the same group
    const buttonGroup = button.parentElement;
    buttonGroup.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selection to clicked button
    button.classList.add('selected');
    
    // Update the blank to show it's filled
    const blanks = document.querySelectorAll('.blank');
    if (blanks[blankIndex]) {
        blanks[blankIndex].classList.add('filled');
        blanks[blankIndex].textContent = choice.toUpperCase();
    }
    
    // Check the answer
    checkAnswer(choice, blankIndex);
}

function updateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const progress = (currentQuestion / currentQuestions.length) * 100;
    progressFill.style.width = `${progress}%`;
}

function updateScore() {
    const scoreDisplay = document.querySelector('.score');
    scoreDisplay.textContent = `Score: ${score}/${currentQuestions.length}`;
}

function showFeedback(isCorrect, explanation) {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'feedback';
    feedbackDiv.textContent = explanation;
    document.getElementById('result').after(feedbackDiv);
}

function checkAnswer(choice, blankIndex = 0) {
    const q = currentQuestions[currentQuestion];
    attempts++;
    
    let isCorrect = false;
    const result = document.getElementById('result');
    
    if (q.multipleBlanks) {
        if (!q.userAnswers) {
            q.userAnswers = new Array(q.answer.length).fill(null);
        }
        q.userAnswers[blankIndex] = choice;
        
        // Check if current blank is correct
        const isCurrentBlankCorrect = choice === q.answer[blankIndex];
        const allAnswered = q.userAnswers.every(ans => ans !== null);
        
        // Handle individual blank feedback
        const currentButton = document.querySelector(`.choices button.selected[onclick*="${blankIndex}"]`);
        const currentBlank = document.querySelectorAll('.blank')[blankIndex];
        
        if (isCurrentBlankCorrect) {
            currentButton.classList.add('correct-pulse');
            currentBlank.classList.add('filled', 'correct');
            currentBlank.textContent = choice.toUpperCase();
        } else {
            currentButton.classList.add('wrong-pulse');
            currentBlank.classList.add('filled', 'wrong');
            currentBlank.textContent = choice.toUpperCase();
            
            setTimeout(() => {
                currentButton.classList.remove('wrong-pulse', 'selected');
                currentBlank.classList.remove('filled', 'wrong');
                currentBlank.textContent = '___';
                q.userAnswers[blankIndex] = null;
            }, 1000);
            
            result.innerText = '❌ That preposition is not correct. Try again!';
            result.className = 'wrong-answer';
            return;
        }
        
        // Check if all blanks are correctly filled
        isCorrect = q.userAnswers.every((ans, idx) => ans === q.answer[idx]);
        
        if (allAnswered && !isCorrect) {
            result.innerText = '❌ Some answers are incorrect. Check each blank carefully!';
            result.className = 'wrong-answer';
            return;
        }
    } else {
        isCorrect = choice === q.answer;
    }
    
    if (isCorrect && (!q.multipleBlanks || q.userAnswers.every((ans, idx) => ans === q.answer[idx]))) {
        result.innerText = q.correctPhrase;
        result.className = 'correct-answer';
        showFeedback(true, q.explanation);
        
        if (attempts === q.answer.length) score++;
        updateScore();
        
        document.getElementById('nextQuestion').style.display = 'block';
        disableChoiceButtons();
    }
}

function finishGame() {
    if (timer) {
        clearInterval(timer);
    }
    const questionDiv = document.getElementById('question');
    const percentage = Math.round((score / currentQuestions.length) * 100);
    let message = `<h2>🎉 Great job, ${userInfo.name}!</h2>`;
    
    if (percentage === 100) {
        message += '<p>Perfect score! You\'re a preposition master! 🏆</p>';
    } else if (percentage >= 80) {
        message += '<p>Great job! You\'re getting really good at this! 🌟</p>';
    } else if (percentage >= 60) {
        message += '<p>Good effort! Keep practicing to improve! 📚</p>';
    } else {
        message += '<p>Don\'t worry! Practice makes perfect! Try again! 💪</p>';
    }
    
    message += `<p>Your final score: ${score}/${currentQuestions.length}</p>`;
    message += `
        <button onclick="restartGame()" class="start-btn">Play Again</button>
        <button onclick="changeDifficulty()" class="start-btn" style="background-color: var(--secondary-color);">Change Difficulty</button>
    `;
    
    questionDiv.innerHTML = message;
}

function restartGame() {
    currentQuestion = 0;
    score = 0;
    attempts = 0;
    const questionDiv = document.getElementById('question');
    questionDiv.innerHTML = `
        <img id="question-image" class="picture" src="" alt="Question Image">
        <p id="question-text"></p>
        <div class="choices">
            <button onclick="checkAnswer('in')">IN</button>
            <button onclick="checkAnswer('on')">ON</button>
            <button onclick="checkAnswer('at')">AT</button>
        </div>
    `;
    initGame();
}

function changeDifficulty() {
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('landingPage').style.display = 'block';
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);

// Initialize theme based on system preference
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
}

// Initialize the game when the page loads
window.onload = initGame;

function startTimer() {
    if (userInfo.difficulty === 'veryHard') {
        document.getElementById('timer').style.display = 'block';
        timeLeft = 60;
        updateTimer();
        timer = setInterval(() => {
            timeLeft--;
            updateTimer();
            if (timeLeft <= 0) {
                clearInterval(timer);
                finishGame();
            }
        }, 1000);
    }
}

function updateTimer() {
    document.getElementById('time').textContent = timeLeft;
}

function showNextQuestion() {
    // Remove animations from buttons
    document.querySelectorAll('.choices button').forEach(button => {
        button.classList.remove('correct-pulse', 'wrong-pulse', 'selected');
    });
    
    document.getElementById('nextQuestion').style.display = 'none';
    currentQuestion++;
    
    if (currentQuestion < currentQuestions.length) {
        showQuestion();
        updateProgress();
        enableChoiceButtons();
    } else {
        finishGame();
    }
}

function enableChoiceButtons() {
    const buttons = document.querySelectorAll('.choices button');
    buttons.forEach(button => {
        button.disabled = false;
    });
}

function disableChoiceButtons() {
    const buttons = document.querySelectorAll('.choices button');
    buttons.forEach(button => {
        button.disabled = true;
    });
}