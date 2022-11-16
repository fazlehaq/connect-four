const board = document.querySelector('.game-board');
const cells = document.querySelectorAll('.cell');
const gameOverElement = document.querySelector('.game-over-element');
const gameOverMsgElement = document.querySelector('.msg');
const restartButton = document.querySelector('#restart-button');
// const
let player1 = "red";
let player2 = "green";
let totalMoves = null;
let winningMsg = null;


startGame();


function startGame(){
    // initializers
    totalMoves = 0;
    winningMsg = null;
    cells.forEach(cell=>{
        cell.addEventListener('click',fun1)
    });
    board.classList.toggle(player1);
}

// EventListner
function fun1(){
    if(!checkIfCellISEmpty(this))
    return;

    // Positioning Coin on orrect Place
    const position = setCoin(this);

    // checking For Win
    if(checkForWinner(position.row,position.col)){
        return;
    }

    // Checking for Draw
    totalMoves++;
    if(totalMoves == 42){
        totalMoves = 0;
        gameDraw();
        return;
    }

    swapTurns();
}

function checkIfCellISEmpty(cell){
    if(cell.classList.contains(player1) || cell.classList.contains(player2)) return false;
    return true;
}

function getCurrPlayer(){
    if(board.classList.contains(player1)) return player1;
    return player2;
}

function swapTurns(){
    board.classList.toggle(player1);
    board.classList.toggle(player2);
}

// there are some calulation related issues in this section 
// This problems Wa Caused becoz we have to remove once:true from event Listner 
// We fixed this by checking if cell conatins any class checkIfClassIsEmpty

function setCoin(cell){
    let row = findRow(cell) 
    let col = findColumn(cell);

    while(row<=6){
        if(board.children[row-1].children[col-1].classList.contains("green") ||
        (board.children[row-1].children[col-1].classList.contains("red")))
        break ;

        row++;
    }
    row--; // becoz when we break out of the while loop we have one extra ++
    placeCoin(row,col);
    return ({"row" : row , "col" : col});
}

function findRow(cell){
    return parseInt(cell.parentElement.getAttribute("data-row"));
}

function findColumn(cell){
    return parseInt(cell.getAttribute("data-col"));
}

function placeCoin(row,col){
    board.children[row-1].children[col-1].classList.add(getCurrPlayer());
}

function checkForWinner(row,col){
    if(checkRowWise(row,col) || checkColumWise(col)){
        gameOver();
        return true;
    }
}

function checkColumWise(col){
    let macthedCells=0;
    for(let row=6;row>0;row--){
        if(!board.children[row-1].children[col-1].classList.contains(getCurrPlayer())){
            macthedCells = 0;
        }
        else{
            macthedCells++;
        }
        console.log("matched cells : "+ macthedCells)
        if(macthedCells == 4){
            console.log("winner Found : "+getCurrPlayer())
            return true;
        }
    }
    return false;

}

function checkRowWise(row,col){
    let matchedMoves = 0;
    const rowElement = document.querySelector(`[data-row="${row}"]`);

    for(let i=0;i<7;i++){
        if(rowElement.children[i].classList.contains(getCurrPlayer())){
            matchedMoves++;
        }else{
            matchedMoves = 0;
        }

        if(matchedMoves >= 4){
            return true
        }
    }
    return false;
}


// Game Over
function gameOver(){
    winningMsg = `${getCurrPlayer()} Won!!`;
    showWinningElement(winningMsg);
}



function showWinningElement(winningMsg){
    gameOverElement.style.display="flex";
    gameOverMsgElement.innerText=winningMsg;
}

// Game Draw
function gameDraw(){
    winningMsg = `Game Draw!!`
    showWinningElement(winningMsg);
}


// restart game
restartButton.addEventListener('click',()=>{
    hideWinningElement();
    resetBoard();
})

function hideWinningElement(){
    gameOverElement.style.display="none";
}

function resetBoard(){
    cells.forEach(cell =>{
        cell.classList.remove(player1);
        cell.classList.remove(player2);
        cell.removeEventListener('click',fun1);
    })
    board.classList.remove(player1);
    board.classList.remove(player2);
    startGame();
}