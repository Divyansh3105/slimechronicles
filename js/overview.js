// Jura Tempest Federation statistics - Comprehensive federation data and metrics
const JURA_TEMPEST_STATS = {
  // Population breakdown by category
  population: {
    total: 480000,
    breakdown: {
      citizens: 320000,
      government: 105000,
      administrators: 35000,
      specialists: 20000,
    },
  },
  // Defense force composition and readiness
  defense: {
    totalPersonnel: 105000,
    composition: {
      leadership: 12,
      specialForces: 8500,
      regularForces: 85000,
      reserves: 11500,
    },
    classification: "Advanced Defense Force",
    readinessLevel: 98,
  },
  // Economic indicators and sector breakdown
  economy: {
    classification: "Advanced Economy",
    breakdown: {
      trade: 85,
      manufacturing: 92,
      infrastructure: 88,
      innovation: 95,
    },
    gdpEquivalent: "2.4T Gold",
    growthRate: 12.5,
  },
  // Technology development and innovation metrics
  technology: {
    level: "Highly Advanced",
    classification: "Leading Innovation Center",
    sectors: {
      research: 45,
      development: 35,
      implementation: 15,
      education: 5,
    },
    innovationIndex: 96,
  },
};

// Month abbreviations for date formatting
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Event log storage for activity tracking
const eventLog = [];

// Update statistic display with animated number transition - Set new value with smooth counting animation
function setStat(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  const current = parseInt(el.textContent.replace(/,/g, "")) || 0;
  // Use shared animateNumber function
  if (window.animateNumber) {
    window.animateNumber(el, current, value);
  } else {
    el.textContent = value.toLocaleString();
  }
}

// Update main overview statistics and create detailed breakdowns - Main initialization function for overview page
function updateOverview() {
  setStat("population-value", JURA_TEMPEST_STATS.population.total);
  setStat("military-value", JURA_TEMPEST_STATS.defense.totalPersonnel);

  const economyEl = document.getElementById("economy-value");
  const techEl = document.getElementById("technology-value");

  if (economyEl) {
    economyEl.textContent = JURA_TEMPEST_STATS.economy.classification;
  } else {
    console.error("Economy element not found!");
  }

  if (techEl) {
    techEl.textContent = JURA_TEMPEST_STATS.technology.level;
  } else {
    console.error("Technology element not found!");
  }

  // Create detailed breakdown visualizations for each stat category
  try {
    createPopulationBreakdown();
    createDefenseBreakdown();
    createEconomyBreakdown();
    createTechnologyBreakdown();
  } catch (error) {
    console.error("Error creating breakdowns:", error);
  }
}

// Create population distribution visualization - Generate breakdown chart for population categories
function createPopulationBreakdown() {
  const card = document.getElementById("population-card");

  if (!card) {
    console.error("Population card not found!");
    return;
  }

  const breakdown = JURA_TEMPEST_STATS.population.breakdown;

  // Remove existing breakdown to prevent duplicates
  const existingBreakdown = card.querySelector(".stat-breakdown");
  if (existingBreakdown) {
    existingBreakdown.remove();
  }

  const breakdownDiv = document.createElement("div");
  breakdownDiv.className = "stat-breakdown";
  breakdownDiv.innerHTML = `
    <div class="breakdown-title">Population Distribution</div>
    <div class="breakdown-items">
      <div class="breakdown-item">
        <span class="breakdown-label">Citizens</span>
        <span class="breakdown-value">${breakdown.citizens.toLocaleString()}</span>
        <div class="breakdown-bar">
          <div class="breakdown-fill" style="width: ${(breakdown.citizens / JURA_TEMPEST_STATS.population.total) * 100}%"></div>
        </div>
      </div>
      <div class="breakdown-item">
        <span class="breakdown-label">Government</span>
        <span class="breakdown-value">${breakdown.government.toLocaleString()}</span>
        <div class="breakdown-bar">
          <div class="breakdown-fill" style="width: ${(breakdown.government / JURA_TEMPEST_STATS.population.total) * 100}%"></div>
        </div>
      </div>
      <div class="breakdown-item">
        <span class="breakdown-label">Administrators</span>
        <span class="breakdown-value">${breakdown.administrators.toLocaleString()}</span>
        <div class="breakdown-bar">
          <div class="breakdown-fill" style="width: ${(breakdown.administrators / JURA_TEMPEST_STATS.population.total) * 100}%"></div>
        </div>
      </div>
      <div class="breakdown-item">
        <span class="breakdown-label">Specialists</span>
        <span class="breakdown-value">${breakdown.specialists.toLocaleString()}</span>
        <div class="breakdown-bar">
          <div class="breakdown-fill" style="width: ${(breakdown.specialists / JURA_TEMPEST_STATS.population.total) * 100}%"></div>
        </div>
      </div>
    </div>
  `;

  card.appendChild(breakdownDiv);
}

