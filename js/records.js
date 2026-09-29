// Resize handling with debouncing - Prevent excessive resize event processing
const handleResize = window.debounce(() => {
  renderRecords();
}, 250);

let HISTORICAL_RECORDS = [];

function loadRecordsFromHTML() {
  const recordElements = document.querySelectorAll("#historical-records-data .record-data");

  HISTORICAL_RECORDS = Array.from(recordElements).map((element) => {
    const participants = element
      .querySelector(".record-participants")
      .textContent.split(", ")
      .map((p) => p.trim());

    return {
      id: element.dataset.id,
      icon: element.dataset.icon,
      title: element.querySelector(".record-title").textContent,
      description: element.querySelector(".record-description").textContent,
      category: element.dataset.category,
      volume: element.dataset.volume,
      importance: element.dataset.importance,
      date: element.dataset.date,
      location: element.dataset.location,
      participants: participants,
      details: element.querySelector(".record-details").textContent,
    };
  });

  return HISTORICAL_RECORDS;
}

const state = {
  currentFilter: "all",
  currentSort: "chronological",
  searchQuery: "",
  expandedRecord: null,
};

let currentFilter = state.currentFilter;
let currentSort = state.currentSort;
let searchQuery = state.searchQuery;
let expandedRecord = state.expandedRecord;
function filterRecords(records, filter) {
  if (filter === "all") return records;
  return records.filter((record) => record.category === filter || record.importance === filter);
}

function sortRecords(records, sortType) {
  const sorted = [...records];
  switch (sortType) {
    case "chronological":
      return sorted;
    case "importance": {
      const importanceOrder = { critical: 0, major: 1, moderate: 2 };
      return sorted.sort((a, b) => importanceOrder[a.importance] - importanceOrder[b.importance]);
    }
    case "alphabetical":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "volume":
      return sorted.sort((a, b) => {
        const aVol = parseInt(a.volume.match(/\d+/)[0]);
        const bVol = parseInt(b.volume.match(/\d+/)[0]);
        return aVol - bVol;
      });
    default:
      return sorted;
  }
}

function searchRecords(records, query) {
  if (!query) return records;
  const lowercaseQuery = query.toLowerCase();
  return records.filter(
    (record) =>
      record.title.toLowerCase().includes(lowercaseQuery) ||
      record.description.toLowerCase().includes(lowercaseQuery) ||
      record.details.toLowerCase().includes(lowercaseQuery) ||
      record.participants.some((p) => p.toLowerCase().includes(lowercaseQuery)) ||
      record.location.toLowerCase().includes(lowercaseQuery)
  );
}

function getImportanceColor(importance) {
  switch (importance) {
    case "critical":
      return "var(--accent-crimson)";
    case "major":
      return "var(--accent-gold)";
    case "moderate":
      return "var(--primary-blue)";
    default:
      return "var(--text-secondary)";
  }
}

function getImportanceIcon(importance) {
  switch (importance) {
    case "critical":
      return "🔥";
    case "major":
      return "⭐";
    case "moderate":
      return "💫";
    default:
      return "📝";
  }
}

