/**
 * Jura Tempest Federation - Great Sage / Ciel Tactical AI Widget
 * Interactive floating lore and tactical advisor with typewriter effects, Tensura knowledge base, and voice readout.
 */

class GreatSageWidget extends HTMLElement {
  constructor() {
    super();
    this.isOpen = false;
    this.isVoiceEnabled = false;
    this.isTyping = false;
    this.typeTimeout = null;
    this.knowledgeBase = this.initKnowledge();
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  initKnowledge() {
    return [
      {
        patterns: ["rimuru skill", "ultimate skill", "raphael", "beelzebuth", "uriel", "ciel", "skills of rimuru"],
        response: "Notice: Individual Rimuru Tempest possesses the following core Ultimate Skills:\n1. Raphael (Lord of Wisdom) / Manas Ciel: Thought Acceleration (1,000,000x), Parallel Operation, All of Creation, Future Attack Prediction.\n2. Beelzebuth (Lord of Gluttony): Predation, Stomach, Isolation, Supply, Food Chain, Soul Consumption.\n3. Uriel (Lord of Vows): Spatial Domination, Universal Barrier, Law Manipulation.\n4. Veldora (Storm King): Summon Storm Dragon, Release Storm Dragon, Storm Magic."
      },
      {
        patterns: ["strongest demon lord", "octagram", "guy", "milim", "power ranking"],
        response: "Report: Among the Octagram (Eight Star Demon Lords), Guy Crimson (Lord of Darkness) and Milim Nava (Destroyer) rank at the pinnacle with ancient combat experience exceeding 20,000 years. Chancellor Rimuru Tempest has attained parity with both following the Harvest Festival and True Dragon evolution."
      },
      {
        patterns: ["ep", "existence value", "power level", "magicule count", "what is ep"],
        response: "Analysis: Existence Value (EP) is the quantitative metric measuring an entity's total magical energy, physical power, and equipment potency. Examples:\n• Guy Crimson: ~40,000,000+ EP (with World-class weapon)\n• True Dragon Veldora: 88,126,579 EP\n• Rimuru Tempest: ~10,000,000+ base EP (80,000,000+ when releasing Veldora & Velgrynd)\n• Diablo: 6,666,666 EP"
      },
      {
        patterns: ["veldora vs guy", "guy vs veldora", "who wins veldora guy"],
        response: "Tactical Assessment: In past historical engagements, Guy Crimson repeatedly neutralized True Dragon Veldora due to Guy's Ultimate Skill 'Lucifer' and superior mastery over combat arts, despite Veldora possessing higher total magicule volume. With Veldora's mastery of 'Faust' and 'Storm King', modern engagements result in high-difficulty stalemate."
      },
      {
        patterns: ["skill synthesis", "how to fuse", "evolution tree", "synthesizer"],
        response: "Advisory: Skill Synthesis combines two or more compatible skills using High-Speed Calculation to evolve or discover higher-order abilities. For instance, combining [Predator] and [Starving One] during the Orc Disaster yielded Unique Skill [Gluttony], which later ascended to Ultimate Skill [Beelzebuth]."
      },
      {
        patterns: ["diablo", "noir", "primordial", "black primordial"],
        response: "Report: Diablo, formerly Noir (The Primordial Black), is the Second Secretary of Tempest and leader of the Black Numbers. Known as the most eccentric of the Seven Primordials, his loyalty to Lord Rimuru is absolute."
      },
      {
        patterns: ["shion", "cook", "master chef", "bodyguard"],
        response: "Notice: Shion holds the post of Chief Bodyguard and Secretary. Following the resurrection ceremony, her Unique Skill [Cook] / [Master Chef] gained the ability to rewrite the laws of reality to ensure any dish or strike accomplishes its intended outcome."
      },
      {
        patterns: ["harvest festival", "demon lord awakening", "how to become demon lord"],
        response: "Report: The Harvest Festival is triggered when a Demon Lord Seed absorbs 20,000+ human or high-density monster souls. During the Evolution Sleep, biological and spiritual structures restructure, granting immense magicules, skill evolutions, and bestowal of blessings upon all named subordinates via the Soul Corridor."
      }
    ];
  }

  render() {
    this.innerHTML = `
      <div class="great-sage-container" id="greatSageContainer">
        <!-- Floating Magic Circle Trigger Button -->
        <button class="great-sage-orb-btn" id="sageOrbBtn" title="Consult Great Sage / Ciel" aria-label="Open Great Sage Assistant">
          <div class="sage-magic-circle">
            <svg class="sage-svg-ring" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" class="sage-outer-ring" />
              <circle cx="50" cy="50" r="36" class="sage-inner-ring" />
              <polygon points="50,8 86,72 14,72" class="sage-triangle" />
              <polygon points="50,92 86,28 14,28" class="sage-triangle inverted" />
              <circle cx="50" cy="50" r="16" class="sage-core-circle" />
            </svg>
            <div class="sage-core-rune">賢</div>
          </div>
          <span class="sage-status-beacon"></span>
        </button>

        <!-- Assistant Dialog Window -->
        <div class="sage-dialog-card" id="sageDialog" role="dialog" aria-label="Great Sage Tactical System">
          <div class="sage-dialog-header">
            <div class="sage-header-title">
              <span class="sage-header-icon">🌀</span>
              <div>
                <div class="sage-title-main">Great Sage / Ciel</div>
                <div class="sage-title-sub">Tactical Lore & Analysis System</div>
              </div>
            </div>
            <div class="sage-header-actions">
              <button class="sage-tool-btn" id="sageVoiceToggle" title="Toggle Voice Modulation">
                <span class="voice-icon">🔇</span>
              </button>
              <button class="sage-tool-btn" id="sageCloseBtn" title="Minimize Window">✕</button>
            </div>
          </div>

          <div class="sage-dialog-body" id="sageBody">
            <div class="sage-message-box">
              <div class="sage-speaker-tag">【 NOTICE 】</div>
              <div class="sage-typewriter-text" id="sageText">Greetings, individual. Great Sage tactical calculation system is online. Select an inquiry below or input a custom analysis query.</div>
            </div>

            <!-- Quick Action Chips -->
            <div class="sage-quick-chips" id="sageChips">
              <button class="sage-chip" data-query="rimuru skills">⚡ Rimuru's Ultimate Skills</button>
              <button class="sage-chip" data-query="strongest demon lord">👑 Strongest Demon Lord?</button>
              <button class="sage-chip" data-query="what is ep">📊 What is Existence Value (EP)?</button>
              <button class="sage-chip" data-query="veldora vs guy">⚔️ Veldora vs Guy Crimson</button>
              <button class="sage-chip" data-query="skill synthesis">🧪 Skill Synthesis Guide</button>
              <button class="sage-chip" data-query="random lore">🎲 Random Lore Insight</button>
            </div>
          </div>

          <div class="sage-dialog-footer">
            <div class="sage-input-group">
              <input type="text" class="sage-input" id="sageInput" placeholder="Ask Great Sage anything..." autocomplete="off" />
              <button class="sage-send-btn" id="sageSendBtn" title="Analyze Query">
                <span>Analyze</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const orb = this.querySelector("#sageOrbBtn");
    const closeBtn = this.querySelector("#sageCloseBtn");
    const voiceBtn = this.querySelector("#sageVoiceToggle");
    const sendBtn = this.querySelector("#sageSendBtn");
    const input = this.querySelector("#sageInput");
    const chips = this.querySelectorAll(".sage-chip");

    if (orb) {
      orb.addEventListener("click", () => this.toggle());
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close());
    }

    if (voiceBtn) {
      voiceBtn.addEventListener("click", () => {
        this.isVoiceEnabled = !this.isVoiceEnabled;
        voiceBtn.querySelector(".voice-icon").textContent = this.isVoiceEnabled ? "🔊" : "🔇";
        voiceBtn.classList.toggle("active", this.isVoiceEnabled);
        if (window.SoundEngine) window.SoundEngine.play("click");
        this.typeMessage(this.isVoiceEnabled ? "Notice: Voice modulation synthesis enabled." : "Notice: Voice modulation muted.");
      });
    }

    if (sendBtn && input) {
      const handleSend = () => {
        const query = input.value.trim();
        if (query) {
          this.processQuery(query);
          input.value = "";
        }
      };
      sendBtn.addEventListener("click", handleSend);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleSend();
        }
      });
    }

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const query = chip.getAttribute("data-query");
        if (query) {
          if (window.SoundEngine) window.SoundEngine.play("select");
          this.processQuery(query);
        }
      });
    });
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
    const dialog = this.querySelector("#sageDialog");
    const orb = this.querySelector("#sageOrbBtn");
    if (dialog) dialog.classList.add("active");
    if (orb) orb.classList.add("active");
    if (window.SoundEngine) window.SoundEngine.play("greatSage");
  }

  close() {
    this.isOpen = false;
    const dialog = this.querySelector("#sageDialog");
    const orb = this.querySelector("#sageOrbBtn");
    if (dialog) dialog.classList.remove("active");
    if (orb) orb.classList.remove("active");
    if (window.SoundEngine) window.SoundEngine.play("closeModal");
  }

  processQuery(rawQuery) {
    const q = rawQuery.toLowerCase().trim();

    if (q === "random lore") {
      const randomItem = this.knowledgeBase[Math.floor(Math.random() * this.knowledgeBase.length)];
      this.typeMessage(randomItem.response);
      return;
    }

    // Match query against knowledge base patterns
    const found = this.knowledgeBase.find((item) =>
      item.patterns.some((pattern) => q.includes(pattern) || pattern.includes(q))
    );

    if (found) {
      this.typeMessage(found.response);
    } else {
      // Default intelligent Great Sage response
      this.typeMessage(
        `Report: Analysis of inquiry "${rawQuery}" indicates a specialized topic in Tensura lore. Please consult the [Codex] or [Skills] repositories, or formulate an inquiry regarding Rimuru's abilities, Demon Lords, or Existence Values.`
      );
    }
  }

  typeMessage(text) {
    const textEl = this.querySelector("#sageText");
    if (!textEl) return;

    if (this.typeTimeout) {
      clearTimeout(this.typeTimeout);
    }

    if (window.SoundEngine) {
      window.SoundEngine.play("greatSage");
    }

    textEl.textContent = "";
    let i = 0;
    this.isTyping = true;

    const typeChar = () => {
      if (i < text.length) {
        textEl.textContent += text.charAt(i);
        i++;
        this.typeTimeout = setTimeout(typeChar, 14);
      } else {
        this.isTyping = false;
      }
    };
    typeChar();

    // Voice Synthesis if enabled
    if (this.isVoiceEnabled && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/Notice:|Report:|Analysis:|Advisory:/g, ""));
      utterance.rate = 1.05;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  }
}

// Register custom element
if (typeof customElements !== "undefined" && !customElements.get("great-sage-widget")) {
  customElements.define("great-sage-widget", GreatSageWidget);
}

// Auto-inject onto page if missing
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    if (!document.querySelector("great-sage-widget")) {
      const widget = document.createElement("great-sage-widget");
      document.body.appendChild(widget);
    }
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { GreatSageWidget };
}
