$("#container").mousemove(function(e) {
  parallaxIt(e, ".slide", -200);
  parallaxIt(e, "img", -60);
});

function parallaxIt(e, target, movement) {
  var $this = $("#container");
  var relX = e.pageX - $this.offset().left;
  var relY = e.pageY - $this.offset().top;

  TweenMax.to(target, 1, {
    x: (relX - $this.width()) / $this.width() * movement * 3,
    y: (relY - $this.height()) / $this.height() * movement * 2
  });
}
