const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20; 
const fruitScale = 1.5;
const snakeScale = fruitScale * 1.7; 

let snake = [{ x: 5 * box, y: 5 * box }];
let direction = "RIGHT";
let score = 0;

// Prevent page from scrolling when using arrow keys 
window.addEventListener("keydown", function (e) {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
  }
});

// Control the snake 
document.addEventListener("keydown", directionControl);

function directionControl(event) {
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

// Fruit setup 
const fruitImages = [
  "images/apple.png",
  "images/strawberry.png",
  "images/orange.png",
  "images/blueberry.png",
  "images/dragonfruit.png",
  "images/kiwi.png",
  "images/fig.png",
  "images/grapefruit.png",
  "images/guava.png",
  "images/melon.png",
  "images/starfruit.png",
  "images/passionfruit.png",
  "images/papaya.png",
  "images/peach.png",
  "images/tomato.png"
];

const snakeImg = new Image();
snakeImg.src = "images/snake.png";

let fruitImg = new Image();
fruitImg.src = fruitImages[Math.floor(Math.random() * fruitImages.length)];

let fruit = spawnFruit();

function spawnFruit() {
  const gridWidth = canvas.width / box;
  const gridHeight = canvas.height / box;

  return {
    x: Math.floor(Math.random() * (gridWidth - 2) + 1) * box,
    y: Math.floor(Math.random() * (gridHeight - 2) + 1) * box,
  };
}

// Collision detection 
function fruitEaten(snakeX, snakeY, fruitX, fruitY) {
  const fruitSize = box * fruitScale;
  const snakeSize = box * snakeScale;
  const fruitCenterX = fruitX + box / 2;
  const fruitCenterY = fruitY + box / 2;
  const snakeCenterX = snakeX + box / 2;
  const snakeCenterY = snakeY + box / 2;

  const distance = Math.hypot(fruitCenterX - snakeCenterX, fruitCenterY - snakeCenterY);
  return distance < (snakeSize / 2 + fruitSize / 4);
}

function collision(head, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (head.x === arr[i].x && head.y === arr[i].y) return true;
  }
  return false;
}

// Main game loop 
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw fruit
  const fruitSize = box * fruitScale;
  ctx.drawImage(fruitImg, fruit.x, fruit.y, fruitSize, fruitSize);

  // Draw snake
  const snakeSize = box * snakeScale;
  for (let i = 0; i < snake.length; i++) {
    ctx.drawImage(snakeImg, snake[i].x, snake[i].y, snakeSize, snakeSize);
  }

  // Move snake
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  // Check if fruit is eaten
  if (fruitEaten(snakeX, snakeY, fruit.x, fruit.y)) {
    score++;
    fruit = spawnFruit();
    fruitImg.src = fruitImages[Math.floor(Math.random() * fruitImages.length)];
  } else {
    snake.pop();
  }

  const newHead = { x: snakeX, y: snakeY };

  // Game Over 
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    showGameOver();
    return; // stop further drawing
  }

  snake.unshift(newHead);

  // Display score
  ctx.fillStyle = "#333";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, canvas.height - 10);
}

// Game over display
function showGameOver() {
  const gameOverBox = document.getElementById("gameOver");

  // Cloud image popup with text layered on top
  gameOverBox.innerHTML = `
    <img id="playAgainBtn" src="images/cloud.png" alt="Play Again" />
    <p class="title">Game Over</p>
    <p class="score">Score: ${score}</p>
  `;

  gameOverBox.style.display = "block";

  // Make the cloud image clickable to restart
  document.getElementById("playAgainBtn").addEventListener("click", resetGame);
}



// Reset game 
function resetGame() {
  snake = [{ x: 5 * box, y: 5 * box }];
  direction = "RIGHT";
  score = 0;
  fruit = spawnFruit();
  fruitImg.src = fruitImages[Math.floor(Math.random() * fruitImages.length)];

  document.getElementById("gameOver").style.display = "none";

  clearInterval(game);
  game = setInterval(draw, 120);
}

// Run the game
let game = setInterval(draw, 120);

const songs = [
  "music/song1.mp3",
  "music/song2.mp3"
];

let currentSong = 0;
let isPlaying = false;
const audio = new Audio(songs[currentSong]);

// Play / Pause
document.getElementById("btn-play").addEventListener("click", () => {
  if (isPlaying) {
    audio.pause();
  } else {
    audio.play();
  }
  isPlaying = !isPlaying;
});

// Next track
document.getElementById("btn-next").addEventListener("click", () => {
  currentSong = (currentSong + 1) % songs.length;
  audio.src = songs[currentSong];
  audio.play();
  isPlaying = true;
});

// Previous track
document.getElementById("btn-prev").addEventListener("click", () => {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  audio.src = songs[currentSong];
  audio.play();
  isPlaying = true;
});

// Optional: when song ends, go to next automatically
audio.addEventListener("ended", () => {
  currentSong = (currentSong + 1) % songs.length;
  audio.src = songs[currentSong];
  audio.play();
});

audio.addEventListener("play", () => {
  document.getElementById("ipod").classList.add("playing");
});
audio.addEventListener("pause", () => {
  document.getElementById("ipod").classList.remove("playing");
});



