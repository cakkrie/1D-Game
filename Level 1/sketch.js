let displaySize = 50;
let pixelSize = 20;
let BG = 235;

let playerOne;
let playerTwo;
let display;
let controller;

let rocks = [];
let shakeDuration = 30; // Duration of the shake in frames
let isShaking = false;  // Track whether the shake is happening
let shakeStartFrame = 0; // Record when the shake started

let oFirstPressTime = 0; 
let oPressTimeLimit = 1500;
let isTimerActive = false;    // Track if the timer is active

function setup() {
    createCanvas((displaySize * pixelSize), pixelSize);
    controller = new Controller();
    playerOne = new PlayerOne(PlayerOne.playerOneColor, parseInt(random(0, displaySize)), displaySize);
    playerTwo = new PlayerTwo(color(234, 101, 101), parseInt(random(0, displaySize)), displaySize);
    display = new Display(displaySize, pixelSize);
}

function draw() {
    if (isShaking) {
        // Calculate random shake offsets (between -5 and 5 pixels)
        let shakeX = random(-5, 5);
        let shakeY = random(-5, 5);

        // Apply the shake to the canvas position
        translate(shakeX, shakeY);

        // End the shaking effect after the shake duration
        if (frameCount - shakeStartFrame > shakeDuration) {
            isShaking = false;
        }
    }

    background(BG, BG, BG); // Draw the background (it will "shake" if the canvas is translated)
    controller.update();
    display.show();

    if (controller.gameState === "GAME_OVER") {
        // This will handle flashing red effect
        display.show();
    }

    playerOne.update();
    playerTwo.update();

}

// Function to start the shake effect
function startShake() {
    isShaking = true;  
    shakeStartFrame = frameCount; // Record the frame when shaking started
}

// Modify the keyPressed function to trigger shaking on 'B'
function keyPressed() {
    if (key == 'A' || key == 'a') {
        playerOne.state = "MOVE_LEFT";
    }

    if (key == 'S' || key == 's') {
        playerOne.state = "DONT_MOVE";
    }

    if (key == 'D' || key == 'd') {
        playerOne.state = "MOVE_RIGHT";
    }

    if (key == 'J' || key == 'j') {
        playerTwo.state = "MOVE_LEFT";
    }

    if (key == 'K' || key == 'k') {
        playerTwo.state = "DONT_MOVE";
    }

    if (key == 'L' || key == 'l') {
        playerTwo.state = "MOVE_RIGHT";
    }

    if (key == 'H' || key == 'h') {
        controller.hideStartTime = millis();
        controller.isHidden = true;
    }

    if (key == 'O' || key == 'o') {
        oFirstPressTime = millis();
        console.log(controller.oPressCount);

        controller.oPressCount++;
        if (controller.oPressCount == 1){
            playerTwo.startExplosion(); 
            console.log(controller.oPressCount);
        } else if (controller.oPressCount >= 3 && millis() - oFirstPressTime <= 1500){
            controller.gameState = "GAME_OVER";
            createCanvas((displaySize * pixelSize), pixelSize);
            controller = new Controller();
            playerOne = new PlayerOne(PlayerOne.playerOneColor, parseInt(random(0, displaySize)), displaySize);
            playerTwo = new PlayerTwo(color(234, 101, 101), parseInt(random(0, displaySize)), displaySize);
            display = new Display(displaySize, pixelSize);
            controller.gameState = "PLAY";
            golds = []; // Clear golds
            rocks = []; // Clear rocks
            controller.oPressCount == 0;
            oFirstPressTime = 0;
            console.log(controller.oPressCount);
        }
    }

    if (key == 'B' || key == 'b') {
        playerOne.mineGold();
        startShake();  // Start the shake effect when 'B' is pressed
    }
}