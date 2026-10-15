// ==============================================================================
// NANO-PULSE APPLICATION ORCHESTRATOR
// Wires single-canvas engine, patient dossiers, level select, telemetry, and persistence.
// ==============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Single-Canvas Engine
  window.canvasEngine = new UnifiedCanvasEngine('nano-canvas');

  // Load saved session or start default (Siddharth Level 0)
  const savedPatient = window.storageEngine ? window.storageEngine.state.currentPatient : 'siddharth';
  const savedLevel = window.storageEngine ? window.storageEngine.state.currentLevelIndex : 0;
  window.canvasEngine.loadPatientLevel(savedPatient, savedLevel, true);

  // 2. DOM Elements
  const titleScreen = document.getElementById('title-screen');
  const btnStartGame = document.getElementById('btn-start-game');
  const btnContinueSession = document.getElementById('btn-continue-session');
  const btnSelectPatient = document.getElementById('btn-select-patient');
  const btnLevelSelect = document.getElementById('btn-level-select');
  const btnResetProgress = document.getElementById('btn-reset-progress');
  const btnHowToPlay = document.getElementById('btn-how-to');

  // Modals
  const patientSelectModal = document.getElementById('patient-select-modal');
  const levelSelectModal = document.getElementById('level-select-modal');
  const howToModal = document.getElementById('how-to-modal');
  const journalNotesModal = document.getElementById('journal-notes-modal');

  // Header Buttons
  const btnHeaderPatient = document.getElementById('btn-header-patient');
  const btnHeaderStory = document.getElementById('btn-header-story');
  const btnHeaderLevels = document.getElementById('btn-header-levels');
  const btnHeaderDifficulty = document.getElementById('btn-header-difficulty');
  const diffBtnLabel = document.getElementById('diff-btn-label');
  const btnHeaderJournal = document.getElementById('btn-header-journal');
  const btnQuickMute = document.getElementById('btn-quick-mute');

  // Difficulty Cycling & UI Sync
  const DIFF_CYCLE = ['resident', 'specialist', 'chief'];
  const DIFF_LABELS = { resident: 'RESIDENT', specialist: 'SPECIALIST', chief: 'CHIEF SURGEON' };

  function updateDifficultyUI(diff) {
    if (diffBtnLabel) diffBtnLabel.textContent = DIFF_LABELS[diff] || 'RESIDENT';
    const badge = document.getElementById('difficulty-badge');
    if (badge && window.DIFF_MODS && window.DIFF_MODS[diff]) {
      const dm = window.DIFF_MODS[diff];
      badge.textContent = dm.label;
      badge.style.color = dm.color;
      badge.style.borderColor = dm.color;
    }
  }

  const initialDiff = (window.storageEngine && window.storageEngine.getDifficulty()) || 'resident';
  updateDifficultyUI(initialDiff);

  if (btnHeaderDifficulty) {
    btnHeaderDifficulty.addEventListener('click', () => {
      const cur = (window.storageEngine && window.storageEngine.getDifficulty()) || 'resident';
      const nextIdx = (DIFF_CYCLE.indexOf(cur) + 1) % DIFF_CYCLE.length;
      const next = DIFF_CYCLE[nextIdx];
      if (window.canvasEngine) {
        window.canvasEngine.setDifficulty(next);
      } else if (window.storageEngine) {
        window.storageEngine.setDifficulty(next);
      }
      updateDifficultyUI(next);
      if (window.soundEngine) window.soundEngine.playStampThud();
    });
  }

  // Header Story Button (Play current patient visual novel prologue)
  if (btnHeaderStory) {
    btnHeaderStory.addEventListener('click', () => {
      if (window.soundEngine) {
        window.soundEngine.init();
        window.soundEngine.resume();
        window.soundEngine.playStampThud();
      }
      const curP = window.canvasEngine ? window.canvasEngine.currentPatientId : 'siddharth';
      if (window.storyEngine) {
        window.storyEngine.playStory(curP);
      }
    });
  }

  // Check if save exists to enable/disable Continue button
  if (btnContinueSession) {
    const hasSave = window.storageEngine && window.storageEngine.hasSavedSession();
    btnContinueSession.style.display = hasSave ? 'block' : 'none';
    btnContinueSession.addEventListener('click', () => {
      if (window.soundEngine) {
        window.soundEngine.init();
        window.soundEngine.resume();
        window.soundEngine.playStampThud();
      }
      titleScreen.classList.add('hidden');
      const curP = window.storageEngine.state.currentPatient;
      const curL = window.storageEngine.state.currentLevelIndex;
      window.canvasEngine.loadPatientLevel(curP, curL, true);
    });
  }

  // Start New / Default Game (Launches Siddharth's Visual Novel Prologue)
  if (btnStartGame) {
    btnStartGame.addEventListener('click', () => {
      if (window.soundEngine) {
        window.soundEngine.init();
        window.soundEngine.resume();
        window.soundEngine.playStampThud();
      }
      titleScreen.classList.add('hidden');
      if (window.storyEngine) {
        window.storyEngine.playStory('siddharth');
      } else {
        window.canvasEngine.loadPatientLevel('siddharth', 0, true);
      }
    });
  }

  // Patient Selection Cards (Launches Selected Patient's Visual Novel Prologue)
  document.querySelectorAll('.patient-choice-card').forEach(card => {
    card.addEventListener('click', () => {
      const pId = card.getAttribute('data-patient-id');
      if (window.soundEngine) {
        window.soundEngine.init();
        window.soundEngine.resume();
        window.soundEngine.playStampThud();
      }
      if (patientSelectModal) patientSelectModal.classList.add('hidden');
      titleScreen.classList.add('hidden');
      if (window.storyEngine) {
        window.storyEngine.playStory(pId);
      } else {
        window.canvasEngine.loadPatientLevel(pId, 0, true);
      }
    });
  });

  if (btnSelectPatient) {
    btnSelectPatient.addEventListener('click', () => {
      if (patientSelectModal) patientSelectModal.classList.remove('hidden');
    });
  }

  if (btnHeaderPatient) {
    btnHeaderPatient.addEventListener('click', () => {
      if (patientSelectModal) patientSelectModal.classList.remove('hidden');
    });
  }

  // Render Level Select Grid
  function renderLevelGrid(patientId) {
    const gridContainer = document.getElementById('level-select-grid');
    if (!gridContainer) return;

    const p = window.PATIENTS[patientId];
    const unlocked = window.storageEngine ? window.storageEngine.state.unlockedLevels[patientId] || [0] : [0];
    const curDiff = window.canvasEngine ? window.canvasEngine.difficulty : 'resident';

    gridContainer.innerHTML = `
      <div class="patient-grid-header">
        <div class="pgh-info">
          <h3>${p.name.toUpperCase()} • ${p.socioeconomic.toUpperCase()}</h3>
          <p>${p.diagnosisTitle} (${p.clinicalCode})</p>
        </div>
        <div class="patient-switch-pills">
          <button class="pill-btn ${patientId === 'siddharth' ? 'active' : ''}" data-p="siddharth">SIDDHARTH</button>
          <button class="pill-btn ${patientId === 'kabir' ? 'active' : ''}" data-p="kabir">KABIR</button>
          <button class="pill-btn ${patientId === 'radha' ? 'active' : ''}" data-p="radha">RADHA</button>
        </div>
      </div>
      <div style="margin: 0 0 16px 0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
        <div class="diff-switch-pills" style="display: flex; gap: 8px; align-items: center;">
          <span style="font-size:0.8rem; color:#8c8273; font-family:'Courier New', monospace;">DIFFICULTY:</span>
          <button class="pill-btn diff-modal-pill ${curDiff === 'resident' ? 'active' : ''}" data-diff="resident" style="border-color:#34d399;">RESIDENT</button>
          <button class="pill-btn diff-modal-pill ${curDiff === 'specialist' ? 'active' : ''}" data-diff="specialist" style="border-color:#f59e0b;">SPECIALIST</button>
          <button class="pill-btn diff-modal-pill ${curDiff === 'chief' ? 'active' : ''}" data-diff="chief" style="border-color:#ef4444;">CHIEF SURGEON</button>
        </div>
        <button id="btn-modal-play-story" class="pcc-select-btn" style="margin: 0; width: auto; padding: 8px 18px;">
          📖 PLAY ${p.name.toUpperCase()}'S VISUAL NOVEL STORY →
        </button>
      </div>
      <div class="levels-card-container">
        ${p.levels.map((lvl, idx) => {
          const isUnlocked = unlocked.includes(idx);
          return `
            <div class="level-card ${isUnlocked ? '' : 'locked'}" data-p="${patientId}" data-idx="${idx}">
              <div class="level-card-header">
                <span class="level-badge">${isUnlocked ? `STAGE ${idx + 1}` : 'LOCKED 🔒'}</span>
                <span class="level-name">${lvl.title}</span>
              </div>
              <p class="level-desc">${lvl.caseBrief.substring(0, 85)}...</p>
              <div class="level-math-badge">${lvl.geometryType}</div>
              <button class="level-jump-btn" ${isUnlocked ? '' : 'disabled'}>
                ${isUnlocked ? 'OPEN DOSSIER →' : 'STAGE LOCKED'}
              </button>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Difficulty pills in modal
    gridContainer.querySelectorAll('.diff-modal-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const d = btn.getAttribute('data-diff');
        if (window.canvasEngine) window.canvasEngine.setDifficulty(d);
        updateDifficultyUI(d);
        if (window.soundEngine) window.soundEngine.playStampThud();
        renderLevelGrid(patientId);
      });
    });

    // Story button in stages modal
    const btnModalStory = gridContainer.querySelector('#btn-modal-play-story');
    if (btnModalStory) {
      btnModalStory.addEventListener('click', () => {
        if (levelSelectModal) levelSelectModal.classList.add('hidden');
        titleScreen.classList.add('hidden');
        if (window.soundEngine) {
          window.soundEngine.init();
          window.soundEngine.resume();
          window.soundEngine.playStampThud();
        }
        if (window.storyEngine) {
          window.storyEngine.playStory(patientId);
        }
      });
    }

    // Patient pills in modal
    gridContainer.querySelectorAll('.patient-switch-pills .pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const newP = btn.getAttribute('data-p');
        renderLevelGrid(newP);
      });
    });

    // Level card clicks
    gridContainer.querySelectorAll('.level-card:not(.locked)').forEach(card => {
      card.addEventListener('click', () => {
        const pId = card.getAttribute('data-p');
        const idx = parseInt(card.getAttribute('data-idx'), 10);
        if (levelSelectModal) levelSelectModal.classList.add('hidden');
        titleScreen.classList.add('hidden');
        if (window.soundEngine) {
          window.soundEngine.init();
          window.soundEngine.resume();
          window.soundEngine.playStampThud();
        }
        window.canvasEngine.loadPatientLevel(pId, idx, true);
      });
    });
  }

  if (btnLevelSelect) {
    btnLevelSelect.addEventListener('click', () => {
      renderLevelGrid(window.canvasEngine.currentPatientId);
      if (levelSelectModal) levelSelectModal.classList.remove('hidden');
    });
  }

  if (btnHeaderLevels) {
    btnHeaderLevels.addEventListener('click', () => {
      renderLevelGrid(window.canvasEngine.currentPatientId);
      if (levelSelectModal) levelSelectModal.classList.remove('hidden');
    });
  }

  // Journal Notes Modal
  if (btnHeaderJournal) {
    btnHeaderJournal.addEventListener('click', () => {
      renderJournalDossier();
      if (journalNotesModal) journalNotesModal.classList.remove('hidden');
    });
  }

  // Report Card Header Button
  const btnHeaderReport = document.getElementById('btn-header-report');
  if (btnHeaderReport) {
    btnHeaderReport.addEventListener('click', () => {
      if (window.telemetryEngine) {
        window.telemetryEngine.triggerReportCard();
      }
    });
  }

  function renderJournalDossier() {
    const p = window.PATIENTS[window.canvasEngine.currentPatientId];
    const journalBody = document.getElementById('journal-dossier-body');
    if (!journalBody) return;

    journalBody.innerHTML = `
      <div class="journal-entry-wrapper">
        <div class="journal-stamp-box">
          <span class="stamp-code">${p.clinicalCode}</span>
          <span class="stamp-status">${window.storageEngine.state.patientStatus[p.id] || 'Under Active Intervention'}</span>
        </div>
        <h2 class="journal-patient-title">${p.name}</h2>
        <div class="journal-meta-row">
          <span>AGE: ${p.age}</span> • <span>CLASS: ${p.socioeconomic}</span> • <span>FACILITY: ${p.facility}</span>
        </div>
        <div class="journal-diagnosis-highlight">
          <strong>CONFIRMED DIAGNOSIS:</strong> ${p.diagnosisTitle}
        </div>
        <p class="journal-etiology-text"><strong>ETIOLOGY:</strong> ${p.etiology}</p>
        <div class="journal-vitals-strip">
          <div class="j-vital">PULSE: <strong>${p.vitals.pulseBpm} BPM</strong></div>
          <div class="j-vital">TEMP: <strong>${p.vitals.focalTemp}</strong></div>
          <div class="j-vital">RESISTANCE: <strong>${p.vitals.synapticResistance}</strong></div>
          <div class="j-vital">WEAR: <strong>${p.vitals.neuralWearFactor}</strong></div>
        </div>
        <div class="journal-handwritten-section">
          <h3>PHYSICIAN'S CLINICAL FIELD NOTES:</h3>
          <ul>
            ${p.journalNotes.map(n => `<li>"${n}"</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  // Reset Progress
  if (btnResetProgress) {
    btnResetProgress.addEventListener('click', () => {
      const confirmReset = confirm("Reset all clinical dossiers and level progression back to Day 1?");
      if (confirmReset && window.storageEngine) {
        window.storageEngine.resetAllProgress();
        alert("Progress reset. All dossiers returned to baseline.");
        location.reload();
      }
    });
  }

  // How to Play
  if (btnHowToPlay) {
    btnHowToPlay.addEventListener('click', () => {
      if (howToModal) howToModal.classList.remove('hidden');
    });
  }

  // Close Modals
  document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-backdrop');
      if (modal) modal.classList.add('hidden');
    });
  });

  // Audio Toggle
  if (btnQuickMute) {
    btnQuickMute.addEventListener('click', () => {
      if (window.soundEngine) {
        const muted = window.soundEngine.toggleMute();
        btnQuickMute.textContent = muted ? '🔇 MUTED' : '🔊 AUDIO';
        btnQuickMute.classList.toggle('active', muted);
      }
    });
  }
});
