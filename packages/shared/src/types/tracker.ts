/**
 * Configuration options for initializing the Flowtel tracker script.
 * Used to configure the embeddable tracking library on e-commerce sites.
 */
export interface TrackerConfig {
  /** Unique identifier for the shop */
  shopId: string;

  /** API endpoint URL for sending tracking events */
  endpoint: string;

  /** API key for authenticating with the tracking backend */
  apiKey: string;

  /** Number of events to batch before sending (default: 10) */
  batchSize?: number;

  /** Milliseconds between automatic flushes (default: 5000) */
  flushInterval?: number;

  /** Enable debug logging to console (default: false) */
  debug?: boolean;

  /** Automatically track page views on init and SPA navigation (default: true) */
  autoTrackPageViews?: boolean;
}
