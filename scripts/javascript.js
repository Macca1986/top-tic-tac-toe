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

// variable to store whether the game is active or not (ie, a player can make a move)
let gameActive = true;

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
        DisplayController.setStatusMessage(currentPlayer.name + ' to go next');
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
        DisplayController.renderBoard(GameBoard.getBoard());
        currentPlayer = player1;
        DisplayController.setStatusMessage(currentPlayer.name + ' to go next')
        gameActive = true;
    }

    // logic to input player moves
    const processTurn = function (index) {
        // if the game is not active, don't process any turns
        if (!gameActive) {
            return;
        }
        // update the game board based on chosen cell (index) if it is valid
        if (GameBoard.setCell(index, currentPlayer.marker)) {
            let currentBoard = GameBoard.getBoard();
            // update the UI
            DisplayController.renderBoard(currentBoard);
            // check for win before changing the player
            if (checkWin(currentBoard, currentPlayer.marker) === true) {
                DisplayController.setStatusMessage(currentPlayer.name + ' wins!')
                gameActive = false;
                return;
            }
            // check for tie
            if (checkTie(currentBoard) === true) {
                DisplayController.setStatusMessage('Game tied!')
                gameActive = false;
                return;
            } 
            // change the player
            changePlayer();
        };
    }

    return { getCurrentPlayer, processTurn, resetGame };
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
        if (cell === 'X') {
            cellElement.style.color = '#FF6B6B';
        } else if (cell === 'O') {
            cellElement.style.color = '#4ECDC4';
        }
        boardContainer.appendChild(cellElement);
      });
      addCellListeners();
    };

    // function to render the cells and status messages on page load
    const initialRender = function () {
        renderBoard(GameBoard.getBoard());
        setStatusMessage('Player 1 to go first')
    }
  
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
      initialRender,
    };
  })();

// initialize display on page load
DisplayController.initialRender();

// event listener for resetting the game
const resetButton = document.querySelector('#reset-button');
resetButton.addEventListener('click', function (event) {
    GameController.resetGame();
})