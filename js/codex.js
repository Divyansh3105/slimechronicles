// Global state variables for character filtering and display management
let currentFilter = "all"; // Active filter category for character display
let searchTerm = ""; // User input search query for character filtering
let raceFilter = ""; // Selected race filter option
let powerFilter = ""; // Selected power level filter option
let currentView = "grid"; // Current view mode: 'grid' or 'list'

// Update dashboard statistics by fetching and calculating character data
async function updateStatistics() {
  // Verify GameState availability before proceeding
  if (!window.GameState) {
    console.error("GameState not available for statistics");
    return;
  }

  try {
    // Fetch total character count and update display element
    const totalCharacters = await window.GameState.getCharacterCount();
    const totalElement = document.getElementById("total-characters");
    if (totalElement) {
      totalElement.textContent = totalCharacters;
    }

    // Retrieve all character data for statistical analysis
    const characters = await window.GameState.getAllCharacters();
    if (!characters) {
      console.error("No characters returned for statistics");
      return;
    }

    // Calculate and display demon lord count based on role and power level
    const demonLords = characters.filter(
      (char) =>
        char.role.toLowerCase().includes("demon lord") ||
        char.power === "Catastrophe+" ||
        char.power === "Catastrophe",
    ).length;

    const demonLordsElement = document.getElementById("demon-lords-count");
    if (demonLordsElement) {
      demonLordsElement.textContent = demonLords;
    }

    // Calculate disaster-class character count based on power levels
    const disasters = characters.filter(
      (char) =>
        char.power === "Catastrophe+" ||
        char.power === "Catastrophe" ||
        char.power === "Chaos",
    ).length;

    const disastersElement = document.getElementById("disasters-count");
    if (disastersElement) {
      disastersElement.textContent = disasters;
    }

    // Calculate unique race count for diversity statistics
    const uniqueRaces = [...new Set(characters.map((char) => char.race))]
      .length;

    const racesElement = document.getElementById("races-count");
    if (racesElement) {
      racesElement.textContent = uniqueRaces;
    }

    // Generate power level distribution statistics
    const powerLevels = characters.reduce((acc, char) => {
      acc[char.power] = (acc[char.power] || 0) + 1;
      return acc;
    }, {});

    // Update individual power level count displays
    Object.entries(powerLevels).forEach(([power, count]) => {
      const element = document.getElementById(
        power.toLowerCase().replace("+", "-plus"),
      );
      if (element) {
        element.textContent = count;
      }
    });

    // Populate filter dropdown options with available data
    populateFilterDropdowns(characters);
  } catch (error) {
    console.error("Error updating statistics:", error);
  }
}

// Populate filter dropdown menus with unique character data options
function populateFilterDropdowns(characters) {
  const raceSelect = document.getElementById("race-filter");
  const powerSelect = document.getElementById("power-filter");

  // Extract unique races and populate race filter dropdown
  const races = [...new Set(characters.map((char) => char.race))].sort();
  raceSelect.innerHTML = '<option value="">All Races</option>';
  races.forEach((race) => {
    const option = document.createElement("option");
    option.value = race;
    option.textContent = race;
    raceSelect.appendChild(option);
  });

  // Extract unique power levels and populate power filter dropdown
  const powers = [...new Set(characters.map((char) => char.power))].sort();
  powerSelect.innerHTML = '<option value="">All Power Levels</option>';
  powers.forEach((power) => {
    const option = document.createElement("option");
    option.value = power;
    option.textContent = power;
    powerSelect.appendChild(option);
  });
}
// Pagination and character display state management variables
let currentPage = 0; // Current active page index for pagination
const charactersPerPage = 11; // Number of characters displayed per page
let allCharacters = []; // Complete character dataset from API
let filteredCharacters = []; // Filtered character subset based on active filters

