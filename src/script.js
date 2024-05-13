let score = 0;
let tilesBack = 0;
let height = 0;
let pX = 50;
let pY = 400;

//normal, developer, main menu, endn for normal mode death, endd for developer mode death, guide
let gameState = "main";

let pWidth = 50;
let prevLs = 0;
let prevO = 10;
let pOrient = "u";

let sWidth = 400;
let sLength = 600;

let pOffset = 10;

let logOffset = 5;
let trainOffset = 5;
let lilyOffset = 5;
let carOffset = 5;

let rows = sLength / pWidth;
let cols = sWidth / pWidth;
let deathMessage = "You Drowned";

let terrain = [];
let obstacles = [[]];
let directions = [];
let speeds = [];
let carImagesRight = [];
let carImagesLeft = [];
let terrainTypes = ["G", "R", "W", "T"];
let d = [-1, 1];

let grassCounts = [];
let gCount = 0;

let boxes = [0, 50, 100, 150, 200, 250, 300, 350];

let index = 0;
let ls = 0;

let trainsLightOn = [false];
let curFrames = 0;
let targetFrames = 60;

let cFrames2 = 0;

let ob;
let gameOverSound;
let jumpSound;
let selectSound;
let logSound;
let lilypadSound;

class Obstacle {
  constructor(x, width, length, speed, red, green, blue, offset) {
    this.x = x;
    this.l = length;
    this.w = width;
    this.s = speed;
    this.r = red;
    this.g = green;
    this.b = blue;
    this.o = offset;
  }

  move(dir, pPres) {
    this.x += dir * this.s;

    if (pPres) {
      pX += dir * this.s;
    }
  }

  checkCollision(x, w) {
    if (x + w - pOffset > this.x + this.o && x + pOffset < this.x + this.l - this.o) {
      return true;
    }

    return false;
  }

  display(layer) {

    fill(this.r, this.g, this.b);
    let yLevel = sLength - pWidth * (layer - ls + 1);
    if (terrain[layer] == "R" && directions[layer] == 1) { //car going right
      //image(carImagesRight[0], this.x  + this.o, sLength - pWidth * (layer - ls + 1) + this.o, this.l - this.o*2, this.w - this.o*2);
      rect(this.x + this.o, yLevel + this.o, this.l - this.o * 2, this.w - this.o * 2, 0, 15, 15, 0);
      fill(225);
      rect(this.x + this.o + 20, yLevel + this.o, 50, this.w - this.o * 2);
      fill(255, 204, 0);
      circle(this.x + this.l - this.o - 10, yLevel + this.o * 2, 5);
      circle(this.x + this.l - this.o - 10, yLevel + pWidth - this.o * 2, 5);


    } else if (terrain[layer] == "R" && directions[layer] == -1) { // car going left
      //image(carImagesLeft[0], this.x  + this.o, sLength - pWidth * (layer - ls + 1) + this.o, this.l - this.o*2, this.w - this.o*2); 
      rect(this.x + this.o, yLevel + this.o, this.l - this.o * 2, this.w - this.o * 2, 15, 0, 0, 15);
      fill(225);
      rect(this.x + this.o + 30, yLevel + this.o, 50, this.w - this.o * 2);
      fill(255, 204, 0);
      circle(this.x + this.o + 10, yLevel + this.o * 2, 5);
      circle(this.x + this.o + 10, yLevel + pWidth - this.o * 2, 5);



    } else if (this.r == 1 && this.g == 50 && this.b == 32) { //lilypad
      circle(this.x + pWidth / 2, yLevel + pWidth / 2, this.w / 2 - this.o);
    } else if (this.s == 10) {
      rect(this.x + this.o, yLevel + this.o, this.l - this.o * 2, this.w - this.o * 2, 10);


      rectMode(CENTER);

      stroke(180);
      for (let y = yLevel + 10; y < yLevel + 50; y += 10) {
        line(this.x + 20, y, this.x + this.l - 10, y);
      }
      noStroke();

      fill(180);
      for (let x = this.x + 50; x < this.x + this.l; x += 50) {
        rect(x, yLevel + this.w / 2, 20, 30);
      }

      rectMode(CORNER);

      fill(20);
      rect(this.x + this.o, yLevel + this.o * 2, 20, this.w - this.o * 4, 10);
      rect(this.x + this.l - this.o - 20, yLevel + this.o * 2, 20, this.w - this.o * 4, 10);




    } else {
      rect(this.x + this.o, yLevel + this.o, this.l - this.o * 2, this.w - this.o * 2);
    }

  }
}

