// Global state variables for character filtering and display management
let currentFilter = "all"; // Active filter category for character display
let searchTerm = ""; // User input search query for character filtering
let raceFilter = ""; // Selected race filter option
let powerFilter = ""; // Selected power level filter option

async function updateStatistics() {
  if (!window.GameState) {
    console.error("GameState not available for statistics");
    return;
  }

  try {
    const totalCharacters = await window.GameState.getCharacterCount();
    const totalElement = document.getElementById("total-characters");
    if (totalElement) {
      if (window.TempestAnimations) {
        window.TempestAnimations.animateStatCounter(totalElement, totalCharacters);
      } else {
        totalElement.textContent = totalCharacters;
      }
    }

    const characters = await window.GameState.getAllCharacters();
    if (!characters) {
      console.error("No characters returned for statistics");
      return;
    }

    const demonLords = characters.filter(
      (char) =>
        char.role.toLowerCase().includes("demon lord") ||
        char.power === "Catastrophe+" ||
        char.power === "Catastrophe"
    ).length;

    const demonLordsElement = document.getElementById("demon-lords-count");
    if (demonLordsElement) {
      if (window.TempestAnimations) {
        window.TempestAnimations.animateStatCounter(demonLordsElement, demonLords);
      } else {
        demonLordsElement.textContent = demonLords;
      }
    }

    const disasters = characters.filter(
      (char) =>
        char.power === "Catastrophe+" || char.power === "Catastrophe" || char.power === "Chaos"
    ).length;

    const disastersElement = document.getElementById("disasters-count");
    if (disastersElement) {
      if (window.TempestAnimations) {
        window.TempestAnimations.animateStatCounter(disastersElement, disasters);
      } else {
        disastersElement.textContent = disasters;
      }
    }

    // Calculate unique race count for diversity statistics
    const uniqueRaces = [...new Set(characters.map((char) => char.race))].length;

    const racesElement = document.getElementById("races-count");
    if (racesElement) {
      if (window.TempestAnimations) {
        window.TempestAnimations.animateStatCounter(racesElement, uniqueRaces);
      } else {
        racesElement.textContent = uniqueRaces;
      }
    }

    const powerLevels = characters.reduce((acc, char) => {
      acc[char.power] = (acc[char.power] || 0) + 1;
      return acc;
    }, {});

    Object.entries(powerLevels).forEach(([power, count]) => {
      const element = document.getElementById(power.toLowerCase().replace("+", "-plus"));
      if (element) {
        element.textContent = count;
      }
    });

    populateFilterDropdowns(characters);
  } catch (error) {
    console.error("Error updating statistics:", error);
  }
}

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

  const powers = [...new Set(characters.map((char) => char.power))].sort();
  powerSelect.innerHTML = '<option value="">All Power Levels</option>';
  powers.forEach((power) => {
    const option = document.createElement("option");
    option.value = power;
    option.textContent = power;
    powerSelect.appendChild(option);
  });
}
let currentPage = 0; // Current active page index for pagination
const charactersPerPage = 12; // Number of characters displayed per page
let allCharacters = []; // Complete character dataset from API
let filteredCharacters = []; // Filtered character subset based on active filters

async function renderCharacters() {
  const grid = document.getElementById("character-grid");

  if (!window.GameState) {
    console.error("GameState not available");
    grid.innerHTML = '<div class="no-results">GameState not loaded. Please refresh the page.</div>';
    return;
  }

  if (!window.CharacterLoader) {
    console.error("CharacterLoader not available");
    grid.innerHTML =
      '<div class="no-results">CharacterLoader not loaded. Please refresh the page.</div>';
    return;
  }

  try {
    grid.innerHTML = '<div class="loading-characters">Loading characters...</div>';

    const characters = await window.GameState.getAllCharacters();

    if (!characters || characters.length === 0) {
      console.error("No characters returned from GameState.getAllCharacters()");
      grid.innerHTML =
        '<div class="no-results">No characters found. Check console for errors.</div>';
      return;
    }

    allCharacters = characters;
    applyFiltersAndRender();
  } catch (error) {
    console.error("Error loading characters:", error);
    grid.innerHTML = `<div class="no-results">Failed to load characters: ${error.message}. Please refresh the page.</div>`;
  }
}

