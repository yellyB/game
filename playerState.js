// player.js 파일 중 setState()에서 this.states에 접근할 때 사용할 인덱스 정의
export const states = {
  SITTING: 0,
  RUNNING: 1,
  JUMPING: 2,
  FALLING: 3,
  ROLLING: 4,
  DIVING: 5,
  HIT: 6,
};

class State {
  constructor(state) {
    this.state = state;
  }
}

export class Sitting extends State {
  constructor(player) {
    super("SITTING");
    this.player = player;
  }
  enter() {
    this.player.frameX = 0; // 다른 state 에서 넘어올 때 sitting 의 maxFrame 이 작아서 일어나는 블링크 방지
    this.player.frameY = 5;
    this.player.maxFrame = 4;
  }
  handleInput(input) {
    if (input.includes("ArrowLeft") || input.includes("ArrowRight")) {
      this.player.setState(states.RUNNING, 1);
    } else if (input.includes(" ")) {
      this.player.setState(states.ROLLING, 2);
    }
  }
}

export class Running extends State {
  constructor(player) {
    super("RUNNING");
    this.player = player;
  }
  enter() {
    this.player.frameX = 0;
    this.player.frameY = 3;
    this.player.maxFrame = 8;
  }
  handleInput(input) {
    if (input.includes("ArrowDown")) this.player.setState(states.SITTING, 0);
    else if (input.includes("ArrowUp")) this.player.setState(states.JUMPING, 1);
    else if (input.includes(" ")) this.player.setState(states.ROLLING, 2);
  }
}

export class Jumping extends State {
  constructor(player) {
    super("JUMPING");
    this.player = player;
  }
  enter() {
    this.player.frameX = 0;
    this.player.frameY = 1;
    this.player.maxFrame = 6;
    if (this.player.onGround()) this.player.vy -= 15;
  }
  handleInput(input) {
    if (this.player.vy > this.player.weight) {
      this.player.setState(states.FALLING, 1);
    } else if (input.includes(" ")) {
      this.player.setState(states.ROLLING, 2);
    }
  }
}

export class Falling extends State {
  constructor(player) {
    super("FALLING");
    this.player = player;
  }
  enter() {
    this.player.frameX = 0;
    this.player.frameY = 2;
    this.player.maxFrame = 6;
  }
  handleInput(input) {
    if (this.player.onGround()) this.player.setState(states.RUNNING, 1);
  }
}

export class Rolling extends State {
  constructor(player) {
    super("ROLLING");
    this.player = player;
  }
  enter() {
    this.player.frameX = 0;
    this.player.frameY = 6;
    this.player.maxFrame = 6;
  }
  handleInput(input) {
    if (!input.includes(" ") && this.player.onGround()) {
      this.player.setState(states.RUNNING, 1);
    } else if (!input.includes(" ") && !this.player.onGround()) {
      this.player.setState(states.FALLING, 1);
    } else if (
      input.includes(" ") &&
      input.includes("ArrowUp") &&
      this.player.onGround()
    ) {
      this.player.vy -= 20;
    }
  }
}