function preload() {
  carImagesRight[0] = loadImage("Car1Right.png");
  carImagesLeft[0] = loadImage("Car1Left.png");

  soundFormats('mp3', 'ogg', 'wav');
  gameOverSound = loadSound('gameover.mp3');
  jumpSound = loadSound('jump.wav');
  selectSound = loadSound('select.mp3');
  logSound = loadSound("log.mp3");
  lilypadSound = loadSound("lilypad.mp3");

}//end preloading of images

function setup() {
  let sketch = createCanvas(400, 600);
  sketch.parent("mycanvas");

  resetGame("normal", true);
  karmatic = loadFont("karmatic-arcade.ttf");

}//end setup

function draw() {

  if (gameState == "normal" || gameState == "developer") {
    //print("loop started"); 
    deathMessage = "";
    for (let i = ls; i < (ls + rows); i++) {
      if (terrain[i] === "G") {
        if (grassCounts[i] % 2 == 0) {
          fill(96, 156, 6);
        } else {
          fill(0, 153, 51);
        }
      } else if (terrain[i] === "R") {
        fill(125);
      } else if (terrain[i] == "W") {
        fill(156, 211, 219);
      } else if (terrain[i] == "T") {
        fill(196, 164, 132);
      }

      let yLevel = sLength - pWidth * (i - ls + 1)
      rect(0, yLevel, sWidth, pWidth);

      if (terrain[i] == "T") {
        strokeWeight(3);
        stroke(92, 64, 51);

        for (let x = 0; x < sWidth; x += 30) {
          line(x, yLevel + 10, x, yLevel + 40);
        }

        strokeWeight(5);
        stroke(120);

        line(-10, yLevel + 10, sWidth + 10, yLevel + 10);
        line(-10, yLevel + 40, sWidth + 10, yLevel + 40);
        noStroke();


      }

      for (let x = 0; x < obstacles[i].length; x++) {

        let curObj = obstacles[i][x];

        if (terrain[i] != "G") {

          if ((curObj.x > sWidth + 200 && directions[i] == 1) || (curObj.x + curObj.l < -200 && directions[i] == -1)) {
            obstacles[i].splice(x, 1);
          }

          curObj.display(i);
        } else {

          if (curObj == "b") {
            displayObject(10, 80, 80, 80, boxes[x], yLevel, 5);
          } else if (curObj == "t") {
            displayObject(10, 2, 48, 32, boxes[x], yLevel, 5);
          }


        }

      }

    }

    //fill(7, 95, 237);
    displayPlayer();

    if (pOffset < 10) {
      pOffset++;
    }

    textSize(30);

    for (let i = 0; i < terrain.length; i++) {
      if (terrain[i] == "R") {
        let condition = false;

        if (obstacles[i].length == 0) {
          if (floor(random(100)) < 1) {
            condition = true;
          }
        } else if (floor(random(100)) < 1 && directions[i] == 1 && obstacles[i][obstacles[i].length - 1].x > 150) {
          condition = true;
        } else if (floor(random(100)) < 1 && directions[i] == -1 && obstacles[i][obstacles[i].length - 1].x < sWidth - 200) {
          condition = true;
        }

        if (condition) {
          let car;
          if (directions[i] == 1) {
            car = new Obstacle(-150, pWidth, 110, speeds[i], floor(random(150)), floor(random(150)), floor(random(150)), carOffset)
          } else {
            car = new Obstacle(sWidth + 150, pWidth, 110, speeds[i], floor(random(150)), floor(random(150)), floor(random(150)), carOffset);
          }
          obstacles[i].push(car);
        }

      } else if (terrain[i] == "W") {
        let condition = false;

        if (obstacles[i].length == 0) {
          if (floor(random(50)) < 1) {
            condition = true;
          }
        } else if (floor(random(50)) < 1 && directions[i] == 1 && obstacles[i][obstacles[i].length - 1].x > 150) {
          condition = true;
        } else if (floor(random(50)) < 1 && directions[i] == -1 && obstacles[i][obstacles[i].length - 1].x < sWidth - 200) {
          condition = true;
        }

        if (condition) {
          let log;
          if (directions[i] == 1) {
            log = new Obstacle(-300, pWidth, random([100, 150, 200]), speeds[i], 125, 74, 22, logOffset);
          } else if (directions[i] == -1) {
            log = new Obstacle(sWidth + 150, pWidth, random([100, 150, 200]), speeds[i], 125, 74, 22, logOffset);
          }

          obstacles[i].push(log);
        }

      } else if (terrain[i] == "T") {
        if (floor(random(700)) < 1 && obstacles[i].length == 0 || trainsLightOn[i]) {
          let train;
          let trainX;
          trainsLightOn[i] = true;

          if (curFrames <= targetFrames) {
            curFrames++;
            fill(255, 0, 0);

            if (directions[i] == 1) {
              circle(pWidth / 2, sLength - pWidth * (i - ls + 1) + pWidth / 2, 15);

            } else {
              circle(sWidth - pWidth / 2, sLength - pWidth * (i - ls + 1) + pWidth / 2, 15);
            }

            continue;
          } else {
            trainsLightOn[i] = false;
            curFrames = 0;

            if (directions[i] == 1) {
              trainX = -800;

            } else {
              trainX = sWidth;
            }

          }

          train = new Obstacle(trainX, pWidth, 800, 10, 211, 211, 211, trainOffset);
          obstacles[i].push(train);

        }
      }
    }

    for (let i = 0; i < terrain.length; i++) {
      let prevGameState = gameState;

      if (i == ls + 3 && terrain[i] == "W" && obstacles[i].length == 0) {
        gameState = "end" + gameState[0];
        deathMessage = "Death By Drowning";
        break;
      }

      if (i == ls + 3 && terrain[i] == "W") {
        gameState = "end" + gameState[0];
      }

      for (let x = 0; x < obstacles[i].length; x++) {
        let cur = obstacles[i][x];
        let dir = directions[i];

        if (terrain[i] == "R" || terrain[i] == "T") {
          cur.move(dir, false);
          if (i == ls + 3 && cur.checkCollision(pX, pWidth)) {
            gameState = "end" + gameState[0];
            if (terrain[i] == "T") {
              deathMessage = "Got Hit by a Train";
            } else {
              deathMessage = "Got Hit by a Car";
            }
            cur.display(i);
            break;
          }
        } else if (terrain[i] == "W") {
          if (i == ls + 3) {
            if (cur.checkCollision(pX, pWidth)) {
              let found = false;

              cur.move(dir, true);

              for (let z = cur.x; z < cur.x + cur.l; z += 50) {

                if (pX + pWidth / 2 >= z && pX + pWidth / 2 <= z + 50) {
                  pX = z;
                  found = true;
                  break;
                }

              }

              if (!found) {
                if (pX < cur.x) {
                  pX = cur.x;
                } else {
                  pX = cur.x + cur.l - 50;
                }
              }

              if (pX + pWidth < 0 || pX > sWidth) {
                gameState = "end" + prevGameState[0];
                deathMessage = "Rode Log too Long";
                break;
              } else {

                if (cur.o == logOffset && prevLs != ls) {
                  cur.o = 17;
                } else if (cur.o > logOffset) {
                  cur.o--;
                }

                gameState = prevGameState;

                prevO = cur.o;


              }

              continue;
            }
          }

          //print(directions[i], cur); 
          cur.move(dir, false);

        }
      }

      if (terrain[i] != "W" && i == ls + 3) {
        pX = determineX(pX);
      }

      if (deathMessage == "") {
        deathMessage = "Death By Drowning";
      }
    }

    fill(0);
    textSize(30);
    textFont(karmatic);
    stroke(255);
    strokeWeight(7);
    text(score, 20, 30);
    textFont("arial");
    noStroke();

    prevLs = ls;

  } else if (gameState == "endd" || gameState == "endn") {

    if (cFrames2 == 0) {
      gameOverSound.play();
    }

    if (cFrames2 < targetFrames) {
      cFrames2++;
      pOffset++;

      pOffset = min(pOffset, pWidth / 2);

      if (terrain[ls + 3] === "G") {
        fill(96, 156, 6);
      } else if (terrain[ls + 3] === "R") {
        fill(125);
      } else if (terrain[ls + 3] == "W") {
        fill(156, 211, 219);
      } else if (terrain[ls + 3] == "T") {
        fill(196, 164, 132);
      }

      rect(pX, 400, 50, 50);

      let yLevel = sLength - 200;

      if (terrain[ls + 3] == "T") {
        strokeWeight(3);
        stroke(92, 64, 51);

        for (let x = 0; x < sWidth; x += 30) {
          line(x, yLevel + 10, x, yLevel + 40);
        }

        strokeWeight(5);
        stroke(120);

        line(-10, yLevel + 10, sWidth + 10, yLevel + 10);
        line(-10, yLevel + 40, sWidth + 10, yLevel + 40);
        noStroke();

      }

      for (let i = 0; i < obstacles[ls + 3].length; i++) {
        let ob = obstacles[ls + 3][i];

        ob.display(ls + 3);
      }

      displayPlayer();

    } else {
      pOffset = 10;
      endMenu(gameState);
    }

  } else if (gameState == "main") {
    mainMenu();
  } else if (gameState == "guide") {
    guide();
  }

}//end draw

