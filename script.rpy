# ==============================================================================
# RESPAWN: CRITICAL RECOVERY - REN'PY SCRIPT DEFINITIONS
# 3 Socioeconomic Campaigns: Rob (Working), Elena (Middle), Julian (Upper)
# 33 Pure Mathematical & Geometric Recovery Levels (Zero Quiz Questions)
# ==============================================================================

define narrator = Character(None)
define rob = Character("Rob", color="#38bdf8")
define elena = Character("Elena Chen", color="#a78bfa")
define julian = Character("Julian Vance", color="#fbbf24")
define lin = Character("Dr. Lin", color="#34d399")
define hud = Character("Biosensor HUD", color="#f59e0b")

# Asset Images
image bg flooded_basement = "assets/images/basement.jpg"
image rob bitten = "assets/images/rob_bitten.jpg"
image elena bitten = "assets/images/elena_bitten.jpg"
image bg hospital_room = "assets/images/hospital_icu.jpg"
image bg bloodstream = "assets/images/bloodstream.jpg"
image bg victory = "assets/images/rob_recovered.jpg"

label start:
    menu:
        "Select Patient Campaign:"

        "1. ROB (Working Class • Sanitation Worker • City General ICU)":
            jump rob_campaign

        "2. ELENA CHEN (Middle Class • Geometry Teacher • Community Ward)":
            jump elena_campaign

        "3. JULIAN VANCE (Upper Class • Tech Investor • VIP Penthouse Suite)":
            jump julian_campaign

# ==============================================================================
# CAMPAIGN 1: ROB (Working Class) - 11 Geometric Levels
# ==============================================================================
label rob_campaign:
    scene bg flooded_basement
    narrator "Rob spends his days fixing clogged drains and flooded basements—a prime breeding ground for mosquitoes."
    rob "Ugh... another dark basement pipe rusted through. What was that buzzing sound...?"

    play sound "audio/mosquito_buzz.mp3"
    show layer master with hpunch
    show rob bitten with dissolve
    narrator "One infected bite sent severe Dengue straight into his bloodstream."

    # Scene 2
    play sound "audio/heart_monitor_fast.wav" loop
    scene bg hospital_room with flash
    narrator "His fever is spiking, his vitals are crashing, and time is running out."

    # Scene 3
    show layer master with vpunch
    narrator "Guide Rob through 10 critical recovery levels, fight off the pathogen, and bring him back from the brink!"

    # Level R1: Vector Trajectory
    lin "Rob's core temp is 40.1°C! Launch the crystalloid vector probe to strike the primary virion."
    $ trigger_math_minigame("vector_game", level=1, formula="v = (v_x, v_y) | θ = atan2(dy, dx)")

    # Level R2: Specular Ricochet (Wall Bounce)
    lin "Central thrombus detected! Use endothelial specular reflection (θ_i = θ_r) off the vessel wall."
    $ trigger_math_minigame("vector_game", level=2, formula="v' = v - 2(v·n̂)n̂ | θ_reflect = -θ_incident")

    # Level R3: Parabolic Fluid Gravity
    hud "Hydrodynamic pressure generates gravity g = 0.22. Account for parabolic arc y(t) = v_y·t + 1/2·g·t²!"
    $ trigger_math_minigame("vector_game", level=3, formula="y(t) = v_y·t + 1/2·g·t²")

    # Level R4: Delaunay Polygonal Mesh
    lin "Microvascular fissures! Construct Delaunay triangles between bleeding nodes to seal capillary leakage."
    $ trigger_math_minigame("polygon_game", level=4, formula="Area = 1/2 |∑ (x_i y_{i+1} - x_{i+1} y_i)|")

    # Level R5: 2-Bounce Ricochet
    hud "Double-wall endothelial fold! Calculate a 2-bounce billiard sequence off ceiling and floor."
    $ trigger_math_minigame("vector_game", level=5, formula="2-Bounce Billiard Reflection Sequence")

    # Level R6: 2D Transformation Matrix
    lin "Rotate and dilate the antibody construct by transformation matrix R(θ) to match the viral dock."
    $ trigger_math_minigame("transform_game", level=6, formula="R(θ) = [[cosθ, -sinθ], [sinθ, cosθ]]")

    # Level R7: Centripetal Gravity Slingshot
    hud "Macrophage gravitational well 1/r²! Execute a hyperbolic slingshot to whip around the barrier."
    $ trigger_math_minigame("vector_game", level=7, formula="F_g = -μ/r² · r̂ | Hyperbolic Orbit e > 1")

    # Level R8: Destructive Wave Superposition
    lin "DENV NS1 biofilm resonates at 3.0 Hz. Superimpose 180° phase inversion wave to collapse the capsid!"
    $ trigger_math_minigame("wave_game", level=8, formula="y_total = A·sin(ωt) + A·sin(ωt + 180°) = 0")

    # Level R9: Compound Bouncing Parabola
    hud "Convalescent reabsorption! Combine downward gravity with specular ceiling bounce to clear dual targets."
    $ trigger_math_minigame("vector_game", level=9, formula="Parabolic Arc + Wall Bounce Discontinuity")

    # Level R10: Tangent Vector Precision
    lin "Skim the exact tangent line between healthy erythrocytes without causing hemolysis."
    $ trigger_math_minigame("vector_game", level=10, formula="Distance d = |Ax + By + C| / √(A² + B²) = r")

    # Level R11: Final Convergence
    hud "Triple-target vector clearance! Restore 72 BPM sinus rhythm and achieve full Respawn!"
    $ trigger_math_minigame("vector_game", level=11, formula="lim(t→∞) Viremia = 0")

    # Epilogue
    scene bg victory with flash
    rob "The road to recovery was long, but thanks to your mathematical precision... I made it! Let's get back to work!"
    return