// Create defense force structure visualization - Generate breakdown chart for military composition
function createDefenseBreakdown() {
  const card = document.getElementById("military-card");
  if (!card) {
    console.error("Military card not found!");
    return;
  }

  const defense = JURA_TEMPEST_STATS.defense;
  // Remove existing breakdown to prevent duplicates
  const existingBreakdown = card.querySelector(".stat-breakdown");
  if (existingBreakdown) existingBreakdown.remove();

  const breakdownDiv = document.createElement("div");
  breakdownDiv.className = "stat-breakdown";
  breakdownDiv.innerHTML = `
    <div class="breakdown-title">Defense Force Structure</div>
    <div class="breakdown-items">
      <div class="breakdown-item">
        <span class="breakdown-label">Leadership</span>
        <span class="breakdown-value">${defense.composition.leadership}</span>
        <div class="breakdown-bar">
          <div class="breakdown-fill" style="width: 100%"></div>
        </div>
      </div>
      <div class="breakdown-item">
        <span class="breakdown-label">Special Forces</span>
        <span class="breakdown-value">${defense.composition.specialForces.toLocaleString()}</span>
        <div class="breakdown-bar">
          <div class="breakdown-fill" style="width: ${(defense.composition.specialForces / defense.totalPersonnel) * 100}%"></div>
        </div>
      </div>
      <div class="breakdown-item">
        <span class="breakdown-label">Regular Forces</span>
        <span class="breakdown-value">${defense.composition.regularForces.toLocaleString()}</span>
        <div class="breakdown-bar">
          <div class="breakdown-fill" style="width: ${(defense.composition.regularForces / defense.totalPersonnel) * 100}%"></div>
        </div>
      </div>
      <div class="breakdown-item">
        <span class="breakdown-label">Reserves</span>
        <span class="breakdown-value">${defense.composition.reserves.toLocaleString()}</span>
        <div class="breakdown-bar">
          <div class="breakdown-fill" style="width: ${(defense.composition.reserves / defense.totalPersonnel) * 100}%"></div>
        </div>
      </div>
    </div>
    <div class="strategic-metrics">
      <div class="metric-item">
        <span class="metric-label">Classification</span>
        <span class="metric-value">${defense.classification}</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Readiness Level</span>
        <span class="metric-value">${defense.readinessLevel}%</span>
      </div>
    </div>
  `;
  card.appendChild(breakdownDiv);
}

