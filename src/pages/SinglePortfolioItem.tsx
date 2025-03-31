import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchGraphQL, getImageUrl } from '@/lib/api';
import { GET_PORTFOLIO_ITEM_BY_SLUG } from '@/lib/graphql';
import { Skeleton } from '@/components/ui/skeleton';
import NotFound from './NotFound';
// import { Helmet } from 'react-helmet-async';

// Type matching GraphQL query for a single portfolio item
interface SinglePortfolioData {
    portfolioItem: {
        id: string;
        title: string;
        content?: string; // HTML content or description
        date?: string; // If available
        featuredImage?: { node: { sourceUrl: string; altText?: string } };
        portfolioCategories?: { nodes: { name: string; slug: string }[] };
         seo?: { // Example SEO fields
            title?: string;
            metaDesc?: string;
        }
        // Add other custom fields (ACF, etc.)
    } | null;
}

const SinglePortfolioItem = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, error, isError } = useQuery<SinglePortfolioData>({
    queryKey: ['portfolioItem', slug],
    queryFn: () => fetchGraphQL(GET_PORTFOLIO_ITEM_BY_SLUG, { slug }),
    enabled: !!slug,
    retry: false,
  });

  const item = data?.portfolioItem;
  const seoTitle = item?.seo?.title || item?.title;
  const seoDesc = item?.seo?.metaDesc;

  // Optional: Update document title
  useEffect(() => {
    if (seoTitle) {
      document.title = seoTitle;
    }
  }, [seoTitle]);


  if (isLoading) {
    return <SinglePortfolioSkeleton />;
  }

  if (isError || !item) {
     console.error(`Error fetching portfolio item for slug: ${slug}`, error);
    return <NotFound />;
  }

  return (
    <div className="bg-background min-h-screen">
       {/* <Helmet>
          {seoTitle && <title>{seoTitle}</title>}
          {seoDesc && <meta name="description" content={seoDesc} />}
       </Helmet> */}

      {/* Hero/Title Section */}
      <section className="py-12 px-4 md:px-8 lg:px-16 bg-muted/30 border-b">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{item.title}</h1>
           {/* Categories */}
           {item.portfolioCategories?.nodes && item.portfolioCategories.nodes.length > 0 && (
                 <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                     {item.portfolioCategories.nodes.map(cat => (
                         <span key={cat.slug} className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground text-xs">{cat.name}</span>
                     ))}
                 </div>
            )}
        </div>
      </section>

      <div className="container mx-auto max-w-5xl py-10 px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Image */}
          <div className="md:col-span-2">
            {item.featuredImage?.node ? (
              <img
                src={getImageUrl(item.featuredImage.node.sourceUrl)}
                alt={item.featuredImage.node.altText || item.title}
                className="w-full h-auto rounded-lg shadow-md"
              />
            ) : (
                <Skeleton className="w-full aspect-[4/3] rounded-lg"/>
            )}
          </div>

          {/* Details / Content */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-semibold mb-4">Project Details</h2>
             {item.content ? (
                <div
                  className="prose prose-sm max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
             ) : (
                <p className="text-muted-foreground">Details about this project will be available soon.</p>
             )}

            {/* Add other details here - e.g., Client, Year, Tools Used, from ACF fields */}
            {/* <div className="mt-6 space-y-2 border-t pt-4">
                <p><span className="font-medium">Client:</span> Client Name</p>
                <p><span className="font-medium">Year:</span> 2023</p>
            </div> */}
          </div>
        </div>

        {/* Optional: Gallery or related projects section */}

      </div>
    </div>
  );
};

const SinglePortfolioSkeleton = () => (
    <div className="bg-background min-h-screen">
        <section className="py-12 px-4 md:px-8 lg:px-16 bg-muted/30 border-b">
            <div className="container mx-auto text-center space-y-2">
                <Skeleton className="h-10 w-1/2 mx-auto" />
                 <div className="flex items-center justify-center gap-2">
                     <Skeleton className="h-5 w-20 rounded" />
                     <Skeleton className="h-5 w-16 rounded" />
                 </div>
            </div>
        </section>
        <div className="container mx-auto max-w-5xl py-10 px-4 md:px-8 lg:px-16">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="md:col-span-2">
                     <Skeleton className="w-full aspect-[4/3] rounded-lg"/>
                 </div>
                 <div className="md:col-span-1 space-y-4">
                     <Skeleton className="h-8 w-3/4" />
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-5/6" />
                     <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                 </div>
             </div>
        </div>
    </div>
);

export default SinglePortfolioItem;