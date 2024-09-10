class PlayerOne {
  
    constructor(_color, _position, _displaySize) {
        this.playerColor = _color;
        this.position = _position;
        this.score = 0;
        this.displaySize = _displaySize;
    }


    // Move player based on keyboard input
    move(_direction) {

          // Calculate the next position the player wants to move to
          let nextPosition = this.position + _direction;

          // Wrap around logic: if player hits the edge of display, loop around
          if (nextPosition == -1) {
              nextPosition = this.displaySize - 1;
          } else if (nextPosition == this.displaySize) {
              nextPosition = 0;
          }

           // Check if the next position is occupied by a rock
            if (!rocks.includes(nextPosition)) {
            // If it's not a rock, allow the move
            this.position = nextPosition;
        }
         
    } 

   
  }

  class PlayerTwo {
  
    constructor(_color, _position, _displaySize) {
        this.playerColor = _color;
        this.position = _position;
        this.score = 0;
        this.displaySize = _displaySize;
        this.explosionSize = 0;  // Initialize explosion size to 0
        this.isExploding = false; // Track whether the explosion is happening
    }

    // Move player based on keyboard input
    move(_direction) {

        // increments or decrements player position
        this.position = this.position + _direction;
      
        // if player hits the edge of display, loop around
        if (this.position == -1) {
            this.position = this.displaySize - 1;
        } else if (this.position == this.displaySize) {
            this.position = 0;
        } 
         
    } 

   explode(_color) {
        display.setPixel(this.position, _color);
            // Expand by 2 units in both directions (left and right)
            for (let i = 1; i <= this.explosionSize; i++) {
                let leftPos = this.position - i;
                let rightPos = this.position + i;
    
                // Wrap around if leftPos or rightPos goes out of bounds
                if (leftPos < 0) {
                    leftPos = this.displaySize - 1;
                }
                if (rightPos >= this.displaySize) {
                    rightPos = 0;
                }
    
                // Display explosion effect at left and right positions
                display.setPixel(leftPos, _color);
                display.setPixel(rightPos, _color);
            }
    
            // Increase the explosion size until it reaches 2
            if (this.explosionSize < 2) {
                this.explosionSize++;
            }  else {
                this.isExploding = false; // Stop explosion after reaching max size
            }
        }
    
         
        startExplosion() {
            this.explosionSize = 0;
            this.isExploding = true;
        }
    }
