const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#score");
const resetButton = document.querySelector("#resetButton");
const gameWidth = gameBoard.width;
const gameHeight= gameBoard.height;
const boardBackground = "rgb(20, 20, 20)";
const textColor = "white";
const snakeColor = "rgb(30, 200, 30)";
const foodColor = "red";
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
    {x:0, y:0},
    {x:unitSize, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 4, y:0}
];

window.addEventListener("keydown", changeDirection);
resetButton.addEventListener("click", resetGame);

gameStart();

function gameStart(){
    running = true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    nextTick();
}
function nextTick(){
    if (running){
        setTimeout(() => {
            checkGameOver();
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            nextTick();
        }, 75)
    }
    else{
        displayGameOver();
    }
}
function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}
function createFood(){
    function randomFood(min, max){
        return Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameHeight - unitSize);
}
function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
}
function moveSnake(){
    const head = {x: snake[0].x + xVelocity, y: snake[0].y + yVelocity};
    snake.unshift(head);
    if (snake[0].x === foodX && snake[0].y === foodY){
        score += 1;
        scoreText.textContent = score;
        createFood();
    }
    else{
        snake.pop();
    }
}
function drawSnake(){
    ctx.fillStyle = snakeColor;
    snake.forEach((snakePart)=>{
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })
}
function changeDirection(event){
    const keyPressed = event.keyCode;
    const left = 65;
    const right = 68;
    const up = 87;
    const down = 83;

    const goingUp = (yVelocity === unitSize);
    const goingDown = (yVelocity === -unitSize);
    const goingRight = (xVelocity === unitSize);
    const goingLeft = (xVelocity === -unitSize);

    if (keyPressed === left){
        if (!goingRight){
            yVelocity = 0;
            xVelocity = -25;
        }
    }
    else if (keyPressed === right){
        if (!goingLeft){
            yVelocity = 0;
            xVelocity = 25;
        }
    }
    else if (keyPressed === up){
        if (!goingUp){
            xVelocity = 0;
            yVelocity = -25;
        }
    }
    else if (keyPressed === down){
        if (!goingDown){
            xVelocity = 0;
            yVelocity = 25;
        }
    }
}
function checkGameOver(){
    if (snake[0].x >= gameWidth || snake[0].y >= gameHeight || snake[0].x < 0 || snake[0].y < 0){
        running = false;
        window.addEventListener("keydown", checkRestart);
        return;
    }

    let isFirst = true;
    for (let snakePart in snake){
        if (isFirst){
            isFirst = false;
            continue;
        }

        if (snake[0].x === snakePart.x && snake[0].y === snakePart.y){
            running = false;
            window.addEventListener("keydown", checkRestart);
            break;
        }
    }
}
function checkRestart(event){
    const keyPressed = event.keyCode;
    if (keyPressed === 82){
        window.addEventListener("keydown", changeDirection);
        resetGame();
    }
}
function displayGameOver(){
    clearBoard();
    ctx.fillStyle = textColor;
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", gameWidth / 2 - 100, gameHeight / 2 - 50);
    ctx.font = "25px Arial";
    ctx.fillText("Press 'R' to reset", gameWidth / 2 - 90, gameHeight / 2);
}
function resetGame(){
    score = 0;
    snake = [
        {x:0, y:0},
        {x:unitSize, y:0},
        {x:unitSize * 2, y:0},
        {x:unitSize * 3, y:0},
        {x:unitSize * 4, y:0}
    ];
    xVelocity = unitSize;
    yVelocity = 0;
    gameStart();
}