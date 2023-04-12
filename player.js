import {
  StandingLeft,
  StandingRight,
  SittingLeft,
  SittingRight,
  RunningLeft,
  RunningRight,
  JumpingLeft,
  JumpingRight,
} from "./state.js";

export default class Player {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.states = [
      new StandingLeft(this),
      new StandingRight(this),
      new SittingLeft(this),
      new SittingRight(this),
      new RunningLeft(this),
      new RunningRight(this),
      new JumpingLeft(this),
      new JumpingRight(this),
    ];
    this.currentState = this.states[0];
    this.image = document.getElementById("dogImage");
    this.width = 200;
    this.height = 181.83;
    this.x = this.gameWidth / 2 - this.width / 2;
    this.y = this.gameHeight - this.height;
    this.vy = 0;
    this.weight = 0.5;
    this.frameX = 0;
    this.frameY = 0;
    this.speed = 0;
    this.maxSpeed = 10;
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
  update(input) {
    this.currentState.handleInput(input);

    // 좌우
    this.x += this.speed;
    if (this.x <= 0) this.x = 0;
    else if (this.x >= this.gameWidth - this.width)
      this.x = this.gameWidth - this.width;

    // 상하
    /**
     * 1. state.js 에서 vy를 음수값으로 만들고
     * 2. y에 vy를 증가시키기 때문에, y좌표는 줄어들어서 이미지는 올라감
     * 3. 땅에 떨어져있으면 weight를 계속 더해주기때문에, vy는 점점 양수가 되고
     * 4. y는 땅에 다시 올때까지 원래 값으로 돌아오게됨
     */
    this.y += this.vy;
    if (this.onGround()) {
      this.vy = 0;
    } else {
      this.vy += this.weight;
    }
    if (this.y > this.gameHeight - this.height)
      this.y = this.gameHeight - this.height; // 땅에 박히는 버그 방지
  }
  setState(state) {
    this.currentState = this.states[state];
    this.currentState.enter();
  }
  onGround() {
    // 이미지의 왼상단 모서리와 (전체 높이 - 이미지높이) 포인트를 비교
    return this.y >= this.gameHeight - this.height;
  }
}
