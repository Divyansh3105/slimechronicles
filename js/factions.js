document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".faction-card");
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const relationFilter = document.getElementById("relationFilter");
  const modal = document.getElementById("faction-modal");
  const modalBody = document.getElementById("modal-body");

  // Add modal functionality to expand buttons
  cards.forEach(card => {
    card.querySelector(".expand-btn").addEventListener("click", () => {
      openFactionModal(card);
    });
  });

  // Function to open faction modal
  function openFactionModal(card) {
    const factionName = card.querySelector("h2").textContent;
    const factionTag = card.querySelector(".faction-tag");
    const factionSummary = card.querySelector(".faction-summary").textContent;
    const powerSnapshot = card.querySelector(".power-snapshot");
    const factionDetails = card.querySelector(".faction-details");

    // Build modal content
    let modalContent = `
      <div class="modal-faction-header">
        <div>
          <h1 class="modal-faction-title">${factionName}</h1>
          <span class="modal-faction-tag ${factionTag.className}">${factionTag.textContent}</span>
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
        const label = item.querySelector("span").textContent;
        const powerBar = item.querySelector(".power-bar div");
        const powerValue = powerBar.style.getPropertyValue("--power") || "0";

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
          const title = section.querySelector("h4").textContent;
          const list = section.querySelector("ul").innerHTML;

          modalContent += `
            <div class="modal-detail-section">
              <h4>${title}</h4>
              <ul>${list}</ul>
            </div>
          `;
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
    const search = searchInput.value.toLowerCase();
    const type = typeFilter.value;
    const relation = relationFilter ? relationFilter.value : "all";

    cards.forEach(card => {
      const name = card.querySelector("h2").textContent.toLowerCase();
      const summary = card.querySelector(".faction-summary").textContent.toLowerCase();
      const cardType = card.dataset.type;
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
      document.querySelector(".factions-controls").appendChild(counter);
    }

    const typeText = typeFilter.value === "all" ? "factions" : `${typeFilter.value}s`;
    const relationText = relationFilter && relationFilter.value !== "all" ? ` (${relationFilter.value})` : "";
    counter.textContent = `Showing ${visible} of ${total} ${typeText}${relationText}`;
  }

  // Event listeners
  searchInput.addEventListener("input", filterFactions);
  typeFilter.addEventListener("change", filterFactions);
  if (relationFilter) {
    relationFilter.addEventListener("change", filterFactions);
  }

  // Initialize results counter
  updateResultsCount(cards.length, cards.length);

  // Add keyboard navigation and shortcuts
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      searchInput.value = "";
      typeFilter.value = "all";
      if (relationFilter) relationFilter.value = "all";
      filterFactions();
    }
  });

  // Close modal when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeFactionModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeFactionModal();
    }
  });
});

// Global function to close faction modal
function closeFactionModal() {
  const modal = document.getElementById("faction-modal");
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
}
