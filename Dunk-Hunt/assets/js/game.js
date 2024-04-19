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
    this.isSurvivor = false;
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
        this.isSurvivor = true;
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
      this.isSurvivor = true;
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
// Make an active to save game !!!
const infoBirds = {
  birdPassed: 0,
  birdTotal: 0,
  nbBirdRed: 0,
  nbBirdBlue: 0,
  nbBirdDark: 0,
};
// do we save the attack ???
const attacksActive = {
  isActiveSniper: false,
  isActiveHurican: false,
  isActiveBombe: false,
};
// Save totalMoney and birds
let totalMoney = 0;
let birds = [];
let isActiveSniper = false;

//Elements DOM
const money = document.getElementById("money");
const prices = document.querySelectorAll("#price");
const sniper = document.getElementById("sniper");

//verif enough money
const isMoney = (money) => {
  prices.forEach((price) => {
    if (price.innerHTML > money) {
      price.style.color = "red";
    } else {
      price.style.color = "black";
    }
  });
};

isMoney(totalMoney);
function saveMoneyToLocalStorage() {
  localStorage.setItem("totalMoney", totalMoney.toString());
}

// Function to load total money from local storage
function loadMoneyFromLocalStorage() {
  const savedMoney = localStorage.getItem("totalMoney");
  if (savedMoney !== null) {
    totalMoney = parseInt(savedMoney);
    money.innerHTML = totalMoney;
    isMoney(totalMoney); // Update price display colors based on available money
  }
}

// Update total money and save to local storage
function updateTotalMoney(amount) {
  totalMoney += amount;
  money.innerHTML = totalMoney;
  saveMoneyToLocalStorage();
  isMoney(totalMoney); // Update price display colors based on available money
}
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
  if (isActiveSniper) return;
  if (totalMoney >= 20) {
    updateTotalMoney(-20);
    money.innerHTML = totalMoney;
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

function handleBirdClick(bird) {
  if (!bird.isAlive) {
    updateTotalMoney(bird.gift);
  }
}

loadMoneyFromLocalStorage();
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

let isPaused = false;
let isSlowMotion = false; // Variable to track slow motion state
let slowMotionEndTime = 0; // Variable to store the end time of slow motion

function handleKeyDown(event) {
  switch (event.key) {
    case "Escape":
      isPaused = !isPaused;
      if (isPaused) {
        console.log("pause");
      } else {
        console.log("resume");
      }
      break;
    case "Shift":
      if (!isSlowMotion) {
        isSlowMotion = true;
        birds.forEach((bird) => {
          bird.speed /= 2;
        });
        setTimeout(() => {
          isSlowMotion = false;
          birds.forEach((bird) => {
            bird.speed *= 2;
          });
        }, 20000); // 20 seconds
      }
      break;
  }
}

canvas.addEventListener("click", function (event) {
  if (isPaused) {
    return;
  } else {
    let mousePos = getMousePos(canvas, event);
    birds.forEach((bird) => {
      if (isActiveSniper) bird.isSniper = true;
      else bird.isSniper = false;
      if (bird.isClicked(mousePos.x, mousePos.y)) {
        if (!bird.isAlive) {
          updateTotalMoney(bird.gift);
          isMoney(totalMoney);
          money.innerHTML = totalMoney;
        }
      }
    });
  }
});

document.addEventListener("keydown", handleKeyDown);

// Generer aleatoirement oiseaux

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function addBirdRandomly() {
  if (isSlowMotion) {
    let randomHeight = getRandomArbitrary(0, canvas.height - 70);
    birds.push(
      new Bird(randomHeight, 0.5, duckImage, ctx, canvas, 3, typeBird.dark, 3)
    );
    randomHeight = getRandomArbitrary(0, canvas.height - 70);
    birds.push(
      new Bird(randomHeight, 0.5, duckImage, ctx, canvas, 1, typeBird.blue, 1)
    );
    randomHeight = getRandomArbitrary(0, canvas.height - 70);
    birds.push(
      new Bird(randomHeight, 0.5, duckImage, ctx, canvas, 2, typeBird.red, 2)
    );
  } else {
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
  }
  // console.log(birds);
  setTimeout(addBirdRandomly, 2000);
}

const cleanBirds = () => {
  birds = birds.filter((bird) => bird.isSurvivor === false);
};

duckImage.onload = () => {
  addBirdRandomly();
  const animate = () => {
    if (!isPaused) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      birds.forEach((bird) => {
        bird.update();
        cleanBirds();
      });
    }
    requestAnimationFrame(animate);
  };

  animate();
};
