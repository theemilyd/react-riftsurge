import { GraphQLClient } from 'graphql-request';

// Ensure you have VITE_WORDPRESS_API_URL defined in your .env file
// Example: VITE_WORDPRESS_API_URL="https://your-wordpress-site.com/graphql"
const GQL_ENDPOINT = import.meta.env.VITE_WORDPRESS_API_URL;
const USE_STATIC_FALLBACK = import.meta.env.VITE_USE_STATIC_FALLBACK === 'true';

// For debugging in development
if (import.meta.env.DEV) {
  console.log("WordPress API URL:", GQL_ENDPOINT);
  console.log("Using static fallback:", USE_STATIC_FALLBACK);
}

// Check if we're in a Vercel environment
export const isVercelEnvironment = () => {
  return typeof window !== 'undefined' && 
         (window.location.hostname.includes('vercel.app') || 
          import.meta.env.VITE_VERCEL_ENV);
};

// Detect if we should use the fallback content
export const shouldUseFallback = () => {
  return USE_STATIC_FALLBACK || isVercelEnvironment();
};

if (!GQL_ENDPOINT) {
  console.error(
    "ERROR: VITE_WORDPRESS_API_URL is not defined in your environment variables."
  );
  // You might want to throw an error here in a real application
  // throw new Error("VITE_WORDPRESS_API_URL is not defined.");
}

// Create a GraphQL client instance
// For authenticated requests (e.g., previews, mutations), you'll need to handle token injection here.
export const gqlClient = new GraphQLClient(GQL_ENDPOINT || "");

// Generic fetch function using the client
export const fetchGraphQL = async <T = any>(query: string, variables?: Record<string, any>): Promise<T> => {
  // If we're configured to use static fallback, reject the promise to trigger error handlers
  if (shouldUseFallback()) {
    console.log("Using static fallback content - skipping API fetch");
    return Promise.reject("Using static fallback content");
  }

  if (!GQL_ENDPOINT) {
     // Avoid making requests if the endpoint isn't configured
     console.error("GraphQL endpoint not configured. Skipping fetch.");
     // Depending on your error handling, you might return null, empty data, or throw
     return Promise.reject("GraphQL endpoint not configured.");
  }
  try {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] GraphQL request to: ${GQL_ENDPOINT}`);
    console.log('Query:', query.substring(0, 50) + '...');
    console.log('Variables:', JSON.stringify(variables));
    
    const response = await fetch(GQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[${timestamp}] GraphQL error - Status: ${response.status}`, 
                   `Text: ${errorText.substring(0, 200)}${errorText.length > 200 ? '...' : ''}`);
      throw new Error(`GraphQL request failed with status ${response.status}: ${errorText}`);
    }

    const json = await response.json();

    if (json.errors) {
      console.error(`[${timestamp}] GraphQL response contained errors:`, json.errors);
      throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
    }

    console.log(`[${timestamp}] GraphQL request successful`);
    return json.data as T;
  } catch (error) {
    console.error('GraphQL fetch error:', error);
    console.error('API URL:', GQL_ENDPOINT);
    console.error('Environment:', import.meta.env.MODE);
    console.error('User Agent:', navigator.userAgent);
    throw error;
  }
};

// Helper function to get the base URL for assets if needed
// You might store this in WP Options and fetch it, or use env variables.
export const getWordPressUrl = (): string => {
    // Replace with your actual WordPress backend URL or fetch dynamically
    return import.meta.env.VITE_WORDPRESS_BASE_URL || "http://localhost:8000";
}

// Helper to resolve asset URLs from WordPress
// (Adjust logic based on how media is handled in your WPGraphQL schema)
export const getImageUrl = (sourceUrl?: string | null): string => {
  if (!sourceUrl) {
    // Return a placeholder or handle missing images
    return "/placeholder.png"; // Make sure you have a placeholder image
  }
  // If sourceUrl is already absolute, return it. Otherwise, prepend WP base URL.
  if (sourceUrl.startsWith('http://') || sourceUrl.startsWith('https://')) {
    return sourceUrl;
  }
  // This assumes sourceUrl is a relative path from the WP root, adjust if needed
  return `${getWordPressUrl()}${sourceUrl}`;
  // Often, WPGraphQL returns absolute URLs for media items, so this might be sufficient:
  // return sourceUrl;
};