// Create economic sector performance visualization - Generate breakdown chart for economy metrics
function createEconomyBreakdown() {
  const card = document.getElementById("economy-card");

  if (!card) {
    console.error("Economy card not found!");
    return;
  }

  const economy = JURA_TEMPEST_STATS.economy;
  // Remove existing breakdown to prevent duplicates
  const existingBreakdown = card.querySelector(".stat-breakdown");
  if (existingBreakdown) existingBreakdown.remove();

  const breakdownDiv = document.createElement("div");
  breakdownDiv.className = "stat-breakdown";
  breakdownDiv.innerHTML = `
    <div class="breakdown-title">Economic Sectors</div>
    <div class="breakdown-items">
      <div class="breakdown-item">
        <span class="breakdown-label">Trade</span>
        <span class="breakdown-value">${economy.breakdown.trade}%</span>
        <div class="breakdown-bar">
          <div class="breakdown-fill" style="width: ${economy.breakdown.trade}%"></div>
        </div>
      </div>
      <div class="breakdown-item">
        <span class="breakdown-label">Manufacturing</span>
        <span class="breakdown-value">${economy.breakdown.manufacturing}%</span>
        <div class="breakdown-bar">
          <div class="breakdown-fill" style="width: ${economy.breakdown.manufacturing}%"></div>
        </div>
      </div>
      <div class="breakdown-item">
        <span class="breakdown-label">Infrastructure</span>
        <span class="breakdown-value">${economy.breakdown.infrastructure}%</span>
        <div class="breakdown-bar">
          <div class="breakdown-fill" style="width: ${economy.breakdown.infrastructure}%"></div>
        </div>
      </div>
      <div class="breakdown-item">
        <span class="breakdown-label">Innovation</span>
        <span class="breakdown-value">${economy.breakdown.innovation}%</span>
        <div class="breakdown-bar">
          <div class="breakdown-fill" style="width: ${economy.breakdown.innovation}%"></div>
        </div>
      </div>
    </div>
    <div class="strategic-metrics">
      <div class="metric-item">
        <span class="metric-label">GDP Equivalent</span>
        <span class="metric-value">${economy.gdpEquivalent}</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Growth Rate</span>
        <span class="metric-value">+${economy.growthRate}%</span>
      </div>
    </div>
  `;
  card.appendChild(breakdownDiv);
}

// Create technology sector distribution visualization - Generate breakdown chart for tech categories
function createTechnologyBreakdown() {
  const card = document.getElementById("technology-card");

  if (!card) {
    console.error("Technology card not found!");
    return;
  }

  const technology = JURA_TEMPEST_STATS.technology;
  // Remove existing breakdown to prevent duplicates
  const existingBreakdown = card.querySelector(".stat-breakdown");
  if (existingBreakdown) existingBreakdown.remove();

  const breakdownDiv = document.createElement("div");
  breakdownDiv.className = "stat-breakdown";
  breakdownDiv.innerHTML = `
    <div class="breakdown-title">Technology Sectors</div>
    <div class="breakdown-items">
      <div class="breakdown-item">
        <span class="breakdown-label">Research</span>
        <span class="breakdown-value">${technology.sectors.research}%</span>
        <div class="breakdown-bar">
          <div class="breakdown-fill" style="width: ${technology.sectors.research}%"></div>
        </div>
      </div>
      <div class="breakdown-item">
        <span class="breakdown-label">Development</span>
        <span class="breakdown-value">${technology.sectors.development}%</span>
        <div class="breakdown-bar">
          <div class="breakdown-fill" style="width: ${technology.sectors.development}%"></div>
        </div>
      </div>
      <div class="breakdown-item">
        <span class="breakdown-label">Implementation</span>
        <span class="breakdown-value">${technology.sectors.implementation}%</span>
        <div class="breakdown-bar">
          <div class="breakdown-fill" style="width: ${technology.sectors.implementation}%"></div>
        </div>
      </div>
      <div class="breakdown-item">
        <span class="breakdown-label">Education</span>
        <span class="breakdown-value">${technology.sectors.education}%</span>
        <div class="breakdown-bar">
          <div class="breakdown-fill" style="width: ${technology.sectors.education}%"></div>
        </div>
      </div>
    </div>
    <div class="strategic-metrics">
      <div class="metric-item">
        <span class="metric-label">Classification</span>
        <span class="metric-value">${technology.classification}</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Innovation Index</span>
        <span class="metric-value">${technology.innovationIndex}%</span>
      </div>
    </div>
  `;
  card.appendChild(breakdownDiv);
}

