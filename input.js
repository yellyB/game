export class InputHandler {
  constructor(game) {
    this.game = game;
    this.keys = [];
    window.addEventListener("keydown", (e) => {
      if (
        (e.key === "ArrowDown" ||
          e.key === "ArrowUp" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight" ||
          e.key === "Enter" ||
          e.key === " ") &&
        this.keys.indexOf(e.key) === -1
      ) {
        this.keys.push(e.key);
      } else if (e.key === "d") {
        this.game.debug = !this.game.debug;
      }
    });
    window.addEventListener("keyup", (e) => {
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "Enter" ||
        e.key === " "
      ) {
        this.keys.splice(this.keys.indexOf(e.key), 1);
      }

      // switch (e.key) {
      //   case "ArrowLeft":
      //     this.lastKey = "left ↑";
      //     break;
      //   case "ArrowRight":
      //     this.lastKey = "right ↑";
      //     break;
      //   case "ArrowDown":
      //     this.lastKey = "down ↑";
      //     break;
      //   case "ArrowUp":
      //     this.lastKey = "up ↑";
      //     break;
      // }
    });
  }
}
