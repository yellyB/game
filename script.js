import Player from "./player.js";
import InputHandler from "./input.js";
import { drawStatusText } from "./utils.js";
import { states } from "./state.js";

window.addEventListener("load", () => {
  const loading = document.getElementById("loading");
  loading.style.display = "none";
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const player = new Player(canvas.width, canvas.height);
  const input = new InputHandler();

  player.setState(states.STANDING_RIGHT);

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update(input.lastKey);
    player.draw(ctx);
    drawStatusText(ctx, input, player);
    requestAnimationFrame(animate);
  };
  animate();
});