// Add new event to activity log - Insert event at beginning of log with timestamp
function addEvent(icon, text) {
  eventLog.unshift({ icon, text, time: "Just now" });
  if (eventLog.length > 8) eventLog.pop(); // Maintain maximum of 8 events
}

// Render event log to DOM - Display recent events in activity feed
function renderEventLog() {
  const list = document.getElementById("event-list");
  if (!list) return;
  list.innerHTML = eventLog
    .map(
      (e) => `
    <div class="event-item">
      <div class="event-icon">${e.icon}</div>
      <div class="event-text">${e.text}</div>
      <div class="event-time">${e.time}</div>
    </div>
  `,
    )
    .join("");
}
// Initialize interactive elements with hover and click effects - Set up user interaction handlers
function initInteractiveElements() {
  const supportsHover = window.matchMedia("(hover: hover)").matches;

  // Enhanced stat card interactions with staggered animations
  document.querySelectorAll(".stat-card").forEach((el, index) => {
    // Add staggered animation delay for visual appeal
    el.style.animationDelay = `${index * 0.2}s`;

    // Add hover effects for devices that support hover
    if (supportsHover) {
      el.addEventListener("mouseenter", () => {
        if (window.SoundFeedback) {
          window.SoundFeedback.playEffect("hover");
        }
        // Add subtle glow effect on hover
        el.style.filter = "drop-shadow(0 0 25px rgba(77, 212, 255, 0.4))";

        // Add ripple effect on hover
        createHoverRipple(el);
      });

      el.addEventListener("mouseleave", () => {
        el.style.filter = "";
      });
    }

    // Enhanced click interaction with ripple effect and sound feedback
    el.addEventListener("click", (event) => {
      if (window.SoundFeedback) {
        window.SoundFeedback.playEffect("click");
      }

      // Create ripple effect at click position using shared function
      if (window.createRippleEffect) {
        window.createRippleEffect(el, event);
      }

      // Add click animation
      el.style.transform = "scale(0.98)";
      setTimeout(() => {
        el.style.transform = "";
      }, 150);

      // Trigger detailed view (placeholder for future functionality)
      showCardDetails(el.id);
    });

    // Keyboard accessibility support for stat cards
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        el.click();
      }
    });
  });

  // Enhanced pillar card interactions
  document.querySelectorAll(".pillar-card").forEach((pillar, index) => {
    pillar.style.animationDelay = `${index * 0.1}s`;

    if (supportsHover) {
      pillar.addEventListener("mouseenter", () => {
        if (window.SoundFeedback) {
          window.SoundFeedback.playEffect("hover");
        }

        // Add dynamic glow based on pillar type
        const pillarType = pillar.getAttribute("data-pillar");
        addPillarGlow(pillar, pillarType);
      });

      pillar.addEventListener("mouseleave", () => {
        removePillarGlow(pillar);
      });
    }

    pillar.addEventListener("click", (e) => {
      if (window.SoundFeedback) {
        window.SoundFeedback.playEffect("click");
      }

      // Add click feedback
      pillar.style.transform = "scale(0.97)";
      setTimeout(() => {
        pillar.style.transform = "";
      }, 200);
    });
  });

  // Enhanced key figure card interactions
  document.querySelectorAll(".key-figure-card").forEach((figure, index) => {
    figure.style.animationDelay = `${index * 0.15}s`;

    if (supportsHover) {
      figure.addEventListener("mouseenter", () => {
        if (window.SoundFeedback) {
          window.SoundFeedback.playEffect("hover");
        }

        // Add role-specific glow
        const roleClass = Array.from(figure.classList).find(cls =>
          ['supreme', 'military', 'enforcement', 'diplomacy'].includes(cls)
        );
        addRoleGlow(figure, roleClass);
      });

      figure.addEventListener("mouseleave", () => {
        removeRoleGlow(figure);
      });
    }
  });

  // Enhanced state card interactions with hover and click effects
  document.querySelectorAll(".state-card").forEach((el) => {
    if (supportsHover) {
      el.addEventListener("mouseenter", () => {
        if (window.SoundFeedback) {
          window.SoundFeedback.playEffect("hover");
        }

        // Add breathing animation
        el.style.animation = "cardBreathe 2s ease-in-out infinite";
      });

      el.addEventListener("mouseleave", () => {
        el.style.animation = "";
      });
    }

    el.addEventListener("click", (event) => {
      if (window.SoundFeedback) {
        window.SoundFeedback.playEffect("click");
      }
      if (window.createRippleEffect) {
        window.createRippleEffect(el, event);
      }
    });
  });

  // Enhanced badge interactions with hover and click effects
  document.querySelectorAll(".badge").forEach((badge, index) => {
    badge.style.animationDelay = `${index * 0.1}s`;

    if (supportsHover) {
      badge.addEventListener("mouseenter", () => {
        if (window.SoundFeedback) {
          window.SoundFeedback.playEffect("hover");
        }

        // Add magnetic effect
        badge.style.transform = "translateY(-2px) scale(1.02)";
      });

      badge.addEventListener("mouseleave", () => {
        badge.style.transform = "";
      });
    }

    badge.addEventListener("click", (e) => {
      if (window.SoundFeedback) {
        window.SoundFeedback.playEffect("click");
      }

      if (window.createRippleEffect) {
        window.createRippleEffect(badge, e);
      }
      showBadgeInfo(badge);
    });

    // Keyboard accessibility support for badges
    badge.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        badge.click();
      }
    });
  });

  // Enhanced number cards interactions with hover and click effects
  document.querySelectorAll(".number-card").forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;

    if (supportsHover) {
      card.addEventListener("mouseenter", () => {
        if (window.SoundFeedback) {
          window.SoundFeedback.playEffect("hover");
        }

        // Add category-specific effects
        addNumberCardEffect(card);
      });

      card.addEventListener("mouseleave", () => {
        removeNumberCardEffect(card);
      });
    }

    card.addEventListener("click", (e) => {
      if (window.SoundFeedback) {
        window.SoundFeedback.playEffect("click");
      }

      if (window.createRippleEffect) {
        window.createRippleEffect(card, e);
      }
      showNumberCardDetails(card);
    });

    // Keyboard accessibility support for number cards
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Enhanced federation emblem interaction with click animation
  const federationEmblem = document.querySelector(".federation-emblem");
  if (federationEmblem) {
    federationEmblem.addEventListener("click", () => {
      if (window.SoundFeedback) {
        window.SoundFeedback.playEffect("click");
      }

      const emblemCore = federationEmblem.querySelector(".emblem-core");

      // Enhanced scale animation for emblem interaction
      emblemCore.style.transform = "scale(1.1) rotate(5deg)";
      emblemCore.style.filter = "brightness(1.2) drop-shadow(0 0 30px var(--accent-gold))";

      setTimeout(() => {
        emblemCore.style.transform = "";
        emblemCore.style.filter = "";
      }, 300);
    });

    // Keyboard accessibility support for federation emblem
    federationEmblem.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        federationEmblem.click();
      }
    });
  }
}