function keyPressed() {
  if (gameState == "normal" || gameState == "developer") {
    jumpSound.play();
    if (keyCode === LEFT_ARROW || key === "a") {
      pOrient = "l";
      if (directions[ls + 3] == 0 && terrain[ls + 3] == "W") {
        prevLs--;
        lilypadSound.play();
      }
      pOffset = 5;

      if (pX > 0 && obstacles[ls + 3][(pX - 50) / 50] != "b" && obstacles[ls + 3][(pX - 50) / 50] != "t") {
        pX -= pWidth;
      }

    }

    if (keyCode === RIGHT_ARROW || key === "d") {
      pOrient = "r";
      if (directions[ls + 3] == 0 && terrain[ls + 3] == "W") {
        prevLs--;
        lilypadSound.play();
      }
      pOffset = 5;
      if (pX < sWidth - 50 && obstacles[ls + 3][(pX + 50) / 50] != "b" && obstacles[ls + 3][(pX + 50) / 50] != "t") {
        pX += pWidth;

      }

    }

    if (keyCode === UP_ARROW || key === "w") {
      pOrient = "u";
      let pXtemp = determineX(pX);

      if (obstacles[ls + 4][pXtemp / 50] != "b" && obstacles[ls + 4][pXtemp / 50] != "t") {
        ls++;

        if (tilesBack == 0) {
          score++;
        } else {
          tilesBack--;
        }

        if (terrain[ls + 3] == "W") {
          lilypadSound.play();
          if (directions[ls + 3] != 0) {
            logSound.play();
          }
        }

        terrain.push(random(terrainTypes));

        if (terrain[terrain.length - 1] == "G") {
          grassCounts[terrain.length - 1] = gCount;
          gCount++;
        }

        if (terrain[terrain.length - 1] == "W" && terrain.length != 1) {
          if (directions[terrain.length - 2] != 0) {
            directions.push(random([1, -1, 0]));
          } else {
            directions.push(random([1, -1]));
          }

        } else if (terrain[terrain.length - 1] == "G") {
          directions.push(0);
        } else {
          directions.push(random([1, -1]));
        }

        /*
        if (directions[terrain.length - 1] == 0 && terrain[terrain.length - 1] == "W") {
          while (obstacles[obstacles.length - 1].length == 0) {
            for (let i = 0; i < boxes.length; i++) {
              if (random([0, 1, 2]) == 0) {
                let lily = new Obstacle(boxes[i], pWidth, 50, 0, 1, 50, 32, lilyOffset);
                obstacles[obstacles.length - 1].push(lily);
              }
            }
          }
        }

        */

        while (true) {
          
          if (directions[terrain.length - 1] == 0 && terrain[terrain.length - 1] == "W") {
            obstacles[obstacles.length - 1] = []; 
            while (obstacles[obstacles.length - 1].length == 0) {
              for (let i = 0; i < boxes.length; i++) {
                if (random([0, 1, 2]) == 0) {
                  let lily = new Obstacle(boxes[i], pWidth, 50, 0, 1, 50, 32, lilyOffset);
                  obstacles[obstacles.length - 1].push(lily);
                }
              }
            }
          }
          
          if (directions[terrain.length - 1] == 0 && terrain[terrain.length - 1] == "G") {
            for (let x = 0; x < boxes.length; x++) {
              obstacles[obstacles.length - 1][x] = " ";
              if (random([0, 1, 2, 3]) == 0) {
                obstacles[obstacles.length - 1][x] = "b";
              } else if (random([0, 1, 2, 3]) == 0) {
                obstacles[obstacles.length - 1][x] = "t";
              }
            }
          }

          if (checkPath(obstacles.length - 1)) {
            break;
          }
        }

        obstacles.push([]);

        speeds.push(floor(random(1, 4)));

        trainsLightOn.push(false);

      }

      pOffset = 5;

    }

    if (keyCode === DOWN_ARROW || key === "s") {
      pOrient = "d";
      pOffset = 5;
      let pXtemp = determineX(pX);

      if (ls > 0 && obstacles[ls + 2][pXtemp / 50] != "b" && obstacles[ls + 2][pXtemp / 50] != "t") {
        ls--;
        tilesBack++;

        if (terrain[ls + 3] == "W") {
          lilypadSound.play();
          if (directions[ls + 3] != 0) {
            logSound.play();
          }

        }

      }

    }
  } else if (gameState == "endn") {

    if (keyCode === UP_ARROW || key === "w") {
      if (index > 0) {
        index--;
      }
    }

    if (keyCode === DOWN_ARROW || key === "s") {
      if (index < 1) {
        index++;
      }
    }

    if (keyCode === ENTER) {
      selectSound.play();
      if (index == 0) {
        resetGame("normal", false);

      } else {
        resetGame("main", false);
      }

    }
  } else if (gameState == "endd") {

    if (keyCode === UP_ARROW || key === "w") {
      if (index > 0) {
        index--;
      }
    }

    if (keyCode === DOWN_ARROW || key === "s") {
      if (index < 2) {
        index++;
      }
    }

    if (keyCode === ENTER) {
      selectSound.play();
      if (index == 0) {
        resetGame("normal", false);
      } else if (index == 1) {
        resetGame("developer", false);
      } else {
        resetGame("main", false);
      }

    }
  } else if (gameState == "main") {
    if (keyCode === UP_ARROW || key === "w") {
      if (index > 0) {
        index--;
      }
    }

    if (keyCode === DOWN_ARROW || key === "s") {
      if (index < 2) {
        index++;
      }
    }

    if (keyCode === ENTER) {
      selectSound.play();
      if (index == 0) {
        //print("selected"); 
        resetGame("normal", false);
      } else if (index == 1) {
        resetGame("developer", false);
      } else {
        resetGame("guide", false);
      }
    }
  } else if (gameState == "guide") {
    if (keyCode === ENTER) {
      selectSound.play();
      resetGame("main", false);
    }
  }

}

