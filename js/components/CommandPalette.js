/**
 * Jura Tempest Federation - Global Command Palette (Ctrl+K)
 * Fast, keyboard-navigable spotlight search across characters, skills, codex, and factions.
 */

class CommandPalette extends HTMLElement {
  constructor() {
    super();
    this.isOpen = false;
    this.selectedIndex = 0;
    this.results = [];
    this.database = [];
    this.initDatabase();
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  initDatabase() {
    this.database = [
      // Major Characters
      { title: "Rimuru Tempest", subtitle: "Chancellor & Awakened Demon Lord (Chaos Creator)", category: "Characters", icon: "🌀", url: "character.html?id=rimuru", keywords: "slime leader protagonist raphael ciel beelzebuth" },
      { title: "Veldora Tempest", subtitle: "Storm Dragon (Catastrophe Class)", category: "Characters", icon: "🐉", url: "character.html?id=veldora", keywords: "true dragon storm faust king of investigation" },
      { title: "Benimaru", subtitle: "Generalissimo & Commander (Flame Lord)", category: "Characters", icon: "🔥", url: "character.html?id=benimaru", keywords: "ogre kijin fire general amaterasu" },
      { title: "Diablo", subtitle: "Demon Peer & Butler (Black Primordial Noir)", category: "Characters", icon: "😈", url: "character.html?id=diablo", keywords: "primordial demon black noir butler azazel" },
      { title: "Shion", subtitle: "Chief Bodyguard (War Lord)", category: "Characters", icon: "⚔️", url: "character.html?id=shion", keywords: "cook chef master chef susanoo bodyguard" },
      { title: "Shuna", subtitle: "Shrine Maiden & Chief Diplomat", category: "Characters", icon: "🌸", url: "character.html?id=shuna", keywords: "weaving magic holy blessing princess" },
      { title: "Souei", subtitle: "Shadow Leader & Reconnaissance Chief", category: "Characters", icon: "🗡️", url: "character.html?id=souei", keywords: "ninja shadow spy tsukuyomi" },
      { title: "Milim Nava", subtitle: "Dragonoid & Ancient Demon Lord (Destroyer)", category: "Characters", icon: "⭐", url: "character.html?id=milim", keywords: "octagram dragon satanael demon lord" },
      { title: "Guy Crimson", subtitle: "Lord of Darkness & First Demon Lord", category: "Characters", icon: "👑", url: "character.html?id=guy", keywords: "rouge red primordial lucifer demon lord" },
      { title: "Luminous Valentine", subtitle: "Queen of Nightmares & God of Lubelius", category: "Characters", icon: "🩸", url: "character.html?id=luminous", keywords: "vampire asmodeus holy lust" },
      { title: "Hinata Sakaguchi", subtitle: "Chief Knight of Holy Empire", category: "Characters", icon: "✝️", url: "character.html?id=hinata", keywords: "paladin holy sword usurper" },
      { title: "Zegion", subtitle: "Mist Lord & Labyrinth Guardian", category: "Characters", icon: "🪲", url: "character.html?id=zegion", keywords: "insectar mephisto water labyrinth" },
      { title: "Ranga", subtitle: "Star Wolf Leader (Star Lord)", category: "Characters", icon: "🐺", url: "character.html?id=ranga", keywords: "direwolf storm tempest hastur" },
      { title: "Geld", subtitle: "Barrier Lord & Chief Architect", category: "Characters", icon: "🛡️", url: "character.html?id=geld", keywords: "orc high orc gourmand barrier" },
      { title: "Gabiru", subtitle: "Dragon Lord & Air Corps Commander", category: "Characters", icon: "🦎", url: "character.html?id=gabiru", keywords: "lizardman dragonewt mood maker" },
      { title: "Hakuro", subtitle: "Military Instructor & Master Swordsman", category: "Characters", icon: "🥋", url: "character.html?id=hakuro", keywords: "swordmaster ogre martial arts" },

      // Skills
      { title: "Ciel / Great Sage / Raphael", subtitle: "Lord of Wisdom & Manas (Ultimate Skill)", category: "Skills", icon: "🧠", url: "skills.html?search=Raphael", keywords: "thought acceleration analysis parallel operation manas" },
      { title: "Beelzebuth (Lord of Gluttony)", subtitle: "Ultimate Skill - Predation & Soul Consumption", category: "Skills", icon: "🌀", url: "skills.html?search=Beelzebuth", keywords: "predator stomach isolate supply food chain" },
      { title: "Uriel (Lord of Vows)", subtitle: "Ultimate Skill - Spatial & Absolute Defense", category: "Skills", icon: "🛡️", url: "skills.html?search=Uriel", keywords: "absolute defense spatial dominate law manipulation" },
      { title: "Veldora (Storm King)", subtitle: "Ultimate Skill - Dragon Summon & Release", category: "Skills", icon: "⚡", url: "skills.html?search=Veldora", keywords: "storm magic true dragon storm blade" },
      { title: "Amaterasu (Blazing Sun)", subtitle: "Benimaru's Ultimate Skill - Divine Flame Domination", category: "Skills", icon: "🔥", url: "skills.html?search=Amaterasu", keywords: "fire light thought acceleration" },
      { title: "Azazel (Lord of Temptation)", subtitle: "Diablo's Ultimate Skill - Illusion & Fate Control", category: "Skills", icon: "🔮", url: "skills.html?search=Azazel", keywords: "all of creation world of temptation despair" },
      { title: "Satanael (Lord of Wrath)", subtitle: "Milim's Ultimate Skill - Infinite Magicule Breeder", category: "Skills", icon: "💥", url: "skills.html?search=Satanael", keywords: "wrath infinite energy breeder reactor" },
      { title: "Lucifer (Lord of Pride)", subtitle: "Guy Crimson's Ultimate Skill - Ultimate Duplication", category: "Skills", icon: "✨", url: "skills.html?search=Lucifer", keywords: "copy reproduce pride demon lord" },

      // Codex & Lore
      { title: "Existence Value (EP)", subtitle: "Numerical quantification of combat power & magicules", category: "Codex", icon: "📊", url: "codex.html?search=EP", keywords: "stats magicules energy power level" },
      { title: "Harvest Festival", subtitle: "The awakening ritual to become a True Demon Lord", category: "Codex", icon: "🌕", url: "codex.html?search=Harvest", keywords: "evolution soul sleep awakening demon lord" },
      { title: "Octagram (Eight Star Demon Lords)", subtitle: "The council governing the Demon Lord realms", category: "Codex", icon: "⭐", url: "codex.html?search=Octagram", keywords: "walpurgis guy milim rimuru luminous leon" },
      { title: "Primordial Demons (Seven Colors)", subtitle: "The ancient first seven demons born of darkness", category: "Codex", icon: "🖤", url: "codex.html?search=Primordial", keywords: "noir blanc jaune violet rouge vert bleu diablo" },
      { title: "True Dragons (Veldanava lineage)", subtitle: "The highest spiritual lifeforms embodying nature", category: "Codex", icon: "🐲", url: "codex.html?search=Dragon", keywords: "velzard velgrynd veldora veldanava" },

      // Factions & Places
      { title: "Jura Tempest Federation", subtitle: "Monster nation founded by Chancellor Rimuru", category: "Factions", icon: "🏛️", url: "factions.html#tempest", keywords: "monsters alliance capital rimuru city" },
      { title: "Armed Nation of Dwargon", subtitle: "Underground kingdom of dwarves ruled by King Gazef", category: "Factions", icon: "⛏️", url: "factions.html#dwargon", keywords: "dwarf gazef blacksmith technology" },
      { title: "Holy Empire of Lubelius", subtitle: "Western nation protected by the Luminas Faith", category: "Factions", icon: "⛪", url: "factions.html#lubelius", keywords: "hinata luminous paladins church" },
      { title: "Eastern Empire (Nasca Namrium Ulmeria)", subtitle: "Massive industrialized empire ruled by Rudra", category: "Factions", icon: "🚩", url: "factions.html#empire", keywords: "rudra tanks airships single digits" },

      // Chronicle & Records
      { title: "Founding of Tempest Chronicle", subtitle: "From cave slime to multi-species metropolis", category: "Chronicle", icon: "📜", url: "chronicle.html", keywords: "timeline history story events" },
      { title: "Battle Records & Feats", subtitle: "Chronicles of major battles & strategic victories", category: "Records", icon: "🏆", url: "records.html", keywords: "orc lord charybdis clayman farmus empire" },
      { title: "Skill Synthesizer", subtitle: "Interactive skill fusion & alchemy laboratory", category: "Interactive", icon: "🧪", url: "skills.html#synthesizer", keywords: "combine craft fusion tree evolve" },
      { title: "Tactical Battle Simulator", subtitle: "Compare characters and calculate simulated battles", category: "Interactive", icon: "⚔️", url: "character.html#simulator", keywords: "compare battle fight stats radar vs" }
    ];
  }

  render() {
    this.innerHTML = `
      <div class="cmd-palette-backdrop" id="cmdBackdrop">
        <div class="cmd-palette-modal" role="dialog" aria-modal="true" aria-label="Global Search">
          <div class="cmd-palette-header">
            <span class="cmd-search-icon">🔍</span>
            <input type="text" class="cmd-input" id="cmdInput" placeholder="Search characters, skills, codex, factions... (e.g. 'Diablo', 'EP', 'Raphael')" autocomplete="off" spellcheck="false" />
            <span class="cmd-shortcut-badge">ESC</span>
          </div>

          <div class="cmd-results-container" id="cmdResults" role="listbox">
            <!-- Dynamic search results populated here -->
          </div>

          <div class="cmd-palette-footer">
            <div class="cmd-hint"><span>↑↓</span> to navigate</div>
            <div class="cmd-hint"><span>↵</span> to select</div>
            <div class="cmd-hint"><span>ESC</span> to close</div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const input = this.querySelector("#cmdInput");
    const backdrop = this.querySelector("#cmdBackdrop");

    // Keyboard shortcut to toggle (Ctrl+K or Cmd+K)
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        this.toggle();
      }
      if (this.isOpen) {
        if (e.key === "Escape") {
          e.preventDefault();
          this.close();
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          this.moveSelection(1);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          this.moveSelection(-1);
        } else if (e.key === "Enter") {
          e.preventDefault();
          this.activateSelected();
        }
      }
    });

    if (input) {
      input.addEventListener("input", (e) => {
        this.search(e.target.value);
      });
    }

    if (backdrop) {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) {
          this.close();
        }
      });
    }
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    const backdrop = this.querySelector("#cmdBackdrop");
    const input = this.querySelector("#cmdInput");
    if (backdrop) {
      backdrop.classList.add("active");
    }
    if (input) {
      input.value = "";
      this.search("");
      setTimeout(() => input.focus(), 50);
    }
    if (window.SoundEngine) {
      window.SoundEngine.play("openModal");
    }
  }

  close() {
    this.isOpen = false;
    const backdrop = this.querySelector("#cmdBackdrop");
    if (backdrop) {
      backdrop.classList.remove("active");
    }
    if (window.SoundEngine) {
      window.SoundEngine.play("closeModal");
    }
  }

  search(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Show default top picks / popular items
      this.results = this.database.slice(0, 8);
    } else {
      this.results = this.database.filter((item) => {
        return (
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.keywords.toLowerCase().includes(q)
        );
      }).slice(0, 10);
    }

    this.selectedIndex = 0;
    this.renderResults();
  }

  renderResults() {
    const container = this.querySelector("#cmdResults");
    if (!container) return;

    if (this.results.length === 0) {
      container.innerHTML = `
        <div class="cmd-no-results">
          <div class="cmd-empty-icon">🌀</div>
          <div class="cmd-empty-text">No records found for that query.</div>
          <div class="cmd-empty-sub">Great Sage recommends searching by character name, skill, or faction.</div>
        </div>
      `;
      return;
    }

    // Group by category
    container.innerHTML = this.results.map((item, idx) => `
      <div class="cmd-result-item ${idx === this.selectedIndex ? "selected" : ""}" 
           data-index="${idx}"
           role="option" 
           aria-selected="${idx === this.selectedIndex}">
        <span class="cmd-item-icon">${item.icon}</span>
        <div class="cmd-item-info">
          <div class="cmd-item-title">${this.escapeHtml(item.title)}</div>
          <div class="cmd-item-subtitle">${this.escapeHtml(item.subtitle)}</div>
        </div>
        <span class="cmd-item-category">${this.escapeHtml(item.category)}</span>
      </div>
    `).join("");

    // Add click listeners to result items
    container.querySelectorAll(".cmd-result-item").forEach((el) => {
      el.addEventListener("click", () => {
        const index = parseInt(el.getAttribute("data-index"), 10);
        this.selectedIndex = index;
        this.activateSelected();
      });
      el.addEventListener("pointerenter", () => {
        const index = parseInt(el.getAttribute("data-index"), 10);
        this.selectedIndex = index;
        this.updateSelectedVisual();
        if (window.SoundEngine) {
          window.SoundEngine.play("hover");
        }
      });
    });
  }

  moveSelection(delta) {
    if (this.results.length === 0) return;
    this.selectedIndex = (this.selectedIndex + delta + this.results.length) % this.results.length;
    this.updateSelectedVisual();
    if (window.SoundEngine) {
      window.SoundEngine.play("hover");
    }
  }

  updateSelectedVisual() {
    const items = this.querySelectorAll(".cmd-result-item");
    items.forEach((el, idx) => {
      if (idx === this.selectedIndex) {
        el.classList.add("selected");
        el.setAttribute("aria-selected", "true");
        el.scrollIntoView({ block: "nearest" });
      } else {
        el.classList.remove("selected");
        el.setAttribute("aria-selected", "false");
      }
    });
  }

  activateSelected() {
    if (this.results[this.selectedIndex]) {
      const selected = this.results[this.selectedIndex];
      if (window.SoundEngine) {
        window.SoundEngine.play("select");
      }
      this.close();
      window.location.href = selected.url;
    }
  }

  escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
}

// Register custom element
if (typeof customElements !== "undefined" && !customElements.get("command-palette")) {
  customElements.define("command-palette", CommandPalette);
}

// Auto-inject onto page if missing
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    if (!document.querySelector("command-palette")) {
      const palette = document.createElement("command-palette");
      document.body.appendChild(palette);
    }
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { CommandPalette };
}
