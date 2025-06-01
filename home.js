// ... (keep existing code until the selectCosmicObject function)

// Modified selectCosmicObject function
async function selectCosmicObject(obj) {
    try {
        // Show loading state
        jwstContainer.innerHTML = '<div class="loading">Loading JWST image...</div>';
        hubbleContainer.innerHTML = '<div class="loading">Loading Hubble image...</div>';

        // Fetch images from backend
        const response = await fetch(`/api/search/${encodeURIComponent(obj.name)}`);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        // Update JWST side
        if (data.jwst) {
            jwstContainer.innerHTML = `<img src="${data.jwst}" alt="JWST ${obj.name}">`;
        } else {
            jwstContainer.innerHTML = `<img src="https://via.placeholder.com/400x300/1a0a2e/ff8a80?text=${encodeURIComponent('No JWST image available')}">`;
        }
        jwstContainer.classList.add('glow');
        
        jwstInfo.innerHTML = `
            <h3>${obj.name} - JWST</h3>
            <p><strong>Type:</strong> ${data.target_info.type}</p>
            <p><strong>Infrared View:</strong> ${data.target_info.description}</p>
            <p><strong>Wavelength:</strong> Near and mid-infrared (0.6 - 28.3 μm)</p>
        `;
        jwstInfo.classList.add('active');
        
        // Update Hubble side
        if (data.hubble) {
            hubbleContainer.innerHTML = `<img src="${data.hubble}" alt="Hubble ${obj.name}">`;
        } else {
            hubbleContainer.innerHTML = `<img src="https://via.placeholder.com/400x300/16213e/64b5f6?text=${encodeURIComponent('No Hubble image available')}">`;
        }
        hubbleContainer.classList.add('glow');
        
        hubbleInfo.innerHTML = `
            <h3>${obj.name} - Hubble</h3>
            <p><strong>Type:</strong> ${data.target_info.type}</p>
            <p><strong>Visible Light View:</strong> ${data.target_info.description}</p>
            <p><strong>Wavelength:</strong> Ultraviolet, visible, near-infrared (0.1 - 2.5 μm)</p>
        `;
        hubbleInfo.classList.add('active');
        
        // Update analysis text
        updateAnalysisText(obj);

    } catch (error) {
        console.error('Error fetching images:', error);
        jwstContainer.innerHTML = `<div class="error">Error loading JWST image: ${error.message}</div>`;
        hubbleContainer.innerHTML = `<div class="error">Error loading Hubble image: ${error.message}</div>`;
    }
}

// ... (keep rest of the existing code)