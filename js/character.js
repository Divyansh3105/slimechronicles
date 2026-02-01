// Additional mobile-specific functions - Handle character sharing functionality
function shareCharacter() {
  // Get character ID from URL parameters for sharing
  const characterId = window.getURLParameter("id");

  // Validate character ID exists before attempting to share
  if (!characterId) {
    window.showNotification("No character selected to share");
    return;
  }

  // Prepare share data with character information and current URL
  const shareData = {
    title: `${document.querySelector(".profile-name")?.textContent || "Character"} - Jura Tempest Federation`,
    text: `Check out this character profile from the Jura Tempest Federation!`,
    url: window.location.href,
  };

  // Use native sharing API on supported mobile devices, fallback otherwise
  if (
    navigator.share &&
    (window.isMobileDevice ? window.isMobileDevice() : window.innerWidth <= 768)
  ) {
    navigator.share(shareData).catch((error) => {
      fallbackShare();
    });
  } else {
    fallbackShare();
  }
}

// Fallback sharing method - Copy URL to clipboard when native sharing unavailable
function fallbackShare() {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        window.showNotification("Character link copied to clipboard!");
      })
      .catch(() => {
        window.showNotification("Unable to copy link");
      });
  } else {
    window.showNotification("Sharing not supported on this device");
  }
}

// Character comparison feature placeholder - Future functionality
function compareCharacter() {
  window.showNotification("Character comparison feature coming soon!");
}

// Profile download feature placeholder - Future functionality
function downloadProfile() {
  window.showNotification("Profile download feature coming soon!");
}

// Make functions globally available - Export functions to window object for global access
window.shareCharacter = shareCharacter;
window.compareCharacter = compareCharacter;
window.downloadProfile = downloadProfile;

// Character data loader class - Handles efficient loading and caching of character data
class CharacterDataLoader {
  constructor() {
    // Initialize data storage and caching properties
    this.basicCharacters = null;
    this.detailedCache = new Map();
    this.loadingPromises = new Map();
    this.batchSize = 10;
    this.cacheHits = 0;
    this.cacheRequests = 0;
  }

