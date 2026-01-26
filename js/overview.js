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
  console.log("updateOverview called");

  
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

  
  console.log("Creating stat card breakdowns...");
  try {
    createPopulationBreakdown();
    createDefenseBreakdown();
    createEconomyBreakdown();
    createTechnologyBreakdown();
    console.log("All stat card breakdowns created successfully!");
  } catch (error) {
    console.error("Error creating breakdowns:", error);
  }
}

function createPopulationBreakdown() {
  console.log("Creating population breakdown...");
  const card = document.getElementById("population-card");
  console.log("Population card element:", card);

  if (!card) {
    console.error("Population card not found!");
    return;
  }

  const breakdown = JURA_TEMPEST_STATS.population.breakdown;
  console.log("Population breakdown data:", breakdown);

  const existingBreakdown = card.querySelector('.stat-breakdown');
  if (existingBreakdown) {
    console.log("Removing existing breakdown");
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

  console.log("Appending breakdown to card");
  card.appendChild(breakdownDiv);
  console.log("Population breakdown created successfully!");
}

function createDefenseBreakdown() {
  console.log("Creating defense breakdown...");
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
  console.log("Defense breakdown created successfully!");
}

function createEconomyBreakdown() {
  console.log("Creating economy breakdown...");
  const card = document.getElementById("economy-card");
  console.log("Economy card element:", card);

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
  console.log("Economy breakdown created successfully!");
}

function createTechnologyBreakdown() {
  console.log("Creating technology breakdown...");
  const card = document.getElementById("technology-card");
  console.log("Technology card element:", card);

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
  console.log("Technology breakdown created successfully!");
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

  
  initChartControls();

  document.querySelectorAll('.stat-card').forEach(el => {
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

      
      if (!supportsHover) {
        el.style.transform = 'scale(0.98)';
        setTimeout(() => {
          el.style.transform = '';
        }, 150);
      }
    });
  });

  
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
    });
  });

  
  document.querySelectorAll('.strength-category').forEach(el => {
    el.addEventListener('click', () => {
      if (window.SoundFeedback) {
        window.SoundFeedback.playEffect('click');
      }

      
      el.style.transform = 'scale(0.98)';
      setTimeout(() => {
        el.style.transform = '';
      }, 150);
    });
  });

  
  document.querySelectorAll('.badge').forEach(badge => {
    if (supportsHover) {
      badge.addEventListener('mouseenter', () => {
        if (window.SoundFeedback) {
          window.SoundFeedback.playEffect('hover');
        }
      });
    }

    badge.addEventListener('click', () => {
      if (window.SoundFeedback) {
        window.SoundFeedback.playEffect('click');
      }

      
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(77, 212, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `;

      const rect = badge.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (rect.width / 2 - size / 2) + 'px';
      ripple.style.top = (rect.height / 2 - size / 2) + 'px';

      badge.style.position = 'relative';
      badge.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  
  const federationEmblem = document.querySelector('.federation-emblem');
  if (federationEmblem) {
    federationEmblem.addEventListener('click', () => {
      if (window.SoundFeedback) {
        window.SoundFeedback.playEffect('click');
      }

      const emblemCore = federationEmblem.querySelector('.emblem-core');
      const rings = federationEmblem.querySelectorAll('.ring');

      emblemCore.style.animation = 'none';
      emblemCore.style.transform = 'scale(1.1)';

      rings.forEach((ring, index) => {
        ring.style.animationPlayState = 'paused';
        setTimeout(() => {
          ring.style.animationPlayState = 'running';
        }, 100 * (index + 1));
      });

      setTimeout(() => {
        emblemCore.style.animation = 'emblemFloat 4s ease-in-out infinite';
        emblemCore.style.transform = '';
      }, 300);
    });
  }
}
function initChartControls() {
  const chartControls = document.querySelectorAll('.chart-control-btn');

  chartControls.forEach(btn => {
    btn.addEventListener('click', () => {
      
      chartControls.forEach(b => b.classList.remove('active'));

      
      btn.classList.add('active');

      
      if (window.SoundFeedback) {
        window.SoundFeedback.playEffect('click');
      }

      
      const period = btn.dataset.period;
      updateAnalyticsByPeriod(period);
    });
  });
}
function updateAnalyticsByPeriod(period) {
  const analyticsOverview = document.getElementById('analytics-overview');
  if (!analyticsOverview) return;

  
  analyticsOverview.style.opacity = '0.5';

  setTimeout(() => {
    
    const periodMultipliers = {
      live: 1,
      daily: 0.95,
      weekly: 0.92,
      monthly: 0.88
    };

    const multiplier = periodMultipliers[period] || 1;

    
    renderAnalyticsOverview(multiplier);

    
    analyticsOverview.style.opacity = '1';
  }, 300);
}
function renderAnalyticsOverview(multiplier = 1) {
  console.log("renderAnalyticsOverview called with multiplier:", multiplier);
  const overview = document.getElementById("analytics-overview");
  console.log("Analytics overview element found:", !!overview);

  if (!overview) {
    console.error("Analytics overview element not found!");
    return;
  }

  overview.innerHTML = "";

  
  const analyticsData = [
    {
      title: "Governance Excellence",
      metrics: [
        { label: "Administrative Efficiency", value: Math.floor(96 * multiplier), color: "var(--slime-blue)" },
        { label: "Policy Implementation", value: Math.floor(94 * multiplier), color: "var(--accent-cyan)" },
        { label: "Citizen Engagement", value: Math.floor(92 * multiplier), color: "var(--accent-emerald)" },
        { label: "Transparency Index", value: Math.floor(89 * multiplier), color: "var(--accent-gold)" }
      ]
    },
    {
      title: "Economic Performance",
      metrics: [
        { label: "GDP Growth Rate", value: Math.floor(88 * multiplier), color: "var(--accent-gold)" },
        { label: "Trade Balance", value: Math.floor(91 * multiplier), color: "var(--accent-cyan)" },
        { label: "Employment Rate", value: Math.floor(97 * multiplier), color: "var(--accent-emerald)" },
        { label: "Innovation Investment", value: Math.floor(95 * multiplier), color: "var(--accent-purple)" }
      ]
    },
    {
      title: "Development Indicators",
      metrics: [
        { label: "Infrastructure Quality", value: Math.floor(93 * multiplier), color: "var(--accent-gold)" },
        { label: "Education Standards", value: Math.floor(89 * multiplier), color: "var(--accent-purple)" },
        { label: "Healthcare Access", value: Math.floor(94 * multiplier), color: "var(--accent-emerald)" },
        { label: "Environmental Sustainability", value: Math.floor(87 * multiplier), color: "var(--accent-cyan)" }
      ]
    }
  ];

  console.log("Creating", analyticsData.length, "analytics sections");
  analyticsData.forEach((section, index) => {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'analytics-section';

    sectionDiv.innerHTML = `
      <h4 class="analytics-title">${section.title}</h4>
      <div class="analytics-metrics">
        ${section.metrics.map(metric => `
          <div class="analytics-metric">
            <div class="metric-header">
              <span class="metric-name">${metric.label}</span>
              <span class="metric-score">${metric.value}%</span>
            </div>
            <div class="metric-bar">
              <div class="metric-fill" style="width: ${metric.value}%; background: ${metric.color}"></div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    overview.appendChild(sectionDiv);
    console.log(`Added section ${index + 1}: ${section.title}`);
  });

  console.log("Analytics overview rendering completed!");
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
  document.body.style.opacity = '0';
  document.body.style.transform = 'translateY(20px)';

  setTimeout(() => {
    document.body.style.transition = 'all 0.6s ease-out';
    document.body.style.opacity = '1';
    document.body.style.transform = 'translateY(0)';
  }, 100);

  
  initMobileOptimizations();

  
  setTimeout(() => {
    updateOverview();
    renderAnalyticsOverview();
    initInteractiveElements();
    initIntersectionObserver();
  }, 300);
});

window.updateOverview = updateOverview;
