let displaySize = 50;
let pixelSize = 20;
let BG = 235;

let playerOne;
let playerTwo;

let display;
let controller;

let rocks = [];

function setup() {
    createCanvas((displaySize * pixelSize), pixelSize);
    controller = new Controller();
    playerOne = new PlayerOne(PlayerOne.playerOneColor, parseInt(random(0, displaySize)), displaySize);
    playerTwo = new PlayerTwo(color(234, 101, 101), parseInt(random(0, displaySize)), displaySize);
    display = new Display(displaySize, pixelSize);
    
}

function draw() {
    background(BG,BG,BG);
    controller.update();
    display.show();
    if (controller.gameState === "GAME_OVER") {
        // This will handle flashing red effect
        display.show();
    }
}
