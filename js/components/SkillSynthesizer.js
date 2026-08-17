/**
 * Jura Tempest Federation - Skill Synthesizer & Evolution Tree Engine
 * Interactive Alchemy & Fusion Sandbox for Tensura Skills
 */

class SkillSynthesizer extends HTMLElement {
  constructor() {
    super();
    this.slotA = null;
    this.slotB = null;
    this.baseSkills = this.initBaseSkills();
    this.recipes = this.initRecipes();
    this.unlockedSkills = new Set(["Gluttony", "Raphael"]);
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  initBaseSkills() {
    return [
      { id: "predator", name: "Predator", type: "Unique", icon: "🌀", desc: "Absorbs targets into the stomach for analysis and mimicry." },
      { id: "great_sage", name: "Great Sage", type: "Unique", icon: "🧠", desc: "Provides high-speed thought acceleration and comprehensive world analysis." },
      { id: "degenerate", name: "Degenerate", type: "Unique", icon: "✨", desc: "Enables synthesis and separation of skills and organic matter." },
      { id: "severer", name: "Severer", type: "Unique", icon: "🗡️", desc: "Enables spatial cutting that bypasses conventional physical defenses." },
      { id: "starving_one", name: "Starving One", type: "Unique", icon: "🍖", desc: "Endless ravenous hunger that passes abilities down the food chain." },
      { id: "black_flame", name: "Black Flame", type: "Extra", icon: "🔥", desc: "High-temperature unquenchable dark fire magic." },
      { id: "black_lightning", name: "Black Lightning", type: "Extra", icon: "⚡", desc: "Devastating localized dark plasma discharge." },
      { id: "water_blade", name: "Water Blade", type: "Common", icon: "💧", desc: "Pressurized water projectile capable of slicing iron." },
      { id: "hydraulic_propulsion", name: "Hydraulic Propulsion", type: "Common", icon: "🌊", desc: "High-speed water expulsion for rapid movement." },
      { id: "coercion", name: "Coercion", type: "Extra", icon: "👁️", desc: "Emits an intimidating aura of magicules to stun weaker foes." },
      { id: "thought_comm", name: "Thought Communication", type: "Common", icon: "📡", desc: "Telepathic link allowing silent instant messaging." },
      { id: "shadow_step", name: "Shadow Step", type: "Extra", icon: "👤", desc: "Enables travel through shadow dimensions without physical collision." }
    ];
  }

  initRecipes() {
    return [
      {
        inputs: ["predator", "starving_one"],
        result: {
          name: "Gluttony (Lord of Despair)",
          tier: "Unique Skill",
          icon: "🖤",
          desc: "Evolved fusion of Predator and Starving One. Grants infinite stomach storage, soul consumption, and power distribution through the Food Chain network.",
          subskills: ["Predation", "Stomach", "Isolate", "Mimicry", "Food Chain"]
        }
      },
      {
        inputs: ["predator", "great_sage"],
        result: {
          name: "Beelzebuth (Lord of Gluttony)",
          tier: "Ultimate Skill (Sin Series)",
          icon: "🌀",
          desc: "Awakened during the Harvest Festival. The ultimate authority over consumption, spiritual decay, and energy assimilation.",
          subskills: ["Soul Consumption", "Food Chain", "Universal Stomach", "Decomposition", "Isolation"]
        }
      },
      {
        inputs: ["great_sage", "degenerate"],
        result: {
          name: "Raphael (Lord of Wisdom)",
          tier: "Ultimate Skill (Angelic Series)",
          icon: "🧠",
          desc: "The absolute zenith of analytical calculation. Accelerates cognition by 1,000,000x and executes parallel multi-threaded spell casting.",
          subskills: ["Thought Acceleration", "All of Creation", "Parallel Operation", "Chant Annulment", "Future Attack Prediction"]
        }
      },
      {
        inputs: ["black_flame", "black_lightning"],
        result: {
          name: "Dark Flame Lightning (Hellflare)",
          tier: "Extra / Special Magic",
          icon: "💥",
          desc: "Combines the searing heat of Black Flame with the kinetic devastation of Black Lightning into a single compressed spherical blast.",
          subskills: ["Hellflare Dome", "Plasma Fusion", "Thermal Expansion"]
        }
      },
      {
        inputs: ["severer", "shadow_step"],
        result: {
          name: "Uriel (Lord of Vows)",
          tier: "Ultimate Skill (Angelic Series)",
          icon: "🛡️",
          desc: "Manifests absolute defense through dimensional isolation and grants authority over universal physical and spatial laws.",
          subskills: ["Universal Barrier", "Spatial Domination", "Law Manipulation", "Boundless Prison"]
        }
      },
      {
        inputs: ["water_blade", "hydraulic_propulsion"],
        result: {
          name: "High-Pressure Water Current Blade",
          tier: "Extra Skill",
          icon: "🌊",
          desc: "Hyper-accelerated micro-thin stream of water capable of severing mountain boulders with zero friction.",
          subskills: ["Water Slicing", "Sonar Wave", "Pressure Control"]
        }
      },
      {
        inputs: ["coercion", "thought_comm"],
        result: {
          name: "Lord's Ambition (Dragon Haki)",
          tier: "Extra / Haki Skill",
          icon: "👑",
          desc: "Infuses the user's aura with commanding will, forcing opponents of lower willpower to submit or collapse unconscious.",
          subskills: ["Magicule Pressure", "Mental Domination", "Aura Compression"]
        }
      }
    ];
  }

  render() {
    this.innerHTML = `
      <div class="skill-synthesizer-card" id="skillSynthesizer">
        <div class="synth-header">
          <div class="synth-title-wrap">
            <span class="synth-badge">LABORATORY</span>
            <h2 class="synth-title">🧪 Great Sage Skill Synthesizer</h2>
            <p class="synth-subtitle">Combine compatible abilities to trigger synthesis, evolve unique traits, and unlock legendary Ultimate Skills.</p>
          </div>
          <div class="synth-stats">
            <div class="synth-stat-item">
              <span class="synth-stat-val" id="synthUnlockedCount">2</span>
              <span class="synth-stat-lbl">Synthesized</span>
            </div>
          </div>
        </div>

        <div class="synth-workbench-grid">
          <!-- Fusion Chamber -->
          <div class="synth-chamber">
            <div class="synth-slots-row">
              <div class="synth-slot" id="slotA" data-slot="A">
                <div class="synth-slot-placeholder">
                  <span class="slot-plus">+</span>
                  <span>Select Skill A</span>
                </div>
              </div>

              <div class="synth-operator-core">
                <div class="synth-core-pulse">⚗️</div>
              </div>

              <div class="synth-slot" id="slotB" data-slot="B">
                <div class="synth-slot-placeholder">
                  <span class="slot-plus">+</span>
                  <span>Select Skill B</span>
                </div>
              </div>
            </div>

            <div class="synth-action-row">
              <button class="synth-fuse-btn" id="synthFuseBtn" disabled>
                <span>⚡ INITIATE SYNTHESIS</span>
              </button>
              <button class="synth-reset-btn" id="synthResetBtn" title="Clear Chamber">Clear</button>
            </div>

            <!-- Result Box -->
            <div class="synth-result-box" id="synthResultBox">
              <div class="synth-result-empty">
                <span>Select 2 skills from the pool below to begin calculation.</span>
              </div>
            </div>
          </div>

          <!-- Base Skill Pool -->
          <div class="synth-pool-container">
            <h3 class="synth-pool-title">Available Skill Reagents</h3>
            <div class="synth-pool-grid" id="synthPool">
              ${this.baseSkills.map(s => `
                <div class="synth-chip" data-id="${s.id}">
                  <span class="synth-chip-icon">${s.icon}</span>
                  <div class="synth-chip-info">
                    <div class="synth-chip-name">${s.name}</div>
                    <div class="synth-chip-type ${s.type.toLowerCase()}">${s.type}</div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>

        <!-- Canonical Skill Evolution Tree Showcase -->
        <div class="synth-tree-section">
          <h3 class="synth-tree-title">🧬 Canonical Tensura Skill Evolution Pathways</h3>
          <div class="synth-tree-grid">
            <div class="synth-tree-card">
              <div class="tree-card-header">
                <span class="tree-avatar">🌀</span>
                <div>
                  <h4>Rimuru Tempest (Wisdom Path)</h4>
                  <span>Great Sage ➔ Raphael ➔ Manas Ciel</span>
                </div>
              </div>
              <div class="tree-nodes-chain">
                <div class="tree-node">Great Sage <small>(Unique)</small></div>
                <div class="tree-arrow">➔</div>
                <div class="tree-node active">Raphael <small>(Ultimate)</small></div>
                <div class="tree-arrow">➔</div>
                <div class="tree-node pinnacle">Manas: Ciel <small>(God-Tier)</small></div>
              </div>
            </div>

            <div class="synth-tree-card">
              <div class="tree-card-header">
                <span class="tree-avatar">🖤</span>
                <div>
                  <h4>Rimuru Tempest (Consumption Path)</h4>
                  <span>Predator ➔ Gluttony ➔ Beelzebuth ➔ Azathoth</span>
                </div>
              </div>
              <div class="tree-nodes-chain">
                <div class="tree-node">Predator <small>(Unique)</small></div>
                <div class="tree-arrow">➔</div>
                <div class="tree-node">Gluttony <small>(Unique)</small></div>
                <div class="tree-arrow">➔</div>
                <div class="tree-node active">Beelzebuth <small>(Ultimate)</small></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const chips = this.querySelectorAll(".synth-chip");
    const fuseBtn = this.querySelector("#synthFuseBtn");
    const resetBtn = this.querySelector("#synthResetBtn");

    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        const id = chip.getAttribute("data-id");
        this.selectSkill(id);
      });
    });

    if (fuseBtn) {
      fuseBtn.addEventListener("click", () => this.fuse());
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => this.reset());
    }
  }

  selectSkill(id) {
    const skill = this.baseSkills.find(s => s.id === id);
    if (!skill) return;

    if (window.SoundEngine) window.SoundEngine.play("select");

    if (!this.slotA) {
      this.slotA = skill;
    } else if (!this.slotB) {
      if (this.slotA.id === id) {
        // Can't select same skill in both slots
        return;
      }
      this.slotB = skill;
    } else {
      // Replace slot B
      this.slotB = skill;
    }

    this.updateSlotsVisual();
  }

  updateSlotsVisual() {
    const elA = this.querySelector("#slotA");
    const elB = this.querySelector("#slotB");
    const fuseBtn = this.querySelector("#synthFuseBtn");

    if (elA) {
      elA.innerHTML = this.slotA ? `
        <div class="synth-slot-filled">
          <span class="filled-icon">${this.slotA.icon}</span>
          <div class="filled-name">${this.slotA.name}</div>
          <div class="filled-type">${this.slotA.type}</div>
        </div>
      ` : `
        <div class="synth-slot-placeholder">
          <span class="slot-plus">+</span>
          <span>Select Skill A</span>
        </div>
      `;
    }

    if (elB) {
      elB.innerHTML = this.slotB ? `
        <div class="synth-slot-filled">
          <span class="filled-icon">${this.slotB.icon}</span>
          <div class="filled-name">${this.slotB.name}</div>
          <div class="filled-type">${this.slotB.type}</div>
        </div>
      ` : `
        <div class="synth-slot-placeholder">
          <span class="slot-plus">+</span>
          <span>Select Skill B</span>
        </div>
      `;
    }

    if (fuseBtn) {
      fuseBtn.disabled = !(this.slotA && this.slotB);
    }
  }

  reset() {
    this.slotA = null;
    this.slotB = null;
    this.updateSlotsVisual();
    const resultBox = this.querySelector("#synthResultBox");
    if (resultBox) {
      resultBox.innerHTML = `
        <div class="synth-result-empty">
          <span>Select 2 skills from the pool below to begin calculation.</span>
        </div>
      `;
    }
    if (window.SoundEngine) window.SoundEngine.play("click");
  }

  fuse() {
    if (!this.slotA || !this.slotB) return;

    const resultBox = this.querySelector("#synthResultBox");
    const fuseBtn = this.querySelector("#synthFuseBtn");
    if (fuseBtn) fuseBtn.disabled = true;

    if (window.SoundEngine) {
      window.SoundEngine.play("skillFuse");
    }

    resultBox.innerHTML = `
      <div class="synth-calculating">
        <div class="synth-spinner">🌀</div>
        <div class="synth-calc-text">Great Sage High-Speed Calculation in progress...</div>
      </div>
    `;

    setTimeout(() => {
      const match = this.recipes.find(r => 
        (r.inputs[0] === this.slotA.id && r.inputs[1] === this.slotB.id) ||
        (r.inputs[1] === this.slotA.id && r.inputs[0] === this.slotB.id)
      );

      if (match) {
        this.unlockedSkills.add(match.result.name);
        const countEl = this.querySelector("#synthUnlockedCount");
        if (countEl) countEl.textContent = this.unlockedSkills.size;

        if (window.SoundEngine) window.SoundEngine.play("success");

        resultBox.innerHTML = `
          <div class="synth-success-card">
            <div class="success-top">
              <span class="success-icon">${match.result.icon}</span>
              <div>
                <div class="success-badge">SYNTHESIS COMPLETE</div>
                <h3 class="success-title">${match.result.name}</h3>
                <span class="success-tier">${match.result.tier}</span>
              </div>
            </div>
            <p class="success-desc">${match.result.desc}</p>
            <div class="success-subskills">
              <strong>Sub-Skills Acquired:</strong>
              <div class="subskills-tags">
                ${match.result.subskills.map(s => `<span class="subskill-tag">✨ ${s}</span>`).join("")}
              </div>
            </div>
          </div>
        `;
      } else {
        if (window.SoundEngine) window.SoundEngine.play("closeModal");

        resultBox.innerHTML = `
          <div class="synth-failure-card">
            <div class="failure-icon">⚠️</div>
            <div class="failure-title">Calculation Inconclusive</div>
            <p class="failure-desc">No stable synthesis pathway exists between <strong>${this.slotA.name}</strong> and <strong>${this.slotB.name}</strong>. Great Sage recommends pairing complementary skill sets (e.g. Predator + Great Sage, Black Flame + Black Lightning).</p>
          </div>
        `;
      }
      if (fuseBtn) fuseBtn.disabled = false;
    }, 600);
  }
}

// Register custom element
if (typeof customElements !== "undefined" && !customElements.get("skill-synthesizer")) {
  customElements.define("skill-synthesizer", SkillSynthesizer);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { SkillSynthesizer };
}
