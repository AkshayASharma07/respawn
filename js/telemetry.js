// ==============================================================================
// NANO-PULSE: REAL-TIME STATISTICAL TELEMETRY ENGINE & COGNITIVE CLASSIFIER
// Strict Vanilla JS Implementation (No External Libraries)
// ==============================================================================

// REQUIREMENT 1.1: EMBEDDED IDEAL BASELINE CSV DATA
const IDEAL_BASELINE_CSV = `stage,ideal_velocity,ideal_click_rate,ideal_jitter
1,0.8,0.2,5.0
2,1.0,0.5,8.0
3,1.2,0.6,10.0
4,1.5,0.8,12.0
5,1.7,1.0,15.0
6,2.0,1.2,18.0
7,2.2,1.5,22.0
8,2.5,2.0,25.0
9,2.8,2.5,30.0`;

// REQUIREMENT 1.2: PARSE CSV INTO OBJECT MAPPED BY STAGE NUMBER
function parseIdealBaselineCSV(csvString) {
  const lines = csvString.trim().split('\n');
  const stageMap = {};
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',').map(item => item.trim());
    if (parts.length >= 4) {
      const stageNum = parseInt(parts[0], 10);
      stageMap[stageNum] = {
        stage: stageNum,
        ideal_velocity: parseFloat(parts[1]),
        ideal_click_rate: parseFloat(parts[2]),
        ideal_jitter: parseFloat(parts[3])
      };
    }
  }
  return stageMap;
}

const IDEAL_BASELINE = parseIdealBaselineCSV(IDEAL_BASELINE_CSV);

// REQUIREMENT 3.2: RAW MOUSE LOGGING ARRAY
const rawMouseLogs = [];
window.rawMouseLogs = rawMouseLogs;

// REQUIREMENT 3.1: PERSISTENT PROGRESS TRACKING VIA LOCALSTORAGE
let completedStages = [];
try {
  const savedStages = localStorage.getItem('completedStages');
  if (savedStages) {
    completedStages = JSON.parse(savedStages);
    if (!Array.isArray(completedStages)) completedStages = [];
  }
} catch (e) {
  completedStages = [];
}

// Global Telemetry State
let currentStage = 1;
let stressIndex = 20; // 0-100 scale
let isOverrideActive = false;
let overrideTimer = null;
let currentMindset = "Methodical";

// Stage-by-stage tracking data
const stageMetrics = {};
for (let s = 1; s <= 9; s++) {
  stageMetrics[s] = {
    stage: s,
    mindsets: [],
    dominantMindset: "Methodical",
    peakDeviation: 0,
    samplesCount: 0,
    overrideTriggered: 0,
    avgVelocity: 0,
    avgJitter: 0
  };
}

// Rolling 3-second sliding window buffers
const mouseMovementBuffer = []; // { time, x, y, dx, dy, dt, speed, angle }
const clickTimestamps = [];     // timestamps

// Real-time rolling metrics
let live_velocity = 0.8;
let live_click_rate = 0.2;
let live_jitter = 5.0;
let lastMousePoint = null;
let lastMouseAngle = null;

// ==============================================================================
// 1. EVENT LISTENERS: CONTINUOUS RAW LOGGING & ROLLING WINDOW SAMPLING
// ==============================================================================

