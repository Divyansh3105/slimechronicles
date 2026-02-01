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
    this.isInitialized = false;

    // Initialize timeline functionality
    this.init();
  }

  // Initialize timeline manager - Set up caching, event listeners, and tooltips
  init() {
    this.cacheEvents();
    this.setupEventListeners();
    this.initializeTooltips();
    this.updateStatistics();
    this.handleURLParameters();
    this.initializeEnhancements();
    this.isInitialized = true;
  }

  // Initialize UI enhancements
  initializeEnhancements() {
    this.addScrollAnimations();
    this.addKeyboardShortcuts();
    this.addProgressIndicator();
    this.addSmoothScrolling();
  }

  // Add scroll-based animations
  addScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    document.querySelectorAll('.timeline-year, .timeline-arc').forEach(el => {
      observer.observe(el);
    });
  }

  // Add keyboard shortcuts
  addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Only handle shortcuts when not typing in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      switch(e.key.toLowerCase()) {
        case '/':
          e.preventDefault();
          document.getElementById('timeline-search')?.focus();
          break;
        case 'e':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            this.expandAllArcs();
          }
          break;
        case 'r':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            this.collapseAllArcs();
          }
          break;
        case 'escape':
          this.clearSearch();
          break;
      }
    });
  }

  // Add progress indicator
  addProgressIndicator() {
    const progressBar = document.getElementById('timeline-progress-bar');
    if (!progressBar) return;

    const updateProgress = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      progressBar.style.width = Math.min(100, Math.max(0, scrollPercent)) + '%';
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // Add smooth scrolling behavior
  addSmoothScrolling() {
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
  }

  // Enhanced expand all arcs functionality
  expandAllArcs() {
    const arcs = document.querySelectorAll(".timeline-arc");
    let delay = 0;

    arcs.forEach((arc, index) => {
      if (!arc.classList.contains("expanded")) {
        setTimeout(() => {
          const arcHeader = arc.querySelector(".arc-header");
          if (arcHeader) {
            window.toggleArcSimple(arcHeader);
            // Add visual feedback
            arc.style.transform = 'scale(1.02)';
            setTimeout(() => {
              arc.style.transform = '';
            }, 200);
          }
        }, delay);
        delay += 100; // Stagger the animations
      }
    });

    // Show notification
    this.showNotification('All arcs expanded', 'success');
  }

  // Enhanced collapse all arcs functionality
  collapseAllArcs() {
    const arcs = document.querySelectorAll(".timeline-arc");
    let delay = 0;

    arcs.forEach((arc, index) => {
      if (arc.classList.contains("expanded")) {
        setTimeout(() => {
          const arcHeader = arc.querySelector(".arc-header");
          if (arcHeader) {
            window.toggleArcSimple(arcHeader);
          }
        }, delay);
        delay += 50; // Faster collapse
      }
    });

    // Show notification
    this.showNotification('All arcs collapsed', 'info');
  }

  // Show notification system
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `timeline-notification timeline-notification--${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="ri-information-line"></i>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
      notification.classList.add('show');
    });

    // Remove after delay
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 2000);
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

    // Batch DOM operations to reduce reflows
    const updates = [];

    timelineYears.forEach((year) => {
      const events = year.querySelectorAll(".timeline-event");
      let hasMatchingEvents = false;
      const yearEra = year.dataset.era;

      // Check era filter
      if (this.currentEraFilter !== "all" && yearEra !== this.currentEraFilter) {
        updates.push({ element: year, display: "none" });
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
              updates.push({ element: event, display: "block" });
            } else {
              updates.push({ element: event, display: "none" });
            }
          }
        });
      }

      if (hasMatchingEvents) {
        updates.push({
          element: year,
          display: "block",
          animation: "fadeInUp 0.5s ease-out"
        });
        visibleCount++;
      } else {
        updates.push({ element: year, display: "none" });
      }
    });

    // Apply all DOM updates in a single batch
    requestAnimationFrame(() => {
      updates.forEach(update => {
        update.element.style.display = update.display;
        if (update.animation) {
          update.element.style.animation = update.animation;
        }
      });
    });

    this.showNoResultsMessage(visibleCount === 0);

    // Defer statistics update to avoid blocking
    requestAnimationFrame(() => {
      this.updateStatistics();
    });
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

  // Handle URL parameters to automatically navigate to specific events or arcs
  handleURLParameters() {
    const eventParam = window.getURLParameter ?
      window.getURLParameter('event') :
      new URLSearchParams(window.location.search).get('event');

    if (eventParam) {
      // Map event parameters to arc titles for navigation
      const eventToArcMap = {
        'Falmuth_War': 'Falmuth Incident Arc',
        'Demon_Lord_Awakening': 'Falmuth Incident Arc',
        'Walpurgis': 'Walpurgis Arc',
        'Eastern_Empire': 'Eastern Empire Arc',
        'True_Dragon': 'True Dragon Arc',
        'Labyrinth': 'Labyrinth Arc',
        'Tenma_War': 'Tenma War Arc',
        'Saint_Monster_Confrontation': 'Saint-Monster Confrontation Arc',
        'Michael_Arc': 'Michael Arc',
        'Phantom_King': 'Phantom King Arc',
        'Ivarage_Arc': 'Ivarage Arc',
        'Epilogue_Arc': 'Epilogue Arc',
        'Orc_Disaster': 'Orc Disaster Arc',
        'Reincarnation': 'Reincarnation Arc'
      };

      const targetArcTitle = eventToArcMap[eventParam];

      if (targetArcTitle) {
        // Find and expand the target arc
        setTimeout(() => {
          const arcs = document.querySelectorAll('.timeline-arc');
          let targetArc = null;

          // First try to find by data-event attribute
          targetArc = document.querySelector(`[data-event="${eventParam}"]`);

          // If not found, search by arc title
          if (!targetArc) {
            arcs.forEach(arc => {
              const arcTitle = arc.querySelector('.arc-title');
              if (arcTitle && arcTitle.textContent.trim() === targetArcTitle) {
                targetArc = arc;
              }
            });
          }

          if (targetArc) {
            // Expand the arc if it's not already expanded
            if (!targetArc.classList.contains('expanded')) {
              const arcHeader = targetArc.querySelector('.arc-header');
              if (arcHeader) {
                window.toggleArcSimple(arcHeader);
              }
            }

            // Scroll to the arc with a slight delay to ensure expansion animation completes
            setTimeout(() => {
              targetArc.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
              });

              // Add a visual highlight effect
              targetArc.style.boxShadow = '0 0 20px rgba(77, 212, 255, 0.6)';
              setTimeout(() => {
                targetArc.style.boxShadow = '';
              }, 3000);
            }, 500);
          }
        }, 100);
      }
    }
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

    // Position tooltip using transform to avoid layout calculations
    tooltip.style.cssText = `
      position: absolute;
      visibility: hidden;
      transform: translate(-50%, -100%);
    `;

    document.body.appendChild(tooltip);

    // Use getBoundingClientRect only once and cache the result
    requestAnimationFrame(() => {
      const rect = element.getBoundingClientRect();
      tooltip.style.left = `${rect.left + rect.width / 2}px`;
      tooltip.style.top = `${rect.top - 10}px`;
      tooltip.style.visibility = "visible";
    });

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

    // Reset styles
    content.style.cssText = "";
    content.classList.remove("force-expanded", "force-collapsed");

    if (isExpanded) {
      content.classList.add("force-expanded");
      if (toggle) toggle.textContent = "▲";

      // Use CSS transitions instead of measuring scrollHeight
      requestAnimationFrame(() => {
        content.style.maxHeight = "none";
        content.style.opacity = "1";
        content.style.overflow = "visible";
      });
    } else {
      content.classList.add("force-collapsed");
      if (toggle) toggle.textContent = "▼";

      // Use CSS transitions for collapse
      requestAnimationFrame(() => {
        content.style.maxHeight = "0px";
        content.style.opacity = "0";
        content.style.overflow = "hidden";
      });
    }

    // Visual feedback
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

    // Reset styles
    content.style.cssText = "";

    if (isExpanded) {
      if (expandHint) expandHint.textContent = "Click to collapse";

      // Use CSS transitions instead of measuring scrollHeight
      requestAnimationFrame(() => {
        content.style.maxHeight = "none";
        content.style.opacity = "1";
        content.style.padding = "0 2rem 2rem 2rem";
      });
    } else {
      if (expandHint) expandHint.textContent = "Click to expand";

      // Use CSS transitions for collapse
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
// Expand all timeline arcs with enhanced animations
function expandAllArcs() {
  if (window.timelineManager && window.timelineManager.isInitialized) {
    window.timelineManager.expandAllArcs();
    return;
  }

  const arcs = document.querySelectorAll(".timeline-arc");
  let delay = 0;

  arcs.forEach((arc, index) => {
    if (!arc.classList.contains("expanded")) {
      setTimeout(() => {
        const arcHeader = arc.querySelector(".arc-header");
        if (arcHeader) {
          window.toggleArcSimple(arcHeader);
          // Add visual feedback
          arc.style.transform = 'scale(1.02)';
          setTimeout(() => {
            arc.style.transform = '';
          }, 200);
        }
      }, delay);
      delay += 100; // Stagger the animations
    }
  });
}

// Collapse all timeline arcs with enhanced animations
function collapseAllArcs() {
  if (window.timelineManager && window.timelineManager.isInitialized) {
    window.timelineManager.collapseAllArcs();
    return;
  }

  const arcs = document.querySelectorAll(".timeline-arc");
  let delay = 0;

  arcs.forEach((arc, index) => {
    if (arc.classList.contains("expanded")) {
      setTimeout(() => {
        const arcHeader = arc.querySelector(".arc-header");
        if (arcHeader) {
          window.toggleArcSimple(arcHeader);
        }
      }, delay);
      delay += 50; // Faster collapse
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
// Timeline-specific scroll handling with performance optimization
let ticking = false;
let cachedScrollHeight = null;
let cachedInnerHeight = null;

// Cache DOM elements to avoid repeated queries
const scrollElements = {
  timelineProgress: null,
  fab: null,
  initialized: false
};

function initScrollElements() {
  if (!scrollElements.initialized) {
    scrollElements.timelineProgress = document.getElementById("timeline-progress-bar");
    scrollElements.fab = document.getElementById("timeline-fab");
    scrollElements.initialized = true;
  }
}

function updateTimelineScrollElements() {
  // Cache viewport dimensions to avoid repeated calculations
  if (!cachedScrollHeight || !cachedInnerHeight) {
    cachedScrollHeight = document.documentElement.scrollHeight;
    cachedInnerHeight = window.innerHeight;
  }

  const scrollPercent = (window.scrollY / (cachedScrollHeight - cachedInnerHeight)) * 100;

  // Batch DOM updates
  if (scrollElements.timelineProgress) {
    scrollElements.timelineProgress.style.width = scrollPercent + "%";
  }

  if (scrollElements.fab) {
    scrollElements.fab.classList.toggle("hidden", window.scrollY < 300);
  }

  ticking = false;
}

function requestTimelineScrollUpdate() {
  if (!ticking) {
    requestAnimationFrame(updateTimelineScrollElements);
    ticking = true;
  }
}

// Use throttle function from shared.js with initialization check
const throttledScrollUpdate = (() => {
  let initialized = false;
  let throttledFn = null;

  return function() {
    if (!initialized) {
      if (window.throttle) {
        throttledFn = window.throttle(() => {
          cachedScrollHeight = document.documentElement.scrollHeight;
          cachedInnerHeight = window.innerHeight;
          requestTimelineScrollUpdate();
        }, 16);
        initialized = true;
      } else {
        // Fallback throttle implementation
        let lastTime = 0;
        throttledFn = () => {
          const now = Date.now();
          if (now - lastTime >= 16) { // ~60fps
            lastTime = now;
            cachedScrollHeight = document.documentElement.scrollHeight;
            cachedInnerHeight = window.innerHeight;
            requestTimelineScrollUpdate();
          }
        };
        initialized = true;
      }
    }

    if (throttledFn) {
      throttledFn();
    }
  };
})();

window.addEventListener("scroll", throttledScrollUpdate, { passive: true });
// Timeline-specific keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Timeline-specific shortcuts
  if (e.ctrlKey || e.metaKey) {
    switch (e.key.toLowerCase()) {
      case 'e':
        e.preventDefault();
        expandAllArcs();
        break;
      case 'r':
        e.preventDefault();
        collapseAllArcs();
        break;
    }
  }
});
// Timeline progression and navigation functionality
let timelineProgressionState = {
  currentEra: 0,
  isPlaying: false,
  playInterval: null,
  eras: ['founding', 'expansion', 'demon-lord', 'imperial', 'dragon', 'cosmic', 'transcendence', 'final']
};

// Toggle timeline progress navigation
function toggleProgressNav() {
  const nav = document.getElementById('timeline-progress-nav');
  if (nav) {
    nav.classList.toggle('collapsed');
    const toggle = nav.querySelector('.progress-nav-toggle i');
    if (toggle) {
      toggle.className = nav.classList.contains('collapsed') ?
        'ri-timeline-view' : 'ri-timeline-view';
    }
  }
}

// Navigate to specific year/era
function navigateToEra(era, year) {
  const targetYear = document.getElementById(`year-${year}`);
  if (targetYear) {
    targetYear.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    // Update progress navigation
    updateProgressNavigation(era);

    // Expand the target year's arcs
    setTimeout(() => {
      const arcs = targetYear.querySelectorAll('.timeline-arc');
      arcs.forEach(arc => {
        if (!arc.classList.contains('expanded')) {
          const arcHeader = arc.querySelector('.arc-header');
          if (arcHeader) {
            window.toggleArcSimple(arcHeader);
          }
        }
      });
    }, 500);
  }
}

// Update progress navigation indicators
function updateProgressNavigation(currentEra) {
  const markers = document.querySelectorAll('.progress-marker');
  const indicator = document.getElementById('progress-nav-indicator');
  const floatingProgress = document.getElementById('floating-timeline-progress');
  const currentEraYear = document.getElementById('current-era-year');
  const currentEraName = document.getElementById('current-era-name');
  const progressBarFill = document.getElementById('progress-bar-fill');

  markers.forEach((marker, index) => {
    const markerEra = marker.dataset.era;
    marker.classList.remove('active', 'completed');

    if (markerEra === currentEra) {
      marker.classList.add('active');
      if (indicator) {
        const progress = ((index + 1) / markers.length) * 100;
        indicator.style.width = `${progress}%`;
      }

      // Update floating progress indicator
      if (floatingProgress && currentEraYear && currentEraName && progressBarFill) {
        floatingProgress.classList.add('visible');
        currentEraYear.textContent = marker.dataset.year;
        currentEraName.textContent = getEraDisplayName(currentEra);
        progressBarFill.style.width = `${((index + 1) / markers.length) * 100}%`;
      }
    } else if (timelineProgressionState.eras.indexOf(markerEra) < timelineProgressionState.eras.indexOf(currentEra)) {
      marker.classList.add('completed');
    }
  });
}

// Get display name for era
function getEraDisplayName(era) {
  const eraNames = {
    'founding': 'Founding Era',
    'expansion': 'Expansion Era',
    'demon-lord': 'Demon Lord Era',
    'imperial': 'Imperial Era',
    'dragon': 'Dragon Era',
    'cosmic': 'Cosmic Era',
    'transcendence': 'Transcendence Era',
    'final': 'Final Era'
  };
  return eraNames[era] || era;
}

// Play timeline progression animation
function playTimelineProgression() {
  if (timelineProgressionState.isPlaying) {
    stopTimelineProgression();
    return;
  }

  timelineProgressionState.isPlaying = true;
  timelineProgressionState.currentEra = 0;

  const playBtn = document.querySelector('.progression-btn[onclick="playTimelineProgression()"]');
  if (playBtn) {
    playBtn.innerHTML = '<i class="ri-pause-fill"></i> Pause';
  }

  // Reset progression
  resetTimelineProgression();

  // Start progression animation
  timelineProgressionState.playInterval = setInterval(() => {
    if (timelineProgressionState.currentEra < timelineProgressionState.eras.length) {
      const era = timelineProgressionState.eras[timelineProgressionState.currentEra];
      const year = 2013 + timelineProgressionState.currentEra;

      // Update progression fill
      updateProgressionFill();

      // Update era nodes
      updateEraNodes();

      // Navigate to era
      navigateToEra(era, year);

      timelineProgressionState.currentEra++;
    } else {
      stopTimelineProgression();
    }
  }, 3000); // 3 seconds per era
}

// Stop timeline progression
function stopTimelineProgression() {
  timelineProgressionState.isPlaying = false;

  if (timelineProgressionState.playInterval) {
    clearInterval(timelineProgressionState.playInterval);
    timelineProgressionState.playInterval = null;
  }

  const playBtn = document.querySelector('.progression-btn[onclick="playTimelineProgression()"]');
  if (playBtn) {
    playBtn.innerHTML = '<i class="ri-play-fill"></i> Play Progression';
  }
}

// Reset timeline progression
function resetTimelineProgression() {
  stopTimelineProgression();
  timelineProgressionState.currentEra = 0;

  // Reset progression fill
  const progressionFill = document.getElementById('progression-fill');
  if (progressionFill) {
    progressionFill.style.width = '0%';
  }

  // Reset era nodes
  const eraNodes = document.querySelectorAll('.era-node');
  eraNodes.forEach(node => {
    node.classList.remove('completed', 'current');
  });

  // Reset progress navigation
  const markers = document.querySelectorAll('.progress-marker');
  const indicator = document.getElementById('progress-nav-indicator');
  const floatingProgress = document.getElementById('floating-timeline-progress');

  markers.forEach(marker => {
    marker.classList.remove('active', 'completed');
  });

  if (indicator) {
    indicator.style.width = '0%';
  }

  if (floatingProgress) {
    floatingProgress.classList.remove('visible');
  }
}

// Update progression fill bar
function updateProgressionFill() {
  const progressionFill = document.getElementById('progression-fill');
  if (progressionFill) {
    const progress = (timelineProgressionState.currentEra / timelineProgressionState.eras.length) * 100;
    progressionFill.style.width = `${progress}%`;
  }
}

// Update era nodes visual state
function updateEraNodes() {
  const eraNodes = document.querySelectorAll('.era-node');

  eraNodes.forEach((node, index) => {
    node.classList.remove('completed', 'current');

    if (index < timelineProgressionState.currentEra) {
      node.classList.add('completed');
    } else if (index === timelineProgressionState.currentEra) {
      node.classList.add('current');
    }
  });
}

// Initialize timeline progression on scroll
function initializeTimelineProgression() {
  // Add click handlers to progress markers
  const markers = document.querySelectorAll('.progress-marker');
  markers.forEach(marker => {
    marker.addEventListener('click', () => {
      const era = marker.dataset.era;
      const year = marker.dataset.year;
      navigateToEra(era, year);
    });
  });

  // Add click handlers to era nodes
  const eraNodes = document.querySelectorAll('.era-node');
  eraNodes.forEach(node => {
    node.addEventListener('click', () => {
      const era = node.dataset.era;
      const year = node.dataset.year;
      navigateToEra(era, year);
    });
  });

  // Initialize scroll-based progression updates
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const yearElement = entry.target;
        const era = yearElement.dataset.era;
        if (era && !timelineProgressionState.isPlaying) {
          updateProgressNavigation(era);

          // Update progression state based on visible era
          const eraIndex = timelineProgressionState.eras.indexOf(era);
          if (eraIndex !== -1) {
            timelineProgressionState.currentEra = eraIndex;
            updateProgressionFill();
            updateEraNodes();
          }
        }
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-100px 0px -100px 0px'
  });

  // Observe all timeline years
  document.querySelectorAll('.timeline-year').forEach(year => {
    observer.observe(year);
  });
}

window.testArcExpansion = function () {
  const firstArc = document.querySelector(".timeline-arc");
  if (firstArc) {
    const arcHeader = firstArc.querySelector(".arc-header");

    if (arcHeader) {
      window.toggleArcSimple(arcHeader);
    }
  }
};
// Timeline-specific DOMContentLoaded initialization
document.addEventListener("DOMContentLoaded", () => {
  // Wait for shared.js functions to be available
  const initializeTimeline = () => {
    if (!window.isMobileDevice || !window.debounce || !window.throttle || !window.getURLParameter) {
      // If shared.js functions aren't ready, wait a bit more
      setTimeout(initializeTimeline, 50);
      return;
    }

    // Initialize timeline-specific functionality
    initializeArcs();
    window.timelineManager = new TimelineManager();

    // Initialize timeline progression features
    initializeTimelineProgression();

    // Initialize scroll elements cache
    initScrollElements();

    // Timeline-specific mobile optimizations
    const isMobile = window.isMobileDevice();
    if (isMobile) {
      // Disable heavy timeline animations on mobile
      document.body.classList.add("timeline-mobile-optimized");

      // Reduce timeline animation complexity
      const style = document.createElement('style');
      style.textContent = `
        .timeline-mobile-optimized .timeline-event {
          animation-duration: 0.2s !important;
          transition-duration: 0.2s !important;
        }
        .timeline-mobile-optimized .magic-circle,
        .timeline-mobile-optimized .particles,
        .timeline-mobile-optimized .starfield {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Timeline-specific touch handling with debouncing
    let touchStartTime = 0;
    const debouncedTouchFeedback = window.debounce((target) => {
      target.style.backgroundColor = 'rgba(77, 212, 255, 0.3)';
      setTimeout(() => {
        target.style.backgroundColor = '';
      }, 150);
    }, 10);

    document.addEventListener('touchstart', (e) => {
      touchStartTime = Date.now();
    });

    document.addEventListener('touchend', (e) => {
      const touchDuration = Date.now() - touchStartTime;

      // Quick tap feedback for timeline elements
      if (touchDuration < 200) {
        const target = e.target.closest('.arc-header, .event-header');
        if (target) {
          debouncedTouchFeedback(target);
        }
      }
    });
  };

  // Start initialization
  initializeTimeline();
});

// Export timeline progression functions to global scope
window.toggleProgressNav = toggleProgressNav;
window.navigateToEra = navigateToEra;
window.playTimelineProgression = playTimelineProgression;
window.resetTimelineProgression = resetTimelineProgression;