// Main character rendering function - loads and displays character data
async function renderCharacters() {
  const grid = document.getElementById("character-grid");

  // Validate GameState availability for character data access
  if (!window.GameState) {
    console.error("GameState not available");
    grid.innerHTML =
      '<div class="no-results">GameState not loaded. Please refresh the page.</div>';
    return;
  }

  // Validate CharacterLoader availability for character processing
  if (!window.CharacterLoader) {
    console.error("CharacterLoader not available");
    grid.innerHTML =
      '<div class="no-results">CharacterLoader not loaded. Please refresh the page.</div>';
    return;
  }

  try {
    // Display loading state while fetching character data
    grid.innerHTML =
      '<div class="loading-characters">Loading characters...</div>';

    // Fetch complete character dataset from GameState
    const characters = await window.GameState.getAllCharacters();

    // Handle empty or invalid character data response
    if (!characters || characters.length === 0) {
      console.error("No characters returned from GameState.getAllCharacters()");
      grid.innerHTML =
        '<div class="no-results">No characters found. Check console for errors.</div>';
      return;
    }

    // Store character data and trigger filter application
    allCharacters = characters;
    applyFiltersAndRender();
  } catch (error) {
    console.error("Error loading characters:", error);
    grid.innerHTML = `<div class="no-results">Failed to load characters: ${error.message}. Please refresh the page.</div>`;
  }
}

// Apply active filters to character dataset and trigger page rendering
function applyFiltersAndRender() {
  // Filter characters based on search term, category filter, race, and power level
  filteredCharacters = allCharacters.filter((character) => {
    // Check if character matches search term across name, race, and role
    const matchesSearch =
      character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.race.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.role.toLowerCase().includes(searchTerm.toLowerCase());

    // Apply category-based filtering logic
    const matchesFilter = filterCharacter(character, currentFilter);
    // Apply race-specific filtering
    const matchesRace = !raceFilter || character.race === raceFilter;
    // Apply power level filtering
    const matchesPower = !powerFilter || character.power === powerFilter;

    // Character must match all active filter criteria
    return matchesSearch && matchesFilter && matchesRace && matchesPower;
  });

  // Reset pagination to first page after filtering
  currentPage = 0;
  renderCurrentPage();
  setupPagination();
}

