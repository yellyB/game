document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 720;

  console.log("fewejk");
  class InputHandler {
    constructor() {
      this.keys = [];
      window.addEventListener("keydown", (e) => {
        console.log(e);
        if (
          (e.key === "ArrowDown" ||
            e.key === "ArrowUp" ||
            e.key === "ArrowLeft" ||
            e.key === "ArrowRight") &&
          this.keys.indexOf(e.key) === -1
        ) {
          this.keys.push(e.key);
        }
      });
      window.addEventListener("keyup", (e) => {
        console.log(e);
        if (
          e.key === "ArrowDown" ||
          e.key === "ArrowUp" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight"
        ) {
          this.keys.splice(this.keys.indexOf(e.key), 1);
        }
      });
    }
  }

  class Player {}

  class Background {}

  class Enemy {}

  const handleEnemies = () => {};

  const displayStatusText = () => {};

  const input = new InputHandler();

  const animate = () => {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // const deltaTime = timeStamp - lastTime;
    // lastTime = timeStamp;
    // game.update(deltaTime);
    // game.draw();
    // requestAnimationFrame(animate);
  };

  // animate(0);
});
