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
    return `
      <div class="skills-empty-state">
        <div class="empty-state-icon">⚔️</div>
        <h4>Skills & Abilities</h4>
        <p>Skill analysis and documentation in progress.</p>
        <div class="empty-state-animation">
          <div class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    `;
  }

  // Categorize skills by type
  const skillsByType = character.skills.reduce((acc, skill) => {
    const type = skill.type || 'General';
    if (!acc[type]) acc[type] = [];
    acc[type].push(skill);
    return acc;
  }, {});

  // Calculate skill statistics
  const totalSkills = character.skills.length;
  const skillTypes = Object.keys(skillsByType).length;
  const averageBonus = character.skills.reduce((sum, skill) => {
    const bonus = parseInt(skill.bonus?.match(/\d+/)?.[0] || 0);
    return sum + bonus;
  }, 0) / totalSkills;

  return `
    <!-- Skills Overview Dashboard -->
    <div class="skills-overview-dashboard">
      <div class="skills-stats-grid">
        <div class="skill-stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-content">
            <span class="stat-number">${totalSkills}</span>
            <span class="stat-label">Total Skills</span>
          </div>
        </div>
        <div class="skill-stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <span class="stat-number">${skillTypes}</span>
            <span class="stat-label">Categories</span>
          </div>
        </div>
        <div class="skill-stat-card">
          <div class="stat-icon">⚡</div>
          <div class="stat-content">
            <span class="stat-number">${Math.round(averageBonus)}</span>
            <span class="stat-label">Avg Bonus</span>
          </div>
        </div>
        <div class="skill-stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-content">
            <span class="stat-number">${getSkillMastery(character.skills)}</span>
            <span class="stat-label">Mastery</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Skills Categories -->
    <div class="skills-categories">
      ${Object.entries(skillsByType).map(([type, skills]) => `
        <div class="skill-category" data-category="${type.toLowerCase()}">
          <div class="category-header" onclick="toggleSkillCategory('${type.toLowerCase()}')">
            <div class="category-info">
              <span class="category-icon">${getSkillTypeIcon(type)}</span>
              <h4 class="category-title">${type} Skills</h4>
              <span class="category-count">(${skills.length})</span>
            </div>
            <div class="category-toggle">
              <span class="toggle-icon">▼</span>
            </div>
          </div>

          <div class="skills-grid" id="skills-${type.toLowerCase()}">
            ${skills.map((skill, index) => `
              <div class="skill-card-enhanced ${skill.type.toLowerCase()}" data-skill-index="${index}">
                <div class="skill-card-glow"></div>
                <div class="skill-card-header">
                  <div class="skill-card-icon-container">
                    <div class="skill-card-icon">${skill.icon}</div>
                    <div class="skill-rarity ${getSkillRarity(skill)}"></div>
                  </div>
                  <div class="skill-card-info">
                    <h4 class="skill-card-name">${skill.name}</h4>
                    <span class="skill-card-type">${skill.type}</span>
                  </div>
                  <div class="skill-card-actions">
                    <button class="skill-action-btn" onclick="showSkillDetails('${skill.name}')" title="View Details">
                      <span>📋</span>
                    </button>
                    <button class="skill-action-btn" onclick="compareSkill('${skill.name}')" title="Compare">
                      <span>⚖️</span>
                    </button>
                  </div>
                </div>

                <div class="skill-card-body">
                  <p class="skill-card-description">${skill.description}</p>

                  <div class="skill-card-stats">
                    <div class="skill-bonus-display">
                      <span class="bonus-label">Bonus:</span>
                      <span class="bonus-value">${skill.bonus}</span>
                    </div>
                    <div class="skill-power-meter">
                      <div class="power-meter-label">Power Level</div>
                      <div class="power-meter-bar">
                        <div class="power-meter-fill" style="width: ${getSkillPowerLevel(skill)}%"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="skill-card-footer">
                  <div class="skill-tags">
                    <span class="skill-tag ${skill.type.toLowerCase()}">${skill.type}</span>
                    <span class="skill-tag rarity-${getSkillRarity(skill)}">${getSkillRarity(skill)}</span>
                  </div>
                  <div class="skill-mastery-indicator">
                    <div class="mastery-stars">
                      ${generateMasteryStars(skill)}
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Skill Synergies Section -->
    <div class="skill-synergies-section">
      <h4>🔗 Skill Synergies</h4>
      <div class="synergy-grid">
        ${generateSkillSynergies(character.skills)}
      </div>
    </div>

    <!-- Skills Modal for detailed view -->
    <div id="skill-details-modal" class="skill-modal" style="display: none;">
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="modal-skill-name"></h3>
          <button class="modal-close" onclick="closeSkillModal()">&times;</button>
        </div>
        <div class="modal-body" id="modal-skill-content">
          <!-- Skill details will be populated here -->
        </div>
      </div>
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

// Helper functions for enhanced skills section
function getSkillTypeIcon(type) {
  const icons = {
    'Combat': '⚔️',
    'Magic': '🔮',
    'Support': '🛡️',
    'Leadership': '👑',
    'Crafting': '🔨',
    'General': '⭐'
  };
  return icons[type] || '⭐';
}

function getSkillRarity(skill) {
  const bonus = parseInt(skill.bonus?.match(/\d+/)?.[0] || 0);
  if (bonus >= 25) return 'legendary';
  if (bonus >= 20) return 'epic';
  if (bonus >= 15) return 'rare';
  if (bonus >= 10) return 'uncommon';
  return 'common';
}

function getSkillPowerLevel(skill) {
  const bonus = parseInt(skill.bonus?.match(/\d+/)?.[0] || 0);
  return Math.min((bonus / 30) * 100, 100);
}

function getSkillMastery(skills) {
  const totalBonus = skills.reduce((sum, skill) => {
    return sum + parseInt(skill.bonus?.match(/\d+/)?.[0] || 0);
  }, 0);

  if (totalBonus >= 100) return 'Master';
  if (totalBonus >= 75) return 'Expert';
  if (totalBonus >= 50) return 'Advanced';
  if (totalBonus >= 25) return 'Intermediate';
  return 'Novice';
}

function generateMasteryStars(skill) {
  const bonus = parseInt(skill.bonus?.match(/\d+/)?.[0] || 0);
  const stars = Math.min(Math.floor(bonus / 5), 5);
  return '★'.repeat(stars) + '☆'.repeat(5 - stars);
}

function generateSkillSynergies(skills) {
  if (skills.length < 2) return '<p>Not enough skills to show synergies.</p>';

  const synergies = [];
  for (let i = 0; i < skills.length - 1; i++) {
    for (let j = i + 1; j < skills.length; j++) {
      const skill1 = skills[i];
      const skill2 = skills[j];

      // Check for type synergies
      if (skill1.type === skill2.type) {
        synergies.push({
          skill1: skill1.name,
          skill2: skill2.name,
          type: 'Type Synergy',
          description: `${skill1.type} skills work together for enhanced effectiveness`,
          icon: '🔗'
        });
      }

      // Check for complementary skills
      if ((skill1.type === 'Combat' && skill2.type === 'Magic') ||
          (skill1.type === 'Magic' && skill2.type === 'Support')) {
        synergies.push({
          skill1: skill1.name,
          skill2: skill2.name,
          type: 'Complementary',
          description: `${skill1.type} and ${skill2.type} create powerful combinations`,
          icon: '⚡'
        });
      }
    }
  }

  if (synergies.length === 0) {
    return '<p>No notable synergies detected between current skills.</p>';
  }

  return synergies.slice(0, 3).map(synergy => `
    <div class="synergy-card">
      <div class="synergy-icon">${synergy.icon}</div>
      <div class="synergy-content">
        <h5>${synergy.skill1} + ${synergy.skill2}</h5>
        <span class="synergy-type">${synergy.type}</span>
        <p>${synergy.description}</p>
      </div>
    </div>
  `).join('');
}

// Skill interaction functions
function toggleSkillCategory(category) {
  const categoryElement = document.querySelector(`[data-category="${category}"]`);
  const skillsGrid = document.getElementById(`skills-${category}`);
  const toggleIcon = categoryElement.querySelector('.toggle-icon');

  if (skillsGrid.style.display === 'none' || !skillsGrid.style.display) {
    skillsGrid.style.display = 'grid';
    toggleIcon.textContent = '▲';
    categoryElement.classList.add('expanded');
  } else {
    skillsGrid.style.display = 'none';
    toggleIcon.textContent = '▼';
    categoryElement.classList.remove('expanded');
  }
}

function showSkillDetails(skillName) {
  // This would show detailed skill information in a modal
  window.showNotification(`Detailed view for ${skillName} coming soon!`);
}

function compareSkill(skillName) {
  // This would allow comparing skills
  window.showNotification(`Skill comparison for ${skillName} coming soon!`);
}

function closeSkillModal() {
  const modal = document.getElementById('skill-details-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Initialize skills section interactions
function initializeSkillsSection() {
  // Initialize power meter animations
  setTimeout(() => {
    const powerMeters = document.querySelectorAll('.power-meter-fill');
    powerMeters.forEach(meter => {
      const targetWidth = meter.style.width;
      meter.style.setProperty('--target-width', targetWidth);
      meter.classList.add('animate-fill');
    });
  }, 1000);

  // Add click outside modal to close
  const modal = document.getElementById('skill-details-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeSkillModal();
      }
    });
  }

  // Add keyboard navigation for skills
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSkillModal();
    }
  });
}

// Add to the initialization
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initializeSkillsSection, 1500);
});

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
  if (!character.achievements || character.achievements.length === 0) {
    return `
      <div class="achievements-section">
        <h4>🏆 Achievements & Accomplishments</h4>
        <div class="no-achievements-message">
          <div class="no-achievements-icon">🎯</div>
          <p>Achievement data is being compiled and will be available soon.</p>
        </div>
      </div>
    `;
  }

  // Categorize achievements by type
  const categorizedAchievements = categorizeAchievements(character.achievements);
  const totalAchievements = character.achievements.length;
  const achievementRarity = getAchievementRarity(totalAchievements);

  return `
    <div class="achievements-section">
      <h4>🏆 Achievements & Accomplishments</h4>

      <!-- Achievement Overview -->
      <div class="achievement-overview">
        <div class="achievement-stats">
          <div class="achievement-stat">
            <div class="stat-icon">🏅</div>
            <div class="stat-content">
              <span class="stat-number">${totalAchievements}</span>
              <span class="stat-label">Total Achievements</span>
            </div>
          </div>
          <div class="achievement-stat">
            <div class="stat-icon">⭐</div>
            <div class="stat-content">
              <span class="stat-number">${achievementRarity.level}</span>
              <span class="stat-label">${achievementRarity.title}</span>
            </div>
          </div>
          <div class="achievement-stat">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <span class="stat-number">${Object.keys(categorizedAchievements).length}</span>
              <span class="stat-label">Categories</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Achievement Categories -->
      <div class="achievement-categories">
        ${Object.entries(categorizedAchievements).map(([category, achievements]) => `
          <div class="achievement-category" data-category="${category}">
            <div class="category-header" onclick="toggleAchievementCategory('${category}')">
              <div class="category-info">
                <span class="category-icon">${getCategoryIcon(category)}</span>
                <span class="category-title">${category}</span>
                <span class="category-count">(${achievements.length})</span>
              </div>
              <div class="category-toggle">
                <span class="toggle-icon">▼</span>
              </div>
            </div>

            <div class="achievement-grid" id="achievements-${category}">
              ${achievements.map((achievement, index) => `
                <div class="achievement-card" data-achievement-index="${index}">
                  <div class="achievement-card-header">
                    <div class="achievement-icon">${getAchievementIcon(achievement)}</div>
                    <div class="achievement-rarity ${getAchievementCardRarity(achievement)}"></div>
                  </div>
                  <div class="achievement-content">
                    <h5 class="achievement-title">${getAchievementTitle(achievement)}</h5>
                    <p class="achievement-description">${achievement}</p>
                    <div class="achievement-meta">
                      <span class="achievement-type">${category}</span>
                      <span class="achievement-date">Unlocked</span>
                    </div>
                  </div>
                  <div class="achievement-glow"></div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Achievement Showcase -->
      <div class="achievement-showcase">
        <h5>🌟 Featured Achievement</h5>
        <div class="featured-achievement">
          <div class="featured-icon">${getAchievementIcon(character.achievements[0])}</div>
          <div class="featured-content">
            <h6>${getAchievementTitle(character.achievements[0])}</h6>
            <p>${character.achievements[0]}</p>
            <div class="featured-stats">
              <span class="featured-stat">
                <span class="stat-icon">🎯</span>
                <span>Primary Achievement</span>
              </span>
              <span class="featured-stat">
                <span class="stat-icon">⚡</span>
                <span>High Impact</span>
              </span>
              <span class="featured-stat">
                <span class="stat-icon">🏆</span>
                <span>${getAchievementCardRarity(character.achievements[0]).charAt(0).toUpperCase() + getAchievementCardRarity(character.achievements[0]).slice(1)} Rarity</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Helper function to categorize achievements
function categorizeAchievements(achievements) {
  const categories = {
    'Leadership': [],
    'Combat': [],
    'Evolution': [],
    'Diplomatic': [],
    'Magical': [],
    'Personal': []
  };

  achievements.forEach(achievement => {
    const achievementLower = achievement.toLowerCase();

    if (achievementLower.includes('founded') || achievementLower.includes('established') ||
        achievementLower.includes('led') || achievementLower.includes('chief') ||
        achievementLower.includes('minister') || achievementLower.includes('ruled')) {
      categories.Leadership.push(achievement);
    } else if (achievementLower.includes('defeated') || achievementLower.includes('combat') ||
               achievementLower.includes('mastered') && achievementLower.includes('technique') ||
               achievementLower.includes('warrior') || achievementLower.includes('battle')) {
      categories.Combat.push(achievement);
    } else if (achievementLower.includes('evolved') || achievementLower.includes('became') ||
               achievementLower.includes('transformed') || achievementLower.includes('demon lord')) {
      categories.Evolution.push(achievement);
    } else if (achievementLower.includes('united') || achievementLower.includes('alliance') ||
               achievementLower.includes('bridged') || achievementLower.includes('diplomatic') ||
               achievementLower.includes('trade')) {
      categories.Diplomatic.push(achievement);
    } else if (achievementLower.includes('magic') || achievementLower.includes('spell') ||
               achievementLower.includes('storm') || achievementLower.includes('elemental')) {
      categories.Magical.push(achievement);
    } else {
      categories.Personal.push(achievement);
    }
  });

  // Remove empty categories
  Object.keys(categories).forEach(key => {
    if (categories[key].length === 0) {
      delete categories[key];
    }
  });

  return categories;
}

// Helper function to get achievement rarity
function getAchievementRarity(count) {
  if (count >= 8) return { level: 'Legendary', title: 'Achievement Master' };
  if (count >= 6) return { level: 'Epic', title: 'High Achiever' };
  if (count >= 4) return { level: 'Rare', title: 'Accomplished' };
  return { level: 'Common', title: 'Rising Star' };
}

// Helper function to get category icon
function getCategoryIcon(category) {
  const icons = {
    'Leadership': '👑',
    'Combat': '⚔️',
    'Evolution': '🔄',
    'Diplomatic': '🤝',
    'Magical': '✨',
    'Personal': '🌟'
  };
  return icons[category] || '🏆';
}

// Helper function to get achievement icon
function getAchievementIcon(achievement) {
  const achievementLower = achievement.toLowerCase();

  if (achievementLower.includes('founded') || achievementLower.includes('established')) return '🏛️';
  if (achievementLower.includes('defeated') || achievementLower.includes('battle')) return '⚔️';
  if (achievementLower.includes('evolved') || achievementLower.includes('became')) return '🔄';
  if (achievementLower.includes('united') || achievementLower.includes('alliance')) return '🤝';
  if (achievementLower.includes('magic') || achievementLower.includes('mastered')) return '✨';
  if (achievementLower.includes('demon lord') || achievementLower.includes('true dragon')) return '👑';
  if (achievementLower.includes('hero')) return '🦸';
  if (achievementLower.includes('named')) return '📝';
  if (achievementLower.includes('trade') || achievementLower.includes('economy')) return '💰';
  if (achievementLower.includes('peace') || achievementLower.includes('diplomatic')) return '🕊️';

  return '🏆';
}

// Helper function to get achievement title
function getAchievementTitle(achievement) {
  // Extract a shorter title from the achievement description
  const words = achievement.split(' ');
  if (words.length <= 4) return achievement;

  // Try to find key action words
  const keyWords = ['Founded', 'Became', 'Defeated', 'Mastered', 'United', 'Established', 'Created'];
  for (const keyWord of keyWords) {
    if (achievement.includes(keyWord)) {
      const index = words.findIndex(word => word.includes(keyWord));
      return words.slice(index, Math.min(index + 3, words.length)).join(' ');
    }
  }

  return words.slice(0, 3).join(' ') + '...';
}

// Helper function to get achievement card rarity
function getAchievementCardRarity(achievement) {
  const achievementLower = achievement.toLowerCase();

  if (achievementLower.includes('demon lord') || achievementLower.includes('true dragon') ||
      achievementLower.includes('founded')) return 'legendary';
  if (achievementLower.includes('defeated') || achievementLower.includes('mastered') ||
      achievementLower.includes('evolved')) return 'epic';
  if (achievementLower.includes('became') || achievementLower.includes('established')) return 'rare';

  return 'common';
}

function generateEvolutionSection(character) {
  if (!character.evolution || character.evolution.length === 0) return "";

  // Calculate evolution stats and progression
  const totalForms = character.evolution.length;
  const evolutionStats = {
    totalEvolutions: totalForms,
    powerGrowth: Math.round((totalForms - 1) * 25), // Estimated power growth percentage
    timeSpan: "Unknown", // Could be calculated from data if available
    complexity: totalForms > 4 ? "Legendary" : totalForms > 2 ? "Advanced" : "Basic"
  };

  return `
    <div class="evolution-section">
      <h4>🔄 Evolution Timeline</h4>

      <!-- Evolution Overview Stats -->
      <div class="evolution-overview">
        <div class="evolution-stats">
          <div class="evolution-stat">
            <span class="evolution-stat-icon">📊</span>
            <span>Total Forms: ${evolutionStats.totalEvolutions}</span>
          </div>
          <div class="evolution-stat">
            <span class="evolution-stat-icon">⚡</span>
            <span>Power Growth: +${evolutionStats.powerGrowth}%</span>
          </div>
          <div class="evolution-stat">
            <span class="evolution-stat-icon">🏆</span>
            <span>Complexity: ${evolutionStats.complexity}</span>
          </div>
        </div>
      </div>

      <!-- Evolution Timeline -->
      <div class="evolution-timeline">
        ${character.evolution
          .map(
            (form, index) => `
          <div class="evolution-form" onclick="toggleEvolutionDetails(${index})" data-evolution-index="${index}">
            <div class="evolution-progress"></div>
            <div class="evolution-order">${index + 1}</div>
            <div class="evolution-content">
              <h5>${form.form}</h5>
              <p class="evolution-description">${form.description}</p>
              <div class="evolution-trigger ${getTriggerTypeClass(form.trigger)}">
                <span>Trigger: ${form.trigger}</span>
              </div>

              <!-- Additional Evolution Details (Initially Hidden) -->
              <div class="evolution-details" id="evolution-details-${index}" style="display: none;">
                <div class="evolution-abilities">
                  <h6>🌟 Key Abilities Gained:</h6>
                  <div class="ability-tags">
                    ${generateEvolutionAbilities(form, index)}
                  </div>
                </div>

                <div class="evolution-impact">
                  <h6>📈 Impact on Character:</h6>
                  <p>${generateEvolutionImpact(form, index)}</p>
                </div>

                ${form.powerLevel ? `
                <div class="evolution-power-level">
                  <h6>⚡ Power Level:</h6>
                  <div class="power-level-bar">
                    <div class="power-level-fill" style="width: ${Math.min(form.powerLevel || (index + 1) * 20, 100)}%"></div>
                    <span class="power-level-text">${form.powerLevel || (index + 1) * 20}%</span>
                  </div>
                </div>
                ` : ''}
              </div>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>

      <!-- Evolution Summary -->
      <div class="evolution-summary">
        <h6>📋 Evolution Summary</h6>
        <p>This character has undergone ${totalForms} major evolutionary transformations,
        representing a ${evolutionStats.complexity.toLowerCase()} evolution path with significant power growth
        and ability development throughout their journey.</p>
      </div>
    </div>
  `;
}

// Helper function to generate evolution abilities based on form
function generateEvolutionAbilities(form, index) {
  const abilityMap = {
    0: ["🧠 Basic Consciousness", "🔍 Observation"],
    1: ["🌀 Unique Skills", "🎯 Predator Ability"],
    2: ["👑 Leadership", "🗣️ Communication"],
    3: ["⚔️ Combat Mastery", "🔥 Elemental Control"],
    4: ["🌟 Ultimate Power", "🌍 Reality Manipulation"]
  };

  const abilities = abilityMap[index] || ["✨ Enhanced Abilities", "🔮 New Powers"];

  return abilities.map(ability =>
    `<span class="ability-tag">${ability}</span>`
  ).join('');
}

// Helper function to generate evolution impact description
function generateEvolutionImpact(form, index) {
  const impactDescriptions = [
    "Gained basic sentience and awareness of the world.",
    "Acquired unique abilities that set the foundation for future growth.",
    "Developed social connections and leadership qualities.",
    "Achieved significant combat prowess and magical mastery.",
    "Reached the pinnacle of power with reality-altering abilities."
  ];

  return impactDescriptions[index] || "Significant growth in power and abilities.";
}

// Helper function to determine trigger type and apply appropriate styling
function getTriggerTypeClass(trigger) {
  const triggerLower = trigger.toLowerCase();

  if (triggerLower.includes('name') || triggerLower.includes('naming')) {
    return 'trigger-naming';
  } else if (triggerLower.includes('death') || triggerLower.includes('dying') || triggerLower.includes('stabbing')) {
    return 'trigger-trauma';
  } else if (triggerLower.includes('skill') || triggerLower.includes('mastery') || triggerLower.includes('ultimate')) {
    return 'trigger-skill';
  } else if (triggerLower.includes('harvest') || triggerLower.includes('festival') || triggerLower.includes('ritual')) {
    return 'trigger-ritual';
  } else if (triggerLower.includes('natural') || triggerLower.includes('reincarnation')) {
    return 'trigger-natural';
  }

  return 'trigger-natural'; // Default fallback
}

// Function to toggle evolution details
function toggleEvolutionDetails(index) {
  const detailsElement = document.getElementById(`evolution-details-${index}`);
  const evolutionForm = document.querySelector(`[data-evolution-index="${index}"]`);

  if (detailsElement) {
    const isVisible = detailsElement.style.display !== 'none';

    // Hide all other details first
    document.querySelectorAll('.evolution-details').forEach(detail => {
      detail.style.display = 'none';
    });

    // Remove active class from all forms
    document.querySelectorAll('.evolution-form').forEach(form => {
      form.classList.remove('evolution-active');
    });

    if (!isVisible) {
      // Show this detail with animation
      detailsElement.style.display = 'block';
      evolutionForm.classList.add('evolution-active');

      // Animate in
      setTimeout(() => {
        detailsElement.style.opacity = '0';
        detailsElement.style.transform = 'translateY(10px)';
        detailsElement.style.transition = 'all 0.3s ease';

        requestAnimationFrame(() => {
          detailsElement.style.opacity = '1';
          detailsElement.style.transform = 'translateY(0)';
        });
      }, 10);

      // Scroll into view on mobile
      if (window.innerWidth <= 768) {
        evolutionForm.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }

      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }

      // Show notification
      if (window.showNotification) {
        window.showNotification(`Viewing details for evolution stage ${index + 1}`, 'info');
      }
    }
  }
}

// Make function globally available
window.toggleEvolutionDetails = toggleEvolutionDetails;

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
// Enhanced UI functionality for character page

// Toggle favorite status for character
function toggleFavorite() {
  const characterId = window.getURLParameter("id");
  if (!characterId) return;

  const favoriteIcon = document.getElementById("favorite-icon");
  const favorites = JSON.parse(localStorage.getItem("favoriteCharacters") || "[]");

  const isFavorited = favorites.includes(characterId);

  if (isFavorited) {
    // Remove from favorites
    const index = favorites.indexOf(characterId);
    favorites.splice(index, 1);
    favoriteIcon.textContent = "⭐";
    favoriteIcon.style.filter = "grayscale(100%)";
    window.showNotification("Removed from favorites");
  } else {
    // Add to favorites
    favorites.push(characterId);
    favoriteIcon.textContent = "🌟";
    favoriteIcon.style.filter = "none";
    window.showNotification("Added to favorites!");
  }

  localStorage.setItem("favoriteCharacters", JSON.stringify(favorites));

  // Add visual feedback
  favoriteIcon.style.transform = "scale(1.3)";
  setTimeout(() => {
    favoriteIcon.style.transform = "scale(1)";
  }, 200);
}

// Initialize favorite status on page load
function initializeFavoriteStatus() {
  const characterId = window.getURLParameter("id");
  if (!characterId) return;

  const favorites = JSON.parse(localStorage.getItem("favoriteCharacters") || "[]");
  const favoriteIcon = document.getElementById("favorite-icon");

  if (favorites.includes(characterId)) {
    favoriteIcon.textContent = "🌟";
    favoriteIcon.style.filter = "none";
  } else {
    favoriteIcon.textContent = "⭐";
    favoriteIcon.style.filter = "grayscale(100%)";
  }
}

// Floating Action Button functionality
function initializeFloatingActionButton() {
  const fabHTML = `
    <div class="floating-action-menu" id="fab-menu">
      <div class="fab-menu">
        <button class="fab-item" onclick="scrollToTop()" title="Scroll to Top">↑</button>
        <button class="fab-item" onclick="toggleTheme()" title="Toggle Theme">🎨</button>
        <button class="fab-item" onclick="printProfile()" title="Print Profile">🖨️</button>
      </div>
      <button class="fab-main" onclick="toggleFabMenu()">+</button>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', fabHTML);
}

function toggleFabMenu() {
  const fabMenu = document.getElementById('fab-menu');
  fabMenu.classList.toggle('open');
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  toggleFabMenu();
}

function toggleTheme() {
  const body = document.body;
  const currentTheme = body.dataset.theme || 'dark';
  const themes = ['dark', 'high-contrast', 'sepia'];
  const currentIndex = themes.indexOf(currentTheme);
  const nextTheme = themes[(currentIndex + 1) % themes.length];

  body.dataset.theme = nextTheme;
  localStorage.setItem('characterTheme', nextTheme);
  window.showNotification(`Theme changed to ${nextTheme}`);
  toggleFabMenu();
}

function printProfile() {
  window.print();
  toggleFabMenu();
}

// Enhanced loading with progress indicator
function showEnhancedLoading() {
  const loadingHTML = `
    <div class="enhanced-loading">
      <div class="loading-character-icon">
        <div class="slime-loader">
          <div class="slime-body"></div>
          <div class="slime-eyes">
            <div class="eye left"></div>
            <div class="eye right"></div>
          </div>
        </div>
      </div>
      <div class="loading-text">Loading Character Profile...</div>
      <div class="loading-progress-bar">
        <div class="progress-fill"></div>
      </div>
      <div class="loading-tips">
        <p id="loading-tip">Did you know? Characters can evolve through naming!</p>
      </div>
    </div>
  `;

  const content = document.getElementById('profile-content');
  if (content) {
    content.innerHTML = loadingHTML;
    startLoadingTips();
  }
}

function startLoadingTips() {
  const tips = [
    "Did you know? Characters can evolve through naming!",
    "The Jura Tempest Federation welcomes all races!",
    "Magic and technology coexist in this world!",
    "Demon Lords aren't always evil in this universe!",
    "Friendship and bonds are the strongest powers!"
  ];

  let currentTip = 0;
  const tipElement = document.getElementById('loading-tip');

  const tipInterval = setInterval(() => {
    if (!tipElement) {
      clearInterval(tipInterval);
      return;
    }

    currentTip = (currentTip + 1) % tips.length;
    tipElement.style.opacity = '0';

    setTimeout(() => {
      tipElement.textContent = tips[currentTip];
      tipElement.style.opacity = '1';
    }, 300);
  }, 3000);
}

// Initialize all enhanced features
function initializeEnhancedFeatures() {
  initializeFavoriteStatus();
  initializeFloatingActionButton();

  // Load saved theme
  const savedTheme = localStorage.getItem('characterTheme');
  if (savedTheme) {
    document.body.dataset.theme = savedTheme;
  }

  // Add keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch(e.key) {
        case 'f':
          e.preventDefault();
          toggleFavorite();
          break;
        case 'p':
          e.preventDefault();
          printProfile();
          break;
        case 't':
          e.preventDefault();
          toggleTheme();
          break;
      }
    }
  });
}

