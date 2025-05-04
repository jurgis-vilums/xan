const failedCopy = [
  "Keep looking!",
  "Not quite!",
  "Almost there!",
  "Look closer!",
  "Try again!"
];
const succeededCopy = ["Found him!", "That's Lauris!", "Perfect!", "Well spotted!", "Great job!"];

class Level {
  constructor(level) {
    this.level = level;
    this.lastLevel = 6;
    this.totalRow = 1 + level * 2;
    // Make face size responsive to screen size
    const maxGridSize = min(windowWidth * 0.8, windowHeight * 0.6);
    const baseFaceSize = maxGridSize / (this.totalRow * 1.5);
    this.faceSize = min(100 - level * 8, baseFaceSize);
    this.faces = [];
    this.randomRow = Math.floor(random(this.totalRow));
    this.randomColumn = Math.floor(random(this.totalRow));
    this.time = level === 1 ? fr * 5 : fr * 2 + level * 8;
    this.count = 0;
    this.succeeded = false;
    this.targetLauris = getRandomHappyLauris();
    this.isPaused = false;
    
    // Calculate layout constants
    this.headerHeight = windowHeight * 0.15;
    this.timerHeight = 100;
    this.gridMargin = windowHeight * 0.05;
    
    for (let row = 0; row < this.totalRow; row++) {
      this.faces.push([]);
      for (let column = 0; column < this.totalRow; column++) {
        if (row === this.randomRow && column === this.randomColumn) {
          this.faces[row].push(this.targetLauris);
        } else {
          const randomFace = randomFaces[Math.floor(random(randomFaces.length))];
          this.faces[row].push(randomFace);
        }
      }
    }
  }
  drawPauseButton() {
    const buttonSize = min(40, windowWidth * 0.03);
    const padding = 20;
    const x = windowWidth - buttonSize - padding;
    const y = padding;
    
    // Check if mouse is over button
    const isHovered = mouseX > x - buttonSize/2 && mouseX < x + buttonSize/2 &&
                     mouseY > y - buttonSize/2 && mouseY < y + buttonSize/2;

    // Draw button
    noStroke();
    fill(isHovered ? yellow : light);
    circle(x, y, buttonSize);

    // Draw pause/play icon
    fill(dark);
    if (this.isPaused) {
      // Play triangle
      const triangleSize = buttonSize * 0.4;
      triangle(
        x - triangleSize/3, y - triangleSize,
        x - triangleSize/3, y + triangleSize,
        x + triangleSize, y
      );
    } else {
      // Pause bars
      const barWidth = buttonSize * 0.15;
      const barHeight = buttonSize * 0.5;
      rect(x - barWidth*2, y - barHeight/2, barWidth, barHeight);
      rect(x + barWidth, y - barHeight/2, barWidth, barHeight);
    }

    // Handle click
    if (currentTouch.x && isHovered) {
      this.isPaused = !this.isPaused;
      currentTouch.reset();
    }
  }
  run() {
    textFont(headingFont);
    textAlign(CENTER, CENTER);
    noStroke();
    fill(light);
    
    // Calculate header text size based on window size
    const headerTextSize = min(60, windowWidth * 0.05);
    textSize(headerTextSize);
    
    // Draw level header
    const levelHeader =
      this.level === 1
        ? "Find Happy"
        : this.level === this.lastLevel
        ? "Level Final"
        : `Level ${this.level - 1}`;
    text(levelHeader, centerX, this.headerHeight);
    
    // Draw second line for level 1
    if (this.level === 1) {
      text("Lauris!", centerX, this.headerHeight + headerTextSize * 1.2);
    }
    
    // Draw timer if not level 1
    if (this.level !== 1) {
      this.timer();
    }

    // Draw pause button
    this.drawPauseButton();

    // Calculate grid starting position
    const gridStartY = this.level === 1 
      ? this.headerHeight + headerTextSize * 2 + this.gridMargin
      : this.timerHeight + this.gridMargin;
    
    // Draw the grid
    for (let row = 0; row < this.totalRow; row++) {
      for (let column = 0; column < this.totalRow; column++) {
        const x =
          centerX -
          (this.faceSize * (1 + 3 * (Math.floor(this.totalRow / 2) - row))) /
            2;
        const y =
          gridStartY +
          (this.faceSize *
            (1 + 3 * column)) /
            2;
        imageMode(CORNER);
        image(this.faces[row][column], x, y, this.faceSize, this.faceSize);
      }
    }

    if (this.succeeded) {
      this.hint();
      if (this.level < this.lastLevel) {
        setTimeout(() => {
          game.setStage(this.level + 1);
          this.count = 0;
          this.succeeded = false;
        }, 3000);
      }
    } else if (this.count < this.time) {
      this.targetFaceListener();
      if (!this.isPaused) {
        this.count += 1;
      }
    } else {
      this.hint();
      setTimeout(() => {
        game.setStage(0);
        this.count = 0;
        this.succeeded = false;
      }, 3000);
    }
  }
  targetFaceListener() {
    const gridStartY = this.level === 1 
      ? this.headerHeight + textSize() * 2 + this.gridMargin
      : this.timerHeight + this.gridMargin;
      
    const x =
      centerX -
      (this.faceSize *
        (1 + 3 * (Math.floor(this.totalRow / 2) - this.randomRow))) /
        2;
    const y =
      gridStartY +
      (this.faceSize *
        (1 + 3 * this.randomColumn)) /
        2;
    if (
      currentTouch.x > x &&
      currentTouch.x < x + this.faceSize &&
      currentTouch.y > y &&
      currentTouch.y < y + this.faceSize
    ) {
      this.succeeded = true;
    }
  }
  timer() {
    const timerY = this.timerHeight;
    let warning = this.count / this.time > 3 / 4 ? true : false;
    strokeWeight(5);
    stroke(warning ? error : light);
    noFill();
    rect(100, timerY, windowWidth - 200, 10, 5);
    stroke(warning ? error : light);
    fill(warning ? error : light);
    rect(100, timerY, (windowWidth - 200) * (1 - this.count / this.time), 10, 5);
    imageMode(CENTER);
    image(
      stopwatch,
      100 + (windowWidth - 200) * (1 - this.count / this.time),
      timerY,
      50,
      50
    );
  }
  hint() {
    if (this.level === this.lastLevel && this.succeeded) {
      finish.run();
    } else {
      strokeWeight(5);
      stroke(light);
      fill(dark);
      rect(
        centerX - 350,
        centerY - 300,
        700,
        !this.succeeded || this.level === 1 ? 380 : 300,
        50
      );
      imageMode(CENTER);
      image(
        this.succeeded ? this.targetLauris : randomFaces[0],
        centerX,
        centerY - 200,
        100,
        100
      );
      textFont(headingFont);
      textAlign(CENTER, CENTER);
      noStroke();
      fill(light);
      textSize(60);
      if (this.level === 1) {
        text(
          this.succeeded ? "Great! Now for" : "That's not Lauris!",
          centerX,
          centerY - 100
        );
        text(
          this.succeeded ? "the challenge!" : "Keep looking!",
          centerX,
          centerY - 20
        );
      } else {
        text(
          this.succeeded
            ? succeededCopy[this.level - 2]
            : failedCopy[this.level - 2],
          centerX,
          centerY - 100
        );
      }
    }
  }
}
