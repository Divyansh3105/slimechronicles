document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".faction-card");
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const relationFilter = document.getElementById("relationFilter");
  const modal = document.getElementById("faction-modal");
  const modalBody = document.getElementById("modal-body");

  // Faction Dependencies Database
  const factionDependencies = {
    "Jura Tempest Federation": [
      "⚔ Military",
      "✨ Magic",
      "🔩 Technology",
      "🧠 Intelligence",
    ],
    "Armed Nation of Dwargon": [
      "⚔ Military",
      "🔩 Technology",
      "🌾 Agriculture",
    ],
    "Kingdom of Ingrassia": ["⚔ Military", "🌾 Agriculture", "🧠 Intelligence"],
    "Holy Empire Ruberios": ["⚔ Military", "✨ Magic", "🧠 Intelligence"],
    "Eastern Empire": [
      "⚔ Military",
      "🔩 Technology",
      "🧠 Intelligence",
      "🌾 Agriculture",
    ],
    "Kingdom of Blumund": ["🧠 Intelligence", "🌾 Agriculture"],
    "Animal Kingdom Eurazania": ["⚔ Military", "🌾 Agriculture", "✨ Magic"],
    "Kingdom of Farmenas": ["🌾 Agriculture", "🧠 Intelligence"],
    "Octagram (Demon Lords)": ["⚔ Military", "✨ Magic", "🧠 Intelligence"],
    "Free Guild": ["🧠 Intelligence", "🌾 Agriculture"],
    "Four Nations Trade Alliance": [
      "🔩 Technology",
      "🌾 Agriculture",
      "🧠 Intelligence",
    ],
    "Western Holy Church": ["⚔ Military", "✨ Magic"],
    Cerberus: ["🧠 Intelligence", "🔩 Technology"],
    "Kingdom of Falmuth (Fallen)": ["⚔ Military", "🌾 Agriculture"],
    "Goblin Tribes": ["⚔ Military", "🌾 Agriculture"],
    "Fanged Wolf Clan": ["⚔ Military", "✨ Magic"],
    "Lizardmen Tribes": ["⚔ Military", "🌾 Agriculture"],
  };

  // Function to generate faction dependencies HTML
  function generateFactionDependencies(factionName) {
    const dependencies = factionDependencies[factionName];
    if (!dependencies || dependencies.length === 0) return "";

    let dependenciesHTML = `
      <div class="modal-detail-section dependency-section">
        <h4>Strategic Dependencies</h4>
        <div class="dependency-grid">
    `;

    dependencies.forEach((dependency) => {
      dependenciesHTML += `<span>${dependency}</span>`;
    });

    dependenciesHTML += `
        </div>
      </div>
    `;

    return dependenciesHTML;
  }

  // Faction Relations Database
  const factionRelations = {
    "Jura Tempest Federation": {
      allied: ["Dwargon", "Blumund", "Ingrassia", "Farmenas"],
      neutral: ["Ruberios", "Eurazania", "Octagram"],
      hostile: ["Eastern Empire", "Western Holy Church"],
      unknown: [],
    },
    "Armed Nation of Dwargon": {
      allied: ["Tempest", "Ingrassia", "Blumund"],
      neutral: ["Ruberios", "Eastern Empire", "Free Guild"],
      hostile: [],
      unknown: [],
    },
    "Kingdom of Ingrassia": {
      allied: ["Tempest", "Dwargon", "Free Guild"],
      neutral: ["Ruberios", "Blumund", "Eastern Empire"],
      hostile: [],
      unknown: [],
    },
    "Holy Empire Ruberios": {
      allied: ["Western Nations"],
      neutral: ["Tempest", "Ingrassia", "Octagram"],
      hostile: ["Eastern Empire", "Monster Nations"],
      unknown: [],
    },
    "Eastern Empire": {
      allied: [],
      neutral: ["Ruberios"],
      hostile: ["Tempest", "Demon Lords", "Western Nations", "Monster Nations"],
      unknown: ["Dwargon"],
    },
    "Kingdom of Blumund": {
      allied: ["Tempest", "Ingrassia", "Free Guild"],
      neutral: ["Dwargon", "Ruberios"],
      hostile: [],
      unknown: ["Eastern Empire"],
    },
    "Animal Kingdom Eurazania": {
      allied: ["Octagram"],
      neutral: ["Tempest", "Trade Partners", "Western Nations"],
      hostile: [],
      unknown: ["Eastern Empire"],
    },
    "Kingdom of Farmenas": {
      allied: ["Tempest", "Blumund", "Dwargon"],
      neutral: ["Ingrassia", "Ruberios"],
      hostile: [],
      unknown: ["Eastern Empire"],
    },
    "Octagram (Demon Lords)": {
      allied: ["Monster Nations"],
      neutral: ["All Nations", "Human Kingdoms", "Free Guild"],
      hostile: ["Eastern Empire"],
      unknown: [],
    },
    "Free Guild": {
      allied: ["Ingrassia"],
      neutral: ["All Nations", "Tempest", "Blumund", "Dwargon", "Octagram"],
      hostile: [],
      unknown: [],
    },
    "Four Nations Trade Alliance": {
      allied: ["Member Nations"],
      neutral: ["Ingrassia", "Free Guild", "Ruberios", "Octagram"],
      hostile: [],
      unknown: ["Eastern Empire"],
    },
    "Western Holy Church": {
      allied: ["Ruberios", "Western Nations"],
      neutral: ["Eastern Empire"],
      hostile: ["Tempest", "Monster Nations", "Demon Lords"],
      unknown: [],
    },
    Cerberus: {
      allied: ["Eastern Empire"],
      neutral: ["Criminal Networks"],
      hostile: ["Tempest", "Freedom Association", "Free Guild"],
      unknown: ["Western Nations"],
    },
    "Kingdom of Falmuth (Fallen)": {
      allied: ["Western Nations"],
      neutral: ["Ingrassia", "Free Guild"],
      hostile: ["Tempest"],
      unknown: ["Ruberios"],
    },
    "Goblin Tribes": {
      allied: ["Tempest", "Wolf Clan", "Lizardmen", "Dwargon"],
      neutral: ["Forest Races"],
      hostile: ["Orc Clans"],
      unknown: [],
    },
    "Fanged Wolf Clan": {
      allied: ["Tempest", "Goblin Tribes", "Lizardmen"],
      neutral: ["Forest Races", "Dwargon"],
      hostile: ["Orc Clans"],
      unknown: [],
    },
    "Lizardmen Tribes": {
      allied: ["Tempest", "Goblin Tribes", "Wolf Clan"],
      neutral: ["Forest Races", "Dwargon"],
      hostile: ["Orc Clans"],
      unknown: [],
    },
  };

  // Function to generate faction relations HTML
  function generateFactionRelations(factionName) {
    const relations = factionRelations[factionName];
    if (!relations) return "";

    let relationsHTML = `
      <div class="modal-detail-section relations-section">
        <h4>Faction Relations</h4>

        <!-- Mini Legend for Modal -->
        <div class="modal-relations-legend">
          <div class="modal-legend-item">
            <span class="relation allied">🤝 Allied</span>
          </div>
          <div class="modal-legend-item">
            <span class="relation neutral">🤝 Neutral</span>
          </div>
          <div class="modal-legend-item">
            <span class="relation hostile">⚔️ Hostile</span>
          </div>
          <div class="modal-legend-item">
            <span class="relation unknown">❓ Unknown</span>
          </div>
        </div>

        <div class="relation-pills">
    `;

    // Add allied relations
    relations.allied.forEach((faction) => {
      relationsHTML += `<span class="relation allied" data-faction="${faction}" title="Allied: Close partnership with ${faction}">${faction}</span>`;
    });

    // Add neutral relations
    relations.neutral.forEach((faction) => {
      relationsHTML += `<span class="relation neutral" data-faction="${faction}" title="Neutral: Diplomatic relations with ${faction}">${faction}</span>`;
    });

    // Add hostile relations
    relations.hostile.forEach((faction) => {
      relationsHTML += `<span class="relation hostile" data-faction="${faction}" title="Hostile: Active conflict with ${faction}">${faction}</span>`;
    });

    // Add unknown relations
    relations.unknown.forEach((faction) => {
      relationsHTML += `<span class="relation unknown" data-faction="${faction}" title="Unknown: Unclear relations with ${faction}">${faction}</span>`;
    });

    relationsHTML += `
        </div>
      </div>
    `;

    return relationsHTML;
  }

  // Check if required elements exist
  if (!modal || !modalBody) {
    console.warn("Modal elements not found, modal functionality disabled");
    return;
  }

  // Add modal functionality to expand buttons
  cards.forEach((card) => {
    const expandBtn = card.querySelector(".expand-btn");
    if (expandBtn) {
      expandBtn.addEventListener("click", () => {
        openFactionModal(card);
      });
    }
  });

  // Function to open faction modal
  function openFactionModal(card) {
    if (!modal || !modalBody) {
      console.warn("Modal elements not available");
      return;
    }

    const factionName =
      card.querySelector("h2")?.textContent || "Unknown Faction";
    const factionTag = card.querySelector(".faction-tag");
    const factionSummary =
      card.querySelector(".faction-summary")?.textContent || "";
    const powerSnapshot = card.querySelector(".power-snapshot");
    const factionDetails = card.querySelector(".faction-details");

    // Build modal content
    let modalContent = `
      <div class="modal-faction-header">
        <div>
          <h1 class="modal-faction-title">${factionName}</h1>
          ${factionTag ? `<span class="modal-faction-tag ${factionTag.className}">${factionTag.textContent}</span>` : ""}
        </div>
      </div>

      <p class="modal-faction-summary">${factionSummary}</p>
    `;

    // Add power snapshot if it exists
    if (powerSnapshot) {
      const powerItems = powerSnapshot.querySelectorAll(".power-item");
      modalContent += `
        <div class="modal-power-snapshot">
          <h3>Power Analysis</h3>
          <div class="modal-power-grid">
      `;

      powerItems.forEach((item) => {
        const label = item.querySelector("span")?.textContent || "";
        const powerBar = item.querySelector(".power-bar div");
        const powerValue = powerBar?.style.getPropertyValue("--power") || "0";

        modalContent += `
          <div class="modal-power-item">
            <div class="modal-power-label">
              <span>${label}</span>
              <span class="modal-power-value">${powerValue}%</span>
            </div>
            <div class="modal-power-bar">
              <div style="--power: ${powerValue}"></div>
            </div>
          </div>
        `;
      });

      modalContent += `
          </div>
        </div>
      `;
    }

    // Add detailed sections if they exist
    if (factionDetails) {
      const detailSections = factionDetails.querySelectorAll(".detail-section");
      if (detailSections.length > 0) {
        modalContent += `<div class="modal-detail-sections">`;

        // Prioritize timeline section to appear first
        const timelineSection = Array.from(detailSections).find((section) =>
          section.classList.contains("timeline-section"),
        );
        const otherSections = Array.from(detailSections).filter(
          (section) =>
            !section.classList.contains("timeline-section") &&
            !section.classList.contains("relations-section"),
        );

        // Add timeline section first if it exists
        if (timelineSection) {
          const title = timelineSection.querySelector("h4")?.textContent || "";
          const timelineDiv = timelineSection.querySelector(".mini-timeline");

          if (title && timelineDiv) {
            modalContent += `
              <div class="modal-detail-section timeline-section">
                <h4>${title}</h4>
                <div class="mini-timeline">${timelineDiv.innerHTML}</div>
              </div>
            `;
          }
        }

        // Add faction relations section (dynamically generated)
        modalContent += generateFactionRelations(factionName);

        // Add faction dependencies section (dynamically generated)
        modalContent += generateFactionDependencies(factionName);

        // Add other sections
        otherSections.forEach((section) => {
          const title = section.querySelector("h4")?.textContent || "";
          const list = section.querySelector("ul");
          const linksDiv = section.querySelector(".faction-links");

          if (title && (list || linksDiv)) {
            modalContent += `
              <div class="modal-detail-section">
                <h4>${title}</h4>
            `;

            if (list) {
              modalContent += `<ul>${list.innerHTML}</ul>`;
            }

            if (linksDiv) {
              modalContent += `<div class="faction-links">${linksDiv.innerHTML}</div>`;
            }

            modalContent += `</div>`;
          }
        });

        modalContent += `</div>`;
      } else {
        // Handle old format without detail sections
        const list = factionDetails.querySelector("ul");
        if (list) {
          modalContent += `
            <div class="modal-detail-sections">
              <div class="modal-detail-section">
                <h4>Details</h4>
                <ul>${list.innerHTML}</ul>
              </div>
            </div>
          `;
        }
      }
    } else {
      // If no faction details exist, still add the relations section
      modalContent += `<div class="modal-detail-sections">`;
      modalContent += generateFactionRelations(factionName);
      modalContent += `</div>`;
    }

    modalBody.innerHTML = modalContent;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Add click handlers for relation pills (future functionality)
    const relationPills = modal.querySelectorAll(".relation[data-faction]");
    relationPills.forEach((pill) => {
      pill.addEventListener("click", (e) => {
        const targetFaction = e.target.dataset.faction;
        // Future: Open modal for the clicked faction
        findAndOpenFactionModal(targetFaction);
      });
    });

    // Animate power bars after modal opens
    setTimeout(() => {
      const modalPowerBars = modal.querySelectorAll(".modal-power-bar div");
      modalPowerBars.forEach((bar) => {
        const power = bar.style.getPropertyValue("--power");
        bar.style.width = `${power}%`;
      });
    }, 100);
  }

  // Function to find and open faction modal by name
  function findAndOpenFactionModal(factionName) {
    // Normalize faction names for matching
    const normalizedTarget = factionName.toLowerCase();

    // Find the faction card that matches
    const targetCard = Array.from(cards).find((card) => {
      const cardName =
        card.querySelector("h2")?.textContent.toLowerCase() || "";
      return (
        cardName.includes(normalizedTarget) ||
        normalizedTarget.includes(cardName.split(" ")[0]) ||
        (normalizedTarget === "tempest" && cardName.includes("jura tempest")) ||
        (normalizedTarget === "dwargon" && cardName.includes("dwargon")) ||
        (normalizedTarget === "ruberios" && cardName.includes("ruberios")) ||
        (normalizedTarget === "eastern empire" &&
          cardName.includes("eastern empire"))
      );
    });

    if (targetCard) {
      // Close current modal first
      closeFactionModal();

      // Open new modal after a brief delay
      setTimeout(() => {
        openFactionModal(targetCard);
      }, 300);
    } else {
      console.warn(`Faction not found: ${factionName}`);
      // Could show a toast notification here
    }
  }

  // Enhanced filter functionality
  function filterFactions() {
    const search = searchInput ? searchInput.value.toLowerCase() : "";
    const type = typeFilter ? typeFilter.value : "all";
    const relation = relationFilter ? relationFilter.value : "all";

    let visibleCount = 0;

    cards.forEach((card) => {
      const nameElement = card.querySelector("h2");
      const summaryElement = card.querySelector(".faction-summary");

      const name = nameElement ? nameElement.textContent.toLowerCase() : "";
      const summary = summaryElement
        ? summaryElement.textContent.toLowerCase()
        : "";
      const cardType = card.dataset.type || "";
      const cardRelation = card.dataset.relation || "unknown";

      const matchesSearch = name.includes(search) || summary.includes(search);
      const matchesType = type === "all" || type === cardType;
      const matchesRelation = relation === "all" || relation === cardRelation;

      const isVisible = matchesSearch && matchesType && matchesRelation;

      if (isVisible) {
        card.style.display = "block";
        card.style.animation = "fadeInUp 0.4s ease forwards";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    // Update results count
    updateResultsCount(visibleCount, cards.length);

    // Show/hide no results message
    showNoResultsMessage(visibleCount);
  }

  // Add results counter with more detailed info
  function updateResultsCount(visible, total) {
    let counter = document.getElementById("resultsCounter");
    if (!counter) {
      counter = document.createElement("div");
      counter.id = "resultsCounter";
      counter.className = "results-counter";
      const controlsElement = document.querySelector(".factions-controls");
      if (controlsElement) {
        controlsElement.appendChild(counter);
      }
    }

    const typeText =
      typeFilter && typeFilter.value !== "all"
        ? `${typeFilter.value}s`
        : "factions";
    const relationText =
      relationFilter && relationFilter.value !== "all"
        ? ` (${relationFilter.value})`
        : "";

    counter.textContent = `Showing ${visible} of ${total} ${typeText}${relationText}`;

    // Add animation when count changes
    counter.style.animation = 'none';
    setTimeout(() => {
      counter.style.animation = 'pulse 2s ease-in-out infinite';
    }, 10);
  }

  // Show/hide no results message
  function showNoResultsMessage(visibleCount) {
    const grid = document.querySelector('.factions-grid');
    let noResultsMsg = document.getElementById('noResultsMessage');

    if (visibleCount === 0) {
      if (!noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.id = 'noResultsMessage';
        noResultsMsg.className = 'no-results';
        noResultsMsg.textContent = 'No factions match your search criteria';
        grid.appendChild(noResultsMsg);
      }
      noResultsMsg.style.display = 'block';
    } else {
      if (noResultsMsg) {
        noResultsMsg.style.display = 'none';
      }
    }
  }

  // Event listeners
  if (searchInput) {
    searchInput.addEventListener("input", filterFactions);

    // Add keyboard navigation and shortcuts
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        searchInput.value = "";
        if (typeFilter) typeFilter.value = "all";
        if (relationFilter) relationFilter.value = "all";
        filterFactions();
      }
    });
  }

  if (typeFilter) {
    typeFilter.addEventListener("change", filterFactions);
  }

  if (relationFilter) {
    relationFilter.addEventListener("change", filterFactions);
  }

  // Initialize results counter
  updateResultsCount(cards.length, cards.length);

  // Close modal when clicking outside
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeFactionModal();
      }
    });
  }

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("active")) {
      closeFactionModal();
    }
  });
});

