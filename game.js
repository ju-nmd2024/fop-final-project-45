//Sources used for this game
//references
//https://editor.p5js.org/p5/sketches/Image:_Load_and_Display_Image
//https://www.youtube.com/watch?v=pHFtOYU-a20
//https://codepen.io/lukasfrydek/pen/aQmyXL
//some of the areas used to do with the help of ai

// Doodle Jump Game
// Game Variables
let player;
let platforms = [];
let score = 0;
let highScore = 0;
let gameState = "start";
let controls = "arrows"; // Control option for "arrows" or "wasd" keys

//for all images used different pictures from google
//https://www.youtube.com/watch?v=rO6M5hj0V-o&t=135s
function preload() {
  bgImage = loadImage("GameBackground.png");
  startImage = loadImage("doodleJump.jpg");
  endImage = loadImage("End.png");
  optImage = loadImage("options.png");
}
// Player Class to repereset player functions
class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 50;
    this.velocityY = 0;
    this.speed = 5;
    this.gravity = 0.5;
    this.jumpStrength = -10;
    this.direction = 0;
  }

  // Updates player's position and handles screen wrapping
  update() {
    this.velocityY += this.gravity;
    this.y += this.velocityY;
    this.x += this.direction * this.speed;

    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
  }

  // Draws the player character
  display() {
    fill(217, 255, 102);
    ellipse(this.x + 20, this.y + 2, 5, 4);
    ellipse(this.x, this.y, 30, 30);
    rect(this.x - 15, this.y, 30, 20);
    fill(0, 179, 0);
    rect(this.x - 15, this.y + 10, 30, 5);
    rect(this.x - 15, this.y + 15, 30, 5);
    fill(0);
    ellipse(this.x - 1, this.y - 3, 3, 3);
    ellipse(this.x + 6, this.y - 3, 3, 3);
    line(this.x + 20, this.y, this.x, this.y);
    line(this.x + 20, this.y + 4, this.x - 5, this.y + 4);
    strokeWeight(2);
    line(this.x - 5, this.y + 20, this.x - 5, this.y + 30);
    line(this.x - 5, this.y + 30, this.x - 1, this.y + 30);
    line(this.x - 14, this.y + 20, this.x - 14, this.y + 30);
    line(this.x - 14, this.y + 30, this.x - 10, this.y + 30);
    line(this.x + 5, this.y + 20, this.x + 5, this.y + 30);
    line(this.x + 5, this.y + 30, this.x + 9, this.y + 30);
    line(this.x + 14, this.y + 20, this.x + 14, this.y + 30);
    line(this.x + 14, this.y + 30, this.x + 18, this.y + 30);
    push();
    noStroke();
    fill(217, 255, 102);
    rect(this.x - 14, this.y - 1, 24, 9);
    pop();
  }

  // Makes the player jump
  jump() {
    this.velocityY = this.jumpStrength;
  }

  // Moves the player left or right
  move(dir) {
    this.direction = dir;
  }
}

// Platform Class for representing each platforms
class Platform {
  constructor(x, y, type = "normal") {
    this.x = x;
    this.y = y;
    this.width = 80;
    this.height = 10;
    this.type = type;
    this.isBroken = false;
  }
  //some of the areas used to do with the help of ai
  // Updates platform position and its behavior
  update() {
    this.y += 1;
    if (this.y > height) {
      this.y = 0;
      this.x = random(width);
      this.type = random(["normal", "moving", "breaking"]);
      this.isBroken = false;
    }

    if (this.type === "moving") {
      this.x += sin(frameCount * 0.05) * 2;
    }
  }

  // Draws the platform for the game
  display() {
    if (!this.isBroken) {
      if (this.type === "moving") {
        fill(0, 0, 255); // Blue for moving platforms
      } else if (this.type === "breaking") {
        fill(255, 165, 0); // Orange for breaking platforms
      } else {
        fill(0, 255, 0); // Green for normal platforms
      }
      rect(this.x, this.y, this.width, this.height);
    }
  }
}

// setup the overall game frame
function setup() {
  createCanvas(800, 700);
  player = new Player();
  for (let i = 0; i < 6; i++) {
    platforms.push(new Platform(random(width), i * 100));
  }
  highScore = getItem("highScore") || 0;
}

// Main game loop function
function draw() {
  if (gameState == "start") startScreen(); //defines for start screen
  else if (gameState == "options") optionsScreen(); // defines for option scren
  else if (gameState == "play") gamePlay();
  else if (gameState == "gameOver") resultScreen();
}