# ==============================================================================
# CAMPAIGN 2: ELENA CHEN (Middle Class) - 11 Geometric Levels
# ==============================================================================
label elena_campaign:
    scene bg elena bitten
    elena "I was just watering the garden by the rainwater collector after grading exams. That sharp sting on my wrist..."
    play sound "audio/mosquito_buzz.mp3"

    scene bg hospital_room with flash
    narrator "A teacher whose life is built on proofs now faces severe Dengue shock in the community ward!"

    # Levels E1 - E11
    $ trigger_math_minigame("vector_game", level=1, formula="Optimal Launch Angle θ = 45°")
    $ trigger_math_minigame("vector_game", level=2, formula="Non-Parallel Specular Reflection Theorem")
    $ trigger_math_minigame("vector_game", level=3, formula="Viscous Drag Vector Deceleration F_d = -b·v")
    $ trigger_math_minigame("polygon_game", level=4, formula="Convex Hull Delaunay Triangulation")
    $ trigger_math_minigame("transform_game", level=5, formula="Orthogonal 2D Rotation Matrix R(θ)")
    $ trigger_math_minigame("vector_game", level=6, formula="Hyperbolic Orbital Slingshot Energy E > 0")
    $ trigger_math_minigame("wave_game", level=7, formula="Fourier Superposition Phase Inversion")
    $ trigger_math_minigame("vector_game", level=8, formula="3-Wall Billiard Ricochet Sequence")
    $ trigger_math_minigame("vector_game", level=9, formula="Ballistic Parabola with Boundary Bounce")
    $ trigger_math_minigame("vector_game", level=10, formula="Osculating Circle Tangency Condition")
    $ trigger_math_minigame("vector_game", level=11, formula="Quod Erat Demonstrandum Convergence (Q.E.D.)")

    scene bg victory with flash
    elena "Mathematics and medicine triumphed together. Class is back in session!"
    return

# ==============================================================================
# CAMPAIGN 3: JULIAN VANCE (Upper Class) - 11 Geometric Levels
# ==============================================================================
label julian_campaign:
    scene bg hospital_room
    julian "One mosquito at the edge of my infinity pool pierced my arm. Wealth cannot bribe a virus."
    play sound "audio/heart_monitor_fast.wav" loop

    # Levels J1 - J11
    $ trigger_math_minigame("vector_game", level=1, formula="Synthetic Nano-Drone Vector Calibration")
    $ trigger_math_minigame("vector_game", level=2, formula="Titanium Stent Specular Ricochet")
    $ trigger_math_minigame("vector_game", level=3, formula="Hemofiltration Pressure Gradient Parabola")
    $ trigger_math_minigame("polygon_game", level=4, formula="Gold-Fibrin Nano-Lattice Triangulation")
    $ trigger_math_minigame("transform_game", level=5, formula="Affine Receptor Docking Matrix")
    $ trigger_math_minigame("vector_game", level=6, formula="Magnetophoretic Central Force Slingshot")
    $ trigger_math_minigame("wave_game", level=7, formula="Ultrasonic Cavitation Phase Inversion")
    $ trigger_math_minigame("vector_game", level=8, formula="4-Wall Arterial Billiard Ricochet")
    $ trigger_math_minigame("vector_game", level=9, formula="Ballistic Gravity Ceiling Ricochet")
    $ trigger_math_minigame("vector_game", level=10, formula="Arterial Curvature Tangent Vector")
    $ trigger_math_minigame("vector_game", level=11, formula="Global Nano-Swarm Multi-Target Convergence")

    scene bg victory with flash
    julian "Pure mathematical geometry won the battle. My vitals are pristine. Back to the markets!"
    return
