// Mobile Navigation Functions - Handle mobile menu toggle and user interactions
function toggleMobileMenu() {
  console.log("toggleMobileMenu called"); // Debug logging for mobile menu activation

  // Get mobile navigation elements from DOM
  const toggle = document.querySelector(".mobile-menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const body = document.body;
  const html = document.documentElement;

  // Validate required elements exist before proceeding
  if (!toggle || !mobileNav) {
    console.error("Mobile menu elements not found");
    return;
  }

  // Check current state of mobile navigation menu
  const isActive = mobileNav.classList.contains("active");

  if (isActive) {
    // Close menu - Remove active states and restore scrolling
    mobileNav.classList.remove("active");
    toggle.classList.remove("active");
    body.classList.remove("mobile-nav-active");
    html.classList.remove("mobile-nav-active");

    // Re-enable scrolling by clearing overflow restrictions
    body.style.overflow = "";
    body.style.position = "";
    body.style.width = "";
    body.style.height = "";

    console.log("Mobile menu closed");
  } else {
    // Open menu - Add active states and prevent scrolling
    mobileNav.classList.add("active");
    toggle.classList.add("active");
    body.classList.add("mobile-nav-active");
    html.classList.add("mobile-nav-active");

    // Prevent scrolling by setting overflow and position styles
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.width = "100%";
    body.style.height = "100%";

    console.log("Mobile menu opened");
  }
}

// Initialize mobile navigation with event listeners and gesture support
function initializeMobileNav() {
  const toggle = document.querySelector(".mobile-menu-toggle"); // Get mobile menu toggle button
  const mobileNav = document.getElementById("mobile-nav"); // Get mobile navigation container

  if (!toggle || !mobileNav) {
    console.warn("Mobile navigation elements not found"); // Log warning if elements missing
    return;
  }

  // Add swipe gesture support for mobile devices
  let startY = 0; // Track initial touch Y position
  let startX = 0; // Track initial touch X position

  mobileNav.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY; // Record initial Y coordinate for swipe detection
    startX = e.touches[0].clientX; // Record initial X coordinate for swipe detection
  });

  mobileNav.addEventListener("touchend", (e) => {
    const endY = e.changedTouches[0].clientY; // Get final Y coordinate
    const endX = e.changedTouches[0].clientX; // Get final X coordinate
    const swipeDistance = startY - endY; // Calculate vertical swipe distance
    const horizontalDistance = Math.abs(startX - endX); // Calculate horizontal movement

    // If swiped up significantly and not too much horizontal movement, close the menu
    if (swipeDistance > 100 && horizontalDistance < 50) {
      toggleMobileMenu(); // Close menu on upward swipe gesture
    }
  });

  // Close menu when clicking on links for better UX
  document.querySelectorAll(".mobile-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      toggleMobileMenu(); // Auto-close menu after navigation
    });
  });

  // Close menu when clicking outside the navigation area
  document.addEventListener("click", (e) => {
    if (mobileNav.classList.contains("active") &&
        !mobileNav.contains(e.target) &&
        !toggle.contains(e.target)) {
      toggleMobileMenu(); // Close menu on outside click
    }
  });

  // Close menu with Escape key for accessibility
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileNav && mobileNav.classList.contains("active")) {
      toggleMobileMenu(); // Close menu with keyboard shortcut
    }
  });

  // Handle visibility change (when tab becomes hidden/visible)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (mobileNav && mobileNav.classList.contains("active")) {
        // Close mobile nav when tab becomes hidden
        toggleMobileMenu(); // Prevent menu staying open in background
      }
    }
  });

  // Handle responsive behavior for screen size changes
  let isMobile = window.innerWidth <= 768; // Track current mobile state
  window.addEventListener("resize", () => {
    const newIsMobile = window.innerWidth <= 768; // Check new mobile state
    if (!newIsMobile && mobileNav.classList.contains("active")) {
      // Close mobile nav when switching to desktop
      toggleMobileMenu(); // Auto-close on desktop resize
    }
    isMobile = newIsMobile; // Update mobile state tracking
  });

  console.log("Mobile navigation initialized");
}

// Skills functionality starts here - Main skills data processing and management

