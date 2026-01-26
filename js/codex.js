
let currentFilter = 'all';
let searchTerm = '';
let currentView = 'grid';
let raceFilter = '';
let powerFilter = '';
let isMobile = window.innerWidth <= 768;
const characterDescriptions = {
  'rimuru': 'The founder and leader of the Jura Tempest Federation. Originally a human who was reincarnated as a slime, Rimuru possesses the unique ability to absorb and mimic other creatures\' abilities.',
  'diablo': 'One of the most powerful demons in existence, serving as Rimuru\'s secretary and loyal subordinate. Known for his unwavering devotion and terrifying combat abilities.',
  'shion': 'Rimuru\'s devoted secretary and bodyguard. An Oni with incredible physical strength and an unfortunate tendency to destroy things while trying to help.',
  'benimaru': 'The military commander of the Jura Tempest Federation. A skilled strategist and powerful warrior who leads the Federation\'s armed forces.',
  'shuna': 'Benimaru\'s sister and the Federation\'s head of domestic affairs. Known for her gentle nature, exceptional cooking skills, and mastery of barrier magic.',
  'souei': 'The head of intelligence and espionage for the Federation. A master of stealth and information gathering with shadow manipulation abilities.',
  'hakuro': 'An elderly swordsman and master instructor. Despite his age, he remains one of the most skilled combatants in the Federation.',
  'ranga': 'Rimuru\'s loyal companion and mount. A Tempest Wolf with incredible speed and the ability to manipulate storms and lightning.',
  'gobta': 'A goblin warrior known for his luck and unexpected moments of competence. Often serves as comic relief but has proven surprisingly capable in battle.',
  'rigurd': 'The village chief and one of Rimuru\'s first named monsters. A hobgoblin who handles much of the Federation\'s administrative duties.',
  'milim': 'One of the oldest and most powerful Demon Lords. Despite her childlike appearance and personality, she possesses devastating destructive power.',
  'veldora': 'A True Dragon and Rimuru\'s sworn friend. Known as the "Storm Dragon," he was sealed for centuries before being freed by Rimuru.',
  'guy': 'The oldest Demon Lord and one of the most powerful beings in existence. Rules over the frozen continent and maintains the balance of power among Demon Lords.',
  'leon': 'A Demon Lord who rules over the Holy Empire of Ruberios. Known for his pride and powerful magic abilities.',
  'luminous': 'The Demon Lord who rules over the Holy Empire of Ruberios alongside Leon. A vampire with incredible regenerative abilities and light magic.',
  'ramiris': 'The Fairy Queen and a former Demon Lord. Despite her small size and childlike demeanor, she possesses ancient wisdom and powerful magic.',
  'carrion': 'The Beast King and ruler of the Animal Kingdom of Eurazania. A powerful beastman with incredible physical abilities.',
  'frey': 'The Sky Queen and ruler of the Harpy Kingdom. Known for her aerial combat abilities and wind magic.',
  'clayman': 'A former Demon Lord known for his scheming and manipulation. Often considered one of the weaker Demon Lords in terms of direct combat.',
  'dagruel': 'The Giant King and one of the oldest Demon Lords. Possesses immense physical strength and rules over the giants.',
  'dino': 'The Sleeping Ruler, known for his laziness despite being incredibly powerful. Prefers to avoid conflict and sleep.',
  'zelanus': 'A powerful angel serving under the True Dragon Veldanava. Known for his unwavering loyalty and divine magic.',
  'feldway': 'A high-ranking angel with incredible power and authority. Serves as one of the primary antagonists in later conflicts.',
  'michael': 'An archangel with immense power and influence. Plays a significant role in the cosmic balance of the world.',
  'gabriel': 'An archangel known for divine magic and healing abilities. Often works alongside other angels in maintaining order.',
  'raphael': 'An archangel with analytical abilities and strategic thinking. Often provides guidance and support in complex situations.',
  'uriel': 'An archangel with powerful defensive and protective abilities. Known for creating barriers and shields.',
  'raguel': 'An archangel focused on justice and punishment. Often involved in judging and executing divine will.',
  'sariel': 'An archangel with unique abilities related to death and rebirth. Plays a complex role in the cosmic order.',
  'adalmann': 'A powerful undead mage who serves Rimuru. Originally an enemy, he became a loyal subordinate after being defeated.',
  'apito': 'A bee-type monster with incredible speed and agility. Serves as a scout and messenger for the Federation.',
  'beretta': 'A doll-type golem created by Ramiris. Possesses incredible defensive abilities and serves as Ramiris\'s protector.',
  'carrera': 'One of the three Primordial Demons summoned by Rimuru. Known for her destructive tendencies and explosive magic.',
  'testarossa': 'The eldest of the three Primordial Demons. Possesses incredible intelligence and strategic thinking abilities.',
  'ultima': 'The youngest of the three Primordial Demons. Known for her playful nature and powerful combat abilities.',
  'zegion': 'An insect-type monster who serves as one of Rimuru\'s most powerful subordinates. Possesses incredible combat abilities.',
  'kumara': 'A nine-tailed fox with powerful illusion and fire magic. Serves as one of Rimuru\'s trusted companions.',
  'gabiru': 'A lizardman warrior known for his enthusiasm and loyalty. Often overestimates his abilities but has a good heart.',
  'geld': 'A former orc lord who now serves Rimuru. Handles much of the Federation\'s construction and infrastructure projects.',
  'hinata': 'A powerful human warrior and leader of the Western Holy Church\'s crusaders. Initially an enemy but later becomes an ally.',
  'yuuki': 'A former otherworlder with powerful abilities. Plays a complex role as both ally and antagonist throughout the series.',
  'chloe': 'A mysterious individual with time manipulation abilities. Her true nature and origins are shrouded in mystery.',
  'gazef': 'A skilled human warrior and knight. Known for his honor and dedication to protecting others.',
  'velgrynd': 'A True Dragon known as the "Scorch Dragon." Possesses incredible fire-based abilities and ancient wisdom.',
  'velzard': 'A True Dragon known as the "Frost Dragon." The oldest of the True Dragons with ice manipulation abilities.'
};

