const canvas = document.getElementById('gameCanvas');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

let gameRunning = false;
let gameOver = false;

// Character properties
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

// Game state
let obstacles = [];
let score = 0;

// Load images
const characterImage = new Image();
characterImage.src = './images/tom.png'; // your cartoon character

const obstacleImage = new Image();
obstacleImage.src = './images/dog.png'; // your obstacle image

const backgroundImage = new Image();
backgroundImage.src = './images/game-field.jpg'; // your background image

// Background scrolling variables
let backgroundX = 0;
const backgroundSpeed = 2;

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

// Game loop
function startGameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
            endGame();
            return true;
        }
    }
    return false;
}

// Controls
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !character.isJumping && gameRunning) {
        character.isJumping = true;
        character.velocityY = -character.jumpPower;
    }
});

function generateObstacle() {
    const obstacle = {
        x: canvas.width,
        y: canvas.height - 60,
        width: 40,
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

// Background draw
function drawBackground() {
    ctx.drawImage(backgroundImage, backgroundX, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, backgroundX + canvas.width, 0, canvas.width, canvas.height);

    backgroundX -= backgroundSpeed;

    if (backgroundX <= -canvas.width) {
        backgroundX = 0;
    }
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();

    ctx.drawImage(characterImage, character.x, character.y, character.width, character.height);

    for (let obstacle of obstacles) {
        ctx.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 20);

    if (!gameRunning && !gameOver) {
        ctx.font = '18px Arial';
        ctx.fillText('How to Play:', canvas.width / 2 - 50, canvas.height / 2 - 20);
        ctx.fillText('Press SPACE to jump and avoid obstacles', canvas.width / 2 - 160, canvas.height / 2 + 10);
    }

    if (gameOver) {
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 70, canvas.height / 2);
    }
}

// Event listeners
startButton.addEventListener('click', initGame);
restartButton.addEventListener('click', initGame);

setInterval(() => {
    if (gameRunning) {
        generateObstacle();
    }
}, 2000);

// Show instructions before starting
draw();
