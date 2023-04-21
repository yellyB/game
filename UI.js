export class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 30;
    this.fontFamily = "Helvetica";
  }
  draw(context) {
    context.font = `${this.fontSize}px  ${this.fontFamily}`;
    context.textAlign = "left";
    context.fillStyle - this.game.fontColor;
    context.fillText(`Score: ${this.game.score}`, 20, 50);
  }
  onGround() {
    // 이미지의 왼상단 모서리와 (전체 높이 - 이미지높이) 포인트를 비교
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }
  setState(state, speed) {
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;
    this.currentState.enter();
  }
  checkCollision() {
    this.game.enemies.forEach((enemy) => {
      if (
        enemy.x < this.x + this.width &&
        enemy.x + enemy.width > this.x &&
        enemy.y < this.y + this.height &&
        enemy.y + enemy.height > this.y
      ) {
        // 충돌
        enemy.markedForDeletion = true;
        this.game.score++;
      } else {
        //  충돌  x
      }
    });
  }
}
