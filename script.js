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

function Player(name, mark) {

}

const Game = (function() {
    
})()

// const board = ['', 'O', '',
//                 '', 'O', '',
//                 'X', '', 'X'];

// const index = 2;

// if (board[index] === '') {
//     board.splice(index, 1, 'X')
// } else {
//     console.log("You can't place it here")
// }

// for (let i = 0; i < board.length; i++) {
//     if (board[i] !== "") board[i] = "";
// }

// board.forEach(mark => mark = "")

// console.log(board)