function endMenu(mode) {
  textSize(30);
  rectMode(CENTER);
  background(173, 216, 230);
  textAlign(CENTER);
  stroke(0);
  strokeWeight(3);

  stroke(255);
  strokeWeight(5);
  fill(0);
  textFont(karmatic);
  text("GAME OVER", 200, 50);
  textSize(25);
  text(deathMessage, 200, 100);
  text("Score", 200, 150);
  text(score, 200, 200);
  textFont("arial");
  strokeWeight(3);
  textSize(30); 

  items = ["Restart", "Main Menu"];

  if (mode == "endd") {
    items = ["Restart", "Continue", "Main Menu"];
  }

  displayItems(items, 300);

  stroke(0);
  line(50, 275 + (index * 100), 50, 325 + (index * 100));

  fill(255);

}

function mainMenu() {

  textSize(30);

  rectMode(CENTER);
  background(173, 216, 230);
  textAlign(CENTER);
  stroke(255);
  strokeWeight(5);
  fill(0);
  textFont(karmatic);
  text("2D CROSSY ROAD", 200, 100);
  textSize(15); 
  text("W S or Up Down to navigate", 200, 500);
  text("Press ENTER to select", 200, 550);
  textFont("arial");
  strokeWeight(3);
  textSize(30); 

  let items = ["Normal Mode", "Developer Mode", "Instructions"];

  displayItems(items, 200);

  stroke(0);
  line(50, 175 + (index * 100), 50, 225 + (index * 100));

  textSize(20);
  noStroke();


  fill(255);

}

