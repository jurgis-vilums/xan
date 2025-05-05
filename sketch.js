let currentTouch;
let centerX;
let centerY;
let game;
let isMobile;

let darker;
let dark;
let green;
let grass;
let light;
let yellow;
let error;
const fr = 24;
let lastFrameTime = 0;
let deltaTime = 0;

let happyLaurisImages = [];
let randomFaces = [];
let stopwatch;
let trophy;
let smilingFace;

// Function to get a random happy Lauris image
function getRandomHappyLauris() {
  return happyLaurisImages[Math.floor(random(happyLaurisImages.length))];
}

//matter.js setup
const Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies;

function preload() {
  stopwatch = loadImage("assets/stopwatch.png");
  trophy = loadImage("assets/trophy.png");
  headingFont = loadFont("assets/sigmar_one.ttf");
  contextFont = loadFont("assets/open_sans.ttf");
  
  // Load happy Lauris images
  for (let i = 1; i <= 10; i++) {
    try {
      const happyImage = loadImage(`assets/faces/happy/happy_lauris_${i}.jpg`);
      happyLaurisImages.push(happyImage);
    } catch (e) {
      console.log(`Failed to load happy_lauris_${i}.jpg`);
    }
  }
  
  // Load random faces
  for (let i = 1; i <= 10; i++) {
    randomFaces.push(loadImage(`assets/faces/random/random_face_${i}.jpg`));
  }
  smilingFace = loadImage("assets/faces/happy/happy_lauris_1.jpg");
}

function setup() {
  // Check if device is mobile
  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Prevent default touch behaviors
  if (isMobile) {
    document.addEventListener('touchstart', function(e) {
      e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchmove', function(e) {
      e.preventDefault();
    }, { passive: false });
  }
  
  centerX = windowWidth / 2;
  centerY = windowHeight / 2;
  darker = color("#3B3C41");
  dark = color("#475659");
  green = color("#358C3B");
  yellow = color("#FFFFB4");
  grass = color("#769062");
  light = color("#F3F1F2");
  error = color("#8C2A3C");
  currentTouch = new Touch();
  start = new Start();
  game = new Game();
  frameRate(isMobile ? 30 : 60); // Higher target framerate, but we'll use deltaTime for animations
  lastFrameTime = millis();
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  // Calculate deltaTime for smooth animations regardless of actual frame rate
  const currentTime = millis();
  deltaTime = (currentTime - lastFrameTime) / (1000 / fr); // Normalize to target frame rate
  lastFrameTime = currentTime;
  
  background(grass);
  // Get the current level object from the game and run it
  const currentLevel = game.getCurrentLevel();
  if (currentLevel && typeof currentLevel.run === 'function') {
    currentLevel.run();
  }
}

function touchStarted() {
  // For both mouse and touch, use actual screen coordinates
  const x = mouseX;
  const y = mouseY;
  
  if (x !== undefined && y !== undefined) {
    currentTouch.set(x, y);
  }
  return false;
}

function touchMoved() {
  return false;
}

function touchEnded() {
  setTimeout(() => currentTouch.reset(), 50);
  return false;
}

function mousePressed() {
  touchStarted();
  return false;
}

function mouseReleased() {
  touchEnded();
  return false;
}

function windowResized() {
  // Handle window resize and orientation changes
  resizeCanvas(windowWidth, windowHeight);
  centerX = windowWidth / 2;
  centerY = windowHeight / 2;
  
  // Force re-initialization of the current level within the Game class
  // This will create a new instance with updated dimensions if needed
  game.initializeLevel(game.getStage());
}
