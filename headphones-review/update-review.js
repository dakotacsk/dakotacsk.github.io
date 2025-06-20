#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

// Read command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
    console.log('Usage: node update-review.js <headphone-name> <field> [value]');
    console.log('Example: node update-review.js "Beyerdynamic DT770 Pro" score 85');
    console.log('Example: node update-review.js "AirPods Pro 2" soundReview "New detailed sound review..."');
    console.log('\nAvailable fields: score, soundReview, buildReview, featuresReview, pros, cons, verdict');
    process.exit(1);
}

const headphoneName = args[0];
const field = args[1];
const value = args.slice(2).join(' ');

// Valid fields that can be updated
const validFields = ['score', 'soundReview', 'buildReview', 'featuresReview', 'pros', 'cons', 'verdict'];

if (!validFields.includes(field)) {
    console.error(`Error: "${field}" is not a valid field.`);
    console.log('Valid fields:', validFields.join(', '));
    process.exit(1);
}

// Read CSV
const csvPath = path.join(__dirname, 'headphones-database.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');
const records = csv.parse(csvContent, {
    columns: true,
    skip_empty_lines: true
});

// Find the headphone
const headphoneIndex = records.findIndex(r => r.name === headphoneName);

if (headphoneIndex === -1) {
    console.error(`Error: Headphone "${headphoneName}" not found in database.`);
    console.log('Available headphones:');
    records.forEach(r => console.log(`  - ${r.name}`));
    process.exit(1);
}

// Update the field
if (value) {
    records[headphoneIndex][field] = value;
    console.log(`Updated ${field} for "${headphoneName}"`);
} else {
    // If no value provided, show current value
    console.log(`Current ${field} for "${headphoneName}":`);
    console.log(records[headphoneIndex][field]);
    process.exit(0);
}

// Convert back to CSV
const { stringify } = require('csv-stringify/sync');
const output = stringify(records, {
    header: true,
    quoted: true,
    quoted_empty: false
});

// Write back to file
fs.writeFileSync(csvPath, output, 'utf8');
console.log('CSV updated successfully.');

// Ask if user wants to regenerate HTML
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question('Regenerate HTML files? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
        console.log('Regenerating HTML files...');
        require('./generate-reviews-from-csv.js');
    }
    readline.close();
});