// Update the main initialization to include enhanced features
const originalInitialize = initializeCharacterPage;
initializeCharacterPage = function() {
  originalInitialize();
  setTimeout(() => {
    initializeEnhancedFeatures();
  }, 1000);
};

// Update the character profile rendering
const originalRenderCharacterProfile = renderCharacterProfile;
renderCharacterProfile = function(character) {
  originalRenderCharacterProfile(character);

  // Initialize achievement features after rendering
  setTimeout(() => {
    updateAchievementFavoriteIndicators();
  }, 500);
};

// Export functions for global access
window.toggleFavorite = toggleFavorite;
window.toggleFabMenu = toggleFabMenu;
window.scrollToTop = scrollToTop;
window.toggleTheme = toggleTheme;
window.printProfile = printProfile;
// Scroll progress indicator
function initializeScrollProgress() {
  const scrollIndicator = document.getElementById('scroll-indicator');
  if (!scrollIndicator) return;

  function updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = (scrollTop / scrollHeight) * 100;

    scrollIndicator.style.transform = `scaleX(${scrollProgress / 100})`;
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress(); // Initial call
}

// Enhanced page transitions
function addPageTransitions() {
  // Add smooth scroll to all internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add intersection observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observe all major sections
  document.querySelectorAll('.profile-section, .info-card, .skill-card-detailed').forEach(el => {
    observer.observe(el);
  });
}

