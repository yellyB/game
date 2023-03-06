/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 1000);

const numverOfEnemies = 100;
const enemiesArray = [];

const enemyImage = new Image();
enemyImage.src = "enemies/enemy1.png";

class Enemy {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.speed = Math.random() * 4 - 2; // -2 ~ 2까지의 숫자 얻게 됨
    this.spriteWidth = 293;
    this.spriteHeight = 155;
    this.width = this.spriteWidth / 2.5;
    this.height = this.spriteHeight / 2.5;
    this.frame = 0;
  }
  update() {
    this.x += this.speed;
    this.y += this.speed;
    this.frame > 4 ? (this.frame = 0) : this.frame++; // 5개의 이미지를 루프
  }
  draw() {
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      enemyImage,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

const enemy1 = new Enemy();
const enemy2 = new Enemy();

for (let i = 0; i < numverOfEnemies; i++) {
  enemiesArray.push(new Enemy());
}

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  enemiesArray.forEach((enemy) => {
    enemy.update();
    enemy.draw();
  });

  requestAnimationFrame(animate);
}
animate();
