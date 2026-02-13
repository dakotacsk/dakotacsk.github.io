// Typing animation for hero subtitle
const phrases = [
  "ML Engineer.",
  "Creative Technologist.",
  "Film Enthusiast.",
  "Founder.",
  "Headphones Lover.",
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;
let deletingSpeed = 50;
let delayBetweenPhrases = 2000;

const typingText = document.getElementById("typing-text");

function typePhrase() {
  const currentPhrase = phrases[phraseIndex];

  if (!isDeleting) {
    // Typing
    if (charIndex < currentPhrase.length) {
      typingText.textContent += currentPhrase.charAt(charIndex);
      charIndex++;
      setTimeout(typePhrase, typingSpeed);
    } else {
      // Finished typing, wait before deleting
      isDeleting = true;
      setTimeout(typePhrase, delayBetweenPhrases);
    }
  } else {
    // Deleting
    if (charIndex > 0) {
      typingText.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      setTimeout(typePhrase, deletingSpeed);
    } else {
      // Finished deleting, move to next phrase
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typePhrase, 500);
    }
  }
}

// Start typing animation when page loads
window.addEventListener("load", () => {
  typePhrase();
});

// Sync video animation to scroll position (smooth + looping)
const scrollBgVideo = document.getElementById("scroll-bg-video");

// One viewport height of scroll = one full loop of the video
function getScrollTargetTime() {
  if (
    !scrollBgVideo ||
    !scrollBgVideo.duration ||
    isNaN(scrollBgVideo.duration)
  )
    return null;
  const scrollTop = window.scrollY;
  const scrollPerLoop = window.innerHeight;
  const loopProgress = (scrollTop / scrollPerLoop) % 1;
  if (loopProgress < 0) return (loopProgress + 1) * scrollBgVideo.duration;
  return loopProgress * scrollBgVideo.duration;
}

const LERP_SPEED = 0.14;
const LERP_DONE = 0.02;

function lerpVideoTime() {
  const target = getScrollTargetTime();
  if (target == null) return false;
  const duration = scrollBgVideo.duration;
  let current = scrollBgVideo.currentTime;
  let diff = target - current;
  if (Math.abs(diff) > duration * 0.5) {
    diff += diff > 0 ? -duration : duration;
  }
  if (Math.abs(diff) < LERP_DONE) {
    scrollBgVideo.currentTime = target;
    return false;
  }
  scrollBgVideo.currentTime = current + diff * LERP_SPEED;
  if (scrollBgVideo.currentTime < 0) scrollBgVideo.currentTime = 0;
  if (scrollBgVideo.currentTime >= duration) scrollBgVideo.currentTime = duration - 0.001;
  return true;
}

let rafId = null;
function onScroll() {
  if (rafId != null) return;
  rafId = requestAnimationFrame(function tick() {
    rafId = null;
    const keepGoing = lerpVideoTime();
    if (keepGoing) rafId = requestAnimationFrame(tick);
  });
}

if (scrollBgVideo) {
  scrollBgVideo.pause();

  let scrollBound = false;
  const bindScroll = () => {
    if (scrollBound) return;
    scrollBound = true;
    const t = getScrollTargetTime();
    if (t != null) scrollBgVideo.currentTime = t;
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  };

  scrollBgVideo.addEventListener("loadedmetadata", bindScroll);
  scrollBgVideo.addEventListener("canplay", bindScroll);
  if (scrollBgVideo.readyState >= 2) bindScroll();
}

// Initialize intersection observer for staggered animations
const observerOptions = {
  threshold: 0.05,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }, index * 80);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all glass cards
document.querySelectorAll(".glass-card").forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(20px)";
  card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(card);
});

// Subtle 3D tilt effect on hover
document.addEventListener("mousemove", (e) => {
  const cards = document.querySelectorAll(".glass-card");
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  cards.forEach((card, index) => {
    // Very subtle tilt for depth
    const tiltX = (y - 0.5) * 2;
    const tiltY = (x - 0.5) * 2;

    card.style.transform = `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(${index % 2 === 0 ? 15 : 5}px)`;
  });
});

// Reset on mouse leave
document.addEventListener("mouseleave", () => {
  const cards = document.querySelectorAll(".glass-card");
  cards.forEach((card) => {
    card.style.transform =
      "perspective(1200px) rotateX(0) rotateY(0) translateZ(0)";
  });
});

// Add subtle floating animation
const style = document.createElement("style");
style.textContent = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-8px);
    }
  }
  
  .glass-card {
    animation: float 6s ease-in-out infinite;
  }
`;
document.head.appendChild(style);

// Smooth scroll behavior
document.documentElement.style.scrollBehavior = "smooth";

console.log(
  "✨ Glass morphism effects and scroll-synced background initialized",
);
