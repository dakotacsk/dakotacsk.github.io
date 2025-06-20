// Wizard JavaScript

// Import the comprehensive headphone database
const script = document.createElement('script');
script.src = 'headphones-database.js';
document.head.appendChild(script);

// Wait for database to load
let headphones = [];
script.onload = () => {
    headphones = headphonesDatabase;
};

// Wizard state
let wizardState = {
    sound: null,
    budget: null,
    aesthetic: null,
    style: 50,
    styleEnabled: true,
    eq: {
        bass: 0,
        mids: 0,
        highs: 0
    },
    fitType: null,
    features: []
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeBudgetSlider();
    initializeFitTypeToggles();
    initializeFeatureCheckboxes();
    initializeSoundSlider();
    initializeAestheticToggles();
    initializeStyleSlider();
    initializeEQVisualizer();
    initializeMatchButton();
});

// Sound slider
function initializeSoundSlider() {
    const slider = document.getElementById('soundSlider');
    const soundValue = document.getElementById('soundValue');
    
    const soundOptions = ['none', 'mellow', 'neutral', 'sparkly', 'punchy'];
    const soundLabels = ['No Preference', 'Mellow', 'Neutral', 'Sparkly', 'Punchy'];
    
    slider.addEventListener('input', (e) => {
        const index = parseInt(e.target.value);
        
        if (index === 0) {
            wizardState.sound = null;
            soundValue.textContent = soundLabels[0];
        } else {
            wizardState.sound = soundOptions[index];
            soundValue.textContent = soundLabels[index];
        }
        
        // Update EQ based on sound preference
        updateEQFromSound();
    });
}

// Budget slider
function initializeBudgetSlider() {
    const slider = document.getElementById('budgetSlider');
    const value = document.getElementById('budgetValue');
    
    slider.addEventListener('input', (e) => {
        const sliderValue = parseInt(e.target.value);
        
        if (sliderValue === 0) {
            value.textContent = 'Any Budget';
            wizardState.budget = null;
        } else {
            value.textContent = `Under $${sliderValue}`;
            wizardState.budget = sliderValue;
        }
    });
}

// Fit type toggles
function initializeFitTypeToggles() {
    const toggles = document.querySelectorAll('input[name="fitType"]');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            if (e.target.value === 'none') {
                wizardState.fitType = null;
            } else {
                wizardState.fitType = e.target.value;
            }
        });
    });
}

// Feature checkboxes
function initializeFeatureCheckboxes() {
    const checkboxes = document.querySelectorAll('input[name="features"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                wizardState.features.push(e.target.value);
            } else {
                wizardState.features = wizardState.features.filter(f => f !== e.target.value);
            }
        });
    });
}

// Aesthetic toggles
function initializeAestheticToggles() {
    const toggles = document.querySelectorAll('input[name="aesthetic"]');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            if (e.target.value === 'none') {
                wizardState.aesthetic = null;
            } else {
                wizardState.aesthetic = e.target.value;
            }
        });
    });
}

// Style slider
function initializeStyleSlider() {
    const slider = document.getElementById('styleSlider');
    const styleValue = document.getElementById('styleValue');
    const skipCheckbox = document.getElementById('styleSkip');
    
    slider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        wizardState.style = value;
        
        // Update description based on position
        if (value < 20) {
            styleValue.textContent = 'Very Atmospheric';
        } else if (value < 40) {
            styleValue.textContent = 'Atmospheric';
        } else if (value < 60) {
            styleValue.textContent = 'Balanced';
        } else if (value < 80) {
            styleValue.textContent = 'Precise';
        } else {
            styleValue.textContent = 'Very Precise';
        }
    });
    
    skipCheckbox.addEventListener('change', (e) => {
        wizardState.styleEnabled = !e.target.checked;
        slider.disabled = e.target.checked;
        slider.style.opacity = e.target.checked ? '0.5' : '1';
    });
}

