// Timeline management class - Handles timeline events, filtering, and search functionality
class TimelineManager {
  constructor() {
    // Initialize timeline state properties
    this.currentView = "detailed";
    this.currentSort = "chronological";
    this.searchTerm = "";
    this.currentEraFilter = "all";
    this.currentImportanceFilter = "all";
    this.events = [];
    this.originalOrder = [];

    // Initialize timeline functionality
    this.init();
  }

  // Initialize timeline manager - Set up caching, event listeners, and tooltips
  init() {
    this.cacheEvents();
    this.setupEventListeners();
    this.initializeTooltips();
    this.updateStatistics();
  }

  // Cache timeline events - Extract and process timeline events from DOM
  cacheEvents() {
    this.events = Array.from(document.querySelectorAll(".timeline-event")).map(
      (event) => {
        // Extract text content from event elements
        const title = event.querySelector(".event-title")?.textContent || "";
        const description =
          event.querySelector(".event-description")?.textContent || "";
        const consequences =
          event.querySelector(".event-consequences")?.textContent || "";
        const characters = Array.from(
          event.querySelectorAll(".character-link span"),
        ).map((span) => span.textContent);
        const date = event.querySelector(".event-date")?.textContent || "";
        const era = event.closest(".timeline-year")?.dataset.era || "";

        // Return processed event data object
        return {
          element: event,
          title,
          description,
          consequences,
          characters,
          date,
          era,
          searchText:
            `${title} ${description} ${consequences} ${characters.join(" ")} ${date}`.toLowerCase(),
          importance: this.calculateImportance(event),
          impact: this.calculateImpact(event),
        };
      },
    );

    // Store original order for reset functionality
    this.originalOrder = [...this.events];
  }

  // Calculate event importance - Assign importance score based on content analysis
  calculateImportance(eventElement) {
    let score = 0;

    // Extract event content for analysis
    const title = eventElement.querySelector(".event-title")?.textContent || "";
    const consequences = eventElement.querySelectorAll(
      ".event-consequences li",
    );
    const characters = eventElement.querySelectorAll(".character-link");

    // Score based on important keywords in title
    const importantKeywords = [
      "awakening",
      "demon lord",
      "evolution",
      "founding",
      "war",
      "alliance",
      "dragon",
    ];
    importantKeywords.forEach((keyword) => {
      if (title.toLowerCase().includes(keyword)) score += 10;
    });

    // Score based on number of consequences listed
    score += consequences.length * 5;

    // Score based on number of characters involved
    score += characters.length * 3;

    // Bonus points for specific high-importance characters
    if (title.includes("Rimuru")) score += 15;
    if (title.includes("True Dragon")) score += 12;
    if (title.includes("Walpurgis")) score += 10;

    return score;
  }

  // Calculate event impact - Determine event's impact level based on consequences
  calculateImpact(eventElement) {
    const consequences = eventElement.querySelectorAll(
      ".event-consequences li",
    );
    let impact = consequences.length * 2;

    // Analyze consequence text for impact keywords
    const consequenceText =
      eventElement
        .querySelector(".event-consequences")
        ?.textContent.toLowerCase() || "";

    // Add impact points based on scope keywords
    if (consequenceText.includes("global") || consequenceText.includes("world"))
      impact += 20;
    if (
      consequenceText.includes("nation") ||
      consequenceText.includes("federation")
    )
      impact += 15;
    if (
      consequenceText.includes("military") ||
      consequenceText.includes("power")
    )
      impact += 10;
    if (
      consequenceText.includes("diplomatic") ||
      consequenceText.includes("alliance")
    )
      impact += 8;

    return impact;
  }

