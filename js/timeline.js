
class TimelineManager {
    constructor() {
        this.currentView = 'detailed';
        this.currentSort = 'chronological';
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.events = [];
        this.originalOrder = [];

        this.init();
    }

    init() {
        this.cacheEvents();
        this.setupEventListeners();
        this.updateEventCounts();
        this.initializeTooltips();
    }

    cacheEvents() {

        this.events = Array.from(document.querySelectorAll('.timeline-event')).map(event => {
            const title = event.querySelector('.event-title')?.textContent || '';
            const description = event.querySelector('.event-description')?.textContent || '';
            const consequences = event.querySelector('.event-consequences')?.textContent || '';
            const characters = Array.from(event.querySelectorAll('.character-link span')).map(span => span.textContent);
            const date = event.querySelector('.event-date')?.textContent || '';
            const era = event.closest('.timeline-year')?.dataset.era || '';

            return {
                element: event,
                title,
                description,
                consequences,
                characters,
                date,
                era,
                searchText: `${title} ${description} ${consequences} ${characters.join(' ')} ${date}`.toLowerCase(),
                importance: this.calculateImportance(event),
                impact: this.calculateImpact(event)
            };
        });

        this.originalOrder = [...this.events];
    }

    calculateImportance(eventElement) {

        let score = 0;

        const title = eventElement.querySelector('.event-title')?.textContent || '';
        const consequences = eventElement.querySelectorAll('.event-consequences li');
        const characters = eventElement.querySelectorAll('.character-link');


        const importantKeywords = ['awakening', 'demon lord', 'evolution', 'founding', 'war', 'alliance', 'dragon'];
        importantKeywords.forEach(keyword => {
            if (title.toLowerCase().includes(keyword)) score += 10;
        });


        score += consequences.length * 5;


        score += characters.length * 3;


        if (title.includes('Rimuru')) score += 15;
        if (title.includes('True Dragon')) score += 12;
        if (title.includes('Walpurgis')) score += 10;

        return score;
    }

    calculateImpact(eventElement) {

        const consequences = eventElement.querySelectorAll('.event-consequences li');
        let impact = consequences.length * 2;

        const consequenceText = eventElement.querySelector('.event-consequences')?.textContent.toLowerCase() || '';


        if (consequenceText.includes('global') || consequenceText.includes('world')) impact += 20;
        if (consequenceText.includes('nation') || consequenceText.includes('federation')) impact += 15;
        if (consequenceText.includes('military') || consequenceText.includes('power')) impact += 10;
        if (consequenceText.includes('diplomatic') || consequenceText.includes('alliance')) impact += 8;

        return impact;
    }

