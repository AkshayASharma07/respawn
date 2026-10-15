// ==============================================================================
// MATHEMATICAL & GEOMETRIC CANVAS GAME ENGINE
// Pure Geometry & Math Gameplay: Vectors, Angles, Ricochets, Transformations, Gravity
// Zero Multiple-Choice Questions - 100% Interactive Physics & Mathematics
// ==============================================================================

class MinigameController {
  constructor() {
    this.container = document.getElementById('minigame-overlay');
    this.animId = null;
    this.activeGame = null;
  }

  show() {
    if (this.container) {
      this.container.classList.remove('hidden');
      this.container.classList.add('active');
    }
  }

  hide() {
    if (this.container) {
      this.container.classList.add('hidden');
      this.container.classList.remove('active');
      this.container.innerHTML = '';
    }
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  // ============================================================================
  // 1. VECTOR / RICOCHET / GRAVITY / SLINGSHOT CANVAS GAMEPLAY
  // ============================================================================
  startVectorGame(config, onComplete) {
    this.show();
    this.container.innerHTML = `
      <div class="math-hud-bar">
        <div class="math-hud-col">
          <span class="hud-phase-label">${config.patientName || 'PATIENT'} • LEVEL ${config.levelNum}</span>
          <h3 class="hud-title">${config.title}</h3>
        </div>
        <div class="math-telemetry-pill">
          <div class="telemetry-item"><span class="lbl">ANGLE θ:</span> <span id="tel-angle" class="val">0.0°</span></div>
          <div class="telemetry-item"><span class="lbl">MAGNITUDE |v|:</span> <span id="tel-mag" class="val">0.0</span></div>
          <div class="telemetry-item"><span class="lbl">VECTOR (vx, vy):</span> <span id="tel-vec" class="val">(0.0, 0.0)</span></div>
          <div class="telemetry-item highlight"><span class="lbl">TARGETS REMAINING:</span> <span id="tel-targets" class="val">${config.targets ? config.targets.length : 1}</span></div>
        </div>
        <button id="btn-math-skip-level" class="math-quick-btn" title="Emergency triage assist">BYPASS ⏩</button>
      </div>

      <div class="math-canvas-wrapper">
        <div class="math-formula-overlay" id="math-formula-box">
          <span class="formula-tag">APPLIED MATHEMATICS:</span>
          <span class="formula-code">${config.mathFormula || 'v = (v_x, v_y) | θ = atan2(dy, dx)'}</span>
        </div>
        <canvas id="math-play-canvas" width="940" height="480"></canvas>
        <div class="math-instruction-banner">${config.instruction || 'Drag mouse from the launcher to set vector angle and magnitude. Release to fire!'}</div>
        <div id="math-result-banner" class="math-result-banner hidden"></div>
      </div>
    `;

    const canvas = document.getElementById('math-play-canvas');
    const ctx = canvas.getContext('2d');
    const telAngle = document.getElementById('tel-angle');
    const telMag = document.getElementById('tel-mag');
    const telVec = document.getElementById('tel-vec');
    const telTargets = document.getElementById('tel-targets');
    const resultBanner = document.getElementById('math-result-banner');

    document.getElementById('btn-math-skip-level').addEventListener('click', () => {
      this.finishLevel(true, onComplete, "VECTOR TRAJECTORY BYPASS EXECUTED");
    });

    // Game state
    const launcher = config.launcher || { x: 90, y: canvas.height / 2 };
    let isAiming = false;
    let aimStart = { x: launcher.x, y: launcher.y };
    let currentAim = { x: launcher.x, y: launcher.y };
    let projectile = null;
    let shotsTaken = 0;

    // Deep copy targets & obstacles
    const targets = (config.targets || [{ x: 800, y: 240, r: 24, hp: 1 }]).map(t => ({ ...t }));
    const obstacles = (config.obstacles || []).map(o => ({ ...o }));
    const walls = config.walls || [
      { x1: 20, y1: 20, x2: canvas.width - 20, y2: 20, normal: { x: 0, y: 1 } },
      { x1: 20, y1: canvas.height - 20, x2: canvas.width - 20, y2: canvas.height - 20, normal: { x: 0, y: -1 } }
    ];
    const gravity = config.gravity || { x: 0, y: 0 };
    const gravityWells = config.gravityWells || []; // Slingshot bodies: { x, y, mass, r }
    const maxBounces = config.maxBounces !== undefined ? config.maxBounces : 4;

    // Mouse / Touch aiming
    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
      };
    };

