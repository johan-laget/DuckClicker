document.addEventListener("DOMContentLoaded", function () {
  var isInterfaceVisible = localStorage.getItem("interfaceVisible");
  if (isInterfaceVisible === "true") {
    document.getElementById("interfaceparametre").style.display = "block";
  }
  document.getElementById("boutonparametre").onclick = function () {
    var interfaceParametre = document.getElementById("interfaceparametre");
    if (
      interfaceParametre.style.display === "none" ||
      !interfaceParametre.style.display
    ) {
      interfaceParametre.style.display = "block";
      localStorage.setItem("interfaceVisible", "false");
    } else {
      interfaceParametre.style.display = "none";
      localStorage.setItem("interfaceVisible", "false");
    }
  };
});

window.addEventListener("DOMContentLoaded", (event) => {
  const body = document.querySelector("body");
  body.style.cursor = `url('./assets/css/viseur0.png')4 12, auto`;
});
const changeCursorBtn = document.getElementById("changeCursorBtn");
const body = document.querySelector("body");

const cursorImages = [
  "./assets/css/viseur0.png",
  "./assets/css/viseur1.png",
  "./assets/css/viseur2.png",
  "./assets/css/viseur3.png",
  "./assets/css/viseur4.png",
  "./assets/css/viseur5.png",
];

let currentCursorIndex = localStorage.getItem("cursorIndex") || 0;

function changeCursor() {
  if (currentCursorIndex === cursorImages.length - 1) {
    currentCursorIndex = 0;
  } else {
    currentCursorIndex++;
  }
  const cursorImage = cursorImages[currentCursorIndex];
  document.body.style.cursor = `url('${cursorImage}')32 32, auto`;
  localStorage.setItem("cursorIndex", currentCursorIndex);
}
const changeCursorBtnIndex = document.getElementById("changeCursorBtn");
if (changeCursorBtnIndex) {
  changeCursorBtnIndex.addEventListener("click", changeCursor);
}
const changeCursorBtnGame = document.getElementById("changeCursorBtnGame");
if (changeCursorBtnGame) {
  changeCursorBtnGame.addEventListener("click", changeCursor);
}
window.addEventListener("DOMContentLoaded", () => {
  const savedCursorIndex = localStorage.getItem("cursorIndex") || 0;
  const cursorImage = cursorImages[savedCursorIndex];
  document.body.style.cursor = `url('${cursorImage}'), auto`;
});
