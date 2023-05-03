export class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 30;
    this.fontFamily = "Creepster";
  }
  draw(context) {
    context.save();
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowColor = "white";
    context.shadowBlur = 0;

    context.font = `${this.fontSize}px  ${this.fontFamily}`;
    context.textAlign = "left";
    context.fillStyle = this.game.fontColor;

    // score
    context.fillText(`Score: ${this.game.score}`, 20, 50);

    // time
    context.font = `${this.fontSize * 0.8}px ${this.fontFamily}`;
    context.fillText(`Time: ${(this.game.time * 0.001).toFixed(1)}`, 20, 80);

    // game over text
    if (this.game.timeOver) {
      context.textAlign = "center";
      context.font = `${this.fontSize * 2}px ${this.fontFamily}`;
      if (this.game.score > 5) {
        context.fillText(
          "CONGRATULATION",
          this.game.width * 0.5,
          this.game.height * 0.5
        );
        context.font = `${this.fontSize * 0.7}px ${this.fontFamily}`;
        context.fillText(
          "YOU WIN!",
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        );
      } else {
        context.fillText(
          "GAME OVER",
          this.game.width * 0.5,
          this.game.height * 0.5
        );
        context.font = `${this.fontSize * 0.7}px ${this.fontFamily}`;
        context.fillText(
          "time is over",
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        );
      }
    }
    context.restore();
  }
}
