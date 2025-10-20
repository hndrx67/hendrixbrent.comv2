// Seeded PRNG helpers (xmur3 + sfc32)
function xmur3(str) {
	let h = 1779033703 ^ str.length;
	for (let i = 0; i < str.length; i++) {
		h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
		h = (h << 13) | (h >>> 19);
	}
	return function() {
		h = Math.imul(h ^ (h >>> 16), 2246822507);
		h = Math.imul(h ^ (h >>> 13), 3266489909);
		return (h ^= h >>> 16) >>> 0;
	};
}

function sfc32(a, b, c, d) {
	return function() {
		a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
		let t = (a + b) | 0; t = (t + d) | 0; d = (d + 1) | 0;
		a = b ^ (b >>> 9);
		b = (c + (c << 3)) | 0;
		c = (c << 21) | (c >>> 11);
		c = (c + t) | 0;
		return (t >>> 0) / 4294967296;
	};
}

function rngFromSeed(seed) {
	const seedFn = xmur3(seed);
	return sfc32(seedFn(), seedFn(), seedFn(), seedFn());
}

// Data catalogs
const ISPs = [
	"Cloudflare, Inc.", "Comcast Cable", "AT&T Services", "Verizon Fios", "Deutsche Telekom AG",
	"Vodafone Group", "Orange S.A.", "NTT Communications", "China Telecom", "Telefónica S.A.",
	"Tata Communications", "Shaw Communications", "Rogers Cable", "BT Group", "OVH SAS",
	"DigitalOcean, LLC", "Hetzner Online GmbH", "Akamai International", "Fastly, Inc.", "GTT Communications"
];

const Orgs = [
	"Contoso Ltd.", "Globex Corporation", "Initech", "Umbrella Research", "Wayne Enterprises",
	"Stark Industries", "Aperture Science", "Black Mesa", "Tyrell Corporation", "Hooli",
	"Cyberdyne Systems", "Oceanic Systems", "BlueSun Holdings", "Monarch Analytics", "NeoNet Solutions"
];

const Cities = [
	{ city: "New York", region: "NY", country: "United States", lat: 40.7128, lon: -74.0060 },
	{ city: "San Francisco", region: "CA", country: "United States", lat: 37.7749, lon: -122.4194 },
	{ city: "London", region: "England", country: "United Kingdom", lat: 51.5074, lon: -0.1278 },
	{ city: "Berlin", region: "BE", country: "Germany", lat: 52.52, lon: 13.4050 },
	{ city: "Paris", region: "Île-de-France", country: "France", lat: 48.8566, lon: 2.3522 },
	{ city: "Tokyo", region: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503 },
	{ city: "Seoul", region: "Seoul", country: "South Korea", lat: 37.5665, lon: 126.9780 },
	{ city: "Sydney", region: "NSW", country: "Australia", lat: -33.8688, lon: 151.2093 },
	{ city: "Singapore", region: "SG", country: "Singapore", lat: 1.3521, lon: 103.8198 },
	{ city: "Toronto", region: "ON", country: "Canada", lat: 43.65107, lon: -79.347015 },
	{ city: "São Paulo", region: "SP", country: "Brazil", lat: -23.5505, lon: -46.6333 },
	{ city: "Mexico City", region: "CDMX", country: "Mexico", lat: 19.4326, lon: -99.1332 },
	{ city: "Johannesburg", region: "GP", country: "South Africa", lat: -26.2041, lon: 28.0473 },
	{ city: "Dubai", region: "Dubai", country: "United Arab Emirates", lat: 25.2048, lon: 55.2708 },
	{ city: "Mumbai", region: "MH", country: "India", lat: 19.0760, lon: 72.8777 },
	{ city: "Moscow", region: "Moscow", country: "Russia", lat: 55.7558, lon: 37.6173 },
	{ city: "Madrid", region: "Community of Madrid", country: "Spain", lat: 40.4168, lon: -3.7038 },
	{ city: "Rome", region: "Lazio", country: "Italy", lat: 41.9028, lon: 12.4964 },
	{ city: "Istanbul", region: "Istanbul", country: "Türkiye", lat: 41.0082, lon: 28.9784 },
	{ city: "Warsaw", region: "Masovian", country: "Poland", lat: 52.2297, lon: 21.0122 }
];

// Names for identity scanner
const FirstNames = [
	"James", "Michael", "Robert", "John", "David", "William", "Richard", "Joseph", "Thomas", "Charles",
	"Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen",
	"Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Avery", "Quinn", "Reese", "Parker",
	"Dmitri", "Yuki", "Hassan", "Sofia", "Priya", "Chen", "Ahmad", "Mei", "Lars", "Amara"
];

const LastNames = [
	"Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
	"Anderson", "Taylor", "Thomas", "Moore", "Jackson", "Martin", "Lee", "Thompson", "White", "Harris",
	"Petrov", "Nakamura", "Al-Rashid", "Kowalski", "O'Brien", "Singh", "Khan", "Chen", "Kim", "Yamamoto",
	"Silva", "Santos", "Müller", "Schmidt", "Cohen", "Rossi", "Ferrari", "Andersen", "Nielsen", "Berg"
];

function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

function randomIP(rand) {
	function pickOctet() { return Math.floor(rand() * 255); }
	function reserved(a,b,c,d){
		const ip = [a,b,c,d];
		// private/reserved ranges
		if (a === 10) return true;
		if (a === 127) return true;
		if (a === 0) return true;
		if (a === 100 && (b >= 64 && b <= 127)) return true; // CGNAT
		if (a === 169 && b === 254) return true; // link-local
		if (a === 172 && (b >= 16 && b <= 31)) return true;
		if (a === 192 && b === 0 && (c === 0 || c === 2)) return true; // 192.0.0.0/24, 192.0.2.0/24 example
		if (a === 192 && b === 168) return true;
		if (a === 198 && (b === 18 || b === 19 || b === 51 || b === 51)) return true; // 198.18/15, 198.51.100/24
		if (a === 203 && b === 0 && c === 113) return true; // 203.0.113/24
		if (a >= 224) return true; // multicast/reserved
		return false;
	}
	let a,b,c,d, tries = 0;
	do {
		a = clamp(Math.floor(rand()*223)+1, 1, 223);
		b = pickOctet(); c = pickOctet(); d = clamp(pickOctet(), 1, 254);
		tries++; if (tries > 50) break; // safety
	} while (reserved(a,b,c,d));
	return `${a}.${b}.${c}.${d}`;
}

function pick(arr, rand) { return arr[Math.floor(rand() * arr.length)]; }

function ispDomain(name){
	return name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0,16) + ".net";
}

function reverseDNS(ip, cityCode, isp) {
	const dom = ispDomain(isp);
	const dashed = ip.replaceAll('.', '-');
	return `dyn-${cityCode}-${dashed}.${dom}`;
}

function tzFromLon(lon){
	// crude approximation: UTC offset by longitude
	const offset = Math.round(lon / 15);
	const sign = offset >= 0 ? "+" : "-";
	const abs = Math.abs(offset);
	return `UTC${sign}${abs.toString().padStart(2,'0')}:00`;
}

function localTimeFromOffset(offsetStr){
	const m = offsetStr.match(/UTC([+-])(\d{2}):(\d{2})/);
	let minutes = 0;
	if (m) {
		const sign = m[1] === '-' ? -1 : 1;
		minutes = sign * (parseInt(m[2],10)*60 + parseInt(m[3],10));
	}
	const now = new Date();
	const utc = now.getTime() + now.getTimezoneOffset()*60000;
	const local = new Date(utc + minutes*60000);
	return local.toLocaleString();
}

