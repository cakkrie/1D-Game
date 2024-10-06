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
        this.gameDuration = 60000;  // 60 seconds (in milliseconds)
    }
  
    update() {
        let currentTime = millis();

      switch (this.gameState) {
          case "PLAY":
              rocks.forEach(pos => {
                  display.setPixel(pos, this.rockColor);
              });

              golds.forEach(pos => {
                display.setPixel(pos, this.goldColor);
              });
                  
              if (this.isHidden) {
                  if (currentTime - this.hideStartTime >= 1000) {
                        this.isHidden = false;
                  }
              }
  
              display.setPixel(playerTwo.position,color(234, 101, 101));
  
              if (!this.isHidden) {
                  display.setPixel(playerOne.position, color(127, 195, 198));
              }
  
              if (playerTwo.isExploding) {
                  playerTwo.explode();
              }
              
              playerOne.update();
              playerTwo.update();
  
                // check if need to have new gold or rock
              if (currentTime - this.lastDropTime > 4000) {
                  let newGoldPos = parseInt(random(0, displaySize));
                  let newRockPos = parseInt(random(0, displaySize));
  
                  while (abs(newGoldPos - newRockPos) < 3) {
                      newRockPos = parseInt(random(0, displaySize));
                  }
  
                  if (golds.length < 6) {
                      golds.push(newGoldPos)
                  }
  
                  if (rocks.length < 6) {
                      rocks.push(newRockPos);
                  }
  
                  this.lastDropTime = currentTime;
              }
  
                // // Check if Player Two explodes a rock
                // rocks.forEach((rock, index) => {
                //     if (playerTwo.isExploding) {
                //         // Check if the explosion hits the rock
                //         let rockPos = rock;
                //         if (playerTwo.position === rockPos) {
                //             rocks.splice(index, 1); // Remove rock
                //             alert('Player Two has removed the rock!');
                //         }
                //     }
                // });
  
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
  