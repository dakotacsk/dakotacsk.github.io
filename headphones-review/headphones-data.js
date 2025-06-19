// Headphone data from the original headfi site
const headphonesData = [
    {
        id: 1,
        name: "Beyerdynamic DT770 Pro",
        subname: "80 Ohms",
        price: 150,
        image: "img/dt770_80ohms.jpg",
        tags: ["over-ear", "wired", "neutral", "closed-back", "studio"],
        formFactor: "over-ear",
        features: ["wired"],
        soundSignature: "neutral",
        ratings: {
            sound: 85,
            functionality: 70,
            price: 85,
            overall: 80
        },
        review: "Tanky, bassy, treble sizzles like bacon. Perfect for the morning grind.",
        description: "Studio reference headphones with exceptional build quality and balanced sound signature. The 80-ohm version strikes the perfect balance between drivability and performance."
    },
    {
        id: 2,
        name: "AirPods Pro 2",
        subname: "2nd Generation",
        price: 250,
        image: "img/airpods_pro.jpeg",
        tags: ["in-ear", "wireless", "neutral", "anc", "apple"],
        formFactor: "earbuds",
        features: ["wireless", "anc"],
        soundSignature: "neutral",
        ratings: {
            sound: 75,
            functionality: 95,
            price: 66,
            overall: 78.75
        },
        review: "Everything-ish headphones that disappear from your ears",
        description: "Apple's flagship earbuds with impressive ANC, spatial audio, and seamless ecosystem integration. The convenience factor is unmatched."
    },
    {
        id: 3,
        name: "Koss KPH30i",
        subname: "Clear Edition",
        price: 30,
        image: "img/kph30i.jpeg",
        tags: ["on-ear", "wired", "warm", "open-back", "budget"],
        formFactor: "on-ear",
        features: ["wired", "open-back"],
        soundSignature: "warm",
        ratings: {
            sound: 80,
            functionality: 60,
            price: 94,
            overall: 78.5
        },
        review: "Cheap open-back headphone with BASS",
        description: "The gateway drug to audiophilia. These $30 headphones punch way above their weight class with a fun, engaging sound."
    },
    {
        id: 4,
        name: "Koss KSC75",
        subname: "Clip-On Classic",
        price: 20,
        image: "img/ksc75.jpg",
        tags: ["on-ear", "wired", "bright", "open-back", "budget"],
        formFactor: "on-ear",
        features: ["wired", "open-back"],
        soundSignature: "bright",
        ratings: {
            sound: 75,
            functionality: 60,
            price: 98,
            overall: 77.75
        },
        review: "Classics that have no business sounding this good for $20",
        description: "Legendary clip-on headphones that have achieved cult status. Bright, detailed sound that embarrasses headphones 10x the price."
    },
    {
        id: 5,
        name: "Koss Porta Pro",
        subname: "Retro Icon",
        price: 39,
        image: "img/porta_pro.jpg",
        tags: ["on-ear", "wired", "warm", "open-back", "retro"],
        formFactor: "on-ear",
        features: ["wired", "open-back"],
        soundSignature: "warm",
        ratings: {
            sound: 75,
            functionality: 65,
            price: 91,
            overall: 77
        },
        review: "80s styling with timeless sound",
        description: "The headphones that refuse to die. Warm, smooth sound with that nostalgic aesthetic that never goes out of style."
    },
    {
        id: 6,
        name: "Audio-Technica ATH-M40x",
        subname: "Studio Standard",
        price: 99,
        image: "img/ath_m40x.jpeg",
        tags: ["over-ear", "wired", "neutral", "closed-back", "studio"],
        formFactor: "over-ear",
        features: ["wired"],
        soundSignature: "neutral",
        ratings: {
            sound: 75,
            functionality: 70,
            price: 85,
            overall: 76.25
        },
        review: "The better M50x that nobody talks about",
        description: "Professional studio monitors with a more balanced tuning than their famous sibling. Excellent for mixing and critical listening."
    },
    {
        id: 7,
        name: "Grado SR80x",
        subname: "Brooklyn Made",
        price: 125,
        image: "img/grado_sr80x.jpg",
        tags: ["over-ear", "wired", "bright", "open-back", "audiophile"],
        formFactor: "over-ear",
        features: ["wired", "open-back"],
        soundSignature: "bright",
        ratings: {
            sound: 85,
            functionality: 50,
            price: 83,
            overall: 72.5
        },
        review: "Rock and roll in headphone form",
        description: "Hand-built in Brooklyn with a signature Grado sound. Bright, energetic, and perfect for guitar-driven music."
    },
    {
        id: 8,
        name: "Bose SoundSport Free",
        subname: "Wireless Sports",
        price: 200,
        image: "img/bose_soundsport_free.png",
        tags: ["in-ear", "wireless", "v-shaped", "sports"],
        formFactor: "earbuds",
        features: ["wireless"],
        soundSignature: "v-shaped",
        ratings: {
            sound: 70,
            functionality: 85,
            price: 60,
            overall: 71.75
        },
        review: "Bose gonna Bose",
        description: "Reliable sports earbuds with that classic Bose sound. Great for workouts but the case is comically large."
    },
    {
        id: 9,
        name: "AirPods 2",
        subname: "The Original",
        price: 160,
        image: "img/airpods2.jpeg",
        tags: ["in-ear", "wireless", "neutral", "apple"],
        formFactor: "earbuds",
        features: ["wireless"],
        soundSignature: "neutral",
        ratings: {
            sound: 60,
            functionality: 80,
            price: 63,
            overall: 67.75
        },
        review: "I hate the way they fit and they just don't sound that amazing tbh",
        description: "The earbuds that started it all. Convenience over quality, but sometimes that's exactly what you need."
    },
    {
        id: 10,
        name: "Beats Studio 3",
        subname: "Fashion First",
        price: 200,
        image: "img/beats_studio3.jpg",
        tags: ["over-ear", "wireless", "bass-heavy", "anc", "lifestyle"],
        formFactor: "over-ear",
        features: ["wireless", "anc"],
        soundSignature: "bass-heavy",
        ratings: {
            sound: 60,
            functionality: 78,
            price: 56,
            overall: 64.5
        },
        review: "Mudpuddles and fashion statements",
        description: "Style-focused headphones with that signature Beats bass. They've improved over the years but you're still paying for the logo."
    }
];

