document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".faction-card");
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const relationFilter = document.getElementById("relationFilter");
  const modal = document.getElementById("faction-modal");
  const modalBody = document.getElementById("modal-body");

  const factionDependencies = {
    "Jura Tempest Federation": ["⚔ Military", "✨ Magic", "🔩 Technology", "🧠 Intelligence"],
    "Armed Nation of Dwargon": ["⚔ Military", "🔩 Technology", "🌾 Agriculture"],
    "Kingdom of Ingrassia": ["⚔ Military", "🌾 Agriculture", "🧠 Intelligence"],
    "Holy Empire Ruberios": ["⚔ Military", "✨ Magic", "🧠 Intelligence"],
    "Eastern Empire": ["⚔ Military", "🔩 Technology", "🧠 Intelligence", "🌾 Agriculture"],
    "Kingdom of Blumund": ["🧠 Intelligence", "🌾 Agriculture"],
    "Animal Kingdom Eurazania": ["⚔ Military", "🌾 Agriculture", "✨ Magic"],
    "Kingdom of Farmenas": ["🌾 Agriculture", "🧠 Intelligence"],
    "Octagram (Demon Lords)": ["⚔ Military", "✨ Magic", "🧠 Intelligence"],
    "Free Guild": ["🧠 Intelligence", "🌾 Agriculture"],
    "Four Nations Trade Alliance": ["🔩 Technology", "🌾 Agriculture", "🧠 Intelligence"],
    "Western Holy Church": ["⚔ Military", "✨ Magic"],
    Cerberus: ["🧠 Intelligence", "🔩 Technology"],
    "Kingdom of Falmuth (Fallen)": ["⚔ Military", "🌾 Agriculture"],
    "Goblin Tribes": ["⚔ Military", "🌾 Agriculture"],
    "Fanged Wolf Clan": ["⚔ Military", "✨ Magic"],
    "Lizardmen Tribes": ["⚔ Military", "🌾 Agriculture"],
  };

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

    relations.allied.forEach((faction) => {
      relationsHTML += `<span class="relation allied" data-faction="${faction}" title="Allied: Close partnership with ${faction}">${faction}</span>`;
    });

    relations.neutral.forEach((faction) => {
      relationsHTML += `<span class="relation neutral" data-faction="${faction}" title="Neutral: Diplomatic relations with ${faction}">${faction}</span>`;
    });

    relations.hostile.forEach((faction) => {
      relationsHTML += `<span class="relation hostile" data-faction="${faction}" title="Hostile: Active conflict with ${faction}">${faction}</span>`;
    });

    relations.unknown.forEach((faction) => {
      relationsHTML += `<span class="relation unknown" data-faction="${faction}" title="Unknown: Unclear relations with ${faction}">${faction}</span>`;
    });

    relationsHTML += `
        </div>
      </div>
    `;

    return relationsHTML;
  }

  if (!modal || !modalBody) {
    console.warn("Modal elements not found, modal functionality disabled");
    return;
  }

  cards.forEach((card) => {
    const expandBtn = card.querySelector(".expand-btn");
    if (expandBtn) {
      expandBtn.addEventListener("click", () => {
        openFactionModal(card);
      });
    }
  });

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

    let modalContent = `
      <div class="modal-faction-header">
        <div>
          <h1 class="modal-faction-title">${factionName}</h1>
          ${factionTag ? `<span class="modal-faction-tag ${factionTag.className}">${factionTag.textContent}</span>` : ""}
        </div>
      </div>

      <p class="modal-faction-summary">${factionSummary}</p>
    `;

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

    if (factionDetails) {
      const detailSections = factionDetails.querySelectorAll(".detail-section");
      if (detailSections.length > 0) {
        modalContent += `<div class="modal-detail-sections">`;

        const timelineSection = Array.from(detailSections).find((section) =>
          section.classList.contains("timeline-section")
        );
        const otherSections = Array.from(detailSections).filter(
          (section) =>
            !section.classList.contains("timeline-section") &&
            !section.classList.contains("relations-section")
        );

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

        modalContent += generateFactionRelations(factionName);

        modalContent += generateFactionDependencies(factionName);

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
      modalContent += `<div class="modal-detail-sections">`;
      modalContent += generateFactionRelations(factionName);
      modalContent += `</div>`;
    }

    modalBody.innerHTML = modalContent;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    const relationPills = modal.querySelectorAll(".relation[data-faction]");
    relationPills.forEach((pill) => {
      pill.addEventListener("click", (e) => {
        const targetFaction = e.target.dataset.faction;
        findAndOpenFactionModal(targetFaction);
      });
    });

    setTimeout(() => {
      const modalPowerBars = modal.querySelectorAll(".modal-power-bar div");
      modalPowerBars.forEach((bar) => {
        const power = bar.style.getPropertyValue("--power");
        bar.style.width = `${power}%`;
      });
    }, 100);
  }

  function findAndOpenFactionModal(factionName) {
    const normalizedTarget = factionName.toLowerCase();

    const targetCard = Array.from(cards).find((card) => {
      const cardName = card.querySelector("h2")?.textContent.toLowerCase() || "";
      return (
        cardName.includes(normalizedTarget) ||
        normalizedTarget.includes(cardName.split(" ")[0]) ||
        (normalizedTarget === "tempest" && cardName.includes("jura tempest")) ||
        (normalizedTarget === "dwargon" && cardName.includes("dwargon")) ||
        (normalizedTarget === "ruberios" && cardName.includes("ruberios")) ||
        (normalizedTarget === "eastern empire" && cardName.includes("eastern empire"))
      );
    });

    if (targetCard) {
      closeFactionModal();

      setTimeout(() => {
        openFactionModal(targetCard);
      }, 300);
    } else {
      console.warn(`Faction not found: ${factionName}`);
    }
  }

  function filterFactions() {
    const search = searchInput ? searchInput.value.toLowerCase() : "";
    const type = typeFilter ? typeFilter.value : "all";
    const relation = relationFilter ? relationFilter.value : "all";

    let visibleCount = 0;

    cards.forEach((card) => {
      const nameElement = card.querySelector("h2");
      const summaryElement = card.querySelector(".faction-summary");

      const name = nameElement ? nameElement.textContent.toLowerCase() : "";
      const summary = summaryElement ? summaryElement.textContent.toLowerCase() : "";
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

    updateResultsCount(visibleCount, cards.length);

    showNoResultsMessage(visibleCount);
  }

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

    const typeText = typeFilter && typeFilter.value !== "all" ? `${typeFilter.value}s` : "factions";
    const relationText =
      relationFilter && relationFilter.value !== "all" ? ` (${relationFilter.value})` : "";

    counter.textContent = `Showing ${visible} of ${total} ${typeText}${relationText}`;

    counter.style.animation = "none";
    setTimeout(() => {
      counter.style.animation = "pulse 2s ease-in-out infinite";
    }, 10);
  }

  function showNoResultsMessage(visibleCount) {
    const grid = document.querySelector(".factions-grid");
    let noResultsMsg = document.getElementById("noResultsMessage");

    if (visibleCount === 0) {
      if (!noResultsMsg) {
        noResultsMsg = document.createElement("div");
        noResultsMsg.id = "noResultsMessage";
        noResultsMsg.className = "no-results";
        noResultsMsg.textContent = "No factions match your search criteria";
        grid.appendChild(noResultsMsg);
      }
      noResultsMsg.style.display = "block";
    } else {
      if (noResultsMsg) {
        noResultsMsg.style.display = "none";
      }
    }
  }

  window.filterFactions = filterFactions;

  if (searchInput) {
    searchInput.addEventListener("input", filterFactions);

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

  updateResultsCount(cards.length, cards.length);

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeFactionModal();
      }
    });
  }

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

