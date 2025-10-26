// Player and game data management
let players = JSON.parse(localStorage.getItem('players')) || [];
let scores = JSON.parse(localStorage.getItem('scores')) || [];
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

// DOM elements
const playerList = document.getElementById('playerList');
const scoreboard = document.getElementById('scoreboard');
const gameStatus = document.getElementById('gameStatus');
const cells = document.querySelectorAll('#gameBoard .cell');
const addPlayerBtn = document.getElementById('addPlayer');
const playerNameInput = document.getElementById('playerName');
const resetGameBtn = document.getElementById('resetGame');

// Winning combinations
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

// Initialize
updatePlayerList();
updateScoreboard();
updateGameStatus();

// Add Player (Create)
addPlayerBtn.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    if (name && !players.includes(name)) {
        players.push(name);
        localStorage.setItem('players', JSON.stringify(players));
        updatePlayerList();
        playerNameInput.value = '';
    }
});

// Update Player (Update)
function updatePlayer(oldName, newName) {
    const index = players.indexOf(oldName);
    if (index !== -1 && newName && !players.includes(newName)) {
        players[index] = newName;
        localStorage.setItem('players', JSON.stringify(players));
        scores = scores.map(score => 
            score.player === oldName ? { ...score, player: newName } : score
        );
        localStorage.setItem('scores', JSON.stringify(scores));
        updatePlayerList();
        updateScoreboard();
    }
}

// Delete Player (Delete)
function deletePlayer(name) {
    players = players.filter(player => player !== name);
    scores = scores.filter(score => score.player !== name);
    localStorage.setItem('players', JSON.stringify(players));
    localStorage.setItem('scores', JSON.stringify(scores));
    updatePlayerList();
    updateScoreboard();
}

// Update Player List (Read)
function updatePlayerList() {
    playerList.innerHTML = '';
    players.forEach(player => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <span>${player}</span>
            <div>
                <button class="edit-player btn btn-link p-0 mx-2" data-name="${player}">Edit</button>
                <button class="delete-player btn btn-link p-0" data-name="${player}">Delete</button>
            </div>
        `;
        playerList.appendChild(li);
    });

    // Add event listeners for edit and delete
    document.querySelectorAll('.edit-player').forEach(btn => {
        btn.addEventListener('click', () => {
            const oldName = btn.dataset.name;
            const newName = prompt('Enter new name:', oldName);
            if (newName) updatePlayer(oldName, newName.trim());
        });
    });

    document.querySelectorAll('.delete-player').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm(`Delete ${btn.dataset.name}?`)) {
                deletePlayer(btn.dataset.name);
            }
        });
    });
}

// Update Scoreboard
function updateScoreboard() {
    scoreboard.innerHTML = '';
    scores.forEach(score => {
        const li = document.createElement('li');
        li.className = 'list-group-item scoreboard-item';
        li.textContent = `${score.player}: ${score.score} points`;
        scoreboard.appendChild(li);
    });
}

// Game Logic
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const index = cell.dataset.index;
        if (gameBoard[index] === '' && gameActive) {
            gameBoard[index] = currentPlayer;
            cell.textContent = currentPlayer;
            if (checkWin()) {
                gameStatus.textContent = `${currentPlayer} wins!`;
                updateScore(currentPlayer);
                gameActive = false;
            } else if (gameBoard.every(cell => cell !== '')) {
                gameStatus.textContent = "It's a tie!";
                gameActive = false;
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                updateGameStatus();
            }
        }
    });
});

// Reset Game
resetGameBtn.addEventListener('click', () => {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    cells.forEach(cell => (cell.textContent = ''));
    updateGameStatus();
});

// Check Win
function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => gameBoard[index] === currentPlayer);
    });
}

// Update Score
function updateScore(winner) {
    const player = players[Math.floor(Math.random() * players.length)] || 'Anonymous';
    const scoreEntry = scores.find(score => score.player === player);
    if (scoreEntry) {
        scoreEntry.score += 1;
    } else {
        scores.push({ player, score: 1 });
    }
    localStorage.setItem('scores', JSON.stringify(scores));
    updateScoreboard();
}

// Update Game Status
function updateGameStatus() {
    gameStatus.textContent = gameActive ? `Current Player: ${currentPlayer}` : 'Game Over';
}