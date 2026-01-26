
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
function setupTabSwitching() {
  console.log("Setting up tab switching...");

  const tabs = document.querySelectorAll(".profile-tab");
  const sections = document.querySelectorAll(".tab-section");

  console.log("Found tabs:", tabs.length);
  console.log("Found sections:", sections.length);

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      console.log("Tab clicked:", tab.getAttribute("data-tab"));


      tabs.forEach((t) => t.classList.remove("active"));
      sections.forEach((s) => s.classList.remove("active"));


      tab.classList.add("active");


      const targetTab = tab.getAttribute("data-tab");
      const targetSection = document.getElementById(`tab-${targetTab}`);

      console.log("Target section:", targetTab, !!targetSection);

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

  console.log("Tab switching setup complete");
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
function shareCharacter() {
  const urlParams = new URLSearchParams(window.location.search);
  const characterId = urlParams.get("id");

  if (navigator.share) {
    navigator.share({
      title: `${characterId} - Character Profile`,
      text: `Check out this character profile from the Jura Tempest Federation!`,
      url: window.location.href
    }).then(() => {
      showNotification("Character profile shared successfully!");
    }).catch(() => {
      fallbackShare();
    });
  } else {
    fallbackShare();
  }
}

function fallbackShare() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showNotification("Profile link copied to clipboard!");
    }).catch(() => {
      showNotification("Unable to copy link. Please copy manually from address bar.");
    });
  } else {
    showNotification("Share feature not supported. Copy the URL from address bar.");
  }
}

function compareCharacter() {
  showComparisonModal();
}

function showComparisonModal() {
  const modal = document.createElement('div');
  modal.className = 'comparison-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Compare Characters</h3>
        <button class="modal-close" onclick="closeComparisonModal()">&times;</button>
      </div>
      <div class="modal-body">
        <p>Select a character to compare with:</p>
        <div class="character-selector" id="character-selector">
          <div class="loading-spinner"></div>
          <p>Loading characters...</p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  loadCharacterSelector();

  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeComparisonModal();
    }
  });
}

function closeComparisonModal() {
  const modal = document.querySelector('.comparison-modal');
  if (modal) {
    modal.remove();
  }
}

async function loadCharacterSelector() {
  const selector = document.getElementById('character-selector');
  if (!selector || !window.GameState) return;

  try {
    const characters = await window.GameState.getAllBasicCharacters();
    const currentCharacterId = new URLSearchParams(window.location.search).get("id");

    selector.innerHTML = characters
      .filter(char => char.id !== currentCharacterId)
      .map(char => `
        <div class="selector-item" onclick="compareWithCharacter('${char.id}')">
          <img src="${char.image}" alt="${char.name}" onerror="this.style.display='none'">
          <span>${char.name}</span>
        </div>
      `).join('');
  } catch (error) {
    selector.innerHTML = '<p>Error loading characters for comparison.</p>';
  }
}

function compareWithCharacter(compareId) {
  closeComparisonModal();
  showNotification(`Comparison with ${compareId} feature coming soon!`);
}

function downloadProfile() {
  const urlParams = new URLSearchParams(window.location.search);
  const characterId = urlParams.get("id");

  if (!characterId) {
    showNotification("No character selected for download.");
    return;
  }

  // Create a simplified version of the profile for download
  const profileContent = document.getElementById('profile-content');
  if (!profileContent) {
    showNotification("Profile content not found.");
    return;
  }

  const characterName = document.querySelector('.profile-name')?.textContent || characterId;
  const timestamp = new Date().toISOString().split('T')[0];

  // Create downloadable content
  const downloadContent = `
# ${characterName} - Character Profile
Generated on: ${timestamp}
Source: Jura Tempest Federation Database

${extractTextContent(profileContent)}

---
Generated by Jura Tempest Federation Character Database
Visit: ${window.location.origin}
  `.trim();

  // Create and trigger download
  const blob = new Blob([downloadContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${characterId}-profile-${timestamp}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showNotification(`${characterName} profile downloaded successfully!`);
}

function extractTextContent(element) {
  // Extract meaningful text content while preserving structure
  const textContent = [];
  const sections = element.querySelectorAll('.tab-section.active .profile-section, .profile-header');

  sections.forEach(section => {
    const headings = section.querySelectorAll('h1, h2, h3, h4');
    const paragraphs = section.querySelectorAll('p');
    const lists = section.querySelectorAll('ul, ol');

    headings.forEach(h => {
      textContent.push(`\n## ${h.textContent.trim()}\n`);
    });

    paragraphs.forEach(p => {
      const text = p.textContent.trim();
      if (text && !text.includes('Loading') && !text.includes('coming soon')) {
        textContent.push(text + '\n');
      }
    });

    lists.forEach(list => {
      const items = list.querySelectorAll('li');
      items.forEach(item => {
        textContent.push(`- ${item.textContent.trim()}`);
      });
      textContent.push('\n');
    });
  });

  return textContent.join('\n').replace(/\n{3,}/g, '\n\n');
}

// Enhanced Interactive Features
function addAdvancedInteractivity() {
  // Add hover effects for stat cards
  const statCards = document.querySelectorAll('.stat-card-interactive, .info-card, .skill-card-detailed');
  statCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (window.playSound) {
        window.playSound('hover');
      }

      // Add subtle vibration on mobile
      if ('vibrate' in navigator && window.innerWidth <= 768) {
        navigator.vibrate(10);
      }
    });
  });

  // Add click effects for interactive elements
  const interactiveElements = document.querySelectorAll('.relationship-item, .quote-item, .evolution-content');
  interactiveElements.forEach(element => {
    element.addEventListener('click', (e) => {
      // Create ripple effect
      createRippleEffect(e.target, e.clientX, e.clientY);

      if (window.playSound) {
        window.playSound('click');
      }
    });
  });

  // Add keyboard navigation for tabs
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
}

