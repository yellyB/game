import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";

window.addEventListener("load", () => {
  // const loading = document.getElementById("loading");
  // loading.style.display = "none";
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 500;

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.groundMargin = 80;
      this.speed = 3;
      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new InputHandler();
    }
    update(deltaTime) {
      this.background.update();
      this.player.update(this.input.keys, deltaTime);
    }
    draw(context) {
      this.background.draw(context);
      this.player.draw(context);
    }
  }

  const game = new Game(canvas.width, canvas.height);

  // const input = new InputHandler();

  // player.setState(states.STANDING_RIGHT);

  let lastTime = 0;

  const animate = (timeStamp) => {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.draw(ctx, 0);
    game.update(deltaTime);
    requestAnimationFrame(animate);

    // drawStatusText(ctx, input, player);
  };
  animate(0);
});
