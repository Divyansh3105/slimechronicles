/**
 * Loading Screen Handler
 * Manages the loading screen visibility on all pages
 */

console.log('Loading screen script loaded');

class LoadingScreenManager {
  constructor() {
    console.log('LoadingScreenManager constructor called');
    this.loadingScreen = document.getElementById("loading-screen");
    this.isLoading = true;
    console.log('Loading screen element found:', !!this.loadingScreen);
    this.init();
  }

  init() {
    if (!this.loadingScreen) {
      console.warn("Loading screen element not found");
      return;
    }

    console.log('Initializing loading screen manager');
    // Ensure pointer events are blocked initially
    this.loadingScreen.style.pointerEvents = "auto";

    // Hide loading screen after page content is loaded
    this.setupPageLoadComplete();
  }

  setupPageLoadComplete() {
    console.log('Setting up page load complete handler, document.readyState:', document.readyState);
    // Use a very short timeout to ensure DOM is ready
    const hideNow = () => {
      console.log('DOMContentLoaded - hiding loading screen');
      // Hide immediately on DOMContentLoaded
      this.hideLoadingScreen(100);
    };

    if (document.readyState === "loading") {
      console.log('Document still loading, adding DOMContentLoaded listener');
      document.addEventListener("DOMContentLoaded", hideNow, { once: true });
    } else if (document.readyState === "interactive") {
      console.log('Document interactive, hiding loading screen with delay');
      // DOM is ready but resources still loading
      this.hideLoadingScreen(200);
    } else {
      console.log('Document complete, hiding loading screen immediately');
      // Page is already fully loaded
      this.hideLoadingScreen(100);
    }
  }

  hideLoadingScreen(delay = 100) {
    console.log('hideLoadingScreen called with delay:', delay);
    if (!this.loadingScreen) return;

    // Set pointer events to none immediately to allow scrolling
    this.loadingScreen.style.pointerEvents = "none";
    document.body.style.overflowY = "auto";
    document.documentElement.style.overflowY = "auto";

    // Start fade out
    this.loadingScreen.style.opacity = "0";
    console.log('Loading screen opacity set to 0');

    // Hide after fade completes
    setTimeout(() => {
      if (this.loadingScreen && this.loadingScreen.parentElement) {
        this.loadingScreen.style.display = "none";
        this.loadingScreen.style.visibility = "hidden";
        console.log('Loading screen hidden');
      }
      this.isLoading = false;
      // Restore scroll if needed
      document.body.style.overflowY = "auto";
      document.documentElement.style.overflowY = "auto";
    }, delay + 400);
  }

  showLoadingScreen() {
    if (!this.loadingScreen) return;
    this.isLoading = true;
    this.loadingScreen.style.display = "flex";
    this.loadingScreen.style.visibility = "visible";
    this.loadingScreen.style.opacity = "1";
    this.loadingScreen.style.pointerEvents = "auto";
  }
}

// Initialize loading screen manager immediately
const initLoadingScreen = () => {
  console.log('initLoadingScreen called');
  window.loadingScreenManager = new LoadingScreenManager();
};

console.log('Setting up loading screen initialization, document.readyState:', document.readyState);

if (document.readyState === "loading") {
  console.log('Document loading, adding DOMContentLoaded listener');
  document.addEventListener("DOMContentLoaded", initLoadingScreen, {
    once: true,
  });
  window.addEventListener("load", () => {
    console.log('Window load event fired');
    if (window.loadingScreenManager) {
      window.loadingScreenManager.hideLoadingScreen(100);
    }
  });
} else {
  console.log('Document already interactive/complete, initializing immediately');
  // DOM is already interactive or complete
  initLoadingScreen();
  window.addEventListener("load", () => {
    console.log('Window load event fired (late)');
    if (window.loadingScreenManager) {
      window.loadingScreenManager.hideLoadingScreen(100);
    }
  });
}