function generateData(username){
	const seed = (username || "anonymous").trim().toLowerCase();
	const rand = rngFromSeed(seed || "anonymous");
	const city = pick(Cities, rand);
	const jitterLat = (rand()-0.5) * 0.6; // +/-0.3 deg
	const jitterLon = (rand()-0.5) * 0.6;
	const lat = clamp(city.lat + jitterLat, -85, 85);
	const lon = clamp(city.lon + jitterLon, -179.9, 179.9);
	const isp = pick(ISPs, rand);
	const asn = `AS${Math.floor(1000 + rand() * 63000)}`;
	const org = pick(Orgs, rand);
	const ip = randomIP(rand);
	const cityCode = city.city.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 4) || "loc";
	const rdns = reverseDNS(ip, cityCode, isp);
	const tz = tzFromLon(lon);
	const localtime = localTimeFromOffset(tz);
	const proxy = rand() < 0.22 ? (rand() < 0.5 ? "Likely VPN" : "Possible Proxy") : "No";
	const acc = `${Math.floor(70 + rand()*25)}% (±${5 + Math.floor(rand()*25)} km)`;
	return {
		username: username || "anonymous",
		ip, rdns, isp, asn, org,
		country: city.country,
		region: city.region,
		city: city.city,
		lat: +lat.toFixed(5),
		lon: +lon.toFixed(5),
		tz, localtime, proxy, acc
	};
}

let currentLat = 40.6892;
let currentLon = -74.0445;
let activeModes = new Set();

function setMap(lat, lon, zoom = 10){
	const src = `https://www.google.com/maps?q=${encodeURIComponent(lat + "," + lon)}&z=${zoom}&output=embed`;
	const frame = document.getElementById('mapFrame');
	frame.src = src;
	
	currentLat = lat;
	currentLon = lon;
	
	// Update coordinate display
	const coordDisplay = document.getElementById('coordDisplay');
	if (coordDisplay) {
		coordDisplay.textContent = `LAT: ${lat} / LON: ${lon}`;
	}
}

function activateCrosshair() {
	const marker = document.getElementById('targetMarker');
	const crosshair = document.getElementById('crosshair');
	if (marker) marker.classList.add('active');
	if (crosshair) crosshair.classList.add('active');
}

function showLockNotification() {
	const notification = document.getElementById('lockNotification');
	notification.classList.add('show');
	setTimeout(() => {
		notification.classList.remove('show');
	}, 2000);
}

function generateTraceHops(originLat, originLon, destLat, destLon, numHops) {
	const hops = [];
	hops.push({ lat: originLat, lon: originLon });
	
	// Generate intermediate waypoints with realistic routing
	for (let i = 1; i < numHops - 1; i++) {
		const progress = i / (numHops - 1);
		
		// Add some randomness to simulate realistic routing through network nodes
		const randomOffset = () => (Math.random() - 0.5) * 15; // up to ±7.5 degrees offset
		
		// Base interpolation
		let lat = originLat + (destLat - originLat) * progress;
		let lon = originLon + (destLon - originLon) * progress;
		
		// Add routing deviation (simulate going through major internet hubs)
		if (i < numHops / 2) {
			// First half - route might go through North America or Europe
			lat += randomOffset() * 0.5;
			lon += randomOffset();
		} else {
			// Second half - converge toward destination
			lat += randomOffset() * 0.3;
			lon += randomOffset() * 0.5;
		}
		
		hops.push({ lat, lon });
	}
	
	hops.push({ lat: destLat, lon: destLon });
	return hops;
}

function drawTracePath(canvas, hops) {
	if (!canvas || hops.length < 2) {
		console.error('Canvas or hops invalid', canvas, hops);
		return;
	}
	
	const ctx = canvas.getContext('2d');
	const width = canvas.width;
	const height = canvas.height;
	
	console.log('Canvas dimensions:', width, height);
	console.log('Drawing hops:', hops);
	
	ctx.clearRect(0, 0, width, height);
	
	// Convert lat/lon to canvas coordinates using Mercator-like projection
	const latToY = (lat) => {
		// Clamp latitude to avoid extreme values
		const clampedLat = Math.max(-85, Math.min(85, lat));
		const latRad = clampedLat * Math.PI / 180;
		const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
		return height * (1 - (mercN + Math.PI) / (2 * Math.PI));
	};
	
	const lonToX = (lon) => {
		return width * (lon + 180) / 360;
	};
	
	let currentSegment = 0;
	
	function animateSegment() {
		if (currentSegment >= hops.length - 1) return;
		
		const start = hops[currentSegment];
		const end = hops[currentSegment + 1];
		
		const startX = lonToX(start.lon);
		const startY = latToY(start.lat);
		const endX = lonToX(end.lon);
		const endY = latToY(end.lat);
		
		console.log(`Segment ${currentSegment}: from (${startX}, ${startY}) to (${endX}, ${endY})`);
		
		// Draw current segment with animation
		let progress = 0;
		const segmentDuration = 400; // ms per segment
		const startTime = Date.now();
		
		function drawSegment() {
			const elapsed = Date.now() - startTime;
			progress = Math.min(elapsed / segmentDuration, 1);
			
			const currentX = startX + (endX - startX) * progress;
			const currentY = startY + (endY - startY) * progress;
			
			// Clear canvas
			ctx.clearRect(0, 0, width, height);
			
			// Draw all completed segments (green)
			ctx.strokeStyle = '#00ff00';
			ctx.lineWidth = 2;
			ctx.shadowBlur = 10;
			ctx.shadowColor = '#00ff00';
			
			for (let i = 0; i < currentSegment; i++) {
				const s = hops[i];
				const e = hops[i + 1];
				ctx.beginPath();
				ctx.moveTo(lonToX(s.lon), latToY(s.lat));
				ctx.lineTo(lonToX(e.lon), latToY(e.lat));
				ctx.stroke();
			}
			
			// Draw current segment (red)
			ctx.strokeStyle = '#ff0000';
			ctx.lineWidth = 3;
			ctx.shadowBlur = 15;
			ctx.shadowColor = '#ff0000';
			ctx.beginPath();
			ctx.moveTo(startX, startY);
			ctx.lineTo(currentX, currentY);
			ctx.stroke();
			
			// Draw hop nodes
			for (let i = 0; i <= currentSegment; i++) {
				const hop = hops[i];
				const hopX = lonToX(hop.lon);
				const hopY = latToY(hop.lat);
				
				ctx.fillStyle = i === currentSegment && progress < 1 ? '#ff0000' : '#00ff00';
				ctx.shadowBlur = 15;
				ctx.shadowColor = ctx.fillStyle;
				ctx.beginPath();
				ctx.arc(hopX, hopY, 5, 0, Math.PI * 2);
				ctx.fill();
			}
			
			if (progress < 1) {
				requestAnimationFrame(drawSegment);
			} else {
				// Draw the end node of this segment
				ctx.fillStyle = '#ff0000';
				ctx.shadowBlur = 15;
				ctx.shadowColor = '#ff0000';
				ctx.beginPath();
				ctx.arc(endX, endY, 5, 0, Math.PI * 2);
				ctx.fill();
				
				currentSegment++;
				if (currentSegment < hops.length - 1) {
					setTimeout(animateSegment, 100);
				}
			}
		}
		
		drawSegment();
	}
	
	animateSegment();
}

function generateUserLocations(targetLat, targetLon, username) {
	const locations = [];
	const numLocations = Math.floor(Math.random() * 4) + 4; // 4-7 locations
	
	// Generate random locations around the target
	for (let i = 0; i < numLocations; i++) {
		// Random offset from target (simulate movement history)
		// Larger spread for more visible distribution
		const latOffset = (Math.random() - 0.5) * 0.04; // ±0.02 degrees (~2km)
		const lonOffset = (Math.random() - 0.5) * 0.06; // ±0.03 degrees
		
		const lat = clamp(targetLat + latOffset, -85, 85);
		const lon = clamp(targetLon + lonOffset, -179.9, 179.9);
		
		// Generate timestamp (last 24 hours)
		const hoursAgo = Math.floor(Math.random() * 24);
		const minutesAgo = Math.floor(Math.random() * 60);
		const now = new Date();
		const timestamp = new Date(now.getTime() - (hoursAgo * 60 + minutesAgo) * 60000);
		
		// Generate location name based on coordinates
		const locationNames = [
			"Coffee Shop", "Home Network", "Public WiFi", "Mobile Hotspot", 
			"Corporate Network", "Library", "Airport", "Shopping Mall",
			"Hotel", "Restaurant", "University", "Transit Station"
		];
		
		const activityTypes = [
			"Logged in", "Data Transfer", "Voice Call", "Video Stream",
			"File Upload", "Message Sent", "Location Update", "Connected"
		];
		
		locations.push({
			lat,
			lon,
			timestamp,
			name: locationNames[Math.floor(Math.random() * locationNames.length)],
			activity: activityTypes[Math.floor(Math.random() * activityTypes.length)],
			ip: randomIP(rngFromSeed(username + i))
		});
	}
	
	// Sort by timestamp (oldest first)
	locations.sort((a, b) => a.timestamp - b.timestamp);
	
	return locations;
}

