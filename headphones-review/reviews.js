// Reviews Page JavaScript

// State
let currentFocusIndex = -1;
const reviewCards = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    initializeKeyboardNavigation();
    cacheReviewCards();
});

// Cache review cards for performance
function cacheReviewCards() {
    const cards = document.querySelectorAll('.review-card');
    cards.forEach(card => {
        reviewCards.push({
            element: card,
            type: card.dataset.type,
            features: card.dataset.features ? card.dataset.features.split(' ') : [],
            price: parseInt(card.dataset.price),
            rating: parseFloat(card.dataset.rating)
        });
    });
}

// Initialize filters
function initializeFilters() {
    const sortBy = document.getElementById('sortBy');
    const filterType = document.getElementById('filterType');
    const filterFeature = document.getElementById('filterFeature');
    
    sortBy.addEventListener('change', applyFilters);
    filterType.addEventListener('change', applyFilters);
    filterFeature.addEventListener('change', applyFilters);
}

// Apply filters and sorting
function applyFilters() {
    const sortBy = document.getElementById('sortBy').value;
    const filterType = document.getElementById('filterType').value;
    const filterFeature = document.getElementById('filterFeature').value;
    
    // Filter cards
    let filteredCards = reviewCards.filter(card => {
        let showCard = true;
        
        // Type filter
        if (filterType !== 'all' && card.type !== filterType) {
            showCard = false;
        }
        
        // Feature filter
        if (filterFeature !== 'all' && !card.features.includes(filterFeature)) {
            showCard = false;
        }
        
        return showCard;
    });
    
    // Sort cards
    filteredCards.sort((a, b) => {
        switch (sortBy) {
            case 'rating':
                return b.rating - a.rating;
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'newest':
            default:
                return 0; // Maintain original order
        }
    });
    
    // Update DOM
    updateReviewsGrid(filteredCards);
}

// Update the reviews grid
function updateReviewsGrid(filteredCards) {
    const grid = document.getElementById('reviewsGrid');
    
    // Hide all cards first
    reviewCards.forEach(card => {
        card.element.style.display = 'none';
        card.element.style.order = '';
    });
    
    // Show and order filtered cards
    filteredCards.forEach((card, index) => {
        card.element.style.display = 'block';
        card.element.style.order = index;
    });
    
    // Show no results message if needed
    if (filteredCards.length === 0) {
        if (!document.querySelector('.no-results')) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <h3>No headphones found</h3>
                <p>Try adjusting your filters to see more results.</p>
            `;
            grid.appendChild(noResults);
        }
    } else {
        const noResults = document.querySelector('.no-results');
        if (noResults) noResults.remove();
    }
}

// Keyboard navigation (J/K keys)
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        const visibleCards = reviewCards.filter(card => 
            card.element.style.display !== 'none'
        );
        
        if (visibleCards.length === 0) return;
        
        switch(e.key.toLowerCase()) {
            case 'j': // Next
                e.preventDefault();
                navigateToCard(1, visibleCards);
                break;
            case 'k': // Previous
                e.preventDefault();
                navigateToCard(-1, visibleCards);
                break;
            case 'enter':
                if (currentFocusIndex >= 0 && currentFocusIndex < visibleCards.length) {
                    const link = visibleCards[currentFocusIndex].element.querySelector('.review-link');
                    if (link) link.click();
                }
                break;
        }
    });
}

// Navigate to next/previous card
function navigateToCard(direction, visibleCards) {
    // Remove previous focus
    if (currentFocusIndex >= 0 && currentFocusIndex < visibleCards.length) {
        visibleCards[currentFocusIndex].element.classList.remove('keyboard-focus');
    }
    
    // Update index
    currentFocusIndex += direction;
    
    // Wrap around
    if (currentFocusIndex >= visibleCards.length) {
        currentFocusIndex = 0;
    } else if (currentFocusIndex < 0) {
        currentFocusIndex = visibleCards.length - 1;
    }
    
    // Apply focus and scroll into view
    const focusedCard = visibleCards[currentFocusIndex].element;
    focusedCard.classList.add('keyboard-focus');
    focusedCard.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

// Easter egg: Konami code
let konamiIndex = 0;
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

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

function activateEasterEgg() {
    document.body.style.animation = 'rainbow 3s ease-in-out';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 3000);
}

// Add rainbow animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);