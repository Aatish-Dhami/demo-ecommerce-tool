/**
 * Represents a tracking event captured from the e-commerce shop.
 * This is the core data structure used throughout the tracking system.
 */
export interface TrackingEvent {
  /** Unique identifier for the event */
  id: string;

  /** ID of the shop where the event originated */
  shopId: string;

  /** Session identifier for the user */
  sessionId: string;

  /** Type of event (e.g., PAGE_VIEW, ADD_TO_CART) */
  eventType: string;

  /** Human-readable name of the event */
  eventName: string;

  /** Additional event-specific data */
  properties: Record<string, unknown>;

  /** ISO 8601 timestamp when the event occurred */
  timestamp: string;

  /** URL where the event was triggered */
  url: string;

  /** Browser user agent string */
  userAgent: string;
}