function showTrackLocation(targetLat, targetLon, data, splitView = false) {
	const modal = document.getElementById('trackModal');
	const iframe = document.getElementById('trackMapFrame');
	const markersContainer = document.getElementById('locationMarkers');
	const timeline = document.getElementById('trackTimeline');
	
	if (splitView) {
		modal.classList.add('split-view');
	} else {
		modal.classList.remove('split-view');
	}
	
	modal.classList.add('show');
	
	// Clear previous markers
	markersContainer.innerHTML = '';
	timeline.innerHTML = '';
	
	// Generate user locations
	const locations = generateUserLocations(targetLat, targetLon, data.username);
	
	setTimeout(() => {
		// Center map on target location
		const src = `https://www.google.com/maps?q=${encodeURIComponent(targetLat + "," + targetLon)}&z=11&output=embed`;
		iframe.src = src;
		
		// Wait for map to load, then add markers
		setTimeout(() => {
			const container = document.getElementById('trackMapContainer');
			const width = container.offsetWidth;
			const height = container.offsetHeight;
			
			console.log('Track container size:', width, height);
			console.log('Target center:', targetLat, targetLon);
			console.log('Locations:', locations);
			
			// Add markers with staggered animation
			locations.forEach((loc, index) => {
				setTimeout(() => {
					// Calculate position as percentage offsets from center
					// For zoom level 11, approximately 0.01 degrees = ~1% of screen
					const latDiff = targetLat - loc.lat;
					const lonDiff = loc.lon - targetLon;
					
					// Scale factors for zoom level 11 (adjust based on zoom)
					const latScale = height / 0.05; // ~0.05 degrees visible vertically at zoom 11
					const lonScale = width / 0.07;  // ~0.07 degrees visible horizontally at zoom 11
					
					// Calculate pixel offset from center
					const offsetX = lonDiff * lonScale;
					const offsetY = latDiff * latScale;
					
					// Position relative to container center
					const x = (width / 2) + offsetX;
					const y = (height / 2) + offsetY;
					
					console.log(`Marker ${index}: lat=${loc.lat}, lon=${loc.lon}, x=${x}, y=${y}`);
					
					const marker = document.createElement('div');
					marker.className = 'location-marker';
					marker.style.left = x + 'px';
					marker.style.top = y + 'px';
					
					// Create dialog
					const dialog = document.createElement('div');
					dialog.className = 'location-dialog';
					dialog.innerHTML = `
						<div class="loc-addr">${loc.name}</div>
						<div class="loc-coord">${loc.lat.toFixed(4)}, ${loc.lon.toFixed(4)}</div>
						<div class="loc-time">${loc.timestamp.toLocaleTimeString()}</div>
					`;
					
					marker.appendChild(dialog);
					markersContainer.appendChild(marker);
					
					// Animate in
					setTimeout(() => marker.classList.add('visible'), 50);
					
					// Add to timeline
					const entry = document.createElement('div');
					entry.className = 'track-entry';
					entry.innerHTML = `
						<div class="timestamp">${loc.timestamp.toLocaleString()}</div>
						<div class="location">${loc.name}</div>
						<div class="details">${loc.activity} from ${loc.ip}</div>
						<div class="details">${loc.lat.toFixed(4)}, ${loc.lon.toFixed(4)}</div>
					`;
					timeline.appendChild(entry);
					
				}, index * 300);
			});
		}, 800);
	}, 100);
}

let selectedSatellites = [];

function showGeosatSelector() {
	const notification = document.getElementById('geosatNotification');
	const progressBar = document.getElementById('geosatProgress');
	const modal = document.getElementById('geosatModal');
	
	// Show notification
	notification.classList.add('show');
	
	// Animate progress bar
	let progress = 0;
	const progressInterval = setInterval(() => {
		progress += 2;
		progressBar.style.width = progress + '%';
		if (progress >= 100) {
			clearInterval(progressInterval);
			setTimeout(() => {
				notification.classList.remove('show');
				progressBar.style.width = '0';
				// Show satellite selector
				initGeosatMap();
			}, 500);
		}
	}, 30);
}

function initGeosatMap() {
	const modal = document.getElementById('geosatModal');
	const iframe = document.getElementById('geosatMapFrame');
	const markersContainer = document.getElementById('satelliteMarkers');
	
	selectedSatellites = [];
	updateSelectedSatList();
	
	modal.classList.add('show');
	
	setTimeout(() => {
		// Show world map
		const src = `https://www.google.com/maps?q=0,0&z=2&output=embed`;
		iframe.src = src;
		
		// Generate satellite positions
		setTimeout(() => {
			const satellites = generateSatellites();
			const container = document.getElementById('geosatMapContainer');
			const width = container.offsetWidth;
			const height = container.offsetHeight;
			
			markersContainer.innerHTML = '';
			
			satellites.forEach((sat, index) => {
				// Convert lat/lon to screen position
				const x = ((sat.lon + 180) / 360) * width;
				const y = ((90 - sat.lat) / 180) * height;
				
				const marker = document.createElement('div');
				marker.className = 'satellite-marker';
				marker.style.left = x + 'px';
				marker.style.top = y + 'px';
				marker.dataset.satId = sat.id;
				
				marker.innerHTML = `
					<div class="sat-icon">🛰️</div>
					<div class="sat-label">${sat.name}</div>
				`;
				
				marker.addEventListener('click', () => toggleSatellite(sat, marker));
				
				markersContainer.appendChild(marker);
			});
		}, 800);
	}, 100);
}

function generateSatellites() {
	const satellites = [];
	const names = [
		'SKYNET-A1', 'SENTINEL-7', 'COSMOS-12', 'TERRA-SAT', 'AQUA-9',
		'LANDSAT-X', 'SPOT-6', 'IKONOS-2', 'WORLDVIEW-3', 'GEOEYE-1',
		'QUICKBIRD-5', 'RAPIDEYE-C', 'PLEIADES-8', 'KOMPSAT-4'
	];
	
	for (let i = 0; i < 14; i++) {
		satellites.push({
			id: i,
			name: names[i],
			lat: (Math.random() * 140) - 70,  // -70 to 70
			lon: (Math.random() * 360) - 180  // -180 to 180
		});
	}
	
	return satellites;
}

function toggleSatellite(sat, marker) {
	const index = selectedSatellites.findIndex(s => s.id === sat.id);
	
	if (index > -1) {
		// Deselect
		selectedSatellites.splice(index, 1);
		marker.classList.remove('selected');
	} else {
		// Select
		selectedSatellites.push(sat);
		marker.classList.add('selected');
	}
	
	updateSelectedSatList();
}

function updateSelectedSatList() {
	const listContainer = document.getElementById('selectedSatList');
	const saveBtn = document.getElementById('geosatSave');
	
	if (selectedSatellites.length === 0) {
		listContainer.innerHTML = '<div style="color: var(--muted); font-size: 11px;">No satellites selected</div>';
		saveBtn.disabled = true;
	} else {
		listContainer.innerHTML = selectedSatellites.map(sat => `
			<div class="sat-chip">
				<span>${sat.name}</span>
				<span class="remove" onclick="removeSatellite(${sat.id})">✕</span>
			</div>
		`).join('');
		saveBtn.disabled = selectedSatellites.length < 2;
	}
}

