// Shared JavaScript functions - Common functionality used across multiple pages
// This file contains functions that are used in multiple JS files to reduce code duplication

// Toggle mobile menu open/closed state and handle navigation visibility
function toggleMobileMenu() {
  const toggle = document.querySelector(".mobile-menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const body = document.body;
  const html = document.documentElement;

  if (!toggle || !mobileNav) {
    console.warn("Mobile navigation elements not found");
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
  if (window.SoundFeedback && typeof window.SoundFeedback.playEffect === "function") {
    window.SoundFeedback.playEffect("click");
  }
}

// Initialize mobile navigation with event handlers and gesture support
function initializeMobileNavigation() {
  const toggle = document.querySelector(".mobile-menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  if (!toggle || !mobileNav) {
    console.warn("Mobile navigation elements not found during initialization");
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
    if (mobileNav.classList.contains("active") &&
        !mobileNav.contains(e.target) &&
        !toggle.contains(e.target)) {
      toggleMobileMenu();
    }
  });

  // Close menu with Escape key for keyboard accessibility
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileNav && mobileNav.classList.contains("active")) {
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
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  // Set up viewport height handling
  handleViewportHeight();
  window.addEventListener('resize', handleViewportHeight);
  window.addEventListener('orientationchange', () => {
    setTimeout(handleViewportHeight, 100);
  });

  // Prevent body scroll when menu is open
  document.addEventListener('touchmove', (e) => {
    if (mobileNav && mobileNav.classList.contains("active")) {
      if (!mobileNav.contains(e.target)) {
        e.preventDefault();
      }
    }
  }, { passive: false });
}

// Smooth scroll to top with enhanced behavior for mobile devices
function scrollToTop() {
  const isMobile = window.innerWidth <= 768;

  window.scrollTo({
    top: 0,
    behavior: isMobile ? "auto" : "smooth", // Use auto on mobile for better performance
  });

  // Play sound feedback if available
  if (window.SoundFeedback && typeof window.SoundFeedback.playEffect === "function") {
    window.SoundFeedback.playEffect("click");
  }
}

// Show loading indicator in specified container with customizable message
function showLoadingIndicator(containerId = 'content', message = 'Loading...', description = 'Please wait while we fetch the information.') {
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
function displayError(title, message, containerId = 'content', backLink = null, additionalInfo = {}, showRecovery = false) {
  let backLinkHtml = '';

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

  const techDetails = Object.keys(additionalInfo).length > 0
    ? Object.entries(additionalInfo).map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`).join('')
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
function showNotification(message, duration = 3000, type = 'info') {
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
  if (type === 'error') {
    notification.style.background = 'var(--accent-crimson, #ff4757)';
  } else if (type === 'success') {
    notification.style.background = 'var(--accent-emerald, #2ed573)';
  } else if (type === 'warning') {
    notification.style.background = 'var(--accent-gold, #ffa502)';
  }

  notification.textContent = message;

  // Add animation keyframes if not already present
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
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
    notification.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, duration);

  // Allow manual dismissal by clicking
  notification.addEventListener('click', () => {
    notification.style.animation = 'slideOutRight 0.3s ease-in';
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
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const themes = ['dark', 'high-contrast', 'sepia'];
  const currentIndex = themes.indexOf(currentTheme);
  const nextTheme = themes[(currentIndex + 1) % themes.length];

  // Apply new theme and save preference to localStorage
  document.documentElement.setAttribute('data-theme', nextTheme);
  localStorage.setItem('preferred-theme', nextTheme);

  showNotification(`Theme changed to ${nextTheme}`, 2000, 'success');
}

// Load saved theme preference from localStorage
function loadThemePreference() {
  const savedTheme = localStorage.getItem('preferred-theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
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
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Detect if device is mobile based on viewport and user agent
function isMobileDevice() {
  return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Safe mobile detection with fallback for when shared.js might not be loaded
function safeMobileDetection() {
  return window.isMobileDevice ? window.isMobileDevice() : window.innerWidth <= 768;
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
  const ripple = document.createElement('div');
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

  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (x - size / 2) + 'px';
  ripple.style.top = (y - size / 2) + 'px';

  element.style.position = 'relative';
  element.appendChild(ripple);

  // Add ripple animation keyframes if not already present
  if (!document.querySelector('#ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
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
document.addEventListener('DOMContentLoaded', () => {
  loadThemePreference();
  initializeMobileNavigation();
});

// Export for module systems if available
if (typeof module !== 'undefined' && module.exports) {
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
    createRippleEffect
  };
}