// Global function to close faction modal
function closeFactionModal() {
  const modal = document.getElementById("faction-modal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
}

// Export global function
window.closeFactionModal = closeFactionModal;

// Scroll to Top Button Functionality
document.addEventListener("DOMContentLoaded", () => {
  // Create scroll to top button
  const scrollBtn = document.createElement('div');
  scrollBtn.className = 'scroll-to-top';
  scrollBtn.setAttribute('aria-label', 'Scroll to top');
  scrollBtn.setAttribute('role', 'button');
  scrollBtn.setAttribute('tabindex', '0');
  document.body.appendChild(scrollBtn);

  // Show/hide scroll button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });

  // Scroll to top on click
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Keyboard accessibility
  scrollBtn.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  });
});

// Enhanced card animations on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all faction cards
document.addEventListener('DOMContentLoaded', () => {
  const factionCards = document.querySelectorAll('.faction-card');
  factionCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    cardObserver.observe(card);
  });
});

// Add smooth reveal animation for power bars when cards become visible
const powerBarObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const powerBars = entry.target.querySelectorAll('.power-bar div');
      powerBars.forEach((bar, index) => {
        setTimeout(() => {
          const power = bar.style.getPropertyValue('--power');
          bar.style.width = `${power}%`;
        }, index * 100);
      });
      powerBarObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
  const factionCards = document.querySelectorAll('.faction-card');
  factionCards.forEach(card => {
    // Reset power bars to 0 width initially
    const powerBars = card.querySelectorAll('.power-bar div');
    powerBars.forEach(bar => {
      bar.style.width = '0';
    });
    powerBarObserver.observe(card);
  });
});