const characterAbilities = {
  'rimuru': ['Predator', 'Great Sage', 'Storm Magic', 'Spatial Magic', 'Mimicry'],
  'diablo': ['Temptation', 'Death Magic', 'Spatial Magic', 'Illusion Magic', 'Demon Summoning'],
  'shion': ['Hercules', 'Cook', 'Thought Acceleration', 'Analytical Appraisal', 'Spatial Motion'],
  'benimaru': ['Hell Flare', 'Black Lightning', 'Samurai Spirit', 'Strategic Thinking', 'Fire Magic'],
  'shuna': ['Analyst', 'Barrier Magic', 'Cooking', 'Thread Manipulation', 'Spatial Magic'],
  'souei': ['Shadow Motion', 'Stealth', 'Information Analysis', 'Clone', 'Assassination Arts'],
  'hakuro': ['Swordsmanship', 'Iaido', 'Teaching', 'Battle Instinct', 'Weapon Mastery'],
  'ranga': ['Storm Magic', 'Lightning Speed', 'Pack Leadership', 'Howling', 'Wind Manipulation'],
  'milim': ['Drago Nova', 'Milim Eye', 'Dragon Spirit Haki', 'Stampede', 'Destruction Magic'],
  'veldora': ['Storm Magic', 'Probability Manipulation', 'Investigator', 'Manga Otaku', 'Dragon Roar'],
  'guy': ['Frost Magic', 'Absolute Zero', 'Prideful King', 'Strategic Mind', 'Ice Manipulation'],
  'leon': ['Disintegration', 'Spatial Domination', 'Prideful King', 'Light Magic', 'Barrier Magic'],
  'luminous': ['Vampire', 'Regeneration', 'Light Magic', 'Blood Magic', 'Immortality'],
  'ramiris': ['Labyrinth Creation', 'Fairy Magic', 'Dimensional Magic', 'Ancient Wisdom', 'Spirit Magic'],
  'carrion': ['Beast Transformation', 'Physical Enhancement', 'Pack Leadership', 'Roar', 'Claw Arts'],
  'clayman': ['Marionette Master', 'Doll Creation', 'Mind Control', 'Scheming', 'Manipulation'],
  'dagruel': ['Colossal Strength', 'Earth Magic', 'Giant Transformation', 'Earthquake', 'Rock Manipulation'],
  'adalmann': ['Death Magic', 'Undead Summoning', 'Bone Magic', 'Curse Magic', 'Necromancy'],
  'zegion': ['Absolute Defense', 'Spatial Domination', 'Insect Magic', 'Hive Mind', 'Evolution'],
  'carrera': ['Nuclear Magic', 'Explosion Magic', 'Destruction', 'Atomic Manipulation', 'Energy Blast'],
  'testarossa': ['Death Magic', 'Strategic Mind', 'Analytical Thinking', 'Curse Magic', 'Intelligence'],
  'ultima': ['Poison Magic', 'Insect Magic', 'Playful Combat', 'Toxin Creation', 'Swarm Control']
};
async function updateStatistics() {
  if (!window.GameState) {
    console.error('GameState not available for statistics');
    return;
  }

  try {
    console.log('Updating statistics...');

    
    const totalCharacters = await window.GameState.getCharacterCount();
    console.log('Total characters:', totalCharacters);

    const totalElement = document.getElementById('total-characters');
    if (totalElement) {
      totalElement.textContent = totalCharacters;
    }

    
    const characters = await window.GameState.getAllCharacters();
    if (!characters) {
      console.error('No characters returned for statistics');
      return;
    }

    console.log('Characters for statistics:', characters.length);

    
    const demonLords = characters.filter(char =>
      char.role.toLowerCase().includes('demon lord') ||
      char.power === 'Catastrophe+' ||
      char.power === 'Catastrophe'
    ).length;

    const demonLordsElement = document.getElementById('demon-lords-count');
    if (demonLordsElement) {
      demonLordsElement.textContent = demonLords;
    }

    
    const disasters = characters.filter(char =>
      char.power === 'Catastrophe+' ||
      char.power === 'Catastrophe' ||
      char.power === 'Chaos'
    ).length;

    const disastersElement = document.getElementById('disasters-count');
    if (disastersElement) {
      disastersElement.textContent = disasters;
    }

    
    const uniqueRaces = [...new Set(characters.map(char => char.race))].length;

    const racesElement = document.getElementById('races-count');
    if (racesElement) {
      racesElement.textContent = uniqueRaces;
    }

    
    const powerLevels = characters.reduce((acc, char) => {
      acc[char.power] = (acc[char.power] || 0) + 1;
      return acc;
    }, {});

    console.log('Power levels:', powerLevels);

    
    Object.entries(powerLevels).forEach(([power, count]) => {
      const element = document.getElementById(power.toLowerCase().replace('+', '-plus'));
      if (element) {
        element.textContent = count;
      }
    });

    
    populateFilterDropdowns(characters);

  } catch (error) {
    console.error('Error updating statistics:', error);
  }
}