// Render current page of filtered characters with responsive grid layout
function renderCurrentPage() {
  const grid = document.getElementById("character-grid");

  // Display enhanced no results message when no characters match current filters
  if (filteredCharacters.length === 0) {
    grid.innerHTML = `
      <div class="no-results" style="grid-column: 1 / -1;">
        <div class="no-results-icon">🔍</div>
        <h3>No characters found</h3>
        <p>Try adjusting your search criteria or filters to discover more characters</p>
        <button onclick="clearAllFilters()" style="margin-top: 1rem; padding: 1rem 2rem; background: var(--primary-blue); color: white; border: none; border-radius: 12px; cursor: url('../assets/pointer.cur'), pointer; font-size: 1rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
          Clear All Filters
        </button>
      </div>
    `;
    return;
  }

  // Calculate character range for current page
  const startIndex = currentPage * charactersPerPage;
  const endIndex = Math.min(
    startIndex + charactersPerPage,
    filteredCharacters.length,
  );
  const pageCharacters = filteredCharacters.slice(startIndex, endIndex);

  // Apply base grid styling with view mode
  grid.className = `character-grid ${currentView}-view`;

  // Apply special layout class for 11-character pages
  if (pageCharacters.length === 11 && currentView === "grid") {
    grid.classList.add("eleven-cards");
  }

  // Display enhanced loading state during character card generation
  grid.innerHTML = `
    <div class="loading-characters" style="grid-column: 1 / -1;">
      <div class="loading-text">Loading characters...</div>
    </div>
  `;

  // Render character cards with slight delay for smooth loading animation
  setTimeout(() => {
    if (pageCharacters.length === 11 && currentView === "grid") {
      // Special layout handling for 11-character pages (8+3 grid arrangement)
      const first8Cards = pageCharacters.slice(0, 8);
      const last3Cards = pageCharacters.slice(8, 11);

      // Generate HTML for first 8 character cards
      const first8Html = first8Cards
        .map((character) => {
          try {
            // Generate random stats for character display using shared function
            const stats = window.generateRandomStats();

            // Convert hex color values to RGB for CSS custom properties using shared function
            const primaryRgb = window.hexToRgb(character.colorScheme.primary);
            const secondaryRgb = window.hexToRgb(character.colorScheme.secondary);

            // Generate CSS custom properties for character theming
            const cssVars =
              primaryRgb && secondaryRgb
                ? `
            --character-primary: ${character.colorScheme.primary};
            --character-secondary: ${character.colorScheme.secondary};
            --character-primary-rgb: ${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b};
            --character-secondary-rgb: ${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b};
          `
                : "";

            return renderCompactCharacterCard(character, stats, cssVars);
          } catch (error) {
            console.error(`Error rendering character ${character.id}:`, error);
            return `<div class="character-card error">Error loading ${character.name}</div>`;
          }
        })
        .join("");

      // Generate HTML for last 3 character cards
      const last3Html = last3Cards
        .map((character) => {
          try {
            // Generate random stats for character display using shared function
            const stats = window.generateRandomStats();

            // Convert hex color values to RGB for CSS custom properties using shared function
            const primaryRgb = window.hexToRgb(character.colorScheme.primary);
            const secondaryRgb = window.hexToRgb(character.colorScheme.secondary);

            // Generate CSS custom properties for character theming
            const cssVars =
              primaryRgb && secondaryRgb
                ? `
            --character-primary: ${character.colorScheme.primary};
            --character-secondary: ${character.colorScheme.secondary};
            --character-primary-rgb: ${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b};
            --character-secondary-rgb: ${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b};
          `
                : "";

            return renderCompactCharacterCard(character, stats, cssVars);
          } catch (error) {
            console.error(`Error rendering character ${character.id}:`, error);
            return `<div class="character-card error">Error loading ${character.name}</div>`;
          }
        })
        .join("");

      // Apply 8+3 grid layout structure
      grid.innerHTML = `
        <div class="first-eight-cards">${first8Html}</div>
        <div class="last-three-cards">${last3Html}</div>
      `;
    } else {
      // Standard grid layout for non-11-character pages
      grid.innerHTML = pageCharacters
        .map((character) => {
          try {
            // Generate random stats for character display using shared function
            const stats = window.generateRandomStats();

            // Convert hex color values to RGB for CSS custom properties using shared function
            const primaryRgb = window.hexToRgb(character.colorScheme.primary);
            const secondaryRgb = window.hexToRgb(character.colorScheme.secondary);

            // Generate CSS custom properties for character theming
            const cssVars =
              primaryRgb && secondaryRgb
                ? `
              --character-primary: ${character.colorScheme.primary};
              --character-secondary: ${character.colorScheme.secondary};
              --character-primary-rgb: ${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b};
              --character-secondary-rgb: ${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b};
            `
                : "";

            return renderCompactCharacterCard(character, stats, cssVars);
          } catch (error) {
            console.error(`Error rendering character ${character.id}:`, error);
            return `<div class="character-card error">Error loading ${character.name}</div>`;
          }
        })
        .join("");
    }

    // Apply scroll animations to newly rendered character cards
    addScrollAnimations();
  }, 200);
}

