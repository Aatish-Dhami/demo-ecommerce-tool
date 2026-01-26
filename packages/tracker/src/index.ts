/**
 * @flowtel/tracker - Lightweight event tracking for e-commerce analytics
 *
 * Usage:
 * <script src="http://localhost:4000/tracker.js"></script>
 * <script>
 *   tracker.init({ shopId: 'shop_123', endpoint: 'http://localhost:4000/api/events' });
 * </script>
 */

import type { CreateEventDto } from '@flowtel/shared';
import { sendEvents } from './sender';
import { generateUUID } from './utils/uuid';

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
  sessionId: string | null;
}

const state: TrackerState = {
  initialized: false,
  config: null,
  sessionId: null,
};

/**
 * Get or generate the session ID
 */
function getSessionId(): string {
  if (!state.sessionId) {
    state.sessionId = generateUUID();
  }
  return state.sessionId;
}

/**
 * Convert event type to human-readable event name
 */
function formatEventName(eventType: string): string {
  return eventType
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

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
export async function track(
  eventType: string,
  properties: Record<string, unknown> = {}
): Promise<void> {
  if (!state.initialized || !state.config) {
    console.warn('[Flowtel Tracker] Not initialized. Call tracker.init() first.');
    return;
  }

  const event: CreateEventDto = {
    shopId: state.config.shopId,
    sessionId: getSessionId(),
    eventType,
    eventName: formatEventName(eventType),
    properties,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  };

  if (state.config.debug) {
    console.log('[Flowtel Tracker] Track:', eventType, properties);
  }

  // Send immediately (batching will be added in a future task)
  const result = await sendEvents([event], {
    endpoint: state.config.endpoint,
    debug: state.config.debug,
  });

  if (!result.success && state.config.debug) {
    console.warn('[Flowtel Tracker] Failed to send event:', result.error);
  }
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