function removeSatellite(satId) {
	const index = selectedSatellites.findIndex(s => s.id === satId);
	if (index > -1) {
		selectedSatellites.splice(index, 1);
		updateSelectedSatList();
		
		// Update marker visual
		const marker = document.querySelector(`[data-sat-id="${satId}"]`);
		if (marker) marker.classList.remove('selected');
	}
}

function saveSelectedSatellites() {
	const modal = document.getElementById('geosatModal');
	const btn = document.getElementById(`mode-geosat`);
	const statusEl = btn.querySelector('.mode-status');
	
	// Save satellites (in real app, this would send to backend)
	console.log('Saved satellites:', selectedSatellites);
	
	// Show success
	statusEl.textContent = `LOCKED (${selectedSatellites.length})`;
	
	modal.classList.remove('show');
	
	// Reset mode button after 3 seconds
	setTimeout(() => {
		if (activeModes.has('geosat')) {
			activeModes.delete('geosat');
			btn.classList.remove('active');
			statusEl.textContent = 'STANDBY';
		}
	}, 3000);
}

function showTraceRoute(originLat, originLon, destLat, destLon, data, splitView = false) {
	const modal = document.getElementById('traceModal');
	const iframe = document.getElementById('traceMapFrame');
	const canvas = document.getElementById('traceCanvas');
	const container = document.getElementById('traceMapContainer');
	
	if (splitView) {
		modal.classList.add('split-view');
	} else {
		modal.classList.remove('split-view');
	}
	
	modal.classList.add('show');
	
	// Wait for modal to be visible before sizing canvas
	setTimeout(() => {
		// Set canvas size to match container
		const width = container.offsetWidth;
		const height = container.offsetHeight;
		canvas.width = width;
		canvas.height = height;
		canvas.style.width = width + 'px';
		canvas.style.height = height + 'px';
		
		console.log('Container size:', width, height);
		console.log('Canvas size:', canvas.width, canvas.height);
		
		// Center map between origin and destination
		const centerLat = (originLat + destLat) / 2;
		const centerLon = (originLon + destLon) / 2;
		const src = `https://www.google.com/maps?q=${encodeURIComponent(centerLat + "," + centerLon)}&z=3&output=embed`;
		iframe.src = src;
		
		// Generate hops
		const numHops = Math.floor(Math.random() * 6) + 6; // 6-11 hops
		const hops = generateTraceHops(originLat, originLon, destLat, destLon, numHops);
		
		// Update trace info
		document.getElementById('trace-origin').textContent = `${originLat.toFixed(4)}, ${originLon.toFixed(4)}`;
		document.getElementById('trace-dest').textContent = `${destLat.toFixed(4)}, ${destLon.toFixed(4)}`;
		document.getElementById('trace-hops').textContent = numHops;
		document.getElementById('trace-latency').textContent = `${Math.floor(Math.random() * 150) + 50} MS`;
		
		// Start trace animation after ensuring canvas is ready
		setTimeout(() => {
			drawTracePath(canvas, hops);
		}, 500);
	}, 100);
}

function toggleMode(mode) {
	const btn = document.getElementById(`mode-${mode}`);
	const statusEl = btn.querySelector('.mode-status');
	
	if (activeModes.has(mode)) {
		activeModes.delete(mode);
		btn.classList.remove('active');
		statusEl.textContent = mode === 'stealth' ? 'INACTIVE' : 'STANDBY';
		
		// Deactivate mode-specific features
		if (mode === 'stealth') {
			document.getElementById('stealthOverlay').classList.remove('active');
		}
	} else {
		activeModes.add(mode);
		btn.classList.add('active');
		statusEl.textContent = 'ACTIVE';
		
		// Activate mode-specific features
		if (mode === 'stealth') {
			document.getElementById('stealthOverlay').classList.add('active');
			setTimeout(() => {
				document.getElementById('stealthOverlay').classList.remove('active');
				activeModes.delete(mode);
				btn.classList.remove('active');
				statusEl.textContent = 'INACTIVE';
			}, 3000);
		}
		
		if (mode === 'lock') {
			updateThreatLevel(btn);
		}
		
		if (mode === 'geosat') {
			showGeosatSelector();
		}
	}
}

function updateThreatLevel(btn) {
	const bars = btn.querySelectorAll('.threat-bar .fill');
	const level = Math.floor(Math.random() * 5) + 1;
	
	bars.forEach((bar, index) => {
		if (index < level) {
			setTimeout(() => {
				bar.style.width = '100%';
				if (level <= 2) {
					bar.classList.remove('medium', 'high');
				} else if (level <= 3) {
					bar.classList.add('medium');
					bar.classList.remove('high');
				} else {
					bar.classList.add('high');
					bar.classList.remove('medium');
				}
			}, index * 100);
		} else {
			bar.style.width = '0';
		}
	});
}

function simulatePacketIntercept() {
	const log = document.getElementById('log');
	const packets = [
		'[INTERCEPT] Packet captured: 192.168.1.1 -> ' + document.getElementById('out-ip').textContent,
		'[INTERCEPT] Protocol: TCP/IP',
		'[INTERCEPT] Port: 443 (HTTPS)',
		'[INTERCEPT] Payload size: ' + (Math.floor(Math.random() * 1500) + 500) + ' bytes',
		'[INTERCEPT] Decrypting payload...',
		'[OK] Intercept complete'
	];
	
	let i = 0;
	const timer = setInterval(() => {
		if (i < packets.length) {
			const el = document.createElement('div');
			el.className = i === packets.length - 1 ? 'line ok' : 'line warn';
			el.textContent = packets[i++];
			log.appendChild(el);
			log.scrollTop = log.scrollHeight;
		} else {
			clearInterval(timer);
		}
	}, 300);
}

function writeResults(d){
	const $ = (id) => document.getElementById(id);
	$("out-user").textContent = d.username;
	$("out-ip").textContent = d.ip;
	$("out-rdns").textContent = d.rdns;
	$("out-isp").textContent = d.isp;
	$("out-asn").textContent = d.asn;
	$("out-org").textContent = d.org;
	$("out-country").textContent = d.country;
	$("out-region").textContent = d.region;
	$("out-city").textContent = d.city;
	$("out-coord").textContent = `${d.lat}, ${d.lon}`;
	$("out-tz").textContent = d.tz;
	$("out-localtime").textContent = d.localtime;
	$("out-proxy").textContent = d.proxy;
	$("out-acc").textContent = d.acc;
}

function simulateScanLogs(target, doneCb){
	const log = document.getElementById('log');
	log.innerHTML = '';
	const lines = [
		`[+] INITIALIZING RESOLVER...`,
		`[+] PARSING HANDLE: ${target}`,
		`[+] LOADING OSINT MODULES: DNS, WHOIS, GEOFEED, BGP`,
		`[>] QUERY PUBLIC DATASETS...`,
		`[>] CORRELATE WITH THREAT INTEL...`,
		`[>] FINGERPRINTING NETWORK EDGES...`,
		`[!] RATE-LIMIT DETECTED, SWITCHING MIRRORS`,
		`[/] GENERATING HEURISTIC MODEL...`,
		`[+] RESULT SYNTHESIS COMPLETE`
	];
	let i = 0;
	const timer = setInterval(() => {
		if (i < lines.length) {
			const el = document.createElement('div');
			el.className = 'line';
			el.textContent = lines[i++];
			log.appendChild(el);
			log.scrollTop = log.scrollHeight;
		} else {
			clearInterval(timer);
			const ok = document.createElement('div');
			ok.className = 'line ok';
			ok.textContent = '[OK] SCAN COMPLETE';
			log.appendChild(ok);
			log.scrollTop = log.scrollHeight;
			doneCb();
		}
	}, 220);
}

