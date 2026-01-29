// Jura Tempest Federation statistics - Comprehensive federation data and metrics
const JURA_TEMPEST_STATS = {
  // Population breakdown by category
  population: {
    total: 480000,
    breakdown: {
      citizens: 320000,
      government: 105000,
      administrators: 35000,
      specialists: 20000
    }
  },
  // Defense force composition and readiness
  defense: {
    totalPersonnel: 105000,
    composition: {
      leadership: 12,
      specialForces: 8500,
      regularForces: 85000,
      reserves: 11500
    },
    classification: "Advanced Defense Force",
    readinessLevel: 98
  },
  // Economic indicators and sector breakdown
  economy: {
    classification: "Advanced Economy",
    breakdown: {
      trade: 85,
      manufacturing: 92,
      infrastructure: 88,
      innovation: 95
    },
    gdpEquivalent: "2.4T Gold",
    growthRate: 12.5
  },
  // Technology development and innovation metrics
  technology: {
    level: "Highly Advanced",
    classification: "Leading Innovation Center",
    sectors: {
      research: 45,
      development: 35,
      implementation: 15,
      education: 5
    },
    innovationIndex: 96
  }
};

// Month abbreviations for date formatting
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Event log storage for activity tracking
const eventLog = [];

// Animate number transitions - Smooth number counting animation
function animateNumber(el, from, to, duration = 700) {
  const start = performance.now();

  // Animation frame function for smooth counting
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // Cubic easing
    const value = Math.floor(from + (to - from) * eased);
    el.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Update statistic display with animated number transition - Set new value with smooth counting animation
function setStat(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  const current = parseInt(el.textContent.replace(/,/g, "")) || 0;
  animateNumber(el, current, value);
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
  const existingBreakdown = card.querySelector('.stat-breakdown');
  if (existingBreakdown) {
    existingBreakdown.remove();
  }

  const breakdownDiv = document.createElement('div');
  breakdownDiv.className = 'stat-breakdown';
  breakdownDiv.innerHTML = `
    <div class="breakdown-title">Population Distribution</div>
    <div class="breakdown-items">
      <div class="breakdown-item">
        <span class="breakdown-label">Citizens</span>
        <span class="breakdown-value">${breakdown.citizens.toLocaleString()}</span>
        <div class="breakdown-bar">
          <div class="breakdown-fill" style="width: ${(breakdown.citizens / JURA_TEMPEST_STATS.population.total * 100)}%"></div>
        </div>
      </div>
      <div class="breakdown-item">
        <span class="breakdown-label">Government</span>
        <span class="breakdown-value">${breakdown.government.toLocaleString()}</span>
        <div class="breakdown-bar">
          <div class="breakdown-fill" style="width: ${(breakdown.government / JURA_TEMPEST_STATS.population.total * 100)}%"></div>
        </div>
      </div>
      <div class="breakdown-item">
        <span class="breakdown-label">Administrators</span>
        <span class="breakdown-value">${breakdown.administrators.toLocaleString()}</span>
        <div class="breakdown-bar">
          <div class="breakdown-fill" style="width: ${(breakdown.administrators / JURA_TEMPEST_STATS.population.total * 100)}%"></div>
        </div>
      </div>
      <div class="breakdown-item">
        <span class="breakdown-label">Specialists</span>
        <span class="breakdown-value">${breakdown.specialists.toLocaleString()}</span>
        <div class="breakdown-bar">
          <div class="breakdown-fill" style="width: ${(breakdown.specialists / JURA_TEMPEST_STATS.population.total * 100)}%"></div>
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
  const existingBreakdown = card.querySelector('.stat-breakdown');
  if (existingBreakdown) existingBreakdown.remove();

  const breakdownDiv = document.createElement('div');
  breakdownDiv.className = 'stat-breakdown';
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
          <div class="breakdown-fill" style="width: ${(defense.composition.specialForces / defense.totalPersonnel * 100)}%"></div>
        </div>
      </div>
      <div class="breakdown-item">
        <span class="breakdown-label">Regular Forces</span>
        <span class="breakdown-value">${defense.composition.regularForces.toLocaleString()}</span>
        <div class="breakdown-bar">
          <div class="breakdown-fill" style="width: ${(defense.composition.regularForces / defense.totalPersonnel * 100)}%"></div>
        </div>
      </div>
      <div class="breakdown-item">
        <span class="breakdown-label">Reserves</span>
        <span class="breakdown-value">${defense.composition.reserves.toLocaleString()}</span>
        <div class="breakdown-bar">
          <div class="breakdown-fill" style="width: ${(defense.composition.reserves / defense.totalPersonnel * 100)}%"></div>
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
  const existingBreakdown = card.querySelector('.stat-breakdown');
  if (existingBreakdown) existingBreakdown.remove();

  const breakdownDiv = document.createElement('div');
  breakdownDiv.className = 'stat-breakdown';
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
  const existingBreakdown = card.querySelector('.stat-breakdown');
  if (existingBreakdown) existingBreakdown.remove();

  const breakdownDiv = document.createElement('div');
  breakdownDiv.className = 'stat-breakdown';
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
  const supportsHover = window.matchMedia('(hover: hover)').matches;

  // Enhanced stat card interactions with staggered animations
  document.querySelectorAll('.stat-card').forEach((el, index) => {
    // Add staggered animation delay for visual appeal
    el.style.animationDelay = `${index * 0.1}s`;

    // Add hover effects for devices that support hover
    if (supportsHover) {
      el.addEventListener('mouseenter', () => {
        if (window.SoundFeedback) {
          window.SoundFeedback.playEffect('hover');
        }
        // Add subtle glow effect on hover
        el.style.filter = 'drop-shadow(0 0 20px rgba(77, 212, 255, 0.3))';
      });

      el.addEventListener('mouseleave', () => {
        el.style.filter = '';
      });
    }

    // Enhanced click interaction with ripple effect and sound feedback
    el.addEventListener('click', (event) => {
      if (window.SoundFeedback) {
        window.SoundFeedback.playEffect('click');
      }

      // Create ripple effect at click position
      createRippleEffect(el, event);

      // Trigger detailed view (placeholder for future functionality)
      showCardDetails(el.id);
    });

    // Keyboard accessibility support for stat cards
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });
  });

  // Enhanced state card interactions with hover and click effects
  document.querySelectorAll('.state-card').forEach(el => {
    if (supportsHover) {
      el.addEventListener('mouseenter', () => {
        if (window.SoundFeedback) {
          window.SoundFeedback.playEffect('hover');
        }
      });
    }

    el.addEventListener('click', (event) => {
      if (window.SoundFeedback) {
        window.SoundFeedback.playEffect('click');
      }
      createRippleEffect(el, event);
    });
  });

  // Enhanced strength category interactions with click feedback
  document.querySelectorAll('.strength-category').forEach(el => {
    el.addEventListener('click', () => {
      if (window.SoundFeedback) {
        window.SoundFeedback.playEffect('click');
      }

      // Smooth scale animation for visual feedback
      el.style.transform = 'scale(0.98)';
      setTimeout(() => {
        el.style.transform = '';
      }, 150);
    });
  });

  // Enhanced badge interactions with hover and click effects
  document.querySelectorAll('.badge').forEach(badge => {
    if (supportsHover) {
      badge.addEventListener('mouseenter', () => {
        if (window.SoundFeedback) {
          window.SoundFeedback.playEffect('hover');
        }
      });
    }

    badge.addEventListener('click', (e) => {
      if (window.SoundFeedback) {
        window.SoundFeedback.playEffect('click');
      }

      createRippleEffect(badge, e);
      showBadgeInfo(badge);
    });

    // Keyboard accessibility support for badges
    badge.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        badge.click();
      }
    });
  });

  // Enhanced number cards interactions with hover and click effects
  document.querySelectorAll('.number-card').forEach(card => {
    if (supportsHover) {
      card.addEventListener('mouseenter', () => {
        if (window.SoundFeedback) {
          window.SoundFeedback.playEffect('hover');
        }
      });
    }

    card.addEventListener('click', (e) => {
      if (window.SoundFeedback) {
        window.SoundFeedback.playEffect('click');
      }

      createRippleEffect(card, e);
      showNumberCardDetails(card);
    });

    // Keyboard accessibility support for number cards
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Enhanced federation emblem interaction with click animation
  const federationEmblem = document.querySelector('.federation-emblem');
  if (federationEmblem) {
    federationEmblem.addEventListener('click', () => {
      if (window.SoundFeedback) {
        window.SoundFeedback.playEffect('click');
      }

      const emblemCore = federationEmblem.querySelector('.emblem-core');

      // Simple scale animation for emblem interaction
      emblemCore.style.transform = 'scale(1.05)';

      setTimeout(() => {
        emblemCore.style.transform = '';
      }, 200);
    });

    // Keyboard accessibility support for federation emblem
    federationEmblem.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        federationEmblem.click();
      }
    });
  }
}

// Create visual ripple effect on element click - Generate expanding circle animation at click position
function createRippleEffect(element, event) {
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background: rgba(77, 212, 255, 0.3);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
    z-index: 100;
  `;

  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event ? event.clientX - rect.left : rect.width / 2;
  const y = event ? event.clientY - rect.top : rect.height / 2;

  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (x - size / 2) + 'px';
  ripple.style.top = (y - size / 2) + 'px';

  element.style.position = 'relative';
  element.appendChild(ripple);

  // Add ripple animation keyframes if not already present
  if (!document.querySelector('#ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Remove ripple element after animation completes
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Show detailed view for stat card - Placeholder function for future detailed statistics modal
function showCardDetails(cardId) {
  // Placeholder for detailed view functionality
  console.log(`Showing details for ${cardId}`);

  // Future: Could open a modal with detailed statistics
  // For now, just add a subtle visual feedback
  const card = document.getElementById(cardId);
  if (card) {
    card.style.transform = 'scale(1.05)';
    setTimeout(() => {
      card.style.transform = '';
    }, 200);
  }
}

// Show number card detailed information - Display additional metrics for number cards
function showNumberCardDetails(card) {
  const category = card.querySelector('.number-category').textContent;
  console.log(`Number card details: ${category}`);

  // Simplified visual feedback with icon animation
  const icon = card.querySelector('.number-icon');

  // Simple scale animation for visual feedback
  icon.style.transform = 'scale(1.2)';

  setTimeout(() => {
    icon.style.transform = '';
  }, 300);
}

// Show badge information tooltip - Display detailed information about achievement badges
function showBadgeInfo(badge) {
  // Placeholder for badge information display
  const badgeText = badge.querySelector('span:last-child').textContent;
  console.log(`Badge info: ${badgeText}`);

  // Future: Could show tooltip or modal with detailed information
  // For now, just add visual feedback with scale animation
  badge.style.transform = 'scale(1.1)';
  setTimeout(() => {
    badge.style.transform = '';
  }, 200);
}
// Initialize mobile-specific optimizations - Configure mobile device performance and behavior
function initMobileOptimizations() {
  // Detect mobile devices using user agent string
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (isMobile) {
    // Reduce animation duration for better mobile performance
    document.documentElement.style.setProperty('--animation-duration', '0.3s');

    // Add mobile device class for CSS targeting
    document.body.classList.add('mobile-device');

    // Enable passive touch event listeners for better scroll performance
    document.addEventListener('touchstart', function() {}, { passive: true });
    document.addEventListener('touchmove', function() {}, { passive: true });

    // Set viewport height variable for mobile browsers with dynamic viewport
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
  }
}
// Initialize intersection observer for scroll animations - Set up viewport-based animation triggers
function initIntersectionObserver() {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('mobile-animate');
          observer.unobserve(entry.target); // Stop observing once animated
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    // Observe elements for scroll-triggered animations
    document.querySelectorAll('.stat-card, .state-card, .analytics-section').forEach(el => {
      observer.observe(el);
    });
  }
}

// DOM content loaded event handler - Initialize page components in optimized sequence
document.addEventListener("DOMContentLoaded", () => {
  // Enhanced loading sequence with smooth fade-in animation
  document.body.style.opacity = '0';
  document.body.style.transform = 'translateY(20px)';

  // Preload critical resources before showing content
  preloadCriticalResources();

  setTimeout(() => {
    document.body.style.transition = 'all 0.6s ease-out';
    document.body.style.opacity = '1';
    document.body.transform = 'translateY(0)';
  }, 100);

  // Initialize mobile optimizations first for better mobile experience
  initMobileOptimizations();

  // Initialize mobile navigation system
  initMobileNavigation();

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
  img.src = 'assets/federation.jpg';

  // Preload custom fonts if font loading API is available
  if ('fonts' in document) {
    document.fonts.load('1rem Cinzel');
    document.fonts.load('1rem Rajdhani');
  }
}

// Initialize performance optimizations for various device capabilities - Configure animations and features based on device performance
function initPerformanceOptimizations() {
  // Throttle scroll events for better performance
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(() => {
      updateScrollProgress();
    }, 16); // Target ~60fps for smooth scrolling
  }, { passive: true });

  // Optimize animations for low-end devices based on CPU cores
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.documentElement.style.setProperty('--animation-duration', '0.1s');
    // Disable complex animations on low-end devices
    document.documentElement.classList.add('reduced-animations');
  }

  // Respect user's motion preferences for accessibility
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01s');
    document.documentElement.classList.add('reduced-animations');
  }

  // Apply mobile-specific optimizations for touch devices
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    document.documentElement.classList.add('mobile-optimized');
  }
}