window.addEventListener('mousemove', (event) => {
  const now = Date.now();

  // REQUIREMENT 3.2: PUSH RAW MOVEMENT LOG
  rawMouseLogs.push({
    timestamp: now,
    x: event.clientX,
    y: event.clientY,
    stage: currentStage
  });

  // Cap memory growth during extended play
  if (rawMouseLogs.length > 250000) {
    rawMouseLogs.shift();
  }

  // Calculate delta movements for 3-second rolling averages
  if (lastMousePoint) {
    const dt = Math.max(1, now - lastMousePoint.time);
    const dx = event.clientX - lastMousePoint.x;
    const dy = event.clientY - lastMousePoint.y;
    const dist = Math.hypot(dx, dy);

    // Speed in px/ms (matching ideal_velocity scale ~0.8 - 2.8)
    const speed = dist / dt;
    const angle = Math.atan2(dy, dx);

    let angleDelta = 0;
    if (lastMouseAngle !== null && dist > 3) {
      angleDelta = Math.abs(angle - lastMouseAngle);
      if (angleDelta > Math.PI) angleDelta = (Math.PI * 2) - angleDelta;
    }

    mouseMovementBuffer.push({
      time: now,
      x: event.clientX,
      y: event.clientY,
      dist: dist,
      speed: speed,
      angleDelta: angleDelta
    });

    lastMouseAngle = angle;
  }

  lastMousePoint = { x: event.clientX, y: event.clientY, time: now };
}, { passive: true });

window.addEventListener('mousedown', () => {
  const now = Date.now();
  clickTimestamps.push(now);
}, { passive: true });

// Clean rolling buffers (retain only last 3000ms)
function pruneRollingBuffers(now) {
  const cutoff = now - 3000;
  while (mouseMovementBuffer.length > 0 && mouseMovementBuffer[0].time < cutoff) {
    mouseMovementBuffer.shift();
  }
  while (clickTimestamps.length > 0 && clickTimestamps[0] < cutoff) {
    clickTimestamps.shift();
  }
}

// Calculate rolling 3-second averages
function calculateRollingAverages() {
  const now = Date.now();
  pruneRollingBuffers(now);

  // 1. Rolling Click Rate (clicks per second across 3.0s window)
  live_click_rate = Math.round((clickTimestamps.length / 3.0) * 100) / 100;

  // 2. Rolling Velocity (px / ms across window)
  if (mouseMovementBuffer.length >= 2) {
    let totalDist = 0;
    let totalTime = 3000;
    for (let i = 0; i < mouseMovementBuffer.length; i++) {
      totalDist += mouseMovementBuffer[i].dist;
    }
    // Convert to px/ms (e.g., 2400px over 3000ms = 0.80 px/ms)
    live_velocity = Math.round((totalDist / totalTime) * 100) / 100;
  } else {
    // Idle fallback
    live_velocity = Math.max(0.1, live_velocity * 0.8);
  }

  // 3. Rolling Jitter (angular volatility and directional reversal frequency)
  if (mouseMovementBuffer.length >= 3) {
    let sharpTurnCount = 0;
    let totalTurnRad = 0;
    for (let i = 0; i < mouseMovementBuffer.length; i++) {
      const ad = mouseMovementBuffer[i].angleDelta;
      totalTurnRad += ad;
      if (ad > 0.45) sharpTurnCount++;
    }
    // Scaled jitter index matching 5.0 - 30.0 baseline
    const calculatedJitter = (sharpTurnCount * 3.2) + (totalTurnRad * 1.5);
    live_jitter = Math.round(Math.min(50, Math.max(3.0, calculatedJitter)) * 10) / 10;
  } else {
    live_jitter = Math.max(4.0, live_jitter * 0.9);
  }
}

// ==============================================================================
// 2. REQUIREMENT 1.4: 1-SECOND ML LOGIC & PERCENTAGE DEVIATION COMPARISON
// ==============================================================================

