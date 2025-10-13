let gameOver = false;
let gameStarted = false;
const graphics = window.GraphicsAPI;
let score = 0;

let player = {};
let balls = [];
const canvasSize = graphics.getCanvasSize();
let gameLoop = null;
let ballInterval = null;
let bombInterval = null;

function init() {
    player = {
        x: canvasSize.width / 2 - 25,
        y: canvasSize.height - 40,
        width: 50,
        height: 10,
        speed: 20,
        dx: 0
    };

    balls = [];
    score = 0;
    render();
}

function update() {
    if (gameOver) return;
    
    // Move player
    player.x += player.dx;
    player.x = Math.max(0, Math.min(canvasSize.width - player.width, player.x));
    
    // Update and filter balls in one pass
    balls = balls.filter(ball => {
        // Move ball
        ball.y += ball.dy;
        
        // Check collision with player
        if (player.x <= ball.x + ball.radius && 
            player.x + player.width >= ball.x - ball.radius &&
            player.y <= ball.y + ball.radius &&
            player.y + player.height >= ball.y - ball.radius) {
            
            if (ball.isBomb) {
                gameOver = true;
                stopGame();
                return false; // Remove bomb
            } else {
                score += 1;
                return false; // Remove caught ball
            }
        }
        
        // Check if ball fell off screen
        if (ball.y - ball.radius > canvasSize.height) {
            if (!ball.isBomb) {
                // Missed a good ball - game over
                gameOver = true;
                stopGame();
            }
            return false; // Remove ball
        }
        
        return true; // Keep ball in play
    });
}

function render() {
    graphics.clear();
    graphics.drawRect(player.x, player.y, player.width, player.height, "#0095DD");
    
    balls.forEach(ball => {
        const color = ball.isBomb ? "#FF0000" : "#00FF00"; 
        graphics.drawCircle(ball.x, ball.y, ball.radius, color);
    });

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = "#FFF";
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    if (gameOver) {
        ctx.fillStyle = "#FF0000";
        ctx.font = '40px Arial';
        const text = "GAME OVER - Press SPACE";
        const textWidth = ctx.measureText(text).width;
        ctx.fillText(text, (canvasSize.width - textWidth) / 2, canvasSize.height / 2);
    }
    
    if (!gameStarted) {
        ctx.fillStyle = "#FFF";
        ctx.font = '30px Arial';
        const text = "Press SPACE to Start";
        const textWidth = ctx.measureText(text).width;
        ctx.fillText(text, (canvasSize.width - textWidth) / 2, canvasSize.height / 2);
    }
}

function gameloop() {
    update();
    render();
}

function startgameloop() {
    if (gameLoop) {
        clearInterval(gameLoop);
    }
    gameLoop = setInterval(gameloop, 1000 / 60); // 60 FPS
}

function startthrowing() {
    // Clear all existing intervals
    if (ballInterval) clearInterval(ballInterval);
    if (bombInterval) clearInterval(bombInterval);
    
    // Spawn good balls every 2 seconds
    ballInterval = setInterval(() => {
        if (!gameOver) {
            balls.push(createBall(false));
        }
    }, 2000);
    
    // Spawn bombs every 3 seconds (offset by 1s)
    setTimeout(() => {
        bombInterval = setInterval(() => {
            if (!gameOver) {
                balls.push(createBall(true));
            }
        }, 3000);
    }, 1000);
}

function stopGame() {
    if (gameLoop) clearInterval(gameLoop);
    if (ballInterval) clearInterval(ballInterval);
    if (bombInterval) clearInterval(bombInterval);
}

function createBall(isBomb = false) {
    return {
        x: Math.random() * (canvasSize.width - 40) + 20,
        y: -20,
        radius: isBomb ? 15 : 10,
        dy: isBomb ? 4 : 6,
        isBomb: isBomb
    };
}

document.addEventListener("keydown", (e) => {
    if (["ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
    }
    
    if (e.key === " ") {
        if (gameOver || !gameStarted) {
            console.log(balls)
            gameStarted = true;
            gameOver = false;
            init();
            startgameloop();
            startthrowing();
        }
    }
    
    if (e.key === "ArrowLeft") {
        player.dx = -player.speed;
    } else if (e.key === "ArrowRight") {
        player.dx = player.speed;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        player.dx = 0;
    }
});

init();