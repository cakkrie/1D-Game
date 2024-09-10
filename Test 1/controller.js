
class Controller {

    constructor() {
        this.gameState = "PLAY";
        this.startTime = millis(); 
        this.lastDropTime = 0; 
        this.hideStartTime = 0; // 记录HIDE状态开始的时间
        this.isHidden = false; // Tracks whether playerOne is hidden
    }
    
    // This is called from draw() in sketch.js with every frame
    update() {
        let currentTime = millis();

        // STATE MACHINE ////////////////////////////////////////////////
        switch(this.gameState) {

            // This is the main game state, where the playing actually happens
            case "PLAY":

                // clear screen at frame rate so we always start fresh      
                display.clear();
            
             // Handle H key for hiding playerOne
             if (this.isHidden) {
                // Check if 1 second has passed since H was pressed
                if (currentTime - this.hideStartTime >= 1000) {
                    this.isHidden = false;  // Stop hiding after 1 second
                }
            }

            // show playerTwo always
            display.setPixel(playerTwo.position, playerTwo.playerColor);

            // Only show playerOne if they are not hidden
            if (!this.isHidden) {
                display.setPixel(playerOne.position, playerOne.playerColor);
            }

            
          // 检查是否需要生成新的 gold 和 rock
          if ((currentTime - this.lastDropTime) > 2000) { 
            let newGoldPos = parseInt(random(0, displaySize));
            let newRockPos = parseInt(random(0, displaySize));
  
            // 确保 gold 和 rock 之间的距离至少为3个像素
            while (abs(newGoldPos - newRockPos) < 3) {
              newRockPos = parseInt(random(0, displaySize));
            }
  
            if (golds.length < 10) {
              golds.push(newGoldPos);      
            }
            if (rocks.length < 10) {
              rocks.push(newRockPos);
            }
  
            this.lastDropTime = currentTime;  // 更新最后一次掉落的时间
          }
  
          // display rock and gold
          golds.forEach(pos => {
            display.setPixel(pos, color(255, 208, 90));  
          });
          rocks.forEach(pos => {
            display.setPixel(pos, color(100, 100, 100)); 
          });
  
          // 检查玩家是否碰到 gold 或 rock
          if (golds.includes(playerOne.position)) {
            golds = golds.filter(pos => pos !== playerOne.position); // 玩家1碰到gold后移除
          }

          //check if rock meet explosion of player 2

            break;


            // This state is used to play an animation, after a target has been caught by a player 
            // case "COLLISION":
                
            //      display.clear();

            //     // play explosion animation one frame at a time.
            //     // first figure out what frame to show
            //     let frameToShow = collisionAnimation.currentFrame();    // this grabs number of current frame and increments it 
                
            //     // then grab every pixel of frame and put it into the display buffer
            //     for(let i = 0; i < collisionAnimation.pixels; i++) {
            //         display.setPixel(i,collisionAnimation.animation[frameToShow][i]);                    
            //     }

            //     //check if animation is done and we should move on to another state
            //     if (frameToShow == collisionAnimation.animation.length-1)  {
                    
            //         // We've hit score max, this player wins
            //         if (playerOne.score >= score.max) {
            //             score.winner = playerOne.playerColor;   // store winning color in score.winner
            //             this.gameState = "SCORE";               // go to state that displays score
                    
            //         // We've hit score max, this player wins
            //         } else if (playerTwo.score >= score.max) {
            //             score.winner = playerTwo.playerColor;   // store winning color in score.winner
            //             this.gameState = "SCORE";               // go to state that displays score
            //         }
            //         // We haven't hit the max score yet, keep playing    
            //         //} else {
            //         //    target.position = parseInt(random(0,displaySize));  // move the target to a new random position
            //         //    this.gameState = "PLAY";    // back to play state
            //         //}
            //     } 

            //     break;

            // Game is over. Show winner and clean everything up so we can start a new game.
            // case "SCORE":       
            
            //     // reset everyone's score
            //     playerOne.score = 0;
            //     playerTwo.score = 0;

            //     // put the target somewhere else, so we don't restart the game with player and target in the same place
            //     target.position = parseInt(random(1,displaySize));

            //     //light up w/ winner color by populating all pixels in buffer with their color
            //     display.setAllPixels(score.winner);                    

            //     break;

            // // Not used, it's here just for code compliance
            default:
                break;
        }
    }
}


function keyPressed() {
    console.log("keyPressed");
    // Move player one to the left if letter A is pressed
    if (key == 'A' || key == 'a') {
        playerOne.move(-1);
      }
    
    // And so on...
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
    // Switch to HIDE state and record the start time
    controller.hideStartTime = millis();
    controller.isHidden = true;  // Start hiding playerOne
    }
    
    // When you press the letter R, the game resets back to the play state
    if (key == 'R' || key == 'r') {
    controller.gameState = "PLAY";
    }

    if (key == ' ') {
        playerTwo.startExplosion();  // Start the explosion when space bar is pressed
    }
  }