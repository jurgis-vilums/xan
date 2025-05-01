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
    this.faceSize = 100 - level * 8; // Adjusted size for face images
    this.faces = [];
    this.randomRow = Math.floor(random(this.totalRow));
    this.randomColumn = Math.floor(random(this.totalRow));
    this.time = level === 1 ? fr * 5 : fr * 2 + level * 8;
    this.count = 0;
    this.succeeded = false;
    this.targetLauris = getRandomHappyLauris(); // Store the target image for this level
    
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
    textSize(60);
    const levelHeader =
      this.level === 1
        ? "Find Happy"
        : this.level === this.lastLevel
        ? "Level Final"
        : `Level ${this.level - 1}`;
    text(levelHeader, centerX, 200);
    this.level === 1 && text("Lauris!", centerX, 260);
    if (this.level !== 1) this.timer();
    for (let row = 0; row < this.totalRow; row++) {
      for (let column = 0; column < this.totalRow; column++) {
        const x =
          centerX -
          (this.faceSize * (1 + 3 * (Math.floor(this.totalRow / 2) - row))) /
            2;
        const y =
          centerY -
          (this.faceSize *
            (1 + 3 * (Math.floor(this.totalRow / 2) - column))) /
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
      this.count += 1;
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
    const x =
      centerX -
      (this.faceSize *
        (1 + 3 * (Math.floor(this.totalRow / 2) - this.randomRow))) /
        2;
    const y =
      centerY -
      (this.faceSize *
        (1 + 3 * (Math.floor(this.totalRow / 2) - this.randomColumn))) /
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
    let warning = this.count / this.time > 3 / 4 ? true : false;
    strokeWeight(5);
    stroke(warning ? error : light);
    noFill();
    rect(100, 100, windowWidth - 200, 10, 5);
    stroke(warning ? error : light);
    fill(warning ? error : light);
    rect(100, 100, (windowWidth - 200) * (1 - this.count / this.time), 10, 5);
    imageMode(CENTER);
    image(
      stopwatch,
      100 + (windowWidth - 200) * (1 - this.count / this.time),
      100,
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
        !this.succeeded && text("Try again!", centerX, centerY - 20);
      }
    }
  }
}
