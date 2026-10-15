// ==============================================================================
// NANO-PULSE VISUAL NOVEL STORY ENGINE
// Full visual novel narrative sequences for all three patients:
// - Siddharth Rao (Upper-Middle Class • Luxury Private VIP Sanatorium)
// - Kabir Ansari (Middle Class • Overstretched Municipal Trauma Wing)
// - Radha Devi (Low-Income / Working Class • Underfunded Public Charity Ward)
// Includes Scene 1 Origin & Exposure, Scene 2 Distinct ICU Health Scenarios &
// Narrative Perspectives on how Income dictates Healthcare Quality,
// Scene 3 Call to Action (vpunch camera shake), and Triumphant Epilogues.
// ==============================================================================

window.PATIENT_STORIES = {
  // ----------------------------------------------------------------------------
  // 1. SIDDHARTH RAO (Upper-Middle Class • Cognitive Burnout • Private VIP ICU)
  // ----------------------------------------------------------------------------
  siddharth: [
    {
      id: "siddharth_intro_1",
      act: "ACT I: THE EXPOSURE",
      speaker: "Narrator",
      speakerTitle: "Case History",
      bg: "assets/images/siddharth_burnout.jpg",
      text: "Siddharth spends his days locked in 16-hour isolation work loops—architecting high-frequency algorithmic pipelines in hermetic high-rise suites while the city sleeps.",
      actions: []
    },
    {
      id: "siddharth_intro_2",
      act: "ACT I: THE EXPOSURE",
      speaker: "Siddharth Rao",
      speakerTitle: "Systems Architect",
      bg: "assets/images/siddharth_burnout.jpg",
      text: "Line 14,802... thread synchronization deadlock... My skull feels like it's grinding against rusted iron gears... What is that high-pitched tinnitus screech inside my temples...?!",
      actions: [{ type: "sfx_buzz", duration: 2.5 }]
    },
    {
      id: "siddharth_intro_3",
      act: "ACT I: THE EXPOSURE",
      speaker: "Narrator",
      speakerTitle: "Neural Trauma Log",
      bg: "assets/images/siddharth_burnout.jpg",
      transition: "dissolve",
      screenEffect: "hpunch",
      text: "An acute neural friction spike ruptured his prefrontal synaptic threshold, collapsing his cognitive baseline and triggering acute focal hyperthermia.",
      actions: [{ type: "sfx_punch", direction: "hpunch" }]
    },
    {
      id: "siddharth_icu_1",
      act: "ACT II: AURA NEUROLOGICAL SANATORIUM • VIP ICU SUITE 402",
      speaker: "Narrator",
      speakerTitle: "Private Sanatorium Admission",
      bg: "assets/images/siddharth_icu.jpg",
      transition: "flash",
      text: "Admitted to VIP Suite 402 of the private Aura Sanatorium. Silent holographic telemetry consoles softly hum with continuous intracranial EEG mapping, monitoring an acute focal spike to 38.6°C and runaway synaptic resistance of 420 Ω·cm².",
      actions: [
        { type: "sfx_flash" },
        { type: "sfx_heart_loop", bpm: 114 }
      ]
    },
    {
      id: "siddharth_icu_delirium",
      act: "ACT II: AURA NEUROLOGICAL SANATORIUM • VIP ICU SUITE 402",
      speaker: "Siddharth Rao",
      speakerTitle: "Patient (Delirious Murmur)",
      bg: "assets/images/siddharth_icu.jpg",
      text: "(Gasping weakly)... Stack pointer corrupted... My billable hours... The compiler won't stop screaming... Make the ambient light stop...",
      actions: []
    },
    {
      id: "siddharth_icu_disparity",
      act: "ACT II: AURA NEUROLOGICAL SANATORIUM • VIP ICU SUITE 402",
      speaker: "Narrator",
      speakerTitle: "Healthcare Disparity Analysis",
      bg: "assets/images/siddharth_icu.jpg",
      text: "Here, his corporate executive health rider ($24,000/yr comprehensive retainer) unlocks a level of medicine invisible to ordinary citizens: soundproof acoustic walls, automated micro-dose peptide pumps, dedicated one-on-one specialists, and zero waiting queues. Wealth buys silence, immediate diagnosis, unrationed cutting-edge pharmaceuticals, and the unquestioned privilege of being treated as an indispensable human intellect rather than a bed number.",
      actions: []
    },
    {
      id: "siddharth_icu_doctor",
      act: "ACT II: AURA NEUROLOGICAL SANATORIUM • VIP ICU SUITE 402",
      speaker: "Dr. Lin",
      speakerTitle: "Chief Neurologist",
      bg: "assets/images/siddharth_icu.jpg",
      text: "Severe cognitive burnout and prefrontal friction! His neural circuits are locked in rigid 90-degree orthogonal loops from continuous 16-hour isolation sprints. Even with limitless concierge medicine, pharmaceuticals cannot untangle cartesian neural loops—we must manually deploy orthogonal vector recalibration immediately!",
      actions: []
    },
    {
      id: "siddharth_intro_cta",
      act: "ACT III: THE CALL TO ACTION",
      speaker: "Narrator",
      speakerTitle: "The Call to Action",
      bg: "assets/images/siddharth_icu.jpg",
      screenEffect: "vpunch",
      text: "Guide Siddharth through his 3 critical recovery levels, reflect the nano-pulse off 90-degree plasma mirrors, extinguish the burnout, and bring him back from the brink!",
      actions: [{ type: "sfx_punch", direction: "vpunch" }],
      isCallToAction: true,
      jumpLevel: 0
    }
  ],

  // ----------------------------------------------------------------------------
  // 2. KABIR ANSARI (Middle Class • Sensory Overload • Municipal Trauma Wing)
  // ----------------------------------------------------------------------------
  kabir: [
    {
      id: "kabir_intro_1",
      act: "ACT I: THE EXPOSURE",
      speaker: "Narrator",
      speakerTitle: "Case History",
      bg: "assets/images/kabir_delivery.jpg",
      text: "Kabir spends his days racing a delivery scooter through 14-hour monsoon shifts—dodging torrential downpours, screeching horns, and flooded street gutters where storm mosquitoes thrive.",
      actions: []
    },
    {
      id: "kabir_intro_2",
      act: "ACT I: THE EXPOSURE",
      speaker: "Kabir Ansari",
      speakerTitle: "Priority Courier",
      bg: "assets/images/kabir_delivery.jpg",
      text: "Order #412... 8 minutes left on the delivery deadline. The rain is blinding, traffic sirens are shrieking in my ears... Wait! A sharp sting on my wrist... what was that?!",
      actions: [{ type: "sfx_buzz", duration: 2.8 }]
    },
    {
      id: "kabir_intro_3",
      act: "ACT I: THE EXPOSURE",
      speaker: "Narrator",
      speakerTitle: "Sensory Shock Log",
      bg: "assets/images/kabir_delivery.jpg",
      transition: "dissolve",
      screenEffect: "hpunch",
      text: "An infected mosquito bite collided with acoustic traffic trauma, sending violent sensory overload and exhaustion neural spikes raging through his temporal lobes.",
      actions: [{ type: "sfx_punch", direction: "hpunch" }]
    },
    {
      id: "kabir_icu_1",
      act: "ACT II: SUBURBAN MUNICIPAL TRAUMA WING 3 • SHARED BAY 11",
      speaker: "Narrator",
      speakerTitle: "Municipal Trauma Admission",
      bg: "assets/images/kabir_icu.jpg",
      transition: "flash",
      text: "Admitted to Acute Observation Bay 11 of the municipal trauma wing. Kabir lies on a rattling metal gurney behind a paper-thin green vinyl curtain under buzzing fluorescent lights, his pulse hammering at 128 BPM while sirens and screaming gurneys echo down the overcrowded hall.",
      actions: [
        { type: "sfx_flash" },
        { type: "sfx_heart_loop", bpm: 128 }
      ]
    },
    {
      id: "kabir_icu_delirium",
      act: "ACT II: SUBURBAN MUNICIPAL TRAUMA WING 3 • SHARED BAY 11",
      speaker: "Kabir Ansari",
      speakerTitle: "Patient (In Tremors)",
      bg: "assets/images/kabir_icu.jpg",
      text: "(Trembling violently)... The sirens won't stop ringing... Order #412... The delivery app is docking my rating for being late... Please, I can't pay the scooter loan EMI if they suspend my account...",
      actions: []
    },
    {
      id: "kabir_icu_disparity",
      act: "ACT II: SUBURBAN MUNICIPAL TRAUMA WING 3 • SHARED BAY 11",
      speaker: "Narrator",
      speakerTitle: "Healthcare Disparity Analysis",
      bg: "assets/images/kabir_icu.jpg",
      text: "Classified as an 'independent gig-partner', Kabir has zero company health insurance and zero paid sick days. Out in the admissions corridor, his family is frantically swiping two credit cards to deposit ₹35,000 before the hospital pharmacy will release vital neuro-stabilizing ampoules. In the middle-class tier, healthcare is a razor-thin tightrope where a single sudden infection threatens to wipe out an entire household's life savings.",
      actions: []
    },
    {
      id: "kabir_icu_doctor",
      act: "ACT II: SUBURBAN MUNICIPAL TRAUMA WING 3 • SHARED BAY 11",
      speaker: "Dr. Lin",
      speakerTitle: "Chief Neurologist",
      bg: "assets/images/kabir_icu.jpg",
      text: "Sensory overload index is at 91%! His auditory cortex is flooded with storm traffic static and temporal lobe tremors. We are short on specialized sedative drips, but we can stabilize his micro-vessels if we execute the Bio-Cleanse laser surgery protocol before his system collapses!",
      actions: []
    },
    {
      id: "kabir_intro_cta",
      act: "ACT III: THE CALL TO ACTION",
      speaker: "Narrator",
      speakerTitle: "The Call to Action",
      bg: "assets/images/kabir_icu.jpg",
      screenEffect: "vpunch",
      text: "Guide Kabir through his 3 critical Bio-Cleanse recovery protocols—Wealthy, Middle-Class, and Lower-Class Survival—and purge the Apex Mutation before total vessel collapse!",
      actions: [{ type: "sfx_punch", direction: "vpunch" }],
      isCallToAction: true,
      jumpLevel: 0
    }
  ],

  // ----------------------------------------------------------------------------
  // 3. RADHA DEVI (Low-Income / Vulnerable Class • Public Charity Ward)
  // ----------------------------------------------------------------------------
  radha: [
    {
      id: "radha_intro_1",
      act: "ACT I: THE EXPOSURE",
      speaker: "Narrator",
      speakerTitle: "Case History",
      bg: "assets/images/radha_sanitation.jpg",
      text: "Radha spends her days clearing clogged municipal drains and flooded basements—a prime breeding ground for mosquitoes, with zero protective gear.",
      actions: []
    },
    {
      id: "radha_intro_2",
      act: "ACT I: THE EXPOSURE",
      speaker: "Radha Devi",
      speakerTitle: "Sanitation & Care Worker",
      bg: "assets/images/radha_sanitation.jpg",
      text: "Another flooded drain overflowing with foul runoff... My joints burn, but my family needs this daily wage. Ah! Something stung my wrist... it feels like burning coal...!",
      actions: [{ type: "sfx_buzz", duration: 2.8 }]
    },
    {
      id: "radha_intro_3",
      act: "ACT I: THE EXPOSURE",
      speaker: "Narrator",
      speakerTitle: "Viremic Inoculation",
      bg: "assets/images/radha_sanitation.jpg",
      transition: "dissolve",
      screenEffect: "hpunch",
      text: "One infected bite sent severe Dengue straight into her bloodstream, eroding fragile hippocampal and cerebellar synapses.",
      actions: [{ type: "sfx_punch", direction: "hpunch" }]
    },
    {
      id: "radha_icu_1",
      act: "ACT II: DISTRICT CHARITABLE HOSPITAL • FEMALE WARD 3",
      speaker: "Narrator",
      speakerTitle: "Charity Ward Admission",
      bg: "assets/images/radha_icu.jpg",
      transition: "flash",
      text: "Admitted to Government Charity Female Ward 3, Cot 14. Radha lies on a rusted iron cot beneath an oscillating ceiling fan stirring humid 36°C air. Forty-two patients occupy an open ward built for twenty, while a single exhausted nurse juggles medication trays.",
      actions: [
        { type: "sfx_flash" },
        { type: "sfx_heart_loop", bpm: 136 }
      ]
    },
    {
      id: "radha_icu_delirium",
      act: "ACT II: DISTRICT CHARITABLE HOSPITAL • FEMALE WARD 3",
      speaker: "Radha Devi",
      speakerTitle: "Patient (Gasping Weakly)",
      bg: "assets/images/radha_icu.jpg",
      text: "(Weak, shallow breathing)... Everything is growing so dark and cold... The chemist wanted a month's wages for medicine... Who will feed my children if I don't wake up tomorrow...?",
      actions: []
    },
    {
      id: "radha_icu_disparity",
      act: "ACT II: DISTRICT CHARITABLE HOSPITAL • FEMALE WARD 3",
      speaker: "Narrator",
      speakerTitle: "Healthcare Disparity Analysis",
      bg: "assets/images/radha_icu.jpg",
      text: "Here at the bottom of the economic hierarchy, healthcare is a brutal battle against institutional starvation. The municipal contractor who sent Radha into flooded sewage provided no boots, no gloves, and zero health benefits. Now, the government dispensary has been out of platelet concentrate for 48 hours. Her teenage daughter has been running across town in the rain with handwritten chits, begging private blood banks for a single subsidized unit while Radha's platelets crash to 21,000 /μL. Income determines survival: while luxury suites receive imported synthetics on demand, the poor are forced to beg for basic saline.",
      actions: []
    },
    {
      id: "radha_icu_doctor",
      act: "ACT II: DISTRICT CHARITABLE HOSPITAL • FEMALE WARD 3",
      speaker: "Dr. Lin",
      speakerTitle: "Chief Neurologist",
      bg: "assets/images/radha_icu.jpg",
      text: "Capillary leakage is critical, hematocrit is at 52%, and necrotic synaptic decay is tearing through her neural networks! We cannot afford a single misplaced deflection—only micro-angle needle precision through the narrowest cellular slits will save Radha's life!",
      actions: []
    },
    {
      id: "radha_intro_cta",
      act: "ACT III: THE CALL TO ACTION",
      speaker: "Narrator",
      speakerTitle: "The Call to Action",
      bg: "assets/images/radha_icu.jpg",
      screenEffect: "vpunch",
      text: "Guide Radha through her 3 critical recovery levels, navigate the tight needle-slit passages through necrotic decay, and bring her back from the brink!",
      actions: [{ type: "sfx_punch", direction: "vpunch" }],
      isCallToAction: true,
      jumpLevel: 0
    }
  ]
};

