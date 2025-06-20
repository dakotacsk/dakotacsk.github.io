const fs = require('fs');
const csv = require('csv-parser');

// Read the CSV and generate review cards HTML
const reviewCards = [];

fs.createReadStream('headphones-database.csv')
    .pipe(csv())
    .on('data', (row) => {
        // Parse features for data attributes
        const features = [];
        if (row.bluetooth === 'true') features.push('wireless');
        if (row.noiseCancelling === 'true') features.push('anc');
        if (row.gaming === 'true') features.push('gaming');
        if (row.sports === 'true') features.push('sports');
        if (row.needsAmp === 'true') features.push('amp-required');
        
        const featureString = features.join(' ');
        
        // Generate review URL
        const reviewUrl = `review/review-${row.name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')}.html`;
        
        // Create subtitle based on description or features
        let subtitle = row.description.split('.')[0];
        if (subtitle.length > 40) {
            subtitle = subtitle.substring(0, 37) + '...';
        }
        
        // Generate review card HTML
        const cardHtml = `
                <!-- ${row.name} -->
                <article class="review-card" data-type="${row.type}" data-features="${featureString}" data-price="${row.price}" data-rating="${row.score}">
                    <a href="${reviewUrl}" class="review-link">
                        <div class="review-image">
                            <img src="${row.image}" alt="${row.name}">
                            <div class="review-overlay">
                                <span class="btn-read">Read Review</span>
                            </div>
                        </div>
                        <div class="review-content">
                            <h3>${row.name}</h3>
                            <p class="review-subtitle">${subtitle}</p>
                            <div class="review-meta">
                                <span class="review-rating">${row.score}%</span>
                                <span class="review-price">$${row.price}</span>
                            </div>
                            <div class="review-tags">
                                ${row.tags.split('|').map(tag => `<span class="tag">${tag}</span>`).join('\n                                ')}
                            </div>
                            <p class="review-excerpt">${row.verdict.split('.')[0]}.</p>
                        </div>
                    </a>
                </article>`;
        
        reviewCards.push(cardHtml);
    })
    .on('end', () => {
        // Write the generated cards to a file
        const output = reviewCards.join('\n');
        fs.writeFileSync('review-cards.html', output);
        console.log(`Generated ${reviewCards.length} review cards in review-cards.html`);
        
        // Also create a full reviews page
        const fullPage = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Reviews — Hz Club</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="reviews.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <a href="index.html" class="nav-logo">Hz Club</a>
            <ul class="nav-links">
                <li><a href="reviews.html" class="nav-link active">Reviews</a></li>
                <li><a href="blog.html" class="nav-link">Blog</a></li>
                <li><a href="wizard.html" class="nav-link">Wizard</a></li>
                <li><a href="about.html" class="nav-link">About</a></li>
            </ul>
            <button class="nav-toggle" aria-label="Menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </nav>

    <!-- Page Header -->
    <header class="page-header">
        <div class="section-container">
            <h1>All Reviews</h1>
            <p class="page-subtitle">Brutally honest takes on ${reviewCards.length} headphones. No sugar coating.</p>
        </div>
    </header>

    <!-- Filter Bar -->
    <section class="filter-bar">
        <div class="section-container">
            <div class="filter-controls">
                <div class="filter-group">
                    <label>Type</label>
                    <select id="filterType">
                        <option value="">All Types</option>
                        <option value="over-ear">Over-Ear</option>
                        <option value="iem">IEM/Earbuds</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label>Features</label>
                    <select id="filterFeatures">
                        <option value="">All Features</option>
                        <option value="wireless">Wireless</option>
                        <option value="anc">Noise Cancelling</option>
                        <option value="wired">Wired Only</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label>Price</label>
                    <select id="filterPrice">
                        <option value="">All Prices</option>
                        <option value="0-50">Under $50</option>
                        <option value="50-150">$50 - $150</option>
                        <option value="150-300">$150 - $300</option>
                        <option value="300-99999">$300+</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label>Sort By</label>
                    <select id="sortBy">
                        <option value="rating-desc">Highest Rated</option>
                        <option value="rating-asc">Lowest Rated</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="name-asc">Name: A-Z</option>
                    </select>
                </div>
            </div>
        </div>
    </section>

    <!-- Reviews Grid -->
    <section class="reviews-section">
        <div class="section-container">
            <div class="reviews-grid" id="reviewsGrid">
${output}
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-section">
                <h4>Hz Club</h4>
                <p>Brutally honest headphone reviews.</p>
            </div>
            <div class="footer-section">
                <h4>Navigate</h4>
                <ul>
                    <li><a href="reviews.html">Reviews</a></li>
                    <li><a href="blog.html">Blog</a></li>
                    <li><a href="wizard.html">Wizard</a></li>
                    <li><a href="about.html">About</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Connect</h4>
                <p>Questions? <a href="mailto:hello@hzclub.com">hello@hzclub.com</a></p>
                <p>Press J/K to navigate reviews</p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 Hz Club. Built like a Leica, sounds like a film score.</p>
        </div>
    </footer>

    <script src="reviews.js"></script>
</body>
</html>`;
        
        fs.writeFileSync('reviews-all.html', fullPage);
        console.log('Generated full reviews page: reviews-all.html');
    });