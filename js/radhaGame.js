// ==============================================================================
// BIO SCI-FI: GENETIC SPLICER — RADHA DEVI DOSSIER
// Mouse-path DNA strand traversal game: navigate the cursor along a moving
// DNA strand without leaving the corridor or hitting pathogens.
// Stage 1: Stable Strand  (pathWidth 35, 3 pathogens, single-harmonic wave)
// Stage 2: Dynamic Strand (pathWidth 25, 4 pathogens, warping dual-harmonic)
// Stage 3: Chaotic Strand (pathWidth 18, 5 pathogens, multi-harmonic chaos)
// Mirrors KabirBioCleanseGame architecture: loadStage/stop API, telemetry,
// storageEngine, canvasEngine header updates, difficulty modifiers.
// ==============================================================================

class RadhaGeneticSplicerGame {
  constructor() {
    this.container  = document.getElementById('radha-splicer-stage');
    this.canvas     = document.getElementById('rg-game-canvas');
    this.ctx        = this.canvas ? this.canvas.getContext('2d') : null;

    // Overlay UI
    this.overlay         = document.getElementById('rg-overlay');
    this.overlayTitle    = document.getElementById('rg-overlay-title');
    this.overlaySubtitle = document.getElementById('rg-overlay-subtitle');
    this.overlayDesc     = document.getElementById('rg-overlay-desc');
    this.startBtn        = document.getElementById('rg-start-btn');
    this.secondaryBtn    = document.getElementById('rg-secondary-btn');

    // HUD UI
    this.uiIntegrityText = document.getElementById('rg-integrity-text');
    this.uiIntegrityBar  = document.getElementById('rg-integrity-bar');
    this.uiProgressText  = document.getElementById('rg-progress-text');
    this.uiProgressBar   = document.getElementById('rg-progress-bar');
    this.uiStatusText    = document.getElementById('rg-status-text');
    this.uiStagePill     = document.getElementById('rg-stage-pill');

    // Telemetry UI
    this.telVel    = document.getElementById('rg-tel-vel');
    this.telJit    = document.getElementById('rg-tel-jit');
    this.telDev    = document.getElementById('rg-tel-dev');
    this.telStress = document.getElementById('rg-tel-stress');

    // Navigation buttons
    this.btnPrevStage  = document.getElementById('rg-btn-prev-stage');
    this.btnNextStage  = document.getElementById('rg-btn-next-stage');
    this.btnOpenStages = document.getElementById('rg-btn-open-stages');

    // Core game state
    this.currentStage   = 0;
    this.gameState      = 'OVERLAY'; // OVERLAY|READY|PLAYING|WIN_ANIM|WIN|GAMEOVER
    this.integrity      = 100;
    this.progress       = 0;
    this.time           = 0;
    this.damageCooldown = 0;
    this.animId         = null;
    this.frames         = 0;

    // Virtual coordinate space for consistent physics (scaled to canvas)
    this.VW = 800;
    this.VH = 400;

    // DNA strand nodes (x only; y is computed from wave)
    this.startNode = { x: 50, radius: 20 };
    this.endNode   = { x: 750, radius: 20 };

    // Mouse & telemetry
    this.mouse     = { x: 0, y: 0, prevX: 0, prevY: 0, vx: 0, vy: 0 };
    this.telemetry = { velocity: 0, jitter: 0, deviation: 0, prevVx: 0, prevVy: 0 };

    // Per-stage configuration
    this.stageConfigs = [
      // ── STAGE 1 ───────────────────────────────────────────────────────────
      {
        pathWidth:        35,
        pathogens: [
          { t: 0.2, speed: 0.003,  radius: 12 },
          { t: 0.5, speed: -0.002, radius: 14 },
          { t: 0.8, speed: 0.004,  radius: 10 }
        ],
        boundaryDamage:   5,  boundaryCooldown:  15,
        pathogenDamage:   15, pathogenCooldown:  30,
        winProgress:      95,
        label:            'Stage 1: Cellular Strand Passage',
        strandColor:      '#00f0ff',
        corridorFill:     'rgba(0, 240, 255, 0.05)',
        corridorStroke:   'rgba(0, 240, 255, 0.20)',
        pathogenColor:    '#ff0055'
      },
      // ── STAGE 2 ───────────────────────────────────────────────────────────
      {
        pathWidth:        25,
        pathogens: [
          { t: 0.15, speed: 0.004,  radius: 10 },
          { t: 0.40, speed: -0.005, radius: 12 },
          { t: 0.65, speed: 0.006,  radius: 9  },
          { t: 0.85, speed: -0.004, radius: 11 }
        ],
        boundaryDamage:   8,  boundaryCooldown:  12,
        pathogenDamage:   20, pathogenCooldown:  25,
        winProgress:      90,
        label:            'Stage 2: Dynamic Splicing',
        strandColor:      '#ff9900',
        corridorFill:     'rgba(255, 153, 0, 0.04)',
        corridorStroke:   'rgba(255, 153, 0, 0.25)',
        pathogenColor:    '#ff0055'
      },
      // ── STAGE 3 ───────────────────────────────────────────────────────────
      {
        pathWidth:        18,
        pathogens: [
          { t: 0.1, speed: 0.006,  radius: 9  },
          { t: 0.3, speed: -0.007, radius: 11 },
          { t: 0.5, speed: 0.008,  radius: 8  },
          { t: 0.7, speed: -0.006, radius: 10 },
          { t: 0.9, speed: 0.009,  radius: 9  }
        ],
        boundaryDamage:   12, boundaryCooldown:  10,
        pathogenDamage:   25, pathogenCooldown:  20,
        winProgress:      95,
        label:            'Stage 3: Critical Synaptic Crisis',
        strandColor:      '#ff0055',
        corridorFill:     'rgba(255, 0, 85, 0.05)',
        corridorStroke:   'rgba(255, 0, 85, 0.35)',
        pathogenColor:    '#ffff00'
      }
    ];

    this.pathogens       = [];
    this.activePathWidth = 35;

    this.initEvents();
  }