// ==============================================================================
// VISUAL NOVEL EPILOGUE SCRIPTS (Triggered upon Stage 3 completion)
// ==============================================================================
window.PATIENT_EPILOGUES = {
  siddharth: [
    {
      act: "EPILOGUE: FULL NEURAL RECOVERY",
      speaker: "Siddharth Rao",
      speakerTitle: "Systems Architect (Recovered)",
      bg: "assets/images/rob_recovered.jpg",
      transition: "flash",
      text: "The recursive loop in my mind... it finally shattered. For the first time in ten years, there is profound silence and clarity in my head. I'm shutting the terminal down and stepping into the daylight.",
      actions: [{ type: "sfx_fanfare" }]
    },
    {
      act: "EPILOGUE: DISCHARGE LOG",
      speaker: "Dr. Lin",
      speakerTitle: "Chief Neurologist",
      bg: "assets/images/rob_recovered.jpg",
      text: "Synaptic resistance normalized to 85 Ω·cm². Prefrontal friction extinguished. Patient Siddharth Rao is fully discharged and recovered from Aura VIP Sanatorium!",
      actions: []
    }
  ],
  kabir: [
    {
      act: "EPILOGUE: SENSORY HARMONY",
      speaker: "Kabir Ansari",
      speakerTitle: "Priority Courier (Recovered)",
      bg: "assets/images/rob_recovered.jpg",
      transition: "flash",
      text: "The screeching sirens and storm static in my ears... they've faded into peaceful rain. My hands are completely steady on the handlebars. Thanks to your precision, I'm heading home safe to my family!",
      actions: [{ type: "sfx_fanfare" }]
    },
    {
      act: "EPILOGUE: DISCHARGE LOG",
      speaker: "Dr. Lin",
      speakerTitle: "Chief Neurologist",
      bg: "assets/images/rob_recovered.jpg",
      text: "Temporal lobe sensory spikes suppressed. Cortisol and tremor baselines restored to optimal equilibrium. Kabir is cleared for full discharge from Municipal Trauma Wing!",
      actions: []
    }
  ],
  radha: [
    {
      act: "EPILOGUE: SURVIVAL & REBIRTH",
      speaker: "Radha Devi",
      speakerTitle: "Sanitation Worker (Recovered)",
      bg: "assets/images/rob_recovered.jpg",
      transition: "flash",
      text: "The burning fire has left my bones. I can breathe without pain, and I can hold my children again. When the public clinics had nothing left, your guidance gave me my life back... Thank you with all my heart!",
      actions: [{ type: "sfx_fanfare" }]
    },
    {
      act: "EPILOGUE: DISCHARGE LOG",
      speaker: "Dr. Lin",
      speakerTitle: "Chief Neurologist",
      bg: "assets/images/rob_recovered.jpg",
      text: "Platelet count rebounded to 184,000 /μL. Capillary leakage sealed and synaptic integrity restored to 98%. Radha Devi has triumphed over severe Dengue collapse in Charity Ward 3!",
      actions: []
    }
  ]
};

