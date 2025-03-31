import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on mode
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    // Define build options for better optimization
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      // No manual chunks to avoid any directory read errors
    },
    
    // Development server settings
    server: {
      host: "::",
      port: 8080,
    },
    
    // Preview settings for local production build testing
    preview: {
      port: 4173,
      host: true,
    },
    
    // Plugins
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    
    // Path resolution
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    
    // Define replacements for env variables in production builds
    define: {
      // Make environment mode available to the app
      '__APP_ENV__': JSON.stringify(mode),
    },
  };
});
