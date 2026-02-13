// function password(){
//     if (document.getElementById('password') == '1234') {
//         window.location.href = "http://www.google.com";
//     } else {
//         window.location.href = "http://www.bing.com";
//     }
// };
var userName = prompt("Please enter your name.")
if( userName=="Glenn"){
  alert("Hello " + userName + ",  welcome back.")
  var password = prompt("Please enter the code. Tip: it is hidden throughout.")
  if (password=='corknut'){
    alert('I never thought you would change your mind.')
    alert('But I suppose if I made a way to reverse it then there must have been a part of me that enjoyed the human company all along.')
    var stop = prompt('Are you sure you want to stop the plague? (y/n)')
    if (stop=='y'){
      alert('Congratulations.')
    } else{
      alert('Cold. Hearted.')
    }
  } else{
    alert('WRONG PASSWORD.')
    window.location.href = "/../maddaddam/index.html";
  }
}else if (userName=="Crake"){
  alert("Hello " + userName + ", have you forgotten your origins? Try again.")
  window.location.href = "/../maddaddam/index.html";
} else{
  alert("Who are you?")
  window.location.href = "/../maddaddam/index.html";
}

// Click "Congratulations!" to play animation

$(function() {
	var numberOfStars = 20;

	for (var i = 0; i < numberOfStars; i++) {
	  $('.congrats').append('<div class="blob fa fa-star ' + i + '"></div>');
	}

	animateText();

	animateBlobs();
});

$('.congrats').click(function() {
	reset();

	animateText();

	animateBlobs();
});

function reset() {
	$.each($('.blob'), function(i) {
		TweenMax.set($(this), { x: 0, y: 0, opacity: 1 });
	});

	TweenMax.set($('h1'), { scale: 1, opacity: 1, rotation: 0 });
}

function animateText() {
		TweenMax.from($('h1'), 0.8, {
		scale: 0.4,
		opacity: 0,
		rotation: 15,
		ease: Back.easeOut.config(4),
	});
}

function animateBlobs() {

	var xSeed = _.random(350, 380);
	var ySeed = _.random(120, 170);

	$.each($('.blob'), function(i) {
		var $blob = $(this);
		var speed = _.random(1, 5);
		var rotation = _.random(5, 100);
		var scale = _.random(0.8, 1.5);
		var x = _.random(-xSeed, xSeed);
		var y = _.random(-ySeed, ySeed);

		TweenMax.to($blob, speed, {
			x: x,
			y: y,
			ease: Power1.easeOut,
			opacity: 0,
			rotation: rotation,
			scale: scale,
			onStartParams: [$blob],
			onStart: function($element) {
				$element.css('display', 'block');
			},
			onCompleteParams: [$blob],
			onComplete: function($element) {
				$element.css('display', 'none');
			}
		});
	});
}
