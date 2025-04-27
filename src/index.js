import Polygon from "./polygon";
import Rectangle from "./rectangle";
import Circle from "./circle";
import QuadTree from "./quad-tree";

const canvas = document.getElementById("cnvs");

const gameState = {
    collidedPairs: new Map(),   
    lastTick: 0,
    tickLength: 15,
  };
  let nextObjectId = 1;
const objN = 10;

const r = new Rectangle(0,0,canvas.width,canvas.height)

let tree = new QuadTree(r);

function queueUpdates(numTicks) {
    for (let i = 0; i < numTicks; i++) {
        gameState.lastTick = gameState.lastTick + gameState.tickLength
        update(gameState.lastTick)
    }
}

function draw(tFrame) {
    const context = canvas.getContext('2d');

    // clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height)
    // draw
    context.fillStyle = "rgb(0, 0, 200)"
    gameState.rects.forEach((figure)=>{
        context.fillRect(figure.x, figure.y, figure.w, figure.h)
    })

    gameState.polygons.forEach((figure)=>{
        figure.draw(canvas)
    })
    gameState.circles.forEach((figure)=>{
        figure.draw(canvas)
    })
}

function update(tick) {

    for (const [key, frames] of gameState.collidedPairs.entries()) {
        if (frames <= 1) {
          gameState.collidedPairs.delete(key);
        } else {
          gameState.collidedPairs.set(key, frames - 1);
        }
      }
    
    
    tree.clear();

    gameState.rects.forEach((figure)=>{
        figure.x += figure.speed.x
        figure.y += figure.speed.y
    })
    gameState.polygons.forEach((figure)=>{
        figure.x += figure.speed.x
        figure.y += figure.speed.y

        if(figure.x <= figure.r|| figure.x >= canvas.width-figure.r){
            figure.setSpeed(-figure.speed.x, figure.speed.y);
        }

        if(figure.y <= figure.r || figure.y >= canvas.height-figure.r){
            figure.setSpeed(figure.speed.x, -figure.speed.y);
        }


        tree.insert(figure);
    })

    gameState.circles.forEach((figure)=>{
        figure.x += figure.speed.x
        figure.y += figure.speed.y

        if(figure.x <= figure.r|| figure.x >= canvas.width-figure.r){
            figure.setSpeed(-figure.speed.x, figure.speed.y);
        }

        if(figure.y <= figure.r || figure.y >= canvas.height-figure.r){
            figure.setSpeed(figure.speed.x, -figure.speed.y);
        }

        tree.insert(figure)
    })


    for (const figure of gameState.polygons) {
        const candidates = tree.retrieve(figure);
        for (const candidate of candidates) {
          if (figure === candidate) continue;
    

          const key = `${figure.id}|${candidate.id}`;

    

          if (gameState.collidedPairs.has(key)) continue;

          if (figure.collides(candidate)) {
            handleCollision(figure, key);
            break;    
          }
        }
      }


      for (const figure of gameState.circles) {
        const candidates = tree.retrieve(figure);
        for (const candidate of candidates) {
          if (figure === candidate) continue;
    
          const key = `${figure.id}|${candidate.id}`;

          if (gameState.collidedPairs.has(key)) continue;
    
          if (figure.collides(candidate)) {
            handleCollision(figure, key);
            break;
          }
        }
      }
    gameState.polygons = gameState.polygons.filter(f => f.hp > 0);
    gameState.circles  = gameState.circles.filter(f => f.hp > 0);

}

function run(tFrame) {
    gameState.stopCycle = window.requestAnimationFrame(run)

    const nextTick = gameState.lastTick + gameState.tickLength
    let numTicks = 0

    if (tFrame > nextTick) {
        const timeSinceTick = tFrame - gameState.lastTick
        numTicks = Math.floor(timeSinceTick / gameState.tickLength)
    }
    queueUpdates(numTicks)
    draw(tFrame)
    gameState.lastRender = tFrame
}

function stopGame(handle) {
    window.cancelAnimationFrame(handle);
}

function setup() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    gameState.lastTick = performance.now()
    gameState.lastRender = gameState.lastTick
    gameState.tickLength = 15 //ms

    gameState.rects = []
    gameState.polygons = []
    gameState.circles = []

    //кружки
    for(let i = 0; i < objN; i++){
        const r = 50;
        const x = getRandomInt(r,canvas.width-r);
        const y = getRandomInt(r,canvas.height-r);
        const sx = getRandomInt(1,5);
        const sy = getRandomInt(1,5);
        
        const circle = new Circle(x,y,r);
        circle.setSpeed(sx,sy);   
        circle.id = nextObjectId++; 

        gameState.circles.push(circle);
    }
    //трегольники
    for(let i = 0; i < objN; i++){
        const r = 50;
        const x = getRandomInt(r,canvas.width-r);
        const y = getRandomInt(r,canvas.height-r);
        const sx = getRandomInt(1,5);
        const sy = getRandomInt(1,5);
        
        const triangle = new Polygon(x,y,r,3);
        triangle.setSpeed(sx,sy);    
        triangle.id = nextObjectId++; 


        gameState.polygons.push(triangle);
    }
    //шестиугольники
    for(let i = 0; i < objN; i++){
        const r = 50;
        const x = getRandomInt(r,canvas.width-r);
        const y = getRandomInt(r,canvas.height-r);
        const sx = getRandomInt(1,5);
        const sy = getRandomInt(1,5);
        
        const poly = new Polygon(x,y,r,6);
        poly.setSpeed(sx,sy);    
        poly.id = nextObjectId++; 


        gameState.polygons.push(poly);
    }
}


function handleCollision(figure, key) {
    setRandomColor(figure);
    figure.setSpeed(-figure.speed.x, -figure.speed.y);
    figure.hp--;
    
    gameState.collidedPairs.set(key, 5);
  }
  


function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); 
  }
  function setRandomColor(figure) {
    const r = Math.floor(Math.random() * 256); 
    const g = Math.floor(Math.random() * 256); 
    const b = Math.floor(Math.random() * 256); 
    figure.color = `rgb(${r}, ${g}, ${b})`;
}


setup();
run();

