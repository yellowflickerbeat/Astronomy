// Database of cosmic objects observed by both telescopes
const cosmicObjects = [
];

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchDropdown = document.getElementById('search-dropdown');
const randomBtn = document.getElementById('random-btn');
const jwstContainer = document.getElementById('jwst-container');
const hubbleContainer = document.getElementById('hubble-container');
const jwstInfo = document.getElementById('jwst-info');
const hubbleInfo = document.getElementById('hubble-info');
const analysisText = document.getElementById('analysis-text');

// Initialize stars
function createStars() {
    const starsContainer = document.querySelector('.stars');
    const numStars = 800; // Increased from 250
    
    // Clear existing stars
    starsContainer.innerHTML = '';
    
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random size classes with weighted distribution
        const rand = Math.random();
        if (rand < 0.7) { // Increased small star probability
            star.classList.add('small');
        } else if (rand < 0.9) {
            star.classList.add('medium');
        } else if (rand < 0.97) {
            star.classList.add('large');
        } else {
            star.classList.add('bright'); // Special bright blue stars
        }
        
        // Random position - ensure full coverage
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        
        // Ensure all stars twinkle with random timing
        star.style.animationDelay = Math.random() * 8 + 's'; // Extended range
        
        // All stars get twinkling animation
        const baseClass = star.classList[1];
        let baseDuration = 3;
        if (baseClass === 'small') baseDuration = 5; // Slower for visibility
        if (baseClass === 'medium') baseDuration = 4;
        if (baseClass === 'large') baseDuration = 3;
        if (baseClass === 'bright') baseDuration = 2;
        
        star.style.animationDuration = (baseDuration + (Math.random() - 0.5) * 2) + 's';
        
        starsContainer.appendChild(star);
    }
    
    // Add more constellation patterns
    createConstellations();
}

function createConstellations() {
    const starsContainer = document.querySelector('.stars');
    const numConstellations = 15; // Increased from 8
    
    for (let i = 0; i < numConstellations; i++) {
        // Full coverage positioning
        const centerX = Math.random() * 100; // Full width
        const centerY = Math.random() * 100; // Full height
        
        // Create 4-8 stars in each cluster
        const starsInConstellation = 4 + Math.random() * 4; // Increased cluster size
        const syncDelay = Math.random() * 6;
        
        for (let j = 0; j < starsInConstellation; j++) {
            const star = document.createElement('div');
            star.className = 'star medium';
            
            // Tighter clustering for better visibility
            star.style.left = Math.max(0, Math.min(100, centerX + (Math.random() - 0.5) * 8)) + '%';
            star.style.top = Math.max(0, Math.min(100, centerY + (Math.random() - 0.5) * 8)) + '%';
            
            // All constellation stars twinkle
            star.style.animationDelay = syncDelay + (Math.random() * 0.3) + 's';
            star.style.animationDuration = '3.5s';
            
            starsContainer.appendChild(star);
        }
    }
}

// Search functionality
function populateSearchDropdown(objects = cosmicObjects) {
    searchDropdown.innerHTML = '';
    
    objects.forEach(obj => {
        const item = document.createElement('div');
        item.className = 'search-item';
        item.innerHTML = `
            <span class="search-item-icon">${obj.icon}</span>
            <div>
                <strong>${obj.name}</strong>
                <div style="font-size: 0.9rem; color: #888;">${obj.type}</div>
            </div>
        `;
        
        item.addEventListener('click', () => {
            selectCosmicObject(obj);
            searchInput.value = obj.name;
            hideSearchDropdown();
        });
        
        searchDropdown.appendChild(item);
    });
}

// Document ready and initialization
document.addEventListener('DOMContentLoaded', function() {
    // Create twinkling stars
    createStars();
    
    // Initialize search dropdown
    populateSearchDropdown();
    
    // Initialize file upload handlers
    handleImageUpload('jwst-upload', 'jwst-container', 'jwst-info', 'JWST');
    handleImageUpload('hubble-upload', 'hubble-container', 'hubble-info', 'Hubble');
    
    console.log('Space Observatory Comparison initialized');
});

function showSearchDropdown() {
    searchDropdown.classList.add('active');
}

function hideSearchDropdown() {
    searchDropdown.classList.remove('active');
}

function filterObjects(query) {
    const filtered = cosmicObjects.filter(obj => 
        obj.name.toLowerCase().includes(query.toLowerCase()) ||
        obj.type.toLowerCase().includes(query.toLowerCase())
    );
    populateSearchDropdown(filtered);
}

