// Alphabet sequence learning JavaScript

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Initialize all games when page loads
document.addEventListener('DOMContentLoaded', function() {
    initSequenceGame();
    initSortingGame();
    initBeforeAfterGame();
});

// ============================================
// Game 1: Fill in the Missing Letter
// ============================================

let sequenceScore = 0;
let currentSequence = null;

function initSequenceGame() {
    document.getElementById('newQuestionBtn').addEventListener('click', generateSequenceQuestion);
    generateSequenceQuestion();
}

function generateSequenceQuestion() {
    sequenceScore = 0;
    document.getElementById('sequenceScore').textContent = sequenceScore;
    document.getElementById('sequenceFeedback').textContent = '';
    document.getElementById('sequenceFeedback').className = 'feedback';
    
    // Pick a random position in the alphabet (not first or last)
    const position = Math.floor(Math.random() * (alphabet.length - 4)) + 1;
    const correctAnswer = alphabet[position + 2];
    
    currentSequence = {
        letters: [alphabet[position], alphabet[position + 1], correctAnswer],
        answer: correctAnswer,
        position: position
    };
    
    // Display the sequence with a blank
    const sequenceDisplay = document.getElementById('sequenceDisplay');
    sequenceDisplay.innerHTML = `
        <div class="sequence-letter">${currentSequence.letters[0]}</div>
        <div class="sequence-letter">${currentSequence.letters[1]}</div>
        <div class="sequence-letter sequence-blank">?</div>
    `;
    
    // Generate answer options (correct answer + 3 random wrong answers)
    generateSequenceOptions(correctAnswer);
}

function generateSequenceOptions(correctAnswer) {
    const optionsDiv = document.getElementById('answerOptions');
    optionsDiv.innerHTML = '';
    
    // Create wrong options
    let options = [correctAnswer];
    while (options.length < 4) {
        const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        if (!options.includes(randomLetter)) {
            options.push(randomLetter);
        }
    }
    
    // Shuffle options
    options.sort(() => Math.random() - 0.5);
    
    // Create buttons
    options.forEach(letter => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = letter;
        btn.addEventListener('click', () => checkSequenceAnswer(letter, btn));
        optionsDiv.appendChild(btn);
    });
}

function checkSequenceAnswer(selectedLetter, btn) {
    const feedback = document.getElementById('sequenceFeedback');
    const allButtons = document.querySelectorAll('#answerOptions .option-btn');
    
    // Disable all buttons
    allButtons.forEach(b => b.disabled = true);
    
    if (selectedLetter === currentSequence.answer) {
        sequenceScore += 10;
        document.getElementById('sequenceScore').textContent = sequenceScore;
        feedback.textContent = `🎉 Correct! The answer is ${selectedLetter}!`;
        feedback.className = 'feedback correct';
        
        // Update display to show correct answer
        document.querySelector('.sequence-blank').textContent = selectedLetter;
        document.querySelector('.sequence-blank').classList.remove('sequence-blank');
        
        speakLetter(selectedLetter);
    } else {
        feedback.textContent = `❌ Not quite! The correct answer is ${currentSequence.answer}. Try the next one!`;
        feedback.className = 'feedback incorrect';
    }
}

// ============================================
// Game 2: Put Letters in Order (Sorting)
// ============================================

let sortingLetters = [];
let sortedAnswer = [];
let sortingProgress = 0;

function initSortingGame() {
    document.getElementById('resetSortBtn').addEventListener('click', resetSortingGame);
    resetSortingGame();
}

function resetSortingGame() {
    sortingProgress = 0;
    sortedAnswer = [];
    
    document.getElementById('sortedLetters').textContent = '';
    document.getElementById('sortingFeedback').textContent = '';
    document.getElementById('sortingFeedback').className = 'feedback';
    
    // Generate 5 random consecutive letters
    const startPos = Math.floor(Math.random() * (alphabet.length - 5));
    sortingLetters = alphabet.slice(startPos, startPos + 5);
    
    // Shuffle them
    const shuffled = [...sortingLetters].sort(() => Math.random() - 0.5);
    
    // Create buttons
    const sortingArea = document.getElementById('sortingArea');
    sortingArea.innerHTML = '';
    
    shuffled.forEach(letter => {
        const btn = document.createElement('button');
        btn.className = 'sort-btn';
        btn.textContent = letter;
        btn.dataset.letter = letter;
        btn.addEventListener('click', () => selectSortLetter(letter, btn));
        sortingArea.appendChild(btn);
    });
    
    updateSortingProgress();
}