// Initialize EQ Visualizer
function initializeEQVisualizer() {
    const canvas = document.getElementById('eqCanvas');
    const ctx = canvas.getContext('2d');
    const bassSlider = document.getElementById('bassSlider');
    const midsSlider = document.getElementById('midsSlider');
    const highsSlider = document.getElementById('highsSlider');
    const presetButtons = document.querySelectorAll('.eq-preset');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 200;
    
    // Draw initial curve
    drawEQCurve();
    
    // Add slider listeners
    bassSlider.addEventListener('input', (e) => {
        wizardState.eq.bass = parseInt(e.target.value);
        drawEQCurve();
    });
    
    midsSlider.addEventListener('input', (e) => {
        wizardState.eq.mids = parseInt(e.target.value);
        drawEQCurve();
    });
    
    highsSlider.addEventListener('input', (e) => {
        wizardState.eq.highs = parseInt(e.target.value);
        drawEQCurve();
    });
    
    // Add preset listeners
    presetButtons.forEach(button => {
        button.addEventListener('click', () => {
            applyEQPreset(button.dataset.preset);
        });
    });
}

// Draw EQ curve on canvas
function drawEQCurve() {
    const canvas = document.getElementById('eqCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#D8D5D1';
    ctx.lineWidth = 1;
    
    // Horizontal center line
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    
    // Vertical lines
    for (let i = 0; i < 5; i++) {
        const x = (width / 4) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    // Draw curve
    ctx.strokeStyle = '#E63946';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    // Create smooth curve through control points
    const points = [
        { x: 0, y: centerY - (wizardState.eq.bass * 8) },
        { x: width * 0.25, y: centerY - (wizardState.eq.bass * 8) },
        { x: width * 0.5, y: centerY - (wizardState.eq.mids * 8) },
        { x: width * 0.75, y: centerY - (wizardState.eq.highs * 8) },
        { x: width, y: centerY - (wizardState.eq.highs * 8) }
    ];
    
    // Draw smooth curve
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 0; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    
    ctx.quadraticCurveTo(points[points.length - 1].x, points[points.length - 1].y, points[points.length - 1].x, points[points.length - 1].y);
    ctx.stroke();
    
    // Draw control points
    ctx.fillStyle = '#E63946';
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fill();
    });
}

// Apply EQ presets
function applyEQPreset(preset) {
    const presets = {
        'flat': { bass: 0, mids: 0, highs: 0 },
        'v-shaped': { bass: 5, mids: -3, highs: 5 },
        'warm': { bass: 3, mids: 1, highs: -2 },
        'bright': { bass: -2, mids: 1, highs: 4 }
    };
    
    const settings = presets[preset];
    wizardState.eq = settings;
    
    // Update sliders
    document.getElementById('bassSlider').value = settings.bass;
    document.getElementById('midsSlider').value = settings.mids;
    document.getElementById('highsSlider').value = settings.highs;
    
    drawEQCurve();
}

// Update EQ from sound preference
function updateEQFromSound() {
    if (!wizardState.sound) {
        applyEQPreset('flat');
        return;
    }
    
    const soundToPreset = {
        'mellow': 'warm',
        'neutral': 'flat',
        'sparkly': 'bright',
        'punchy': 'v-shaped'
    };
    
    applyEQPreset(soundToPreset[wizardState.sound]);
}

// Match button
function initializeMatchButton() {
    const button = document.getElementById('matchButton');
    button.addEventListener('click', findMatches);
}