// Get all skills from character data - Aggregate skills from all characters
async function getAllSkills() {
  try {
    let basicCharacters = null;

    // Attempt to load characters using GameState first
    if (window.GameState) {
      try {
        basicCharacters = await window.GameState.getAllCharacters();
      } catch (err) {
        console.error("GameState.getAllCharacters() failed:", err);
      }
    }

    // Fallback to CharacterLoader if GameState fails or returns empty
    if (!basicCharacters || basicCharacters.length === 0) {
      console.warn(
        "GameState not available or returned empty, trying CharacterLoader directly...",
      );
      if (window.CharacterLoader) {
        try {
          basicCharacters = await window.CharacterLoader.loadBasicCharacters();
        } catch (err) {
          console.error("CharacterLoader.loadBasicCharacters() failed:", err);
        }
      } else {
        console.error("CharacterLoader not available!");
        return [];
      }
    }

    // Validate we have character data to process
    if (!basicCharacters || basicCharacters.length === 0) {
      console.warn("No characters found from any source");
      return [];
    }

    // Initialize skill processing variables
    const skillsMap = new Map();
    let processedCount = 0;
    let errorCount = 0;

    // Log processing start for debugging
    console.log(`Processing ${basicCharacters.length} characters...`);

    // Process each character to extract skills data
    for (let i = 0; i < basicCharacters.length; i++) {
      const basicChar = basicCharacters[i];

      // Update progress every 5 characters for performance monitoring
      if (i % 5 === 0) {
        console.log(`Processing character ${i + 1}/${basicCharacters.length}: ${basicChar.name}`);
      }

      try {
        // Fetch detailed character data from JSON file
        const response = await fetch(`data/characters/${basicChar.id}.json`);
        if (!response.ok) {
          console.warn(`Failed to load character ${basicChar.name} (${basicChar.id}): HTTP ${response.status} - ${response.statusText}`);
          processedCount++;
          continue; // Skip this character but continue processing others
        }

        try {
          // Parse character JSON data
          const character = await response.json();

          // Validate character has skills array
          if (!character.skills || !Array.isArray(character.skills)) {
            console.warn(`Character ${character.name} has no skills array`);
            processedCount++;
            continue;
          }

          // Process each skill from the character
          character.skills.forEach((skill) => {
            if (!skill.name) {
              console.warn(`Skill missing name for character ${character.name}`);
              return;
            }

            // Create or update skill entry in skills map
            if (!skillsMap.has(skill.name)) {
              skillsMap.set(skill.name, {
                name: skill.name,
                type: skill.type || "Unknown",
                description: skill.description || "No description available",
                icon: skill.icon || "✨",
                characters: [],
                prerequisites: generatePrerequisites(skill.type),
                applications: generateApplications(skill.type),
                difficulty: getDifficultyLevel(skill.type),
                learningTime: getLearningTime(skill.type),
                category: getCategoryFromType(skill.type),
              });
            }
            // Add character to skill's character list
            skillsMap.get(skill.name).characters.push(character);
          });
          processedCount++;
        } catch (jsonError) {
          console.warn(`Failed to parse JSON for character ${basicChar.name}:`, jsonError.message);
          errorCount++;
        }
      } catch (error) {
        console.warn(`Error loading character ${basicChar.name}:`, error.message);
        errorCount++;
        // Continue processing other characters instead of failing completely
      }
    }

    // Log processing results for debugging
    console.log(`Processed ${processedCount} characters, ${errorCount} errors`);

    // Only show error if we couldn't load any characters at all
    if (processedCount === 0 && errorCount > 0) {
      console.error("Failed to load any character data");
      return [];
    }

    // Convert skills map to array and return
    const skills = Array.from(skillsMap.values());
    return skills;
  } catch (error) {
    console.error("Error in getAllSkills:", error);
    return [];
  }
}

// Generate prerequisite requirements based on skill type classification
function generatePrerequisites(type) {
  const prerequisites = {
    Combat: ["Basic Training", "Physical Conditioning"], // Physical combat requirements
    Magic: ["Mana Control", "Elemental Theory"], // Magical skill foundations
    Support: ["Team Coordination", "Strategic Thinking"], // Support role basics
    Leadership: ["Communication Skills", "Decision Making"], // Leadership fundamentals
    Crafting: ["Material Knowledge", "Tool Mastery"], // Crafting skill prerequisites
  };
  return prerequisites[type] || ["Basic Knowledge"]; // Default fallback prerequisites
}