// Show detailed view for stat card - Placeholder function for future detailed statistics modal
function showCardDetails(cardId) {
  const card = document.getElementById(cardId);
  if (card) {
    card.style.transform = "scale(1.05)";
    setTimeout(() => {
      card.style.transform = "";
    }, 200);
  }
}

// Show number card detailed information - Display additional metrics for number cards
function showNumberCardDetails(card) {
  const category = card.querySelector(".number-category").textContent;
  // Simplified visual feedback with icon animation
  const icon = card.querySelector(".number-icon");

  // Simple scale animation for visual feedback
  icon.style.transform = "scale(1.2)";

  setTimeout(() => {
    icon.style.transform = "";
  }, 300);
}

// Show badge information tooltip - Display detailed information about achievement badges
function showBadgeInfo(badge) {
  // Placeholder for badge information display
  const badgeText = badge.querySelector("span:last-child").textContent;
  badge.style.transform = "scale(1.1)";
  setTimeout(() => {
    badge.style.transform = "";
  }, 200);
}
// Initialize mobile-specific optimizations - Configure mobile device performance and behavior
function initMobileOptimizations() {
  // Use shared mobile device detection function
  const isMobile = window.isMobileDevice ? window.isMobileDevice() : false;

  if (isMobile) {
    // Reduce animation duration for better mobile performance
    document.documentElement.style.setProperty("--animation-duration", "0.3s");

    // Add mobile device class for CSS targeting
    document.body.classList.add("mobile-device");

    // Enable passive touch event listeners for better scroll performance
    document.addEventListener("touchstart", function () {}, { passive: true });
    document.addEventListener("touchmove", function () {}, { passive: true });

    // Viewport height handling is already managed by shared.js
  }
}
// Initialize intersection observer for scroll animations - Set up viewport-based animation triggers
function initIntersectionObserver() {
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("mobile-animate");
            observer.unobserve(entry.target); // Stop observing once animated
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      },
    );

    // Observe elements for scroll-triggered animations
    document
      .querySelectorAll(".stat-card, .state-card, .analytics-section")
      .forEach((el) => {
        observer.observe(el);
      });
  }
}

