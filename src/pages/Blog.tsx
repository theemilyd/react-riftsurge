import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Calendar, Clock, Search, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchGraphQL, getImageUrl } from "@/lib/api";
import { GET_POSTS } from "@/lib/graphql";
import { Skeleton } from "@/components/ui/skeleton";

// Types matching GraphQL query
interface PostNode {
    id: string;
    title: string;
    slug: string;
    date: string; // ISO 8601 format string
    excerpt?: string;
    author?: { node: { name: string } };
    categories?: { nodes: { name: string; slug: string }[] };
    featuredImage?: { node: { sourceUrl: string; altText?: string } };
    // readTime?: string; // Add if you have this field
}

interface PostsData {
    posts: {
        nodes: PostNode[];
        pageInfo?: { hasNextPage: boolean; endCursor: string; }
    }
    // Potentially fetch categories separately for filtering UI
    // categories?: { nodes: { name: string; slug: string }[] }
}

const Blog = () => {
    // TODO: Implement search and category filtering state and logic
    // const [searchTerm, setSearchTerm] = useState('');
    // const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const { data, isLoading, error } = useQuery<PostsData>({
        queryKey: ['posts', 'archive'], // Add filters to key if implemented
        queryFn: () => fetchGraphQL(GET_POSTS, { first: 10 }), // Adjust 'first' as needed
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

    const allPosts = data?.posts?.nodes || [];
    const featuredPost = allPosts.length > 0 ? allPosts[0] : null;
    const remainingPosts = allPosts.slice(1);

    // Static categories for UI - fetch dynamically if needed
    const categories = [
        { name: "AI Trends", slug: "ai-trends" },
        { name: "Machine Learning", slug: "machine-learning" },
        { name: "NLP", slug: "nlp" },
        { name: "AI Ethics", slug: "ai-ethics" },
    ];

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch (e) {
            return dateString; // Fallback
        }
    };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section (Could fetch from a 'Blog Archive' page) */}
      <section className="relative py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-[#1A1F2C] to-[#2D324A]">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              Our <span className="text-[#9b87f5]">Blog</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-300">
              Insights, trends, and thought leadership in AI and technology.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Search and Categories */}
      <section className="py-8 px-4 md:px-8 lg:px-16 border-b border-border sticky top-16 z-30 bg-background/95 backdrop-blur">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                className="pl-10"
                // value={searchTerm}
                // onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10">
                All
              </Button>
              {/* Map over fetched or static categories */}
               {categories.map(cat => (
                   <Button key={cat.slug} variant="outline" size="sm" className="border-border text-foreground hover:bg-accent">
                     {cat.name}
                   </Button>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="container mx-auto">
            {isLoading && <FeaturedPostSkeleton />}
            {error && <div className="text-center text-destructive">Error loading featured post.</div>}
            {!isLoading && !error && !featuredPost && <div className="text-center text-muted-foreground">No posts found.</div>}
            {!isLoading && !error && featuredPost && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <Link to={`/blog/${featuredPost.slug}`} className="rounded-lg overflow-hidden block group">
                <img
                    src={getImageUrl(featuredPost.featuredImage?.node?.sourceUrl)}
                    alt={featuredPost.featuredImage?.node?.altText || featuredPost.title}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                />
                </Link>
                <div>
                <div className="mb-4">
                    {/* Display first category */}
                    {featuredPost.categories?.nodes?.[0] && (
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#9b87f5]/10 text-[#9b87f5]">
                        {featuredPost.categories.nodes[0].name}
                    </span>
                    )}
                </div>
                <Link to={`/blog/${featuredPost.slug}`}>
                   <h2 className="text-3xl font-bold mb-4 hover:text-[#9b87f5] transition-colors">{featuredPost.title}</h2>
                </Link>
                {/* Use dangerouslySetInnerHTML for excerpt if it contains HTML */}
                {featuredPost.excerpt && (
                    <div className="text-muted-foreground mb-6" dangerouslySetInnerHTML={{ __html: featuredPost.excerpt }} />
                )}
                <div className="flex items-center flex-wrap gap-4 mb-6">
                    {featuredPost.author?.node?.name && (
                    <div className="flex items-center text-sm text-muted-foreground">
                        <User className="h-4 w-4 mr-1" />
                        {featuredPost.author.node.name}
                    </div>
                    )}
                    <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(featuredPost.date)}
                    </div>
                    {/* Add Read Time if available */}
                    {/* <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {featuredPost.readTime}
                    </div> */}
                </div>
                <Button asChild className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white">
                    <Link to={`/blog/${featuredPost.slug}`}>Read Article</Link>
                </Button>
                </div>
            </div>
            )}
        </div>
      </section>

      <Separator className="container mx-auto" />

      {/* Blog Post Grid */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="container mx-auto">
           {isLoading && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {Array.from({ length: 6 }).map((_, i) => <BlogPostCardSkeleton key={i} />)}
             </div>
           )}
           {error && <div className="text-center text-destructive">Error loading posts.</div>}
           {!isLoading && !error && remainingPosts.length === 0 && !featuredPost && (
              <div className="text-center text-muted-foreground">No posts available.</div>
           )}
           {!isLoading && !error && remainingPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {remainingPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
           )}
          {/* Add Load More / Pagination based on pageInfo */}
          {/* <div className="mt-12 text-center">
            <Button variant="outline" className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10">
              Load More Articles <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div> */}
        </div>
      </section>
    </div>
  );
};

