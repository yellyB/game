export default class InputHandler {
  constructor() {
    this.lastKey = "";
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          this.lastKey = "left ↓";
          break;
        case "ArrowRight":
          this.lastKey = "right ↓";
          break;
        case "ArrowDown":
          this.lastKey = "down ↓";
          break;
        case "ArrowUp":
          this.lastKey = "up ↓";
          break;
      }
    });
    window.addEventListener("keyup", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          this.lastKey = "left ↑";
          break;
        case "ArrowRight":
          this.lastKey = "right ↑";
          break;
        case "ArrowDown":
          this.lastKey = "down ↑";
          break;
        case "ArrowUp":
          this.lastKey = "up ↑";
          break;
      }
    });
  }
}
