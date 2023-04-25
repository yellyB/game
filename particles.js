class Particle {
  constructor(game) {
    this.game = game;
    this.markedForDeletion = false;
  }
  update() {
    this.x -= this.speedX + this.game.speed;
    this.y -= this.speedY;
    this.size *= 0.95; // 1에 가까이 다가가면 불꽃 더 길어짐
    if (this.size < 0.5) this.markedForDeletion = true;
  }
}

export class Dust extends Particle {
  constructor(game, x, y) {
    super(game);
    this.size = Math.random() * 10 + 10;
    this.x = x;
    this.y = y;
    this.speedX = Math.random();
    this.speedY = Math.random();
    this.color = "rgba(0,0,0,0.2)";
  }
  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
  }
}

export class Splash extends Particle {
  constructor(game) {
    this.game = game;
  }
}

export class Fire extends Particle {
  constructor(game, x, y) {
    super(game);
    this.image = document.getElementById("fire");
    this.size = Math.random() * 100 + 50; // 불꽃 이미지 사이즈 조절. 50보다 더 큰값 더해주면 이미지 커짐
    this.x = x;
    this.y = y;
    this.speedX = 1;
    this.speedY = 1;
    this.angle = 0;
    this.va = Math.random() * 0.2 - 0.1; // 불꽃 이미지 로테이션 속도 조절
  }
  update() {
    super.update();
    this.angle += this.va;
    this.x += Math.sin(this.angle + 5);
  }
  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    context.drawImage(
      this.image,
      -this.size * 0.5,
      -this.size * 0.5,
      this.size,
      this.size
    );
    context.restore();
  }
}
