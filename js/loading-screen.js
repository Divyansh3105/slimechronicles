class LoadingScreenManager {
  constructor() {
    this.loadingScreen = document.getElementById("loading-screen");
    this.isLoading = true;
    this.init();
  }

  init() {
    if (!this.loadingScreen) {
      console.warn("Loading screen element not found");
      return;
    }

    this.loadingScreen.style.pointerEvents = "auto";

    this.setupPageLoadComplete();
  }

  setupPageLoadComplete() {
    const hideNow = () => {
      this.hideLoadingScreen(100);
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", hideNow, { once: true });
    } else if (document.readyState === "interactive") {
      this.hideLoadingScreen(200);
    } else {
      this.hideLoadingScreen(100);
    }
  }

  hideLoadingScreen(delay = 100) {
    if (!this.loadingScreen) return;

    this.loadingScreen.style.pointerEvents = "none";
    document.body.style.overflowY = "auto";
    document.documentElement.style.overflowY = "auto";

    this.loadingScreen.style.opacity = "0";

    // Hide after fade completes
    setTimeout(() => {
      if (this.loadingScreen && this.loadingScreen.parentElement) {
        this.loadingScreen.style.display = "none";
        this.loadingScreen.style.visibility = "hidden";
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
  window.loadingScreenManager = new LoadingScreenManager();
};


if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLoadingScreen, {
    once: true,
  });
  window.addEventListener("load", () => {
    if (window.loadingScreenManager) {
      window.loadingScreenManager.hideLoadingScreen(100);
    }
  });
} else {
  // DOM is already interactive or complete
  initLoadingScreen();
  window.addEventListener("load", () => {
    if (window.loadingScreenManager) {
      window.loadingScreenManager.hideLoadingScreen(100);
    }
  });
}
