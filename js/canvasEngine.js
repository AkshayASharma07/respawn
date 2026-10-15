// ==============================================================================
// NANO-PULSE UNIFIED SINGLE-CANVAS GAME ENGINE
// Hand-drawn medical sketchbook aesthetic: charcoal, graphite, ink splatters,
// animated clinical case intros, and unified 60fps geometric ricochet loop.
// Supports 9 distinct game types + 3 difficulty levels.
// ==============================================================================

class UnifiedCanvasEngine {
  constructor(canvasId = 'nano-canvas') {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    // Virtual resolution for consistent coordinate math
    this.width = 960;
    this.height = 540;

    // States: 'INTRO' | 'PLAY' | 'SUCCESS' | 'PATIENT_HEALED'
    this.state = 'INTRO';
    this.currentPatientId = 'siddharth';
    this.currentLevelIndex = 0;
    this.levelConfig = null;

    // Difficulty
    this.difficulty = (window.storageEngine && window.storageEngine.getDifficulty()) || 'resident';

    // Animation & Physics Loop
    this.animId = null;
    this.lastFrameTime = performance.now();

    // Aiming & Projectile
    this.isAiming = false;
    this.aimStart = { x: 0, y: 0 };
    this.currentAim = { x: 0, y: 0 };
    this.projectile = null;
    this.shotsFired = 0;
    this.totalBounces = 0;

    // Active Level Entities
    this.targets = [];
    this.obstacles = [];
    this.movingObstacles = [];
    this.mirrors = [];
    this.particles = [];

    // Gravity wells (for slingshot game)
    this.gravityWells = [];

    // Intro Sequence State
    this.introStep = 0;
    this.introTypewriterIndex = 0;
    this.introTimer = 0;
    this.introStampOpacity = 0;

    // Hand-drawn sketch jitter phase
    this.sketchPhase = 0;

    // Transform game state
    this.transformState = null;

    // Wave game state
    this.waveState = null;

    // Polygon triangulation game state
    this.polygonState = null;

    this.initCanvasSize();
    this.initInputHandlers();
    this.bindTelemetryEvents();
  }

  setDifficulty(diff) {
    if (['resident', 'specialist', 'chief'].includes(diff)) {
      this.difficulty = diff;
      if (window.storageEngine) window.storageEngine.setDifficulty(diff);
      // Reload current level to apply new difficulty
      if (this.levelConfig) {
        this.loadPatientLevel(this.currentPatientId, this.currentLevelIndex, false);
      }
    }
  }

  getDiffMod() {
    return window.DIFF_MODS ? (window.DIFF_MODS[this.difficulty] || window.DIFF_MODS.resident) : {
      guideSteps: 85, targetScale: 1.0, obstacleSpeed: 1.0, tolerance: 0.75,
      trianglesNeeded: 3, slitWidth: 70, color: '#34d399', label: 'RESIDENT'
    };
  }

  initCanvasSize() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  bindTelemetryEvents() {
    if (window.telemetryEngine) {
      window.telemetryEngine.onOverrideCallback = (isActive) => {
        if (isActive) {
          this.applyBioHarmonicSlowing(true);
        } else {
          this.applyBioHarmonicSlowing(false);
        }
      };
    }
  }

  applyBioHarmonicSlowing(active = true) {
    if (this.movingObstacles && this.movingObstacles.length > 0) {
      this.movingObstacles.forEach(mo => {
        if (mo.baseVy === undefined) mo.baseVy = mo.vy;
        mo.vy = active ? (mo.baseVy * 0.45) : mo.baseVy;
      });
    }
  }

  // ============================================================================
  // LEVEL LOADING & STATE SWITCHING (Robust, Never Breaks)
  // ============================================================================
  loadPatientLevel(patientId, levelIndex = 0, startWithIntro = true) {
    this.currentPatientId = patientId;
    this.currentLevelIndex = levelIndex;
    const patientData = window.PATIENTS[patientId];
    if (!patientData) return;

    // Clamp level index
    if (this.currentLevelIndex >= patientData.levels.length) {
      this.currentLevelIndex = patientData.levels.length - 1;
    }
    this.levelConfig = patientData.levels[this.currentLevelIndex];

    // Check if patient is Kabir (Middle Class Bio-Cleanse Laser Surgery)
    if (patientId === 'kabir') {
      // Hide standard vector canvas & Radha stage, activate Kabir Bio-Cleanse viewport
      if (this.canvas) this.canvas.style.display = 'none';
      const rgStage = document.getElementById('radha-splicer-stage');
      if (rgStage) {
        rgStage.classList.add('hidden');
        rgStage.style.display = 'none';
      }
      if (window.radhaGame) {
        window.radhaGame.stop();
      }

      const kbStage = document.getElementById('kabir-biocleanse-stage');
      if (kbStage) {
        kbStage.classList.remove('hidden');
        kbStage.style.display = 'block';
      }

      // Update storage
      if (window.storageEngine) {
        window.storageEngine.setCurrentPatient('kabir');
        window.storageEngine.setCurrentLevelIndex(this.currentLevelIndex);
      }

      this.updateDomHeaders();

      if (window.telemetryEngine) {
        window.telemetryEngine.setPatientAndLevel('kabir', this.currentLevelIndex);
      }

      if (!window.kabirGame && window.KabirBioCleanseGame) {
        window.kabirGame = new window.KabirBioCleanseGame();
      }
      if (window.kabirGame) {
        window.kabirGame.loadStage(this.currentLevelIndex, startWithIntro);
      }
      this.ensureLoopRunning();
      return;
    }

    // Check if patient is Radha (Working Class Genetic Splicer)
    if (patientId === 'radha') {
      // Hide standard vector canvas & Kabir stage, activate Radha Genetic Splicer viewport
      if (this.canvas) this.canvas.style.display = 'none';
      const kbStage = document.getElementById('kabir-biocleanse-stage');
      if (kbStage) {
        kbStage.classList.add('hidden');
        kbStage.style.display = 'none';
      }
      if (window.kabirGame) {
        window.kabirGame.stop();
      }

      const rgStage = document.getElementById('radha-splicer-stage');
      if (rgStage) {
        rgStage.classList.remove('hidden');
        rgStage.style.display = 'block';
      }

      // Update storage
      if (window.storageEngine) {
        window.storageEngine.setCurrentPatient('radha');
        window.storageEngine.setCurrentLevelIndex(this.currentLevelIndex);
      }

      this.updateDomHeaders();

      if (window.telemetryEngine) {
        window.telemetryEngine.setPatientAndLevel('radha', this.currentLevelIndex);
      }

      if (!window.radhaGame && window.RadhaGeneticSplicerGame) {
        window.radhaGame = new window.RadhaGeneticSplicerGame();
      }
      if (window.radhaGame) {
        window.radhaGame.loadStage(this.currentLevelIndex, startWithIntro);
      }
      this.ensureLoopRunning();
      return;
    }

    // Otherwise (Siddharth), ensure Kabir Bio-Cleanse and Radha Splicer stages are hidden
    const kbStage = document.getElementById('kabir-biocleanse-stage');
    if (kbStage) {
      kbStage.classList.add('hidden');
      kbStage.style.display = 'none';
    }
    if (window.kabirGame) {
      window.kabirGame.stop();
    }
    const rgStage = document.getElementById('radha-splicer-stage');
    if (rgStage) {
      rgStage.classList.add('hidden');
      rgStage.style.display = 'none';
    }
    if (window.radhaGame) {
      window.radhaGame.stop();
    }
    if (this.canvas) {
      this.canvas.style.display = 'block';
      this.initCanvasSize();
    }

    if (window.telemetryEngine) {
      window.telemetryEngine.setPatientAndLevel(patientId, this.currentLevelIndex);
    }

    // Reset physics state
    this.projectile = null;
    this.isAiming = false;
    this.shotsFired = 0;
    this.particles = [];
    this.transformState = null;
    this.waveState = null;
    this.polygonState = null;

    const dm = this.getDiffMod();

    // Deep copy targets, obstacles & mirrors
    this.targets = (this.levelConfig.targets || []).map(t => ({
      ...t,
      currentR: t.r * dm.targetScale
    }));
    this.obstacles = (this.levelConfig.obstacles || []).map(o => ({ ...o }));
    this.movingObstacles = (this.levelConfig.movingObstacles || []).map(mo => ({
      ...mo,
      vy: mo.vy * dm.obstacleSpeed
    }));
    this.mirrors = (this.levelConfig.mirrors || []).map(m => ({ ...m }));
    this.gravityWells = (this.levelConfig.gravityWells || []).map(gw => ({ ...gw }));

    // Initialize special game type states
    const gt = this.levelConfig.gameType;
    if (gt === 'transform_affine') {
      this.transformState = {
        curRot: 0,
        curScale: 1.0,
        targetRot: this.levelConfig.targetRot || 120,
        targetScale: this.levelConfig.targetScale || 1.4,
        dragging: false,
        lastAngle: 0,
        lastDist: 0
      };
    } else if (gt === 'wave_superposition') {
      this.waveState = {
        curFreq: 2.0,
        curPhase: 0,
        targetFreq: this.levelConfig.targetFreq || 3.0,
        time: 0,
        draggingFreq: false,
        draggingPhase: false
      };
    } else if (gt === 'polygon_triangulation') {
      this.polygonState = {
        nodes: (this.levelConfig.nodes || []).map(n => ({ ...n })),
        selectedNodes: [],
        formedTriangles: [],
        targetTriangles: dm.trianglesNeeded
      };
    }

    // Update storage
    if (window.storageEngine) {
      window.storageEngine.setCurrentPatient(patientId);
      window.storageEngine.setCurrentLevelIndex(this.currentLevelIndex);
    }

    // Update DOM HUD headers
    this.updateDomHeaders();

    if (startWithIntro) {
      this.state = 'INTRO';
      this.introStep = 0;
      this.introTypewriterIndex = 0;
      this.introTimer = 0;
      this.introStampOpacity = 0;
      if (window.soundEngine) {
        window.soundEngine.startHeartbeat(patientData.vitals.pulseBpm || 80);
      }
    } else {
      this.state = 'PLAY';
    }

    this.ensureLoopRunning();
  }

