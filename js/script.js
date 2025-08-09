const canvas = document.getElementById('gameCanvas');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const ctx = canvas.getContext('2d');
// Load images
const characterImage = new Image();
characterImage.src = './images/tom.png'; // your cartoon character

const obstacleImage = new Image();
obstacleImage.src = './images/dog.png'; // your obstacle image

const backgroundImage = new Image();
backgroundImage.src = './images/game-field.jpg'; // your background image

// Background scrolling variables
let backgroundX = 0;
const backgroundSpeed = 2; // speed of scrolling


canvas.width = 800;
canvas.height = 400;

let gameRunning = false;
let gameOver = false;

let character = {
    x: 50,
    y: canvas.height - 60,
    width: 40,
    height: 40,
    gravity: 1,
    jumpPower: 15,
    velocityY: 0,
    isJumping: false
};

let obstacles = [];
let score = 0;

// Initialize game
function initGame() {
    gameRunning = true;
    gameOver = false;
    startButton.style.display = 'none';
    restartButton.style.display = 'none';
    character.x = 50;
    character.y = canvas.height - 60;
    character.velocityY = 0;
    character.isJumping = false;
    obstacles = [];
    score = 0;
    startGameLoop();
}

// Start game loop
function startGameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Game logic (e.g., character movement, obstacle generation)
    updateCharacter();
    updateObstacles();
    draw();

    if (checkCollision()) {
        endGame();
    } else {
        requestAnimationFrame(startGameLoop);
    }
}

// End game
function endGame() {
    gameRunning = false;
    gameOver = true;
    restartButton.style.display = 'block';
}

// Collision detection
function checkCollision() {
    for (let obstacle of obstacles) {
        if (character.x < obstacle.x + obstacle.width &&
            character.x + character.width > obstacle.x &&
            character.y < obstacle.y + obstacle.height &&
            character.y + character.height > obstacle.y) {
            return true;
        }
    }
    return false;
}

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !character.isJumping) {
        character.isJumping = true;
        character.velocityY = -character.jumpPower;
    }
});

function generateObstacle() {
    const obstacle = {
        x: canvas.width,
        y: canvas.height - 60,
        width: 20,
        height: 40
    };
    obstacles.push(obstacle);
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= 5;
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            score++;
        }
    }
}

function updateCharacter() {
    if (character.isJumping) {
        character.velocityY += character.gravity;
        character.y += character.velocityY;

        if (character.y >= canvas.height - 60) {
            character.y = canvas.height - 60;
            character.isJumping = false;
            character.velocityY = 0;
        }
    }
}

function drawBackground() {
    // Draw two copies of the background side-by-side
    ctx.drawImage(backgroundImage, backgroundX, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, backgroundX + canvas.width, 0, canvas.width, canvas.height);

    // Move background to the left
    backgroundX -= backgroundSpeed;

    // Reset when the first image goes off screen
    if (backgroundX <= -canvas.width) {
        backgroundX = 0;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw scrolling background
    drawBackground();

    // Draw character
    ctx.drawImage(characterImage, character.x, character.y, character.width, character.height);

    // Draw obstacles
    for (let obstacle of obstacles) {
        ctx.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }

    // Score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 20);

    if (gameOver) {
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 70, canvas.height / 2);
    }
}

// **New Function**
function drawInstructions() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; // Semi-transparent overlay
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('How to Play', canvas.width / 2 - 80, canvas.height / 2 - 80);

    ctx.font = '20px Arial';
    ctx.fillText('Press the **Spacebar** to jump over the obstacles.', canvas.width / 2 - 200, canvas.height / 2 - 20);
    ctx.fillText('Avoid the dogs to get a high score!', canvas.width / 2 - 150, canvas.height / 2 + 20);
}

// Event listeners
startButton.addEventListener('click', initGame);
restartButton.addEventListener('click', initGame);

// **Modified to only start the interval after the game begins**
let obstacleInterval;
function startGameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Game logic (e.g., character movement, obstacle generation)
    updateCharacter();
    updateObstacles();
    draw();

    if (checkCollision()) {
        endGame();
    } else {
        requestAnimationFrame(startGameLoop);
    }
}

function initGame() {
    gameRunning = true;
    gameOver = false;
    startButton.style.display = 'none';
    restartButton.style.display = 'none';
    character.x = 50;
    character.y = canvas.height - 60;
    character.velocityY = 0;
    character.isJumping = false;
    obstacles = [];
    score = 0;
    // **Start the obstacle generation interval here**
    obstacleInterval = setInterval(generateObstacle, 2000);
    startGameLoop();
}

function endGame() {
    gameRunning = false;
    gameOver = true;
    // **Clear the obstacle generation interval when the game ends**
    clearInterval(obstacleInterval);
    restartButton.style.display = 'block';
}

// **Initial draw call to show instructions when the page loads**
window.onload = function() {
    drawBackground(); // Draw the background first
    drawInstructions();
};
