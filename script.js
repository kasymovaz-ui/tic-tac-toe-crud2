let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let results = JSON.parse(localStorage.getItem('results')) || [];

function makeMove(index) {
  if (gameBoard[index] === '' && gameActive) {
    gameBoard[index] = currentPlayer;
    document.getElementsByClassName('cell')[index].innerText = currentPlayer;
    checkWinner();
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('gameStatus').innerText = `Ход игрока: ${currentPlayer}`;
  }
}

function checkWinner() {
  const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      gameActive = false;
      document.getElementById('gameStatus').innerText = `Победа игрока ${gameBoard[a]}!`;
      saveResult(gameBoard[a]);
      return;
    }
  }
  if (!gameBoard.includes('')) {
    gameActive = false;
    document.getElementById('gameStatus').innerText = 'Ничья!';
    saveResult('Ничья');
  }
}

function saveResult(outcome) {
  const playerName = document.getElementById('playerName').value || 'Игрок';
  results.push({ name: playerName, outcome });
  localStorage.setItem('results', JSON.stringify(results));
  displayResults();
}

function displayResults() {
  const resultsBody = document.getElementById('resultsBody');
  resultsBody.innerHTML = '';
  results.forEach((result, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${result.name}</td>
      <td>${result.outcome}</td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="editResult(${index})">Редактировать</button>
        <button class="btn btn-sm btn-danger" onclick="deleteResult(${index})">Удалить</button>
      </td>
    `;
    resultsBody.appendChild(row);
  });
}

function editResult(index) {
  const newName = prompt('Введите новое имя:', results[index].name);
  if (newName) {
    results[index].name = newName;
    localStorage.setItem('results', JSON.stringify(results));
    displayResults();
  }
}

function deleteResult(index) {
  results.splice(index, 1);
  localStorage.setItem('results', JSON.stringify(results));
  displayResults();
}

function resetGame() {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = 'X';
  document.getElementById('gameStatus').innerText = `Ход игрока: ${currentPlayer}`;
  Array.from(document.getElementsByClassName('cell')).forEach(cell => (cell.innerText = ''));
}

document.addEventListener('DOMContentLoaded', displayResults);