class MainNavigation extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.style.display = "contents";
    this.render();
    this.setActiveLink();
    this.bindActionButtons();
  }

  render() {
    this.innerHTML = `
    <!-- Primary navigation bar with brand logo and menu items -->
    <nav class="main-nav" id="main-nav">
      <!-- Brand logo and site title -->
      <a href="index.html" class="nav-brand">
        <div class="nav-brand-icon">
          <!-- Animated SVG logo with slime character design -->
          <svg width="64" height="64" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="slimeGradient" cx="50%" cy="40%" r="60%">
                <stop offset="0%" style="stop-color: #4dd4ff; stop-opacity: 1" />
                <stop offset="70%" style="stop-color: #2a9fd8; stop-opacity: 1" />
                <stop offset="100%" style="stop-color: #1a7fb8; stop-opacity: 1" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <ellipse cx="16" cy="20" rx="12" ry="8" fill="url(#slimeGradient)" filter="url(#glow)">
              <animateTransform attributeName="transform" type="scale" values="1,1;1.1,0.9;1,1" dur="2s" repeatCount="indefinite" />
            </ellipse>

            <ellipse cx="13" cy="17" rx="3" ry="2" fill="#ffffff" opacity="0.6">
              <animate attributeName="opacity" values="0.6;0.8;0.6" dur="2s" repeatCount="indefinite" />
            </ellipse>

            <circle cx="12" cy="18" r="1.5" fill="#0a0e27">
              <animate attributeName="r" values="1.5;1.2;1.5" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="20" cy="18" r="1.5" fill="#0a0e27">
              <animate attributeName="r" values="1.5;1.2;1.5" dur="3s" repeatCount="indefinite" />
            </circle>

            <circle cx="12.5" cy="17.5" r="0.5" fill="#ffffff" opacity="0.8" />
            <circle cx="20.5" cy="17.5" r="0.5" fill="#ffffff" opacity="0.8" />

            <circle cx="8" cy="12" r="1" fill="#4dd4ff" opacity="0.4">
              <animateTransform attributeName="transform" type="translate" values="0,0;2,-2;0,0" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="24" cy="14" r="0.8" fill="#4dd4ff" opacity="0.3">
              <animateTransform attributeName="transform" type="translate" values="0,0;-1,-3;0,0" dur="4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="16" cy="8" r="0.6" fill="#4dd4ff" opacity="0.5">
              <animateTransform attributeName="transform" type="translate" values="0,0;1,-1;0,0" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.5s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
        <span>Jura Tempest</span>
      </a>

      <!-- Main navigation menu items -->
      <div class="nav-links">
        <a href="overview.html">
          <span class="nav-icon">🏛️</span>
          <span>Overview</span>
        </a>
        <a href="codex.html">
          <span class="nav-icon">📚</span>
          <span>Codex</span>
        </a>
        <a href="skills.html">
          <span class="nav-icon">✨</span>
          <span>Skills</span>
        </a>
        <a href="factions.html">
          <span class="nav-icon">⚔️</span>
          <span>Factions</span>
        </a>
        <a href="chronicle.html">
          <span class="nav-icon">📜</span>
          <span>Chronicle</span>
        </a>
        <a href="records.html">
          <span class="nav-icon">📊</span>
          <span>Records</span>
        </a>
        <a href="index.html">
          <span class="nav-icon">🚪</span>
          <span>Exit</span>
        </a>
      </div>

      <!-- Quick Action Controls (Search, Theme, SFX) -->
      <div class="nav-quick-actions">
        <button class="nav-action-btn nav-search-btn" id="navSearchTrigger" title="Quick Search (Ctrl+K)">
          <span class="action-icon">🔍</span>
          <span class="action-label">Ctrl+K</span>
        </button>
        <button class="nav-action-btn nav-theme-btn" id="navThemeTrigger" title="Switch Magicule Theme">
          <span class="action-icon">🎨</span>
        </button>
        <button class="nav-action-btn nav-sfx-btn" id="navSfxTrigger" title="Toggle Sound FX">
          <span class="action-icon" id="navSfxIcon">🔊</span>
        </button>
      </div>

      <!-- Mobile menu toggle button -->
      <div class="mobile-menu-toggle" onclick="toggleMobileMenu()">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <!-- Navigation progress indicator -->
      <div class="nav-progress" id="nav-progress"></div>
    </nav>

    <!-- Mobile navigation overlay for responsive design -->
    <div class="mobile-nav" id="mobile-nav">
      <!-- Close button for mobile menu -->
      <button class="mobile-nav-close" onclick="toggleMobileMenu()">
        <span>✕</span>
      </button>
      
      <!-- Mobile Quick Search -->
      <div class="mobile-nav-search-wrap">
        <button class="mobile-search-btn" id="mobileSearchTrigger">
          <span>🔍 Quick Search (Characters, Skills, Codex)...</span>
        </button>
      </div>

      <!-- Mobile navigation menu items -->
      <a href="overview.html">
        <span class="nav-icon">🏛️</span>
        <span>Overview</span>
      </a>
      <a href="codex.html">
        <span class="nav-icon">📚</span>
        <span>Codex</span>
      </a>
      <a href="skills.html">
        <span class="nav-icon">✨</span>
        <span>Skills</span>
      </a>
      <a href="factions.html">
        <span class="nav-icon">⚔️</span>
        <span>Factions</span>
      </a>
      <a href="chronicle.html">
        <span class="nav-icon">📜</span>
        <span>Chronicle</span>
      </a>
      <a href="records.html">
        <span class="nav-icon">📊</span>
        <span>Historical Records</span>
      </a>
      <a href="index.html">
        <span class="nav-icon">🚪</span>
        <span>Exit</span>
      </a>

      <!-- Mobile Extras -->
      <div class="mobile-nav-extras">
        <button class="mobile-extra-btn" id="mobileThemeTrigger">
          <span>🎨 Change Theme</span>
        </button>
        <button class="mobile-extra-btn" id="mobileSfxTrigger">
          <span id="mobileSfxIcon">🔊 Toggle SFX</span>
        </button>
      </div>
    </div>
    `;
  }

  setActiveLink() {
    // Get the current filename from URL
    const path = window.location.pathname;
    const page = path.split("/").pop() || "index.html";

    // Find all links in both desktop and mobile navs
    const links = this.querySelectorAll(".nav-links a, .mobile-nav a");

    links.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === page) {
        link.classList.add("active");
      }
    });
  }

  bindActionButtons() {
    const searchBtn = this.querySelector("#navSearchTrigger");
    const mobileSearchBtn = this.querySelector("#mobileSearchTrigger");
    const themeBtn = this.querySelector("#navThemeTrigger");
    const mobileThemeBtn = this.querySelector("#mobileThemeTrigger");
    const sfxBtn = this.querySelector("#navSfxTrigger");
    const mobileSfxBtn = this.querySelector("#mobileSfxTrigger");
    const sfxIcon = this.querySelector("#navSfxIcon");
    const mobileSfxIcon = this.querySelector("#mobileSfxIcon");

    const openSearch = () => {
      if (typeof toggleMobileMenu === "function" && document.body.classList.contains("mobile-nav-active")) {
        toggleMobileMenu();
      }
      const palette = document.querySelector("command-palette");
      if (palette && typeof palette.open === "function") {
        palette.open();
      }
    };

    if (searchBtn) searchBtn.addEventListener("click", openSearch);
    if (mobileSearchBtn) mobileSearchBtn.addEventListener("click", openSearch);

    const handleTheme = () => {
      if (typeof toggleTheme === "function") {
        toggleTheme();
      }
      if (window.SoundEngine) {
        window.SoundEngine.play("themeSwitch");
      }
    };

    if (themeBtn) themeBtn.addEventListener("click", handleTheme);
    if (mobileThemeBtn) mobileThemeBtn.addEventListener("click", handleTheme);

    const handleSfx = () => {
      if (window.SoundEngine) {
        const enabled = window.SoundEngine.toggle();
        const icon = enabled ? "🔊" : "🔇";
        if (sfxIcon) sfxIcon.textContent = icon;
        if (mobileSfxIcon) mobileSfxIcon.textContent = `${icon} Toggle SFX`;
      }
    };

    if (sfxBtn) sfxBtn.addEventListener("click", handleSfx);
    if (mobileSfxBtn) mobileSfxBtn.addEventListener("click", handleSfx);

    // Sync initial SFX state
    if (window.SoundEngine && !window.SoundEngine.isEnabled) {
      if (sfxIcon) sfxIcon.textContent = "🔇";
      if (mobileSfxIcon) mobileSfxIcon.textContent = "🔇 Toggle SFX";
    }
  }
}

// Define the custom element
if (typeof customElements !== "undefined" && !customElements.get("main-navigation")) {
  customElements.define("main-navigation", MainNavigation);
}
