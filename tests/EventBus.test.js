import { describe, it, expect, beforeEach, vi } from 'vitest';
const { EventBus } = require('../js/utils/EventBus.js');

describe('EventBus', () => {
  let eventBus;

  beforeEach(() => {
    eventBus = new EventBus();
  });

  it('should initialize with empty events object', () => {
    expect(eventBus.events).toEqual({});
  });

  it('should allow subscribing to an event', () => {
    const mockCallback = vi.fn();
    eventBus.subscribe('TEST_EVENT', mockCallback);
    
    expect(eventBus.events['TEST_EVENT']).toBeDefined();
    expect(eventBus.events['TEST_EVENT'].length).toBe(1);
  });

  it('should trigger callback when an event is published', () => {
    const mockCallback = vi.fn();
    eventBus.subscribe('TEST_EVENT', mockCallback);
    
    eventBus.publish('TEST_EVENT', { payload: 'hello' });
    
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({ payload: 'hello' });
  });

  it('should handle multiple subscribers for the same event', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    
    eventBus.subscribe('TEST_EVENT', callback1);
    eventBus.subscribe('TEST_EVENT', callback2);
    
    eventBus.publish('TEST_EVENT', 'data');
    
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('should allow unsubscribing from an event', () => {
    const mockCallback = vi.fn();
    const unsubscribe = eventBus.subscribe('TEST_EVENT', mockCallback);
    
    // Publish - should be called
    eventBus.publish('TEST_EVENT', 'first call');
    expect(mockCallback).toHaveBeenCalledTimes(1);
    
    // Unsubscribe
    unsubscribe();
    
    // Publish again - should NOT be called
    eventBus.publish('TEST_EVENT', 'second call');
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should clear specific events', () => {
    eventBus.subscribe('EVENT_A', () => {});
    eventBus.subscribe('EVENT_B', () => {});
    
    eventBus.clear('EVENT_A');
    
    expect(eventBus.events['EVENT_A']).toBeUndefined();
    expect(eventBus.events['EVENT_B']).toBeDefined();
  });

  it('should clear all events when called without arguments', () => {
    eventBus.subscribe('EVENT_A', () => {});
    eventBus.subscribe('EVENT_B', () => {});
    
    eventBus.clear();
    
    expect(eventBus.events).toEqual({});
  });
});
