const JURA_TEMPEST_STATS = {
  population: {
    total: 480000,
    breakdown: {
      citizens: 320000,
      government: 105000,
      administrators: 35000,
      specialists: 20000,
    },
  },
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

function setStat(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.TempestAnimations) {
    window.TempestAnimations.animateStatCounter(el, value);
  } else {
    const current = parseInt(el.textContent.replace(/,/g, "")) || 0;
    if (window.animateNumber) {
      window.animateNumber(el, current, value);
    } else {
      el.textContent = value.toLocaleString();
    }
  }
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

function createDefenseBreakdown() {
  const card = document.getElementById("military-card");
  if (!card) {
    console.error("Military card not found!");
    return;
  }

  const defense = JURA_TEMPEST_STATS.defense;
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

function createEconomyBreakdown() {
  const card = document.getElementById("economy-card");

  if (!card) {
    console.error("Economy card not found!");
    return;
  }

  const economy = JURA_TEMPEST_STATS.economy;
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

function createTechnologyBreakdown() {
  const card = document.getElementById("technology-card");

  if (!card) {
    console.error("Technology card not found!");
    return;
  }

  const technology = JURA_TEMPEST_STATS.technology;
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

function initInteractiveElements() {
  const supportsHover = window.matchMedia("(hover: hover)").matches;

  document.querySelectorAll(".stat-card").forEach((el, index) => {
    el.style.animationDelay = `${index * 0.2}s`;

    if (supportsHover) {
      el.addEventListener("mouseenter", () => {
        if (window.SoundFeedback) {
          window.SoundFeedback.playEffect("hover");
        }
        el.style.filter = "drop-shadow(0 0 25px rgba(77, 212, 255, 0.4))";

        createHoverRipple(el);
      });

      el.addEventListener("mouseleave", () => {
        el.style.filter = "";
      });
    }

    el.addEventListener("click", (event) => {
      if (window.SoundFeedback) {
        window.SoundFeedback.playEffect("click");
      }

      if (window.createRippleEffect) {
        window.createRippleEffect(el, event);
      }

      el.style.transform = "scale(0.98)";
      setTimeout(() => {
        el.style.transform = "";
      }, 150);

      showCardDetails(el.id);
    });

    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        el.click();
      }
    });
  });

  document.querySelectorAll(".pillar-card").forEach((pillar, index) => {
    pillar.style.animationDelay = `${index * 0.1}s`;

    if (supportsHover) {
      pillar.addEventListener("mouseenter", () => {
        if (window.SoundFeedback) {
          window.SoundFeedback.playEffect("hover");
        }

        const pillarType = pillar.getAttribute("data-pillar");
        addPillarGlow(pillar, pillarType);
      });

      pillar.addEventListener("mouseleave", () => {
        removePillarGlow(pillar);
      });
    }

    pillar.addEventListener("click", () => {
      if (window.SoundFeedback) {
        window.SoundFeedback.playEffect("click");
      }

      pillar.style.transform = "scale(0.97)";
      setTimeout(() => {
        pillar.style.transform = "";
      }, 200);
    });
  });

  document.querySelectorAll(".key-figure-card").forEach((figure, index) => {
    figure.style.animationDelay = `${index * 0.15}s`;

    if (supportsHover) {
      figure.addEventListener("mouseenter", () => {
        if (window.SoundFeedback) {
          window.SoundFeedback.playEffect("hover");
        }

        const roleClass = Array.from(figure.classList).find((cls) =>
          ["supreme", "military", "enforcement", "diplomacy"].includes(cls)
        );
        addRoleGlow(figure, roleClass);
      });

      figure.addEventListener("mouseleave", () => {
        removeRoleGlow(figure);
      });
    }
  });

  document.querySelectorAll(".state-card").forEach((el) => {
    if (supportsHover) {
      el.addEventListener("mouseenter", () => {
        if (window.SoundFeedback) {
          window.SoundFeedback.playEffect("hover");
        }

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

  document.querySelectorAll(".badge").forEach((badge, index) => {
    badge.style.animationDelay = `${index * 0.1}s`;

    if (supportsHover) {
      badge.addEventListener("mouseenter", () => {
        if (window.SoundFeedback) {
          window.SoundFeedback.playEffect("hover");
        }

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

    badge.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        badge.click();
      }
    });
  });

  document.querySelectorAll(".number-card").forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;

    if (supportsHover) {
      card.addEventListener("mouseenter", () => {
        if (window.SoundFeedback) {
          window.SoundFeedback.playEffect("hover");
        }

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

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });
  });

  const federationEmblem = document.querySelector(".federation-emblem");
  if (federationEmblem) {
    federationEmblem.addEventListener("click", () => {
      if (window.SoundFeedback) {
        window.SoundFeedback.playEffect("click");
      }

      const emblemCore = federationEmblem.querySelector(".emblem-core");

      emblemCore.style.transform = "scale(1.1) rotate(5deg)";
      emblemCore.style.filter = "brightness(1.2) drop-shadow(0 0 30px var(--accent-gold))";

      setTimeout(() => {
        emblemCore.style.transform = "";
        emblemCore.style.filter = "";
      }, 300);
    });

    federationEmblem.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        federationEmblem.click();
      }
    });
  }
}

function showCardDetails(cardId) {
  const card = document.getElementById(cardId);
  if (card) {
    card.style.transform = "scale(1.05)";
    setTimeout(() => {
      card.style.transform = "";
    }, 200);
  }
}

function showNumberCardDetails(card) {
  const icon = card.querySelector(".number-icon");

  icon.style.transform = "scale(1.2)";

  setTimeout(() => {
    icon.style.transform = "";
  }, 300);
}

function showBadgeInfo(badge) {
  badge.style.transform = "scale(1.1)";
  setTimeout(() => {
    badge.style.transform = "";
  }, 200);
}
function initMobileOptimizations() {
  const isMobile = window.isMobileDevice ? window.isMobileDevice() : false;

  if (isMobile) {
    document.documentElement.style.setProperty("--animation-duration", "0.3s");

    document.body.classList.add("mobile-device");

    // Enable passive touch event listeners for better scroll performance
    document.addEventListener("touchstart", function () {}, { passive: true });
    document.addEventListener("touchmove", function () {}, { passive: true });
  }
}
function initIntersectionObserver() {
  if (window.TempestAnimations) {
    window.TempestAnimations.animateScrollReveal(
      ".stat-card, .state-card, .pillar-card, .key-figure-card, .number-card",
      { y: 35, duration: 0.6 }
    );
  } else if ("IntersectionObserver" in window) {
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
      }
    );

    document.querySelectorAll(".stat-card, .state-card, .analytics-section").forEach((el) => {
      observer.observe(el);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.style.opacity = "0";
  document.body.style.transform = "translateY(20px)";

  preloadCriticalResources();

  setTimeout(() => {
    document.body.style.transition = "all 0.6s ease-out";
    document.body.style.opacity = "1";
    document.body.transform = "translateY(0)";
  }, 100);

  initMobileOptimizations();

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

function preloadCriticalResources() {
  const img = new Image();
  img.src = "assets/federation.jpg";

  if ("fonts" in document) {
    document.fonts.load("1rem Cinzel");
    document.fonts.load("1rem Rajdhani");
  }
}

function initPerformanceOptimizations() {
  const throttledScrollUpdate = window.throttle
    ? window.throttle(() => {
        updateScrollProgress();
      }, 16)
    : updateScrollProgress;

  window.addEventListener("scroll", throttledScrollUpdate, { passive: true });

  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.documentElement.style.setProperty("--animation-duration", "0.1s");
    document.documentElement.classList.add("reduced-animations");
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.style.setProperty("--animation-duration", "0.01s");
    document.documentElement.classList.add("reduced-animations");
  }

  if (window.isMobileDevice && window.isMobileDevice()) {
    document.documentElement.classList.add("mobile-optimized");
  }
}

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

// Log and handle JavaScript errors gracefully
window.addEventListener("error", (e) => {
  console.error("Overview page error:", e.error);
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    document.querySelectorAll(".stat-card, .emblem-core, .ring").forEach((el) => {
      el.style.animationPlayState = "paused";
    });
  } else {
    document.querySelectorAll(".stat-card, .emblem-core, .ring").forEach((el) => {
      el.style.animationPlayState = "running";
    });
  }
});

window.updateOverview = updateOverview;

function createHoverRipple(element) {
  const ripple = document.createElement("div");
  ripple.className = "hover-ripple";
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

  element.style.position = "relative";
  element.appendChild(ripple);

  setTimeout(() => {
    if (ripple.parentNode) {
      ripple.parentNode.removeChild(ripple);
    }
  }, 600);
}

function addPillarGlow(pillar, pillarType) {
  const glowColors = {
    protection: "rgba(77, 212, 255, 0.4)",
    merit: "rgba(255, 215, 0, 0.4)",
    unity: "rgba(0, 255, 136, 0.4)",
    law: "rgba(170, 85, 255, 0.4)",
    growth: "rgba(255, 51, 102, 0.4)",
  };

  const color = glowColors[pillarType] || "rgba(77, 212, 255, 0.4)";
  pillar.style.boxShadow = `0 0 30px ${color}, 0 20px 50px rgba(0, 0, 0, 0.3)`;
}

function removePillarGlow(pillar) {
  pillar.style.boxShadow = "";
}

function addRoleGlow(figure, roleClass) {
  const roleColors = {
    supreme: "rgba(255, 215, 0, 0.4)",
    military: "rgba(255, 87, 87, 0.4)",
    enforcement: "rgba(170, 85, 255, 0.4)",
    diplomacy: "rgba(0, 255, 136, 0.4)",
  };

  const color = roleColors[roleClass] || "rgba(77, 212, 255, 0.4)";
  figure.style.boxShadow = `0 0 25px ${color}, 0 25px 55px rgba(0, 0, 0, 0.5)`;
}

function removeRoleGlow(figure) {
  figure.style.boxShadow = "";
}

function addNumberCardEffect(card) {
  const cardType = card.classList.contains("anime-card")
    ? "anime"
    : card.classList.contains("novel-card")
      ? "novel"
      : card.classList.contains("revenue-card")
        ? "revenue"
        : "default";

  const effects = {
    anime: "rgba(77, 212, 255, 0.3)",
    novel: "rgba(0, 255, 136, 0.3)",
    revenue: "rgba(255, 215, 0, 0.3)",
    default: "rgba(77, 212, 255, 0.3)",
  };

  const color = effects[cardType];
  card.style.boxShadow = `0 0 30px ${color}, 0 20px 55px rgba(0, 0, 0, 0.35)`;
  card.style.transform = "translateY(-6px) scale(1.02)";
}

function removeNumberCardEffect(card) {
  card.style.boxShadow = "";
  card.style.transform = "";
}

const style = document.createElement("style");
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
