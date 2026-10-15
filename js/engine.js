// Visual Novel Core Engine (Ren'Py Interpreter & Mathematical Scene Orchestrator)

class VNEngine {
  constructor(script) {
    this.currentPatientId = "rob";
    this.script = script || window.getPatientScript("rob");
    this.currentIndex = 0;
    this.isTyping = false;
    this.typewriterTimer = null;
    this.currentText = "";
    this.charIndex = 0;
    this.typeSpeed = 22; // ms per char

    this.isAutoPlay = false;
    this.autoPlayTimer = null;
    this.isSkipping = false;
    this.historyLog = [];

    // DOM Elements
    this.dom = {
      viewport: document.getElementById('vn-viewport'),
      bgLayer: document.getElementById('scene-bg-layer'),
      flashOverlay: document.getElementById('flash-overlay'),
      speakerName: document.getElementById('dialogue-speaker-name'),
      speakerTag: document.getElementById('dialogue-speaker-tag'),
      dialogueText: document.getElementById('dialogue-content'),
      dialogueBox: document.getElementById('dialogue-box'),
      chapterBadge: document.getElementById('chapter-badge'),
      historyModal: document.getElementById('history-modal'),
      historyList: document.getElementById('history-list'),
      levelSelectModal: document.getElementById('level-select-modal'),
      autoBtn: document.getElementById('btn-auto'),
      skipBtn: document.getElementById('btn-skip'),
      saveBtn: document.getElementById('btn-save'),
      loadBtn: document.getElementById('btn-load')
    };
  }

  setPatient(patientId) {
    this.currentPatientId = patientId;
    window.ACTIVE_PATIENT_ID = patientId;
    this.script = window.getPatientScript(patientId);
    this.currentIndex = 0;

    const patientData = window.PATIENTS_DATA[patientId];
    const nameEl = document.getElementById('patient-name-display');
    const tierEl = document.getElementById('patient-tier-display');
    if (nameEl) nameEl.textContent = `PATIENT: ${patientData.name.toUpperCase()}`;
    if (tierEl) tierEl.textContent = `${patientData.classTier.toUpperCase()} • ${patientData.profession.toUpperCase()}`;

    this.loadSceneByIndex(0);
  }

  init() {
    this.setupEventListeners();
    this.loadSceneByIndex(0);
  }

  setupEventListeners() {
    if (this.dom.dialogueBox) {
      this.dom.dialogueBox.addEventListener('click', (e) => {
        if (e.target.closest('.quick-action-btn')) return;
        this.handleUserAdvance();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this.handleUserAdvance();
      } else if (e.key === 'a' || e.key === 'A') {
        this.toggleAutoPlay();
      } else if (e.key === 's' || e.key === 'S') {
        this.toggleSkip();
      } else if (e.key === 'h' || e.key === 'H') {
        this.toggleHideUI();
      } else if (e.key === 'l' || e.key === 'L') {
        this.openHistoryModal();
      }
    });

    if (this.dom.autoBtn) {
      this.dom.autoBtn.addEventListener('click', () => this.toggleAutoPlay());
    }
    if (this.dom.skipBtn) {
      this.dom.skipBtn.addEventListener('click', () => this.toggleSkip());
    }
  }

  handleUserAdvance() {
    if (window.soundEngine) window.soundEngine.resume();

    // If an interactive math minigame is actively blocking, don't advance
    const minigameActive = document.querySelector('#minigame-overlay.active');
    if (minigameActive) return;

    if (this.isTyping) {
      this.completeTyping();
    } else {
      this.next();
    }
  }

  loadSceneByIndex(index) {
    if (index < 0 || index >= this.script.length) return;
    this.currentIndex = index;
    const scene = this.script[index];
    this.renderScene(scene);
  }

  jumpTo(sceneId) {
    const idx = this.script.findIndex(s => s.id === sceneId);
    if (idx !== -1) {
      this.loadSceneByIndex(idx);
    } else {
      console.warn(`Scene ID '${sceneId}' not found in active script.`);
    }
  }

