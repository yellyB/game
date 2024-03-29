import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from "./enemies.js";
import { UI } from "./UI.js";

let mode = "city";
const dropdown = document.getElementById("backgrounds");
dropdown.addEventListener("change", function (e) {
  mode = e.target.value;
});

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 900;
  canvas.height = 500;

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.groundMargin = 80;
      this.speed = 0;
      this.maxSpeed = 3;
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.enemies = [];
      this.particles = [];
      this.collisions = [];
      this.floatingMessages = [];
      this.maxParticles = 200;
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.debug = false;
      this.score = 0;
      this.winningScore = 40;
      this.fontColor = "black";
      this.time = 0;
      this.maxTime = 20000;
      this.gameOver = false;
      this.life = 5;
      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
      this.backgroundMode = "city";
      this.UI = new UI(this);
      this.background = new Background(this);
    }
    update(deltaTime) {
      this.time += deltaTime;
      if (this.time > this.maxTime) {
        this.gameOver = true;
      }
      this.background.update(mode);
      this.player.update(this.input.keys, deltaTime);

      // handle Enemies
      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
      this.enemies.forEach((enemy) => {
        enemy.update(deltaTime);
      });

      // handle messages
      this.floatingMessages.forEach((message) => {
        message.update();
      });

      // handle particles
      this.particles.forEach((particle, index) => {
        particle.update();
      });
      if (this.particles.length > this.maxParticles) {
        this.particles.length = this.maxParticles;
      }

      //handle collision sprites
      this.collisions.forEach((collision, index) => {
        collision.update(deltaTime);
      });

      // collision 시 적용 로직
      // ! 풀모양 enemy가 수평 오른쪽으로 약간씩 이동하는 버그
      // => 기존 splice 메서드는 enemy삭제 후 배열을 루프 돌 때 인덱스 계산을 다시 하는데, 이때 좌표가 조금씩 잘못 계산됨. filter로 교체. (다른 배열에도 동일하게 적용)
      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
      this.floatingMessages = this.floatingMessages.filter(
        (message) => !message.markedForDeletion
      );
      this.particles = this.particles.filter(
        (particle) => !particle.markedForDeletion
      );
      this.collisions = this.collisions.filter(
        (collision) => !collision.markedForDeletion
      );
    }
    draw(context) {
      this.background.draw(context);
      this.player.draw(context);
      this.enemies.forEach((enemy) => {
        enemy.draw(context);
      });
      this.floatingMessages.forEach((message) => {
        message.draw(context);
      });
      this.particles.forEach((particle) => {
        particle.draw(context);
      });
      this.collisions.forEach((collision) => {
        collision.draw(context);
      });
      this.UI.draw(context);
    }
    addEnemy() {
      if (this.speed > 0 && Math.random() < 0.5) {
        this.enemies.push(new GroundEnemy(this));
      } else if (this.speed > 0) {
        this.enemies.push(new ClimbingEnemy(this));
      }
      this.enemies.push(new FlyingEnemy(this));
    }
  }

  const game = new Game(canvas.width, canvas.height);

  let lastTime = 0;

  const animate = (timeStamp) => {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.draw(ctx, 0);
    game.update(deltaTime);

    if (!game.gameOver) requestAnimationFrame(animate);
  };
  animate(0);
});
