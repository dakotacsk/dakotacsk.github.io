// Music Player functionality
class MusicPlayer {
  constructor() {
    this.audioElement = document.getElementById('audio');
    this.playButton = document.querySelector('.play-button');
    this.isPlaying = false;
    
    this.init();
  }
  
  init() {
    // Add click event listener to play button
    this.playButton.addEventListener('click', () => this.togglePlayPause());
    
    // Add keyboard support (spacebar to play/pause)
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        this.togglePlayPause();
      }
    });
    
    // Update button state when audio events occur
    this.audioElement.addEventListener('play', () => this.updateButtonState(true));
    this.audioElement.addEventListener('pause', () => this.updateButtonState(false));
    this.audioElement.addEventListener('ended', () => this.updateButtonState(false));
  }
  
  togglePlayPause() {
    if (this.audioElement.paused) {
      this.play();
    } else {
      this.pause();
    }
  }
  
  play() {
    this.audioElement.play()
      .then(() => {
        this.isPlaying = true;
        console.log('Music started playing');
      })
      .catch(error => {
        console.error('Error playing audio:', error);
      });
  }
  
  pause() {
    this.audioElement.pause();
    this.isPlaying = false;
    console.log('Music paused');
  }
  
  updateButtonState(isPlaying) {
    this.isPlaying = isPlaying;
    // Add visual feedback
    this.playButton.setAttribute('aria-pressed', isPlaying.toString());
    this.playButton.style.opacity = isPlaying ? '0.8' : '1';
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize music player
  const musicPlayer = new MusicPlayer();
  
  // Add smooth scrolling for anchor links
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
  
  // Add intersection observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe main content sections
  document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
  
  // Add hover effect for images (excluding navbar and action buttons)
  const images = document.querySelectorAll('img:not(.navbar img):not(.contact-actions img):not(.play-button img)');
  images.forEach(img => {
    img.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
      this.style.transition = 'transform 0.3s ease';
    });
    
    img.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });
  
  // Console easter egg
  console.log('%c Welcome to Dakota\'s MySpace! 🎵', 'font-size: 20px; color: #749; font-weight: bold;');
  console.log('%c Built with love and nostalgia ❤️', 'font-size: 14px; color: #617830;');
});

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Handle window resize for responsive adjustments
const handleResize = debounce(() => {
  const width = window.innerWidth;
  const musicPlayer = document.querySelector('.music-player');
  
  // Adjust music player position on small screens
  if (width < 768 && musicPlayer) {
    musicPlayer.style.bottom = '10px';
    musicPlayer.style.left = '10px';
  } else if (musicPlayer) {
    musicPlayer.style.bottom = '20px';
    musicPlayer.style.left = '20px';
  }
}, 250);

window.addEventListener('resize', handleResize);

// Export for potential future use
window.MusicPlayer = MusicPlayer;