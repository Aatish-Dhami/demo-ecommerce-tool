/**
 * @flowtel/tracker - Lightweight event tracking for e-commerce analytics
 *
 * Usage:
 * <script src="http://localhost:4000/tracker.js"></script>
 * <script>
 *   tracker.init({ shopId: 'shop_123', endpoint: 'http://localhost:4000/api/events' });
 * </script>
 */

import type { TrackingEvent } from '@flowtel/shared';

/**
 * Configuration options for the tracker
 */
export interface TrackerConfig {
  /** Required: Unique identifier for the shop */
  shopId: string;
  /** Required: API endpoint for event ingestion */
  endpoint: string;
  /** Events per batch before flush (default: 10) */
  batchSize?: number;
  /** Milliseconds between automatic flushes (default: 5000) */
  flushInterval?: number;
  /** Enable debug logging to console (default: false) */
  debug?: boolean;
}

/**
 * Tracker state - will be expanded in future tasks
 */
interface TrackerState {
  initialized: boolean;
  config: TrackerConfig | null;
}

const state: TrackerState = {
  initialized: false,
  config: null,
};

/**
 * Initialize the tracker with configuration
 * @param config - Tracker configuration options
 */
export function init(config: TrackerConfig): void {
  if (state.initialized) {
    console.warn('[Flowtel Tracker] Already initialized');
    return;
  }

  if (!config.shopId) {
    throw new Error('[Flowtel Tracker] shopId is required');
  }
  if (!config.endpoint) {
    throw new Error('[Flowtel Tracker] endpoint is required');
  }

  state.config = {
    batchSize: 10,
    flushInterval: 5000,
    debug: false,
    ...config,
  };

  state.initialized = true;

  if (state.config.debug) {
    console.log('[Flowtel Tracker] Initialized with config:', state.config);
  }
}

/**
 * Track a custom event
 * @param eventType - Type of event (e.g., 'product_viewed', 'add_to_cart')
 * @param properties - Event-specific data
 */
export function track(eventType: string, properties: Record<string, unknown> = {}): void {
  if (!state.initialized || !state.config) {
    console.warn('[Flowtel Tracker] Not initialized. Call tracker.init() first.');
    return;
  }

  if (state.config.debug) {
    console.log('[Flowtel Tracker] Track:', eventType, properties);
  }

  // TODO: Implement event queuing and batching in future tasks
  // - Create TrackingEvent object
  // - Add to queue
  // - Flush when batchSize reached or flushInterval elapsed
}

/**
 * Get the current tracker configuration
 * @returns Current configuration or null if not initialized
 */
export function getConfig(): TrackerConfig | null {
  return state.config;
}

/**
 * Check if tracker is initialized
 * @returns true if initialized
 */
export function isInitialized(): boolean {
  return state.initialized;
}

// Export as default object for IIFE global assignment
export default {
  init,
  track,
  getConfig,
  isInitialized,
};
