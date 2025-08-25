
const board = document.getElementById('board');
const guessInput = document.getElementById('guess-input');
const submitButton = document.getElementById('submit-button');
const messageDisplay = document.getElementById('message');

let currentRow = 0;
let targetWord; // This will hold our randomly selected word

// We will load the words here
let WORD_LIST = [];

// --- ASYNCHRONOUS WORD LOADING ---
async function loadWords() {
    try {
        const response = await fetch('words.txt');
        const text = await response.text();
        // Split the text file into an array of words
        WORD_LIST = text.split('\n').map(word => word.trim().toUpperCase()).filter(word => word.length === 5);
        
        // Once words are loaded, start the game
        startGame();
    } catch (error) {
        console.error("Failed to load word list:", error);
        messageDisplay.textContent = "Error: Failed to load words. Check the console for details.";
    }
}

// Create the board tiles
function createBoard() {
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.id = `tile-${i}-${j}`;
            board.appendChild(tile);
        }
    }
}

// Start the game, now with a random word from the list
function startGame() {
    targetWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    console.log("The secret word is: ", targetWord); // For testing, you can remove this later
    
    // Reset the game for a new round
    currentRow = 0;
    messageDisplay.textContent = "";
    guessInput.value = "";
    guessInput.disabled = false;
    submitButton.disabled = false;
}

// Handle the user's guess
function handleGuess() {
    const guess = guessInput.value.toUpperCase();

    if (guess.length !== 5) {
        messageDisplay.textContent = "Your guess must be 5 letters!";
        return;
    }

    if (currentRow < 6) {
        let guessChars = guess.split('');
        let wordChars = targetWord.split('');
        let correctLetters = Array(5).fill(false);

        // Check for correct letters in the correct position
        for (let i = 0; i < 5; i++) {
            const tile = document.getElementById(`tile-${currentRow}-${i}`);
            tile.textContent = guessChars[i];

            if (guessChars[i] === wordChars[i]) {
                tile.classList.add('correct');
                correctLetters[i] = true;
                wordChars[i] = null; // Mark as used
            }
        }

        // Check for correct letters in the wrong position
        for (let i = 0; i < 5; i++) {
            if (correctLetters[i]) continue;
            
            const tile = document.getElementById(`tile-${currentRow}-${i}`);
            if (wordChars.includes(guessChars[i])) {
                tile.classList.add('present');
                wordChars[wordChars.indexOf(guessChars[i])] = null; // Mark as used
            } else {
                tile.classList.add('absent');
            }
        }

        // Check for win condition
        if (guess === targetWord) {
            messageDisplay.textContent = "You won! 🎉";
            guessInput.disabled = true;
            submitButton.disabled = true;
        } else if (currentRow === 5) {
            messageDisplay.textContent = `Game over! The word was ${targetWord}.`;
            guessInput.disabled = true;
            submitButton.disabled = true;
        } else {
            messageDisplay.textContent = "";
        }

        currentRow++;
        guessInput.value = "";
    }
}

submitButton.addEventListener('click', handleGuess);
guessInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleGuess();
    }
});

// Initialize the game by creating the board and then loading the words
createBoard();
loadWords();