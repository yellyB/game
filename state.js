export const states = {
  STANDING_LEFT: 0,
  STANDING_RIGHT: 1,
  SITTING_LEFT: 2,
  SITTING_RIGHT: 3,
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
    console.log("left");
    this.player.frameY = 1;
  }
  handleInput(input) {
    if (input === "right ↓") this.player.setState(states.STANDING_RIGHT);
  }
}

export class StandingRight extends State {
  constructor(player) {
    super("STANDING RIGHT");
    this.player = player;
  }
  enter() {
    console.log("right");
    this.player.frameY = 0;
  }
  handleInput(input) {
    if (input === "left ↓") this.player.setState(states.STANDING_LEFT);
  }
}

export class SittingLeft extends State {
  constructor(player) {
    super("SITTING LEFT");
    this.player = player;
  }
  enter() {
    this.player.frameY = 9;
  }
  handleInput(input) {
    if (input === "right ↓") this.player.setState(states.SITTING_RIGHT);
    else if (input === "up ↓") this.player.setState(states.STANDING_LEFT);
  }
}

export class SittingRight extends State {
  constructor(player) {
    super("SITTING LEFT");
    this.player = player;
  }
  enter() {
    this.player.frameY = 9;
  }
  handleInput(input) {
    if (input === "left ↓") this.player.setState(states.SITTING_LEFT);
    else if (input === "up ↓") this.player.setState(states.STANDING_Right);
  }
}
