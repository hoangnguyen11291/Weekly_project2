const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.getElementById("canvas").appendChild(canvas);

let background = {};

// set up character

let hero = { x: canvas.width / 2, y: canvas.height / 2, size: 32 }; // hero position x,y

let monsters = [
  { x: 100, y: 100 }, //monster 1 position x,y
  { x: 200, y: 200 }, //monster 2 position x,y
  { x: 300, y: 300 }, //monster 3 position x,y
];
let startTime = Date.now(); // Record the starting time
const SECONDS_PER_ROUND = 10; // set limit of how long a round SHOULD run
let elapsedTime = 0; // keep track of how long game is run
let keysPressed = {}; //keep track of what key is pressing !!!!!
let score = 0;

let name= document.getElementById("playerName").value;


//END of declaration

function loadImages() {
  background.image = new Image();

  background.image.onload = function () {
    // show the background image
    background.ready = true;
  };

  background.image.src = "images/joe-woods-4Zaq5xY5M_c-unsplash.png";

  hero.image = new Image();
  hero.image.onload = function () {
    hero.ready = true;
  };
  hero.image.src = "images/hero.png";

  for (let index = 0; index < monsters.length; index++) {
    const monster = monsters[index];
    monster.image = new Image();
    monster.image.onload = function () {
      monster.ready = true;
    };
    monster.image.src = `images/monster_${index + 1}.png`;
  }
}

/**
 * Keyboard Listeners
 * You can safely ignore this part, for now.
 *
 * This is just to let JavaScript know when the user has pressed a key.
 */

function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here.
  document.addEventListener(
    "keydown",
    function (e) {
      keysPressed[e.key] = true;
    },
    false
  );

  document.addEventListener(
    "keyup",
    function (e) {
      keysPressed[e.key] = false;
    },
    false
  );
}



/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *
 *  If you change the value of 5, the player will move at a different rate.
 */
let isGameover= false;
let update = function () {
    if (isGameover){
        return
    }
    if (elapsedTime>=10){
        isGameover=true;
        return
    }

  // Update the time.
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);

  if (keysPressed["ArrowUp"]) {
    hero.y -= 5;
  }
  if (keysPressed["ArrowDown"]) {
    hero.y += 5;
  }
  if (keysPressed["ArrowLeft"]) {
    hero.x -= 5;
  }
  if (keysPressed["ArrowRight"]) {
    hero.x += 5;
  }

// Collision

  for (let index = 0; index < monsters.length; index++) {
    let singleMonster = monsters[index];
    if (
      hero.x <= singleMonster.x + hero.size &&
      singleMonster.x <= hero.x + hero.size &&
      hero.y <= singleMonster.y + hero.size &&
      singleMonster.y <= hero.y + hero.size
    ) {
      // Pick a new location for the singleMonster.
      // Note: Change this to place the singleMonster at a new, random location.
      score += 1;
      singleMonster.x = Math.floor(Math.random() * (canvas.width-32));
      singleMonster.y = Math.floor(Math.random() * (canvas.height -32));
    }
  }

  //top and bottom collision detection //left and right collision detection
  if (hero.y > canvas.height - hero.size) {
    hero.y = 0;
  } else if (hero.y <= 0) {
    hero.y = canvas.height - hero.size;
  }
  if (hero.x > canvas.width - hero.size) {
    hero.x = 0;
  } else if (hero.x <= 0) {
    hero.x = canvas.width - hero.size;
  }

    
};


/**
 * This function, render, runs as often as possible.
 */
function render() {
  document.getElementById("score").innerHTML = `Score: ${score}`;
  document.getElementById('playerName').value = document.getElementById("inputName").value;
  if (background.ready) {
    ctx.drawImage(background.image, 0, 0);
  }
  if (hero.ready) {
    ctx.drawImage(hero.image, hero.x, hero.y);
  }
  monsters.forEach((monster) => {
    if (monster.ready) {
      ctx.drawImage(monster.image, monster.x, monster.y);
    }
  });
  ctx.fillText(
    `Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`,
    20,
    100
  );
}

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
function main() {
  update();
  render();

  // Request to do this again ASAP. This is a special method
  // for web browsers.
  requestAnimationFrame(main); // keep the browser update IF THERE IS ANIMATION
}

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
// enable the function (to keep the browser update IF THERE IS ANIMATION)
var w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
setupKeyboardListeners();
main();