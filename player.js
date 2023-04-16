import { Sitting, Running, Jumping, Falling } from "./playerState.js";

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
      new Sitting(this),
      new Running(this),
      new Jumping(this),
      new Falling(this),
    ];
    this.currentState = this.states[0];
    this.currentState.enter();
  }
  update(input, deltaTime) {
    this.currentState.handleInput(input);
    // 좌우
    this.x += this.speed;
    if (input.includes("ArrowLeft")) this.speed = -this.maxSpeed;
    else if (input.includes("ArrowRight")) this.speed = this.maxSpeed;
    else this.speed = 0;

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
}
