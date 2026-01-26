console.log('Records.js loaded successfully');
const CONFIG = {
  ANIMATION_DELAYS: {
    MOBILE: 0.03,
    DESKTOP: 0.05
  },
  BREAKPOINTS: {
    MOBILE: 768,
    SMALL_MOBILE: 480
  },
  TIMEOUTS: {
    SEARCH_DEBOUNCE: 300,
    RESIZE_DEBOUNCE: 250,
    SCROLL_ANIMATION: 300
  }
};
const HISTORICAL_RECORDS = [
  {
    id: "reincarnation",
    icon: "🌟",
    title: "Reincarnated Soul",
    description: "Satoru Mikami dies and is reborn as a slime in a fantasy world, gaining unique abilities and a new perspective on life.",
    category: "origin",
    volume: "Volume 1",
    importance: "critical",
    date: "Day 1",
    location: "Sealed Cave",
    participants: ["Rimuru Tempest"],
    details: "The beginning of an extraordinary journey from ordinary salaryman to legendary being."
  },
  {
    id: "first_friend",
    icon: "🐉",
    title: "Dragon's Friend",
    description: "First encounter with Veldora, the Storm Dragon, sealed for 300 years. A friendship that would change both their destinies.",
    category: "friendship",
    volume: "Volume 1",
    importance: "critical",
    date: "Day 2",
    location: "Sealed Cave",
    participants: ["Rimuru Tempest", "Veldora Tempest"],
    details: "Veldora shares knowledge of the world and becomes Rimuru's first true companion."
  },
  {
    id: "naming_veldora",
    icon: "📜",
    title: "Name Giver",
    description: "Rimuru gives Veldora the surname 'Tempest' and receives it in return, forming a spiritual bond and family connection.",
    category: "naming",
    volume: "Volume 1",
    importance: "critical",
    date: "Day 3",
    location: "Sealed Cave",
    participants: ["Rimuru Tempest", "Veldora Tempest"],
    details: "The act of naming creates a deep magical bond and grants both parties increased power."
  },
  {
    id: "goblin_village",
    icon: "🏘️",
    title: "Village Protector",
    description: "Rimuru saves a goblin village from direwolf attacks, beginning his role as a protector and leader.",
    category: "heroic",
    volume: "Volume 1",
    importance: "major",
    date: "Day 10",
    location: "Goblin Village",
    participants: ["Rimuru Tempest", "Rigurd", "Goblin Tribe"],
    details: "First act of leadership that establishes Rimuru's reputation as a benevolent ruler."
  },
  {
    id: "naming_goblins",
    icon: "👥",
    title: "Goblin Namer",
    description: "Rimuru names all the goblins in the village, causing their evolution into hobgoblins and strengthening their abilities.",
    category: "naming",
    volume: "Volume 1",
    importance: "major",
    date: "Day 12",
    location: "Goblin Village",
    participants: ["Rimuru Tempest", "Rigurd", "Goblin Tribe"],
    details: "Mass naming event that transforms the entire goblin population and establishes naming as a key power."
  },
  {
    id: "rigurd_evolution",
    icon: "👑",
    title: "Chief's Evolution",
    description: "Rigurd evolves into a Goblin King through Rimuru's naming, becoming the first of many powerful subordinates.",
    category: "evolution",
    volume: "Volume 1",
    importance: "major",
    date: "Day 13",
    location: "Goblin Village",
    participants: ["Rimuru Tempest", "Rigurd"],
    details: "Rigurd's transformation demonstrates the true power of Rimuru's naming ability."
  },
  {
    id: "dwarf_kingdom",
    icon: "⚒️",
    title: "Dwarf Diplomat",
    description: "Rimuru establishes diplomatic relations with the Armed Nation of Dwargon, securing trade and alliance.",
    category: "diplomacy",
    volume: "Volume 1-2",
    importance: "major",
    date: "Day 30",
    location: "Dwargon",
    participants: ["Rimuru Tempest", "King Gazel Dwargo", "Kaijin"],
    details: "First major diplomatic success that opens trade routes and establishes Tempest's legitimacy."
  },
  {
    id: "kaijin_rescue",
    icon: "🔨",
    title: "Blacksmith's Savior",
    description: "Rimuru saves master blacksmith Kaijin and his brothers from imprisonment, gaining skilled craftsmen for his nation.",
    category: "heroic",
    volume: "Volume 2",
    importance: "moderate",
    date: "Day 32",
    location: "Dwargon",
    participants: ["Rimuru Tempest", "Kaijin", "Dwarf Brothers"],
    details: "Rescue mission that brings master craftsmanship to the growing Tempest nation."
  },
  {
    id: "shizu_encounter",
    icon: "🔥",
    title: "Flame Giant's Legacy",
    description: "Rimuru meets Shizu, the legendary hero, and inherits her will, appearance, and mission to help summoned children.",
    category: "legacy",
    volume: "Volume 2",
    importance: "critical",
    date: "Day 45",
    location: "Forest of Jura",
    participants: ["Rimuru Tempest", "Shizu"],
    details: "Pivotal encounter that gives Rimuru human form and a deeper understanding of his purpose."
  },
  {
    id: "orc_disaster",
    icon: "⚔️",
    title: "Orc Lord Slayer",
    description: "Rimuru defeats the Orc Lord Geld, ending the Orc Disaster and integrating the orc survivors into his nation.",
    category: "battle",
    volume: "Volume 2",
    importance: "critical",
    date: "Day 60",
    location: "Jura Forest",
    participants: ["Rimuru Tempest", "Orc Lord Geld", "Lizardmen", "Goblin Army"],
    details: "Major military victory that establishes Rimuru as a significant power in the region."
  },
  {
    id: "freedom_academy",
    icon: "🏫",
    title: "Teacher Rimuru",
    description: "Rimuru becomes a teacher at the Freedom Academy, fulfilling Shizu's wish and helping summoned children.",
    category: "education",
    volume: "Volume 3",
    importance: "moderate",
    date: "Day 90",
    location: "Kingdom of Ingrassia",
    participants: ["Rimuru Tempest", "Summoned Children", "Yuuki Kagurazaka"],
    details: "Educational mission that helps children control their powers and prevents their early deaths."
  },
  {
    id: "children_rescue",
    icon: "👶",
    title: "Children's Savior",
    description: "Rimuru successfully saves the summoned children from their cursed fate by creating spirit masks.",
    category: "heroic",
    volume: "Volume 3",
    importance: "major",
    date: "Day 95",
    location: "Dwelling of Spirits",
    participants: ["Rimuru Tempest", "Summoned Children", "Ramiris"],
    details: "Compassionate mission that saves innocent lives and fulfills Shizu's dying wish."
  },
  {
    id: "charybdis_battle",
    icon: "🌊",
    title: "Charybdis Conqueror",
    description: "Rimuru and his allies defeat the legendary monster Charybdis, demonstrating their growing military might.",
    category: "battle",
    volume: "Volume 3",
    importance: "major",
    date: "Day 120",
    location: "Lake near Tempest",
    participants: ["Rimuru Tempest", "Milim Nava", "Tempest Forces"],
    details: "Epic battle against an ancient calamity that showcases coordinated military strategy."
  },
  {
    id: "milim_friendship",
    icon: "💖",
    title: "Destroyer's Best Friend",
    description: "Rimuru befriends Milim Nava, one of the oldest and most powerful Demon Lords, through food and genuine care.",
    category: "friendship",
    volume: "Volume 3",
    importance: "critical",
    date: "Day 115",
    location: "Tempest",
    participants: ["Rimuru Tempest", "Milim Nava"],
    details: "Unlikely friendship with a Demon Lord that provides powerful protection and alliance."
  },
  {
    id: "demon_lord_awakening",
    icon: "💀",
    title: "Demon Lord Awakening",
    description: "Rimuru awakens as a True Demon Lord after the Falmuth incident, gaining immense power and transforming his subordinates.",
    category: "evolution",
    volume: "Volume 5-6",
    importance: "critical",
    date: "Day 200",
    location: "Tempest",
    participants: ["Rimuru Tempest", "Tempest Citizens"],
    details: "Transformation event that elevates Rimuru to the highest tier of power in the world."
  },
  {
    id: "harvest_festival",
    icon: "🎃",
    title: "Harvest Festival",
    description: "Rimuru completes his Harvest Festival, evolving many of his subordinates into Demon Lords and strengthening his nation.",
    category: "evolution",
    volume: "Volume 6",
    importance: "critical",
    date: "Day 205",
    location: "Tempest",
    participants: ["Rimuru Tempest", "Benimaru", "Shion", "Diablo", "Souei"],
    details: "Mass evolution event that creates multiple Demon Lord-class subordinates."
  },
  {
    id: "primordial_summoning",
    icon: "😈",
    title: "Primordial Summoner",
    description: "Rimuru successfully summons and names three Primordial Demons: Diablo, Testarossa, Ultima, and Carrera.",
    category: "summoning",
    volume: "Volume 6",
    importance: "critical",
    date: "Day 210",
    location: "Tempest",
    participants: ["Rimuru Tempest", "Diablo", "Testarossa", "Ultima", "Carrera"],
    details: "Acquisition of the most powerful demon subordinates, greatly expanding military capability."
  },
  {
    id: "walpurgis_council",
    icon: "🌙",
    title: "Walpurgis Attendee",
    description: "Rimuru attends his first Walpurgis Council as a newly awakened Demon Lord, establishing his place among the elite.",
    category: "politics",
    volume: "Volume 6",
    importance: "major",
    date: "Day 220",
    location: "Walpurgis Council Chamber",
    participants: ["Rimuru Tempest", "Demon Lords", "Guy Crimson"],
    details: "Political debut on the world stage as a recognized Demon Lord."
  },
  {
    id: "clayman_defeat",
    icon: "🎭",
    title: "Puppet Master's End",
    description: "Rimuru defeats and kills Clayman at Walpurgis, exposing his schemes and proving his strength to other Demon Lords.",
    category: "battle",
    volume: "Volume 6",
    importance: "major",
    date: "Day 221",
    location: "Walpurgis Council Chamber",
    participants: ["Rimuru Tempest", "Clayman", "Demon Lords"],
    details: "Decisive victory that establishes Rimuru's reputation among the Demon Lords."
  },
  {
    id: "octagram_member",
    icon: "⭐",
    title: "Octagram Member",
    description: "Rimuru officially becomes a member of the Octagram, the council of the eight most powerful Demon Lords.",
    category: "politics",
    volume: "Volume 6",
    importance: "major",
    date: "Day 222",
    location: "Walpurgis Council Chamber",
    participants: ["Rimuru Tempest", "Octagram Members"],
    details: "Official recognition as one of the world's most powerful beings."
  },
  {
    id: "hinata_duel",
    icon: "⚔️",
    title: "Saint's Challenger",
    description: "Rimuru faces Hinata Sakaguchi in combat, eventually resolving their conflict through understanding and mutual respect.",
    category: "battle",
    volume: "Volume 7",
    importance: "major",
    date: "Day 250",
    location: "Holy Empire Ruberios",
    participants: ["Rimuru Tempest", "Hinata Sakaguchi"],
    details: "Intense duel that tests Rimuru's combat abilities against a legendary saint."
  },
  {
    id: "eastern_empire",
    icon: "🏛️",
    title: "Empire Negotiator",
    description: "Rimuru successfully negotiates with the Eastern Empire, preventing war and establishing peaceful relations.",
    category: "diplomacy",
    volume: "Volume 8-9",
    importance: "major",
    date: "Day 300",
    location: "Eastern Empire",
    participants: ["Rimuru Tempest", "Emperor Rudra", "Eastern Empire Officials"],
    details: "High-stakes diplomacy that prevents a devastating war between major powers."
  },
  {
    id: "festival_organizer",
    icon: "🎪",
    title: "Festival Master",
    description: "Rimuru organizes the grand opening festival of Tempest, showcasing the nation's culture and strengthening international relations.",
    category: "culture",
    volume: "Volume 8",
    importance: "moderate",
    date: "Day 280",
    location: "Tempest",
    participants: ["Rimuru Tempest", "International Delegates", "Tempest Citizens"],
    details: "Cultural celebration that demonstrates Tempest's prosperity and diplomatic openness."
  },
  {
    id: "ultimate_skill",
    icon: "🌟",
    title: "Ultimate Skill User",
    description: "Rimuru acquires and masters multiple Ultimate Skills, reaching the pinnacle of magical ability.",
    category: "power",
    volume: "Volume 7-9",
    importance: "critical",
    date: "Day 270",
    location: "Various",
    participants: ["Rimuru Tempest"],
    details: "Achievement of the highest level of power, placing Rimuru among the world's strongest beings."
  },
  {
    id: "world_traveler",
    icon: "🌍",
    title: "World Traveler",
    description: "Rimuru gains the ability to travel between different worlds and dimensions, expanding his influence beyond a single reality.",
    category: "adventure",
    volume: "Volume 9+",
    importance: "major",
    date: "Day 350",
    location: "Multiple Dimensions",
    participants: ["Rimuru Tempest", "Chloe O'Bell"],
    details: "Transcendent ability that allows influence across multiple realities and timelines."
  }
];
const state = {
  currentFilter: 'all',
  currentSort: 'chronological',
  searchQuery: '',
  expandedRecord: null
};
let currentFilter = state.currentFilter;
let currentSort = state.currentSort;
let searchQuery = state.searchQuery;
let expandedRecord = state.expandedRecord;
function filterRecords(records, filter) {
  if (filter === 'all') return records;
  return records.filter(record => record.category === filter || record.importance === filter);
}

