document.addEventListener("DOMContentLoaded", function () {
    const logoImage = document.querySelector(".logo");
    const volumeCheckbox = document.getElementById("volume-on");
    const audio = document.getElementById("logo-audio");
  
    // Mute the audio by default
    audio.muted = true;

    // Uncheck the checkbox by default
    volumeCheckbox.checked = false;
  
    // Function to play the audio when the checkbox is checked
    function playAudio() {
      if (volumeCheckbox.checked) {
        audio.muted = false; // Unmute when the checkbox is checked
        audio.play();
      }
    }
  
    // Function to stop the audio
    function stopAudio() {
      audio.pause();
      audio.currentTime = 0;
    }
  
    logoImage.addEventListener("mouseenter", playAudio);
    logoImage.addEventListener("mouseleave", stopAudio);
  
    volumeCheckbox.addEventListener("change", function () {
      if (!volumeCheckbox.checked) {
        stopAudio();
      } 
    //   else {
    //     playAudio(); // If checkbox is checked, play audio with volume
    //   }
    });
  });
  