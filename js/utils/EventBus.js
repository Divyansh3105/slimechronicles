class EventBus {
  constructor() {
    this.events = {};
  }

  subscribe(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);

    return () => {
      this.events[eventName] = this.events[eventName].filter((cb) => cb !== callback);
    };
  }

  publish(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in EventBus subscriber for event ${eventName}:`, error);
        }
      });
    }
  }

  clear(eventName) {
    if (eventName) {
      delete this.events[eventName];
    } else {
      this.events = {};
    }
  }
}

// Make globally available
if (typeof window !== "undefined") {
  window.EventBus = new EventBus();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { EventBus };
}
