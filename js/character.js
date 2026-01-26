
console.log("Character.js loaded");
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, checking dependencies...");
  console.log("GameState available:", !!window.GameState);
  console.log("CharacterLoader available:", !!window.CharacterLoader);

  
  setTimeout(() => {
    console.log("Delayed check - GameState:", !!window.GameState);
    console.log("Delayed check - CharacterLoader:", !!window.CharacterLoader);
    loadCharacterProfile();
  }, 100);
});
function showLoadingIndicator() {
  const content = document.getElementById("profile-content");
  if (content) {
    content.innerHTML = `
      <div class="loading-indicator" style="text-align: center; padding: 3rem;">
        <div class="loading-spinner"></div>
        <h3>Loading Character Data...</h3>
        <p>Please wait while we fetch the character information.</p>
      </div>
    `;
  }
}
function hideLoadingIndicator() {
  const loadingIndicator = document.querySelector(".loading-indicator");
  if (loadingIndicator) {
    loadingIndicator.remove();
  }
}
function renderBasicCharacterProfile(character) {
  const content = document.getElementById("profile-content");
  if (!content) {
    console.error("profile-content element not found!");
    return;
  }

  console.log("Rendering basic character profile for:", character.name);

  content.innerHTML = `
    <div class="profile-header">
      <div class="profile-image-container">
        <img src="${character.image}" alt="${character.name}" class="profile-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="profile-portrait-fallback" style="display: none;">${character.portrait}</div>
      </div>
      <h1 class="profile-name">${character.name}</h1>
      <div class="character-details">
        <p class="profile-race">Species: ${character.race}</p>
        <p class="profile-role">Role: ${character.role}</p>
        <div class="profile-power">Classification: ${character.power}</div>
      </div>
    </div>

    <div class="loading-details" style="text-align: center; padding: 2rem; opacity: 0.7;">
      <div class="loading-spinner"></div>
      <p>Loading detailed character information...</p>
    </div>
  `;
}
function renderDetailedCharacterProfile(character) {
  
  const overviewTab = document.getElementById("overview");
  if (overviewTab) {
    overviewTab.innerHTML = `
      <div class="character-lore">
        <h3>Lore</h3>
        <p>${character.lore || "No lore available."}</p>
      </div>

      <div class="character-backstory">
        <h3>Backstory</h3>
        <p>${character.backstory || "No backstory available."}</p>
      </div>

      <div class="character-personality">
        <h3>Personality</h3>
        <p>${character.personality || "No personality description available."}</p>
      </div>
    `;
  }

  
  const detailsTab = document.getElementById("details");
  if (detailsTab) {
    detailsTab.innerHTML = `
      <div class="character-philosophy">
        <h3>Philosophy</h3>
        <p>${character.philosophy || "No philosophy available."}</p>
      </div>

      <div class="character-leadership">
        <h3>Leadership Style</h3>
        <p>${character.leadershipStyle || "No leadership information available."}</p>
      </div>

      <div class="character-influence">
        <h3>World Influence</h3>
        <p>${character.worldInfluence || "No world influence information available."}</p>
      </div>

      ${
        character.quotes
          ? `
        <div class="character-quotes">
          <h3>Notable Quotes</h3>
          ${character.quotes
            .map(
              (quote) => `
            <blockquote>
              <p>"${quote.text}"</p>
              <cite>— ${quote.context}</cite>
            </blockquote>
          `,
            )
            .join("")}
        </div>
      `
          : ""
      }
    `;
  }

  
  const relationshipsTab = document.getElementById("relationships");
  if (relationshipsTab && character.relationships) {
    relationshipsTab.innerHTML = `
      <div class="relationships-grid">
        ${
          character.relationships.allies
            ? `
          <div class="relationship-category">
            <h3>Allies</h3>
            <ul>
              ${character.relationships.allies.map((ally) => `<li>${ally}</li>`).join("")}
            </ul>
          </div>
        `
            : ""
        }

        ${
          character.relationships.rivals
            ? `
          <div class="relationship-category">
            <h3>Rivals</h3>
            <ul>
              ${character.relationships.rivals.map((rival) => `<li>${rival}</li>`).join("")}
            </ul>
          </div>
        `
            : ""
        }

        ${
          character.relationships.mentors
            ? `
          <div class="relationship-category">
            <h3>Mentors</h3>
            <ul>
              ${character.relationships.mentors.map((mentor) => `<li>${mentor}</li>`).join("")}
            </ul>
          </div>
        `
            : ""
        }
      </div>
    `;
  }

  
  const skillsTab = document.getElementById("skills");
  if (skillsTab && character.skills) {
    skillsTab.innerHTML = `
      <div class="skills-grid">
        ${character.skills
          .map(
            (skill) => `
          <div class="skill-card">
            <div class="skill-icon">${skill.icon}</div>
            <h4>${skill.name}</h4>
            <p class="skill-type">${skill.type}</p>
            <p class="skill-description">${skill.description}</p>
            <div class="skill-bonus">${skill.bonus}</div>
          </div>
        `,
          )
          .join("")}
      </div>
    `;
  }
}
async function loadCharacterProfile() {
  console.log("loadCharacterProfile called - optimized version");

  const urlParams = new URLSearchParams(window.location.search);
  const characterId = urlParams.get("id");
  console.log("characterId from URL:", characterId);

  if (!characterId) {
    displayError(
      "No Character Selected",
      "Please select a character from the codex to view their profile.",
      "codex.html",
    );
    return;
  }

  
  console.log("Checking GameState availability:", !!window.GameState);
  console.log("GameState object:", window.GameState);

  if (!window.GameState) {
    console.error("GameState not found on window object");
    displayError(
      "Loading Error",
      "Game state not loaded. Please refresh the page and try again.",
    );
    return;
  }

  try {
    
    showLoadingIndicator();
    console.log("Loading indicator shown");

    
    console.log("Attempting to load basic character data...");
    const basicCharacter =
      await window.GameState.getBasicCharacter(characterId);
    console.log("Basic character loaded:", basicCharacter);

    if (!basicCharacter) {
      displayError(
        "Character Not Found",
        `Character "${characterId}" does not exist in our database.`,
        "codex.html",
      );
      return;
    }

    
    console.log("Applying character theme and creating layout...");
    applyCharacterTheme(basicCharacter.colorScheme, characterId);
    createFloatingElements(basicCharacter);
    renderBasicCharacterProfile(basicCharacter);

    
    console.log("Loading detailed character data...");
    const detailedCharacter = await window.GameState.getCharacter(characterId);
    console.log("Detailed character loaded:", detailedCharacter);

    if (detailedCharacter) {
      
      console.log("Rendering complete character profile...");
      renderCharacterProfile(detailedCharacter);
    } else {
      console.log("No detailed character data, keeping basic profile");
    }

    setupTabSwitching();
    hideLoadingIndicator();

    
    showNotification(`${basicCharacter.name} profile loaded successfully!`);
  } catch (error) {
    console.error("Error loading character:", error);
    displayError(
      "Loading Error",
      "Failed to load character data. Please check your connection and try again.",
    );
    hideLoadingIndicator();
  }
}
function displayError(title, message, backLink = null) {
  const backLinkHtml = backLink
    ? `
    <div class="error-actions">
      <a href="${backLink}" class="error-button">← Back to Codex</a>
      <button onclick="location.reload()" class="error-button">Try Again</button>
    </div>
  `
    : `
    <div class="error-actions">
      <button onclick="location.reload()" class="error-button">Try Again</button>
    </div>
  `;

  document.getElementById("profile-content").innerHTML = `
    <div class="error-container">
      <div class="error-icon">⚠️</div>
      <h2 class="error-title">${title}</h2>
      <p class="error-message">${message}</p>
      ${backLinkHtml}
    </div>
  `;
}
function setupTabSwitching() {
  const tabs = document.querySelectorAll(".profile-tab");
  const sections = document.querySelectorAll(".tab-section");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      
      tabs.forEach((t) => t.classList.remove("active"));
      sections.forEach((s) => s.classList.remove("active"));

      
      tab.classList.add("active");

      
      const targetTab = tab.getAttribute("data-tab");
      const targetSection = document.getElementById(`tab-${targetTab}`);

      if (targetSection) {
        targetSection.classList.add("active");

        
        if (window.innerWidth <= 768) {
          targetSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }

      
      if ("vibrate" in navigator) {
        navigator.vibrate(50);
      }

      
      if (window.playSound) {
        window.playSound("tab-switch");
      }
    });
  });

  
  tabs.forEach((tab, index) => {
    tab.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" && index > 0) {
        tabs[index - 1].focus();
        tabs[index - 1].click();
      } else if (e.key === "ArrowRight" && index < tabs.length - 1) {
        tabs[index + 1].focus();
        tabs[index + 1].click();
      }
    });
  });
}
function renderOverviewTab(character) {
  return `
    <div class="profile-section">
      <div class="profile-header">
        <div class="profile-image-container">
          <img src="${character.image}" alt="${character.name}" class="profile-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="profile-portrait-fallback">${character.portrait}</div>
        </div>
        <h1 class="profile-name">${character.name}</h1>
        <div class="character-details">
          <p class="profile-race">Species: ${character.race}</p>
          <p class="profile-role">Role: ${character.role}</p>
          <div class="profile-power">Classification: ${character.power}</div>
        </div>
        <div class="character-summary-card">
          <div class="summary-header">
            <h3>📚 Character Synopsis</h3>
          </div>
          <div class="summary-content">
            <p class="character-synopsis">${character.lore}</p>
            ${
              character.backstory
                ? `
            <div class="key-facts">
              <h4>Key Background</h4>
              <p>${character.backstory}</p>
            </div>
            `
                : ""
            }
          </div>
        </div>
      </div>
      <div class="quick-facts-grid">
        <div class="fact-card primary-info">
          <div class="fact-icon">🎭</div>
          <div class="fact-content">
            <h4>Character Archetype</h4>
            <p>${character.role}</p>
            <span class="fact-detail">Primary function in narrative</span>
          </div>
        </div>
        <div class="fact-card species-info">
          <div class="fact-icon">🧬</div>
          <div class="fact-content">
            <h4>Species Classification</h4>
            <p>${character.race}</p>
            <span class="fact-detail">Biological/magical origin</span>
          </div>
        </div>
        <div class="fact-card power-info">
          <div class="fact-icon">⚡</div>
          <div class="fact-content">
            <h4>Power Classification</h4>
            <p>${character.power}</p>
            <span class="fact-detail">Threat/capability assessment</span>
          </div>
        </div>
        ${
          character.specialties
            ? `
        <div class="fact-card specialties-info">
          <div class="fact-icon">⭐</div>
          <div class="fact-content">
            <h4>Core Specializations</h4>
            <div class="specialty-tags-compact">
              ${character.specialties
                .slice(0, 3)
                .map(
                  (specialty) =>
                    `<span class="specialty-tag-small">${specialty}</span>`,
                )
                .join("")}
            </div>
            <span class="fact-detail">${character.specialties.length} total specializations</span>
          </div>
        </div>
        `
            : ""
        }
      </div>
      <div class="character-significance">
        <h3>📖 Narrative Significance</h3>
        <div class="significance-content">
          <div class="significance-text">
            <p>This character represents a crucial element in the Jura-Tempest Federation's complex political and social structure. Their unique background, abilities, and relationships contribute to the rich tapestry of this fantasy world's development.</p>
          </div>
          ${
            character.achievements
              ? `
          <div class="achievements-showcase">
            <h4>🏆 Notable Contributions</h4>
            <div class="achievements-grid">
              ${character.achievements
                .slice(0, 4)
                .map(
                  (achievement) => `
                <div class="achievement-item">
                  <div class="achievement-icon">🌟</div>
                  <div class="achievement-text">${achievement}</div>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
          `
              : ""
          }
        </div>
      </div>
    </div>
  `;
}
function renderBiographyTab(character) {
  return `
    <div class="profile-section">
      <h3>📜 Detailed Biography</h3>
      <div class="biography-timeline">
        ${
          character.evolution
            ? `
        <div class="bio-section evolution-section">
          <h4>🔄 Character Development Arc</h4>
          <div class="timeline">
            ${character.evolution
              .map(
                (stage, index) => `
              <div class="timeline-item ${index === character.evolution.length - 1 ? "current" : ""}">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <div class="timeline-title">${stage.form}</div>
                  <div class="timeline-description">${stage.description}</div>
                  ${stage.trigger ? `<div class="timeline-trigger">Catalyst: ${stage.trigger}</div>` : ""}
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
        `
            : ""
        }
        ${
          character.personality
            ? `
        <div class="bio-section personality-section">
          <h4>🎭 Psychological Profile</h4>
          <div class="personality-analysis">
            <p>${character.personality}</p>
          </div>
        </div>
        `
            : ""
        }
        ${
          character.weaknesses
            ? `
        <div class="bio-section challenges-section">
          <h4>⚠️ Character Limitations & Growth Areas</h4>
          <div class="challenges-list">
            ${character.weaknesses
              .map(
                (weakness) => `
              <div class="challenge-item">
                <div class="challenge-icon">🔍</div>
                <div class="challenge-text">${weakness}</div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
        `
            : ""
        }
        ${
          character.quotes
            ? `
        <div class="bio-section quotes-section">
          <h4>💬 Defining Moments & Quotes</h4>
          <div class="quotes-showcase">
            ${character.quotes
              .map(
                (quote, index) => `
              <div class="quote-card" onclick="highlightQuote(${index})">
                <div class="quote-mark">"</div>
                <div class="quote-content">
                  <div class="quote-text">${quote.text}</div>
                  <div class="quote-context">— ${quote.context}</div>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
        `
            : ""
        }
      </div>
    </div>
  `;
}
function renderWorldbuildingTab(character) {
  return `
    <div class="profile-section">
      <h3>🌍 Worldbuilding Analysis</h3>
      <div class="worldbuilding-grid">
        ${
          character.philosophy
            ? `
        <div class="worldbuilding-card philosophy">
          <div class="worldbuilding-header">
            <div class="worldbuilding-icon">🧠</div>
            <h4>Philosophy & Ideology</h4>
          </div>
          <div class="worldbuilding-content">
            <p>${character.philosophy}</p>
          </div>
        </div>
        `
            : ""
        }
        ${
          character.leadershipStyle
            ? `
        <div class="worldbuilding-card leadership">
          <div class="worldbuilding-header">
            <div class="worldbuilding-icon">👑</div>
            <h4>Leadership Style</h4>
          </div>
          <div class="worldbuilding-content">
            <p>${character.leadershipStyle}</p>
          </div>
        </div>
        `
            : ""
        }
        ${
          character.worldInfluence
            ? `
        <div class="worldbuilding-card influence">
          <div class="worldbuilding-header">
            <div class="worldbuilding-icon">🌐</div>
            <h4>Long-term World Influence</h4>
          </div>
          <div class="worldbuilding-content">
            <p>${character.worldInfluence}</p>
          </div>
        </div>
        `
            : ""
        }
        ${
          character.alternateScenario
            ? `
        <div class="worldbuilding-card alternate">
          <div class="worldbuilding-header">
            <div class="worldbuilding-icon">🔮</div>
            <h4>Alternate Timeline: "If Rimuru Didn't Exist"</h4>
          </div>
          <div class="worldbuilding-content">
            <p>${character.alternateScenario}</p>
          </div>
        </div>
        `
            : ""
        }
      </div>
      ${
        character.philosophy ||
        character.leadershipStyle ||
        character.worldInfluence ||
        character.alternateScenario
          ? `
      <div class="worldbuilding-summary">
        <div class="summary-card">
          <h4>📚 Museum-Grade Analysis</h4>
          <p>This character profile represents a comprehensive worldbuilding analysis, examining not just what ${character.name} does, but how they think, lead, and shape the world around them. These insights reveal the deeper narrative threads that make the Jura-Tempest Federation universe so rich and interconnected.</p>
        </div>
      </div>
      `
          : `
      <div class="worldbuilding-placeholder">
        <div class="placeholder-content">
          <div class="placeholder-icon">🏗️</div>
          <h4>Worldbuilding Analysis Coming Soon</h4>
          <p>Detailed philosophical, leadership, and world influence analysis for ${character.name} is being developed. Check back soon for museum-grade worldbuilding content!</p>
        </div>
      </div>
      `
      }
    </div>
  `;
}
function renderSkillsTab(character) {
  return `
    <div class="profile-section">
      <h3>⚔️ Abilities & Capabilities Analysis</h3>
      <div class="skills-dashboard">
        <div class="dashboard-header">
          <h4>📊 Capability Assessment</h4>
          <p>Comprehensive analysis of documented abilities and their applications</p>
        </div>
        <div class="skill-categories-overview">
          <div class="category-stat">
            <div class="category-icon">⚔️</div>
            <div class="category-info">
              <span class="category-count">${character.skills.filter((s) => s.type === "Combat").length}</span>
              <span class="category-label">Combat Techniques</span>
            </div>
          </div>
          <div class="category-stat">
            <div class="category-icon">✨</div>
            <div class="category-info">
              <span class="category-count">${character.skills.filter((s) => s.type === "Magic").length}</span>
              <span class="category-label">Magical Arts</span>
            </div>
          </div>
          <div class="category-stat">
            <div class="category-icon">🛡️</div>
            <div class="category-info">
              <span class="category-count">${character.skills.filter((s) => s.type === "Support").length}</span>
              <span class="category-label">Support Abilities</span>
            </div>
          </div>
          <div class="category-stat">
            <div class="category-icon">👑</div>
            <div class="category-info">
              <span class="category-count">${character.skills.filter((s) => s.type === "Leadership").length}</span>
              <span class="category-label">Leadership Skills</span>
            </div>
          </div>
        </div>
      </div>
      <div class="skills-detailed-analysis">
        <h4>🔍 Detailed Capability Breakdown</h4>
        <div class="skills-grid-enhanced">
          ${character.skills
            .map(
              (skill) => `
            <div class="skill-analysis-card ${skill.type.toLowerCase()}">
              <div class="skill-header">
                <div class="skill-icon-large">${skill.icon}</div>
                <div class="skill-meta">
                  <h5 class="skill-name">${skill.name}</h5>
                  <span class="skill-category">${skill.type} Ability</span>
                </div>
              </div>
              <div class="skill-description-detailed">
                <p>${skill.description}</p>
              </div>
              <div class="skill-applications">
                <div class="application-tag">
                  <span class="application-label">Primary Effect:</span>
                  <span class="application-value">${skill.bonus}</span>
                </div>
              </div>
              <div class="skill-analysis-footer">
                <div class="skill-rarity">
                  <span class="rarity-indicator ${skill.type.toLowerCase()}"></span>
                  <span class="rarity-text">${skill.type} Classification</span>
                </div>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
      <div class="capability-summary">
        <h4>📋 Strategic Assessment Summary</h4>
        <div class="summary-grid">
          <div class="summary-item combat-summary">
            <h5>⚔️ Combat Effectiveness</h5>
            <p>Demonstrates ${character.skills.filter((s) => s.type === "Combat").length > 3 ? "exceptional" : character.skills.filter((s) => s.type === "Combat").length > 1 ? "competent" : "basic"} combat capabilities with diverse tactical applications.</p>
          </div>
          <div class="summary-item magic-summary">
            <h5>✨ Magical Proficiency</h5>
            <p>Shows ${character.skills.filter((s) => s.type === "Magic").length > 3 ? "masterful" : character.skills.filter((s) => s.type === "Magic").length > 1 ? "skilled" : "limited"} command over magical forces and supernatural abilities.</p>
          </div>
          <div class="summary-item support-summary">
            <h5>🛡️ Support Capabilities</h5>
            <p>Provides ${character.skills.filter((s) => s.type === "Support").length > 2 ? "extensive" : character.skills.filter((s) => s.type === "Support").length > 0 ? "valuable" : "minimal"} support functions to allies and organizations.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}
function renderRelationshipsTab(character) {
  return `
    <div class="profile-section">
      <h3>🤝 Social Connections & Relationships</h3>
      <div class="relationship-network-overview">
        <div class="network-header">
          <h4>🌐 Social Network Analysis</h4>
          <p>Mapping the complex web of relationships that define this character's place in society</p>
        </div>
        ${
          character.relationships
            ? `
        <div class="relationships-analysis-grid">
          ${
            character.relationships.allies
              ? `
          <div class="relationship-category-enhanced allies-category">
            <div class="category-header">
              <div class="category-icon">👥</div>
              <div class="category-info">
                <h5>Allied Relationships</h5>
                <span class="category-count">${character.relationships.allies.length} connections</span>
              </div>
            </div>
            <div class="relationship-network">
              ${character.relationships.allies
                .map(
                  (ally) => `
                <div class="relationship-node ally-node">
                  <div class="node-connector"></div>
                  <div class="node-content">
                    <span class="relationship-name">${ally}</span>
                    <span class="relationship-type">Ally</span>
                  </div>
                </div>
              `,
                )
                .join("")}
            </div>
            <div class="category-analysis">
              <p>Strong cooperative bonds that enhance mutual capabilities and shared objectives.</p>
            </div>
          </div>
          `
              : ""
          }
          ${
            character.relationships.rivals
              ? `
          <div class="relationship-category-enhanced rivals-category">
            <div class="category-header">
              <div class="category-icon">⚔️</div>
              <div class="category-info">
                <h5>Competitive Relationships</h5>
                <span class="category-count">${character.relationships.rivals.length} connections</span>
              </div>
            </div>
            <div class="relationship-network">
              ${character.relationships.rivals
                .map(
                  (rival) => `
                <div class="relationship-node rival-node">
                  <div class="node-connector"></div>
                  <div class="node-content">
                    <span class="relationship-name">${rival}</span>
                    <span class="relationship-type">Rival</span>
                  </div>
                </div>
              `,
                )
                .join("")}
            </div>
            <div class="category-analysis">
              <p>Competitive dynamics that drive personal growth and strategic development.</p>
            </div>
          </div>
          `
              : ""
          }
          ${
            character.relationships.mentors
              ? `
          <div class="relationship-category-enhanced mentors-category">
            <div class="category-header">
              <div class="category-icon">🎓</div>
              <div class="category-info">
                <h5>Mentorship Connections</h5>
                <span class="category-count">${character.relationships.mentors.length} connections</span>
              </div>
            </div>
            <div class="relationship-network">
              ${character.relationships.mentors
                .map(
                  (mentor) => `
                <div class="relationship-node mentor-node">
                  <div class="node-connector"></div>
                  <div class="node-content">
                    <span class="relationship-name">${mentor}</span>
                    <span class="relationship-type">Mentor</span>
                  </div>
                </div>
              `,
                )
                .join("")}
            </div>
            <div class="category-analysis">
              <p>Guidance relationships that shape character development and skill acquisition.</p>
            </div>
          </div>
          `
              : ""
          }
        </div>
        `
            : `
        <div class="no-relationships-enhanced">
          <div class="no-relationships-icon">🔍</div>
          <h4>Limited Relationship Data</h4>
          <p>Detailed relationship information for this character is currently being researched and documented. Check back for updates as more social connections are discovered and verified.</p>
        </div>
        `
        }
      </div>
      <div class="social-impact-analysis">
        <h4>📊 Social Influence Assessment</h4>
        <div class="influence-metrics">
          <div class="influence-metric">
            <div class="metric-header">
              <span class="metric-label">Network Reach</span>
              <span class="metric-value">${character.relationships ? Object.values(character.relationships).flat().length : 0}</span>
            </div>
            <div class="metric-description">Total documented social connections</div>
          </div>
          <div class="influence-metric">
            <div class="metric-header">
              <span class="metric-label">Relationship Diversity</span>
              <span class="metric-value">${character.relationships ? Object.keys(character.relationships).length : 0}</span>
            </div>
            <div class="metric-description">Different types of social bonds</div>
          </div>
          <div class="influence-metric">
            <div class="metric-header">
              <span class="metric-label">Social Integration</span>
              <span class="metric-value">${character.relationships ? "High" : "Developing"}</span>
            </div>
            <div class="metric-description">Level of community involvement</div>
          </div>
        </div>
      </div>
      <div class="relationship-insights">
        <h4>🔍 Relationship Pattern Analysis</h4>
        <div class="insights-grid">
          <div class="insight-card cooperation-insight">
            <div class="insight-icon">🤝</div>
            <div class="insight-content">
              <h5>Cooperation Patterns</h5>
              <p>Demonstrates ${character.relationships?.allies?.length > 2 ? "strong collaborative tendencies" : character.relationships?.allies?.length > 0 ? "selective cooperation" : "independent operation"} in social and professional contexts.</p>
            </div>
          </div>
          <div class="insight-card conflict-insight">
            <div class="insight-icon">⚡</div>
            <div class="insight-content">
              <h5>Conflict Resolution</h5>
              <p>Shows ${character.relationships?.rivals?.length > 1 ? "complex competitive dynamics" : character.relationships?.rivals?.length === 1 ? "focused rivalry" : "minimal conflict engagement"} in challenging situations.</p>
            </div>
          </div>
          <div class="insight-card growth-insight">
            <div class="insight-icon">📈</div>
            <div class="insight-content">
              <h5>Personal Development</h5>
              <p>Benefits from ${character.relationships?.mentors?.length > 0 ? "established mentorship relationships" : "self-directed learning"} in skill and character development.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
function renderCulturalTab(character) {
  return `
    <div class="profile-section">
      <h3>🏛️ Cultural & Societal Impact</h3>
      <div class="cultural-impact-analysis">
        <div class="impact-header">
          <h4>📈 Measurable Contributions to Society</h4>
          <p>Quantitative and qualitative assessment of this character's influence on the Jura-Tempest Federation's development</p>
        </div>
        <div class="impact-metrics-grid">
          <div class="impact-metric population-impact">
            <div class="metric-icon">👥</div>
            <div class="metric-content">
              <div class="metric-value">+${character.impact.population}</div>
              <div class="metric-label">Population Growth</div>
              <div class="metric-description">Citizens attracted or protected</div>
              <div class="metric-bar">
                <div class="metric-fill" style="width: ${Math.min(character.impact.population / 50, 100)}%"></div>
              </div>
            </div>
          </div>
          <div class="impact-metric military-impact">
            <div class="metric-icon">⚔️</div>
            <div class="metric-content">
              <div class="metric-value">+${character.impact.military}%</div>
              <div class="metric-label">Military Strength</div>
              <div class="metric-description">Defense capability enhancement</div>
              <div class="metric-bar">
                <div class="metric-fill" style="width: ${Math.min(character.impact.military * 2, 100)}%"></div>
              </div>
            </div>
          </div>
          <div class="impact-metric economic-impact">
            <div class="metric-icon">💰</div>
            <div class="metric-content">
              <div class="metric-value">+${character.impact.economy}%</div>
              <div class="metric-label">Economic Growth</div>
              <div class="metric-description">Trade and prosperity boost</div>
              <div class="metric-bar">
                <div class="metric-fill" style="width: ${Math.min(character.impact.economy * 2, 100)}%"></div>
              </div>
            </div>
          </div>
          <div class="impact-metric magical-impact">
            <div class="metric-icon">✨</div>
            <div class="metric-content">
              <div class="metric-value">+${character.impact.magic}%</div>
              <div class="metric-label">Magical Development</div>
              <div class="metric-description">Arcane knowledge advancement</div>
              <div class="metric-bar">
                <div class="metric-fill" style="width: ${Math.min(character.impact.magic * 2, 100)}%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="historical-significance">
        <h4>📚 Historical Context & Legacy</h4>
        <div class="significance-analysis">
          <div class="significance-card primary-legacy">
            <div class="significance-icon">🏛️</div>
            <div class="significance-content">
              <h5>Primary Historical Role</h5>
              <p>This character serves as a ${character.role.toLowerCase()} within the Federation's complex social hierarchy, contributing to the nation's stability and growth through their unique capabilities and perspective.</p>
            </div>
          </div>
          <div class="significance-card cultural-influence">
            <div class="significance-icon">🎭</div>
            <div class="significance-content">
              <h5>Cultural Influence</h5>
              <p>Their presence has shaped cultural norms and expectations within the Federation, particularly regarding ${character.race.toLowerCase()} integration and ${character.role.toLowerCase()} responsibilities in society.</p>
            </div>
          </div>
          <div class="significance-card future-implications">
            <div class="significance-icon">🔮</div>
            <div class="significance-content">
              <h5>Future Implications</h5>
              <p>The long-term impact of their contributions will likely influence Federation policy, inter-species relations, and the development of new governmental structures for generations to come.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="character-assessment">
        <h4>📊 Comprehensive Character Assessment</h4>
        <div class="assessment-categories">
          <div class="assessment-item leadership-assessment">
            <div class="assessment-header">
              <span class="assessment-label">Leadership Capability</span>
              <div class="assessment-stars">
                ${generateStarRating(calculateStrategicRating(character))}
              </div>
            </div>
            <div class="assessment-description">
              Ability to guide, inspire, and coordinate others in achieving common goals
            </div>
          </div>
          <div class="assessment-item innovation-assessment">
            <div class="assessment-header">
              <span class="assessment-label">Innovation & Adaptability</span>
              <div class="assessment-stars">
                ${generateStarRating(calculateCombatRating(character))}
              </div>
            </div>
            <div class="assessment-description">
              Capacity for creative problem-solving and adaptation to new challenges
            </div>
          </div>
          <div class="assessment-item social-assessment">
            <div class="assessment-header">
              <span class="assessment-label">Social Integration</span>
              <div class="assessment-stars">
                ${generateStarRating(calculateEconomicRating(character))}
              </div>
            </div>
            <div class="assessment-description">
              Success in building relationships and contributing to community cohesion
            </div>
          </div>
        </div>
      </div>
      <div class="museum-info-panel">
        <div class="panel-header">
          <h4>🏛️ Curator's Notes</h4>
        </div>
        <div class="panel-content">
          <p><strong>Historical Period:</strong> Post-Founding Era of the Jura-Tempest Federation</p>
          <p><strong>Cultural Context:</strong> Multi-species democratic federation with emphasis on cooperation and mutual growth</p>
          <p><strong>Significance:</strong> Representative of the Federation's inclusive approach to governance and society-building</p>
          <p><strong>Research Notes:</strong> This profile represents ongoing research into the complex social dynamics of the Federation's diverse population.</p>
        </div>
      </div>
    </div>
  `;
}
function applyCharacterTheme(colorScheme, characterId) {
  if (!colorScheme) return;

  const root = document.documentElement;
  root.style.setProperty("--character-primary", colorScheme.primary);
  root.style.setProperty("--character-secondary", colorScheme.secondary);

  
  const backgroundElement = document.getElementById("character-background");
  if (backgroundElement) {
    backgroundElement.className = "character-background";
    backgroundElement.classList.add(`character-${characterId}`);
  }
}
function setupTabSwitching() {
  const tabs = document.querySelectorAll(".profile-tab");
  const sections = document.querySelectorAll(".tab-section");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetTab = tab.getAttribute("data-tab");

      
      tabs.forEach((t) => t.classList.remove("active"));
      sections.forEach((s) => s.classList.remove("active"));

      
      tab.classList.add("active");
      const targetSection = document.getElementById(`tab-${targetTab}`);
      if (targetSection) {
        targetSection.classList.add("active");
      }

      
      if (window.soundEnabled && window.SoundFeedback) {
        window.SoundFeedback.playEffect("click");
      }
    });
  });
}
function createFloatingElements(character) {
  const container = document.getElementById("floating-elements");
  if (!container) return;

  
  container.innerHTML = "";

  
  const elementTypes = {
    rimuru: ["💧", "🌊", "✨", "🔮"],
    benimaru: ["🔥", "⚡", "🗡️", "💥"],
    shion: ["⚔️", "💜", "🛡️", "⭐"],
    shuna: ["🌸", "🎨", "✨", "🌺"],
    diablo: ["😈", "🌀", "💀", "🔮"],
    veldora: ["🐉", "⚡", "🌪️", "👑"],
    milim: ["⚡", "🐲", "💥", "🌟"],
    guy: ["🩸", "👑", "💀", "🔥"],
    luminous: ["🦇", "✨", "🌙", "💎"],
    leon: ["❄️", "☀️", "⚔️", "✨"],
  };

  const elements = elementTypes[character.id] || ["✨", "⭐", "🌟", "💫"];

  
  for (let i = 0; i < 8; i++) {
    const element = document.createElement("div");
    element.className = "floating-element";
    element.textContent = elements[Math.floor(Math.random() * elements.length)];
    element.style.left = Math.random() * 100 + "%";
    element.style.animationDelay = Math.random() * 10 + "s";
    element.style.animationDuration = 15 + Math.random() * 10 + "s";
    container.appendChild(element);
  }
}
function generateStarRating(rating) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push('<span class="star filled">★</span>');
  }

  if (hasHalfStar) {
    stars.push('<span class="star half">☆</span>');
  }

  const remainingStars = 5 - Math.ceil(rating);
  for (let i = 0; i < remainingStars; i++) {
    stars.push('<span class="star empty">☆</span>');
  }

  return stars.join("");
}
function calculateCombatRating(character) {
  const combatSkills = character.skills.filter(
    (s) => s.type === "Combat",
  ).length;
  const powerLevel =
    character.power === "Catastrophe+"
      ? 5
      : character.power === "Catastrophe"
        ? 4.5
        : character.power === "Special S"
          ? 4
          : character.power === "A-Rank"
            ? 3
            : 2;

  return Math.min(5, combatSkills * 0.8 + powerLevel * 0.6);
}
function calculateStrategicRating(character) {
  const leadershipSkills = character.skills.filter(
    (s) => s.type === "Leadership",
  ).length;
  const supportSkills = character.skills.filter(
    (s) => s.type === "Support",
  ).length;
  const militaryImpact = character.impact.military / 10;

  return Math.min(
    5,
    leadershipSkills * 1.2 + supportSkills * 0.8 + militaryImpact * 0.3,
  );
}
function calculateEconomicRating(character) {
  const craftingSkills = character.skills.filter(
    (s) => s.type === "Crafting",
  ).length;
  const economicImpact = character.impact.economy / 10;
  const populationImpact = character.impact.population / 500;

  return Math.min(
    5,
    craftingSkills * 1.5 + economicImpact * 0.4 + populationImpact * 0.3,
  );
}
function highlightQuote(index) {
  const quoteCards = document.querySelectorAll(".quote-card");
  if (quoteCards[index]) {
    quoteCards.forEach((card) => card.classList.remove("highlighted"));
    quoteCards[index].classList.add("highlighted");

    setTimeout(() => {
      quoteCards[index].classList.remove("highlighted");
    }, 3000);
  }
}
function setupTabSwitching() {
  const tabs = document.querySelectorAll(".profile-tab");
  const sections = document.querySelectorAll(".tab-section");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      
      tabs.forEach((t) => t.classList.remove("active"));
      sections.forEach((s) => s.classList.remove("active"));

      
      tab.classList.add("active");

      
      const targetTab = tab.getAttribute("data-tab");
      const targetSection = document.getElementById(`tab-${targetTab}`);

      if (targetSection) {
        targetSection.classList.add("active");

        
        if (window.innerWidth <= 768) {
          targetSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }

      
      if ("vibrate" in navigator) {
        navigator.vibrate(50);
      }

      
      if (window.playSound) {
        window.playSound("tab-switch");
      }
    });
  });

  
  tabs.forEach((tab, index) => {
    tab.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" && index > 0) {
        tabs[index - 1].focus();
        tabs[index - 1].click();
      } else if (e.key === "ArrowRight" && index < tabs.length - 1) {
        tabs[index + 1].focus();
        tabs[index + 1].click();
      }
    });
  });
}
function applyCharacterTheme(colorScheme, characterId) {
  if (!colorScheme) return;

  const root = document.documentElement;
  const background = document.getElementById("character-background");

  
  root.style.setProperty("--character-primary", colorScheme.primary);
  root.style.setProperty("--character-secondary", colorScheme.secondary);
  root.style.setProperty("--character-glow", colorScheme.glow);

  
  if (background) {
    background.className = `character-background ${characterId}`;
  }

  
  document.title = `${characterId.charAt(0).toUpperCase() + characterId.slice(1)} - Character Profile`;
}
function createFloatingElements(character) {
  const container = document.getElementById("floating-elements");
  if (!container) return;

  
  const isMobile = window.innerWidth <= 768;
  const particleCount = isMobile ? 3 : 6;

  
  container.innerHTML = "";

  
  for (let i = 0; i < particleCount; i++) {
    const element = document.createElement("div");
    element.className = "floating-element";
    element.textContent = character.portrait || "✨";
    element.style.left = Math.random() * 100 + "%";
    element.style.animationDelay = Math.random() * 20 + "s";
    element.style.animationDuration = 15 + Math.random() * 10 + "s";
    container.appendChild(element);
  }
}
function highlightQuote(index) {
  const quotes = document.querySelectorAll(".quote-card");

  
  quotes.forEach((quote) => quote.classList.remove("highlighted"));

  
  if (quotes[index]) {
    quotes[index].classList.add("highlighted");

    
    if ("vibrate" in navigator) {
      navigator.vibrate(100);
    }

    
    if (window.playSound) {
      window.playSound("quote-select");
    }

    
    setTimeout(() => {
      quotes[index].classList.remove("highlighted");
    }, 3000);
  }
}
function shareCharacter() {
  const urlParams = new URLSearchParams(window.location.search);
  const characterId = urlParams.get("id");
  const url = window.location.href;

  if (navigator.share) {
    navigator
      .share({
        title: `${characterId} - Character Profile`,
        text: `Check out this character profile from the Jura Tempest Federation!`,
        url: url,
      })
      .catch(console.error);
  } else {
    
    navigator.clipboard
      .writeText(url)
      .then(() => {
        showNotification("Profile link copied to clipboard!");
      })
      .catch(() => {
        showNotification("Unable to copy link");
      });
  }
}
function compareCharacter() {
  
  showNotification("Character comparison feature coming soon!");
}
function downloadProfile() {
  showNotification("Profile download feature coming soon!");
}
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, var(--primary-blue), var(--accent-cyan));
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(77, 212, 255, 0.3);
    z-index: 10000;
    animation: slideInRight 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease-out";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}
function renderCharacterProfile(character) {
  console.log("Rendering complete character profile for:", character.name);

  const content = document.getElementById("profile-content");
  if (!content) {
    console.error("profile-content element not found!");
    return;
  }

  
  content.innerHTML = `
    <div class="profile-header">
      <div class="profile-image-container">
        <img src="${character.image}" alt="${character.name}" class="profile-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="profile-portrait-fallback" style="display: none;">${character.portrait}</div>
      </div>
      <h1 class="profile-name">${character.name}</h1>
      <div class="character-details">
        <p class="profile-race">Species: ${character.race}</p>
        <p class="profile-role">Role: ${character.role}</p>
        <div class="profile-power">Classification: ${character.power}</div>
      </div>
    </div>

    <div class="tab-section active" id="tab-overview">
      <div class="profile-section">
        <h3>📚 Character Overview</h3>
        ${character.lore ? `<p>${character.lore}</p>` : "<p>Character lore information is being compiled.</p>"}

        ${
          character.backstory
            ? `
          <h3>📖 Background</h3>
          <p>${character.backstory}</p>
        `
            : ""
        }

        ${
          character.personality
            ? `
          <h3>🎭 Personality</h3>
          <p>${character.personality}</p>
        `
            : ""
        }
      </div>
    </div>

    <div class="tab-section" id="tab-biography">
      <div class="profile-section">
        <h3>📜 Detailed Biography</h3>
        ${
          character.philosophy
            ? `
          <h4>🧠 Philosophy & Beliefs</h4>
          <p>${character.philosophy}</p>
        `
            : ""
        }

        ${
          character.leadershipStyle
            ? `
          <h4>👑 Leadership Style</h4>
          <p>${character.leadershipStyle}</p>
        `
            : ""
        }

        ${
          character.worldInfluence
            ? `
          <h4>🌍 World Influence</h4>
          <p>${character.worldInfluence}</p>
        `
            : ""
        }

        ${
          character.alternateScenario
            ? `
          <h4>⚠️ Alternate Scenario</h4>
          <p>${character.alternateScenario}</p>
        `
            : ""
        }

        ${
          character.quotes && character.quotes.length > 0
            ? `
          <h4>💬 Notable Quotes</h4>
          <div class="quotes-container">
            ${character.quotes
              .map(
                (quote) => `
              <div class="quote-item">
                <p class="quote-text">"${quote.text}"</p>
                <p class="quote-context">— ${quote.context}</p>
              </div>
            `,
              )
              .join("")}
          </div>
        `
            : "<p>Biographical details are being researched and documented.</p>"
        }
      </div>
    </div>

    <div class="tab-section" id="tab-skills">
      <div class="profile-section">
        <h3>⚔️ Abilities & Skills</h3>
        ${
          character.skills && character.skills.length > 0
            ? `
          <div class="skills-grid">
            ${character.skills
              .map(
                (skill) => `
              <div class="skill-card-detailed">
                <div class="skill-card-header">
                  <div class="skill-card-icon">${skill.icon}</div>
                  <div class="skill-card-info">
                    <h4 class="skill-card-name">${skill.name}</h4>
                    <span class="skill-card-type">${skill.type}</span>
                  </div>
                </div>
                <p class="skill-card-description">${skill.description}</p>
                <div class="skill-card-bonus">${skill.bonus}</div>
              </div>
            `,
              )
              .join("")}
          </div>
        `
            : "<p>Skill analysis and documentation in progress.</p>"
        }

        ${
          character.specialties && character.specialties.length > 0
            ? `
          <div class="specialties-section">
            <h4>🌟 Specialties</h4>
            <div class="specialties-list">
              ${character.specialties
                .map(
                  (specialty) => `
                <span class="specialty-badge">${specialty}</span>
              `,
                )
                .join("")}
            </div>
          </div>
        `
            : ""
        }

        ${
          character.weaknesses && character.weaknesses.length > 0
            ? `
          <div class="weaknesses-section">
            <h4>⚠️ Weaknesses</h4>
            <ul class="weaknesses-list">
              ${character.weaknesses
                .map(
                  (weakness) => `
                <li>${weakness}</li>
              `,
                )
                .join("")}
            </ul>
          </div>
        `
            : ""
        }
      </div>
    </div>

    <div class="tab-section" id="tab-relationships">
      <div class="profile-section">
        <h3>🤝 Relationships</h3>
        ${
          character.relationships
            ? `
          <div class="relationships-grid">
            ${
              character.relationships.allies
                ? `
              <div class="relationship-category">
                <h4 class="relationship-title allies">👥 Allies</h4>
                <div class="relationship-list">
                  ${character.relationships.allies
                    .map(
                      (ally) => `
                    <div class="relationship-item ally">
                      <span class="relationship-name">${ally}</span>
                    </div>
                  `,
                    )
                    .join("")}
                </div>
              </div>
            `
                : ""
            }

            ${
              character.relationships.rivals
                ? `
              <div class="relationship-category">
                <h4 class="relationship-title rivals">⚔️ Rivals</h4>
                <div class="relationship-list">
                  ${character.relationships.rivals
                    .map(
                      (rival) => `
                    <div class="relationship-item rival">
                      <span class="relationship-name">${rival}</span>
                    </div>
                  `,
                    )
                    .join("")}
                </div>
              </div>
            `
                : ""
            }

            ${
              character.relationships.mentors
                ? `
              <div class="relationship-category">
                <h4 class="relationship-title mentors">🎓 Mentors</h4>
                <div class="relationship-list">
                  ${character.relationships.mentors
                    .map(
                      (mentor) => `
                    <div class="relationship-item mentor">
                      <span class="relationship-name">${mentor}</span>
                    </div>
                  `,
                    )
                    .join("")}
                </div>
              </div>
            `
                : ""
            }
          </div>
        `
            : "<p>Relationship data is being compiled and verified.</p>"
        }
      </div>
    </div>

    <div class="tab-section" id="tab-worldbuilding">
      <div class="profile-section">
        <h3>🌍 Character Analysis</h3>
        ${
          character.achievements && character.achievements.length > 0
            ? `
          <h4>🏆 Achievements</h4>
          <ul class="achievements-list">
            ${character.achievements
              .map(
                (achievement) => `
              <li>${achievement}</li>
            `,
              )
              .join("")}
          </ul>
        `
            : ""
        }

        ${
          character.evolution && character.evolution.length > 0
            ? `
          <h4>🔄 Evolution Forms</h4>
          <div class="evolution-timeline">
            ${character.evolution
              .map(
                (form, index) => `
              <div class="evolution-form">
                <div class="evolution-order">${index + 1}</div>
                <div class="evolution-content">
                  <h5>${form.form}</h5>
                  <p class="evolution-description">${form.description}</p>
                  <span class="evolution-trigger">Trigger: ${form.trigger}</span>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        `
            : ""
        }

        ${
          character.impact
            ? `
          <h4>📊 Federation Impact Stats</h4>
          <div class="impact-stats">
            <div class="stat-box">
              <div class="stat-icon">👥</div>
              <div class="stat-label">Population Impact</div>
              <div class="stat-value">${character.impact.population}%</div>
              <div class="stat-bar-container">
                <div class="stat-bar" style="--fill-width: ${character.impact.population}%"></div>
              </div>
            </div>
            <div class="stat-box">
              <div class="stat-icon">⚔️</div>
              <div class="stat-label">Military Strength</div>
              <div class="stat-value">${character.impact.military}%</div>
              <div class="stat-bar-container">
                <div class="stat-bar" style="--fill-width: ${character.impact.military}%"></div>
              </div>
            </div>
            <div class="stat-box">
              <div class="stat-icon">💰</div>
              <div class="stat-label">Economy Growth</div>
              <div class="stat-value">${character.impact.economy}%</div>
              <div class="stat-bar-container">
                <div class="stat-bar" style="--fill-width: ${character.impact.economy}%"></div>
              </div>
            </div>
            <div class="stat-box">
              <div class="stat-icon">✨</div>
              <div class="stat-label">Magic Development</div>
              <div class="stat-value">${character.impact.magic}%</div>
              <div class="stat-bar-container">
                <div class="stat-bar" style="--fill-width: ${character.impact.magic}%"></div>
              </div>
            </div>
          </div>
        `
            : ""
        }
      </div>
    </div>

    <div class="tab-section" id="tab-cultural">
      <div class="profile-section">
        <h3>🏛️ Cultural Impact</h3>
        ${
          character.worldInfluence
            ? `
          <p>${character.worldInfluence}</p>
        `
            : "<p>Cultural impact analysis is being compiled.</p>"
        }
      </div>
    </div>
  `;
}
