// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = 'var(--shadow)';
    }
    
    lastScroll = currentScroll;
});

// Form submission handling
const emailForm = document.querySelector('.email-form');
emailForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    // Create mailto link with subject and body
    const subject = encodeURIComponent('Pilot Program Application - Nuggy');
    const body = encodeURIComponent(`Hello Nuggy Team,\n\nI'm interested in joining your pilot program.\n\nEmail: ${email}\n\nLooking forward to hearing from you!\n\nBest regards`);
    window.location.href = `mailto:info@nuggy.io?subject=${subject}&body=${body}`;
    
    // Show success message with arrow animation
    const button = e.target.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Application Sent! ↗';
    button.style.background = '#34C759';
    button.style.color = '#FFFDF6';
    
    // Add arrow flick animation
    button.classList.add('success-animation');
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
        button.style.color = '';
        button.classList.remove('success-animation');
        e.target.reset();
    }, 3000);
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('section, .feature-card, .pricing-card, .step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add fade-in class styles
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .nav-links.active {
        display: flex;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #FFFDF6;
        flex-direction: column;
        padding: 2rem;
        box-shadow: var(--shadow-lg);
    }
    
    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .success-animation {
        animation: arrowFlick 0.15s ease-out;
    }
    
    @keyframes arrowFlick {
        0% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
        100% { transform: translateY(0); }
    }
    
    /* Logo reveal animation */
    @keyframes logoReveal {
        0% { 
            opacity: 0;
            transform: translateY(-30px) rotate(-10deg) scale(0.8);
        }
        50% {
            transform: translateY(0) rotate(5deg) scale(1.1);
        }
        100% {
            opacity: 1;
            transform: translateY(0) rotate(0) scale(1);
        }
    }
    
    /* Hero logo pulse */
    .hero-logo-img {
        animation: logoReveal 0.6s ease-out, logoPulse 3s ease-in-out infinite;
        animation-delay: 0s, 1s;
    }
    
    @keyframes logoPulse {
        0%, 100% { 
            filter: drop-shadow(0 4px 20px rgba(52, 199, 89, 0.2));
        }
        50% {
            filter: drop-shadow(0 6px 30px rgba(52, 199, 89, 0.4));
        }
    }
`;
document.head.appendChild(style);

// Add hover effects to buttons
document.querySelectorAll('button, .cta-button').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Handle "See How It Works" button
document.querySelector('.btn-secondary').addEventListener('click', function(e) {
    if (this.textContent === 'See How It Works') {
        e.preventDefault();
        document.querySelector('#how-it-works').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
});

// Animate metric values on scroll
const metricObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const metricValue = entry.target.querySelector('.metric-value');
            if (metricValue) {
                metricValue.style.animation = 'countUp 1s ease-out';
            }
            metricObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.metric-card').forEach(card => {
    metricObserver.observe(card);
});