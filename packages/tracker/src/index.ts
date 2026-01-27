/**
 * @flowtel/tracker - Lightweight event tracking for e-commerce analytics
 *
 * Usage:
 * <script src="http://localhost:4000/tracker.js"></script>
 * <script>
 *   tracker.init({
 *     shopId: 'shop_123',
 *     endpoint: 'http://localhost:4000/api/events',
 *     apiKey: 'your_api_key'
 *   });
 * </script>
 */

import type { CreateEventDto, TrackerConfig } from '@flowtel/shared';
import { EventBatcher } from './batcher';
import {
  setupPageViewTracking,
  teardownPageViewTracking,
  trackPageView as trackPageViewFn,
} from './pageview';

/**
 * Generate a unique ID using crypto.randomUUID with fallback for older browsers
 */
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Internal tracker state
 */
interface TrackerState {
  initialized: boolean;
  config: TrackerConfig | null;
  sessionId: string | null;
  batcher: EventBatcher | null;
  recentEvents: Map<string, number>; // deduplication key -> timestamp
}

const state: TrackerState = {
  initialized: false,
  config: null,
  sessionId: null,
  batcher: null,
  recentEvents: new Map(),
};

/** Time window for deduplication (ms) */
const DEDUP_WINDOW_MS = 1000;
/** Longer window for page views (ms) */
const PAGE_VIEW_DEDUP_WINDOW_MS = 3000;

/**
 * Generate a deduplication key from event type and properties
 */
function generateDedupKey(eventType: string, properties: Record<string, unknown>): string {
  // Include key identifying properties in the dedup key
  const keyProps = ['productId', 'orderId', 'url', 'path'];
  const propParts = keyProps
    .filter((key) => properties[key] !== undefined)
    .map((key) => `${key}:${properties[key]}`)
    .join('|');
  return `${eventType}::${propParts}`;
}

/**
 * Check if an event is a duplicate (same event within dedup window)
 */
function isDuplicate(eventType: string, dedupKey: string): boolean {
  const now = Date.now();
  const lastSeen = state.recentEvents.get(dedupKey);

  // Use longer window for page_view events
  const windowMs = eventType === 'page_view' ? PAGE_VIEW_DEDUP_WINDOW_MS : DEDUP_WINDOW_MS;

  if (lastSeen && now - lastSeen < windowMs) {
    return true;
  }

  // Clean up old entries
  for (const [key, timestamp] of state.recentEvents.entries()) {
    if (now - timestamp > PAGE_VIEW_DEDUP_WINDOW_MS * 2) {
      state.recentEvents.delete(key);
    }
  }

  state.recentEvents.set(dedupKey, now);
  return false;
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
  if (!config.apiKey) {
    throw new Error('[Flowtel Tracker] apiKey is required');
  }

  state.config = {
    batchSize: 10,
    flushInterval: 5000,
    debug: false,
    autoTrackPageViews: true,
    ...config,
  };

  state.sessionId = generateId();

  // Initialize batcher for event batching
  state.batcher = new EventBatcher({
    batchSize: state.config.batchSize!,
    flushInterval: state.config.flushInterval!,
    senderConfig: {
      endpoint: state.config.endpoint,
      debug: state.config.debug,
    },
    debug: state.config.debug,
  });

  state.initialized = true;

  if (state.config.debug) {
    console.log('[Flowtel Tracker] Initialized with config:', state.config);
    console.log('[Flowtel Tracker] Session ID:', state.sessionId);
  }

  // Setup automatic page view tracking if enabled
  if (state.config.autoTrackPageViews) {
    setupPageViewTracking(track, state.config.debug);
  }
}

/**
 * Track a custom event
 * @param eventName - Name/type of event (e.g., 'page_view', 'add_to_cart')
 * @param properties - Event-specific data
 */
export function track(
  eventName: string,
  properties: Record<string, unknown> = {}
): void {
  if (!state.initialized || !state.config || !state.sessionId || !state.batcher) {
    console.warn('[Flowtel Tracker] Not initialized. Call tracker.init() first.');
    return;
  }

  // Check for duplicate events within dedup window
  const dedupKey = generateDedupKey(eventName, properties);
  if (isDuplicate(eventName, dedupKey)) {
    if (state.config.debug) {
      console.log('[Flowtel Tracker] Skipping duplicate event:', eventName, dedupKey);
    }
    return;
  }

  const event: CreateEventDto = {
    shopId: state.config.shopId,
    sessionId: state.sessionId,
    eventType: eventName,
    eventName: formatEventName(eventName),
    properties,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  };

  if (state.config.debug) {
    console.log('[Flowtel Tracker] Track event:', event);
  }

  // Add to batcher for batched sending
  state.batcher.add(event);
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

/**
 * Get the current session ID
 * @returns Current session ID or null if not initialized
 */
export function getSessionId(): string | null {
  return state.sessionId;
}

/**
 * Manually track a page view
 * Useful when autoTrackPageViews is disabled or for custom routing scenarios
 */
export function trackPageView(): void {
  if (!state.initialized || !state.config) {
    console.warn('[Flowtel Tracker] Not initialized. Call tracker.init() first.');
    return;
  }
  trackPageViewFn(track);
}

/**
 * Manually flush all queued events.
 * Useful before navigation or when immediate delivery is needed.
 */
export async function flush(): Promise<void> {
  if (!state.batcher) {
    console.warn('[Flowtel Tracker] Not initialized. Call tracker.init() first.');
    return;
  }
  await state.batcher.flush();
}

/**
 * Destroy the tracker and cleanup resources
 */
export function destroy(): void {
  if (!state.initialized) {
    return;
  }
  teardownPageViewTracking();

  // Flush and destroy batcher
  if (state.batcher) {
    state.batcher.destroy();
    state.batcher = null;
  }

  state.initialized = false;
  state.config = null;
  state.sessionId = null;
  state.recentEvents.clear();
}

// Export as default object for IIFE global assignment
export default {
  init,
  track,
  trackPageView,
  flush,
  getConfig,
  isInitialized,
  getSessionId,
  destroy,
};
