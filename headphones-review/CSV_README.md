# Headphones Review CSV Export/Import System

This system allows you to export the headphones database to CSV format and generate individual review HTML files from CSV data.

## Prerequisites

- Node.js installed on your system
- npm (comes with Node.js)

## Setup

1. Install dependencies:
```bash
npm install
```

## Usage

### Export Database to CSV

To export the current headphones database to a CSV file:

```bash
npm run export-csv
```

This will create `headphones-database.csv` with all headphone data and generated review content.

### Generate Review HTML Files from CSV

To generate individual review HTML files from the CSV data:

```bash
npm run generate-reviews
```

This will:
- Read `headphones-database.csv`
- Use `review-template.html` as the template
- Generate individual review files like `review-beyerdynamic-dt770-pro.html`
- Create `review-urls.js` for wizard.js integration

### Build Everything

To run both export and generation in sequence:

```bash
npm run build
```

## CSV Structure

The CSV file contains the following columns:
- **id**: Unique identifier
- **name**: Headphone model name
- **price**: Price in USD
- **image**: Path to product image
- **type**: over-ear, iem, or earbuds
- **fit**: Specific fit type
- **openClosed**: open or closed design
- **aesthetic**: Design style
- **sound**: Sound signature
- **bluetooth**: true/false
- **needsAmp**: true/false
- **noiseCancelling**: true/false
- **gaming**: true/false
- **sports**: true/false
- **appleFanboy**: true/false
- **tags**: Pipe-separated list of tags
- **description**: Short description
- **score**: Review score (0-100)
- **soundReview**: Detailed sound review
- **buildReview**: Build quality review
- **featuresReview**: Features review
- **pros**: Pipe-separated list of pros
- **cons**: Pipe-separated list of cons
- **verdict**: Final verdict

## Editing Reviews

1. Export to CSV: `npm run export-csv`
2. Edit `headphones-database.csv` in Excel or any CSV editor
3. Generate updated HTML files: `npm run generate-reviews`

## Adding New Headphones

1. Add the headphone to `headphones-database.js`
2. Run `npm run build` to export and generate files
3. Or manually add to the CSV and run `npm run generate-reviews`

## Template Customization

Edit `review-template.html` to change the review layout. The template uses placeholders like `{{NAME}}`, `{{SCORE}}`, etc. that are replaced with actual data.

## File Naming Convention

Review files are named using this pattern:
- Spaces replaced with hyphens
- Special characters removed
- All lowercase
- Example: "AirPods Pro 2" becomes `review-airpods-pro-2.html`