// Generate HTML for individual character card with responsive design and theming
function renderCompactCharacterCard(character, stats, cssVars) {
  // Calculate character impact values for display
  const impact = generateCharacterImpact(character);
  const isMobile = window.isMobileDevice ? window.isMobileDevice() : window.innerWidth <= 768;

  return `
    <div class="character-card character-themed ${character.id === "diablo" ? "dark-theme" : ""}"
         style="${cssVars}" data-character-id="${character.id}"
         ${isMobile ? 'ontouchstart=""' : ""}>

        <div class="character-header">
          <div class="character-power-indicator">
              ${character.power}
          </div>
          <div class="character-status-badge">
              ${isMobile ? character.role.split(' ').slice(0, 2).join(' ') : character.role}
          </div>

          <div class="character-image-wrapper">
              <img src="${character.image}" alt="${character.name}" class="character-card-image"
                   onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                   loading="lazy">
              <div class="character-portrait">${character.portrait}</div>
          </div>
        </div>

        <div class="character-info">
            <h3 class="character-name">${character.name}</h3>

            <div class="character-race-role">
                <span class="character-race">${character.race}</span>
                <span class="character-role">${isMobile ? character.role.split(' ').slice(0, 2).join(' ') : character.role}</span>
            </div>

            <div class="character-stats">
                <div class="stat-item">
                    <div class="stat-value">${stats.atk}</div>
                    <div class="stat-label">ATK</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.def}</div>
                    <div class="stat-label">DEF</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.spd}</div>
                    <div class="stat-label">SPD</div>
                </div>
            </div>

            <div class="character-bonuses">
                <span class="bonus-tag">${isMobile ? "⚔️" : "⚔️ +"} ${impact.military}${isMobile ? "" : "% Military"}</span>
                <span class="bonus-tag">${isMobile ? "💰" : "💰 +"} ${impact.economy}${isMobile ? "" : "% Economy"}</span>
            </div>
        </div>

        <div class="character-actions">
            <button class="view-profile-button" onclick="openCharacterProfile('${character.id}')"
                    ${isMobile ? 'ontouchstart=""' : ""}>
                ${isMobile ? "📖 Profile" : "📖 View Full Profile"}
            </button>
            <button class="view-details-button" onclick="openCharacterModal('${character.id}')"
                    ${isMobile ? 'ontouchstart=""' : ""}>
                ${isMobile ? "👁️ Quick" : "👁️ Quick View"}
            </button>
        </div>
    </div>
  `;
}
// Calculate character impact values based on power level, role, and specific character traits
function generateCharacterImpact(character) {
  let military = 0;
  let economy = 0;

  // Base impact calculation based on power level classification
  switch (character.power) {
    case "Catastrophe+":
    case "Catastrophe":
      military = 45 + Math.floor(Math.random() * 20);
      economy = 35 + Math.floor(Math.random() * 15);
      break;
    case "Chaos":
      military = 35 + Math.floor(Math.random() * 15);
      economy = 25 + Math.floor(Math.random() * 15);
      break;
    case "Special S":
      military = 25 + Math.floor(Math.random() * 15);
      economy = 30 + Math.floor(Math.random() * 15);
      break;
    case "A+":
      military = 20 + Math.floor(Math.random() * 10);
      economy = 20 + Math.floor(Math.random() * 10);
      break;
    case "A-Rank":
      military = 15 + Math.floor(Math.random() * 10);
      economy = 15 + Math.floor(Math.random() * 10);
      break;
    case "B-Rank":
      military = 10 + Math.floor(Math.random() * 8);
      economy = 10 + Math.floor(Math.random() * 8);
      break;
    default:
      military = 5 + Math.floor(Math.random() * 10);
      economy = 5 + Math.floor(Math.random() * 10);
  }

  const role = character.role.toLowerCase();

  // Apply military role bonuses for combat-oriented positions
  if (
    role.includes("commander") ||
    role.includes("general") ||
    role.includes("captain") ||
    role.includes("knight") ||
    role.includes("warrior") ||
    role.includes("guard")
  ) {
    military += 10;
  }

  // Apply economic role bonuses for administrative and trade positions
  if (
    role.includes("minister") ||
    role.includes("secretary") ||
    role.includes("merchant") ||
    role.includes("production") ||
    role.includes("trade") ||
    role.includes("administrator")
  ) {
    economy += 15;
  }

  // Apply leadership bonuses for high-ranking positions
  if (
    role.includes("leader") ||
    role.includes("founder") ||
    role.includes("lord") ||
    role.includes("king") ||
    role.includes("queen") ||
    role.includes("ruler")
  ) {
    military += 8;
    economy += 12;
  }

  // Character-specific impact overrides for major characters
  switch (character.id) {
    case "rimuru":
      military = 65;
      economy = 70;
      break;
    case "diablo":
      military = 60;
      economy = 45;
      break;
    case "benimaru":
      military = 55;
      economy = 35;
      break;
    case "shuna":
      military = 25;
      economy = 60;
      break;
    case "shion":
      military = 50;
      economy = 20;
      break;
    case "souei":
      military = 45;
      economy = 40;
      break;
    case "milim":
      military = 70;
      economy = 25;
      break;
    case "veldora":
      military = 65;
      economy = 30;
      break;
  }

  // Apply maximum and minimum impact value constraints
  military = Math.min(military, 75);
  economy = Math.min(economy, 75);

  military = Math.max(military, 5);
  economy = Math.max(economy, 5);

  return { military, economy };
}

