class EventBus {
  constructor() {
    this.events = {};
  }

  // Subscribe to an event
  subscribe(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);

    // Return an unsubscribe function
    return () => {
      this.events[eventName] = this.events[eventName].filter((cb) => cb !== callback);
    };
  }

  // Publish an event with data
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

  // Clear all subscribers for a specific event
  clear(eventName) {
    if (eventName) {
      delete this.events[eventName];
    } else {
      this.events = {};
    }
  }
}

// Make globally available
window.EventBus = new EventBus();