// ==============================================================================
// VISUAL NOVEL ORCHESTRATOR CLASS
// ==============================================================================
class StoryEngine {
  constructor() {
    this.currentPatientId = 'siddharth';
    this.script = [];
    this.currentIndex = 0;
    this.isTyping = false;
    this.typewriterTimer = null;
    this.currentText = "";
    this.charIndex = 0;
    this.typeSpeed = 20;
    this.isAutoPlay = false;
    this.autoTimer = null;
    this.isSkipping = false;
    this.isActive = false;

    // DOM Elements
    this.dom = {
      overlay: document.getElementById('vn-story-overlay'),
      bgLayer: document.getElementById('vn-bg-layer'),
      dialogueBox: document.getElementById('dialogue-box'),
      speakerName: document.getElementById('dialogue-speaker-name'),
      speakerTag: document.getElementById('dialogue-speaker-tag'),
      dialogueContent: document.getElementById('dialogue-content'),
      actTitle: document.getElementById('vn-act-title'),
      patientBadge: document.getElementById('vn-patient-badge'),
      flashOverlay: document.getElementById('vn-flash-overlay'),
      btnAuto: document.getElementById('btn-vn-auto'),
      btnSkip: document.getElementById('btn-vn-skip'),
      btnSkipAll: document.getElementById('btn-vn-skip-all'),
      btnCtaAction: document.getElementById('btn-vn-cta-action'),
      advanceCursor: document.getElementById('vn-advance-cursor')
    };

    this.setupListeners();
  }

