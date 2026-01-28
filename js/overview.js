const JURA_TEMPEST_STATS = {
  population: {
    total: 480000,
    breakdown: {
      citizens: 320000,
      government: 105000,
      administrators: 35000,
      specialists: 20000
    }
  },
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

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const eventLog = [];

function animateNumber(el, from, to, duration = 700) {
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(from + (to - from) * eased);
    el.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function setStat(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  const current = parseInt(el.textContent.replace(/,/g, "")) || 0;
  animateNumber(el, current, value);
}

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


  try {
    createPopulationBreakdown();
    createDefenseBreakdown();
    createEconomyBreakdown();
    createTechnologyBreakdown();
  } catch (error) {
    console.error("Error creating breakdowns:", error);
  }
}

function createPopulationBreakdown() {
  const card = document.getElementById("population-card");

  if (!card) {
    console.error("Population card not found!");
    return;
  }

  const breakdown = JURA_TEMPEST_STATS.population.breakdown;

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

function createDefenseBreakdown() {
  const card = document.getElementById("military-card");
  if (!card) {
    console.error("Military card not found!");
    return;
  }

  const defense = JURA_TEMPEST_STATS.defense;
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

function createEconomyBreakdown() {
  const card = document.getElementById("economy-card");

  if (!card) {
    console.error("Economy card not found!");
    return;
  }

  const economy = JURA_TEMPEST_STATS.economy;
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

function createTechnologyBreakdown() {
  const card = document.getElementById("technology-card");

  if (!card) {
    console.error("Technology card not found!");
    return;
  }

  const technology = JURA_TEMPEST_STATS.technology;
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

function addEvent(icon, text) {
  eventLog.unshift({ icon, text, time: "Just now" });
  if (eventLog.length > 8) eventLog.pop();
}

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
function initInteractiveElements() {
  const supportsHover = window.matchMedia('(hover: hover)').matches;

  // Enhanced stat card interactions
  document.querySelectorAll('.stat-card').forEach((el, index) => {
    // Add staggered animation
    el.style.animationDelay = `${index * 0.1}s`;

    if (supportsHover) {
      el.addEventListener('mouseenter', () => {
        if (window.SoundFeedback) {
          window.SoundFeedback.playEffect('hover');
        }
        // Add subtle glow effect
        el.style.filter = 'drop-shadow(0 0 20px rgba(77, 212, 255, 0.3))';
      });

      el.addEventListener('mouseleave', () => {
        el.style.filter = '';
      });
    }

    // Enhanced click interaction
    el.addEventListener('click', () => {
      if (window.SoundFeedback) {
        window.SoundFeedback.playEffect('click');
      }

      // Create ripple effect
      createRippleEffect(el, event);

      // Trigger detailed view (placeholder for future functionality)
      showCardDetails(el.id);
    });

    // Keyboard support
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });
  });

  // Enhanced state card interactions
  document.querySelectorAll('.state-card').forEach(el => {
    if (supportsHover) {
      el.addEventListener('mouseenter', () => {
        if (window.SoundFeedback) {
          window.SoundFeedback.playEffect('hover');
        }
      });
    }

    el.addEventListener('click', () => {
      if (window.SoundFeedback) {
        window.SoundFeedback.playEffect('click');
      }
      createRippleEffect(el, event);
    });
  });

  // Enhanced strength category interactions
  document.querySelectorAll('.strength-category').forEach(el => {
    el.addEventListener('click', () => {
      if (window.SoundFeedback) {
        window.SoundFeedback.playEffect('click');
      }

      // Smooth scale animation
      el.style.transform = 'scale(0.98)';
      setTimeout(() => {
        el.style.transform = '';
      }, 150);
    });
  });

  // Enhanced badge interactions
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

    // Keyboard support
    badge.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        badge.click();
      }
    });
  });

  // Enhanced number cards interactions
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

    // Keyboard support
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Enhanced federation emblem interaction
  const federationEmblem = document.querySelector('.federation-emblem');
  if (federationEmblem) {
    federationEmblem.addEventListener('click', () => {
      if (window.SoundFeedback) {
        window.SoundFeedback.playEffect('click');
      }

      const emblemCore = federationEmblem.querySelector('.emblem-core');

      // Simple scale animation
      emblemCore.style.transform = 'scale(1.05)';

      setTimeout(() => {
        emblemCore.style.transform = '';
      }, 200);
    });

    // Keyboard support
    federationEmblem.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        federationEmblem.click();
      }
    });
  }
}