function displayItems(items, startY) {
  textFont(karmatic); 
  textSize(20); 
  for (let i = 0; i < items.length; i++) {
    stroke(0);
    fill(255);
    rect(200, startY + (i * 100), 250, 50);
    fill(0);
    noStroke();
    text(items[i], 200, startY + 10 + (i * 100));
  }

}

function guide() {

  rectMode(CENTER);
  textSize(30);
  background(173, 216, 230);
  textAlign(CENTER);
  stroke(255);
  strokeWeight(5);
  fill(0);
  textFont(karmatic);
  text("Guide", 200, 50);
  textSize(15); 
  strokeWeight(3);
  textSize(30); 
  //textFont("arial");

  items = ["Back"];

  displayItems(items, 525);

  textFont(karmatic); 

  stroke(0);
  line(50, 500, 50, 550);

  noStroke();
  textAlign(CENTER);
  textSize(20);
  fill(255);
  rectMode(CENTER);
  stroke(0);
  rect(200, 90, 350, 40);
  rect(200, 190, 350, 40);
  noStroke();
  fill(0);
  
  text("Controls", 200, 100);
  text("Obstacles", 200, 200);
  textFont("arial");



  noFill();
  rect(200, 100, 100, 50);

  fill(0);
  textSize(20);
  text("WASD + Arrow Keys", 200, 150);

  text("Avoid jumping in water", 200, 250);
  text("Jump on lilypads and logs instead", 200, 300);
  text("Avoid getting hit by cars", 200, 350);
  text("Avoid getting hit by trains", 200, 400);
  text("Boulders and trees occupy spaces", 200, 450);

  noFill();
  rectMode(CENTER);
  stroke(0);
  rect(200, 140, 350, 50);

  rect(200, 240, 350, 50);
  rect(200, 290, 350, 50);
  rect(200, 340, 350, 50);
  rect(200, 390, 350, 50);
  rect(200, 440, 350, 50);

  textAlign(CENTER);

  fill(255);

}