function populateFilterDropdowns(characters) {
  const raceSelect = document.getElementById('race-filter');
  const powerSelect = document.getElementById('power-filter');

  
  const races = [...new Set(characters.map(char => char.race))].sort();
  raceSelect.innerHTML = '<option value="">All Races</option>';
  races.forEach(race => {
    const option = document.createElement('option');
    option.value = race;
    option.textContent = race;
    raceSelect.appendChild(option);
  });

  
  const powers = [...new Set(characters.map(char => char.power))].sort();
  powerSelect.innerHTML = '<option value="">All Power Levels</option>';
  powers.forEach(power => {
    const option = document.createElement('option');
    option.value = power;
    option.textContent = power;
    powerSelect.appendChild(option);
  });
}
let currentPage = 0;
const charactersPerPage = 11; 
let allCharacters = [];
let filteredCharacters = [];

async function renderCharacters() {
  const grid = document.getElementById("character-grid");

  if (!window.GameState) {
    console.error('GameState not available');
    grid.innerHTML = '<div class="no-results">GameState not loaded. Please refresh the page.</div>';
    return;
  }

  if (!window.CharacterLoader) {
    console.error('CharacterLoader not available');
    grid.innerHTML = '<div class="no-results">CharacterLoader not loaded. Please refresh the page.</div>';
    return;
  }

  try {
    
    grid.innerHTML = '<div class="loading-characters">Loading characters...</div>';

    
    console.log('Calling GameState.getAllCharacters()...');
    const characters = await window.GameState.getAllCharacters();
    console.log('GameState.getAllCharacters() returned:', characters);

    if (!characters || characters.length === 0) {
      console.error('No characters returned from GameState.getAllCharacters()');
      grid.innerHTML = '<div class="no-results">No characters found. Check console for errors.</div>';
      return;
    }

    console.log('Total characters loaded:', characters.length);
    console.log('Character names:', characters.map(c => c.name));

    allCharacters = characters;
    applyFiltersAndRender();

  } catch (error) {
    console.error('Error loading characters:', error);
    grid.innerHTML = `<div class="no-results">Failed to load characters: ${error.message}. Please refresh the page.</div>`;
  }
}

