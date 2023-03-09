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
    this.image.src = "enemies/enemy3.png";
    this.speed = Math.random() * 4 + 1;
    this.spriteWidth = 218;
    this.spriteHeight = 177;
    this.width = this.spriteWidth / 2.5; // 나눠주어서 enemy 크기 조절
    this.height = this.spriteHeight / 2.5;
    this.x = Math.random() * (canvas.width - this.width); // enemy가 내부에만 들어오도록(경계에 걸치지 않게) this.width빼줌
    this.y = Math.random() * (canvas.height - this.height);
    this.frame = 0;
    this.flapSpeed = Math.floor(Math.random() * 3 + 1);
    this.angle = Math.random() * 2;
    this.angleSpeed = Math.random() * 2 + 0.5; // 멀면 더 빨리 돌도록 특정 값을 더해줌(가속)
    this.curve = Math.random() * 200 + 50; //  높을수록 이동 간격 넓어짐. 게임 난이도 올라감
  }
  update() {
    // x y 둘 다 cos 을 사용한다면 왔다갔다하는 움직임을 보일것임
    // x y 를 sin|cos 함수 내에서 같은 앵글 값으로 나눠주면 원으로 움직임
    this.x =
      this.curve * Math.sin((this.angle * Math.PI) / 90) +
      (canvas.width / 2 - this.width / 2); // 화면 내에서 좌우로 움직이도록
    this.y =
      this.curve * Math.cos((this.angle * Math.PI) / 270) +
      (canvas.height / 2 - this.height / 2); // 화면 내에서 상하로 움직이도록
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