  // Load basic character data from JSON file with error handling
  async loadBasicCharacters() {
    // Return cached data if already loaded
    if (this.basicCharacters) {
      return this.basicCharacters;
    }

    try {
      // Fetch basic character data from JSON endpoint
      const response = await fetch("data/characters-basic.json");

      // Validate HTTP response status
      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} - ${response.statusText}`,
        );
      }

      // Parse JSON response data
      const data = await response.json();

      // Validate data structure is array
      if (!Array.isArray(data)) {
        throw new Error("Character data is not an array");
      }

      // Validate array contains data
      if (data.length === 0) {
        throw new Error("Character data array is empty");
      }

      // Filter out invalid character entries
      const validatedData = data.filter((char) => {
        if (!char.id || !char.name || !char.race || !char.role) {
          console.warn("Invalid character data:", char);
          return false;
        }
        return true;
      });

      // Cache validated data for future use
      this.basicCharacters = validatedData;
      return this.basicCharacters;
    } catch (error) {
      console.error("Failed to load basic character data:", error);

      // Attempt to load fallback data on error
      const fallbackData = await this.getFallbackBasicData();
      this.basicCharacters = fallbackData;
      return this.basicCharacters;
    }
  }

  // Load character details with caching - Fetch detailed character data with cache management
  async loadCharacterDetails(characterId) {
    // Track cache request for performance metrics
    this.cacheRequests++;

    // Return cached data if available to improve performance
    if (this.detailedCache.has(characterId)) {
      this.cacheHits++;
      return this.detailedCache.get(characterId);
    }

    // Return existing loading promise if character is already being loaded
    if (this.loadingPromises.has(characterId)) {
      return this.loadingPromises.get(characterId);
    }

    // Create new loading promise and cache it to prevent duplicate requests
    const loadingPromise = this.fetchCharacterDetails(characterId);
    this.loadingPromises.set(characterId, loadingPromise);

    try {
      // Wait for character details to load and cache the result
      const details = await loadingPromise;
      this.detailedCache.set(characterId, details);
      this.loadingPromises.delete(characterId);
      return details;
    } catch (error) {
      // Clean up loading promise on error and re-throw
      this.loadingPromises.delete(characterId);
      throw error;
    }
  }

  // Fetch character details from API - Load individual character data from JSON file
  async fetchCharacterDetails(characterId) {
    try {
      // Fetch character data from individual JSON file
      const response = await fetch(`data/characters/${characterId}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(
        `Failed to load details for character ${characterId}:`,
        error,
      );

      // Fallback to basic character data if detailed data fails to load
      const basicChar = this.basicCharacters?.find((c) => c.id === characterId);
      return basicChar || null;
    }
  }

  // Load character batch - Get a subset of characters for pagination
  async loadCharacterBatch(startIndex = 0, batchSize = this.batchSize) {
    // Load basic characters first to ensure data is available
    const basicChars = await this.loadBasicCharacters();
    if (!basicChars) return [];

    // Calculate end index and return slice of characters
    const endIndex = Math.min(startIndex + batchSize, basicChars.length);
    return basicChars.slice(startIndex, endIndex);
  }

  // Get total character count - Return number of available characters
  async getCharacterCount() {
    const basicChars = await this.loadBasicCharacters();
    return basicChars ? basicChars.length : 0;
  }

  // Search characters by query - Filter characters based on search term
  async searchCharacters(query) {
    // Load basic characters for searching
    const basicChars = await this.loadBasicCharacters();
    if (!basicChars || !query) return basicChars || [];

    // Convert query to lowercase for case-insensitive search
    const searchTerm = query.toLowerCase();
    return basicChars.filter(
      (char) =>
        char.name.toLowerCase().includes(searchTerm) ||
        char.role.toLowerCase().includes(searchTerm) ||
        char.race.toLowerCase().includes(searchTerm),
    );
  }

  // Preload character details - Load multiple character details in parallel
  async preloadCharacterDetails(characterIds) {
    // Create promises for all character IDs to load in parallel
    const promises = characterIds.map((id) => this.loadCharacterDetails(id));
    try {
      // Wait for all promises to settle (some may fail)
      await Promise.allSettled(promises);
    } catch (error) {
      console.warn("Some character details failed to preload:", error);
    }
  }

  // Clear all caches - Reset cached data and loading promises
  clearCache() {
    this.detailedCache.clear();
    this.loadingPromises.clear();
  }

  // Get fallback basic data - Provide hardcoded fallback data when API fails
  async getFallbackBasicData() {
    try {
      // Attempt to load from JSON file as fallback
      const response = await fetch("data/characters-basic.json");
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.warn("Could not load from JSON file in fallback mode:", error);
    }

    // Return hardcoded fallback data as last resort
    return [
      {
        id: "rimuru",
        name: "Rimuru Tempest",
        race: "True Dragon (Ultimate Slime)",
        role: "Demon Lord & Founder",
        power: "Catastrophe",
        portrait: "🌀",
        image: "assets/characters/Rimuru.png",
        colorScheme: {
          primary: "#00c8ff",
          secondary: "#40d0ff",
          glow: "rgba(0, 200, 255, 0.6)",
        },
      },
      {
        id: "diablo",
        name: "Diablo",
        race: "Daemon (Primordial Black)",
        role: "Second Secretary",
        power: "Catastrophe",
        portrait: "😈",
        image: "assets/characters/Diablo.png",
        colorScheme: {
          primary: "#aa55ff",
          secondary: "#d488ff",
          glow: "rgba(170, 85, 255, 0.8)",
        },
      },
    ];
  }

  // Get performance metrics - Return cache performance statistics
  getPerformanceMetrics() {
    return {
      basicDataLoaded: !!this.basicCharacters,
      cachedCharacters: this.detailedCache.size,
      activeLoading: this.loadingPromises.size,
      cacheHitRate: this.cacheHits / Math.max(this.cacheRequests, 1),
      memoryUsage: this.estimateMemoryUsage(),
    };
  }

  // Estimate memory usage - Calculate approximate memory consumption
  estimateMemoryUsage() {
    let size = 0;
    // Calculate size of basic characters data
    if (this.basicCharacters) {
      size += JSON.stringify(this.basicCharacters).length;
    }
    // Calculate size of cached detailed character data
    for (const [key, value] of this.detailedCache) {
      size += JSON.stringify(value).length;
    }
    return `${(size / 1024).toFixed(2)} KB`;
  }
}