// StartScreen with buttons
function startScreen() {
  background(startImage);
  textAlign(CENTER);
  textSize(24);

  // Start Game Button
  fill(255);
  rect(width / 2 - 75, height / 2 + 80, 150, 40, 10);
  fill(0);
  text("Start Game", width / 2, height / 2 + 110);

  // Options Button
  fill(255);
  rect(width / 2 - 75, height / 2 + 170, 150, 40, 10);
  fill(0);
  text("Options", width / 2, height / 2 + 195);
}

// OptionsScreen with mouse-clickable options
function optionsScreen() {
  background(optImage);
  textAlign(CENTER);
  textSize(32);
  fill(0);
  text("Choose Controls", width / 2, height / 2 - 60);
  textSize(24);

  // Arrows Control Option
  fill(200);
  rect(width / 2 - 75, height / 2 - 20, 150, 40, 10);
  fill(0);
  text("Arrow Keys", width / 2, height / 2 + 5);

  // WASD Control Option
  fill(200);
  rect(width / 2 - 75, height / 2 + 40, 150, 40, 10);
  fill(0);
  text("A & D Keys", width / 2, height / 2 + 65);
}

// Gamescreen with core gameplay logics
function gamePlay() {
  background(bgImage);
  player.update();
  player.display();

  for (let plat of platforms) {
    plat.update();
    plat.display();

    if (
      player.velocityY > 0 &&
      player.y + 25 <= plat.y + 5 &&
      player.y + 25 >= plat.y - 5 &&
      player.x > plat.x &&
      player.x < plat.x + plat.width
    ) {
      if (plat.type !== "breaking") {
        player.jump();
        score += 10;
      } else {
        plat.isBroken = true;
      }
    }
  }

  if (player.y > height) {
    gameState = "gameOver";
    if (score > highScore) {
      highScore = score;
      storeItem("highScore", highScore);
    }
  }

  fill(0);
  textSize(17);
  text("Score: " + score, 50, 30);
  text("High Score: " + highScore, 70, 50);
}

// ResultScreen
function resultScreen() {
  background(endImage);
  textAlign(CENTER);
  textSize(32);
  fill(0);
  text("Game Over", width / 2, height / 2 - 40);
  textSize(22);
  text("Final Score: " + score, width / 2, height / 2);
  text("High Score: " + highScore, width / 2, height / 2 + 40);
  text("Press ENTER to Restart", width / 2, height / 2 + 80);
}

// Resets the game to start screen and with all the default functions of the game
function resetGame() {
  player = new Player(); //resets to default player
  platforms = [];
  for (let i = 0; i < 6; i++) {
    platforms.push(new Platform(random(width), i * 100));
  }
  score = 0;
  gameState = "start";
}

// Mouse click for menu selections
function mousePressed() {
  if (gameState === "start") {
    if (mouseX > width / 2 - 75 && mouseX < width / 2 + 75) {
      if (mouseY > height / 2 + 80 && mouseY < height / 2 + 120) {
        gameState = "play"; //for starting the game
      } else if (mouseY > height / 2 + 170 && mouseY < height / 2 + 210) {
        gameState = "options"; // for getting options
      }
    }
  } else if (gameState === "options") {
    if (mouseX > width / 2 - 75 && mouseX < width / 2 + 75) {
      if (mouseY > height / 2 - 20 && mouseY < height / 2 + 20) {
        controls = "arrows"; //to select arrow key options
        gameState = "start"; //to return to startscreen
      } else if (mouseY > height / 2 + 40 && mouseY < height / 2 + 80) {
        controls = "a & d"; //to select a & d key options
        gameState = "start"; //to return to startscreen
      }
    }
  }
}

// Keyboard input for all game functions
function keyPressed() {
  if (gameState === "gameOver" && keyCode === 13) {
    resetGame();
  }
  if (controls === "arrows" || controls === "a & d") {
    if (key === " " || keyCode === 32) {
      player.jump();
    }
    if (keyCode === 37 || keyCode === 65) {
      player.move(-1);
    }
    if (keyCode === 39 || keyCode === 68) {
      player.move(1);
    }
  }
}

// Stops player movement when keys are released
function keyReleased() {
  if (
    keyCode === 37 || //for left arrow
    keyCode === 39 || //for right arrow
    keyCode === 65 || //for key letter "a"
    keyCode === 68 //for key letter "d"
  ) {
    player.move(0);
  }
}
