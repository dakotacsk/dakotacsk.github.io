#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

// Read CSV file
function readCSV(filename) {
    const content = fs.readFileSync(filename, 'utf8');
    return csv.parse(content, {
        columns: true,
        skip_empty_lines: true
    });
}

// Convert string to boolean
function stringToBool(str) {
    return str === 'true';
}

// Convert pipe-separated string to array
function csvToArray(str) {
    if (!str) return [];
    return str.split('|').filter(item => item.trim());
}

// Format type for display
function formatType(type) {
    const typeMap = {
        'over-ear': 'Over-Ear',
        'iem': 'IEM',
        'earbuds': 'Earbuds'
    };
    return typeMap[type] || type;
}

// Format fit for display
function formatFit(fit) {
    const fitMap = {
        'over-ear': 'Over-Ear',
        'on-ear': 'On-Ear',
        'iem': 'In-Ear',
        'earbuds': 'Earbuds',
        'clip-on': 'Clip-On',
        'sports': 'Sports'
    };
    return fitMap[fit] || fit;
}

// Format sound signature for display
function formatSound(sound) {
    const soundMap = {
        'v-shaped': 'V-Shaped',
        'neutral': 'Neutral',
        'warm': 'Warm',
        'bright': 'Bright',
        'bass-heavy': 'Bass-Heavy',
        'balanced': 'Balanced',
        'harman-neutral': 'Harman Neutral',
        'analytical': 'Analytical',
        'analytical-bass': 'Analytical + Bass',
        'neutral-bass': 'Neutral + Bass',
        'v-shaped-bright': 'V-Shaped Bright',
        'v-shaped-dark': 'V-Shaped Dark'
    };
    return soundMap[sound] || sound;
}

// Generate review HTML from template and data
function generateReviewHTML(template, headphone) {
    let html = template;
    
    // Basic replacements
    html = html.replace(/{{NAME}}/g, headphone.name);
    html = html.replace(/{{SCORE}}/g, headphone.score || '80');
    html = html.replace(/{{PRICE}}/g, headphone.price);
    html = html.replace(/{{IMAGE}}/g, headphone.image);
    html = html.replace(/{{TYPE}}/g, formatType(headphone.type));
    html = html.replace(/{{SOUND}}/g, formatSound(headphone.sound));
    html = html.replace(/{{FIT}}/g, formatFit(headphone.fit));
    html = html.replace(/{{DESCRIPTION}}/g, headphone.description);
    
    // Generate tags HTML
    const tags = csvToArray(headphone.tags);
    const tagsHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join(' ');
    html = html.replace(/{{TAGS}}/g, tagsHTML);
    
    // Review content
    html = html.replace(/{{SOUND_REVIEW}}/g, headphone.soundReview || 'Sound review content to be added.');
    html = html.replace(/{{BUILD_REVIEW}}/g, headphone.buildReview || 'Build review content to be added.');
    html = html.replace(/{{FEATURES_REVIEW}}/g, headphone.featuresReview || 'Features review content to be added.');
    
    // Pros and cons
    const pros = csvToArray(headphone.pros);
    const prosHTML = pros.map(pro => `<li>${pro}</li>`).join('\n                    ');
    html = html.replace(/{{PROS}}/g, prosHTML);
    
    const cons = csvToArray(headphone.cons);
    const consHTML = cons.map(con => `<li>${con}</li>`).join('\n                    ');
    html = html.replace(/{{CONS}}/g, consHTML);
    
    // Verdict
    html = html.replace(/{{VERDICT}}/g, headphone.verdict || 'Verdict to be added.');
    
    return html;
}

// Generate filename from headphone name
function generateFilename(name) {
    return `review-${name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')}.html`;
}

// Main function
function generateReviews() {
    // Read template
    const templatePath = path.join(__dirname, 'review-template.html');
    const template = fs.readFileSync(templatePath, 'utf8');
    
    // Read CSV
    const csvPath = path.join(__dirname, 'headphones-database.csv');
    
    // Check if CSV exists
    if (!fs.existsSync(csvPath)) {
        console.error('Error: headphones-database.csv not found. Run export-to-csv.js first.');
        process.exit(1);
    }
    
    const headphones = readCSV(csvPath);
    
    // Generate review for each headphone
    let generated = 0;
    headphones.forEach(headphone => {
        const html = generateReviewHTML(template, headphone);
        const filename = generateFilename(headphone.name);
        const outputPath = path.join(__dirname, filename);
        
        fs.writeFileSync(outputPath, html, 'utf8');
        console.log(`Generated: ${filename}`);
        generated++;
    });
    
    console.log(`\nSuccessfully generated ${generated} review files.`);
    
    // Generate index of reviews for wizard.js
    generateReviewIndex(headphones);
}

// Generate a mapping file for wizard.js
function generateReviewIndex(headphones) {
    const index = {};
    
    headphones.forEach(headphone => {
        const filename = generateFilename(headphone.name);
        index[headphone.name] = filename;
    });
    
    const indexContent = `// Auto-generated review URL mapping
const reviewURLs = ${JSON.stringify(index, null, 4)};

// Export for use in wizard.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = reviewURLs;
}`;
    
    fs.writeFileSync(path.join(__dirname, 'review-urls.js'), indexContent, 'utf8');
    console.log('\nGenerated review-urls.js for wizard.js integration.');
}

// Check if csv-parse is installed
try {
    require('csv-parse/sync');
} catch (e) {
    console.error('Error: csv-parse module not found.');
    console.error('Please install it by running: npm install csv-parse');
    process.exit(1);
}

// Run the script
generateReviews();