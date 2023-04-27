import { Dust, Fire } from "./particles.js";

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
  constructor(state, game) {
    this.state = state;
    this.game = game;
  }
}

export class Sitting extends State {
  constructor(game) {
    super("SITTING", game);
  }
  enter() {
    this.game.player.frameX = 0; // 다른 state 에서 넘어올 때 sitting 의 maxFrame 이 작아서 일어나는 블링크 방지
    this.game.player.frameY = 5;
    this.game.player.maxFrame = 4;
  }
  handleInput(input) {
    if (input.includes("ArrowLeft") || input.includes("ArrowRight")) {
      this.game.player.setState(states.RUNNING, 1);
    } else if (input.includes(" ")) {
      this.game.player.setState(states.ROLLING, 2);
    } else if (input.includes("ArrowUp")) {
      this.game.player.setState(states.JUMPING, 0);
    }
  }
}

export class Running extends State {
  constructor(game) {
    super("RUNNING", game);
  }
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 3;
    this.game.player.maxFrame = 8;
  }
  handleInput(input) {
    this.game.particles.unshift(
      new Dust(
        this.game,
        this.game.player.x + this.game.player.width * 0.6,
        this.game.player.y + this.game.player.height
      )
    );
    if (input.includes("ArrowDown"))
      this.game.player.setState(states.SITTING, 0);
    else if (input.includes("ArrowUp"))
      this.game.player.setState(states.JUMPING, 1);
    else if (input.includes(" ")) this.game.player.setState(states.ROLLING, 2);
  }
}

export class Jumping extends State {
  constructor(game) {
    super("JUMPING", game);
  }
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 1;
    this.game.player.maxFrame = 6;
    if (this.game.player.onGround()) this.game.player.vy -= 15;
  }
  handleInput(input) {
    if (this.game.player.vy > this.game.player.weight) {
      this.game.player.setState(states.FALLING, 1);
    } else if (input.includes(" ")) {
      this.game.player.setState(states.ROLLING, 2);
    } else if (input.includes("ArrowDown")) {
      this.game.player.setState(states.DIVING, 0);
    }
  }
}

export class Falling extends State {
  constructor(game) {
    super("FALLING", game);
  }
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 2;
    this.game.player.maxFrame = 6;
  }
  handleInput(input) {
    if (this.game.player.onGround()) {
      this.game.player.setState(states.RUNNING, 1);
    } else if (input.includes(" ")) {
      this.game.player.setState(states.ROLLING, 2);
    } else if (input.includes("ArrowDown")) {
      this.game.player.setState(states.DIVING, 0);
    }
  }
}

export class Rolling extends State {
  constructor(game) {
    super("ROLLING", game);
  }
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 6;
    this.game.player.maxFrame = 6;
  }
  handleInput(input) {
    // unshift: main.js 에서 this.maxParticles로 제한하여 배열 자를때, 새로 생긴 애가 잘리는것 막기 위해 처음에 집어넣는다.
    this.game.particles.unshift(
      new Fire(
        this.game,
        this.game.player.x + this.game.player.width * 0.5,
        this.game.player.y + this.game.player.height * 0.5
      )
    );
    if (!input.includes(" ") && this.game.player.onGround()) {
      this.game.player.setState(states.RUNNING, 1);
    } else if (!input.includes(" ") && !this.game.player.onGround()) {
      this.game.player.setState(states.FALLING, 1);
    } else if (
      input.includes(" ") &&
      input.includes("ArrowUp") &&
      this.game.player.onGround()
    ) {
      this.game.player.vy -= 20;
    }
  }
}

export class Diving extends State {
  constructor(game) {
    super("DIVING", game);
  }
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 6;
    this.game.player.maxFrame = 6;
    this.game.player.vy = 15;
  }
  handleInput(input) {
    // unshift: main.js 에서 this.maxParticles로 제한하여 배열 자를때, 새로 생긴 애가 잘리는것 막기 위해 처음에 집어넣는다.
    this.game.particles.unshift(
      new Fire(
        this.game,
        this.game.player.x + this.game.player.width * 0.5,
        this.game.player.y + this.game.player.height * 0.5
      )
    );
    if (this.game.player.onGround()) {
      this.game.player.setState(states.RUNNING, 1);
    } else if (input.includes(" ") && this.game.player.onGround()) {
      this.game.player.setState(states.ROLLING, 2);
    }
  }
}