function startScan(){
	const input = document.getElementById('username');
	const btn = document.getElementById('scanBtn');
	const name = input.value.trim();
	if (!name) {
		input.classList.remove('shake');
		void input.offsetWidth; // restart animation
		input.classList.add('shake');
		return;
	}
	
	// Check for hidden terminal command
	if (name === './terminal') {
		openTerminal();
		input.value = '';
		return;
	}
	
	btn.disabled = true;
	
	// Store previous location for trace
	const prevLat = currentLat;
	const prevLon = currentLon;
	
	simulateScanLogs(name, () => {
		const data = generateData(name);
		writeResults(data);
		setMap(data.lat, data.lon, 11);
		
		// Activate crosshair after scan
		setTimeout(() => {
			activateCrosshair();
			
			// Show lock notification if TARGET LOCK mode is active
			if (activeModes.has('lock')) {
				showLockNotification();
			}
			
			// Check if both trace and track are active
			const bothModalsActive = activeModes.has('trace') && activeModes.has('track');
			
			// Show both modals simultaneously if both are active
			if (bothModalsActive) {
				setTimeout(() => {
					showTraceRoute(prevLat, prevLon, data.lat, data.lon, data, true);
					showTrackLocation(data.lat, data.lon, data, true);
				}, 1000);
			} else {
				// Show trace route if TRACE ROUTE mode is active
				if (activeModes.has('trace')) {
					setTimeout(() => {
						showTraceRoute(prevLat, prevLon, data.lat, data.lon, data, false);
					}, 1000);
				}
				
				// Show track location if TRACK LOCATION mode is active
				if (activeModes.has('track')) {
					setTimeout(() => {
						showTrackLocation(data.lat, data.lon, data, false);
					}, 1000);
				}
			}
			
			// Simulate packet intercept if mode is active
			if (activeModes.has('intercept')) {
				setTimeout(() => {
					simulatePacketIntercept();
				}, 1500);
			}
		}, 500);
		
		btn.disabled = false;
	});
}

document.getElementById('scanBtn').addEventListener('click', startScan);
document.getElementById('username').addEventListener('keydown', (e) => {
	if (e.key === 'Enter') { startScan(); }
});
document.getElementById('copy-ip').addEventListener('click', async () => {
	const ip = document.getElementById('out-ip').textContent.trim();
	if (!ip || ip === '—') return;
	try { 
		await navigator.clipboard.writeText(ip);
		const btn = document.getElementById('copy-ip');
		const orig = btn.textContent;
		btn.textContent = 'COPIED';
		setTimeout(() => btn.textContent = orig, 1000);
	} catch {}
});

// Mode button handlers
document.getElementById('mode-lock').addEventListener('click', () => toggleMode('lock'));
document.getElementById('mode-trace').addEventListener('click', () => toggleMode('trace'));
document.getElementById('mode-track').addEventListener('click', () => toggleMode('track'));
document.getElementById('mode-geosat').addEventListener('click', () => toggleMode('geosat'));
document.getElementById('mode-stealth').addEventListener('click', () => toggleMode('stealth'));
document.getElementById('mode-intercept').addEventListener('click', () => toggleMode('intercept'));

// Close trace modal
document.getElementById('traceClose').addEventListener('click', () => {
	const traceModal = document.getElementById('traceModal');
	const trackModal = document.getElementById('trackModal');
	traceModal.classList.remove('show');
	traceModal.classList.remove('split-view');
	traceModal.style.background = '';
	// If track is still open, remove its split view
	if (trackModal.classList.contains('show')) {
		trackModal.classList.remove('split-view');
		trackModal.style.background = '';
	}
});

// Close track modal
document.getElementById('trackClose').addEventListener('click', () => {
	const traceModal = document.getElementById('traceModal');
	const trackModal = document.getElementById('trackModal');
	trackModal.classList.remove('show');
	trackModal.classList.remove('split-view');
	trackModal.style.background = '';
	// If trace is still open, remove its split view
	if (traceModal.classList.contains('show')) {
		traceModal.classList.remove('split-view');
		traceModal.style.background = '';
	}
});

// Close geosat modal
document.getElementById('geosatClose').addEventListener('click', () => {
	document.getElementById('geosatModal').classList.remove('show');
	const btn = document.getElementById('mode-geosat');
	if (activeModes.has('geosat')) {
		activeModes.delete('geosat');
		btn.classList.remove('active');
		btn.querySelector('.mode-status').textContent = 'STANDBY';
	}
});

// Save satellites
document.getElementById('geosatSave').addEventListener('click', saveSelectedSatellites);

// Close modal on background click
document.getElementById('traceModal').addEventListener('click', (e) => {
	if (e.target.id === 'traceModal') {
		const traceModal = document.getElementById('traceModal');
		const trackModal = document.getElementById('trackModal');
		traceModal.classList.remove('show');
		traceModal.classList.remove('split-view');
		traceModal.style.background = '';
		// If track is still open, remove its split view
		if (trackModal.classList.contains('show')) {
			trackModal.classList.remove('split-view');
			trackModal.style.background = '';
		}
	}
});

document.getElementById('trackModal').addEventListener('click', (e) => {
	if (e.target.id === 'trackModal') {
		const traceModal = document.getElementById('traceModal');
		const trackModal = document.getElementById('trackModal');
		trackModal.classList.remove('show');
		trackModal.classList.remove('split-view');
		trackModal.style.background = '';
		// If trace is still open, remove its split view
		if (traceModal.classList.contains('show')) {
			traceModal.classList.remove('split-view');
			traceModal.style.background = '';
		}
	}
});

document.getElementById('geosatModal').addEventListener('click', (e) => {
	if (e.target.id === 'geosatModal') {
		document.getElementById('geosatModal').classList.remove('show');
		const btn = document.getElementById('mode-geosat');
		if (activeModes.has('geosat')) {
			activeModes.delete('geosat');
			btn.classList.remove('active');
			btn.querySelector('.mode-status').textContent = 'STANDBY';
		}
	}
});

// Boot Sequence
let systemUnlocked = false;
let networkOnline = false;

async function checkNetworkConnection() {
	try {
		// Try to fetch Google's favicon (small file, fast check)
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
		
		const response = await fetch('https://www.google.com/favicon.ico', {
			method: 'HEAD',
			mode: 'no-cors',
			cache: 'no-cache',
			signal: controller.signal
		});
		
		clearTimeout(timeoutId);
		networkOnline = true;
		return true;
	} catch (error) {
		networkOnline = false;
		return false;
	}
}

function startBootSequence() {
	const bootOverlay = document.getElementById('bootOverlay');
	const progressBar = document.getElementById('bootProgressBar');
	const statusText = document.getElementById('bootStatus');
	
	const statuses = [
		'INITIALIZING...',
		'CONNECTING TO SATELLITE NETWORK...',
		'ESTABLISHING SECURE CONNECTION...',
		'PINGING NETWORK SERVERS...',
		'AUTHENTICATING CREDENTIALS...',
		'LOADING GEO SAT DATABASE...',
		'SYNCHRONIZING GLOBAL POSITIONING...',
		'DECRYPTING COMMUNICATION CHANNELS...',
		'FINALIZING CONNECTION...',
		'CONNECTION ESTABLISHED'
	];
	
	let progress = 0;
	let statusIndex = 0;
	let networkChecked = false;
	
	const interval = setInterval(async () => {
		progress += 1;
		progressBar.style.width = progress + '%';
		
		// Update status every ~10%
		if (progress % 10 === 0 && statusIndex < statuses.length) {
			statusText.textContent = statuses[statusIndex];
			statusIndex++;
		}
		
		// Check network at 50% progress
		if (progress === 50 && !networkChecked) {
			networkChecked = true;
			statusText.textContent = 'PINGING NETWORK SERVERS...';
			
			const isOnline = await checkNetworkConnection();
			
			if (!isOnline) {
				// Show offline notification
				clearInterval(interval);
				setTimeout(() => {
					bootOverlay.classList.add('hidden');
					const offlineNotif = document.getElementById('offlineNotification');
					offlineNotif.classList.add('show');
					
					// Show offline mode button after 5 seconds
					setTimeout(() => {
						const offlineBtn = document.getElementById('offlineModeButton');
						offlineBtn.classList.add('show');
					}, 5000);
				}, 500);
				return;
			} else {
				statusText.textContent = 'NETWORK CONNECTION VERIFIED';
				setTimeout(() => {
					statusText.textContent = statuses[statusIndex];
					statusIndex++;
				}, 800);
			}
		}
		
		if (progress >= 100) {
			clearInterval(interval);
			statusText.textContent = 'CONNECTION ESTABLISHED';
			setTimeout(() => {
				bootOverlay.classList.add('hidden');
				showLoginPrompt();
			}, 500);
		}
	}, 100); // 10 seconds total (100ms * 100)
}

