// ==============================================================================
// NANO-PULSE PATIENT PROFILES, CLINICAL DIAGNOSES & LEVEL GEOMETRIES
// Hand-drawn medical sketchbook aesthetic data
// 9 Distinct Game Types × 3 Difficulty Levels
// ==============================================================================

// Difficulty Modifiers applied by canvasEngine
window.DIFF_MODS = {
  resident: {
    label: 'RESIDENT',
    guideSteps: 85,
    targetScale: 1.0,
    obstacleSpeed: 1.0,
    tolerance: 0.75,
    trianglesNeeded: 3,
    slitWidth: 70,
    color: '#34d399'
  },
  specialist: {
    label: 'SPECIALIST',
    guideSteps: 28,
    targetScale: 0.8,
    obstacleSpeed: 1.4,
    tolerance: 0.85,
    trianglesNeeded: 4,
    slitWidth: 55,
    color: '#f59e0b'
  },
  chief: {
    label: 'CHIEF SURGEON',
    guideSteps: 0,
    targetScale: 0.65,
    obstacleSpeed: 1.8,
    tolerance: 0.92,
    trianglesNeeded: 5,
    slitWidth: 40,
    color: '#ef4444'
  }
};

window.PATIENTS = {
  siddharth: {
    id: "siddharth",
    name: "Siddharth Rao",
    age: 34,
    socioeconomic: "Upper-Middle Class • Executive Retainer ($24,000/yr)",
    role: "Senior Distributed Systems Architect",
    facility: "Aura Neurological Sanatorium • VIP Suite 402",
    diagnosisTitle: "Cognitive Burnout & Neural Friction",
    clinicalCode: "DX-NEURO-704B",
    etiology: "16-hour continuous screen isolation work loops, hermetic apartment confinement, circadian collapse, and hyper-stimulated prefrontal synaptic friction.",
    vitals: {
      pulseBpm: 114,
      focalTemp: "38.6°C",
      synapticResistance: "420 Ω·cm²",
      neuralWearFactor: "86% (Critical Strain)"
    },
    journalNotes: [
      "Admitted directly into soundproof VIP Suite 402 with private holographic telemetry and laminar airflow.",
      "Corporate executive health rider authorized unlimited neuro-peptide perfusions with zero co-pay or delay.",
      "Prefrontal cortical imaging reveals rigid orthogonal synaptic friction. Wealth guarantees luxury and instant attention, but only 90° geometric precision can untangle his code-loops."
    ],
    accentColor: "#8c6239", // warm leather/sepia
    inkStampColor: "#9e3024",
    portraitTheme: "glasses_burnout",
    levels: [
      // ───── STAGE 1: RICOCHET MIRROR (Specular Reflection) ─────
      {
        levelNumber: 1,
        title: "Orthogonal Logic Recalibration",
        clinicalGoal: "Stabilize Prefrontal Logic Gate 01",
        gameType: "ricochet_mirror",
        geometryType: "Orthogonal Plasma Mirror (90°)",
        mathConcept: "Specular Reflection Normal: θ_i = θ_r = 45° | Deviation: 90°",
        caseBrief: "Siddharth's thoughts are locked in rigid right-angle loops. Utilize the 45-degree plasma mirror to bend the therapeutic pulse at a clean 90-degree angle past the logic barrier.",
        launcher: { x: 100, y: 380 },
        targets: [{ x: 820, y: 140, r: 24, label: "BURNOUT NODE 1", hp: 1 }],
        mirrors: [
          { x1: 440, y1: 420, x2: 500, y2: 360, label: "PLASMA MIRROR α (45°)" }
        ],
        obstacles: [
          { type: "rect", x: 420, y: 60, w: 40, h: 260, label: "RIGID LOGIC BLOCKER" }
        ],
        movingObstacles: []
      },
      // ───── STAGE 2: TRANSFORM AFFINE (Rotation + Scale Alignment) ─────
      {
        levelNumber: 2,
        title: "Synaptic Receptor Alignment Matrix",
        clinicalGoal: "Dissolve Hemispheric Synaptic Friction",
        gameType: "transform_affine",
        geometryType: "2D Affine Transformation",
        mathConcept: "T = S(θ)·v + t | Rotation + Scale Congruence",
        caseBrief: "Neural receptor sites have rotated and dilated under chronic stress. Manipulate the rotation angle θ and scale factor S to dock the therapeutic nano-construct precisely into the receptor cleft.",
        targetRot: 135,
        targetScale: 1.35,
        launcher: { x: 100, y: 420 },
        targets: [],
        mirrors: [],
        obstacles: [],
        movingObstacles: []
      },
      // ───── STAGE 3: GEODESIC RICOCHET (Multi-Mirror Closed Path) ─────
      {
        levelNumber: 3,
        title: "The Hermetic Isolation Labyrinth",
        clinicalGoal: "Complete Prefrontal De-escalation",
        gameType: "geodesic_ricochet",
        geometryType: "Triple Orthogonal Ricochet Matrix",
        mathConcept: "Closed Cartesian Geodesic Trajectory",
        caseBrief: "Final burnout breakthrough. Thread the nano-pulse through a triple 90-degree matrix to extinguish Siddharth's terminal work-loop.",
        launcher: { x: 90, y: 140 },
        targets: [
          { x: 860, y: 450, r: 24, label: "CORE INSOMNIA ROOT", hp: 1 }
        ],
        mirrors: [
          { x1: 380, y1: 110, x2: 440, y2: 170, label: "MIRROR A" },
          { x1: 380, y1: 410, x2: 440, y2: 470, label: "MIRROR B" },
          { x1: 680, y1: 410, x2: 740, y2: 470, label: "MIRROR C" }
        ],
        obstacles: [
          { type: "rect", x: 300, y: 220, w: 40, h: 160, label: "CODE ARTIFACT" },
          { type: "rect", x: 520, y: 100, w: 40, h: 260, label: "ISOLATION VAULT" }
        ],
        movingObstacles: []
      }
    ]
  },

  kabir: {
    id: "kabir",
    name: "Kabir Ansari",
    age: 27,
    socioeconomic: "Middle Class • Gig Courier (No Employer Coverage)",
    role: "Priority Delivery Courier (Gig Worker)",
    facility: "Suburban Municipal Trauma Wing 3 • Shared Bay 11",
    diagnosisTitle: "Sensory Overload & Exhaustion Neural Spikes",
    clinicalCode: "DX-ACOUSTIC-412K",
    etiology: "14-hour delivery shifts through torrential monsoon downpours, relentless acoustic traffic screeching, vibrating smartphone dispatch haptics, acute sensory fatigue.",
    vitals: {
      pulseBpm: 128,
      focalTemp: "39.1°C",
      synapticResistance: "295 Ω·cm²",
      neuralWearFactor: "91% (Sensory Overdrive)"
    },
    journalNotes: [
      "Admitted in drenched delivery raincoat. Algorithmic delivery app docking rating while patient is in clonic spasms.",
      "Family forced to swipe two credit cards for ₹35,000 admission deposit before central pharmacy released neuro-stabilizer ampoules.",
      "Shared observation bay with 18 beds behind thin vinyl curtain. Navigating volatile traffic-mimicking barriers with dual-bounce vectors."
    ],
    accentColor: "#4a6b5d", // aged moss/sage green
    inkStampColor: "#8f382a",
    portraitTheme: "courier_overload",
    levels: [
      // ───── STAGE 1: WEALTHY PROTOCOL (EASY MODE) ─────
      {
        levelNumber: 1,
        title: "Micro-Vessel Laser Purge (Wealthy Protocol)",
        clinicalGoal: "Wealthy & Fully Insured: Purge 10 Pathogens",
        gameType: "biocleanse_laser",
        geometryType: "Robotic Scalpel Targeting Arc",
        mathConcept: "Bounded Angular Polar Coordinates: r ≤ R_max, θ = atan2(dy, dx)",
        caseBrief: "Wealthy & Fully Insured (Easy Mode). Use robotic laser scalpel to aim and dissolve drifting mutant pathogens before they breach the vessel wall."
      },
      // ───── STAGE 2: MIDDLE-CLASS PROTOCOL (MODERATE) ─────
      {
        levelNumber: 2,
        title: "Resource Strain & Armored Strains (Middle-Class)",
        clinicalGoal: "Middle-Class Protocol: Purge 15 Pathogens Under Energy Drain",
        gameType: "biocleanse_laser",
        geometryType: "Energy Drain & Armored Shield Penetration",
        mathConcept: "High-Drain Energy Kinetics: dE/dt = -1.8, Armored Shell Absorption",
        caseBrief: "Middle-Class & Partially Insured (Moderate). Limited insurance reserves; energy drains faster and recharges slower. New threat: Armored Strain requiring sustained laser fire."
      },
      // ───── STAGE 3: LOWER-CLASS PROTOCOL (SURVIVAL) ─────
      {
        levelNumber: 3,
        title: "System Collapse & Apex Mutation (Survival)",
        clinicalGoal: "Survival Mode: Survive 20 Pathogens and Destroy Apex Mutation",
        gameType: "biocleanse_laser",
        geometryType: "Critical Reserve Triage & Apex Boss Elimination",
        mathConcept: "Critical Reserve Conservation & Multiphasic Boss Kinetics",
        caseBrief: "Lower-Class / Uninsured (Survival). Zero medical safety net. Laser energy is scarce with severe overheat penalties. Eliminate the 1200-HP Apex Boss Mutation to prevent fatal breach."
      }
    ]
  },

  radha: {
    id: "radha",
    name: "Radha Devi",
    age: 49,
    socioeconomic: "Low-Income / Working Class • Municipal Daily Wage",
    role: "Municipal Sanitation & Domestic Care Worker",
    facility: "District General Charitable Hospital • Female Ward 3 (Cot 14)",
    diagnosisTitle: "Critical Synaptic Degradation & Dengue Shock",
    clinicalCode: "DX-VIREMIA-981R",
    etiology: "Heavy post-dengue viral neuro-inflammation, untreated capillary leakage, chronic severe microvascular anemia, absence of preventive healthcare infrastructure.",
    vitals: {
      pulseBpm: 136,
      focalTemp: "40.3°C",
      synapticResistance: "140 Ω·cm² (Severe Leakage)",
      neuralWearFactor: "96% (Near-Terminal Decay)"
    },
    journalNotes: [
      "Admitted via charity ambulance in critical condition. Open ward with 42 beds, single ceiling fan, zero air conditioning.",
      "Dispensary out of platelet concentrate for 48 hours; family begging third-party blood banks across town. Platelets: 21,000 /μL.",
      "Severe capillary leakage and jagged necrotic decay. Zero margin for error—requires sub-degree needle precision."
    ],
    accentColor: "#7c4a36", // burnt terra-cotta
    inkStampColor: "#b91c1c",
    portraitTheme: "sanitation_fragile",
    levels: [
      // ───── STAGE 1: GENETIC SPLICER - CELLULAR STRAND PASSAGE ─────
      {
        levelNumber: 1,
        title: "Cellular Strand Passage (Base Alignment)",
        clinicalGoal: "Traverse Base DNA Strand & Contain Viral Leaking",
        gameType: "genetic_splicer",
        geometryType: "Harmonic Wave Traversal & Boundary Containment",
        mathConcept: "Sine Wave Kinetics: y = 200 + sin(0.015x + 0.02t)·(60 + 15·sin(0.05t))",
        caseBrief: "Radha's vascular walls are eroded by viral load. Guide the surgical nano-probe along the active DNA helix corridor, avoiding perimeter boundaries and floating viral pathogens.",
        launcher: { x: 50, y: 200 },
        targets: [],
        mirrors: [],
        obstacles: [],
        movingObstacles: []
      },
      // ───── STAGE 2: DYNAMIC SPLICING & WARPING CORRIDOR ─────
      {
        levelNumber: 2,
        title: "Dynamic Splicing & Dual-Harmonic Corridor",
        clinicalGoal: "Navigate Warping Genetic Corridor",
        gameType: "genetic_splicer",
        geometryType: "Dual-Harmonic Wave Modulation",
        mathConcept: "Compound Modulation: y = 200 + sin(0.02x + 0.04t)·(50 + 20·sin(0.08t)) + 15·cos(0.01x + 0.03t)",
        caseBrief: "Radha's capillary walls are disintegrating. The genetic strand shifts with accelerated dual-harmonic oscillation. Squeeze through the narrowed 25px corridor past counter-oscillating pathogens.",
        launcher: { x: 50, y: 200 },
        targets: [],
        mirrors: [],
        obstacles: [],
        movingObstacles: []
      },
      // ───── STAGE 3: CRITICAL SYNAPTIC CRISIS & RE-SEQUENCING ─────
      {
        levelNumber: 3,
        title: "Critical Synaptic Crisis & Re-Sequencing",
        clinicalGoal: "Stabilize Apex Harmonic & Seal Synaptic Core",
        gameType: "genetic_splicer",
        geometryType: "Chaotic Multi-Harmonic Navigation",
        mathConcept: "Chaotic Harmonic Superposition: y = 200 + sin(0.025x)·A(t) + 21·cos(0.015x) + 8·sin(0.04x)",
        caseBrief: "Final battle for Radha's life. Severe hemorrhagic shock causes chaotic multi-harmonic turbulence in the genetic sequence. Navigate the razor-thin 18px aperture without breach to trigger complete synaptic recovery!",
        launcher: { x: 50, y: 200 },
        targets: [],
        mirrors: [],
        obstacles: [],
        movingObstacles: []
      }
    ]
  }
};
