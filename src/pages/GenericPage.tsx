import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation } from 'react-router-dom';
import { fetchGraphQL } from '@/lib/api';
import { GET_PAGE_BY_URI } from '@/lib/graphql';
import { Skeleton } from '@/components/ui/skeleton';
import NotFound from './NotFound'; // Import your 404 component
// import { Helmet } from 'react-helmet-async'; // For setting head tags

// Define type for page data based on GraphQL query
interface PageData {
  page: {
    id: string;
    title: string;
    content: string; // HTML content
    date: string;
    seo?: { // Optional SEO fields
        title?: string;
        metaDesc?: string;
    }
    // Add other fields like featuredImage, ACF fields etc. if needed
  } | null; // Page might not exist
}

const GenericPage = ({ slug: propSlug }: { slug?: string }) => {
  const params = useParams();
  const location = useLocation();

  // Determine the URI to fetch: use propSlug, then URL param slug, then full pathname
  const slug = propSlug || params.slug || location.pathname.substring(1); // Remove leading slash
  const uri = slug || '/'; // Default to homepage if slug is empty

  const { data, isLoading, error, isError } = useQuery<PageData>({
    queryKey: ['page', uri], // Unique key based on the URI
    queryFn: () => fetchGraphQL(GET_PAGE_BY_URI, { uri }),
    enabled: !!uri, // Only run query if URI is determined
    retry: false, // Don't retry on 404-like errors from GraphQL
  });

  const page = data?.page;
  const seoTitle = page?.seo?.title || page?.title; // Use SEO title or fallback to page title
  const seoDesc = page?.seo?.metaDesc;

  // Handle loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4 md:px-8 lg:px-16 space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-1/2" />
      </div>
    );
  }

  // Handle page not found (GraphQL query returned null for page) or explicit error
   if (isError || !page) {
       console.error(`Error fetching page for URI: ${uri}`, error);
       return <NotFound />; // Render your 404 component
   }


  // Optional: Update document title (Consider react-helmet-async for full SEO)
  useEffect(() => {
    if (seoTitle) {
      document.title = seoTitle;
    }
    // If using react-helmet-async, update meta description here too
  }, [seoTitle]);


  return (
    <div>
      {/* Optional: Use react-helmet-async to manage head tags */}
      {/* <Helmet>
          {seoTitle && <title>{seoTitle}</title>}
          {seoDesc && <meta name="description" content={seoDesc} />}
          Add other meta tags (Open Graph, etc.) if fetched
      </Helmet> */}

      {/* Example Hero - You might structure this differently based on ACF */}
      <section className="py-12 px-4 md:px-8 lg:px-16 bg-muted/30 border-b">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold">{page.title}</h1>
          {/* Optionally add subtitle or featured image here */}
        </div>
      </section>

      {/* Render WordPress Content */}
      <section className="py-10 px-4 md:px-8 lg:px-16">
        <div
          className="container mx-auto prose lg:prose-xl max-w-none" // Use Tailwind Typography
          dangerouslySetInnerHTML={{ __html: page.content }} // Render HTML from WP
        />
      </section>
    </div>
  );
};

export default GenericPage;