function resetGame(state, initial) {

  cFrames2 = 0;
  pOrient = "u";

  if (state == "developer") {

    for (let i = ls; i >= 0; i--) {
      if (terrain[i + 3] == "G") {
        ls = i;

        for (let x = 0; x < boxes.length; x++) {
          if (obstacles[i + 3][x] == " ") {
            pX = x * 50;
            break;
          }
        }
        break;
      }
      score--;

    }
  } else {

    gCount = 0;
    score = 0;
    tilesBack = 0;

    pX = 50;

    terrain = [];
    obstacles = [[]];
    directions = [];
    speeds = [];
    index = 0;

    ls = 0;
    gCount = 0;

    for (let i = 0; i < 20; i++) {
      if (i == 3) { //spawn
        terrain.push("G");
        grassCounts[i] = gCount;
        gCount++;
      } else {

        terrain.push(random(terrainTypes));

        if (terrain[i] == "G") {
          grassCounts[i] = gCount;
          gCount++;
        }
      }

      if (terrain[i] == "W" && i != 0) {
        if (directions[i - 1] != 0) {
          directions.push(random([1, -1, 0]));
        } else {
          directions.push(random([1, -1]));
        }
      } else if (terrain[i] == "G") {
        directions.push(0);
      } else {
        directions.push(random([1, -1]));
      }

      while (true) {

        if (directions[i] == 0 && terrain[i] == "W") {
          obstacles[i] = []; 
          while (obstacles[i].length == 0) {
            for (let x = 0; x < boxes.length; x++) {
              if (random([0, 1, 2]) == 0) {
                let lily = new Obstacle(boxes[x], pWidth, 50, 0, 1, 50, 32, lilyOffset);
                obstacles[i].push(lily);
              }
            }
          }
        }
        
        if (directions[i] == 0 && terrain[i] == "G") {
          for (let x = 0; x < boxes.length; x++) {
            obstacles[i][x] = " ";
            if (random([0, 1, 2, 3]) == 0 && (x != 1 && i != 3)) {
              obstacles[i][x] = "b";
            } else if (random([0, 1, 2, 3]) == 0 && (x != 1 && i != 3)) {
              obstacles[i][x] = "t";
            }
          }
        }

        if (checkPath(i)) {
          break;
        }
      }


      obstacles.push([]);

      speeds.push(floor(random(1, 4)));

      trainsLightOn.push(false);

    }
  }

  if (gameState == "endd" && state == "normal") {
    gameState = "developer";
  } else if (!initial) {
    gameState = state;
  }

  rectMode(CORNER);
  textAlign(LEFT);
}

