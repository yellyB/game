/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 1000);

const numverOfEnemies = 100;
const enemiesArray = [];

const enemyImage = new Image();
enemyImage.src = "enemies/enemy1.png";

let gameFrame = 0;

class Enemy {
  constructor() {
    this.image = new Image();
    this.image.src = "enemies/enemy1.png";
    // this.speed = Math.random() * 4 - 2; // -2 ~ 2까지의 숫자 얻게 됨
    this.spriteWidth = 293;
    this.spriteHeight = 155;
    this.width = this.spriteWidth / 2.5; // 나눠주어서 enemy 크기 조절
    this.height = this.spriteHeight / 2.5;
    this.x = Math.random() * (canvas.width - this.width); // enemy가 내부에만 들어오도록(경계에 걸치지 않게) this.width빼줌
    this.y = Math.random() * (canvas.height - this.height);
    this.frame = 0;
    this.flapSpeed = Math.floor(Math.random() * 3 + 1);
  }
  update() {
    this.x += Math.random() * 6 - 3;
    this.y += Math.random() * 6 - 3;
    if (gameFrame % this.flapSpeed === 0) {
      // 랜덤한 날개짓 속도
      this.frame > 4 ? (this.frame = 0) : this.frame++; // 5개의 이미지를 루프
    }
  }
  draw() {
    ctx.drawImage(
      this.image,
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

  gameFrame++;
  requestAnimationFrame(animate);
}
animate();