  // ============================================================================
  // WAVE FUNCTIONS
  // ============================================================================
  getStrandPoint(x) {
    const t = this.time;
    if (this.currentStage === 0) {
      // Stage 1 — single harmonic, gentle pulse
      const y = 200 + Math.sin(x * 0.015 + t * 0.02) * (60 + Math.sin(t * 0.05) * 15);
      return { x, y };
    } else if (this.currentStage === 1) {
      // Stage 2 — warping dual-harmonic
      const pulse = Math.sin(t * 0.08) * 20;
      const warp  = Math.cos(x * 0.01 + t * 0.03) * 30;
      const y     = 200 + Math.sin(x * 0.02 + t * 0.04) * (50 + pulse) + warp * 0.5;
      return { x, y };
    } else {
      // Stage 3 — chaotic multi-harmonic
      const pulse = Math.sin(t * 0.12) * 25;
      const chaos = Math.sin(x * 0.04 + t * 0.08) * 20;
      const warp  = Math.cos(x * 0.015 - t * 0.05) * 35;
      const y     = 200 + Math.sin(x * 0.025 + t * 0.07) * (40 + pulse) + warp * 0.6 + chaos * 0.4;
      return { x, y };
    }
  }

  // ============================================================================
  // EVENT SETUP
  // ============================================================================
  initEvents() {
    window.addEventListener('resize', () => {
      if (this.container && !this.container.classList.contains('hidden')) this.resize();
    });

    if (this.canvas) {
      const updateMouse = (clientX, clientY) => {
        const rect  = this.canvas.getBoundingClientRect();
        const sx    = this.canvas.width  / (rect.width  || 1);
        const sy    = this.canvas.height / (rect.height || 1);
        this.mouse.prevX = this.mouse.x;
        this.mouse.prevY = this.mouse.y;
        this.mouse.x = (clientX - rect.left) * sx;
        this.mouse.y = (clientY - rect.top)  * sy;
        this.mouse.vx = this.mouse.x - this.mouse.prevX;
        this.mouse.vy = this.mouse.y - this.mouse.prevY;
        if (window.telemetryEngine) window.telemetryEngine.recordMouseMove();
      };

      this.canvas.addEventListener('mousemove', e => updateMouse(e.clientX, e.clientY));
      this.canvas.addEventListener('touchmove', e => {
        if (e.touches[0]) updateMouse(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: true });

      this.canvas.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.resume();
        if (this.gameState === 'GAMEOVER' || this.gameState === 'WIN') this.resetStage();
      });
    }

