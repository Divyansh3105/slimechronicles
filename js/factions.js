document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".faction-card");
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const relationFilter = document.getElementById("relationFilter");
  const modal = document.getElementById("faction-modal");
  const modalBody = document.getElementById("modal-body");

  // Check if required elements exist
  if (!modal || !modalBody) {
    console.warn("Modal elements not found, modal functionality disabled");
    return;
  }

  // Add modal functionality to expand buttons
  cards.forEach(card => {
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

    const factionName = card.querySelector("h2")?.textContent || "Unknown Faction";
    const factionTag = card.querySelector(".faction-tag");
    const factionSummary = card.querySelector(".faction-summary")?.textContent || "";
    const powerSnapshot = card.querySelector(".power-snapshot");
    const factionDetails = card.querySelector(".faction-details");

    // Build modal content
    let modalContent = `
      <div class="modal-faction-header">
        <div>
          <h1 class="modal-faction-title">${factionName}</h1>
          ${factionTag ? `<span class="modal-faction-tag ${factionTag.className}">${factionTag.textContent}</span>` : ''}
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

      powerItems.forEach(item => {
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

        detailSections.forEach(section => {
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
    }

    modalBody.innerHTML = modalContent;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Animate power bars after modal opens
    setTimeout(() => {
      const modalPowerBars = modal.querySelectorAll(".modal-power-bar div");
      modalPowerBars.forEach(bar => {
        const power = bar.style.getPropertyValue("--power");
        bar.style.width = `${power}%`;
      });
    }, 100);
  }

  // Enhanced filter functionality
  function filterFactions() {
    const search = searchInput ? searchInput.value.toLowerCase() : "";
    const type = typeFilter ? typeFilter.value : "all";
    const relation = relationFilter ? relationFilter.value : "all";

    cards.forEach(card => {
      const nameElement = card.querySelector("h2");
      const summaryElement = card.querySelector(".faction-summary");

      const name = nameElement ? nameElement.textContent.toLowerCase() : "";
      const summary = summaryElement ? summaryElement.textContent.toLowerCase() : "";
      const cardType = card.dataset.type || "";
      const cardRelation = card.dataset.relation || "unknown";

      const matchesSearch = name.includes(search) || summary.includes(search);
      const matchesType = type === "all" || type === cardType;
      const matchesRelation = relation === "all" || relation === cardRelation;

      card.style.display = matchesSearch && matchesType && matchesRelation ? "block" : "none";
    });

    // Update results count
    const visibleCards = Array.from(cards).filter(card => card.style.display !== "none");
    updateResultsCount(visibleCards.length, cards.length);
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

    const typeText = (typeFilter && typeFilter.value !== "all") ? `${typeFilter.value}s` : "factions";
    const relationText = (relationFilter && relationFilter.value !== "all") ? ` (${relationFilter.value})` : "";
    counter.textContent = `Showing ${visible} of ${total} ${typeText}${relationText}`;
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

// Mobile Navigation Functions - Handle mobile menu toggle functionality
function toggleMobileMenu() {
  console.log("toggleMobileMenu called"); // Debug logging for mobile menu activation

  // Get mobile navigation elements from DOM
  const toggle = document.querySelector(".mobile-menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  if (!toggle || !mobileNav) {
    console.warn("Mobile navigation elements not found");
    return;
  }

  // Toggle active states for menu and button
  toggle.classList.toggle("active");
  mobileNav.classList.toggle("active");

  // Manage body scroll behavior when menu is open
  if (mobileNav.classList.contains("active")) {
    document.body.style.overflow = "hidden"; // Prevent background scrolling
    document.body.classList.add("mobile-nav-active");
  } else {
    document.body.style.overflow = "auto"; // Restore scrolling
    document.body.classList.remove("mobile-nav-active");
  }

  // Add accessibility attributes for screen readers
  const isOpen = mobileNav.classList.contains("active");
  toggle.setAttribute("aria-expanded", isOpen);
  mobileNav.setAttribute("aria-hidden", !isOpen);
}

// Initialize mobile navigation event listeners
function initializeMobileNavigation() {
  const toggle = document.querySelector(".mobile-menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  if (!toggle || !mobileNav) {
    console.warn("Mobile navigation elements not found during initialization");
    return;
  }

  // Auto-close menu when navigation links are clicked
  document.querySelectorAll(".mobile-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      toggleMobileMenu(); // Auto-close menu after navigation
    });
  });

  // Close menu when clicking outside of it
  document.addEventListener("click", (e) => {
    if (mobileNav.classList.contains("active") &&
        !mobileNav.contains(e.target) &&
        !toggle.contains(e.target)) {
      toggleMobileMenu(); // Close menu on outside click
    }
  });

  // Close menu with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileNav && mobileNav.classList.contains("active")) {
      toggleMobileMenu(); // Close menu with keyboard shortcut
    }
  });

  // Handle visibility change (tab switching)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (mobileNav && mobileNav.classList.contains("active")) {
        // Close mobile nav when tab becomes hidden
        toggleMobileMenu(); // Prevent menu staying open in background
      }
    }
  });

  // Handle window resize - close mobile nav on desktop
  let isMobile = window.innerWidth <= 768;
  window.addEventListener("resize", () => {
    const newIsMobile = window.innerWidth <= 768;
    if (!newIsMobile && mobileNav.classList.contains("active")) {
      // Close mobile nav when switching to desktop
      toggleMobileMenu(); // Auto-close on desktop resize
    }
    isMobile = newIsMobile; // Update mobile state tracking
  });

  // Add touch gesture support for mobile menu
  let touchStartY = 0;
  let touchStartX = 0;

  mobileNav.addEventListener("touchstart", (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
  });

  mobileNav.addEventListener("touchend", (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const swipeDistance = touchStartY - touchEndY;
    const horizontalDistance = Math.abs(touchStartX - touchEndX);

    // If swiped up significantly and not too much horizontal movement, close the menu
    if (swipeDistance > 100 && horizontalDistance < 50) {
      toggleMobileMenu(); // Close menu on upward swipe gesture
    }
  });
}

// Initialize mobile navigation when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeMobileNavigation);

// Make functions globally available for HTML onclick handlers
window.toggleMobileMenu = toggleMobileMenu;
window.closeFactionModal = closeFactionModal;
