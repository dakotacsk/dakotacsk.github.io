(function($) {

		$(document).ready(function() {
			// Pause/Play functionality
			var playButton = $('.control-play'),
				album = $('.album');
			var audio = new Audio('josephineBakerThenIllBeHappy.mp3');
			var timesClicked = 0;
			audio.pause();

			playButton.on('click', function() {
				timesClicked++;
				$('.music-player-container').toggleClass('is-playing');
				if (timesClicked%2!=0) {
						//run second function
						audio.play();
				} else {
						//run first function
						audio.pause();
				}

			});
		});
	})(jQuery);