  renderScene(scene) {
    // 1. Background image & transitions
    if (scene.bg && this.dom.bgLayer) {
      const currentBg = this.dom.bgLayer.style.backgroundImage;
      const newBgUrl = `url("${scene.bg}")`;

      if (scene.transition === 'flash') {
        this.triggerFlash();
        this.dom.bgLayer.style.backgroundImage = newBgUrl;
      } else if (scene.transition === 'dissolve') {
        this.triggerDissolve(newBgUrl);
      } else if (currentBg !== newBgUrl) {
        this.dom.bgLayer.style.backgroundImage = newBgUrl;
      }
    }

    // 2. Camera Punch Screen Shake (hpunch / vpunch)
    if (scene.screenEffect) {
      this.triggerScreenEffect(scene.screenEffect);
    }

    // 3. Audio & Music
    if (scene.bgm && window.soundEngine) {
      window.soundEngine.playBgm(scene.bgm);
    }

    if (scene.actions && scene.actions.length > 0) {
      scene.actions.forEach(action => {
        if (action.type === 'sfx_buzz' && window.soundEngine) {
          window.soundEngine.playMosquitoBuzz(action.duration || 2.4);
        } else if (action.type === 'sfx_punch' && window.soundEngine) {
          window.soundEngine.playPunchSound(action.direction || 'hpunch');
        } else if (action.type === 'sfx_flash' && window.soundEngine) {
          window.soundEngine.playFlashSound();
        } else if (action.type === 'sfx_heart_loop' && window.soundEngine) {
          window.soundEngine.startHeartMonitor(action.bpm || 135);
        } else if (action.type === 'sfx_fanfare' && window.soundEngine) {
          window.soundEngine.playLevelClearFanfare();
        }
      });
    }

    // 4. Update Vitals Monitor
    if (scene.vitals && window.vitalsMonitor) {
      window.vitalsMonitor.setVitals(scene.vitals);
    }

    // 5. Update Chapter Badge
    if (this.dom.chapterBadge) {
      this.dom.chapterBadge.textContent = scene.chapterTitle || `STAGE ${scene.levelNumber}`;
    }

    // 6. Speaker Names & Typewriter
    if (this.dom.speakerName) {
      this.dom.speakerName.textContent = scene.speaker || "Narrator";
      if (this.dom.speakerTag) {
        this.dom.speakerTag.textContent = scene.speakerTitle || "";
        this.dom.speakerTag.style.display = scene.speakerTitle ? 'inline-block' : 'none';
      }
      this.applySpeakerStyle(scene.speaker);
    }

    // 7. Add to Dialogue History
    this.historyLog.push({
      speaker: scene.speaker || "Narrator",
      text: scene.text,
      chapter: scene.chapterTitle
    });

    // 8. Start Typewriter Text Animation
    this.startTypewriter(scene.text, () => {
      // If this scene has a geometric/mathematical minigame, launch it automatically!
      if (scene.minigame) {
        this.triggerMinigame(scene.minigame);
      } else if (this.isAutoPlay) {
        this.scheduleAutoNext();
      }
    });
  }

  applySpeakerStyle(speaker) {
    if (!this.dom.speakerName) return;
    this.dom.speakerName.className = 'speaker-name';
    if (speaker === 'Rob') {
      this.dom.speakerName.classList.add('speaker-rob');
    } else if (speaker === 'Elena Chen') {
      this.dom.speakerName.classList.add('speaker-elena');
    } else if (speaker === 'Julian Vance') {
      this.dom.speakerName.classList.add('speaker-julian');
    } else if (speaker === 'Dr. Lin') {
      this.dom.speakerName.classList.add('speaker-doctor');
    } else if (speaker && speaker.includes('HUD')) {
      this.dom.speakerName.classList.add('speaker-hud');
    } else {
      this.dom.speakerName.classList.add('speaker-narrator');
    }
  }

  startTypewriter(text, onComplete) {
    clearInterval(this.typewriterTimer);
    this.isTyping = true;
    this.currentText = text;
    this.charIndex = 0;
    this.dom.dialogueText.textContent = "";

    const speed = this.isSkipping ? 4 : this.typeSpeed;

    this.typewriterTimer = setInterval(() => {
      if (this.charIndex < this.currentText.length) {
        this.dom.dialogueText.textContent += this.currentText[this.charIndex];
        this.charIndex++;
        if (this.charIndex % 3 === 0 && window.soundEngine) {
          window.soundEngine.playTypewriterBlip();
        }
      } else {
        clearInterval(this.typewriterTimer);
        this.isTyping = false;
        if (onComplete) onComplete();
      }
    }, speed);
  }

  completeTyping() {
    clearInterval(this.typewriterTimer);
    this.isTyping = false;
    this.dom.dialogueText.textContent = this.currentText;

    const currentScene = this.script[this.currentIndex];
    if (currentScene && currentScene.minigame) {
      this.triggerMinigame(currentScene.minigame);
    } else if (this.isAutoPlay) {
      this.scheduleAutoNext();
    }
  }

  triggerMinigame(config) {
    if (!window.minigameController) return;

    const onComplete = (success) => {
      const currentScene = this.script[this.currentIndex];
      if (currentScene && currentScene.nextJump) {
        this.jumpTo(currentScene.nextJump);
      } else {
        this.next();
      }
    };

    if (config.type === 'vector_game') {
      window.minigameController.startVectorGame(config, onComplete);
    } else if (config.type === 'polygon_game') {
      window.minigameController.startPolygonGame(config, onComplete);
    } else if (config.type === 'transform_game') {
      window.minigameController.startTransformGame(config, onComplete);
    } else if (config.type === 'wave_game') {
      window.minigameController.startWaveGame(config, onComplete);
    }
  }

