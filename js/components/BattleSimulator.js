/**
 * Jura Tempest Federation - Tactical Battle Simulator & Radar Comparison Engine
 * Side-by-side character stat radar analysis and simulated tactical battle calculator.
 */

class BattleSimulator extends HTMLElement {
  constructor() {
    super();
    this.isOpen = false;
    this.charA = "rimuru";
    this.charB = "guy";
    this.database = this.initDatabase();
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  initDatabase() {
    return {
      rimuru: {
        id: "rimuru",
        name: "Rimuru Tempest",
        title: "Chaos Creator / True Dragon",
        avatar: "assets/characters/Rimuru.webp",
        ep: 10000000,
        epDisplay: "10,000,000+ (80M+ Dragon Release)",
        stats: { magicules: 98, physical: 85, skillTier: 100, defense: 99, battleIQ: 100 },
        ultimateSkills: ["Raphael / Ciel", "Beelzebuth", "Uriel", "Veldora"],
        resistances: ["Physical Attack Nullification", "Pain Nullification", "Thermal Fluctuation Nullification", "Spiritual Attack Resistance"],
        loreAdvantage: "Manas: Ciel performs multi-threaded predictive calculations to counter all known physical and magical vectors."
      },
      guy: {
        id: "guy",
        name: "Guy Crimson",
        title: "Lord of Darkness / First Demon Lord",
        avatar: "assets/characters/Guy.webp",
        ep: 40000000,
        epDisplay: "40,000,000+ (with Genesis Sword)",
        stats: { magicules: 99, physical: 98, skillTier: 99, defense: 96, battleIQ: 98 },
        ultimateSkills: ["Lucifer (Lord of Pride)"],
        resistances: ["Physical Attack Nullification", "Natural Elements Nullification", "Abnormal Status Nullification", "Spiritual Attack Nullification"],
        loreAdvantage: "20,000+ years of unvanquished combat mastery and the ability to duplicate any skill witnessed with 'Lucifer'."
      },
      milim: {
        id: "milim",
        name: "Milim Nava",
        title: "Destroyer / Dragonoid",
        avatar: "assets/characters/Milim.webp",
        ep: 80000000,
        epDisplay: "Infinite (Breeder Reactor)",
        stats: { magicules: 100, physical: 100, skillTier: 96, defense: 98, battleIQ: 82 },
        ultimateSkills: ["Satanael (Lord of Wrath)"],
        resistances: ["Physical Attack Nullification", "Holy-Demonic Magic Nullification", "Abnormal Status Nullification"],
        loreAdvantage: "Wrath King Satanael generates infinite magicules in direct proportion to anger."
      },
      veldora: {
        id: "veldora",
        name: "Veldora Tempest",
        title: "Storm Dragon (Catastrophe)",
        avatar: "assets/characters/Veldora.webp",
        ep: 88126579,
        epDisplay: "88,126,579",
        stats: { magicules: 100, physical: 95, skillTier: 92, defense: 94, battleIQ: 88 },
        ultimateSkills: ["Faust (Lord of Investigation)", "Storm King"],
        resistances: ["Physical Attack Nullification", "Natural Elements Nullification", "Spiritual Attack Resistance"],
        loreAdvantage: "Probability Manipulation allows converting improbable combat outcomes into guaranteed hits."
      },
      diablo: {
        id: "diablo",
        name: "Diablo",
        title: "Noir / Black Primordial",
        avatar: "assets/characters/Diablo.webp",
        ep: 6666666,
        epDisplay: "6,666,666",
        stats: { magicules: 90, physical: 88, skillTier: 95, defense: 92, battleIQ: 96 },
        ultimateSkills: ["Azazel (Lord of Temptation)"],
        resistances: ["Physical Attack Nullification", "Spiritual Attack Nullification", "Illusion Nullification"],
        loreAdvantage: "World of Temptation traps opponent's consciousness in an inescapable realm where Diablo controls physical laws."
      },
      benimaru: {
        id: "benimaru",
        name: "Benimaru",
        title: "Flame Lord / Generalissimo",
        avatar: "assets/characters/Benimaru.webp",
        ep: 5000000,
        epDisplay: "5,000,000+",
        stats: { magicules: 86, physical: 92, skillTier: 88, defense: 84, battleIQ: 90 },
        ultimateSkills: ["Amaterasu (Blazing Sun)"],
        resistances: ["Thermal Fluctuation Nullification", "Physical Attack Resistance", "Abnormal Status Resistance"],
        loreAdvantage: "Prominence Acceleration infuses martial strikes with pure stellar nuclear flame."
      },
      zegion: {
        id: "zegion",
        name: "Zegion",
        title: "Mist Lord / Water Spirit Insectar",
        avatar: "assets/characters/Zegion.webp",
        ep: 4988856,
        epDisplay: "4,988,856",
        stats: { magicules: 88, physical: 96, skillTier: 93, defense: 99, battleIQ: 92 },
        ultimateSkills: ["Mephisto (Lord of Illusion)"],
        resistances: ["Physical Attack Nullification", "Magical Attack Nullification", "Space-Time Manipulation Resistance"],
        loreAdvantage: "Exoskeleton forged from Rimuru's Magisteel cells grants near-impenetrable physical and magical deflection."
      },
      hinata: {
        id: "hinata",
        name: "Hinata Sakaguchi",
        title: "Chief Knight of Holy Empire",
        avatar: "assets/characters/Hinata Sakaguchi.webp",
        ep: 2500000,
        epDisplay: "2,500,000+",
        stats: { magicules: 78, physical: 89, skillTier: 86, defense: 82, battleIQ: 94 },
        ultimateSkills: ["Fortuna (Lord of Fortune) / Usurper"],
        resistances: ["Spirit Attack Resistance", "Pain Resistance", "Elemental Resistance"],
        loreAdvantage: "Seven Celestial Slashes target the spiritual core directly, destroying the soul on the seventh strike."
      }
    };
  }

  render() {
    this.innerHTML = `
      <div class="battle-sim-backdrop" id="simBackdrop">
        <div class="battle-sim-modal" role="dialog" aria-modal="true" aria-label="Tactical Battle Simulator">
          <div class="sim-header">
            <div class="sim-title-wrap">
              <span class="sim-icon">⚔️</span>
              <div>
                <h2>Tactical Battle Simulator & Radar Comparison</h2>
                <p>Compare Existence Values (EP), combat parameters, and simulated tactical outcomes.</p>
              </div>
            </div>
            <button class="sim-close-btn" id="simCloseBtn" title="Close Simulator">✕</button>
          </div>

          <div class="sim-body">
            <!-- Fighters Selector Row -->
            <div class="sim-fighters-row">
              <!-- Fighter A -->
              <div class="sim-fighter-card fighter-a">
                <label for="selectFighterA">Fighter Alpha</label>
                <select id="selectFighterA" class="sim-select">
                  ${Object.values(this.database).map(c => `
                    <option value="${c.id}" ${c.id === this.charA ? "selected" : ""}>${c.name} (${c.title})</option>
                  `).join("")}
                </select>
                <div class="fighter-ep-badge" id="epFighterA">EP: Loading...</div>
              </div>

              <div class="sim-vs-circle">VS</div>

              <!-- Fighter B -->
              <div class="sim-fighter-card fighter-b">
                <label for="selectFighterB">Fighter Beta</label>
                <select id="selectFighterB" class="sim-select">
                  ${Object.values(this.database).map(c => `
                    <option value="${c.id}" ${c.id === this.charB ? "selected" : ""}>${c.name} (${c.title})</option>
                  `).join("")}
                </select>
                <div class="fighter-ep-badge" id="epFighterB">EP: Loading...</div>
              </div>
            </div>

            <!-- Radar Chart & Comparison Container -->
            <div class="sim-radar-section">
              <div class="radar-chart-container" id="radarContainer">
                <!-- SVG Radar Chart rendered here -->
              </div>
              <div class="radar-legend">
                <div class="legend-item alpha"><span class="legend-dot dot-a"></span> <span id="legendNameA">Fighter A</span></div>
                <div class="legend-item beta"><span class="legend-dot dot-b"></span> <span id="legendNameB">Fighter B</span></div>
              </div>
            </div>

            <!-- Action Button -->
            <div class="sim-calc-row">
              <button class="sim-calculate-btn" id="simCalcBtn">
                <span>⚡ CALCULATE SIMULATED BATTLE</span>
              </button>
            </div>

            <!-- Simulation Combat Log Output -->
            <div class="sim-log-box" id="simLogBox">
              <div class="sim-log-prompt">Press "Calculate Simulated Battle" to execute Great Sage tactical simulation.</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const backdrop = this.querySelector("#simBackdrop");
    const closeBtn = this.querySelector("#simCloseBtn");
    const selectA = this.querySelector("#selectFighterA");
    const selectB = this.querySelector("#selectFighterB");
    const calcBtn = this.querySelector("#simCalcBtn");

    if (closeBtn) closeBtn.addEventListener("click", () => this.close());

    if (backdrop) {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) this.close();
      });
    }

    if (selectA) {
      selectA.addEventListener("change", (e) => {
        this.charA = e.target.value;
        this.updateComparison();
        if (window.SoundEngine) window.SoundEngine.play("select");
      });
    }

    if (selectB) {
      selectB.addEventListener("change", (e) => {
        this.charB = e.target.value;
        this.updateComparison();
        if (window.SoundEngine) window.SoundEngine.play("select");
      });
    }

    if (calcBtn) {
      calcBtn.addEventListener("click", () => this.runSimulation());
    }

    this.updateComparison();
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  open(preselectedChar = null) {
    this.isOpen = true;
    if (preselectedChar && this.database[preselectedChar]) {
      this.charA = preselectedChar;
      const selectA = this.querySelector("#selectFighterA");
      if (selectA) selectA.value = preselectedChar;
    }
    const backdrop = this.querySelector("#simBackdrop");
    if (backdrop) backdrop.classList.add("active");
    this.updateComparison();
    if (window.SoundEngine) window.SoundEngine.play("openModal");
  }

  close() {
    this.isOpen = false;
    const backdrop = this.querySelector("#simBackdrop");
    if (backdrop) backdrop.classList.remove("active");
    if (window.SoundEngine) window.SoundEngine.play("closeModal");
  }

  updateComparison() {
    const a = this.database[this.charA] || this.database.rimuru;
    const b = this.database[this.charB] || this.database.guy;

    const epA = this.querySelector("#epFighterA");
    const epB = this.querySelector("#epFighterB");
    const legA = this.querySelector("#legendNameA");
    const legB = this.querySelector("#legendNameB");

    if (epA) epA.textContent = `EP: ${a.epDisplay}`;
    if (epB) epB.textContent = `EP: ${b.epDisplay}`;
    if (legA) legA.textContent = a.name;
    if (legB) legB.textContent = b.name;

    this.renderRadar(a, b);
  }

  renderRadar(a, b) {
    const container = this.querySelector("#radarContainer");
    if (!container) return;

    const keys = [
      { key: "magicules", label: "Magicules" },
      { key: "physical", label: "Physical Might" },
      { key: "skillTier", label: "Skill Authority" },
      { key: "defense", label: "Defense/Nullify" },
      { key: "battleIQ", label: "Battle IQ" }
    ];

    const cx = 150;
    const cy = 150;
    const r = 100;
    const numAxes = keys.length;

    // Helper to calculate polygon points
    const getPoints = (fighterStats) => {
      return keys.map((k, i) => {
        const val = (fighterStats[k.key] || 50) / 100;
        const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
        const px = cx + Math.cos(angle) * r * val;
        const py = cy + Math.sin(angle) * r * val;
        return `${px.toFixed(1)},${py.toFixed(1)}`;
      }).join(" ");
    };

    const pointsA = getPoints(a.stats);
    const pointsB = getPoints(b.stats);

    // Axis lines and labels
    const axesSvg = keys.map((k, i) => {
      const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
      const x2 = cx + Math.cos(angle) * r;
      const y2 = cy + Math.sin(angle) * r;
      const lx = cx + Math.cos(angle) * (r + 24);
      const ly = cy + Math.sin(angle) * (r + 24);
      return `
        <line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
        <text x="${lx}" y="${ly}" fill="#aac8e8" font-size="10" font-family="Rajdhani, sans-serif" text-anchor="middle" dominant-baseline="middle">${k.label}</text>
      `;
    }).join("");

    // Background concentric rings
    const rings = [0.25, 0.5, 0.75, 1.0].map(scale => `
      <circle cx="${cx}" cy="${cy}" r="${r * scale}" fill="none" stroke="rgba(77,212,255,0.1)" stroke-width="1" />
    `).join("");

    container.innerHTML = `
      <svg viewBox="0 0 300 300" class="radar-svg" width="100%" height="260">
        ${rings}
        ${axesSvg}
        <!-- Fighter A Polygon (Cyan) -->
        <polygon points="${pointsA}" fill="rgba(77,212,255,0.35)" stroke="#4dd4ff" stroke-width="2" />
        <!-- Fighter B Polygon (Crimson) -->
        <polygon points="${pointsB}" fill="rgba(255,51,102,0.35)" stroke="#ff3366" stroke-width="2" />
      </svg>
    `;
  }

  runSimulation() {
    const a = this.database[this.charA] || this.database.rimuru;
    const b = this.database[this.charB] || this.database.guy;
    const logBox = this.querySelector("#simLogBox");
    if (!logBox) return;

    if (window.SoundEngine) window.SoundEngine.play("skillFuse");

    logBox.innerHTML = `
      <div class="sim-calculating">
        <div class="sim-spinner">⚔️</div>
        <span>Great Sage executing tactical probability calculation...</span>
      </div>
    `;

    setTimeout(() => {
      // Determine tactical outcome based on stats & lore advantages
      const scoreA = a.stats.magicules * 0.25 + a.stats.skillTier * 0.35 + a.stats.defense * 0.2 + a.stats.battleIQ * 0.2;
      const scoreB = b.stats.magicules * 0.25 + b.stats.skillTier * 0.35 + b.stats.defense * 0.2 + b.stats.battleIQ * 0.2;

      let winnerText = "";
      let winnerClass = "";
      if (a.id === b.id) {
        winnerText = "Mirror Match: Perfect Stalemate (Infinite Loop).";
        winnerClass = "draw";
      } else if (scoreA > scoreB + 2) {
        winnerText = `Tactical Advantage: ${a.name} (Predicted Victory Probability: ~68%)`;
        winnerClass = "alpha";
      } else if (scoreB > scoreA + 2) {
        winnerText = `Tactical Advantage: ${b.name} (Predicted Victory Probability: ~66%)`;
        winnerClass = "beta";
      } else {
        winnerText = `Equilibrium: High-Difficulty Stalemate (Unresolved Catastrophe Clash)`;
        winnerClass = "draw";
      }

      if (window.SoundEngine) window.SoundEngine.play("success");

      logBox.innerHTML = `
        <div class="sim-result-card">
          <div class="sim-result-header ${winnerClass}">
            <span>【 TACTICAL ASSESSMENT 】</span>
            <h3>${winnerText}</h3>
          </div>
          
          <div class="sim-combat-steps">
            <div class="sim-step">
              <span class="step-num">01</span>
              <div>
                <strong>Phase 1: Magicule Aura & Domain Clash</strong>
                <p>${a.name} (${a.epDisplay} EP) unleashes magicule pressure against ${b.name} (${b.epDisplay} EP), warping localized space-time boundaries.</p>
              </div>
            </div>

            <div class="sim-step">
              <span class="step-num">02</span>
              <div>
                <strong>Phase 2: Ultimate Authority Interception</strong>
                <p>${a.name} deploys Ultimate Skills [${a.ultimateSkills.join(", ")}]. ${b.name} responds with [${b.ultimateSkills.join(", ")}]. Both combatants leverage multi-layered dimensional nullifications.</p>
              </div>
            </div>

            <div class="sim-step">
              <span class="step-num">03</span>
              <div>
                <strong>Phase 3: Tactical Factor Analysis</strong>
                <p>• <strong>${a.name} Advantage:</strong> ${a.loreAdvantage}</p>
                <p>• <strong>${b.name} Advantage:</strong> ${b.loreAdvantage}</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }, 700);
  }
}

// Register custom element
if (typeof customElements !== "undefined" && !customElements.get("battle-simulator")) {
  customElements.define("battle-simulator", BattleSimulator);
}

// Auto-inject onto page if missing
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    if (!document.querySelector("battle-simulator")) {
      const sim = document.createElement("battle-simulator");
      document.body.appendChild(sim);
    }
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { BattleSimulator };
}