// Generate practical applications for each skill type
function generateApplications(type) {
  const applications = {
    Combat: ["Battle Strategy", "Personal Defense", "Military Operations"], // Combat use cases
    Magic: ["Elemental Manipulation", "Spell Crafting", "Magical Research"], // Magic applications
    Support: ["Team Enhancement", "Healing Arts", "Tactical Support"], // Support applications
    Leadership: ["Team Management", "Strategic Planning", "Diplomacy"], // Leadership uses
    Crafting: ["Item Creation", "Resource Processing", "Innovation"], // Crafting applications
  };
  return applications[type] || ["General Application"]; // Default application category
}

// Determine difficulty level based on skill type complexity
function getDifficultyLevel(type) {
  const difficulties = {
    Combat: "Advanced", // Combat skills require extensive training
    Magic: "Expert", // Magic skills are most complex
    Support: "Intermediate", // Support skills moderately difficult
    Leadership: "Advanced", // Leadership requires experience
    Crafting: "Intermediate", // Crafting skills moderately complex
  };
  return difficulties[type] || "Beginner"; // Default difficulty level
}

// Estimate learning time required for skill mastery
function getLearningTime(type) {
  const times = {
    Combat: "6-12 months", // Combat proficiency timeline
    Magic: "1-3 years", // Magic mastery takes longest
    Support: "3-6 months", // Support skills learned faster
    Leadership: "1-2 years", // Leadership development timeline
    Crafting: "6 months - 1 year", // Crafting skill development
  };
  return times[type] || "3-6 months"; // Default learning timeframe
}

// Map skill types to broader categories for organization
function getCategoryFromType(type) {
  const categories = {
    Combat: "Offensive", // Combat categorized as offensive
    Magic: "Mystical", // Magic categorized as mystical
    Support: "Utility", // Support categorized as utility
    Leadership: "Social", // Leadership categorized as social
    Crafting: "Technical", // Crafting categorized as technical
  };
  return categories[type] || "General"; // Default category assignment
}
let allSkills = []; // Global array to store all loaded skills data
let filteredSkills = []; // Global array to store currently filtered skills

// Calculate and return comprehensive statistics about all skills
function getSkillStats() {
  const stats = {
    total: allSkills.length, // Total number of skills available
    combat: allSkills.filter((s) => s.type.toLowerCase() === "combat").length, // Combat skills count
    magic: allSkills.filter((s) => s.type.toLowerCase() === "magic").length, // Magic skills count
    support: allSkills.filter((s) => s.type.toLowerCase() === "support").length, // Support skills count
    leadership: allSkills.filter((s) => s.type.toLowerCase() === "leadership")
      .length, // Leadership skills count
    crafting: allSkills.filter((s) => s.type.toLowerCase() === "crafting")
      .length, // Crafting skills count
    mostUsed: allSkills.reduce(
      (max, skill) =>
        skill.characters.length > max.characters.length ? skill : max,
      { characters: [] },
    ), // Find skill with most practitioners
  };
  return stats; // Return compiled statistics object
}

// Render skills statistics display section
function renderSkillStats() {
  const stats = getSkillStats(); // Get current skill statistics
  const statsContainer = document.createElement("div"); // Create stats container element
  statsContainer.className = "skills-stats"; // Apply CSS class for styling
  statsContainer.innerHTML = `
    <div class="stat-item">
      <div class="stat-value">${stats.total}</div>
      <div class="stat-label">Total Skills</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">${stats.combat}</div>
      <div class="stat-label">Combat</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">${stats.magic}</div>
      <div class="stat-label">Magic</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">${stats.support}</div>
      <div class="stat-label">Support</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">${stats.leadership}</div>
      <div class="stat-label">Leadership</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">${stats.mostUsed.characters.length}</div>
      <div class="stat-label">Most Used</div>
    </div>
  `;

  const skillsGrid = document.getElementById("skills-grid"); // Get skills grid container
  skillsGrid.parentNode.insertBefore(statsContainer, skillsGrid); // Insert stats before grid
}

