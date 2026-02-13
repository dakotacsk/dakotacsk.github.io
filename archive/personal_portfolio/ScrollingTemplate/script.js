gsap.registerPlugin(ScrollTrigger);

gsap.to(".a",{
	x:"49%",
	rotation:0,
	duration:3,
  ease: "none",
	scrollTrigger: {
		trigger:'.a',
    end: "center center",
    toggleActions: "retart none none none",
    markers: false,
    scrub: true,
	},
});
