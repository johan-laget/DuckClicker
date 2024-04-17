const typeBird = {
  blue: 0,
  dark: 126,
  red: 256,
};

class Bird {
  constructor(y, speed, image, ctx, canvas, life, type, gift) {
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
    this.life = life;
    this.type = type;
    this.isSniper = false;
    this.gift = gift;
    this.initFrameCycle();
  }

  initFrameCycle() {
    const interval = setInterval(() => {
      if (this.isAlive) {
        this.frame += 40;
        if (this.frame >= 120) {
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
        this.frame + this.type,
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
    if (
      x >= this.posX &&
      x <= this.posX + this.width &&
      y >= this.posY &&
      y <= this.posY + this.height
    ) {
      this.life--;
      if (this.life == 0 || this.isSniper) {
        this.isAlive = false;
      }
      return true;
    }
    return false;
  }

  deadAnimation() {
    this.posY += 5;
    if (this.posY > this.canvas.height) {
      this.isAlive = false;
    }

    this.ctx.drawImage(
      this.image,
      this.type,
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

//Variable Globale
let score = 0;
let birds = [];
let isActiveSniper = false;

//Elements DOM
const money = document.getElementById("money");
const prices = document.querySelectorAll("#price");
const sniper = document.getElementById("sniper");

//verif enought money
const isMoney = (money) => {
  prices.forEach((price) => {
    if (price.innerHTML > money) {
      price.style.color = "red";
    } else {
      price.style.color = "black";
    }
  });
};

isMoney(score);

// Config canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

window.addEventListener("resize", function () {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
});

//Gestion item

sniper.addEventListener("click", () => {
  if (score >= 20) {
    score -= 20;
    money.innerHTML = score;
    const progress = document.createElement("progress");
    progress.setAttribute("id", "file");
    progress.setAttribute("max", "10");
    progress.setAttribute("value", "10");
    progress.className = "progress";
    sniper.prepend(progress);
    let time = 10;
    let interval = setInterval(() => {
      if (time >= 0) {
        isActiveSniper = true;
        progress.setAttribute("value", `${time}`);
      } else {
        isActiveSniper = false;
        progress.remove();
        clearInterval(interval);
      }
      time--;
    }, 1000);
  }
});

//Initialisation de l'image
const duckImage = new Image();
duckImage.src = "./assets/img/sprite1.png";

//Tirre
function getMousePos(canvas, event) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

canvas.addEventListener("click", function (event) {
  let mousePos = getMousePos(canvas, event);
  birds.forEach((bird) => {
    if (isActiveSniper) bird.isSniper = true;
    else bird.isSniper = false;
    if (bird.isClicked(mousePos.x, mousePos.y)) {
      if (!bird.isAlive) {
        score += bird.gift;
        isMoney(score);
        money.innerHTML = score;
      }
    }
  });
});

// Generer aleatoirement oiseaux

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function addBirdRandomly() {
  let randomHeight = getRandomArbitrary(0, canvas.height - 70);
  birds.push(
    new Bird(randomHeight, 1, duckImage, ctx, canvas, 3, typeBird.dark, 3)
  );
  randomHeight = getRandomArbitrary(0, canvas.height - 70);
  birds.push(
    new Bird(randomHeight, 1, duckImage, ctx, canvas, 1, typeBird.blue, 1)
  );
  randomHeight = getRandomArbitrary(0, canvas.height - 70);
  birds.push(
    new Bird(randomHeight, 1, duckImage, ctx, canvas, 2, typeBird.red, 2)
  );
  // console.log(birds);
  setTimeout(addBirdRandomly, 2000);
}

duckImage.onload = () => {
  addBirdRandomly();
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    birds.forEach((bird) => bird.update());
    requestAnimationFrame(animate);
  };

  animate();
};