function applyFiltersAndRender() {
  console.log('applyFiltersAndRender called');
  console.log('allCharacters:', allCharacters);
  console.log('searchTerm:', searchTerm);
  console.log('currentFilter:', currentFilter);

  filteredCharacters = allCharacters.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         character.race.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         character.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterCharacter(character, currentFilter);
    const matchesRace = !raceFilter || character.race === raceFilter;
    const matchesPower = !powerFilter || character.power === powerFilter;

    return matchesSearch && matchesFilter && matchesRace && matchesPower;
  });

  console.log('filteredCharacters:', filteredCharacters);

  currentPage = 0; 
  renderCurrentPage();
  setupPagination();
}

function renderCurrentPage() {
  const grid = document.getElementById("character-grid");
  console.log('renderCurrentPage called');
  console.log('filteredCharacters length:', filteredCharacters.length);

  if (filteredCharacters.length === 0) {
    console.log('No filtered characters, showing no results message');
    grid.innerHTML = `
      <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: rgba(255, 255, 255, 0.7);">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
        <h3 style="color: var(--primary-blue); margin-bottom: 1rem;">No characters found</h3>
        <p>Try adjusting your search criteria or filters</p>
        <button onclick="clearAllFilters()" style="margin-top: 1rem; padding: 0.8rem 1.5rem; background: var(--primary-blue); color: white; border: none; border-radius: 8px; cursor: pointer;">
          Clear All Filters
        </button>
      </div>
    `;
    return;
  }

  
  const startIndex = currentPage * charactersPerPage;
  const endIndex = Math.min(startIndex + charactersPerPage, filteredCharacters.length);
  const pageCharacters = filteredCharacters.slice(startIndex, endIndex);

  console.log('Rendering characters from', startIndex, 'to', endIndex);
  console.log('pageCharacters:', pageCharacters.length, 'characters');
  console.log('Character names on this page:', pageCharacters.map(c => c.name));

  
  grid.className = `character-grid ${currentView}-view`;

  
  if (pageCharacters.length === 11) {
    grid.classList.add('eleven-cards');
  }

  
  grid.innerHTML = `
    <div class="loading-characters" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--primary-blue);">
      <div style="font-size: 2rem; margin-bottom: 1rem;">⚡</div>
      <p>Loading characters...</p>
    </div>
  `;

  
  setTimeout(() => {
    if (pageCharacters.length === 11) {
      
      const first8Cards = pageCharacters.slice(0, 8);
      const last3Cards = pageCharacters.slice(8, 11);

      const first8Html = first8Cards.map((character) => {
        try {
          const stats = {
            atk: Math.floor(Math.random() * 50) + 50,
            def: Math.floor(Math.random() * 50) + 50,
            spd: Math.floor(Math.random() * 50) + 50
          };

          const description = characterDescriptions[character.id] || 'A mysterious character with unknown origins and abilities.';
          const abilities = characterAbilities[character.id] || ['Unknown Ability'];

          const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
            } : null;
          };

          const primaryRgb = hexToRgb(character.colorScheme.primary);
          const secondaryRgb = hexToRgb(character.colorScheme.secondary);

          const cssVars = primaryRgb && secondaryRgb ? `
            --character-primary: ${character.colorScheme.primary};
            --character-secondary: ${character.colorScheme.secondary};
            --character-primary-rgb: ${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b};
            --character-secondary-rgb: ${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b};
          ` : '';

          if (currentView === 'detailed') {
            return renderDetailedCharacterCard(character, description, abilities, stats, cssVars);
          } else {
            return renderCompactCharacterCard(character, stats, cssVars);
          }
        } catch (error) {
          console.error(`Error rendering character ${character.id}:`, error);
          return `<div class="character-card error">Error loading ${character.name}</div>`;
        }
      }).join('');

      const last3Html = last3Cards.map((character) => {
        try {
          const stats = {
            atk: Math.floor(Math.random() * 50) + 50,
            def: Math.floor(Math.random() * 50) + 50,
            spd: Math.floor(Math.random() * 50) + 50
          };

          const description = characterDescriptions[character.id] || 'A mysterious character with unknown origins and abilities.';
          const abilities = characterAbilities[character.id] || ['Unknown Ability'];

          const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
            } : null;
          };

          const primaryRgb = hexToRgb(character.colorScheme.primary);
          const secondaryRgb = hexToRgb(character.colorScheme.secondary);

          const cssVars = primaryRgb && secondaryRgb ? `
            --character-primary: ${character.colorScheme.primary};
            --character-secondary: ${character.colorScheme.secondary};
            --character-primary-rgb: ${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b};
            --character-secondary-rgb: ${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b};
          ` : '';

          if (currentView === 'detailed') {
            return renderDetailedCharacterCard(character, description, abilities, stats, cssVars);
          } else {
            return renderCompactCharacterCard(character, stats, cssVars);
          }
        } catch (error) {
          console.error(`Error rendering character ${character.id}:`, error);
          return `<div class="character-card error">Error loading ${character.name}</div>`;
        }
      }).join('');

      grid.innerHTML = `
        <div class="first-eight-cards">${first8Html}</div>
        <div class="last-three-cards">${last3Html}</div>
      `;
    } else {
      
      grid.innerHTML = pageCharacters
        .map((character) => {
          try {
            const stats = {
              atk: Math.floor(Math.random() * 50) + 50,
              def: Math.floor(Math.random() * 50) + 50,
              spd: Math.floor(Math.random() * 50) + 50
            };

            const description = characterDescriptions[character.id] || 'A mysterious character with unknown origins and abilities.';
            const abilities = characterAbilities[character.id] || ['Unknown Ability'];

            const hexToRgb = (hex) => {
              const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
              return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
              } : null;
            };

            const primaryRgb = hexToRgb(character.colorScheme.primary);
            const secondaryRgb = hexToRgb(character.colorScheme.secondary);

            const cssVars = primaryRgb && secondaryRgb ? `
              --character-primary: ${character.colorScheme.primary};
              --character-secondary: ${character.colorScheme.secondary};
              --character-primary-rgb: ${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b};
              --character-secondary-rgb: ${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b};
            ` : '';

            if (currentView === 'detailed') {
              return renderDetailedCharacterCard(character, description, abilities, stats, cssVars);
            } else {
              return renderCompactCharacterCard(character, stats, cssVars);
            }
          } catch (error) {
            console.error(`Error rendering character ${character.id}:`, error);
            return `<div class="character-card error">Error loading ${character.name}</div>`;
          }
        })
        .join('');
    }

    console.log('Characters rendered to grid');

    
    addScrollAnimations();
  }, 100);
}

