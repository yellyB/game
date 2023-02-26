const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
console.log(ctx);

const CANVAS_WIDTH = (canvas.width = 600);
const CANVAS_HEIGHT = (canvas.height = 600);

const playerImage = new Image();
playerImage.src = "shadow_dog.png";
let x = 0;
const spriteWidth = 575; // image width=6876px 이기때문에, image 칸 수인 12로 나눈 값이 이미지 하나의 width가 됨
const spriteHeight = 523; // 5230px / 10

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  // ctx.fillRect(x, 50, 100, 100);

  // drawImage 인자: 가져올image, source 좌표, source 넓&높 , destination 좌표, destination 넓&높
  // ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
  ctx.drawImage(
    playerImage,
    0,
    0,
    spriteWidth,
    spriteHeight,
    0,
    0,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  );
  requestAnimationFrame(animate); // loop
}
animate();