setInterval(() => {
  calculateRollingAverages();

  const ideal = IDEAL_BASELINE[currentStage] || IDEAL_BASELINE[1];

  // Percentage deviations: ((live - ideal) / ideal) * 100
  const dev_velocity = ((live_velocity - ideal.ideal_velocity) / ideal.ideal_velocity) * 100;
  const dev_click_rate = ((live_click_rate - ideal.ideal_click_rate) / ideal.ideal_click_rate) * 100;
  const dev_jitter = ((live_jitter - ideal.ideal_jitter) / ideal.ideal_jitter) * 100;

  // Combined deviation across all three metrics (focusing on excess strain above baseline)
  const positiveDevVel = Math.max(0, dev_velocity);
  const positiveDevClk = Math.max(0, dev_click_rate);
  const positiveDevJit = Math.max(0, dev_jitter);
  const combinedDeviation = Math.round((positiveDevVel + positiveDevClk + positiveDevJit) / 3);

  // Update stressIndex based on combined deviation threshold (50%)
  if (combinedDeviation > 50) {
    stressIndex = Math.min(100, stressIndex + Math.max(3, Math.round((combinedDeviation - 50) * 0.15)));
  } else {
    stressIndex = Math.max(12, stressIndex - 2);
  }

  // REQUIREMENT 2.2: COGNITIVE MINDSET CLASSIFIER STATE MACHINE
  // "Methodical" (0-15% dev), "Cognitive Friction" (16-40% dev),
  // "Task Saturation" (41-75% dev), "Acute Panic" (76%+ dev)
  if (combinedDeviation <= 15) {
    currentMindset = "Methodical";
  } else if (combinedDeviation <= 40) {
    currentMindset = "Cognitive Friction";
  } else if (combinedDeviation <= 75) {
    currentMindset = "Task Saturation";
  } else {
    currentMindset = "Acute Panic";
  }

  // Log mindset and metrics for current stage
  const sm = stageMetrics[currentStage];
  if (sm) {
    sm.mindsets.push(currentMindset);
    sm.peakDeviation = Math.max(sm.peakDeviation, combinedDeviation);
    sm.samplesCount++;
    sm.avgVelocity = Math.round(((sm.avgVelocity * (sm.samplesCount - 1) + live_velocity) / sm.samplesCount) * 100) / 100;
    sm.avgJitter = Math.round(((sm.avgJitter * (sm.samplesCount - 1) + live_jitter) / sm.samplesCount) * 10) / 10;

    // Calculate dominant mindset (mode)
    const counts = {};
    sm.mindsets.forEach(m => { counts[m] = (counts[m] || 0) + 1; });
    let maxCount = 0;
    let dom = "Methodical";
    for (const m in counts) {
      if (counts[m] > maxCount) {
        maxCount = counts[m];
        dom = m;
      }
    }
    sm.dominantMindset = dom;
  }

  // REQUIREMENT 1.4: DISPATCH CUSTOM EVENT WHEN STRESS > 80
  if (stressIndex > 80 && !isOverrideActive) {
    window.dispatchEvent(new CustomEvent('triggerBioHarmonicOverride', {
      detail: {
        stressIndex: stressIndex,
        stage: currentStage,
        combinedDeviation: combinedDeviation,
        mindset: currentMindset,
        timestamp: Date.now()
      }
    }));
  }

  // Synchronize HUD readouts if present
  updateHudTelemetry();
}, 1000);

// ==============================================================================
// 3. REQUIREMENT 2.1: SILENT ADAPTIVE OVERRIDE (NO INTERRUPTIONS)
// ==============================================================================

window.addEventListener('triggerBioHarmonicOverride', (event) => {
  isOverrideActive = true;
  if (stageMetrics[currentStage]) {
    stageMetrics[currentStage].overrideTriggered++;
  }

  // SILENT TOGGLE: ONLY toggle CSS classes & alter game physics variables
  document.body.classList.add('bio-harmonic-override-active');

  const canvas = document.getElementById('nano-canvas');
  if (canvas) canvas.classList.add('bio-harmonic-calm');

  const canvasStage = document.getElementById('canvas-stage');
  if (canvasStage) canvasStage.classList.add('bio-harmonic-active');

  // Slow obstacles and expand target tolerances smoothly
  if (window.canvasEngine && typeof window.canvasEngine.applyBioHarmonicSlowing === 'function') {
    window.canvasEngine.applyBioHarmonicSlowing(true);
  }

  // Reset override quietly after soothing window
  if (overrideTimer) clearTimeout(overrideTimer);
  overrideTimer = setTimeout(() => {
    isOverrideActive = false;
    stressIndex = Math.min(40, stressIndex);
    document.body.classList.remove('bio-harmonic-override-active');
    if (canvas) canvas.classList.remove('bio-harmonic-calm');
    if (canvasStage) canvasStage.classList.remove('bio-harmonic-active');

    if (window.canvasEngine && typeof window.canvasEngine.applyBioHarmonicSlowing === 'function') {
      window.canvasEngine.applyBioHarmonicSlowing(false);
    }
  }, 9000);
});

