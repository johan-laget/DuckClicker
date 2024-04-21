document.addEventListener("DOMContentLoaded", function() {
    var audioPlayer = document.getElementById("audioPlayer");
    var toggleButton = document.getElementById("toggleSoundButton");
    var musicButton = document.getElementById("boutonmusique");

    var soundMuted = localStorage.getItem("soundMuted");
    if (soundMuted === "true") {
        audioPlayer.muted = true;
        toggleButton.innerHTML = "Activer le son";
        musicButton.innerHTML = "Activer musique";
    }

    audioPlayer.play();

    toggleButton.addEventListener("click", function() {
        toggleAudio();
    });

    musicButton.addEventListener("click", function() {
        toggleAudio();
    });

    function toggleAudio() {
        if (audioPlayer.muted) {
            audioPlayer.muted = false;
            toggleButton.innerHTML = "Couper le son";
            musicButton.innerHTML = "Couper musique";
            localStorage.setItem("soundMuted", "false");
        } else {
            audioPlayer.muted = true;
            toggleButton.innerHTML = "Activer le son";
            musicButton.innerHTML = "Activer musique";
            localStorage.setItem("soundMuted", "true");
        }
    }
});

window.addEventListener("click", () => {
    let tir = new Audio();
    tir.src = "./assets/audio/tirre1.mp3";
    tir.play();
});