function displayPlayer() {

  fill(255);
  rect(pX + pOffset, pY + pOffset, pWidth - pOffset * 2, pWidth - pOffset * 2, 10);
  if (pOffset < 11) {

    fill(204, 51, 0);
    if (pOrient == "u" || pOrient == "d") {
      //rect(pX + pOffset*2, pY + pOffset*1.5, pWidth - pOffset*4, pWidth - pOffset*3, 10); 
      rect(pX + 20, pY + 15, pWidth - 40, pWidth - 30, 10);
    } else {
      //rect(pX + pOffset*1.5, pY + pOffset*2, pWidth - pOffset*3, pWidth - pOffset*4, 10);
      rect(pX + 15, pY + 20, pWidth - 30, pWidth - 40, 10);

    }

    fill(255, 153, 0);
    if (pOrient == "u") {
      triangle(pX + pOffset * 2, pY + pOffset, pX + pWidth / 2, pY + pOffset / 2, pX + pWidth - pOffset * 2, pY + pOffset);
    } else if (pOrient == "d") {
      triangle(pX + pOffset * 2, pY + pWidth - pOffset, pX + pWidth / 2, pY + pWidth - pOffset / 2, pX + pWidth - pOffset * 2, pY + pWidth - pOffset);
    } else if (pOrient == "l") {
      triangle(pX + pOffset, pY + pOffset * 2, pX + pOffset / 2, pY + pWidth / 2, pX + pOffset, pY + pWidth - pOffset * 2);
    } else {
      triangle(pX + pWidth - pOffset, pY + pOffset * 2, pX + pWidth - pOffset / 2, pY + pWidth / 2, pX + pWidth - pOffset, pY + pWidth - pOffset * 2);
    }

  }

}

function displayObject(offset, r, g, b, x, y, curve) {
  fill(r, g, b);
  rect(x + offset, y + offset, pWidth - offset * 2, pWidth - offset * 2, curve);
}

function determineX(x) {
  let found = false;

  for (let z = 0; z < sWidth; z += 50) {

    if (x + pWidth / 2 >= z && x + pWidth / 2 <= z + 50) {
      x = z;
      found = true;
      break;
    }
  }

  if (!found) {
    if (x < 0) {
      x = 0
    } else {
      x = sWidth - 50;
    }

  }

  return x;
}

function checkPath(index) {

  // terrain[index-1] == "G" && terrain[index] == "G" 
  if (terrain[index] == "G") {
    let count = 0;

    for (let i = 0; i < boxes.length; i++) {
      if (obstacles[index][i] == " ") {
        count++;
      }
    }

    if (count == 0) {
      return false;
    }
  }

  //return true;


  for (let i = 0; i < boxes.length; i++) {
    let ind = index;
    let pathFound = true;
    while (terrain[ind - 1] == "G" || terrain[ind - 1] == "W") {
      if (terrain[ind - 1] == "G" && terrain[ind] == "G") {
        if (obstacles[ind][i] != " " || obstacles[ind - 1][i] != " ") {
          pathFound = false;
        }
      } else if (terrain[ind - 1] == "W" && directions[ind - 1] == 0 && terrain[ind] == "G") { // lilypads
        let oArr = ["x", "x", "x", "x", "x", "x", "x", "x"];

        for (let x = 0; x < obstacles[ind - 1].length; x++) {
          let lilypad = obstacles[ind - 1][x];
          oArr[lilypad.x / 50] = " ";
        }

        if (obstacles[ind][i] != " " || oArr[i] != " ") {
          pathFound = false;
        }

      } else if (terrain[ind - 1] == "G" && directions[ind] == 0 && terrain[ind] == "W") { // lilypads
        let oArr = ["x", "x", "x", "x", "x", "x", "x", "x"];

        for (let x = 0; x < obstacles[ind].length; x++) {
          let lilypad = obstacles[ind][x];
          oArr[lilypad.x / 50] = " ";
        }

        if (obstacles[ind - 1][i] != " " || oArr[i] != " ") {
          pathFound = false;
        }
      }
      

      ind--;
    }

    if (pathFound) {
      return true;
    }
  }

  return false;

}