// Create global character loader instance - Initialize character data loader for application use
window.CharacterLoader = new CharacterDataLoader();

// Consolidated initialization function
function initializeCharacterPage() {
  // Load character profile after brief delay to ensure DOM is fully ready
  setTimeout(() => {
    loadCharacterProfile();
  }, 100);

  // Set up enhanced tab navigation after delay
  setTimeout(() => {
    setupTabNavigation();
  }, 1000);
}

// Setup enhanced tab navigation - Initialize keyboard and touch navigation for profile tabs
function setupTabNavigation() {
  // Add keyboard navigation support to profile tabs
  const tabs = document.querySelectorAll(".profile-tab");
  tabs.forEach((tab, index) => {
    tab.setAttribute("tabindex", "0");
    tab.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "Enter":
        case " ":
          // Activate tab on Enter or Space key
          e.preventDefault();
          tab.click();
          break;
        case "ArrowLeft":
          // Navigate to previous tab with left arrow
          e.preventDefault();
          const prevTab = tabs[index - 1] || tabs[tabs.length - 1];
          prevTab.focus();
          prevTab.click();
          break;
        case "ArrowRight":
          // Navigate to next tab with right arrow
          e.preventDefault();
          const nextTab = tabs[index + 1] || tabs[0];
          nextTab.focus();
          nextTab.click();
          break;
      }
    });
  });

  // Add mobile-specific optimizations for better performance
  if (
    window.isMobileDevice ? window.isMobileDevice() : window.innerWidth <= 768
  ) {
    // Optimize for mobile performance by adding mobile class
    document.body.classList.add("mobile-device");

    // Add touch event listeners for better mobile tab interaction
    const profileTabs = document.querySelector(".profile-tabs");
    if (profileTabs) {
      let isScrolling = false;

      // Track touch start to detect scrolling vs tapping
      profileTabs.addEventListener("touchstart", () => {
        isScrolling = false;
      });

      // Mark as scrolling if touch moves significantly
      profileTabs.addEventListener("touchmove", () => {
        isScrolling = true;
      });

      // Handle tab activation only if not scrolling
      profileTabs.addEventListener("touchend", (e) => {
        if (!isScrolling && e.target.classList.contains("profile-tab")) {
          e.target.click();
        }
      });
    }

    // Optimize images for mobile by enabling lazy loading
    const images = document.querySelectorAll(".profile-image");
    images.forEach((img) => {
      img.loading = "lazy";
      img.decoding = "async";
    });

    // Apply mobile performance optimizations
    document.documentElement.style.setProperty("--animation-duration", "0.2s");

    // Enable hardware acceleration for smooth scrolling
    const scrollElements = document.querySelectorAll(
      ".tab-section, .profile-content",
    );
    scrollElements.forEach((element) => {
      element.style.transform = "translateZ(0)";
      element.style.willChange = "transform";
    });
  }
}

// Initialize page when DOM is ready - Set up character profile page functionality
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeCharacterPage);
} else {
  // Initialize immediately if DOM is already loaded
  initializeCharacterPage();
}

// Character profile rendering functions - Generate HTML content for character display
function renderBasicCharacterProfile(character) {
  const content = document.getElementById("profile-content");
  if (!content) {
    console.error("profile-content element not found!");
    return;
  }

  content.innerHTML =
    generateProfileHeader(character) +
    `
    <div class="loading-details" style="text-align: center; padding: 2rem; opacity: 0.7;">
      <div class="loading-spinner"></div>
      <p>Loading detailed character information...</p>
    </div>
  `;
}

