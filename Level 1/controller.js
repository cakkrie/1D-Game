class Controller {
  constructor() {
      this.gameState = "PLAY";
      this.startTime = millis(); 
      this.hideStartTime = 0;
      this.isHidden = false;
      this.flashStartTime = 0; 
      this.flashDuration = 1500; // Duration of flashing effect in 1.5s
      this.flashColor = color(234, 101, 101); 
      this.score = 0;
      this.goldColor = color(255, 182, 0);
      this.rockColor = color(100, 100, 100);
      this.xPressCount = 0; // Count how many times 'x' is pressed
      this.targetFadeColor = color(235, 235, 235); // Color to fade
      this.fadeDuration =  10000; // 60 seconds in milliseconds
      this.lastGoldDropTime = 0;   // Track time for gold drop
      this.lastRockDropTime = 0;   // Track time for rock drop
      this.dropInterval = 4000;  // Gold drops every 4 seconds (4000 ms)
      this.rockDropDelay = 2000;   // Rock drops 2 seconds after gold
  }

  update() {
    let currentTime = millis();

    if (currentTime - this.lastGoldDropTime >= this.dropInterval) {
        // Generate new gold position
        let newGoldPos = parseInt(random(0, displaySize));

        // Ensure no more than 6 pieces of gold exist at once
        if (golds.length < 6) {
            golds.push(newGoldPos);  // Add new gold to the array
        }

        // Update the last gold drop time
        this.lastGoldDropTime = currentTime;

        // Schedule rock drop 2 seconds after gold
        this.lastRockDropTime = currentTime + this.rockDropDelay;
    }

    // Check if it's time to drop rocks (2 seconds after gold)
    if (currentTime>= this.lastRockDropTime) {
        // Generate new rock position
        let newRockPos = parseInt(random(0, displaySize));

        // Ensure no more than 6 rocks exist at once
        if (rocks.length < 6) {
            rocks.push(newRockPos);  // Add new rock to the array
        }

        // Update the last rock drop time
        this.lastRockDropTime = currentTime + this.dropInterval;  

    }

    let elapsedTime = currentTime - this.startTime;
    let fadeProgress = constrain(elapsedTime / this.fadeDuration, 0, 0); // 0 to 1 over 60 seconds

    // Gradually fade each color to the target fade color
    let fadedGoldColor = lerpColor(this.goldColor, this.targetFadeColor, fadeProgress);
    let fadedRockColor = lerpColor(this.rockColor, this.targetFadeColor, fadeProgress);
    let fadedPlayerOneColor = lerpColor(playerOne.playerColor, this.targetFadeColor, fadeProgress);
    let fadedPlayerTwoColor = lerpColor(playerTwo.playerColor, this.targetFadeColor, fadeProgress);
    let keys = {};


    display.clear();

    // Check if the colors have fully faded (i.e., fadeProgress reaches 1)
    if (fadeProgress >= 0.8) {
        this.gameState = "SCORE"; // Go to SCORE state after flashing
    }

    switch (this.gameState) {
        case "PLAY":

            // Display golds and rocks with gradually fading colors
            golds.forEach(pos => {
                display.setPixel(pos, fadedGoldColor);
            });
        
            rocks.forEach(pos => {
                display.setPixel(pos, fadedRockColor);
            });
                
            if (this.isHidden) {
                if (currentTime - this.hideStartTime >= 1000) {
                      this.isHidden = false;
                }
            }

            display.setPixel(playerTwo.position,fadedPlayerTwoColor);

            if (!this.isHidden) {
                display.setPixel(playerOne.position, fadedPlayerOneColor);
            }

            if (playerTwo.isExploding) {
                playerTwo.explode();
            }

              // check if need to have new gold or rock
            if (currentTime - this.lastDropTime > 4000) {
                let newGoldPos = parseInt(random(0, displaySize));
                let newRockPos = parseInt(random(0, displaySize));

                while (abs(newGoldPos - newRockPos) < 3) {
                    newRockPos = parseInt(random(0, displaySize));
                }

                if (golds.length < 6) {
                    golds.push(newGoldPos);      
                }
                if (rocks.length < 6) {
                    rocks.push(newRockPos);
                }

                this.lastDropTime = currentTime;
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
            let scorePos = 0;
            // Display the combined score as a series of blocks
            for (let i = 0; i < this.score; i++) {
                display.setPixel(scorePos, this.goldColor);
                scorePos += 2; // Move to the next pixel locationa
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
  
    if (key == 'B' || key == 'b') {
        // Increment the press count and enable the feature after 3 presses
        playerOne.mineGold()
    }
  
    if (key == 'R' || key == 'r') {
      if (controller.gameState === "GAME_OVER") {
          controller.restartGame(); 
        }
      controller.restartGame(); 
    }
  }