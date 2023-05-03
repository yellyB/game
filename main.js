import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from "./enemies.js";
import { UI } from "./UI.js";

let mode = "city";
const dropdown = document.getElementById("backgrounds");
dropdown.addEventListener("change", function (e) {
  mode = e.target.value;
});

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 500;

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.groundMargin = 80;
      this.speed = 0;
      this.maxSpeed = 3;
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.enemies = [];
      this.particles = [];
      this.collisions = [];
      this.maxParticles = 200;
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.debug = false;
      this.score = 0;
      this.fontColor = "black";
      this.time = 0;
      this.maxTime = 20000;
      this.timeOver = false;
      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
      this.backgroundMode = "city";
      this.UI = new UI(this);
      this.background = new Background(this);
    }
    update(deltaTime) {
      this.time += deltaTime;
      if (this.time > this.maxTime) {
        this.timeOver = true;
      }
      this.background.update(mode);
      this.player.update(this.input.keys, deltaTime);

      // handle Enemies
      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
      this.enemies.forEach((enemy) => {
        enemy.update(deltaTime);
        if (enemy.markedForDeletion)
          this.enemies.splice(this.enemies.indexOf(enemy), 1);
      });

      // handle particles
      this.particles.forEach((particle, index) => {
        particle.update();
        if (particle.markedForDeletion) this.particles.splice(index, 1);
      });
      if (this.particles.length > this.maxParticles) {
        this.particles.length = this.maxParticles;
      }

      //handle collision sprites
      this.collisions.forEach((collision, index) => {
        collision.update(deltaTime);
        if (collision.markedForDeletion) this.collisions.splice(index, 1);
      });
    }
    draw(context) {
      this.background.draw(context);
      this.player.draw(context);
      this.enemies.forEach((enemy) => {
        enemy.draw(context);
      });
      this.particles.forEach((particle) => {
        particle.draw(context);
      });
      this.collisions.forEach((collision) => {
        collision.draw(context);
      });
      this.UI.draw(context);
    }
    addEnemy() {
      if (this.speed > 0 && Math.random() < 0.5) {
        this.enemies.push(new GroundEnemy(this));
      } else if (this.speed > 0) {
        this.enemies.push(new ClimbingEnemy(this));
      }
      this.enemies.push(new FlyingEnemy(this));
    }
  }

  const game = new Game(canvas.width, canvas.height);

  let lastTime = 0;

  const animate = (timeStamp) => {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.draw(ctx, 0);
    game.update(deltaTime);

    if (!game.timeOver) requestAnimationFrame(animate);
  };
  animate(0);
});