  updateDomHeaders() {
    const p = window.PATIENTS[this.currentPatientId];
    const dm = this.getDiffMod();
    const elName = document.getElementById('patient-name-display');
    const elTier = document.getElementById('patient-tier-display');
    const elPhase = document.getElementById('vital-phase-tag');
    const elDiag = document.getElementById('current-diagnosis-name');
    const elLevelBadge = document.getElementById('chapter-badge');
    const elDiffBadge = document.getElementById('difficulty-badge');

    if (elName) elName.textContent = `CASE: ${p.name.toUpperCase()}`;
    if (elTier) elTier.textContent = `${p.socioeconomic.toUpperCase()} • ${p.role.toUpperCase()}`;
    if (elPhase) elPhase.textContent = p.clinicalCode;
    if (elDiag) elDiag.textContent = p.diagnosisTitle;
    if (elLevelBadge) elLevelBadge.textContent = `DOSSIER LEVEL ${this.currentLevelIndex + 1}: ${this.levelConfig.title.toUpperCase()}`;
    if (elDiffBadge) {
      elDiffBadge.textContent = dm.label;
      elDiffBadge.style.color = dm.color;
      elDiffBadge.style.borderColor = dm.color;
    }
  }

  ensureLoopRunning() {
    if (!this.animId) {
      this.lastFrameTime = performance.now();
      this.animId = requestAnimationFrame(this.renderLoop.bind(this));
    }
  }

