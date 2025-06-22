// Enhanced main.js with risk zone identification and traffic analysis

// --- PART 1: Initialize viewer ---
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYjJiMmUxNC1iMDIxLTQyMmUtOTkxYS00YmNiOGRmNDY2Y2MiLCJpZCI6MzE0Mjg5LCJpYXQiOjE3NTA1MTM2NjN9.-qHzR8JySavMdH1SYqPO99KR_Jfyg1zEj5V8nVlZK6Y';

const viewer = new Cesium.Viewer("cesiumContainer", {
  shouldAnimate: true,
  timeline: true,
  animation: true
});

// --- PART 2: Traffic analysis variables ---
let satelliteData = [];
let debrisData = [];
let congestionZones = [];
let riskAreas = [];

// --- PART 3: Enhanced TLE fetcher with classification ---
async function fetchTLEs(url, category = 'active') {
  const res = await fetch(url);
  const text = await res.text();
  const lines = text.trim().split('\n');
  const satellites = [];

  for (let i = 0; i < lines.length; i += 3) {
    const sat = {
      name: lines[i].trim(),
      tle1: lines[i + 1].trim(),
      tle2: lines[i + 2].trim(),
      category: category,
      age: calculateAge(lines[i + 1]),
      altitude: extractAltitude(lines[i + 1]),
      active: category === 'active'
    };
    satellites.push(sat);
  }

  return satellites;
}

// --- PART 4: Utility functions ---
function calculateAge(tle1) {
  const epochYear = parseInt(tle1.substring(18, 20));
  const epochDay = parseFloat(tle1.substring(20, 32));
  const currentYear = new Date().getFullYear() % 100;
  return Math.abs(currentYear - epochYear) + (365 - epochDay) / 365;
}

function extractAltitude(tle1) {
  const meanMotion = parseFloat(tle1.substring(52, 63));
  return Math.pow(398600.4418 / Math.pow(meanMotion * 2 * Math.PI / 86400, 2), 1/3) - 6371;
}

function classifyOrbit(altitude) {
  if (altitude < 2000) return 'LEO';
  if (altitude < 35786) return 'MEO';
  return 'GEO';
}

// --- PART 5: Risk assessment functions ---
function identifyRiskZones() {
  const zones = [
    { name: 'LEO High Traffic', min: 400, max: 600, risk: 'high' },
    { name: 'Starlink Shell', min: 540, max: 570, risk: 'medium' },
    { name: 'ISS Orbit', min: 408, max: 420, risk: 'critical' },
    { name: 'GEO Belt', min: 35780, max: 35800, risk: 'high' },
    { name: 'Graveyard Orbit', min: 36000, max: 37000, risk: 'medium' }
  ];

  zones.forEach(zone => {
    const color = getRiskColor(zone.risk);
    viewer.entities.add({
      name: zone.name,
      ellipsoid: {
        radii: new Cesium.Cartesian3(
          6371e3 + zone.max * 1000,
          6371e3 + zone.max * 1000,
          6371e3 + zone.max * 1000
        ),
        material: color.withAlpha(0.1),
        outline: true,
        outlineColor: color.withAlpha(0.5)
      }
    });
  });
}

function getRiskColor(risk) {
  switch(risk) {
    case 'critical': return Cesium.Color.RED;
    case 'high': return Cesium.Color.ORANGE;
    case 'medium': return Cesium.Color.YELLOW;
    default: return Cesium.Color.GREEN;
  }
}

// --- PART 6: Enhanced satellite visualization ---
function addSatelliteToViewer(sat, isDebris = false) {
  const satrec = satellite.twoline2satrec(sat.tle1, sat.tle2);
  const positionProperty = new Cesium.SampledPositionProperty();
  const start = Cesium.JulianDate.now();
  const totalMinutes = 90;

  for (let i = 0; i < totalMinutes; i += 1) {
    const time = Cesium.JulianDate.addMinutes(start, i, new Cesium.JulianDate());
    const jsDate = Cesium.JulianDate.toDate(time);

    const eci = satellite.propagate(satrec, jsDate);
    if (!eci.position) continue;

    const gmst = satellite.gstime(jsDate);
    const geodetic = satellite.eciToGeodetic(eci.position, gmst);
    const longitude = Cesium.Math.toDegrees(geodetic.longitude);
    const latitude = Cesium.Math.toDegrees(geodetic.latitude);
    const height = geodetic.height * 1000;

    const pos = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
    positionProperty.addSample(time, pos);
  }

  // Determine visualization based on satellite type
  let color, size, pathColor;
  if (isDebris) {
    color = Cesium.Color.RED;
    size = 3;
    pathColor = Cesium.Color.RED.withAlpha(0.3);
  } else if (sat.name.includes('STARLINK')) {
    color = Cesium.Color.CYAN;
    size = 4;
    pathColor = Cesium.Color.CYAN.withAlpha(0.5);
  } else if (sat.age > 10 || !sat.active) {
    color = Cesium.Color.ORANGE; // Abandoned satellites
    size = 5;
    pathColor = Cesium.Color.ORANGE.withAlpha(0.4);
  } else {
    color = Cesium.Color.GREEN;
    size = 4;
    pathColor = Cesium.Color.GREEN.withAlpha(0.3);
  }

  viewer.entities.add({
    name: sat.name,
    position: positionProperty,
    point: {
      pixelSize: size,
      color: color,
      heightReference: Cesium.HeightReference.NONE
    },
    path: {
      resolution: 120,
      material: pathColor,
      width: 1,
    },
    description: `
      <div>
        <p><strong>Name:</strong> ${sat.name}</p>
        <p><strong>Orbit:</strong> ${classifyOrbit(sat.altitude)}</p>
        <p><strong>Altitude:</strong> ${sat.altitude.toFixed(0)} km</p>
        <p><strong>Age:</strong> ${sat.age.toFixed(1)} years</p>
        <p><strong>Status:</strong> ${sat.active ? 'Active' : 'Inactive/Debris'}</p>
      </div>
    `
  });
}

