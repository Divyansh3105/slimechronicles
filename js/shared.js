class PageTransitionManager {
  constructor() {
    this.loadingScreen = document.getElementById("loading-screen");
    this.isTransitioning = false;
    this.init();
  }

  init() {
    if (this.loadingScreen) {
      this.loadingScreen.style.transition = "opacity 0.5s ease";

      window.addEventListener("load", () => {
        setTimeout(() => {
          this.loadingScreen.style.opacity = "0";
          setTimeout(() => {
            this.loadingScreen.style.display = "none";
          }, 500);
        }, 300);
      });
    }

    document.addEventListener("click", (e) => {
      const target = e.target.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");

      if (
        !href ||
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        target.getAttribute("target") === "_blank"
      ) {
        return;
      }

      // Prevents intercepting JS-driven buttons that happen to be styled as links
      if (href === "javascript:void(0)" || href === "undefined") return;

      e.preventDefault();
      this.navigateTo(href);
    });
  }

  /**
   * Navigates to a new URL with a smooth transition.
   * @param {string} url - The target URL to navigate to.
   */
  navigateTo(url) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    if (window.SoundFeedback && typeof window.SoundFeedback.playEffect === "function") {
      window.SoundFeedback.playEffect("hover"); // A soft hum is good for transitions
    }

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        window.location.href = url;
      });
      return;
    }

    if (this.loadingScreen) {
      this.loadingScreen.style.display = "flex";
      setTimeout(() => {
        this.loadingScreen.style.opacity = "1";
      }, 10);
    }

    setTimeout(() => {
      window.location.href = url;
    }, 500);
  }
}

new PageTransitionManager();

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

window.restoreScrolling = restoreScrolling;

function toggleMobileMenu() {
  const toggle = document.querySelector(".mobile-menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const body = document.body;
  const html = document.documentElement;

  if (!toggle || !mobileNav) {
    return;
  }

  const isActive = mobileNav.classList.contains("active");

  if (isActive) {
    mobileNav.classList.remove("active");
    toggle.classList.remove("active");
    body.classList.remove("mobile-nav-active", "mobile-nav-open");
    html.classList.remove("mobile-nav-active");

    body.style.overflow = "";
    body.style.position = "";
    body.style.width = "";
    body.style.height = "";
    body.style.touchAction = "";
    html.style.overflow = "";
    html.style.height = "";

    const mainNav = document.getElementById("main-nav");
    if (mainNav) {
      mainNav.style.pointerEvents = "auto";
    }
  } else {
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

  if ("vibrate" in navigator) {
    navigator.vibrate(50);
  }

  if (window.playSound) {
    window.playSound("menu-toggle");
  }

  if (window.SoundFeedback && typeof window.SoundFeedback.playEffect === "function") {
    window.SoundFeedback.playEffect("click");
  }
}

function initializeMobileNavigation() {
  const toggle = document.querySelector(".mobile-menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  if (!toggle || !mobileNav) {
    // Silently return if mobile navigation elements are not present
    // This allows pages like index.html to work without mobile nav
    return;
  }

  let startY = 0;
  let startX = 0;

  mobileNav.addEventListener(
    "touchstart",
    (e) => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
    },
    { passive: true }
  );

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

  document.querySelectorAll(".mobile-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      toggleMobileMenu();
    });
  });

  document.addEventListener("click", (e) => {
    if (
      mobileNav.classList.contains("active") &&
      !mobileNav.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      toggleMobileMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileNav && mobileNav.classList.contains("active")) {
      toggleMobileMenu();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (mobileNav && mobileNav.classList.contains("active")) {
        toggleMobileMenu();
      }
    }
  });

  window.addEventListener("resize", () => {
    const newIsMobile = window.innerWidth <= 768;
    if (!newIsMobile && mobileNav.classList.contains("active")) {
      toggleMobileMenu();
    }
  });

  const handleViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };

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
    { passive: false }
  );
}

function scrollToTop() {
  const isMobile = window.innerWidth <= 768;

  window.scrollTo({
    top: 0,
    behavior: isMobile ? "auto" : "smooth", // Use auto on mobile for better performance
  });

  if (window.SoundFeedback && typeof window.SoundFeedback.playEffect === "function") {
    window.SoundFeedback.playEffect("click");
  }
}

