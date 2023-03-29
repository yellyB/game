document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 720;
  const INIT_X = 50;
  let enemies = [];
  let score = 0;
  let gameOver = false;
  const fullScreenButton = document.getElementById("fullScreenButton");

  class InputHandler {
    constructor() {
      this.keys = [];
      this.touchY = "";
      this.touchTreshold = 30;
      window.addEventListener("keydown", (e) => {
        if (
          (e.key === "ArrowDown" ||
            e.key === "ArrowUp" ||
            e.key === "ArrowLeft" ||
            e.key === "ArrowRight") &&
          this.keys.indexOf(e.key) === -1
        ) {
          this.keys.push(e.key);
        } else if (e.key === "Enter" && gameOver) {
          restartGame();
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
      window.addEventListener("touchstart", (e) => {
        this.touchY = e.changedTouches[0].pageY;
      });
      window.addEventListener("touchmove", (e) => {
        const swipeDistance = this.touchY - e.changedTouches[0].pageY; // this.touchY가 맨 처음 클릭 위치. e.changedTouches[0].pageY가 이동중 현재 좌표.
        if (
          swipeDistance > this.touchTreshold &&
          this.keys.indexOf("swipe up") === -1
        ) {
          this.keys.push("swipe up");
        } else if (
          swipeDistance < -this.touchTreshold &&
          this.keys.indexOf("swipe down") === -1
        ) {
          this.keys.push("swipe down");
          if (gameOver) restartGame();
        }
      });
      window.addEventListener("touchend", () => {
        this.keys.splice(this.keys.indexOf("swipe up"), 1);
        this.keys.splice(this.keys.indexOf("swipe down"), 1);
      });
    }
  }

  class Player {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 200;
      this.height = 200;
      this.x = INIT_X;
      this.y = this.gameHeight - this.height;
      this.image = document.getElementById("playerImage");
      this.frameX = 0;
      this.frameY = 0;
      this.maxFrame = 8;
      this.fps = 20; // 각 enemy의 프레임을 얼마나 빠르게 움질일지
      this.frameTimer = 0;
      this.frameinterval = 1000 / this.fps;
      this.speed = 0;
      this.speedAmount = 8;
      this.vy = 0; // velocity
      this.weight = 1;
      this.radius = this.width / 3;
    }
    draw(context) {
      // context.strokeStyle = "white";
      // // context.strokeRect(this.x, this.y, this.width, this.height);
      // context.beginPath();
      // context.arc(
      //   this.x + this.width / 2,
      //   this.y + this.height / 2 + 20,
      //   this.radius,
      //   0,
      //   Math.PI * 2
      // );
      // context.stroke();

      // context.strokeStyle = "blue";
      // context.beginPath();
      // context.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
      // context.stroke();

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
    update(input, deltaTime, enemies) {
      /** [충돌]
       *  player 와 enemy의 두 원(hitbox) 간 중심점 거리를 구해서
       *  그 거리가 각 원의 반지름 합계보다 작으면 충돌인걸 알 수 있음
       *
       *  enemy와 player의 x,y좌표를 알기 때문에
       *  이걸로 두 오브젝트 간 x,y 길이를 구하고(x: 밑변, y: 높이)
       *  피타고리스 정리를 이용해서 빗변의 거리를 구한다. 이게 곧 두 원(hitbox)간의 거리가 된다.
       */
      enemies.forEach((enemy) => {
        const dx = enemy.x + enemy.width / 2 - 20 - (this.x + this.width / 2);
        const dy = enemy.y + enemy.height / 2 - (this.y + this.height / 2 + 20);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < enemy.radius + this.radius) {
          gameOver = true;
        }
      });
      // 애니메이션 컨트롤
      if (this.frameTimer > this.frameinterval) {
        this.frameTimer = 0;
        if (this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;
      } else {
        this.frameTimer += deltaTime;
      }

      // 방향키 컨트롤
      if (input.keys.indexOf("ArrowRight") > -1) {
        this.speed = this.speedAmount;
      } else if (input.keys.indexOf("ArrowLeft") > -1) {
        this.speed = -this.speedAmount;
      } else if (
        (input.keys.indexOf("ArrowUp") > -1 ||
          input.keys.indexOf("swipe up") > -1) &&
        this.onGround()
      ) {
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

      this.x += this.speed;

      // 화면 밖 나갈 경우 처리 (좌우 움직임)
      if (this.x < 0) this.x = 0;
      else if (this.x > this.gameWidth - this.width)
        this.x = this.gameWidth - this.width;

      // 상하 움직임
      this.y += this.vy;
      if (this.onGround()) {
        this.vy = 0;
        this.frameY = 0;
        this.maxFrame = 8; // 달리는 모션은 프레임 9개고 점프는 프레임 개수 7임. 그래서 분리해서 총 프레임 설정해줌
      } else {
        this.vy += this.weight;
        this.frameY = 1;
        this.maxFrame = 6;
      }
      // 많이 점프하면(up키 오래 누르면) 떨어질 때 땅에 박혀버리는 버그 발생.
      // 이유: vy가 0으로 초기화 되고나서도 값이 바뀌는 랜덤한 경우가 생겨서 => 땅에 박혀버렸으면 처음 위치로 초기화
      if (this.y > this.gameHeight - this.height)
        this.y = this.gameHeight - this.height;
    }
    onGround() {
      return this.y >= this.gameHeight - this.height; // 맨처음엔 y좌표를 gameHeight-height로 설정했기 때문에, y가 더 작아지면 위로 올라간거임 (=공중에 있음)
    }
    restart() {
      this.x = INIT_X;
      this.y = this.gameHeight - this.height;
      this.maxFrame = 8;
      this.frameY = 0;
    }
  }

  class Background {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.image = document.getElementById("backgroundImage");
      this.x = 0;
      this.y = 0;
      this.width = 2400;
      this.height = 720;
      this.speed = 10;
    }
    draw(context) {
      // 이미지1과 이미지2를 붙인 후 이미지2가 이미지1의 초기 위치에 오면! 이미지들을 맨 처음 위치로 되돌림
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
      context.drawImage(
        this.image,
        this.x + this.width - this.speed,
        this.y,
        this.width,
        this.height
      );
    }
    update() {
      this.x -= this.speed;
      if (this.x < 0 - this.width) this.x = 0;
    }
    restart() {
      this.x = 0;
    }
  }

  class Enemy {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 160;
      this.height = 119;
      this.image = document.getElementById("enemyImage");
      this.x = this.gameWidth;
      this.y = this.gameHeight - this.height;
      this.frameX = 0;
      this.maxFrame = 5;
      this.fps = 20; // 각 enemy의 프레임을 얼마나 빠르게 움질일지
      this.frameTimer = 0;
      this.frameinterval = 1000 / this.fps;
      this.speed = 8;
      this.markedForDeletion = false;
      this.radius = this.width / 3;
    }
    draw(context) {
      // context.strokeStyle = "white";
      // // context.strokeRect(this.x, this.y, this.width, this.height);
      // context.beginPath();
      // context.arc(
      //   this.x + this.width / 2 - 20,
      //   this.y + this.height / 2,
      //   this.radius,
      //   0,
      //   Math.PI * 2
      // );

      // context.strokeStyle = "blue";
      // context.beginPath();
      // context.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
      // context.stroke();

      context.drawImage(
        this.image,
        this.frameX * this.width,
        0,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );

      context.stroke();
    }
    update(deltaTime) {
      if (this.frameTimer > this.frameinterval) {
        this.frameTimer = 0;
        if (this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;
      } else {
        this.frameTimer += deltaTime;
      }
      this.x -= this.speed;
      if (this.x < 0 - this.width) {
        this.markedForDeletion = true; // 화면 밖으로 나갔으면 삭제하기 위해
        score++; // 화면 밖으로 나가면 피했다고 간주하고 점수 증가
      }
    }
  }

  const handleEnemies = (deltaTime) => {
    if (enemyTimer > enemyInterval + randomEnemyInterval) {
      enemies.push(new Enemy(canvas.width, canvas.height));
      randomEnemyInterval = Math.random() * 1000 + 500;
      enemyTimer = 0;
    } else {
      enemyTimer += deltaTime;
    }
    enemies.forEach((enemy) => {
      enemy.draw(ctx);
      enemy.update(deltaTime);
    });
    enemies = enemies.filter((enemy) => !enemy.markedForDeletion);
  };

  const displayStatusText = (context) => {
    context.textAlign = "left";
    context.font = "40px Helvetica";
    context.fillStyle = "black";
    context.fillText(`Score: ${score}`, 22, 52);
    context.fillStyle = "white";
    context.fillText(`Score: ${score}`, 20, 50);
    if (gameOver) {
      context.textAlign = "center";
      context.fillStyle = "black";
      context.fillText(
        `GAME OVER, press Enter or swipe down to restart`,
        canvas.width / 2 + 2,
        202
      );
      context.fillStyle = "white";
      context.fillText(
        `GAME OVER, press Enter or swipe down to restart`,
        canvas.width / 2,
        200
      );
    }
  };

  const restartGame = () => {
    player.restart();
    background.restart();
    enemies = [];
    score = 0;
    gameOver = false;
    animate(0); // InputHandler에서 엔터&게임오버 시 다시 시작하도록 하였는데, animate 재귀에서 gameOver됐을 때 더이상 실행 안하도록 막았기 때문에 animate 다시 돌려줌
  };

  const toggleFullScreen = () => {
    if (document.fullScreenElement) {
      document.exitFullscreen();
    } else {
      canvas
        .requestFullscreen()
        .catch((err) =>
          alert(`Error, can't enable full-screen mode: ${err.message}`)
        );
    }
  };
  fullScreenButton.addEventListener("click", toggleFullScreen);

  const input = new InputHandler();
  const player = new Player(canvas.width, canvas.height);
  const background = new Background(canvas.width, canvas.height);

  let lastTime = 0; // previous timeStamp
  let enemyTimer = 0;
  let enemyInterval = 2000;
  let randomEnemyInterval = Math.random() * 1000 + 500;

  const animate = (timeStamp) => {
    const deltaTime = timeStamp - lastTime; // 컴퓨터가 한 애니메이션 프레임 그리는데 필요한 ms
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw(ctx);
    // background.update();
    player.draw(ctx);
    player.update(input, deltaTime, enemies);
    handleEnemies(deltaTime);
    displayStatusText(ctx);

    if (!gameOver) requestAnimationFrame(animate);
  };
  animate(0);
});