// Find matches based on DOT flow logic
function findMatches() {
    // Filter headphones based on DOT decision tree
    let filteredHeadphones = [...headphones];
    
    // Step 1: Budget filter (primary branch)
    if (wizardState.budget !== null && wizardState.budget > 0) {
        filteredHeadphones = filteredHeadphones.filter(hp => hp.price <= wizardState.budget);
    }
    
    // Step 2: Fit type filter
    if (wizardState.fitType !== null) {
        filteredHeadphones = filteredHeadphones.filter(hp => hp.type === wizardState.fitType);
    }
    
    // Step 3: Feature requirements
    if (wizardState.features.length > 0) {
        filteredHeadphones = filteredHeadphones.filter(hp => {
            // Check each required feature
            for (const feature of wizardState.features) {
                switch(feature) {
                    case 'bluetooth':
                        if (!hp.bluetooth) return false;
                        break;
                    case 'anc':
                        if (!hp.noiseCancelling) return false;
                        break;
                    case 'gaming':
                        if (!hp.gaming) return false;
                        break;
                    case 'sports':
                        if (!hp.sports) return false;
                        break;
                    case 'apple':
                        if (!hp.appleFanboy) return false;
                        break;
                }
            }
            return true;
        });
    }
    
    // If no headphones match all criteria, relax the filtering
    if (filteredHeadphones.length === 0) {
        filteredHeadphones = [...headphones];
        if (wizardState.budget !== null && wizardState.budget > 0) {
            filteredHeadphones = filteredHeadphones.filter(hp => hp.price <= wizardState.budget * 1.5);
        }
    }
    
    // Calculate match scores for filtered headphones
    const matches = filteredHeadphones.map(hp => {
        let score = 100;
        let criteriaCount = 0;
        let matchedCriteria = 0;
        
        // Budget score (how close to budget)
        if (wizardState.budget !== null && wizardState.budget > 0) {
            criteriaCount++;
            const budgetRatio = hp.price / wizardState.budget;
            if (budgetRatio <= 0.5) {
                matchedCriteria += 0.8; // Good value
            } else if (budgetRatio <= 0.8) {
                matchedCriteria += 1; // Sweet spot
            } else if (budgetRatio <= 1) {
                matchedCriteria += 0.9; // At budget limit
            } else {
                matchedCriteria += 0.5; // Over budget
            }
        }
        
        // Fit type match
        if (wizardState.fitType !== null) {
            criteriaCount++;
            if (hp.type === wizardState.fitType) {
                matchedCriteria++;
            }
        }
        
        // Feature match score
        if (wizardState.features.length > 0) {
            criteriaCount++;
            let featureMatches = 0;
            for (const feature of wizardState.features) {
                switch(feature) {
                    case 'bluetooth':
                        if (hp.bluetooth) featureMatches++;
                        break;
                    case 'anc':
                        if (hp.noiseCancelling) featureMatches++;
                        break;
                    case 'gaming':
                        if (hp.gaming) featureMatches++;
                        break;
                    case 'sports':
                        if (hp.sports) featureMatches++;
                        break;
                    case 'apple':
                        if (hp.appleFanboy) featureMatches++;
                        break;
                }
            }
            matchedCriteria += featureMatches / wizardState.features.length;
        }
        
        // Sound preference match
        if (wizardState.sound !== null) {
            criteriaCount++;
            // Map sound preferences
            const soundMap = {
                'mellow': ['warm', 'neutral-bass', 'analytical-bass'],
                'neutral': ['neutral', 'harman-neutral', 'balanced'],
                'sparkly': ['bright', 'analytical'],
                'punchy': ['v-shaped', 'v-shaped-bright', 'v-shaped-dark', 'bass-heavy']
            };
            
            if (soundMap[wizardState.sound] && soundMap[wizardState.sound].includes(hp.sound)) {
                matchedCriteria++;
            } else if (hp.sound === wizardState.sound) {
                matchedCriteria++;
            } else {
                matchedCriteria += 0.3; // Partial match
            }
        }
        
        // EQ preference matching
        const eqAdjusted = Math.abs(wizardState.eq.bass) + Math.abs(wizardState.eq.mids) + Math.abs(wizardState.eq.highs) > 0;
        if (eqAdjusted) {
            criteriaCount++;
            let eqMatch = 0;
            if (wizardState.eq.bass > 3 && wizardState.eq.highs > 3 && wizardState.eq.mids < -1) {
                // V-shaped preference
                if (hp.sound.includes('v-shaped') || hp.sound === 'bass-heavy') eqMatch = 1;
                else eqMatch = 0.5;
            } else if (wizardState.eq.bass > 2 && wizardState.eq.highs < 0) {
                // Warm preference
                if (hp.sound === 'warm' || hp.sound.includes('bass')) eqMatch = 1;
                else eqMatch = 0.5;
            } else if (wizardState.eq.highs > 2 && wizardState.eq.bass < 0) {
                // Bright preference
                if (hp.sound === 'bright' || hp.sound === 'analytical') eqMatch = 1;
                else eqMatch = 0.5;
            } else {
                // Neutral preference
                if (hp.sound.includes('neutral') || hp.sound === 'balanced') eqMatch = 1;
                else eqMatch = 0.7;
            }
            matchedCriteria += eqMatch;
        }
        
        // Aesthetic match
        if (wizardState.aesthetic !== null) {
            criteriaCount++;
            const aestheticMap = {
                'low': ['modern', 'studio', 'clinical'],
                'mid': ['retro', 'sporty', 'gaming'],
                'high': ['retro', 'apple', 'luxury', 'flagship']
            };
            
            if (aestheticMap[wizardState.aesthetic] && aestheticMap[wizardState.aesthetic].includes(hp.aesthetic)) {
                matchedCriteria++;
            } else {
                matchedCriteria += 0.5;
            }
        }
        
        // Calculate final score
        if (criteriaCount > 0) {
            const matchRatio = matchedCriteria / criteriaCount;
            score = matchRatio * 100;
        }
        
        // Bonus points for popular/highly-rated models
        const popularModels = ['AirPods Pro 2', 'Sony WH-1000XM5', 'Sennheiser HD 600', 'Beyerdynamic DT770 Pro', 'Moondrop Aria'];
        if (popularModels.includes(hp.name)) {
            score += 5;
        }
        
        return {
            ...hp,
            matchScore: Math.max(0, Math.min(100, score))
        };
    });
    
    // Sort by score and take top 3
    const topMatches = matches
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3);
    
    // If we have fewer than 3 matches, add some random ones
    if (topMatches.length < 3) {
        const remaining = headphones
            .filter(hp => !topMatches.find(m => m.id === hp.id))
            .sort(() => Math.random() - 0.5)
            .slice(0, 3 - topMatches.length)
            .map(hp => ({ ...hp, matchScore: 40 + Math.random() * 20 }));
        topMatches.push(...remaining);
    }
    
    displayMatches(topMatches);
}

