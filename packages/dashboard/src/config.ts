interface Config {
  apiUrl: string;
}

function getConfig(): Config {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    console.warn('[Dashboard] VITE_API_URL not set, using default');
  }

  return {
    apiUrl: apiUrl || 'http://localhost:4000',
  };
}

export const config = getConfig();