// Setup pagination controls and navigation for character grid display
function setupPagination() {
  const totalPages = Math.ceil(filteredCharacters.length / charactersPerPage);
  let paginationContainer = document.getElementById("pagination-controls");

  // Create pagination container if it doesn't exist
  if (!paginationContainer) {
    paginationContainer = document.createElement("div");
    paginationContainer.id = "pagination-controls";
    paginationContainer.className = "pagination-controls";

    // Insert pagination controls after character grid
    const grid = document.getElementById("character-grid");
    if (grid && grid.parentNode) {
      grid.parentNode.insertBefore(paginationContainer, grid.nextSibling);
    }
  }

  // Hide pagination when only one page or no results
  if (totalPages <= 1) {
    paginationContainer.style.display = "none";
    return;
  }

  paginationContainer.style.display = "flex";

  // Calculate character range display values
  const startCharacter = currentPage * charactersPerPage + 1;
  const endCharacter = Math.min(
    (currentPage + 1) * charactersPerPage,
    filteredCharacters.length,
  );

  // Generate pagination control HTML with navigation buttons and page info
  paginationContainer.innerHTML = `
    <button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 0 ? "disabled" : ""}>
      ← Previous
    </button>
    <div class="page-info">
      <span class="current-page">Page ${currentPage + 1}</span> of ${totalPages}
      <br>
      <small>Showing ${startCharacter}-${endCharacter} of ${filteredCharacters.length} characters</small>
    </div>
    <button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage >= totalPages - 1 ? "disabled" : ""}>
      Next →
    </button>
  `;
}

// Handle pagination navigation with smooth transitions and scroll positioning
function changePage(newPage) {
  const totalPages = Math.ceil(filteredCharacters.length / charactersPerPage);

  // Validate page bounds before proceeding
  if (newPage < 0 || newPage >= totalPages) return;

  const grid = document.getElementById("character-grid");
  // Apply loading state visual feedback during page transition
  grid.style.opacity = "0.5";
  grid.style.pointerEvents = "none";

  // Execute page change with smooth transition delay
  setTimeout(() => {
    currentPage = newPage;
    renderCurrentPage();
    setupPagination();

    // Restore grid interactivity after rendering
    grid.style.opacity = "1";
    grid.style.pointerEvents = "auto";

    // Scroll to top of character grid for better user experience
    const codexContainer = document.querySelector(".codex-container");
    if (codexContainer) {
      codexContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, 150);
}
// Apply character filtering logic based on category selection
function filterCharacter(character, filter) {
  switch (filter) {
    case "all":
      return true;
    case "demon-lord":
      // Filter for demon lords based on role title or catastrophe-level power
      return (
        character.role.toLowerCase().includes("demon lord") ||
        character.power === "Catastrophe+" ||
        character.power === "Catastrophe"
      );
    case "disaster":
      // Filter for disaster-class characters based on power level
      return (
        character.power === "Catastrophe+" || character.power === "Catastrophe"
      );
    case "named":
      // Filter for named characters (excluding basic B-Rank and A-Rank)
      return character.power !== "B-Rank" && character.power !== "A-Rank";
    default:
      return true;
  }
}

// Initialize all filter event handlers and search functionality
function initializeFilters() {
  const searchInput = document.getElementById("character-search");
  if (searchInput) {
    // Use shared debounce function for search input
    const debouncedSearch = window.debounce ? window.debounce((e) => {
      searchTerm = e.target.value;
      applyFiltersAndRender();
    }, 300) : (() => {
      let timeout;
      return (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          searchTerm = e.target.value;
          applyFiltersAndRender();
        }, 300);
      };
    })();

    searchInput.addEventListener("input", debouncedSearch);
  }

  // Setup category filter tab click handlers
  const filterTabs = document.querySelectorAll(".filter-tab");
  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Update active tab visual state
      filterTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      // Apply selected filter and re-render
      currentFilter = tab.dataset.filter;
      applyFiltersAndRender();
    });
  });

  // Setup race filter dropdown change handler
  const raceSelect = document.getElementById("race-filter");
  const powerSelect = document.getElementById("power-filter");

  if (raceSelect) {
    raceSelect.addEventListener("change", (e) => {
      raceFilter = e.target.value;
      applyFiltersAndRender();
    });
  }

  // Setup power level filter dropdown change handler
  if (powerSelect) {
    powerSelect.addEventListener("change", (e) => {
      powerFilter = e.target.value;
      applyFiltersAndRender();
    });
  }

  // Setup view toggle functionality
  const viewToggle = document.getElementById("view-toggle");
  if (viewToggle) {
    viewToggle.addEventListener("click", () => {
      currentView = currentView === "grid" ? "list" : "grid";
      updateViewToggleButton();
      applyFiltersAndRender();
    });
  }
}