// --- PART 7: Congestion analysis ---
function analyzeCongestion() {
  const altitudeBins = {};
  const binSize = 50; // 50km bins

  satelliteData.concat(debrisData).forEach(sat => {
    const bin = Math.floor(sat.altitude / binSize) * binSize;
    if (!altitudeBins[bin]) altitudeBins[bin] = [];
    altitudeBins[bin].push(sat);
  });

  // Identify high-congestion zones
  Object.entries(altitudeBins).forEach(([altitude, objects]) => {
    if (objects.length > 20) { // Threshold for congestion
      const alt = parseInt(altitude);
      viewer.entities.add({
        name: `Congestion Zone: ${alt}-${alt + binSize}km`,
        ellipsoid: {
          radii: new Cesium.Cartesian3(
            6371e3 + (alt + binSize/2) * 1000,
            6371e3 + (alt + binSize/2) * 1000,
            6371e3 + (alt + binSize/2) * 1000
          ),
          material: Cesium.Color.PURPLE.withAlpha(0.2),
          outline: true,
          outlineColor: Cesium.Color.PURPLE
        }
      });
    }
  });
}

// --- PART 8: Debris cloud visualization ---
function createDebrisCloud(center, count, name) {
  for (let i = 0; i < count; i++) {
    const offset = {
      lat: (Math.random() - 0.5) * 0.1,
      lon: (Math.random() - 0.5) * 0.1,
      alt: (Math.random() - 0.5) * 10000
    };

    viewer.entities.add({
      name: `${name} Debris ${i}`,
      position: Cesium.Cartesian3.fromDegrees(
        center.lon + offset.lon,
        center.lat + offset.lat,
        center.alt + offset.alt
      ),
      point: {
        pixelSize: 2,
        color: Cesium.Color.RED.withAlpha(0.6)
      }
    });
  }
}

// --- PART 9: Statistics panel ---
function updateStatistics() {
  const stats = {
    total: satelliteData.length + debrisData.length,
    active: satelliteData.filter(s => s.active).length,
    debris: debrisData.length,
    starlink: satelliteData.filter(s => s.name.includes('STARLINK')).length,
    abandoned: satelliteData.filter(s => !s.active || s.age > 10).length
  };

  const statsPanel = document.getElementById('debrisList');
  statsPanel.innerHTML = `
    <h3>Space Traffic Statistics</h3>
    <p>Total Objects: ${stats.total}</p>
    <p>Active Satellites: ${stats.active}</p>
    <p>Debris/Inactive: ${stats.debris + stats.abandoned}</p>
    <p>Starlink: ${stats.starlink}</p>
    <p>High-Risk Objects: ${stats.abandoned}</p>
  `;
  statsPanel.style.display = 'block';
}

// --- PART 10: Initialize everything ---
(async function init() {
  console.log('Initializing space traffic analysis...');
  
  // Skip TLE loading for now, use mock data
  createMockData();
  
  // Add risk zones and analysis
  identifyRiskZones();
  
  // Create sample debris clouds
  createDebrisCloud({lat: 45, lon: 0, alt: 800000}, 20, 'Collision Event A');
  createDebrisCloud({lat: -30, lon: 120, alt: 600000}, 15, 'Fragmentation B');

  // Generate mock statistics
  satelliteData = Array(150).fill().map((_, i) => ({
    name: `SAT-${i}`,
    active: Math.random() > 0.2,
    altitude: 400 + Math.random() * 1000,
    age: Math.random() * 15
  }));
  
  debrisData = Array(50).fill().map((_, i) => ({
    name: `DEBRIS-${i}`,
    active: false,
    altitude: 600 + Math.random() * 800
  }));

  updateStatistics();
  console.log('Mock data loaded successfully');
})();

// --- PART 11: Mock data fallback ---
function createMockData() {
  // Create sample Starlink constellation
  for (let i = 0; i < 50; i++) {
    viewer.entities.add({
      name: `STARLINK-${i}`,
      position: Cesium.Cartesian3.fromDegrees(
        Math.random() * 360 - 180,
        Math.random() * 120 - 60,
        550000 + Math.random() * 50000
      ),
      point: {
        pixelSize: 4,
        color: Cesium.Color.CYAN
      }
    });
  }

  // Add risk zones
  identifyRiskZones();
  
  document.getElementById('debrisList').innerHTML = `
    <h3>Mock Data Loaded</h3>
    <p>Using simulated space traffic</p>
    <p>50 Starlink satellites</p>
    <p>Risk zones highlighted</p>
  `;
  document.getElementById('debrisList').style.display = 'block';
}