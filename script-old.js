function togglePlayPause() {
  var myVideo = document.getElementById("audio");
  if (myVideo.paused) {
    myVideo.play();
  } else {
    myVideo.pause();
  }
}