function renderCharacterProfile(character) {
  const content = document.getElementById("profile-content");
  if (!content) {
    console.error("profile-content element not found!");
    return;
  }

  content.innerHTML =
    generateProfileHeader(character, true) + generateProfileTabs(character);
}

// Generate profile header HTML - Create character header section with image and basic info
function generateProfileHeader(character, detailed = false) {
  const powerIndicator = detailed
    ? `
    <div class="character-power-indicator">
      <div class="power-ring"></div>
      <div class="power-level">${character.power}</div>
    </div>
  `
    : "";

  const nameAttributes = detailed ? `data-text="${character.name}"` : "";

  return `
    <div class="profile-header">
      <div class="profile-image-container">
        <img src="${character.image}" alt="${character.name}" class="profile-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="profile-portrait-fallback" style="display: none;">${character.portrait}</div>
        ${powerIndicator}
      </div>
      <h1 class="profile-name" ${nameAttributes}>${character.name}</h1>
      <div class="character-details">
        <p class="profile-race">Species: ${character.race}</p>
        <p class="profile-role">Role: ${character.role}</p>
        <div class="profile-power">Classification: ${character.power}</div>
      </div>
    </div>
  `;
}

// Generate profile tabs HTML - Create tabbed sections for detailed character information
function generateProfileTabs(character) {
  return `
    <div class="tab-section active" id="tab-overview">
      <div class="profile-section">
        <h3>📚 Character Overview</h3>
        ${character.lore ? `<p>${character.lore}</p>` : "<p>Character lore information is being compiled.</p>"}
        ${character.backstory ? `<h3>📖 Background</h3><p>${character.backstory}</p>` : ""}
        ${character.personality ? `<h3>🎭 Personality</h3><p>${character.personality}</p>` : ""}
      </div>
    </div>

    <div class="tab-section" id="tab-biography">
      <div class="profile-section">
        <h3>📜 Detailed Biography</h3>
        ${character.philosophy ? `<h4>🧠 Philosophy & Beliefs</h4><p>${character.philosophy}</p>` : ""}
        ${character.leadershipStyle ? `<h4>👑 Leadership Style</h4><p>${character.leadershipStyle}</p>` : ""}
        ${character.worldInfluence ? `<h4>🌍 World Influence</h4><p>${character.worldInfluence}</p>` : ""}
        ${character.alternateScenario ? `<h4>⚠️ Alternate Scenario</h4><p>${character.alternateScenario}</p>` : ""}
        ${generateQuotesSection(character)}
      </div>
    </div>

    <div class="tab-section" id="tab-skills">
      <div class="profile-section">
        <h3>⚔️ Abilities & Skills</h3>
        ${generateSkillsSection(character)}
        ${generateSpecialtiesSection(character)}
        ${generateWeaknessesSection(character)}
      </div>
    </div>

    <div class="tab-section" id="tab-relationships">
      <div class="profile-section">
        <h3>🤝 Relationships</h3>
        ${generateRelationshipsSection(character)}
      </div>
    </div>

    <div class="tab-section" id="tab-worldbuilding">
      <div class="profile-section">
        <h3>🌍 Character Analysis</h3>
        ${generateAchievementsSection(character)}
        ${generateEvolutionSection(character)}
        ${generateImpactStatsSection(character)}
      </div>
    </div>

    <div class="tab-section" id="tab-cultural">
      <div class="profile-section">
        <h3>🏛️ Cultural Impact</h3>
        ${character.worldInfluence ? `<p>${character.worldInfluence}</p>` : "<p>Cultural impact analysis is being compiled.</p>"}
      </div>
    </div>
  `;
}

// Helper functions for generating specific sections
function generateQuotesSection(character) {
  if (!character.quotes || character.quotes.length === 0) {
    return "<p>Biographical details are being researched and documented.</p>";
  }

  return `
    <h4>💬 Notable Quotes</h4>
    <div class="quotes-container">
      ${character.quotes
        .map(
          (quote) => `
        <div class="quote-item">
          <p class="quote-text">"${quote.text}"</p>
          <p class="quote-context">— ${quote.context}</p>
        </div>
      `,
        )
        .join("")}
    </div>
  `;
}

