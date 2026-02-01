// Shared JavaScript functions - Common functionality used across multiple pages

// Loading screen logic for all pages
document.addEventListener("DOMContentLoaded", function () {
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    // Fade out effect
    loadingScreen.style.transition = "opacity 1s ease";
    loadingScreen.style.opacity = "0";
    setTimeout(() => {
      loadingScreen.style.display = "none";
    }, 500);
  }
});
// Global scroll restore for mobile: ensures scrolling is enabled if stuck
function restoreScrolling() {
  document.body.classList.remove("mobile-nav-active", "mobile-nav-open");
  document.documentElement.classList.remove("mobile-nav-active");
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.width = "";
  document.body.style.height = "";
  document.body.style.touchAction = "";
  document.documentElement.style.overflow = "";
  document.documentElement.style.height = "";
}

// Run on page load to fix stuck scroll
window.addEventListener("DOMContentLoaded", restoreScrolling);

// Optionally, expose for modals/menus to call after close
window.restoreScrolling = restoreScrolling;
// This file contains functions that are used in multiple JS files to reduce code duplication

// Toggle mobile menu open/closed state and handle navigation visibility
function toggleMobileMenu() {
  const toggle = document.querySelector(".mobile-menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const body = document.body;
  const html = document.documentElement;

  if (!toggle || !mobileNav) {
    // Silently return if mobile navigation elements are not present
    return;
  }

  const isActive = mobileNav.classList.contains("active");

  if (isActive) {
    // Close menu and restore normal navigation state
    mobileNav.classList.remove("active");
    toggle.classList.remove("active");
    body.classList.remove("mobile-nav-active", "mobile-nav-open");
    html.classList.remove("mobile-nav-active");

    // Re-enable scrolling by clearing overflow restrictions
    body.style.overflow = "";
    body.style.position = "";
    body.style.width = "";
    body.style.height = "";
    body.style.touchAction = "";
    html.style.overflow = "";
    html.style.height = "";

    // Re-enable main navigation interaction
    const mainNav = document.getElementById("main-nav");
    if (mainNav) {
      mainNav.style.pointerEvents = "auto";
    }
  } else {
    // Open menu and disable main navigation
    mobileNav.classList.add("active");
    toggle.classList.add("active");
    body.classList.add("mobile-nav-active", "mobile-nav-open");
    html.classList.add("mobile-nav-active");

    // Prevent scrolling by setting overflow and position styles
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.width = "100%";
    body.style.height = "100%";
    body.style.touchAction = "none";
    html.style.overflow = "hidden";
    html.style.height = "100%";

    // Disable main navigation to prevent conflicts
    const mainNav = document.getElementById("main-nav");
    if (mainNav) {
      mainNav.style.pointerEvents = "none";
    }
  }

  // Provide haptic feedback on supported mobile devices
  if ("vibrate" in navigator) {
    navigator.vibrate(50);
  }

  // Play sound effect if audio system is available
  if (window.playSound) {
    window.playSound("menu-toggle");
  }

  // Play sound feedback if available
  if (
    window.SoundFeedback &&
    typeof window.SoundFeedback.playEffect === "function"
  ) {
    window.SoundFeedback.playEffect("click");
  }
}

// Initialize mobile navigation with event handlers and gesture support
function initializeMobileNavigation() {
  const toggle = document.querySelector(".mobile-menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  // Check if this page has mobile navigation elements
  if (!toggle || !mobileNav) {
    // Silently return if mobile navigation elements are not present
    // This allows pages like index.html to work without mobile nav
    return;
  }

  // Initialize touch tracking variables for swipe gesture detection
  let startY = 0;
  let startX = 0;

  // Track touch start position for swipe gesture detection
  mobileNav.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY;
    startX = e.touches[0].clientX;
  });

  // Process swipe gesture when touch ends and close menu if swiped up
  mobileNav.addEventListener("touchend", (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const swipeDistance = startY - touchEndY;
    const horizontalDistance = Math.abs(startX - touchEndX);

    // Close menu if swiped up significantly without too much horizontal movement
    if (swipeDistance > 100 && horizontalDistance < 50) {
      toggleMobileMenu();
    }
  });

  // Close menu when clicking nav links
  document.querySelectorAll(".mobile-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      toggleMobileMenu();
    });
  });

  // Close menu when clicking outside mobile nav area
  document.addEventListener("click", (e) => {
    if (
      mobileNav.classList.contains("active") &&
      !mobileNav.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      toggleMobileMenu();
    }
  });

  // Close menu with Escape key for keyboard accessibility
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      mobileNav &&
      mobileNav.classList.contains("active")
    ) {
      toggleMobileMenu();
    }
  });

  // Close menu when tab becomes hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (mobileNav && mobileNav.classList.contains("active")) {
        toggleMobileMenu();
      }
    }
  });

  // Close mobile nav when switching to desktop view
  window.addEventListener("resize", () => {
    const newIsMobile = window.innerWidth <= 768;
    if (!newIsMobile && mobileNav.classList.contains("active")) {
      toggleMobileMenu();
    }
  });

  // Handle viewport height changes for mobile browser address bar
  const handleViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };

  // Set up viewport height handling
  handleViewportHeight();
  window.addEventListener("resize", handleViewportHeight);
  window.addEventListener("orientationchange", () => {
    setTimeout(handleViewportHeight, 100);
  });

  // Prevent body scroll when menu is open
  document.addEventListener(
    "touchmove",
    (e) => {
      if (mobileNav && mobileNav.classList.contains("active")) {
        if (!mobileNav.contains(e.target)) {
          e.preventDefault();
        }
      }
    },
    { passive: false },
  );
}