function applyFiltersAndRender() {
  // Filter characters based on search term, category filter, race, and power level
  filteredCharacters = allCharacters.filter((character) => {
    // Check if character matches search term across name, race, and role
    const matchesSearch =
      character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.race.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterCharacter(character, currentFilter);
    // Apply race-specific filtering
    const matchesRace = !raceFilter || character.race === raceFilter;
    const matchesPower = !powerFilter || character.power === powerFilter;

    // Character must match all active filter criteria
    return matchesSearch && matchesFilter && matchesRace && matchesPower;
  });

  currentPage = 0;
  renderCurrentPage();
  setupPagination();
}

function renderCurrentPage() {
  const grid = document.getElementById("character-grid");

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

  const startIndex = currentPage * charactersPerPage;
  const endIndex = Math.min(startIndex + charactersPerPage, filteredCharacters.length);
  const pageCharacters = filteredCharacters.slice(startIndex, endIndex);

  grid.className = "character-grid";

  grid.innerHTML = `
    <div class="loading-characters" style="grid-column: 1 / -1;">
      <div class="loading-text">Loading characters...</div>
    </div>
  `;

  setTimeout(() => {
    grid.innerHTML = pageCharacters
      .map((character) => {
        try {
          const stats = window.generateRandomStats(character.id);

          const primaryRgb = window.hexToRgb(character.colorScheme.primary);
          const secondaryRgb = window.hexToRgb(character.colorScheme.secondary);

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

    addScrollAnimations();
    if (window.TempestAnimations) {
      window.TempestAnimations.enable3DTilt(".character-card");
    }
  }, 200);
}

function renderCompactCharacterCard(character, stats, cssVars) {
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
              ${isMobile ? character.role.split(" ").slice(0, 2).join(" ") : character.role}
          </div>

          <div class="character-image-wrapper">
              <img src="${character.image}" alt="${character.name}" class="character-card-image"
                   onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                   loading="lazy" decoding="async">
              <div class="character-portrait">${character.portrait}</div>
          </div>
        </div>

        <div class="character-info">
            <h3 class="character-name">${character.name}</h3>

            <div class="character-race-role">
                <span class="character-race">${character.race}</span>
                <span class="character-role">${isMobile ? character.role.split(" ").slice(0, 2).join(" ") : character.role}</span>
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
function generateCharacterImpact(character) {
  let military = 0;
  let economy = 0;

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

  military = Math.min(military, 75);
  economy = Math.min(economy, 75);

  military = Math.max(military, 5);
  economy = Math.max(economy, 5);

  return { military, economy };
}

function setupPagination() {
  const totalPages = Math.ceil(filteredCharacters.length / charactersPerPage);
  let paginationContainer = document.getElementById("pagination-controls");

  if (!paginationContainer) {
    paginationContainer = document.createElement("div");
    paginationContainer.id = "pagination-controls";
    paginationContainer.className = "pagination-controls";

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

  const startCharacter = currentPage * charactersPerPage + 1;
  const endCharacter = Math.min((currentPage + 1) * charactersPerPage, filteredCharacters.length);

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

function changePage(newPage) {
  const totalPages = Math.ceil(filteredCharacters.length / charactersPerPage);

  if (newPage < 0 || newPage >= totalPages) return;

  const grid = document.getElementById("character-grid");
  grid.style.opacity = "0.5";
  grid.style.pointerEvents = "none";

  setTimeout(() => {
    currentPage = newPage;
    renderCurrentPage();
    setupPagination();

    grid.style.opacity = "1";
    grid.style.pointerEvents = "auto";

    const codexContainer = document.querySelector(".codex-container");
    if (codexContainer) {
      codexContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, 150);
}
function filterCharacter(character, filter) {
  switch (filter) {
    case "all":
      return true;
    case "demon-lord":
      return (
        character.role.toLowerCase().includes("demon lord") ||
        character.power === "Catastrophe+" ||
        character.power === "Catastrophe"
      );
    case "disaster":
      return character.power === "Catastrophe+" || character.power === "Catastrophe";
    case "named":
      return character.power !== "B-Rank" && character.power !== "A-Rank";
    default:
      return true;
  }
}

function initializeFilters() {
  if (window.EventBus) {
    window.EventBus.subscribe("FILTER_CHANGED", (data) => {
      if (data.type === "search") searchTerm = data.value;
      if (data.type === "category") currentFilter = data.value;
      if (data.type === "race") raceFilter = data.value;
      if (data.type === "power") powerFilter = data.value;

      if (data.type === "category") {
        document.querySelectorAll(".filter-tab").forEach((t) => t.classList.remove("active"));
        const activeTab = document.querySelector(`[data-filter="${currentFilter}"]`);
        if (activeTab) activeTab.classList.add("active");
      }

      applyFiltersAndRender();
    });

    window.EventBus.subscribe("FILTERS_CLEARED", () => {
      searchTerm = "";
      currentFilter = "all";
      raceFilter = "";
      powerFilter = "";

      const searchInput = document.getElementById("character-search");
      if (searchInput) searchInput.value = "";

      const rFilter = document.getElementById("race-filter");
      if (rFilter) rFilter.value = "";

      const pFilter = document.getElementById("power-filter");
      if (pFilter) pFilter.value = "";

      document.querySelectorAll(".filter-tab").forEach((tab) => tab.classList.remove("active"));
      const defaultTab = document.querySelector('[data-filter="all"]');
      if (defaultTab) defaultTab.classList.add("active");

      applyFiltersAndRender();
    });
  }

  const searchInput = document.getElementById("character-search");
  if (searchInput) {
    const debouncedSearch = window.debounce
      ? window.debounce((e) => {
          if (window.EventBus)
            window.EventBus.publish("FILTER_CHANGED", { type: "search", value: e.target.value });
          else {
            searchTerm = e.target.value;
            applyFiltersAndRender();
          }
        }, 300)
      : (() => {
          let timeout;
          return (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              if (window.EventBus)
                window.EventBus.publish("FILTER_CHANGED", {
                  type: "search",
                  value: e.target.value,
                });
              else {
                searchTerm = e.target.value;
                applyFiltersAndRender();
              }
            }, 300);
          };
        })();

    searchInput.addEventListener("input", debouncedSearch);
  }

  const filterTabs = document.querySelectorAll(".filter-tab");
  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (window.EventBus) {
        window.EventBus.publish("FILTER_CHANGED", { type: "category", value: tab.dataset.filter });
      } else {
        filterTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        currentFilter = tab.dataset.filter;
        applyFiltersAndRender();
      }
    });
  });

  // Setup race filter dropdown change handler
  const raceSelect = document.getElementById("race-filter");
  const powerSelect = document.getElementById("power-filter");

  if (raceSelect) {
    raceSelect.addEventListener("change", (e) => {
      if (window.EventBus)
        window.EventBus.publish("FILTER_CHANGED", { type: "race", value: e.target.value });
      else {
        raceFilter = e.target.value;
        applyFiltersAndRender();
      }
    });
  }

  if (powerSelect) {
    powerSelect.addEventListener("change", (e) => {
      if (window.EventBus)
        window.EventBus.publish("FILTER_CHANGED", { type: "power", value: e.target.value });
      else {
        powerFilter = e.target.value;
        applyFiltersAndRender();
      }
    });
  }
}

function clearAllFilters() {
  if (window.EventBus) {
    window.EventBus.publish("FILTERS_CLEARED");
  } else {
    searchTerm = "";
    currentFilter = "all";
    raceFilter = "";
    powerFilter = "";

    const searchInput = document.getElementById("character-search");
    if (searchInput) searchInput.value = "";

    const rFilter = document.getElementById("race-filter");
    if (rFilter) rFilter.value = "";

    const pFilter = document.getElementById("power-filter");
    if (pFilter) pFilter.value = "";

    document.querySelectorAll(".filter-tab").forEach((tab) => {
      tab.classList.remove("active");
    });
    const defaultTab = document.querySelector('[data-filter="all"]');
    if (defaultTab) defaultTab.classList.add("active");

    applyFiltersAndRender();
  }
}
function openCharacterProfile(characterId) {
  try {
    if (window.SoundFeedback) {
      window.SoundFeedback.playEffect("click");
    }

    setTimeout(() => {
      window.location.href = `character.html?id=${encodeURIComponent(characterId)}`;
    }, 150);
  } catch (error) {
    console.error("Error navigating to character profile:", error);

    // Fallback navigation without sound feedback
    window.location.href = `character.html?id=${encodeURIComponent(characterId)}`;
  }
}

function renderSkeletonModal() {
  return `
    <div class="modal-character-header">
      <div class="modal-character-image" style="background: transparent; border: none;">
        <div class="skeleton skeleton-avatar" style="width: 100%; height: 100%; border-radius: 12px;"></div>
      </div>
      <div class="modal-character-info" style="flex: 1;">
        <div class="skeleton skeleton-title" style="width: 70%; margin: 0 0 0.5rem 0;"></div>
        <div class="skeleton skeleton-text" style="width: 50%; margin: 0 0 0.5rem 0;"></div>
        <div class="skeleton skeleton-pill"></div>
      </div>
    </div>

    <div class="modal-section" style="margin-top: 1.5rem;">
      <div class="skeleton skeleton-title" style="width: 30%; height: 20px; margin: 0 0 0.75rem 0;"></div>
      <div class="skeleton skeleton-text full"></div>
      <div class="skeleton skeleton-text full"></div>
      <div class="skeleton skeleton-text" style="width: 60%;"></div>
    </div>

    <div class="modal-section" style="margin-top: 1.5rem;">
      <div class="skeleton skeleton-title" style="width: 35%; height: 20px; margin: 0 0 0.75rem 0;"></div>
      <div style="display: flex; gap: 0.5rem;">
        <div class="skeleton skeleton-pill"></div>
        <div class="skeleton skeleton-pill"></div>
        <div class="skeleton skeleton-pill"></div>
      </div>
    </div>
  `;
}

async function openCharacterModal(characterId) {
  if (!window.GameState) return;

  const modal = document.getElementById("character-modal");
  const modalBody = document.getElementById("modal-body");

  if (modal && modalBody) {
    modalBody.innerHTML = renderSkeletonModal();
    if (window.TempestAnimations) {
      window.TempestAnimations.animateModalOpen(modal, modalBody);
    } else {
      modal.classList.add("active");
    }
  }

  try {
    const characters = await window.GameState.getAllCharacters();
    const character = characters.find((c) => c.id === characterId);
    if (!character) return;

    const impact = generateCharacterImpact(character);

    const modal = document.getElementById("character-modal");
    const modalBody = document.getElementById("modal-body");

    const description =
      character.lore ||
      character.backstory ||
      "A mysterious character with unknown origins and abilities.";
    const abilities = character.skills
      ? character.skills.slice(0, 3).map((s) => s.name)
      : ["Unknown Ability"];

    const modalContent = `
    <div class="modal-character-header">
      <div class="modal-character-image">
        <img src="${character.image}" alt="${character.name}"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" loading="lazy" decoding="async">
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
        `
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

    modalBody.innerHTML = modalContent;
    if (window.TempestAnimations) {
      window.TempestAnimations.animateModalOpen(modal, modal.querySelector(".modal-content"));
    } else {
      modal.style.display = "flex";
      modal.classList.add("active");
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeCharacterModal();
      }
    });
  } catch (error) {
    console.error("Error loading character for modal:", error);
  }
}