// Update scroll progress indicator - Display reading progress in navigation bar
function updateScrollProgress() {
  const scrolled = window.pageYOffset;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrolled / maxScroll) * 100;

  const progressBar = document.getElementById('nav-progress');
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
    progressBar.classList.toggle('visible', scrolled > 100); // Show after scrolling 100px
  }
}

// Enhanced error handling for overview page - Log and handle JavaScript errors gracefully
window.addEventListener('error', (e) => {
  console.error('Overview page error:', e.error);
  // Could implement user-friendly error reporting here
});

// Enhanced visibility change handling for performance optimization - Pause/resume animations based on tab visibility
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when tab is not visible to save resources
    document.querySelectorAll('.stat-card, .emblem-core, .ring').forEach(el => {
      el.style.animationPlayState = 'paused';
    });
  } else {
    // Resume animations when tab becomes visible
    document.querySelectorAll('.stat-card, .emblem-core, .ring').forEach(el => {
      el.style.animationPlayState = 'running';
    });
  }
});

// Mobile Navigation Functions - Handle mobile menu interactions and scroll management
let scrollPosition = 0;
let touchStartY = 0;

// Prevent touch scrolling when mobile menu is open - Block background scroll while preserving menu scroll
function preventTouchMove(e) {
  // Allow scrolling within the mobile nav itself
  if (e.target.closest('.mobile-nav')) {
    return;
  }
  // Prevent all other touch scrolling
  e.preventDefault();
}

