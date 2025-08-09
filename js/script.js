const canvas = document.getElementById('gameCanvas');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const ctx = canvas.getContext('2d');

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
            endGame();
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

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'green';
    ctx.fillRect(character.x, character.y, character.width, character.height);

    ctx.fillStyle = 'red';
    for (let obstacle of obstacles) {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }

    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 10, 20);

    if (gameOver) {
        ctx.fillText('Game Over', canvas.width / 2 - 30, canvas.height / 2);
    }
}

// Event listeners
startButton.addEventListener('click', initGame);
restartButton.addEventListener('click', initGame);

setInterval(generateObstacle, 2000);