function showLoginPrompt(isOfflineMode = false) {
	const loginPrompt = document.getElementById('loginPrompt');
	const loginInput = document.getElementById('loginPassword');
	const loginButton = document.getElementById('loginButton');
	const loginError = document.getElementById('loginError');
	const loginSubtitle = loginPrompt.querySelector('.login-subtitle');
	
	// Update subtitle if offline mode
	if (isOfflineMode) {
		loginSubtitle.textContent = 'OFFLINE MODE - LIMITED FUNCTIONALITY';
	} else {
		loginSubtitle.textContent = 'AUTHORIZED PERSONNEL ONLY';
	}
	
	loginPrompt.classList.add('show');
	
	// Focus input
	setTimeout(() => loginInput.focus(), 100);
	
	// Handle login
	const attemptLogin = () => {
		const password = loginInput.value.toLowerCase().trim();
		
		if (password === 'silverwolf') {
			// Correct password
			loginError.classList.remove('show');
			loginPrompt.classList.remove('show');
			setTimeout(() => {
				unlockSystem();
			}, 300);
		} else if (password !== '') {
			// Wrong password
			loginError.classList.add('show');
			loginInput.value = '';
			loginInput.classList.add('shake');
			setTimeout(() => loginInput.classList.remove('shake'), 300);
			
			// Show lockout after 1 second
			setTimeout(() => {
				showLockout();
			}, 1000);
		}
	};
	
	loginButton.addEventListener('click', attemptLogin);
	loginInput.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			attemptLogin();
		}
	});
}

function showLockout() {
	const lockout = document.getElementById('lockoutNotification');
	const loginPrompt = document.getElementById('loginPrompt');
	
	loginPrompt.classList.remove('show');
	lockout.classList.add('show');
	
	// Keep showing lockout (requires reload)
	// User must refresh the page to try again
}

function unlockSystem() {
	systemUnlocked = true;
	const app = document.getElementById('app');
	const header = document.querySelector('header');
	const left = document.querySelector('.left');
	const right = document.querySelector('.right');
	const footer = document.querySelector('footer');
	
	// CRT reveal effect
	app.classList.add('reveal');
	
	setTimeout(() => {
		header.classList.add('reveal-item');
	}, 100);
	
	setTimeout(() => {
		left.classList.add('reveal-item');
	}, 300);
	
	setTimeout(() => {
		right.classList.add('reveal-item');
	}, 500);
	
	setTimeout(() => {
		footer.classList.add('reveal-item');
	}, 700);
	
	// Initialize demo state after reveal
	setTimeout(() => {
		const demo = generateData('shadow#0420');
		writeResults(demo);
		setMap(demo.lat, demo.lon, 11);
		setTimeout(() => activateCrosshair(), 500);
	}, 1000);
}

// Identify User Feature
let identifyScanActive = false;
let identifyIntervals = [];
let identifyTimeouts = [];
let activeWindows = [];
let draggedElement = null;
let dragOffset = { x: 0, y: 0 };

// Make element draggable
function makeDraggable(element) {
	element.addEventListener('mousedown', (e) => {
		if (e.target.classList.contains('terminal-panel-close') || 
		    e.target.classList.contains('profile-close') ||
		    e.target.classList.contains('abort-button')) {
			return;
		}
		
		draggedElement = element;
		const rect = element.getBoundingClientRect();
		dragOffset.x = e.clientX - rect.left;
		dragOffset.y = e.clientY - rect.top;
		
		element.style.cursor = 'grabbing';
		element.style.zIndex = 10100;
	});
}

document.addEventListener('mousemove', (e) => {
	if (draggedElement) {
		const x = e.clientX - dragOffset.x;
		const y = e.clientY - dragOffset.y;
		
		// Keep within screen bounds
		const maxX = window.innerWidth - draggedElement.offsetWidth;
		const maxY = window.innerHeight - draggedElement.offsetHeight;
		
		draggedElement.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
		draggedElement.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
	}
});

document.addEventListener('mouseup', () => {
	if (draggedElement) {
		draggedElement.style.cursor = 'move';
		draggedElement.style.zIndex = 10000;
		draggedElement = null;
	}
});

function getRandomPosition(width, height) {
	const maxX = window.innerWidth - width - 20;
	const maxY = window.innerHeight - height - 20;
	
	return {
		x: Math.max(10, Math.floor(Math.random() * maxX)),
		y: Math.max(10, Math.floor(Math.random() * maxY))
	};
}

function getFixedRightPosition(width, height) {
	return {
		x: window.innerWidth - width - 30,
		y: Math.max(20, (window.innerHeight - height) / 2)
	};
}