// Disable page scrolling when mobile menu is active - Lock background scroll position
function disableScroll() {
  // Store current scroll position for restoration later
  scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

  // Add CSS classes for scroll prevention
  document.body.classList.add('mobile-nav-active');
  document.documentElement.classList.add('mobile-nav-active');

  // Apply styles to prevent scrolling by fixing position
  document.body.style.top = `-${scrollPosition}px`;

  // Prevent touch scrolling events
  document.addEventListener('touchmove', preventTouchMove, { passive: false });
}

// Enable page scrolling when mobile menu is closed - Restore normal scroll behavior
function enableScroll() {
  // Remove CSS classes that prevent scrolling
  document.body.classList.remove('mobile-nav-active');
  document.documentElement.classList.remove('mobile-nav-active');

  // Remove inline styles that fix position
  document.body.style.top = '';

  // Remove touch event listener that prevents scrolling
  document.removeEventListener('touchmove', preventTouchMove);

  // Restore original scroll position
  window.scrollTo(0, scrollPosition);
}

// Toggle mobile menu open/closed state - Handle mobile navigation menu visibility
function toggleMobileMenu() {
  const toggle = document.querySelector(".mobile-menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  if (!toggle || !mobileNav) {
    console.error("Mobile navigation elements not found");
    return;
  }

  const isActive = mobileNav.classList.contains("active");

  if (isActive) {
    // Close menu and restore scroll
    mobileNav.classList.remove("active");
    toggle.classList.remove("active");
    enableScroll();
  } else {
    // Open menu and disable background scroll
    mobileNav.classList.add("active");
    toggle.classList.add("active");
    disableScroll();
  }
}

