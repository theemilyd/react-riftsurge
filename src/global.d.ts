// Global type declarations
import { ClassValue } from "clsx";

declare global {
  interface Window {
    cn: (...inputs: ClassValue[]) => string;
    reactLoaded?: boolean;
  }
}

export {};

// Add environment variable types
interface ImportMetaEnv {
  readonly VITE_WORDPRESS_API_URL: string;
  readonly VITE_WORDPRESS_BASE_URL: string;
  readonly VITE_USE_STATIC_FALLBACK: string;
  readonly VITE_VERCEL_ENV?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 