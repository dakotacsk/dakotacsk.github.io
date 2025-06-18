// Matrix Rain Effect
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
const matrixArray = matrix.split("");

const fontSize = 10;
const columns = canvas.width / fontSize;

const drops = [];
for (let x = 0; x < columns; x++) {
  drops[x] = Math.floor(Math.random() * -100);
}

function drawMatrix() {
  ctx.fillStyle = 'rgba(0, 9, 19, 0.04)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#0F0';
  ctx.font = fontSize + 'px monospace';
  
  for (let i = 0; i < drops.length; i++) {
    const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

setInterval(drawMatrix, 35);

// Window resize handler
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Typing Animation
const typingTexts = [
  "Machine Learning Engineer",
  "AI Entrepreneur",
  "Netflix Formation Fellow",
  "Building the future with code",
  "Coffee → Code → Deploy → Repeat"
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 100;
const deletingSpeed = 50;
const pauseTime = 2000;

function typeText() {
  const currentText = typingTexts[textIndex];
  const typingElement = document.querySelector('.typing-text');
  
  if (!typingElement) return;
  
  if (isDeleting) {
    typingElement.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingElement.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
  }
  
  if (!isDeleting && charIndex === currentText.length) {
    setTimeout(() => {
      isDeleting = true;
      typeText();
    }, pauseTime);
    return;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % typingTexts.length;
    setTimeout(typeText, typingSpeed);
    return;
  }
  
  setTimeout(typeText, isDeleting ? deletingSpeed : typingSpeed);
}

// Start typing animation
setTimeout(typeText, 1000);

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Skill bars animation on scroll
const observerOptions = {
  threshold: 0.5,
  rootMargin: '0px 0px -50px 0px'
};

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const targetWidth = entry.target.getAttribute('data-width');
      if (targetWidth) {
        // Add a small delay for visual effect
        setTimeout(() => {
          entry.target.style.width = targetWidth;
        }, 100);
      }
      // Unobserve after animation to prevent re-triggering
      skillObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Initialize skill bars
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.skill-progress').forEach(skill => {
    skillObserver.observe(skill);
  });
});

// Visitor counter animation
function animateVisitorCount() {
  const counter = document.getElementById('visitor-count');
  if (!counter) return;
  
  const target = 42069;
  const increment = target / 100;
  let current = 0;
  
  const updateCounter = () => {
    current += increment;
    if (current < target) {
      counter.textContent = Math.floor(current).toLocaleString();
      requestAnimationFrame(updateCounter);
    } else {
      counter.textContent = target.toLocaleString();
    }
  };
  
  updateCounter();
}

// Random glitch effect on hover
document.querySelectorAll('.project-card, .leadership-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.animation = 'glitch-box 0.3s';
    setTimeout(() => {
      this.style.animation = '';
    }, 300);
  });
});

// Add glitch box animation
const style = document.createElement('style');
style.textContent = `
  @keyframes glitch-box {
    0%, 100% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(2px, -2px); }
    60% { transform: translate(-2px, -2px); }
    80% { transform: translate(2px, 2px); }
  }
`;
document.head.appendChild(style);

// Active section highlighting
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.3 });

sections.forEach(section => {
  sectionObserver.observe(section);
});

// Add active nav link styling
const navStyle = document.createElement('style');
navStyle.textContent = `
  .nav-link.active {
    border: 1px solid var(--accent-color);
    box-shadow: 0 0 10px var(--accent-color);
  }
`;
document.head.appendChild(navStyle);

// Timeline item hover effect
document.querySelectorAll('.timeline-item').forEach(item => {
  item.addEventListener('mouseenter', function() {
    this.classList.add('active');
  });
  
  item.addEventListener('mouseleave', function() {
    if (!this.classList.contains('current')) {
      this.classList.remove('active');
    }
  });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  animateVisitorCount();
  
  // Add current class to most recent timeline item
  const firstTimelineItem = document.querySelector('.timeline-item');
  if (firstTimelineItem) {
    firstTimelineItem.classList.add('current', 'active');
  }
  
  // Easter egg: Konami code
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;
  
  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        activateEasterEgg();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });
});

function activateEasterEgg() {
  document.body.style.animation = 'rainbow 3s';
  setTimeout(() => {
    document.body.style.animation = '';
    alert('🎮 Achievement Unlocked: Retro Gamer! 🎮');
  }, 3000);
}

// Add rainbow animation
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
  @keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }
`;
document.head.appendChild(rainbowStyle);

// Console Easter Egg
console.log('%c Welcome to Dakota\'s Portfolio! 🚀', 'font-size: 24px; color: #00ff00; font-weight: bold; text-shadow: 2px 2px 0 #000;');
console.log('%c Built with nostalgia and cutting-edge tech ❤️', 'font-size: 14px; color: #00bfff;');
console.log('%c Try the Konami Code! ↑↑↓↓←→←→BA', 'font-size: 12px; color: #ffcc00;');