    const onStart = (e) => {
      if (projectile) return;
      const pos = getPos(e);
      const d = Math.hypot(pos.x - launcher.x, pos.y - launcher.y);
      if (d < 70) {
        isAiming = true;
        currentAim = pos;
      }
    };

    const onMove = (e) => {
      if (!isAiming) return;
      currentAim = getPos(e);
      const dx = launcher.x - currentAim.x;
      const dy = launcher.y - currentAim.y;
      const angleDeg = ((Math.atan2(dy, dx) * 180 / Math.PI) + 360) % 360;
      const mag = Math.min(22, Math.hypot(dx, dy) * 0.16);

      telAngle.textContent = `${angleDeg.toFixed(1)}°`;
      telMag.textContent = `${mag.toFixed(1)} px/f`;
      telVec.textContent = `(${(mag * Math.cos(angleDeg * Math.PI / 180)).toFixed(1)}, ${(mag * Math.sin(angleDeg * Math.PI / 180)).toFixed(1)})`;
    };

    const onEnd = () => {
      if (!isAiming) return;
      isAiming = false;
      const dx = launcher.x - currentAim.x;
      const dy = launcher.y - currentAim.y;
      const mag = Math.min(22, Math.hypot(dx, dy) * 0.16);
      if (mag < 2) return;

      const angle = Math.atan2(dy, dx);
      projectile = {
        x: launcher.x,
        y: launcher.y,
        vx: Math.cos(angle) * mag,
        vy: Math.sin(angle) * mag,
        r: 6,
        bounces: 0,
        trail: []
      };
      shotsTaken++;
      if (window.soundEngine) window.soundEngine.playLaserZap();
    };

