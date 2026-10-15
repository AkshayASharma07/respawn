// ==============================================================================
// 3 PATIENTS STORY SCRIPT & 33 GEOMETRIC/MATHEMATICAL RECOVERY LEVELS
// - Patient 1: ROB (Working Class • Sanitation Worker • City General ICU)
// - Patient 2: ELENA CHEN (Middle Class • High School STEM Teacher • Community Ward)
// - Patient 3: JULIAN VANCE (Upper Class • Luxury Venture Capitalist • VIP Penthouse ICU)
// Core Focus: Vectors, Angles, Ricochets, Transformations, Gravity, Waves, Triangulations
// ZERO Multiple-Choice Questions - 100% Geometry & Physics Gameplay
// ==============================================================================

window.PATIENTS_DATA = {
  rob: {
    id: "rob",
    name: "Rob",
    classTier: "Working Class",
    profession: "Sanitation Technician",
    facility: "City General Hospital - Public Ward 4",
    feverOrigin: "Flooded basements and clogged drainage pipe mosquito breeding swarms",
    avatarBg: "assets/images/rob_bitten.jpg",
    hospitalBg: "assets/images/hospital_icu.jpg",
    bloodstreamBg: "assets/images/bloodstream.jpg",
    victoryBg: "assets/images/rob_recovered.jpg"
  },
  elena: {
    id: "elena",
    name: "Elena Chen",
    classTier: "Middle Class",
    profession: "High School Geometry Teacher & Architect",
    facility: "St. Jude Suburban Community Health Center",
    feverOrigin: "Suburban backyard garden rainwater harvesting barrel & plant drip trays",
    avatarBg: "assets/images/elena_bitten.jpg",
    hospitalBg: "assets/images/hospital_icu.jpg",
    bloodstreamBg: "assets/images/bloodstream.jpg",
    victoryBg: "assets/images/rob_recovered.jpg"
  },
  julian: {
    id: "julian",
    name: "Julian Vance",
    classTier: "Upper Class",
    profession: "Tech Venture Capitalist & Estate Owner",
    facility: "Aegis VIP Concierge Penthouse Medical Suite",
    feverOrigin: "Private hilltop luxury estate infinity pool edge & botanical solarium",
    avatarBg: "assets/images/hospital_icu.jpg",
    hospitalBg: "assets/images/hospital_icu.jpg",
    bloodstreamBg: "assets/images/bloodstream.jpg",
    victoryBg: "assets/images/rob_recovered.jpg"
  }
};

window.ACTIVE_PATIENT_ID = "rob";

