#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load the headphones database
const { headphonesDatabase } = require('./headphones-database.js');

// Define CSV headers
const headers = [
    'id',
    'name',
    'price',
    'image',
    'type',
    'fit',
    'openClosed',
    'aesthetic',
    'sound',
    'bluetooth',
    'needsAmp',
    'noiseCancelling',
    'gaming',
    'sports',
    'appleFanboy',
    'tags',
    'description',
    'score',
    'soundReview',
    'buildReview',
    'featuresReview',
    'pros',
    'cons',
    'verdict'
];

// Convert array to CSV-safe string
function arrayToCSV(arr) {
    if (!arr || arr.length === 0) return '';
    return arr.join('|');
}

// Convert boolean to string
function boolToString(val) {
    return val === true ? 'true' : val === false ? 'false' : '';
}

// Escape CSV field
function escapeCSV(field) {
    if (field === null || field === undefined) return '';
    const str = String(field);
    // If field contains comma, quote, or newline, wrap in quotes and escape quotes
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

// Generate placeholder review content based on headphone data
function generateReviewContent(headphone) {
    const score = Math.round(70 + Math.random() * 20); // Random score between 70-90
    
    const soundReviews = {
        'v-shaped': 'The V-shaped tuning delivers excitement with boosted bass and treble. Bass hits hard without muddying the mids, while the elevated treble adds sparkle and detail. Great for modern genres but might fatigue some listeners.',
        'neutral': 'Reference-grade neutrality that lets recordings speak for themselves. No frequency range dominates, making these ideal for critical listening and mixing. What you hear is what was recorded.',
        'warm': 'Warm and inviting sound signature with a gentle bass boost and smooth treble. Never harsh or fatiguing, perfect for long listening sessions. Like a cozy blanket for your ears.',
        'bright': 'Bright and analytical presentation that extracts every detail. Treble-forward tuning reveals nuances but can be fatiguing with poor recordings. Acoustic instruments and vocals shine.',
        'bass-heavy': 'Bass-forward tuning that brings the thunder. Sub-bass extension is impressive, mid-bass has punch. Not for purists, but electronic and hip-hop fans will love it.',
        'balanced': 'Well-balanced tuning that does nothing wrong. Slight warmth keeps things musical while maintaining clarity. Jack of all trades, master of most.',
        'harman-neutral': 'Tuned to the Harman target curve for what research says most people prefer. Slight bass boost and treble presence over true neutral. Crowd-pleasing sound.',
        'analytical': 'Ruthlessly revealing of recording flaws. Detail retrieval is exceptional but can sound clinical. For when you want to hear everything, warts and all.',
        'analytical-bass': 'Analytical precision with added bass weight. Best of both worlds - detail and fun. Studio monitoring with a soul.',
        'neutral-bass': 'Mostly neutral with a tasteful bass boost. Adds body without sacrificing clarity. Perfect middle ground tuning.',
        'v-shaped-bright': 'V-shaped with extra treble emphasis. Exciting and energetic but can be too much for some. Proceed with caution.',
        'v-shaped-dark': 'V-shaped with rolled-off treble. Big bass without the brightness. Smooth and non-fatiguing.'
    };
    
    const buildReviews = {
        'over-ear': `Build quality ${headphone.price > 200 ? 'befits the price with premium materials' : 'is solid for the price point'}. Comfort is ${headphone.fit === 'over-ear' ? 'excellent with plush padding' : 'good for medium sessions'}. ${headphone.needsAmp ? 'The high impedance means you\'ll want a decent amp.' : 'Easy to drive from any source.'}`,
        'iem': `IEM build is ${headphone.price > 100 ? 'premium with quality cables and housings' : 'decent with acceptable cables'}. Fit depends on your ear shape but includes multiple tip sizes. ${headphone.aesthetic === 'modern' ? 'Modern design that looks as good as it sounds.' : 'Function over form, but that\'s fine at this price.'}`,
        'earbuds': `Earbud design ${headphone.openClosed === 'open' ? 'provides natural sound but limited isolation' : 'offers surprising isolation'}. Build quality is ${headphone.price > 150 ? 'premium as expected' : 'good enough to survive daily use'}. Comfort varies by ear shape.`
    };
    
    const featuresReview = generateFeaturesReview(headphone);
    
    const pros = generatePros(headphone);
    const cons = generateCons(headphone);
    
    const verdict = generateVerdict(headphone, score);
    
    return {
        score,
        soundReview: soundReviews[headphone.sound] || soundReviews['neutral'],
        buildReview: buildReviews[headphone.type] || buildReviews['over-ear'],
        featuresReview,
        pros: pros.join('|'),
        cons: cons.join('|'),
        verdict
    };
}

function generateFeaturesReview(headphone) {
    let features = [];
    
    if (headphone.bluetooth) {
        features.push('Bluetooth connectivity with reliable connection and decent battery life');
    }
    if (headphone.noiseCancelling) {
        features.push('Active noise cancelling that effectively reduces ambient noise');
    }
    if (headphone.gaming) {
        features.push('Gaming-ready with positional audio and included microphone');
    }
    if (headphone.sports) {
        features.push('Sweat-resistant design with secure fit for workouts');
    }
    if (headphone.appleFanboy) {
        features.push('Seamless Apple ecosystem integration with instant pairing and switching');
    }
    
    if (features.length === 0) {
        features.push('No fancy features here - just pure audio performance');
    }
    
    return features.join('. ') + '.';
}

function generatePros(headphone) {
    const pros = [];
    
    // Price-based pros
    if (headphone.price < 50) pros.push('Incredible value for money');
    if (headphone.price > 500) pros.push('Flagship build quality');
    
    // Sound-based pros
    const soundPros = {
        'v-shaped': 'Fun and engaging sound',
        'neutral': 'Reference-quality neutrality',
        'warm': 'Smooth, non-fatiguing sound',
        'bright': 'Exceptional detail retrieval',
        'bass-heavy': 'Bass that hits hard'
    };
    if (soundPros[headphone.sound]) pros.push(soundPros[headphone.sound]);
    
    // Feature pros
    if (headphone.bluetooth) pros.push('Wireless freedom');
    if (headphone.noiseCancelling) pros.push('Effective noise cancelling');
    if (!headphone.needsAmp) pros.push('Easy to drive');
    if (headphone.openClosed === 'open') pros.push('Spacious soundstage');
    
    return pros;
}

function generateCons(headphone) {
    const cons = [];
    
    // Price-based cons
    if (headphone.price > 300) cons.push('Premium price tag');
    if (headphone.price < 50) cons.push('Build quality reflects the price');
    
    // Sound-based cons
    const soundCons = {
        'v-shaped': 'Recessed mids',
        'bright': 'Can be fatiguing',
        'bass-heavy': 'Bass can overwhelm',
        'analytical': 'Can sound clinical'
    };
    if (soundCons[headphone.sound]) cons.push(soundCons[headphone.sound]);
    
    // Feature cons
    if (!headphone.bluetooth) cons.push('Wired only');
    if (headphone.needsAmp) cons.push('Needs amplification');
    if (headphone.openClosed === 'open') cons.push('No isolation');
    if (headphone.openClosed === 'closed') cons.push('Limited soundstage');
    
    return cons;
}

function generateVerdict(headphone, score) {
    const verdicts = {
        high: `At ${score}%, the ${headphone.name} earns our strong recommendation. ${headphone.price > 200 ? 'Yes, they\'re expensive, but you get what you pay for.' : 'Incredible value that punches way above its weight class.'} ${headphone.tags.includes('Studio') ? 'A studio workhorse that delivers.' : headphone.tags.includes('Budget') ? 'Budget audiophile bliss.' : 'A solid all-rounder.'}`,
        mid: `With a ${score}% score, the ${headphone.name} is a competent performer with some quirks. ${headphone.sound === 'v-shaped' ? 'The fun tuning won\'t be for everyone.' : 'Not perfect, but does enough right.'} Worth considering if the features align with your needs.`,
        low: `At ${score}%, the ${headphone.name} has its moments but faces stiff competition. ${headphone.price > 300 ? 'Hard to justify at this price point.' : 'There are better options available.'} For die-hard fans of the brand only.`
    };
    
    if (score >= 85) return verdicts.high;
    if (score >= 75) return verdicts.mid;
    return verdicts.low;
}

// Create CSV content
function createCSV() {
    const rows = [headers.join(',')];
    
    headphonesDatabase.forEach(headphone => {
        const reviewContent = generateReviewContent(headphone);
        
        const row = [
            headphone.id,
            escapeCSV(headphone.name),
            headphone.price,
            escapeCSV(headphone.image),
            escapeCSV(headphone.type),
            escapeCSV(headphone.fit),
            escapeCSV(headphone.openClosed),
            escapeCSV(headphone.aesthetic),
            escapeCSV(headphone.sound),
            boolToString(headphone.bluetooth),
            boolToString(headphone.needsAmp),
            boolToString(headphone.noiseCancelling),
            boolToString(headphone.gaming),
            boolToString(headphone.sports),
            boolToString(headphone.appleFanboy),
            escapeCSV(arrayToCSV(headphone.tags)),
            escapeCSV(headphone.description),
            reviewContent.score,
            escapeCSV(reviewContent.soundReview),
            escapeCSV(reviewContent.buildReview),
            escapeCSV(reviewContent.featuresReview),
            escapeCSV(reviewContent.pros),
            escapeCSV(reviewContent.cons),
            escapeCSV(reviewContent.verdict)
        ];
        
        rows.push(row.join(','));
    });
    
    return rows.join('\n');
}

// Write CSV file
const csvContent = createCSV();
const outputPath = path.join(__dirname, 'headphones-database.csv');

fs.writeFileSync(outputPath, csvContent, 'utf8');
console.log(`CSV exported successfully to: ${outputPath}`);
console.log(`Total headphones exported: ${headphonesDatabase.length}`);