// Update view toggle button appearance and text
function updateViewToggleButton() {
  const viewToggle = document.getElementById("view-toggle");
  const viewIcon = viewToggle.querySelector(".view-icon");
  const viewText = viewToggle.querySelector(".view-text");

  if (currentView === "grid") {
    viewIcon.textContent = "⊞";
    viewText.textContent = "Grid View";
  } else {
    viewIcon.textContent = "☰";
    viewText.textContent = "List View";
  }
}

// Reset all active filters and restore default display state
function clearAllFilters() {
  // Reset all filter state variables to default values
  searchTerm = "";
  currentFilter = "all";
  raceFilter = "";
  powerFilter = "";

  // Clear all filter input field values
  document.getElementById("character-search").value = "";
  document.getElementById("race-filter").value = "";
  document.getElementById("power-filter").value = "";

  // Reset filter tab visual states to default
  document.querySelectorAll(".filter-tab").forEach((tab) => {
    tab.classList.remove("active");
  });
  document.querySelector('[data-filter="all"]').classList.add("active");

  // Re-render character grid with cleared filters
  applyFiltersAndRender();
}
// Navigate to character profile page with sound feedback and error handling
function openCharacterProfile(characterId) {
  try {
    // Play click sound effect if available
    if (window.SoundFeedback) {
      window.SoundFeedback.playEffect("click");
    }

    // Navigate to character profile with slight delay for sound feedback
    setTimeout(() => {
      window.location.href = `character.html?id=${encodeURIComponent(characterId)}`;
    }, 150);
  } catch (error) {
    console.error("Error navigating to character profile:", error);

    // Fallback navigation without sound feedback
    window.location.href = `character.html?id=${encodeURIComponent(characterId)}`;
  }
}

// Display character quick view modal with detailed information and stats
async function openCharacterModal(characterId) {
  // Verify GameState availability before proceeding
  if (!window.GameState) return;

  try {
    // Fetch character data and locate specific character by ID
    const characters = await window.GameState.getAllCharacters();
    const character = characters.find((c) => c.id === characterId);
    if (!character) return;

    // Generate character impact values for modal display
    const impact = generateCharacterImpact(character);

    const modal = document.getElementById("character-modal");
    const modalBody = document.getElementById("modal-body");

    // Prepare character description with fallback text
    const description = character.lore || character.backstory || "A mysterious character with unknown origins and abilities.";
    // Extract key abilities for display (limit to first 3)
    const abilities = character.skills ? character.skills.slice(0, 3).map(s => s.name) : ["Unknown Ability"];

    // Generate comprehensive modal content HTML
    const modalContent = `
    <div class="modal-character-header">
      <div class="modal-character-image">
        <img src="${character.image}" alt="${character.name}"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" loading="lazy">
        <div class="character-portrait" style="display: none; font-size: 3rem; align-items: center; justify-content: center; width: 100%; height: 100%; position: absolute; top: 0; left: 0;">${character.portrait}</div>
      </div>

      <div class="modal-character-info">
        <h2>${character.name}</h2>
        <div class="modal-character-subtitle">${character.race} • ${character.role}</div>
        <div class="modal-power-badge">${character.power}</div>
      </div>
    </div>

    <div class="modal-section">
      <h3>📖 Description</h3>
      <div class="modal-description">${description}</div>
    </div>

    <div class="modal-section">
      <h3>✨ Key Abilities</h3>
      <div class="modal-abilities">
        ${abilities
          .map(
            (ability) => `
          <span class="modal-ability-tag">${ability}</span>
        `,
          )
          .join("")}
      </div>
    </div>

    <div class="modal-section">
      <h3>📊 Impact & Stats</h3>
      <div class="modal-stats-grid">
        <div class="modal-stat-card">
          <div class="modal-stat-label">⚔️ Military Impact</div>
          <div class="modal-stat-value">+${impact.military}%</div>
        </div>
        <div class="modal-stat-card">
          <div class="modal-stat-label">💰 Economic Impact</div>
          <div class="modal-stat-value">+${impact.economy}%</div>
        </div>
        <div class="modal-stat-card">
          <div class="modal-stat-label">🏆 Power Level</div>
          <div class="modal-stat-value">${character.power}</div>
        </div>
      </div>
    </div>

    <div class="modal-actions">
      <button class="modal-action-btn" onclick="openCharacterProfile('${character.id}')">
        📖 Full Profile
      </button>
    </div>
  `;

    // Inject content and display modal
    modalBody.innerHTML = modalContent;
    modal.style.display = "flex";
    modal.classList.add("active");

    // Setup click-outside-to-close functionality
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  } catch (error) {
    console.error("Error loading character for modal:", error);
  }
}