function renderDetailedCharacterCard(character, description, abilities, stats, cssVars) {
  return `
    <div class="character-card character-themed ${character.id === 'diablo' ? 'dark-theme' : ''}"
         style="${cssVars}" data-character-id="${character.id}">
        <div class="character-image-wrapper">
            <img src="${character.image}" alt="${character.name}" class="character-card-image"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                 loading="lazy">
            <div class="character-portrait">${character.portrait}</div>
        </div>

        <div class="character-info">
            <h3 class="character-name">${character.name}</h3>
            <p class="character-title">${character.race} - ${character.role}</p>

            <div class="character-description">
                ${description}
            </div>

            <div class="character-stats">
                <div class="stat">
                    <span class="stat-label">ATK</span>
                    <span class="stat-value">${stats.atk}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">DEF</span>
                    <span class="stat-value">${stats.def}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">SPD</span>
                    <span class="stat-value">${stats.spd}</span>
                </div>
            </div>

            <div class="character-abilities">
                <h4>Key Abilities</h4>
                <div class="abilities-list">
                    ${abilities.slice(0, 3).map(ability => `<span class="ability-tag">${ability}</span>`).join('')}
                </div>
            </div>

            <div class="character-actions">
                <button class="view-profile-btn" onclick="viewCharacter('${character.id}')">
                    View Full Profile
                </button>
            </div>
        </div>
    </div>
  `;
}

