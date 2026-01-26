/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SHOP_ID: string;
  readonly VITE_API_KEY: string;
  readonly VITE_TRACKER_DEBUG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
