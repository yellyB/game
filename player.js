import {
  Sitting,
  Running,
  Jumping,
  Falling,
  Rolling,
  Diving,
  Hit,
} from "./playerState.js";
import { CollisionAnimation } from "./collisionAnimation.js";
import { FloatingMessages } from "./floatingMessages.js";

export class Player {
  constructor(game) {
    this.game = game;
    this.width = 100;
    this.height = 91.3;
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.vy = 0;
    this.weight = 0.5;
    this.image = document.getElementById("player");
    this.frameX = 0;
    this.frameY = 0;
    this.fps = 20; // 애니메이션 속도 컨트롤(클수록 빠름)
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.speed = 0;
    this.maxSpeed = 10;
    this.states = [
      new Sitting(this.game),
      new Running(this.game),
      new Jumping(this.game),
      new Falling(this.game),
      new Rolling(this.game),
      new Diving(this.game),
      new Hit(this.game),
    ];
    this.currentState = null;
  }
  update(input, deltaTime) {
    this.checkCollision();

    this.currentState.handleInput(input);
    // 좌우
    // - hit 상태일경우 움직임 제한
    this.x += this.speed;
    if (input.includes("ArrowLeft") && this.currentState !== this.states[6])
      this.speed = -this.maxSpeed;
    else if (
      input.includes("ArrowRight") &&
      this.currentState !== this.states[6]
    )
      this.speed = this.maxSpeed;
    else this.speed = 0;

    // 좌우 바운더리 설정
    if (this.x < 0) this.x = 0;
    if (this.x > this.game.width - this.width)
      this.x = this.game.width - this.width;

    // 상하
    /**
     * 1. state.js 에서 vy를 음수값으로 만들고
     * 2. y에 vy를 증가시키기 때문에, y좌표는 줄어들어서 이미지는 올라감
     * 3. 땅에 떨어져있으면 weight를 계속 더해주기때문에, vy는 점점 양수가 되고
     * 4. y는
     */
    this.y += this.vy;
    if (!this.onGround()) this.vy += this.weight;
    else this.vy = 0;

    // 상하 바운더리 설정 (다이빙 할 때 간헐적 발생하는 땅에 박히는 버그 방지)
    if (this.y > this.game.height - this.height - this.game.groundMargin)
      this.y = this.game.height - this.height - this.game.groundMargin;

    // sprite animation
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else {
      this.frameTimer += deltaTime;
    }
  }
  draw(context) {
    context.drawImage(
      this.image,
      this.width * this.frameX,
      this.height * this.frameY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
    if (this.game.debug) {
      context.strokeRect(this.x, this.y, this.width, this.height);
    }
  }
  onGround() {
    // 이미지의 왼상단 모서리와 (전체 높이 - 이미지높이) 포인트를 비교
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }
  setState(state, speed) {
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;
    this.currentState.enter();
  }
  checkCollision() {
    this.game.enemies.forEach((enemy) => {
      if (
        enemy.x < this.x + this.width &&
        enemy.x + enemy.width > this.x &&
        enemy.y < this.y + this.height &&
        enemy.y + enemy.height > this.y
      ) {
        // 충돌
        enemy.markedForDeletion = true;
        this.game.collisions.push(
          new CollisionAnimation(
            this.game,
            enemy.x + enemy.width * 0.5,
            enemy.y + enemy.height * 0.5
          )
        );
        if (
          this.currentState === this.states[4] ||
          this.currentState === this.states[5]
        ) {
          // rolling or diving
          this.game.score++;
          this.game.floatingMessages.push(
            new FloatingMessages("+1", enemy.x, enemy.y, 150, 50) // score 를 타겟으로 이동
          );
        } else {
          this.setState(6, 0); // HIT(dizzy)
          this.game.score--;
          this.game.life--;
          if (this.game.life <= 0) this.game.gameOver = true;
        }
      }
    });
  }
}