// Render learning paths section for skill progression guidance
function renderLearningPaths() {
  const learningPathsContainer = document.createElement("div"); // Create learning paths container
  learningPathsContainer.className = "skills-learning-path"; // Apply CSS class for styling
  learningPathsContainer.innerHTML = `
    <div class="learning-path-title">Skill Learning Paths</div>
    <div class="learning-paths">
      <div class="learning-path-item" onclick="filterByPath('combat')">
        <div class="path-name">⚔️ Combat Mastery</div>
        <div class="path-description">Master the arts of warfare and battle tactics</div>
        <div class="path-skills-count">${allSkills.filter((s) => s.type.toLowerCase() === "combat").length} skills</div>
      </div>
      <div class="learning-path-item" onclick="filterByPath('magic')">
        <div class="path-name">✨ Magical Arts</div>
        <div class="path-description">Harness the power of elemental and mystical forces</div>
        <div class="path-skills-count">${allSkills.filter((s) => s.type.toLowerCase() === "magic").length} skills</div>
      </div>
      <div class="learning-path-item" onclick="filterByPath('support')">
        <div class="path-name">🛡️ Support Specialist</div>
        <div class="path-description">Enhance allies and provide tactical advantages</div>
        <div class="path-skills-count">${allSkills.filter((s) => s.type.toLowerCase() === "support").length} skills</div>
      </div>
      <div class="learning-path-item" onclick="filterByPath('leadership')">
        <div class="path-name">👑 Leadership Excellence</div>
        <div class="path-description">Guide teams and inspire others to greatness</div>
        <div class="path-skills-count">${allSkills.filter((s) => s.type.toLowerCase() === "leadership").length} skills</div>
      </div>
      <div class="learning-path-item" onclick="filterByPath('crafting')">
        <div class="path-name">🔨 Master Craftsman</div>
        <div class="path-description">Create and innovate with advanced techniques</div>
        <div class="path-skills-count">${allSkills.filter((s) => s.type.toLowerCase() === "crafting").length} skills</div>
      </div>
    </div>
  `;

  const skillsGrid = document.getElementById("skills-grid"); // Get skills grid container
  skillsGrid.parentNode.insertBefore(learningPathsContainer, skillsGrid); // Insert paths before grid
}

// Filter skills by learning path type and update display
function filterByPath(pathType) {
  document.getElementById("type-filter").value = pathType; // Set filter dropdown value
  applyFilters(); // Apply the selected filter
}

