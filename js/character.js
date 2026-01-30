// Mobile Navigation Functions - Handle mobile menu toggle functionality
function toggleMobileMenu() {
  // Get mobile navigation elements from DOM
  const toggle = document.querySelector(".mobile-menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const mainNav = document.getElementById("main-nav");

  // Validate required elements exist before proceeding
  if (!toggle || !mobileNav) {
    console.warn("Mobile navigation elements not found");
    return;
  }

  // Check current state of mobile navigation menu
  const isActive = mobileNav.classList.contains("active");

  if (isActive) {
    // Close menu - Remove active states and restore normal navigation
    mobileNav.classList.remove("active");
    toggle.classList.remove("active");
    document.body.classList.remove("mobile-nav-open");

    // Re-enable main nav interaction when mobile menu closes
    if (mainNav) {
      mainNav.style.pointerEvents = "auto";
    }
  } else {
    // Open menu - Add active states and disable main navigation
    mobileNav.classList.add("active");
    toggle.classList.add("active");
    document.body.classList.add("mobile-nav-open");

    // Disable main nav interaction to prevent conflicts
    if (mainNav) {
      mainNav.style.pointerEvents = "none";
    }
  }

  // Provide haptic feedback on supported mobile devices
  if ("vibrate" in navigator) {
    navigator.vibrate(50);
  }

  // Play sound effect if audio system is available
  if (window.playSound) {
    window.playSound("menu-toggle");
  }
}

// Initialize mobile navigation - Set up event handlers and gesture support
function initializeMobileNavigation() {
  // Get mobile navigation elements for initialization
  const toggle = document.querySelector(".mobile-menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  // Exit early if required elements are missing
  if (!toggle || !mobileNav) return;

  // Handle swipe gestures on mobile nav - Initialize touch tracking variables
  let startY = 0;
  let currentY = 0;

  // Track touch start position for swipe gesture detection
  mobileNav.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY;
  });

  // Update current touch position during swipe movement
  mobileNav.addEventListener("touchmove", (e) => {
    currentY = e.touches[0].clientY;
  });

  // Process swipe gesture when touch ends and close menu if swiped up
  mobileNav.addEventListener("touchend", () => {
    const swipeDistance = startY - currentY;

    // If swiped up significantly, close the menu
    if (swipeDistance > 100) {
      toggleMobileMenu();
    }
  });

  // Close menu when clicking nav links - Add event listeners to all mobile nav links
  document.querySelectorAll(".mobile-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      toggleMobileMenu();
    });
  });

  // Close menu when clicking outside - Detect clicks outside mobile nav area
  document.addEventListener("click", (e) => {
    if (mobileNav.classList.contains("active") &&
        !mobileNav.contains(e.target) &&
        !toggle.contains(e.target)) {
      toggleMobileMenu();
    }
  });

  // Close menu with Escape key - Handle keyboard accessibility
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileNav && mobileNav.classList.contains("active")) {
      toggleMobileMenu();
    }
  });

  // Handle visibility change (tab switching) - Close menu when tab becomes hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (mobileNav && mobileNav.classList.contains("active")) {
        // Close mobile nav when tab becomes hidden
        toggleMobileMenu();
      }
    }
  });

  // Handle resize events - Close mobile nav when switching to desktop view
  let isMobile = window.innerWidth <= 768;
  window.addEventListener("resize", () => {
    const newIsMobile = window.innerWidth <= 768;
    if (!newIsMobile && mobileNav.classList.contains("active")) {
      // Close mobile nav when switching to desktop
      toggleMobileMenu();
    }
    isMobile = newIsMobile;
  });
}

// Additional mobile-specific functions - Handle character sharing functionality
function shareCharacter() {
  // Get character ID from URL parameters for sharing
  const urlParams = new URLSearchParams(window.location.search);
  const characterId = urlParams.get("id");

  // Validate character ID exists before attempting to share
  if (!characterId) {
    showNotification("No character selected to share");
    return;
  }

  // Prepare share data with character information and current URL
  const shareData = {
    title: `${document.querySelector('.profile-name')?.textContent || 'Character'} - Jura Tempest Federation`,
    text: `Check out this character profile from the Jura Tempest Federation!`,
    url: window.location.href
  };

  // Use native sharing API on supported mobile devices, fallback otherwise
  if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    navigator.share(shareData).catch((error) => {
      console.log("Error sharing:", error);
      fallbackShare();
    });
  } else {
    fallbackShare();
  }
}

