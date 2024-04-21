document.addEventListener("DOMContentLoaded", function() {
    var audioPlayer = document.getElementById("audioPlayer");
    var toggleButton = document.getElementById("toggleSoundButton");

    var soundMuted = localStorage.getItem("soundMuted");
    if (soundMuted === "true") {
        audioPlayer.muted = true;
        toggleButton.innerHTML = "Activer le son";
    }

    toggleButton.addEventListener("click", function() {
        toggleAudio();
    });
    document.addEventListener("click", function() {
        audioPlayer.play().catch(function(error) {
            console.error("Erreur de lecture audio:", error);
        });
    });

    function toggleAudio() {
        if (audioPlayer.muted) {
            audioPlayer.muted = false;
            toggleButton.innerHTML = "Couper le son";
            localStorage.setItem("soundMuted", "false");
        } else {
            audioPlayer.muted = true;
            toggleButton.innerHTML = "Activer le son";
            localStorage.setItem("soundMuted", "true");
        }
    }
});
