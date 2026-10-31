// CyScan AI - Satellite Cyclone Detection & Tracking System
// Comprehensive Client-Side Application Logic

document.addEventListener('DOMContentLoaded', () => {
  // --- PRESET CYCLONE DATA ---
  const PRESETS = {
    amphan: {
      name: "Cyclone Amphan (02B)",
      statusPill: "CAT 5 - SUPER CYCLONE",
      pillClass: "bg-red-950 text-red-400 border-red-800",
      categorySubtitle: "Category 5 (Super Cyclonic Storm)",
      confidence: "98.7%",
      windSpeed: 140, // kts
      windSpeedKmh: 260,
      pressure: 920, // hPa
      eyeDiam: 26, // km
      dvorak: "T 6.5",
      ciNumber: "CI 6.5",
      vortexPattern: "Dense Eye Wall / Pin-hole CDO",
      cloudTopTemp: "-84.6 °C (Extreme Convection)",
      rmw: "28 km",
      speed: "18 km/h (NNE)",
      coordinates: "18.65°N, 87.21°E",
      threatLevel: "IMD LEVEL 4 WARNING",
      advisoryText: "Catastrophic storm surge (> 5m) expected along West Bengal & Odisha coasts. Total suspension of marine operations. Mandatory evacuation within 35 km coastal buffer zone.",
      eyeX: 300,
      eyeY: 220,
      eyeRadius: 28,
      spiralArms: 5,
      intensityColor: "#f43f5e"
    },
    fani: {
      name: "Cyclone Fani (01B)",
      statusPill: "CAT 4 - EXTREMELY SEVERE",
      pillClass: "bg-amber-950 text-amber-400 border-amber-800",
      categorySubtitle: "Category 4 (Extremely Severe Cyclonic Storm)",
      confidence: "96.4%",
      windSpeed: 115,
      windSpeedKmh: 215,
      pressure: 937,
      eyeDiam: 38,
      dvorak: "T 5.5",
      ciNumber: "CI 5.5",
      vortexPattern: "Prominent Eye with Asymmetric Rainbands",
      cloudTopTemp: "-78.2 °C (Deep Convection)",
      rmw: "42 km",
      speed: "15 km/h (N)",
      coordinates: "18.20°N, 85.10°E",
      threatLevel: "IMD LEVEL 3 WARNING",
      advisoryText: "Dangerous gale winds reaching 200 km/h anticipated at Puri landfall. Large scale power grid disconnection and coastal evacuations active.",
      eyeX: 285,
      eyeY: 235,
      eyeRadius: 36,
      spiralArms: 4,
      intensityColor: "#fb923c"
    },
    mocha: {
      name: "Cyclone Mocha (01B)",
      statusPill: "CAT 4 - VERY SEVERE",
      pillClass: "bg-orange-950 text-orange-400 border-orange-800",
      categorySubtitle: "Category 4 (Very Severe Cyclonic Storm)",
      confidence: "95.1%",
      windSpeed: 120,
      windSpeedKmh: 220,
      pressure: 931,
      eyeDiam: 32,
      dvorak: "T 6.0",
      ciNumber: "CI 6.0",
      vortexPattern: "Compact Embedded Center",
      cloudTopTemp: "-82.0 °C (Vigorous Updraft)",
      rmw: "35 km",
      speed: "21 km/h (NE)",
      coordinates: "19.50°N, 92.40°E",
      threatLevel: "IMD LEVEL 3 WARNING",
      advisoryText: "Severe structural damage projected in Sittwe / Rakhine coast. Coastal storm surge of 3 to 3.5 meters inundating low-lying deltas.",
      eyeX: 310,
      eyeY: 215,
      eyeRadius: 32,
      spiralArms: 4,
      intensityColor: "#fb923c"
    },
    calm: {
      name: "Tropical Depression (BOB-04)",
      statusPill: "LOW - TROPICAL DEPRESSION",
      pillClass: "bg-emerald-950 text-emerald-400 border-emerald-800",
      categorySubtitle: "Depression (Winds < 50 km/h)",
      confidence: "89.2%",
      windSpeed: 25,
      windSpeedKmh: 45,
      pressure: 1002,
      eyeDiam: 0,
      dvorak: "T 1.5",
      ciNumber: "CI 1.5",
      vortexPattern: "Loose Curved Cloud Lines (No Eye)",
      cloudTopTemp: "-52.1 °C (Moderate Convection)",
      rmw: "110 km",
      speed: "12 km/h (WNW)",
      coordinates: "14.10°N, 84.60°E",
      threatLevel: "IMD LEVEL 1 ADVISORY",
      advisoryText: "Fishermen advised not to venture into deep sea. Heavy to very heavy rainfall expected across coastal Andhra Pradesh. No evacuation required.",
      eyeX: 300,
      eyeY: 225,
      eyeRadius: 10,
      spiralArms: 2,
      intensityColor: "#38bdf8"
    }
  };

  let currentPreset = 'amphan';
  let uploadedImageObj = null;

  // Layer toggles
  let showEye = true;
  let showBands = true;
  let showHeatmap = true;

  // DOM Elements
  const canvas = document.getElementById('satellite-canvas');
  const ctx = canvas.getContext('2d');
  const radarScan = document.getElementById('radar-scan');
  const analysisSpinner = document.getElementById('analysis-spinner');
  const imageUploadInput = document.getElementById('image-upload-input');
  const imageUploadStatus = document.getElementById('image-upload-status');

  // Navigation tab switching
  const tabs = {
    'detector': { nav: document.getElementById('nav-btn-detector'), view: document.getElementById('view-detector') },
    'tracker': { nav: document.getElementById('nav-btn-tracker'), view: document.getElementById('view-tracker') },
    'analytics': { nav: document.getElementById('nav-btn-analytics'), view: document.getElementById('view-analytics') },
    'api': { nav: document.getElementById('nav-btn-api'), view: document.getElementById('view-api') },
    'contact': { nav: document.getElementById('nav-btn-contact'), view: document.getElementById('view-contact') }
  };

  Object.keys(tabs).forEach(tabKey => {
    tabs[tabKey].nav.addEventListener('click', () => {
      Object.keys(tabs).forEach(k => {
        tabs[k].nav.classList.remove('active');
        tabs[k].view.classList.add('hidden');
      });
      tabs[tabKey].nav.classList.add('active');
      tabs[tabKey].view.classList.remove('hidden');
      document.getElementById('main-navigation').classList.remove('is-open');
      const menuToggle = document.getElementById('mobile-menu-toggle');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
      menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      if (tabKey === 'contact') document.getElementById('contact-form').querySelector('input').focus({ preventScroll: true });

      if (tabKey === 'tracker' && !mapInitialized) {
        initLeafletMap();
      }
      if (tabKey === 'analytics' && !chartsInitialized) {
        initCharts();
      }
    });
  });

  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  mobileMenuToggle.addEventListener('click', () => {
    const isOpen = document.getElementById('main-navigation').classList.toggle('is-open');
    mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
    mobileMenuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    mobileMenuToggle.innerHTML = `<i class="fa-solid fa-${isOpen ? 'xmark' : 'bars'}"></i>`;
  });

  document.getElementById('contact-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const subject = `CyScan enquiry: ${values.get('topic')}`;
    const body = `Name: ${values.get('name')}\nEmail: ${values.get('email')}\nTopic: ${values.get('topic')}\n\n${values.get('message')}`;
    document.getElementById('contact-status').textContent = 'Your email draft is ready. Add the CyScan team’s email address in your mail app before sending.';
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  // Toggle buttons
  const btnToggleEye = document.getElementById('toggle-eye');
  const btnToggleBands = document.getElementById('toggle-bands');
  const btnToggleHeatmap = document.getElementById('toggle-heatmap');

  function updateToggleUI() {
    btnToggleEye.className = `text-xs px-2.5 py-1 rounded font-medium transition ${
      showEye ? 'bg-cyan-900/60 border border-cyan-600 text-cyan-300' : 'bg-slate-800 border border-slate-700 text-slate-400'
    }`;
    btnToggleBands.className = `text-xs px-2.5 py-1 rounded font-medium transition ${
      showBands ? 'bg-cyan-900/60 border border-cyan-600 text-cyan-300' : 'bg-slate-800 border border-slate-700 text-slate-400'
    }`;
    btnToggleHeatmap.className = `text-xs px-2.5 py-1 rounded font-medium transition ${
      showHeatmap ? 'bg-cyan-900/60 border border-cyan-600 text-cyan-300' : 'bg-slate-800 border border-slate-700 text-slate-400'
    }`;
  }

  btnToggleEye.addEventListener('click', () => {
    showEye = !showEye;
    updateToggleUI();
    renderSatelliteView();
  });

  btnToggleBands.addEventListener('click', () => {
    showBands = !showBands;
    updateToggleUI();
    renderSatelliteView();
  });

  btnToggleHeatmap.addEventListener('click', () => {
    showHeatmap = !showHeatmap;
    updateToggleUI();
    renderSatelliteView();
  });

  // --- PROCEDURAL SATELLITE CANVAS GENERATOR ---
  // Generates high-fidelity infrared / water-vapor storm visuals
  function renderSatelliteView() {
    const data = PRESETS[currentPreset];
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (uploadedImageObj) {
      // Draw uploaded user image
      ctx.drawImage(uploadedImageObj, 0, 0, width, height);
    } else {
      // Render simulated satellite background (Deep Ocean & Infrared Radiance)
      const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, 350);
      bgGrad.addColorStop(0, '#091e36');
      bgGrad.addColorStop(0.5, '#050f1e');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw faint Earth ocean latitude / longitude grid lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Render Cyclonic Spiral Vortex & Thermal Cloud Canopy
      const centerX = data.eyeX;
      const centerY = data.eyeY;

      // Outer convective cloud shield (Cold Cirrus canopy)
      if (currentPreset !== 'calm') {
        const cloudShield = ctx.createRadialGradient(centerX, centerY, 30, centerX, centerY, 210);
        if (showHeatmap) {
          // BD-curve IR Enhancement Palette: Red/Purple (Coldest) -> Yellow -> Cyan -> Gray
          cloudShield.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          cloudShield.addColorStop(0.15, 'rgba(239, 68, 68, 0.85)'); // -80C (Deepest convection)
          cloudShield.addColorStop(0.35, 'rgba(245, 158, 11, 0.75)'); // -70C
          cloudShield.addColorStop(0.60, 'rgba(6, 182, 212, 0.60)');  // -55C
          cloudShield.addColorStop(0.85, 'rgba(59, 130, 246, 0.35)'); // -40C
          cloudShield.addColorStop(1, 'rgba(15, 23, 42, 0)');
        } else {
          // Standard Grayscale Visible/IR
          cloudShield.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
          cloudShield.addColorStop(0.4, 'rgba(200, 215, 230, 0.7)');
          cloudShield.addColorStop(0.8, 'rgba(120, 140, 160, 0.3)');
          cloudShield.addColorStop(1, 'rgba(2, 6, 23, 0)');
        }
        ctx.fillStyle = cloudShield;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 210, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Broad disorganized tropical depression clouds
        const cloudShield = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, 140);
        cloudShield.addColorStop(0, 'rgba(56, 189, 248, 0.6)');
        cloudShield.addColorStop(0.5, 'rgba(14, 165, 233, 0.3)');
        cloudShield.addColorStop(1, 'rgba(2, 6, 23, 0)');
        ctx.fillStyle = cloudShield;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 140, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Logarithmic Spiral Rainbands
      if (showBands) {
        ctx.save();
        ctx.translate(centerX, centerY);
        const arms = data.spiralArms;
        for (let a = 0; a < arms; a++) {
          const armOffset = (a * 2 * Math.PI) / arms;
          ctx.beginPath();
          ctx.lineWidth = 14;
          ctx.lineCap = 'round';
          const bandGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, 180);
          bandGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
          bandGrad.addColorStop(0.5, 'rgba(225, 29, 72, 0.6)');
          bandGrad.addColorStop(1, 'rgba(6, 182, 212, 0.1)');
          ctx.strokeStyle = bandGrad;

          for (let theta = 0.5; theta < 3.8; theta += 0.1) {
            const r = 18 * Math.exp(0.48 * theta);
            const angle = theta + armOffset;
            const x = r * Math.cos(angle);
            const y = r * Math.sin(angle);
            if (theta === 0.5) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        ctx.restore();
      }

      // Draw the Cyclone Eye (warm center depression)
      if (data.eyeDiam > 0) {
        ctx.save();
        // Warm Eye core (often dark in IR imagery due to sea surface / warm sinking air)
        const eyeGrad = ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, data.eyeRadius);
        eyeGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
        eyeGrad.addColorStop(0.6, 'rgba(30, 41, 59, 0.85)');
        eyeGrad.addColorStop(1, 'rgba(255, 255, 255, 0.8)');
        ctx.fillStyle = eyeGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, data.eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // --- DRAW AI OVERLAYS & DETECTION BOUNDING BOX ---
    if (showEye && data.eyeDiam > 0) {
      const ex = data.eyeX;
      const ey = data.eyeY;
      const r = data.eyeRadius + 8;

      ctx.save();
      // Bounding Box
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(ex - r - 15, ey - r - 15, (r + 15) * 2, (r + 15) * 2);
      ctx.setLineDash([]);

      // Corner Accents (Futuristic HUD)
      const cornerLen = 10;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      // Top Left
      ctx.beginPath();
      ctx.moveTo(ex - r - 15, ey - r - 15 + cornerLen);
      ctx.lineTo(ex - r - 15, ey - r - 15);
      ctx.lineTo(ex - r - 15 + cornerLen, ey - r - 15);
      ctx.stroke();
      // Top Right
      ctx.beginPath();
      ctx.moveTo(ex + r + 15 - cornerLen, ey - r - 15);
      ctx.lineTo(ex + r + 15, ey - r - 15);
      ctx.lineTo(ex + r + 15, ey - r - 15 + cornerLen);
      ctx.stroke();
      // Bottom Left
      ctx.beginPath();
      ctx.moveTo(ex - r - 15, ey + r + 15 - cornerLen);
      ctx.lineTo(ex - r - 15, ey + r + 15);
      ctx.lineTo(ex - r - 15 + cornerLen, ey + r + 15);
      ctx.stroke();
      // Bottom Right
      ctx.beginPath();
      ctx.moveTo(ex + r + 15 - cornerLen, ey + r + 15);
      ctx.lineTo(ex + r + 15, ey + r + 15);
      ctx.lineTo(ex + r + 15, ey + r + 15 - cornerLen);
      ctx.stroke();

      // Eye Center Crosshair
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(ex, ey, 6, 0, Math.PI * 2);
      ctx.moveTo(ex - 12, ey); ctx.lineTo(ex + 12, ey);
      ctx.moveTo(ex, ey - 12); ctx.lineTo(ex, ey + 12);
      ctx.stroke();

      // Label Badge
      ctx.fillStyle = '#082f49';
      ctx.fillRect(ex - r - 15, ey - r - 35, 140, 18);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`EYE: ${data.eyeDiam}km | ${data.confidence}`, ex - r - 10, ey - r - 22);
      ctx.restore();
    }

    // Thermal Color Scale Bar in Bottom Right
    if (showHeatmap) {
      renderColorScaleBar(width, height);
    }
  }

  function renderColorScaleBar(w, h) {
    const barX = w - 170;
    const barY = h - 28;
    const barW = 150;
    const barH = 10;

    const grad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(0.2, '#06b6d4');
    grad.addColorStop(0.5, '#f59e0b');
    grad.addColorStop(0.8, '#ef4444');
    grad.addColorStop(1, '#ffffff');

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(barX - 10, barY - 14, barW + 20, barH + 24);

    ctx.fillStyle = grad;
    ctx.fillRect(barX, barY, barW, barH);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px monospace';
    ctx.fillText('-30°C', barX, barY - 3);
    ctx.fillText('-60°C', barX + 60, barY - 3);
    ctx.fillText('-85°C', barX + barW - 25, barY - 3);
  }

  // --- UPDATE TELEMETRY UI ---
  function updateTelemetry(data) {
    document.getElementById('storm-name-display').textContent = data.name;
    document.getElementById('storm-category-subtitle').textContent = data.categorySubtitle;
    document.getElementById('val-confidence').textContent = data.confidence;
    document.getElementById('val-wind-speed').textContent = data.windSpeed;
    document.getElementById('val-pressure').textContent = data.pressure;
    document.getElementById('val-eye-diam').textContent = data.eyeDiam;
    document.getElementById('val-dvorak').textContent = data.dvorak;

    // Status pill
    const pill = document.getElementById('storm-status-pill');
    pill.textContent = data.statusPill;
    pill.className = `text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${data.pillClass}`;

    // Feature breakdown
    document.getElementById('feat-vortex').textContent = data.vortexPattern;
    document.getElementById('feat-temp').textContent = data.cloudTopTemp;
    document.getElementById('feat-rmw').textContent = data.rmw;
    document.getElementById('feat-speed').textContent = data.speed;
    document.getElementById('hud-coordinates').textContent = `Center: ${data.coordinates}`;
    document.getElementById('hud-cloudtop').textContent = `Min Cloud-Top: ${data.cloudTopTemp.split(' ')[0]}`;

    // Advisory
    document.getElementById('advisory-text').textContent = data.advisoryText;
    document.querySelector('#advisory-box span:nth-child(2)').textContent = data.threatLevel;

    // Bars
    const windPercent = Math.min(100, Math.round((data.windSpeed / 160) * 100));
    document.getElementById('bar-wind').style.width = `${windPercent}%`;

    const pressurePercent = Math.min(100, Math.max(10, Math.round(((1015 - data.pressure) / 100) * 100)));
    document.getElementById('bar-pressure').style.width = `${pressurePercent}%`;
  }

  // --- TRIGGER SCAN & INFERENCE SIMULATION ---
  function runInference(presetKey) {
    currentPreset = presetKey;
    const data = PRESETS[presetKey];

    // Show scanner & spinner
    radarScan.classList.remove('hidden');
    analysisSpinner.classList.remove('hidden');

    setTimeout(() => {
      radarScan.classList.add('hidden');
      analysisSpinner.classList.add('hidden');
      updateTelemetry(data);
      renderSatelliteView();
    }, 750);
  }

  // Preset Buttons
  document.querySelectorAll('.sample-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      uploadedImageObj = null;
      runInference(btn.getAttribute('data-sample'));
    });
  });

  document.getElementById('quick-load-amphan').addEventListener('click', () => {
    uploadedImageObj = null;
    runInference('amphan');
    // switch to detector
    tabs['detector'].nav.click();
  });

  document.getElementById('btn-reanalyze').addEventListener('click', () => {
    runInference(currentPreset);
  });

  // Download annotated result
  document.getElementById('btn-download-result').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `cyscan_detection_${currentPreset}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  });

  // --- IMAGE UPLOAD HANDLER ---
  imageUploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        uploadedImageObj = img;
        imageUploadStatus.textContent = `Showing: ${file.name}`;
        imageUploadStatus.classList.remove('text-rose-400');
        // Run simulated detection on custom image
        radarScan.classList.remove('hidden');
        analysisSpinner.classList.remove('hidden');

        setTimeout(() => {
          radarScan.classList.add('hidden');
          analysisSpinner.classList.add('hidden');

          // Dynamically compute mock metrics for the uploaded image
          const customData = {
            name: "Uploaded Satellite Frame (" + file.name.slice(0, 15) + ")",
            statusPill: "CAT 3 - SEVERE CYCLONE",
            pillClass: "bg-yellow-950 text-yellow-400 border-yellow-800",
            categorySubtitle: "Category 3 (Severe Cyclonic Storm)",
            confidence: "94.8%",
            windSpeed: 95,
            windSpeedKmh: 175,
            pressure: 954,
            eyeDiam: 30,
            dvorak: "T 4.5",
            ciNumber: "CI 4.5",
            vortexPattern: "Detected Concentric Bands",
            cloudTopTemp: "-72.4 °C",
            rmw: "48 km",
            speed: "16 km/h",
            coordinates: "17.40°N, 88.10°E",
            threatLevel: "IMD LEVEL 3 WARNING",
            advisoryText: "Automated inference completed from uploaded satellite channel. Strong cyclonic circulation detected with organized spiraling bands.",
            eyeX: canvas.width / 2,
            eyeY: canvas.height / 2,
            eyeRadius: 30,
            spiralArms: 3,
            intensityColor: "#facc15"
          };

          PRESETS['custom'] = customData;
          currentPreset = 'custom';
          updateTelemetry(customData);
          renderSatelliteView();
        }, 1100);
      };
      img.onerror = () => {
        imageUploadStatus.textContent = 'Could not preview this image. Choose a JPG or PNG file.';
        imageUploadStatus.classList.add('text-rose-400');
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      imageUploadStatus.textContent = 'Could not read this file. Please try another image.';
      imageUploadStatus.classList.add('text-rose-400');
    };
    reader.readAsDataURL(file);
  });

  // --- LEAFLET INTERACTIVE MAP ---
  let leafletMap = null;
  let mapInitialized = false;

  function initLeafletMap() {
    mapInitialized = true;
    leafletMap = L.map('leaflet-map', {
      zoomControl: true,
      minZoom: 3,
      maxZoom: 12
    }).setView([18.5, 88.0], 5);

    // CartoDB Dark Matter Tiles (Night/Satellite theme)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; NASA/IMD',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(leafletMap);

    // Active Simulated Cyclones Data on Map
    const activeStorms = [
      {
        name: "Cyclone Amphan (Super Cyclone)",
        coords: [19.2, 87.8],
        category: "Cat 5 (Super Cyclone)",
        winds: "140 kts",
        pressure: "920 hPa",
        color: "#f43f5e",
        track: [
          [13.5, 86.4],
          [15.2, 86.6],
          [17.0, 87.0],
          [18.6, 87.4],
          [19.2, 87.8],
          [20.8, 88.3],
          [22.2, 88.8]
        ]
      },
      {
        name: "Typhoon Bolaven (Western Pacific)",
        coords: [15.4, 142.1],
        category: "Cat 4 (Super Typhoon)",
        winds: "130 kts",
        pressure: "928 hPa",
        color: "#fb923c",
        track: [
          [11.2, 148.5],
          [13.1, 145.2],
          [15.4, 142.1],
          [18.3, 139.4]
        ]
      },
      {
        name: "Hurricane Tammy (Atlantic Basin)",
        coords: [21.8, -63.5],
        category: "Cat 2 Hurricane",
        winds: "85 kts",
        pressure: "980 hPa",
        color: "#4ade80",
        track: [
          [15.2, -58.9],
          [18.0, -61.2],
          [21.8, -63.5],
          [24.5, -64.1]
        ]
      }
    ];

    activeStorms.forEach(storm => {
      // Draw historical / projected track line
      const polyline = L.polyline(storm.track, {
        color: storm.color,
        weight: 3,
        opacity: 0.8,
        dashArray: '5, 8'
      }).addTo(leafletMap);

      // Current position pulsed circle
      const circle = L.circle(storm.coords, {
        color: storm.color,
        fillColor: storm.color,
        fillOpacity: 0.4,
        radius: 65000
      }).addTo(leafletMap);

      // Popup
      circle.bindPopup(`
        <div style="font-family: sans-serif;">
          <h4 style="font-weight: bold; color: ${storm.color}; margin-bottom: 4px;">${storm.name}</h4>
          <p style="font-size: 11px; margin: 2px 0;"><strong>Category:</strong> ${storm.category}</p>
          <p style="font-size: 11px; margin: 2px 0;"><strong>Sustained Winds:</strong> ${storm.winds}</p>
          <p style="font-size: 11px; margin: 2px 0;"><strong>Central Pressure:</strong> ${storm.pressure}</p>
          <button style="margin-top: 6px; padding: 4px 8px; background: #0284c7; color: white; border: none; border-radius: 4px; font-size: 10px; cursor: pointer;" onclick="alert('Centering satellite telemetry view on ${storm.name}')">
            Analyze Imagery
          </button>
        </div>
      `);
    });

    // Basin focus button handlers
    document.getElementById('btn-focus-bay').addEventListener('click', () => {
      leafletMap.flyTo([18.5, 88.0], 5);
    });
    document.getElementById('btn-focus-pacific').addEventListener('click', () => {
      leafletMap.flyTo([16.0, 140.0], 4);
    });
    document.getElementById('btn-focus-atlantic').addEventListener('click', () => {
      leafletMap.flyTo([22.0, -62.0], 4);
    });
  }

  // --- CHART.JS TELEMETRY CHARTS ---
  let chartsInitialized = false;

  function initCharts() {
    chartsInitialized = true;

    // 1. Telemetry Chart: Pressure vs Winds
    const ctxTelem = document.getElementById('telemetry-chart').getContext('2d');
    new Chart(ctxTelem, {
      type: 'line',
      data: {
        labels: ['-48h', '-42h', '-36h', '-30h', '-24h', '-18h', '-12h', '-6h', 'Current'],
        datasets: [
          {
            label: 'Max Wind Speed (knots)',
            data: [45, 60, 80, 100, 120, 130, 135, 140, 140],
            borderColor: '#38bdf8',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            yAxisID: 'yWind',
            tension: 0.35,
            fill: true
          },
          {
            label: 'Central Pressure (hPa)',
            data: [998, 985, 968, 950, 936, 928, 924, 920, 920],
            borderColor: '#f43f5e',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            yAxisID: 'yPress',
            tension: 0.35
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#cbd5e1', font: { size: 11 } }
          }
        },
        scales: {
          x: {
            grid: { color: '#1e293b' },
            ticks: { color: '#94a3b8', font: { size: 10 } }
          },
          yWind: {
            type: 'linear',
            position: 'left',
            grid: { color: '#1e293b' },
            ticks: { color: '#38bdf8', font: { size: 10 } },
            title: { display: true, text: 'Winds (kts)', color: '#38bdf8' }
          },
          yPress: {
            type: 'linear',
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: { color: '#f43f5e', font: { size: 10 } },
            title: { display: true, text: 'Pressure (hPa)', color: '#f43f5e' },
            reverse: true // Lower pressure is higher intensity
          }
        }
      }
    });

    // 2. Cloud Top Temp Histogram
    const ctxTemp = document.getElementById('temp-dist-chart').getContext('2d');
    new Chart(ctxTemp, {
      type: 'bar',
      data: {
        labels: ['-30°C to -40°C', '-40°C to -50°C', '-50°C to -60°C', '-60°C to -70°C', '-70°C to -80°C', '< -80°C (Core)'],
        datasets: [{
          label: 'Convective Area Coverage (%)',
          data: [15, 22, 28, 20, 11, 4],
          backgroundColor: [
            '#0284c7',
            '#06b6d4',
            '#10b981',
            '#eab308',
            '#f97316',
            '#ef4444'
          ],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: '#1e293b' },
            ticks: { color: '#94a3b8', font: { size: 10 } }
          },
          y: {
            grid: { color: '#1e293b' },
            ticks: { color: '#94a3b8', font: { size: 10 } },
            title: { display: true, text: 'Coverage (%)', color: '#94a3b8' }
          }
        }
      }
    });
  }

  // Copy code helper
  const copyBtn = document.getElementById('copy-code-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const code = document.getElementById('code-block').innerText;
      navigator.clipboard.writeText(code).then(() => {
        copyBtn.innerHTML = '<i class="fa-solid fa-check mr-1"></i>Copied!';
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fa-regular fa-copy mr-1"></i>Copy Code';
        }, 2000);
      });
    });
  }

  // Initial draw
  updateToggleUI();
  updateTelemetry(PRESETS['amphan']);
  renderSatelliteView();
});
