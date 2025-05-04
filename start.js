class Start {
  constructor() {
    this.count = 0;
    this.clicked = false;
    this.increment = PI / fr;
    this.startLauris = getRandomHappyLauris();
    this.laurisY = min(centerY - 100, windowHeight * 0.4);
    this.laurisSize = min(200, windowWidth * 0.2);
    this.buttonHovered = false;
  }

  drawPlayButton(x, y) {
    const buttonWidth = min(200, windowWidth * 0.2);
    const buttonHeight = min(60, windowHeight * 0.08);
    const isHovered = mouseX > x - buttonWidth/2 && mouseX < x + buttonWidth/2 &&
                     mouseY > y - buttonHeight/2 && mouseY < y + buttonHeight/2;
    
    fill(isHovered ? yellow : dark);
    rect(x - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight, 30);
    
    textFont(headingFont);
    textAlign(CENTER, CENTER);
    fill(isHovered ? dark : light);
    textSize(min(32, windowWidth * 0.03));
    text("PLAY", x, y);

    this.buttonHovered = isHovered;
    return isHovered;
  }

  run() {
    background(grass);

    textFont(headingFont);
    textAlign(CENTER, CENTER);
    const titleSize = min(80, windowWidth * 0.08);
    
    const titleY1 = windowHeight * 0.2;
    const titleY2 = titleY1 + titleSize * 1.2;
    
    fill(darker);
    textSize(titleSize);
    text("FIND HAPPY", centerX + 4, titleY1 + 4);
    text("LAURIS", centerX + 4, titleY2 + 4);
    
    fill(light);
    textSize(titleSize);
    text("FIND HAPPY", centerX, titleY1);
    text("LAURIS", centerX, titleY2);

    const bounceOffset = sin(this.count * 0.05) * 20;
    imageMode(CENTER);
    
    if (!this.clicked) {
      image(this.startLauris, 
            centerX, 
            this.laurisY + bounceOffset + 150, 
            this.laurisSize, 
            this.laurisSize);
    } else {
      const scale = 1 - (this.count - this.clickedAt) * 0.05;
      if (scale > 0) {
        image(this.startLauris, 
              centerX, 
              this.laurisY + bounceOffset, 
              this.laurisSize * scale, 
              this.laurisSize * scale);
      }
    }

    if (!this.clicked) {
      const buttonY = min(centerY + 200, windowHeight * 0.8);
      const isHovered = this.drawPlayButton(centerX, buttonY);
      
      if (currentTouch.x && isHovered) {
        this.clicked = true;
        this.clickedAt = this.count;
        
        setTimeout(() => {
          game.setStage(1);
        }, 1000);
      }
    }

    this.count += deltaTime;
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
    this.count += deltaTime * 2;
    if (this.count >= fr) {
      this.turn += 1;
      this.count = this.count % fr;
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
      this.count += deltaTime;
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
    this.count += deltaTime;
  }
}
