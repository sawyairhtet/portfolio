/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_FORMSPREE_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

interface Window {
    __portfolioLoadTime?: number;
}