// Render skills grid with provided skills array
function renderSkills(skills) {
  const grid = document.getElementById("skills-grid"); // Get skills grid element

  if (!grid) {
    console.error("Skills grid element not found"); // Log error if grid missing
    return;
  }

  if (!skills || skills.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem;">
        <h3>No skills found</h3>
        <p>Try adjusting your search or filter criteria</p>
      </div>
    `; // Display no results message
    return;
  }

  try {
    grid.innerHTML = skills
      .map((skill, index) => {
        const safeSkill = {
          name: skill.name || "Unknown Skill", // Ensure skill has a name
          type: skill.type || "Unknown", // Ensure skill has a type
          description: skill.description || "No description available", // Provide default description
          icon: skill.icon || "✨", // Provide default icon
          characters: skill.characters || [], // Ensure characters array exists
          prerequisites: skill.prerequisites || [], // Ensure prerequisites array exists
          applications: skill.applications || [], // Ensure applications array exists
          difficulty: skill.difficulty || "Intermediate", // Provide default difficulty
          learningTime: skill.learningTime || "3-6 months", // Provide default learning time
        };

        return `
          <div class="skill-card ${safeSkill.type.toLowerCase()}" data-skill-type="${safeSkill.type.toLowerCase()}" style="animation-delay: ${index * 0.05}s;" onclick="openSkillDetail('${safeSkill.name}')">
              <div class="skill-header">
                  <div class="skill-icon">${safeSkill.icon}</div>
                  <div class="skill-info">
                      <div class="skill-name">${safeSkill.name}</div>
                      <div class="skill-type">${safeSkill.type}</div>
                  </div>
              </div>
              <div class="skill-description">${safeSkill.description}</div>

              ${
                safeSkill.prerequisites.length > 0
                  ? `
              <div class="skill-prerequisites">
                  <div class="prerequisites-title">Prerequisites</div>
                  <div class="prerequisites-list">
                      ${safeSkill.prerequisites
                        .map(
                          (prereq) => `
                          <span class="prerequisite-tag">${prereq}</span>
                      `,
                        )
                        .join("")}
                  </div>
              </div>
              `
                  : ""
              }

              ${
                safeSkill.applications.length > 0
                  ? `
              <div class="skill-applications">
                  <div class="applications-title">Applications</div>
                  <div class="applications-list">
                      ${safeSkill.applications
                        .map(
                          (app) => `
                          <span class="application-tag">${app}</span>
                      `,
                        )
                        .join("")}
                  </div>
              </div>
              `
                  : ""
              }

              <div class="skill-characters">
                  <div class="skill-characters-title">Practitioners (${safeSkill.characters.length}):</div>
                  <div class="skill-characters-list">
                      ${safeSkill.characters
                        .map((char) => {
                          const safeName = char.name || "Unknown"; // Ensure character has name
                          const safeId = char.id || ""; // Ensure character has ID
                          const safePortrait = char.portrait || "👤"; // Provide default portrait

                          return `
                            <div class="character-tag" onclick="event.stopPropagation(); viewCharacter('${safeId}')" title="View ${safeName}'s profile">
                                <span class="character-tag-icon">${safePortrait}</span>
                                <span>${safeName}</span>
                            </div>
                          `;
                        })
                        .join("")}
                  </div>
              </div>
          </div>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Error rendering skills:", error); // Log rendering errors
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem;">
        <h3>Rendering Error</h3>
        <p>Failed to display skills. Please refresh the page.</p>
      </div>
    `; // Display error message to user
  }
}

// Navigate to character detail page with visual feedback
function viewCharacter(characterId) {
  try {
    if (!characterId) {
      console.warn("No character ID provided"); // Log warning for missing ID
      return;
    }

    const clickedTag = event?.target?.closest(".character-tag"); // Get clicked element
    if (clickedTag) {
      clickedTag.style.transform = "scale(0.95)"; // Apply click animation
      setTimeout(() => {
        clickedTag.style.transform = ""; // Reset animation
      }, 300);
    }

    // Navigate to character page after brief delay for animation
    setTimeout(() => {
      window.location.href = `character.html?id=${encodeURIComponent(characterId)}`;
    }, 150);
  } catch (error) {
    console.error("Error navigating to character:", error); // Log navigation errors
    // Fallback navigation without animation
    window.location.href = `character.html?id=${encodeURIComponent(characterId)}`;
  }
}

// Apply all active filters and sorting to skills display
function applyFilters() {
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase(); // Get search input value
  const typeFilter = document.getElementById("type-filter").value; // Get type filter value
  const difficultyFilter = document.getElementById("difficulty-filter").value; // Get difficulty filter value
  const sortBy = document.getElementById("sort-select").value; // Get sort selection value

  filteredSkills = allSkills.filter((skill) => {
    const matchesSearch =
      skill.name.toLowerCase().includes(searchTerm) || // Check skill name match
      skill.description.toLowerCase().includes(searchTerm) || // Check description match
      skill.characters.some((char) =>
        char.name.toLowerCase().includes(searchTerm),
      ) || // Check character name match
      (skill.prerequisites &&
        skill.prerequisites.some((prereq) =>
          prereq.toLowerCase().includes(searchTerm),
        )) || // Check prerequisites match
      (skill.applications &&
        skill.applications.some((app) =>
          app.toLowerCase().includes(searchTerm),
        )); // Check applications match

    const matchesType =
      typeFilter === "all" || skill.type.toLowerCase() === typeFilter; // Check type filter
    const matchesDifficulty =
      difficultyFilter === "all" || skill.difficulty === difficultyFilter; // Check difficulty filter

    return matchesSearch && matchesType && matchesDifficulty; // Return combined filter result
  });

  filteredSkills.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name); // Sort alphabetically by name
      case "type":
        return a.type.localeCompare(b.type); // Sort alphabetically by type
      case "characters":
        return b.characters.length - a.characters.length; // Sort by character count descending
      case "difficulty":
        const difficultyOrder = {
          Beginner: 1, // Assign numeric values for difficulty sorting
          Intermediate: 2,
          Advanced: 3,
          Expert: 4,
        };
        return (
          (difficultyOrder[a.difficulty] || 2) -
          (difficultyOrder[b.difficulty] || 2)
        ); // Sort by difficulty level
      default:
        return 0; // No sorting applied
    }
  });

  renderSkills(filteredSkills); // Render filtered and sorted skills
  updateResultsCount(); // Update results counter display
}

// Update and display current filter results count
function updateResultsCount() {
  const existingCount = document.querySelector(".results-count"); // Find existing counter
  if (existingCount) {
    existingCount.remove(); // Remove old counter
  }

  const count = document.createElement("div"); // Create new counter element
  count.className = "results-count"; // Apply CSS class
  count.textContent = `Showing ${filteredSkills.length} of ${allSkills.length} skills`; // Set counter text

  const skillsGrid = document.getElementById("skills-grid"); // Get skills grid
  skillsGrid.parentNode.insertBefore(count, skillsGrid); // Insert counter before grid
}

// Initialize the skills page with all required functionality
async function initializeSkillsPage() {
  try {
    // Initialize mobile navigation first
    initializeMobileNav(); // Set up mobile menu functionality

    if (!window.GameState) {
      console.error("GameState not loaded"); // Log error if GameState missing
      const grid = document.getElementById("skills-grid");
      if (grid) {
        grid.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 4rem;">
            <h3>System Error</h3>
            <p>GameState not loaded. Please refresh the page.</p>
          </div>
        `; // Display system error message
      }
      return;
    }

    allSkills = await getAllSkills(); // Load all skills data

    if (allSkills.length === 0) {
      console.warn("No skills found"); // Log warning if no skills loaded
      const grid = document.getElementById("skills-grid");
      if (grid) {
        grid.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 4rem;">
            <h3>No Skills Available</h3>
            <p>No character skills found in the database.</p>
            <p>Debug: Characters available: ${window.CHARACTERS ? window.CHARACTERS.length : "undefined"}</p>
          </div>
        `; // Display no skills message with debug info
      }
      return;
    }

    filteredSkills = [...allSkills]; // Initialize filtered skills array

    renderSkillStats(); // Render skills statistics section
    renderLearningPaths(); // Render learning paths section

    // Setup event listeners for interactive elements
    const typeFilter = document.getElementById("type-filter"); // Get type filter element
    const difficultyFilter = document.getElementById("difficulty-filter"); // Get difficulty filter element
    const sortSelect = document.getElementById("sort-select"); // Get sort selector element
    const searchInput = document.getElementById("search-input"); // Get search input element

    if (typeFilter) {
      typeFilter.addEventListener("change", applyFilters); // Add type filter listener
    }

    if (difficultyFilter) {
      difficultyFilter.addEventListener("change", applyFilters); // Add difficulty filter listener
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", applyFilters); // Add sort selector listener
    }

    if (searchInput) {
      let searchTimeout; // Debounce timer for search input
      searchInput.addEventListener("input", () => {
        clearTimeout(searchTimeout); // Clear previous timeout
        searchTimeout = setTimeout(applyFilters, 300); // Debounce search input
      });
    }

    applyFilters(); // Apply initial filters and render skills

  } catch (error) {
    console.error("Error initializing skills page:", error); // Log initialization errors
    const grid = document.getElementById("skills-grid");
    if (grid) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem;">
          <h3>Initialization Error</h3>
          <p>Failed to load skills data. Please refresh the page.</p>
          <p style="font-size: 0.8rem; color: #666; margin-top: 1rem;">Error: ${error.message}</p>
        </div>
      `; // Display initialization error with details
    }
  }
}

