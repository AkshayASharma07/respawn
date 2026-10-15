# NANO-PULSE: The Medical Geometry Dossiers

An interactive, hand-drawn medical sketchbook puzzle game across three distinct socioeconomic tiers:
- **Upper-Middle Class (Siddharth Rao)**: *Cognitive Burnout & Neural Friction* (16-hour isolation work loops)
- **Middle Class (Kabir Ansari)**: *Sensory Overload & Exhaustion Neural Spikes* (14-hour delivery shifts in high-exposure rain zones)
- **Low-Income / Vulnerable Class (Radha Devi)**: *Critical Synaptic Degradation* (heavy post-viral load & systemic lack of healthcare resources)

---

## 🎮 Play Immediately in Browser

The game is running locally at:
```
http://localhost:8080/
```

To run manually at any time:
```bash
python -m http.server 8080
```

---

## 🎨 Visual & Thematic System: Hand-Drawn Sketchbook Aesthetic
- **Zero Sterile AI Neon**: Replaced with dark charcoal (`#121215`), worn graphite, vintage typewriter fonts (`Special Elite`), cursive handwritten doctor's field notes (`Caveat`), aged parchment paper grain, and official red ink diagnosis stamps.
- **Hand-Drawn Character Portraits**: Detailed anatomical sketch portraits capturing physical exhaustion, stress wrinkles, dark eye bags, wire glasses (Siddharth), delivery gear & rain streaks (Kabir), and weathered hospital tags (Radha).
- **Animated HTML5 Canvas Story Sequences**: Before every level, an animated case file renders directly on canvas with ink ECG waveforms, typewriter clinical notes, and heavy red diagnostic stamps.

---

## ⚙️ Unified Single-Canvas Game Engine
- **No Execution Breaking**: All level states, transitions, aiming, and particle simulations run inside a single, robust 60fps HTML5 Canvas loop (`js/canvasEngine.js`).
- **Tailored Geometric Challenges**:
  - **Siddharth**: Clean, structured 90-degree vector bouncing off 45-degree plasma mirrors ($\theta_i = \theta_r = 45^\circ$).
  - **Kabir**: Convoluted pathways with dynamic moving obstacles (oscillating traffic static) requiring dual-bounce vectors and precise timing.
  - **Radha**: Needle-slit passages ($\Delta\theta < 2.5^\circ$), jagged necrotic decay barriers, and high-stress target nodes.

---

## 🧠 Real-Time Telemetry & Bio-Harmonic Override
- **Continuous Metrics Tracking**:
  - Mouse Velocity ($\text{px/s}$)
  - Click Frequency ($\text{clicks/s}$)
  - Directional Jitter Volatility ($\%$)
  - Real-Time Composite Stress Index ($0\% - 100\%$)
- **Bio-Harmonic Override (>70% Stress)**:
  - Resonant Tibetan singing bowl audio chime (216 Hz & 432 Hz harmonics).
  - Soothing color shift from charcoal/crimson to warm aged parchment & sage green.
  - Target hitboxes expand by $1.6\times$.
  - Moving barrier velocities decrease by $50\%$.
  - Trajectory prediction line extends with calm guiding vectors.

---

## 💾 Persistence (`localStorage`)
- Automatically saves `currentPatient`, `currentLevelIndex`, `unlockedLevels`, and `patientStatus` (Critical / Stabilized).
- Main menu features **"Continue Session"** and **"Reset Progress (Day 1)"**.