function startIdentifyScan() {
	if (identifyScanActive) return;
	
	identifyScanActive = true;
	const modal = document.getElementById('identifyModal');
	const abortContainer = document.getElementById('abortContainer');
	
	modal.classList.add('show');
	abortContainer.classList.add('show');
	
	// Clear any existing intervals and timeouts
	identifyIntervals.forEach(interval => clearInterval(interval));
	identifyTimeouts.forEach(timeout => clearTimeout(timeout));
	identifyIntervals = [];
	identifyTimeouts = [];
	activeWindows = [];
	
	// Terminal command generators
	const commands = {
		facial: [
			'> Initializing facial recognition engine...',
			'> Loading neural network model v3.2.1',
			'> Scanning biometric data points: 128/128',
			'> Cross-referencing with database...',
			'> Computing eigenfaces matrix...',
			'> Analyzing facial geometry patterns',
			'> Matching confidence: XX%',
			'> Searching government databases...',
			'> Accessing social media profiles...',
			'> Facial hash: 0xXXXXXXXX',
			'> Processing deep learning layers 1-10',
			'> Extracting feature vectors...',
			'> Correlation analysis in progress',
			'[OK] Primary match found',
			'[WARN] Multiple potential matches',
			'[ERROR] Insufficient lighting data'
		],
		database: [
			'> Connecting to central database...',
			'> SELECT * FROM users WHERE active=1',
			'> Query returned 2,847,392 records',
			'> Filtering by location parameters',
			'> Applying age range constraints',
			'> LIMIT 100 OFFSET 0',
			'> Indexing search results...',
			'> JOIN profiles ON user_id = profiles.id',
			'> Fetching metadata entries...',
			'> Cache hit ratio: XX%',
			'> Optimizing query execution plan',
			'> Reading from partition XX of 256',
			'[OK] Database connection stable',
			'[WARN] High latency detected',
			'[ERROR] Timeout on secondary server'
		],
		network: [
			'> Tracing network activity...',
			'> Analyzing TCP/IP packet headers',
			'> Detected XX active connections',
			'> Port scanning: 22, 80, 443, 8080',
			'> DNS lookup in progress...',
			'> Reverse IP geolocation active',
			'> Monitoring traffic patterns...',
			'> Detecting VPN/proxy signatures',
			'> SSL certificate analysis',
			'> Bandwidth utilization: XX Mbps',
			'> Latency: XX ms, Jitter: XX ms',
			'> Hop count: XX routers',
			'[OK] Network topology mapped',
			'[WARN] Encrypted traffic detected',
			'[ERROR] Connection refused on port 22'
		],
		biometric: [
			'> Scanning iris patterns...',
			'> Fingerprint analysis: 10 points',
			'> Voice pattern recognition active',
			'> Gait analysis in progress...',
			'> DNA sequence partial match',
			'> Retinal scan resolution: 1200 DPI',
			'> Extracting unique identifiers',
			'> Comparing with biometric vault',
			'> Liveness detection: PASSED',
			'> Matching score: XX.XX%',
			'> Anti-spoofing measures active',
			'> Multi-modal fusion processing',
			'[OK] Biometric signature extracted',
			'[WARN] Low quality sample detected',
			'[ERROR] Failed to capture iris data'
		],
		logs: [
			'> Parsing system logs...',
			'> [2025-10-20 12:34:56] Login attempt detected',
			'> [2025-10-20 12:35:12] Session initialized',
			'> Analyzing user behavior patterns',
			'> Keystroke dynamics recorded',
			'> Mouse movement analysis active',
			'> Screen time: XX hours XX minutes',
			'> Last activity: XX minutes ago',
			'> IP history: XX addresses logged',
			'> Device fingerprint: 0xXXXXXXXX',
			'> Browser: Chrome XX.X.XXXX.XX',
			'> OS: Windows 11 Build XXXXX',
			'[OK] Log analysis complete',
			'[WARN] Suspicious activity flagged',
			'[ERROR] Log file corrupted'
		],
		threat: [
			'> Assessing threat level...',
			'> Checking criminal databases',
			'> No warrants found',
			'> Cross-checking watchlists',
			'> Interpol database: NO MATCH',
			'> FBI Most Wanted: NO MATCH',
			'> Cyber threat intelligence scan',
			'> Malware signature analysis',
			'> Social engineering risk: LOW',
			'> Phishing attempt history: NONE',
			'> Risk score: XX/100',
			'> Behavioral anomaly detection',
			'[OK] No immediate threats detected',
			'[WARN] Previous security incidents: XX',
			'[ERROR] Unable to verify credentials'
		]
	};
	
	// Terminal types
	const terminalTypes = [
		{ title: 'FACIAL RECOGNITION', commands: commands.facial },
		{ title: 'DATABASE QUERY', commands: commands.database },
		{ title: 'NETWORK ANALYSIS', commands: commands.network },
		{ title: 'BIOMETRIC SCAN', commands: commands.biometric },
		{ title: 'SYSTEM LOGS', commands: commands.logs },
		{ title: 'THREAT ASSESSMENT', commands: commands.threat }
	];
	
	// Function to add random terminal lines
	function addTerminalLine(contentEl, lines) {
		const line = document.createElement('div');
		line.className = 'terminal-line';
		
		let text = lines[Math.floor(Math.random() * lines.length)];
		
		// Replace XX with random numbers
		text = text.replace(/XX/g, () => Math.floor(Math.random() * 99));
		text = text.replace(/XXXX/g, () => Math.floor(Math.random() * 9999));
		text = text.replace(/XXXXXX/g, () => Math.floor(Math.random() * 999999).toString(16).toUpperCase());
		text = text.replace(/XXXXXXXX/g, () => Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase().padStart(8, '0'));
		
		// Add color based on content
		if (text.includes('[OK]') || text.includes('PASSED')) {
			line.classList.add('success');
		} else if (text.includes('[ERROR]') || text.includes('FAILED')) {
			line.classList.add('error');
		} else if (text.includes('[WARN]')) {
			line.classList.add('warning');
		}
		
		line.textContent = text;
		contentEl.appendChild(line);
		
		// Auto-scroll to bottom
		contentEl.scrollTop = contentEl.scrollHeight;
		
		// Keep only last 40 lines
		while (contentEl.children.length > 40) {
			contentEl.removeChild(contentEl.firstChild);
		}
	}
	
	// Function to create a terminal window
	function createTerminalWindow(type) {
		const pos = getRandomPosition(420, 280);
		
		const panel = document.createElement('div');
		panel.className = 'terminal-panel';
		panel.style.left = pos.x + 'px';
		panel.style.top = pos.y + 'px';
		
		panel.innerHTML = `
			<div class="terminal-panel-header">
				<div class="terminal-panel-title">${type.title}</div>
				<div class="terminal-panel-close">×</div>
			</div>
			<div class="terminal-panel-content"></div>
		`;
		
		modal.appendChild(panel);
		makeDraggable(panel);
		
		// Show with animation
		setTimeout(() => panel.classList.add('show'), 10);
		
		const contentEl = panel.querySelector('.terminal-panel-content');
		
		// Add lines much faster (every 50-120ms)
		const interval = setInterval(() => {
			if (!identifyScanActive) {
				clearInterval(interval);
				return;
			}
			addTerminalLine(contentEl, type.commands);
		}, Math.floor(Math.random() * 70) + 50);
		
		identifyIntervals.push(interval);
		
		// Close button
		panel.querySelector('.terminal-panel-close').addEventListener('click', () => {
			panel.classList.remove('show');
			setTimeout(() => panel.remove(), 300);
			activeWindows = activeWindows.filter(w => w !== panel);
		});
		
		// Auto-close after 20 seconds
		const closeTimeout = setTimeout(() => {
			if (panel.parentElement) {
				panel.classList.remove('show');
				setTimeout(() => panel.remove(), 300);
				activeWindows = activeWindows.filter(w => w !== panel);
			}
		}, 20000);
		
		identifyTimeouts.push(closeTimeout);
		activeWindows.push(panel);
		
		return panel;
	}
	
	// Function to create profile scanner window (only once, fixed right position)
	function createProfileScanner() {
		const pos = getFixedRightPosition(360, 480);
		
		const scanner = document.createElement('div');
		scanner.className = 'profile-scanner';
		scanner.style.left = pos.x + 'px';
		scanner.style.top = pos.y + 'px';
		
		const idCode = Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase().padStart(8, '0');
		
		scanner.innerHTML = `
			<div class="profile-scanner-title">BIOMETRIC SCANNER</div>
			<div class="profile-icon-wrapper">
				<div class="profile-icon">
					<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
					</svg>
					<div class="scan-line"></div>
				</div>
			</div>
			<div class="profile-name">SCANNING...</div>
			<div class="profile-status">ANALYZING BIOMETRIC DATA</div>
			<div class="profile-id">ID: ${idCode}</div>
		`;
		
		modal.appendChild(scanner);
		makeDraggable(scanner);
		
		// Show with animation
		setTimeout(() => scanner.classList.add('show'), 10);
		
		const nameEl = scanner.querySelector('.profile-name');
		const idEl = scanner.querySelector('.profile-id');
		
		// Randomize names much faster (every 60ms)
		const nameInterval = setInterval(() => {
			if (!identifyScanActive) {
				clearInterval(nameInterval);
				return;
			}
			const firstName = FirstNames[Math.floor(Math.random() * FirstNames.length)];
			const lastName = LastNames[Math.floor(Math.random() * LastNames.length)];
			nameEl.textContent = `${firstName.toUpperCase()} ${lastName.toUpperCase()}`;
			
			// Update ID code occasionally
			if (Math.random() < 0.1) {
				const newId = Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase().padStart(8, '0');
				idEl.textContent = `ID: ${newId}`;
			}
		}, 60);
		
		identifyIntervals.push(nameInterval);
		
		// No auto-close, stays open until scan is aborted
		activeWindows.push(scanner);
		
		return scanner;
	}
	
	// Spawn windows randomly every 5 seconds
	function spawnRandomWindow() {
		if (!identifyScanActive) return;
		
		// Random number of terminals (2-5)
		const count = Math.floor(Math.random() * 4) + 2;
		
		for (let i = 0; i < count; i++) {
			const randomType = terminalTypes[Math.floor(Math.random() * terminalTypes.length)];
			setTimeout(() => createTerminalWindow(randomType), i * 300);
		}
		
		// Schedule next spawn (every 5 seconds)
		const nextSpawn = setTimeout(() => spawnRandomWindow(), 5000);
		identifyTimeouts.push(nextSpawn);
	}
	
	// Start spawning immediately with larger initial burst
	for (let i = 0; i < 8; i++) {
		setTimeout(() => {
			const randomType = terminalTypes[Math.floor(Math.random() * terminalTypes.length)];
			createTerminalWindow(randomType);
		}, i * 200);
	}
	
	// Add one profile scanner at start (fixed right position, no close button)
	setTimeout(() => createProfileScanner(), 1000);
	
	// Start random spawning after 5 seconds
	identifyTimeouts.push(setTimeout(() => spawnRandomWindow(), 5000));
	
	// Auto-stop after 2 minutes
	identifyTimeouts.push(setTimeout(() => {
		if (identifyScanActive) {
			stopIdentifyScan();
		}
	}, 120000));
}

