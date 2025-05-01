class Start {
  constructor() {
    this.count = 0;
    this.clicked = false;
    this.increment = PI / fr;
    this.startLauris = getRandomHappyLauris();
    this.laurisY = centerY - 100; // Initial position for animation
    this.laurisSize = 200; // Size for Lauris image
    this.buttonHovered = false;
  }

  drawPlayButton(x, y) {
    // Check if mouse is over the button
    const buttonWidth = 200;
    const buttonHeight = 60;
    const isHovered = mouseX > x - buttonWidth/2 && mouseX < x + buttonWidth/2 &&
                     mouseY > y - buttonHeight/2 && mouseY < y + buttonHeight/2;
    
    // Button background
    noStroke();
    fill(isHovered ? yellow : dark);
    rect(x - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight, 30);
    
    // Button text
    textFont(headingFont);
    textAlign(CENTER, CENTER);
    fill(isHovered ? dark : light);
    textSize(32);
    text("PLAY", x, y);

    this.buttonHovered = isHovered;
    return isHovered;
  }

  run() {
    background(grass); // Clear background each frame

    // Title with shadow effect
    textFont(headingFont);
    textAlign(CENTER, CENTER);
    
    // Shadow
    fill(darker);
    textSize(80);
    text("FIND HAPPY", centerX + 4, centerY - 300 + 4);
    text("LAURIS", centerX + 4, centerY - 220 + 4);
    
    // Main text
    fill(light);
    textSize(80);
    text("FIND HAPPY", centerX, centerY - 300);
    text("LAURIS", centerX, centerY - 220);

    // Lauris image with bounce animation
    const bounceOffset = sin(this.count * 0.05) * 20;
    imageMode(CENTER);
    
    if (!this.clicked) {
      // Draw Lauris image with bounce effect
      image(this.startLauris, 
            centerX, 
            this.laurisY + bounceOffset, 
            this.laurisSize, 
            this.laurisSize);
    } else {
      // Zoom out animation when clicked
      const scale = 1 - (this.count - this.clickedAt) * 0.05;
      if (scale > 0) {
        image(this.startLauris, 
              centerX, 
              this.laurisY + bounceOffset, 
              this.laurisSize * scale, 
              this.laurisSize * scale);
      }
    }

    // Draw play button and handle interaction
    if (!this.clicked) {
      const isHovered = this.drawPlayButton(centerX, centerY + 200);
      
      if (currentTouch.x && isHovered) {
        this.clicked = true;
        this.clickedAt = this.count;
        
        // Start game after animation
        setTimeout(() => {
          game.setStage(1);
        }, 1000);
      }
    }

    this.count++;
  }
}

class Typing {
  constructor() {
    this.increment = PI / fr;
    this.count = 0;
    this.turn = 0;
    this.size = 20;
  }
  draw(x, y) {
    noStroke();
    fill(dark);
    rect(x, y, this.size * 6, this.size * 4, this.size * 2);
    fill(light);
    ellipseMode(CORNER);
    this.circle(x, y, 0);
    this.circle(x, y, 1);
    this.circle(x, y, 2);
    this.count += 2;
    if (this.count % fr === 0) {
      this.turn += 1;
    }
  }
  circle(x, y, order) {
    ellipse(
      x + this.size * (1 + 1.5 * order),
      y +
        this.size * 1.5 -
        ((this.turn % 3 === order) *
          (Math.abs(sin(this.count * this.increment)) * this.size)) /
          4,
      this.size,
      this.size
    );
  }
}

class Message {
  constructor(type) {
    this.increment = PI / fr;
    this.count = 0;
    this.type = type;
    this.messageLauris = getRandomHappyLauris();
  }
  draw(x, y) {
    const yWithOffset = y - sin(this.count * this.increment) * 20;
    if (this.type === "ready") {
      noStroke();
      fill(dark);
      rect(x, yWithOffset, 410, 80, 40);
      textFont(contextFont);
      textAlign(LEFT, TOP);
      fill(light);
      textSize(48);
      text("Ready to find Lauris?", x + 30, yWithOffset + 5);
    } else {
      imageMode(CORNER);
      image(this.messageLauris, x + 20, yWithOffset + 10, 150, 150);
    }
    if (this.count < fr / 2) {
      this.count += 1;
    }
  }
}

class Cursor {
  constructor() {
    this.count = 0;
  }
  draw(x, y) {
    if (Math.floor(this.count / (fr / 2)) % 2 === 0) {
      stroke(yellow);
      line(x, y, x, y + 60);
    }
    this.count += 1;
  }
}