function getCategoryIcon(category) {
  const icons = {
    origin: "🌟",
    friendship: "🤝",
    naming: "📝",
    heroic: "🛡️",
    evolution: "🦋",
    battle: "⚔️",
    diplomacy: "🤝",
    legacy: "👑",
    education: "📚",
    politics: "🏛️",
    summoning: "🔮",
    culture: "🎭",
    power: "⚡",
    adventure: "🗺️",
  };
  return icons[category] || "📜";
}
function renderRecords(records = HISTORICAL_RECORDS) {
  const grid = document.getElementById("records-grid");

  if (!grid) {
    console.error("records-grid element not found!");
    return;
  }

  let filteredRecords = filterRecords(records, currentFilter);
  filteredRecords = searchRecords(filteredRecords, searchQuery);
  filteredRecords = sortRecords(filteredRecords, currentSort);

  if (filteredRecords.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>No records found</h3>
        <p>Try adjusting your filters or search terms</p>
      </div>
    `;
    return;
  }

  const isMobile = window.isMobileDevice ? window.isMobileDevice() : window.innerWidth <= 768;

  grid.innerHTML = filteredRecords
    .map((record) => {
      const importanceColor = getImportanceColor(record.importance);
      const importanceIcon = getImportanceIcon(record.importance);
      const categoryIcon = getCategoryIcon(record.category);
      const isExpanded = expandedRecord === record.id;

      return `
       <div class="record-card ${record.importance}"
         style="--importance-color: ${importanceColor}"
         data-record-id="${record.id}"
         role="button"
         tabindex="0"
         aria-expanded="${isExpanded}"
         aria-label="Historical record: ${record.title}">
        <div class="record-icon-container">
          <div class="record-icon">${record.icon}</div>
          <div class="record-category-icon">${categoryIcon}</div>
        </div>
        <div class="record-content">
          <div class="record-meta">
            <span class="record-volume">${record.volume}</span>
            <span class="record-importance" style="color: ${importanceColor}">
              ${importanceIcon} ${record.importance.toUpperCase()}
            </span>
            <span class="record-date">${record.date}</span>
          </div>
          <h3 class="record-title">${record.title}</h3>
          <p class="record-description">${record.description}</p>

          <div class="record-details ${isExpanded ? "expanded" : ""}"
               aria-hidden="${!isExpanded}">
            <div class="details-content">
              <div class="record-location" style="--item-index: 0">
                <span class="detail-label">📍 Location:</span>
                <span class="detail-value">${record.location}</span>
              </div>
              <div class="record-participants" style="--item-index: 1">
                <span class="detail-label">👥 Participants:</span>
                <span class="detail-value">${record.participants.join(", ")}</span>
              </div>
              <div class="record-full-details" style="--item-index: 2">
                <span class="detail-label">📖 Details:</span>
                <p class="detail-value">${record.details}</p>
              </div>
            </div>
          </div>

          <button class="record-expand-btn"
                  aria-label="${isExpanded ? "Show less details" : "Show more details"}"
                  onclick="event.stopPropagation(); toggleRecordExpansion('${record.id}')">
            <span>${isExpanded ? "Show Less" : "Show More"}</span>
            <span class="expand-icon" aria-hidden="true">${isExpanded ? "▲" : "▼"}</span>
          </button>
        </div>
      </div>
    `;
    })
    .join("");

  if (window.TempestAnimations) {
    window.TempestAnimations.animateCardStagger(".record-card");
    window.TempestAnimations.enable3DTilt(".record-card");
  }

  document.querySelectorAll(".record-card").forEach((card) => {
    const recordId = card.dataset.recordId;

    if (isMobile) {
      let touchStartY = 0;
      let touchStartX = 0;
      let touchMoved = false;
      let touchStartTime = 0;

      card.addEventListener(
        "touchstart",
        function (e) {
          touchStartY = e.touches[0].clientY;
          touchStartX = e.touches[0].clientX;
          touchStartTime = Date.now();
          touchMoved = false;
          this.style.transform = "scale(0.98)";
          this.style.transition = "transform 0.1s ease";
        },
        { passive: true }
      );

      card.addEventListener(
        "touchmove",
        function (e) {
          const dy = Math.abs(e.touches[0].clientY - touchStartY);
          const dx = Math.abs(e.touches[0].clientX - touchStartX);
          if (dx > 10 || dy > 10) {
            touchMoved = true;
            this.style.transform = "";
          }
        },
        { passive: true }
      );

      card.addEventListener(
        "touchend",
        function (e) {
          const touchDuration = Date.now() - touchStartTime;
          setTimeout(() => {
            this.style.transform = "";
          }, 100);

          if (!touchMoved && touchDuration < 500) {
            if (recordId) {
              e.preventDefault();
              toggleRecordExpansion(recordId);
            }
          }
        },
        { passive: false }
      );
    } else {
      card.addEventListener("click", function () {
        if (recordId) {
          toggleRecordExpansion(recordId);
        }
      });
    }

    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (recordId) {
          toggleRecordExpansion(recordId);
        }
      }
    });

    card.addEventListener("click", () => {
      if (window.SoundFeedback && typeof window.SoundFeedback.playEffect === "function") {
        window.SoundFeedback.playEffect("click");
      }
    });
  });

  updateVisibleRecordsCount();

  if (filteredRecords.length > 0) {
    const announcement = `${filteredRecords.length} historical records displayed`;
    window.announceToScreenReader(announcement);
  }
}

function toggleRecordExpansion(recordId) {
  const recordCard = document.querySelector(`[data-record-id="${recordId}"]`);
  if (!recordCard) return;

  const detailsElement = recordCard.querySelector(".record-details");
  const expandBtn = recordCard.querySelector(".record-expand-btn");
  const expandIcon = expandBtn.querySelector(".expand-icon");
  const expandText = expandBtn.querySelector("span:first-child");

  if (!detailsElement || !expandBtn) return;

  const isCurrentlyExpanded = detailsElement.classList.contains("expanded");

  if (isCurrentlyExpanded) {
    expandedRecord = null;
    detailsElement.classList.remove("expanded");
    expandText.textContent = "Show More";
    expandIcon.textContent = "▼";
    expandBtn.setAttribute("aria-label", "Show more details");
    detailsElement.setAttribute("aria-hidden", "true");
    expandBtn.classList.remove("expanded");

    recordCard.style.animation = "cardBounce 0.4s ease";
    setTimeout(() => {
      recordCard.style.animation = "";
    }, 400);
  } else {
    expandedRecord = recordId;

    document.querySelectorAll(".record-details.expanded").forEach((otherDetails) => {
      if (otherDetails !== detailsElement) {
        const otherCard = otherDetails.closest(".record-card");
        const otherBtn = otherCard.querySelector(".record-expand-btn");
        const otherIcon = otherBtn.querySelector(".expand-icon");
        const otherText = otherBtn.querySelector("span:first-child");

        otherDetails.classList.remove("expanded");
        otherText.textContent = "Show More";
        otherIcon.textContent = "▼";
        otherBtn.setAttribute("aria-label", "Show more details");
        otherDetails.setAttribute("aria-hidden", "true");
        otherBtn.classList.remove("expanded");
      }
    });

    detailsElement.classList.add("expanded");
    expandText.textContent = "Show Less";
    expandIcon.textContent = "▲";
    expandBtn.setAttribute("aria-label", "Show less details");
    detailsElement.setAttribute("aria-hidden", "false");
    expandBtn.classList.add("expanded");

    recordCard.style.animation = "cardPulse 0.5s ease";
    setTimeout(() => {
      recordCard.style.animation = "";
    }, 500);

    setTimeout(() => {
      recordCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  }

  if (window.SoundFeedback && typeof window.SoundFeedback.playEffect === "function") {
    window.SoundFeedback.playEffect("click");
  }

  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
}
function createFilterControls() {
  const container = document.querySelector(".historical-records-container");
  if (!container) {
    console.error("Historical records container not found");
    return;
  }

  const titleElement = container.querySelector(".page-subtitle");
  if (!titleElement) {
    console.error("Page subtitle element not found");
    return;
  }

  const controlsHTML = `
    <div class="records-controls">
      <div class="search-container">
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input type="text"
                 id="search-input"
                 placeholder="Search records, characters, locations..."
                 value="${searchQuery}"
                 oninput="handleSearch(this.value)"
                 autocomplete="off"
                 spellcheck="false">
          <button class="clear-search" onclick="clearSearch()" ${searchQuery ? "" : 'style="display: none;"'} aria-label="Clear search">✕</button>
        </div>
      </div>

      <div class="filter-container">
        <div class="filter-group">
          <label for="category-filter">Filter by Category:</label>
          <select id="category-filter" onchange="handleCategoryFilter(this.value)" aria-label="Filter by category">
            <option value="all">All Categories</option>
            <option value="origin">Origin</option>
            <option value="friendship">Friendship</option>
            <option value="naming">Naming</option>
            <option value="heroic">Heroic Acts</option>
            <option value="evolution">Evolution</option>
            <option value="battle">Battles</option>
            <option value="diplomacy">Diplomacy</option>
            <option value="legacy">Legacy</option>
            <option value="education">Education</option>
            <option value="politics">Politics</option>
            <option value="summoning">Summoning</option>
            <option value="culture">Culture</option>
            <option value="power">Power</option>
            <option value="adventure">Adventure</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="importance-filter">Filter by Importance:</label>
          <select id="importance-filter" onchange="handleImportanceFilter(this.value)" aria-label="Filter by importance">
            <option value="all">All Levels</option>
            <option value="critical">🔥 Critical</option>
            <option value="major">⭐ Major</option>
            <option value="moderate">💫 Moderate</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="sort-select">Sort by:</label>
          <select id="sort-select" onchange="handleSort(this.value)" aria-label="Sort records">
            <option value="chronological">📅 Chronological</option>
            <option value="importance">🔥 Importance</option>
            <option value="alphabetical">🔤 Alphabetical</option>
            <option value="volume">📚 Volume</option>
          </select>
        </div>
      </div>

      <div class="records-stats">
        <div class="stat-item">
          <span class="stat-number" id="total-records">${HISTORICAL_RECORDS.length}</span>
          <span class="stat-label">Total Records</span>
        </div>
        <div class="stat-item">
          <span class="stat-number" id="visible-records">${HISTORICAL_RECORDS.length}</span>
          <span class="stat-label">Showing</span>
        </div>
      </div>
    </div>
  `;

  try {
    titleElement.insertAdjacentHTML("afterend", controlsHTML);
  } catch (error) {
    console.error("Error creating filter controls:", error);
  }
}
const handleSearch = window.debounce((query) => {
  searchQuery = query;
  updateVisibleRecordsCount();
  renderRecords();

  const clearBtn = document.querySelector(".clear-search");
  if (clearBtn) {
    clearBtn.style.display = query ? "block" : "none";
  }

  if (window.isMobileDevice ? window.isMobileDevice() : window.innerWidth <= 768) {
    const visibleCount = document.querySelectorAll(".record-card").length;
    if (query && visibleCount === 0) {
      window.announceToScreenReader("No records found for your search");
    } else if (query && visibleCount > 0) {
      window.announceToScreenReader(`${visibleCount} records found`);
    }
  }
}, 300);

function clearSearch() {
  searchQuery = "";
  document.getElementById("search-input").value = "";
  document.querySelector(".clear-search").style.display = "none";
  updateVisibleRecordsCount();
  renderRecords();
}

function handleCategoryFilter(category) {
  currentFilter = category;
  updateVisibleRecordsCount();
  renderRecords();
}

function handleImportanceFilter(importance) {
  currentFilter = importance;
  updateVisibleRecordsCount();
  renderRecords();
}

function handleSort(sortType) {
  currentSort = sortType;
  renderRecords();
}

function updateVisibleRecordsCount() {
  let filteredRecords = filterRecords(HISTORICAL_RECORDS, currentFilter);
  filteredRecords = searchRecords(filteredRecords, searchQuery);

  const visibleElement = document.getElementById("visible-records");
  if (visibleElement) {
    visibleElement.textContent = filteredRecords.length;
  }
}
function initializeHistoricalRecordsPage() {
  try {
    loadRecordsFromHTML();

    const container = document.querySelector(".historical-records-container");
    const grid = document.getElementById("records-grid");

    if (!container) {
      throw new Error("Historical records container not found");
    }

    if (!grid) {
      throw new Error("Records grid element not found");
    }

    createFilterControls();
    renderRecords();
    addGlobalEventListeners();
    ensureScrollingWorks();
  } catch (error) {
    console.error("Error initializing historical records page:", error);

    const grid = document.getElementById("records-grid");
    if (grid) {
      grid.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">⚠️</div>
          <h3>Initialization Error</h3>
          <p>There was an error loading the historical records. Please refresh the page.</p>
          <p style="font-size: 0.9rem; margin-top: 1rem; opacity: 0.7;">Error: ${error.message}</p>
        </div>
      `;
    }
  }
}

