document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".faction-card");
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const relationFilter = document.getElementById("relationFilter");

  // Add expand/collapse functionality
  cards.forEach(card => {
    card.querySelector(".expand-btn").addEventListener("click", () => {
      const isExpanded = card.classList.contains("expanded");
      card.classList.toggle("expanded");

      // Update button text
      const btn = card.querySelector(".expand-btn");
      btn.textContent = isExpanded ? "View Details" : "Hide Details";
    });
  });

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
});