// Initialize page when DOM is ready or immediately if already loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeSkillsPage); // Wait for DOM if still loading
} else {
  initializeSkillsPage(); // Initialize immediately if DOM ready
}

// Open detailed skill information modal
function openSkillDetail(skillName) {
  const skill = allSkills.find((s) => s.name === skillName); // Find skill by name
  if (!skill) return; // Exit if skill not found

  // Remove any existing modal to prevent duplicates
  document.querySelector(".skill-detail-modal")?.remove();

  const modal = document.createElement("div"); // Create modal container
  modal.className = "skill-detail-modal"; // Apply modal CSS class
  modal.innerHTML = `
    <div class="skill-detail-content">
      <div class="skill-detail-header">
        <div class="skill-detail-info">
          <div class="skill-detail-name">${skill.name}</div>
          <div class="skill-detail-type">${skill.type} • ${skill.difficulty} • ${skill.learningTime}</div>
        </div>
        <button class="close-detail" onclick="closeSkillDetail()" aria-label="Close skill details">✕</button>
      </div>

      <div class="skill-detail-description">${skill.description}</div>

      <div class="skill-detail-sections">
        <div class="skill-detail-section">
          <div class="section-title">📊 Mastery Progress</div>
          <div class="section-content">
            <div class="skill-mastery">
              <span class="mastery-label">Current Level</span>
              <div class="mastery-level">
                <div class="mastery-progress" style="width: ${skill.mastery || 75}%"></div>
              </div>
              <span class="mastery-percentage">${skill.mastery || 75}%</span>
            </div>
          </div>
        </div>

        ${
          skill.prerequisites && skill.prerequisites.length > 0
            ? `
        <div class="skill-detail-section">
          <div class="section-title">🔗 Prerequisites</div>
          <div class="section-content">
            <div class="prerequisites-list">
              ${skill.prerequisites.map((prereq) => `<span class="prerequisite-tag">${prereq}</span>`).join("")}
            </div>
          </div>
        </div>
        `
            : ""
        }

        ${
          skill.applications && skill.applications.length > 0
            ? `
        <div class="skill-detail-section">
          <div class="section-title">🎯 Applications</div>
          <div class="section-content">
            <div class="applications-list">
              ${skill.applications.map((app) => `<span class="application-tag">${app}</span>`).join("")}
            </div>
          </div>
        </div>
        `
            : ""
        }

        <div class="skill-detail-section">
          <div class="section-title">👥 Practitioners (${skill.characters.length})</div>
          <div class="section-content">
            <div class="skill-characters-list">
              ${skill.characters
                .map(
                  (char) => `
                <div class="character-tag" onclick="event.stopPropagation(); viewCharacter('${char.id || ""}')" title="View ${char.name}'s profile" tabindex="0" role="button" aria-label="View ${char.name}'s profile">
                  <span class="character-tag-icon">${char.portrait || "👤"}</span>
                  <span>${char.name}</span>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  document.body.appendChild(modal); // Add modal to page

  // Prevent body scrolling while modal is open
  document.body.style.overflow = "hidden";

  // Add active class with slight delay for animation
  setTimeout(() => {
    modal.classList.add("active"); // Trigger modal animation
  }, 10);

  // Close modal when clicking outside content area
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeSkillDetail(); // Close on backdrop click
    }
  });

  // Add keyboard navigation support for character tags
  modal.querySelectorAll(".character-tag").forEach((tag) => {
    tag.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault(); // Prevent default behavior
        tag.click(); // Trigger click event
      }
    });
  });

  // Focus close button for accessibility
  const closeButton = modal.querySelector(".close-detail");
  if (closeButton) {
    closeButton.focus(); // Set initial focus
  }
}