// ==============================================================================
// PATIENT 1: ROB (Working Class) - 11 Mathematical Recovery Levels
// ==============================================================================
const ROB_SCRIPT = [
  {
    id: "rob_prologue_1",
    patientId: "rob",
    levelNumber: 0,
    chapterTitle: "PROLOGUE: THE INFECTION",
    bg: "assets/images/basement.jpg",
    speaker: "Narrator",
    speakerTitle: "Narrative Voice",
    text: "Rob spends his days fixing clogged drains and flooded basements—a prime breeding ground for mosquitoes.",
    bgm: "basement_dark",
    vitals: { bpm: 78, temp: 37.0, platelets: 260, hematocrit: 41, bpSys: 120, bpDia: 80, stability: 95, phaseName: "NORMAL HEALTH", isEmergency: false }
  },
  {
    id: "rob_prologue_2",
    patientId: "rob",
    levelNumber: 0,
    chapterTitle: "PROLOGUE: THE BITE",
    bg: "assets/images/basement.jpg",
    speaker: "Rob",
    speakerTitle: "Sanitation Technician",
    text: "Ugh... another dark basement pipe rusted through. What was that buzzing sound...?",
    actions: [{ type: "sfx_buzz", duration: 2.6 }]
  },
  {
    id: "rob_prologue_3",
    patientId: "rob",
    levelNumber: 0,
    chapterTitle: "PROLOGUE: THE INFECTION",
    bg: "assets/images/rob_bitten.jpg",
    transition: "dissolve",
    screenEffect: "hpunch",
    speaker: "Narrator",
    speakerTitle: "Narrative Voice",
    text: "One infected bite sent severe Dengue straight into his bloodstream.",
    vitals: { bpm: 95, temp: 37.8, platelets: 210, hematocrit: 43, bpSys: 115, bpDia: 75, stability: 80, phaseName: "VIREMIA INVASION", isEmergency: false },
    actions: [{ type: "sfx_punch", direction: "hpunch" }]
  },
  {
    id: "rob_prologue_hospital",
    patientId: "rob",
    levelNumber: 0,
    chapterTitle: "SCENE 2: THE HOSPITAL",
    bg: "assets/images/hospital_icu.jpg",
    transition: "flash",
    speaker: "Narrator",
    speakerTitle: "City General Hospital",
    text: "His fever is spiking, his vitals are crashing, and time is running out.",
    bgm: "icu_tension",
    vitals: { bpm: 138, temp: 40.2, platelets: 38, hematocrit: 52, bpSys: 85, bpDia: 54, stability: 22, phaseName: "CRITICAL: MULTI-SYSTEM SHOCK", isEmergency: true },
    actions: [{ type: "sfx_flash" }, { type: "sfx_heart_loop", bpm: 138 }]
  },
  {
    id: "rob_prologue_call_to_action",
    patientId: "rob",
    levelNumber: 0,
    chapterTitle: "SCENE 3: THE CALL TO ACTION",
    bg: "assets/images/hospital_icu.jpg",
    screenEffect: "vpunch",
    speaker: "Narrator",
    speakerTitle: "Emergency Code Blue",
    text: "Guide Rob through 10 critical recovery levels, fight off the pathogen, and bring him back from the brink!",
    actions: [{ type: "sfx_punch", direction: "vpunch" }],
    nextJump: "rob_level_1"
  },

  // Level R1: Vector Trajectory (Direct Shot)
  {
    id: "rob_level_1",
    patientId: "rob",
    levelNumber: 1,
    chapterTitle: "LEVEL 1: VASCULAR VECTOR TRAJECTORY",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Dr. Lin",
    speakerTitle: "ICU Attending",
    text: "Rob's fever has broken into viremic circulation! Aim the therapeutic crystalloid probe along the laminar blood flow vector to strike the first viral cluster.",
    vitals: { bpm: 134, temp: 40.1, platelets: 62, hematocrit: 48, bpSys: 90, bpDia: 58, stability: 28, phaseName: "LEVEL 1: VECTOR INJECTION", isEmergency: true },
    minigame: {
      type: "vector_game",
      patientName: "ROB",
      levelNum: 1,
      title: "Direct Vector Launch Angle",
      mathFormula: "v = (v_x, v_y) | θ = atan2(Δy, Δx) | |v| = √(v_x² + v_y²)",
      instruction: "Drag from the launcher to set vector angle θ and velocity magnitude |v|. Release to fire directly into the viral cluster!",
      launcher: { x: 90, y: 240 },
      targets: [{ x: 780, y: 240, r: 24, hp: 1 }],
      obstacles: []
    },
    nextJump: "rob_level_2"
  },

  // Level R2: Specular Ricochet (Wall Bounce)
  {
    id: "rob_level_2",
    patientId: "rob",
    levelNumber: 2,
    chapterTitle: "LEVEL 2: ENDOTHELIAL RICOCHET BOUNCE",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Dr. Lin",
    speakerTitle: "ICU Attending",
    text: "A micro-thrombus blocks the central lumen! Use the law of specular reflection (θ_i = θ_r) off the endothelial vascular wall to bank the antibody around the clot.",
    vitals: { bpm: 136, temp: 39.9, platelets: 50, hematocrit: 49, bpSys: 88, bpDia: 56, stability: 34, phaseName: "LEVEL 2: RICOCHET BANK", isEmergency: true },
    minigame: {
      type: "vector_game",
      patientName: "ROB",
      levelNum: 2,
      title: "Vascular Wall Reflection (θ_incidence = θ_reflection)",
      mathFormula: "v' = v - 2(v · n̂)n̂ | θ_reflect = -θ_incident",
      instruction: "Bank the antibody off the upper or lower vessel wall to bypass the central thrombus barrier!",
      launcher: { x: 90, y: 160 },
      obstacles: [{ type: "rect", x: 420, y: 120, w: 40, h: 240, label: "THROMBUS CLOT" }],
      targets: [{ x: 800, y: 320, r: 24, hp: 1 }],
      maxBounces: 3
    },
    nextJump: "rob_level_3"
  },

  // Level R3: Gravity Curvature (Parabolic Trajectory)
  {
    id: "rob_level_3",
    patientId: "rob",
    levelNumber: 3,
    chapterTitle: "LEVEL 3: GRAVITY & PARABOLIC PERFUSION",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Biosensor HUD",
    speakerTitle: "Hemodynamic Monitor",
    text: "Vascular pressure gradient is generating downward hydrodynamic acceleration g. Account for the parabolic curve y(t) = v_y·t + 1/2·g·t² to hit the sunken viral nest!",
    vitals: { bpm: 130, temp: 39.7, platelets: 42, hematocrit: 51, bpSys: 92, bpDia: 60, stability: 40, phaseName: "LEVEL 3: PARABOLIC ACCELERATION", isEmergency: true },
    minigame: {
      type: "vector_game",
      patientName: "ROB",
      levelNum: 3,
      title: "Parabolic Trajectory under Fluid Gravity",
      mathFormula: "x(t) = v_x·t ; y(t) = v_y·t + 1/2·g·t² | Vertex = -v_y² / (2g)",
      instruction: "Aim upward with sufficient velocity to loft the projectile over the barrier under gravity g = 0.22 px/frame²!",
      launcher: { x: 90, y: 380 },
      gravity: { x: 0, y: 0.22 },
      obstacles: [{ type: "rect", x: 440, y: 220, w: 40, h: 260, label: "VASCULAR RIDGE" }],
      targets: [{ x: 820, y: 400, r: 24, hp: 1 }]
    },
    nextJump: "rob_level_4"
  },

  // Level R4: Polygon Triangulation (Capillary Fissure Seal)
  {
    id: "rob_level_4",
    patientId: "rob",
    levelNumber: 4,
    chapterTitle: "LEVEL 4: DELAUNAY POLYGONAL HEMOSTASIS",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Dr. Lin",
    speakerTitle: "ICU Attending",
    text: "Platelet crash! Micro-capillaries are fissuring. Connect 3 coordinate nodes at a time to generate Delaunay triangular mesh patches and seal the leaking area!",
    vitals: { bpm: 138, temp: 39.5, platelets: 34, hematocrit: 53, bpSys: 84, bpDia: 54, stability: 32, phaseName: "LEVEL 4: TRIANGULAR SEAL", isEmergency: true },
    minigame: {
      type: "polygon_game",
      patientName: "ROB",
      levelNum: 4,
      title: "Geometric Triangulation of Vascular Fissure",
      targetTriangles: 4
    },
    nextJump: "rob_level_5"
  },

  // Level R5: Double Wall Ricochet (Billiard Geometry)
  {
    id: "rob_level_5",
    patientId: "rob",
    levelNumber: 5,
    chapterTitle: "LEVEL 5: DOUBLE-BANK RICOCHET MATRIX",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Biosensor HUD",
    speakerTitle: "Vascular Radar",
    text: "A double-barrier endothelial fold protects the deep Dengue reservoir. Calculate a 2-bounce reflection sequence off top and bottom walls!",
    vitals: { bpm: 125, temp: 39.1, platelets: 38, hematocrit: 50, bpSys: 94, bpDia: 62, stability: 48, phaseName: "LEVEL 5: DUAL REFLECTION", isEmergency: false },
    minigame: {
      type: "vector_game",
      patientName: "ROB",
      levelNum: 5,
      title: "2-Bounce Billiard Reflection Angle",
      mathFormula: "θ_bounce = 180° - θ_incidence | 2 Bounces Required",
      instruction: "Calculate the exact launch angle to bank off the ceiling, then the floor, and strike the hidden viral colony!",
      launcher: { x: 90, y: 240 },
      obstacles: [
        { type: "rect", x: 340, y: 60, w: 30, h: 260, label: "SEPTUM A" },
        { type: "rect", x: 580, y: 180, w: 30, h: 260, label: "SEPTUM B" }
      ],
      targets: [{ x: 840, y: 240, r: 24, hp: 1 }],
      maxBounces: 4
    },
    nextJump: "rob_level_6"
  },

  // Level R6: Transformation Matrix (Rigid Rotation & Scaling)
  {
    id: "rob_level_6",
    patientId: "rob",
    levelNumber: 6,
    chapterTitle: "LEVEL 6: AFFINE RECEPTOR CONGRUENCE",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Dr. Lin",
    speakerTitle: "ICU Attending",
    text: "To bind with the mutant DENV-2 envelope glycoprotein, we must apply a 2D coordinate rotation matrix R(θ) and scale factor S to match the binding cleft!",
    vitals: { bpm: 118, temp: 38.6, platelets: 45, hematocrit: 48, bpSys: 98, bpDia: 66, stability: 55, phaseName: "LEVEL 6: MATRIX ROTATION", isEmergency: false },
    minigame: {
      type: "transform_game",
      patientName: "ROB",
      levelNum: 6,
      title: "2D Coordinate Rotation & Dilation Matrix",
      targetRot: 135,
      targetScale: 1.35
    },
    nextJump: "rob_level_7"
  },

  // Level R7: Centripetal Gravity Slingshot
  {
    id: "rob_level_7",
    patientId: "rob",
    levelNumber: 7,
    chapterTitle: "LEVEL 7: ORBITAL SLINGSHOT MECHANICS",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Biosensor HUD",
    speakerTitle: "Microfluidic Physics",
    text: "A massive bio-magnetic macrophage core is exerting a central 1/r² gravitational field. Execute a hyperbolic orbital slingshot to whip around the core!",
    vitals: { bpm: 110, temp: 38.0, platelets: 55, hematocrit: 46, bpSys: 104, bpDia: 68, stability: 62, phaseName: "LEVEL 7: GRAVITATIONAL SLINGSHOT", isEmergency: false },
    minigame: {
      type: "vector_game",
      patientName: "ROB",
      levelNum: 7,
      title: "Hyperbolic Slingshot Maneuver (F = μ / r²)",
      mathFormula: "a_c = v² / r | F_g = -μ/r² · r̂ | Hyperbolic Eccentricity e > 1",
      instruction: "Launch near the macrophage core to let its gravity curve and slingshot your probe around the barrier to hit the target!",
      launcher: { x: 90, y: 120 },
      gravityWells: [{ x: 440, y: 240, r: 35, mass: 950, name: "MACROPHAGE" }],
      obstacles: [{ type: "rect", x: 420, y: 320, w: 40, h: 140, label: "FIBROSIS" }],
      targets: [{ x: 800, y: 360, r: 24, hp: 1 }]
    },
    nextJump: "rob_level_8"
  },

  // Level R8: Harmonic Destructive Wave Interference
  {
    id: "rob_level_8",
    patientId: "rob",
    levelNumber: 8,
    chapterTitle: "LEVEL 8: DESTRUCTIVE WAVE CANCELLATION",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Dr. Lin",
    speakerTitle: "ICU Attending",
    text: "The Dengue NS1 protein biofilm oscillates at harmonic frequency 3.0 Hz. Superimpose a therapeutic wave with a 180° phase inversion to shatter the capsid!",
    vitals: { bpm: 102, temp: 37.5, platelets: 75, hematocrit: 44, bpSys: 110, bpDia: 72, stability: 72, phaseName: "LEVEL 8: WAVE DESTRUCTION", isEmergency: false },
    minigame: {
      type: "wave_game",
      patientName: "ROB",
      levelNum: 8,
      title: "Trigonometric Anti-Phase Superposition",
      targetFreq: 3.0
    },
    nextJump: "rob_level_9"
  },

  // Level R9: Compound Bouncing Parabola (Gravity + Ricochet)
  {
    id: "rob_level_9",
    patientId: "rob",
    levelNumber: 9,
    chapterTitle: "LEVEL 9: PARABOLIC RICOCHET TRAJECTORY",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Biosensor HUD",
    speakerTitle: "Hemodynamic Physics",
    text: "Convalescent reabsorption phase! Combine gravitational arc curvature with an endothelial ceiling ricochet to hit multiple surviving viral outposts.",
    vitals: { bpm: 90, temp: 37.0, platelets: 110, hematocrit: 42, bpSys: 115, bpDia: 76, stability: 82, phaseName: "LEVEL 9: GRAVITY + BOUNCE", isEmergency: false },
    minigame: {
      type: "vector_game",
      patientName: "ROB",
      levelNum: 9,
      title: "Parabolic Arc with Specular Ceiling Bounce",
      mathFormula: "y(t) = v_y·t + 1/2·g·t² ; v_y' = -v_y at y = y_wall",
      instruction: "Launch with a steep upward vector to bounce off the top wall under downward gravity, descending into the viral nests!",
      launcher: { x: 90, y: 360 },
      gravity: { x: 0, y: 0.18 },
      obstacles: [{ type: "rect", x: 400, y: 160, w: 40, h: 320, label: "ENDOTHELIAL FOLD" }],
      targets: [
        { x: 680, y: 360, r: 22, hp: 1 },
        { x: 840, y: 380, r: 22, hp: 1 }
      ],
      maxBounces: 3
    },
    nextJump: "rob_level_10"
  },

  // Level R10: Tangent Line Clearance
  {
    id: "rob_level_10",
    patientId: "rob",
    levelNumber: 10,
    chapterTitle: "LEVEL 10: TANGENT VECTOR PRECISION",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Dr. Lin",
    speakerTitle: "ICU Attending",
    text: "Fragile red blood cells form a protective ring around the viral cluster. Calculate the exact tangent line vector to skim past the cells without destroying them!",
    vitals: { bpm: 80, temp: 36.8, platelets: 145, hematocrit: 41, bpSys: 118, bpDia: 78, stability: 92, phaseName: "LEVEL 10: TANGENT PRECISION", isEmergency: false },
    minigame: {
      type: "vector_game",
      patientName: "ROB",
      levelNum: 10,
      title: "Circle Tangency Condition (d = r)",
      mathFormula: "Distance from Center d = |Ax + By + C| / √(A² + B²) = r",
      instruction: "Aim along the exact tangent line between the two red blood cell clusters to hit the central viral core!",
      launcher: { x: 90, y: 240 },
      obstacles: [
        { type: "circle", x: 440, y: 140, r: 60, label: "HEALTHY RBC" },
        { type: "circle", x: 440, y: 340, r: 60, label: "HEALTHY RBC" }
      ],
      targets: [{ x: 800, y: 240, r: 24, hp: 1 }]
    },
    nextJump: "rob_level_11"
  },

  // Level R11: Final Convergence (Respawn Vector Matrix)
  {
    id: "rob_level_11",
    patientId: "rob",
    levelNumber: 11,
    chapterTitle: "LEVEL 11: RESPAWN CONVERGENCE MATRIX",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Biosensor HUD",
    speakerTitle: "Final Discharge Telemetry",
    text: "Final multi-target viral eradication! Three remaining viral replication pockets remain. Execute the vector sequence to clear viremia and achieve full Respawn!",
    vitals: { bpm: 72, temp: 36.7, platelets: 165, hematocrit: 40, bpSys: 120, bpDia: 80, stability: 98, phaseName: "LEVEL 11: FINAL REBOUND", isEmergency: false },
    minigame: {
      type: "vector_game",
      patientName: "ROB",
      levelNum: 11,
      title: "Triple-Target Vector Clear",
      mathFormula: "Vector Set V = {v_1, v_2, v_3} | Convergence -> Sinus Rhythm 72 BPM",
      instruction: "Neutralize all 3 viral targets to stabilize Rob's vitals once and for all!",
      launcher: { x: 90, y: 240 },
      targets: [
        { x: 620, y: 120, r: 22, hp: 1 },
        { x: 740, y: 240, r: 22, hp: 1 },
        { x: 620, y: 360, r: 22, hp: 1 }
      ]
    },
    nextJump: "rob_victory"
  },

  // Rob Victory
  {
    id: "rob_victory",
    patientId: "rob",
    levelNumber: 11,
    chapterTitle: "EPILOGUE: ROB'S RESPAWN ACHIEVED",
    bg: "assets/images/rob_recovered.jpg",
    transition: "flash",
    speaker: "Rob",
    speakerTitle: "Sanitation Technician",
    text: "The road to recovery was long, but thanks to your mathematical precision... I made it! Let's get back to work!",
    bgm: "victory_respawn",
    vitals: { bpm: 72, temp: 36.7, platelets: 180, hematocrit: 40, bpSys: 120, bpDia: 80, stability: 100, phaseName: "RESPAWNED & IMMUNE", isEmergency: false }
  }
];

