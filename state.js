export const states = {
  STANDING_LEFT: 0,
  STANDING_RIGHT: 1,
  SITTING_LEFT: 2,
  SITTING_RIGHT: 3,
  RUNNING_LEFT: 4,
  RUNNING_RIGHT: 5,
};

class State {
  constructor(state) {
    this.state = state;
  }
}

export class StandingLeft extends State {
  constructor(player) {
    super("STANDING LEFT");
    this.player = player;
  }
  enter() {
    this.player.frameY = 1;
    this.player.speed = 0;
  }
  handleInput(input) {
    if (input === "right ↓") this.player.setState(states.RUNNING_RIGHT);
    else if (input === "left ↓") this.player.setState(states.RUNNING_LEFT);
    else if (input === "down ↓") this.player.setState(states.SITTING_LEFT);
  }
}

export class StandingRight extends State {
  constructor(player) {
    super("STANDING RIGHT");
    this.player = player;
  }
  enter() {
    this.player.frameY = 0;
    this.player.speed = 0;
  }
  handleInput(input) {
    if (input === "left ↓") this.player.setState(states.RUNNING_LEFT);
    else if (input === "right ↓") this.player.setState(states.RUNNING_RIGHT);
    else if (input === "down ↓") this.player.setState(states.SITTING_RIGHT);
  }
}

export class SittingLeft extends State {
  constructor(player) {
    super("SITTING LEFT");
    this.player = player;
  }
  enter() {
    this.player.frameY = 9;
    this.player.speed = 0;
  }
  handleInput(input) {
    if (input === "right ↓") this.player.setState(states.SITTING_RIGHT);
    else if (input === "down ↑") this.player.setState(states.STANDING_LEFT);
  }
}

export class SittingRight extends State {
  constructor(player) {
    super("SITTING LEFT");
    this.player = player;
  }
  enter() {
    this.player.frameY = 8;
    this.player.speed = 0;
  }
  handleInput(input) {
    if (input === "left ↓") this.player.setState(states.SITTING_LEFT);
    else if (input === "down ↑") this.player.setState(states.STANDING_RIGHT);
  }
}

export class RunningLeft extends State {
  constructor(player) {
    super("RUNNING LEFT");
    this.player = player;
  }
  enter() {
    this.player.frameY = 7;
    this.player.speed = -this.player.maxSpeed;
  }
  handleInput(input) {
    if (input === "right ↓") this.player.setState(states.RUNNING_RIGHT);
    else if (input === "left ↑") this.player.setState(states.STANDING_LEFT);
    else if (input === "down ↓") this.player.setState(states.SITTING_LEFT);
  }
}

export class RunningRight extends State {
  constructor(player) {
    super("RUNNING RIGHT");
    this.player = player;
  }
  enter() {
    this.player.frameY = 6;
    this.player.speed = this.player.maxSpeed;
  }
  handleInput(input) {
    if (input === "left ↓") this.player.setState(states.RUNNING_LEFT);
    else if (input === "right ↑") this.player.setState(states.STANDING_RIGHT);
    else if (input === "down ↓") this.player.setState(states.SITTING_RIGHT);
  }
}
