import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { cn } from './lib/utils'

// Make the cn function available globally as it's referenced in global.d.ts
window.cn = cn;

// Add console logs for debugging on Vercel
console.log('App initializing...');
console.log('Environment:', import.meta.env.MODE);
console.log('Env vars available:', {
  apiUrl: import.meta.env.VITE_WORDPRESS_API_URL?.substring(0, 20) + '...',
  baseUrl: import.meta.env.VITE_WORDPRESS_BASE_URL?.substring(0, 20) + '...',
  useStaticFallback: import.meta.env.VITE_USE_STATIC_FALLBACK
});

// Error handling to prevent blank screens
try {
  console.log('Rendering app...');
  const rootElement = document.getElementById("root");
  
  if (rootElement) {
    // Remove loading message if present
    const loadingMessage = rootElement.querySelector('.loading-message');
    if (loadingMessage) {
      loadingMessage.remove();
    }
    
    createRoot(rootElement).render(<App />);
    console.log('App rendered successfully');
    
    // Mark as loaded to prevent fallback from showing
    window.reactLoaded = true;
  } else {
    console.error('Root element not found!');
    // Create a root element if it doesn't exist
    const newRoot = document.createElement('div');
    newRoot.id = 'root';
    document.body.appendChild(newRoot);
    createRoot(newRoot).render(<App />);
    console.log('Created new root element and rendered app');
    
    // Mark as loaded to prevent fallback from showing
    window.reactLoaded = true;
  }
} catch (error) {
  console.error('Error rendering app:', error);
  
  // Display a visible error message on the page
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1>Something went wrong</h1>
      <p>Sorry, we encountered an error while loading the application.</p>
      <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto;">${error instanceof Error ? error.message : String(error)}</pre>
    </div>
  `;
}
