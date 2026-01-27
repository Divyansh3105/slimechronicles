document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
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

function displayError(title, message, backLink = null) {
  const backLinkHtml = backLink
    ? `
    <div class="error-actions">
      <a href="${backLink}" class="error-button">← Back to Codex</a>
      <button onclick="location.reload()" class="error-button">🔄 Try Again</button>
      <button onclick="attemptErrorRecovery()" class="error-button">🛠️ Auto-Fix</button>
    </div>
  `
    : `
    <div class="error-actions">
      <button onclick="location.reload()" class="error-button">🔄 Try Again</button>
      <button onclick="attemptErrorRecovery()" class="error-button">🛠️ Auto-Fix</button>
      <a href="codex.html" class="error-button">📚 Browse Characters</a>
    </div>
  `;

  const content = document.getElementById("profile-content");
  if (content) {
    content.innerHTML = `
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <h2 class="error-title">${title}</h2>
        <p class="error-message">${message}</p>
        <div class="error-details">
          <details>
            <summary>🔍 Technical Details</summary>
            <div class="tech-details">
              <p><strong>URL:</strong> ${window.location.href}</p>
              <p><strong>Character ID:</strong> ${new URLSearchParams(window.location.search).get('id') || 'None'}</p>
              <p><strong>GameState:</strong> ${!!window.GameState ? 'Available' : 'Missing'}</p>
              <p><strong>CharacterLoader:</strong> ${!!window.CharacterLoader ? 'Available' : 'Missing'}</p>
              <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            </div>
          </details>
        </div>
        ${backLinkHtml}
      </div>
    `;
  }
}

function renderBasicCharacterProfile(character) {
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

    <div class="loading-details" style="text-align: center; padding: 2rem; opacity: 0.7;">
      <div class="loading-spinner"></div>
      <p>Loading detailed character information...</p>
    </div>
  `;
}

function renderCharacterProfile(character) {
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

async function loadCharacterProfile() {
  const urlParams = new URLSearchParams(window.location.search);
  const characterId = urlParams.get("id");
  if (!characterId) {
    displayError(
      "No Character Selected",
      "Please select a character from the codex to view their profile.",
      "codex.html",
    );
    return;
  }

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
    const basicCharacter =
      await window.GameState.getBasicCharacter(characterId);

    if (!basicCharacter) {
      displayError(
        "Character Not Found",
        `Character "${characterId}" does not exist in our database.`,
        "codex.html",
      );
      return;
    }

    applyCharacterTheme(basicCharacter.colorScheme, characterId);
    createFloatingElements(basicCharacter);
    renderBasicCharacterProfile(basicCharacter);

    const detailedCharacter = await window.GameState.getCharacter(characterId);

    if (detailedCharacter) {
      renderCharacterProfile(detailedCharacter);
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

// Enhanced error recovery
function attemptErrorRecovery() {
  if (window.GameState) {
    window.GameState.clearCharacterCache();
  }

  const firstTab = document.querySelector('.profile-tab');
  if (firstTab) {
    firstTab.click();
  }

  showNotification('System recovered. Please try again.');
}

// Initialize enhancements
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      const tabs = document.querySelectorAll('.profile-tab');
      tabs.forEach((tab, index) => {
        tab.setAttribute('tabindex', '0');
        tab.addEventListener('keydown', (e) => {
          switch(e.key) {
            case 'Enter':
            case ' ':
              e.preventDefault();
              tab.click();
              break;
            case 'ArrowLeft':
              e.preventDefault();
              const prevTab = tabs[index - 1] || tabs[tabs.length - 1];
              prevTab.focus();
              prevTab.click();
              break;
            case 'ArrowRight':
              e.preventDefault();
              const nextTab = tabs[index + 1] || tabs[0];
              nextTab.focus();
              nextTab.click();
              break;
          }
        });
      });
    }, 1000);
  });
}
