/* Gameboard is an object to represent the state of the tic-tac-toe gameboard
*  and has methods to update it, the gameboard is in the board object and is a
*  3x3 array of strings/
*/
const gameboard = (() => {
    let board = [["", "", ""], ["", "", ""], 
    ["", "", ""]]; //gameboard defined by a 3x3 array of strings;
    
    /*The play function updates board[i][j] to be symbol, if it is empty
    * Precondition: board[i][j] exists.
    * Post-condition: returns true if board[i][j] is empty and sets board[i][j]
    *  to symbol, if board[i][j] already has a non-empty string board is not modified
    * and returns false
    */
    const play = function (i, j, symbol) {
        if(board[i][j] == "") {
            board[i][j] = symbol;
            return true;
        } else {
            return false;
        }
    };
    /* Checks if board contains a three-in-a-row of the same symbol,
    *  if a three-in-a-row exists, returns true. If no three-in-a-row
    *  exists then if the board is full returns "draw", otherwise
    *  returns false
    */
    const checkGame = () => {
        let hasWinner = checkDiagonals() || checkVerticals() || checkHorizontals();
        if(hasWinner){
            return hasWinner;
        } else{
            for (i = 0; i < board.length; i++){
                for(j = 0; j < board.length; j++){
                    if(board[i][j] == ""){
                        return hasWinner;
                    }
                }
            }
            return "draw";
        }
    }
    //private function for checkgame
    function checkDiagonals(){
        let leftDiag = (board[0][0] == board [1][1] 
                && board [1][1] == board[2][2] && board[1][1] !== "");
        let rightDiag = (board[2][0] == board [1][1] 
            && board [1][1] == board[0][2] && board[1][1] !== "");
        return (leftDiag || rightDiag);       
    }
    //private function for checkgame
    function checkVerticals(){
        for(j = 0; j < board.length; j++){
            let bool = (board[0][j] == board[1][j] && board [1][j] == board[2][j]) && board[0][j] != "";
            if(bool) {
                return bool;
            }
        }
        return false;
    }
    //private function for checkgame
    function checkHorizontals(){
        for(i = 0; i < board.length; i++){
            let bool = (board[i][0] == board[i][1] && board [i][1] == board[i][2]) && board[i][0] != "";
            if(bool) {
                return bool;
            }
        }
        return false;
    }
    /* Resets the board by setting the value of all indices to an
    *  empty string.
    */
    function resetBoard(){
        for(i = 0; i < board.length; i++){
            for(j = 0; j < board.length; j++){
                board[i][j] = "";
            }
        }
    }
    return {board, play, checkGame, resetBoard};
})();
/* Display Controller object updates both game logic and the appearance of
*  the game container. The only public function initializeGame, which is
*  meant to be called only once when the page is opened.
*/
const displayController = (() => {
    const player1 = player("", "x");
    const player2 = player("", "o");
    let player1turn = false; //true if player1's turn, false if player2's turn
    let initialized = false;
    let finished = false; //means the game is over
    let draw = false;

    /* IntializeGame, resets the gameboard and renders a new copy of the board,
    * then it adds an EventListener to all game cells, so that they become functional
    * It also sets all the game logic back to the original state. If it is the
    * first time intializing, then it instead adds an EventListener to the start
    * button to intialize the game
    */
    const initializeGame = function(){
        gameboard.resetBoard();
        renderBoard();
        finished = false;
        player1turn = true;
        draw = false;
        if(!initialized) {
            initialized = true;
            startButton = document.querySelector("#start");
            startButton.addEventListener('click', () => {
                displayController.initializeGame();
                let pName = document.querySelector("#player1").value;
                player1.name = (pName == '') ? 'Player 1' : pName;
                pName = document.querySelector("#player2").value;
                player2.name = (pName == '') ? 'Player 2' : pName;
                startButton.textContent = "Reset";
                updateText();
            });
            return;
        }
        const gameCells = document.querySelectorAll(".game-cell");
        gameCells.forEach(cell => cell.addEventListener('click', () => {
            advanceGame(cell.id.charAt(0), cell.id.charAt(1));
        }));
    }
    /* Clears the game container and then adds a 3x3 grid
    *  of game cells to the game container
    */
    function renderBoard(){
        const gameContainer = document.querySelector("#game-container");
        gameContainer.innerHTML = '';
        for(i = 0; i < gameboard.board.length; i++){
            for (j = 0; j < gameboard.board.length; j++) {
                let cell = document.createElement("div");
                cell.classList.add("game-cell");
                cell.id = i.toString() + j.toString();
                cell.textContent = gameboard.board[i][j];
                gameContainer.appendChild(cell);
            }
        }
    }
    /* UpdateText will update the game message, depending on the state of the
    * game (whose turn it is and whether the game is complete)
    */
    function updateText(){
        const gameMessage = document.getElementById("game-message");
        if(!finished) {
            const player = player1turn ? player1 : player2;
            gameMessage.textContent = player.name + "'s turn"
        } else if (draw) {
            gameMessage.textContent = "Draw, play again?";
        } else {
            const player = player1turn ? player1 : player2;
            gameMessage.textContent = player.getWinMessage() + " Play again?"
        }
    }
    /* Precondition: gameboard.board[i][j] exists
    * Attempts to call play on gameboard.board[i][j], with the symbol
    * being the active symbol of the player whose turn it is. Will update
    * the corresponding grid cell to contain the active player's symbol
    * and the content of the gameMessage if successful. If the game is finished
    * this function does nothing.
    */
    function advanceGame(i, j) {
        let activeSymbol = player1turn ? player1.symbol : player2.symbol;
        if(!gameboard.play(i, j, activeSymbol) || finished) {
            return;
        }
        document.getElementById(i + j).textContent = activeSymbol;
        let result = gameboard.checkGame();
        if(result == false) {
            player1turn = !player1turn;
            updateText();
            return;
        }
        finished = true;
        draw = (result == "draw");
        updateText();
        document.getElementById("start").textContent = "Play!";
    }
    return({initializeGame});
})();


/* Player Name and Symbol are strings representing the name and symbol 
* ("x" or "o"), of that player, getWinMessage returns a string using the
* player's name.
*/
function player(name, symbol){
    let getWinMessage = function (){
        return this.name + " wins!";
    }
    return {name, symbol, getWinMessage};
}

displayController.initializeGame();