// Performance monitoring
function initializePerformanceMonitoring() {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        const loadTime = perfData.loadEventEnd - perfData.loadEventStart;

        if (loadTime > 3000) {
          console.warn('Page load time is high:', loadTime + 'ms');
        }

        // Store performance metrics
        const metrics = {
          loadTime,
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          timestamp: Date.now()
        };

        localStorage.setItem('characterPagePerformance', JSON.stringify(metrics));
      }, 0);
    });
  }
}

// Enhanced error handling with user-friendly messages
function setupEnhancedErrorHandling() {
  window.addEventListener('error', (event) => {
    console.error('Character page error:', event.error);

    // Show user-friendly error message
    const errorMessage = getErrorMessage(event.error);
    window.showNotification(errorMessage, 'error');
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);

    const errorMessage = getErrorMessage(event.reason);
    window.showNotification(errorMessage, 'error');
  });
}

function getErrorMessage(error) {
  if (error.message?.includes('fetch')) {
    return 'Network error - please check your connection';
  } else if (error.message?.includes('JSON')) {
    return 'Data format error - please refresh the page';
  } else {
    return 'Something went wrong - please try again';
  }
}

// Initialize all enhanced features on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeScrollProgress();
  addPageTransitions();
  initializePerformanceMonitoring();
  setupEnhancedErrorHandling();

  // Add smooth scroll class to html
  document.documentElement.classList.add('smooth-scroll');
});