// New helper functions
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

  // Add ripple animation keyframes if not exists
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

  setTimeout(() => {
    ripple.remove();
  }, 600);
}

function showCardDetails(cardId) {
  // Placeholder for detailed view functionality
  console.log(`Showing details for ${cardId}`);

  // Future: Could open a modal with detailed statistics
  // For now, just add a subtle feedback
  const card = document.getElementById(cardId);
  if (card) {
    card.style.transform = 'scale(1.05)';
    setTimeout(() => {
      card.style.transform = '';
    }, 200);
  }
}

function showNumberCardDetails(card) {
  const category = card.querySelector('.number-category').textContent;
  console.log(`Number card details: ${category}`);

  // Simplified visual feedback
  const icon = card.querySelector('.number-icon');

  // Simple scale animation
  icon.style.transform = 'scale(1.2)';

  setTimeout(() => {
    icon.style.transform = '';
  }, 300);
}

function showBadgeInfo(badge) {
  // Placeholder for badge information display
  const badgeText = badge.querySelector('span:last-child').textContent;
  console.log(`Badge info: ${badgeText}`);

  // Future: Could show tooltip or modal with detailed information
  // For now, just add visual feedback
  badge.style.transform = 'scale(1.1)';
  setTimeout(() => {
    badge.style.transform = '';
  }, 200);
}
function initMobileOptimizations() {

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (isMobile) {

    document.documentElement.style.setProperty('--animation-duration', '0.3s');


    document.body.classList.add('mobile-device');


    document.addEventListener('touchstart', function() {}, { passive: true });
    document.addEventListener('touchmove', function() {}, { passive: true });


    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
  }
}
function initIntersectionObserver() {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('mobile-animate');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });


    document.querySelectorAll('.stat-card, .state-card, .analytics-section').forEach(el => {
      observer.observe(el);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Enhanced loading sequence
  document.body.style.opacity = '0';
  document.body.style.transform = 'translateY(20px)';

  // Preload critical resources
  preloadCriticalResources();

  setTimeout(() => {
    document.body.style.transition = 'all 0.6s ease-out';
    document.body.style.opacity = '1';
    document.body.transform = 'translateY(0)';
  }, 100);

  // Initialize mobile optimizations first
  initMobileOptimizations();

  // Staggered initialization for better performance
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

// New performance optimization functions
function preloadCriticalResources() {
  // Preload federation image
  const img = new Image();
  img.src = 'assets/federation.jpg';

  // Preload fonts if needed
  if ('fonts' in document) {
    document.fonts.load('1rem Cinzel');
    document.fonts.load('1rem Rajdhani');
  }
}

function initPerformanceOptimizations() {
  // Throttle scroll events
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(() => {
      updateScrollProgress();
    }, 16); // ~60fps
  }, { passive: true });

  // Optimize animations for low-end devices
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.documentElement.style.setProperty('--animation-duration', '0.1s');
    // Disable complex animations on low-end devices
    document.documentElement.classList.add('reduced-animations');
  }

  // Reduce motion for users who prefer it
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01s');
    document.documentElement.classList.add('reduced-animations');
  }

  // Optimize for mobile devices
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    document.documentElement.classList.add('mobile-optimized');
  }
}

function updateScrollProgress() {
  const scrolled = window.pageYOffset;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrolled / maxScroll) * 100;

  const progressBar = document.getElementById('nav-progress');
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
    progressBar.classList.toggle('visible', scrolled > 100);
  }
}

// Enhanced error handling
window.addEventListener('error', (e) => {
  console.error('Overview page error:', e.error);
  // Could implement user-friendly error reporting here
});

// Enhanced visibility change handling
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when tab is not visible
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

window.updateOverview = updateOverview;
