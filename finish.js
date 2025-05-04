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
    Engine.update(engine);
    for (var i = 0; i < this.smileFaces.length; i++) {
      this.smileFaces[i].show();
    }
    this.count += 1;
  }
  setup() {
    engine = Engine.create();
    world = engine.world;
    Engine.run(engine);
    var options = {
      isStatic: true
    };
    ground = Bodies.rectangle(
      windowWidth / 2,
      windowHeight,
      windowWidth,
      20,
      options
    );
    wallLeft = Bodies.rectangle(0, windowHeight / 2, 20, windowHeight, options);
    wallRight = Bodies.rectangle(
      windowWidth,
      windowHeight / 2,
      20,
      windowHeight,
      options
    );
    trophyBody = Bodies.rectangle(
      windowWidth / 2,
      centerY - 425,
      160,
      244,
      options
    );
    finishHintBody = Bodies.rectangle(
      windowWidth / 2,
      centerY - 100,
      550,
      400,
      options
    );

    World.add(world, [ground, wallLeft, wallRight, trophyBody, finishHintBody]);
    // World.add(world, wallLeft);
    // World.add(world, wallRight);
    // World.add(world, wallRight);
    // World.add(world, wallRight);
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
  }

  show() {
    var pos = this.body.position;
    var angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    imageMode(CENTER);
    image(smilingFace, 0, 0, 80, 80);

    pop();
  }
}