    if (this.startBtn)     this.startBtn.addEventListener('click',     () => this.handleStartBtnClick());
    if (this.secondaryBtn) this.secondaryBtn.addEventListener('click', () => this.loadStage(this.currentStage, false));
    if (this.btnPrevStage) this.btnPrevStage.addEventListener('click', () => { if (this.currentStage > 0) this.loadStage(this.currentStage - 1, true); });
    if (this.btnNextStage) this.btnNextStage.addEventListener('click', () => { if (this.currentStage < 2) this.loadStage(this.currentStage + 1, true); });
    if (this.btnOpenStages) this.btnOpenStages.addEventListener('click', () => { const b = document.getElementById('btn-header-levels'); if (b) b.click(); });

    window.addEventListener('keydown', e => {
      if (!this.container || this.container.classList.contains('hidden')) return;
      if (e.key === 'r' || e.key === 'R') this.resetStage();
    });
  }

  resize() {
    if (!this.canvas || !this.container) return;
    const rect = this.container.getBoundingClientRect();
    this.canvas.width  = rect.width  > 100 ? rect.width  : window.innerWidth;
    this.canvas.height = rect.height > 100 ? rect.height : (window.innerHeight - 100);
  }

  // ============================================================================
  // STAGE LOADING
  // ============================================================================
  loadStage(stageIndex = 0, showIntro = true) {
    this.currentStage = Math.max(0, Math.min(2, stageIndex));
    this.resize();

    if (this.container) {
      this.container.classList.remove('hidden', 'stage-1', 'stage-2', 'stage-3');
      this.container.classList.add('stage-' + (this.currentStage + 1));
      this.container.style.display = 'block';
    }

    // Sync with project-wide systems
    if (window.storageEngine) {
      window.storageEngine.setCurrentPatient('radha');
      window.storageEngine.setCurrentLevelIndex(this.currentStage);
    }
    if (window.canvasEngine) {
      window.canvasEngine.currentPatientId  = 'radha';
      window.canvasEngine.currentLevelIndex = this.currentStage;
      window.canvasEngine.updateDomHeaders();
    }
    if (window.telemetryEngine) {
      window.telemetryEngine.setPatientAndLevel('radha', this.currentStage);
    }

    // Reset all game state
    this.integrity      = 100;
    this.progress       = 0;
    this.time           = 0;
    this.damageCooldown = 0;
    this.frames         = 0;
    this.mouse          = { x: 0, y: 0, prevX: 0, prevY: 0, vx: 0, vy: 0 };
    this.telemetry      = { velocity: 0, jitter: 0, deviation: 0, prevVx: 0, prevVy: 0 };

    const cfg = this.stageConfigs[this.currentStage];
    this.pathogens       = cfg.pathogens.map(p => ({ ...p }));
    this.activePathWidth = this._applyDifficulty(cfg.pathWidth);

    if (this.uiStagePill)     this.uiStagePill.textContent     = (this.currentStage + 1) + ' / 3';
    if (this.uiIntegrityText) this.uiIntegrityText.textContent = '100%';
    if (this.uiProgressText)  this.uiProgressText.textContent  = '0%';
    if (this.uiStatusText)    this.uiStatusText.textContent    = 'HOVER START NODE';
    this._bar(this.uiIntegrityBar, 100);
    this._bar(this.uiProgressBar, 0);

    if (showIntro) {
      this.gameState = 'OVERLAY';
      this._showIntroOverlay();
    } else {
      this.gameState = 'READY';
      this._hideOverlay();
    }

    this.ensureLoopRunning();
  }

  _applyDifficulty(baseWidth) {
    const diff = (window.canvasEngine && window.canvasEngine.difficulty) || 'resident';
    if (diff === 'specialist') return Math.max(10, Math.floor(baseWidth * 0.80));
    if (diff === 'chief')      return Math.max(8,  Math.floor(baseWidth * 0.60));
    return baseWidth;
  }

  // ============================================================================
  // OVERLAY
  // ============================================================================
  _showIntroOverlay() {
    if (!this.overlay) return;
    this.overlay.style.display = 'flex';
    const cfg = this.stageConfigs[this.currentStage];
    const labels = ['I', 'II', 'III'];
    const notes  = ['Standard Corridor', 'Narrowed Corridor', 'Critical Aperture'];
    if (this.overlayTitle)    this.overlayTitle.textContent    = 'STAGE ' + labels[this.currentStage] + ': GENETIC SPLICER';
    if (this.overlaySubtitle) this.overlaySubtitle.textContent = cfg.label;
    if (this.overlayDesc)     this.overlayDesc.innerHTML       =
      'Hover over the <b>START NODE</b> to begin. <b>Follow the DNA strand</b> (' + notes[this.currentStage] + ') ' +
      'without leaving the corridor or touching pathogens!<br><br>' +
      '<i>Corridor: ' + this.activePathWidth + 'px &nbsp;|&nbsp; Pathogens: ' + this.pathogens.length + '</i>';
    if (this.startBtn) {
      this.startBtn.textContent = 'Initialize Splicing Procedure';
      this.startBtn.setAttribute('data-action', 'start');
    }
    if (this.secondaryBtn) this.secondaryBtn.classList.add('hidden');
  }

  _hideOverlay() {
    if (this.overlay) this.overlay.style.display = 'none';
  }

  handleStartBtnClick() {
    const act = this.startBtn && this.startBtn.getAttribute('data-action');
    if      (act === 'proceed_stage_2') this.loadStage(1, true);
    else if (act === 'proceed_stage_3') this.loadStage(2, true);
    else if (act === 'replay_stage')    this.loadStage(this.currentStage, false);
    else if (act === 'all_complete') {
      if (window.storyEngine && window.PATIENT_EPILOGUES && window.PATIENT_EPILOGUES['radha']) {
        window.storyEngine.playStory('radha', true);
      } else if (window.telemetryEngine) {
        window.telemetryEngine.triggerReportCard();
      }
    } else {
      this.gameState = 'READY';
      this._hideOverlay();
    }
  }

  resetStage() {
    this.loadStage(this.currentStage, false);
  }

  // ============================================================================
  // UPDATE LOOP
  // ============================================================================
  update() {
    this.time++;
    this.frames++;
    const cfg = this.stageConfigs[this.currentStage];

    if (this.damageCooldown > 0) this.damageCooldown--;

    // Move pathogens along strand
    this.pathogens.forEach(p => {
      p.t += p.speed;
      if (p.t > 1) p.t = 0;
      if (p.t < 0) p.t = 1;
    });

    if (this.gameState === 'READY') {
      // Wait for cursor to enter the start node
      const startPt = this.getStrandPoint(this.startNode.x);
      const scaleX  = this.canvas ? this.canvas.width  / this.VW : 1;
      const scaleY  = this.canvas ? this.canvas.height / this.VH : 1;
      const vMouseX = this.mouse.x / scaleX;
      const vMouseY = this.mouse.y / scaleY;
      if (Math.hypot(vMouseX - this.startNode.x, vMouseY - startPt.y) < this.startNode.radius) {
        this.gameState = 'PLAYING';
        if (this.uiStatusText) this.uiStatusText.textContent = 'SPLICING IN PROGRESS...';
      }

    } else if (this.gameState === 'PLAYING') {
      this._updateTelemetry();

      // Convert mouse to virtual space
      const scaleX  = this.canvas ? this.canvas.width  / this.VW : 1;
      const scaleY  = this.canvas ? this.canvas.height / this.VH : 1;
      const vMouseX = this.mouse.x / scaleX;
      const vMouseY = this.mouse.y / scaleY;

      const idealPt  = this.getStrandPoint(vMouseX);
      const distCenter = Math.hypot(vMouseX - idealPt.x, vMouseY - idealPt.y);

      // Track progress
      const rawProg = Math.min(100, Math.floor(
        (vMouseX - this.startNode.x) / (this.endNode.x - this.startNode.x) * 100
      ));
      this.progress = Math.max(this.progress, rawProg);
      if (this.uiProgressText) this.uiProgressText.textContent = this.progress + '%';
      this._bar(this.uiProgressBar, this.progress);

      // Boundary damage
      if (distCenter > this.activePathWidth && this.damageCooldown === 0) {
        this.integrity -= cfg.boundaryDamage;
        this.damageCooldown = cfg.boundaryCooldown;
        if (window.soundEngine && window.soundEngine.playPencilScratch) window.soundEngine.playPencilScratch(0.05);
      }

      // Pathogen damage
      this.pathogens.forEach(p => {
        const px = this.startNode.x + p.t * (this.endNode.x - this.startNode.x);
        const py = this.getStrandPoint(px).y;
        if (Math.hypot(vMouseX - px, vMouseY - py) < p.radius + 5 && this.damageCooldown === 0) {
          this.integrity -= cfg.pathogenDamage;
          this.damageCooldown = cfg.pathogenCooldown;
          if (window.soundEngine && window.soundEngine.playRicochetPing) window.soundEngine.playRicochetPing(1);
        }
      });

      this.integrity = Math.max(0, Math.min(100, this.integrity));
      if (this.uiIntegrityText) this.uiIntegrityText.textContent = Math.floor(this.integrity) + '%';
      this._bar(this.uiIntegrityBar, this.integrity);
      if (this.uiIntegrityBar) {
        this.uiIntegrityBar.className = 'rg-bar-fill' +
          (this.integrity < 25 ? ' critical' : this.integrity < 50 ? ' red' : '');
      }

      // Check win/loss
      const endPt  = this.getStrandPoint(this.endNode.x);
      const distEnd = Math.hypot(vMouseX - this.endNode.x, vMouseY - endPt.y);

      if (this.integrity <= 0) {
        this._endGame(false);
      } else if (distEnd < this.endNode.radius && this.progress >= cfg.winProgress) {
        this._endGame(true);
      }
    }
  }

  _updateTelemetry() {
    const spd = Math.hypot(this.mouse.vx, this.mouse.vy) * 60;
    this.telemetry.velocity = Math.round(spd);

    const scaleX = this.canvas ? this.canvas.width  / this.VW : 1;
    const scaleY = this.canvas ? this.canvas.height / this.VH : 1;
    const vMx = this.mouse.x / scaleX;
    const vMy = this.mouse.y / scaleY;
    const idealPt = this.getStrandPoint(vMx);
    this.telemetry.deviation = Math.hypot(vMx - idealPt.x, vMy - idealPt.y);

    const jv = Math.abs(this.mouse.vx - this.telemetry.prevVx) + Math.abs(this.mouse.vy - this.telemetry.prevVy);
    this.telemetry.prevVx = this.mouse.vx;
    this.telemetry.prevVy = this.mouse.vy;
    this.telemetry.jitter = this.telemetry.jitter * 0.9 + jv * 0.1;

    if (this.telVel) this.telVel.textContent = this.telemetry.velocity;
    if (this.telJit) this.telJit.textContent = this.telemetry.jitter.toFixed(2);
    if (this.telDev) this.telDev.textContent = this.telemetry.deviation.toFixed(1);

    const pw = this.activePathWidth;
    if (this.telStress) {
      if (this.telemetry.jitter > 10 || this.telemetry.deviation > pw * 0.65) {
        this.telStress.textContent = 'MAX PANIC';
        this.telStress.style.color = '#ff0055';
      } else if (this.telemetry.jitter > 5 || this.telemetry.deviation > pw * 0.35) {
        this.telStress.textContent = 'ELEVATED';
        this.telStress.style.color = '#ff9900';
      } else {
        this.telStress.textContent = 'STABLE';
        this.telStress.style.color = '#00ffaa';
      }
    }

    if (window.telemetryEngine) {
      window.telemetryEngine.stressIndex = Math.min(100,
        Math.floor(this.telemetry.jitter * 3 + this.telemetry.deviation));
    }
  }

  // ============================================================================
  // GAME END
  // ============================================================================
  _endGame(victory) {
    this.gameState = 'WIN_ANIM';
    setTimeout(() => {
      this.gameState = victory ? 'WIN' : 'GAMEOVER';
      this.overlay.style.display = 'flex';

      if (victory) {
        if (window.soundEngine) {
          if (window.soundEngine.playSynapseHit) window.soundEngine.playSynapseHit();
          if (window.soundEngine.playStampThud)  window.soundEngine.playStampThud();
        }
        if (window.storageEngine) {
          window.storageEngine.unlockLevel('radha', this.currentStage + 1);
          if (this.currentStage >= 2) window.storageEngine.setPatientStatus('radha', 'Stabilized');
        }
        if (typeof window.recordStageCompletion === 'function') {
          window.recordStageCompletion(this.currentStage + 7);
        }

        const nextActs  = ['proceed_stage_2', 'proceed_stage_3', 'all_complete'];
        const nextLabels = ['PROCEED TO STAGE 2 \u23e9', 'PROCEED TO STAGE 3 \u23e9', 'VIEW REPORT CARD \ud83d\udcca'];
        const winTitles  = ['STRAND TRAVERSED!', 'DYNAMIC SPLICE COMPLETE!', 'SEQUENCE SPLICED \u2014 RADHA LIVES!'];
        const winSubs    = [
          'Stage 1 Complete \u2014 Cerebellar Fissure Sealed!',
          'Stage 2 Complete \u2014 Capillary Fissures Sealed!',
          'All 3 Stages Complete \u2014 Full Synaptic Recovery!'
        ];
        const colors = ['#00ffaa', '#ff9900', '#00ffaa'];
        this._setOverlay(winTitles[this.currentStage], colors[this.currentStage],
          winSubs[this.currentStage],
          'Genetic strand successfully traversed with cellular integrity maintained.',
          nextLabels[this.currentStage], nextActs[this.currentStage],
          'REPLAY \u21ba', 'replay_stage');

      } else {
        if (window.soundEngine && window.soundEngine.playPencilScratch) window.soundEngine.playPencilScratch(0.15);
        const failTitles = ['CELLULAR COLLAPSE', 'DNA CORRUPTED', 'SYSTEMIC FAILURE'];
        const failSubs   = [
          'Strand boundary exceeded \u2014 Synaptic integrity lost.',
          'Vascular corridor breached \u2014 DNA sequence corrupted.',
          'Critical failure \u2014 Radha\'s synaptic core collapsed.'
        ];
        this._setOverlay(failTitles[this.currentStage], '#ff0055',
          failSubs[this.currentStage],
          'Integrity reached 0% \u2014 retry to stabilize the genetic strand.',
          'RETRY STAGE ' + (this.currentStage + 1) + ' \u21ba', 'replay_stage',
          null, null);
      }
    }, 600);
  }

  _setOverlay(title, color, sub, desc, btn1, act1, btn2, act2) {
    if (this.overlayTitle) {
      this.overlayTitle.textContent = title;
      this.overlayTitle.style.color = color;
      this.overlayTitle.style.textShadow = '0 0 20px ' + color + '88';
    }
    if (this.overlaySubtitle) this.overlaySubtitle.textContent = sub;
    if (this.overlayDesc)     this.overlayDesc.textContent     = desc;
    if (this.startBtn) {
      this.startBtn.textContent = btn1;
      this.startBtn.setAttribute('data-action', act1);
    }
    if (this.secondaryBtn) {
      if (btn2) {
        this.secondaryBtn.textContent = btn2;
        this.secondaryBtn.setAttribute('data-action', act2);
        this.secondaryBtn.classList.remove('hidden');
      } else {
        this.secondaryBtn.classList.add('hidden');
      }
    }
  }

  // ============================================================================
  // DRAW
  // ============================================================================
  draw() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const W   = this.canvas.width;
    const H   = this.canvas.height;
    const cfg = this.stageConfigs[this.currentStage];
    const pw  = this.activePathWidth;
    const sX  = this.startNode.x;
    const eX  = this.endNode.x;

    ctx.clearRect(0, 0, W, H);

    // Scale virtual 800x400 to actual canvas size
    const sx = W / this.VW;
    const sy = H / this.VH;
    ctx.save();
    ctx.scale(sx, sy);

    // ── Corridor ─────────────────────────────────────────────────────────────
    ctx.beginPath();
    for (let x = sX; x <= eX; x += 5) {
      const pt = this.getStrandPoint(x);
      ctx.lineTo(pt.x, pt.y - pw);
    }
    for (let x = eX; x >= sX; x -= 5) {
      const pt = this.getStrandPoint(x);
      ctx.lineTo(pt.x, pt.y + pw);
    }
    ctx.closePath();
    ctx.fillStyle   = cfg.corridorFill;
    ctx.fill();
    ctx.strokeStyle = cfg.corridorStroke;
    ctx.lineWidth   = 1;
    ctx.stroke();

    // ── Central DNA Strand ────────────────────────────────────────────────────
    ctx.beginPath();
    for (let x = sX; x <= eX; x += 5) {
      const pt = this.getStrandPoint(x);
      if (x === sX) ctx.moveTo(pt.x, pt.y);
      else           ctx.lineTo(pt.x, pt.y);
    }
    ctx.strokeStyle = cfg.strandColor;
    ctx.lineWidth   = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    // ── Pathogens ─────────────────────────────────────────────────────────────
    this.pathogens.forEach(p => {
      const px = sX + p.t * (eX - sX);
      const py = this.getStrandPoint(px).y;

      ctx.beginPath();
      ctx.arc(px, py, p.radius, 0, Math.PI * 2);
      ctx.fillStyle   = cfg.pathogenColor;
      ctx.shadowColor = cfg.pathogenColor;
      ctx.shadowBlur  = 12;
      ctx.fill();
      ctx.shadowBlur  = 0;

      // Pulsing ring
      const ring = 0.5 + 0.5 * Math.sin(this.time * 0.15 + p.t * 10);
      ctx.beginPath();
      ctx.arc(px, py, p.radius + 4 + ring * 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,0,85,' + (0.3 * ring) + ')';
      ctx.lineWidth   = 1.5;
      ctx.stroke();
    });

    // ── Start Node ─────────────────────────────────────────────────────────────
    const startPtY = this.getStrandPoint(sX).y;
    ctx.beginPath();
    ctx.arc(sX, startPtY, this.startNode.radius, 0, Math.PI * 2);
    ctx.fillStyle   = this.gameState === 'READY' ? '#00ffaa' : 'rgba(0,255,170,0.3)';
    ctx.shadowColor = '#00ffaa';
    ctx.shadowBlur  = this.gameState === 'READY' ? 15 : 0;
    ctx.fill();
    ctx.shadowBlur  = 0;
    ctx.fillStyle   = '#000';
    ctx.font        = '9px monospace';
    ctx.textAlign   = 'center';
    ctx.fillText('START', sX, startPtY + 3);

    // ── End Node ───────────────────────────────────────────────────────────────
    const endPtY = this.getStrandPoint(eX).y;
    ctx.beginPath();
    ctx.arc(eX, endPtY, this.endNode.radius, 0, Math.PI * 2);
    ctx.fillStyle   = 'rgba(255,204,0,0.9)';
    ctx.shadowColor = '#ffcc00';
    ctx.shadowBlur  = 10;
    ctx.fill();
    ctx.shadowBlur  = 0;
    ctx.fillStyle   = '#000';
    ctx.fillText('END', eX, endPtY + 3);

    // ── Player Cursor ──────────────────────────────────────────────────────────
    if (this.gameState === 'PLAYING' || this.gameState === 'READY') {
      const vMouseX = this.mouse.x / sx;
      const vMouseY = this.mouse.y / sy;

      ctx.beginPath();
      ctx.arc(vMouseX, vMouseY, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(vMouseX, vMouseY, 4, 0, Math.PI * 2);
      ctx.fillStyle   = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur  = 10;
      ctx.fill();
      ctx.shadowBlur  = 0;
    }

    // ── Damage flash ────────────────────────────────────────────────────────────
    if (this.damageCooldown > 5) {
      ctx.fillStyle = 'rgba(255,0,85,' + ((this.damageCooldown / 15) * 0.12) + ')';
      ctx.fillRect(0, 0, this.VW, this.VH);
    }

    // ── End-state canvas overlays ───────────────────────────────────────────────
    if (this.gameState === 'GAMEOVER') {
      ctx.fillStyle = 'rgba(255,0,50,0.82)';
      ctx.fillRect(0, 0, this.VW, this.VH);
      ctx.fillStyle = '#fff';
      ctx.font      = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('CELLULAR COLLAPSE', this.VW / 2, this.VH / 2 - 15);
      ctx.font = '13px sans-serif';
      ctx.fillText('Click anywhere to retry', this.VW / 2, this.VH / 2 + 20);
    } else if (this.gameState === 'WIN') {
      ctx.fillStyle = 'rgba(0,255,170,0.85)';
      ctx.fillRect(0, 0, this.VW, this.VH);
      ctx.fillStyle = '#050102';
      ctx.font      = 'bold 26px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SEQUENCE SPLICED!', this.VW / 2, this.VH / 2 - 15);
      ctx.font = '13px sans-serif';
      ctx.fillText('Click anywhere to continue', this.VW / 2, this.VH / 2 + 20);
    }

    ctx.restore();
  }

  // ============================================================================
  // HELPERS
  // ============================================================================
  _bar(el, pct) {
    if (el) el.style.width = Math.max(0, Math.min(100, pct)) + '%';
  }

  ensureLoopRunning() {
    if (!this.animId) {
      const loop = () => {
        if (this.gameState !== 'OVERLAY') this.update();
        this.draw();
        this.animId = requestAnimationFrame(loop);
      };
      this.animId = requestAnimationFrame(loop);
    }
  }

  stop() {
    this.gameState = 'OVERLAY';
    if (this.animId) { cancelAnimationFrame(this.animId); this.animId = null; }
    if (this.container) { this.container.classList.add('hidden'); this.container.style.display = 'none'; }
    if (this.overlay)   this.overlay.style.display = 'none';
  }
}

window.RadhaGeneticSplicerGame = RadhaGeneticSplicerGame;
