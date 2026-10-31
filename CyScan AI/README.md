# CyScan AI - Satellite Cyclone Detection & Tracking System 🌀📡

A web platform and deep learning pipeline for detecting tropical cyclones, estimating wind velocity and central pressure, localizing cyclonic eye centers, and issuing early warning bulletins using geostationary satellite imagery (INSAT-3D, GOES-16, Himawari-8).

---

## 🌟 Key Features

1. **Satellite AI Detection Studio**:
   - High-fidelity visual canvas displaying Infrared (IR 10.8µm) and Water Vapor channels.
   - Built-in presets for major historical systems (Amphan Cat-5, Fani Cat-4, Mocha Cat-4, Depression).
   - Drag-and-drop satellite imagery upload with simulated neural inference.
   - Interactive HUD overlays: Eye Bounding Box, Logarithmic Spiral Rainbands, and BD-curve Thermal Heatmaps.
   - Automatic Dvorak T-number estimation and Saffir-Simpson / IMD classification.

2. **Global Real-Time Storm Tracker**:
   - Interactive Leaflet.js map with CartoDB dark matter satellite night styling.
   - Real-time tracks, historical paths, and projected cones of uncertainty across the North Indian Ocean, Western Pacific, and Atlantic basins.

3. **Telemetry & Atmospheric Graphs**:
   - Dual-axis Chart.js visualization showing central pressure (hPa) drop vs. peak sustained wind speed (knots).
   - Cloud-top brightness temperature distribution histogram.

4. **Python FastAPI Backend (`backend_api.py`)**:
   - Ready-to-deploy REST API for PyTorch / TensorFlow deep learning models.
   - Automatic IMD categorization and radiometric temperature computation.

---

## 🚀 Quick Start Guide

### 1. Run the Web Application Immediately (Frontend)
The frontend is completely self-contained (HTML, CSS, JavaScript). You can open it in any modern browser:

- Double-click `index.html` in your file explorer, OR
- Serve it via a local static server:
```bash
# In this directory:
python -m http.server 3000
```
Then visit: `http://localhost:3000`

---

### 2. Optional: Run the Python AI Backend
If you want to connect a custom PyTorch / YOLOv8 model:

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Start the API server
uvicorn backend_api:app --reload --port 8000
```
API Documentation will be live at: `http://localhost:8000/docs`

---

## 🔬 Satellite Datasets & References
- **INSAT-3D / 3DR Imagery**: MOSDAC (ISRO Meteorological and Oceanographic Satellite Data Archival Centre)
- **TCIR Dataset**: Tropical Cyclone Infrared Image Dataset with best-track intensity labels
- **Dvorak Technique**: Advanced Dvorak Technique (ADT) for cloud pattern and T-number regression