document.addEventListener("DOMContentLoaded", () => {
  const scrollBtn = document.createElement("div");
  scrollBtn.className = "scroll-to-top";
  scrollBtn.setAttribute("aria-label", "Scroll to top");
  scrollBtn.setAttribute("role", "button");
  scrollBtn.setAttribute("tabindex", "0");
  document.body.appendChild(scrollBtn);

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollBtn.classList.add("visible");
    } else {
      scrollBtn.classList.remove("visible");
    }
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  scrollBtn.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  });
});

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

document.addEventListener("DOMContentLoaded", () => {
  if (window.TempestAnimations) {
    window.TempestAnimations.animateScrollReveal(".faction-card", { y: 35, duration: 0.6, stagger: 0.1 });
  } else {
    const factionCards = document.querySelectorAll(".faction-card");
    factionCards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      cardObserver.observe(card);
    });
  }
});

const powerBarObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const powerBars = entry.target.querySelectorAll(".power-bar div");
        powerBars.forEach((bar, index) => {
          setTimeout(() => {
            const power = bar.style.getPropertyValue("--power");
            bar.style.width = `${power}%`;
          }, index * 100);
        });
        powerBarObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.addEventListener("DOMContentLoaded", () => {
  const factionCards = document.querySelectorAll(".faction-card");
  factionCards.forEach((card) => {
    const powerBars = card.querySelectorAll(".power-bar div");
    powerBars.forEach((bar) => {
      bar.style.width = "0";
    });
    powerBarObserver.observe(card);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".faction-card");

  cards.forEach((card) => {
    card.setAttribute("tabindex", "0");

    card.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const expandBtn = card.querySelector(".expand-btn");
        if (expandBtn) {
          expandBtn.click();
        }
      }
    });
  });
});