// Lazy loading for images
function initializeLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// Call lazy loading initialization
setTimeout(initializeLazyLoading, 1000);

// Enhanced Evolution Form Features
class EvolutionManager {
  constructor() {
    this.currentCharacter = null;
    this.evolutionData = null;
    this.comparisonMode = false;
  }

  // Initialize evolution features for a character
  initializeEvolution(character) {
    this.currentCharacter = character;
    this.evolutionData = character.evolution || [];
    this.setupEvolutionInteractions();
    this.addEvolutionKeyboardNavigation();
  }

  // Setup interactive features for evolution forms
  setupEvolutionInteractions() {
    // Add double-click to expand all details
    document.addEventListener('dblclick', (e) => {
      if (e.target.closest('.evolution-form')) {
        this.toggleAllEvolutionDetails();
      }
    });

    // Add right-click context menu for evolution forms
    document.addEventListener('contextmenu', (e) => {
      if (e.target.closest('.evolution-form')) {
        e.preventDefault();
        this.showEvolutionContextMenu(e);
      }
    });

    // Add evolution comparison feature
    this.addEvolutionComparison();
  }

  // Add evolution comparison functionality
  addEvolutionComparison() {
    // Initialize comparison mode state
    this.comparisonMode = false;
    this.selectedEvolutions = [];

    // Add comparison event listeners
    document.addEventListener('click', (e) => {
      if (this.comparisonMode && e.target.closest('.evolution-form')) {
        const evolutionForm = e.target.closest('.evolution-form');
        const evolutionIndex = parseInt(evolutionForm.dataset.evolutionIndex);
        this.toggleEvolutionSelection(evolutionIndex);
      }
    });
  }

