/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 1000);

const numverOfEnemies = 20;
const enemiesArray = [];

const enemyImage = new Image();
enemyImage.src = "enemies/enemy1.png";

let gameFrame = 0;

class Enemy {
  constructor() {
    this.image = new Image();
    this.image.src = "enemies/enemy2.png";
    this.speed = Math.random() * 4 + 1;
    this.spriteWidth = 266;
    this.spriteHeight = 188;
    this.width = this.spriteWidth / 2.5; // 나눠주어서 enemy 크기 조절
    this.height = this.spriteHeight / 2.5;
    this.x = Math.random() * (canvas.width - this.width); // enemy가 내부에만 들어오도록(경계에 걸치지 않게) this.width빼줌
    this.y = Math.random() * (canvas.height - this.height);
    this.frame = 0;
    this.flapSpeed = Math.floor(Math.random() * 3 + 1);
    this.angle = Math.random() * 2;
    this.angleSpeed = Math.random() * 0.2; // 0~1사이. 클수록 웨이브 순환(?)간격 짧아짐
    this.curve = Math.random() * 3; // -3 ~ +3, 높을수록 웨이브 깊어짐. 게임 난이도 올라감
  }
  update() {
    this.x -= this.speed;
    this.y += Math.sin(this.angle) * this.curve;
    this.angle += this.angleSpeed;

    // 왼쪽으로 완전 없어지면 오른쪽에 다시 나타남
    if (this.x + this.width < 0) {
      this.x = canvas.width;
    }
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
