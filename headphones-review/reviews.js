// Reviews Page JavaScript

// State
let currentFocusIndex = -1;
const reviewCards = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    initializeKeyboardNavigation();
    initializeClearFilters();
    initializeScrollEffect();
    cacheReviewCards();
});

// Add clear filters functionality
function initializeClearFilters() {
    const filterBar = document.querySelector('.filter-bar');
    if (!filterBar) return;
    
    // Create clear button
    const clearButton = document.createElement('button');
    clearButton.className = 'clear-filters';
    clearButton.textContent = 'Clear All';
    clearButton.addEventListener('click', clearAllFilters);
    
    // Position the button in the filter bar
    filterBar.style.position = 'relative';
    filterBar.appendChild(clearButton);
}

function clearAllFilters() {
    const filterType = document.getElementById('filterType');
    const filterFeatures = document.getElementById('filterFeatures');
    const filterPrice = document.getElementById('filterPrice');
    const sortBy = document.getElementById('sortBy');
    
    if (filterType) filterType.value = '';
    if (filterFeatures) filterFeatures.value = '';
    if (filterPrice) filterPrice.value = '';
    if (sortBy) sortBy.value = 'rating-desc';
    
    applyFilters();
}

// Add scroll effect to filter bar
function initializeScrollEffect() {
    const filterBar = document.querySelector('.filter-bar');
    if (!filterBar) return;
    
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            filterBar.classList.add('scrolled');
        } else {
            filterBar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

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
    const filterFeatures = document.getElementById('filterFeatures');
    const filterPrice = document.getElementById('filterPrice');
    
    // Update filter IDs to match HTML
    if (sortBy) sortBy.addEventListener('change', applyFilters);
    if (filterType) filterType.addEventListener('change', applyFilters);
    if (filterFeatures) filterFeatures.addEventListener('change', applyFilters);
    if (filterPrice) filterPrice.addEventListener('change', applyFilters);
    
    // Add filter count indicators
    updateFilterCounts();
}

// Apply filters and sorting
function applyFilters() {
    const sortBy = document.getElementById('sortBy')?.value || 'rating-desc';
    const filterType = document.getElementById('filterType')?.value || '';
    const filterFeatures = document.getElementById('filterFeatures')?.value || '';
    const filterPrice = document.getElementById('filterPrice')?.value || '';
    
    // Filter cards
    let filteredCards = reviewCards.filter(card => {
        let showCard = true;
        
        // Type filter
        if (filterType && card.type !== filterType) {
            showCard = false;
        }
        
        // Features filter
        if (filterFeatures) {
            if (filterFeatures === 'wireless' && !card.features.includes('wireless')) {
                showCard = false;
            } else if (filterFeatures === 'anc' && !card.features.includes('anc')) {
                showCard = false;
            } else if (filterFeatures === 'wired' && card.features.includes('wireless')) {
                showCard = false;
            }
        }
        
        // Price filter
        if (filterPrice) {
            const [min, max] = filterPrice.split('-').map(n => parseInt(n) || 99999);
            if (card.price < min || card.price > max) {
                showCard = false;
            }
        }
        
        return showCard;
    });
    
    // Sort cards
    filteredCards.sort((a, b) => {
        switch (sortBy) {
            case 'rating-desc':
                return b.rating - a.rating;
            case 'rating-asc':
                return a.rating - b.rating;
            case 'price-asc':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            case 'name-asc':
                return a.element.querySelector('h3').textContent.localeCompare(b.element.querySelector('h3').textContent);
            default:
                return 0;
        }
    });
    
    // Update DOM
    updateReviewsGrid(filteredCards);
    updateFilterCounts();
}

// Update filter count indicators
function updateFilterCounts() {
    let activeFilters = 0;
    
    const filterType = document.getElementById('filterType');
    const filterFeatures = document.getElementById('filterFeatures');
    const filterPrice = document.getElementById('filterPrice');
    
    if (filterType && filterType.value) activeFilters++;
    if (filterFeatures && filterFeatures.value) activeFilters++;
    if (filterPrice && filterPrice.value) activeFilters++;
    
    // Show/hide clear button
    const clearButton = document.querySelector('.clear-filters');
    if (clearButton) {
        clearButton.classList.toggle('show', activeFilters > 0);
    }
    
    // Update active state on select elements
    [filterType, filterFeatures, filterPrice].forEach(select => {
        if (select) {
            if (select.value) {
                select.style.backgroundColor = 'var(--text-main)';
                select.style.color = 'var(--white)';
            } else {
                select.style.backgroundColor = 'var(--bg-main)';
                select.style.color = 'var(--text-main)';
            }
        }
    });
}

// Update the reviews grid
function updateReviewsGrid(filteredCards) {
    const grid = document.getElementById('reviewsGrid');
    
    // Add filtering class for animation
    reviewCards.forEach(card => {
        card.element.classList.add('filtering');
    });
    
    // After a short delay, update visibility and remove animation class
    setTimeout(() => {
        // Hide all cards first
        reviewCards.forEach(card => {
            card.element.style.display = 'none';
            card.element.style.order = '';
        });
        
        // Show and order filtered cards
        filteredCards.forEach((card, index) => {
            card.element.style.display = 'block';
            card.element.style.order = index;
            // Stagger the animation
            setTimeout(() => {
                card.element.classList.remove('filtering');
            }, index * 30);
        });
    }, 150);
    
    // Show no results message if needed
    if (filteredCards.length === 0) {
        setTimeout(() => {
            if (!document.querySelector('.no-results')) {
                const noResults = document.createElement('div');
                noResults.className = 'no-results';
                noResults.innerHTML = `
                    <h3>No headphones found</h3>
                    <p>Try adjusting your filters to see more results.</p>
                `;
                grid.appendChild(noResults);
            }
        }, 200);
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