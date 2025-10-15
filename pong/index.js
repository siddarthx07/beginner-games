const graphics = new GraphicsAPI("gameCanvas");

let rightpaddle = {};
let leftpaddle = {};
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 10;
let ball = {};

let gameLoop = null;
let gameOver = false;
let gameStarted = false;
let rightscore = 0;
let leftscore = 0;

function init() {
    leftpaddle = {x: 20, y: graphics.getHeight() / 2, dy: 0};
    rightpaddle = {x: graphics.getWidth() - 30, y: graphics.getHeight() / 2, dy: 0};
    ball = {x: graphics.getWidth() / 2, y: graphics.getHeight() / 2, dx: 0, dy: 0};

    throwball();
    render();
}

function update() {
    if (gameOver === true) {
        return;
    }

    leftpaddle.y += leftpaddle.dy;
    rightpaddle.y += rightpaddle.dy;

    leftpaddle.y = Math.max(0, Math.min(graphics.getHeight() - PADDLE_HEIGHT, leftpaddle.y));
    rightpaddle.y = Math.max(0, Math.min(graphics.getHeight() - PADDLE_HEIGHT, rightpaddle.y));

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y <= 0 || ball.y >= graphics.getHeight() - BALL_SIZE) {
        ball.dy *= -1;
    }

    if (
        ball.x - BALL_SIZE <= leftpaddle.x + PADDLE_WIDTH &&
        ball.x + BALL_SIZE >= leftpaddle.x &&
        ball.y + BALL_SIZE >= leftpaddle.y &&
        ball.y - BALL_SIZE <= leftpaddle.y + PADDLE_HEIGHT
    ) {
        ball.dx *= -1;
        ball.x = leftpaddle.x + PADDLE_WIDTH + BALL_SIZE;
    }

    if (
        ball.x + BALL_SIZE >= rightpaddle.x &&
        ball.x - BALL_SIZE <= rightpaddle.x + PADDLE_WIDTH &&
        ball.y + BALL_SIZE >= rightpaddle.y &&
        ball.y - BALL_SIZE <= rightpaddle.y + PADDLE_HEIGHT
    ) {
        ball.dx *= -1;
        ball.x = rightpaddle.x - BALL_SIZE;
    }

    if (ball.x <= 0) {
        rightscore++;
        throwball();
    }
    if (ball.x + BALL_SIZE >= graphics.getWidth()) {
        leftscore++;
        throwball();
    }

    if (leftscore >= 10 || rightscore >= 10) {
        gameOver = true;
        if (gameLoop) {
            clearInterval(gameLoop);
            gameLoop = null;
        }
    }
}

function throwball() {
    let angle = (Math.random() * 90 - 45) * (Math.PI / 180);
    let direction = Math.random() > 0.5 ? 1 : -1;

    ball.x = graphics.getWidth() / 2;
    ball.y = graphics.getHeight() / 2;
    let speed = 10;
    ball.dx = Math.cos(angle) * speed * direction;
    ball.dy = Math.sin(angle) * speed * direction;
}

function render() {
    graphics.clear();

    graphics.drawRect(leftpaddle.x, leftpaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT, "#00ffcc");
    graphics.drawRect(rightpaddle.x, rightpaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT, "#ff6600");

    graphics.drawCircle(ball.x, ball.y, BALL_SIZE, "#ffffff");

    graphics.drawText(leftscore, graphics.getWidth() / 4, 50, "#ffffff", 32, "center");
    graphics.drawText(rightscore, graphics.getWidth() * 3/4, 50, "#ffffff", 32, "center");

    if (!gameStarted) {
        graphics.drawText("PONG", graphics.getWidth() / 2, graphics.getHeight() / 2 - 60, "#ffffff", 48, "center");
        graphics.drawText("Press SPACE to start", graphics.getWidth() / 2, graphics.getHeight() / 2, "#ffffff", 24, "center");
        graphics.drawText("Left: W/S | Right: Arrow Keys", graphics.getWidth() / 2, graphics.getHeight() / 2 + 40, "#aaaaaa", 18, "center");
    }

    if (gameOver) {
        let winner = leftscore >= 10 ? "LEFT PLAYER" : "RIGHT PLAYER";
        graphics.drawText("GAME OVER", graphics.getWidth() / 2, graphics.getHeight() / 2 - 30, "#ff0000", 40, "center");
        graphics.drawText(winner + " WINS!", graphics.getWidth() / 2, graphics.getHeight() / 2 + 20, "#ffff00", 32, "center");
        graphics.drawText("Press SPACE to play again", graphics.getWidth() / 2, graphics.getHeight() / 2 + 60, "#ffffff", 20, "center");
    }
}

function gameLoopfunction() {
    update();
    render();
}

function startgameloop() {
    if (gameLoop) {
        clearInterval(gameLoop);
    }
    gameLoop = setInterval(gameLoopfunction, 30);
}

document.addEventListener("keydown", (e) => {
    if (e.key === " ") {
        if (gameOver || !gameStarted) {
            rightscore = 0;
            leftscore = 0;
            gameOver = false;
            gameStarted = true;
            init();
            startgameloop();
        }
    }

    if (["ArrowUp", "ArrowDown", " ", "w", "s"].includes(e.key)) {
        e.preventDefault();
    }

    if (e.key === "ArrowUp") {
        rightpaddle.dy = -5;
    } else if (e.key === "ArrowDown") {
        rightpaddle.dy = 5;
    } else if (e.key === "w") {
        leftpaddle.dy = -5;
    } else if (e.key === "s") {
        leftpaddle.dy = 5;
    }
});

document.addEventListener("keyup", (e) => {
    if (["ArrowUp", "ArrowDown", " ", "w", "s"].includes(e.key)) {
        e.preventDefault();
    }

    if (e.key === "ArrowUp") {
        rightpaddle.dy = 0;
    } else if (e.key === "ArrowDown") {
        rightpaddle.dy = 0;
    } else if (e.key === "w") {
        leftpaddle.dy = 0;
    } else if (e.key === "s") {
        leftpaddle.dy = 0;
    }
});

init();
