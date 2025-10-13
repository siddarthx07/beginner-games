const graphics= new GraphicsAPI("gameCanvas");
const CELL_SIZE = 20;
const GRID_SIZE = graphics.getWidth()/CELL_SIZE;

const INITIAL_SPEED = 150;
const SPEED_INCREASE = 2;

let snake = [];
let direction = "RIGHT";
let nextDirection = "RIGHT";
let food = null;
let score = 0;
let gameOver = false;
let gameStarted = false;
let gameLoop = null;
let speed = INITIAL_SPEED;

function init()
{
    centerX=Math.floor(GRID_SIZE/2);
    centerY=Math.floor(GRID_SIZE/2);

    snake=[{x:centerX,y:centerY}, {x:centerX-1, y:centerY}, {x:centerX-2, y:centerY}];
    
    
    direction= "RIGHT";
    nextDirection="RIGHT";
    randomfood();
    render();

}

function randomfood()
{
    let isvalid=false;

    while(!isvalid)
    {
        food={x:Math.floor(Math.random()*GRID_SIZE),
              y:Math.floor(Math.random()*GRID_SIZE)  
        }
        isvalid=true;
        for (let s of snake)
        {
            if(s.x===food.x && s.y ===food.y)
            {
                isvalid=false;
                break;
            }
        }

    }

}

function gethead()
{   
    head=snake[0];
    if(nextDirection==="RIGHT"){
        return {x: head.x + 1, y: head.y}
    }
    if(nextDirection==="LEFT"){
        return {x: head.x - 1, y: head.y}
    }
    if(nextDirection==="DOWN"){
        return {x: head.x , y: head.y+1}
    }
    if(nextDirection==="UP"){
        return {x: head.x, y: head.y-1}
    }
}

function update()
{
    if(gameOver)
    {
        return;
    }
    
    direction=nextDirection;
    head=snake[0];  
    
    newhead=gethead();

    if(newhead.x>=GRID_SIZE || newhead.x<0  || newhead.y>=GRID_SIZE || newhead.y<0)
    {
        gameOver=true
        console.log("wall");
        return;

    }

    for(let s of snake)
    {
        if(newhead.x===s.x && newhead.y===s.y)
        {
            gameOver=true;
            console.log("self");
            return;
        }
    }

    snake.unshift(newhead);

    if(newhead.x===food.x && newhead.y===food.y)
    {
        score++;
        randomfood();
        speed=Math.max(50, speed-SPEED_INCREASE)
        console.log("speed: ", speed)
        console.log("Current interval ID:", gameLoop);
        startgameloop();
        
    }

    else
    {
        snake.pop();
    }
    
    


}

// Render the game
function render() {
    // Clear canvas
    graphics.clear();

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        const segment = snake[i];
        const color = i === 0 ? '#00ff00' : '#00cc00';
        graphics.drawRect(
            segment.x * CELL_SIZE,
            segment.y * CELL_SIZE,
            CELL_SIZE - 2,
            CELL_SIZE - 2,
            color
        );
    }

    // Draw food
    if (food) {
        graphics.drawCircle(
            food.x * CELL_SIZE + CELL_SIZE / 2,
            food.y * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE / 2 - 2,
            '#ff0000'
        );
    }

    // Draw score
    graphics.drawText(`Score: ${score}`, 10, 30, '#ffffff', 24);

    // Draw start message
    if (!gameStarted && !gameOver) {
        graphics.drawText(
            'Press SPACE to Start',
            graphics.getWidth() / 2 - 120,
            graphics.getHeight() / 2,
            '#ffffff',
            24
        );
        graphics.drawText(
            'Use Arrow Keys to Move',
            graphics.getWidth() / 2 - 130,
            graphics.getHeight() / 2 + 40,
            '#aaaaaa',
            20
        );
    }

    // Draw game over message
    if (gameOver) {
        graphics.drawText(
            'GAME OVER',
            graphics.getWidth() / 2 - 100,
            graphics.getHeight() / 2 - 40,
            '#ff0000',
            40
        );
        graphics.drawText(
            `Final Score: ${score}`,
            graphics.getWidth() / 2 - 80,
            graphics.getHeight() / 2 + 20,
            '#ffffff',
            24
        );
        graphics.drawText(
            'Press SPACE to Restart',
            graphics.getWidth() / 2 - 120,
            graphics.getHeight() / 2 + 60,
            '#aaaaaa',
            20
        );
    }
}

function gameLoopFunction()
{
   
    update();
    
    render();
    
}


function startgameloop()
{
    if(gameLoop)
    {   
        console.log("gameLoop in if loop", gameLoop)
        clearInterval(gameLoop);
    }
    gameLoop = setInterval(gameLoopFunction, speed);

}


document.addEventListener("keydown",(e) =>{

    if(["ArrowUp","ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key))
    {
        e.preventDefault();
    }

    if(e.key===" ")
    {
        if(!gameStarted || gameOver)
        {
            score = 0;
            speed = INITIAL_SPEED;
            gameOver = false;
            gameStarted = true;
            init();
            startgameloop();
        }
        return;
    }

    if (!gameStarted || gameOver) return;

    if(e.key==="ArrowUp" && direction!=="DOWN")
    {
        nextDirection="UP";

    }
    else if(e.key==="ArrowDown" && direction!=="UP")
    {
        nextDirection="DOWN";
    }
    else if(e.key==="ArrowRight" && direction!=="LEFT")
    {
        nextDirection="RIGHT";
    }
    else
    {
        nextDirection="LEFT";
    }

})

init();