// HUD Update Helper
function updateHudTelemetry() {
  const elStress = document.getElementById('telemetry-stress-value');
  const elJitter = document.getElementById('telemetry-jitter-value');
  const elClickRate = document.getElementById('telemetry-clicks-value');
  const elOverrideBadge = document.getElementById('telemetry-override-badge');

  if (elStress) {
    elStress.textContent = `${stressIndex}%`;
    elStress.className = stressIndex > 65 ? 'val-danger' : (stressIndex > 45 ? 'val-warning' : 'val-calm');
  }
  if (elJitter) {
    elJitter.textContent = `${live_jitter}%`;
  }
  if (elClickRate) {
    elClickRate.textContent = `${live_click_rate}/s`;
  }
  if (elOverrideBadge) {
    if (isOverrideActive) {
      elOverrideBadge.className = 'override-badge active';
      elOverrideBadge.textContent = 'BIO-HARMONIC OVERRIDE ACTIVE';
    } else {
      elOverrideBadge.className = 'override-badge standby';
      elOverrideBadge.textContent = `STATE: ${currentMindset.toUpperCase()}`;
    }
  }
}

// ==============================================================================
// 4. REQUIREMENT 3.3: CONTINUOUS FILE EXPORT (CSV GENERATION & DOWNLOAD)
// ==============================================================================

function exportRawData() {
  if (rawMouseLogs.length === 0) {
    rawMouseLogs.push({
      timestamp: Date.now(),
      x: Math.round(window.innerWidth / 2),
      y: Math.round(window.innerHeight / 2),
      stage: currentStage
    });
  }

  const header = "timestamp,x,y,stage\n";
  const rows = rawMouseLogs.map(log => `${log.timestamp},${log.x},${log.y},${log.stage}`).join('\n');
  const csvBlob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
  const downloadUrl = URL.createObjectURL(csvBlob);

  const downloadLink = document.createElement('a');
  downloadLink.href = downloadUrl;
  downloadLink.download = 'nanopulse_mouse_telemetry.csv';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(downloadUrl);
}
window.exportRawData = exportRawData;

// Stage Progression Persistence
function recordStageCompletion(stageNum) {
  if (!completedStages.includes(stageNum)) {
    completedStages.push(stageNum);
    completedStages.sort((a, b) => a - b);
    localStorage.setItem('completedStages', JSON.stringify(completedStages));
  }
}
window.recordStageCompletion = recordStageCompletion;

// ==============================================================================
// 5. REQUIREMENT 5: THE GRITTY REPORT CARD UI (MEDICAL DOSSIER ON A CLIPBOARD)
// ==============================================================================

const STAGE_NAMES = {
  1: { patient: "Siddharth Rao", tier: "Upper-Middle", title: "Specular Mirrors" },
  2: { patient: "Siddharth Rao", tier: "Upper-Middle", title: "Affine Matrix" },
  3: { patient: "Siddharth Rao", tier: "Upper-Middle", title: "Geodesic Ricochet" },
  4: { patient: "Kabir Ansari",  tier: "Middle Class", title: "Wealthy Protocol" },
  5: { patient: "Kabir Ansari",  tier: "Middle Class", title: "Resource Strain" },
  6: { patient: "Kabir Ansari",  tier: "Middle Class", title: "Apex Mutation Survival" },
  7: { patient: "Radha Devi",    tier: "Low-Income",   title: "Cellular Strand Passage" },
  8: { patient: "Radha Devi",    tier: "Low-Income",   title: "Dynamic Splicing" },
  9: { patient: "Radha Devi",    tier: "Low-Income",   title: "Critical Synaptic Crisis" }
};

