const GameBoard = (function () {
    let board = ["","","","","","","","",""];

    const getBoard = function () {
        return board;
    }

    const setCell = function (index, marker) {
        if (board[index] === "") {
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

const GameController = (function () {
    // logic for handling player turns, checking for wins and ties, and switching turns
    const player1 = createPlayer('Player 1', 'X');
    const player2 = createPlayer('Player 2', 'O'); 
    // console.log('players created');

    // set initial player
    let currentPlayer = player1;

    const getCurrentPlayer = function () {
        return currentPlayer;
    }

    const changePlayer = function() {
        if (currentPlayer == player1) {
            currentPlayer = player2;
        } else {
            currentPlayer = player1;
        }
    }

    const checkWin = function(board, marker) {
        // define winning combinations in an array
        const winningCombos = [
            [0,1,2], [3,4,5], [6,7,8], // horizontal rows
            [0,3,6], [1,4,7], [2,5,8], // vertical rows
            [0,4,8], [2,4,6] // diagonals
        ];

        // check the board for winning combos
        return winningCombos.some(function(combo) {
            return combo.every(function(index) {
              return board[index] === marker;
            });
        });
    };

    // check for tied games
    const checkTie = function (board) {
        // if anyone has won, return false
        if (checkWin(board, 'X') || checkWin(board, 'O')) {
            return false;
        };
        // if any cells are empty return false
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                return false;
            }
        }
        return true;
    };

    // reset the game
    const resetGame = function () {
        GameBoard.reset();
        currentPlayer = player1;
    }

    // logic to input player move
    const processTurn = function (index) {
        // update the game board based on chosen cell (index) if it is valid
        if (GameBoard.setCell(index, currentPlayer.marker)) {
            let currentBoard = GameBoard.getBoard();
            // update the UI
            DisplayController.renderBoard(currentBoard);
            // check for win before changing the player
            if (checkWin(currentBoard, currentPlayer.marker) === true) {
                console.log('game has been won');
                return;
            }
            // check for tie
            if (checkTie(currentBoard) === true) {
                console.log('game has been tied');
                return;
            } else {
                console.log('no tie');
            }
            // change the player
            changePlayer();
            console.log('next player will be: ' + currentPlayer.marker);
        } else {
            console.log('invalid selection');
        };
    }

    return { getCurrentPlayer, processTurn };
})();

function createPlayer (name, marker) {
    return { 
        name, 
        marker,
    };
}

const DisplayController = (function () {
    const boardContainer = document.getElementById('game-board');
  
    const renderBoard = function (board) {
      boardContainer.innerHTML = '';
      board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.index = index;
        cellElement.textContent = cell;
        boardContainer.appendChild(cellElement);
      });
      addCellListeners();
    };
  
    const setStatusMessage = function (message) {
      document.getElementById('status').textContent = message;
    };

    // event listeners on cells
    const addCellListeners = function () {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(function (cell) {
            cell.addEventListener('click', function (event) {
                const index = event.target.dataset.index;
                GameController.processTurn(index);
            });
        });
    };
  
    return {
      renderBoard,
      setStatusMessage,
    };
  })();

// initialize display on page load
DisplayController.renderBoard(GameBoard.getBoard());