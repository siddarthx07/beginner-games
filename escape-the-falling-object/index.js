let gameOver=false;

const myCanvas = document.getElementById("canvas");
const ctx = myCanvas.getContext("2d");
let score=0;
let blocksthrownperround=0;
let maxBlocksperround=5;
let throwdelay=800;
const player={
        x: myCanvas.width/2 - 15,
        y:myCanvas.height-40,
        width:30,
        height:25,
        speed:8,
        dx:0,
        dy:0
    }
 
let blocks=[];

let blockInterval;
let animationId;

function init()
{

    blocks=[];
    score=0;
    player.x= myCanvas.width/2 - player.width/2;
    player.y=myCanvas.height-40;
    player.dx=0;

    gameOver=false;
    gameStarted=true;
    clearInterval(blockInterval);
    blocksthrownperround=0;
    throwblockseq();
   // blockInterval= setInterval(throwblocks, 1000);
    loop();


}

function throwblockseq()
{
    throwblocks();
    blocksthrownperround++;
    if(blocksthrownperround<maxBlocksperround)
    {
        blockInterval=setTimeout(throwblockseq, throwdelay);
    }
    else{
        blocksthrownperround=0;
        blockInterval=setTimeout(throwblockseq, throwdelay);
    }
}

function throwblocks()
{   
    const size=45;
    const x= Math.random() * (myCanvas.width -size);
    

    blocks.push({x, y:-size,
         width:size, height: size, speed:12});
    
}

function update()
{
    player.x += player.dx;
    player.y+=player.dy
    player.x= Math.max(0,
        Math.min(myCanvas.width - player.width, player.x));

    player.y=Math.max(0,
        Math.min(myCanvas.height-player.height, player.y));    

    blocks = blocks.filter(block=>{
        block.y += block.speed;

        if(
            player.x< block.x + block.width &&
            player.x + player.width > block.x && 
            player.y < block.y + block.height &&
            player.y + player.height > block.y

        )
        {
            endGame();
            return false;
        }
        if( block.y> myCanvas.height)
        {
            score++;
            return false;
        }
        return true;
    })

}

function endGame()
{
    gameOver=true;
    clearTimeout(blockInterval);
    cancelAnimationFrame(animationId);
}

function draw()
{
    ctx.fillStyle='#000';
    ctx.fillRect(0,0,myCanvas.width, myCanvas.height);

    ctx.fillStyle='red';

    ctx.fillRect(player.x, player.y,
         player.width, player.height);

    ctx.fillStyle='blue';
    blocks.forEach( b=> ctx.fillRect(b.x,b.y,b.width, b.height));

    ctx.fillStyle='white';
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10,30);

    if(gameOver)
    {
        ctx.textAlign='center';
        ctx.fillText("Game Over", 
            myCanvas.width/2, myCanvas.height/2);
        ctx.fillText('Press R to Restart',
             myCanvas.width/2, myCanvas.height/2 +30) ;
        ctx.textAlign='start';        
    }

}

function loop()
{

    update();
    draw();
    if(!gameOver)
    {
        animationId= requestAnimationFrame(loop);
    }

}

document.addEventListener('keydown', e=>{

    if(['ArrowLeft', 'ArrowRight', 'r'].includes(e.key))
    {
        e.preventDefault();
    }

    if(e.key==='ArrowLeft')
    {
        player.dx= -player.speed;
    }
    if(e.key==='ArrowRight')
    {
        player.dx= player.speed;
    }

    if(e.key==='ArrowUp')
    {
        player.dy= -player.speed;
    }
    if(e.key==='ArrowDown')
    {
        player.dy= player.speed;
    }

    if(e.key==='r' && gameOver)
    {
        console.log(blocks);
        init();
    }
});

document.addEventListener('keyup', e=>{
    if(e.key==='ArrowLeft' || e.key==='ArrowRight')
    {
        player.dx=0;
    }
        if(e.key==='ArrowUp' || e.key==='ArrowDown')
    {
        player.dy=0;
    }
})

init();