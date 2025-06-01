// Database of cosmic objects observed by both telescopes
const cosmicObjects = [
    {
        name: "Crab Nebula",
        icon: "🦀",
        type: "Supernova Remnant",
        jwstImage: "jwst-crab-nebula.jpg",
        hubbleImage: "hubble-crab-nebula.jpg",
        description: "A supernova remnant from a star that exploded in 1054 AD"
    },
    {
        name: "Eagle Nebula",
        icon: "🦅",
        type: "Star-forming Region",
        jwstImage: "jwst-eagle-nebula.jpg",
        hubbleImage: "hubble-eagle-nebula.jpg",
        description: "Famous for its 'Pillars of Creation' star-forming columns"
    },
    {
        name: "Orion Nebula",
        icon: "⭐",
        type: "Star-forming Region",
        jwstImage: "jwst-orion-nebula.jpg",
        hubbleImage: "hubble-orion-nebula.jpg",
        description: "One of the brightest nebulae visible to the naked eye"
    },
    {
        name: "Horsehead Nebula",
        icon: "🐴",
        type: "Dark Nebula",
        jwstImage: "jwst-horsehead-nebula.jpg",
        hubbleImage: "hubble-horsehead-nebula.jpg",
        description: "A dark nebula silhouetted against bright emission nebula"
    },
    {
        name: "Cat's Eye Nebula",
        icon: "👁️",
        type: "Planetary Nebula",
        jwstImage: "jwst-cats-eye-nebula.jpg",
        hubbleImage: "hubble-cats-eye-nebula.jpg",
        description: "A complex planetary nebula with intricate knots and jets"
    },
    {
        name: "Ring Nebula",
        icon: "💍",
        type: "Planetary Nebula",
        jwstImage: "jwst-ring-nebula.jpg",
        hubbleImage: "hubble-ring-nebula.jpg",
        description: "A classic example of a planetary nebula in Lyra"
    },
    {
        name: "Whirlpool Galaxy",
        icon: "🌀",
        type: "Spiral Galaxy",
        jwstImage: "jwst-whirlpool-galaxy.jpg",
        hubbleImage: "hubble-whirlpool-galaxy.jpg",
        description: "A grand design spiral galaxy with prominent spiral arms"
    },
    {
        name: "Andromeda Galaxy",
        icon: "🌌",
        type: "Spiral Galaxy",
        jwstImage: "jwst-andromeda-galaxy.jpg",
        hubbleImage: "hubble-andromeda-galaxy.jpg",
        description: "The nearest major galaxy to the Milky Way"
    },
    {
        name: "Jupiter",
        icon: "🪐",
        type: "Planet",
        jwstImage: "jwst-jupiter.jpg",
        hubbleImage: "hubble-jupiter.jpg",
        description: "The largest planet in our solar system"
    },
    {
        name: "Saturn",
        icon: "🪐",
        type: "Planet",
        jwstImage: "jwst-saturn.jpg",
        hubbleImage: "hubble-saturn.jpg",
        description: "The ringed planet with its beautiful ring system"
    },
    {
        name: "Southern Ring Nebula",
        icon: "💫",
        type: "Planetary Nebula",
        jwstImage: "jwst-southern-ring.jpg",
        hubbleImage: "hubble-southern-ring.jpg",
        description: "A bright planetary nebula in the constellation Vela"
    },
    {
        name: "Stephan's Quintet",
        icon: "👥",
        type: "Galaxy Group",
        jwstImage: "jwst-stephans-quintet.jpg",
        hubbleImage: "hubble-stephans-quintet.jpg",
        description: "A visual grouping of five galaxies in Pegasus"
    }
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
    const numStars = 250;
    
    // Clear existing stars
    starsContainer.innerHTML = '';
    
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random size classes with weighted distribution
        const rand = Math.random();
        if (rand < 0.6) {
            star.classList.add('small');
        } else if (rand < 0.85) {
            star.classList.add('medium');
        } else if (rand < 0.95) {
            star.classList.add('large');
        } else {
            star.classList.add('bright'); // Special bright blue stars
        }
        
        // Random position
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        
        // Random animation delay for natural, non-synchronized twinkling
        star.style.animationDelay = Math.random() * 6 + 's';
        
        // Slightly vary animation duration for more organic feel
        const baseClass = star.classList[1]; // small, medium, large, or bright
        let baseDuration = 3;
        if (baseClass === 'small') baseDuration = 4;
        if (baseClass === 'medium') baseDuration = 3;
        if (baseClass === 'large') baseDuration = 5;
        if (baseClass === 'bright') baseDuration = 2.5;
        
        star.style.animationDuration = (baseDuration + (Math.random() - 0.5) * 2) + 's';
        
        starsContainer.appendChild(star);
    }
    
    // Add some constellation-like patterns
    createConstellations();
}

// Create small groups of stars that twinkle together
function createConstellations() {
    const starsContainer = document.querySelector('.stars');
    const numConstellations = 8;
    
    for (let i = 0; i < numConstellations; i++) {
        // Random position for constellation center
        const centerX = Math.random() * 80 + 10; // Keep away from edges
        const centerY = Math.random() * 80 + 10;
        
        // Create 3-6 stars in a small cluster
        const starsInConstellation = 3 + Math.random() * 3;
        const syncDelay = Math.random() * 5;
        
        for (let j = 0; j < starsInConstellation; j++) {
            const star = document.createElement('div');
            star.className = 'star medium';
            
            // Position within 5% radius of center
            star.style.left = centerX + (Math.random() - 0.5) * 10 + '%';
            star.style.top = centerY + (Math.random() - 0.5) * 10 + '%';
            
            // Synchronized twinkling for constellation effect
            star.style.animationDelay = syncDelay + (Math.random() * 0.5) + 's';
            star.style.animationDuration = '3s';
            
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