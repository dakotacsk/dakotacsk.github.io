$('#header').prepend('<div id="menu-icon"><span class="first"></span><span class="second"></span><span class="third"></span></div>');

	$("#menu-icon").on("click", function(){
    $("nav").slideToggle();
    $(this).toggleClass("active");
});

let tl = gsap.timeline({Defaults: { Easing: Expo.EaseOut}});

        tl.from('.bg', { scale: 0.6, duration: 2, opacity: 0, ease: Expo.easeOut, delay: 0.2})
          .to('.text-reveal', { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', y:0, stagger: .3, duration: 1}, "-=2.9")
          .to('.text-reveal', { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)', y: -200, duration: .2, delay: .5})
          .to('.text-reveal', { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', stagger: .3, duration: .3, delay: .5})
          .to('svg', { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', y: -150 })
          .to('.local', { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',y: 0, stagger: .3, opacity: 1, duration: 1}, "-=1.4" )
