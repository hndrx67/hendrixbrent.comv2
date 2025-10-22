// Alphabet learning JavaScript for uppercase-lowercase identification

// Generate all letters A-Z
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    generateLetterGrid();
    initializeMatchingGame();
});

// Generate interactive letter grid
function generateLetterGrid() {
    const letterGrid = document.getElementById('letterGrid');
    
    alphabet.forEach(letter => {
        const btn = document.createElement('button');
        btn.className = 'letter-btn';
        btn.textContent = letter;
        btn.addEventListener('click', () => showLetterDetails(letter));
        letterGrid.appendChild(btn);
    });
}

// Show uppercase and lowercase letter details
function showLetterDetails(letter) {
    const displayDiv = document.getElementById('letterDisplay');
    const lowercase = letter.toLowerCase();
    
    // Play letter sound (using Speech Synthesis API)
    speakLetter(letter);
    
    displayDiv.innerHTML = `
        <div class="display-card">
            <h3>The Letter "${letter}"</h3>
            <div class="letter-showcase">
                <div class="letter-box">
                    <p>Uppercase</p>
                    <div class="letter-big">${letter}</div>
                </div>
                <div class="letter-box">
                    <p>Lowercase</p>
                    <div class="letter-big">${lowercase}</div>
                </div>
            </div>
            <button class="btn btn-small" onclick="speakLetter('${letter}')">🔊 Say it again!</button>
        </div>
    `;
}

// Text-to-speech function
function speakLetter(letter) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(letter);
        utterance.rate = 0.7; // Slower for children
        utterance.pitch = 1.2; // Higher pitch for friendly voice
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        window.speechSynthesis.speak(utterance);
    }
}

// ============================================
// Matching Game
// ============================================

let score = 0;
let selectedUpper = null;
let selectedLower = null;
let matchedLetters = [];

function initializeMatchingGame() {
    document.getElementById('resetBtn').addEventListener('click', resetMatchingGame);
    resetMatchingGame();
}

function resetMatchingGame() {
    score = 0;
    selectedUpper = null;
    selectedLower = null;
    matchedLetters = [];
    
    document.getElementById('score').textContent = score;
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';
    
    // Generate random subset of 5 letters for the game
    const gameLetters = getRandomLetters(5);
    
    generateMatchingColumns(gameLetters);
}

function getRandomLetters(count) {
    const shuffled = [...alphabet].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function generateMatchingColumns(letters) {
    const upperColumn = document.getElementById('upperLetters');
    const lowerColumn = document.getElementById('lowerLetters');
    
    upperColumn.innerHTML = '';
    lowerColumn.innerHTML = '';
    
    // Shuffle lowercase letters for the matching challenge
    const shuffledLower = [...letters].sort(() => Math.random() - 0.5);
    
    letters.forEach(letter => {
        const btn = document.createElement('button');
        btn.className = 'match-btn';
        btn.textContent = letter;
        btn.dataset.letter = letter;
        btn.addEventListener('click', () => selectUpperLetter(letter, btn));
        upperColumn.appendChild(btn);
    });
    
    shuffledLower.forEach(letter => {
        const btn = document.createElement('button');
        btn.className = 'match-btn';
        btn.textContent = letter.toLowerCase();
        btn.dataset.letter = letter;
        btn.addEventListener('click', () => selectLowerLetter(letter, btn));
        lowerColumn.appendChild(btn);
    });
}

function selectUpperLetter(letter, btn) {
    // Deselect previous selection
    document.querySelectorAll('#upperLetters .match-btn').forEach(b => {
        if (!b.classList.contains('matched')) {
            b.classList.remove('selected');
        }
    });
    
    if (matchedLetters.includes(letter)) return;
    
    selectedUpper = letter;
    btn.classList.add('selected');
    
    checkMatch();
}

function selectLowerLetter(letter, btn) {
    // Deselect previous selection
    document.querySelectorAll('#lowerLetters .match-btn').forEach(b => {
        if (!b.classList.contains('matched')) {
            b.classList.remove('selected');
        }
    });
    
    if (matchedLetters.includes(letter)) return;
    
    selectedLower = letter;
    btn.classList.add('selected');
    
    checkMatch();
}

function checkMatch() {
    if (selectedUpper && selectedLower) {
        const feedback = document.getElementById('feedback');
        
        if (selectedUpper === selectedLower) {
            // Correct match!
            score += 10;
            document.getElementById('score').textContent = score;
            
            feedback.textContent = `🎉 Great job! ${selectedUpper} and ${selectedLower.toLowerCase()} match!`;
            feedback.className = 'feedback correct';
            
            // Mark as matched
            matchedLetters.push(selectedUpper);
            document.querySelectorAll('.match-btn.selected').forEach(btn => {
                btn.classList.add('matched');
                btn.classList.remove('selected');
            });
            
            // Play success sound
            speakLetter(selectedUpper);
            
            // Check if game is complete
            if (matchedLetters.length === 5) {
                setTimeout(() => {
                    feedback.textContent = `🌟 Amazing! You matched all letters! Score: ${score}`;
                }, 1000);
            }
            
        } else {
            // Incorrect match
            feedback.textContent = `❌ Not quite! ${selectedUpper} and ${selectedLower.toLowerCase()} don't match. Try again!`;
            feedback.className = 'feedback incorrect';
            
            // Remove selections after a delay
            setTimeout(() => {
                document.querySelectorAll('.match-btn.selected').forEach(btn => {
                    btn.classList.remove('selected');
                });
                feedback.textContent = '';
                feedback.className = 'feedback';
            }, 2000);
        }
        
        selectedUpper = null;
        selectedLower = null;
    }
}

// Make speakLetter available globally for the onclick handler
window.speakLetter = speakLetter;