// Add global event listeners - Set up page-wide keyboard shortcuts and event handlers
function addGlobalEventListeners() {
  window.addEventListener("resize", handleResize);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && expandedRecord) {
      toggleRecordExpansion(expandedRecord);
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "f") {
      e.preventDefault();
      const searchInput = document.getElementById("search-input");
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "r") {
      e.preventDefault();
      resetAllFilters();
    }
  });

  ensureScrollingWorks();
}

// Ensure page scrolling functionality - Prevent scroll blocking and maintain proper overflow behavior
function ensureScrollingWorks() {
  document.documentElement.style.overflow = "auto";
  document.body.style.overflow = "auto";

  const potentialBlockers = document.querySelectorAll(
    ".historical-records-container, .records-grid, .record-card, .record-details"
  );
  potentialBlockers.forEach((element) => {
    element.style.overflow = "visible";
    element.style.contain = "none";
  });

  const observer = new MutationObserver(() => {
    setTimeout(() => {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    }, 100);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style"],
  });
}

function resetAllFilters() {
  currentFilter = "all";
  currentSort = "chronological";
  searchQuery = "";
  expandedRecord = null;

  const searchInput = document.getElementById("search-input");
  const categoryFilter = document.getElementById("category-filter");
  const importanceFilter = document.getElementById("importance-filter");
  const sortSelect = document.getElementById("sort-select");
  const clearBtn = document.querySelector(".clear-search");

  if (searchInput) searchInput.value = "";
  if (categoryFilter) categoryFilter.value = "all";
  if (importanceFilter) importanceFilter.value = "all";
  if (sortSelect) sortSelect.value = "chronological";
  if (clearBtn) clearBtn.style.display = "none";

  updateVisibleRecordsCount();
  renderRecords();
  window.announceToScreenReader("All filters have been reset");
}
document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("records-grid");

  if (grid) {
    grid.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-light);">
        <div style="font-size: 2rem; margin-bottom: 1rem;">⏳</div>
        <div>Loading historical records...</div>
        <div style="margin-top: 1rem;">
          <button onclick="testFunction()" style="padding: 10px 20px; margin: 10px; background: var(--primary-blue); color: white; border: none; border-radius: 8px; cursor: url('../assets/pointer.cur'), pointer;">Test JavaScript</button>
        </div>
      </div>
    `;
  } else {
    console.error("Could not find records-grid element");
  }

  try {
    setTimeout(() => {
      initializeHistoricalRecordsPage();

      setTimeout(() => {
        ensureScrollingWorks();
      }, 500);
    }, 100);
  } catch (error) {
    console.error("Error initializing records page:", error);

    if (grid) {
      grid.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">❌</div>
          <h3>Loading Failed</h3>
          <p>Failed to initialize the records page. Please refresh and try again.</p>
          <p style="font-size: 0.9rem; margin-top: 1rem; opacity: 0.7;">Error: ${error.message}</p>
        </div>
      `;
    }
  }
});