  // Set up event listeners - Initialize search input and keyboard shortcuts
  setupEventListeners() {
    // Set up search input with debounced input handling
    const searchInput = document.getElementById("timeline-search");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchTerm = e.target.value.toLowerCase();
        this.applyFilters();
        this.updateSearchUI();
      });

      // Handle Enter key press for immediate search
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.searchTimeline();
        }
      });
    }

    // Set up filter controls
    const eraFilter = document.getElementById("era-filter");
    if (eraFilter) {
      eraFilter.addEventListener("change", (e) => {
        this.currentEraFilter = e.target.value;
        this.applyFilters();
      });
    }

    const importanceFilter = document.getElementById("importance-filter");
    if (importanceFilter) {
      importanceFilter.addEventListener("change", (e) => {
        this.currentImportanceFilter = e.target.value;
        this.applyFilters();
      });
    }

    // Set up view controls
    document.querySelectorAll(".view-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".view-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentView = btn.dataset.view;
        this.updateView();
      });
    });

    // Add keyboard shortcut for search focus (Ctrl+F)
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        searchInput?.focus();
      }
    });
  }

  // Update search UI elements - Show/hide clear button based on search state
  updateSearchUI() {
    const clearBtn = document.querySelector(".clear-search-btn");
    if (clearBtn) {
      clearBtn.style.display = this.searchTerm ? "flex" : "none";
    }
  }

  // Execute timeline search - Apply search filters and highlight results
  searchTimeline() {
    const searchInput = document.getElementById("timeline-search");
    if (searchInput) {
      this.searchTerm = searchInput.value.toLowerCase();
      this.applyFilters();

      // Highlight and expand search results if search term exists
      if (this.searchTerm) {
        this.highlightSearchResults();
        this.expandSearchResults();
      }
    }
  }

  // Clear search functionality - Reset search state and UI
  clearSearch() {
    const searchInput = document.getElementById("timeline-search");
    if (searchInput) {
      searchInput.value = "";
      this.searchTerm = "";
      this.applyFilters();
      this.clearHighlights();
      this.updateSearchUI();
    }
  }

  highlightSearchResults() {
    this.clearHighlights();

    if (!this.searchTerm) return;

    this.events.forEach((event) => {
      if (event.searchText.includes(this.searchTerm)) {
        this.highlightTextInElement(event.element, this.searchTerm);
      }
    });
  }

  highlightTextInElement(element, searchTerm) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false,
    );

    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }

    textNodes.forEach((textNode) => {
      const text = textNode.textContent;
      const regex = new RegExp(`(${searchTerm})`, "gi");
      if (regex.test(text)) {
        const highlightedText = text.replace(
          regex,
          '<span class="search-highlight">$1</span>',
        );
        const wrapper = document.createElement("span");
        wrapper.innerHTML = highlightedText;
        textNode.parentNode.replaceChild(wrapper, textNode);
      }
    });
  }

  clearHighlights() {
    document.querySelectorAll(".search-highlight").forEach((highlight) => {
      const parent = highlight.parentNode;
      parent.replaceChild(
        document.createTextNode(highlight.textContent),
        highlight,
      );
      parent.normalize();
    });
  }

  expandSearchResults() {
    if (!this.searchTerm) return;

    this.events.forEach((event) => {
      if (event.searchText.includes(this.searchTerm)) {
        const arc = event.element.closest(".timeline-arc");
        const eventElement = event.element;

        if (arc && !arc.classList.contains("expanded")) {
          const arcHeader = arc.querySelector(".arc-header");
          if (arcHeader) {
            window.toggleArcSimple(arcHeader);
          }
        }

        if (!eventElement.classList.contains("expanded")) {
          window.toggleEvent(eventElement);
        }
      }
    });
  }

  applyFilters() {
    const timelineYears = document.querySelectorAll(".timeline-year");
    let visibleCount = 0;

    timelineYears.forEach((year) => {
      const events = year.querySelectorAll(".timeline-event");
      let hasMatchingEvents = false;
      const yearEra = year.dataset.era;

      // Check era filter
      if (this.currentEraFilter !== "all" && yearEra !== this.currentEraFilter) {
        year.style.display = "none";
        return;
      }

      // Check search and importance filters
      if (!this.searchTerm && this.currentImportanceFilter === "all") {
        hasMatchingEvents = true;
      } else {
        events.forEach((event) => {
          const eventData = this.events.find((e) => e.element === event);
          if (eventData) {
            let matchesSearch = !this.searchTerm || eventData.searchText.includes(this.searchTerm);
            let matchesImportance = this.currentImportanceFilter === "all" ||
                                  event.dataset.importance === this.currentImportanceFilter;

            if (matchesSearch && matchesImportance) {
              hasMatchingEvents = true;
              event.style.display = "block";
            } else {
              event.style.display = "none";
            }
          }
        });
      }

      if (hasMatchingEvents) {
        year.style.display = "block";
        year.style.animation = "fadeInUp 0.5s ease-out";
        visibleCount++;
      } else {
        year.style.display = "none";
      }
    });

    this.showNoResultsMessage(visibleCount === 0);
    this.updateStatistics();
  }

  updateView() {
    const container = document.querySelector(".timeline-container");
    if (this.currentView === "compact") {
      container.classList.add("compact-view");
    } else {
      container.classList.remove("compact-view");
    }
  }

  updateStatistics() {
    const visibleYears = document.querySelectorAll(".timeline-year[style*='display: block'], .timeline-year:not([style*='display: none'])").length;
    const visibleArcs = document.querySelectorAll(".timeline-year[style*='display: block'] .timeline-arc, .timeline-year:not([style*='display: none']) .timeline-arc").length;
    const visibleEvents = document.querySelectorAll(".timeline-year[style*='display: block'] .timeline-event[style*='display: block'], .timeline-year:not([style*='display: none']) .timeline-event:not([style*='display: none'])").length;
    const visibleCharacters = new Set();

    document.querySelectorAll(".timeline-year[style*='display: block'] .character-link, .timeline-year:not([style*='display: none']) .character-link").forEach(link => {
      const name = link.querySelector("span")?.textContent;
      if (name) visibleCharacters.add(name);
    });

    document.getElementById("years-count").textContent = visibleYears;
    document.getElementById("arcs-count").textContent = visibleArcs;
    document.getElementById("events-count").textContent = visibleEvents;
    document.getElementById("characters-count").textContent = visibleCharacters.size;
  }



  showNoResultsMessage(show) {
    let noResultsDiv = document.querySelector(".no-results");

    if (show && !noResultsDiv) {
      noResultsDiv = document.createElement("div");
      noResultsDiv.className = "no-results";
      noResultsDiv.innerHTML = `
                <div class="no-results-icon">🔍</div>
                <div class="no-results-text">No events found</div>
                <div class="no-results-hint">Try adjusting your search terms or filters</div>
            `;
      document.querySelector(".timeline-container").appendChild(noResultsDiv);
    } else if (!show && noResultsDiv) {
      noResultsDiv.remove();
    }
  }





  initializeTooltips() {
    document.querySelectorAll(".character-link").forEach((link) => {
      link.addEventListener("mouseenter", (e) => {
        this.showCharacterTooltip(e.target, e);
      });

      link.addEventListener("mouseleave", () => {
        this.hideCharacterTooltip();
      });
    });
  }

  showCharacterTooltip(element, event) {
    const characterName = element.querySelector("span")?.textContent;
    if (!characterName) return;

    const tooltip = document.createElement("div");
    tooltip.className = "character-tooltip";
    tooltip.innerHTML = `
            <div class="tooltip-name">${characterName}</div>
            <div class="tooltip-hint">Click to view character details</div>
        `;

    document.body.appendChild(tooltip);

    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - 10}px`;
    tooltip.style.transform = "translate(-50%, -100%)";

    this.currentTooltip = tooltip;
  }

  hideCharacterTooltip() {
    if (this.currentTooltip) {
      this.currentTooltip.remove();
      this.currentTooltip = null;
    }
  }
}
window.toggleArcSimple = function (arcHeader) {
  try {
    const arc = arcHeader.closest(".timeline-arc");
    const content = arc.querySelector(".arc-content");
    const toggle = arcHeader.querySelector(".arc-toggle");

    if (!arc || !content) {
      console.error("Missing required elements");
      return;
    }

    const isExpanded = arc.classList.toggle("expanded");

    content.style.cssText = "";
    content.classList.remove("force-expanded", "force-collapsed");

    if (isExpanded) {
      content.classList.add("force-expanded");
      if (toggle) toggle.textContent = "▲";

      requestAnimationFrame(() => {
        content.style.maxHeight = content.scrollHeight + "px";
        content.style.opacity = "1";
        content.style.overflow = "visible";
      });
    } else {
      content.classList.add("force-collapsed");
      if (toggle) toggle.textContent = "▼";

      const currentHeight = content.scrollHeight;
      content.style.maxHeight = currentHeight + "px";

      requestAnimationFrame(() => {
        content.style.maxHeight = "0px";
        content.style.opacity = "0";
        content.style.overflow = "hidden";
      });
    }

    arcHeader.style.backgroundColor = "rgba(77, 212, 255, 0.3)";
    setTimeout(() => {
      arcHeader.style.backgroundColor = "";
    }, 200);

    if (
      typeof soundEnabled !== "undefined" &&
      soundEnabled &&
      window.SoundFeedback
    ) {
      window.SoundFeedback.playEffect("click");
    }
  } catch (error) {
    console.error("Error in toggleArcSimple:", error);
  }
};
window.toggleEvent = function (eventElement) {
  try {
    const content = eventElement.querySelector(".event-content");
    const expandHint = eventElement.querySelector(".event-expand-hint");

    if (!content) return;

    const isExpanded = eventElement.classList.toggle("expanded");

    content.style.cssText = "";

    if (isExpanded) {
      if (expandHint) expandHint.textContent = "Click to collapse";

      requestAnimationFrame(() => {
        content.style.maxHeight = content.scrollHeight + "px";
        content.style.opacity = "1";
        content.style.padding = "0 2rem 2rem 2rem";
      });
    } else {
      if (expandHint) expandHint.textContent = "Click to expand";

      const currentHeight = content.scrollHeight;
      content.style.maxHeight = currentHeight + "px";

      requestAnimationFrame(() => {
        content.style.maxHeight = "0px";
        content.style.opacity = "0";
        content.style.padding = "0 2rem";
      });
    }
    if (
      typeof soundEnabled !== "undefined" &&
      soundEnabled &&
      window.SoundFeedback
    ) {
      window.SoundFeedback.playEffect("click");
    }
  } catch (error) {
    console.error("Error in toggleEvent:", error);
  }
};
// Mobile Navigation Functions
function toggleMobileMenu() {
  const toggle = document.querySelector(".mobile-menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const body = document.body;
  const html = document.documentElement;

  if (!toggle || !mobileNav) return;

  const isActive = toggle.classList.contains("active");

  if (isActive) {
    // Close menu
    toggle.classList.remove("active");
    mobileNav.classList.remove("active");
    body.classList.remove("mobile-nav-active");
    html.classList.remove("mobile-nav-active");
    body.style.overflow = "";
    body.style.position = "";
    body.style.width = "";
    body.style.height = "";
    body.style.touchAction = "";
  } else {
    // Open menu
    toggle.classList.add("active");
    mobileNav.classList.add("active");
    body.classList.add("mobile-nav-active");
    html.classList.add("mobile-nav-active");
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.width = "100%";
    body.style.height = "100%";
    body.style.touchAction = "none";
  }

  // Play sound effect if available
  if (typeof soundEnabled !== "undefined" && soundEnabled && window.SoundFeedback) {
    window.SoundFeedback.playEffect("click");
  }
}

// Close mobile menu when clicking on nav links
function closeMobileMenuOnNavClick() {
  const mobileNavLinks = document.querySelectorAll(".mobile-nav a");

  mobileNavLinks.forEach(link => {
    link.addEventListener("click", () => {
      const toggle = document.querySelector(".mobile-menu-toggle");
      const mobileNav = document.getElementById("mobile-nav");

      if (toggle && toggle.classList.contains("active")) {
        toggleMobileMenu();
      }
    });
  });
}

// Handle mobile menu close on escape key
function handleMobileMenuEscape(e) {
  if (e.key === "Escape") {
    const mobileNav = document.getElementById("mobile-nav");
    if (mobileNav && mobileNav.classList.contains("active")) {
      toggleMobileMenu();
    }
  }
}

// Handle mobile menu close on outside click
function handleMobileMenuOutsideClick(e) {
  const mobileNav = document.getElementById("mobile-nav");
  const toggle = document.querySelector(".mobile-menu-toggle");

  if (mobileNav && mobileNav.classList.contains("active")) {
    // Check if click is outside the mobile nav and not on the toggle button
    if (!mobileNav.contains(e.target) && !toggle.contains(e.target)) {
      toggleMobileMenu();
    }
  }
}

// Prevent scrolling when mobile menu is open
function preventScrollWhenMenuOpen() {
  const mobileNav = document.getElementById("mobile-nav");

  if (mobileNav && mobileNav.classList.contains("active")) {
    return false;
  }
  return true;
}

// Handle viewport height changes (mobile browser address bar)
function handleViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Initialize mobile navigation
function initializeMobileNavigation() {
  // Set up viewport height
  handleViewportHeight();
  window.addEventListener('resize', handleViewportHeight);
  window.addEventListener('orientationchange', () => {
    setTimeout(handleViewportHeight, 100);
  });

  // Set up event listeners
  document.addEventListener("keydown", handleMobileMenuEscape);
  document.addEventListener("click", handleMobileMenuOutsideClick);

  // Close menu on nav link clicks
  closeMobileMenuOnNavClick();

  // Prevent body scroll when menu is open
  document.addEventListener('touchmove', (e) => {
    const mobileNav = document.getElementById("mobile-nav");
    if (mobileNav && mobileNav.classList.contains("active")) {
      if (!mobileNav.contains(e.target)) {
        e.preventDefault();
      }
    }
  }, { passive: false });

  // Handle swipe to close on mobile
  let touchStartY = 0;
  let touchStartX = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
  });

  document.addEventListener('touchend', (e) => {
    const mobileNav = document.getElementById("mobile-nav");
    if (!mobileNav || !mobileNav.classList.contains("active")) return;

    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaY = touchStartY - touchEndY;
    const deltaX = touchStartX - touchEndX;

    // Swipe up to close (deltaY > 50 means swipe up)
    if (deltaY > 50 && Math.abs(deltaX) < 100) {
      toggleMobileMenu();
    }
  });
}
// Enhanced scroll to top with smooth behavior
function scrollToTop() {
  const isMobile = window.innerWidth <= 767;

  window.scrollTo({
    top: 0,
    behavior: isMobile ? "auto" : "smooth", // Use auto on mobile for better performance
  });

  if (typeof soundEnabled !== "undefined" && soundEnabled && window.SoundFeedback) {
    window.SoundFeedback.playEffect("click");
  }
}

// Expand all timeline arcs
function expandAllArcs() {
  const arcs = document.querySelectorAll(".timeline-arc");
  arcs.forEach(arc => {
    if (!arc.classList.contains("expanded")) {
      const arcHeader = arc.querySelector(".arc-header");
      if (arcHeader) {
        window.toggleArcSimple(arcHeader);
      }
    }
  });
}

// Collapse all timeline arcs
function collapseAllArcs() {
  const arcs = document.querySelectorAll(".timeline-arc");
  arcs.forEach(arc => {
    if (arc.classList.contains("expanded")) {
      const arcHeader = arc.querySelector(".arc-header");
      if (arcHeader) {
        window.toggleArcSimple(arcHeader);
      }
    }
  });
}



function initializeArcs() {
  const arcs = document.querySelectorAll(".timeline-arc");

  arcs.forEach((arc, index) => {
    const content = arc.querySelector(".arc-content");
    const toggle = arc.querySelector(".arc-toggle");

    if (content) {
      arc.classList.remove("expanded");
      content.classList.remove("force-expanded");
      content.classList.add("force-collapsed");

      content.style.cssText = `
                max-height: 0px !important;
                opacity: 0 !important;
                overflow: hidden !important;
                transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease !important;
            `;

      if (toggle) {
        toggle.textContent = "▼";
      }
    } else {
      console.warn(`Arc ${index + 1} missing content element`);
    }
  });
}
// Enhanced scroll handling with mobile optimizations
let scrollTimeout;
let ticking = false;

function updateScrollElements() {
  const nav = document.getElementById("main-nav");
  const progress = document.getElementById("nav-progress");
  const timelineProgress = document.getElementById("timeline-progress-bar");
  const fab = document.getElementById("timeline-fab");

  if (nav) {
    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }

  const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

  if (progress) {
    progress.style.width = scrollPercent + "%";
    progress.classList.toggle("visible", scrollPercent > 0);
  }

  if (timelineProgress) {
    timelineProgress.style.width = scrollPercent + "%";
  }

  if (fab) {
    fab.classList.toggle("hidden", window.scrollY < 300);
  }

  ticking = false;
}

function requestScrollUpdate() {
  if (!ticking) {
    requestAnimationFrame(updateScrollElements);
    ticking = true;
  }
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
// Enhanced keyboard navigation with mobile considerations
document.addEventListener("keydown", (e) => {
  // Alt + number shortcuts for navigation
  if (e.altKey) {
    switch (e.key) {
      case "1":
        e.preventDefault();
        window.location.href = "overview.html";
        break;
      case "2":
        e.preventDefault();
        window.location.href = "codex.html";
        break;
      case "3":
        e.preventDefault();
        window.location.href = "skills.html";
        break;
      case "4":
        e.preventDefault();
        window.location.href = "Chronicle.html";
        break;
      case "5":
        e.preventDefault();
        window.location.href = "records.html";
        break;
      case "h":
        e.preventDefault();
        window.location.href = "index.html";
        break;
    }
  }

  // Handle escape key for mobile menu
  if (e.key === "Escape") {
    const mobileNav = document.getElementById("mobile-nav");
    if (mobileNav && mobileNav.classList.contains("active")) {
      toggleMobileMenu();
    }
  }

  // Handle space bar for scroll (desktop only)
  if (e.key === " " && !e.target.matches('input, textarea, select')) {
    const isMobile = window.innerWidth <= 767;
    if (!isMobile) {
      e.preventDefault();
      window.scrollBy(0, window.innerHeight * 0.8);
    }
  }
});
// Export functions to global scope
window.toggleMobileMenu = toggleMobileMenu;
window.scrollToTop = scrollToTop;
window.initializeMobileNavigation = initializeMobileNavigation;
window.expandAllArcs = expandAllArcs;
window.collapseAllArcs = collapseAllArcs;
window.testArcExpansion = function () {
  const firstArc = document.querySelector(".timeline-arc");
  if (firstArc) {
    const arcHeader = firstArc.querySelector(".arc-header");
    const arcContent = firstArc.querySelector(".arc-content");

    if (arcContent) {
      const computedStyles = window.getComputedStyle(arcContent);
    }

    if (arcHeader) {
      window.toggleArcSimple(arcHeader);
    }
  }
};
// Enhanced DOMContentLoaded with mobile optimizations
document.addEventListener("DOMContentLoaded", () => {
  // Initialize core functionality
  initializeArcs();
  initializeMobileNavigation();
  window.timelineManager = new TimelineManager();

  // Set body padding for fixed navbar
  const isMobile = window.innerWidth <= 767;
  document.body.style.paddingTop = isMobile ? "70px" : "80px";

  // Ensure timeline visibility
  const timelineContainer = document.querySelector(".timeline-container");
  const timelineYears = document.querySelectorAll(".timeline-year");

  if (timelineContainer) {
    timelineContainer.style.display = "block";
    timelineContainer.style.visibility = "visible";
  }

  timelineYears.forEach((year, index) => {
    year.style.display = "block";
    year.style.opacity = "1";
    year.style.transform = "translateY(0)";
  });

  // Handle mobile nav link clicks
  document.querySelectorAll(".mobile-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      toggleMobileMenu();
    });
  });

  // Optimize for mobile performance
  if (isMobile) {
    // Disable heavy animations on mobile
    document.body.classList.add("mobile-optimized");

    // Reduce animation complexity
    const style = document.createElement('style');
    style.textContent = `
      .mobile-optimized * {
        animation-duration: 0.2s !important;
        transition-duration: 0.2s !important;
      }
      .mobile-optimized .magic-circle,
      .mobile-optimized .particles,
      .mobile-optimized .starfield {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Handle orientation changes
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      // Recalculate viewport height
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);

      // Close mobile menu if open
      const mobileNav = document.getElementById("mobile-nav");
      if (mobileNav && mobileNav.classList.contains("active")) {
        toggleMobileMenu();
      }
    }, 100);
  });

  // Add touch event handling for better mobile interaction
  let touchStartTime = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartTime = Date.now();
  });

  document.addEventListener('touchend', (e) => {
    const touchDuration = Date.now() - touchStartTime;

    // If it's a quick tap (less than 200ms), treat as click
    if (touchDuration < 200) {
      const target = e.target.closest('.arc-header, .event-header');
      if (target) {
        // Add visual feedback for touch
        target.style.backgroundColor = 'rgba(77, 212, 255, 0.3)';
        setTimeout(() => {
          target.style.backgroundColor = '';
        }, 150);
      }
    }
  });
});
// End of Chronicle.js - Timeline management with search, filtering, and mobile navigation