// Smooth scroll to top with enhanced behavior for mobile devices
function scrollToTop() {
  const isMobile = window.innerWidth <= 768;

  window.scrollTo({
    top: 0,
    behavior: isMobile ? "auto" : "smooth", // Use auto on mobile for better performance
  });

  // Play sound feedback if available
  if (
    window.SoundFeedback &&
    typeof window.SoundFeedback.playEffect === "function"
  ) {
    window.SoundFeedback.playEffect("click");
  }
}

// Show loading indicator in specified container with customizable message
function showLoadingIndicator(
  containerId = "content",
  message = "Loading...",
  description = "Please wait while we fetch the information.",
) {
  const content = document.getElementById(containerId);
  if (content) {
    content.innerHTML = `
      <div class="loading-indicator" style="text-align: center; padding: 3rem;">
        <div class="loading-spinner"></div>
        <h3>${message}</h3>
        <p>${description}</p>
      </div>
    `;
  }
}

// Remove loading indicator from the page
function hideLoadingIndicator() {
  const loadingIndicator = document.querySelector(".loading-indicator");
  if (loadingIndicator) {
    loadingIndicator.remove();
  }
}

// Display comprehensive error message with recovery options
function displayError(
  title,
  message,
  containerId = "content",
  backLink = null,
  additionalInfo = {},
  showRecovery = false,
) {
  let backLinkHtml = "";

  if (backLink && showRecovery) {
    backLinkHtml = `
    <div class="error-actions">
      <a href="${backLink}" class="error-button">← Back</a>
      <button onclick="location.reload()" class="error-button">🔄 Try Again</button>
      <button onclick="attemptErrorRecovery()" class="error-button">🛠️ Auto-Fix</button>
    </div>
  `;
  } else if (backLink) {
    backLinkHtml = `
    <div class="error-actions">
      <a href="${backLink}" class="error-button">← Back</a>
      <button onclick="location.reload()" class="error-button">🔄 Try Again</button>
    </div>
  `;
  } else if (showRecovery) {
    backLinkHtml = `
    <div class="error-actions">
      <button onclick="location.reload()" class="error-button">🔄 Try Again</button>
      <button onclick="attemptErrorRecovery()" class="error-button">🛠️ Auto-Fix</button>
    </div>
  `;
  } else {
    backLinkHtml = `
    <div class="error-actions">
      <button onclick="location.reload()" class="error-button">🔄 Try Again</button>
    </div>
  `;
  }

  const techDetails =
    Object.keys(additionalInfo).length > 0
      ? Object.entries(additionalInfo)
          .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
          .join("")
      : `
      <p><strong>URL:</strong> ${window.location.href}</p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
    `;

  const content = document.getElementById(containerId);
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
              ${techDetails}
            </div>
          </details>
        </div>
        ${backLinkHtml}
      </div>
    `;
  }
}

// Display temporary notification message with customizable type and duration
function showNotification(message, duration = 3000, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--primary-blue, #4dd4ff);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    font-family: 'Rajdhani', sans-serif;
    font-weight: 500;
    max-width: 300px;
    word-wrap: break-word;
    animation: slideInRight 0.3s ease-out;
    transition: all 0.3s ease;
  `;

  // Set type-specific colors
  if (type === "error") {
    notification.style.background = "var(--accent-crimson, #ff4757)";
  } else if (type === "success") {
    notification.style.background = "var(--accent-emerald, #2ed573)";
  } else if (type === "warning") {
    notification.style.background = "var(--accent-gold, #ffa502)";
  }

  notification.textContent = message;

  // Add animation keyframes if not already present
  if (!document.querySelector("#notification-styles")) {
    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
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
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  // Auto-remove notification after specified duration
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease-in";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, duration);

  // Allow manual dismissal by clicking
  notification.addEventListener("click", () => {
    notification.style.animation = "slideOutRight 0.3s ease-in";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  });
}

// Create accessible announcements for screen readers
function announceToScreenReader(message) {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.style.position = "absolute";
  announcement.style.left = "-10000px";
  announcement.style.width = "1px";
  announcement.style.height = "1px";
  announcement.style.overflow = "hidden";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove announcement element after screen reader has processed it
  setTimeout(() => {
    if (announcement.parentNode) {
      document.body.removeChild(announcement);
    }
  }, 1000);
}

// Cycle through available themes and save preference
function toggleTheme() {
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "dark";
  const themes = ["dark", "high-contrast", "sepia"];
  const currentIndex = themes.indexOf(currentTheme);
  const nextTheme = themes[(currentIndex + 1) % themes.length];

  // Apply new theme and save preference to localStorage
  document.documentElement.setAttribute("data-theme", nextTheme);
  localStorage.setItem("preferred-theme", nextTheme);

  showNotification(`Theme changed to ${nextTheme}`, 2000, "success");
}

// Load saved theme preference from localStorage
function loadThemePreference() {
  const savedTheme = localStorage.getItem("preferred-theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  }
}

// Limit function execution frequency to improve performance
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
}

// Limit function execution rate to prevent excessive calls
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Detect if device is mobile based on viewport and user agent
function isMobileDevice() {
  return (
    window.innerWidth <= 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )
  );
}