function generateReportCard(userMetrics) {
  let modal = document.getElementById('report-card');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'report-card';
    modal.className = 'modal-backdrop report-card-modal';
    document.body.appendChild(modal);
  }

  // Determine overall metrics
  const stagesList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let totalPeakDev = 0;
  let acutePanicCount = 0;
  let saturationCount = 0;

  stagesList.forEach(s => {
    const sm = stageMetrics[s];
    if (sm) {
      totalPeakDev = Math.max(totalPeakDev, sm.peakDeviation);
      if (sm.dominantMindset === "Acute Panic") acutePanicCount++;
      if (sm.dominantMindset === "Task Saturation") saturationCount++;
    }
  });

  // Determine Overall Cognitive Resilience Profile
  let profileCategory = "HIGH RESILIENCE";
  let profileNotes = "Operator exhibited steady motor execution with high angular velocity stability across escalating socio-economic protocols. Cognitive friction remained within acceptable tolerances.";
  if (acutePanicCount >= 2 || totalPeakDev > 75) {
    profileCategory = "ACUTE STRESS SUSCEPTIBILITY";
    profileNotes = "Operator exhibited erratic kinetic tremors and compensatory saccades during critical resource deprivation. Autonomous bio-harmonic interventions were required to stabilize synaptic accuracy.";
  } else if (saturationCount >= 2 || totalPeakDev > 40) {
    profileCategory = "MODERATE COGNITIVE FRICTION";
    profileNotes = "Operator maintained procedure integrity but exhibited neuromotor tension spikes during transition to congested trajectory thresholds.";
  }

  // Calculate Bearable Stress Threshold
  const bearableStressThreshold = Math.max(45, Math.min(88, Math.round(100 - (totalPeakDev * 0.45))));

  // Populate Dossier Clipboard Markup
  modal.innerHTML = `
    <div class="clipboard-container ink-splatter">
      <div class="clipboard-clip"></div>
      
      <!-- Fixed Dossier Header -->
      <div class="dossier-fixed-header">
        <div class="dfh-top">
          <span class="dfh-stamp">CONFIDENTIAL MEDICAL CLINICAL RECORD</span>
          <span class="dfh-crn">CRN: 1PH01022</span>
        </div>
        <h2 class="dfh-operator">OPERATOR: Akshay A Sharma | CRN: 1PH01022</h2>
        <div class="dfh-meta">
          <span>FACILITY: METROPOLITAN NEURAL TRAUMA WING</span> • 
          <span>EVALUATION: BIO-HARMONIC KINEMATICS</span> • 
          <span>DATE: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })}</span>
        </div>
      </div>

      <div class="dossier-body">
        <!-- Section: Cognitive Resilience Profile -->
        <div class="dossier-section">
          <h3 class="section-title">I. COGNITIVE RESILIENCE PROFILE</h3>
          <div class="profile-box">
            <div class="profile-classification">
              CLASSIFICATION: <strong>${profileCategory}</strong>
            </div>
            <p class="profile-text">${profileNotes}</p>
          </div>
        </div>

        <!-- Section: Bearable Stress Threshold -->
        <div class="dossier-section">
          <h3 class="section-title">II. BEARABLE STRESS THRESHOLD</h3>
          <div class="threshold-metric-row">
            <div class="threshold-num">${bearableStressThreshold}%</div>
            <div class="threshold-explanation">
              <strong>Critical Motor Stability Limit:</strong> Maximum stress envelope before operator kinetic precision deteriorated beyond ideal trajectory baseline. Peak observed deviation: ${totalPeakDev}%.
            </div>
          </div>
        </div>

        <!-- Section: Stage Summary Table -->
        <div class="dossier-section">
          <h3 class="section-title">III. PROCEDURAL STAGES MATRIX (STAGES 1 - 9)</h3>
          <table class="dossier-table">
            <thead>
              <tr>
                <th>STAGE</th>
                <th>DOSSIER / CLINICAL FOCUS</th>
                <th>DOMINANT MINDSET</th>
                <th>PEAK DEVIATION</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              ${stagesList.map(stg => {
                const info = STAGE_NAMES[stg];
                const sm = stageMetrics[stg];
                const isCleared = completedStages.includes(stg) || (sm && sm.samplesCount > 0);
                const dominant = sm && sm.samplesCount > 0 ? sm.dominantMindset : "Methodical";
                const peak = sm ? `${sm.peakDeviation}%` : "0%";
                return `
                  <tr>
                    <td><strong>STAGE 0${stg}</strong></td>
                    <td>
                      <div>${info.patient} (${info.tier})</div>
                      <small style="opacity:0.8;">${info.title}</small>
                    </td>
                    <td><span class="mindset-tag mindset-${dominant.toLowerCase().replace(/\s+/g, '-')}">${dominant.toUpperCase()}</span></td>
                    <td>${peak}</td>
                    <td>${isCleared ? 'COMPLETED' : 'PENDING'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <!-- Section: Actionable Clinical Recommendations -->
        <div class="dossier-section" style="margin-top: 14px;">
          <h3 class="section-title">IV. CLINICAL RECOMMENDATIONS</h3>
          <ul class="dossier-recommendations">
            <li>Engage in deliberate low-velocity calibration before high-strain working-class protocols.</li>
            <li>Autonomous Bio-Harmonic overrides successfully mitigated kinetic panic without requiring procedure abort.</li>
            <li>Export raw time-series data below for secondary Scikit-Learn IsolationForest anomaly validation.</li>
          </ul>
        </div>
      </div>

      <!-- Dossier Controls & Action Buttons -->
      <div class="dossier-footer">
        <button id="exportDataBtn">Download Raw Mouse Telemetry (.csv)</button>
        <button id="clearLogsBtn">Clear All Operator Logs</button>
        <button id="closeReportCardBtn" class="rc-btn-close">Close Dossier</button>
      </div>
    </div>
  `;

  // Bind Buttons
  const exportBtn = document.getElementById('exportDataBtn');
  if (exportBtn) exportBtn.addEventListener('click', exportRawData);

  const clearBtn = document.getElementById('clearLogsBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      const confirmClear = confirm("Clear all operator logs, reset progression and reload?");
      if (confirmClear) {
        localStorage.clear();
        rawMouseLogs.length = 0;
        completedStages.length = 0;
        location.reload();
      }
    });
  }

  const closeBtn = document.getElementById('closeReportCardBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.style.display = 'none';
      const canvasStage = document.getElementById('canvas-stage');
      if (canvasStage) canvasStage.style.display = 'flex';
    });
  }

  // Unhide Modal
  modal.classList.remove('hidden');
  modal.style.display = 'flex';
}
window.generateReportCard = generateReportCard;

// ==============================================================================
// 6. BACKWARD COMPATIBILITY LAYER FOR EXISTING SYSTEM HOOKS
// ==============================================================================

class TelemetryEngineBridge {
  constructor() {
    this.isOverrideActive = false;
    this.stressIndex = 20;
    this.onOverrideCallback = null;
  }

  setPatientAndLevel(patientId, levelIndex) {
    let stg = 1;
    if (patientId === 'siddharth') stg = levelIndex + 1; // 1, 2, 3
    else if (patientId === 'kabir') stg = levelIndex + 4; // 4, 5, 6
    else if (patientId === 'radha') stg = levelIndex + 7; // 7, 8, 9
    currentStage = Math.max(1, Math.min(9, stg));
  }

  recordMouseMove() { /* Continuous window listener handles this */ }
  recordClick() { /* Continuous window listener handles this */ }

  triggerReportCard() {
    generateReportCard();
  }

  get currentStage() {
    return currentStage;
  }

  set currentStage(val) {
    currentStage = Math.max(1, Math.min(9, parseInt(val, 10) || 1));
  }
}

// Instantiate global telemetryEngine
window.telemetryEngine = new TelemetryEngineBridge();
