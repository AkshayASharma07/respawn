// ==============================================================================
// NANO-PULSE PERSISTENCE ENGINE (localStorage)
// Stores player level progression, patient healing statuses, and telemetry baselines
// ==============================================================================

const STORAGE_KEY = "NANO_PULSE_SAVE_DATA_V2";

const DEFAULT_SAVE_STATE = {
  currentPatient: "siddharth",
  currentLevelIndex: 0,
  difficulty: "resident", // "resident" | "specialist" | "chief"
  unlockedLevels: {
    siddharth: [0], // 0-indexed levels
    kabir: [0],
    radha: [0]
  },
  patientStatus: {
    siddharth: "Critical",
    kabir: "Critical",
    radha: "Critical"
  },
  telemetryBaseline: {
    totalShots: 0,
    totalBounces: 0,
    bioHarmonicOverrides: 0,
    averageStressIndex: 28.5,
    lastSavedTimestamp: null
  }
};

class StorageEngine {
  constructor() {
    this.state = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_SAVE_STATE));
      const parsed = JSON.parse(raw);
      // Ensure missing keys are merged safely
      return {
        ...DEFAULT_SAVE_STATE,
        ...parsed,
        unlockedLevels: { ...DEFAULT_SAVE_STATE.unlockedLevels, ...(parsed.unlockedLevels || {}) },
        patientStatus: { ...DEFAULT_SAVE_STATE.patientStatus, ...(parsed.patientStatus || {}) },
        telemetryBaseline: { ...DEFAULT_SAVE_STATE.telemetryBaseline, ...(parsed.telemetryBaseline || {}) }
      };
    } catch (e) {
      console.warn("StorageEngine load error:", e);
      return JSON.parse(JSON.stringify(DEFAULT_SAVE_STATE));
    }
  }

  save() {
    try {
      this.state.telemetryBaseline.lastSavedTimestamp = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error("StorageEngine save error:", e);
    }
  }

  hasSavedSession() {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }

  resetAllProgress() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = JSON.parse(JSON.stringify(DEFAULT_SAVE_STATE));
    this.save();
    return this.state;
  }

  setCurrentPatient(patientId) {
    this.state.currentPatient = patientId;
    this.save();
  }

  setCurrentLevelIndex(levelIdx) {
    this.state.currentLevelIndex = levelIdx;
    this.save();
  }

  unlockLevel(patientId, levelIdx) {
    if (!this.state.unlockedLevels[patientId]) {
      this.state.unlockedLevels[patientId] = [0];
    }
    if (!this.state.unlockedLevels[patientId].includes(levelIdx)) {
      this.state.unlockedLevels[patientId].push(levelIdx);
      this.state.unlockedLevels[patientId].sort((a, b) => a - b);
    }
    this.save();
  }

  isLevelUnlocked(patientId, levelIdx) {
    return (this.state.unlockedLevels[patientId] || [0]).includes(levelIdx);
  }

  setPatientStatus(patientId, status) {
    this.state.patientStatus[patientId] = status; // "Critical" | "Stabilized" | "Healed"
    this.save();
  }

  recordTelemetryStats({ shots = 0, bounces = 0, overrideTriggered = false, stressScore = 0 }) {
    this.state.telemetryBaseline.totalShots += shots;
    this.state.telemetryBaseline.totalBounces += bounces;
    if (overrideTriggered) {
      this.state.telemetryBaseline.bioHarmonicOverrides++;
    }
    if (stressScore > 0) {
      // Exponential moving average
      this.state.telemetryBaseline.averageStressIndex = Math.round(
        this.state.telemetryBaseline.averageStressIndex * 0.8 + stressScore * 0.2
      );
    }
    this.save();
  }

  getDifficulty() {
    return this.state.difficulty || "resident";
  }

  setDifficulty(diff) {
    if (["resident", "specialist", "chief"].includes(diff)) {
      this.state.difficulty = diff;
      this.save();
    }
  }
}

window.storageEngine = new StorageEngine();
