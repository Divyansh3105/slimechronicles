// Configuration constants - Define timing, breakpoints, and performance settings
const CONFIG = {
  // Animation delay settings for different device types
  ANIMATION_DELAYS: {
    MOBILE: 0.03,
    DESKTOP: 0.05,
  },
  // Responsive breakpoints for layout adjustments
  BREAKPOINTS: {
    MOBILE: 768,
    SMALL_MOBILE: 480,
  },
  // Timeout values for debounced operations
  TIMEOUTS: {
    SEARCH_DEBOUNCE: 300,
    RESIZE_DEBOUNCE: 250,
  },
};

// Resize handling with debouncing - Prevent excessive resize event processing
let resizeTimeout;
function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    renderRecords();
  }, CONFIG.TIMEOUTS.RESIZE_DEBOUNCE);
}

// Historical records storage - Array to hold all record data
let HISTORICAL_RECORDS = [];

// Load records from HTML data - Extract record information from DOM elements
function loadRecordsFromHTML() {
  // Query all record data elements from the page
  const recordElements = document.querySelectorAll(
    "#historical-records-data .record-data",
  );

  // Transform DOM elements into structured data objects
  HISTORICAL_RECORDS = Array.from(recordElements).map((element) => {
    // Parse participants list from comma-separated string
    const participants = element
      .querySelector(".record-participants")
      .textContent.split(", ")
      .map((p) => p.trim());

    // Return structured record object with all properties
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

// Application state management - Centralized state object for filter and UI state
const state = {
  currentFilter: "all",
  currentSort: "chronological",
  searchQuery: "",
  expandedRecord: null,
};

// State variables for backward compatibility - Legacy state management approach
let currentFilter = state.currentFilter;
let currentSort = state.currentSort;
let searchQuery = state.searchQuery;
let expandedRecord = state.expandedRecord;
// Filter records by category or importance - Apply filtering logic to record collection
function filterRecords(records, filter) {
  if (filter === "all") return records;
  return records.filter(
    (record) => record.category === filter || record.importance === filter,
  );
}

// Sort records by specified criteria - Apply sorting logic based on user selection
function sortRecords(records, sortType) {
  const sorted = [...records];
  switch (sortType) {
    case "chronological":
      return sorted;
    case "importance":
      // Define importance hierarchy for sorting priority
      const importanceOrder = { critical: 0, major: 1, moderate: 2 };
      return sorted.sort(
        (a, b) => importanceOrder[a.importance] - importanceOrder[b.importance],
      );
    case "alphabetical":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "volume":
      return sorted.sort((a, b) => {
        // Extract volume numbers for numerical comparison
        const aVol = parseInt(a.volume.match(/\d+/)[0]);
        const bVol = parseInt(b.volume.match(/\d+/)[0]);
        return aVol - bVol;
      });
    default:
      return sorted;
  }
}

// Search records by query string - Filter records based on text search across multiple fields
function searchRecords(records, query) {
  if (!query) return records;
  const lowercaseQuery = query.toLowerCase();
  return records.filter(
    (record) =>
      record.title.toLowerCase().includes(lowercaseQuery) ||
      record.description.toLowerCase().includes(lowercaseQuery) ||
      record.details.toLowerCase().includes(lowercaseQuery) ||
      record.participants.some((p) =>
        p.toLowerCase().includes(lowercaseQuery),
      ) ||
      record.location.toLowerCase().includes(lowercaseQuery),
  );
}

// Get CSS color variable for importance level - Return appropriate color for visual importance indication
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

// Get emoji icon for importance level - Return appropriate emoji for visual importance indication
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

// Get emoji icon for record category - Return appropriate emoji for visual category identification
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
// Render records to DOM - Generate and display filtered, sorted, and searched records
function renderRecords(records = HISTORICAL_RECORDS) {
  const grid = document.getElementById("records-grid");

  if (!grid) {
    console.error("records-grid element not found!");
    return;
  }

  // Apply all filtering, searching, and sorting operations
  let filteredRecords = filterRecords(records, currentFilter);
  filteredRecords = searchRecords(filteredRecords, searchQuery);
  filteredRecords = sortRecords(filteredRecords, currentSort);

  // Display no results message if no records match criteria
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

  // Detect device type for responsive behavior
  const isMobile = window.innerWidth <= CONFIG.BREAKPOINTS.MOBILE;
  const isVerySmall = window.innerWidth <= CONFIG.BREAKPOINTS.SMALL_MOBILE;

  // Generate HTML for each record card with dynamic styling and content
  grid.innerHTML = filteredRecords
    .map((record, index) => {
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

  // Add mobile-specific touch interactions for better mobile experience
  if (isMobile) {
    document.querySelectorAll(".record-card").forEach((card, index) => {
      let touchStartY = 0;
      let touchStartX = 0;
      let touchMoved = false;
      let touchStartTime = 0;

      // Handle touch start with visual feedback
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
        { passive: true },
      );

      // Track touch movement to distinguish from taps
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
        { passive: true },
      );

      // Handle touch end and trigger expansion if it was a tap
      card.addEventListener(
        "touchend",
        function (e) {
          const touchDuration = Date.now() - touchStartTime;
          setTimeout(() => {
            this.style.transform = "";
          }, 100);

          if (!touchMoved && touchDuration < 500) {
            const recordId = this.dataset.recordId;
            if (recordId) {
              e.preventDefault();
              toggleRecordExpansion(recordId);
            }
          }
        },
        { passive: false },
      );

      // Add desktop click handler for non-mobile devices
      if (!isMobile) {
        card.addEventListener("click", function (e) {
          const recordId = this.dataset.recordId;
          if (recordId) {
            toggleRecordExpansion(recordId);
          }
        });
      }

      // Add keyboard accessibility support for all devices
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const recordId = this.dataset.recordId;
          if (recordId) {
            toggleRecordExpansion(recordId);
          }
        }
      });
    });
  } else {
    // Add desktop-specific event handlers for non-mobile devices
    document.querySelectorAll(".record-card").forEach((card) => {
      card.addEventListener("click", function (e) {
        const recordId = this.dataset.recordId;
        if (recordId) {
          toggleRecordExpansion(recordId);
        }
      });

      // Add keyboard accessibility support
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const recordId = this.dataset.recordId;
          if (recordId) {
            toggleRecordExpansion(recordId);
          }
        }
      });
    });
  }

  // Add sound feedback for all record card interactions
  document.querySelectorAll(".record-card").forEach((card) => {
    card.addEventListener("click", () => {
      if (
        window.SoundFeedback &&
        typeof window.SoundFeedback.playEffect === "function"
      ) {
        window.SoundFeedback.playEffect("click");
      }
    });
  });

  // Update statistics display and announce to screen readers
  updateVisibleRecordsCount();

  if (filteredRecords.length > 0) {
    const announcement = `${filteredRecords.length} historical records displayed`;
    announceToScreenReader(announcement);
  }
}
// Announce message to screen readers - Create accessible announcements for assistive technology
function announceToScreenReader(message) {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.style.position = "absolute";
  announcement.style.left = "-10000px";
  announcement.style.width = "1px";
  announcement.style.height = "1px";
  announcement.style.overflow = "hidden";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove announcement element after screen reader has processed it
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Toggle record expansion state - Show or hide detailed information for a specific record
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
    // Collapse the current record
    expandedRecord = null;
    detailsElement.classList.remove("expanded");
    expandText.textContent = "Show More";
    expandIcon.textContent = "▼";
    expandBtn.setAttribute("aria-label", "Show more details");
    detailsElement.setAttribute("aria-hidden", "true");
    expandBtn.classList.remove("expanded");
  } else {
    // Expand the selected record and collapse any others
    expandedRecord = recordId;

    // Collapse all other expanded records to maintain single expansion
    document
      .querySelectorAll(".record-details.expanded")
      .forEach((otherDetails) => {
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

    // Expand the selected record
    detailsElement.classList.add("expanded");
    expandText.textContent = "Show Less";
    expandIcon.textContent = "▲";
    expandBtn.setAttribute("aria-label", "Show less details");
    detailsElement.setAttribute("aria-hidden", "false");
    expandBtn.classList.add("expanded");
  }

  // Play sound feedback if available
  if (
    window.SoundFeedback &&
    typeof window.SoundFeedback.playEffect === "function"
  ) {
    window.SoundFeedback.playEffect("click");
  }

  // Ensure page scrolling remains enabled
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
}
// Create filter and search controls - Generate UI controls for filtering and searching records
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

  // Generate comprehensive filter controls HTML with accessibility features
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

  // Insert controls into DOM with error handling
  try {
    titleElement.insertAdjacentHTML("afterend", controlsHTML);
  } catch (error) {
    console.error("Error creating filter controls:", error);
  }
}
// Handle search input with debouncing - Process search queries with delay to improve performance
function handleSearch(query) {
  searchQuery = query;

  // Clear existing timeout to prevent multiple rapid searches
  if (window.searchTimeout) {
    clearTimeout(window.searchTimeout);
  }

  // Debounce search execution for better performance
  window.searchTimeout = setTimeout(() => {
    updateVisibleRecordsCount();
    renderRecords();

    // Toggle clear button visibility based on query presence
    const clearBtn = document.querySelector(".clear-search");
    if (clearBtn) {
      clearBtn.style.display = query ? "block" : "none";
    }

    // Provide accessibility feedback for mobile users
    if (window.innerWidth <= CONFIG.BREAKPOINTS.MOBILE) {
      const visibleCount = document.querySelectorAll(".record-card").length;
      if (query && visibleCount === 0) {
        announceToScreenReader("No records found for your search");
      } else if (query && visibleCount > 0) {
        announceToScreenReader(`${visibleCount} records found`);
      }
    }
  }, CONFIG.TIMEOUTS.SEARCH_DEBOUNCE);
}

