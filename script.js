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

let x = 0;
let x2 = 2400;

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // 이전 프레임 스머지 되는것 막기
  ctx.drawImage(backgroundLayer4, x, 0);
  ctx.drawImage(backgroundLayer4, x2, 0);

  // 이미지가 왼쪽으로 이동해야 하기 때문에 x 좌표를 계속 감소
  if (x < -IMAGE_WIDTH) x = 2400;
  else x -= gameSpeed;
  if (x2 < -IMAGE_WIDTH) x2 = 2400;
  else x2 -= gameSpeed;

  requestAnimationFrame(animate);
}
animate();
