class Finish {
  constructor() {
    this.count = 0;
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

    this.count += 1; 
  }
}