// Close mobile menu when clicking on navigation links - Auto-close menu after navigation
function initMobileNavLinks() {
  document.querySelectorAll(".mobile-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      toggleMobileMenu();
    });
  });
}

// Close mobile menu when clicking outside menu area - Handle outside click interactions
function initMobileNavOutsideClick() {
  document.addEventListener("click", (e) => {
    const mobileNav = document.getElementById("mobile-nav");
    const toggle = document.querySelector(".mobile-menu-toggle");

    if (!mobileNav || !toggle) return;

    // Close menu if clicking outside menu and toggle button
    if (mobileNav.classList.contains("active") &&
        !mobileNav.contains(e.target) &&
        !toggle.contains(e.target)) {
      toggleMobileMenu();
    }
  });
}

// Close mobile menu on escape key press - Handle keyboard accessibility
function initMobileNavKeyboard() {
  document.addEventListener("keydown", (e) => {
    const mobileNav = document.getElementById("mobile-nav");
    if (e.key === "Escape" && mobileNav && mobileNav.classList.contains("active")) {
      toggleMobileMenu();
    }
  });
}

// Handle orientation change and resize events for mobile menu - Maintain proper scroll lock during device rotation
function initMobileNavResize() {
  window.addEventListener("resize", () => {
    const mobileNav = document.getElementById("mobile-nav");
    if (mobileNav && mobileNav.classList.contains("active")) {
      // Recalculate scroll position on resize to maintain proper lock
      setTimeout(() => {
        if (mobileNav.classList.contains("active")) {
          disableScroll();
        }
      }, 100);
    }
  });

  window.addEventListener("orientationchange", () => {
    const mobileNav = document.getElementById("mobile-nav");
    if (mobileNav && mobileNav.classList.contains("active")) {
      // Handle orientation change with delay for proper viewport adjustment
      setTimeout(() => {
        if (mobileNav.classList.contains("active")) {
          disableScroll();
        }
      }, 500);
    }
  });
}

