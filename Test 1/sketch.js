let displaySize = 50;   // how many pixels are visible in the game
let pixelSize = 20;     // how big each 'pixel' looks on screen
let BG = 235;

let playerOne;    // Adding 2 players to the game
let playerTwo;

let display;
let controller;

let golds = [];  
let rocks = [];  

function setup() {
    createCanvas((displaySize*pixelSize), pixelSize);     // dynamically sets canvas size
  
    display = new Display(displaySize, pixelSize);        // Initializing the display
    playerOne = new PlayerOne(color(127, 195, 198), parseInt(random(0, displaySize)), displaySize);   
    playerTwo = new PlayerTwo(color(234, 101, 101), parseInt(random(0, displaySize)), displaySize);

  
    //collisionAnimation = new Animation();     // Initializing animation
    controller = new Controller();            // Initializing controller
    //score = { max: 3, winner: color(0, 0, 0) };     // score stores max number of points, and color 
  }
  
  function draw() {
    background(235,235,235);
    controller.update(); // 更新游戏状态
    display.show(); // 显示当前的像素
    if (playerTwo.isExploding) {
        playerTwo.explode(color(255, 0, 0));  // Explode in red color
    } else {
        // Show Player Two normally when not exploding
        display.setPixel(playerTwo.position, playerTwo.playerColor);
    }

  }
  