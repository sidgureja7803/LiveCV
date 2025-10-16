/// <reference types="vite/client" />

interface ImportMeta {
  env: {
    VITE_API_BASE_URL: string;
    [key: string]: any;
  };
}
