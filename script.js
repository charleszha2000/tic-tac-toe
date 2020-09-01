const gameboard = (() => {
    let board = [["", "", ""], ["", "", ""], 
    ["", "", ""]]; //gameboard defined by a 3x3 array of strings;
    const play = function (i, j, symbol) {
        if(board[i][j] == "") {
            board[i][j] = symbol;
            return true;
        } else {
            return false;
        }
    };
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
    function checkDiagonals(){
        let leftDiag = (board[0][0] == board [1][1] 
                && board [1][1] == board[2][2] && board[1][1] !== "");
        let rightDiag = (board[2][0] == board [1][1] 
            && board [1][1] == board[0][2] && board[1][1] !== "");
        return (leftDiag || rightDiag);       
    }
    function checkVerticals(){
        for(j = 0; j < board.length; j++){
            let bool = (board[0][j] == board[1][j] && board [1][j] == board[2][j]) && board[0][j] != "";
            if(bool) {
                return bool;
            }
        }
        return false;
    }
    function checkHorizontals(){
        for(i = 0; i < board.length; i++){
            let bool = (board[i][0] == board[i][1] && board [i][1] == board[i][2]) && board[i][0] != "";
            if(bool) {
                return bool;
            }
        }
        return false;
    }
    function resetBoard(){
        for(i = 0; i < board.length; i++){
            for(j = 0; j < board.length; j++){
                board[i][j] = "";
            }
        }
    }
    return {board, play, checkGame, resetBoard};
})();

const displayController = (() => {
    const player1 = player("", "x");
    const player2 = player("", "o");
    let player1turn = false;
    let initialized = false;
    let finished = false;
    let draw = false;

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

    function updateText(){
        console.log("updating text");
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

displayController.initializeGame();

function player(name, symbol){
    let getWinMessage = function (){
        return this.name + " wins!";
    }
    return {name, symbol, getWinMessage};
}