// ==============================================================================
// PATIENT 2: ELENA CHEN (Middle Class) - 11 Mathematical Recovery Levels
// ==============================================================================
const ELENA_SCRIPT = [
  {
    id: "elena_prologue_1",
    patientId: "elena",
    levelNumber: 0,
    chapterTitle: "PROLOGUE: THE SUBURBAN GARDEN",
    bg: "assets/images/elena_bitten.jpg",
    speaker: "Elena Chen",
    speakerTitle: "High School Geometry Teacher",
    text: "I was just watering the garden by the rainwater collection barrel after grading trigonometry exams. Then came that sharp sting on my wrist...",
    bgm: "basement_dark",
    vitals: { bpm: 82, temp: 37.1, platelets: 240, hematocrit: 40, bpSys: 118, bpDia: 76, stability: 92, phaseName: "SUBURBAN INFECTION", isEmergency: false },
    actions: [{ type: "sfx_buzz", duration: 2.2 }]
  },
  {
    id: "elena_prologue_hospital",
    patientId: "elena",
    levelNumber: 0,
    chapterTitle: "SCENE 2: COMMUNITY HOSPITAL",
    bg: "assets/images/hospital_icu.jpg",
    transition: "flash",
    speaker: "Narrator",
    speakerTitle: "Community Ward",
    text: "A teacher whose life is built on proofs and geometry now faces the chaos of Dengue shock. Her core temp hits 40.0°C and platelets are tumbling!",
    bgm: "icu_tension",
    vitals: { bpm: 135, temp: 40.0, platelets: 36, hematocrit: 51, bpSys: 86, bpDia: 55, stability: 24, phaseName: "CRITICAL FEBRILE", isEmergency: true },
    actions: [{ type: "sfx_flash" }, { type: "sfx_heart_loop", bpm: 135 }],
    nextJump: "elena_level_1"
  },

  // Level E1: 45-Degree Optimal Range Angle
  {
    id: "elena_level_1",
    patientId: "elena",
    levelNumber: 1,
    chapterTitle: "LEVEL 1: OPTIMAL LAUNCH ANGLE PROOF",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Elena Chen",
    speakerTitle: "Patient / Educator",
    text: "In classical mechanics, projectile range R is maximized at launch angle θ = 45° where sin(2θ) = 1. Launch the crystalloid vector across the arterial span!",
    vitals: { bpm: 132, temp: 39.9, platelets: 58, hematocrit: 49, bpSys: 88, bpDia: 58, stability: 30, phaseName: "LEVEL 1: RANGE PROOF", isEmergency: true },
    minigame: {
      type: "vector_game",
      patientName: "ELENA",
      levelNum: 1,
      title: "Maximum Range Angle Proof (R = v²·sin(2θ) / g)",
      mathFormula: "dR/dθ = 2v²·cos(2θ)/g = 0  =>  2θ = 90°  =>  θ = 45°",
      instruction: "Set angle close to 45° with calibrated magnitude to span the arterial distance and strike the virion!",
      launcher: { x: 80, y: 380 },
      gravity: { x: 0, y: 0.16 },
      targets: [{ x: 820, y: 380, r: 24, hp: 1 }]
    },
    nextJump: "elena_level_2"
  },

  // Level E2: Specular Reflection off Non-Parallel Walls
  {
    id: "elena_level_2",
    patientId: "elena",
    levelNumber: 2,
    chapterTitle: "LEVEL 2: VASCULAR REFLECTION THEOREM",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Elena Chen",
    speakerTitle: "Patient / Educator",
    text: "The capillary walls form a non-parallel corridor. The angle of incidence equals the angle of reflection. Bank the antibody off the tapered vessel!",
    vitals: { bpm: 136, temp: 39.8, platelets: 46, hematocrit: 50, bpSys: 86, bpDia: 56, stability: 36, phaseName: "LEVEL 2: REFLECTION THEOREM", isEmergency: true },
    minigame: {
      type: "vector_game",
      patientName: "ELENA",
      levelNum: 2,
      title: "Specular Bank Shot Theorem (θ_i = θ_r)",
      mathFormula: "n̂ = (-sinα, cosα) | v' = v - 2(v·n̂)n̂",
      instruction: "Calculate the bounce angle off the upper vessel wall to deflect past the swollen tissue!",
      launcher: { x: 90, y: 140 },
      obstacles: [{ type: "rect", x: 420, y: 100, w: 40, h: 280, label: "EDEMATOUS SEPTUM" }],
      targets: [{ x: 800, y: 340, r: 24, hp: 1 }],
      maxBounces: 3
    },
    nextJump: "elena_level_3"
  },

  // Level E3: Drag Force & Fluid Viscosity Parabola
  {
    id: "elena_level_3",
    patientId: "elena",
    levelNumber: 3,
    chapterTitle: "LEVEL 3: VISCOUS DRAG & PARABOLIC DESCENT",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Biosensor HUD",
    speakerTitle: "Hematology Physics",
    text: "Hemoconcentration increases blood viscosity. Drag deceleration acts against velocity. Adjust vector magnitude to overcome viscous drag!",
    vitals: { bpm: 130, temp: 39.5, platelets: 38, hematocrit: 52, bpSys: 90, bpDia: 58, stability: 42, phaseName: "LEVEL 3: VISCOUS VECTOR", isEmergency: true },
    minigame: {
      type: "vector_game",
      patientName: "ELENA",
      levelNum: 3,
      title: "Viscous Drag Compensation (F_d = -b·v)",
      mathFormula: "m·dv/dt = m·g - b·v | Terminal Velocity v_t = m·g / b",
      instruction: "Compensate for viscosity and downward gravity to hit the deep capillary virion!",
      launcher: { x: 90, y: 360 },
      gravity: { x: 0, y: 0.25 },
      obstacles: [{ type: "rect", x: 460, y: 200, w: 40, h: 280, label: "FIBRIN PLUG" }],
      targets: [{ x: 820, y: 380, r: 24, hp: 1 }]
    },
    nextJump: "elena_level_4"
  },

  // Level E4: Convex Hull Triangulation Seal
  {
    id: "elena_level_4",
    patientId: "elena",
    levelNumber: 4,
    chapterTitle: "LEVEL 4: CONVEX HULL CAPILLARY MESH",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Elena Chen",
    speakerTitle: "Patient / Educator",
    text: "Capillary extravasation detected! We need to construct a Delaunay triangulation covering the convex hull of the leaking endothelial pore.",
    vitals: { bpm: 126, temp: 39.1, platelets: 32, hematocrit: 51, bpSys: 92, bpDia: 60, stability: 48, phaseName: "LEVEL 4: CONVEX HULL", isEmergency: true },
    minigame: {
      type: "polygon_game",
      patientName: "ELENA",
      levelNum: 4,
      title: "Convex Hull Delaunay Triangulation Mesh",
      targetTriangles: 4
    },
    nextJump: "elena_level_5"
  },

  // Level E5: 2D Rotation Matrix (Epitope Alignment)
  {
    id: "elena_level_5",
    patientId: "elena",
    levelNumber: 5,
    chapterTitle: "LEVEL 5: ORTHOGONAL ROTATION MATRIX",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Elena Chen",
    speakerTitle: "Patient / Educator",
    text: "The Fab fragment of the antibody must rotate by transformation matrix R(θ) = [[cosθ, -sinθ], [sinθ, cosθ]] to match the viral binding pocket!",
    vitals: { bpm: 118, temp: 38.7, platelets: 42, hematocrit: 48, bpSys: 96, bpDia: 64, stability: 56, phaseName: "LEVEL 5: ROTATION PROOF", isEmergency: false },
    minigame: {
      type: "transform_game",
      patientName: "ELENA",
      levelNum: 5,
      title: "Orthogonal Coordinate Transformation",
      targetRot: 210,
      targetScale: 1.25
    },
    nextJump: "elena_level_6"
  },

  // Level E6: Hyperbolic Slingshot Escape
  {
    id: "elena_level_6",
    patientId: "elena",
    levelNumber: 6,
    chapterTitle: "LEVEL 6: HYPERBOLIC ORBITAL DIVERSION",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Biosensor HUD",
    speakerTitle: "Cellular Mechanics",
    text: "A lymphocyte cell nucleus creates a radial central potential V(r) = -k/r. Sling the probe along a hyperbolic trajectory to skirt around calcified plaque!",
    vitals: { bpm: 110, temp: 38.2, platelets: 52, hematocrit: 46, bpSys: 102, bpDia: 68, stability: 64, phaseName: "LEVEL 6: HYPERBOLIC SLINGSHOT", isEmergency: false },
    minigame: {
      type: "vector_game",
      patientName: "ELENA",
      levelNum: 6,
      title: "Hyperbolic Orbit Slingshot (Energy E > 0)",
      mathFormula: "r(θ) = p / (1 + e·cosθ) | e = √(1 + 2EL²/μ²) > 1",
      instruction: "Use the lymphocyte's gravitational pull to whip the antibody around the barrier into the target!",
      launcher: { x: 90, y: 120 },
      gravityWells: [{ x: 440, y: 240, r: 35, mass: 900, name: "LYMPHOCYTE" }],
      obstacles: [{ type: "rect", x: 420, y: 320, w: 40, h: 140, label: "PLAQUE" }],
      targets: [{ x: 820, y: 360, r: 24, hp: 1 }]
    },
    nextJump: "elena_level_7"
  },

  // Level E7: Destructive Trigonometric Interference
  {
    id: "elena_level_7",
    patientId: "elena",
    levelNumber: 7,
    chapterTitle: "LEVEL 7: FOURIER DESTRUCTIVE INTERFERENCE",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Elena Chen",
    speakerTitle: "Patient / Educator",
    text: "The viral capsid vibrates at fundamental frequency 2.4 Hz. By the principle of linear superposition, a 180° phase inversion will cause complete amplitude cancellation!",
    vitals: { bpm: 104, temp: 37.8, platelets: 68, hematocrit: 44, bpSys: 108, bpDia: 72, stability: 72, phaseName: "LEVEL 7: SUPERPOSITION CANCELLATION", isEmergency: false },
    minigame: {
      type: "wave_game",
      patientName: "ELENA",
      levelNum: 7,
      title: "Fourier Phase Inversion Cancellation",
      targetFreq: 2.4
    },
    nextJump: "elena_level_8"
  },

  // Level E8: Triple Bank Reflector
  {
    id: "elena_level_8",
    patientId: "elena",
    levelNumber: 8,
    chapterTitle: "LEVEL 8: TRIPLE-WALL BILLIARD THEOREM",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Elena Chen",
    speakerTitle: "Patient / Educator",
    text: "Tortuous microvascular maze! A direct line of sight is impossible. Calculate a 3-wall ricochet path: ceiling, floor, then back ceiling!",
    vitals: { bpm: 95, temp: 37.3, platelets: 88, hematocrit: 43, bpSys: 112, bpDia: 74, stability: 80, phaseName: "LEVEL 8: TRIPLE BANK", isEmergency: false },
    minigame: {
      type: "vector_game",
      patientName: "ELENA",
      levelNum: 8,
      title: "3-Wall Specular Ricochet Geometry",
      mathFormula: "Cumulative Rotation Δθ = ∑ (180° - 2θ_i) | 3 Wall Bounces",
      instruction: "Calculate the precise vector angle to bounce 3 times off alternate walls to reach the secluded viral sanctuary!",
      launcher: { x: 90, y: 240 },
      obstacles: [
        { type: "rect", x: 320, y: 40, w: 30, h: 280, label: "VESSEL FOLD 1" },
        { type: "rect", x: 540, y: 160, w: 30, h: 280, label: "VESSEL FOLD 2" }
      ],
      targets: [{ x: 840, y: 240, r: 24, hp: 1 }],
      maxBounces: 5
    },
    nextJump: "elena_level_9"
  },

  // Level E9: Compound Gravity & Ricochet
  {
    id: "elena_level_9",
    patientId: "elena",
    levelNumber: 9,
    chapterTitle: "LEVEL 9: BALLISTIC RICOCHET CONVERGENCE",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Biosensor HUD",
    speakerTitle: "Hemodynamic Monitor",
    text: "Convalescent reabsorption phase! Balance gravitational trajectory curvature with an endothelial bounce to clear paired viral remnants.",
    vitals: { bpm: 86, temp: 37.0, platelets: 120, hematocrit: 41, bpSys: 116, bpDia: 76, stability: 88, phaseName: "LEVEL 9: BALLISTIC REBOUND", isEmergency: false },
    minigame: {
      type: "vector_game",
      patientName: "ELENA",
      levelNum: 9,
      title: "Compound Ballistic Gravity Parabola",
      mathFormula: "d²y/dt² = g ; v_y(t+) = -v_y(t-) | Dual Target Intercept",
      instruction: "Loft the probe to ricochet off the upper boundary and rain down upon both viral targets!",
      launcher: { x: 90, y: 380 },
      gravity: { x: 0, y: 0.2 },
      obstacles: [{ type: "rect", x: 420, y: 180, w: 40, h: 300, label: "VALVE FLAP" }],
      targets: [
        { x: 660, y: 360, r: 22, hp: 1 },
        { x: 820, y: 380, r: 22, hp: 1 }
      ],
      maxBounces: 3
    },
    nextJump: "elena_level_10"
  },

  // Level E10: Tangent Line Skim
  {
    id: "elena_level_10",
    patientId: "elena",
    levelNumber: 10,
    chapterTitle: "LEVEL 10: OSCULATING TANGENT THEOREM",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Elena Chen",
    speakerTitle: "Patient / Educator",
    text: "We must skim the tangent line between healthy circulating erythrocyte boundaries without causing cellular hemolysis. Precision angle vector required!",
    vitals: { bpm: 78, temp: 36.8, platelets: 150, hematocrit: 40, bpSys: 118, bpDia: 78, stability: 94, phaseName: "LEVEL 10: TANGENCY PROOF", isEmergency: false },
    minigame: {
      type: "vector_game",
      patientName: "ELENA",
      levelNum: 10,
      title: "Osculating Circle Tangency",
      mathFormula: "Line L ⊥ Radius R at Point of Tangency (x_0, y_0)",
      instruction: "Find the tangent vector between the two cellular barriers to strike the virus dead center!",
      launcher: { x: 90, y: 240 },
      obstacles: [
        { type: "circle", x: 440, y: 130, r: 65, label: "CELL A" },
        { type: "circle", x: 440, y: 350, r: 65, label: "CELL B" }
      ],
      targets: [{ x: 800, y: 240, r: 24, hp: 1 }]
    },
    nextJump: "elena_level_11"
  },

  // Level E11: Q.E.D. Final Vector Convergence
  {
    id: "elena_level_11",
    patientId: "elena",
    levelNumber: 11,
    chapterTitle: "LEVEL 11: RECOVERY CONVERGENCE: Q.E.D.",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Elena Chen",
    speakerTitle: "Patient / Educator",
    text: "Final proof complete: Quod Erat Demonstrandum! Eliminate the final 3 viral colonies to restore homeostasis and return me to my geometry classroom!",
    vitals: { bpm: 72, temp: 36.7, platelets: 175, hematocrit: 40, bpSys: 120, bpDia: 80, stability: 100, phaseName: "LEVEL 11: Q.E.D. PROOF COMPLETE", isEmergency: false },
    minigame: {
      type: "vector_game",
      patientName: "ELENA",
      levelNum: 11,
      title: "Tri-Vector Convergence (Q.E.D.)",
      mathFormula: "lim(t→∞) Viremia(t) = 0 | Platelets = 175k | Sinus Rhythm 72 BPM",
      instruction: "Clear all 3 targets to conclude Elena's mathematical recovery!",
      launcher: { x: 90, y: 240 },
      targets: [
        { x: 620, y: 130, r: 22, hp: 1 },
        { x: 750, y: 240, r: 22, hp: 1 },
        { x: 620, y: 350, r: 22, hp: 1 }
      ]
    },
    nextJump: "elena_victory"
  },

  // Elena Victory
  {
    id: "elena_victory",
    patientId: "elena",
    levelNumber: 11,
    chapterTitle: "EPILOGUE: ELENA'S RECOVERY ACHIEVED",
    bg: "assets/images/rob_recovered.jpg",
    transition: "flash",
    speaker: "Elena Chen",
    speakerTitle: "High School Geometry Teacher",
    text: "Mathematics and medicine triumphed together. The fever broke, my vitals are stabilized, and class is back in session!",
    bgm: "victory_respawn",
    vitals: { bpm: 72, temp: 36.7, platelets: 185, hematocrit: 40, bpSys: 120, bpDia: 80, stability: 100, phaseName: "DISCHARGED & IMMUNE", isEmergency: false }
  }
];