// Clear search input and reset results - Reset search state and update display
function clearSearch() {
  searchQuery = "";
  document.getElementById("search-input").value = "";
  document.querySelector(".clear-search").style.display = "none";
  updateVisibleRecordsCount();
  renderRecords();
}

// Handle category filter selection - Apply category-based filtering
function handleCategoryFilter(category) {
  currentFilter = category;
  updateVisibleRecordsCount();
  renderRecords();
}

// Handle importance filter selection - Apply importance-based filtering
function handleImportanceFilter(importance) {
  currentFilter = importance;
  updateVisibleRecordsCount();
  renderRecords();
}

// Handle sort option selection - Apply sorting to displayed records
function handleSort(sortType) {
  currentSort = sortType;
  renderRecords();
}

// Update visible records count display - Calculate and display current filtered record count
function updateVisibleRecordsCount() {
  let filteredRecords = filterRecords(HISTORICAL_RECORDS, currentFilter);
  filteredRecords = searchRecords(filteredRecords, searchQuery);

  const visibleElement = document.getElementById("visible-records");
  if (visibleElement) {
    visibleElement.textContent = filteredRecords.length;
  }
}
// Initialize historical records page - Main initialization function for records functionality
function initializeHistoricalRecordsPage() {
  try {
    loadRecordsFromHTML();

    const container = document.querySelector(".historical-records-container");
    const grid = document.getElementById("records-grid");

    // Validate required DOM elements exist
    if (!container) {
      throw new Error("Historical records container not found");
    }

    if (!grid) {
      throw new Error("Records grid element not found");
    }

    // Initialize all page components in sequence
    createFilterControls();
    renderRecords();
    addGlobalEventListeners();
    ensureScrollingWorks();
  } catch (error) {
    console.error("Error initializing historical records page:", error);

    // Display user-friendly error message
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
    // Close expanded record on Escape key
    if (e.key === "Escape" && expandedRecord) {
      toggleRecordExpansion(expandedRecord);
    }

    // Focus search input on Ctrl+F or Cmd+F
    if ((e.ctrlKey || e.metaKey) && e.key === "f") {
      e.preventDefault();
      const searchInput = document.getElementById("search-input");
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }

    // Reset all filters on Ctrl+R or Cmd+R
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

  // Reset overflow properties on potential blocking elements
  const potentialBlockers = document.querySelectorAll(
    ".historical-records-container, .records-grid, .record-card, .record-details",
  );
  potentialBlockers.forEach((element) => {
    element.style.overflow = "visible";
    element.style.contain = "none";
  });

  // Monitor DOM changes and maintain scroll functionality
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

// Reset all filters to default state - Clear all filtering, sorting, and search criteria
function resetAllFilters() {
  currentFilter = "all";
  currentSort = "chronological";
  searchQuery = "";
  expandedRecord = null;

  // Reset all UI controls to default values
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

  // Update display and announce to screen readers
  updateVisibleRecordsCount();
  renderRecords();
  announceToScreenReader("All filters have been reset");
}
// Initialize records page wrapper - Main entry point for records page initialization
function initializeRecordsPage() {
  try {
    initializeHistoricalRecordsPage();
  } catch (error) {
    console.error("Error in initializeRecordsPage:", error);
  }
}

// DOM content loaded event handler - Initialize page when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("records-grid");

  // Display loading message while initialization occurs
  if (grid) {
    grid.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-light);">
        <div style="font-size: 2rem; margin-bottom: 1rem;">⏳</div>
        <div>Loading historical records...</div>
        <div style="margin-top: 1rem;">
          <button onclick="testFunction()" style="padding: 10px 20px; margin: 10px; background: var(--primary-blue); color: white; border: none; border-radius: 8px; cursor: pointer;">Test JavaScript</button>
        </div>
      </div>
    `;
  } else {
    console.error("Could not find records-grid element");
  }

  try {
    // Initialize mobile menu functionality first
    initializeMobileMenu();

    // Staggered initialization for better performance
    setTimeout(() => {
      initializeRecordsPage();

      setTimeout(() => {
        ensureScrollingWorks();
      }, 500);
    }, 100);
  } catch (error) {
    console.error("Error in initializeRecordsPage:", error);

    // Display error message to user
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

// Additional keyboard event handler - Duplicate handler for additional keyboard shortcuts
document.addEventListener("keydown", function (e) {
  // Close expanded record on Escape key
  if (e.key === "Escape" && expandedRecord) {
    toggleRecordExpansion(expandedRecord);
  }

  // Focus search input on Ctrl+F or Cmd+F
  if ((e.ctrlKey || e.metaKey) && e.key === "f") {
    e.preventDefault();
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.focus();
    }
  }

  // Reset all filters on Ctrl+R or Cmd+R
  if ((e.ctrlKey || e.metaKey) && e.key === "r") {
    e.preventDefault();
    currentFilter = "all";
    currentSort = "chronological";
    searchQuery = "";

    // Reset UI controls to default state
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
  }
});

// Toggle help content visibility - Show or hide help information panel
function toggleHelp() {
  const helpContent = document.getElementById("help-content");
  const helpToggle = document.querySelector(".help-toggle");

  if (!helpContent || !helpToggle) return;

  const isExpanded = helpContent.classList.contains("expanded");

  if (isExpanded) {
    // Collapse help content
    helpContent.classList.remove("expanded");
    helpToggle.classList.remove("active");
    helpToggle.setAttribute("aria-expanded", "false");
  } else {
    // Expand help content
    helpContent.classList.add("expanded");
    helpToggle.classList.add("active");
    helpToggle.setAttribute("aria-expanded", "true");
  }

  // Play sound feedback if available
  if (
    window.SoundFeedback &&
    typeof window.SoundFeedback.playEffect === "function"
  ) {
    window.SoundFeedback.playEffect("click");
  }
}

// Test function for debugging - Verify JavaScript functionality and render records
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

// Mobile Navigation Functions - Handle mobile menu interactions and scroll management
function toggleMobileMenu() {
  const mobileNav = document.getElementById('mobile-nav');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const body = document.body;
  const html = document.documentElement;

  if (!mobileNav || !mobileToggle) return;

  const isActive = mobileNav.classList.contains('active');

  if (isActive) {
    // Close mobile menu and restore normal scrolling
    mobileNav.classList.remove('active');
    mobileToggle.classList.remove('active');
    body.classList.remove('mobile-nav-active');
    html.classList.remove('mobile-nav-active');

    // Re-enable scrolling by clearing fixed positioning
    body.style.overflow = '';
    html.style.overflow = '';
    body.style.position = '';
    body.style.width = '';
    body.style.top = '';
    html.style.height = '';

    // Restore scroll position if previously saved
    if (window.scrollPosition !== undefined) {
      window.scrollTo(0, window.scrollPosition);
      delete window.scrollPosition;
    }
  } else {
    // Save current scroll position before opening menu
    window.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    // Open mobile menu and prevent background scrolling
    mobileNav.classList.add('active');
    mobileToggle.classList.add('active');
    body.classList.add('mobile-nav-active');
    html.classList.add('mobile-nav-active');

    // Prevent scrolling by fixing body position
    body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.width = '100%';
    body.style.top = `-${window.scrollPosition}px`;
    html.style.height = '100%';
  }

  // Play sound effect if available
  if (window.SoundFeedback && typeof window.SoundFeedback.playEffect === 'function') {
    window.SoundFeedback.playEffect('click');
  }
}

// Close mobile menu when clicking on navigation links - Auto-close menu after navigation
function closeMobileMenuOnLinkClick() {
  const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Small delay to allow navigation to start before closing menu
      setTimeout(() => {
        toggleMobileMenu();
      }, 100);
    });
  });
}

// Initialize mobile menu functionality
function initializeMobileMenu() {
  closeMobileMenuOnLinkClick();

  // Close mobile menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const mobileNav = document.getElementById('mobile-nav');
      if (mobileNav && mobileNav.classList.contains('active')) {
        toggleMobileMenu();
      }
    }
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    const mobileNav = document.getElementById('mobile-nav');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');

    if (mobileNav && mobileNav.classList.contains('active')) {
      if (!mobileNav.contains(e.target) && !mobileToggle.contains(e.target)) {
        toggleMobileMenu();
      }
    }
  });

  // Handle orientation change
  window.addEventListener('orientationchange', () => {
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav && mobileNav.classList.contains('active')) {
      // Close menu on orientation change to prevent layout issues
      setTimeout(() => {
        toggleMobileMenu();
      }, 100);
    }
  });

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const mobileNav = document.getElementById('mobile-nav');
      const mobileToggle = document.querySelector('.mobile-menu-toggle');

      // Close mobile menu if screen becomes large enough
      if (window.innerWidth > 768 && mobileNav && mobileNav.classList.contains('active')) {
        toggleMobileMenu();
      }

      // Show/hide mobile toggle based on screen size
      if (mobileToggle) {
        if (window.innerWidth <= 768) {
          mobileToggle.style.display = 'flex';
        } else {
          mobileToggle.style.display = 'none';
        }
      }
    }, 250);
  });
}

// Make functions globally available
window.toggleMobileMenu = toggleMobileMenu;