function generateSkillsSection(character) {
  if (!character.skills || character.skills.length === 0) {
    return "<p>Skill analysis and documentation in progress.</p>";
  }

  return `
    <div class="skills-grid">
      ${character.skills
        .map(
          (skill) => `
        <div class="skill-card-detailed ${skill.type.toLowerCase()}">
          <div class="skill-card-header">
            <div class="skill-card-icon">${skill.icon}</div>
            <div class="skill-card-info">
              <h4 class="skill-card-name">${skill.name}</h4>
              <span class="skill-card-type">${skill.type}</span>
            </div>
          </div>
          <p class="skill-card-description">${skill.description}</p>
          <div class="skill-card-bonus">${skill.bonus}</div>
        </div>
      `,
        )
        .join("")}
    </div>
  `;
}

function generateSpecialtiesSection(character) {
  if (!character.specialties || character.specialties.length === 0) return "";

  return `
    <div class="specialties-section">
      <h4>🌟 Specialties</h4>
      <div class="specialties-list">
        ${character.specialties.map((specialty) => `<span class="specialty-badge">${specialty}</span>`).join("")}
      </div>
    </div>
  `;
}

function generateWeaknessesSection(character) {
  if (!character.weaknesses || character.weaknesses.length === 0) return "";

  return `
    <div class="weaknesses-section">
      <h4>⚠️ Weaknesses</h4>
      <ul class="weaknesses-list">
        ${character.weaknesses.map((weakness) => `<li>${weakness}</li>`).join("")}
      </ul>
    </div>
  `;
}

