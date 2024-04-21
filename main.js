const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

let score = 0;
const scoreDisplay = document.getElementById('score');

const snake = [
    {x: 160, y: 160},
    {x: 140, y: 160},
    {x: 120, y: 160}
];

let dx = 20;
let dy = 0;
let foodX;
let foodY;

function main() {
    if (hasGameEnded()) return;
    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        main();
    }, 100);
}

function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach(part => {
        ctx.fillStyle = 'green';
        ctx.fillRect(part.x, part.y, 20, 20);
        ctx.strokeRect(part.x, part.y, 20, 20);
    });
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    
    const hasEatenFood = snake[0].x === foodX && snake[0].y === foodY;
    if (hasEatenFood) {
        score += 10;
        scoreDisplay.textContent = 'Score: ' + score;
        createFood();
    } else {
        snake.pop();
    }

    // Check for wall hit
    if (snake[0].x < 0) {
        snake[0].x = canvas.width - 20;
    } else if (snake[0].x >= canvas.width) {
        snake[0].x = 0;
    } else if (snake[0].y < 0) {
        snake[0].y = canvas.height - 20;
    } else if (snake[0].y >= canvas.height) {
        snake[0].y = 0;
    }
}

function hasGameEnded() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    return false;
}

function randomFood(min, max) {
    return Math.round((Math.random() * (max-min) + min) / 20) * 20;
}

function createFood() {
    foodX = randomFood(0, canvas.width - 20);
    foodY = randomFood(0, canvas.height - 20);
    snake.forEach(part => {
        if (part.x == foodX && part.y == foodY) createFood();
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(foodX, foodY, 20, 20);
    ctx.strokeRect(foodX, foodY, 20, 20);
}

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -20;
    const goingDown = dy === 20;
    const goingRight = dx === 20;
    const goingLeft = dx === -20;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -20;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -20;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 20;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 20;
    }
}

createFood();
main();