  setupListeners() {
    if (this.dom.dialogueBox) {
      this.dom.dialogueBox.addEventListener('click', (e) => {
        if (e.target.closest('.quick-action-btn') || e.target.closest('.vn-bypass-btn') || e.target.closest('.vn-cta-jump-btn')) return;
        this.handleAdvance();
      });
    }

    if (this.dom.btnAuto) {
      this.dom.btnAuto.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleAuto();
      });
    }

    if (this.dom.btnSkip) {
      this.dom.btnSkip.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleSkip();
      });
    }

    if (this.dom.btnSkipAll) {
      this.dom.btnSkipAll.addEventListener('click', (e) => {
        e.stopPropagation();
        this.hideStory();
        if (window.canvasEngine) {
          window.canvasEngine.loadPatientLevel(this.currentPatientId, 0, false);
        }
      });
    }

    if (this.dom.btnCtaAction) {
      this.dom.btnCtaAction.addEventListener('click', (e) => {
        e.stopPropagation();
        this.hideStory();
        if (window.canvasEngine) {
          window.canvasEngine.loadPatientLevel(this.currentPatientId, 0, false);
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (!this.isActive) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this.handleAdvance();
      } else if (e.key === 'a' || e.key === 'A') {
        this.toggleAuto();
      } else if (e.key === 's' || e.key === 'S') {
        this.toggleSkip();
      } else if (e.key === 'Escape') {
        this.hideStory();
        if (window.canvasEngine) {
          window.canvasEngine.loadPatientLevel(this.currentPatientId, 0, false);
        }
      }
    });
  }

  playStory(patientId, isEpilogue = false) {
    if (!patientId || !window.PATIENTS[patientId]) patientId = 'siddharth';
    this.currentPatientId = patientId;
    this.script = isEpilogue 
      ? (window.PATIENT_EPILOGUES[patientId] || [])
      : (window.PATIENT_STORIES[patientId] || []);
    this.currentIndex = 0;
    this.isActive = true;

    if (window.soundEngine) {
      window.soundEngine.init();
      window.soundEngine.resume();
    }

    if (this.dom.overlay) {
      this.dom.overlay.classList.remove('hidden');
      this.dom.overlay.classList.add('active');
    }

    // Hide main title screen while story is active
    const titleScreen = document.getElementById('title-screen');
    if (titleScreen) titleScreen.classList.add('hidden');

    this.renderScene(0);
  }

  hideStory() {
    this.isActive = false;
    if (this.dom.overlay) {
      this.dom.overlay.classList.add('hidden');
      this.dom.overlay.classList.remove('active');
    }
    if (this.autoTimer) {
      clearTimeout(this.autoTimer);
      this.autoTimer = null;
    }
    if (this.typewriterTimer) {
      clearInterval(this.typewriterTimer);
      this.typewriterTimer = null;
    }
    if (window.soundEngine) {
      window.soundEngine.stopHeartMonitor();
    }
  }

  handleAdvance() {
    if (window.soundEngine) window.soundEngine.resume();

    if (this.isTyping) {
      // Fast complete line
      clearInterval(this.typewriterTimer);
      this.isTyping = false;
      if (this.dom.dialogueContent) this.dom.dialogueContent.textContent = this.currentText;
      if (this.dom.advanceCursor) this.dom.advanceCursor.style.opacity = '1';
      return;
    }

    const scene = this.script[this.currentIndex];
    // Check if this scene triggers a level jump
    if (scene && scene.jumpLevel !== undefined && this.currentIndex === this.script.length - 1) {
      this.hideStory();
      if (window.canvasEngine) {
        window.canvasEngine.loadPatientLevel(this.currentPatientId, scene.jumpLevel, false);
      }
      return;
    }

    if (this.currentIndex + 1 < this.script.length) {
      this.renderScene(this.currentIndex + 1);
    } else {
      // End of script sequence
      this.hideStory();
      if (this.isEpilogue) {
        if (this.currentPatientId === 'siddharth') {
          // Advance to Kabir
          if (window.canvasEngine) window.canvasEngine.loadPatientLevel('kabir', 0, true);
        } else if (this.currentPatientId === 'kabir') {
          // Advance to Radha
          if (window.canvasEngine) window.canvasEngine.loadPatientLevel('radha', 0, true);
        } else if (this.currentPatientId === 'radha') {
          // Stage 9 completed: Trigger Neural Stress & Cognitive Report Card!
          if (window.telemetryEngine) window.telemetryEngine.triggerReportCard();
        }
      } else if (window.canvasEngine) {
        window.canvasEngine.loadPatientLevel(this.currentPatientId, 0, false);
      }
    }
  }

  renderScene(index) {
    if (index < 0 || index >= this.script.length) return;
    this.currentIndex = index;
    const scene = this.script[index];

    // 1. Background image
    if (scene.bg && this.dom.bgLayer) {
      this.dom.bgLayer.style.backgroundImage = `url("${scene.bg}")`;
    }

    // 2. Transitions & Camera Punches
    if (scene.transition === 'flash') this.triggerFlash();
    if (scene.screenEffect) this.triggerShake(scene.screenEffect);

    // 3. Audio actions
    if (scene.actions && window.soundEngine) {
      scene.actions.forEach(a => {
        if (a.type === 'sfx_buzz') {
          window.soundEngine.playMosquitoBuzz(a.duration || 2.2);
        } else if (a.type === 'sfx_punch') {
          window.soundEngine.playStampThud();
        } else if (a.type === 'sfx_flash') {
          window.soundEngine.playFlashWhoosh();
        } else if (a.type === 'sfx_heart_loop') {
          window.soundEngine.startHeartMonitor(a.bpm || 124);
        } else if (a.type === 'sfx_fanfare') {
          window.soundEngine.playSynapseHit();
        }
      });
    }

    // 4. Act and Patient Badges
    const p = window.PATIENTS[this.currentPatientId] || { name: "Patient", socioeconomic: "Dossier" };
    if (this.dom.actTitle) {
      this.dom.actTitle.textContent = scene.act || "CLINICAL CASE DOSSIER";
    }
    if (this.dom.patientBadge) {
      this.dom.patientBadge.textContent = `CASE: ${p.name.toUpperCase()} • ${p.socioeconomic.toUpperCase()}`;
    }

    // 5. Speaker Info
    if (this.dom.speakerName) {
      this.dom.speakerName.textContent = scene.speaker || "Narrator";
      this.dom.speakerName.className = 'speaker-name ' + this.getSpeakerClass(scene.speaker);
    }
    if (this.dom.speakerTag) {
      this.dom.speakerTag.textContent = scene.speakerTitle || "";
    }

    // 6. Call to Action Button Toggle
    if (this.dom.btnCtaAction) {
      if (scene.isCallToAction) {
        this.dom.btnCtaAction.style.display = 'inline-flex';
      } else {
        this.dom.btnCtaAction.style.display = 'none';
      }
    }

    // 7. Typewriter Animation
    this.startTypewriter(scene.text);
  }

  getSpeakerClass(speaker) {
    if (!speaker) return 'speaker-narrator';
    if (speaker.includes('Siddharth')) return 'speaker-siddharth';
    if (speaker.includes('Kabir')) return 'speaker-kabir';
    if (speaker.includes('Radha')) return 'speaker-radha';
    if (speaker.includes('Lin')) return 'speaker-doctor';
    return 'speaker-narrator';
  }

  startTypewriter(text) {
    clearInterval(this.typewriterTimer);
    this.isTyping = true;
    this.currentText = text;
    this.charIndex = 0;
    if (this.dom.dialogueContent) this.dom.dialogueContent.textContent = "";
    if (this.dom.advanceCursor) this.dom.advanceCursor.style.opacity = '0';

    const speed = this.isSkipping ? 4 : this.typeSpeed;

    this.typewriterTimer = setInterval(() => {
      if (this.charIndex < this.currentText.length) {
        if (this.dom.dialogueContent) {
          this.dom.dialogueContent.textContent += this.currentText[this.charIndex];
        }
        this.charIndex++;
        if (this.charIndex % 3 === 0 && window.soundEngine) {
          window.soundEngine.playTypewriterClack();
        }
      } else {
        clearInterval(this.typewriterTimer);
        this.isTyping = false;
        if (this.dom.advanceCursor) this.dom.advanceCursor.style.opacity = '1';
        if (this.isAutoPlay) {
          this.scheduleAutoNext();
        }
      }
    }, speed);
  }

  triggerFlash() {
    if (!this.dom.flashOverlay) return;
    this.dom.flashOverlay.classList.remove('active');
    void this.dom.flashOverlay.offsetWidth;
    this.dom.flashOverlay.classList.add('active');
    setTimeout(() => {
      if (this.dom.flashOverlay) this.dom.flashOverlay.classList.remove('active');
    }, 450);
  }

  triggerShake(effect) {
    if (!this.dom.overlay) return;
    this.dom.overlay.classList.remove('hpunch', 'vpunch');
    void this.dom.overlay.offsetWidth;
    this.dom.overlay.classList.add(effect);
    setTimeout(() => {
      if (this.dom.overlay) this.dom.overlay.classList.remove(effect);
    }, 550);
  }

  toggleAuto() {
    this.isAutoPlay = !this.isAutoPlay;
    if (this.dom.btnAuto) this.dom.btnAuto.classList.toggle('active', this.isAutoPlay);
    if (this.isAutoPlay && !this.isTyping) {
      this.scheduleAutoNext();
    }
  }

  scheduleAutoNext() {
    if (this.autoTimer) clearTimeout(this.autoTimer);
    this.autoTimer = setTimeout(() => {
      if (this.isAutoPlay) this.handleAdvance();
    }, 2800);
  }

  toggleSkip() {
    this.isSkipping = !this.isSkipping;
    if (this.dom.btnSkip) this.dom.btnSkip.classList.toggle('active', this.isSkipping);
    if (this.isSkipping) this.handleAdvance();
  }
}

window.storyEngine = new StoryEngine();
