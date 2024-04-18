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
