console.log('hello world');

const GameBoard = (function () {
    let board = ["","","","","","","","",""];

    const getBoard = function () {
        return board;
    }

    const setCell = function (index, marker) {
        if (board[index] == "") {
            board[index] = marker;
            return true;
        } else {
            return false;
        }
    }

    const reset = function () {
        board = ["","","","","","","","",""];
    }

    return { getBoard, setCell, reset };
})();