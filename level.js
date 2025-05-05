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
    
    // Make face size responsive to screen size and device type
    const maxGridSize = min(windowWidth * 0.8, windowHeight * 0.6);
    const baseFaceSize = maxGridSize / (this.totalRow * 1.5);
    
    // Minimum face size
    const minFaceSize = isMobile ? 60 : 40;
    this.faceSize = max(minFaceSize, min(100 - level * 8, baseFaceSize));
    
    this.faces = [];
    this.randomRow = Math.floor(random(this.totalRow));
    this.randomColumn = Math.floor(random(this.totalRow));
    this.time = level === 1 ? fr * 5 : fr * 2 + level * 8;
    this.count = 0;
    this.succeeded = false;
    this.targetLauris = getRandomHappyLauris();
    
    // Calculate layout constants - adjusted for mobile
    this.headerHeight = isMobile ? windowHeight * 0.1 : windowHeight * 0.12;
    this.timerHeight = isMobile ? 60 : 80;
    this.gridMargin = isMobile ? windowHeight * 0.15 : windowHeight * 0.18;
    
    // Precompute grid positions to avoid recalculating each frame
    this.gridPositions = [];
    const gridStartY = this.level === 1 
      ? this.headerHeight + (isMobile ? windowWidth * 0.06 : windowWidth * 0.05) * 1.2 * 2 + this.gridMargin
      : this.timerHeight + this.gridMargin;
    
    const spacing = isMobile ? 3.5 : 3;
    
    for (let row = 0; row < this.totalRow; row++) {
      this.gridPositions.push([]);
      for (let column = 0; column < this.totalRow; column++) {
        const x = centerX - (this.faceSize * (1 + spacing * (Math.floor(this.totalRow / 2) - row))) / 2;
        const y = gridStartY + (this.faceSize * (1 + spacing * column)) / 2;
        this.gridPositions[row].push({x, y});
      }
    }
    
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

  run() {
    textFont(headingFont);
    textAlign(CENTER, CENTER);
    noStroke();
    fill(light);
    
    // Calculate header text size based on window size and device
    const headerTextSize = isMobile 
      ? min(48, windowWidth * 0.06)
      : min(60, windowWidth * 0.05);
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

    // Draw the grid with cached positions
    for (let row = 0; row < this.totalRow; row++) {
      for (let column = 0; column < this.totalRow; column++) {
        const pos = this.gridPositions[row][column];
        imageMode(CORNER);
        image(this.faces[row][column], pos.x, pos.y, this.faceSize, this.faceSize);
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
      } else if (this.level === this.lastLevel) {
        setTimeout(() => {
          game.setStage(7);
        }, 3000);
      }
    } else if (this.count < this.time) {
      this.targetFaceListener();
      this.count += deltaTime; // Use deltaTime instead of fixed increment
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
    if (!currentTouch.x || !currentTouch.y) return;

    // Use the precomputed position for the target face
    const pos = this.gridPositions[this.randomRow][this.randomColumn];
    
    // Add touch padding based on face size and device
    const touchPadding = isMobile ? this.faceSize * 0.3 : this.faceSize * 0.1;
    
    // Check if touch is within the target area
    const touchX = currentTouch.x;
    const touchY = currentTouch.y;
    
    const touchArea = {
      left: pos.x - touchPadding,
      right: pos.x + this.faceSize + touchPadding,
      top: pos.y - touchPadding,
      bottom: pos.y + this.faceSize + touchPadding
    };

    if (
      touchX >= touchArea.left &&
      touchX <= touchArea.right &&
      touchY >= touchArea.top &&
      touchY <= touchArea.bottom
    ) {
      this.succeeded = true;
      currentTouch.reset();
    }
  }
  
  timer() {
    const timerY = this.timerHeight;
    const timerWidth = isMobile ? windowWidth - 100 : windowWidth - 200;
    const timerX = (windowWidth - timerWidth) / 2;
    
    let warning = this.count / this.time > 3 / 4 ? true : false;
    strokeWeight(5);
    stroke(warning ? error : light);
    noFill();
    rect(timerX, timerY, timerWidth, 10, 5);
    stroke(warning ? error : light);
    fill(warning ? error : light);
    rect(timerX, timerY, timerWidth * (1 - this.count / this.time), 10, 5);
    imageMode(CENTER);
    image(
      stopwatch,
      timerX + timerWidth * (1 - this.count / this.time),
      timerY,
      isMobile ? 40 : 50,
      isMobile ? 40 : 50
    );
  }
  hint() {
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