// Handle page unload to ensure scroll is restored - Clean up mobile navigation state on page exit
function initMobileNavCleanup() {
  window.addEventListener('beforeunload', () => {
    const mobileNav = document.getElementById("mobile-nav");
    if (mobileNav && mobileNav.classList.contains("active")) {
      enableScroll(); // Ensure scroll is restored before page unload
    }
  });

  // Handle visibility change (tab switching) to close menu when tab becomes hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      const mobileNav = document.getElementById("mobile-nav");
      if (mobileNav && mobileNav.classList.contains("active")) {
        // Close mobile nav when tab becomes hidden
        toggleMobileMenu();
      }
    }
  });
}

// Initialize mobile navigation system - Set up all mobile navigation event handlers
function initMobileNavigation() {
  initMobileNavLinks();
  initMobileNavOutsideClick();
  initMobileNavKeyboard();
  initMobileNavResize();
  initMobileNavCleanup();
}

// Test function for mobile navigation debugging - Diagnostic tool for mobile menu functionality
function testMobileNav() {
  console.log("=== Mobile Navigation Test ===");

  const toggle = document.querySelector(".mobile-menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  console.log("Toggle element exists:", !!toggle);
  console.log("Mobile nav element exists:", !!mobileNav);

  if (toggle) {
    console.log("Toggle display style:", window.getComputedStyle(toggle).display);
    console.log("Toggle visibility:", window.getComputedStyle(toggle).visibility);
    console.log("Toggle classes:", toggle.className);
  }

  if (mobileNav) {
    console.log("Mobile nav display style:", window.getComputedStyle(mobileNav).display);
    console.log("Mobile nav visibility:", window.getComputedStyle(mobileNav).visibility);
    console.log("Mobile nav opacity:", window.getComputedStyle(mobileNav).opacity);
    console.log("Mobile nav classes:", mobileNav.className);
  }

  console.log("Window width:", window.innerWidth);
  console.log("Should show mobile toggle:", window.innerWidth <= 1023);

  // Test the toggle function if elements exist
  if (toggle && mobileNav) {
    console.log("Testing toggle function...");
    toggleMobileMenu();
  }

  console.log("=== End Test ===");
}

// Make functions globally available for external access - Export key functions to window object
window.toggleMobileMenu = toggleMobileMenu;
window.testMobileNav = testMobileNav;
window.updateOverview = updateOverview;