  // Toggle evolution selection for comparison
  toggleEvolutionSelection(index) {
    const evolutionForm = document.querySelector(`[data-evolution-index="${index}"]`);
    if (!evolutionForm) return;

    if (this.selectedEvolutions.includes(index)) {
      // Remove from selection
      this.selectedEvolutions = this.selectedEvolutions.filter(i => i !== index);
      evolutionForm.classList.remove('evolution-selected');
    } else {
      // Add to selection (max 2 for comparison)
      if (this.selectedEvolutions.length < 2) {
        this.selectedEvolutions.push(index);
        evolutionForm.classList.add('evolution-selected');
      }
    }

    // Show comparison if 2 evolutions selected
    if (this.selectedEvolutions.length === 2) {
      this.showEvolutionComparison();
    }
  }

  // Show evolution comparison
  showEvolutionComparison() {
    if (this.selectedEvolutions.length !== 2) return;

    const [index1, index2] = this.selectedEvolutions;
    const evolution1 = this.evolutionData[index1];
    const evolution2 = this.evolutionData[index2];

    if (!evolution1 || !evolution2) return;

    // Create comparison modal
    const modal = document.createElement('div');
    modal.className = 'evolution-comparison-modal';
    modal.innerHTML = `
      <div class="comparison-content">
        <div class="comparison-header">
          <h3>Evolution Comparison</h3>
          <button class="close-comparison" onclick="evolutionManager.closeEvolutionComparison()">&times;</button>
        </div>
        <div class="comparison-body">
          <div class="evolution-compare-item">
            <h4>${evolution1.form}</h4>
            <p><strong>Description:</strong> ${evolution1.description}</p>
            <p><strong>Trigger:</strong> ${evolution1.trigger}</p>
          </div>
          <div class="comparison-divider">VS</div>
          <div class="evolution-compare-item">
            <h4>${evolution2.form}</h4>
            <p><strong>Description:</strong> ${evolution2.description}</p>
            <p><strong>Trigger:</strong> ${evolution2.trigger}</p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Auto-close after 10 seconds
    setTimeout(() => {
      this.closeEvolutionComparison();
    }, 10000);
  }

  // Close evolution comparison
  closeEvolutionComparison() {
    const modal = document.querySelector('.evolution-comparison-modal');
    if (modal) {
      modal.remove();
    }
    this.disableComparisonMode();
  }

  // Toggle all evolution details at once
  toggleAllEvolutionDetails() {
    const allDetails = document.querySelectorAll('.evolution-details');
    const allForms = document.querySelectorAll('.evolution-form');

    const anyVisible = Array.from(allDetails).some(detail =>
      detail.style.display !== 'none'
    );

    allDetails.forEach((detail, index) => {
      if (anyVisible) {
        detail.style.display = 'none';
        allForms[index]?.classList.remove('evolution-active');
      } else {
        detail.style.display = 'block';
        allForms[index]?.classList.add('evolution-active');
        this.animateDetailIn(detail);
      }
    });

    const action = anyVisible ? 'collapsed' : 'expanded';
    if (window.showNotification) {
      window.showNotification(`All evolution details ${action}`, 'info');
    }
  }

  // Animate detail section in
  animateDetailIn(detail) {
    detail.style.opacity = '0';
    detail.style.transform = 'translateY(10px)';
    detail.style.transition = 'all 0.3s ease';

    requestAnimationFrame(() => {
      detail.style.opacity = '1';
      detail.style.transform = 'translateY(0)';
    });
  }

  // Show context menu for evolution forms
  showEvolutionContextMenu(event) {
    const evolutionForm = event.target.closest('.evolution-form');
    const evolutionIndex = evolutionForm?.dataset.evolutionIndex;

    if (!evolutionIndex) return;

    // Remove existing context menu
    const existingMenu = document.querySelector('.evolution-context-menu');
    if (existingMenu) {
      existingMenu.remove();
    }

    // Create context menu
    const contextMenu = document.createElement('div');
    contextMenu.className = 'evolution-context-menu';
    contextMenu.innerHTML = `
      <div class="context-menu-item" onclick="evolutionManager.shareEvolution(${evolutionIndex})">
        📤 Share Evolution
      </div>
      <div class="context-menu-item" onclick="evolutionManager.compareEvolution(${evolutionIndex})">
        ⚖️ Compare Evolution
      </div>
      <div class="context-menu-item" onclick="evolutionManager.favoriteEvolution(${evolutionIndex})">
        ⭐ Favorite Evolution
      </div>
      <div class="context-menu-item" onclick="evolutionManager.copyEvolutionInfo(${evolutionIndex})">
        📋 Copy Info
      </div>
    `;

    // Position and show context menu
    contextMenu.style.position = 'fixed';
    contextMenu.style.left = event.clientX + 'px';
    contextMenu.style.top = event.clientY + 'px';
    contextMenu.style.zIndex = '10000';

    document.body.appendChild(contextMenu);

    // Remove context menu when clicking elsewhere
    setTimeout(() => {
      document.addEventListener('click', () => {
        contextMenu.remove();
      }, { once: true });
    }, 100);
  }

  // Add keyboard navigation for evolution forms
  addEvolutionKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.target.closest('.evolution-timeline')) {
        const evolutionForms = document.querySelectorAll('.evolution-form');
        const currentIndex = Array.from(evolutionForms).findIndex(form =>
          form.classList.contains('evolution-active')
        );

        switch(e.key) {
          case 'ArrowDown':
            e.preventDefault();
            this.navigateEvolution(currentIndex + 1, evolutionForms);
            break;
          case 'ArrowUp':
            e.preventDefault();
            this.navigateEvolution(currentIndex - 1, evolutionForms);
            break;
          case 'Enter':
            e.preventDefault();
            if (currentIndex >= 0) {
              toggleEvolutionDetails(currentIndex);
            }
            break;
          case 'Escape':
            e.preventDefault();
            this.closeAllEvolutionDetails();
            break;
        }
      }
    });
  }

  // Navigate between evolution forms
  navigateEvolution(newIndex, evolutionForms) {
    if (newIndex < 0) newIndex = evolutionForms.length - 1;
    if (newIndex >= evolutionForms.length) newIndex = 0;

    // Remove active class from all forms
    evolutionForms.forEach(form => form.classList.remove('evolution-active'));

    // Add active class to new form
    evolutionForms[newIndex].classList.add('evolution-active');
    evolutionForms[newIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    // Show details for the active form
    toggleEvolutionDetails(newIndex);
  }

  // Close all evolution details
  closeAllEvolutionDetails() {
    document.querySelectorAll('.evolution-details').forEach(detail => {
      detail.style.display = 'none';
    });
    document.querySelectorAll('.evolution-form').forEach(form => {
      form.classList.remove('evolution-active');
    });
  }

  // Share evolution information
  shareEvolution(index) {
    const evolution = this.evolutionData[index];
    if (!evolution) return;

    const shareText = `${this.currentCharacter.name} - Evolution ${index + 1}: ${evolution.form}\n${evolution.description}\nTrigger: ${evolution.trigger}`;

    if (navigator.share) {
      navigator.share({
        title: `${evolution.form} Evolution`,
        text: shareText,
        url: window.location.href
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        if (window.showNotification) {
          window.showNotification('Evolution info copied to clipboard!', 'success');
        }
      });
    }
  }

  // Compare evolution with others
  compareEvolution(index) {
    this.comparisonMode = !this.comparisonMode;

    if (this.comparisonMode) {
      this.enableComparisonMode(index);
    } else {
      this.disableComparisonMode();
    }
  }

  // Enable evolution comparison mode
  enableComparisonMode(selectedIndex) {
    const evolutionForms = document.querySelectorAll('.evolution-form');

    evolutionForms.forEach((form, index) => {
      if (index === selectedIndex) {
        form.classList.add('evolution-selected');
      } else {
        form.classList.add('evolution-dimmed');
      }
    });

    // Add comparison UI
    this.showComparisonUI(selectedIndex);

    if (window.showNotification) {
      window.showNotification('Comparison mode enabled. Click another evolution to compare.', 'info');
    }
  }

  // Disable evolution comparison mode
  disableComparisonMode() {
    document.querySelectorAll('.evolution-form').forEach(form => {
      form.classList.remove('evolution-selected', 'evolution-dimmed');
    });

    const comparisonUI = document.querySelector('.evolution-comparison-ui');
    if (comparisonUI) {
      comparisonUI.remove();
    }
  }

  // Show comparison UI
  showComparisonUI(selectedIndex) {
    const evolution = this.evolutionData[selectedIndex];
    const comparisonUI = document.createElement('div');
    comparisonUI.className = 'evolution-comparison-ui';
    comparisonUI.innerHTML = `
      <div class="comparison-header">
        <h4>🔍 Comparing: ${evolution.form}</h4>
        <button onclick="evolutionManager.disableComparisonMode()" class="close-comparison">✕</button>
      </div>
      <div class="comparison-stats">
        <div class="comparison-stat">
          <span>Evolution Stage:</span>
          <span>${selectedIndex + 1} of ${this.evolutionData.length}</span>
        </div>
        <div class="comparison-stat">
          <span>Trigger Type:</span>
          <span>${this.getEvolutionTriggerType(evolution.trigger)}</span>
        </div>
      </div>
    `;

    document.querySelector('.evolution-timeline').appendChild(comparisonUI);
  }

  // Get evolution trigger type
  getEvolutionTriggerType(trigger) {
    if (trigger.toLowerCase().includes('name')) return 'Naming';
    if (trigger.toLowerCase().includes('death')) return 'Trauma';
    if (trigger.toLowerCase().includes('skill')) return 'Skill Mastery';
    if (trigger.toLowerCase().includes('harvest')) return 'Ritual';
    return 'Natural';
  }

  // Favorite evolution
  favoriteEvolution(index) {
    const characterId = window.getURLParameter?.("id");
    if (!characterId) return;

    const favoriteKey = `favoriteEvolutions_${characterId}`;
    const favorites = JSON.parse(localStorage.getItem(favoriteKey) || '[]');

    const isFavorited = favorites.includes(index);

    if (isFavorited) {
      const favIndex = favorites.indexOf(index);
      favorites.splice(favIndex, 1);
      if (window.showNotification) {
        window.showNotification('Evolution removed from favorites', 'info');
      }
    } else {
      favorites.push(index);
      if (window.showNotification) {
        window.showNotification('Evolution added to favorites!', 'success');
      }
    }

    localStorage.setItem(favoriteKey, JSON.stringify(favorites));
    this.updateFavoriteIndicators();
  }

  // Update favorite indicators
  updateFavoriteIndicators() {
    const characterId = window.getURLParameter?.("id");
    if (!characterId) return;

    const favoriteKey = `favoriteEvolutions_${characterId}`;
    const favorites = JSON.parse(localStorage.getItem(favoriteKey) || '[]');

    document.querySelectorAll('.evolution-form').forEach((form, index) => {
      const indicator = form.querySelector('.favorite-indicator');
      if (indicator) {
        indicator.remove();
      }

      if (favorites.includes(index)) {
        const newIndicator = document.createElement('div');
        newIndicator.className = 'favorite-indicator';
        newIndicator.innerHTML = '⭐';
        form.appendChild(newIndicator);
      }
    });
  }

  // Copy evolution information
  copyEvolutionInfo(index) {
    const evolution = this.evolutionData[index];
    if (!evolution) return;

    const info = `Evolution ${index + 1}: ${evolution.form}\nDescription: ${evolution.description}\nTrigger: ${evolution.trigger}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(info).then(() => {
        if (window.showNotification) {
          window.showNotification('Evolution info copied!', 'success');
        }
      });
    }
  }
}

