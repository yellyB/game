const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = (canvas.width = 800);
const CANVAS_HEIGHT = (canvas.height = 700);
let gameSpeed = 15;
const IMAGE_WIDTH = 2400;

const backgroundLayer1 = new Image();
const backgroundLayer2 = new Image();
const backgroundLayer3 = new Image();
const backgroundLayer4 = new Image();
const backgroundLayer5 = new Image();
backgroundLayer1.src = "images/layer-1.png";
backgroundLayer2.src = "images/layer-2.png";
backgroundLayer3.src = "images/layer-3.png";
backgroundLayer4.src = "images/layer-4.png";
backgroundLayer5.src = "images/layer-5.png";

window.addEventListener("load", function () {
  const slider = document.getElementById("slider");
  slider.value = gameSpeed;
  const showGameSpeed = document.getElementById("showGameSpeed");
  showGameSpeed.innerHTML = gameSpeed;
  slider.addEventListener("change", function (e) {
    gameSpeed = e.target.value;
    showGameSpeed.innerHTML = gameSpeed;
  });
  class Layer {
    constructor(image, speedModifier) {
      this.x = 0;
      this.y = 0;
      this.width = 2400;
      this.height = 700;
      this.image = image;
      this.speedModifier = speedModifier;
      this.speed = gameSpeed * this.speedModifier;
    }
    update() {
      this.speed = gameSpeed * this.speedModifier;
      // 첫 이미지가 끝에 다다랐다?
      if (this.x <= -this.width) {
        this.x = 0; // 첫 이미지를 둘째 이미지 뒤로 보내는 것이 아닌, 첫 이미지를 처음 위치로 초기화
      }

      this.x = Math.floor(this.x - this.speed);
    }
    draw() {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      ctx.drawImage(
        this.image,
        this.x + this.width, // 두번째 이미지는 계속 첫번째 이미지 뒤에 위치하도록
        this.y,
        this.width,
        this.height
      );
    }
  }

  const layer1 = new Layer(backgroundLayer1, 0.2);
  const layer2 = new Layer(backgroundLayer2, 0.4);
  const layer3 = new Layer(backgroundLayer3, 0.6);
  const layer4 = new Layer(backgroundLayer4, 0.8);
  const layer5 = new Layer(backgroundLayer5, 1);

  const gameObjects = [layer1, layer2, layer3, layer4, layer5];

  function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // 이전 프레임 스머지 되는것 막기

    gameObjects.forEach((object) => {
      object.update();
      object.draw();
    });

    requestAnimationFrame(animate);
  }
  animate();
});