document.addEventListener("keydown", (e) => {
  const modal = document.getElementById("faction-modal");
  if (e.key === "Escape" && modal && modal.classList.contains("active")) {
    closeFactionModal();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const relationFilter = document.getElementById("relationFilter");
  const controlsElement = document.querySelector(".factions-controls");

  const clearBtn = document.createElement("button");
  clearBtn.className = "clear-filters-btn";
  clearBtn.textContent = "✕ Clear Filters";
  clearBtn.setAttribute("aria-label", "Clear all filters");

  if (controlsElement) {
    controlsElement.appendChild(clearBtn);
  }

  function checkActiveFilters() {
    const hasSearch = searchInput && searchInput.value.trim() !== "";
    const hasTypeFilter = typeFilter && typeFilter.value !== "all";
    const hasRelationFilter = relationFilter && relationFilter.value !== "all";

    if (hasSearch || hasTypeFilter || hasRelationFilter) {
      clearBtn.classList.add("visible");
    } else {
      clearBtn.classList.remove("visible");
    }
  }

  clearBtn.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    if (typeFilter) typeFilter.value = "all";
    if (relationFilter) relationFilter.value = "all";

    if (window.filterFactions) {
      window.filterFactions();
    }

    clearBtn.classList.remove("visible");

    clearBtn.style.animation = "none";
    setTimeout(() => {
      clearBtn.style.animation = "";
    }, 10);
  });

  if (searchInput) {
    searchInput.addEventListener("input", checkActiveFilters);
  }
  if (typeFilter) {
    typeFilter.addEventListener("change", checkActiveFilters);
  }
  if (relationFilter) {
    relationFilter.addEventListener("change", checkActiveFilters);
  }

  checkActiveFilters();
});

