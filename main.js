const canvas = document.getElementById('gameCanvas'); // Get the canvas element
const ctx = canvas.getContext('2d'); // Get the 2D rendering context
canvas.width = 400;
canvas.height = 400;

let score = 0;
const scoreDisplay = document.getElementById('score'); // Get the score display element

// Initial snake segments
const snake = [
    {x: 160, y: 160},//This is the head of the snake
    {x: 140, y: 160},
    {x: 120, y: 160}
];

let dx = 20; // Horizontal velocity
let dy = 0;  // Vertical velocity
let foodX;
let foodY;
let bonusFoodX;
let bonusFoodY;
let foodsEaten = 0;
let bonusFoodExists = false;
let gameSpeed = 100; // Initial game speed in milliseconds

// the main game render loop
function render() {
    if (hasGameEnded()) return;
    setTimeout(()=> {
        clearCanvas();
        drawFood();
        if (bonusFoodExists) {
            drawBonusFood();
        }
        moveSnake();
        drawSnake();
        render();
    }, gameSpeed);
}

// Clear the canvas
function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw the snake with rounded segments
// Draw the snake
function drawSnake() {
    snake.forEach(part => {
        ctx.fillStyle = 'green';
        ctx.fillRect(part.x, part.y, 20, 20);
        ctx.strokeRect(part.x, part.y, 20, 20);
    });
}


// Move the snake
function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy}; // Calculate new head position
    snake.unshift(head); // Add new head to the front of the snake
    
    const hasEatenFood = Math.abs(snake[0].x - foodX) < 20 && Math.abs(snake[0].y - foodY) < 20;
    const hasEatenBonusFood = bonusFoodExists && Math.abs(snake[0].x - bonusFoodX) < 40 && Math.abs(snake[0].y - bonusFoodY) < 40;

    if (hasEatenFood) {
        score += 10;
        scoreDisplay.textContent = 'Score: ' + score;
        createFood();
        foodsEaten += 1;

        if (foodsEaten % 5 === 0) {
            createBonusFood();
        }
    } else if (hasEatenBonusFood) {
        score += 20;
        scoreDisplay.textContent = 'Score: ' + score;
        bonusFoodExists = false;
        gameSpeed = Math.max(10, gameSpeed * 0.8); // Increase speed by 20%
    } else {
        snake.pop(); // Remove the last part of the snake
    }

    // Check for wall hit and wrap around
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

// Check if the game has ended (snake collides with itself)
function hasGameEnded() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    return false;
}

// Generate random food coordinates
function randomFood(min, max) {
    return Math.round((Math.random() * (max-min) + min) / 20) * 20;
}

// Create new food at random location
function createFood() {
    foodX = randomFood(0, canvas.width - 20);
    foodY = randomFood(0, canvas.height - 20);
    snake.forEach(part => {
        if (part.x == foodX && part.y == foodY) createFood();
    });
}

// Create new bonus food at random location
function createBonusFood() {
    bonusFoodX = randomFood(0, canvas.width - 40);
    bonusFoodY = randomFood(0, canvas.height - 40);
    snake.forEach(part => {
        if (part.x == bonusFoodX && part.y == bonusFoodY) createBonusFood();
    });
    bonusFoodExists = true;
}

// Draw the regular food as a circle
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'darkred';
    ctx.beginPath();
    ctx.arc(foodX + 10, foodY + 10, 10, 0, 2 * Math.PI); // Draw circle for regular food
    ctx.fill();
    ctx.stroke();
}

// Draw the bonus food as a larger circle
function drawBonusFood() {
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'darkred';
    ctx.beginPath();
    ctx.arc(bonusFoodX + 20, bonusFoodY + 20, 20, 0, 2 * Math.PI); // Draw larger circle for bonus food
    ctx.fill();
    ctx.stroke();
}

// Handle direction change
document.onkeydown = changeDirection;

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

// Initialize the game
createFood();
render();