// DOM content loaded event handler - Initialize page components in optimized sequence
document.addEventListener("DOMContentLoaded", () => {
  // Enhanced loading sequence with smooth fade-in animation
  document.body.style.opacity = "0";
  document.body.style.transform = "translateY(20px)";

  // Preload critical resources before showing content
  preloadCriticalResources();

  setTimeout(() => {
    document.body.style.transition = "all 0.6s ease-out";
    document.body.style.opacity = "1";
    document.body.transform = "translateY(0)";
  }, 100);

  // Initialize mobile optimizations first for better mobile experience
  initMobileOptimizations();

  // Staggered initialization for better performance and user experience
  setTimeout(() => {
    updateOverview();
  }, 200);

  setTimeout(() => {
    initInteractiveElements();
  }, 600);

  setTimeout(() => {
    initIntersectionObserver();
    initPerformanceOptimizations();
  }, 800);
});

// Preload critical resources for faster page rendering - Load essential assets before content display
function preloadCriticalResources() {
  // Preload federation background image for immediate display
  const img = new Image();
  img.src = "assets/federation.jpg";

  // Preload custom fonts if font loading API is available
  if ("fonts" in document) {
    document.fonts.load("1rem Cinzel");
    document.fonts.load("1rem Rajdhani");
  }
}

// Initialize performance optimizations for various device capabilities - Configure animations and features based on device performance
function initPerformanceOptimizations() {
  // Throttle scroll events for better performance using shared throttle function
  const throttledScrollUpdate = window.throttle
    ? window.throttle(() => {
        updateScrollProgress();
      }, 16)
    : updateScrollProgress;

  window.addEventListener("scroll", throttledScrollUpdate, { passive: true });

  // Optimize animations for low-end devices based on CPU cores
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.documentElement.style.setProperty("--animation-duration", "0.1s");
    // Disable complex animations on low-end devices
    document.documentElement.classList.add("reduced-animations");
  }

  // Respect user's motion preferences for accessibility
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.style.setProperty("--animation-duration", "0.01s");
    document.documentElement.classList.add("reduced-animations");
  }

  // Apply mobile-specific optimizations for touch devices using shared function
  if (window.isMobileDevice && window.isMobileDevice()) {
    document.documentElement.classList.add("mobile-optimized");
  }
}

// Update scroll progress indicator - Display reading progress in navigation bar
function updateScrollProgress() {
  const scrolled = window.pageYOffset;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrolled / maxScroll) * 100;

  const progressBar = document.getElementById("nav-progress");
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
    progressBar.classList.toggle("visible", scrolled > 100); // Show after scrolling 100px
  }
}