document.addEventListener("DOMContentLoaded", () => {
  const powerItems = document.querySelectorAll(".power-item");

  const tooltips = {
    Military: "Combat strength and army size",
    Influence: "Political power and diplomatic reach",
    Magic: "Magical capabilities and research",
    Territory: "Land area and resource control",
  };

  powerItems.forEach((item) => {
    const label = item.querySelector("span")?.textContent.trim();
    if (label && tooltips[label]) {
      item.setAttribute("data-tooltip", tooltips[label]);
      item.setAttribute("title", tooltips[label]);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".faction-card");

  cards.forEach((card) => {
    card.addEventListener("click", function (e) {
      const ripple = document.createElement("div");
      ripple.className = "ripple-effect";
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

      ripple.style.left = x + "px";
      ripple.style.top = y + "px";

      card.style.position = "relative";
      card.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".faction-card");

  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.08}s`;
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");

  let searchTimeout;
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        if (window.filterFactions) {
          window.filterFactions();
        }
      }, 300);
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".faction-card");

  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      createParticles(this);
    });
  });

  function createParticles(card) {
    const particleCount = 5;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "hover-particle";
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(77, 212, 255, 0.8);
        border-radius: 50%;
        pointer-events: none;
        z-index: 100;
      `;

      const rect = card.getBoundingClientRect();
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;

      particle.style.left = x + "px";
      particle.style.top = y + "px";

      card.style.position = "relative";
      card.appendChild(particle);

      particle.animate(
        [
          {
            transform: "translate(0, 0) scale(1)",
            opacity: 1,
          },
          {
            transform: `translate(${(Math.random() - 0.5) * 50}px, ${-50 - Math.random() * 30}px) scale(0)`,
            opacity: 0,
          },
        ],
        {
          duration: 1000 + Math.random() * 500,
          easing: "cubic-bezier(0, 0.5, 0.5, 1)",
        }
      );

      setTimeout(() => particle.remove(), 1500);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("faction-modal");

  if (modal) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && modal.classList.contains("active")) {
          const sections = modal.querySelectorAll(".modal-detail-section");
          sections.forEach((section, index) => {
            section.style.animation = "none";
            setTimeout(() => {
              section.style.animation = `fadeInUp 0.5s ease-out ${index * 0.08}s forwards`;
            }, 10);
          });
        }
      });
    });

    observer.observe(modal, { childList: true, subtree: true });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      const searchInput = document.getElementById("searchInput");
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }

    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "C") {
      e.preventDefault();
      const clearBtn = document.querySelector(".clear-filters-btn");
      if (clearBtn && clearBtn.classList.contains("visible")) {
        clearBtn.click();
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -100px 0px",
  };

  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        fadeInObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const cards = document.querySelectorAll(".faction-card");
  cards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(40px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    fadeInObserver.observe(card);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const powerItems = document.querySelectorAll(".power-item");

  const tooltipTexts = {
    Military: "Combat strength, army size, and military technology",
    Influence: "Political power, diplomatic reach, and international standing",
    Magic: "Magical capabilities, research, and supernatural forces",
    Territory: "Land area, resource control, and geographical advantage",
  };

  powerItems.forEach((item) => {
    const label = item.querySelector("span")?.textContent.trim();
    if (label && tooltipTexts[label]) {
      item.setAttribute("title", tooltipTexts[label]);
      item.style.cursor = "help";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".faction-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 30;
      const rotateY = (centerX - x) / 30;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.03)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const originalOpenModal = window.openFactionModal;

  if (typeof originalOpenModal === "function") {
    window.openFactionModal = function (card) {
      const modal = document.getElementById("faction-modal");
      if (modal) {
        modal.classList.add("loading");
      }

      setTimeout(() => {
        originalOpenModal(card);
        if (modal) {
          modal.classList.remove("loading");
        }
      }, 100);
    };
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const animatePowerBars = (container) => {
    const powerBars = container.querySelectorAll(".power-bar div");
    powerBars.forEach((bar, index) => {
      bar.style.width = "0";
      setTimeout(
        () => {
          const power = bar.style.getPropertyValue("--power");
          bar.style.width = `${power}%`;
        },
        100 + index * 100
      );
    });
  };

  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animatePowerBars(entry.target);
          cardObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  const cards = document.querySelectorAll(".faction-card");
  cards.forEach((card) => cardObserver.observe(card));
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const relationFilter = document.getElementById("relationFilter");

  const updateFilterVisuals = () => {
    [searchInput, typeFilter, relationFilter].forEach((element) => {
      if (!element) return;

      const isActive = element.value && element.value !== "all" && element.value.trim() !== "";

      if (isActive) {
        element.style.borderColor = "rgba(255, 215, 0, 0.8)";
        element.style.boxShadow = "0 0 20px rgba(255, 215, 0, 0.4)";
      } else {
        element.style.borderColor = "";
        element.style.boxShadow = "";
      }
    });
  };

  if (searchInput) searchInput.addEventListener("input", updateFilterVisuals);
  if (typeFilter) typeFilter.addEventListener("change", updateFilterVisuals);
  if (relationFilter) relationFilter.addEventListener("change", updateFilterVisuals);
});