function toggleHelp() {
  const helpContent = document.getElementById("help-content");
  const helpToggle = document.querySelector(".help-toggle");

  if (!helpContent || !helpToggle) return;

  const isExpanded = helpContent.classList.contains("expanded");

  if (isExpanded) {
    helpContent.classList.remove("expanded");
    helpToggle.classList.remove("active");
    helpToggle.setAttribute("aria-expanded", "false");
  } else {
    helpContent.classList.add("expanded");
    helpToggle.classList.add("active");
    helpToggle.setAttribute("aria-expanded", "true");
  }

  if (window.SoundFeedback && typeof window.SoundFeedback.playEffect === "function") {
    window.SoundFeedback.playEffect("click");
  }
}

function testFunction() {
  alert("JavaScript is working correctly!");

  try {
    renderRecords();
  } catch (error) {
    console.error("Error rendering records:", error);
    alert("Error rendering records: " + error.message);
  }
}

// Export functions to global scope - Make functions available for external access and HTML event handlers
window.handleSearch = handleSearch;
window.clearSearch = clearSearch;
window.handleCategoryFilter = handleCategoryFilter;
window.handleImportanceFilter = handleImportanceFilter;
window.handleSort = handleSort;
window.toggleRecordExpansion = toggleRecordExpansion;
window.toggleHelp = toggleHelp;
window.testFunction = testFunction;