// ==============================================================================
// PATIENT 3: JULIAN VANCE (Upper Class) - 11 Mathematical Recovery Levels
// ==============================================================================
const JULIAN_SCRIPT = [
  {
    id: "julian_prologue_1",
    patientId: "julian",
    levelNumber: 0,
    chapterTitle: "PROLOGUE: LUXURY INFINITY POOL",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Julian Vance",
    speakerTitle: "Tech Venture Capitalist",
    text: "I thought my private estate was impenetrable. Filtered air, perimeter misters... yet one Aedes mosquito at the edge of the infinity pool pierced my arm.",
    bgm: "basement_dark",
    vitals: { bpm: 84, temp: 37.2, platelets: 250, hematocrit: 42, bpSys: 125, bpDia: 82, stability: 90, phaseName: "PENTHOUSE OUTBREAK", isEmergency: false },
    actions: [{ type: "sfx_buzz", duration: 2.2 }]
  },
  {
    id: "julian_prologue_hospital",
    patientId: "julian",
    levelNumber: 0,
    chapterTitle: "SCENE 2: VIP CONCIERGE PENTHOUSE ICU",
    bg: "assets/images/hospital_icu.jpg",
    transition: "flash",
    speaker: "Biosensor HUD",
    speakerTitle: "Concierge Bio-Telemetry",
    text: "All the wealth in the world cannot stop DENV-2 viremia from attacking cellular endothelium. Vitals crashing, core temperature 40.3°C, platelets dropping!",
    bgm: "icu_tension",
    vitals: { bpm: 142, temp: 40.3, platelets: 30, hematocrit: 54, bpSys: 82, bpDia: 52, stability: 20, phaseName: "CRITICAL DSS THREAT", isEmergency: true },
    actions: [{ type: "sfx_flash" }, { type: "sfx_heart_loop", bpm: 142 }],
    nextJump: "julian_level_1"
  },

  // Level J1: Nano-Drone Vector Calibration
  {
    id: "julian_level_1",
    patientId: "julian",
    levelNumber: 1,
    chapterTitle: "LEVEL 1: NANO-DRONE VECTOR PULSE",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Julian Vance",
    speakerTitle: "Venture Capitalist",
    text: "My medical concierge deployed laser-guided synthetic nanobots. Calibrate the vector velocity magnitude |v| and angle θ to eliminate the viral vanguard!",
    vitals: { bpm: 138, temp: 40.2, platelets: 52, hematocrit: 52, bpSys: 86, bpDia: 56, stability: 28, phaseName: "LEVEL 1: NANO-VECTOR", isEmergency: true },
    minigame: {
      type: "vector_game",
      patientName: "JULIAN",
      levelNum: 1,
      title: "Synthetic Nano-Drone Vector Targeting",
      mathFormula: "v = (v_x, v_y) | Precision Laser Reticle Error ε < 0.01",
      instruction: "Calibrate the nano-drone vector velocity and angle to strike the primary virion!",
      launcher: { x: 90, y: 240 },
      targets: [{ x: 800, y: 240, r: 24, hp: 1 }]
    },
    nextJump: "julian_level_2"
  },

  // Level J2: Prismatic Titanium Stent Ricochet
  {
    id: "julian_level_2",
    patientId: "julian",
    levelNumber: 2,
    chapterTitle: "LEVEL 2: TITANIUM STENT RICOCHET",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Biosensor HUD",
    speakerTitle: "Concierge Bio-Telemetry",
    text: "A platinum micro-stent reflects incoming beams. Use specular reflection off the stent boundary (θ_i = θ_r) to hit the virion shielded by cellular debris.",
    vitals: { bpm: 140, temp: 40.0, platelets: 42, hematocrit: 53, bpSys: 84, bpDia: 54, stability: 34, phaseName: "LEVEL 2: STENT REFLECTION", isEmergency: true },
    minigame: {
      type: "vector_game",
      patientName: "JULIAN",
      levelNum: 2,
      title: "Specular Bank off Stent Surface",
      mathFormula: "v' = v - 2(v·n̂)n̂ | Coefficient of Restitution e = 1.0",
      instruction: "Bank the synthetic nano-drone off the upper vessel wall to bypass the central barrier!",
      launcher: { x: 90, y: 150 },
      obstacles: [{ type: "rect", x: 420, y: 110, w: 40, h: 260, label: "CELLULAR DEBRIS" }],
      targets: [{ x: 800, y: 330, r: 24, hp: 1 }],
      maxBounces: 3
    },
    nextJump: "julian_level_3"
  },

  // Level J3: Dialysis Microgravity Parabola
  {
    id: "julian_level_3",
    patientId: "julian",
    levelNumber: 3,
    chapterTitle: "LEVEL 3: DIALYSIS GRAVITY GRADIENT",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Dr. Lin",
    speakerTitle: "VIP Attending",
    text: "Continuous veno-venous hemofiltration creates an artificial pressure gradient. Compensate for the vertical gravity acceleration vector along the parabolic arc!",
    vitals: { bpm: 132, temp: 39.6, platelets: 36, hematocrit: 51, bpSys: 88, bpDia: 58, stability: 40, phaseName: "LEVEL 3: DIALYSIS PARABOLA", isEmergency: true },
    minigame: {
      type: "vector_game",
      patientName: "JULIAN",
      levelNum: 3,
      title: "Parabolic Trajectory under Hemofiltration Field",
      mathFormula: "y(t) = v_y·t + 1/2·g·t² | g = 0.24 px/frame²",
      instruction: "Loft the nano-drone over the filtration barrier to strike the sunken viral colony!",
      launcher: { x: 90, y: 380 },
      gravity: { x: 0, y: 0.24 },
      obstacles: [{ type: "rect", x: 440, y: 210, w: 40, h: 270, label: "FILTRATION WALL" }],
      targets: [{ x: 820, y: 390, r: 24, hp: 1 }]
    },
    nextJump: "julian_level_4"
  },

  // Level J4: Gold Nano-Lattice Triangulation
  {
    id: "julian_level_4",
    patientId: "julian",
    levelNumber: 4,
    chapterTitle: "LEVEL 4: DELAUNAY NANO-LATTICE REPAIR",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Julian Vance",
    speakerTitle: "Venture Capitalist",
    text: "The plasma leakage is critical. Inject synthetic gold-fibrin nanoparticles and triangulate the vertices to form an impermeable geometric seal!",
    vitals: { bpm: 138, temp: 39.3, platelets: 30, hematocrit: 54, bpSys: 82, bpDia: 52, stability: 32, phaseName: "LEVEL 4: NANO-LATTICE", isEmergency: true },
    minigame: {
      type: "polygon_game",
      patientName: "JULIAN",
      levelNum: 4,
      title: "Synthetic Gold-Fibrin Polygonal Lattice",
      targetTriangles: 4
    },
    nextJump: "julian_level_5"
  },

  // Level J5: 2D Transformation Matrix (Nanobody Assembly)
  {
    id: "julian_level_5",
    patientId: "julian",
    levelNumber: 5,
    chapterTitle: "LEVEL 5: AFFINE DOCKING TRANSFORMATION",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Biosensor HUD",
    speakerTitle: "Concierge Bio-Telemetry",
    text: "To lock onto the NS1 hexameric lipid channel, apply coordinate transformation matrix T(θ, S) to orient the synthetic neutralizing nanocage!",
    vitals: { bpm: 120, temp: 38.8, platelets: 40, hematocrit: 49, bpSys: 94, bpDia: 62, stability: 52, phaseName: "LEVEL 5: AFFINE DOCKING", isEmergency: false },
    minigame: {
      type: "transform_game",
      patientName: "JULIAN",
      levelNum: 5,
      title: "Affine Receptor Docking Matrix",
      targetRot: 285,
      targetScale: 1.45
    },
    nextJump: "julian_level_6"
  },

  // Level J6: Magnetophoretic Gravity Slingshot
  {
    id: "julian_level_6",
    patientId: "julian",
    levelNumber: 6,
    chapterTitle: "LEVEL 6: MAGNETOPHORETIC SLINGSHOT",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Dr. Lin",
    speakerTitle: "VIP Attending",
    text: "A paramagnetic iron core in the micro-filter creates a radial attraction field. Execute a high-velocity orbital slingshot around the core!",
    vitals: { bpm: 112, temp: 38.2, platelets: 50, hematocrit: 46, bpSys: 100, bpDia: 66, stability: 62, phaseName: "LEVEL 6: MAGNETIC SLINGSHOT", isEmergency: false },
    minigame: {
      type: "vector_game",
      patientName: "JULIAN",
      levelNum: 6,
      title: "Magnetophoretic Central Force Slingshot",
      mathFormula: "F_m = ∇(m · B) ∝ 1/r² | Hyperbolic Deflection Angle δ",
      instruction: "Slingshot the nano-drone through the magnetic well around the obstacle into the viral target!",
      launcher: { x: 90, y: 120 },
      gravityWells: [{ x: 440, y: 240, r: 35, mass: 1000, name: "MAGNETIC CORE" }],
      obstacles: [{ type: "rect", x: 420, y: 320, w: 40, h: 140, label: "SHIELD" }],
      targets: [{ x: 800, y: 360, r: 24, hp: 1 }]
    },
    nextJump: "julian_level_7"
  },

  // Level J7: Ultrasonic Acoustic Shockwave Cancellation
  {
    id: "julian_level_7",
    patientId: "julian",
    levelNumber: 7,
    chapterTitle: "LEVEL 7: ULTRASONIC CAVITATION RESONANCE",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Biosensor HUD",
    speakerTitle: "Concierge Bio-Telemetry",
    text: "Target the viral capsid envelope using focused ultrasound. Adjust the destructive phase offset to 180° to rupture the viral envelope with zero tissue damage!",
    vitals: { bpm: 105, temp: 37.6, platelets: 65, hematocrit: 44, bpSys: 106, bpDia: 70, stability: 70, phaseName: "LEVEL 7: ULTRASONIC CAVITATION", isEmergency: false },
    minigame: {
      type: "wave_game",
      patientName: "JULIAN",
      levelNum: 7,
      title: "Harmonic Ultrasonic Destructive Interference",
      targetFreq: 3.6
    },
    nextJump: "julian_level_8"
  },

  // Level J8: Quad-Bank Ricochet Maze
  {
    id: "julian_level_8",
    patientId: "julian",
    levelNumber: 8,
    chapterTitle: "LEVEL 8: 4-WALL GEOMETRIC BILLIARD",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Julian Vance",
    speakerTitle: "Venture Capitalist",
    text: "Complex coronary micro-branches shield the viral reservoir. Calculate a multi-bounce quad ricochet to navigate the arterial bifurcation!",
    vitals: { bpm: 98, temp: 37.3, platelets: 82, hematocrit: 42, bpSys: 112, bpDia: 74, stability: 78, phaseName: "LEVEL 8: QUAD-RICOCHET", isEmergency: false },
    minigame: {
      type: "vector_game",
      patientName: "JULIAN",
      levelNum: 8,
      title: "Multi-Wall Specular Reflection Sequence",
      mathFormula: "Reflection Vector v_n+1 = v_n - 2(v_n·n̂)n̂ | 4 Wall Bounces",
      instruction: "Calculate the exact launch vector to bounce repeatedly and thread the needle through the arterial maze!",
      launcher: { x: 90, y: 240 },
      obstacles: [
        { type: "rect", x: 330, y: 50, w: 30, h: 270, label: "STENT A" },
        { type: "rect", x: 550, y: 160, w: 30, h: 270, label: "STENT B" }
      ],
      targets: [{ x: 840, y: 240, r: 24, hp: 1 }],
      maxBounces: 5
    },
    nextJump: "julian_level_9"
  },

  // Level J9: Compound Ballistic Gravity & Ricochet
  {
    id: "julian_level_9",
    patientId: "julian",
    levelNumber: 9,
    chapterTitle: "LEVEL 9: BALLISTIC REABSORPTION TITRATION",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Dr. Lin",
    speakerTitle: "VIP Attending",
    text: "Convalescent reabsorption begins! Taper the IV colloid pumps. Combine ceiling ricochet with downward gravity to clear paired viral remnants.",
    vitals: { bpm: 88, temp: 37.0, platelets: 115, hematocrit: 41, bpSys: 116, bpDia: 76, stability: 86, phaseName: "LEVEL 9: REABSORPTION", isEmergency: false },
    minigame: {
      type: "vector_game",
      patientName: "JULIAN",
      levelNum: 9,
      title: "Ballistic Gravity with Specular Wall Bounce",
      mathFormula: "Trajectory = Parabola + Specular Discontinuity at Wall",
      instruction: "Bank off the ceiling under downward gravity to strike both targets!",
      launcher: { x: 90, y: 380 },
      gravity: { x: 0, y: 0.19 },
      obstacles: [{ type: "rect", x: 420, y: 170, w: 40, h: 310, label: "BAFFLE" }],
      targets: [
        { x: 670, y: 360, r: 22, hp: 1 },
        { x: 830, y: 380, r: 22, hp: 1 }
      ],
      maxBounces: 3
    },
    nextJump: "julian_level_10"
  },

  // Level J10: Tangent Vector Skim
  {
    id: "julian_level_10",
    patientId: "julian",
    levelNumber: 10,
    chapterTitle: "LEVEL 10: OSCULATING TANGENT PRECISION",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Biosensor HUD",
    speakerTitle: "Concierge Bio-Telemetry",
    text: "Clear the final arterial junction by aiming along the exact tangent vector between sensitive blood vessel bends!",
    vitals: { bpm: 80, temp: 36.8, platelets: 148, hematocrit: 40, bpSys: 118, bpDia: 78, stability: 94, phaseName: "LEVEL 10: TANGENT SKIM", isEmergency: false },
    minigame: {
      type: "vector_game",
      patientName: "JULIAN",
      levelNum: 10,
      title: "Arterial Curvature Tangency",
      mathFormula: "Tangent Vector T̂ = dr/ds | Curvature κ = |dT̂/ds|",
      instruction: "Skim between the cellular boundaries along the tangent line to strike the viral colony!",
      launcher: { x: 90, y: 240 },
      obstacles: [
        { type: "circle", x: 440, y: 130, r: 65, label: "TISSUE A" },
        { type: "circle", x: 440, y: 350, r: 65, label: "TISSUE B" }
      ],
      targets: [{ x: 800, y: 240, r: 24, hp: 1 }]
    },
    nextJump: "julian_level_11"
  },

  // Level J11: Global Swarm Convergence
  {
    id: "julian_level_11",
    patientId: "julian",
    levelNumber: 11,
    chapterTitle: "LEVEL 11: VIP PENTHOUSE RESPAWN",
    bg: "assets/images/hospital_icu.jpg",
    speaker: "Julian Vance",
    speakerTitle: "Venture Capitalist",
    text: "The final nano-drone barrage! Neutralize the last 3 viral pockets to restore my vitals to 100% and close the ledger on this infection!",
    vitals: { bpm: 72, temp: 36.7, platelets: 180, hematocrit: 40, bpSys: 120, bpDia: 80, stability: 100, phaseName: "LEVEL 11: COMPLETE RESPAWN", isEmergency: false },
    minigame: {
      type: "vector_game",
      patientName: "JULIAN",
      levelNum: 11,
      title: "Global Nano-Swarm Multi-Target Clearance",
      mathFormula: "Global Vector Matrix ∑ v_i -> Equilibrium Homeostasis",
      instruction: "Eliminate all 3 remaining targets to complete Julian's recovery!",
      launcher: { x: 90, y: 240 },
      targets: [
        { x: 620, y: 130, r: 22, hp: 1 },
        { x: 750, y: 240, r: 22, hp: 1 },
        { x: 620, y: 350, r: 22, hp: 1 }
      ]
    },
    nextJump: "julian_victory"
  },

  // Julian Victory
  {
    id: "julian_victory",
    patientId: "julian",
    levelNumber: 11,
    chapterTitle: "EPILOGUE: JULIAN'S RESPAWN ACHIEVED",
    bg: "assets/images/rob_recovered.jpg",
    transition: "flash",
    speaker: "Julian Vance",
    speakerTitle: "Venture Capitalist",
    text: "Money bought the technology, but pure mathematical geometry won the battle. My vitals are pristine. Back to the markets!",
    bgm: "victory_respawn",
    vitals: { bpm: 72, temp: 36.7, platelets: 190, hematocrit: 40, bpSys: 120, bpDia: 80, stability: 100, phaseName: "RESPAWNED & IMMUNE", isEmergency: false }
  }
];

// Helper to get active script based on chosen patient
window.getPatientScript = function(patientId = "rob") {
  if (patientId === "elena") return ELENA_SCRIPT;
  if (patientId === "julian") return JULIAN_SCRIPT;
  return ROB_SCRIPT;
};

window.VN_STORY_SCRIPT = ROB_SCRIPT;