// Close skill detail modal and restore page state
function closeSkillDetail() {
  const modal = document.querySelector(".skill-detail-modal"); // Find modal element
  if (modal) {
    modal.classList.remove("active"); // Remove active class for animation
    // Restore body scrolling
    document.body.style.overflow = "";
    setTimeout(() => {
      modal.remove(); // Remove modal from DOM after animation
    }, 300);
  }
}

// Global keyboard event handlers for accessibility and shortcuts
document.addEventListener("keydown", (e) => {
  // Close modal with Escape key
  if (e.key === "Escape") {
    closeSkillDetail(); // Close any open skill detail modal
  }

  // Focus search input with Ctrl+F or forward slash
  if ((e.ctrlKey && e.key === "f") || e.key === "/") {
    e.preventDefault(); // Prevent browser search
    document.getElementById("search-input")?.focus(); // Focus search input
  }
});

// Force initialization function for the Force Load button
function forceInitialize() {
  console.log("Force initializing skills page..."); // Log force initialization
  const grid = document.getElementById("skills-grid");
  if (grid) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem;">
        <div class="loading-spinner" style="width: 40px; height: 40px; border: 3px solid rgba(77, 212, 255, 0.3); border-top: 3px solid var(--primary-blue); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
        <h3>Force Loading...</h3>
        <p>Attempting to reload all data</p>
      </div>
    `; // Display loading indicator
  }

  // Clear any cached data
  allSkills = []; // Reset skills array
  filteredSkills = []; // Reset filtered skills array

  // Reinitialize after brief delay
  setTimeout(() => {
    initializeSkillsPage(); // Restart initialization process
  }, 500);
}

// Make functions globally available for HTML onclick handlers
window.toggleMobileMenu = toggleMobileMenu;
window.filterByPath = filterByPath;
window.viewCharacter = viewCharacter;
window.openSkillDetail = openSkillDetail;
window.closeSkillDetail = closeSkillDetail;
window.forceInitialize = forceInitialize;
