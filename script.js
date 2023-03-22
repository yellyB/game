document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 720;

  class InputHandler {
    constructor() {
      this.keys = [];
      window.addEventListener("keydown", (e) => {
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

  class Player {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 200;
      this.height = 200;
      this.x = 0;
      this.y = this.gameHeight - this.height;
      this.image = document.getElementById("playerImage");
      this.frameX = 0;
      this.frameY = 0;
      this.speed = 0;
      this.vy = 0; // velocity
      this.weight = 1;
    }
    draw(context) {
      context.fillStyle = "white";
      context.fillRect(this.x, this.y, this.width, this.height);
      context.drawImage(
        this.image,
        this.frameX * this.width,
        this.frameY * this.height,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    update(input) {
      if (input.keys.indexOf("ArrowRight") > -1) {
        this.speed = 5;
      } else if (input.keys.indexOf("ArrowLeft") > -1) {
        this.speed = -5;
      } else if (input.keys.indexOf("ArrowUp") > -1 && this.onGround()) {
        // onGround로 땅에 있을때만 점프하도록. 안그러면 점프 중 상태에서 up키 누르고 있으면 계속 점프높이 추가됨
        /**[점프 로직]:
         *  1. vy를 음수값으로 설정하고
         *  2. 아래 상하 움직임 로직 부분에서 y 좌표에 vy를 더해줌.
         *  3. vy는 weight 를 계속 더해주기 때문에 음수에서 양수로 점차 늘어남
         *  4. 2의 과정때문에 y 좌표는 줄어들다가(위로 점프) vy가 양수가 되면 다시 늘어남(떨어짐)
         */
        this.vy = -30;
      } else {
        this.speed = 0;
      }

      // 화살표 버튼 움직임
      this.x += this.speed;

      // 화면 밖 나갈 경우 처리 (좌우 움직임)
      if (this.x < 0) this.x = 0;
      else if (this.x > this.gameWidth - this.width)
        this.x = this.gameWidth - this.width;

      // 상하 움직임
      this.y += this.vy;
      if (!this.onGround()) {
        this.vy += this.weight;
        this.frameY = 1;
      } else {
        this.vy = 0;
        this.frameY = 0;
      }
      // 많이 점프하면(up키 오래 누르면) 떨어질 때 땅에 박혀버리는 버그 발생.
      // 이유: vy가 0으로 초기화 되고나서도 값이 바뀌는 랜덤한 경우가 생겨서 => 땅에 박혀버렸으면 처음 위치로 초기화
      if (this.y > this.gameHeight - this.height)
        this.y = this.gameHeight - this.height;
    }
    onGround() {
      return this.y >= this.gameHeight - this.height; // 맨처음엔 y좌표를 gameHeight-height로 설정했기 때문에, y가 더 작아지면 위로 올라간거임 (=공중에 있음)
    }
  }

  class Background {}

  class Enemy {}

  const handleEnemies = () => {};

  const displayStatusText = () => {};

  const input = new InputHandler();
  const player = new Player(canvas.width, canvas.height);

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw(ctx);
    player.update(input);
    requestAnimationFrame(animate);
  };
  animate();
});