// Safe mobile detection with fallback for when shared.js might not be loaded
function safeMobileDetection() {
  return window.isMobileDevice
    ? window.isMobileDevice()
    : window.innerWidth <= 768;
}

// Extract URL parameter value by name
function getURLParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Convert hex color to RGB values for color scheme processing
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Generate random character stats for display purposes
function generateRandomStats() {
  return {
    atk: Math.floor(Math.random() * 50) + 50,
    def: Math.floor(Math.random() * 50) + 50,
    spd: Math.floor(Math.random() * 50) + 50,
  };
}

// Animate number transitions with smooth counting effect
function animateNumber(element, from, to, duration = 700) {
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // Cubic easing
    const value = Math.floor(from + (to - from) * eased);
    element.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Create ripple effect animation on element click
function createRippleEffect(element, event) {
  const ripple = document.createElement("div");
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background: rgba(77, 212, 255, 0.3);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
    z-index: 100;
  `;

  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event ? event.clientX - rect.left : rect.width / 2;
  const y = event ? event.clientY - rect.top : rect.height / 2;

  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = x - size / 2 + "px";
  ripple.style.top = y - size / 2 + "px";

  element.style.position = "relative";
  element.appendChild(ripple);

  // Add ripple animation keyframes if not already present
  if (!document.querySelector("#ripple-styles")) {
    const style = document.createElement("style");
    style.id = "ripple-styles";
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Remove ripple element after animation completes
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Make functions globally available for use across all pages
window.toggleMobileMenu = toggleMobileMenu;
window.initializeMobileNavigation = initializeMobileNavigation;
window.scrollToTop = scrollToTop;
window.showLoadingIndicator = showLoadingIndicator;
window.hideLoadingIndicator = hideLoadingIndicator;
window.displayError = displayError;
window.showNotification = showNotification;
window.announceToScreenReader = announceToScreenReader;
window.toggleTheme = toggleTheme;
window.loadThemePreference = loadThemePreference;
window.debounce = debounce;
window.throttle = throttle;
window.isMobileDevice = isMobileDevice;
window.safeMobileDetection = safeMobileDetection;
window.getURLParameter = getURLParameter;
window.hexToRgb = hexToRgb;
window.generateRandomStats = generateRandomStats;
window.animateNumber = animateNumber;
window.createRippleEffect = createRippleEffect;

// Initialize shared functionality when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  loadThemePreference();
  initializeMobileNavigation();
  initializeAudioManager();
});

// Export for module systems if available
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    toggleMobileMenu,
    initializeMobileNavigation,
    scrollToTop,
    showLoadingIndicator,
    hideLoadingIndicator,
    displayError,
    showNotification,
    announceToScreenReader,
    toggleTheme,
    loadThemePreference,
    debounce,
    throttle,
    isMobileDevice,
    safeMobileDetection,
    getURLParameter,
    hexToRgb,
    generateRandomStats,
    animateNumber,
    createRippleEffect,
  };
}
// ========== CURSOR ENFORCEMENT ========== //

// Function to enforce custom cursors on all elements
function enforceCursors() {
  // Set default cursor for body
  document.body.style.cursor = "url('../assets/cursor.cur'), auto";

  // Set pointer cursor for interactive elements
  const interactiveSelectors = [
    "a",
    "button",
    'input[type="button"]',
    'input[type="submit"]',
    'input[type="reset"]',
    "select",
    '[role="button"]',
    ".clickable",
    ".primary-button",
    ".secondary-button",
    ".tertiary-button",
    ".view-profile-button",
    ".view-details-button",
    ".recruit-button",
    ".social-link",
    ".quick-item",
    ".modal-close",
    ".nav-brand",
    ".mobile-menu-toggle",
  ];

  interactiveSelectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      if (!element.disabled && !element.classList.contains("disabled")) {
        element.style.cursor = "url('../assets/pointer.cur'), pointer";

        // Also set cursor for child elements
        const children = element.querySelectorAll("*");
        children.forEach((child) => {
          child.style.cursor = "url('../assets/pointer.cur'), pointer";
          child.style.pointerEvents = "none";
        });
      }
    });
  });

  // Set text cursor for text inputs
  const textInputSelectors = [
    'input[type="text"]',
    'input[type="email"]',
    'input[type="password"]',
    'input[type="search"]',
    "textarea",
    '[contenteditable="true"]',
  ];

  textInputSelectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      element.style.cursor = "url('../assets/cursor.cur'), text";
    });
  });

  // Set not-allowed cursor for disabled elements
  const disabledElements = document.querySelectorAll(
    "button:disabled, input:disabled, select:disabled, textarea:disabled, .disabled",
  );
  disabledElements.forEach((element) => {
    element.style.cursor = "url('../assets/cursor.cur'), not-allowed";
  });
}

// Function to handle dynamically added elements
function observeCursorChanges() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Apply cursor styles to newly added elements
            setTimeout(() => enforceCursors(), 10);
          }
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Initialize cursor enforcement when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  enforceCursors();
  observeCursorChanges();

  // Re-enforce cursors periodically to handle any overrides
  setInterval(enforceCursors, 5000);
});

// Re-enforce cursors when page becomes visible (handles tab switching)
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    setTimeout(enforceCursors, 100);
  }
});

// ========== AUDIO MANAGER ========== //

/**
 * Audio Manager - Background Music Controller
 * Handles background music playback across all pages
 */

class AudioManager {
  constructor() {
    this.audio = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = 0.3; // Default volume (30%)
    this.fadeInterval = null;

    this.init();
  }

  init() {
    // Create audio element
    this.audio = new Audio("assets/theme.mp3");
    this.audio.loop = true;
    this.audio.volume = this.volume;
    this.audio.preload = "auto";

    // Load saved preferences
    this.loadPreferences();

    // Create audio controls
    this.createAudioControls();

    // Set up event listeners
    this.setupEventListeners();

    // Auto-play with user interaction detection
    this.setupAutoPlay();
  }

  createAudioControls() {
    // Check if controls already exist
    if (document.querySelector(".audio-controls")) {
      return;
    }

    // Create audio controls container
    const audioControls = document.createElement("div");
    audioControls.className = "audio-controls";
    audioControls.innerHTML = `
            <button class="audio-toggle" id="audioToggle" title="Toggle Background Music">
                <i class="fas fa-music">🎵</i>
            </button>
            <div class="volume-control">
                <input type="range" class="volume-slider" id="volumeSlider"
                       min="0" max="100" value="${this.volume * 100}"
                       title="Volume Control">
                <span class="volume-level" id="volumeLevel">${Math.round(this.volume * 100)}%</span>
            </div>
            <div class="audio-loading" id="audioLoading"></div>
        `;

    // Add to page
    document.body.appendChild(audioControls);

    // Store references
    this.toggleButton = document.getElementById("audioToggle");
    this.volumeSlider = document.getElementById("volumeSlider");
    this.volumeLevel = document.getElementById("volumeLevel");
    this.loadingIndicator = document.getElementById("audioLoading");

    // Update initial state
    this.updateControlsState();
  }

  setupEventListeners() {
    // Toggle button
    this.toggleButton.addEventListener("click", () => {
      this.toggle();
    });

    // Volume slider
    this.volumeSlider.addEventListener("input", (e) => {
      this.setVolume(e.target.value / 100);
    });

    // Audio events
    this.audio.addEventListener("loadstart", () => {
      this.showLoading(true);
    });

    this.audio.addEventListener("canplaythrough", () => {
      this.showLoading(false);
    });

    this.audio.addEventListener("play", () => {
      this.isPlaying = true;
      this.updateControlsState();
    });

    this.audio.addEventListener("pause", () => {
      this.isPlaying = false;
      this.updateControlsState();
    });

    this.audio.addEventListener("error", (e) => {
      console.warn("Audio playback error:", e);
      this.showLoading(false);
      this.isPlaying = false;
      this.updateControlsState();
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      // Ctrl/Cmd + M to toggle music
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "m") {
        e.preventDefault();
        this.toggle();
      }
    });

    // Page visibility change
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.isPlaying) {
        this.fadeOut();
      } else if (!document.hidden && this.isPlaying) {
        this.fadeIn();
      }
    });

    // Before page unload - save preferences
    window.addEventListener("beforeunload", () => {
      this.savePreferences();
    });
  }

  setupAutoPlay() {
    // Try to auto-play after user interaction
    const startAudio = () => {
      if (!this.isPlaying && !this.isMuted) {
        this.play();
      }
      // Remove listeners after first interaction
      document.removeEventListener("click", startAudio);
      document.removeEventListener("keydown", startAudio);
      document.removeEventListener("touchstart", startAudio);
    };

    // Wait for user interaction due to browser autoplay policies
    document.addEventListener("click", startAudio);
    document.addEventListener("keydown", startAudio);
    document.addEventListener("touchstart", startAudio);

    // Also try after a short delay
    setTimeout(() => {
      if (!this.isPlaying && !this.isMuted) {
        this.play();
      }
    }, 1000);
  }

  async play() {
    try {
      this.showLoading(true);
      await this.audio.play();
      this.isPlaying = true;
      this.showLoading(false);
    } catch (error) {
      console.warn("Could not play audio:", error);
      this.showLoading(false);
      this.isPlaying = false;
    }
    this.updateControlsState();
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updateControlsState();
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.audio.volume = this.volume;
    this.volumeLevel.textContent = `${Math.round(this.volume * 100)}%`;
    this.volumeSlider.value = this.volume * 100;

    // Update muted state based on volume
    this.isMuted = this.volume === 0;
    this.updateControlsState();

    // Save preference
    this.savePreferences();
  }

  mute() {
    this.previousVolume = this.volume;
    this.setVolume(0);
    this.isMuted = true;
  }

  unmute() {
    const targetVolume = this.previousVolume || 0.3;
    this.setVolume(targetVolume);
    this.isMuted = false;
  }

  fadeIn(duration = 1000) {
    if (this.fadeInterval) clearInterval(this.fadeInterval);

    const targetVolume = this.volume;
    const steps = 20;
    const stepTime = duration / steps;
    const volumeStep = targetVolume / steps;
    let currentStep = 0;

    this.audio.volume = 0;

    this.fadeInterval = setInterval(() => {
      currentStep++;
      this.audio.volume = Math.min(volumeStep * currentStep, targetVolume);

      if (currentStep >= steps) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
      }
    }, stepTime);
  }

  fadeOut(duration = 1000) {
    if (this.fadeInterval) clearInterval(this.fadeInterval);

    const startVolume = this.audio.volume;
    const steps = 20;
    const stepTime = duration / steps;
    const volumeStep = startVolume / steps;
    let currentStep = 0;

    this.fadeInterval = setInterval(() => {
      currentStep++;
      this.audio.volume = Math.max(startVolume - volumeStep * currentStep, 0);

      if (currentStep >= steps) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
      }
    }, stepTime);
  }

  updateControlsState() {
    if (!this.toggleButton) return;

    // Update toggle button
    const icon = this.toggleButton.querySelector("i");

    if (this.isPlaying) {
      this.toggleButton.classList.add("playing");
      this.toggleButton.classList.remove("muted");
      if (icon) {
        icon.className = "fas fa-music";
        icon.textContent = "🎵";
      }
      this.toggleButton.title = "Pause Background Music";
    } else if (this.isMuted || this.volume === 0) {
      this.toggleButton.classList.add("muted");
      this.toggleButton.classList.remove("playing");
      if (icon) {
        icon.className = "fas fa-volume-mute";
        icon.textContent = "🔇";
      }
      this.toggleButton.title = "Unmute Background Music";
    } else {
      this.toggleButton.classList.remove("playing", "muted");
      if (icon) {
        icon.className = "fas fa-play";
        icon.textContent = "▶️";
      }
      this.toggleButton.title = "Play Background Music";
    }
  }

  showLoading(show) {
    if (show) {
      this.loadingIndicator.style.display = "block";
    } else {
      this.loadingIndicator.style.display = "none";
    }
  }

  savePreferences() {
    const preferences = {
      volume: this.volume,
      isMuted: this.isMuted,
      isPlaying: this.isPlaying,
    };

    try {
      localStorage.setItem("audioPreferences", JSON.stringify(preferences));
    } catch (error) {
      console.warn("Could not save audio preferences:", error);
    }
  }

  loadPreferences() {
    try {
      const saved = localStorage.getItem("audioPreferences");
      if (saved) {
        const preferences = JSON.parse(saved);
        this.volume = preferences.volume || 0.3;
        this.isMuted = preferences.isMuted || false;

        // Apply volume
        this.audio.volume = this.volume;
      }
    } catch (error) {
      console.warn("Could not load audio preferences:", error);
    }
  }

  // Public methods for external control
  getCurrentTime() {
    return this.audio.currentTime;
  }

  getDuration() {
    return this.audio.duration;
  }

  setCurrentTime(time) {
    this.audio.currentTime = time;
  }

  getVolume() {
    return this.volume;
  }

  isCurrentlyPlaying() {
    return this.isPlaying;
  }

  destroy() {
    // Clean up
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
    }

    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
    }

    // Remove controls
    const controls = document.querySelector(".audio-controls");
    if (controls) {
      controls.remove();
    }

    // Save preferences before destroying
    this.savePreferences();
  }
}

// Initialize audio manager when DOM is loaded
let audioManager = null;

function initializeAudioManager() {
  // Check if audio controls already exist to prevent duplicates
  if (document.querySelector(".audio-controls")) {
    return;
  }

  if (!audioManager) {
    try {
      audioManager = new AudioManager();
      // Update the global reference
      window.audioManager = audioManager;
    } catch (error) {
      console.warn("Failed to initialize Audio Manager:", error);
    }
  }
}

// Make AudioManager available globally
window.AudioManager = AudioManager;
window.audioManager = audioManager;
window.initializeAudioManager = initializeAudioManager;