// Create global evolution manager instance
window.evolutionManager = new EvolutionManager();

// Initialize evolution manager when character loads
const originalLoadCharacterProfile = loadCharacterProfile;
loadCharacterProfile = async function() {
  await originalLoadCharacterProfile();

  // Initialize evolution manager after character loads
  setTimeout(() => {
    const characterId = window.getURLParameter("id");
    if (characterId && window.GameState) {
      window.GameState.getCharacter(characterId).then(character => {
        if (character && character.evolution) {
          window.evolutionManager.initializeEvolution(character);
        }
      });
    }
  }, 1500);
};
// Achievement interaction functions
function toggleAchievementCategory(category) {
  const categoryElement = document.querySelector(`[data-category="${category}"]`);
  const achievementGrid = document.getElementById(`achievements-${category}`);
  const toggleIcon = categoryElement.querySelector('.toggle-icon');

  if (achievementGrid.style.display === 'none' || !achievementGrid.style.display) {
    // Show category
    achievementGrid.style.display = 'grid';
    toggleIcon.textContent = '▲';
    categoryElement.classList.add('category-expanded');

    // Animate cards in
    const cards = achievementGrid.querySelectorAll('.achievement-card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'all 0.3s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  } else {
    // Hide category
    achievementGrid.style.display = 'none';
    toggleIcon.textContent = '▼';
    categoryElement.classList.remove('category-expanded');
  }

  // Haptic feedback
  if ('vibrate' in navigator) {
    navigator.vibrate(50);
  }
}

function showAchievementDetails(category, index) {
  // Remove existing modal
  const existingModal = document.querySelector('.achievement-modal');
  if (existingModal) {
    existingModal.remove();
  }

  // Get achievement data
  const categoryElement = document.querySelector(`[data-category="${category}"]`);
  const achievementCards = categoryElement.querySelectorAll('.achievement-card');
  const clickedCard = achievementCards[index];
  const achievementTitle = clickedCard.querySelector('.achievement-title').textContent;
  const achievementDescription = clickedCard.querySelector('.achievement-description').textContent;
  const achievementIcon = clickedCard.querySelector('.achievement-icon').textContent;
  const achievementRarity = clickedCard.querySelector('.achievement-rarity').className.split(' ')[1];

  // Create modal
  const modal = document.createElement('div');
  modal.className = 'achievement-modal';
  modal.innerHTML = `
    <div class="achievement-modal-content">
      <div class="achievement-modal-header">
        <div class="achievement-modal-icon ${achievementRarity}">${achievementIcon}</div>
        <button class="achievement-modal-close" onclick="closeAchievementModal()">✕</button>
      </div>
      <div class="achievement-modal-body">
        <h3 class="achievement-modal-title">${achievementTitle}</h3>
        <p class="achievement-modal-description">${achievementDescription}</p>
        <div class="achievement-modal-meta">
          <div class="achievement-modal-stat">
            <span class="stat-icon">🏷️</span>
            <span>Category: ${category}</span>
          </div>
          <div class="achievement-modal-stat">
            <span class="stat-icon">⭐</span>
            <span>Rarity: ${achievementRarity.charAt(0).toUpperCase() + achievementRarity.slice(1)}</span>
          </div>
          <div class="achievement-modal-stat">
            <span class="stat-icon">🎯</span>
            <span>Impact: High</span>
          </div>
        </div>
        <div class="achievement-modal-actions">
          <button class="achievement-action-btn" onclick="shareAchievement('${achievementTitle}', '${achievementDescription}')">
            📤 Share Achievement
          </button>
          <button class="achievement-action-btn" onclick="favoriteAchievement('${category}', ${index})">
            ⭐ Add to Favorites
          </button>
        </div>
      </div>
    </div>
    <div class="achievement-modal-backdrop" onclick="closeAchievementModal()"></div>
  `;

  document.body.appendChild(modal);

  // Animate modal in
  setTimeout(() => {
    modal.classList.add('achievement-modal-show');
  }, 10);

  // Prevent body scroll
  document.body.style.overflow = 'hidden';
}

function closeAchievementModal() {
  const modal = document.querySelector('.achievement-modal');
  if (modal) {
    modal.classList.remove('achievement-modal-show');
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = '';
    }, 300);
  }
}

