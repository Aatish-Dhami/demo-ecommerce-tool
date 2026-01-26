/**
 * Page view tracking module for automatic navigation tracking.
 * Handles initial page load and SPA navigation via History API.
 */

/** Callback type for page view events */
type TrackCallback = (
  eventType: string,
  properties: Record<string, unknown>
) => void;

/** Properties captured for page_view events */
interface PageViewProperties extends Record<string, unknown> {
  url: string;
  title: string;
  referrer: string;
  path: string;
}

/** Stores original History API methods for cleanup */
interface HistoryState {
  originalPushState: typeof history.pushState | null;
  originalReplaceState: typeof history.replaceState | null;
  popstateHandler: ((event: PopStateEvent) => void) | null;
  isSetup: boolean;
}

const historyState: HistoryState = {
  originalPushState: null,
  originalReplaceState: null,
  popstateHandler: null,
  isSetup: false,
};

/** Track state to prevent duplicate tracking */
let lastTrackedUrl: string | null = null;
let trackCallback: TrackCallback | null = null;
let debugEnabled = false;

const PAGE_VIEW_EVENT = 'page_view';

/**
 * Capture current page view properties from browser context
 */
function capturePageViewProperties(): PageViewProperties {
  return {
    url: window.location.href,
    title: document.title,
    referrer: document.referrer,
    path: window.location.pathname,
  };
}

/**
 * Trigger a page view event if URL has changed
 */
function triggerPageView(): void {
  const currentUrl = window.location.href;

  // Prevent duplicate tracking for same URL
  if (currentUrl === lastTrackedUrl) {
    if (debugEnabled) {
      console.log(
        '[Flowtel Tracker] Skipping duplicate page_view for:',
        currentUrl
      );
    }
    return;
  }

  lastTrackedUrl = currentUrl;

  if (trackCallback) {
    const properties = capturePageViewProperties();
    if (debugEnabled) {
      console.log('[Flowtel Tracker] Auto page_view:', properties);
    }
    trackCallback(PAGE_VIEW_EVENT, properties);
  }
}

/**
 * Monkey-patch History API to intercept SPA navigation
 */
function patchHistoryApi(): void {
  if (historyState.isSetup) {
    return;
  }

  // Store original methods
  historyState.originalPushState = history.pushState.bind(history);
  historyState.originalReplaceState = history.replaceState.bind(history);

  // Wrap pushState
  history.pushState = function (
    state: unknown,
    unused: string,
    url?: string | URL | null
  ): void {
    historyState.originalPushState!(state, unused, url);
    // Use setTimeout to ensure URL is updated before tracking
    setTimeout(triggerPageView, 0);
  };

  // Wrap replaceState
  history.replaceState = function (
    state: unknown,
    unused: string,
    url?: string | URL | null
  ): void {
    historyState.originalReplaceState!(state, unused, url);
    // Use setTimeout to ensure URL is updated before tracking
    setTimeout(triggerPageView, 0);
  };

  // Listen for popstate (browser back/forward)
  historyState.popstateHandler = (): void => {
    triggerPageView();
  };
  window.addEventListener('popstate', historyState.popstateHandler);

  historyState.isSetup = true;
}

/**
 * Restore original History API methods (for cleanup/testing)
 */
function unpatchHistoryApi(): void {
  if (!historyState.isSetup) {
    return;
  }

  if (historyState.originalPushState) {
    history.pushState = historyState.originalPushState;
  }
  if (historyState.originalReplaceState) {
    history.replaceState = historyState.originalReplaceState;
  }
  if (historyState.popstateHandler) {
    window.removeEventListener('popstate', historyState.popstateHandler);
  }

  historyState.originalPushState = null;
  historyState.originalReplaceState = null;
  historyState.popstateHandler = null;
  historyState.isSetup = false;
}

/**
 * Initialize automatic page view tracking
 * @param callback - Function to call with page view events (typically the track function)
 * @param debug - Enable debug logging
 */
export function setupPageViewTracking(
  callback: TrackCallback,
  debug = false
): void {
  trackCallback = callback;
  debugEnabled = debug;

  // Patch History API for SPA navigation
  patchHistoryApi();

  // Track initial page view
  triggerPageView();
}

/**
 * Stop automatic page view tracking and restore original behavior
 */
export function teardownPageViewTracking(): void {
  unpatchHistoryApi();
  trackCallback = null;
  lastTrackedUrl = null;
  debugEnabled = false;
}

/**
 * Manually trigger a page view (useful for custom routing scenarios)
 * @param trackFn - Track function to call
 */
export function trackPageView(trackFn: TrackCallback): void {
  const properties = capturePageViewProperties();
  trackFn(PAGE_VIEW_EVENT, properties);
}
