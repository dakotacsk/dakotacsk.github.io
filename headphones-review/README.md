# Hz Club - Content Management Guide

This guide explains how to add new blog posts and headphone reviews to the Hz Club website.

## Table of Contents
- [Adding Headphone Reviews](#adding-headphone-reviews)
- [Adding Blog Posts](#adding-blog-posts)
- [Image Guidelines](#image-guidelines)
- [Content Guidelines](#content-guidelines)
- [File Structure](#file-structure)

## Adding Headphone Reviews

### 1. Add Review Data

All headphone reviews are stored in `headphones-data.js`. To add a new review:

1. Open `headphones-data.js`
2. Add a new object to the `headphonesData` array
3. Follow this structure:

```javascript
{
    id: 11, // Increment from the last ID
    name: "Headphone Name",
    subname: "Subtitle or Model",
    price: 299, // Price in USD
    image: "img/headphone_image.jpg", // Image filename in img/ folder
    tags: ["over-ear", "wired", "neutral", "closed-back", "studio"], // Relevant tags
    formFactor: "over-ear", // "over-ear", "on-ear", "in-ear", "earbuds"
    features: ["wired"], // ["wired", "wireless", "anc", "open-back"]
    soundSignature: "neutral", // "neutral", "warm", "bright", "v-shaped", "bass-heavy"
    ratings: {
        sound: 85, // 0-100
        functionality: 70, // 0-100
        price: 85, // 0-100
        overall: 80 // Calculated average
    },
    review: "One-line review summary",
    description: "Detailed description of the headphones"
}
```

### 2. Add Headphone Image

1. Place the headphone image in the `img/` folder
2. Use descriptive filename (e.g., `beyerdynamic_dt990_pro.jpg`)
3. Recommended image specs:
   - Format: JPG or WebP
   - Size: 800x800px minimum
   - Background: Clean, neutral background
   - Quality: High quality, well-lit

### 3. Update Filters (if needed)

If you're adding a new tag, form factor, or feature, update the filter options in `reviews.js`:

```javascript
// In reviews.js, update these arrays if needed:
const soundSignatures = ["neutral", "warm", "bright", "v-shaped", "bass-heavy"];
const formFactors = ["over-ear", "on-ear", "in-ear", "earbuds"];
const features = ["wired", "wireless", "anc", "open-back"];
```

## Adding Blog Posts

### 1. Create Blog Post HTML File

1. Create a new HTML file in the root directory (e.g., `blog-post-my-article.html`)
2. Use this template structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Article Title — Hz Club</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="blog-post.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <a href="index.html" class="nav-logo">Hz Club</a>
            <ul class="nav-links">
                <li><a href="reviews.html" class="nav-link">Reviews</a></li>
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

    <!-- Article -->
    <article class="blog-article">
        <div class="article-container">
            <header class="article-header">
                <div class="article-meta">
                    <span class="post-date">Dec 15, 2024</span>
                    <span class="post-category">Review</span>
                </div>
                <h1>Your Article Title</h1>
                <p class="article-subtitle">Your article subtitle or description.</p>
            </header>

            <div class="article-content">
                <p class="lead">Your lead paragraph here.</p>

                <h2>Your First Section</h2>
                <p>Your content here...</p>

                <blockquote>
                    "Your quote here."
                </blockquote>

                <h2>Another Section</h2>
                <p>More content...</p>

                <div class="article-footer">
                    <p class="author">— Dakota Chen</p>
                    <div class="article-nav">
                        <a href="blog.html" class="article-nav-link">← Back to Blog</a>
                        <a href="#" class="article-nav-link">Next Post →</a>
                    </div>
                </div>
            </div>
        </div>
    </article>

    <!-- Newsletter -->
    <section class="newsletter-section">
        <div class="section-container">
            <div class="newsletter-box">
                <h2>Stay Tuned</h2>
                <p>Get weekly posts about audio gear, culture, and the occasional rant. No spam, just vibes.</p>
                <form class="newsletter-form">
                    <input type="email" placeholder="your@email.com" class="newsletter-input" required>
                    <button type="submit" class="btn btn-primary">Subscribe</button>
                </form>
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
</body>
</html>
```

### 2. Add Blog Post to Blog Pages

Update the blog listing pages to include your new post:

1. **Main blog page** (`blog.html`): Add to the featured post or regular posts section
2. **Blog page 2** (`blog-page-2.html`): Add if needed for pagination
3. **Blog page 3** (`blog-page-3.html`): Add if needed for pagination

Example blog post entry:

```html
<article class="blog-post">
    <div class="post-content">
        <div class="post-meta">
            <span class="post-date">Dec 15, 2024</span>
            <span class="post-category">Review</span>
        </div>
        <h3><a href="blog-post-my-article.html" class="post-title">Your Article Title</a></h3>
        <p class="post-excerpt">Brief description of your article...</p>
        <a href="blog-post-my-article.html" class="post-link">Read More →</a>
    </div>
</article>
```

### 3. Update Pagination

If you're adding posts to different pages, update the pagination links accordingly.

## Image Guidelines

### Headphone Review Images
- **Size**: 800x800px minimum, square aspect ratio
- **Format**: JPG or WebP
- **Background**: Clean, neutral (white/gray preferred)
- **Lighting**: Well-lit, no harsh shadows
- **Angle**: 3/4 view or straight-on
- **Quality**: High resolution, sharp focus

### Blog Post Images
- **Size**: 1200x800px minimum, 3:2 aspect ratio
- **Format**: JPG or WebP
- **Style**: Consistent with site aesthetic
- **Content**: Relevant to article topic

## Content Guidelines

### Review Writing Style
- **Tone**: Casual, honest, slightly irreverent
- **Length**: 1-2 sentences for review summary
- **Focus**: Sound quality, comfort, value for money
- **Ratings**: Be consistent with existing scale

### Blog Post Writing Style
- **Tone**: Conversational, opinionated, educational
- **Length**: 800-2000 words
- **Structure**: Clear sections with H2 headings
- **Categories**: Review, Guide, Opinion, Technical, Culture, History, Essay

### Categories
- **Review**: Product reviews and comparisons
- **Guide**: How-to articles and tutorials
- **Opinion**: Personal takes and hot takes
- **Technical**: Deep dives into audio technology
- **Culture**: Headphone culture, trends, community
- **History**: Historical perspectives and vintage gear
- **Essay**: Longer-form thoughts and analysis

## File Structure

```
headphones-review/
├── index.html              # Homepage
├── reviews.html            # Reviews page
├── blog.html               # Blog main page
├── blog-page-2.html        # Blog page 2
├── blog-page-3.html        # Blog page 3
├── blog-post-*.html        # Individual blog posts
├── wizard.html             # Headphone wizard
├── about.html              # About page
├── styles.css              # Main styles
├── blog.css                # Blog page styles
├── blog-post.css           # Blog post styles
├── reviews.css             # Reviews page styles
├── headphones-data.js      # Headphone review data
├── reviews.js              # Reviews page functionality
├── img/                    # Images folder
│   ├── headphone_images/   # Headphone review images
│   └── blog_images/        # Blog post images
└── README.md               # This file
```

## Best Practices

1. **Consistency**: Follow existing naming conventions and formatting
2. **Testing**: Test your changes locally before deploying
3. **Images**: Optimize images for web (compress, use appropriate formats)
4. **Links**: Ensure all internal links work correctly
5. **SEO**: Use descriptive titles and meta descriptions
6. **Accessibility**: Include alt text for images and proper heading structure

## Common Issues

### Reviews not showing up
- Check that the ID is unique and sequential
- Verify the image path is correct
- Ensure all required fields are filled

### Blog posts not linking correctly
- Check file paths in href attributes
- Verify the HTML file exists
- Test internal navigation

### Images not loading
- Check file paths are relative to the HTML file
- Verify image files exist in the img/ folder
- Ensure image filenames match exactly (case-sensitive)

## Need Help?

If you encounter issues or need clarification:
1. Check this README first
2. Look at existing examples in the codebase
3. Contact the development team

---

*Last updated: December 2024* 