function showLoadingIndicator(
  containerId = "content",
  message = "Loading...",
  description = "Please wait while we fetch the information."
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

function hideLoadingIndicator() {
  const loadingIndicator = document.querySelector(".loading-indicator");
  if (loadingIndicator) {
    loadingIndicator.remove();
  }
}

function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
}
window.escapeHTML = escapeHTML;

function displayError(
  title,
  message,
  containerId = "content",
  backLink = null,
  additionalInfo = {},
  showRecovery = false
) {
  let backLinkHtml = "";
  title = escapeHTML(title);
  message = escapeHTML(message);
  backLink = backLink && escapeHTML(backLink);

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
          .map(([key, value]) => `<p><strong>${escapeHTML(key)}:</strong> ${escapeHTML(value)}</p>`)
          .join("")
      : `
      <p><strong>URL:</strong> ${escapeHTML(window.location.href)}</p>
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

  if (type === "error") {
    notification.style.background = "var(--accent-crimson, #ff4757)";
  } else if (type === "success") {
    notification.style.background = "var(--accent-emerald, #2ed573)";
  } else if (type === "warning") {
    notification.style.background = "var(--accent-gold, #ffa502)";
  }

  notification.textContent = message;

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

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease-in";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, duration);

  notification.addEventListener("click", () => {
    notification.style.animation = "slideOutRight 0.3s ease-in";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  });
}

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

  setTimeout(() => {
    if (announcement.parentNode) {
      document.body.removeChild(announcement);
    }
  }, 1000);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "rimuru";
  const themes = ["rimuru", "veldora", "benimaru", "milim"];
  const currentIndex = themes.indexOf(currentTheme);
  const nextTheme = themes[(currentIndex + 1) % themes.length];

  if (nextTheme === "rimuru") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", nextTheme);
  }
  localStorage.setItem("preferred-theme", nextTheme);

  const displayNames = {
    rimuru: "Rimuru (Water/Slime)",
    veldora: "Veldora (Storm Dragon)",
    benimaru: "Benimaru (Crimson Flare)",
    milim: "Milim (Dragon Nova)",
  };

  showNotification(`Theme changed to ${displayNames[nextTheme]}`, 2000, "success");
}

function loadThemePreference() {
  const savedTheme = localStorage.getItem("preferred-theme");
  if (savedTheme && savedTheme !== "rimuru") {
    document.documentElement.setAttribute("data-theme", savedTheme);
  }
}

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

function isMobileDevice() {
  return (
    window.innerWidth <= 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  );
}

function safeMobileDetection() {
  return window.isMobileDevice ? window.isMobileDevice() : window.innerWidth <= 768;
}

function getURLParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

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

// Generate deterministic display stats from a string seed (e.g. character id).
// Using a simple djb2-style hash so the same character always gets the same
// ATK/DEF/SPD values across re-renders, pagination, and filter changes.
// Falls back to random values when no seed is provided (backward-compatible).
function generateRandomStats(seed) {
  if (!seed) {
    return {
      atk: Math.floor(Math.random() * 50) + 50,
      def: Math.floor(Math.random() * 50) + 50,
      spd: Math.floor(Math.random() * 50) + 50,
    };
  }
  let h = 5381;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) + h) ^ seed.charCodeAt(i);
    h = h >>> 0; // keep unsigned 32-bit
  }
  const atk = 50 + (h % 50);
  const def = 50 + ((h >> 6) % 50);
  const spd = 50 + ((h >> 12) % 50);
  return { atk, def, spd };
}

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

  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Create a synthesized Web Audio API sound manager instead of relying on external files
class SynthesizedSoundManager {
  constructor() {
    this.audioContext = null;
    this.enabled = localStorage.getItem("sound-enabled") !== "false";
    // 'unlocked' is true only after a trusted gesture (click/keydown/touchend)
    // has created the AudioContext. mouseenter is NOT a trusted gesture in Chrome.
    this.unlocked = false;
  }

  // Called ONLY from a trusted gesture handler (click / keydown / touchend).
  unlock() {
    if (this.unlocked) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      if (this.audioContext.state === "suspended") {
        this.audioContext.resume();
      }
      this.unlocked = true;
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  playEffect(type) {
    if (!this.enabled) return;

    if (!this.unlocked || !this.audioContext) return;

    if (this.audioContext.state === "suspended") {
      this.audioContext.resume().then(() => this._scheduleEffect(type));
      return;
    }

    this._scheduleEffect(type);
  }

  _scheduleEffect(type) {
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (type === "hover") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, t);
      osc.frequency.exponentialRampToValueAtTime(600, t + 0.1);

      gainNode.gain.setValueAtTime(0, t);
      gainNode.gain.linearRampToValueAtTime(0.05, t + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc.start(t);
      osc.stop(t + 0.15);
    } else if (type === "click") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(1200, t + 0.05);

      gainNode.gain.setValueAtTime(0, t);
      gainNode.gain.linearRampToValueAtTime(0.1, t + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

      osc.start(t);
      osc.stop(t + 0.3);
    } else if (type === "success") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, t); // C5
      osc.frequency.setValueAtTime(659.25, t + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, t + 0.2); // G5
      osc.frequency.setValueAtTime(1046.5, t + 0.3); // C6

      gainNode.gain.setValueAtTime(0, t);
      gainNode.gain.linearRampToValueAtTime(0.1, t + 0.05);
      gainNode.gain.linearRampToValueAtTime(0.1, t + 0.4);
      gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

      osc.start(t);
      osc.stop(t + 0.8);
    }
  }

  setEnabled(state) {
    this.enabled = state;
    localStorage.setItem("sound-enabled", state);
  }
}

// Global instance — AudioContext is NOT created here.
window.SoundFeedback = new SynthesizedSoundManager();

// Unlock AudioContext on the first TRUSTED user gesture.
// mouseenter / mousemove are NOT trusted in Chrome — only click, keydown, touchend are.
(function registerAudioUnlock() {
  const unlock = () => {
    window.SoundFeedback.unlock();
    ["click", "keydown", "touchend"].forEach((evt) =>
      document.removeEventListener(evt, unlock, true)
    );
  };
  ["click", "keydown", "touchend"].forEach((evt) =>
    document.addEventListener(evt, unlock, { capture: true })
  );
})();

function initScrollReveal() {
  // Only apply if user hasn't requested reduced motion
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const elementsToReveal = document.querySelectorAll(
    ".character-card, .skill-card, .faction-card, .record-card, .timeline-item"
  );

  elementsToReveal.forEach((el) => {
    el.classList.add("reveal-on-scroll");

    observer.observe(el);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(initScrollReveal, 100);
});

// Global sound variable that index.html expects
window.soundEnabled = localStorage.getItem("sound-enabled") !== "false";

// Make functions globally available for use across all pages
window.initScrollReveal = initScrollReveal;
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

document.addEventListener("DOMContentLoaded", () => {
  loadThemePreference();
  initializeMobileNavigation();
});

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

let cursorStyleSheet = null;

// Create a style sheet for cursor rules to avoid forced reflows
function initializeCursorStyles() {
  if (cursorStyleSheet) return;

  const style = document.createElement("style");
  style.id = "cursor-enforcement-styles";
  style.textContent = `
    /* Default cursor */
    body {
      cursor: url('../assets/cursor.cur'), auto !important;
    }

    /* Interactive elements */
    a, button,
    input[type="button"],
    input[type="submit"],
    input[type="reset"],
    select,
    [role="button"],
    .clickable,
    .primary-button,
    .secondary-button,
    .tertiary-button,
    .view-profile-button,
    .view-details-button,
    .recruit-button,
    .social-link,
    .quick-item,
    .modal-close,
    .nav-brand,
    .mobile-menu-toggle {
      cursor: url('../assets/pointer.cur'), pointer !important;
    }

    /* Child elements of interactive elements */
    a *, button *,
    input[type="button"] *,
    input[type="submit"] *,
    input[type="reset"] *,
    select *,
    [role="button"] *,
    .clickable *,
    .primary-button *,
    .secondary-button *,
    .tertiary-button *,
    .view-profile-button *,
    .view-details-button *,
    .recruit-button *,
    .social-link *,
    .quick-item *,
    .modal-close *,
    .nav-brand *,
    .mobile-menu-toggle * {
      cursor: url('../assets/pointer.cur'), pointer !important;
      pointer-events: none;
    }

    /* Text inputs */
    input[type="text"],
    input[type="email"],
    input[type="password"],
    input[type="search"],
    textarea,
    [contenteditable="true"] {
      cursor: url('../assets/cursor.cur'), text !important;
    }

    /* Disabled elements */
    button:disabled,
    input:disabled,
    select:disabled,
    textarea:disabled,
    .disabled {
      cursor: url('../assets/cursor.cur'), not-allowed !important;
    }
  `;

  document.head.appendChild(style);
  cursorStyleSheet = style;
}

// Lightweight function to apply cursors only to new elements
function enforceCursorsOnElement(element) {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) return;

  // Use CSS classes instead of inline styles for better performance
  if (
    element.matches(
      'a, button, input[type="button"], input[type="submit"], input[type="reset"], select, [role="button"], .clickable, .primary-button, .secondary-button, .tertiary-button, .view-profile-button, .view-details-button, .recruit-button, .social-link, .quick-item, .modal-close, .nav-brand, .mobile-menu-toggle'
    )
  ) {
    element.classList.add("cursor-pointer");
  } else if (
    element.matches(
      'input[type="text"], input[type="email"], input[type="password"], input[type="search"], textarea, [contenteditable="true"]'
    )
  ) {
    element.classList.add("cursor-text");
  } else if (
    element.matches(
      "button:disabled, input:disabled, select:disabled, textarea:disabled, .disabled"
    )
  ) {
    element.classList.add("cursor-not-allowed");
  }
}

function observeCursorChanges() {
  let mutationTimeout;

  const observer = new MutationObserver((mutations) => {
    // Throttle mutations to avoid excessive processing
    clearTimeout(mutationTimeout);
    mutationTimeout = setTimeout(() => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              enforceCursorsOnElement(node);
              node
                .querySelectorAll('a, button, input, select, textarea, [role="button"]')
                .forEach(enforceCursorsOnElement);
            }
          });
        }
      });
    }, 50); // Batch mutations within 50ms
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeCursorStyles();
  observeCursorChanges();
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden && !cursorStyleSheet) {
    initializeCursorStyles();
  }
});

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
    this.audio = new Audio("assets/theme.mp3");
    this.audio.loop = true;
    this.audio.volume = this.volume;
    this.audio.preload = "auto";

    this.loadPreferences();

    this.createAudioControls();

    this.setupEventListeners();

    this.setupAutoPlay();
  }

  createAudioControls() {
    if (document.querySelector(".audio-controls")) {
      return;
    }

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

    document.body.appendChild(audioControls);

    this.toggleButton = document.getElementById("audioToggle");
    this.volumeSlider = document.getElementById("volumeSlider");
    this.volumeLevel = document.getElementById("volumeLevel");
    this.loadingIndicator = document.getElementById("audioLoading");

    this.updateControlsState();
  }

  setupEventListeners() {
    this.toggleButton.addEventListener("click", () => {
      this.toggle();
    });

    this.volumeSlider.addEventListener("input", (e) => {
      this.setVolume(e.target.value / 100);
    });

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

    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "m") {
        e.preventDefault();
        this.toggle();
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.isPlaying) {
        this.fadeOut();
      } else if (!document.hidden && this.isPlaying) {
        this.fadeIn();
      }
    });

    window.addEventListener("beforeunload", () => {
      this.savePreferences();
    });
  }

  setupAutoPlay() {
    const startAudio = () => {
      if (!this.isPlaying && !this.isMuted) {
        this.play();
      }
      document.removeEventListener("click", startAudio);
      document.removeEventListener("keydown", startAudio);
      document.removeEventListener("touchstart", startAudio);
    };

    // Wait for user interaction due to browser autoplay policies
    document.addEventListener("click", startAudio);
    document.addEventListener("keydown", startAudio);
    document.addEventListener("touchstart", startAudio);

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

    this.isMuted = this.volume === 0;
    this.updateControlsState();

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

        this.audio.volume = this.volume;
      }
    } catch (error) {
      console.warn("Could not load audio preferences:", error);
    }
  }

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
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
    }

    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
    }

    const controls = document.querySelector(".audio-controls");
    if (controls) {
      controls.remove();
    }

    this.savePreferences();
  }
}

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

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("ServiceWorker registration failed:", err);
    });
  });
}