function renderCompactCharacterCard(character, stats, cssVars) {
  
  const impact = generateCharacterImpact(character);

  return `
    <div class="character-card character-themed ${character.id === 'diablo' ? 'dark-theme' : ''}"
         style="${cssVars}" data-character-id="${character.id}"
         ${isMobile ? 'ontouchstart=""' : ''}>

        <div class="character-header">
          <div class="character-power-indicator">
              ${character.power}
          </div>
          <div class="character-status-badge">
              ${character.role}
          </div>

          <div class="character-image-wrapper">
              <img src="${character.image}" alt="${character.name}" class="character-card-image"
                   onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                   loading="lazy">
              <div class="character-portrait">${character.portrait}</div>
          </div>
        </div>

        <div class="character-info">
            <h3 class="character-name">${character.name}</h3>

            <div class="character-race-role">
                <span class="character-race">${character.race}</span>
                <span class="character-role">${character.role}</span>
            </div>

            <div class="character-stats">
                <div class="stat-item">
                    <div class="stat-value">${stats.atk}</div>
                    <div class="stat-label">ATK</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.def}</div>
                    <div class="stat-label">DEF</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.spd}</div>
                    <div class="stat-label">SPD</div>
                </div>
            </div>

            <div class="character-bonuses">
                <span class="bonus-tag">${isMobile ? '⚔️' : '⚔️ +'} ${impact.military}${isMobile ? '' : '% Military'}</span>
                <span class="bonus-tag">${isMobile ? '💰' : '💰 +'} ${impact.economy}${isMobile ? '' : '% Economy'}</span>
            </div>
        </div>

        <div class="character-actions">
            <button class="view-profile-button" onclick="openCharacterProfile('${character.id}')"
                    ${isMobile ? 'ontouchstart=""' : ''}>
                ${isMobile ? '📖 Profile' : '📖 View Full Profile'}
            </button>
            <button class="view-details-button" onclick="openCharacterModal('${character.id}')"
                    ${isMobile ? 'ontouchstart=""' : ''}>
                ${isMobile ? '👁️ Quick' : '👁️ Quick View'}
            </button>
        </div>
    </div>
  `;
}
function generateCharacterImpact(character) {
  let military = 0;
  let economy = 0;

  
  switch (character.power) {
    case 'Catastrophe+':
    case 'Catastrophe':
      military = 45 + Math.floor(Math.random() * 20); 
      economy = 35 + Math.floor(Math.random() * 15); 
      break;
    case 'Chaos':
      military = 35 + Math.floor(Math.random() * 15); 
      economy = 25 + Math.floor(Math.random() * 15); 
      break;
    case 'Special S':
      military = 25 + Math.floor(Math.random() * 15); 
      economy = 30 + Math.floor(Math.random() * 15); 
      break;
    case 'A+':
      military = 20 + Math.floor(Math.random() * 10); 
      economy = 20 + Math.floor(Math.random() * 10); 
      break;
    case 'A-Rank':
      military = 15 + Math.floor(Math.random() * 10); 
      economy = 15 + Math.floor(Math.random() * 10); 
      break;
    case 'B-Rank':
      military = 10 + Math.floor(Math.random() * 8); 
      economy = 10 + Math.floor(Math.random() * 8); 
      break;
    default:
      military = 5 + Math.floor(Math.random() * 10); 
      economy = 5 + Math.floor(Math.random() * 10); 
  }

  
  const role = character.role.toLowerCase();

  
  if (role.includes('commander') || role.includes('general') || role.includes('captain') ||
      role.includes('knight') || role.includes('warrior') || role.includes('guard')) {
    military += 10;
  }

  
  if (role.includes('minister') || role.includes('secretary') || role.includes('merchant') ||
      role.includes('production') || role.includes('trade') || role.includes('administrator')) {
    economy += 15;
  }

  
  if (role.includes('leader') || role.includes('founder') || role.includes('lord') ||
      role.includes('king') || role.includes('queen') || role.includes('ruler')) {
    military += 8;
    economy += 12;
  }

  
  switch (character.id) {
    case 'rimuru':
      military = 65;
      economy = 70;
      break;
    case 'diablo':
      military = 60;
      economy = 45;
      break;
    case 'benimaru':
      military = 55;
      economy = 35;
      break;
    case 'shuna':
      military = 25;
      economy = 60;
      break;
    case 'shion':
      military = 50;
      economy = 20;
      break;
    case 'souei':
      military = 45;
      economy = 40;
      break;
    case 'milim':
      military = 70;
      economy = 25;
      break;
    case 'veldora':
      military = 65;
      economy = 30;
      break;
  }

  
  military = Math.min(military, 75);
  economy = Math.min(economy, 75);

  
  military = Math.max(military, 5);
  economy = Math.max(economy, 5);

  return { military, economy };
}

