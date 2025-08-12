const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");

        const startButton = document.getElementById("startButton");
        const restartButton = document.getElementById("restartButton");

        // Game state variables
        let isJumping = false;
        let gameRunning = false;
        let score = 0;
        let animationFrameId;
        let obstacleGenerationIntervalId;

        // Character variables
        const character = {
            x: 80,
            y: 0,
            width: 60,
            height: 80,
            velocityY: 0
        };
        const gravity = 1;
        const jumpStrength = 20;

        // Obstacle variables
        const obstacles = [];
        let obstacleSpeed = 5;

        // Background variables
        const background = {
            image: new Image(),
            x: 0,
            speed: 2 // Speed of the scrolling background
        };

        // Image assets
        const characterImage = new Image();
        const obstacleImage1 = new Image(); // For the dog
        const obstacleImage2 = new Image(); // For the cheese

        // Set image sources and handle preloading
        characterImage.src = './images/tom.png';
        obstacleImage1.src = './images/dog.png';
        obstacleImage2.src = './images/jerry.png';
        background.image.src = './images/game-field.jpg';

        // An array to hold all images to preload
        const imagesToLoad = [characterImage, obstacleImage1, obstacleImage2, background.image];
        let imagesLoadedCount = 0;

// Sound players using Tone.js
        const jumpSynth = new Tone.Synth().toDestination();
        const gameOverSynth = new Tone.Synth().toDestination();

        function preloadImages() {
            return new Promise((resolve) => {
                imagesToLoad.forEach(img => {
                    img.onload = () => {
                        imagesLoadedCount++;
                        if (imagesLoadedCount === imagesToLoad.length) {
                            resolve();
                        }
                    };
                    img.onerror = () => {
                        console.error(`Failed to load image: ${img.src}`);
                        imagesLoadedCount++; // Still resolve to not block the game
                        if (imagesLoadedCount === imagesToLoad.length) {
                            resolve();
                        }
                    };
                });
            });
        }

        // Draw functions
        function drawBackground() {
            // Draw the first image
            ctx.drawImage(background.image, background.x, 0, canvas.width, canvas.height);
            // Draw the second image right next to the first one
            ctx.drawImage(background.image, background.x + canvas.width, 0, canvas.width, canvas.height);

            // Update the x position to create the scrolling effect
            background.x -= background.speed;

            // Reset the position when the first image goes off-screen
            if (background.x <= -canvas.width) {
                background.x = 0;
            }
        }

        function drawCharacter() {
            ctx.drawImage(characterImage, character.x, character.y, character.width, character.height);
        }

        function drawObstacle(obstacle) {
            ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }

        function drawScore() {
            ctx.fillStyle = 'black';
            ctx.font = "24px Fredoka One, sans-serif";
            ctx.fillText(`Score: ${score}`, 10, 30);
        }


        function drawGameOver() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = "48px Fredoka One, sans-serif";
            ctx.textAlign = 'center';
            ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 20);
            ctx.font = "32px Fredoka One, sans-serif";
            ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
        }

        // Game logic functions
        function gameLoop() {
            if (!gameRunning) {
                return;
            }

            // Draw the scrolling background first
            drawBackground();

            // Update character position
            character.velocityY -= gravity;
            character.y -= character.velocityY;

            // Check for ground collision
            if (character.y > canvas.height - character.height) {
                character.y = canvas.height - character.height;
                character.velocityY = 0;
                isJumping = false;
            }

            // Update obstacles
            for (let i = obstacles.length - 1; i >= 0; i--) {
                const obstacle = obstacles[i];
                obstacle.x -= obstacleSpeed;

                // Check for collision
                if (
                    character.x < obstacle.x + obstacle.width &&
                    character.x + character.width > obstacle.x &&
                    character.y < obstacle.y + obstacle.height &&
                    character.y + character.height > obstacle.y
                ) {
                    gameOver();
                    return;
                }

                // Remove off-screen obstacles and increment score
                if (obstacle.x + obstacle.width < 0) {
                    obstacles.splice(i, 1);
                    score++;
                }
            }

            // Draw everything
            drawCharacter();
            obstacles.forEach(drawObstacle);
            drawScore();

            animationFrameId = requestAnimationFrame(gameLoop);
        }

        function jump() {
            if (!isJumping && gameRunning) {
                isJumping = true;
                character.velocityY = jumpStrength;
            }
        }

        function generateObstacle() {
            if (!gameRunning) return;

            const obstacleHeight = Math.random() * (90 - 50) + 50;
            const obstacleWidth = 50;
            const randomImage = Math.random() > 0.5 ? obstacleImage1 : obstacleImage2;

            const obstacle = {
                x: canvas.width,
                y: canvas.height - obstacleHeight,
                width: obstacleWidth,
                height: obstacleHeight,
                image: randomImage
            };
            obstacles.push(obstacle);
        }

    function startGame() {
    gameRunning = true;
    score = 0;
    obstacles.length = 0;
    character.y = canvas.height - character.height;
    character.velocityY = 0;

    startButton.style.display = 'none';
    restartButton.style.display = 'none';
            
    // Start Tone.js when the game begins
    Tone.start();
    // Hide instructions when game starts
    document.getElementById('instructions').style.display = 'none';

    gameLoop();
    obstacleGenerationIntervalId = setInterval(generateObstacle, 1500);
}

function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(animationFrameId);
    clearInterval(obstacleGenerationIntervalId);
    drawGameOver();
    restartButton.style.display = 'block';
        // Play a synthetic sound for game over
            gameOverSynth.triggerAttackRelease("C2", "2n");
}


        // Event listeners
        document.addEventListener("keydown", (e) => {
            if (e.code === "Space") {
                jump();
            }
        });

        startButton.addEventListener("click", () => {
            startGame();
        });

        restartButton.addEventListener("click", () => {
            startGame();
        });

        // Initial drawing of the game scene
        // Initial drawing of the game scene
        window.addEventListener('load', () => {
            preloadImages().then(() => {
                drawInitialScreen();
            });
        });