    canvas.addEventListener('mousedown', onStart);
    canvas.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    canvas.addEventListener('touchstart', onStart, { passive: true });
    canvas.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);

    // Main animation loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background grid with coordinate axes
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.07)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Gravity Field Indicators
      if (gravity.y !== 0) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
        ctx.font = '11px JetBrains Mono';
        ctx.fillText(`GRAVITATIONAL ACCELERATION g = ${gravity.y.toFixed(2)} px/frame² ↓`, 24, canvas.height - 30);
      }

      // Draw Slingshot Gravity Wells
      gravityWells.forEach(well => {
        ctx.beginPath();
        ctx.arc(well.x, well.y, well.r * 2.8, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(well.x, well.y, well.r, 0, Math.PI * 2);
        ctx.fillStyle = 'radial-gradient(circle, #38bdf8 0%, #0369a1 80%)';
        ctx.fillStyle = '#0284c7';
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 9px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText(well.name || 'CELL NUCLEUS', well.x, well.y + 3);
      });

      // Draw Reflective Vascular Walls
      walls.forEach(w => {
        ctx.beginPath();
        ctx.moveTo(w.x1, w.y1);
        ctx.lineTo(w.x2, w.y2);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Normal vector ticks (θ_i = θ_r)
        const mx = (w.x1 + w.x2) / 2;
        const my = (w.y1 + w.y2) / 2;
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(mx + w.normal.x * 16, my + w.normal.y * 16);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Draw Obstacles (Thrombus / Endothelial tissue)
      obstacles.forEach(obs => {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (obs.type === 'rect') {
          ctx.rect(obs.x, obs.y, obs.w, obs.h);
        } else {
          ctx.arc(obs.x, obs.y, obs.r, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f87171';
        ctx.font = '10px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText(obs.label || 'BARRIER', obs.x + (obs.w ? obs.w/2 : 0), obs.y + (obs.h ? obs.h/2 + 4 : 4));
      });

      // Draw Targets (Dengue Virions)
      targets.forEach(t => {
        if (t.hp <= 0) return;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
        ctx.fillStyle = 'radial-gradient(circle, #f59e0b 20%, #ef4444 80%)';
        ctx.fillStyle = '#dc2626';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Spikes
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
          ctx.beginPath();
          ctx.moveTo(t.x + Math.cos(a) * t.r, t.y + Math.sin(a) * t.r);
          ctx.lineTo(t.x + Math.cos(a) * (t.r + 6), t.y + Math.sin(a) * (t.r + 6));
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 9px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText('DENV-2', t.x, t.y + 3);
      });

      // Draw Launcher Port
      ctx.beginPath();
      ctx.arc(launcher.x, launcher.y, 18, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(2, 132, 199, 0.4)';
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(launcher.x, launcher.y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Trajectory Prediction Line when Aiming
      if (isAiming) {
        const dx = launcher.x - currentAim.x;
        const dy = launcher.y - currentAim.y;
        const mag = Math.min(22, Math.hypot(dx, dy) * 0.16);

        if (mag > 1) {
          // Aim vector arrow
          ctx.beginPath();
          ctx.moveTo(launcher.x, launcher.y);
          ctx.lineTo(launcher.x + dx, launcher.y + dy);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3;
          ctx.stroke();

          // Vector component right triangle (vx, vy)
          ctx.beginPath();
          ctx.setLineDash([3, 3]);
          ctx.moveTo(launcher.x, launcher.y);
          ctx.lineTo(launcher.x + dx, launcher.y);
          ctx.lineTo(launcher.x + dx, launcher.y + dy);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.setLineDash([]);

          // Predicted Path (with physics & bounces)
          ctx.beginPath();
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
          ctx.lineWidth = 1.5;
          let simX = launcher.x;
          let simY = launcher.y;
          let simVx = (dx / Math.hypot(dx, dy)) * mag;
          let simVy = (dy / Math.hypot(dx, dy)) * mag;
          ctx.moveTo(simX, simY);

          for (let step = 0; step < 75; step++) {
            simVy += gravity.y;
            simVx += gravity.x;

            // Gravity wells pull
            gravityWells.forEach(well => {
              const wdx = well.x - simX;
              const wdy = well.y - simY;
              const distSq = Math.max(100, wdx * wdx + wdy * wdy);
              const force = (well.mass || 450) / distSq;
              const angle = Math.atan2(wdy, wdx);
              simVx += Math.cos(angle) * force;
              simVy += Math.sin(angle) * force;
            });

            simX += simVx;
            simY += simVy;

            // Simple boundary bounce prediction
            if (simY <= 24 || simY >= canvas.height - 24) {
              simVy = -simVy;
            }
            ctx.lineTo(simX, simY);
          }
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Projectile Physics Update
      if (projectile) {
        projectile.trail.push({ x: projectile.x, y: projectile.y });
        if (projectile.trail.length > 25) projectile.trail.shift();

        // Draw trail
        ctx.beginPath();
        for (let i = 0; i < projectile.trail.length; i++) {
          const pt = projectile.trail[i];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Gravity acceleration
        projectile.vy += gravity.y;
        projectile.vx += gravity.x;

        // Gravity wells (Slingshot)
        gravityWells.forEach(well => {
          const wdx = well.x - projectile.x;
          const wdy = well.y - projectile.y;
          const distSq = Math.max(120, wdx * wdx + wdy * wdy);
          const force = (well.mass || 550) / distSq;
          const angle = Math.atan2(wdy, wdx);
          projectile.vx += Math.cos(angle) * force;
          projectile.vy += Math.sin(angle) * force;
        });

        projectile.x += projectile.vx;
        projectile.y += projectile.vy;

        // Draw projectile
        ctx.beginPath();
        ctx.arc(projectile.x, projectile.y, projectile.r, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Collision with walls (Specular Ricochet: v' = v - 2(v.n)n)
        walls.forEach(w => {
          if (projectile.y - projectile.r <= w.y1 && projectile.vy < 0 && w.normal.y > 0) {
            projectile.vy = -projectile.vy;
            projectile.bounces++;
            if (window.soundEngine) window.soundEngine.playTypewriterBlip();
          } else if (projectile.y + projectile.r >= w.y2 && projectile.vy > 0 && w.normal.y < 0) {
            projectile.vy = -projectile.vy;
            projectile.bounces++;
            if (window.soundEngine) window.soundEngine.playTypewriterBlip();
          }
        });

        // Collision with targets
        targets.forEach(t => {
          if (t.hp <= 0) return;
          const d = Math.hypot(projectile.x - t.x, projectile.y - t.y);
          if (d <= projectile.r + t.r) {
            t.hp = 0;
            if (window.soundEngine) window.soundEngine.playActionSuccess();
            projectile = null;
          }
        });

        // Collision with obstacles
        if (projectile) {
          obstacles.forEach(obs => {
            if (obs.type === 'rect') {
              if (projectile.x >= obs.x && projectile.x <= obs.x + obs.w &&
                  projectile.y >= obs.y && projectile.y <= obs.y + obs.h) {
                if (window.soundEngine) window.soundEngine.playActionWarning();
                projectile = null; // absorbed by barrier
              }
            } else {
              const d = Math.hypot(projectile.x - obs.x, projectile.y - obs.y);
              if (d <= projectile.r + obs.r) {
                if (window.soundEngine) window.soundEngine.playActionWarning();
                projectile = null;
              }
            }
          });
        }

        // Out of bounds or max bounces exceeded
        if (projectile && (
            projectile.x < 0 || projectile.x > canvas.width ||
            projectile.y < 0 || projectile.y > canvas.height ||
            projectile.bounces > maxBounces)) {
          projectile = null;
        }

        // Check victory condition
        const remaining = targets.filter(t => t.hp > 0).length;
        telTargets.textContent = remaining;

        if (remaining === 0) {
          this.finishLevel(true, onComplete, `VICTORIOUS! ALL PATHOGENS NEUTRALIZED IN ${shotsTaken} VECTOR STRIKES!`);
          return;
        }
      }

      this.animId = requestAnimationFrame(render);
    };

    this.animId = requestAnimationFrame(render);
  }

  // ============================================================================
  // 2. POLYGON TRIANGULATION & DELAUNAY HEMOSTASIS (Area Coverage)
  // ============================================================================
  startPolygonGame(config, onComplete) {
    this.show();
    this.container.innerHTML = `
      <div class="math-hud-bar">
        <div class="math-hud-col">
          <span class="hud-phase-label">${config.patientName || 'PATIENT'} • LEVEL ${config.levelNum}</span>
          <h3 class="hud-title">${config.title}</h3>
        </div>
        <div class="math-telemetry-pill">
          <div class="telemetry-item"><span class="lbl">TRIANGLES FORMED:</span> <span id="poly-tri-count" class="val">0 / ${config.targetTriangles || 4}</span></div>
          <div class="telemetry-item highlight"><span class="lbl">AREA COVERED:</span> <span id="poly-area" class="val">0.0%</span></div>
        </div>
        <button id="btn-math-skip-level" class="math-quick-btn">BYPASS ⏩</button>
      </div>

      <div class="math-canvas-wrapper">
        <div class="math-formula-overlay">
          <span class="formula-tag">APPLIED MATHEMATICS:</span>
          <span class="formula-code">Area = 1/2 |x_A(y_B - y_C) + x_B(y_C - y_A) + x_C(y_A - y_B)|</span>
        </div>
        <canvas id="math-poly-canvas" width="940" height="480"></canvas>
        <div class="math-instruction-banner">${config.instruction || 'Click 3 vertices to construct a triangular fibrin patch. Cover the fissure to seal capillary leakage!'}</div>
        <div id="math-result-banner" class="math-result-banner hidden"></div>
      </div>
    `;

    document.getElementById('btn-math-skip-level').addEventListener('click', () => {
      this.finishLevel(true, onComplete, "HEMOSTASIS TRIANGULATION SEAL COMPLETE");
    });

    const canvas = document.getElementById('math-poly-canvas');
    const ctx = canvas.getContext('2d');
    const triCountEl = document.getElementById('poly-tri-count');
    const areaEl = document.getElementById('poly-area');

    // Nodes distributed across fissure
    const nodes = config.nodes || [
      { x: 340, y: 150 }, { x: 500, y: 130 }, { x: 620, y: 190 },
      { x: 300, y: 280 }, { x: 460, y: 270 }, { x: 630, y: 310 },
      { x: 380, y: 380 }, { x: 540, y: 390 }
    ];

    let selectedNodes = [];
    let formedTriangles = [];
    const targetTriangles = config.targetTriangles || 4;

    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = (e.clientX - rect.left) * (canvas.width / rect.width);
      const clickY = (e.clientY - rect.top) * (canvas.height / rect.height);

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (Math.hypot(clickX - node.x, clickY - node.y) < 26) {
          if (!selectedNodes.includes(i)) {
            selectedNodes.push(i);
            if (window.soundEngine) window.soundEngine.playTypewriterBlip();
          }
          if (selectedNodes.length === 3) {
            formedTriangles.push([...selectedNodes]);
            selectedNodes = [];
            if (window.soundEngine) window.soundEngine.playActionSuccess();

            triCountEl.textContent = `${formedTriangles.length} / ${targetTriangles}`;
            const pct = Math.min(100, (formedTriangles.length / targetTriangles) * 100);
            areaEl.textContent = `${pct.toFixed(0)}%`;

            if (formedTriangles.length >= targetTriangles) {
              this.finishLevel(true, onComplete, "POLYGONAL FIBRIN MESH COMPLETE! VASCULAR FISSURE SEALED!");
            }
          }
          break;
        }
      }
    });

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Leaking Vascular Fissure Silhouette
      ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
      ctx.beginPath();
      ctx.ellipse(480, 260, 240, 150, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Formed Triangles
      formedTriangles.forEach(tri => {
        const p1 = nodes[tri[0]];
        const p2 = nodes[tri[1]];
        const p3 = nodes[tri[2]];
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
      });

      // Draw Active Selection Line
      if (selectedNodes.length > 0) {
        ctx.beginPath();
        for (let i = 0; i < selectedNodes.length; i++) {
          const pt = nodes[selectedNodes[i]];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw Nodes
      nodes.forEach((n, idx) => {
        const isSel = selectedNodes.includes(idx);
        ctx.beginPath();
        ctx.arc(n.x, n.y, isSel ? 12 : 9, 0, Math.PI * 2);
        ctx.fillStyle = isSel ? '#38bdf8' : '#fff';
        ctx.shadowColor = isSel ? '#38bdf8' : 'rgba(255, 255, 255, 0.5)';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px JetBrains Mono';
        ctx.fillText(`P${idx + 1}`, n.x + 12, n.y - 10);
      });

      this.animId = requestAnimationFrame(render);
    };

    this.animId = requestAnimationFrame(render);
  }

  // ============================================================================
  // 3. 2D COORDINATE TRANSFORMATION MATRIX (Rotation, Scale, Translation)
  // ============================================================================
  startTransformGame(config, onComplete) {
    this.show();
    this.container.innerHTML = `
      <div class="math-hud-bar">
        <div class="math-hud-col">
          <span class="hud-phase-label">${config.patientName || 'PATIENT'} • LEVEL ${config.levelNum}</span>
          <h3 class="hud-title">${config.title}</h3>
        </div>
        <div class="math-telemetry-pill">
          <div class="telemetry-item"><span class="lbl">ROTATION θ:</span> <span id="tf-rot-val" class="val">0°</span></div>
          <div class="telemetry-item"><span class="lbl">SCALE S:</span> <span id="tf-scale-val" class="val">1.0x</span></div>
          <div class="telemetry-item highlight"><span class="lbl">CONGRUENCE FIT:</span> <span id="tf-fit-val" class="val">0%</span></div>
        </div>
        <button id="btn-math-skip-level" class="math-quick-btn">BYPASS ⏩</button>
      </div>

      <div class="math-canvas-wrapper">
        <div class="math-formula-overlay">
          <span class="formula-tag">TRANSFORMATION MATRIX:</span>
          <span class="formula-code">T = [s·cosθ  -s·sinθ  |  t_x] ; [s·sinθ   s·cosθ  |  t_y]</span>
        </div>
        <canvas id="math-tf-canvas" width="940" height="400"></canvas>
        <div class="tf-controls-row">
          <div class="ctrl-group">
            <label>ROTATION ANGLE θ (0° - 360°)</label>
            <input type="range" id="slider-rot" min="0" max="360" value="0" class="styled-slider">
          </div>
          <div class="ctrl-group">
            <label>SCALE DILATION S (0.5x - 2.0x)</label>
            <input type="range" id="slider-scale" min="50" max="200" value="100" class="styled-slider">
          </div>
          <button id="btn-commit-transform" class="action-btn-primary" style="max-width: 220px;">LOCK CONGRUENCE</button>
        </div>
        <div id="math-result-banner" class="math-result-banner hidden"></div>
      </div>
    `;

    document.getElementById('btn-math-skip-level').addEventListener('click', () => {
      this.finishLevel(true, onComplete, "AFFINE TRANSFORMATION MATRIX LOCKED");
    });

    const canvas = document.getElementById('math-tf-canvas');
    const ctx = canvas.getContext('2d');
    const rotSlider = document.getElementById('slider-rot');
    const scaleSlider = document.getElementById('slider-scale');
    const rotVal = document.getElementById('tf-rot-val');
    const scaleVal = document.getElementById('tf-scale-val');
    const fitVal = document.getElementById('tf-fit-val');
    const commitBtn = document.getElementById('btn-commit-transform');

    const targetRot = config.targetRot || 120;
    const targetScale = config.targetScale || 1.4;

    let curRot = 0;
    let curScale = 1.0;

    const updateFit = () => {
      const rotDiff = Math.abs(curRot - targetRot);
      const rotMatch = Math.max(0, 1 - (rotDiff / 180));
      const scaleDiff = Math.abs(curScale - targetScale);
      const scaleMatch = Math.max(0, 1 - (scaleDiff / 1.5));
      const fit = Math.round(((rotMatch * 0.6) + (scaleMatch * 0.4)) * 100);

      fitVal.textContent = `${fit}%`;
      fitVal.className = fit >= 85 ? 'val highlight' : 'val';
      return fit;
    };

    rotSlider.addEventListener('input', (e) => {
      curRot = parseFloat(e.target.value);
      rotVal.textContent = `${curRot}°`;
      updateFit();
      if (window.soundEngine) window.soundEngine.playTypewriterBlip();
    });

    scaleSlider.addEventListener('input', (e) => {
      curScale = parseFloat(e.target.value) / 100;
      scaleVal.textContent = `${curScale.toFixed(2)}x`;
      updateFit();
      if (window.soundEngine) window.soundEngine.playTypewriterBlip();
    });

    commitBtn.addEventListener('click', () => {
      const fit = updateFit();
      if (fit >= 80) {
        this.finishLevel(true, onComplete, `PERFECT CONGRUENCE (${fit}%)! ANTIGEN-ANTIBODY DOCKING ACHIEVED!`);
      } else {
        if (window.soundEngine) window.soundEngine.playActionWarning();
        alert(`Alignment fit is ${fit}%. Adjust rotation and scale closer to receptor silhouette!`);
      }
    });

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw Target Receptor Silhouette (Dashed Green)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((targetRot * Math.PI) / 180);
      ctx.scale(targetScale, targetScale);
      ctx.beginPath();
      // Asymmetric Y-shape antibody binding cleft
      ctx.moveTo(0, -40);
      ctx.lineTo(25, 10);
      ctx.lineTo(40, -10);
      ctx.lineTo(15, 45);
      ctx.lineTo(-15, 45);
      ctx.lineTo(-40, -10);
      ctx.lineTo(-25, 10);
      ctx.closePath();
      ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.fill();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Draw Active Transforming Construct (Cyan)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((curRot * Math.PI) / 180);
      ctx.scale(curScale, curScale);
      ctx.beginPath();
      ctx.moveTo(0, -40);
      ctx.lineTo(25, 10);
      ctx.lineTo(40, -10);
      ctx.lineTo(15, 45);
      ctx.lineTo(-15, 45);
      ctx.lineTo(-40, -10);
      ctx.lineTo(-25, 10);
      ctx.closePath();
      ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();

      this.animId = requestAnimationFrame(render);
    };

    this.animId = requestAnimationFrame(render);
  }

  // ============================================================================
  // 4. WAVE RESONANCE & HARMONIC DESTRUCTIVE INTERFERENCE
  // ============================================================================
  startWaveGame(config, onComplete) {
    this.show();
    this.container.innerHTML = `
      <div class="math-hud-bar">
        <div class="math-hud-col">
          <span class="hud-phase-label">${config.patientName || 'PATIENT'} • LEVEL ${config.levelNum}</span>
          <h3 class="hud-title">${config.title}</h3>
        </div>
        <div class="math-telemetry-pill">
          <div class="telemetry-item"><span class="lbl">FREQUENCY f:</span> <span id="wave-freq-val" class="val">2.0 Hz</span></div>
          <div class="telemetry-item"><span class="lbl">PHASE SHIFT φ:</span> <span id="wave-phase-val" class="val">0°</span></div>
          <div class="telemetry-item highlight"><span class="lbl">INTERFERENCE CANCEL:</span> <span id="wave-cancel-val" class="val">0%</span></div>
        </div>
        <button id="btn-math-skip-level" class="math-quick-btn">BYPASS ⏩</button>
      </div>

      <div class="math-canvas-wrapper">
        <div class="math-formula-overlay">
          <span class="formula-tag">TRIGONOMETRIC SUPERPOSITION:</span>
          <span class="formula-code">y_total = A·sin(kx - ωt) + A·sin(kx - ωt + φ) = 2A·cos(φ/2)·sin(...)</span>
        </div>
        <canvas id="math-wave-canvas" width="940" height="380"></canvas>
        <div class="tf-controls-row">
          <div class="ctrl-group">
            <label>FREQUENCY (1.0 - 5.0 Hz)</label>
            <input type="range" id="slider-wave-freq" min="10" max="50" value="20" class="styled-slider">
          </div>
          <div class="ctrl-group">
            <label>PHASE SHIFT φ (0° - 360°) [Target: 180° for Destructive Interference]</label>
            <input type="range" id="slider-wave-phase" min="0" max="360" value="0" class="styled-slider">
          </div>
          <button id="btn-commit-wave" class="action-btn-primary" style="max-width: 220px;">PULSE CANCEL WAVE</button>
        </div>
        <div id="math-result-banner" class="math-result-banner hidden"></div>
      </div>
    `;

    document.getElementById('btn-math-skip-level').addEventListener('click', () => {
      this.finishLevel(true, onComplete, "HARMONIC INTERFERENCE CANCELLATION LOCKED");
    });

    const canvas = document.getElementById('math-wave-canvas');
    const ctx = canvas.getContext('2d');
    const freqSlider = document.getElementById('slider-wave-freq');
    const phaseSlider = document.getElementById('slider-wave-phase');
    const freqVal = document.getElementById('wave-freq-val');
    const phaseVal = document.getElementById('wave-phase-val');
    const cancelVal = document.getElementById('wave-cancel-val');
    const commitBtn = document.getElementById('btn-commit-wave');

    const targetFreq = config.targetFreq || 3.0;
    const targetPhase = 180; // Complete destructive cancellation

    let curFreq = 2.0;
    let curPhase = 0;
    let time = 0;

    const calcCancel = () => {
      const fDiff = Math.abs(curFreq - targetFreq);
      const fMatch = Math.max(0, 1 - (fDiff / 3.0));
      const pDiff = Math.abs(curPhase - targetPhase);
      const pMatch = Math.max(0, 1 - (pDiff / 180));
      const cancelPct = Math.round(((fMatch * 0.4) + (pMatch * 0.6)) * 100);

      cancelVal.textContent = `${cancelPct}%`;
      cancelVal.className = cancelPct >= 85 ? 'val highlight' : 'val';
      return cancelPct;
    };

    freqSlider.addEventListener('input', (e) => {
      curFreq = parseFloat(e.target.value) / 10;
      freqVal.textContent = `${curFreq.toFixed(1)} Hz`;
      calcCancel();
      if (window.soundEngine) window.soundEngine.playTypewriterBlip();
    });

    phaseSlider.addEventListener('input', (e) => {
      curPhase = parseFloat(e.target.value);
      phaseVal.textContent = `${curPhase}°`;
      calcCancel();
      if (window.soundEngine) window.soundEngine.playTypewriterBlip();
    });

    commitBtn.addEventListener('click', () => {
      const pct = calcCancel();
      if (pct >= 85) {
        this.finishLevel(true, onComplete, `DESTRUCTIVE INTERFERENCE ACHIEVED (${pct}%)! VIRAL ENVELOPE RESONANCE COLLAPSED!`);
      } else {
        if (window.soundEngine) window.soundEngine.playActionWarning();
        alert(`Cancellation is only ${pct}%. Set phase shift close to 180° and match frequency!`);
      }
    });

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.04;

      const cy = canvas.height / 2;
      const w = canvas.width;

      // 1. Pathogen Resonance Wave (Red: y1 = A * sin(kx - wt))
      ctx.beginPath();
      for (let x = 0; x < w; x += 3) {
        const y = cy + Math.sin((x * 0.02 * targetFreq) - (time * targetFreq * 2)) * 45;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 2. Player Therapeutic Wave (Cyan: y2 = A * sin(kx - wt + phi))
      const phiRad = (curPhase * Math.PI) / 180;
      ctx.beginPath();
      for (let x = 0; x < w; x += 3) {
        const y = cy + Math.sin((x * 0.02 * curFreq) - (time * curFreq * 2) + phiRad) * 45;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 3. Superposition Result Wave (Green: y_total)
      ctx.beginPath();
      for (let x = 0; x < w; x += 3) {
        const y1 = Math.sin((x * 0.02 * targetFreq) - (time * targetFreq * 2)) * 45;
        const y2 = Math.sin((x * 0.02 * curFreq) - (time * curFreq * 2) + phiRad) * 45;
        const yTot = cy + (y1 + y2);
        if (x === 0) ctx.moveTo(x, yTot);
        else ctx.lineTo(x, yTot);
      }
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      this.animId = requestAnimationFrame(render);
    };

    this.animId = requestAnimationFrame(render);
  }

  // Common Level Finish Handler
  finishLevel(success, onComplete, message) {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    const banner = document.getElementById('math-result-banner');
    if (banner) {
      banner.className = 'math-result-banner success';
      banner.textContent = message;
      banner.classList.remove('hidden');
    }
    if (window.soundEngine) window.soundEngine.playLevelClearFanfare();

    if (window.vitalsMonitor) {
      window.vitalsMonitor.setVitals({
        stability: Math.min(100, window.vitalsMonitor.stability + 15),
        bpm: Math.max(72, window.vitalsMonitor.bpm - 6),
        platelets: window.vitalsMonitor.platelets + 12
      });
    }

    setTimeout(() => {
      this.hide();
      if (onComplete) onComplete(success);
    }, 2200);
  }
}

window.minigameController = new MinigameController();
