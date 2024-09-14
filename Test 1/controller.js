class Controller {
  constructor() {
      this.gameState = "PLAY";
      this.startTime = millis(); 
      this.lastDropTime = 0;
      this.hideStartTime = 0;
      this.isHidden = false;
      this.flashStartTime = 0; // Start time of flashing effect
      this.flashDuration = 2000; // Duration of flashing effect in milliseconds
      this.flashColor = color(234, 101, 101); // Red color for flashing
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

              // 检查是否生成新的 gold 和 rock
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
                  display.setPixel(pos, color(255, 208, 90));  
              });
              rocks.forEach(pos => {
                  display.setPixel(pos, color(100, 100, 100)); 
              });

              if (golds.includes(playerOne.position)) {
                  golds = golds.filter(pos => pos !== playerOne.position); // 玩家1碰到gold后移除
              }

              // Check for collision between Player One and Player Two
              if (playerOne.position === playerTwo.position) {
                if (!this.isHidden) {
                    this.startFlash(); // Start flashing effect if Player One is not hidden
                    this.endGame(); // End game if Player One is not hidden
                }
            }

            break;

            case "GAME_OVER":
              // Handle flashing red effect
              let flashTime = currentTime - this.flashStartTime;
              if (flashTime < this.flashDuration) {
                  display.setAllPixels(this.flashColor); // Flash red
              } else {
                  this.gameState = "SCORE"; // Go to SCORE state after flashing
              }
              break;

            case "SCORE":       
            
                // reset everyone's score
                playerOne.score = 0;
                playerTwo.score = 0;

                // put the target somewhere else, so we don't restart the game with player and target in the same place
                target.position = parseInt(random(1,displaySize));

                //light up w/ winner color by populating all pixels in buffer with their color
                display.setAllPixels(score.winner);                    

            break;
      }
  }

  
    startFlash() {
        this.flashStartTime = millis(); // Record start time of flashing effect
        this.gameState = "GAME_OVER"; // Change game state to GAME_OVER
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
        controller.restartGame(); // Restart the game when 'R' is pressed
      }
    controller.restartGame(); // Restart the game when 'R' is pressed
  }
}
