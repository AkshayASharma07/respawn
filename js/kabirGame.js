// ==============================================================================
// BIO-CLEANSE: MICRO-VESSEL LASER PURGE GAME ENGINE (KABIR ANSARI DOSSIER)
// Integrated 3-stage socioeconomic healthcare laser surgery protocol:
// - Stage 1: Wealthy Patient Protocol (Micro-Vessel Laser Purge / Easy Mode)
// - Stage 2: Middle-Class Protocol (Resource Strain & Armored Strains / Moderate)
// - Stage 3: Lower-Class Protocol (Survival Mode & Apex Boss Mutation)
// ==============================================================================

class KabirBioCleanseGame {
  constructor() {
    this.container = document.getElementById('kabir-biocleanse-stage');
    this.canvas = document.getElementById('kb-game-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    // UI Elements
    this.overlay = document.getElementById('kb-overlay');
    this.overlayTitle = document.getElementById('kb-overlay-title');
    this.overlaySubtitle = document.getElementById('kb-overlay-subtitle');
    this.overlayDesc = document.getElementById('kb-overlay-desc');
    this.startBtn = document.getElementById('kb-start-btn');
    this.secondaryBtn = document.getElementById('kb-secondary-btn');

    this.uiHealthText = document.getElementById('kb-health-text');
    this.uiHealthBar = document.getElementById('kb-health-bar');
    this.uiHealthLabel = document.getElementById('kb-health-label');
    this.uiEnergyText = document.getElementById('kb-energy-text');
    this.uiEnergyBar = document.getElementById('kb-energy-bar');
    this.uiEnergyLabel = document.getElementById('kb-energy-label');
    this.uiScore = document.getElementById('kb-score');
    this.uiScoreTitle = document.getElementById('kb-score-title');
    this.uiScoreSub = document.getElementById('kb-score-sub');
    this.uiStagePill = document.getElementById('kb-stage-pill');

    this.btnPrevStage = document.getElementById('kb-btn-prev-stage');
    this.btnNextStage = document.getElementById('kb-btn-next-stage');
    this.btnOpenStages = document.getElementById('kb-btn-open-stages');

    // State Variables
    this.currentStage = 0; // 0 = Stage 1, 1 = Stage 2, 2 = Stage 3
    this.isPlaying = false;
    this.health = 100;
    this.energy = 100;
    this.purged = 0;
    this.targetPurged = 10;
    this.isFiring = false;
    this.overheated = false;
    this.animId = null;

    this.bossSpawned = false;
    this.bossDefeated = false;

    this.pathogens = [];
    this.particles = [];
    this.frames = 0;

    // Bounded Aim Coordinates
    this.aimX = 0;
    this.aimY = 0;
    this.maxLaserRange = 0;

    this.mouse = { x: 480, y: 270, down: false };

    this.initEvents();
  }

  initEvents() {
    window.addEventListener('resize', () => {
      if (this.container && !this.container.classList.contains('hidden')) {
        this.resize();
      }
    });

    if (this.canvas) {
      const updateMouse = (clientX, clientY) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = (clientX - rect.left) * (this.canvas.width / (rect.width || 1));
        this.mouse.y = (clientY - rect.top) * (this.canvas.height / (rect.height || 1));

        if (window.telemetryEngine) {
          window.telemetryEngine.recordMouseMove();
        }
      };

      this.canvas.addEventListener('mousemove', (e) => {
        updateMouse(e.clientX, e.clientY);
      });

      this.canvas.addEventListener('mousedown', (e) => {
        this.mouse.down = true;
        updateMouse(e.clientX, e.clientY);
        if (window.soundEngine) window.soundEngine.resume();
        if (window.telemetryEngine) window.telemetryEngine.recordClick();
      });

      window.addEventListener('mouseup', () => {
        this.mouse.down = false;
      });

      this.canvas.addEventListener('touchstart', (e) => {
        this.mouse.down = true;
        if (e.touches[0]) updateMouse(e.touches[0].clientX, e.touches[0].clientY);
        if (window.soundEngine) window.soundEngine.resume();
        if (window.telemetryEngine) window.telemetryEngine.recordClick();
      }, { passive: true });

      this.canvas.addEventListener('touchmove', (e) => {
        if (e.touches[0]) updateMouse(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: true });

      this.canvas.addEventListener('touchend', () => {
        this.mouse.down = false;
      });
    }

    if (this.startBtn) {
      this.startBtn.addEventListener('click', () => {
        this.handleStartBtnClick();
      });
    }

    if (this.secondaryBtn) {
      this.secondaryBtn.addEventListener('click', () => {
        this.handleSecondaryBtnClick();
      });
    }

    if (this.btnPrevStage) {
      this.btnPrevStage.addEventListener('click', () => {
        if (this.currentStage > 0) {
          this.loadStage(this.currentStage - 1, true);
        }
      });
    }

    if (this.btnNextStage) {
      this.btnNextStage.addEventListener('click', () => {
        if (this.currentStage < 2) {
          this.loadStage(this.currentStage + 1, true);
        }
      });
    }

    if (this.btnOpenStages) {
      this.btnOpenStages.addEventListener('click', () => {
        const btnLevels = document.getElementById('btn-header-levels');
        if (btnLevels) btnLevels.click();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (!this.container || this.container.classList.contains('hidden')) return;

      if (e.key === 'r' || e.key === 'R') {
        this.loadStage(this.currentStage, false);
      }
    });
  }

  resize() {
    if (!this.canvas || !this.container) return;
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width > 100 ? rect.width : window.innerWidth;
    this.canvas.height = rect.height > 100 ? rect.height : (window.innerHeight - 100);
  }

  // Stage Setup & Level Loading
  loadStage(stageIndex = 0, showIntro = true) {
    this.currentStage = Math.max(0, Math.min(2, stageIndex));
    this.resize();

    // Reset container stage classes
    if (this.container) {
      this.container.classList.remove('hidden', 'stage-1', 'stage-2', 'stage-3');
      this.container.classList.add(`stage-${this.currentStage + 1}`);
      this.container.style.display = 'block';
    }

    // Update header & storage
    if (window.storageEngine) {
      window.storageEngine.setCurrentPatient('kabir');
      window.storageEngine.setCurrentLevelIndex(this.currentStage);
    }
    if (window.canvasEngine) {
      window.canvasEngine.currentPatientId = 'kabir';
      window.canvasEngine.currentLevelIndex = this.currentStage;
      window.canvasEngine.updateDomHeaders();
    }
    if (window.telemetryEngine) {
      window.telemetryEngine.setPatientAndLevel('kabir', this.currentStage);
    }

    // Configure stage parameters
    if (this.currentStage === 0) {
      // ───── STAGE 1: WEALTHY PATIENT (EASY MODE) ─────
      this.targetPurged = 10;
      if (this.uiHealthLabel) this.uiHealthLabel.textContent = "TISSUE STABILITY";
      if (this.uiEnergyLabel) this.uiEnergyLabel.textContent = "LASER INTENSITY";
      if (this.uiScoreTitle) this.uiScoreTitle.textContent = "LEVEL 1: WEALTHY PATIENT";
      if (this.uiScoreSub) this.uiScoreSub.textContent = "PATHOGENS PURGED";
      if (this.uiStagePill) {
        this.uiStagePill.textContent = "STAGE 1 / 3 (WEALTHY)";
        this.uiStagePill.style.color = "#38bdf8";
      }

      this.overlayTitle.innerText = "MICRO-VESSEL LASER PURGE";
      this.overlayTitle.style.color = "#38bdf8";
      this.overlayTitle.style.textShadow = "0 0 20px rgba(52, 189, 248, 0.6)";
      this.overlaySubtitle.innerText = "Protocol: Wealthy & Fully Insured (Easy Mode)";
      this.overlaySubtitle.style.color = "#34d399";
      this.overlayDesc.innerHTML = "Use your <b>MOUSE</b> to aim the robotic laser scalpel. <b>CLICK & HOLD</b> on drifting mutant pathogens to dissolve them before they breach the vessel wall. <br><br><i>Note: The laser has a limited effective range. Let targets approach the scanning arc before firing!</i>";
      this.startBtn.innerText = "Initialize Procedure";
      this.secondaryBtn.classList.add('hidden');

    } else if (this.currentStage === 1) {
      // ───── STAGE 2: MIDDLE-CLASS PROTOCOL (MODERATE) ─────
      this.targetPurged = 15;
      if (this.uiHealthLabel) this.uiHealthLabel.textContent = "TISSUE STABILITY";
      if (this.uiEnergyLabel) this.uiEnergyLabel.textContent = "LASER RESERVES";
      if (this.uiScoreTitle) this.uiScoreTitle.textContent = "LEVEL 2: MIDDLE-CLASS";
      if (this.uiScoreSub) this.uiScoreSub.textContent = "PATHOGENS PURGED";
      if (this.uiStagePill) {
        this.uiStagePill.textContent = "STAGE 2 / 3 (MIDDLE-CLASS)";
        this.uiStagePill.style.color = "#facc15";
      }

      this.overlayTitle.innerText = "LEVEL 2: RESOURCE STRAIN";
      this.overlayTitle.style.color = "#facc15";
      this.overlayTitle.style.textShadow = "0 0 20px rgba(250, 204, 21, 0.5)";
      this.overlaySubtitle.innerText = "Protocol: Middle-Class & Partially Insured (Moderate)";
      this.overlaySubtitle.style.color = "#fbbf24";
      this.overlayDesc.innerHTML = "Your medical insurance is limited. <b>Laser energy drains faster and recharges slower.</b> <br><br><span class=\"warning-text\">NEW THREAT: ARMORED STRAIN (Purple).</span> These mutated pathogens require heavy, sustained laser fire to penetrate their shields, draining your limited resources rapidly. Aim carefully.";
      this.startBtn.innerText = "Initiate Treatment";
      this.secondaryBtn.classList.add('hidden');

    } else if (this.currentStage === 2) {
      // ───── STAGE 3: LOWER-CLASS PROTOCOL (SURVIVAL) ─────
      this.targetPurged = 20;
      if (this.uiHealthLabel) this.uiHealthLabel.textContent = "SYSTEM INTEGRITY";
      if (this.uiEnergyLabel) this.uiEnergyLabel.textContent = "CRITICAL RESERVES";
      if (this.uiScoreTitle) this.uiScoreTitle.textContent = "LEVEL 3: SURVIVAL";
      if (this.uiScoreSub) this.uiScoreSub.textContent = "WAVE PROGRESS";
      if (this.uiStagePill) {
        this.uiStagePill.textContent = "STAGE 3 / 3 (SURVIVAL)";
        this.uiStagePill.style.color = "#ef4444";
      }

      this.overlayTitle.innerText = "LEVEL 3: SYSTEM COLLAPSE";
      this.overlayTitle.style.color = "#ef4444";
      this.overlayTitle.style.textShadow = "0 0 25px rgba(239, 68, 68, 0.7)";
      this.overlaySubtitle.innerText = "Protocol: Lower-Class / Uninsured (Survival)";
      this.overlaySubtitle.style.color = "#fca5a5";
      this.overlayDesc.innerHTML = "Zero medical safety net. <span class=\"warning-text\">Laser energy is extremely scarce. It drains violently and barely recharges.</span> Missing a shot is a catastrophic financial penalty.<br><br>Survive the swarm and eliminate the <b>APEX BOSS MUTATION</b> that appears at the end of the wave to prevent total system failure.";
      this.startBtn.innerText = "Initiate Final Triage";
      this.secondaryBtn.classList.add('hidden');
    }

    // Reset runtime parameters
    this.health = 100;
    this.energy = 100;
    this.purged = 0;
    this.bossSpawned = false;
    this.bossDefeated = false;
    this.pathogens = [];
    this.particles = [];
    this.isFiring = false;
    this.overheated = false;
    this.frames = 0;

    this.updateHUD();

    // Always present briefing overlay so player can read rules before enemies advance
    this.isPlaying = false;
    this.overlay.style.display = 'flex';

    this.ensureLoopRunning();
  }

  handleStartBtnClick() {
    const action = this.startBtn.getAttribute('data-action');

    if (action === 'proceed_stage_2') {
      this.startBtn.removeAttribute('data-action');
      this.loadStage(1, true);
      return;
    }

    if (action === 'proceed_stage_3') {
      this.startBtn.removeAttribute('data-action');
      this.loadStage(2, true);
      return;
    }

    if (action === 'complete_epilogue') {
      this.overlay.style.display = 'none';
      this.stop();
      if (window.storyEngine) {
        window.storyEngine.playStory('kabir', true);
      }
      this.startBtn.removeAttribute('data-action');
      return;
    }

    // Default start or retry
    this.overlay.style.display = 'none';
    this.health = 100;
    this.energy = 100;
    this.purged = 0;
    this.bossSpawned = false;
    this.bossDefeated = false;
    this.pathogens = [];
    this.particles = [];
    this.isFiring = false;
    this.overheated = false;
    this.frames = 0;
    this.isPlaying = true;

    if (window.soundEngine) {
      window.soundEngine.resume();
      window.soundEngine.playStampThud();
    }
  }

  handleSecondaryBtnClick() {
    const action = this.secondaryBtn.getAttribute('data-action');

    if (action === 'replay_stage') {
      this.loadStage(this.currentStage, false);
    } else if (action === 'restart_all') {
      this.loadStage(0, false);
    } else if (action === 'open_dossiers') {
      const btnHeaderPatient = document.getElementById('btn-header-patient');
      if (btnHeaderPatient) btnHeaderPatient.click();
    }
  }

  spawnPathogen(forceType = null) {
    const cWidth = this.canvas.width;
    const cHeight = this.canvas.height;

    // Stage 3 Boss Spawning
    if (forceType === 'boss') {
      this.pathogens.push({
        type: 'boss',
        x: cWidth / 2,
        y: cHeight + 100,
        radius: 75,
        speed: 0.4,
        hp: 1200,
        maxHp: 1200,
        wobble: 0,
        wobbleSpeed: 0.02
      });
      return;
    }

    if (this.currentStage === 0) {
      // Stage 1: Only basic pathogens, max 4
      if (this.pathogens.length < 4) {
        this.pathogens.push({
          type: 'basic',
          x: Math.random() * (cWidth - 200) + 100,
          y: cHeight + 60,
          radius: 30,
          speed: 1.5 + Math.random() * 1.0,
          hp: 100,
          maxHp: 100,
          wobble: Math.random() * Math.PI,
          wobbleSpeed: 0.05
        });
      }
    } else if (this.currentStage === 1) {
      // Stage 2: 35% armored, max 6
      if (this.pathogens.length < 6) {
        const isArmored = Math.random() < 0.35;
        this.pathogens.push({
          type: isArmored ? 'armored' : 'basic',
          x: Math.random() * (cWidth - 200) + 100,
          y: cHeight + 60,
          radius: isArmored ? 38 : 30,
          speed: isArmored ? 2.2 + Math.random() : 1.8 + Math.random(),
          hp: isArmored ? 250 : 100,
          maxHp: isArmored ? 250 : 100,
          wobble: Math.random() * Math.PI,
          wobbleSpeed: isArmored ? 0.08 : 0.05
        });
      }
    } else if (this.currentStage === 2) {
      // Stage 3: 40% armored, max 8
      if (this.pathogens.length < 8) {
        const isArmored = Math.random() < 0.40;
        this.pathogens.push({
          type: isArmored ? 'armored' : 'basic',
          x: Math.random() * (cWidth - 200) + 100,
          y: cHeight + 60,
          radius: isArmored ? 38 : 30,
          speed: isArmored ? 2.5 + Math.random() : 2.0 + Math.random(),
          hp: isArmored ? 250 : 100,
          maxHp: isArmored ? 250 : 100,
          wobble: Math.random() * Math.PI,
          wobbleSpeed: isArmored ? 0.08 : 0.05
        });
      }
    }
  }

  spawnParticles(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * (this.currentStage === 2 ? 10 : 7),
        vy: (Math.random() - 0.5) * (this.currentStage === 2 ? 10 : 7),
        life: 1.0,
        color: color,
        size: Math.random() * 4 + 1
      });
    }
  }

  triggerGameOver(victory) {
    this.isPlaying = false;
    this.overlay.style.display = 'flex';

    if (victory) {
      // Audio feedback
      if (window.soundEngine) {
        window.soundEngine.playSynapseHit();
        window.soundEngine.playStampThud();
      }

      // Unlock progress in persistence
      if (window.storageEngine) {
        window.storageEngine.unlockLevel('kabir', this.currentStage + 1);
        if (this.currentStage >= 2) {
          window.storageEngine.setPatientStatus('kabir', 'Stabilized');
        }
      }
      if (typeof window.recordStageCompletion === 'function') {
        window.recordStageCompletion(this.currentStage + 4);
      }

      if (this.currentStage === 0) {
        this.overlayTitle.innerText = "PROCEDURE SUCCESSFUL";
        this.overlayTitle.style.color = "#34d399";
        this.overlayTitle.style.textShadow = "0 0 20px rgba(52, 211, 153, 0.6)";
        this.overlaySubtitle.innerText = "Wealthy patient treated perfectly.";
        this.overlayDesc.innerText = "With optimal resources and immediate care, the patient's biological grid remains pristine.";
        this.startBtn.innerText = "PROCEED TO STAGE 2 ⏩";
        this.startBtn.setAttribute('data-action', 'proceed_stage_2');

        this.secondaryBtn.innerText = "REPLAY PROTOCOL ↺";
        this.secondaryBtn.setAttribute('data-action', 'replay_stage');
        this.secondaryBtn.classList.remove('hidden');

      } else if (this.currentStage === 1) {
        this.overlayTitle.innerText = "PATHWAY STABILIZED";
        this.overlayTitle.style.color = "#34d399";
        this.overlayTitle.style.textShadow = "0 0 20px rgba(52, 211, 153, 0.6)";
        this.overlaySubtitle.innerText = "Middle-Class Protocol Navigated.";
        this.overlayDesc.innerText = "You successfully managed your limited financial and medical resources to clear the infection. Prepare for the Lower-Class protocol (Survival Mode).";
        this.startBtn.innerText = "PROCEED TO LEVEL 3 ⏩";
        this.startBtn.setAttribute('data-action', 'proceed_stage_3');

        this.secondaryBtn.innerText = "REPLAY LEVEL 2 ↺";
        this.secondaryBtn.setAttribute('data-action', 'replay_stage');
        this.secondaryBtn.classList.remove('hidden');

      } else if (this.currentStage === 2) {
        this.overlayTitle.innerText = "TRILOGY COMPLETE";
        this.overlayTitle.style.color = "#34d399";
        this.overlayTitle.style.textShadow = "0 0 20px rgba(52, 211, 153, 0.6)";
        this.overlaySubtitle.innerText = "Biological Grid Purged Against All Odds.";
        this.overlayDesc.innerText = "You survived the Lower-Class protocol, navigating extreme resource starvation to defeat the Apex Mutation. This concludes the socio-economic healthcare demonstration.";
        this.startBtn.innerText = "COMPLETE CASE & VIEW EPILOGUE 🏆";
        this.startBtn.setAttribute('data-action', 'complete_epilogue');

        this.secondaryBtn.innerText = "RESTART ENTIRE DEMO ↺";
        this.secondaryBtn.setAttribute('data-action', 'restart_all');
        this.secondaryBtn.classList.remove('hidden');
      }

    } else {
      // Defeat screen
      if (window.soundEngine) {
        window.soundEngine.playPencilScratch(0.2);
      }

      this.secondaryBtn.classList.add('hidden');
      this.startBtn.removeAttribute('data-action');

      if (this.currentStage === 0) {
        this.overlayTitle.innerText = "VESSEL BREACHED";
        this.overlayTitle.style.color = "#f87171";
        this.overlayTitle.style.textShadow = "0 0 20px rgba(248, 113, 113, 0.6)";
        this.overlaySubtitle.innerText = "Tissue Stability Compromised";
        this.overlayDesc.innerText = "The pathogens bypassed your laser and breached the tissue wall.";
        this.startBtn.innerText = "RETRY SURGERY";

      } else if (this.currentStage === 1) {
        this.overlayTitle.innerText = "FUNDS EXHAUSTED / BREACH";
        this.overlayTitle.style.color = "#f87171";
        this.overlayTitle.style.textShadow = "0 0 20px rgba(248, 113, 113, 0.6)";
        this.overlaySubtitle.innerText = "Tissue Stability Compromised";
        this.overlayDesc.innerText = "The out-of-pocket energy costs from the Armored Strains overwhelmed your resources.";
        this.startBtn.innerText = "RETRY TREATMENT";

      } else if (this.currentStage === 2) {
        this.overlayTitle.innerText = "SYSTEM FATALITY";
        this.overlayTitle.style.color = "#ef4444";
        this.overlayTitle.style.textShadow = "0 0 20px rgba(239, 68, 68, 0.8)";
        this.overlaySubtitle.innerText = "Total Infrastructure Collapse";
        this.overlayDesc.innerText = "Without a financial safety net, the medical intervention failed. The infection has overtaken the host.";
        this.startBtn.innerText = "ATTEMPT TRIAGE AGAIN";
      }
    }
  }

  update() {
    if (!this.isPlaying) return;
    this.frames++;

    const armX = this.canvas.width / 2;
    const armY = this.canvas.height;

    // Laser Range computation per stage
    if (this.currentStage === 2) {
      this.maxLaserRange = Math.min(this.canvas.height * 0.75, 600);
    } else {
      this.maxLaserRange = Math.min(this.canvas.height * 0.70, 550);
    }

    // Bounded Aiming
    const angle = Math.atan2(this.mouse.y - armY, this.mouse.x - armX);
    const distFromBase = Math.hypot(this.mouse.x - armX, this.mouse.y - armY);

    if (distFromBase > this.maxLaserRange) {
      this.aimX = armX + Math.cos(angle) * this.maxLaserRange;
      this.aimY = armY + Math.sin(angle) * this.maxLaserRange;
    } else {
      this.aimX = this.mouse.x;
      this.aimY = this.mouse.y;
    }

    // Energy Dynamics per Socioeconomic Stage
    let drainRate = 1.2;
    let rechargeRate = 0.8;
    let restartThreshold = 30;

    if (this.currentStage === 1) {
      // Middle Class: faster drain, slower recharge
      drainRate = 1.8;
      rechargeRate = 0.4;
      restartThreshold = 40;
    } else if (this.currentStage === 2) {
      // Lower Class: violent drain, tiny recharge
      drainRate = 2.5;
      rechargeRate = 0.25;
      restartThreshold = 50;
    }

    if (this.energy <= 0) this.overheated = true;
    if (this.energy >= restartThreshold) this.overheated = false;

    if (this.mouse.down && this.energy > 0 && !this.overheated) {
      this.energy -= drainRate;
      this.isFiring = true;
    } else {
      this.isFiring = false;
      if (this.energy < 100) this.energy += rechargeRate;
    }
    if (this.energy < 0) this.energy = 0;

    // Spawning Logic
    if (this.currentStage === 2) {
      if (!this.bossSpawned && this.purged >= this.targetPurged) {
        this.spawnPathogen('boss');
        this.bossSpawned = true;
        if (this.uiScoreTitle) {
          this.uiScoreTitle.innerText = "APEX MUTATION DETECTED";
          this.uiScoreTitle.style.color = "#ef4444";
        }
      } else if (!this.bossSpawned && this.frames % 30 === 0) {
        this.spawnPathogen();
      }
    } else if (this.currentStage === 1) {
      if (this.frames % 45 === 0) this.spawnPathogen();
    } else {
      if (this.frames % 60 === 0) this.spawnPathogen();
    }

    // Pathogens Loop & Bounded Hit Detection
    for (let i = this.pathogens.length - 1; i >= 0; i--) {
      const p = this.pathogens[i];
      p.y -= p.speed;
      p.wobble += p.wobbleSpeed || 0.05;

      if (p.type === 'boss') {
        p.x += Math.sin(p.wobble) * 3.0;
      } else if (p.type === 'armored') {
        p.x += Math.sin(p.wobble) * 2.5;
      } else {
        p.x += Math.sin(p.wobble) * 1.5;
      }

      const dist = Math.hypot(this.aimX - p.x, this.aimY - p.y);

      // Hit by laser
      if (this.isFiring && dist < p.radius + 20) {
        let damage = 3.5;
        let sparkColor = '#38bdf8';

        if (this.currentStage === 1) {
          damage = p.type === 'armored' ? 2.0 : 4.0;
          sparkColor = '#facc15';
        } else if (this.currentStage === 2) {
          damage = p.type === 'boss' ? 2.0 : (p.type === 'armored' ? 2.5 : 4.0);
          sparkColor = '#ef4444';
        }

        p.hp -= damage;
        this.spawnParticles(this.aimX, this.aimY, sparkColor, p.type === 'boss' ? 3 : 5);

        // Pathogen Death
        if (p.hp <= 0) {
          let deathColor = '#34d399';
          let particleCount = 10;

          if (p.type === 'boss') {
            deathColor = '#ffffff';
            particleCount = 24;
            this.bossDefeated = true;
          } else if (p.type === 'armored') {
            deathColor = this.currentStage === 2 ? '#ef4444' : '#a855f7';
            particleCount = 12;
          }

          this.spawnParticles(p.x, p.y, deathColor, particleCount);
          this.pathogens.splice(i, 1);

          if (p.type === 'boss') {
            this.triggerGameOver(true);
            return;
          } else {
            this.purged++;
            if (this.currentStage !== 2 && this.purged >= this.targetPurged) {
              this.triggerGameOver(true);
              return;
            }
          }
          continue;
        }
      }

      // Breach detection
      if (p.y < 50) {
        let penalty = 25;
        let breachColor = '#f87171';

        if (p.type === 'boss') {
          penalty = 100;
          breachColor = '#991b1b';
        } else if (p.type === 'armored') {
          penalty = this.currentStage === 2 ? 50 : 40;
          breachColor = '#f87171';
        }

        this.spawnParticles(p.x, p.y, breachColor, 15);
        this.health -= penalty;
        this.pathogens.splice(i, 1);

        if (this.health <= 0) {
          this.health = 0;
          this.triggerGameOver(false);
          return;
        }
      }
    }

    // Particles Loop
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.life -= 0.04;
      if (pt.life <= 0) this.particles.splice(i, 1);
    }

    this.updateHUD();
  }

  updateHUD() {
    if (this.uiHealthText) this.uiHealthText.innerText = Math.floor(this.health) + "%";
    if (this.uiHealthBar) this.uiHealthBar.style.width = Math.max(0, this.health) + "%";

    if (this.uiEnergyText) {
      if (this.overheated) {
        if (this.currentStage === 2) {
          this.uiEnergyText.innerText = "SYSTEM LOCKED";
        } else if (this.currentStage === 1) {
          this.uiEnergyText.innerText = "FUNDS DEPLETED";
        } else {
          this.uiEnergyText.innerText = "OVERHEATED";
        }
        this.uiEnergyText.style.color = "#f87171";
      } else {
        this.uiEnergyText.innerText = Math.floor(this.energy) + "%";
        if (this.currentStage === 1) {
          this.uiEnergyText.style.color = "#facc15";
        } else if (this.currentStage === 2) {
          this.uiEnergyText.style.color = "#ef4444";
        } else {
          this.uiEnergyText.style.color = "#34d399";
        }
      }
    }

    if (this.uiEnergyBar) {
      this.uiEnergyBar.style.width = Math.max(0, this.energy) + "%";
      if (this.overheated) {
        this.uiEnergyBar.className = this.currentStage === 2 ? "kb-bar-fill critical" : "kb-bar-fill red";
      } else {
        if (this.currentStage === 1) {
          this.uiEnergyBar.className = "kb-bar-fill amber";
        } else if (this.currentStage === 2) {
          this.uiEnergyBar.className = "kb-bar-fill critical";
        } else {
          this.uiEnergyBar.className = "kb-bar-fill green";
        }
      }
    }

    if (this.uiScore) {
      if (this.bossSpawned) {
        this.uiScore.innerText = "BOSS FIGHT";
      } else {
        this.uiScore.innerText = this.purged + " / " + this.targetPurged;
      }
    }
  }

  draw() {
    const ctx = this.ctx;
    const canvas = this.canvas;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const armX = canvas.width / 2;
    const armY = canvas.height;

    // Draw Vessel Grid Lines with Stage-specific tints
    if (this.currentStage === 2) {
      ctx.strokeStyle = "rgba(239, 68, 68, 0.07)";
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }
    } else if (this.currentStage === 1) {
      ctx.strokeStyle = "rgba(250, 204, 21, 0.05)";
      for (let x = 0; x < canvas.width; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 60) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }
    } else {
      ctx.strokeStyle = "rgba(56, 189, 248, 0.06)";
      for (let x = 0; x < canvas.width; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 60) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }
    }

    if (this.isPlaying) {
      // Draw Range Indicator Arc
      if (this.currentStage === 2) {
        ctx.strokeStyle = "rgba(239, 68, 68, 0.25)";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 15]);
      } else if (this.currentStage === 1) {
        ctx.strokeStyle = "rgba(250, 204, 21, 0.15)";
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 15]);
      } else {
        ctx.strokeStyle = "rgba(248, 113, 113, 0.15)";
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 15]);
      }

      ctx.beginPath();
      ctx.arc(armX, armY, this.maxLaserRange, Math.PI, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Pathogens
      for (const p of this.pathogens) {
        if (p.type === 'boss') {
          // APEX BOSS MUTATION (Stage 3)
          ctx.fillStyle = "#000000";
          ctx.strokeStyle = "#ef4444";
          ctx.lineWidth = 4;
          ctx.shadowBlur = 30;
          ctx.shadowColor = "#ef4444";

          // Jagged animated outer shell
          ctx.beginPath();
          for (let k = 0; k < 12; k++) {
            const r = p.radius + Math.sin(p.wobble * 5 + k) * 10;
            const a = (k / 12) * Math.PI * 2;
            ctx.lineTo(p.x + Math.cos(a) * r, p.y + Math.sin(a) * r);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Glowing Red Core
          ctx.fillStyle = "#ef4444";
          ctx.shadowBlur = 0;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.radius * 0.5, 0, Math.PI * 2); ctx.fill();

          // Boss Health Bar
          ctx.fillStyle = "rgba(0,0,0,0.8)";
          ctx.fillRect(p.x - 50, p.y - p.radius - 20, 100, 8);
          ctx.fillStyle = "#ef4444";
          ctx.fillRect(p.x - 50, p.y - p.radius - 20, (p.hp / p.maxHp) * 100, 8);

        } else if (p.type === 'armored') {
          // Armored Strain (Stage 2 & 3)
          if (this.currentStage === 2) {
            ctx.fillStyle = "#27272a";
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#991b1b";
            ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = "#7f1d1d";
            ctx.shadowBlur = 0;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.radius * 0.6, 0, Math.PI * 2); ctx.fill();

            ctx.strokeStyle = "#ef4444";
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.radius - 4, 0, Math.PI * 1.5); ctx.stroke();

            // Health Bar
            ctx.fillStyle = "rgba(0,0,0,0.6)";
            ctx.fillRect(p.x - 20, p.y - p.radius - 12, 40, 6);
            ctx.fillStyle = "#dc2626";
            ctx.fillRect(p.x - 20, p.y - p.radius - 12, (p.hp / p.maxHp) * 40, 6);

          } else {
            // Stage 2 Purple Armored Strain
            ctx.fillStyle = "#9333ea";
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#9333ea";
            ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = "#581c87";
            ctx.shadowBlur = 0;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.radius * 0.6, 0, Math.PI * 2); ctx.fill();

            ctx.strokeStyle = "#d8b4fe";
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.radius - 4, 0, Math.PI * 1.5); ctx.stroke();

            // Health Bar
            ctx.fillStyle = "rgba(0,0,0,0.6)";
            ctx.fillRect(p.x - 20, p.y - p.radius - 12, 40, 6);
            ctx.fillStyle = "#a855f7";
            ctx.fillRect(p.x - 20, p.y - p.radius - 12, (p.hp / p.maxHp) * 40, 6);
          }

        } else {
          // Basic Strain
          if (this.currentStage === 2) {
            ctx.fillStyle = "#991b1b";
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#991b1b";
            ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = "#450a0a";
            ctx.shadowBlur = 0;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.radius * 0.4, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = "rgba(0,0,0,0.6)";
            ctx.fillRect(p.x - 20, p.y - p.radius - 12, 40, 6);
            ctx.fillStyle = "#ef4444";
            ctx.fillRect(p.x - 20, p.y - p.radius - 12, (p.hp / p.maxHp) * 40, 6);

          } else if (this.currentStage === 1) {
            ctx.fillStyle = "#f87171";
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#f87171";
            ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = "#991b1b";
            ctx.shadowBlur = 0;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.radius * 0.4, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = "rgba(0,0,0,0.6)";
            ctx.fillRect(p.x - 20, p.y - p.radius - 12, 40, 6);
            ctx.fillStyle = "#facc15";
            ctx.fillRect(p.x - 20, p.y - p.radius - 12, (p.hp / p.maxHp) * 40, 6);

          } else {
            // Stage 1 Basic
            ctx.fillStyle = "#f87171";
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#f87171";
            ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = "#991b1b";
            ctx.shadowBlur = 0;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.radius * 0.4, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = "rgba(0,0,0,0.6)";
            ctx.fillRect(p.x - 20, p.y - p.radius - 12, 40, 6);
            ctx.fillStyle = "#38bdf8";
            ctx.fillRect(p.x - 20, p.y - p.radius - 12, (p.hp / p.maxHp) * 40, 6);
          }
        }
      }

      const angle = Math.atan2(this.aimY - armY, this.aimX - armX);

      // Draw Laser Beam
      if (this.isFiring) {
        const tipX = armX + Math.cos(angle) * 40;
        const tipY = armY + Math.sin(angle) * 40;

        if (this.currentStage === 2) {
          // Stage 3 Dual Beam: Outer Red Glow + Inner White Core
          ctx.strokeStyle = "rgba(239, 68, 68, 0.6)";
          ctx.lineWidth = 8;
          ctx.beginPath(); ctx.moveTo(tipX, tipY); ctx.lineTo(this.aimX, this.aimY); ctx.stroke();

          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 3;
          ctx.shadowBlur = 20;
          ctx.shadowColor = "#ef4444";
          ctx.beginPath(); ctx.moveTo(tipX, tipY); ctx.lineTo(this.aimX, this.aimY); ctx.stroke();
          ctx.shadowBlur = 0;

        } else if (this.currentStage === 1) {
          // Stage 2 Amber Beam
          ctx.strokeStyle = "#facc15";
          ctx.lineWidth = 4;
          ctx.shadowBlur = 20;
          ctx.shadowColor = "#facc15";
          ctx.beginPath(); ctx.moveTo(tipX, tipY); ctx.lineTo(this.aimX, this.aimY); ctx.stroke();
          ctx.shadowBlur = 0;

        } else {
          // Stage 1 Cyan Beam
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 4;
          ctx.shadowBlur = 20;
          ctx.shadowColor = "#38bdf8";
          ctx.beginPath(); ctx.moveTo(tipX, tipY); ctx.lineTo(this.aimX, this.aimY); ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }

      // Draw Particles
      for (const pt of this.particles) {
        ctx.globalAlpha = pt.life;
        ctx.fillStyle = pt.color;
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size || 3, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // Draw Robotic Arm
      ctx.save();
      ctx.translate(armX, armY);
      ctx.rotate(angle);

      if (this.currentStage === 2) {
        // Corroded Industrial Arm
        ctx.fillStyle = "#09090b";
        ctx.strokeStyle = "#7f1d1d";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.rect(-15, -12, 40, 24); ctx.fill(); ctx.stroke();

        ctx.fillStyle = "#18181b";
        ctx.beginPath(); ctx.rect(25, -6, 15, 12); ctx.fill(); ctx.stroke();

        ctx.fillStyle = this.overheated ? "#991b1b" : "#ef4444";
        ctx.beginPath(); ctx.arc(10, 0, 4, 0, Math.PI * 2); ctx.fill();

      } else if (this.currentStage === 1) {
        // Middle Class Arm
        ctx.fillStyle = "#1c1917";
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.rect(-15, -12, 40, 24); ctx.fill(); ctx.stroke();

        ctx.fillStyle = "#292524";
        ctx.beginPath(); ctx.rect(25, -6, 15, 12); ctx.fill(); ctx.stroke();

        ctx.fillStyle = this.overheated ? "#f87171" : "#facc15";
        ctx.beginPath(); ctx.arc(10, 0, 4, 0, Math.PI * 2); ctx.fill();

      } else {
        // Wealthy Robotic Arm
        ctx.fillStyle = "#0f172a";
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.rect(-15, -12, 40, 24); ctx.fill(); ctx.stroke();

        ctx.fillStyle = "#1e293b";
        ctx.beginPath(); ctx.rect(25, -6, 15, 12); ctx.fill(); ctx.stroke();

        ctx.fillStyle = this.overheated ? "#f87171" : "#34d399";
        ctx.beginPath(); ctx.arc(10, 0, 4, 0, Math.PI * 2); ctx.fill();
      }

      ctx.restore();
    }

    // Draw Crosshair mapped to bounded coordinates (aimX, aimY)
    if (this.currentStage === 2) {
      ctx.strokeStyle = (this.mouse.down && !this.overheated && this.isPlaying) ? "#ffffff" : "rgba(239, 68, 68, 0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.aimX, this.aimY, 14, 0, Math.PI * 2);
      ctx.moveTo(this.aimX - 25, this.aimY); ctx.lineTo(this.aimX - 8, this.aimY);
      ctx.moveTo(this.aimX + 25, this.aimY); ctx.lineTo(this.aimX + 8, this.aimY);
      ctx.moveTo(this.aimX, this.aimY - 25); ctx.lineTo(this.aimX, this.aimY - 8);
      ctx.moveTo(this.aimX, this.aimY + 25); ctx.lineTo(this.aimX, this.aimY + 8);
      ctx.stroke();

      ctx.fillStyle = ctx.strokeStyle;
      ctx.beginPath(); ctx.arc(this.aimX, this.aimY, 2, 0, Math.PI * 2); ctx.fill();

    } else if (this.currentStage === 1) {
      ctx.strokeStyle = (this.mouse.down && !this.overheated && this.isPlaying) ? "#facc15" : "rgba(250, 204, 21, 0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.aimX, this.aimY, 12, 0, Math.PI * 2);
      ctx.moveTo(this.aimX - 20, this.aimY); ctx.lineTo(this.aimX - 5, this.aimY);
      ctx.moveTo(this.aimX + 20, this.aimY); ctx.lineTo(this.aimX + 5, this.aimY);
      ctx.moveTo(this.aimX, this.aimY - 20); ctx.lineTo(this.aimX, this.aimY - 5);
      ctx.moveTo(this.aimX, this.aimY + 20); ctx.lineTo(this.aimX, this.aimY + 5);
      ctx.stroke();

    } else {
      ctx.strokeStyle = (this.mouse.down && !this.overheated && this.isPlaying) ? "#38bdf8" : "rgba(52, 211, 153, 0.8)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.aimX, this.aimY, 12, 0, Math.PI * 2);
      ctx.moveTo(this.aimX - 20, this.aimY); ctx.lineTo(this.aimX - 5, this.aimY);
      ctx.moveTo(this.aimX + 20, this.aimY); ctx.lineTo(this.aimX + 5, this.aimY);
      ctx.moveTo(this.aimX, this.aimY - 20); ctx.lineTo(this.aimX, this.aimY - 5);
      ctx.moveTo(this.aimX, this.aimY + 20); ctx.lineTo(this.aimX, this.aimY + 5);
      ctx.stroke();
    }
  }

  ensureLoopRunning() {
    if (!this.animId) {
      const loop = () => {
        this.update();
        this.draw();
        this.animId = requestAnimationFrame(loop);
      };
      this.animId = requestAnimationFrame(loop);
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    if (this.container) {
      this.container.classList.add('hidden');
      this.container.style.display = 'none';
    }
    if (this.overlay) {
      this.overlay.style.display = 'none';
    }
  }
}

// Global Instance
window.KabirBioCleanseGame = KabirBioCleanseGame;
