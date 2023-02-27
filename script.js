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

let gameFrame = 0;
const staggerFrames = 5;
const sprireAnimations = [];
const animationStates = [
  {
    name: "idle",
    frames: 7,
  },
  {
    name: "jump",
    frames: 7,
  },
  {
    name: "fall",
    frames: 7,
  },
  {
    name: "run",
    frames: 9,
  },
  {
    name: "dizzy",
    frames: 11,
  },
  {
    name: "sit",
    frames: 5,
  },
  {
    name: "roll",
    frames: 7,
  },
  {
    name: "bite",
    frames: 7,
  },
  {
    name: "ko",
    frames: 12,
  },
  {
    name: "getHit",
    frames: 4,
  },
];
animationStates.forEach((state, index) => {
  let frames = {
    loc: [],
  };
  for (let j = 0; j < state.frames; j++) {
    let positionX = j * spriteWidth;
    let positionY = index * spriteHeight;
    frames.loc.push({ x: positionX, y: positionY });
  }
  sprireAnimations[state.name] = frames;
});

console.log(sprireAnimations);

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // sprireAnimations["idle"].loc.length : 강아지 상태에 맞는 이미지 개수. 한 row의 이미지를 루프 돌기위해
  let position =
    Math.floor(gameFrame / staggerFrames) % sprireAnimations["idle"].loc.length;

  console.log(position);
  let frameX = spriteWidth * position;
  let frameY = sprireAnimations["idle"].loc[position].y;

  // drawImage 인자: 가져올image, source 좌표, source 넓&높 , destination 좌표, destination 넓&높
  // ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
  ctx.drawImage(
    playerImage,
    frameX,
    frameY,
    spriteWidth,
    spriteHeight,
    0,
    0,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  );

  gameFrame++;
  requestAnimationFrame(animate); // loop
}
animate();