// Active filters state
let activeFilters = {
    soundSignature: [],
    formFactor: [],
    features: [],
    maxPrice: 1000
};

// Typing animation phrases
const typingPhrases = [
    "Where sound becomes an experience",
    "Curated for the discerning listener",
    "Find your perfect sonic companion",
    "Elevating everyday listening"
];

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initializeTypingAnimation();
    renderReviews();
    renderFilteredResults();
    initializeFilters();
    initializeScrollEffects();
    initializeCTAButtons();
    initializeThemeToggle();
});

// Typing animation
function initializeTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 100;

    function type() {
        const currentPhrase = typingPhrases[phraseIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingDelay = 50;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingDelay = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingDelay = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % typingPhrases.length;
            typingDelay = 500;
        }

        setTimeout(type, typingDelay);
    }

    type();
}

// Render review cards
function renderReviews() {
    const container = document.getElementById('reviewsGrid');
    const reviewsHTML = headphonesData.map(headphone => createReviewCard(headphone)).join('');
    container.innerHTML = reviewsHTML;
}

function createReviewCard(headphone) {
    return `
        <div class="review-card fade-in" data-id="${headphone.id}">
            <img src="${headphone.image}" alt="${headphone.name}" class="review-image">
            <div class="review-content">
                <div class="review-header">
                    <div>
                        <h3 class="review-title">${headphone.name}</h3>
                        <p class="review-subtitle">${headphone.subname}</p>
                    </div>
                    <span class="review-price">$${headphone.price}</span>
                </div>
                <div class="review-rating">
                    <span class="rating-value">${headphone.ratings.overall}%</span>
                    <div class="rating-bar">
                        <div class="rating-fill" style="width: ${headphone.ratings.overall}%"></div>
                    </div>
                </div>
                <div class="review-tags">
                    ${headphone.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <p class="review-description">${headphone.review}</p>
            </div>
        </div>
    `;
}

