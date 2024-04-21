document.addEventListener("DOMContentLoaded", unmuteAudio);
function unmuteAudio() {
  let audioPlayer = document.getElementById("audioPlayer");
  audioPlayer.muted = false;
}

window.addEventListener("click", () => {
  let tir = new Audio();
  tir.src = "./assets/audio/tirre1.mp3";
  tir.play();
});
document.addEventListener("DOMContentLoaded", function() {
  var isInterfaceVisible = localStorage.getItem("interfaceVisible");
  if (isInterfaceVisible === "true") {
      document.getElementById("interfaceparametre").style.display = "block";
  }





  
document.getElementById("boutonparametre").onclick = function() {
      var interfaceParametre = document.getElementById("interfaceparametre");
      if (interfaceParametre.style.display === "none" || !interfaceParametre.style.display) {
          interfaceParametre.style.display = "block";
          localStorage.setItem("interfaceVisible", "false"); 
      } else {
          interfaceParametre.style.display = "none";
          localStorage.setItem("interfaceVisible", "false");
      }
  };
});


const cursorImages = [
  './assets/css/viseur0.png',
  './assets/css/viseur1.png',
  './assets/css/viseur2.png',
  './assets/css/viseur3.png',
  './assets/css/viseur4.png',
  './assets/css/viseur5.png'
];
const changeCursorBtn = document.getElementById('changeCursorBtn');
let currentCursorIndex = 0;
function changeCursor() {
  // Changer le curseur en fonction de l'index actuel
  document.body.style.cursor = `url('${cursorImages[currentCursorIndex]}'), auto`;
  // Incrémenter l'index pour passer à l'image de curseur suivante
  currentCursorIndex++;
  // Si on a atteint la fin de la liste, revenir au début
  if (currentCursorIndex === cursorImages.length) {
      currentCursorIndex = 0;
  }
}

// Écouteur d'événement pour le clic sur le bouton
changeCursorBtn.addEventListener('click', changeCursor);

// Appeler la fonction changeCursor au chargement de la page pour définir un curseur par défaut
changeCursor();

// ****
// Récupération des éléments sur lesquels vous voulez conserver le curseur actuel
const buttonElements = document.querySelectorAll('.bouton_index a');
const navElements = document.querySelectorAll('.nav_element');

// Gestionnaire d'événement pour conserver le curseur actuel lorsque vous survolez les boutons
buttonElements.forEach(button => {
    button.addEventListener('mouseover', () => {
        document.body.style.cursor = 'default';
    });
    button.addEventListener('mouseout', () => {
        document.body.style.cursor = 'auto';
    });
});

// Gestionnaire d'événement pour conserver le curseur actuel lorsque vous cliquez sur les boutons
buttonElements.forEach(button => {
    button.addEventListener('click', () => {
        document.body.style.cursor = 'default';
    });
});

// Gestionnaire d'événement pour conserver le curseur actuel lorsque vous survolez les éléments de navigation
navElements.forEach(nav => {
    nav.addEventListener('mouseover', () => {
        document.body.style.cursor = 'default';
    });
    nav.addEventListener('mouseout', () => {
        document.body.style.cursor = 'auto';
    });
});

// Gestionnaire d'événement pour conserver le curseur actuel lorsque vous cliquez sur les éléments de navigation
navElements.forEach(nav => {
    nav.addEventListener('click', () => {
        document.body.style.cursor = 'default';
    });
});
