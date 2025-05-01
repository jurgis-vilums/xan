class Start {
  constructor() {
    this.typing = new Typing();
    this.msgReady = new Message("ready");
    this.msgSmile = new Message("smile");
    this.cursor = new Cursor();
    this.count = 0;
    this.stage = 0;
    this.clicked = false;
    this.increment = PI / fr;
  }
  run() {
    // header
    textFont(headingFont);
    textAlign(CENTER, CENTER);
    noStroke();
    fill(light);
    textSize(120);
    text("FIND", centerX, centerY - 600);
    text("LAURIS", centerX, centerY - 250);
    textSize(240);
    text("HAPPY", centerX, centerY - 460);

    // input container
    strokeWeight(5);
    stroke(yellow);
    noFill();
    rect(centerX - 300, centerY + 400, 600, 100, 50);

    // send message a.k.a start game
    fill(yellow);
    noStroke();
    ellipseMode(CORNER);
    ellipse(centerX + 210, centerY + 410, 80, 80);
    imageMode(CORNER);
    image(trophy, centerX + 220, centerY + 420, 60, 60);

    if (this.count < 3 * fr) {
      this.typing.draw(centerX - 300, centerY);
    } else if (this.count < 4 * fr) {
      this.msgReady.draw(centerX - 300, centerY);
    } else if (this.count < 5 * fr) {
      this.msgReady.draw(centerX - 300, centerY);
      this.cursor.draw(centerX - 260, centerY + 420);
    } else {
      this.msgReady.draw(centerX - 300, centerY);
      if (this.clicked !== true) {
        imageMode(CORNER);
        image(happyLauris, centerX - 260, centerY + 420, 60, 60);
        this.cursor.draw(centerX - 190, centerY + 420);
      }
      if (
        currentTouch.x > centerX + 200 &&
        currentTouch.x < centerX + 300 &&
        currentTouch.y > centerY + 400 &&
        currentTouch.y < centerY + 500
      ) {
        this.clicked = true;
        setTimeout(() => {
          this.count = 0;
          this.stage = 0;
          this.clicked = false;
          game.setStage(1);
        }, 2000);
      }
      if (this.clicked === true) {
        this.msgSmile.draw(centerX + 150, centerY + 100);
      }
    }
    this.count += 1;
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
      image(happyLauris, x + 20, yWithOffset + 10, 150, 150);
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
