import { init, track, destroy, flush, isInitialized } from '@flowtel/tracker';
import { EventType } from '@flowtel/shared';

export function initializeTracker(): void {
  if (isInitialized()) {
    return;
  }

  const apiUrl = import.meta.env.VITE_API_URL;
  const shopId = import.meta.env.VITE_SHOP_ID;
  const apiKey = import.meta.env.VITE_API_KEY;
  const debug = import.meta.env.VITE_TRACKER_DEBUG === 'true';

  if (!apiUrl || !shopId || !apiKey) {
    console.warn('[Flowtel] Missing required environment variables for tracker');
    return;
  }

  init({
    shopId,
    endpoint: `${apiUrl}/api/events`,
    apiKey,
    debug,
    autoTrackPageViews: true,
  });
}

export { track, destroy, flush, isInitialized };
export { EventType };