    setupEventListeners() {

        const searchInput = document.getElementById('timeline-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.applyFilters();
                this.updateSearchUI();
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchTimeline();
                }
            });
        }


        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                searchInput?.focus();
            }
        });
    }

    updateSearchUI() {
        const clearBtn = document.querySelector('.clear-search-btn');
        if (clearBtn) {
            clearBtn.style.display = this.searchTerm ? 'flex' : 'none';
        }
    }

    searchTimeline() {
        const searchInput = document.getElementById('timeline-search');
        if (searchInput) {
            this.searchTerm = searchInput.value.toLowerCase();
            this.applyFilters();

            if (this.searchTerm) {
                this.highlightSearchResults();
                this.expandSearchResults();
            }
        }
    }

    clearSearch() {
        const searchInput = document.getElementById('timeline-search');
        if (searchInput) {
            searchInput.value = '';
            this.searchTerm = '';
            this.applyFilters();
            this.clearHighlights();
            this.updateSearchUI();
        }
    }

    highlightSearchResults() {
        this.clearHighlights();

        if (!this.searchTerm) return;

        this.events.forEach(event => {
            if (event.searchText.includes(this.searchTerm)) {
                this.highlightTextInElement(event.element, this.searchTerm);
            }
        });
    }

    highlightTextInElement(element, searchTerm) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        textNodes.forEach(textNode => {
            const text = textNode.textContent;
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            if (regex.test(text)) {
                const highlightedText = text.replace(regex, '<span class="search-highlight">$1</span>');
                const wrapper = document.createElement('span');
                wrapper.innerHTML = highlightedText;
                textNode.parentNode.replaceChild(wrapper, textNode);
            }
        });
    }

    clearHighlights() {
        document.querySelectorAll('.search-highlight').forEach(highlight => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
            parent.normalize();
        });
    }

    expandSearchResults() {
        if (!this.searchTerm) return;

        this.events.forEach(event => {
            if (event.searchText.includes(this.searchTerm)) {
                const arc = event.element.closest('.timeline-arc');
                const eventElement = event.element;


                if (arc && !arc.classList.contains('expanded')) {
                    const arcHeader = arc.querySelector('.arc-header');
                    if (arcHeader) {
                        window.toggleArcSimple(arcHeader);
                    }
                }


                if (!eventElement.classList.contains('expanded')) {
                    window.toggleEvent(eventElement);
                }
            }
        });
    }

    filterByEra(era) {
        this.currentFilter = era;
        this.applyFilters();
        this.updateEraButtons(era);
        this.updateEventCounts();

        if (window.soundEnabled && window.SoundFeedback) {
            window.SoundFeedback.playEffect('click');
        }
    }

    applyFilters() {
        const timelineYears = document.querySelectorAll('.timeline-year');
        let visibleCount = 0;

        timelineYears.forEach(year => {
            const era = year.dataset.era;
            const shouldShowEra = this.currentFilter === 'all' || era === this.currentFilter;

            if (shouldShowEra) {

                const events = year.querySelectorAll('.timeline-event');
                let hasMatchingEvents = false;

                if (!this.searchTerm) {
                    hasMatchingEvents = true;
                } else {
                    events.forEach(event => {
                        const eventData = this.events.find(e => e.element === event);
                        if (eventData && eventData.searchText.includes(this.searchTerm)) {
                            hasMatchingEvents = true;
                        }
                    });
                }

                if (hasMatchingEvents) {
                    year.style.display = 'block';
                    year.style.animation = 'fadeInUp 0.5s ease-out';
                    visibleCount++;
                } else {
                    year.style.display = 'none';
                }
            } else {
                year.style.display = 'none';
            }
        });


        this.showNoResultsMessage(visibleCount === 0);
    }

    showNoResultsMessage(show) {
        let noResultsDiv = document.querySelector('.no-results');

        if (show && !noResultsDiv) {
            noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'no-results';
            noResultsDiv.innerHTML = `
                <div class="no-results-icon">🔍</div>
                <div class="no-results-text">No events found</div>
                <div class="no-results-hint">Try adjusting your search terms or filters</div>
            `;
            document.querySelector('.timeline-container').appendChild(noResultsDiv);
        } else if (!show && noResultsDiv) {
            noResultsDiv.remove();
        }
    }

    updateEraButtons(activeEra) {
        document.querySelectorAll('.era-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.era === activeEra);
        });
    }

    updateEventCounts() {
        const counts = {
            all: 0,
            founding: 0,
            expansion: 0,
            'demon-lord': 0,
            imperial: 0,
            dragon: 0,
            cosmic: 0
        };

        document.querySelectorAll('.timeline-event').forEach(event => {
            const era = event.closest('.timeline-year')?.dataset.era;
            if (era && counts.hasOwnProperty(era)) {
                counts[era]++;
            }
            counts.all++;
        });

        Object.keys(counts).forEach(era => {
            const countElement = document.getElementById(`era-count-${era}`);
            if (countElement) {
                countElement.textContent = counts[era];
            }
        });
    }

    initializeTooltips() {

        document.querySelectorAll('.character-link').forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                this.showCharacterTooltip(e.target, e);
            });

            link.addEventListener('mouseleave', () => {
                this.hideCharacterTooltip();
            });
        });
    }

    showCharacterTooltip(element, event) {
        const characterName = element.querySelector('span')?.textContent;
        if (!characterName) return;


        const tooltip = document.createElement('div');
        tooltip.className = 'character-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-name">${characterName}</div>
            <div class="tooltip-hint">Click to view character details</div>
        `;

        document.body.appendChild(tooltip);


        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 10}px`;
        tooltip.style.transform = 'translate(-50%, -100%)';


        this.currentTooltip = tooltip;
    }

    hideCharacterTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }
}
window.toggleArcSimple = function (arcHeader) {
    try {
        const arc = arcHeader.closest('.timeline-arc');
        const content = arc.querySelector('.arc-content');
        const toggle = arcHeader.querySelector('.arc-toggle');

        if (!arc || !content) {
            console.error('Missing required elements');
            return;
        }

        // Toggle expanded state
        const isExpanded = arc.classList.toggle('expanded');

        // Clear any existing inline styles
        content.style.cssText = '';
        content.classList.remove('force-expanded', 'force-collapsed');

        if (isExpanded) {
            // Expanding
            content.classList.add('force-expanded');
            if (toggle) toggle.textContent = '▲';

            // Smooth expand animation
            requestAnimationFrame(() => {
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.opacity = '1';
                content.style.overflow = 'visible';
            });
        } else {
            // Collapsing
            content.classList.add('force-collapsed');
            if (toggle) toggle.textContent = '▼';

            // Get current height first
            const currentHeight = content.scrollHeight;
            content.style.maxHeight = currentHeight + 'px';

            // Force reflow then collapse
            requestAnimationFrame(() => {
                content.style.maxHeight = '0px';
                content.style.opacity = '0';
                content.style.overflow = 'hidden';
            });
        }

        // Visual feedback
        arcHeader.style.backgroundColor = 'rgba(77, 212, 255, 0.3)';
        setTimeout(() => {
            arcHeader.style.backgroundColor = '';
        }, 200);

        // Sound feedback
        if (typeof soundEnabled !== 'undefined' && soundEnabled && window.SoundFeedback) {
            window.SoundFeedback.playEffect('click');
        }

    } catch (error) {
        console.error('Error in toggleArcSimple:', error);
    }
};
window.toggleEvent = function (eventElement) {
    try {
        const content = eventElement.querySelector('.event-content');
        const expandHint = eventElement.querySelector('.event-expand-hint');

        if (!content) return;

        const isExpanded = eventElement.classList.toggle('expanded');

        // Clear any existing inline styles
        content.style.cssText = '';

        if (isExpanded) {
            // Expanding
            if (expandHint) expandHint.textContent = 'Click to collapse';

            requestAnimationFrame(() => {
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.opacity = '1';
                content.style.padding = '0 2rem 2rem 2rem';
            });
        } else {
            // Collapsing
            if (expandHint) expandHint.textContent = 'Click to expand';

            const currentHeight = content.scrollHeight;
            content.style.maxHeight = currentHeight + 'px';

            requestAnimationFrame(() => {
                content.style.maxHeight = '0px';
                content.style.opacity = '0';
                content.style.padding = '0 2rem';
            });
        }

        // Sound feedback
        if (typeof soundEnabled !== 'undefined' && soundEnabled && window.SoundFeedback) {
            window.SoundFeedback.playEffect('click');
        }

    } catch (error) {
        console.error('Error in toggleEvent:', error);
    }
};
function toggleMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');

    toggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';

    if (soundEnabled && window.SoundFeedback) {
        window.SoundFeedback.playEffect('click');
    }
}
function toggleSound() {
    soundEnabled = !soundEnabled;
    const soundIcon = document.getElementById('sound-toggle');
    soundIcon.textContent = soundEnabled ? '🔊' : '🔇';

    if (soundEnabled && window.SoundFeedback) {
        window.SoundFeedback.playEffect('click');
    }
}
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Error attempting to enable fullscreen:', err);
        });
    } else {
        document.exitFullscreen();
    }

    if (soundEnabled && window.SoundFeedback) {
        window.SoundFeedback.playEffect('click');
    }
}
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    if (soundEnabled && window.SoundFeedback) {
        window.SoundFeedback.playEffect('click');
    }
}
function filterByEra(era) {
    const eraButtons = document.querySelectorAll('.era-btn');
    const timelineYears = document.querySelectorAll('.timeline-year');


    eraButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.era === era);
    });


    timelineYears.forEach(year => {
        if (era === 'all' || year.dataset.era === era) {
            year.style.display = 'block';
            year.style.animation = 'fadeInUp 0.5s ease-out';
        } else {
            year.style.display = 'none';
        }
    });

    if (soundEnabled && window.SoundFeedback) {
        window.SoundFeedback.playEffect('click');
    }
}
function initializeArcs() {
    console.log('Initializing all arcs to collapsed state...');

    const arcs = document.querySelectorAll('.timeline-arc');
    console.log(`Found ${arcs.length} arcs to initialize`);

    arcs.forEach((arc, index) => {
        const content = arc.querySelector('.arc-content');
        const toggle = arc.querySelector('.arc-toggle');

        if (content) {
            // Ensure collapsed state
            arc.classList.remove('expanded');
            content.classList.remove('force-expanded');
            content.classList.add('force-collapsed');

            // Set initial styles
            content.style.cssText = `
                max-height: 0px !important;
                opacity: 0 !important;
                overflow: hidden !important;
                transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease !important;
            `;

            if (toggle) {
                toggle.textContent = '▼';
            }

            console.log(`Arc ${index + 1} initialized to collapsed state`);
        } else {
            console.warn(`Arc ${index + 1} missing content element`);
        }
    });

    console.log('Arc initialization complete');
}
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }

    scrollTimeout = setTimeout(() => {
        const nav = document.getElementById('main-nav');
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        const progress = document.getElementById('nav-progress');
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progress.style.width = scrollPercent + '%';
        progress.classList.toggle('visible', scrollPercent > 0);


        const timelineProgress = document.getElementById('timeline-progress-bar');
        if (timelineProgress) {
            timelineProgress.style.width = scrollPercent + '%';
        }


        const fab = document.getElementById('timeline-fab');
        if (fab) {
            fab.classList.toggle('hidden', window.scrollY < 300);
        }
    }, 10);
}, { passive: true });
document.addEventListener('keydown', (e) => {
    if (e.altKey) {
        switch (e.key) {
            case '1':
                e.preventDefault();
                window.location.href = 'overview.html';
                break;
            case '2':
                e.preventDefault();
                window.location.href = 'codex.html';
                break;
            case '3':
                e.preventDefault();
                window.location.href = 'skills.html';
                break;
            case '4':
                e.preventDefault();
                window.location.href = 'timeline.html';
                break;
            case '5':
                e.preventDefault();
                window.location.href = 'records.html';
                break;
            case 'h':
                e.preventDefault();
                window.location.href = 'index.html';
                break;
        }
    }

    if (e.key === 'Escape') {
        const mobileNav = document.getElementById('mobile-nav');
        if (mobileNav.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
});
window.toggleMobileMenu = toggleMobileMenu;
window.toggleSound = toggleSound;
window.toggleFullscreen = toggleFullscreen;
window.scrollToTop = scrollToTop;
window.filterByEra = filterByEra;
window.testArcExpansion = function() {
    console.log('=== TESTING ARC EXPANSION ===');
    const firstArc = document.querySelector('.timeline-arc');
    if (firstArc) {
        const arcHeader = firstArc.querySelector('.arc-header');
        const arcContent = firstArc.querySelector('.arc-content');

        console.log('First arc:', firstArc);
        console.log('Arc header:', arcHeader);
        console.log('Arc content:', arcContent);

        if (arcContent) {
            console.log('Current arc content styles:', {
                maxHeight: arcContent.style.maxHeight,
                opacity: arcContent.style.opacity,
                overflow: arcContent.style.overflow,
                display: arcContent.style.display,
                visibility: arcContent.style.visibility
            });

            const computedStyles = window.getComputedStyle(arcContent);
            console.log('Computed styles:', {
                maxHeight: computedStyles.maxHeight,
                opacity: computedStyles.opacity,
                overflow: computedStyles.overflow,
                display: computedStyles.display,
                visibility: computedStyles.visibility,
                transition: computedStyles.transition
            });
        }

        if (arcHeader) {
            console.log('Calling toggleArcSimple...');
            window.toggleArcSimple(arcHeader);
        }
    }
};
document.addEventListener('DOMContentLoaded', () => {
    console.log('Timeline page loaded');


    initializeArcs();


    window.timelineManager = new TimelineManager();


    document.body.style.paddingTop = '80px';


    const timelineContainer = document.querySelector('.timeline-container');
    const timelineYears = document.querySelectorAll('.timeline-year');

    if (timelineContainer) {
        timelineContainer.style.display = 'block';
        timelineContainer.style.visibility = 'visible';
        console.log('Timeline container made visible');
    }


    timelineYears.forEach((year, index) => {
        year.style.display = 'block';
        year.style.opacity = '1';
        year.style.transform = 'translateY(0)';
        console.log(`Timeline year ${index + 1} made visible`);
    });


    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', () => {
            toggleMobileMenu();
        });
    });

    console.log('Timeline initialization complete');
});