function selectSortLetter(letter, btn) {
    // Check if this is the next correct letter
    const expectedLetter = sortingLetters[sortingProgress];
    const feedback = document.getElementById('sortingFeedback');
    
    if (letter === expectedLetter) {
        // Correct!
        sortedAnswer.push(letter);
        sortingProgress++;
        btn.disabled = true;
        btn.style.opacity = '0.3';
        
        document.getElementById('sortedLetters').textContent = sortedAnswer.join(' ');
        updateSortingProgress();
        
        speakLetter(letter);
        
        // Check if complete
        if (sortingProgress === sortingLetters.length) {
            feedback.textContent = `🌟 Perfect! You put all letters in order: ${sortedAnswer.join(' ')}`;
            feedback.className = 'feedback correct';
        } else {
            feedback.textContent = `✓ Great! Keep going!`;
            feedback.className = 'feedback correct';
            setTimeout(() => {
                feedback.textContent = '';
                feedback.className = 'feedback';
            }, 1500);
        }
    } else {
        // Wrong
        feedback.textContent = `❌ Not quite! Try to find the next letter in order.`;
        feedback.className = 'feedback incorrect';
        
        setTimeout(() => {
            feedback.textContent = '';
            feedback.className = 'feedback';
        }, 2000);
    }
}

function updateSortingProgress() {
    document.getElementById('sortingProgress').textContent = `${sortingProgress}/${sortingLetters.length}`;
}

// ============================================
// Game 3: Before or After
// ============================================

let beforeAfterScore = 0;
let currentBeforeAfter = null;

function initBeforeAfterGame() {
    document.getElementById('newBeforeAfterBtn').addEventListener('click', generateBeforeAfterQuestion);
    generateBeforeAfterQuestion();
}

function generateBeforeAfterQuestion() {
    beforeAfterScore = 0;
    document.getElementById('beforeAfterScore').textContent = beforeAfterScore;
    document.getElementById('beforeAfterFeedback').textContent = '';
    document.getElementById('beforeAfterFeedback').className = 'feedback';
    
    // Pick a random letter (not first or last)
    const position = Math.floor(Math.random() * (alphabet.length - 2)) + 1;
    const targetLetter = alphabet[position];
    
    // Randomly choose "before" or "after"
    const type = Math.random() > 0.5 ? 'after' : 'before';
    const correctAnswer = type === 'after' ? alphabet[position + 1] : alphabet[position - 1];
    
    currentBeforeAfter = {
        letter: targetLetter,
        type: type,
        answer: correctAnswer
    };
    
    // Display question
    const questionDiv = document.getElementById('beforeAfterQuestion');
    questionDiv.innerHTML = `
        <div class="question-text">What letter comes ${type}:</div>
        <div class="question-letter">${targetLetter}</div>
    `;
    
    // Generate options
    generateBeforeAfterOptions(correctAnswer, position);
}

function generateBeforeAfterOptions(correctAnswer, position) {
    const optionsDiv = document.getElementById('beforeAfterOptions');
    optionsDiv.innerHTML = '';
    
    // Create options (correct + nearby letters)
    let options = [correctAnswer];
    
    // Add some nearby letters as distractors
    for (let i = -2; i <= 2; i++) {
        if (i !== 0) {
            const index = position + i;
            if (index >= 0 && index < alphabet.length) {
                const letter = alphabet[index];
                if (!options.includes(letter) && options.length < 4) {
                    options.push(letter);
                }
            }
        }
    }
    
    // Fill remaining with random letters if needed
    while (options.length < 4) {
        const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        if (!options.includes(randomLetter)) {
            options.push(randomLetter);
        }
    }
    
    // Shuffle
    options.sort(() => Math.random() - 0.5);
    
    // Create buttons
    options.forEach(letter => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = letter;
        btn.addEventListener('click', () => checkBeforeAfterAnswer(letter, btn));
        optionsDiv.appendChild(btn);
    });
}

function checkBeforeAfterAnswer(selectedLetter, btn) {
    const feedback = document.getElementById('beforeAfterFeedback');
    const allButtons = document.querySelectorAll('#beforeAfterOptions .option-btn');
    
    // Disable all buttons
    allButtons.forEach(b => b.disabled = true);
    
    if (selectedLetter === currentBeforeAfter.answer) {
        beforeAfterScore += 10;
        document.getElementById('beforeAfterScore').textContent = beforeAfterScore;
        feedback.textContent = `🎉 Excellent! ${selectedLetter} comes ${currentBeforeAfter.type} ${currentBeforeAfter.letter}!`;
        feedback.className = 'feedback correct';
        
        speakLetter(selectedLetter);
    } else {
        feedback.textContent = `❌ Not quite! The letter ${currentBeforeAfter.answer} comes ${currentBeforeAfter.type} ${currentBeforeAfter.letter}.`;
        feedback.className = 'feedback incorrect';
    }
}

// Text-to-speech function
function speakLetter(letter) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(letter);
        utterance.rate = 0.7;
        utterance.pitch = 1.2;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    }
}