// Select cosmic object and display images
function selectCosmicObject(obj) {
    // Update JWST side
    jwstContainer.innerHTML = `<img src="https://via.placeholder.com/400x300/1a0a2e/ff8a80?text=${encodeURIComponent('JWST: ' + obj.name)}" alt="JWST ${obj.name}">`;
    jwstContainer.classList.add('glow');
    
    jwstInfo.innerHTML = `
        <h3>${obj.name} - JWST</h3>
        <p><strong>Type:</strong> ${obj.type}</p>
        <p><strong>Infrared View:</strong> ${obj.description}</p>
        <p><strong>Wavelength:</strong> Near and mid-infrared (0.6 - 28.3 μm)</p>
    `;
    jwstInfo.classList.add('active');
    
    // Update Hubble side
    hubbleContainer.innerHTML = `<img src="https://via.placeholder.com/400x300/16213e/64b5f6?text=${encodeURIComponent('Hubble: ' + obj.name)}" alt="Hubble ${obj.name}">`;
    hubbleContainer.classList.add('glow');
    
    hubbleInfo.innerHTML = `
        <h3>${obj.name} - Hubble</h3>
        <p><strong>Type:</strong> ${obj.type}</p>
        <p><strong>Visible Light View:</strong> ${obj.description}</p>
        <p><strong>Wavelength:</strong> Ultraviolet, visible, near-infrared (0.1 - 2.5 μm)</p>
    `;
    hubbleInfo.classList.add('active');
    
    // Update analysis text with comparison
    updateAnalysisText(obj);
}

function updateAnalysisText(obj) {
    const comparisonText = getComparisonText(obj);
    analysisText.value = comparisonText;
}

function getComparisonText(obj) {
    const comparisons = {
        "Crab Nebula": "JWST reveals the intricate filamentary structure in infrared, showing warm dust and gas, while Hubble captures the visible light emission from the pulsar wind nebula. The infrared view penetrates dust clouds that obscure visible light observations.",
        
        "Eagle Nebula": "JWST's infrared vision pierces through the dense dust of the Pillars of Creation, revealing embedded protostars invisible to Hubble. Hubble's visible light image shows the dramatic sculptural beauty of the pillars, while JWST unveils the stellar nurseries within.",
        
        "Orion Nebula": "The temperature differences are stark - JWST shows cooler dust lanes and embedded young stellar objects, while Hubble captures the hot, ionized gas glowing in visible wavelengths. JWST reveals brown dwarfs and planetary disks invisible to Hubble.",
        
        "Whirlpool Galaxy": "JWST traces the warm dust in spiral arms and reveals the galaxy's skeletal structure, while Hubble shows star-forming regions and the galaxy's optical beauty. The infrared view highlights different stellar populations and dust distribution patterns."
    };
    
    return comparisons[obj.name] || `Comparing ${obj.name} between JWST and Hubble telescopes:\n\nJWST (Infrared observations):\n• Penetrates dust clouds\n• Reveals cooler objects\n• Shows stellar formation regions\n• Captures longer wavelengths\n\nHubble (Visible/UV observations):\n• Shows hot, luminous objects\n• Captures fine optical details\n• Reveals ionized gas structures\n• Higher resolution in visible light\n\nKey differences to analyze:\n• Color representation and temperature mapping\n• Structural details visible in each wavelength\n• Scientific insights unique to each telescope\n• Complementary nature of multi-wavelength astronomy`;
}

// Random selection
function selectRandomObject() {
    const randomIndex = Math.floor(Math.random() * cosmicObjects.length);
    const randomObj = cosmicObjects[randomIndex];
    selectCosmicObject(randomObj);
    searchInput.value = randomObj.name;
    
    // Add visual feedback to random button
    randomBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        randomBtn.style.transform = 'scale(1)';
    }, 150);
}

// File upload functionality
function handleImageUpload(inputId, containerId, infoId, telescope) {
    const input = document.getElementById(inputId);
    const container = document.getElementById(containerId);
    const info = document.getElementById(infoId);
    
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                container.innerHTML = `<img src="${e.target.result}" alt="${telescope} telescope image">`;
                container.classList.add('glow');
                
                // Show upload info
                info.innerHTML = `
                    <h3>Custom Upload - ${telescope}</h3>
                    <p><strong>File:</strong> ${file.name}</p>
                    <p><strong>Size:</strong> ${(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p>Custom image uploaded for comparison analysis.</p>
                `;
                info.classList.add('active');
            };
            reader.readAsDataURL(file);
        }
    });
}

// Event Listeners
searchInput.addEventListener('focus', () => {
    populateSearchDropdown();
    showSearchDropdown();
});

searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    if (query.length > 0) {
        filterObjects(query);
        showSearchDropdown();
    } else {
        populateSearchDropdown();
        showSearchDropdown()
    }
});
