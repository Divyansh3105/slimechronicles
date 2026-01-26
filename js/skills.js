console.log("Skills.js loaded");
console.log("CharacterLoader available:", !!window.CharacterLoader);
console.log("GameState available:", !!window.GameState);
console.log("GameState type:", typeof window.GameState);

async function getAllSkills() {
  try {
    console.log("getAllSkills called");
    console.log("Checking window.GameState:", window.GameState);
    console.log("Checking window.CharacterLoader:", window.CharacterLoader);

    let basicCharacters = null;

    if (window.GameState) {
      try {
        basicCharacters = await window.GameState.getAllCharacters();
        console.log(
          `Found ${basicCharacters ? basicCharacters.length : 0} basic characters (via GameState)`,
        );
      } catch (err) {
        console.error("GameState.getAllCharacters() failed:", err);
      }
    }


    if (!basicCharacters || basicCharacters.length === 0) {
      console.warn(
        "GameState not available or returned empty, trying CharacterLoader directly...",
      );
      if (window.CharacterLoader) {
        try {
          basicCharacters = await window.CharacterLoader.loadBasicCharacters();
          console.log(
            `Found ${basicCharacters ? basicCharacters.length : 0} basic characters (via CharacterLoader)`,
          );
        } catch (err) {
          console.error("CharacterLoader.loadBasicCharacters() failed:", err);
        }
      } else {
        console.error("CharacterLoader not available!");
        return [];
      }
    }

    if (!basicCharacters || basicCharacters.length === 0) {
      console.warn("No characters found from any source");
      return [];
    }

    const skillsMap = new Map();
    let processedCount = 0;
    let errorCount = 0;


    for (let i = 0; i < basicCharacters.length; i++) {
      const basicChar = basicCharacters[i];
      try {
        console.log(
          `Loading character ${i + 1}/${basicCharacters.length}: ${basicChar.name}`,
        );

        const response = await fetch(`data/characters/${basicChar.id}.json`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const character = await response.json();
        console.log(
          `Loaded details for ${character.name}, skills:`,
          character.skills,
        );

        if (!character.skills || !Array.isArray(character.skills)) {
          console.warn(`Character ${character.name} has no skills array`);
          processedCount++;
          continue;
        }

        character.skills.forEach((skill) => {
          if (!skill.name) {
            console.warn(`Skill missing name for character ${character.name}`);
            return;
          }

          if (!skillsMap.has(skill.name)) {
            skillsMap.set(skill.name, {
              name: skill.name,
              type: skill.type || "Unknown",
              description: skill.description || "No description available",
              icon: skill.icon || "✨",
              characters: [],
              prerequisites: generatePrerequisites(skill.type),
              applications: generateApplications(skill.type),
              difficulty: getDifficultyLevel(skill.type),
              learningTime: getLearningTime(skill.type),
              category: getCategoryFromType(skill.type),
            });
          }
          skillsMap.get(skill.name).characters.push(character);
        });
        processedCount++;
      } catch (error) {
        console.error(`Error loading character ${basicChar.name}:`, error);
        errorCount++;
      }
    }

    const skills = Array.from(skillsMap.values());
    console.log(
      `Processed ${skills.length} unique skills from ${processedCount} characters (${errorCount} errors)`,
    );
    return skills;
  } catch (error) {
    console.error("Error in getAllSkills:", error);
    return [];
  }
}

function generatePrerequisites(type) {
  const prerequisites = {
    Combat: ["Basic Training", "Physical Conditioning"],
    Magic: ["Mana Control", "Elemental Theory"],
    Support: ["Team Coordination", "Strategic Thinking"],
    Leadership: ["Communication Skills", "Decision Making"],
    Crafting: ["Material Knowledge", "Tool Mastery"],
  };
  return prerequisites[type] || ["Basic Knowledge"];
}

function generateApplications(type) {
  const applications = {
    Combat: ["Battle Strategy", "Personal Defense", "Military Operations"],
    Magic: ["Elemental Manipulation", "Spell Crafting", "Magical Research"],
    Support: ["Team Enhancement", "Healing Arts", "Tactical Support"],
    Leadership: ["Team Management", "Strategic Planning", "Diplomacy"],
    Crafting: ["Item Creation", "Resource Processing", "Innovation"],
  };
  return applications[type] || ["General Application"];
}

function getDifficultyLevel(type) {
  const difficulties = {
    Combat: "Advanced",
    Magic: "Expert",
    Support: "Intermediate",
    Leadership: "Advanced",
    Crafting: "Intermediate",
  };
  return difficulties[type] || "Beginner";
}

function getLearningTime(type) {
  const times = {
    Combat: "6-12 months",
    Magic: "1-3 years",
    Support: "3-6 months",
    Leadership: "1-2 years",
    Crafting: "6 months - 1 year",
  };
  return times[type] || "3-6 months";
}

function getCategoryFromType(type) {
  const categories = {
    Combat: "Offensive",
    Magic: "Mystical",
    Support: "Utility",
    Leadership: "Social",
    Crafting: "Technical",
  };
  return categories[type] || "General";
}
let allSkills = [];
let filteredSkills = [];

function getSkillStats() {
  const stats = {
    total: allSkills.length,
    combat: allSkills.filter((s) => s.type.toLowerCase() === "combat").length,
    magic: allSkills.filter((s) => s.type.toLowerCase() === "magic").length,
    support: allSkills.filter((s) => s.type.toLowerCase() === "support").length,
    leadership: allSkills.filter((s) => s.type.toLowerCase() === "leadership")
      .length,
    crafting: allSkills.filter((s) => s.type.toLowerCase() === "crafting")
      .length,
    mostUsed: allSkills.reduce(
      (max, skill) =>
        skill.characters.length > max.characters.length ? skill : max,
      { characters: [] },
    ),
  };
  return stats;
}

function renderSkillStats() {
  const stats = getSkillStats();
  const statsContainer = document.createElement("div");
  statsContainer.className = "skills-stats";
  statsContainer.innerHTML = `
    <div class="stat-item">
      <div class="stat-value">${stats.total}</div>
      <div class="stat-label">Total Skills</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">${stats.combat}</div>
      <div class="stat-label">Combat</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">${stats.magic}</div>
      <div class="stat-label">Magic</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">${stats.support}</div>
      <div class="stat-label">Support</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">${stats.leadership}</div>
      <div class="stat-label">Leadership</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">${stats.mostUsed.characters.length}</div>
      <div class="stat-label">Most Used</div>
    </div>
  `;

  const skillsGrid = document.getElementById("skills-grid");
  skillsGrid.parentNode.insertBefore(statsContainer, skillsGrid);
}

function renderLearningPaths() {
  const learningPathsContainer = document.createElement("div");
  learningPathsContainer.className = "skills-learning-path";
  learningPathsContainer.innerHTML = `
    <div class="learning-path-title">Skill Learning Paths</div>
    <div class="learning-paths">
      <div class="learning-path-item" onclick="filterByPath('combat')">
        <div class="path-name">⚔️ Combat Mastery</div>
        <div class="path-description">Master the arts of warfare and battle tactics</div>
        <div class="path-skills-count">${allSkills.filter((s) => s.type.toLowerCase() === "combat").length} skills</div>
      </div>
      <div class="learning-path-item" onclick="filterByPath('magic')">
        <div class="path-name">✨ Magical Arts</div>
        <div class="path-description">Harness the power of elemental and mystical forces</div>
        <div class="path-skills-count">${allSkills.filter((s) => s.type.toLowerCase() === "magic").length} skills</div>
      </div>
      <div class="learning-path-item" onclick="filterByPath('support')">
        <div class="path-name">🛡️ Support Specialist</div>
        <div class="path-description">Enhance allies and provide tactical advantages</div>
        <div class="path-skills-count">${allSkills.filter((s) => s.type.toLowerCase() === "support").length} skills</div>
      </div>
      <div class="learning-path-item" onclick="filterByPath('leadership')">
        <div class="path-name">👑 Leadership Excellence</div>
        <div class="path-description">Guide teams and inspire others to greatness</div>
        <div class="path-skills-count">${allSkills.filter((s) => s.type.toLowerCase() === "leadership").length} skills</div>
      </div>
      <div class="learning-path-item" onclick="filterByPath('crafting')">
        <div class="path-name">🔨 Master Craftsman</div>
        <div class="path-description">Create and innovate with advanced techniques</div>
        <div class="path-skills-count">${allSkills.filter((s) => s.type.toLowerCase() === "crafting").length} skills</div>
      </div>
    </div>
  `;

  const skillsGrid = document.getElementById("skills-grid");
  skillsGrid.parentNode.insertBefore(learningPathsContainer, skillsGrid);
}

function filterByPath(pathType) {
  document.getElementById("type-filter").value = pathType;
  applyFilters();
}

function renderSkills(skills) {
  const grid = document.getElementById("skills-grid");

  if (!grid) {
    console.error("Skills grid element not found");
    return;
  }

  if (!skills || skills.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem;">
        <h3>No skills found</h3>
        <p>Try adjusting your search or filter criteria</p>
      </div>
    `;
    return;
  }

  try {
    grid.innerHTML = skills
      .map((skill, index) => {
        const safeSkill = {
          name: skill.name || "Unknown Skill",
          type: skill.type || "Unknown",
          description: skill.description || "No description available",
          icon: skill.icon || "✨",
          characters: skill.characters || [],
          prerequisites: skill.prerequisites || [],
          applications: skill.applications || [],
          difficulty: skill.difficulty || "Intermediate",
          learningTime: skill.learningTime || "3-6 months",
        };

        return `
          <div class="skill-card ${safeSkill.type.toLowerCase()}" data-skill-type="${safeSkill.type.toLowerCase()}" style="animation-delay: ${index * 0.05}s;" onclick="openSkillDetail('${safeSkill.name}')">
              <div class="skill-header">
                  <div class="skill-icon">${safeSkill.icon}</div>
                  <div class="skill-info">
                      <div class="skill-name">${safeSkill.name}</div>
                      <div class="skill-type">${safeSkill.type}</div>
                  </div>
              </div>
              <div class="skill-description">${safeSkill.description}</div>

              ${
                safeSkill.prerequisites.length > 0
                  ? `
              <div class="skill-prerequisites">
                  <div class="prerequisites-title">Prerequisites</div>
                  <div class="prerequisites-list">
                      ${safeSkill.prerequisites
                        .map(
                          (prereq) => `
                          <span class="prerequisite-tag">${prereq}</span>
                      `,
                        )
                        .join("")}
                  </div>
              </div>
              `
                  : ""
              }

              ${
                safeSkill.applications.length > 0
                  ? `
              <div class="skill-applications">
                  <div class="applications-title">Applications</div>
                  <div class="applications-list">
                      ${safeSkill.applications
                        .map(
                          (app) => `
                          <span class="application-tag">${app}</span>
                      `,
                        )
                        .join("")}
                  </div>
              </div>
              `
                  : ""
              }

              <div class="skill-characters">
                  <div class="skill-characters-title">Practitioners (${safeSkill.characters.length}):</div>
                  <div class="skill-characters-list">
                      ${safeSkill.characters
                        .map((char) => {
                          const safeName = char.name || "Unknown";
                          const safeId = char.id || "";
                          const safePortrait = char.portrait || "👤";

                          return `
                            <div class="character-tag" onclick="event.stopPropagation(); viewCharacter('${safeId}')" title="View ${safeName}'s profile">
                                <span class="character-tag-icon">${safePortrait}</span>
                                <span>${safeName}</span>
                            </div>
                          `;
                        })
                        .join("")}
                  </div>
              </div>
          </div>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Error rendering skills:", error);
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem;">
        <h3>Rendering Error</h3>
        <p>Failed to display skills. Please refresh the page.</p>
      </div>
    `;
  }
}

function viewCharacter(characterId) {
  try {
    if (!characterId) {
      console.warn("No character ID provided");
      return;
    }

    const clickedTag = event?.target?.closest(".character-tag");
    if (clickedTag) {
      clickedTag.style.transform = "scale(0.95)";
      setTimeout(() => {
        clickedTag.style.transform = "";
      }, 300);
    }


    setTimeout(() => {
      window.location.href = `character.html?id=${encodeURIComponent(characterId)}`;
    }, 150);
  } catch (error) {
    console.error("Error navigating to character:", error);

    window.location.href = `character.html?id=${encodeURIComponent(characterId)}`;
  }
}
function applyFilters() {
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();
  const typeFilter = document.getElementById("type-filter").value;
  const difficultyFilter = document.getElementById("difficulty-filter").value;
  const sortBy = document.getElementById("sort-select").value;

  filteredSkills = allSkills.filter((skill) => {
    const matchesSearch =
      skill.name.toLowerCase().includes(searchTerm) ||
      skill.description.toLowerCase().includes(searchTerm) ||
      skill.characters.some((char) =>
        char.name.toLowerCase().includes(searchTerm),
      ) ||
      (skill.prerequisites &&
        skill.prerequisites.some((prereq) =>
          prereq.toLowerCase().includes(searchTerm),
        )) ||
      (skill.applications &&
        skill.applications.some((app) =>
          app.toLowerCase().includes(searchTerm),
        ));

    const matchesType =
      typeFilter === "all" || skill.type.toLowerCase() === typeFilter;
    const matchesDifficulty =
      difficultyFilter === "all" || skill.difficulty === difficultyFilter;

    return matchesSearch && matchesType && matchesDifficulty;
  });

  filteredSkills.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "type":
        return a.type.localeCompare(b.type);
      case "characters":
        return b.characters.length - a.characters.length;
      case "difficulty":
        const difficultyOrder = {
          Beginner: 1,
          Intermediate: 2,
          Advanced: 3,
          Expert: 4,
        };
        return (
          (difficultyOrder[a.difficulty] || 2) -
          (difficultyOrder[b.difficulty] || 2)
        );
      default:
        return 0;
    }
  });

  renderSkills(filteredSkills);
  updateResultsCount();
}

function updateResultsCount() {
  const existingCount = document.querySelector(".results-count");
  if (existingCount) {
    existingCount.remove();
  }

  const count = document.createElement("div");
  count.className = "results-count";
  count.textContent = `Showing ${filteredSkills.length} of ${allSkills.length} skills`;

  const skillsGrid = document.getElementById("skills-grid");
  skillsGrid.parentNode.insertBefore(count, skillsGrid);
}

async function initializeSkillsPage() {
  try {
    console.log("Initializing skills page...");


    if (!window.GameState) {
      console.error("GameState not loaded");
      const grid = document.getElementById("skills-grid");
      if (grid) {
        grid.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 4rem;">
            <h3>System Error</h3>
            <p>GameState not loaded. Please refresh the page.</p>
          </div>
        `;
      }
      return;
    }

    console.log("GameState available:", window.GameState);
    console.log("CHARACTERS available:", window.CHARACTERS);


    allSkills = await getAllSkills();
    console.log(`Found ${allSkills.length} unique skills`);

    if (allSkills.length === 0) {
      console.warn("No skills found");
      const grid = document.getElementById("skills-grid");
      if (grid) {
        grid.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 4rem;">
            <h3>No Skills Available</h3>
            <p>No character skills found in the database.</p>
            <p>Debug: Characters available: ${window.CHARACTERS ? window.CHARACTERS.length : "undefined"}</p>
          </div>
        `;
      }
      return;
    }

    filteredSkills = [...allSkills];

    renderSkillStats();
    renderLearningPaths();


    const typeFilter = document.getElementById("type-filter");
    const difficultyFilter = document.getElementById("difficulty-filter");
    const sortSelect = document.getElementById("sort-select");
    const searchInput = document.getElementById("search-input");

    if (typeFilter) {
      typeFilter.addEventListener("change", applyFilters);
    }

    if (difficultyFilter) {
      difficultyFilter.addEventListener("change", applyFilters);
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", applyFilters);
    }

    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener("input", () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(applyFilters, 300);
      });
    }

    applyFilters();

    console.log(`Skills page initialized with ${allSkills.length} skills`);
  } catch (error) {
    console.error("Error initializing skills page:", error);
    const grid = document.getElementById("skills-grid");
    if (grid) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem;">
          <h3>Initialization Error</h3>
          <p>Failed to load skills data. Please refresh the page.</p>
          <p style="font-size: 0.8rem; color: #666; margin-top: 1rem;">Error: ${error.message}</p>
        </div>
      `;
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeSkillsPage);
} else {
  initializeSkillsPage();
}
function openSkillDetail(skillName) {
  const skill = allSkills.find((s) => s.name === skillName);
  if (!skill) return;


  document.querySelector(".skill-detail-modal")?.remove();

  const modal = document.createElement("div");
  modal.className = "skill-detail-modal";
  modal.innerHTML = `
    <div class="skill-detail-content">
      <div class="skill-detail-header">
        <div class="skill-detail-info">
          <div class="skill-detail-name">${skill.name}</div>
          <div class="skill-detail-type">${skill.type} • ${skill.difficulty} • ${skill.learningTime}</div>
        </div>
        <button class="close-detail" onclick="closeSkillDetail()" aria-label="Close skill details">✕</button>
      </div>

      <div class="skill-detail-description">${skill.description}</div>

      <div class="skill-detail-sections">
        <div class="skill-detail-section">
          <div class="section-title">📊 Mastery Progress</div>
          <div class="section-content">
            <div class="skill-mastery">
              <span class="mastery-label">Current Level</span>
              <div class="mastery-level">
                <div class="mastery-progress" style="width: ${skill.mastery || 75}%"></div>
              </div>
              <span class="mastery-percentage">${skill.mastery || 75}%</span>
            </div>
          </div>
        </div>

        ${
          skill.prerequisites && skill.prerequisites.length > 0
            ? `
        <div class="skill-detail-section">
          <div class="section-title">🔗 Prerequisites</div>
          <div class="section-content">
            <div class="prerequisites-list">
              ${skill.prerequisites.map((prereq) => `<span class="prerequisite-tag">${prereq}</span>`).join("")}
            </div>
          </div>
        </div>
        `
            : ""
        }

        ${
          skill.applications && skill.applications.length > 0
            ? `
        <div class="skill-detail-section">
          <div class="section-title">🎯 Applications</div>
          <div class="section-content">
            <div class="applications-list">
              ${skill.applications.map((app) => `<span class="application-tag">${app}</span>`).join("")}
            </div>
          </div>
        </div>
        `
            : ""
        }

        <div class="skill-detail-section">
          <div class="section-title">👥 Practitioners (${skill.characters.length})</div>
          <div class="section-content">
            <div class="skill-characters-list">
              ${skill.characters
                .map(
                  (char) => `
                <div class="character-tag" onclick="event.stopPropagation(); viewCharacter('${char.id || ""}')" title="View ${char.name}'s profile" tabindex="0" role="button" aria-label="View ${char.name}'s profile">
                  <span class="character-tag-icon">${char.portrait || "👤"}</span>
                  <span>${char.name}</span>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  document.body.appendChild(modal);


  document.body.style.overflow = "hidden";


  setTimeout(() => {
    modal.classList.add("active");
  }, 10);


  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeSkillDetail();
    }
  });


  modal.querySelectorAll(".character-tag").forEach((tag) => {
    tag.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        tag.click();
      }
    });
  });


  const closeButton = modal.querySelector(".close-detail");
  if (closeButton) {
    closeButton.focus();
  }
}

function closeSkillDetail() {
  const modal = document.querySelector(".skill-detail-modal");
  if (modal) {
    modal.classList.remove("active");

    document.body.style.overflow = "";
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}
document.addEventListener("keydown", (e) => {

  if (e.key === "Escape") {
    closeSkillDetail();
  }


  if ((e.ctrlKey && e.key === "f") || e.key === "/") {
    e.preventDefault();
    document.getElementById("search-input")?.focus();
  }
});
window.filterByPath = filterByPath;
window.viewCharacter = viewCharacter;
window.openSkillDetail = openSkillDetail;
window.closeSkillDetail = closeSkillDetail;