// Fallback sharing method - Copy URL to clipboard when native sharing unavailable
function fallbackShare() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showNotification("Character link copied to clipboard!");
    }).catch(() => {
      showNotification("Unable to copy link");
    });
  } else {
    showNotification("Sharing not supported on this device");
  }
}

// Character comparison feature placeholder - Future functionality
function compareCharacter() {
  showNotification("Character comparison feature coming soon!");
}

// Profile download feature placeholder - Future functionality
function downloadProfile() {
  showNotification("Profile download feature coming soon!");
}

// Theme toggle functionality - Cycle through available themes
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const themes = ['dark', 'high-contrast', 'sepia'];
  const currentIndex = themes.indexOf(currentTheme);
  const nextTheme = themes[(currentIndex + 1) % themes.length];

  // Apply new theme and save preference to localStorage
  document.documentElement.setAttribute('data-theme', nextTheme);
  localStorage.setItem('preferred-theme', nextTheme);

  showNotification(`Theme changed to ${nextTheme}`);
}

// Smooth scroll to top functionality - Enhanced scroll behavior
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Make functions globally available - Export functions to window object for global access
window.toggleMobileMenu = toggleMobileMenu;
window.shareCharacter = shareCharacter;
window.compareCharacter = compareCharacter;
window.downloadProfile = downloadProfile;
window.toggleTheme = toggleTheme;
window.scrollToTop = scrollToTop;

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

// DOM content loaded event handler - Initialize page functionality when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Initialize mobile navigation system
  initializeMobileNavigation();

  // Load character profile after brief delay to ensure DOM is fully ready
  setTimeout(() => {
    loadCharacterProfile();
  }, 100);
});

// Show loading indicator - Display loading state while fetching character data
function showLoadingIndicator() {
  // Get profile content container element
  const content = document.getElementById("profile-content");
  if (content) {
    // Replace content with loading indicator HTML
    content.innerHTML = `
      <div class="loading-indicator" style="text-align: center; padding: 3rem;">
        <div class="loading-spinner"></div>
        <h3>Loading Character Data...</h3>
        <p>Please wait while we fetch the character information.</p>
      </div>
    `;
  }
}

// Hide loading indicator - Remove loading state display
function hideLoadingIndicator() {
  // Find and remove loading indicator element
  const loadingIndicator = document.querySelector(".loading-indicator");
  if (loadingIndicator) {
    loadingIndicator.remove();
  }
}

// Display error message - Show comprehensive error information to user
function displayError(title, message, backLink = null) {
  // Generate back link HTML if provided, otherwise show default actions
  const backLinkHtml = backLink
    ? `
    <div class="error-actions">
      <a href="${backLink}" class="error-button">← Back to Codex</a>
      <button onclick="location.reload()" class="error-button">🔄 Try Again</button>
      <button onclick="attemptErrorRecovery()" class="error-button">🛠️ Auto-Fix</button>
    </div>
  `
    : `
    <div class="error-actions">
      <button onclick="location.reload()" class="error-button">🔄 Try Again</button>
      <button onclick="attemptErrorRecovery()" class="error-button">🛠️ Auto-Fix</button>
      <a href="codex.html" class="error-button">📚 Browse Characters</a>
    </div>
  `;

  // Get profile content container and display error information
  const content = document.getElementById("profile-content");
  if (content) {
    content.innerHTML = `
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <h2 class="error-title">${title}</h2>
        <p class="error-message">${message}</p>
        <div class="error-details">
          <details>
            <summary>🔍 Technical Details</summary>
            <div class="tech-details">
              <p><strong>URL:</strong> ${window.location.href}</p>
              <p><strong>Character ID:</strong> ${new URLSearchParams(window.location.search).get("id") || "None"}</p>
              <p><strong>GameState:</strong> ${!!window.GameState ? "Available" : "Missing"}</p>
              <p><strong>CharacterLoader:</strong> ${!!window.CharacterLoader ? "Available" : "Missing"}</p>
              <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            </div>
          </details>
        </div>
        ${backLinkHtml}
      </div>
    `;
  }
}

