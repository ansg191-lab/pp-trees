/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_S3_BASE_URL: string;
  readonly VITE_MAPBOX_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