function shareAchievement(title, description) {
  const shareText = `🏆 Achievement Unlocked: ${title}\n${description}`;

  if (navigator.share) {
    navigator.share({
      title: `Achievement: ${title}`,
      text: shareText,
      url: window.location.href
    });
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(shareText).then(() => {
      if (window.showNotification) {
        window.showNotification('Achievement details copied to clipboard!', 'success');
      }
    });
  }

  closeAchievementModal();
}

function favoriteAchievement(category, index) {
  const characterId = window.getURLParameter?.("id");
  if (!characterId) return;

  const favoriteKey = `favoriteAchievements_${characterId}`;
  const favorites = JSON.parse(localStorage.getItem(favoriteKey) || '[]');
  const achievementKey = `${category}_${index}`;

  const isFavorited = favorites.includes(achievementKey);

  if (isFavorited) {
    const favIndex = favorites.indexOf(achievementKey);
    favorites.splice(favIndex, 1);
    if (window.showNotification) {
      window.showNotification('Achievement removed from favorites', 'info');
    }
  } else {
    favorites.push(achievementKey);
    if (window.showNotification) {
      window.showNotification('Achievement added to favorites!', 'success');
    }
  }

  localStorage.setItem(favoriteKey, JSON.stringify(favorites));
  updateAchievementFavoriteIndicators();
  closeAchievementModal();
}

