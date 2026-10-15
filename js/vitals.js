// Patient Vitals Monitor & Dynamic ECG Waveform Oscilloscope

class VitalsMonitor {
  constructor(canvasId = 'ecg-canvas') {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.bpm = 135;
    this.temp = 39.8;
    this.platelets = 38; // in k/uL
    this.hematocrit = 51; // %
    this.bpSys = 88;
    this.bpDia = 58;
    this.stability = 35; // 0-100%
    this.phaseName = "CRITICAL PHASE: PLASMA LEAK";
    this.isEmergency = true;

    // ECG wave parameters
    this.xPos = 0;
    this.prevY = 30;
    this.step = 0;
    this.ecgData = [];
    this.maxPoints = 300;
    this.animId = null;

    if (this.canvas) {
      this.initCanvas();
    }
  }

  initCanvas() {
    this.canvas.width = this.canvas.parentElement ? this.canvas.parentElement.clientWidth : 280;
    this.canvas.height = 64;
    this.maxPoints = this.canvas.width;
    this.ecgData = new Array(this.maxPoints).fill(this.canvas.height / 2);
    this.startOscilloscope();
  }

  setVitals({ bpm, temp, platelets, hematocrit, bpSys, bpDia, stability, phaseName, isEmergency }) {
    if (bpm !== undefined) {
      this.bpm = bpm;
      if (window.soundEngine) {
        window.soundEngine.updateHeartRate(bpm);
      }
    }
    if (temp !== undefined) this.temp = temp;
    if (platelets !== undefined) this.platelets = platelets;
    if (hematocrit !== undefined) this.hematocrit = hematocrit;
    if (bpSys !== undefined) this.bpSys = bpSys;
    if (bpDia !== undefined) this.bpDia = bpDia;
    if (stability !== undefined) this.stability = Math.max(0, Math.min(100, stability));
    if (phaseName !== undefined) this.phaseName = phaseName;
    if (isEmergency !== undefined) this.isEmergency = isEmergency;

    this.renderVitalsUI();
  }

  renderVitalsUI() {
    const elBpm = document.getElementById('vital-bpm');
    const elTemp = document.getElementById('vital-temp');
    const elPlt = document.getElementById('vital-platelets');
    const elBp = document.getElementById('vital-bp');
    const elStability = document.getElementById('vital-stability-fill');
    const elStabilityText = document.getElementById('vital-stability-text');
    const elPhase = document.getElementById('vital-phase-tag');
    const hudContainer = document.getElementById('vitals-hud');

    if (elBpm) elBpm.textContent = `${Math.round(this.bpm)} BPM`;
    if (elTemp) elTemp.textContent = `${this.temp.toFixed(1)}°C`;
    if (elPlt) elPlt.textContent = `${this.platelets}k /μL`;
    if (elBp) elBp.textContent = `${this.bpSys}/${this.bpDia}`;
    if (elStability) {
      elStability.style.width = `${this.stability}%`;
      elStability.style.backgroundColor = this.stability < 30 ? '#ef4444' : (this.stability < 65 ? '#f59e0b' : '#10b981');
    }
    if (elStabilityText) elStabilityText.textContent = `${Math.round(this.stability)}%`;
    if (elPhase) elPhase.textContent = this.phaseName;

    if (hudContainer) {
      if (this.isEmergency) {
        hudContainer.classList.add('emergency-pulse');
      } else {
        hudContainer.classList.remove('emergency-pulse');
      }
    }
  }

  startOscilloscope() {
    if (!this.ctx) return;
    cancelAnimationFrame(this.animId);

    const midY = this.canvas.height / 2;
    let cycleCounter = 0;

    const renderFrame = () => {
      const width = this.canvas.width;
      const height = this.canvas.height;
      const cy = height / 2;

      // Calculate sample point for cardiac cycle
      // Faster BPM = shorter cycle period
      const cycleLength = Math.max(25, Math.floor((60 / this.bpm) * 60));
      const phase = cycleCounter % cycleLength;
      cycleCounter++;

      let yVal = cy;
      // Synthesize realistic P-Q-R-S-T wave
      if (phase === Math.floor(cycleLength * 0.15)) {
        // P wave
        yVal = cy - 4;
      } else if (phase === Math.floor(cycleLength * 0.18)) {
        yVal = cy - 8;
      } else if (phase === Math.floor(cycleLength * 0.22)) {
        yVal = cy;
      } else if (phase === Math.floor(cycleLength * 0.28)) {
        // Q dip
        yVal = cy + 4;
      } else if (phase === Math.floor(cycleLength * 0.30)) {
        // R peak
        yVal = cy - 26;
      } else if (phase === Math.floor(cycleLength * 0.33)) {
        // S dip
        yVal = cy + 12;
      } else if (phase === Math.floor(cycleLength * 0.36)) {
        yVal = cy;
      } else if (phase === Math.floor(cycleLength * 0.50)) {
        // T wave
        yVal = cy - 10;
      } else if (phase === Math.floor(cycleLength * 0.55)) {
        yVal = cy - 6;
      } else {
        // Baseline with slight micro-noise
        yVal = cy + (Math.random() * 1.5 - 0.75);
      }

      this.ecgData.push(yVal);
      if (this.ecgData.length > width) {
        this.ecgData.shift();
      }

      // Draw ECG trace
      this.ctx.fillStyle = 'rgba(10, 15, 24, 0.28)';
      this.ctx.fillRect(0, 0, width, height);

      // Grid background
      this.ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      for (let x = 0; x < width; x += 20) {
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += 15) {
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(width, y);
      }
      this.ctx.stroke();

      // Glowing ECG trace
      const lineColor = this.isEmergency ? '#ef4444' : (this.stability > 70 ? '#10b981' : '#38bdf8');
      this.ctx.strokeStyle = lineColor;
      this.ctx.shadowColor = lineColor;
      this.ctx.shadowBlur = 8;
      this.ctx.lineWidth = 2.2;
      this.ctx.beginPath();

      for (let i = 0; i < this.ecgData.length; i++) {
        if (i === 0) {
          this.ctx.moveTo(i, this.ecgData[i]);
        } else {
          this.ctx.lineTo(i, this.ecgData[i]);
        }
      }
      this.ctx.stroke();
      this.ctx.shadowBlur = 0; // reset

      // Cursor dot at leading edge
      const leadX = this.ecgData.length - 1;
      const leadY = this.ecgData[leadX];
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(leadX, leadY, 3, 0, Math.PI * 2);
      this.ctx.fill();

      this.animId = requestAnimationFrame(renderFrame);
    };

    this.animId = requestAnimationFrame(renderFrame);
  }
}

window.vitalsMonitor = null;
