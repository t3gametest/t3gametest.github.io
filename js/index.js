document.addEventListener('DOMContentLoaded', function (e) {
    var playButton = document.getElementById('resetBoard'); // count score

    var xWon = 0;
    var oWon = 0;
    playButton.addEventListener('click', function () {
        var boardSize = parseInt(document.getElementById('boardSize').value); 
        // min 3 size for start game.
        if (isNaN(boardSize) || boardSize < 3) { 
            alert('Min. 3x3 to play this game');
            return false;
        }

        var totalBlocks = Math.pow(boardSize, 2);
        var board = document.getElementById('board');
        var xWonCountLabel = document.getElementById('xWonCount');
        var oWonCountLabel = document.getElementById('oWonCount'); 

        var gameState = new Array(boardSize * 2 + 2);
        gameState.fill(0);
        var playerTurnIndicator = 0; // to indicate whose turn, even for X, odd for O.

        var shouldRestart = false; // to indicate game should restart.
        // Let's build the board.

        board.style.width = boardSize * 100 + 'px';
        board.innerHTML = '';
        var row = 0; // used for data-row value to indicate which row this block belongs to.

        var column = 0; // used for data-column value to indicate which column this block belongs to.

        for (var i = 1; i <= totalBlocks; i++) {
            if (column >= boardSize) column = 0;

            if (boardSize % 2 === 0) {
                // alternate the dark & light class on block for styling
                // only if boardSize is even size.
                var isEvenRow = Math.ceil(i / boardSize) % 2 == 0;
                var alternateBlock = i % 2 == isEvenRow;
                board.innerHTML += alternateBlock ? "<div data-row='" + row + "' data-column='" + column + "' class='block dark'></div>" : "<div data-row='" + row + "' data-column='" + column + "' class='block light'></div>";
            } else {
                var blockStyle = i % 2 === 0 ? 'dark' : 'light';
                board.innerHTML += "<div data-row='" + row + "' data-column='" + column + "' class='block " + blockStyle + "'></div>";
            }

            column++;
            if (i % boardSize === 0) row += 1;
        }

        var blocks = document.getElementsByClassName('block'); // Attach click handler to each block.

        for (var j = 0; j < blocks.length; j++) {
            blocks[j].addEventListener('click', function () {
                if (shouldRestart) {
                    var answer = confirm('This game is over, do you want to play again?');

                    if (answer) {
                        return playButton.click();
                    } else {
                        return false;
                    }
                }

                if (this.innerHTML !== '') {
                    // Means this block is taken.
                    alert('The block already filled!');
                    return false;
                } else {
                    var _row = parseInt(this.dataset.row); // get value from data-row


                    var _column = parseInt(this.dataset.column); // get value from data-column


                    if (playerTurnIndicator % 2 === 0) {
                        this.classList.add('isX');
                        this.innerHTML = 'X';
                        checkWinner('x', _row, _column);
                    } else {
                        this.classList.add('isO');
                        this.innerHTML = 'O';
                        checkWinner('o', _row, _column);
                    }

                    playerTurnIndicator++;
                }
            });
        }

        var checkWinner = function checkWinner(player, row, column) {
            // point 1 for player X, point -1 for player O.
            var point = player === 'x' ? 1 : -1; // add point to row

            gameState[row] += point; // add point to column

            gameState[boardSize + column] += point; // add point to diag1

            if (row === column) {
                gameState[2 * boardSize] += point;
            } // add point to diag2


            if (row + column === boardSize - 1) {
                gameState[2 * boardSize + 1] += point;
            }

            var xWins = gameState.indexOf(boardSize);
            var oWins = gameState.indexOf(-boardSize);

            if (xWins >= 0) {
                shouldRestart = true;
                xWon += 1;
                xWonCountLabel.value = xWon;
                alert('X has won!');
                return true;
            } else if (oWins >= 0) {
                shouldRestart = true;
                oWon += 1;
                oWonCountLabel.value = oWon;
                alert('O has won!');
                return true;
            } // Means no more block to click and winner has not been found,
            // so it's a draw.
            if (playerTurnIndicator === totalBlocks - 1) {
                shouldRestart = true;
                alert("It's a draw!");
                return false;
            }
        };
    });
});