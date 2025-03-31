import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchGraphQL, getImageUrl } from '@/lib/api';
import { GET_POST_BY_SLUG } from '@/lib/graphql';
import { Calendar, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import NotFound from './NotFound';
// import { Helmet } from 'react-helmet-async';

// Type matching GraphQL query for a single post
interface SinglePostData {
    post: {
        id: string;
        title: string;
        content: string; // HTML content
        date: string;
        author?: { node: { name: string } };
        categories?: { nodes: { name: string; slug: string }[] };
        featuredImage?: { node: { sourceUrl: string; altText?: string } };
         seo?: {
            title?: string;
            metaDesc?: string;
        }
        // Add other fields
    } | null;
}


const SinglePost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, error, isError } = useQuery<SinglePostData>({
    queryKey: ['post', slug],
    queryFn: () => fetchGraphQL(GET_POST_BY_SLUG, { slug }),
    enabled: !!slug, // Only run if slug exists
    retry: false,
  });

  const post = data?.post;
  const seoTitle = post?.seo?.title || post?.title;
  const seoDesc = post?.seo?.metaDesc;

   const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
        } catch(e) { return dateString; }
    };

  // Optional: Update document title
   useEffect(() => {
     if (seoTitle) {
       document.title = seoTitle;
     }
   }, [seoTitle]);

  if (isLoading) {
    return <SinglePostSkeleton />;
  }

  if (isError || !post) {
     console.error(`Error fetching post for slug: ${slug}`, error);
     return <NotFound />;
  }

  return (
    <div className="bg-background">
        {/* <Helmet>
           {seoTitle && <title>{seoTitle}</title>}
           {seoDesc && <meta name="description" content={seoDesc} />}
        </Helmet> */}

      {/* Optional Featured Image Header */}
      {post.featuredImage?.node && (
        <div className="h-64 md:h-96 overflow-hidden relative bg-muted">
          <img
            src={getImageUrl(post.featuredImage.node.sourceUrl)}
            alt={post.featuredImage.node.altText || post.title}
            className="w-full h-full object-cover"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>
      )}

      <div className="container mx-auto max-w-4xl py-10 px-4 md:px-8 lg:px-16">
        <article>
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center flex-wrap gap-4 text-sm text-muted-foreground">
              {post.author?.node?.name && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {post.author.node.name}
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(post.date)}
              </div>
              {/* Categories */}
              {post.categories?.nodes && post.categories.nodes.length > 0 && (
                 <div className="flex items-center gap-2">
                     <span>In:</span>
                     {post.categories.nodes.map(cat => (
                         <span key={cat.slug} className="px-2 py-0.5 rounded bg-muted text-xs">{cat.name}</span>
                     ))}
                 </div>
              )}
            </div>
          </header>

          {/* Render WordPress Content */}
          <div
            className="prose lg:prose-xl max-w-none" // Use Tailwind Typography
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Optional: Add related posts or comments section here */}
      </div>
    </div>
  );
};


const SinglePostSkeleton = () => (
    <div className="bg-background">
        <Skeleton className="h-64 md:h-96 w-full" />
        <div className="container mx-auto max-w-4xl py-10 px-4 md:px-8 lg:px-16 space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <div className="flex items-center gap-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-28" />
                 <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-1/2" />
             <Skeleton className="h-5 w-full" />
             <Skeleton className="h-5 w-4/5" />

        </div>
    </div>
);


export default SinglePost;