// Add keyboard navigation for faction cards
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.faction-card');

  cards.forEach((card, index) => {
    card.setAttribute('tabindex', '0');

    card.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const expandBtn = card.querySelector('.expand-btn');
        if (expandBtn) {
          expandBtn.click();
        }
      }
    });
  });
});

// Enhanced modal close with escape key (already exists but enhanced)
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('faction-modal');
  if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
    closeFactionModal();
  }
});

// Add loading state to cards during filter
let filterTimeout;
function filterFactionsWithLoading() {
  const cards = document.querySelectorAll('.faction-card');

  // Add loading state
  cards.forEach(card => card.classList.add('loading'));

  // Clear previous timeout
  clearTimeout(filterTimeout);

  // Filter after brief delay for smooth UX
  filterTimeout = setTimeout(() => {
    filterFactions();
    cards.forEach(card => card.classList.remove('loading'));
  }, 150);
}

// Export for use in main code
window.filterFactionsWithLoading = filterFactionsWithLoading;

// Clear Filters Button Functionality
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const relationFilter = document.getElementById("relationFilter");
  const controlsElement = document.querySelector(".factions-controls");

  // Create clear filters button
  const clearBtn = document.createElement('button');
  clearBtn.className = 'clear-filters-btn';
  clearBtn.textContent = '✕ Clear Filters';
  clearBtn.setAttribute('aria-label', 'Clear all filters');

  if (controlsElement) {
    controlsElement.appendChild(clearBtn);
  }

  // Function to check if any filters are active
  function checkActiveFilters() {
    const hasSearch = searchInput && searchInput.value.trim() !== '';
    const hasTypeFilter = typeFilter && typeFilter.value !== 'all';
    const hasRelationFilter = relationFilter && relationFilter.value !== 'all';

    if (hasSearch || hasTypeFilter || hasRelationFilter) {
      clearBtn.classList.add('visible');
    } else {
      clearBtn.classList.remove('visible');
    }
  }

  // Clear all filters
  clearBtn.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (typeFilter) typeFilter.value = 'all';
    if (relationFilter) relationFilter.value = 'all';

    // Trigger filter update
    if (typeof filterFactions === 'function') {
      filterFactions();
    }

    // Hide clear button
    clearBtn.classList.remove('visible');

    // Add feedback animation
    clearBtn.style.animation = 'none';
    setTimeout(() => {
      clearBtn.style.animation = '';
    }, 10);
  });

  // Monitor filter changes
  if (searchInput) {
    searchInput.addEventListener('input', checkActiveFilters);
  }
  if (typeFilter) {
    typeFilter.addEventListener('change', checkActiveFilters);
  }
  if (relationFilter) {
    relationFilter.addEventListener('change', checkActiveFilters);
  }

  // Initial check
  checkActiveFilters();
});

