let golds = [];

class PlayerOne {
  
    constructor(_color, _position, _displaySize) {
        this.playerColor = _color;
        this.position = _position;
        this.displaySize = _displaySize;
        this.miningCount = 0;
        this.minegoldcondition = false;
    }

    move(_direction) {
        let nextPosition = this.position + _direction;

        if (nextPosition == -1) {
            nextPosition = this.displaySize - 1;
        } else if (nextPosition == this.displaySize) {
            nextPosition = 0;
        }

        if (!rocks.includes(nextPosition)) {
            this.position = nextPosition;
        }

    } 

    //main focus
    mineGold() {
        // 逻辑是用for loop去跑过1-6种array 看哪个位置的array是玩家附近的 找到那个位置了以后 在那个位置改变gold的颜色 所以for里的i就是之后gold里面的i
        // Check if player is at a position adjacent to any gold
        for (let i = 0; i < golds.length; i++) {
            if (this.position === golds[i] - 1 || this.position === golds[i] + 1 || this.position === golds[i]) {
                if (key === 'B' || key === 'b') {
                    this.miningCount++; // Increment the mining count each time 'B' is pressed
                }
                if (this.miningCount === 1) {
                    // First press: Change the color of the specific gold to a faded one (e.g., 70% brightness)
                    display.setPixel(golds[i], color(255, 208, 89)); 
                } else if (this.miningCount === 2) {
                    // Second press: Change the color to even more faded (e.g., 30% brightness)
                    display.setPixel(golds[i], color(255, 229, 163)); 
                } else if (this.miningCount === 3) {
                    // Third press: Mine the gold
                    golds.splice(i, 1); // Remove the gold from the array after mining
                    controller.score++; // Increment player score
                    this.miningCount = 0; // Reset mining count for future mining
                    this.minegoldcondition = true;
                    break; 
                    // Stop after mining the gold
                // if (this.miningCount === 3) {
                //     // Mine the gold and give one point
                //     golds.splice(i, 1); // Remove the gold from the array
                //     controller.score++;  // Increment the score
                //     this.miningCount = 0; // Reset the mining count after successful mining
                //     this.minegoldcondition = true;
                //     break; // Exit loop after mining the gold
                }
            } else {
                this.minegoldcondition = false;
            }
        }
    }
}

class PlayerTwo {

    constructor(_color, _position, _displaySize) {
        this.playerColor = _color;
        this.position = _position;
        this.displaySize = _displaySize;
        this.isExploding = false; 
        this.explosionSize = 1;  // Default explosion size
        this.explosionStartTime = 0;  // Record explosion start time
        this.flashColor = false; // Used for flashing effect
    }

    move(_direction) {
        this.position = this.position + _direction;

        if (this.position == -1) {
            this.position = this.displaySize - 1;
        } else if (this.position == this.displaySize) {
            this.position = 0;
        } 
    }

    startExplosion() {
        this.isExploding = true;
        this.explosionStartTime = millis();  // Set the start time of the explosion
        this.explosionSize = 1;              // Set initial explosion size
    }

    explode() {
        // Implement flashing effect
        let explosionColor = this.flashColor ? color(255, 138, 138) : color(BG, BG, BG);

        // Track the number of frames
        if (this.frameCount === undefined) {
            this.frameCount = 0;  // Initialize frame counter if not defined
        }

        // Increment the frame counter
        this.frameCount++;

        // Change color every 10 frames
        if (this.frameCount % 10 === 0) {
            this.flashColor = !this.flashColor;  // Toggle flash color every 10 frames
        }

        // Explosion center at Player 2's position
        display.setPixel(this.position, explosionColor);

        // Expand the explosion by 1 pixel in both directions
        for (let i = 1; i <= this.explosionSize; i++) {
            let leftPos = this.position - i;
            let rightPos = this.position + i;

            if (leftPos < 0) {
                leftPos = this.displaySize - 1;
            }
            if (rightPos >= this.displaySize) {
                rightPos = 0;
            }

            display.setPixel(leftPos, explosionColor);
            display.setPixel(rightPos, explosionColor);

            // Remove rocks at explosion positions
            rocks = rocks.filter(pos => pos !== leftPos && pos !== rightPos && pos !== this.position);

            // Remove gold at explosion positions
            golds = golds.filter(pos => pos !== leftPos && pos !== rightPos && pos !== this.position);

            // Check if explosion hits playerOne and let playerOne die once the explode hit it
            if (playerOne.position === leftPos || playerOne.position === rightPos || playerOne.position === this.position) {
                controller.endGame();  // End game if PlayerOne hits the explosion
            }
        }

        // End the explosion after 1.5 seconds
        if (millis() - this.explosionStartTime > 1500) {
            this.isExploding = false;  // Stop the explosion
        }
    }
}


