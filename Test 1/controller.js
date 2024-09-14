class Controller {
  constructor() {
      this.gameState = "PLAY";
      this.startTime = millis(); 
      this.lastDropTime = 0;
      this.hideStartTime = 0;
      this.isHidden = false;
      this.flashStartTime = 0; 
      this.flashDuration = 1500; // Duration of flashing effect in 1.5s
      this.flashColor = color(234, 101, 101); 
      this.score = 0;
      this.goldColor = color(255, 208, 90);
      this.rockColor = color(100, 100, 100);
  }

  update() {
      let currentTime = millis();
      display.clear();

      switch (this.gameState) {
          case "PLAY":
              if (this.isHidden) {
                  if (currentTime - this.hideStartTime >= 1000) {
                      this.isHidden = false;
                  }
              }

              display.setPixel(playerTwo.position, playerTwo.playerColor);

              if (!this.isHidden) {
                  display.setPixel(playerOne.position, playerOne.playerColor);
              }

              if (playerTwo.isExploding) {
                  playerTwo.explode();
              }

              // check if need to have new gold or rock
              if (currentTime - this.lastDropTime > 2000) {
                  let newGoldPos = parseInt(random(0, displaySize));
                  let newRockPos = parseInt(random(0, displaySize));

                  while (abs(newGoldPos - newRockPos) < 3) {
                      newRockPos = parseInt(random(0, displaySize));
                  }

                  if (golds.length < 10) {
                      golds.push(newGoldPos);      
                  }
                  if (rocks.length < 10) {
                      rocks.push(newRockPos);
                  }

                  this.lastDropTime = currentTime;
              }

              golds.forEach(pos => {
                  display.setPixel(pos, this.goldColor);  
              });
              rocks.forEach(pos => {
                  display.setPixel(pos, this.rockColor); 
              });

              if (golds.includes(playerOne.position)) {
                  golds = golds.filter(pos => pos !== playerOne.position); // remove gold when player 1 meet gold
                  this.score++;
              }

              // Check if Player Two explodes a rock
              rocks.forEach((rock, index) => {
                if (playerTwo.isExploding) {
                    // Check if the explosion hits the rock
                    let rockPos = rock;
                    if (playerTwo.position === rockPos) {
                        rocks.splice(index, 1); // Remove rock
                        this.score++; // Increment score for Player Two exploding a rock
                    }
                }
            });

              // Check for collision between Player One and Player Two
              if (playerOne.position === playerTwo.position) {
                if (!this.isHidden) {
                    // Record start time of flashing effect
                    this.flashStartTime = millis(); 
                    this.gameState = "GAME_OVER"; 

                    this.endGame(); // End game if Player One is not hidden
                }
            }

            break;

            case "GAME_OVER":
              // Handle flashing red effect
              let flashTime = currentTime - this.flashStartTime;
              if (flashTime < this.flashDuration) {
                  // Calculate the flashing color
                  let lerpValue = (flashTime % 500) / 500; // Flash on and off every 500 ms
                  let flashingColor = lerpColor(this.flashColor, color(BG, BG, BG), lerpValue);
                  display.setAllPixels(flashingColor); // Flash red
              } else {
                  this.gameState = "SCORE"; // Go to SCORE state after flashing
              }
            break;

            case "SCORE":
                let score_number = 0; 
                for (let i = 0; i < this.score; i++) {
                    // Draw each block for the score
                    display.setPixel(score_number, this.goldColor);
                    score_number=score_number + 2;

                      if (score_number >= displaySize) {
                        score_number = displaySize;
                    }
                }
                break;
      }
  }
  
    endGame() {
        // Reset positions, scores, and state for a new game
        playerOne.position = parseInt(random(0, displaySize)); // Reset Player One's position
        playerTwo.position = parseInt(random(0, displaySize)); // Reset Player Two's position
        golds = []; // Clear golds
        rocks = []; // Clear rocks
        this.hideStartTime = millis(); // Optionally reset hide start time if needed
    }

    restartGame() {
        this.gameState = "PLAY"; // Set game state to PLAY
        this.endGame(); // Reset game state and positions
    }
}

function keyPressed() {
  if (key == 'A' || key == 'a') {
      playerOne.move(-1);
  }

  if (key == 'D' || key == 'd') {
      playerOne.move(1);
  }

  if (key == 'J' || key == 'j') {
      playerTwo.move(-1);
  }

  if (key == 'L' || key == 'l') {
      playerTwo.move(1);
  }

  if (key == 'H' || key == 'h') {
      controller.hideStartTime = millis();
      controller.isHidden = true;
  }
  
  if (key == 'O' || key == 'o') {
    playerTwo.startExplosion(); 
  }

  if (key == 'R' || key == 'r') {
    if (controller.gameState === "GAME_OVER") {
        controller.restartGame(); 
      }
    controller.restartGame(); 
  }
}