function sortRecords(records, sortType) {
  const sorted = [...records];
  switch (sortType) {
    case 'chronological':
      return sorted;
    case 'importance':
      const importanceOrder = { 'critical': 0, 'major': 1, 'moderate': 2 };
      return sorted.sort((a, b) => importanceOrder[a.importance] - importanceOrder[b.importance]);
    case 'alphabetical':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'volume':
      return sorted.sort((a, b) => {
        const aVol = parseInt(a.volume.match(/\d+/)[0]);
        const bVol = parseInt(b.volume.match(/\d+/)[0]);
        return aVol - bVol;
      });
    default:
      return sorted;
  }
}

function searchRecords(records, query) {
  if (!query) return records;
  const lowercaseQuery = query.toLowerCase();
  return records.filter(record =>
    record.title.toLowerCase().includes(lowercaseQuery) ||
    record.description.toLowerCase().includes(lowercaseQuery) ||
    record.details.toLowerCase().includes(lowercaseQuery) ||
    record.participants.some(p => p.toLowerCase().includes(lowercaseQuery)) ||
    record.location.toLowerCase().includes(lowercaseQuery)
  );
}

function getImportanceColor(importance) {
  switch (importance) {
    case 'critical': return 'var(--accent-crimson)';
    case 'major': return 'var(--accent-gold)';
    case 'moderate': return 'var(--primary-blue)';
    default: return 'var(--text-secondary)';
  }
}