function createRippleEffect(element, x, y) {
  const rect = element.getBoundingClientRect();
  const ripple = document.createElement('div');
  const size = Math.max(rect.width, rect.height);

  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background: rgba(77, 212, 255, 0.3);
    transform: scale(0);
    animation: ripple 0.6s linear;
    left: ${x - rect.left - size / 2}px;
    top: ${y - rect.top - size / 2}px;
    width: ${size}px;
    height: ${size}px;
    pointer-events: none;
    z-index: 1000;
  `;

  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  element.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Enhanced scroll animations
function addScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');

        // Animate progress bars
        const progressBars = entry.target.querySelectorAll('.progress-fill, .meter-fill, .impact-fill');
        progressBars.forEach(bar => {
          const width = bar.style.getPropertyValue('--fill-width') || bar.getAttribute('data-width');
          if (width) {
            setTimeout(() => {
              bar.style.width = width;
            }, 200);
          }
        });

        // Animate counters
        const counters = entry.target.querySelectorAll('.stat-value, .impact-value, .record-number');
        counters.forEach(counter => {
          animateCounter(counter);
        });
      }
    });
  }, observerOptions);

  // Observe all animatable elements
  const animatableElements = document.querySelectorAll('.info-card, .skill-card-detailed, .relationship-category, .evolution-content, .stat-card-interactive');
  animatableElements.forEach(el => observer.observe(el));
}

function animateCounter(element) {
  const target = parseInt(element.textContent.replace(/\D/g, ''));
  if (isNaN(target)) return;

  const duration = 2000;
  const start = performance.now();
  const startValue = 0;

  function updateCounter(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(startValue + (target - startValue) * easeOutQuart);

    element.textContent = element.textContent.replace(/\d+/, current);

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }

  requestAnimationFrame(updateCounter);
}

// Enhanced theme switching
function enhanceThemeSystem() {
  const urlParams = new URLSearchParams(window.location.search);
  const characterId = urlParams.get("id");

  if (!characterId) return;

  // Apply character-specific enhancements
  const characterEnhancements = {
    rimuru: {
      particles: ['💧', '✨', '🌊'],
      sounds: ['water', 'magic'],
      effects: ['slime-bounce']
    },
    diablo: {
      particles: ['🔥', '⚡', '👹'],
      sounds: ['dark-magic', 'thunder'],
      effects: ['shadow-pulse']
    },
    milim: {
      particles: ['💥', '⚡', '🌟'],
      sounds: ['explosion', 'energy'],
      effects: ['energy-burst']
    },
    veldora: {
      particles: ['⚡', '🐉', '💨'],
      sounds: ['thunder', 'roar'],
      effects: ['storm-swirl']
    }
  };

  const enhancement = characterEnhancements[characterId];
  if (enhancement) {
    // Update floating particles
    updateFloatingParticles(enhancement.particles);

    // Add character-specific effects
    enhancement.effects.forEach(effect => {
      document.body.classList.add(effect);
    });
  }
}

function updateFloatingParticles(particles) {
  const container = document.getElementById('floating-elements');
  if (!container) return;

  const existingElements = container.querySelectorAll('.floating-element');
  existingElements.forEach((element, index) => {
    if (particles[index % particles.length]) {
      element.textContent = particles[index % particles.length];
    }
  });
}

// Performance monitoring
function initPerformanceMonitoring() {
  if ('performance' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.entryType === 'measure' && entry.duration > 100) {
          console.warn(`Slow operation detected: ${entry.name} took ${entry.duration}ms`);
        }
      });
    });

    observer.observe({ entryTypes: ['measure'] });
  }
}

// Enhanced error handling
function setupErrorHandling() {
  window.addEventListener('error', (event) => {
    console.error('Character page error:', event.error);

    // Show user-friendly error message
    if (!document.querySelector('.error-container')) {
      showNotification('An error occurred. Please refresh the page if issues persist.');
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
  });
}

// Initialize all enhancements
function initializeEnhancements() {
  console.log('Initializing character page enhancements...');

  // Add CSS for animations
  if (!document.querySelector('#enhancement-styles')) {
    const style = document.createElement('style');
    style.id = 'enhancement-styles';
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }

      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }

      .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
      }

      .slime-bounce {
        animation: slimeBounce 3s ease-in-out infinite;
      }

      @keyframes slimeBounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
      }

      .shadow-pulse .character-background::before {
        animation: shadowPulse 4s ease-in-out infinite;
      }

      @keyframes shadowPulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 0.7; }
      }

      .energy-burst .floating-element {
        animation: energyBurst 2s ease-in-out infinite;
      }

      @keyframes energyBurst {
        0%, 100% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.2) rotate(180deg); }
      }

      .storm-swirl .particles {
        animation: stormSwirl 8s linear infinite;
      }

      @keyframes stormSwirl {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  // Initialize all enhancement systems
  setTimeout(() => {
    addAdvancedInteractivity();
    addScrollAnimations();
    enhanceThemeSystem();
    initPerformanceMonitoring();
    setupErrorHandling();

    console.log('Character page enhancements initialized successfully');
  }, 500);
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeEnhancements);
} else {
  initializeEnhancements();
}
// Floating Action Menu Functions
function toggleFabMenu() {
  const fabMenu = document.getElementById('fab-menu');
  const fabMainIcon = document.getElementById('fab-main-icon');

  if (fabMenu && fabMainIcon) {
    const isActive = fabMenu.classList.contains('active');

    if (isActive) {
      fabMenu.classList.remove('active');
      fabMainIcon.textContent = '⚡';
      fabMainIcon.style.transform = 'rotate(0deg)';
    } else {
      fabMenu.classList.add('active');
      fabMainIcon.textContent = '✕';
      fabMainIcon.style.transform = 'rotate(45deg)';
    }

    // Add haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }

    // Play sound effect
    if (window.playSound) {
      window.playSound('menu-toggle');
    }
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  // Close FAB menu
  const fabMenu = document.getElementById('fab-menu');
  if (fabMenu) {
    fabMenu.classList.remove('active');
    document.getElementById('fab-main-icon').textContent = '⚡';
    document.getElementById('fab-main-icon').style.transform = 'rotate(0deg)';
  }

  showNotification('Scrolled to top!');
}

function toggleTheme() {
  const body = document.body;
  const currentTheme = body.getAttribute('data-theme') || 'default';

  // Cycle through themes
  const themes = ['default', 'dark', 'high-contrast', 'sepia'];
  const currentIndex = themes.indexOf(currentTheme);
  const nextIndex = (currentIndex + 1) % themes.length;
  const nextTheme = themes[nextIndex];

  body.setAttribute('data-theme', nextTheme);
  localStorage.setItem('character-theme', nextTheme);

  // Close FAB menu
  const fabMenu = document.getElementById('fab-menu');
  if (fabMenu) {
    fabMenu.classList.remove('active');
    document.getElementById('fab-main-icon').textContent = '⚡';
    document.getElementById('fab-main-icon').style.transform = 'rotate(0deg)';
  }

  showNotification(`Theme changed to ${nextTheme}!`);
}

// Auto-hide FAB menu when clicking outside
document.addEventListener('click', (e) => {
  const fabContainer = document.getElementById('floating-action-menu');
  const fabMenu = document.getElementById('fab-menu');

  if (fabContainer && fabMenu && !fabContainer.contains(e.target)) {
    if (fabMenu.classList.contains('active')) {
      fabMenu.classList.remove('active');
      document.getElementById('fab-main-icon').textContent = '⚡';
      document.getElementById('fab-main-icon').style.transform = 'rotate(0deg)';
    }
  }
});

// Auto-hide FAB menu on scroll
let scrollTimeout;
window.addEventListener('scroll', () => {
  const fabMenu = document.getElementById('fab-menu');

  if (fabMenu && fabMenu.classList.contains('active')) {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      fabMenu.classList.remove('active');
      document.getElementById('fab-main-icon').textContent = '⚡';
      document.getElementById('fab-main-icon').style.transform = 'rotate(0deg)';
    }, 1000);
  }
});

// Load saved theme on page load
function loadSavedTheme() {
  const savedTheme = localStorage.getItem('character-theme');
  if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
  }
}

// Initialize theme system
document.addEventListener('DOMContentLoaded', loadSavedTheme);

// Additional utility functions for enhanced functionality
function highlightQuote(index) {
  const quotes = document.querySelectorAll('.quote-item');
  if (quotes[index]) {
    quotes[index].style.background = 'linear-gradient(135deg, rgba(77, 212, 255, 0.2), rgba(21, 27, 61, 0.6))';
    quotes[index].style.borderColor = 'var(--primary-blue)';

    setTimeout(() => {
      quotes[index].style.background = '';
      quotes[index].style.borderColor = '';
    }, 2000);

    if (window.playSound) {
      window.playSound('quote-highlight');
    }
  }
}

// Enhanced tab switching with better error handling
function switchToTab(tabName) {
  const tabs = document.querySelectorAll('.profile-tab');
  const sections = document.querySelectorAll('.tab-section');

  // Remove active class from all tabs and sections
  tabs.forEach(tab => tab.classList.remove('active'));
  sections.forEach(section => section.classList.remove('active'));

  // Find and activate the target tab
  const targetTab = document.querySelector(`[data-tab="${tabName}"]`);
  const targetSection = document.getElementById(`tab-${tabName}`);

  if (targetTab && targetSection) {
    targetTab.classList.add('active');
    targetSection.classList.add('active');

    // Scroll to section on mobile
    if (window.innerWidth <= 768) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    return true;
  }

  console.warn(`Tab "${tabName}" not found`);
  return false;
}

// Enhanced character data validation
function validateCharacterData(character) {
  const required = ['id', 'name', 'race', 'role', 'power'];
  const missing = required.filter(field => !character[field]);

  if (missing.length > 0) {
    console.warn('Character missing required fields:', missing);
    return false;
  }

  return true;
}

// Performance monitoring for character loading
function measurePerformance(operation, fn) {
  const start = performance.now();
  const result = fn();
  const end = performance.now();

  console.log(`${operation} took ${(end - start).toFixed(2)}ms`);

  if (end - start > 100) {
    console.warn(`Slow operation detected: ${operation}`);
  }

  return result;
}

// Enhanced error recovery
function attemptErrorRecovery() {
  console.log('Attempting error recovery...');

  // Clear any corrupted cache
  if (window.GameState) {
    window.GameState.clearCharacterCache();
  }

  // Reset to default tab
  const firstTab = document.querySelector('.profile-tab');
  if (firstTab) {
    firstTab.click();
  }

  // Show recovery notification
  showNotification('System recovered. Please try again.');
}

// Accessibility enhancements
function enhanceAccessibility() {
  // Add ARIA labels to interactive elements
  const tabs = document.querySelectorAll('.profile-tab');
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', tab.classList.contains('active'));
    tab.setAttribute('tabindex', tab.classList.contains('active') ? '0' : '-1');
  });

  // Add keyboard navigation hints
  const fabMenu = document.getElementById('floating-action-menu');
  if (fabMenu) {
    fabMenu.setAttribute('aria-label', 'Quick actions menu');
  }

  // Enhance focus management
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close any open modals or menus
      closeComparisonModal();
      const fabMenu = document.getElementById('fab-menu');
      if (fabMenu && fabMenu.classList.contains('active')) {
        toggleFabMenu();
      }
    }
  });
}

// Initialize accessibility enhancements
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(enhanceAccessibility, 1000);
});

// Debug utilities for development
window.characterPageDebug = {
  getState: () => ({
    gameState: !!window.GameState,
    characterLoader: !!window.CharacterLoader,
    currentCharacter: new URLSearchParams(window.location.search).get('id'),
    activeTab: document.querySelector('.profile-tab.active')?.getAttribute('data-tab'),
    loadedSections: document.querySelectorAll('.tab-section').length,
    cacheStats: window.GameState?.getPerformanceStats?.() || 'N/A'
  }),

  switchTab: switchToTab,

  reloadCharacter: () => {
    const characterId = new URLSearchParams(window.location.search).get('id');
    if (characterId) {
      window.location.reload();
    } else {
      console.warn('No character ID in URL');
    }
  },

  clearCache: () => {
    if (window.GameState) {
      window.GameState.clearCharacterCache();
      showNotification('Cache cleared successfully');
    }
  }
};