function generateRelationshipsSection(character) {
  if (!character.relationships) {
    return "<p>Relationship data is being compiled and verified.</p>";
  }

  const sections = [];

  if (character.relationships.allies) {
    sections.push(`
      <div class="relationship-category">
        <h4 class="relationship-title allies">👥 Allies</h4>
        <div class="relationship-list">
          ${character.relationships.allies
            .map(
              (ally) => `
            <div class="relationship-item ally">
              <span class="relationship-name">${ally}</span>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    `);
  }

  if (character.relationships.rivals) {
    sections.push(`
      <div class="relationship-category">
        <h4 class="relationship-title rivals">⚔️ Rivals</h4>
        <div class="relationship-list">
          ${character.relationships.rivals
            .map(
              (rival) => `
            <div class="relationship-item rival">
              <span class="relationship-name">${rival}</span>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    `);
  }

  if (character.relationships.mentors) {
    sections.push(`
      <div class="relationship-category">
        <h4 class="relationship-title mentors">🎓 Mentors</h4>
        <div class="relationship-list">
          ${character.relationships.mentors
            .map(
              (mentor) => `
            <div class="relationship-item mentor">
              <span class="relationship-name">${mentor}</span>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    `);
  }

  return sections.length > 0
    ? `<div class="relationships-grid">${sections.join("")}</div>`
    : "<p>Relationship data is being compiled and verified.</p>";
}

function generateAchievementsSection(character) {
  if (!character.achievements || character.achievements.length === 0) return "";

  return `
    <h4>🏆 Achievements</h4>
    <ul class="achievements-list">
      ${character.achievements.map((achievement) => `<li>${achievement}</li>`).join("")}
    </ul>
  `;
}

function generateEvolutionSection(character) {
  if (!character.evolution || character.evolution.length === 0) return "";

  return `
    <h4>🔄 Evolution Forms</h4>
    <div class="evolution-timeline">
      ${character.evolution
        .map(
          (form, index) => `
        <div class="evolution-form">
          <div class="evolution-order">${index + 1}</div>
          <div class="evolution-content">
            <h5>${form.form}</h5>
            <p class="evolution-description">${form.description}</p>
            <span class="evolution-trigger">Trigger: ${form.trigger}</span>
          </div>
        </div>
      `,
        )
        .join("")}
    </div>
  `;
}

function generateImpactStatsSection(character) {
  if (!character.impact) return "";

  return `
    <h4>📊 Federation Impact Stats</h4>
    <div class="impact-stats">
      <div class="stat-box">
        <div class="stat-icon">👥</div>
        <div class="stat-label">Population Impact</div>
        <div class="stat-value">${character.impact.population}%</div>
        <div class="stat-bar-container">
          <div class="stat-bar" style="--fill-width: ${character.impact.population}%"></div>
        </div>
      </div>
      <div class="stat-box">
        <div class="stat-icon">⚔️</div>
        <div class="stat-label">Military Strength</div>
        <div class="stat-value">${character.impact.military}%</div>
        <div class="stat-bar-container">
          <div class="stat-bar" style="--fill-width: ${character.impact.military}%"></div>
        </div>
      </div>
      <div class="stat-box">
        <div class="stat-icon">💰</div>
        <div class="stat-label">Economy Growth</div>
        <div class="stat-value">${character.impact.economy}%</div>
        <div class="stat-bar-container">
          <div class="stat-bar" style="--fill-width: ${character.impact.economy}%"></div>
        </div>
      </div>
      <div class="stat-box">
        <div class="stat-icon">✨</div>
        <div class="stat-label">Magic Development</div>
        <div class="stat-value">${character.impact.magic}%</div>
        <div class="stat-bar-container">
          <div class="stat-bar" style="--fill-width: ${character.impact.magic}%"></div>
        </div>
      </div>
    </div>
  `;
}

// Setup tab switching functionality - Initialize tab navigation and interaction handlers
function setupTabSwitching() {
  // Get all profile tabs and tab sections for navigation setup
  const tabs = document.querySelectorAll(".profile-tab");
  const sections = document.querySelectorAll(".tab-section");

  // Add click event listeners to each tab for switching functionality
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs and sections
      tabs.forEach((t) => t.classList.remove("active"));
      sections.forEach((s) => s.classList.remove("active"));

      // Add active class to clicked tab
      tab.classList.add("active");

      // Get target tab identifier and activate corresponding section
      const targetTab = tab.getAttribute("data-tab");
      const targetSection = document.getElementById(`tab-${targetTab}`);

      if (targetSection) {
        // Activate target section and scroll to it on mobile
        targetSection.classList.add("active");

        // Smooth scroll to section on mobile devices
        if (
          window.isMobileDevice
            ? window.isMobileDevice()
            : window.innerWidth <= 768
        ) {
          targetSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }

      // Provide haptic feedback on supported devices
      if ("vibrate" in navigator) {
        navigator.vibrate(50);
      }

      // Play sound effect if audio system is available
      if (window.playSound) {
        window.playSound("tab-switch");
      }
    });
  });

  // Add keyboard navigation support for tabs
  tabs.forEach((tab, index) => {
    tab.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" && index > 0) {
        // Navigate to previous tab with left arrow key
        tabs[index - 1].focus();
        tabs[index - 1].click();
      } else if (e.key === "ArrowRight" && index < tabs.length - 1) {
        // Navigate to next tab with right arrow key
        tabs[index + 1].focus();
        tabs[index + 1].click();
      }
    });
  });
}

// Apply character theme - Set character-specific colors and styling
function applyCharacterTheme(colorScheme, characterId) {
  // Exit early if no color scheme provided
  if (!colorScheme) return;

  // Get document root and background elements for theming
  const root = document.documentElement;
  const background = document.getElementById("character-background");

  // Apply character color scheme to CSS custom properties
  root.style.setProperty("--character-primary", colorScheme.primary);
  root.style.setProperty("--character-secondary", colorScheme.secondary);
  root.style.setProperty("--character-glow", colorScheme.glow);

  // Apply character-specific background class if element exists
  if (background) {
    background.className = `character-background ${characterId}`;
  }

  // Update page title with character name
  document.title = `${characterId.charAt(0).toUpperCase() + characterId.slice(1)} - Character Profile`;
}

// Create floating elements for character theme - Generate animated background particles
function createFloatingElements(character) {
  // Get container element for floating particles
  const container = document.getElementById("floating-elements");
  if (!container) return;

  // Adjust particle count based on device type for performance
  const isMobile = window.isMobileDevice
    ? window.isMobileDevice()
    : window.innerWidth <= 768;
  const particleCount = isMobile ? 3 : 6;

  // Clear existing particles before creating new ones
  container.innerHTML = "";

  // Generate floating particles with random positioning and timing
  for (let i = 0; i < particleCount; i++) {
    const element = document.createElement("div");
    element.className = "floating-element";
    element.textContent = character.portrait || "✨";
    element.style.left = Math.random() * 100 + "%";
    element.style.animationDelay = Math.random() * 20 + "s";
    element.style.animationDuration = 15 + Math.random() * 10 + "s";
    container.appendChild(element);
  }
}

// Load character profile - Main function to load and display character data
async function loadCharacterProfile() {
  // Extract character ID from URL parameters
  const characterId = window.getURLParameter("id");

  // Validate character ID exists in URL
  if (!characterId) {
    window.displayError(
      "No Character Selected",
      "Please select a character from the codex to view their profile.",
      "profile-content",
      "codex.html",
      {
        "Character ID": "None",
        GameState: !!window.GameState ? "Available" : "Missing",
        CharacterLoader: !!window.CharacterLoader ? "Available" : "Missing",
      },
      true,
    );
    return;
  }

  // Validate GameState is available for data loading
  if (!window.GameState) {
    console.error("GameState not found on window object");
    window.displayError(
      "Loading Error",
      "Game state not loaded. Please refresh the page and try again.",
      "profile-content",
      null,
      {
        "Character ID": characterId,
        GameState: "Missing",
        CharacterLoader: !!window.CharacterLoader ? "Available" : "Missing",
      },
      true,
    );
    return;
  }

  try {
    // Show loading indicator while fetching data
    window.showLoadingIndicator(
      "profile-content",
      "Loading Character Data...",
      "Please wait while we fetch the character information.",
    );

    // Load basic character information first for quick display
    const basicCharacter =
      await window.GameState.getBasicCharacter(characterId);

    // Handle case where character doesn't exist
    if (!basicCharacter) {
      window.displayError(
        "Character Not Found",
        `Character "${characterId}" does not exist in our database.`,
        "profile-content",
        "codex.html",
        {
          "Character ID": characterId,
          GameState: "Available",
          CharacterLoader: !!window.CharacterLoader ? "Available" : "Missing",
        },
        true,
      );
      return;
    }

    // Apply character-specific theming and visual elements
    applyCharacterTheme(basicCharacter.colorScheme, characterId);
    createFloatingElements(basicCharacter);
    renderBasicCharacterProfile(basicCharacter);

    // Load detailed character information asynchronously
    const detailedCharacter = await window.GameState.getCharacter(characterId);

    // Render full character profile if detailed data is available
    if (detailedCharacter) {
      renderCharacterProfile(detailedCharacter);
    }

    // Initialize tab navigation and hide loading indicator
    setupTabSwitching();
    window.hideLoadingIndicator();

    // Show success notification to user
    window.showNotification(
      `${basicCharacter.name} profile loaded successfully!`,
    );
  } catch (error) {
    console.error("Error loading character:", error);
    window.displayError(
      "Loading Error",
      "Failed to load character data. Please check your connection and try again.",
      "profile-content",
      null,
      {
        "Character ID": characterId,
        Error: error.message,
        GameState: !!window.GameState ? "Available" : "Missing",
        CharacterLoader: !!window.CharacterLoader ? "Available" : "Missing",
      },
      true,
    );
    window.hideLoadingIndicator();
  }
}

// Attempt error recovery - Try to recover from loading errors
function attemptErrorRecovery() {
  // Clear character cache to force fresh data load
  if (window.GameState) {
    window.GameState.clearCharacterCache();
  }

  // Reset to first tab if tabs are available
  const firstTab = document.querySelector(".profile-tab");
  if (firstTab) {
    firstTab.click();
  }

  // Notify user of recovery attempt
  window.showNotification("System recovered. Please try again.");
}
