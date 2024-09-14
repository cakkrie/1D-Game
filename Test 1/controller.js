class Controller {
  constructor() {
      this.gameState = "PLAY";
      this.startTime = millis(); 
      this.lastDropTime = 0;
      this.hideStartTime = 0;
      this.isHidden = false;
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

              // 检查 playerTwo 是否正在爆炸
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

  endGame() {
      this.gameState = "GAME_OVER";
      console.log("游戏结束");
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
}