function updateAchievementFavoriteIndicators() {
  const characterId = window.getURLParameter?.("id");
  if (!characterId) return;

  const favoriteKey = `favoriteAchievements_${characterId}`;
  const favorites = JSON.parse(localStorage.getItem(favoriteKey) || '[]');

  document.querySelectorAll('.achievement-card').forEach((card, globalIndex) => {
    const category = card.closest('.achievement-category').dataset.category;
    const localIndex = Array.from(card.parentElement.children).indexOf(card);
    const achievementKey = `${category}_${localIndex}`;

    // Remove existing favorite indicator
    const existingIndicator = card.querySelector('.achievement-favorite');
    if (existingIndicator) {
      existingIndicator.remove();
    }

    // Add favorite indicator if favorited
    if (favorites.includes(achievementKey)) {
      const indicator = document.createElement('div');
      indicator.className = 'achievement-favorite';
      indicator.innerHTML = '⭐';
      card.appendChild(indicator);
    }
  });
}

// Initialize achievement features when page loads
function initializeAchievementFeatures() {
  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAchievementModal();
    }
  });

  // Update favorite indicators
  setTimeout(() => {
    updateAchievementFavoriteIndicators();
  }, 1000);

  // Auto-expand first category
  setTimeout(() => {
    const firstCategory = document.querySelector('.achievement-category');
    if (firstCategory) {
      const categoryName = firstCategory.dataset.category;
      toggleAchievementCategory(categoryName);
    }
  }, 1500);
}

// Make functions globally available
window.toggleAchievementCategory = toggleAchievementCategory;
window.showAchievementDetails = showAchievementDetails;
window.closeAchievementModal = closeAchievementModal;
window.shareAchievement = shareAchievement;
window.favoriteAchievement = favoriteAchievement;

// Initialize when character loads
const originalInitializeEnhancedFeatures = initializeEnhancedFeatures;
initializeEnhancedFeatures = function() {
  originalInitializeEnhancedFeatures();
  initializeAchievementFeatures();
};
