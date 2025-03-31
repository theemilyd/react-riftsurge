import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGraphQL, getImageUrl } from "@/lib/api";
import { GET_PORTFOLIO_ITEMS } from "@/lib/graphql";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom"; // Import Link

// Types matching GraphQL query (adjust as needed)
interface PortfolioItemNode {
    id: string;
    title: string;
    slug: string;
    content?: string; // Or a custom field for description
     featuredImage?: {
        node: {
            sourceUrl: string;
            altText: string;
        }
    }
    portfolioCategories?: {
        nodes: {
            name: string;
            slug: string;
        }[]
    }
}

interface PortfolioItemsData {
    portfolioItems: {
        nodes: PortfolioItemNode[];
        // pageInfo?: { hasNextPage: boolean; endCursor: string; } // For pagination
    }
     // Query for categories if needed separately
     // portfolioCategories?: {
     //    nodes: { name: string; slug: string; }[]
     // }
}

// Static categories for filtering UI - could fetch dynamically if needed
const categories = [
    { id: "all", name: "All Projects", slug: "" }, // 'all' maps to no specific category slug
    // These slugs should match the slugs in your WordPress portfolioCategories taxonomy
    { id: "portraits", name: "AI Portraits", slug: "ai-portraits" },
    { id: "landscapes", name: "AI Landscapes", slug: "ai-landscapes" },
    { id: "abstract", name: "Abstract Art", slug: "abstract-art" },
    { id: "commercial", name: "Commercial", slug: "commercial" },
];

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all"); // 'id' from categories array

  const activeCategorySlug = categories.find(cat => cat.id === activeFilter)?.slug;

  // Fetch portfolio items based on the active filter
  const { data, isLoading, error } = useQuery<PortfolioItemsData>({
    // Query key changes when filter changes to refetch
    queryKey: ['portfolioItems', activeCategorySlug || 'all'],
    queryFn: () => fetchGraphQL(GET_PORTFOLIO_ITEMS, {
        first: 12, // Fetch more items for the main portfolio page
        category: activeCategorySlug || null // Pass null or omit if 'all'
    }),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const projects = data?.portfolioItems?.nodes || [];

  // --- Static Data (Replace with fetched data if needed) ---
  const testimonials = [
    { quote: "RiftSurge's AI-generated artwork...", author: "Alex Chen", company: "TechVision Co." },
    { quote: "Working with RiftSurge was a game-changer...", author: "Sarah Johnson", company: "Bright Marketing" },
    { quote: "Incredible attention to detail...", author: "Michael Torres", company: "Creative Studios" },
  ];
  const ctaTitle = "Ready to Commission AI Artwork?";
  const ctaSubtitle = "Let's discuss your project and create something amazing together";
  // --- End Static Data ---


  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section (Could fetch content from a 'Portfolio Archive' page in WP) */}
      <section className="relative py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-[#1A1F2C] to-[#2D324A]">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              My AI Art <span className="text-[#9b87f5]">Portfolio</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-300">
              Explore my collection of AI-generated artwork and commercial projects
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-4 md:px-8 lg:px-16 border-b border-border sticky top-16 z-30 bg-background/95 backdrop-blur"> {/* Make sticky */}
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center gap-4">
            <Filter className="h-5 w-5 text-[#9b87f5] hidden md:block" />
            <span className="font-medium mr-2 hidden md:block">Filter:</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeFilter === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(category.id)}
                  className={activeFilter === category.id
                    ? "bg-[#9b87f5] hover:bg-[#8B5CF6]"
                    : "border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10"}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="container mx-auto">
           {isLoading && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {Array.from({ length: 9 }).map((_, i) => <ProjectCardSkeleton key={i} />)}
               </div>
           )}
           {error && (
               <div className="text-center text-destructive py-10">Error loading portfolio items.</div>
           )}
           {!isLoading && !error && projects.length === 0 && (
               <div className="text-center text-muted-foreground py-10">No projects found for this category.</div>
           )}
           {!isLoading && !error && projects.length > 0 && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {projects.map((project) => (
                 <ProjectCard
                   key={project.id}
                   title={project.title}
                   image={getImageUrl(project.featuredImage?.node?.sourceUrl)}
                   alt={project.featuredImage?.node?.altText}
                   description={project.content ? project.content.substring(0, 100) + '...' : ''} // Example: use excerpt or custom field
                   categories={project.portfolioCategories?.nodes.map(cat => cat.name) || []}
                   slug={project.slug} // Pass slug for linking
                 />
               ))}
             </div>
           )}

          {/* Pagination could be added here using pageInfo from GraphQL */}
          {/* Example button - Remove if not needed or implement pagination */}
          {/* <div className="text-center mt-16">
            <Button
              variant="outline"
              className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10"
            >
              Load More
            </Button>
          </div> */}
        </div>
      </section>

      {/* Testimonials Section - Use fetched data or keep static */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#1A1F2C]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Client Testimonials</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Hear what clients have to say about my AI-generated artwork
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
             {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  quote={testimonial.quote}
                  author={testimonial.author}
                  company={testimonial.company}
                />
             ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Use fetched data or keep static */}
      <section className="py-20 px-4 md:px-8 lg:px-16">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{ctaTitle}</h2>
            <p className="text-lg mb-8 text-muted-foreground">
              {ctaSubtitle}
            </p>
            <Button size="lg" asChild className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white">
               <Link to="/contact">Contact Me</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Sub-Components ---

// Project Card Component - Added Link
const ProjectCard = ({
  title,
  image,
  alt,
  description,
  categories,
  slug
}: {
  title: string,
  image: string,
  alt?: string | null,
  description: string,
  categories: string[],
  slug: string,
}) => {
  return (
    <div className="overflow-hidden rounded-lg border border-border group hover:border-[#9b87f5] transition-colors duration-300 flex flex-col">
      <Link to={`/portfolio/${slug}`} className="block aspect-square w-full overflow-hidden">
        <img
          src={image}
          alt={alt || title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy" // Add lazy loading
        />
      </Link>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {categories.map((category, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 rounded-full bg-[#9b87f5]/10 text-[#9b87f5]"
            >
              {category}
            </span>
          ))}
        </div>
        {/* Use dangerouslySetInnerHTML if description contains basic HTML from WP */}
        <p className="text-muted-foreground text-sm flex-grow" dangerouslySetInnerHTML={{ __html: description }} />
        <Button
          variant="link"
          className="p-0 h-auto mt-4 text-[#9b87f5] self-start" // Align button left
          asChild
        >
          <Link to={`/portfolio/${slug}`}>View Details</Link>
        </Button>
      </div>
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({
  quote,
  author,
  company
}: {
  quote: string,
  author: string,
  company: string
}) => {
  return (
    <div className="bg-[#2D324A]/50 p-6 rounded-lg">
      <p className="text-gray-300 mb-4 italic">"{quote}"</p>
      <div>
        <p className="font-semibold text-white">{author}</p>
        <p className="text-[#9b87f5] text-sm">{company}</p>
      </div>
    </div>
  );
};

// Skeleton Loader for Project Card
const ProjectCardSkeleton = () => (
  <div className="overflow-hidden rounded-lg border border-border">
    <Skeleton className="aspect-square w-full" />
    <div className="p-6 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-5 w-24 mt-2" />
    </div>
  </div>
);

export default Portfolio;