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

    // const player1 = createPlayer("M", "X"); 
    // const player2 = createPlayer("AI", "O"); 
    // let currentPlayer = player1; 
    // let gameOver = false;

    const startGame = (name1, name2) => {
        player1 = createPlayer(name1, "X");
        player2 = createPlayer(name2, "O");
        resetGame();
    }

    const playRound = (index) => {
        if (!player1 || !player2) return;

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

    return { startGame, playRound, resetGame, getCurrentPlayer, isGameOver }
})();

const DisplayController = (function() {



})();

console.log(Game.playRound(4))


// const testBoard = ['', 'O', '',
//                    '', 'O', '',
//                    'X', '', 'X'];

// const testCheckTie = () => {
//     const hasEmpty = testBoard.some(item => item === "");

//     if (hasEmpty) { return false }
//     else { return true }
// }

// // console.log('Hello')
// console.log(testCheckTie())