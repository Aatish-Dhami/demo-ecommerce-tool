import { init, track, destroy, flush, isInitialized } from '@flowtel/tracker';
import { EventType } from '@flowtel/shared';
import { config } from '../config';

export function initializeTracker(): void {
  if (isInitialized()) {
    return;
  }

  const { apiUrl, shopId, apiKey, trackerDebug } = config;

  if (!apiUrl || !shopId || !apiKey) {
    console.warn('[Flowtel] Missing required environment variables for tracker');
    return;
  }

  init({
    shopId,
    endpoint: `${apiUrl}/api/events`,
    apiKey,
    debug: trackerDebug,
    autoTrackPageViews: true,
  });
}

export { track, destroy, flush, isInitialized };
export { EventType };