function closeCharacterModal() {
  const modal = document.getElementById("character-modal");
  if (modal) {
    if (window.TempestAnimations) {
      window.TempestAnimations.animateModalClose(
        modal,
        modal.querySelector(".modal-content"),
        () => {
          modal.classList.remove("active");
        }
      );
    } else {
      modal.style.display = "none";
      modal.classList.remove("active");
    }
  }
}
function addScrollAnimations() {
  if (window.TempestAnimations) {
    window.TempestAnimations.animateCardStagger(".character-card");
  } else {
    const cards = document.querySelectorAll(".character-card");
    cards.forEach((card, index) => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
      card.style.animationDelay = `${index * 0.05}s`;
    });
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const particleContainer = document.getElementById("particles");
  const starfieldContainer = document.getElementById("starfield");
  if (particleContainer) {
    particleContainer.style.display = "none";
  }
  if (starfieldContainer) {
    starfieldContainer.style.display = "none";
  }

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

  const statCards = document.querySelectorAll(".stat-card");
  statCards.forEach((card) => {
    card.addEventListener("click", () => {
      card.style.transform = "translateY(-8px) scale(1.1)";
      setTimeout(() => {
        card.style.transform = "";
      }, 200);
    });
  });

  if (window.TempestAnimations) {
    window.TempestAnimations.animateScrollReveal(".lore-card", {
      y: 35,
      duration: 0.6,
      stagger: 0.15,
    });
  }

  window.debugCharacters = async () => {
    try {
      const response = await fetch("data/characters-basic.json");
      const jsonData = await response.json();

      const loaderData = await window.CharacterLoader.loadBasicCharacters();

      const gameStateData = await window.GameState.getAllCharacters();

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

  initializeFilters();

  updateStatistics();

  renderCharacters();

  const modal = document.getElementById("character-modal");
  const closeBtn = document.querySelector(".modal-close");

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  window.addEventListener("resize", () => {
    renderCharacters();
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});
// Export functions to global window object for external access
if (typeof window !== "undefined") {
  window.clearAllFilters = clearAllFilters;
  window.openCharacterProfile = openCharacterProfile;
  window.openCharacterModal = openCharacterModal;
  window.closeCharacterModal = closeCharacterModal;
  window.changePage = changePage;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    generateCharacterImpact,
    filterCharacter,
  };
}