function stopIdentifyScan() {
	identifyScanActive = false;
	const modal = document.getElementById('identifyModal');
	const abortContainer = document.getElementById('abortContainer');
	
	modal.classList.remove('show');
	abortContainer.classList.remove('show');
	
	// Clear all intervals and timeouts
	identifyIntervals.forEach(interval => clearInterval(interval));
	identifyTimeouts.forEach(timeout => clearTimeout(timeout));
	identifyIntervals = [];
	identifyTimeouts = [];
	
	// Close all active windows with animation
	activeWindows.forEach(window => {
		window.classList.remove('show');
		setTimeout(() => {
			if (window.parentElement) {
				window.remove();
			}
		}, 300);
	});
	activeWindows = [];
	
	// Clear modal contents
	setTimeout(() => {
		modal.innerHTML = '';
	}, 400);
}

// Start boot sequence on page load
window.addEventListener('DOMContentLoaded', () => {
	startBootSequence();
	
	// Offline mode button handler
	document.getElementById('offlineModeButton').addEventListener('click', () => {
		const offlineNotif = document.getElementById('offlineNotification');
		offlineNotif.classList.remove('show');
		
		// Show login prompt in offline mode
		setTimeout(() => {
			showLoginPrompt(true);
		}, 300);
	});
	
	// Abort identify button handler
	document.getElementById('abortIdentify').addEventListener('click', () => {
		stopIdentifyScan();
	});
});

// Terminal Command System
let terminalHistory = [];
let historyIndex = -1;

function openTerminal() {
	const modal = document.getElementById('terminalModal');
	const output = document.getElementById('terminalOutput');
	const input = document.getElementById('terminalInput');
	
	modal.classList.add('show');
	
	// Show welcome message
	output.innerHTML = `
		<div class="terminal-success">╔═══════════════════════════════════════════════════════════════════╗</div>
		<div class="terminal-success">║  GEO SAT COMMAND TERMINAL v2.3.1                                  ║</div>
		<div class="terminal-success">║  Secure Shell Access - Authorized Personnel Only                  ║</div>
		<div class="terminal-success">╚═══════════════════════════════════════════════════════════════════╝</div>
		<br>
		<div class="terminal-info">Type 'help' for available commands.</div>
		<br>
	`;
	
	setTimeout(() => input.focus(), 100);
}

function closeTerminal() {
	const modal = document.getElementById('terminalModal');
	modal.classList.remove('show');
}

function addTerminalOutput(text, type = 'normal') {
	const output = document.getElementById('terminalOutput');
	const line = document.createElement('div');
	line.className = type === 'error' ? 'terminal-error' : 
	                 type === 'success' ? 'terminal-success' : 
	                 type === 'info' ? 'terminal-info' : 
	                 type === 'command' ? 'terminal-command' : '';
	line.textContent = text;
	output.appendChild(line);
	output.scrollTop = output.scrollHeight;
}

function addTerminalPrompt(command) {
	const output = document.getElementById('terminalOutput');
	const line = document.createElement('div');
	line.innerHTML = `<span class="terminal-prompt">root@geosat:~$</span> <span class="terminal-command">${command}</span>`;
	output.appendChild(line);
}

function executeTerminalCommand(cmd) {
	const command = cmd.trim().toLowerCase();
	
	addTerminalPrompt(cmd);
	
	if (command === '') {
		return;
	}
	
	terminalHistory.unshift(cmd);
	if (terminalHistory.length > 50) terminalHistory.pop();
	historyIndex = -1;
	
	const args = command.split(' ');
	const mainCmd = args[0];
	
	switch (mainCmd) {
		case 'sudo':
			if (args[1] === 'identify') {
				addTerminalOutput('[sudo] password for root: ********', 'info');
				addTerminalOutput('Launching biometric analysis system...', 'success');
				addTerminalOutput('Spawning terminal panels...', 'success');
				addTerminalOutput('Initializing profile scanner...', 'success');
				addTerminalOutput('', 'normal');
				addTerminalOutput('✓ Biometric analysis started', 'success');
				addTerminalOutput('  Use the ABORT SCAN button to stop the operation.', 'info');
				closeTerminal();
				setTimeout(() => startIdentifyScan(), 500);
			} else {
				addTerminalOutput(`sudo: ${args.slice(1).join(' ')}: command not found`, 'error');
			}
			break;
			
		case 'help':
			addTerminalOutput('Available commands:', 'success');
			addTerminalOutput('', 'normal');
			addTerminalOutput('  sudo identify    - Launch biometric analysis scanner', 'normal');
			addTerminalOutput('  help            - Display this help message', 'normal');
			addTerminalOutput('  clear           - Clear terminal screen', 'normal');
			addTerminalOutput('  status          - Show system status', 'normal');
			addTerminalOutput('  exit            - Close terminal', 'normal');
			addTerminalOutput('  whoami          - Display current user', 'normal');
			addTerminalOutput('  version         - Show system version', 'normal');
			addTerminalOutput('', 'normal');
			addTerminalOutput('For detailed documentation, see docs.txt', 'info');
			break;
			
		case 'clear':
			document.getElementById('terminalOutput').innerHTML = '';
			break;
			
		case 'status':
			addTerminalOutput('═══════════════════════════════════════', 'success');
			addTerminalOutput('  SYSTEM STATUS REPORT', 'success');
			addTerminalOutput('═══════════════════════════════════════', 'success');
			addTerminalOutput('', 'normal');
			addTerminalOutput(`Network Status: ${networkOnline ? 'ONLINE' : 'OFFLINE'}`, networkOnline ? 'success' : 'error');
			addTerminalOutput(`Active Modes: ${activeModes.size > 0 ? Array.from(activeModes).join(', ').toUpperCase() : 'None'}`, 'info');
			addTerminalOutput(`System Locked: ${systemUnlocked ? 'No' : 'Yes'}`, systemUnlocked ? 'success' : 'error');
			addTerminalOutput(`Current Target: ${document.getElementById('out-user').textContent}`, 'info');
			addTerminalOutput('', 'normal');
			addTerminalOutput('All systems operational.', 'success');
			break;
			
		case 'exit':
			addTerminalOutput('Closing terminal...', 'info');
			setTimeout(() => closeTerminal(), 300);
			break;
			
		case 'whoami':
			addTerminalOutput('root', 'success');
			addTerminalOutput('Access Level: Administrator', 'info');
			addTerminalOutput('Clearance: TOP SECRET', 'info');
			break;
			
		case 'version':
			addTerminalOutput('GEO SAT IP Locator v2.3.1', 'success');
			addTerminalOutput('Build: 20251020-2347', 'info');
			addTerminalOutput('Kernel: Linux 6.2.0-geosat', 'info');
			addTerminalOutput('Shell: bash 5.1.16', 'info');
			break;
			
		default:
			addTerminalOutput(`bash: ${command}: command not found`, 'error');
			addTerminalOutput(`Type 'help' for available commands.`, 'info');
			break;
	}
	
	addTerminalOutput('', 'normal');
}

// Terminal event handlers
document.getElementById('terminalClose').addEventListener('click', closeTerminal);

document.getElementById('terminalInput').addEventListener('keydown', (e) => {
	const input = e.target;
	
	if (e.key === 'Enter') {
		const command = input.value;
		executeTerminalCommand(command);
		input.value = '';
	} else if (e.key === 'ArrowUp') {
		e.preventDefault();
		if (historyIndex < terminalHistory.length - 1) {
			historyIndex++;
			input.value = terminalHistory[historyIndex];
		}
	} else if (e.key === 'ArrowDown') {
		e.preventDefault();
		if (historyIndex > 0) {
			historyIndex--;
			input.value = terminalHistory[historyIndex];
		} else {
			historyIndex = -1;
			input.value = '';
		}
	}
});

// Close terminal on background click
document.getElementById('terminalModal').addEventListener('click', (e) => {
	if (e.target.id === 'terminalModal') {
		closeTerminal();
	}
});
