class Finish {
  constructor() {
    this.count = 0;
    this.smileFaces = [];
  }
  run() {
    //overlay
    noStroke();
    fill("rgba(59,69,65, 0.6)");
    rect(0, 0, windowWidth, windowHeight);

    //container
    strokeWeight(5);
    stroke(yellow);
    fill(dark);
    rect(centerX - 300, centerY - 300, 600, 400, 50);

    // trophy
    imageMode(CENTER);
    const trophyMaxSize = min(200, windowWidth * 0.15);
    const trophyY = centerY - windowHeight * 0.25; // Moved trophy lower
    
    if (this.count > fr && this.count <= fr * 2) {
      const animatedSize = 80 + this.count * 2;
      image(
        trophy,
        centerX,
        trophyY + (2 * fr - this.count),
        min(animatedSize, trophyMaxSize),
        min(animatedSize, trophyMaxSize)
      );
    } else if (this.count > fr * 2) {
      image(trophy, centerX, trophyY, trophyMaxSize, trophyMaxSize);
    }
    
    //text
    textFont(headingFont);
    textAlign(CENTER, CENTER);
    noStroke();
    fill(light);
    const textBaseY = centerY - windowHeight * 0.1; // Base position for text block
    const textSize1 = min(60, windowWidth * 0.05);
    const textSize2 = min(80, windowWidth * 0.06);
    
    if (this.count < 2 * fr) {
      textSize(textSize1);
      text("YAY!", centerX, textBaseY - 80);
      text("YOU DID IT!", centerX, textBaseY);
    } else {
      textSize(textSize1);
      text("YOU FOUND", centerX, textBaseY - 100);
      text("HAPPY", centerX, textBaseY - 10);
      text("LAURIS!", centerX, textBaseY + 80);
    }

    //smile faces
    if (this.count > fr * 3 && this.count < fr * 10 && this.count % 2 === 0)
      this.smileFaces.push(new SmileFace());
    for (var i = 0; i < this.smileFaces.length; i++) {
      this.smileFaces[i].show();
    }
    this.count += 1;
  }
}

class SmileFace {
  constructor() {
    var options = {
      // friction: 0.3,
      // restitution: 0.6
    };
    this.body = Bodies.circle(
      int(random(20, windowWidth - 20)),
      0,
      40,
      options
    );
    World.add(world, this.body);

    // Replace Matter.js body with simple properties
    this.x = int(random(20, windowWidth - 20));
    this.y = 0;
    this.size = 80;
    this.vy = 0; // Vertical velocity
    this.gravity = 0.6; // Simple gravity force
  }

  show() {
    var pos = this.body.position;
    var angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    imageMode(CENTER);
    image(smilingFace, 0, 0, 80, 80);

    // Update position based on simple physics
    this.vy += this.gravity;
    this.y += this.vy;

    // Prevent falling through the bottom
    if (this.y + this.size / 2 > windowHeight) {
      this.y = windowHeight - this.size / 2;
      this.vy *= -0.4; // Simple bounce effect
    }

    // Draw the image at the new position
    imageMode(CENTER);
    image(smilingFace, this.x, this.y, this.size, this.size);

    pop();
  }
}
