let score = 0;
const money = document.getElementById("money");

class Bird {
  constructor(y, speed, image, ctx, canvas) {
    this.posX = 0;
    this.posY = y;
    this.speed = speed;
    this.frame = 0;
    this.image = image;
    this.ctx = ctx;
    this.canvas = canvas;
    this.width = 45;
    this.height = 35;
    this.isAlive = true;
    this.initFrameCycle();
  }

  initFrameCycle() {
    const interval = setInterval(() => {
      if (this.isAlive) {
        this.frame++;
        if (this.frame >= 3) {
          this.frame = 0;
        }
      } else {
        this.frame = 0;
        clearInterval(interval);
      }
    }, 100);
  }

  update() {
    if (this.isAlive) {
      this.posX += this.speed;
      if (this.posX > this.canvas.width) {
        this.posX = -10;
      }

      this.ctx.drawImage(
        this.image,
        this.frame * 40,
        2 * 60,
        35,
        30,
        this.posX,
        this.posY,
        this.width,
        this.height
      );
    } else {
      this.deadAnimation();
    }
  }

  isClicked(x, y) {
    // console.log({ x, y });
    // console.log(`posX = ${this.posX} et posY = ${this.posY}`);
    return (
      x >= this.posX &&
      x <= this.posX + this.width &&
      y >= this.posY &&
      y <= this.posY + this.height
    );
  }

  deadAnimation() {
    this.posY += this.speed * 3;
    if (this.posY > this.canvas.height) {
      this.isAlive = false;
    }

    this.ctx.drawImage(
      this.image,
      this.frame * 40,
      4 * 60,
      35,
      30,
      this.posX,
      this.posY,
      this.width,
      this.height
    );
  }
}

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

window.addEventListener("resize", function () {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
});

const dunkImage = new Image();
dunkImage.src = "./assets/img/sprite1.png";

function getMousePos(canvas, event) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function handleClick(event) {
  let mousePos = getMousePos(canvas, event);
  birds.forEach((bird) => {
    if (bird.isClicked(mousePos.x, mousePos.y)) {
      score++;
      money.innerHTML = score;
      bird.isAlive = false;
      console.log(score);
    }
  });
}

canvas.addEventListener("click", handleClick);

let birds = [];

function addBirdRandomly() {
  if (birds.length < 3) {
    const randomHeight = Math.random() * canvas.height - 70;
    birds.push(new Bird(randomHeight, 1, dunkImage, ctx, canvas));
    setTimeout(addBirdRandomly, 2000);
  }
}

dunkImage.onload = () => {
  let isPaused = false;
  let isSlowMotion = false; // Variable to track slow motion state
  let slowMotionEndTime = 0; // Variable to store the end time of slow motion

  // Function to handle pause, slow mo
  function handleKeyDown(event) {
    switch (event.key) {
      case "Escape":
        isPaused = !isPaused;
        if (isPaused) {
          canvas.removeEventListener("click", handleClick); // deactivate click
          // Show Pause background and stop music
          cancelAnimationFrame(animationID);
        } else {
          canvas.addEventListener("click", handleClick); // Reactivate click
          // Reactivate music
          animate();
        }
      case "Shift":
        if (!isSlowMotion) {
          isSlowMotion = true;
          slowMotionEndTime = Date.now() + 20000; // 20 seconds
          birds.forEach((bird) => {
            bird.speed /= 2; // Reduce bird speed by half
          });
          setTimeout(() => {
            isSlowMotion = false;
            birds.forEach((bird) => {
              bird.speed *= 2; // Restore bird speed to normal
            });
          }, 20000); // 20 seconds
        }
    }
  }
  setTimeout(addBirdRandomly, 0); // Start adding birds immediately

  setInterval(() => {
    if (isSlowMotion) {
      birds.push(
        new Bird(Math.random() * canvas.height, 0.5, dunkImage, ctx, canvas)
      );
      birds.push(
        new Bird(Math.random() * canvas.height, 0.5, dunkImage, ctx, canvas)
      );
    }
    birds.push(
      new Bird(Math.random() * canvas.height, 1, dunkImage, ctx, canvas)
    );
    birds.push(
      new Bird(Math.random() * canvas.height, 1, dunkImage, ctx, canvas)
    );
  }, 2000); // Add two birds after 10 seconds

  document.addEventListener("keydown", handleKeyDown);

  let animationID;
  const animate = () => {
    if (!isPaused) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      birds.forEach((bird) => bird.update());
      animationID = requestAnimationFrame(animate); // Store animation frame ID
    }
  };

  animate();
};
