import { GraphQLClient } from 'graphql-request';

// Ensure you have VITE_WORDPRESS_API_URL defined in your .env file
// Example: VITE_WORDPRESS_API_URL="https://your-wordpress-site.com/graphql"
const GQL_ENDPOINT = import.meta.env.VITE_WORDPRESS_API_URL;

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
  if (!GQL_ENDPOINT) {
     // Avoid making requests if the endpoint isn't configured
     console.error("GraphQL endpoint not configured. Skipping fetch.");
     // Depending on your error handling, you might return null, empty data, or throw
     return Promise.reject("GraphQL endpoint not configured.");
  }
  try {
    return await gqlClient.request<T>(query, variables);
  } catch (error) {
    console.error("GraphQL request failed:", error);
    // Rethrow or handle error as appropriate for your application
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
  // return `${getWordPressUrl()}${sourceUrl}`;
  // Often, WPGraphQL returns absolute URLs for media items, so this might be sufficient:
   return sourceUrl;
};