// --- Sub-Components ---

const BlogPostCard = ({ post }: { post: PostNode }) => {
     const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });
        } catch(e) { return dateString; }
    };

  return (
    <div className="border border-border rounded-lg overflow-hidden hover:border-[#9b87f5] transition-colors duration-300 flex flex-col group">
      <Link to={`/blog/${post.slug}`} className="block aspect-video w-full overflow-hidden">
        <img
          src={getImageUrl(post.featuredImage?.node?.sourceUrl)}
          alt={post.featuredImage?.node?.altText || post.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </Link>
      <div className="p-6 flex-grow flex flex-col">
        <div className="mb-3">
          {/* Display first category */}
          {post.categories?.nodes?.[0] && (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#9b87f5]/10 text-[#9b87f5]">
              {post.categories.nodes[0].name}
            </span>
          )}
        </div>
        <Link to={`/blog/${post.slug}`}>
           <h3 className="text-xl font-semibold mb-3 group-hover:text-[#9b87f5] transition-colors">{post.title}</h3>
        </Link>
        {post.excerpt && (
           <div className="text-muted-foreground mb-4 text-sm flex-grow" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
        )}
        <div className="flex items-center flex-wrap gap-4 mb-4 text-xs text-muted-foreground">
          {post.author?.node?.name && (
            <div className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              {post.author.node.name}
            </div>
          )}
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(post.date)}
          </div>
           {/* Add Read Time if available */}
          {/* <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {post.readTime}
          </div> */}
        </div>
        <Link
          to={`/blog/${post.slug}`}
          className="text-[#9b87f5] text-sm font-medium hover:underline flex items-center self-start mt-auto" // Align link to bottom
        >
          Read Article <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

// --- Skeleton Loaders ---

const FeaturedPostSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <Skeleton className="rounded-lg w-full aspect-video" />
        <div className="space-y-4">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
             <div className="flex items-center gap-4">
                 <Skeleton className="h-5 w-24" />
                 <Skeleton className="h-5 w-24" />
                 <Skeleton className="h-5 w-20" />
             </div>
            <Skeleton className="h-10 w-32" />
        </div>
    </div>
);

const BlogPostCardSkeleton = () => (
    <div className="border border-border rounded-lg overflow-hidden">
        <Skeleton className="aspect-video w-full" />
        <div className="p-6 space-y-3">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <div className="flex items-center gap-4">
                 <Skeleton className="h-4 w-20" />
                 <Skeleton className="h-4 w-20" />
                 <Skeleton className="h-4 w-16" />
             </div>
            <Skeleton className="h-5 w-28" />
        </div>
    </div>
);


export default Blog;