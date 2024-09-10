let displaySize = 50;
let pixelSize = 20;
let BG = 235;

let playerOne;
let playerTwo;

let display;
let controller;

let golds = [];
let rocks = [];

function setup() {
    createCanvas((displaySize * pixelSize), pixelSize);
  
    display = new Display(displaySize, pixelSize);
    playerOne = new PlayerOne(color(127, 195, 198), parseInt(random(0, displaySize)), displaySize);
    playerTwo = new PlayerTwo(color(234, 101, 101), parseInt(random(0, displaySize)), displaySize);

    controller = new Controller();
}

function draw() {
    background(235,235,235);
    controller.update();
    display.show();
}