function setupPagination() {
  const totalPages = Math.ceil(filteredCharacters.length / charactersPerPage);
  let paginationContainer = document.getElementById('pagination-controls');

  if (!paginationContainer) {
    
    paginationContainer = document.createElement('div');
    paginationContainer.id = 'pagination-controls';
    paginationContainer.className = 'pagination-controls';

    const grid = document.getElementById('character-grid');
    if (grid && grid.parentNode) {
      grid.parentNode.insertBefore(paginationContainer, grid.nextSibling);
    }
  }

  if (totalPages <= 1) {
    paginationContainer.style.display = 'none';
    return;
  }

  paginationContainer.style.display = 'flex';

  const startCharacter = (currentPage * charactersPerPage) + 1;
  const endCharacter = Math.min((currentPage + 1) * charactersPerPage, filteredCharacters.length);

  paginationContainer.innerHTML = `
    <button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 0 ? 'disabled' : ''}>
      ← Previous
    </button>
    <div class="page-info">
      <span class="current-page">Page ${currentPage + 1}</span> of ${totalPages}
      <br>
      <small>Showing ${startCharacter}-${endCharacter} of ${filteredCharacters.length} characters</small>
    </div>
    <button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage >= totalPages - 1 ? 'disabled' : ''}>
      Next →
    </button>
  `;
}

