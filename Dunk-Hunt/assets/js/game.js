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
    this.isBombe = false;
    this.isHurican = false;
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
      this.posX += this.isHurican ? this.speed / 2 : this.speed;
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
    const distance = Math.sqrt(
      Math.pow(x - (this.posX + this.width / 2), 2) +
        Math.pow(y - (this.posY + this.height / 2), 2)
    );
    if (this.isBombe && distance <= 150) {
      this.isAlive = false;
    } else if (
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
let infoBirds = {
  birdKilled: 0,
  birdTotal: 0,
};

const attacksActive = {
  isActiveSniper: false,
  isActiveHurican: false,
  isActiveBombe: false,
};

let isPaused = false;
let totalMoney = 0;
let birds = [];

//Elements DOM
const zone = document.getElementById("zone");
const money = document.getElementById("money");
const prices = document.querySelectorAll("#price");
const totalDuck = document.querySelector("#duck-total");
const killedDuck = document.querySelector("#duck-killed");
const sniper = document.getElementById("sniper");
const bombe = document.getElementById("bombe");
const hurican = document.getElementById("hurican");
killedDuck.innerHTML = 0;

//Save and Load part of the App
function saveDataToLStorage() {
  localStorage.setItem("money", totalMoney);
  localStorage.setItem("birdKilled", infoBirds.birdKilled);
  localStorage.setItem("birdTotal", infoBirds.birdTotal);
}
function loadGold() {
  const savedGold = localStorage.getItem("money");
  if (savedGold !== null) {
    totalMoney = parseInt(savedGold);
    money.innerHTML = totalMoney;
  }
}
function loadBirdKilled() {
  const savedData = localStorage.getItem("birdKilled");
  if (savedData !== null) {
    infoBirds.birdKilled = parseInt(savedData);
    killedDuck.innerHTML = infoBirds.birdKilled;
  }
}
function loadBirdTotal() {
  const savedData = localStorage.getItem("birdTotal");
  if (savedData !== null) {
    infoBirds.birdTotal = parseInt(savedData);
    totalDuck.innerHTML = infoBirds.birdTotal;
  }
}
loadGold();
loadBirdKilled();
loadBirdTotal();

//Pause trigger
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    isPaused = !isPaused;
  }
});

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

isMoney(totalMoney);

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

const createProgress = (max, value) => {
  const progress = document.createElement("progress");
  progress.setAttribute("id", "file");
  progress.setAttribute("max", max);
  progress.setAttribute("value", value);
  progress.className = "progress";
  return progress;
};

sniper.addEventListener("click", () => {
  if (attacksActive.isActiveSniper) return;
  if (totalMoney >= 20) {
    totalMoney -= 20;
    saveDataToLStorage();
    money.innerHTML = totalMoney;
    const progress = createProgress(10, 10);
    sniper.prepend(progress);
    let time = 10;
    let interval = setInterval(() => {
      if (time >= 0) {
        attacksActive.isActiveSniper = true;
        progress.setAttribute("value", `${time}`);
      } else {
        attacksActive.isActiveSniper = false;
        progress.remove();
        clearInterval(interval);
      }
      time--;
    }, 1000);
  }
});

const activeZone = () => {
  zone.style.display = "block";
  canvas.addEventListener("mousemove", (e) => {
    zone.style.left = e.clientX + "px";
    zone.style.top = e.clientY + "px";
  });
};

bombe.addEventListener("click", () => {
  if (attacksActive.isActiveBombe) return;
  if (totalMoney >= 50) {
    totalMoney -= 50;
    saveDataToLStorage();
    money.innerHTML = totalMoney;
    attacksActive.isActiveBombe = true;
    activeZone();
  }
});

hurican.addEventListener("click", () => {
  if (attacksActive.isActiveHurican) return;
  if (totalMoney >= 35) {
    totalMoney -= 35;
    saveDataToLStorage();
    money.innerHTML = totalMoney;
    const progress = createProgress(25, 25);
    hurican.prepend(progress);
    let time = 25;
    let interval = setInterval(() => {
      if (time >= 0) {
        attacksActive.isActiveHurican = true;
        progress.setAttribute("value", `${time}`);
      } else {
        attacksActive.isActiveHurican = false;
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
  if (isPaused) {
    return;
  }
  zone.style.display = "none";
  attacksActive.isActiveBombe = false;
  let mousePos = getMousePos(canvas, event);
  birds.forEach((bird) => {
    if (bird.isClicked(mousePos.x, mousePos.y)) {
      if (!bird.isAlive) {
        totalMoney += bird.gift;
        infoBirds.birdKilled++;
        killedDuck.innerHTML = infoBirds.birdKilled;
        saveDataToLStorage();
        isMoney(totalMoney);
        money.innerHTML = totalMoney;
      }
    }
  });
});

// Generer aleatoirement oiseaux

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function addBirdRandomly() {
  if (!isPaused) {
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
    infoBirds.birdTotal += 3;
    totalDuck.innerHTML = infoBirds.birdTotal;
  }
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
        bird.isSniper = attacksActive.isActiveSniper;
        bird.isBombe = attacksActive.isActiveBombe;
        bird.isHurican = attacksActive.isActiveHurican;
        bird.update();
        cleanBirds();
      });
      requestAnimationFrame(animate);
    } else {
      // If the game is paused, don't proceed with the animation loop
      // Instead, wait for the game to be unpaused
      requestAnimationFrame(animate);
    }
  };
  animate();
};