// Helper function to generate review URL
function getReviewURL(name) {
    // Generate consistent filename from headphone name
    const filename = `review/review-${name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')}.html`;
    return filename;
}

// Display matches
function displayMatches(matches) {
    const resultsSection = document.getElementById('wizardResults');
    const matchGrid = document.getElementById('matchGrid');
    
    matchGrid.innerHTML = matches.map((match, index) => {
        const zinger = getZinger(match, index);
        const reviewURL = getReviewURL(match.name);
        return `
            <div class="match-card">
                <img src="${match.image}" alt="${match.name}" class="match-image">
                <div class="match-content">
                    <h3>${match.name}</h3>
                    <div class="match-percentage">${Math.round(match.matchScore)}% Match</div>
                    <div class="match-tags">
                        ${match.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <p class="match-description">${zinger}</p>
                    <a href="${reviewURL}" class="match-link">Read Full Review →</a>
                </div>
            </div>
        `;
    }).join('');
    
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Get zinger based on match
function getZinger(match, rank) {
    const zingers = {
        'Beyerdynamic DT770 Pro': [
            "Built like a German tank, sounds like a Swiss watch.",
            "The headphone equivalent of a perfectly calibrated monitor."
        ],
        'AirPods Pro 2': [
            "For when you want good sound but also want to, you know, live your life.",
            "The Swiss Army knife of earbuds. Does everything pretty well."
        ],
        'Koss KPH30i': [
            "Costs less than a fancy coffee. Sounds better than headphones 10x the price.",
            "The people's champion. Ugly as sin, sounds like heaven."
        ],
        'Koss Porta Pro': [
            "Stranger Things called, they want their aesthetic back.",
            "What your dad wore in '85. What you should wear in '24."
        ],
        'Grado SR80x': [
            "Made in Brooklyn before it was cool. Still made there.",
            "For people who think guitars should sound like guitars."
        ],
        'Beats Studio 3': [
            "Sometimes you buy headphones for sound. Sometimes for the logo.",
            "Bass so heavy it needs its own gym membership."
        ]
    };
    
    const headphoneZingers = zingers[match.name] || ["Great choice!", "Solid pick."];
    return headphoneZingers[rank % headphoneZingers.length];
}