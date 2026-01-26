interface Config {
  apiUrl: string;
  shopId: string;
  apiKey: string;
  trackerDebug: boolean;
}

function getConfig(): Config {
  const apiUrl = import.meta.env.VITE_API_URL;
  const shopId = import.meta.env.VITE_SHOP_ID;
  const apiKey = import.meta.env.VITE_API_KEY;
  const trackerDebug = import.meta.env.VITE_TRACKER_DEBUG === 'true';

  if (!apiUrl || !shopId || !apiKey) {
    console.warn('[Flowtel] Missing required environment variables');
  }

  return {
    apiUrl: apiUrl || 'http://localhost:4000',
    shopId: shopId || '',
    apiKey: apiKey || '',
    trackerDebug,
  };
}

export const config = getConfig();