// Initialize filters
function initializeFilters() {
    // Sound signature filters
    document.querySelectorAll('.sound-filters .filter-chip').forEach(chip => {
        chip.addEventListener('click', function() {
            toggleFilter('soundSignature', this.dataset.filter, this);
        });
    });

    // Form factor filters
    document.querySelectorAll('.form-filters .filter-chip').forEach(chip => {
        chip.addEventListener('click', function() {
            toggleFilter('formFactor', this.dataset.filter, this);
        });
    });

    // Feature filters
    document.querySelectorAll('.feature-filters .filter-chip').forEach(chip => {
        chip.addEventListener('click', function() {
            toggleFilter('features', this.dataset.filter, this);
        });
    });

    // Price slider
    const priceSlider = document.getElementById('priceRange');
    const priceDisplay = document.getElementById('priceValue');
    
    priceSlider.addEventListener('input', function() {
        activeFilters.maxPrice = parseInt(this.value);
        priceDisplay.textContent = `$${this.value}`;
        renderFilteredResults();
    });
}

function toggleFilter(category, value, element) {
    element.classList.toggle('active');
    
    const index = activeFilters[category].indexOf(value);
    if (index > -1) {
        activeFilters[category].splice(index, 1);
    } else {
        activeFilters[category].push(value);
    }
    
    renderFilteredResults();
}

// Render filtered results
function renderFilteredResults() {
    const container = document.getElementById('resultsGrid');
    
    const filtered = headphonesData.filter(headphone => {
        // Price filter
        if (headphone.price > activeFilters.maxPrice) return false;
        
        // Sound signature filter
        if (activeFilters.soundSignature.length > 0 && 
            !activeFilters.soundSignature.includes(headphone.soundSignature)) return false;
        
        // Form factor filter
        if (activeFilters.formFactor.length > 0 && 
            !activeFilters.formFactor.includes(headphone.formFactor)) return false;
        
        // Features filter
        if (activeFilters.features.length > 0) {
            const hasAllFeatures = activeFilters.features.every(feature => 
                headphone.features.includes(feature)
            );
            if (!hasAllFeatures) return false;
        }
        
        return true;
    });

    // Update count
    document.querySelector('.results-count').textContent = `${filtered.length} matches`;
    
    // Render results
    const resultsHTML = filtered.map(headphone => createResultCard(headphone)).join('');
    container.innerHTML = resultsHTML || '<p class="no-results">No headphones match your criteria</p>';
}

function createResultCard(headphone) {
    return `
        <div class="result-card">
            <h4>${headphone.name}</h4>
            <p class="result-price">$${headphone.price}</p>
            <div class="result-rating">
                <span>${headphone.ratings.overall}%</span>
                <div class="mini-rating-bar">
                    <div class="rating-fill" style="width: ${headphone.ratings.overall}%"></div>
                </div>
            </div>
            <p class="result-description">${headphone.description}</p>
        </div>
    `;
}

// Scroll effects
function initializeScrollEffects() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.review-card, .philosophy-card').forEach(el => {
        observer.observe(el);
    });
}

// CTA button actions
function initializeCTAButtons() {
    document.querySelector('.cta-primary').addEventListener('click', () => {
        document.getElementById('reviews').scrollIntoView({ behavior: 'smooth' });
    });

    document.querySelector('.cta-secondary').addEventListener('click', () => {
        document.getElementById('selector').scrollIntoView({ behavior: 'smooth' });
    });
}

// Theme toggle (placeholder for future implementation)
function initializeThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', () => {
        // Future light/dark mode implementation
        console.log('Theme toggle clicked');
    });
}

// Add CSS for mini rating bar
const style = document.createElement('style');
style.textContent = `
    .result-rating {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0.5rem 0;
    }
    
    .mini-rating-bar {
        flex: 1;
        height: 4px;
        background: var(--surface-light);
        border-radius: 100px;
        overflow: hidden;
    }
    
    .result-price {
        color: var(--accent-purple);
        font-weight: 600;
        margin: 0.5rem 0;
    }
    
    .result-description {
        color: var(--text-secondary);
        font-size: 0.9rem;
        line-height: 1.6;
    }
    
    .no-results {
        text-align: center;
        color: var(--text-secondary);
        padding: 2rem;
    }
    
    .review-subtitle {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-top: 0.2rem;
    }
`;
document.head.appendChild(style);