function changePage(newPage) {
  const totalPages = Math.ceil(filteredCharacters.length / charactersPerPage);

  if (newPage < 0 || newPage >= totalPages) return;

  
  const grid = document.getElementById('character-grid');
  grid.style.opacity = '0.5';
  grid.style.pointerEvents = 'none';

  
  setTimeout(() => {
    currentPage = newPage;
    renderCurrentPage();
    setupPagination();

    
    grid.style.opacity = '1';
    grid.style.pointerEvents = 'auto';

    
    const codexContainer = document.querySelector('.codex-container');
    if (codexContainer) {
      codexContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 150);
}
function filterCharacter(character, filter) {
  switch (filter) {
    case 'all':
      return true;
    case 'demon-lord':
      return character.role.toLowerCase().includes('demon lord') ||
             character.power === 'Catastrophe+' ||
             character.power === 'Catastrophe';
    case 'disaster':
      return character.power === 'Catastrophe+' || character.power === 'Catastrophe';
    case 'named':
      return character.power !== 'B-Rank' && character.power !== 'A-Rank';
    default:
      return true;
  }
}

function initializeFilters() {
  const searchInput = document.getElementById('character-search');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchTerm = e.target.value;
        applyFiltersAndRender();
      }, 300);
    });
  }

  const filterTabs = document.querySelectorAll('.filter-tab');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      applyFiltersAndRender();
    });
  });

  
  const raceSelect = document.getElementById('race-filter');
  const powerSelect = document.getElementById('power-filter');

  if (raceSelect) {
    raceSelect.addEventListener('change', (e) => {
      raceFilter = e.target.value;
      applyFiltersAndRender();
    });
  }

  if (powerSelect) {
    powerSelect.addEventListener('change', (e) => {
      powerFilter = e.target.value;
      applyFiltersAndRender();
    });
  }
}
function toggleView(view) {
  currentView = view;

  
  document.querySelectorAll('.view-toggle').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-view="${view}"]`).classList.add('active');

  renderCharacters();
}

function clearAllFilters() {
  searchTerm = '';
  currentFilter = 'all';
  raceFilter = '';
  powerFilter = '';

  
  document.getElementById('character-search').value = '';
  document.getElementById('race-filter').value = '';
  document.getElementById('power-filter').value = '';

  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelector('[data-filter="all"]').classList.add('active');

  applyFiltersAndRender();
}
function openCharacterProfile(characterId) {
  try {
    if (window.SoundFeedback) {
      window.SoundFeedback.playEffect("click");
    }

    
    setTimeout(() => {
      window.location.href = `character.html?id=${encodeURIComponent(characterId)}`;
    }, 150);
  } catch (error) {
    console.error('Error navigating to character profile:', error);
    
    window.location.href = `character.html?id=${encodeURIComponent(characterId)}`;
  }
}

async function openCharacterModal(characterId) {
  if (!window.GameState) return;

  try {
    const characters = await window.GameState.getAllCharacters();
    const character = characters.find(c => c.id === characterId);
    if (!character) return;

  
  const impact = generateCharacterImpact(character);

  const modal = document.getElementById('character-modal');
  const modalBody = document.getElementById('modal-body');

  const description = characterDescriptions[character.id] || 'A mysterious character with unknown origins and abilities.';
  const abilities = characterAbilities[character.id] || ['Unknown Ability'];

  
  const modalContent = `
    <div class="modal-character-header">
      <div class="modal-character-image">
        <img src="${character.image}" alt="${character.name}"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" loading="lazy">
        <div class="character-portrait" style="display: none; font-size: 3rem; align-items: center; justify-content: center; width: 100%; height: 100%; position: absolute; top: 0; left: 0;">${character.portrait}</div>
      </div>

      <div class="modal-character-info">
        <h2>${character.name}</h2>
        <div class="modal-character-subtitle">${character.race} • ${character.role}</div>
        <div class="modal-power-badge">${character.power}</div>
      </div>
    </div>

    <div class="modal-section">
      <h3>📖 Description</h3>
      <div class="modal-description">${description}</div>
    </div>

    <div class="modal-section">
      <h3>✨ Key Abilities</h3>
      <div class="modal-abilities">
        ${abilities.map(ability => `
          <span class="modal-ability-tag">${ability}</span>
        `).join('')}
      </div>
    </div>

    <div class="modal-section">
      <h3>📊 Impact & Stats</h3>
      <div class="modal-stats-grid">
        <div class="modal-stat-card">
          <div class="modal-stat-label">⚔️ Military Impact</div>
          <div class="modal-stat-value">+${impact.military}%</div>
        </div>
        <div class="modal-stat-card">
          <div class="modal-stat-label">💰 Economic Impact</div>
          <div class="modal-stat-value">+${impact.economy}%</div>
        </div>
        <div class="modal-stat-card">
          <div class="modal-stat-label">🏆 Power Level</div>
          <div class="modal-stat-value">${character.power}</div>
        </div>
      </div>
    </div>

    <div class="modal-actions">
      <button class="modal-action-btn" onclick="openCharacterProfile('${character.id}')">
        📖 Full Profile
      </button>
    </div>
  `;

  modalBody.innerHTML = modalContent;
  modal.style.display = 'flex';
  modal.classList.add('active');

  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  } catch (error) {
    console.error('Error loading character for modal:', error);
  }
}

function closeCharacterModal() {
  const modal = document.getElementById('character-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}
function addScrollAnimations() {
  
  const cards = document.querySelectorAll('.character-card');

  
  cards.forEach((card, index) => {
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
    
    card.style.animationDelay = `${index * 0.05}s`;
  });
}
document.addEventListener("DOMContentLoaded", () => {
  console.log('DOM Content Loaded - initializing codex page');

  
  isMobile = window.innerWidth <= 768;
  console.log('Mobile detected:', isMobile);

  
  const particleContainer = document.getElementById('particles');
  const starfieldContainer = document.getElementById('starfield');
  if (particleContainer) {
    particleContainer.style.display = 'none';
  }
  if (starfieldContainer) {
    starfieldContainer.style.display = 'none';
  }

  
  window.debugCharacters = async () => {
    console.log('=== DEBUG CHARACTER LOADING ===');
    try {
      console.log('1. Testing direct JSON fetch...');
      const response = await fetch('data/characters-basic.json');
      const jsonData = await response.json();
      console.log('Direct JSON result:', jsonData.length, 'characters');

      console.log('2. Testing CharacterLoader...');
      const loaderData = await window.CharacterLoader.loadBasicCharacters();
      console.log('CharacterLoader result:', loaderData.length, 'characters');

      console.log('3. Testing GameState...');
      const gameStateData = await window.GameState.getAllCharacters();
      console.log('GameState result:', gameStateData.length, 'characters');

      console.log('4. Current allCharacters:', allCharacters.length);
      console.log('5. Current filteredCharacters:', filteredCharacters.length);

      return {
        json: jsonData.length,
        loader: loaderData.length,
        gameState: gameStateData.length,
        all: allCharacters.length,
        filtered: filteredCharacters.length
      };
    } catch (error) {
      console.error('Debug failed:', error);
      return { error: error.message };
    }
  };

  
  console.log('Initializing filters...');
  initializeFilters();

  
  console.log('Updating statistics...');
  updateStatistics();

  
  console.log('Rendering characters...');
  renderCharacters();

  
  const modal = document.getElementById('character-modal');
  const closeBtn = document.querySelector('.modal-close');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  
  window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 768;
    renderCharacters();
  });

  console.log('Codex page initialization complete - particles disabled for performance');
  console.log('Run window.debugCharacters() in console to debug character loading');
});
window.toggleView = toggleView;
window.clearAllFilters = clearAllFilters;
window.openCharacterProfile = openCharacterProfile;
window.openCharacterModal = openCharacterModal;
window.closeCharacterModal = closeCharacterModal;
window.changePage = changePage;