// Add tooltips to power items
document.addEventListener("DOMContentLoaded", () => {
  const powerItems = document.querySelectorAll('.power-item');

  const tooltips = {
    'Military': 'Combat strength and army size',
    'Influence': 'Political power and diplomatic reach',
    'Magic': 'Magical capabilities and research',
    'Territory': 'Land area and resource control'
  };

  powerItems.forEach(item => {
    const label = item.querySelector('span')?.textContent.trim();
    if (label && tooltips[label]) {
      item.setAttribute('data-tooltip', tooltips[label]);
      item.setAttribute('title', tooltips[label]);
    }
  });
});

// Enhanced filter animation
function filterFactionsEnhanced() {
  const cards = document.querySelectorAll('.faction-card');
  const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const type = document.getElementById('typeFilter')?.value || 'all';
  const relation = document.getElementById('relationFilter')?.value || 'all';

  let visibleCount = 0;

  cards.forEach((card, index) => {
    const nameElement = card.querySelector('h2');
    const summaryElement = card.querySelector('.faction-summary');

    const name = nameElement ? nameElement.textContent.toLowerCase() : '';
    const summary = summaryElement ? summaryElement.textContent.toLowerCase() : '';
    const cardType = card.dataset.type || '';
    const cardRelation = card.dataset.relation || 'unknown';

    const matchesSearch = name.includes(search) || summary.includes(search);
    const matchesType = type === 'all' || type === cardType;
    const matchesRelation = relation === 'all' || relation === cardRelation;

    const isVisible = matchesSearch && matchesType && matchesRelation;

    if (isVisible) {
      card.classList.remove('filtered-out');
      card.classList.add('filtered-in');
      card.style.display = 'block';
      card.style.animationDelay = `${index * 0.05}s`;
      visibleCount++;
    } else {
      card.classList.add('filtered-out');
      card.classList.remove('filtered-in');
      setTimeout(() => {
        if (card.classList.contains('filtered-out')) {
          card.style.display = 'none';
        }
      }, 300);
    }
  });

  // Update results count
  if (typeof updateResultsCount === 'function') {
    updateResultsCount(visibleCount, cards.length);
  }

  // Show/hide no results message
  if (typeof showNoResultsMessage === 'function') {
    showNoResultsMessage(visibleCount);
  }
}

// Replace the original filterFactions with enhanced version
if (typeof filterFactions !== 'undefined') {
  window.filterFactions = filterFactionsEnhanced;
}

// Add smooth scroll behavior for internal links
document.addEventListener("DOMContentLoaded", () => {
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

// Add visual feedback for card interactions
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll('.faction-card');

  cards.forEach(card => {
    // Add ripple effect on click
    card.addEventListener('click', function(e) {
      const ripple = document.createElement('div');
      ripple.className = 'ripple-effect';
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(77, 212, 255, 0.3);
        width: 20px;
        height: 20px;
        pointer-events: none;
        animation: ripple 0.6s ease-out;
      `;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';

      card.style.position = 'relative';
      card.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    from {
      transform: scale(0);
      opacity: 1;
    }
    to {
      transform: scale(20);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

console.log('✨ Factions page UI enhancements loaded successfully!');
