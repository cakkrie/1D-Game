class PlayerOne {
  
    constructor(_color, _position, _displaySize) {
        this.playerColor = _color;
        this.position = _position;
        this.displaySize = _displaySize;
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


