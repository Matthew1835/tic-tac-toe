const GameBoard = (function() {
    const board = ['', '', '',
                   '', '', '',
                   '', '', ''];

    const getBoard = () => {
        return [...board];
    }

    const placeMark = (index, marker) => {
        if (Number.isNaN(index) || !Number.isFinite(index) || index >= board.length || index < 0) {
            return false;
        } 

        if (marker !== 'X' && marker !== 'O') return false;

        if (board[index] === '') {
            board[index] = marker;
            return true;
        } else {
            return false;
        }
    }

    const cleanBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    }

    return { getBoard, placeMark, cleanBoard };
})();

function createPlayer(name, marker) {
    return { name, marker }
}

const Game = (function() {
    let player1;
    let player2;
    let currentPlayer;
    let gameOver = false;

    const startGame = (name1, name2) => {
        player1 = createPlayer(name1, "X");
        player2 = createPlayer(name2, "O");
        resetGame();
    }

    const playRound = (index) => {
        if (!player1 || !player2) return { status: "not-started" };

        if (gameOver) return;

        const success = GameBoard.placeMark(index, currentPlayer.marker)

        if (!success) return { status: "invalid" };

        if (checkWin()) {
            gameOver = true;
            return { status: "win", winner: currentPlayer };
        } else if (checkTie()) {
            gameOver = true;
            return { status: "tie" };
        } else {
            switchTurn();
            return { status: "continue", currentPlayer }
        }
    }

    const switchTurn = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    }

    const checkWin = () => {
        const board = GameBoard.getBoard();

        const winConditions = [
            // Horizontal rows
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            // Vertical columns
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            // Diagonals
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let condition of winConditions) {
            const [a, b, c] = condition;

            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return true;
            }
        }
        return false;
    }

    const checkTie = () => {
        const board = GameBoard.getBoard();

        return !board.some(item => item === "");
    }

    const resetGame = () => {
        GameBoard.cleanBoard();
        currentPlayer = player1;
        gameOver = false;
    }

    const getCurrentPlayer = () => currentPlayer;
    const isGameOver = () => gameOver;
    const getPlayers = () => ({ player1, player2 });

    return { startGame, playRound, resetGame, getCurrentPlayer, isGameOver, getPlayers }
})();

const DisplayController = (function() {
    const container = document.querySelector('.square-container')
    const squares = document.querySelectorAll(".square");
    const startBtn = document.getElementById("start-btn");
    const restartBtn = document.getElementById("restart-btn");
    const nameDialog = document.getElementById("nameDialog");
    const resultDialog = document.getElementById('resultDialog');
    const turnBanner = document.getElementById('turn-banner');
    const turnIndicator = document.getElementById('turn-indicator');
    const turnText = document.getElementById('turn-text');
    const playAgainBtn = document.getElementById('play-again-btn');
    const changePlayersBtn = document.getElementById('change-players-btn');

    window.addEventListener('DOMContentLoaded', () => {
        nameDialog.showModal();
    });

    const handleWin = (name) => {
        container.classList.add('disabled-div');

        setTimeout(() => {
            document.getElementById('result-emoji').textContent = '🏆';
            document.getElementById('result-title').textContent = `${name} Wins!`;
            document.getElementById('result-sub').textContent = `${name} takes the round!`;
            resultDialog.showModal();
        }, 600);
    }

    function handleDraw() {
        container.classList.add('disabled-div');

        setTimeout(() => {
            document.getElementById('result-emoji').textContent = '🤝';
            document.getElementById('result-title').textContent = "It's a Draw!";
            document.getElementById('result-sub').textContent = 'Nobody wins this round.';
            resultDialog.showModal();
        }, 400);
    }

    startBtn.addEventListener('click', () => {
        const name1 = document.getElementById('player-1').value.trim() || 'Player 1';
        const name2 = document.getElementById('player-2').value.trim() || 'Player 2';

        Game.startGame(name1, name2);

        nameDialog.close();
        squares.forEach(square => square.textContent = "");
        updateTurnBanner();
        container.classList.remove("disabled-div");
    })
    
    const updateTurnBanner = () => {
        const player = Game.getCurrentPlayer();
        
        const isX = player.marker === 'X';
        turnBanner.className = 'turn-banner ' + (isX ? 'x-turn' : 'o-turn');
        turnIndicator.textContent = isX ? '✕' : '○';
        turnText.textContent = `${player.name}'s turn`;
    }

    squares.forEach((square, index) => {
        square.addEventListener('click', () => {
            const player = Game.getCurrentPlayer();
            const result = Game.playRound(index);

            if (!result || result.status === 'invalid') return;

            square.textContent = player.marker;

            if (result.status === 'win') {
                handleWin(result.winner.name);
            } else if (result.status === 'tie') {
                handleDraw();
            } else {
                updateTurnBanner();
            }
        })
    })

    restartBtn.addEventListener('click', () => {
        Game.resetGame();
        nameDialog.showModal();
        document.getElementById('player-1').value = "";
        document.getElementById('player-2').value = "";
    })

    playAgainBtn.addEventListener('click', () => {
        const name1 = Game.getPlayers().player1.name;
        const name2 = Game.getPlayers().player2.name;

        Game.startGame(name1, name2);
        container.classList.remove("disabled-div");
        
        resultDialog.close();
        squares.forEach(square => square.textContent = "");
        updateTurnBanner();
    })

    changePlayersBtn.addEventListener('click', () => {
        document.getElementById('player-1').value = "";
        document.getElementById('player-2').value = "";

        resultDialog.close();
        nameDialog.showModal();
    })
})();

