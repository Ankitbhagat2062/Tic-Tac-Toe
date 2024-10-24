document.addEventListener('DOMContentLoaded', () => {
     let level = 1; // iniatialize the level to 1

    const bgMusic = document.getElementById('bg-music');
    bgMusic.loop = true; // Loop background music
    bgMusic.play();

    const winMusic = document.getElementById('win-music');
    winMusic.volume = 0.5; // Adjust volume for win music

    const drawMusic = document.getElementById('draw-music');
    drawMusic.volume = 0.5; // Adjust volume for draw music

    const clickSound = document.getElementById('click-sound');
    clickSound.volume = 0.8; // Adjust volume for click sound

    const restartSound = document.getElementById('restart-sound');
    restartSound.volume = 0.5; // Adjust volume for restart sound


    const container = document.getElementById('container');
    const board = document.getElementById('board');
    const restartBtn = document.getElementById('restart-btn');
    const resultScreen = document.getElementById('result');
    const resultMessage = document.getElementById('result-message');
    const multiplayerBtn = document.getElementById('multiplayer-btn');
    const computerBtn = document.getElementById('computer-btn');
    const newGameBtn = document.getElementById('new-game-btn');
    const playerTurnMessage = document.createElement('div');
    playerTurnMessage.classList.add('turn-message');
    const levelBtn = document.getElementById('level-btn');

    let currentPlayer = 'X';
    let mode = 'multiplayer';
    const cells = Array.from({ length: 9 });

    function render() {
        board.innerHTML = '';
        container.insertBefore(playerTurnMessage, board);
        playerTurnMessage.textContent = `Player ${currentPlayer === 'X' ? '1' : '2'}'s turn`;
        cells.forEach((value, index) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.textContent = cells[index] || '';
            cell.addEventListener('click', () => {
                if (!cells[index] && !checkWinner()) {
                    cells[index] = currentPlayer;
                    clickSound.play(); // Play click sound
                    cell.textContent = currentPlayer;
                    if (checkWinner()) {
                        winMusic.play(); // Play win music
                        bgMusic.pause(); // Pause background music
                        showResultScreen(`Player ${currentPlayer} wins!`);
                    } else if (checkDraw()) {
                        drawMusic.play(); // Play draw music
                        bgMusic.pause(); // Pause background music
                        showResultScreen('It\'s a draw!');
                    } else {
                        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                        playerTurnMessage.textContent = `Player ${currentPlayer === 'X' ? '1' : '2'}'s turn`; // Update the turn message
                        if (mode === 'computer' && currentPlayer === 'O') {
                            computerMove();
                            currentPlayer = 'X'; // Set currentPlayer back to 'X'
                            render(); // Re-render after computer's move
                        }
                    }
                }
            });
            board.appendChild(cell);
        });
    }

    function checkWinner() {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];
        return winConditions.some(condition => {
            const [a, b, c] = condition;
            return cells[a] && cells[a] === cells[b] && cells[a] === cells[c];
        });
    }

    function checkDraw() {
        return cells.every(cell => cell);
    }

    function renderLevel() {
        levelBtn.textContent = `Level: ${level}`; // Update the level button text
    }

    
    function restartGame() {
        cells.fill(null);
        currentPlayer = 'X';
        resultScreen.style.display = 'none';
        winMusic.pause(); // Pause win music
        drawMusic.pause(); // Pause draw music
        bgMusic.play(); // Resume background music
        restartSound.play(); // Play restart sound            
        renderLevel();
        render();
    }
    
    function showResultScreen(message) {
        resultMessage.textContent = message;
        resultScreen.style.display = 'flex';
        if (message.includes('wins')) {
            winMusic.play(); // Trigger win music
            level++; // Increase the level value if the player wins
            renderLevel(); // Call renderLevel() to update the level button text
        }
    }
 
    renderLevel(); // Call renderLevel() initially to display the level

    function computerMove() {
        if (mode === 'computer' && currentPlayer === 'O') {
        const emptyCells = cells.reduce((acc, val, index) => {
            if (!val) acc.push(index);
            return acc;
        }, []);
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const cellIndex = emptyCells[randomIndex];
        cells[cellIndex] = currentPlayer;
        currentPlayer = 'X';
        render();
    }
}

    function renderLevel() {
        levelBtn.textContent = `Level: ${level}`;
    }

    multiplayerBtn.addEventListener('click', () => {
        mode = 'multiplayer';
        level = 1;
        restartGame();
        multiplayerBtn.classList.add('selected');
        computerBtn.classList.remove('selected');
    });

    computerBtn.addEventListener('click', () => {
        mode = 'computer';
        level = 1;
        restartGame();
        computerBtn.classList.add('selected');
        multiplayerBtn.classList.remove('selected');
        if (currentPlayer === 'O') {
            computerMove();
            currentPlayer = 'X'; // Set currentPlayer back to 'X'
            render(); // Re-render after computer's move
        }
    });

    restartBtn.addEventListener('click', restartGame);
    newGameBtn.addEventListener('click', () => {
        restartGame();
        currentPlayer = 'X'; // Reset player to default after choosing new game
    renderLevel();
    render();
    });
    
});   