  // ============================================================================
  // INPUT HANDLING (Drag to Aim & Release to Fire + Special Game Interactions)
  // ============================================================================
  initInputHandlers() {
    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * (this.width / rect.width),
        y: (clientY - rect.top) * (this.height / rect.height)
      };
    };

    const handleStart = (e) => {
      if (window.soundEngine) window.soundEngine.resume();
      const pos = getPos(e);

      if (this.state === 'INTRO') {
        // Fast-forward or commence surgery
        if (this.introStep < 2) {
          this.introStep = 2;
          this.introTypewriterIndex = 999;
          this.introStampOpacity = 1;
          if (window.soundEngine) window.soundEngine.playStampThud();
        } else {
          this.state = 'PLAY';
          if (window.soundEngine) window.soundEngine.playPencilScratch(0.15);
        }
        return;
      }

      if (this.state === 'SUCCESS') {
        this.advanceToNextLevel();
        return;
      }

      if (this.state === 'PLAY') {
        const gt = this.levelConfig.gameType;

        // Handle Polygon Triangulation clicks
        if (gt === 'polygon_triangulation' && this.polygonState) {
          this.handlePolygonClick(pos);
          return;
        }

        // Handle Transform Affine drag
        if (gt === 'transform_affine' && this.transformState) {
          this.transformState.dragging = true;
          this.transformState.lastAngle = Math.atan2(pos.y - this.height / 2, pos.x - this.width / 2);
          this.transformState.lastDist = Math.hypot(pos.x - this.width / 2, pos.y - this.height / 2);
          return;
        }

        // Handle Wave sliders drag
        if (gt === 'wave_superposition' && this.waveState) {
          // Upper half = freq slider, lower half = phase slider
          if (pos.y < this.height * 0.35) {
            this.waveState.draggingFreq = true;
          } else if (pos.y > this.height * 0.65) {
            this.waveState.draggingPhase = true;
          }
          return;
        }

        // Standard ricochet aiming for all other game types
        if (this.projectile) return;
        const launcher = this.levelConfig.launcher;
        const dist = Math.hypot(pos.x - launcher.x, pos.y - launcher.y);
        if (dist < 60) {
          this.isAiming = true;
          this.currentAim = pos;
        }
      }
    };

    const handleMove = (e) => {
      if (this.state !== 'PLAY') return;
      const pos = getPos(e);
      const gt = this.levelConfig.gameType;

      if (gt === 'transform_affine' && this.transformState && this.transformState.dragging) {
        const cx = this.width / 2, cy = this.height / 2;
        const angle = Math.atan2(pos.y - cy, pos.x - cx);
        const dist = Math.hypot(pos.x - cx, pos.y - cy);
        const angleDelta = (angle - this.transformState.lastAngle) * (180 / Math.PI);
        this.transformState.curRot = ((this.transformState.curRot + angleDelta) % 360 + 360) % 360;
        const scaleDelta = (dist - this.transformState.lastDist) * 0.005;
        this.transformState.curScale = Math.max(0.4, Math.min(2.2, this.transformState.curScale + scaleDelta));
        this.transformState.lastAngle = angle;
        this.transformState.lastDist = dist;
        return;
      }

      if (gt === 'wave_superposition' && this.waveState) {
        const normalizedX = Math.max(0, Math.min(1, pos.x / this.width));
        if (this.waveState.draggingFreq) {
          this.waveState.curFreq = 1.0 + normalizedX * 4.0;
        }
        if (this.waveState.draggingPhase) {
          this.waveState.curPhase = normalizedX * 360;
        }
        return;
      }

      if (!this.isAiming) return;
      this.currentAim = pos;
      if (Math.random() < 0.12 && window.soundEngine) {
        window.soundEngine.playPencilScratch(0.04);
      }
    };

    const handleEnd = () => {
      if (this.state !== 'PLAY') return;
      const gt = this.levelConfig.gameType;

      if (gt === 'transform_affine' && this.transformState) {
        if (this.transformState.dragging) {
          this.transformState.dragging = false;
          // Check congruence on release
          this.checkTransformCongruence();
        }
        return;
      }

      if (gt === 'wave_superposition' && this.waveState) {
        this.waveState.draggingFreq = false;
        this.waveState.draggingPhase = false;
        return;
      }

      if (!this.isAiming) return;
      this.isAiming = false;

      const launcher = this.levelConfig.launcher;
      const dx = launcher.x - this.currentAim.x;
      const dy = launcher.y - this.currentAim.y;
      const mag = Math.min(18, Math.hypot(dx, dy) * 0.14);

      if (mag > 2.5) {
        const angle = Math.atan2(dy, dx);
        this.projectile = {
          x: launcher.x,
          y: launcher.y,
          vx: Math.cos(angle) * mag,
          vy: Math.sin(angle) * mag,
          r: 5,
          bounces: 0,
          maxBounces: 5,
          trail: []
        };
        this.shotsFired++;
        if (window.soundEngine) window.soundEngine.playPulseLaunch();
      }
    };

    this.canvas.addEventListener('mousedown', handleStart);
    this.canvas.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);

    this.canvas.addEventListener('touchstart', handleStart, { passive: true });
    this.canvas.addEventListener('touchmove', handleMove, { passive: true });
    window.addEventListener('touchend', handleEnd);

    // Double-click to commit wave cancellation
    this.canvas.addEventListener('dblclick', () => {
      if (this.state !== 'PLAY') return;
      const gt = this.levelConfig.gameType;
      if (gt === 'wave_superposition' && this.waveState) {
        this.checkWaveCancellation();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        if (this.state === 'INTRO') {
          if (this.introStep < 2) {
            this.introStep = 2;
            this.introTypewriterIndex = 999;
            this.introStampOpacity = 1;
            if (window.soundEngine) window.soundEngine.playStampThud();
          } else {
            this.state = 'PLAY';
          }
        } else if (this.state === 'SUCCESS') {
          this.advanceToNextLevel();
        } else if (this.state === 'PLAY') {
          const gt = this.levelConfig.gameType;
          if (gt === 'wave_superposition') {
            this.checkWaveCancellation();
          } else if (gt === 'transform_affine') {
            this.checkTransformCongruence();
          }
        }
      } else if (e.key === 'p' || e.key === 'P') {
        if (window.storyEngine) {
          window.storyEngine.playStory(this.currentPatientId);
        }
      } else if (e.key === 'r' || e.key === 'R') {
        this.loadPatientLevel(this.currentPatientId, this.currentLevelIndex, false);
      }
    });
  }

  // ============================================================================
  // SPECIAL GAME TYPE HANDLERS
  // ============================================================================
  handlePolygonClick(pos) {
    const ps = this.polygonState;
    if (!ps) return;
    for (let i = 0; i < ps.nodes.length; i++) {
      const node = ps.nodes[i];
      if (Math.hypot(pos.x - node.x, pos.y - node.y) < 28) {
        if (!ps.selectedNodes.includes(i)) {
          ps.selectedNodes.push(i);
          if (window.soundEngine) window.soundEngine.playPencilScratch(0.08);
        }
        if (ps.selectedNodes.length === 3) {
          ps.formedTriangles.push([...ps.selectedNodes]);
          ps.selectedNodes = [];
          if (window.soundEngine) window.soundEngine.playStampThud();
          this.spawnInkSplatter(pos.x, pos.y, '#10b981', 20, 1.5);

          if (ps.formedTriangles.length >= ps.targetTriangles) {
            this.handleLevelCleared();
          }
        }
        break;
      }
    }
  }

  checkTransformCongruence() {
    const ts = this.transformState;
    if (!ts) return;
    const dm = this.getDiffMod();
    const rotDiff = Math.abs(ts.curRot - ts.targetRot);
    const rotMatch = Math.max(0, 1 - (rotDiff / 180));
    const scaleDiff = Math.abs(ts.curScale - ts.targetScale);
    const scaleMatch = Math.max(0, 1 - (scaleDiff / 1.5));
    const fit = (rotMatch * 0.6 + scaleMatch * 0.4);

    if (fit >= dm.tolerance) {
      this.handleLevelCleared();
    } else {
      this.spawnInkSplatter(this.width / 2, this.height / 2, '#ef4444', 15, 1.0);
      if (window.soundEngine) window.soundEngine.playPencilScratch(0.12);
    }
  }

  checkWaveCancellation() {
    const ws = this.waveState;
    if (!ws) return;
    const dm = this.getDiffMod();
    const fDiff = Math.abs(ws.curFreq - ws.targetFreq);
    const fMatch = Math.max(0, 1 - (fDiff / 3.0));
    const pDiff = Math.abs(ws.curPhase - 180);
    const pMatch = Math.max(0, 1 - (pDiff / 180));
    const cancelPct = fMatch * 0.4 + pMatch * 0.6;

    if (cancelPct >= dm.tolerance) {
      this.handleLevelCleared();
    } else {
      this.spawnInkSplatter(this.width / 2, this.height / 2, '#ef4444', 15, 1.0);
      if (window.soundEngine) window.soundEngine.playPencilScratch(0.12);
    }
  }

  // ============================================================================
  // MASTER RENDER & PHYSICS LOOP
  // ============================================================================
  renderLoop(now) {
    if (this.currentPatientId === 'kabir' || this.currentPatientId === 'radha') {
      this.animId = requestAnimationFrame(this.renderLoop.bind(this));
      return;
    }

    const dt = Math.min(0.05, (now - this.lastFrameTime) / 1000);
    this.lastFrameTime = now;
    this.sketchPhase += 0.08;

    // 1. Draw Sketchbook Charcoal Paper Background
    this.renderSketchPaperBackground();

    // 2. Render State
    if (this.state === 'INTRO') {
      this.renderCinematicCaseIntro(dt);
    } else if (this.state === 'PLAY') {
      this.updatePhysics(dt);
      this.renderPlayLevel();
    } else if (this.state === 'SUCCESS') {
      this.renderPlayLevel();
      this.renderSuccessClinicalStamp();
    }

    // 3. Render In-Game Particles
    this.renderParticles(dt);

    // 4. Draw Bio-Harmonic Soothing Overlay if active
    if (window.telemetryEngine && window.telemetryEngine.isOverrideActive) {
      this.renderBioHarmonicVignette();
    }

    this.animId = requestAnimationFrame(this.renderLoop.bind(this));
  }

  // ============================================================================
  // 1. SKETCHBOOK JOURNAL BACKGROUND RENDERING (Dark Charcoal & Vellum)
  // ============================================================================
  renderSketchPaperBackground() {
    const ctx = this.ctx;
    const isOverride = window.telemetryEngine && window.telemetryEngine.isOverrideActive;

    // Dark charcoal / aged graphite base
    ctx.fillStyle = isOverride ? '#1e1c18' : '#141416';
    ctx.fillRect(0, 0, this.width, this.height);

    // Subtle hand-drawn graph paper grid lines
    ctx.strokeStyle = isOverride ? 'rgba(180, 160, 120, 0.07)' : 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 30; x < this.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    for (let y = 30; y < this.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }

    // Journal Border Box with double-lined sketch edges
    ctx.strokeStyle = isOverride ? 'rgba(180, 150, 100, 0.35)' : 'rgba(180, 160, 140, 0.22)';
    ctx.lineWidth = 1.8;
    ctx.strokeRect(16, 16, this.width - 32, this.height - 32);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.strokeRect(20, 20, this.width - 40, this.height - 40);

    // Medical Case Docket Number top right
    const dm = this.getDiffMod();
    ctx.fillStyle = isOverride ? '#c2a67a' : '#8c827a';
    ctx.font = '10px "Special Elite", monospace';
    ctx.textAlign = 'right';
    const p = window.PATIENTS[this.currentPatientId];
    ctx.fillText(`CLINICAL FILE: ${p.clinicalCode} • SEC-VII`, this.width - 32, 34);
    ctx.fillText(`GEOMETRIC DOSSIER: STAGE ${this.currentLevelIndex + 1}`, this.width - 32, 48);
    // Difficulty indicator
    ctx.fillStyle = dm.color;
    ctx.fillText(`DIFFICULTY: ${dm.label}`, this.width - 32, 62);
  }

  // ============================================================================
  // 2. CINEMATIC CASE INTRO SEQUENCE (Hand-Drawn Medical Journal Story)
  // ============================================================================
  renderCinematicCaseIntro(dt) {
    const ctx = this.ctx;
    const p = window.PATIENTS[this.currentPatientId];
    const lvl = this.levelConfig;

    this.introTimer += dt;

    // Draw Left Column: Hand-drawn Sketch Character Portrait
    this.drawHandDrawnPortrait(p, 48, 70, 240, 320);

    // Draw Right Column: Medical Case Journal & Diagnostic Notes
    ctx.textAlign = 'left';

    // Header Tag
    ctx.fillStyle = '#a65b40';
    ctx.font = '11px "Special Elite", monospace';
    ctx.fillText(`[ CONFIDENTIAL CASE HISTORY • ${p.socioeconomic.toUpperCase()} ]`, 320, 80);

    // Patient Full Name
    ctx.fillStyle = '#f1ece1';
    ctx.font = 'bold 24px "Special Elite", monospace';
    ctx.fillText(`${p.name.toUpperCase()} (AGE ${p.age})`, 320, 112);

    // Sub-role
    ctx.fillStyle = '#9e9488';
    ctx.font = '12px "Special Elite", monospace';
    ctx.fillText(`ROLE: ${p.role.toUpperCase()} • ${p.facility.toUpperCase()}`, 320, 134);

    // Horizontal sketched separator line
    ctx.strokeStyle = 'rgba(200, 180, 160, 0.2)';
    ctx.beginPath();
    ctx.moveTo(320, 146);
    ctx.lineTo(this.width - 60, 146);
    ctx.stroke();

    // Etiology & Backstory Text (Typewriter Effect)
    const fullText = `ETIOLOGY: ${p.etiology}\n\nCLINICAL BRIEF: ${lvl.caseBrief}\n\nGEOMETRIC VECTOR FOCUS: ${lvl.geometryType} (${lvl.mathConcept})`;
    this.introTypewriterIndex = Math.min(fullText.length, Math.floor(this.introTimer * 38));

    const displayedText = fullText.substring(0, this.introTypewriterIndex);
    const lines = displayedText.split('\n');
    let lineY = 175;

    ctx.fillStyle = '#dcd4c5';
    ctx.font = '13px "Special Elite", monospace';
    lines.forEach(line => {
      ctx.fillText(line, 320, lineY);
      lineY += 20;
    });

    // Sound effect on typewriter
    if (this.introTypewriterIndex < fullText.length && Math.random() < 0.25 && window.soundEngine) {
      window.soundEngine.playTypewriterClack();
    }

    // Medical Red Ink Stamp: DIAGNOSIS CONFIRMED
    if (this.introTypewriterIndex >= fullText.length * 0.4) {
      this.introStampOpacity = Math.min(1, this.introStampOpacity + dt * 2.5);

      ctx.save();
      ctx.translate(320, lineY + 25);
      ctx.rotate(-0.06); // 3.5-degree natural stamp tilt
      ctx.globalAlpha = this.introStampOpacity;

      // Heavy double border stamp box
      ctx.strokeStyle = p.inkStampColor || '#9e3024';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(0, 0, 480, 44);
      ctx.lineWidth = 1;
      ctx.strokeRect(4, 4, 472, 36);

      ctx.fillStyle = p.inkStampColor || '#9e3024';
      ctx.font = 'bold 15px "Special Elite", monospace';
      ctx.fillText(`DIAGNOSIS: ${p.diagnosisTitle.toUpperCase()}`, 16, 28);
      ctx.restore();
      ctx.globalAlpha = 1;
    }

    // Call to Action prompt at bottom right
    const pulse = Math.sin(this.introTimer * 4) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(240, 220, 180, ${pulse})`;
    ctx.font = 'bold 13px "Special Elite", monospace';
    ctx.textAlign = 'right';
    ctx.fillText("[ CLICK / ENTER: COMMENCE SURGERY ]  •  [ P: WATCH PROLOGUE STORY ]", this.width - 50, this.height - 40);
  }

  // ============================================================================
  // HAND-DRAWN SKETCH PORTRAITS (Siddharth, Kabir, Radha)
  // ============================================================================
  drawHandDrawnPortrait(p, x, y, w, h) {
    const ctx = this.ctx;

    // Aged portrait backing plate
    ctx.fillStyle = 'rgba(25, 24, 22, 0.85)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = 'rgba(180, 160, 140, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, w, h);

    // Corner photo mounting tabs
    ctx.fillStyle = '#3a342d';
    ctx.fillRect(x - 2, y - 2, 14, 4);
    ctx.fillRect(x - 2, y - 2, 4, 14);
    ctx.fillRect(x + w - 12, y - 2, 14, 4);
    ctx.fillRect(x + w - 2, y - 2, 4, 14);

    const cx = x + w / 2;
    const cy = y + h / 2 - 15;

    ctx.save();
    ctx.strokeStyle = '#e6dbc8';
    ctx.fillStyle = '#e6dbc8';
    ctx.lineWidth = 2;

    if (p.portraitTheme === 'glasses_burnout') {
      // --- SIDDHARTH: Slender, wire glasses, sunken dark eye circles ---
      ctx.beginPath();
      ctx.ellipse(cx, cy, 52, 68, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Disheveled messy hair
      ctx.beginPath();
      ctx.moveTo(cx - 56, cy - 30);
      ctx.quadraticCurveTo(cx - 40, cy - 80, cx, cy - 75);
      ctx.quadraticCurveTo(cx + 40, cy - 80, cx + 56, cy - 30);
      ctx.stroke();

      // Square wireframe glasses
      ctx.strokeStyle = '#9ca3af';
      ctx.strokeRect(cx - 44, cy - 18, 36, 24);
      ctx.strokeRect(cx + 8, cy - 18, 36, 24);
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy - 6);
      ctx.lineTo(cx + 8, cy - 6);
      ctx.stroke();

      // Exhausted sunken eyes & dark bags
      ctx.strokeStyle = '#8c7b6c';
      ctx.beginPath();
      ctx.arc(cx - 26, cy + 12, 14, 0, Math.PI);
      ctx.arc(cx + 26, cy + 12, 14, 0, Math.PI);
      ctx.stroke();

      // Strained mouth
      ctx.strokeStyle = '#e6dbc8';
      ctx.beginPath();
      ctx.moveTo(cx - 18, cy + 38);
      ctx.lineTo(cx + 18, cy + 38);
      ctx.stroke();

      // Loosened collar / tie
      ctx.beginPath();
      ctx.moveTo(cx - 24, cy + 68);
      ctx.lineTo(cx, cy + 90);
      ctx.lineTo(cx + 24, cy + 68);
      ctx.stroke();

    } else if (p.portraitTheme === 'courier_overload') {
      // --- KABIR: Weather-beaten courier, wet hair, heavy fatigue ---
      ctx.beginPath();
      ctx.ellipse(cx, cy, 54, 70, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Wet plastered hair strands
      for (let i = -40; i <= 40; i += 12) {
        ctx.beginPath();
        ctx.moveTo(cx + i, cy - 70);
        ctx.lineTo(cx + i - 4, cy - 40);
        ctx.stroke();
      }

      // Heavy brow of sensory strain
      ctx.beginPath();
      ctx.moveTo(cx - 40, cy - 16);
      ctx.lineTo(cx - 12, cy - 22);
      ctx.moveTo(cx + 12, cy - 22);
      ctx.lineTo(cx + 40, cy - 16);
      ctx.stroke();

      // Tired determined eyes
      ctx.beginPath();
      ctx.arc(cx - 24, cy - 8, 8, 0, Math.PI * 2);
      ctx.arc(cx + 24, cy - 8, 8, 0, Math.PI * 2);
      ctx.stroke();

      // Rain streaks across portrait
      ctx.strokeStyle = 'rgba(120, 160, 200, 0.4)';
      for (let r = 0; r < 5; r++) {
        ctx.beginPath();
        ctx.moveTo(x + 20 + r * 45, y + 20);
        ctx.lineTo(x + 10 + r * 45, y + 160);
        ctx.stroke();
      }

      // Motorcycle helmet strap under chin
      ctx.strokeStyle = '#8c7b6c';
      ctx.beginPath();
      ctx.moveTo(cx - 48, cy + 20);
      ctx.quadraticCurveTo(cx, cy + 85, cx + 48, cy + 20);
      ctx.stroke();

    } else {
      // --- RADHA: Deep wrinkles, grey-streaked hair, cotton dupatta ---
      ctx.beginPath();
      ctx.ellipse(cx, cy, 50, 68, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Cotton dupatta covering head
      ctx.strokeStyle = '#a8947c';
      ctx.beginPath();
      ctx.moveTo(cx - 56, cy + 60);
      ctx.quadraticCurveTo(cx - 65, cy - 80, cx, cy - 78);
      ctx.quadraticCurveTo(cx + 65, cy - 80, cx + 56, cy + 60);
      ctx.stroke();

      // Forehead worry lines
      ctx.strokeStyle = '#7c6a58';
      ctx.beginPath();
      ctx.moveTo(cx - 26, cy - 35);
      ctx.lineTo(cx + 26, cy - 35);
      ctx.moveTo(cx - 20, cy - 26);
      ctx.lineTo(cx + 20, cy - 26);
      ctx.stroke();

      // Deep set hollow eyes
      ctx.strokeStyle = '#e6dbc8';
      ctx.beginPath();
      ctx.arc(cx - 22, cy - 10, 7, 0, Math.PI * 2);
      ctx.arc(cx + 22, cy - 10, 7, 0, Math.PI * 2);
      ctx.stroke();

      // Crow's feet lines
      ctx.strokeStyle = '#7c6a58';
      ctx.beginPath();
      ctx.moveTo(cx - 32, cy - 10);
      ctx.lineTo(cx - 42, cy - 14);
      ctx.moveTo(cx + 32, cy - 10);
      ctx.lineTo(cx + 42, cy - 14);
      ctx.stroke();

      // Hospital patient tag pinned to shawl
      ctx.strokeStyle = '#dc2626';
      ctx.strokeRect(cx - 35, cy + 80, 70, 20);
      ctx.fillStyle = '#dc2626';
      ctx.font = '8px "Special Elite", monospace';
      ctx.fillText("TOKEN #142-CHARITY", cx - 30, cy + 93);
    }

    ctx.restore();

    // Handwritten caption below portrait
    ctx.fillStyle = '#c5b8a5';
    ctx.font = 'italic 11px "Caveat", cursive';
    ctx.textAlign = 'center';
    ctx.fillText(`Fig 1.1: ${p.name} - Pre-Op Case File`, cx, y + h - 14);
  }

  // ============================================================================
  // 3. PHYSICS & RICOCHET UPDATE LOOP (Handles all game types)
  // ============================================================================
  updatePhysics(dt) {
    const isOverride = window.telemetryEngine && window.telemetryEngine.isOverrideActive;
    const speedMult = isOverride ? 0.5 : 1.0;
    const gt = this.levelConfig.gameType;
    const dm = this.getDiffMod();

    // Update wave state time
    if (gt === 'wave_superposition' && this.waveState) {
      this.waveState.time += dt;
    }

    // Update moving obstacles
    this.movingObstacles.forEach(mo => {
      mo.y += mo.vy * speedMult;
      if (mo.y <= mo.yMin || mo.y + mo.h >= mo.yMax) {
        mo.vy = -mo.vy;
      }
    });

    // Non-projectile game types don't need projectile physics
    if (gt === 'transform_affine' || gt === 'wave_superposition' || gt === 'polygon_triangulation') {
      return;
    }

    // Update Projectile
    if (this.projectile) {
      const p = this.projectile;
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 20) p.trail.shift();

      // Gravity well forces (for slingshot game)
      if (gt === 'gravity_slingshot' && this.gravityWells.length > 0) {
        this.gravityWells.forEach(well => {
          const wdx = well.x - p.x;
          const wdy = well.y - p.y;
          const distSq = Math.max(120, wdx * wdx + wdy * wdy);
          const force = (well.mass || 550) / distSq;
          const angle = Math.atan2(wdy, wdx);
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;
        });
      }

      p.x += p.vx;
      p.y += p.vy;

      // Particle dust along trail
      if (Math.random() < 0.4) {
        this.spawnInkSplatter(p.x, p.y, '#f59e0b', 2, 0.8);
      }

      // 1. Boundary Wall Bounces (Canvas Margins)
      if (p.x <= 28) {
        p.x = 28;
        p.vx = -p.vx;
        this.registerBounce();
      } else if (p.x >= this.width - 28) {
        p.x = this.width - 28;
        p.vx = -p.vx;
        this.registerBounce();
      }
      if (p.y <= 28) {
        p.y = 28;
        p.vy = -p.vy;
        this.registerBounce();
      } else if (p.y >= this.height - 28) {
        p.y = this.height - 28;
        p.vy = -p.vy;
        this.registerBounce();
      }

      // 2. Specular Plasma Mirrors Bounce: v' = v - 2(v·n)n
      this.mirrors.forEach(m => {
        const lineDist = this.distToSegment({ x: p.x, y: p.y }, { x: m.x1, y: m.y1 }, { x: m.x2, y: m.y2 });
        if (lineDist.dist <= p.r + 3) {
          const mdx = m.x2 - m.x1;
          const mdy = m.y2 - m.y1;
          const len = Math.hypot(mdx, mdy);
          let nx = -mdy / len;
          let ny = mdx / len;

          if (p.vx * nx + p.vy * ny > 0) {
            nx = -nx;
            ny = -ny;
          }

          const dot = p.vx * nx + p.vy * ny;
          p.vx = p.vx - 2 * dot * nx;
          p.vy = p.vy - 2 * dot * ny;

          p.x += nx * 4;
          p.y += ny * 4;

          this.registerBounce();
          this.spawnInkSplatter(p.x, p.y, '#38bdf8', 12, 1.4);
        }
      });

      // 3. Stationary Obstacles Collision
      this.obstacles.forEach(obs => {
        if (p.x >= obs.x && p.x <= obs.x + obs.w &&
            p.y >= obs.y && p.y <= obs.y + obs.h) {
          this.destroyProjectileWithFailure();
        }
      });

      // 4. Moving Obstacles Collision
      this.movingObstacles.forEach(mo => {
        if (p.x >= mo.x && p.x <= mo.x + mo.w &&
            p.y >= mo.y && p.y <= mo.y + mo.h) {
          this.destroyProjectileWithFailure();
        }
      });

      // 5. Target Nodes Hit Detection
      const targetRadiusMult = isOverride ? 1.6 : dm.targetScale;
      this.targets.forEach(t => {
        if (t.hp <= 0) return;
        const effectiveR = t.r * targetRadiusMult;
        const d = Math.hypot(p.x - t.x, p.y - t.y);
        if (d <= p.r + effectiveR) {
          t.hp = 0;
          this.projectile = null;
          if (window.soundEngine) window.soundEngine.playSynapseHit();
          this.spawnInkSplatter(t.x, t.y, '#10b981', 35, 2.2);

          const remaining = this.targets.filter(item => item.hp > 0).length;
          if (remaining === 0) {
            this.handleLevelCleared();
          }
        }
      });

      // 6. Gravity well collision (absorbed)
      if (this.projectile && gt === 'gravity_slingshot') {
        this.gravityWells.forEach(well => {
          const d = Math.hypot(p.x - well.x, p.y - well.y);
          if (d <= well.r) {
            this.destroyProjectileWithFailure();
          }
        });
      }

      // Max bounces exceeded
      if (this.projectile && p.bounces > p.maxBounces) {
        this.projectile = null;
      }
    }
  }

  registerBounce() {
    if (!this.projectile) return;
    this.projectile.bounces++;
    this.totalBounces++;
    if (window.soundEngine) {
      window.soundEngine.playRicochetPing(this.projectile.bounces);
    }
  }

  destroyProjectileWithFailure() {
    if (!this.projectile) return;
    this.spawnInkSplatter(this.projectile.x, this.projectile.y, '#ef4444', 16, 1.2);
    if (window.soundEngine) window.soundEngine.playPencilScratch(0.12);
    this.projectile = null;
  }

  handleLevelCleared() {
    this.state = 'SUCCESS';
    if (window.soundEngine) {
      window.soundEngine.playStampThud();
    }
    if (window.storageEngine) {
      window.storageEngine.unlockLevel(this.currentPatientId, this.currentLevelIndex + 1);
      window.storageEngine.recordTelemetryStats({
        shots: this.shotsFired,
        bounces: this.totalBounces,
        stressScore: window.telemetryEngine ? window.telemetryEngine.stressIndex : 30
      });
      if (this.currentLevelIndex >= 2) {
        window.storageEngine.setPatientStatus(this.currentPatientId, 'Stabilized');
      }
    }
    if (typeof window.recordStageCompletion === 'function') {
      let stg = this.currentLevelIndex + 1;
      if (this.currentPatientId === 'kabir') stg += 3;
      if (this.currentPatientId === 'radha') stg += 6;
      window.recordStageCompletion(stg);
    }
  }

  advanceToNextLevel() {
    const p = window.PATIENTS[this.currentPatientId];
    if (this.currentLevelIndex + 1 < p.levels.length) {
      this.loadPatientLevel(this.currentPatientId, this.currentLevelIndex + 1, true);
    } else {
      // If Radha's final stage (Stage 9) is cleared
      if (this.currentPatientId === 'radha') {
        if (window.storyEngine && window.PATIENT_EPILOGUES && window.PATIENT_EPILOGUES['radha']) {
          window.storyEngine.playStory('radha', true);
        } else if (window.telemetryEngine) {
          window.telemetryEngine.triggerReportCard();
        }
        return;
      }

      if (window.storyEngine && window.PATIENT_EPILOGUES && window.PATIENT_EPILOGUES[this.currentPatientId]) {
        window.storyEngine.playStory(this.currentPatientId, true);
      } else {
        const patientKeys = Object.keys(window.PATIENTS);
        const nextIdx = (patientKeys.indexOf(this.currentPatientId) + 1) % patientKeys.length;
        this.loadPatientLevel(patientKeys[nextIdx], 0, true);
      }
    }
  }

  // ============================================================================
  // 4. LEVEL PLAY RENDERING — dispatches to correct game type renderer
  // ============================================================================
  renderPlayLevel() {
    const gt = this.levelConfig.gameType;

    switch (gt) {
      case 'transform_affine':
        this.renderTransformGame();
        break;
      case 'wave_superposition':
        this.renderWaveGame();
        break;
      case 'polygon_triangulation':
        this.renderPolygonGame();
        break;
      case 'gravity_slingshot':
        this.renderGravitySlingshot();
        break;
      default:
        // All ricochet-based games: ricochet_mirror, geodesic_ricochet,
        // moving_timing, needle_slit, compound_ricochet
        this.renderRicochetLevel();
        break;
    }
  }

  // ============================================================================
  // RICOCHET LEVEL RENDERER (mirror, geodesic, moving, needle, compound)
  // ============================================================================
  renderRicochetLevel() {
    const ctx = this.ctx;
    const isOverride = window.telemetryEngine && window.telemetryEngine.isOverrideActive;
    const dm = this.getDiffMod();
    const targetRadiusMult = isOverride ? 1.6 : dm.targetScale;

    // A. Draw Stationary Obstacles (Hand-drawn cross-hatching)
    this.obstacles.forEach(obs => {
      ctx.fillStyle = 'rgba(25, 20, 20, 0.9)';
      ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
      ctx.strokeStyle = '#c24134';
      ctx.lineWidth = 1.8;
      ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);

      // Cross-hatching lines
      ctx.strokeStyle = 'rgba(194, 65, 52, 0.35)';
      ctx.lineWidth = 1;
      for (let i = 0; i < obs.w + obs.h; i += 12) {
        ctx.beginPath();
        ctx.moveTo(obs.x + Math.max(0, i - obs.h), obs.y + Math.min(obs.h, i));
        ctx.lineTo(obs.x + Math.min(obs.w, i), obs.y + Math.max(0, i - obs.w));
        ctx.stroke();
      }

      ctx.fillStyle = '#f87171';
      ctx.font = '9px "Special Elite", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(obs.label || 'BARRIER', obs.x + obs.w / 2, obs.y + obs.h / 2 + 3);
    });

    // B. Draw Dynamic Moving Obstacles
    this.movingObstacles.forEach(mo => {
      ctx.fillStyle = 'rgba(35, 25, 20, 0.9)';
      ctx.fillRect(mo.x, mo.y, mo.w, mo.h);
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2;
      ctx.strokeRect(mo.x, mo.y, mo.w, mo.h);

      ctx.strokeStyle = 'rgba(234, 179, 8, 0.2)';
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(mo.x, mo.yMin, mo.w, mo.yMax - mo.yMin + mo.h);
      ctx.setLineDash([]);

      ctx.fillStyle = '#fde047';
      ctx.font = '8px "Special Elite", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(mo.label || 'TRAFFIC', mo.x + mo.w / 2, mo.y + mo.h / 2 + 3);
    });

    // C. Draw Plasma Mirrors (Angled Specular Reflectors)
    this.mirrors.forEach(m => {
      ctx.beginPath();
      ctx.moveTo(m.x1, m.y1);
      ctx.lineTo(m.x2, m.y2);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.stroke();

      const mx = (m.x1 + m.x2) / 2;
      const my = (m.y1 + m.y2) / 2;
      const mdx = m.x2 - m.x1;
      const mdy = m.y2 - m.y1;
      const len = Math.hypot(mdx, mdy);
      const nx = -mdy / len;
      const ny = mdx / len;

      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(mx + nx * 14, my + ny * 14);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#7dd3fc';
      ctx.font = '9px "Special Elite", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(m.label || 'MIRROR', mx, my - 8);
    });

    // D. Draw Target Synapse Nodes
    this.targets.forEach(t => {
      if (t.hp <= 0) return;
      const r = t.r * targetRadiusMult;
      const pulse = Math.sin(this.sketchPhase * 3) * 2;

      ctx.beginPath();
      ctx.arc(t.x, t.y, r + pulse, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.fill();
      ctx.strokeStyle = isOverride ? '#34d399' : '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
        ctx.beginPath();
        ctx.moveTo(t.x + Math.cos(a) * r, t.y + Math.sin(a) * r);
        ctx.lineTo(t.x + Math.cos(a) * (r + 5), t.y + Math.sin(a) * (r + 5));
        ctx.strokeStyle = isOverride ? '#34d399' : '#f59e0b';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 9px "Special Elite", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(t.label || 'SYNAPSE', t.x, t.y + 3);
    });

    // E. Draw Launcher Node
    const l = this.levelConfig.launcher;
    ctx.beginPath();
    ctx.arc(l.x, l.y, 16, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(l.x, l.y, 5, 0, Math.PI * 2);
    ctx.fill();

    // F. Trajectory Guide & Aiming Vector
    if (this.isAiming) {
      const dx = l.x - this.currentAim.x;
      const dy = l.y - this.currentAim.y;
      const mag = Math.min(18, Math.hypot(dx, dy) * 0.14);

      if (mag > 1) {
        ctx.beginPath();
        ctx.moveTo(l.x, l.y);
        ctx.lineTo(l.x + dx, l.y + dy);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Angle and magnitude display
        const angleDeg = ((Math.atan2(dy, dx) * 180 / Math.PI) + 360) % 360;
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 11px "Special Elite", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`θ = ${angleDeg.toFixed(1)}°  |v| = ${mag.toFixed(1)}`, l.x + 30, l.y - 25);

        // Predicted Trajectory Line (length depends on difficulty)
        const simSteps = isOverride ? 120 : dm.guideSteps;
        if (simSteps > 0) {
          ctx.beginPath();
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = isOverride ? 'rgba(52, 211, 153, 0.8)' : 'rgba(240, 220, 180, 0.55)';
          ctx.lineWidth = 1.5;

          let simX = l.x;
          let simY = l.y;
          let simVx = (dx / Math.hypot(dx, dy)) * mag;
          let simVy = (dy / Math.hypot(dx, dy)) * mag;
          ctx.moveTo(simX, simY);

          for (let s = 0; s < simSteps; s++) {
            // Gravity wells in prediction
            if (this.gravityWells.length > 0) {
              this.gravityWells.forEach(well => {
                const wdx = well.x - simX;
                const wdy = well.y - simY;
                const distSq = Math.max(120, wdx * wdx + wdy * wdy);
                const force = (well.mass || 550) / distSq;
                const angle = Math.atan2(wdy, wdx);
                simVx += Math.cos(angle) * force;
                simVy += Math.sin(angle) * force;
              });
            }

            simX += simVx;
            simY += simVy;

            if (simX <= 28 || simX >= this.width - 28) simVx = -simVx;
            if (simY <= 28 || simY >= this.height - 28) simVy = -simVy;

            this.mirrors.forEach(m => {
              const ld = this.distToSegment({ x: simX, y: simY }, { x: m.x1, y: m.y1 }, { x: m.x2, y: m.y2 });
              if (ld.dist <= 8) {
                const mdx = m.x2 - m.x1;
                const mdy = m.y2 - m.y1;
                const len = Math.hypot(mdx, mdy);
                let nx = -mdy / len;
                let ny = mdx / len;
                if (simVx * nx + simVy * ny > 0) { nx = -nx; ny = -ny; }
                const dot = simVx * nx + simVy * ny;
                simVx = simVx - 2 * dot * nx;
                simVy = simVy - 2 * dot * ny;
              }
            });

            ctx.lineTo(simX, simY);
          }
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }

    // G. Active Projectile Pulse & Trail
    if (this.projectile) {
      const p = this.projectile;
      ctx.beginPath();
      for (let i = 0; i < p.trail.length; i++) {
        const pt = p.trail[i];
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // H. Draw gravity wells (if slingshot game)
    this.gravityWells.forEach(well => {
      // Influence field ring
      ctx.beginPath();
      ctx.arc(well.x, well.y, well.r * 3, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.18)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);

      // Core mass
      ctx.beginPath();
      ctx.arc(well.x, well.y, well.r, 0, Math.PI * 2);
      ctx.fillStyle = '#7c3aed';
      ctx.fill();
      ctx.strokeStyle = '#a78bfa';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Gravitational field lines
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
        ctx.beginPath();
        ctx.moveTo(well.x + Math.cos(a) * (well.r + 4), well.y + Math.sin(a) * (well.r + 4));
        ctx.lineTo(well.x + Math.cos(a) * (well.r * 2.5), well.y + Math.sin(a) * (well.r * 2.5));
        ctx.strokeStyle = 'rgba(167, 139, 250, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.fillStyle = '#e0e7ff';
      ctx.font = 'bold 8px "Special Elite", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(well.name || 'MASS', well.x, well.y + 3);
      ctx.fillStyle = 'rgba(167, 139, 250, 0.7)';
      ctx.font = '8px "Special Elite", monospace';
      ctx.fillText(`μ = ${well.mass}`, well.x, well.y + well.r + 14);
    });
  }

  // ============================================================================
  // TRANSFORM AFFINE GAME RENDERER (Rotation + Scale)
  // ============================================================================
  renderTransformGame() {
    const ctx = this.ctx;
    const ts = this.transformState;
    if (!ts) return;
    const dm = this.getDiffMod();

    const cx = this.width / 2;
    const cy = this.height / 2;

    // Target receptor silhouette (dashed green)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((ts.targetRot * Math.PI) / 180);
    ctx.scale(ts.targetScale, ts.targetScale);
    this.drawAntibodyShape(ctx, '#10b981', 'rgba(16, 185, 129, 0.15)', true);
    ctx.restore();

    // Active transforming construct (cyan, draggable)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((ts.curRot * Math.PI) / 180);
    ctx.scale(ts.curScale, ts.curScale);
    this.drawAntibodyShape(ctx, '#38bdf8', 'rgba(56, 189, 248, 0.35)', false);
    ctx.restore();

    // Congruence fit calculation
    const rotDiff = Math.abs(ts.curRot - ts.targetRot);
    const rotMatch = Math.max(0, 1 - (rotDiff / 180));
    const scaleDiff = Math.abs(ts.curScale - ts.targetScale);
    const scaleMatch = Math.max(0, 1 - (scaleDiff / 1.5));
    const fit = Math.round(((rotMatch * 0.6) + (scaleMatch * 0.4)) * 100);

    // HUD
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 13px "Special Elite", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`ROTATION θ = ${ts.curRot.toFixed(1)}°    SCALE S = ${ts.curScale.toFixed(2)}x`, 40, 40);

    const fitColor = fit >= dm.tolerance * 100 ? '#10b981' : fit > 50 ? '#f59e0b' : '#ef4444';
    ctx.fillStyle = fitColor;
    ctx.font = 'bold 18px "Special Elite", monospace';
    ctx.fillText(`CONGRUENCE: ${fit}%`, 40, 65);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '11px "Special Elite", monospace';
    ctx.fillText(`TARGET: ≥${Math.round(dm.tolerance * 100)}% | REQUIRED θ ≈ ${ts.targetRot}° S ≈ ${ts.targetScale.toFixed(1)}x`, 40, 85);

    // Instructions
    ctx.fillStyle = 'rgba(240, 220, 180, 0.6)';
    ctx.font = '12px "Special Elite", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('DRAG TO ROTATE & SCALE • PRESS ENTER/SPACE TO LOCK CONGRUENCE', cx, this.height - 30);

    // Matrix formula
    ctx.fillStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.font = '10px "Special Elite", monospace';
    ctx.textAlign = 'right';
    const cos = Math.cos(ts.curRot * Math.PI / 180).toFixed(2);
    const sin = Math.sin(ts.curRot * Math.PI / 180).toFixed(2);
    ctx.fillText(`T = [${(ts.curScale * cos).toFixed(2)}  ${(-ts.curScale * sin).toFixed(2)} | ${(ts.curScale * sin).toFixed(2)}  ${(ts.curScale * cos).toFixed(2)}]`, this.width - 40, this.height - 30);
  }

  drawAntibodyShape(ctx, strokeColor, fillColor, isDashed) {
    ctx.beginPath();
    ctx.moveTo(0, -40);
    ctx.lineTo(25, 10);
    ctx.lineTo(40, -10);
    ctx.lineTo(15, 45);
    ctx.lineTo(-15, 45);
    ctx.lineTo(-40, -10);
    ctx.lineTo(-25, 10);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2.5;
    if (isDashed) {
      ctx.setLineDash([5, 5]);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // ============================================================================
  // WAVE SUPERPOSITION GAME RENDERER (Frequency + Phase)
  // ============================================================================
  renderWaveGame() {
    const ctx = this.ctx;
    const ws = this.waveState;
    if (!ws) return;
    const dm = this.getDiffMod();

    const cy = this.height / 2;
    const w = this.width;

    // 1. Pathogen Resonance Wave (Red)
    ctx.beginPath();
    for (let x = 0; x < w; x += 3) {
      const y = cy + Math.sin((x * 0.02 * ws.targetFreq) - (ws.time * ws.targetFreq * 2)) * 60;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label
    ctx.fillStyle = '#ef4444';
    ctx.font = '10px "Special Elite", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`PATHOGEN WAVE: f = ${ws.targetFreq.toFixed(1)} Hz`, 30, 35);

    // 2. Player Therapeutic Wave (Cyan)
    const phiRad = (ws.curPhase * Math.PI) / 180;
    ctx.beginPath();
    for (let x = 0; x < w; x += 3) {
      const y = cy + Math.sin((x * 0.02 * ws.curFreq) - (ws.time * ws.curFreq * 2) + phiRad) * 60;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 3. Superposition Result (Green)
    ctx.beginPath();
    for (let x = 0; x < w; x += 3) {
      const y1 = Math.sin((x * 0.02 * ws.targetFreq) - (ws.time * ws.targetFreq * 2)) * 60;
      const y2 = Math.sin((x * 0.02 * ws.curFreq) - (ws.time * ws.curFreq * 2) + phiRad) * 60;
      const yTot = cy + (y1 + y2);
      if (x === 0) ctx.moveTo(x, yTot);
      else ctx.lineTo(x, yTot);
    }
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Calculate cancellation
    const fDiff = Math.abs(ws.curFreq - ws.targetFreq);
    const fMatch = Math.max(0, 1 - (fDiff / 3.0));
    const pDiff = Math.abs(ws.curPhase - 180);
    const pMatch = Math.max(0, 1 - (pDiff / 180));
    const cancelPct = Math.round((fMatch * 0.4 + pMatch * 0.6) * 100);

    // HUD
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 13px "Special Elite", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`YOUR WAVE: f = ${ws.curFreq.toFixed(1)} Hz  |  φ = ${ws.curPhase.toFixed(0)}°`, 30, 55);

    const cancelColor = cancelPct >= dm.tolerance * 100 ? '#10b981' : '#f59e0b';
    ctx.fillStyle = cancelColor;
    ctx.font = 'bold 18px "Special Elite", monospace';
    ctx.fillText(`INTERFERENCE CANCEL: ${cancelPct}%`, 30, 80);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '10px "Special Elite", monospace';
    ctx.fillText(`TARGET: ≥${Math.round(dm.tolerance * 100)}% (Set φ → 180° and match f)`, 30, 96);

    // Slider indicators
    // Frequency slider track (top area)
    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.fillRect(30, 108, w - 60, 24);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 108, w - 60, 24);
    const freqPos = ((ws.curFreq - 1.0) / 4.0) * (w - 60);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(30 + freqPos - 4, 106, 8, 28);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '9px "Special Elite", monospace';
    ctx.fillText('◄ DRAG TOP AREA: FREQUENCY ►', 40, 124);

    // Phase slider track (bottom area)
    const bottomY = this.height - 60;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.fillRect(30, bottomY, w - 60, 24);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.strokeRect(30, bottomY, w - 60, 24);
    const phasePos = (ws.curPhase / 360) * (w - 60);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(30 + phasePos - 4, bottomY - 2, 8, 28);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText('◄ DRAG BOTTOM AREA: PHASE SHIFT φ ►', 40, bottomY + 16);

    // Instructions
    ctx.fillStyle = 'rgba(240, 220, 180, 0.6)';
    ctx.font = '11px "Special Elite", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('DRAG TOP/BOTTOM TO ADJUST • DOUBLE-CLICK / ENTER TO LOCK CANCELLATION', this.width / 2, this.height - 22);
  }

  // ============================================================================
  // POLYGON TRIANGULATION GAME RENDERER
  // ============================================================================
  renderPolygonGame() {
    const ctx = this.ctx;
    const ps = this.polygonState;
    if (!ps) return;
    const dm = this.getDiffMod();

    // Draw leaking vascular fissure zone
    ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
    ctx.beginPath();
    ctx.ellipse(this.width / 2, this.height / 2, 280, 170, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw formed triangles
    ps.formedTriangles.forEach(tri => {
      const p1 = ps.nodes[tri[0]];
      const p2 = ps.nodes[tri[1]];
      const p3 = ps.nodes[tri[2]];
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.closePath();
      ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
      ctx.fill();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Show area calculation
      const area = Math.abs(
        p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)
      ) / 2;
      const centX = (p1.x + p2.x + p3.x) / 3;
      const centY = (p1.y + p2.y + p3.y) / 3;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '9px "Special Elite", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`A=${Math.round(area)}`, centX, centY);
    });

    // Draw active selection line
    if (ps.selectedNodes.length > 0) {
      ctx.beginPath();
      for (let i = 0; i < ps.selectedNodes.length; i++) {
        const pt = ps.nodes[ps.selectedNodes[i]];
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw nodes
    ps.nodes.forEach((n, idx) => {
      const isSel = ps.selectedNodes.includes(idx);
      ctx.beginPath();
      ctx.arc(n.x, n.y, isSel ? 14 : 10, 0, Math.PI * 2);
      ctx.fillStyle = isSel ? '#38bdf8' : '#fff';
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px "Special Elite", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`V${idx + 1}`, n.x, n.y - 16);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '8px "Special Elite", monospace';
      ctx.fillText(`(${n.x},${n.y})`, n.x, n.y + 24);
    });

    // HUD
    const pct = Math.min(100, Math.round((ps.formedTriangles.length / ps.targetTriangles) * 100));
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 14px "Special Elite", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`TRIANGLES: ${ps.formedTriangles.length} / ${ps.targetTriangles}  |  COVERAGE: ${pct}%`, 40, 40);

    ctx.fillStyle = 'rgba(240, 220, 180, 0.5)';
    ctx.font = '10px "Special Elite", monospace';
    ctx.fillText('SHOELACE FORMULA: Area = ½|x_A(y_B−y_C) + x_B(y_C−y_A) + x_C(y_A−y_B)|', 40, 60);

    ctx.fillStyle = 'rgba(240, 220, 180, 0.6)';
    ctx.font = '11px "Special Elite", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CLICK 3 NODES TO FORM EACH FIBRIN TRIANGLE', this.width / 2, this.height - 30);
  }

  // ============================================================================
  // GRAVITY SLINGSHOT — uses renderRicochetLevel (which draws gravity wells)
  // ============================================================================
  renderGravitySlingshot() {
    this.renderRicochetLevel();
  }

  // ============================================================================
  // 5. SUCCESS STAMP OVERLAY
  // ============================================================================
  renderSuccessClinicalStamp() {
    const ctx = this.ctx;
    const p = window.PATIENTS[this.currentPatientId];

    ctx.save();
    ctx.translate(this.width / 2, this.height / 2);
    ctx.rotate(-0.04);

    ctx.fillStyle = 'rgba(15, 20, 18, 0.9)';
    ctx.fillRect(-280, -90, 560, 180);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.strokeRect(-275, -85, 550, 170);
    ctx.strokeRect(-270, -80, 540, 160);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 22px "Special Elite", monospace';
    ctx.textAlign = 'center';
    ctx.fillText("SYNAPSE STABILIZED • LEVEL COMPLETE", 0, -35);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '13px "Special Elite", monospace';
    ctx.fillText(`PATIENT: ${p.name.toUpperCase()} • NEURAL PATHWAY SECURED`, 0, -5);
    ctx.fillText(`ACCURACY: ${this.shotsFired} SHOT(S) • RICOCHETS: ${this.totalBounces}`, 0, 20);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 13px "Special Elite", monospace';
    ctx.fillText("[ CLICK TO ADVANCE TO NEXT RECOVERY STAGE ▶ ]", 0, 55);

    ctx.restore();
  }

  // ============================================================================
  // 6. BIO-HARMONIC OVERRIDE VISUAL SHIFT
  // ============================================================================
  renderBioHarmonicVignette() {
    const ctx = this.ctx;
    const grad = ctx.createRadialGradient(
      this.width / 2, this.height / 2, this.height * 0.35,
      this.width / 2, this.height / 2, this.height * 0.75
    );
    grad.addColorStop(0, 'rgba(16, 185, 129, 0)');
    grad.addColorStop(1, 'rgba(16, 185, 129, 0.18)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.save();
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 10px "Special Elite", monospace';
    ctx.fillText("⚕ BIO-HARMONIC OVERRIDE ACTIVE: TARGET HITBOXES EXPANDED & SPEEDS DAMPENED", 30, 42);
    ctx.restore();
  }

  // ============================================================================
  // PARTICLES (Ink Splatters & Sparks)
  // ============================================================================
  spawnInkSplatter(x, y, color = '#10b981', count = 15, speed = 1.0) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = (Math.random() * 3 + 1) * speed;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        r: Math.random() * 3 + 1,
        color: color,
        life: 1.0,
        decay: Math.random() * 0.03 + 0.02
      });
    }
  }

  renderParticles(dt) {
    const ctx = this.ctx;
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.restore();
    }
  }

  // Geometry helper: Distance from point to line segment
  distToSegment(p, v, w) {
    const l2 = (w.x - v.x) ** 2 + (w.y - v.y) ** 2;
    if (l2 === 0) return { dist: Math.hypot(p.x - v.x, p.y - v.y) };
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    const projX = v.x + t * (w.x - v.x);
    const projY = v.y + t * (w.y - v.y);
    return { dist: Math.hypot(p.x - projX, p.y - projY), x: projX, y: projY };
  }
}

window.canvasEngine = null;
