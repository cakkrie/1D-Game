let golds = [];
let moveInterval = 200;

class PlayerOne {
    constructor(_color, _position, _displaySize) {
        this.playerColor = color(127, 195, 198);
        this.position = _position;
        this.displaySize = _displaySize;
        this.miningCount = 0;
        this.minegoldcondition = false;
        this.isBlinking = false;   
        this.blinkInterval = null;
        this.blinkSpeed = 200;   
        this.blinkStartTime = 0; 
        this.state = "DONT_MOVE"; //default state
        this.lastMoveTime = 0; // Track the last move time
    }

    move(_direction) {
        display.setPixel(this.position, color(BG, BG, BG));  // Reset the old position to the background color

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

    update() {
        let currentTime = millis();
            if (currentTime - this.lastMoveTime >= moveInterval) {
            switch (this.state) {
                case "MOVE_LEFT":  // Player One continuously moves left
                    this.move(-1);
                    break;

                case "DONT_MOVE":  // Player One doesn't move
                // No movement
                    break;

                case "MOVE_RIGHT":  // Player One continuously moves right
                    this.move(1);
                    break;

                default:
                    break;
            }
            this.lastMoveTime = currentTime;

        }
    }

    startBlinking() {
        if (this.isBlinking) return; // If already blinking, don't start again.
    
        let originalColor = this.playerColor;  
        let blinkColor = color(179, 241, 245); 
        
        this.isBlinking = true;
        this.blinkStartTime = millis();
        this.frameCount = 0;  // Initialize frame counter
    
        let frameDuration = 60;  // Assuming 60 FPS, adjust this based on your actual frame rate
        let blinkFrames = frameDuration;  // 60 frames for 1 second of blinking
        let flashSpeed = 10; // Flash every 20 frames (adjust this to change the flash speed)
    
        this.blinkInterval = setInterval(() => {
            // Increment the frame counter
            this.frameCount++;
    
            // Toggle between blink color and original color based on `flashSpeed`
            if (this.frameCount % flashSpeed === 0) {
                // Every `flashSpeed` frames, change color
                if (this.playerColor === originalColor) {
                    this.playerColor = blinkColor;
                } else {
                    this.playerColor = originalColor;
                }
            }
    
            // Stop blinking after `blinkFrames` frames (1 second at 60 FPS)
            if (this.frameCount >= blinkFrames) {
                clearInterval(this.blinkInterval);  // Stop blinking
                this.playerColor = originalColor;   // Restore the original color
                this.isBlinking = false;            // Reset blinking state
            }
        }, 1000 / frameDuration);  // Calculate the interval to simulate frame-based timing
        return playerOneColor
    }
    

    whichGold(){
        for (let i = 0; i < golds.length; i++) {
            if (this.position === golds[i] - 1 || this.position === golds[i] + 1 || this.position === golds[i]) {
                return i;
            }
    }
}

    mineGold() {
        // 逻辑是用for loop去跑过1-6种array 看哪个位置的array是玩家附近的 找到那个位置了以后 在那个位置改变gold的颜色 所以for里的i就是之后gold里面的i
        // Check if player is at a position adjacent to any gold
        for (let i = 0; i < golds.length; i++) {
            if (this.position === golds[i] - 1 || this.position === golds[i] + 1 || this.position === golds[i]) {
                if (key === 'B' || key === 'b') {
                    this.miningCount++; // Increment the mining count each time 'B' is pressed
                    if (this.miningCount === 3) {
                        // Third press: Mine the gold
                        golds.splice(i, 1); // Remove the gold from the array after mining
                        controller.score++; // Increment player score
                        this.miningCount = 0; // Reset mining count for future mining
                        this.minegoldcondition = true;

                        alert("Player One has mined the gold!");

                        break; 
                        // Stop after mining the gold
                    }
                }
            } else {
                this.minegoldcondition = false;
            }
        }
    }
}

class PlayerTwo {
    constructor(_color, _position, _displaySize) {
        this.playerColor = color(234, 101, 101);
        this.position = _position;
        this.displaySize = _displaySize;
        this.isExploding = false; 
        this.explosionSize = 1;  // Default explosion size
        this.explosionStartTime = 0;  // Record explosion start time
        this.flashColor = false; // Used for flashing effect
        this.state = "DONT_MOVE"; //default state
        this.lastMoveTime = 0; // Track the last move time
    }

    move(_direction) {
        display.setPixel(this.position, color(BG, BG, BG));  // Reset the old position to the background color

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

    update() {
        let currentTime = millis();
            if (currentTime - this.lastMoveTime >= moveInterval) {
            switch (this.state) {
                case "MOVE_LEFT":  // Player One continuously moves left
                    this.move(-1);
                    break;

                case "DONT_MOVE":  // Player One doesn't move
                // No movement
                    break;

                case "MOVE_RIGHT":  // Player One continuously moves right
                    this.move(1);
                    break;

                default:
                    break;
            }
            this.lastMoveTime = currentTime;

        }
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

            display.setPixel(leftPos, explosionColor);
            display.setPixel(rightPos, explosionColor);

            if (leftPos < 0) {
                leftPos = this.displaySize - 1;
            }
            if (rightPos >= this.displaySize) {
                rightPos = 0;
            }

            // Remove rocks at explosion positions
            rocks = rocks.filter(pos => pos !== leftPos && pos !== rightPos && pos !== this.position);

            // Remove gold at explosion positions
            golds = golds.filter(pos => pos !== leftPos && pos !== rightPos && pos !== this.position);

            // Check if explosion hits playerOne and let playerOne die once the explode hit it
            if (playerOne.position === leftPos || playerOne.position === rightPos || playerOne.position === this.position) {
                controller.endGame();  // End game if PlayerOne hits the explosion
                alert('DIED!!!!');
            }
        }

        // End the explosion after 1 seconds
        if (millis() - this.explosionStartTime > 1000) {
            this.isExploding = false;  // Stop the explosion
            alert('Player Two is a bomb!');
        }

    }
}

