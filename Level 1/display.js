class Display {

    constructor(_displaySize, _pixelSize) {
  
      this.displaySize = _displaySize;
      this.pixelSize = _pixelSize;
      this.initColor = color(235, 235, 235);     
      this.displayBuffer = [];

      // Assign black to all pixels. Black = off
      for(let i = 0; i < this.displaySize; i++){
        this.displayBuffer[i] = this.initColor;
      }
  
    }
  
     // Color a specific pixel in the buffer
    setPixel(  _index,  _color) {
        this.displayBuffer[_index]  = _color;
    }
  

    // Color all pixels in the buffer
    setAllPixels( _color) { 
      for(let i = 0; i < displaySize; i++) { 
        display.setPixel(i, _color); 
      }
    }


    // Now write it to screen
    // This is the only function in the entire software that writes something directly to the screen. I recommend you keep it this way.
    show() {
      for (let i =0; i< this.displaySize; i++) {
        noStroke();
        fill(this.displayBuffer[i]);
        rect(i*this.pixelSize,0,this.pixelSize,this.pixelSize);
      }
    }

    // Let's empty the display before we start adding things to it again
    clear() {

        for(let i = 0; i < this.displaySize; i++) {    
          this.displayBuffer[i] = this.initColor; 
        }
    }
    

  }