  next() {
    const currentScene = this.script[this.currentIndex];
    if (currentScene && currentScene.nextJump) {
      this.jumpTo(currentScene.nextJump);
      return;
    }

    if (this.currentIndex + 1 < this.script.length) {
      this.loadSceneByIndex(this.currentIndex + 1);
    } else {
      console.log("End of patient script reached.");
    }
  }

  triggerScreenEffect(effect) {
    if (!this.dom.viewport) return;
    this.dom.viewport.classList.remove('hpunch', 'vpunch');
    void this.dom.viewport.offsetWidth;
    this.dom.viewport.classList.add(effect);
    setTimeout(() => {
      this.dom.viewport.classList.remove(effect);
    }, 600);
  }

  triggerFlash() {
    if (!this.dom.flashOverlay) return;
    this.dom.flashOverlay.classList.remove('active');
    void this.dom.flashOverlay.offsetWidth;
    this.dom.flashOverlay.classList.add('active');
    setTimeout(() => {
      this.dom.flashOverlay.classList.remove('active');
    }, 500);
  }

  triggerDissolve(newBgUrl) {
    if (!this.dom.bgLayer) return;
    this.dom.bgLayer.classList.add('dissolving');
    setTimeout(() => {
      this.dom.bgLayer.style.backgroundImage = newBgUrl;
      this.dom.bgLayer.classList.remove('dissolving');
    }, 450);
  }

  toggleAutoPlay() {
    this.isAutoPlay = !this.isAutoPlay;
    if (this.dom.autoBtn) {
      this.dom.autoBtn.classList.toggle('active', this.isAutoPlay);
    }
    if (this.isAutoPlay && !this.isTyping) {
      this.scheduleAutoNext();
    } else if (!this.isAutoPlay && this.autoPlayTimer) {
      clearTimeout(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  scheduleAutoNext() {
    if (this.autoPlayTimer) clearTimeout(this.autoPlayTimer);
    this.autoPlayTimer = setTimeout(() => {
      if (this.isAutoPlay) {
        this.next();
      }
    }, 2800);
  }

  toggleSkip() {
    this.isSkipping = !this.isSkipping;
    if (this.dom.skipBtn) {
      this.dom.skipBtn.classList.toggle('active', this.isSkipping);
    }
    if (this.isSkipping) {
      this.handleUserAdvance();
    }
  }

  toggleHideUI() {
    const isHidden = this.dom.dialogueBox.classList.toggle('ui-hidden');
    const hud = document.getElementById('vitals-hud');
    if (hud) hud.classList.toggle('ui-hidden', isHidden);
  }

  openHistoryModal() {
    if (!this.dom.historyModal || !this.dom.historyList) return;
    this.dom.historyList.innerHTML = this.historyLog.map(item => `
      <div class="history-item">
        <div class="history-speaker">${item.speaker} <span class="history-chapter">[${item.chapter || ''}]</span></div>
        <div class="history-text">${item.text}</div>
      </div>
    `).join('');
    this.dom.historyModal.classList.remove('hidden');
  }

  closeHistoryModal() {
    if (this.dom.historyModal) {
      this.dom.historyModal.classList.add('hidden');
    }
  }

  saveGame() {
    const saveData = {
      patientId: this.currentPatientId,
      currentIndex: this.currentIndex,
      timestamp: new Date().toLocaleString(),
      vitals: window.vitalsMonitor ? {
        bpm: window.vitalsMonitor.bpm,
        temp: window.vitalsMonitor.temp,
        platelets: window.vitalsMonitor.platelets,
        stability: window.vitalsMonitor.stability
      } : null
    };
    localStorage.setItem('respawn_save_data', JSON.stringify(saveData));
    if (window.soundEngine) window.soundEngine.playActionSuccess();
    alert("Mathematical recovery state saved!");
  }

  loadGame() {
    const raw = localStorage.getItem('respawn_save_data');
    if (!raw) {
      alert("No saved recovery state found.");
      return;
    }
    try {
      const data = JSON.parse(raw);
      if (data.patientId && data.patientId !== this.currentPatientId) {
        this.setPatient(data.patientId);
      }
      this.loadSceneByIndex(data.currentIndex);
      if (window.soundEngine) window.soundEngine.playActionSuccess();
      alert(`Restored ${data.patientId.toUpperCase()} recovery state from ${data.timestamp}!`);
    } catch (e) {
      alert("Error loading state.");
    }
  }
}

window.vnEngine = null;
