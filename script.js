let character = document.getElementById("character");
let obstacle = document.getElementById("obstacle");
let scoreDisplay = document.getElementById("score");

let jumping = false;
let score = 0;

// Jump function
function jump() {
    if (jumping) return;
    jumping = true;

    let position = 0;
    let upInterval = setInterval(() => {
        if (position >= 100) {
            clearInterval(upInterval);
            // Fall down
            let downInterval = setInterval(() => {
                if (position <= 0) {
                    clearInterval(downInterval);
                    jumping = false;
                }
                position -= 5;
                character.style.bottom = position + "px";
            }, 20);
        }
        position += 5;
        character.style.bottom = position + "px";
    }, 20);
}

// Collision check
setInterval(() => {
    let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("bottom"));
    let obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue("left"));

    if (obstacleLeft < 70 && obstacleLeft > 40 && characterTop <= 30) {
        alert("Game Over! Final Score: " + score);
        score = 0;
        scoreDisplay.textContent = "Score: " + score;
    } else if (obstacleLeft < 0) {
        score++;
        scoreDisplay.textContent = "Score: " + score;
    }
}, 20);

// Listen for spacebar
document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        jump();
    }
});