function getImportanceIcon(importance) {
  switch (importance) {
    case 'critical': return '🔥';
    case 'major': return '⭐';
    case 'moderate': return '💫';
    default: return '📝';
  }
}

function getCategoryIcon(category) {
  const icons = {
    'origin': '🌟',
    'friendship': '🤝',
    'naming': '📝',
    'heroic': '🛡️',
    'evolution': '🦋',
    'battle': '⚔️',
    'diplomacy': '🤝',
    'legacy': '👑',
    'education': '📚',
    'politics': '🏛️',
    'summoning': '🔮',
    'culture': '🎭',
    'power': '⚡',
    'adventure': '🗺️'
  };
  return icons[category] || '📜';
}
function renderRecords(records = HISTORICAL_RECORDS) {
  const grid = document.getElementById("records-grid");

  if (!grid) {
    console.error('records-grid element not found!');
    return;
  }


  let filteredRecords = filterRecords(records, currentFilter);
  filteredRecords = searchRecords(filteredRecords, searchQuery);
  filteredRecords = sortRecords(filteredRecords, currentSort);

  if (filteredRecords.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>No records found</h3>
        <p>Try adjusting your filters or search terms</p>
      </div>
    `;
    return;
  }


  const isMobile = window.innerWidth <= CONFIG.BREAKPOINTS.MOBILE;
  const isVerySmall = window.innerWidth <= CONFIG.BREAKPOINTS.SMALL_MOBILE;

  grid.innerHTML = filteredRecords.map((record, index) => {
    const importanceColor = getImportanceColor(record.importance);
    const importanceIcon = getImportanceIcon(record.importance);
    const categoryIcon = getCategoryIcon(record.category);
    const isExpanded = expandedRecord === record.id;


    const animationDelay = isMobile ?
      index * CONFIG.ANIMATION_DELAYS.MOBILE :
      index * CONFIG.ANIMATION_DELAYS.DESKTOP;

    return `
      <div class="record-card ${record.importance}"
           style="animation-delay: ${animationDelay}s; --importance-color: ${importanceColor}"
           data-record-id="${record.id}"
           onclick="toggleRecordExpansion('${record.id}')"
           role="button"
           tabindex="0"
           aria-expanded="${isExpanded}"
           aria-label="Historical record: ${record.title}">
        <div class="record-icon-container">
          <div class="record-icon">${record.icon}</div>
          <div class="record-category-icon">${categoryIcon}</div>
        </div>
        <div class="record-content">
          <div class="record-meta">
            <span class="record-volume">${record.volume}</span>
            <span class="record-importance" style="color: ${importanceColor}">
              ${importanceIcon} ${record.importance.toUpperCase()}
            </span>
            <span class="record-date">${record.date}</span>
          </div>
          <h3 class="record-title">${record.title}</h3>
          <p class="record-description">${record.description}</p>

          <div class="record-details ${isExpanded ? 'expanded' : ''}"
               aria-hidden="${!isExpanded}">
            <div class="details-content">
              <div class="record-location" style="--item-index: 0">
                <span class="detail-label">📍 Location:</span>
                <span class="detail-value">${record.location}</span>
              </div>
              <div class="record-participants" style="--item-index: 1">
                <span class="detail-label">👥 Participants:</span>
                <span class="detail-value">${record.participants.join(', ')}</span>
              </div>
              <div class="record-full-details" style="--item-index: 2">
                <span class="detail-label">📖 Details:</span>
                <p class="detail-value">${record.details}</p>
              </div>
            </div>
          </div>

          <button class="record-expand-btn"
                  aria-label="${isExpanded ? 'Show less details' : 'Show more details'}"
                  onclick="event.stopPropagation(); toggleRecordExpansion('${record.id}')">
            <span>${isExpanded ? 'Show Less' : 'Show More'}</span>
            <span class="expand-icon" aria-hidden="true">${isExpanded ? '▲' : '▼'}</span>
          </button>
        </div>
      </div>
    `;
  }).join("");


  if (isMobile) {
    document.querySelectorAll('.record-card').forEach((card, index) => {

      card.addEventListener('touchstart', function(e) {
        this.style.transform = 'scale(0.98)';
        this.style.transition = 'transform 0.1s ease';
      }, { passive: true });

      card.addEventListener('touchend', function(e) {
        setTimeout(() => {
          this.style.transform = '';
        }, 100);
      }, { passive: true });


      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const recordId = this.dataset.recordId;
          if (recordId) {
            toggleRecordExpansion(recordId);
          }
        }
      });


      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        }, {
          threshold: 0.1,
          rootMargin: '20px'
        });

        observer.observe(card);
      }
    });
  }


  document.querySelectorAll('.record-card').forEach(card => {
    card.addEventListener('click', () => {
      if (window.SoundFeedback && typeof window.SoundFeedback.playEffect === 'function') {
        window.SoundFeedback.playEffect('click');
      }
    });
  });


  updateVisibleRecordsCount();


  if (filteredRecords.length > 0) {
    const announcement = `${filteredRecords.length} historical records displayed`;
    announceToScreenReader(announcement);
  }
}
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

function toggleRecordExpansion(recordId) {
  const recordCard = document.querySelector(`[data-record-id="${recordId}"]`);
  if (!recordCard) return;

  const detailsElement = recordCard.querySelector('.record-details');
  const expandBtn = recordCard.querySelector('.record-expand-btn');
  const expandIcon = expandBtn.querySelector('.expand-icon');
  const expandText = expandBtn.querySelector('span:first-child');

  if (!detailsElement || !expandBtn) return;

  const isCurrentlyExpanded = detailsElement.classList.contains('expanded');

  if (isCurrentlyExpanded) {

    expandedRecord = null;
    detailsElement.classList.remove('expanded');
    expandText.textContent = 'Show More';
    expandIcon.textContent = '▼';
    expandBtn.setAttribute('aria-label', 'Show more details');
    detailsElement.setAttribute('aria-hidden', 'true');


    expandBtn.classList.remove('expanded');
  } else {

    expandedRecord = recordId;


    document.querySelectorAll('.record-details.expanded').forEach(otherDetails => {
      if (otherDetails !== detailsElement) {
        const otherCard = otherDetails.closest('.record-card');
        const otherBtn = otherCard.querySelector('.record-expand-btn');
        const otherIcon = otherBtn.querySelector('.expand-icon');
        const otherText = otherBtn.querySelector('span:first-child');

        otherDetails.classList.remove('expanded');
        otherText.textContent = 'Show More';
        otherIcon.textContent = '▼';
        otherBtn.setAttribute('aria-label', 'Show more details');
        otherDetails.setAttribute('aria-hidden', 'true');
        otherBtn.classList.remove('expanded');
      }
    });


    detailsElement.classList.add('expanded');
    expandText.textContent = 'Show Less';
    expandIcon.textContent = '▲';
    expandBtn.setAttribute('aria-label', 'Show less details');
    detailsElement.setAttribute('aria-hidden', 'false');


    expandBtn.classList.add('expanded');


    setTimeout(() => {
      const recordRect = recordCard.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const navHeight = 80;


      if (recordRect.bottom > viewportHeight - 50) {
        recordCard.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 300);
  }


  if (window.SoundFeedback && typeof window.SoundFeedback.playEffect === 'function') {
    window.SoundFeedback.playEffect('click');
  }
}
function createFilterControls() {
  const container = document.querySelector('.historical-records-container');
  const controlsHTML = `
    <div class="records-controls">
      <div class="search-container">
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input type="text"
                 id="search-input"
                 placeholder="Search records, characters, locations..."
                 value="${searchQuery}"
                 oninput="handleSearch(this.value)">
          <button class="clear-search" onclick="clearSearch()" ${searchQuery ? '' : 'style="display: none;"'}>✕</button>
        </div>
      </div>

      <div class="filter-container">
        <div class="filter-group">
          <label>Filter by Category:</label>
          <select id="category-filter" onchange="handleCategoryFilter(this.value)">
            <option value="all">All Categories</option>
            <option value="origin">Origin</option>
            <option value="friendship">Friendship</option>
            <option value="naming">Naming</option>
            <option value="heroic">Heroic Acts</option>
            <option value="evolution">Evolution</option>
            <option value="battle">Battles</option>
            <option value="diplomacy">Diplomacy</option>
            <option value="legacy">Legacy</option>
            <option value="education">Education</option>
            <option value="politics">Politics</option>
            <option value="summoning">Summoning</option>
            <option value="culture">Culture</option>
            <option value="power">Power</option>
            <option value="adventure">Adventure</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Filter by Importance:</label>
          <select id="importance-filter" onchange="handleImportanceFilter(this.value)">
            <option value="all">All Levels</option>
            <option value="critical">🔥 Critical</option>
            <option value="major">⭐ Major</option>
            <option value="moderate">💫 Moderate</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Sort by:</label>
          <select id="sort-select" onchange="handleSort(this.value)">
            <option value="chronological">📅 Chronological</option>
            <option value="importance">🔥 Importance</option>
            <option value="alphabetical">🔤 Alphabetical</option>
            <option value="volume">📚 Volume</option>
          </select>
        </div>
      </div>

      <div class="records-stats">
        <div class="stat-item">
          <span class="stat-number" id="total-records">${HISTORICAL_RECORDS.length}</span>
          <span class="stat-label">Total Records</span>
        </div>
        <div class="stat-item">
          <span class="stat-number" id="visible-records">${HISTORICAL_RECORDS.length}</span>
          <span class="stat-label">Showing</span>
        </div>
      </div>
    </div>
  `;

  const titleElement = container.querySelector('.page-subtitle');
  titleElement.insertAdjacentHTML('afterend', controlsHTML);
}
function handleSearch(query) {
  searchQuery = query;
  updateVisibleRecordsCount();
  renderRecords();

  const clearBtn = document.querySelector('.clear-search');
  if (clearBtn) {
    clearBtn.style.display = query ? 'block' : 'none';
  }


  if (window.innerWidth <= CONFIG.BREAKPOINTS.MOBILE) {

    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {

      const visibleCount = document.querySelectorAll('.record-card').length;
      if (query && visibleCount === 0) {
        announceToScreenReader('No records found for your search');
      } else if (query && visibleCount > 0) {
        announceToScreenReader(`${visibleCount} records found`);
      }
    }, CONFIG.TIMEOUTS.SEARCH_DEBOUNCE);
  }
}

function clearSearch() {
  searchQuery = '';
  document.getElementById('search-input').value = '';
  document.querySelector('.clear-search').style.display = 'none';
  updateVisibleRecordsCount();
  renderRecords();
}

function handleCategoryFilter(category) {
  currentFilter = category;
  updateVisibleRecordsCount();
  renderRecords();
}

function handleImportanceFilter(importance) {
  currentFilter = importance;
  updateVisibleRecordsCount();
  renderRecords();
}

function handleSort(sortType) {
  currentSort = sortType;
  renderRecords();
}

function updateVisibleRecordsCount() {
  let filteredRecords = filterRecords(HISTORICAL_RECORDS, currentFilter);
  filteredRecords = searchRecords(filteredRecords, searchQuery);

  const visibleElement = document.getElementById('visible-records');
  if (visibleElement) {
    visibleElement.textContent = filteredRecords.length;
  }
}
function initializeHistoricalRecordsPage() {
  console.log('initializeHistoricalRecordsPage called');

  try {

    createFilterControls();


    renderRecords();

    console.log('Historical records page initialized successfully');
  } catch (error) {
    console.error('Error initializing historical records page:', error);
  }
}
function initializeRecordsPage() {
  console.log('initializeRecordsPage called');
  try {
    console.log('Calling initializeHistoricalRecordsPage...');
    initializeHistoricalRecordsPage();
    console.log('All initialization functions completed');
  } catch (error) {
    console.error('Error in initializeRecordsPage:', error);
  }
}

console.log('Records.js loaded successfully');

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded event fired');


  const grid = document.getElementById('records-grid');
  if (grid) {
    console.log('Found records-grid element');
    grid.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--text-light);">JavaScript is working! Records will load here.</div>';
  } else {
    console.error('Could not find records-grid element');
  }


  try {
    initializeRecordsPage();
    console.log('initializeRecordsPage completed successfully');
  } catch (error) {
    console.error('Error in initializeRecordsPage:', error);
  }
});
window.handleSearch = handleSearch;
window.clearSearch = clearSearch;
window.handleCategoryFilter = handleCategoryFilter;
window.handleImportanceFilter = handleImportanceFilter;
window.handleSort = handleSort;
window.toggleRecordExpansion = toggleRecordExpansion;
