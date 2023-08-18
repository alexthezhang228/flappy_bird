//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34; //width/height ratio = 408/228 = 17/12
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipes mo
let velocityY = 0
let gravity=0.4

//game and score
let gameOver;
let score=0

window.onload = function() {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); //used for drawing on the board


  //load images
  birdImg = new Image();
  birdImg.src = "./flappybird.png";
  birdImg.onload = function() {
      context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  }

  topPipeImg = new Image();
  topPipeImg.src = "./toppipe.png";

  bottomPipeImg=new Image();
  bottomPipeImg.src='./bottompipe.png'

  requestAnimationFrame(update);
  setInterval(placePipes, 1500); //every 1.5 seconds
  document.addEventListener('keydown',moveBird)
}

function update() {
  requestAnimationFrame(update);
  if (gameOver){
    return ''
  }
  context.clearRect(0, 0, board.width, board.height);

  // bird
  velocityY+=gravity
  bird.y=Math.max(0,bird.y+velocityY)
  if (bird.y>board.height){
    gameOver=true
  }
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height)


  //pipes
  for (let i = 0; i < pipeArray.length; i++) {
      let pipe = pipeArray[i];
      pipe.x += velocityX;
      context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
      if (collision(bird,pipe)){
        gameOver=true
      }
      if (!pipe.passed && bird.x>pipe.x+pipe.width){
        score += 0.5
        pipe.passed=true
      }
  }

  // clear pipes
  while (pipeArray.length>0 && pipeArray[0].x<-pipeArray[0].width){
    pipeArray.shift()
  }

  //scores
  context.fillStyle='white';
  context.font='45px sans-serif'
  context.fillText(score,5,45)

  if (gameOver){
    context.fillText('GAME OVER',5,90)
  }

}

function placePipes() {
  if (gameOver){
    return
  }
  let randomPipeY=pipeY-pipeHeight/4-Math.random()*(pipeHeight/2)
  let openning=board.height/4
  let topPipe = {
      img : topPipeImg,
      x : pipeX,
      y : randomPipeY,
      width : pipeWidth,
      height : pipeHeight,
      passed : false
  }
  pipeArray.push(topPipe);

  let bottomPipe = {
    img : bottomPipeImg,
    x : pipeX,
    y : randomPipeY+pipeHeight+openning,
    width : pipeWidth,
    height : pipeHeight,
    passed : false
  }
  pipeArray.push(bottomPipe);

}


function moveBird(e){
  if (e.code=='Space'||e.code=='ArrowUp'){
    velocityY = -6;
  }
  if (gameOver){
    bird.y=birdY
    score=0
    pipeArray=[]
    gameOver=false
  }
}

function collision(a,b){
  return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
        a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
        a.y + a.height > b.y;
}