// Render basic character profile - Display initial character information while loading details
function renderBasicCharacterProfile(character) {
  // Get profile content container element
  const content = document.getElementById("profile-content");
  if (!content) {
    console.error("profile-content element not found!");
    return;
  }

  // Render basic character profile HTML with loading indicator for details
  content.innerHTML = `
    <div class="profile-header">
      <div class="profile-image-container">
        <img src="${character.image}" alt="${character.name}" class="profile-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="profile-portrait-fallback" style="display: none;">${character.portrait}</div>
      </div>
      <h1 class="profile-name">${character.name}</h1>
      <div class="character-details">
        <p class="profile-race">Species: ${character.race}</p>
        <p class="profile-role">Role: ${character.role}</p>
        <div class="profile-power">Classification: ${character.power}</div>
      </div>
    </div>

    <div class="loading-details" style="text-align: center; padding: 2rem; opacity: 0.7;">
      <div class="loading-spinner"></div>
      <p>Loading detailed character information...</p>
    </div>
  `;
}

// Render complete character profile - Display full character information with all tabs and sections
function renderCharacterProfile(character) {
  // Get profile content container element
  const content = document.getElementById("profile-content");
  if (!content) {
    console.error("profile-content element not found!");
    return;
  }

  // Render comprehensive character profile with tabbed sections
  content.innerHTML = `
    <div class="profile-header">
      <div class="profile-image-container">
        <img src="${character.image}" alt="${character.name}" class="profile-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="profile-portrait-fallback" style="display: none;">${character.portrait}</div>
        <div class="character-power-indicator">
          <div class="power-ring"></div>
          <div class="power-level">${character.power}</div>
        </div>
      </div>
      <h1 class="profile-name" data-text="${character.name}">${character.name}</h1>
      <div class="character-details">
        <p class="profile-race">Species: ${character.race}</p>
        <p class="profile-role">Role: ${character.role}</p>
        <div class="profile-power">Classification: ${character.power}</div>
      </div>
      <div class="character-stats-preview">
        ${character.impact ? `
          <div class="stat-preview">
            <div class="stat-preview-item">
              <span class="stat-icon">👥</span>
              <span class="stat-value">${character.impact.population || 0}</span>
              <span class="stat-label">Population</span>
            </div>
            <div class="stat-preview-item">
              <span class="stat-icon">⚔️</span>
              <span class="stat-value">${character.impact.military || 0}</span>
              <span class="stat-label">Military</span>
            </div>
            <div class="stat-preview-item">
              <span class="stat-icon">💰</span>
              <span class="stat-value">${character.impact.economy || 0}</span>
              <span class="stat-label">Economy</span>
            </div>
            <div class="stat-preview-item">
              <span class="stat-icon">✨</span>
              <span class="stat-value">${character.impact.magic || 0}</span>
              <span class="stat-label">Magic</span>
            </div>
          </div>
        ` : ''}
      </div>
    </div>

    <div class="tab-section active" id="tab-overview">
      <div class="profile-section">
        <h3>📚 Character Overview</h3>
        ${character.lore ? `<p>${character.lore}</p>` : "<p>Character lore information is being compiled.</p>"}

        ${
          character.backstory
            ? `
          <h3>📖 Background</h3>
          <p>${character.backstory}</p>
        `
            : ""
        }

        ${
          character.personality
            ? `
          <h3>🎭 Personality</h3>
          <p>${character.personality}</p>
        `
            : ""
        }
      </div>
    </div>

    <div class="tab-section" id="tab-biography">
      <div class="profile-section">
        <h3>📜 Detailed Biography</h3>
        ${
          character.philosophy
            ? `
          <h4>🧠 Philosophy & Beliefs</h4>
          <p>${character.philosophy}</p>
        `
            : ""
        }

        ${
          character.leadershipStyle
            ? `
          <h4>👑 Leadership Style</h4>
          <p>${character.leadershipStyle}</p>
        `
            : ""
        }

        ${
          character.worldInfluence
            ? `
          <h4>🌍 World Influence</h4>
          <p>${character.worldInfluence}</p>
        `
            : ""
        }

        ${
          character.alternateScenario
            ? `
          <h4>⚠️ Alternate Scenario</h4>
          <p>${character.alternateScenario}</p>
        `
            : ""
        }

        ${
          character.quotes && character.quotes.length > 0
            ? `
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
        `
            : "<p>Biographical details are being researched and documented.</p>"
        }
      </div>
    </div>

    <div class="tab-section" id="tab-skills">
      <div class="profile-section">
        <h3>⚔️ Abilities & Skills</h3>
        ${
          character.skills && character.skills.length > 0
            ? `
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
        `
            : "<p>Skill analysis and documentation in progress.</p>"
        }

        ${
          character.specialties && character.specialties.length > 0
            ? `
          <div class="specialties-section">
            <h4>🌟 Specialties</h4>
            <div class="specialties-list">
              ${character.specialties
                .map(
                  (specialty) => `
                <span class="specialty-badge">${specialty}</span>
              `,
                )
                .join("")}
            </div>
          </div>
        `
            : ""
        }

        ${
          character.weaknesses && character.weaknesses.length > 0
            ? `
          <div class="weaknesses-section">
            <h4>⚠️ Weaknesses</h4>
            <ul class="weaknesses-list">
              ${character.weaknesses
                .map(
                  (weakness) => `
                <li>${weakness}</li>
              `,
                )
                .join("")}
            </ul>
          </div>
        `
            : ""
        }
      </div>
    </div>

    <div class="tab-section" id="tab-relationships">
      <div class="profile-section">
        <h3>🤝 Relationships</h3>
        ${
          character.relationships
            ? `
          <div class="relationships-grid">
            ${
              character.relationships.allies
                ? `
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
            `
                : ""
            }

            ${
              character.relationships.rivals
                ? `
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
            `
                : ""
            }

            ${
              character.relationships.mentors
                ? `
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
            `
                : ""
            }
          </div>
        `
            : "<p>Relationship data is being compiled and verified.</p>"
        }
      </div>
    </div>

    <div class="tab-section" id="tab-worldbuilding">
      <div class="profile-section">
        <h3>🌍 Character Analysis</h3>
        ${
          character.achievements && character.achievements.length > 0
            ? `
          <h4>🏆 Achievements</h4>
          <ul class="achievements-list">
            ${character.achievements
              .map(
                (achievement) => `
              <li>${achievement}</li>
            `,
              )
              .join("")}
          </ul>
        `
            : ""
        }

        ${
          character.evolution && character.evolution.length > 0
            ? `
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
        `
            : ""
        }

        ${
          character.impact
            ? `
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
        `
            : ""
        }
      </div>
    </div>

    <div class="tab-section" id="tab-cultural">
      <div class="profile-section">
        <h3>🏛️ Cultural Impact</h3>
        ${
          character.worldInfluence
            ? `
          <p>${character.worldInfluence}</p>
        `
            : "<p>Cultural impact analysis is being compiled.</p>"
        }
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
        if (window.innerWidth <= 768) {
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
  const isMobile = window.innerWidth <= 768;
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

// Show notification message - Display temporary notification to user
function showNotification(message) {
  // Create notification element with styling
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, var(--primary-blue), var(--accent-cyan));
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(77, 212, 255, 0.3);
    z-index: 10000;
    animation: slideInRight 0.3s ease-out;
  `;

  // Add notification to DOM
  document.body.appendChild(notification);

  // Auto-remove notification after 3 seconds with fade out animation
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease-out";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Load character profile - Main function to load and display character data
async function loadCharacterProfile() {
  // Extract character ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const characterId = urlParams.get("id");

  // Validate character ID exists in URL
  if (!characterId) {
    displayError(
      "No Character Selected",
      "Please select a character from the codex to view their profile.",
      "codex.html",
    );
    return;
  }

  // Validate GameState is available for data loading
  if (!window.GameState) {
    console.error("GameState not found on window object");
    displayError(
      "Loading Error",
      "Game state not loaded. Please refresh the page and try again.",
    );
    return;
  }

  try {
    // Show loading indicator while fetching data
    showLoadingIndicator();

    // Load basic character information first for quick display
    const basicCharacter =
      await window.GameState.getBasicCharacter(characterId);

    // Handle case where character doesn't exist
    if (!basicCharacter) {
      displayError(
        "Character Not Found",
        `Character "${characterId}" does not exist in our database.`,
        "codex.html",
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
    hideLoadingIndicator();

    // Show success notification to user
    showNotification(`${basicCharacter.name} profile loaded successfully!`);
  } catch (error) {
    console.error("Error loading character:", error);
    displayError(
      "Loading Error",
      "Failed to load character data. Please check your connection and try again.",
    );
    hideLoadingIndicator();
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
  showNotification("System recovered. Please try again.");
}

// Initialize page when DOM is ready - Set up character profile page functionality
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    // Initialize mobile navigation first
    initializeMobileNavigation();

    // Set up enhanced tab navigation and mobile optimizations after delay
    setTimeout(() => {
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
      if (window.innerWidth <= 768) {
        // Optimize for mobile performance by adding mobile class
        document.body.classList.add('mobile-device');

        // Add touch event listeners for better mobile tab interaction
        const profileTabs = document.querySelector('.profile-tabs');
        if (profileTabs) {
          let isScrolling = false;

          // Track touch start to detect scrolling vs tapping
          profileTabs.addEventListener('touchstart', () => {
            isScrolling = false;
          });

          // Mark as scrolling if touch moves significantly
          profileTabs.addEventListener('touchmove', () => {
            isScrolling = true;
          });

          // Handle tab activation only if not scrolling
          profileTabs.addEventListener('touchend', (e) => {
            if (!isScrolling && e.target.classList.contains('profile-tab')) {
              e.target.click();
            }
          });
        }

        // Optimize images for mobile by enabling lazy loading
        const images = document.querySelectorAll('.profile-image');
        images.forEach(img => {
          img.loading = 'lazy';
        });
      }
    }, 1000);
  });
} else {
  // Initialize immediately if DOM is already loaded
  initializeMobileNavigation();
}

// End of character.js - Character profile page functionality with mobile navigation and data loading
// Enhanced UI Features - Add interactive elements and improved user experience

// Add interactive tooltips for stat preview items
function addInteractiveTooltips() {
  const statItems = document.querySelectorAll('.stat-preview-item');

  statItems.forEach(item => {
    const tooltip = document.createElement('div');
    tooltip.className = 'interactive-tooltip';

    const statLabel = item.querySelector('.stat-label').textContent;
    const statValue = item.querySelector('.stat-value').textContent;

    tooltip.innerHTML = `
      <strong>${statLabel}</strong><br>
      Current Level: ${statValue}<br>
      <small>Click to view detailed breakdown</small>
    `;

    document.body.appendChild(tooltip);

    item.addEventListener('mouseenter', (e) => {
      const rect = item.getBoundingClientRect();
      tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
      tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
      tooltip.classList.add('show');
    });

    item.addEventListener('mouseleave', () => {
      tooltip.classList.remove('show');
    });

    item.addEventListener('click', () => {
      showStatDetails(statLabel, statValue);
    });
  });
}

// Show detailed stat information in a modal
function showStatDetails(statName, statValue) {
  const modal = document.createElement('div');
  modal.className = 'stat-detail-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>${statName} Details</h3>
        <button class="modal-close" onclick="this.closest('.stat-detail-modal').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div class="stat-breakdown">
          <div class="stat-circle">
            <div class="stat-circle-inner">
              <span class="stat-circle-value">${statValue}</span>
              <span class="stat-circle-label">${statName}</span>
            </div>
          </div>
          <div class="stat-description">
            <p>This ${statName.toLowerCase()} metric represents the character's influence and contribution to the Jura Tempest Federation.</p>
            <div class="stat-details">
              <div class="detail-item">
                <span class="detail-label">Current Level:</span>
                <span class="detail-value">${statValue}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Growth Rate:</span>
                <span class="detail-value">+${Math.floor(Math.random() * 10) + 1}% per month</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Federation Rank:</span>
                <span class="detail-value">${parseInt(statValue) > 80 ? 'S-Class' : parseInt(statValue) > 60 ? 'A-Class' : parseInt(statValue) > 40 ? 'B-Class' : 'C-Class'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Add click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  // Add escape key to close
  document.addEventListener('keydown', function escapeHandler(e) {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', escapeHandler);
    }
  });
}

// Enhanced mobile performance optimizations
function optimizeForMobile() {
  if (window.innerWidth <= 768) {
    // Reduce animation complexity on mobile
    document.documentElement.style.setProperty('--animation-duration', '0.2s');

    // Enable hardware acceleration for smooth scrolling
    const scrollElements = document.querySelectorAll('.tab-section, .profile-content');
    scrollElements.forEach(element => {
      element.style.transform = 'translateZ(0)';
      element.style.willChange = 'transform';
    });

    // Optimize image loading
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.loading = 'lazy';
      img.decoding = 'async';
    });
  }
}

// Initialize enhanced features when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    addInteractiveTooltips();
    optimizeForMobile();
  }, 1500);
});