// Enhanced error handling for overview page - Log and handle JavaScript errors gracefully
window.addEventListener("error", (e) => {
  console.error("Overview page error:", e.error);
  // Could implement user-friendly error reporting here
});

// Enhanced visibility change handling for performance optimization - Pause/resume animations based on tab visibility
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // Pause animations when tab is not visible to save resources
    document
      .querySelectorAll(".stat-card, .emblem-core, .ring")
      .forEach((el) => {
        el.style.animationPlayState = "paused";
      });
  } else {
    // Resume animations when tab becomes visible
    document
      .querySelectorAll(".stat-card, .emblem-core, .ring")
      .forEach((el) => {
        el.style.animationPlayState = "running";
      });
  }
});

// Make functions globally available for external access - Export key functions to window object
window.updateOverview = updateOverview;

// Enhanced interaction helper functions
function createHoverRipple(element) {
  const ripple = document.createElement('div');
  ripple.className = 'hover-ripple';
  ripple.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: radial-gradient(circle, rgba(77, 212, 255, 0.3), transparent);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    animation: hoverRipple 0.6s ease-out;
    z-index: 1;
  `;

  element.style.position = 'relative';
  element.appendChild(ripple);

  setTimeout(() => {
    if (ripple.parentNode) {
      ripple.parentNode.removeChild(ripple);
    }
  }, 600);
}

function addPillarGlow(pillar, pillarType) {
  const glowColors = {
    protection: 'rgba(77, 212, 255, 0.4)',
    merit: 'rgba(255, 215, 0, 0.4)',
    unity: 'rgba(0, 255, 136, 0.4)',
    law: 'rgba(170, 85, 255, 0.4)',
    growth: 'rgba(255, 51, 102, 0.4)'
  };

  const color = glowColors[pillarType] || 'rgba(77, 212, 255, 0.4)';
  pillar.style.boxShadow = `0 0 30px ${color}, 0 20px 50px rgba(0, 0, 0, 0.3)`;
}

function removePillarGlow(pillar) {
  pillar.style.boxShadow = '';
}

function addRoleGlow(figure, roleClass) {
  const roleColors = {
    supreme: 'rgba(255, 215, 0, 0.4)',
    military: 'rgba(255, 87, 87, 0.4)',
    enforcement: 'rgba(170, 85, 255, 0.4)',
    diplomacy: 'rgba(0, 255, 136, 0.4)'
  };

  const color = roleColors[roleClass] || 'rgba(77, 212, 255, 0.4)';
  figure.style.boxShadow = `0 0 25px ${color}, 0 25px 55px rgba(0, 0, 0, 0.5)`;
}

function removeRoleGlow(figure) {
  figure.style.boxShadow = '';
}

function addNumberCardEffect(card) {
  const cardType = card.classList.contains('anime-card') ? 'anime' :
                   card.classList.contains('novel-card') ? 'novel' :
                   card.classList.contains('revenue-card') ? 'revenue' : 'default';

  const effects = {
    anime: 'rgba(77, 212, 255, 0.3)',
    novel: 'rgba(0, 255, 136, 0.3)',
    revenue: 'rgba(255, 215, 0, 0.3)',
    default: 'rgba(77, 212, 255, 0.3)'
  };

  const color = effects[cardType];
  card.style.boxShadow = `0 0 30px ${color}, 0 20px 55px rgba(0, 0, 0, 0.35)`;
  card.style.transform = 'translateY(-6px) scale(1.02)';
}

function removeNumberCardEffect(card) {
  card.style.boxShadow = '';
  card.style.transform = '';
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes hoverRipple {
    0% {
      width: 0;
      height: 0;
      opacity: 1;
    }
    100% {
      width: 200px;
      height: 200px;
      opacity: 0;
    }
  }

  @keyframes cardBreathe {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.01);
    }
  }
`;
document.head.appendChild(style);