// Close character modal dialog and hide from display
function closeCharacterModal() {
  const modal = document.getElementById("character-modal");
  if (modal) {
    modal.style.display = "none";
  }
}
// Apply entrance animations to character cards with staggered timing
function addScrollAnimations() {
  const cards = document.querySelectorAll(".character-card");

  // Apply fade-in animation to each character card with progressive delay
  cards.forEach((card, index) => {
    card.style.opacity = "1";
    card.style.transform = "translateY(0)";

    // Stagger animation timing for smooth sequential appearance
    card.style.animationDelay = `${index * 0.05}s`;
  });
}
// DOM content loaded event handler - initialize application components
document.addEventListener("DOMContentLoaded", () => {
  // Disable particle effects for performance optimization
  const particleContainer = document.getElementById("particles");
  const starfieldContainer = document.getElementById("starfield");
  if (particleContainer) {
    particleContainer.style.display = "none";
  }
  if (starfieldContainer) {
    starfieldContainer.style.display = "none";
  }

  // Add interactive search focus effects
  const searchInput = document.getElementById("character-search");
  const searchContainer = document.querySelector(".search-container");

  if (searchInput && searchContainer) {
    searchInput.addEventListener("focus", () => {
      searchContainer.classList.add("focused");
    });

    searchInput.addEventListener("blur", () => {
      searchContainer.classList.remove("focused");
    });
  }

  // Add stat card click animations
  const statCards = document.querySelectorAll(".stat-card");
  statCards.forEach(card => {
    card.addEventListener("click", () => {
      card.style.transform = "translateY(-8px) scale(1.1)";
      setTimeout(() => {
        card.style.transform = "";
      }, 200);
    });
  });

  // Add character card entrance animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }, index * 100);
      }
    });
  }, { threshold: 0.1 });

  // Setup debug function for development and troubleshooting
  window.debugCharacters = async () => {
    try {
      // Fetch data from multiple sources for comparison
      const response = await fetch("data/characters-basic.json");
      const jsonData = await response.json();

      const loaderData = await window.CharacterLoader.loadBasicCharacters();

      const gameStateData = await window.GameState.getAllCharacters();

      // Return data source comparison for debugging
      return {
        json: jsonData.length,
        loader: loaderData.length,
        gameState: gameStateData.length,
        all: allCharacters.length,
        filtered: filteredCharacters.length,
      };
    } catch (error) {
      console.error("Debug failed:", error);
      return { error: error.message };
    }
  };

  // Initialize filter event handlers
  initializeFilters();

  // Initialize view toggle button
  updateViewToggleButton();

  // Load and display initial statistics
  updateStatistics();

  // Render initial character grid
  renderCharacters();

  // Setup modal close button event handler
  const modal = document.getElementById("character-modal");
  const closeBtn = document.querySelector(".modal-close");

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  // Handle viewport resize events and update mobile state
  window.addEventListener("resize", () => {
    renderCharacters();
  });

  // Add smooth scrolling for better UX
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
});
// Export functions to global window object for external access
window.clearAllFilters = clearAllFilters;
window.openCharacterProfile = openCharacterProfile;
window.openCharacterModal = openCharacterModal;
window.closeCharacterModal = closeCharacterModal;
window.changePage = changePage;
