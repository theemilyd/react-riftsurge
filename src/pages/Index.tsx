import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Video, PenTool, BarChart3, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchGraphQL, getImageUrl, shouldUseFallback } from "@/lib/api"; // Import API helpers
import { GET_PAGE_BY_URI, GET_PORTFOLIO_ITEMS } from "@/lib/graphql"; // Import queries
import { Skeleton } from "@/components/ui/skeleton"; // For loading states

// Define types based on your GraphQL schema (adjust fields as needed)
interface PageData {
  page: {
    id: string;
    title: string;
    content: string; // This will be HTML content from WordPress editor
    featuredImage?: {
        node: {
            sourceUrl: string;
            altText: string;
        }
    }
  } | null; // Page might not exist
}

interface PortfolioItemNode {
    id: string;
    title: string;
    slug: string;
     featuredImage?: {
        node: {
            sourceUrl: string;
            altText: string;
        }
    }
}

interface PortfolioItemsData {
    portfolioItems: {
        nodes: PortfolioItemNode[];
    }
}

// Component for individual service card
const ServiceCard = ({ icon, title, description, link }: { 
    icon: React.ReactNode; 
    title: string; 
    description: string; 
    link: string 
}) => (
    <Card className="h-full">
        <CardHeader>
            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                {icon}
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <CardDescription className="text-base mb-4">{description}</CardDescription>
            <Link to={link} className="group inline-flex items-center text-sm font-medium text-primary">
                Learn more <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
        </CardContent>
    </Card>
);

// Loading skeleton component
const IndexSkeleton = () => (
    <div className="space-y-10 py-10">
        <div className="container">
            <Skeleton className="h-[400px] w-full" />
        </div>
        <div className="container">
            <Skeleton className="h-10 w-[250px] mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array(4).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-[250px]" />
                ))}
            </div>
        </div>
    </div>
);

const Index = () => {
    // Check if we should use fallback content
    const useFallback = shouldUseFallback();
    console.log("Using fallback content:", useFallback);

    // Fetch page content for the homepage (assuming its URI is '/')
    const { data: pageData, isLoading: isLoadingPage, error: pageError } = useQuery<PageData>({
        queryKey: ['page', '/'],
        queryFn: () => fetchGraphQL(GET_PAGE_BY_URI, { uri: '/' }),
        retry: 2, // Retry twice before showing error
        retryDelay: 1000, // Wait 1 second between retries
        enabled: !useFallback, // Only run query if not using fallback
    });

     // Fetch recent portfolio items for the preview section
     const { data: portfolioData, isLoading: isLoadingPortfolio } = useQuery<PortfolioItemsData>({
        queryKey: ['portfolioItems', 'homepagePreview'],
        queryFn: () => fetchGraphQL(GET_PORTFOLIO_ITEMS, { first: 6 }), // Fetch 6 items
        retry: 2, // Retry twice
        retryDelay: 1000, // Wait 1 second between retries
        enabled: !useFallback, // Only run query if not using fallback
    });

    const pageContent = pageData?.page?.content; // HTML content
    const heroImage = pageData?.page?.featuredImage?.node; // Example: using featured image
    const portfolioItems = portfolioData?.portfolioItems?.nodes || [];

    // --- Static Data (Replace with fetched data or specific ACF fields) ---
    // These should ideally come from WordPress custom fields (ACF) or page content parsing
    const heroTitle = "AI-Powered Visuals <br /> That Drive <span class=\"text-[#9b87f5]\">Growth</span>"; // Example, fetch or parse
    const heroSubtitle = "Transform your brand with cutting-edge AI technology. Create stunning visuals, engaging content, and data-driven strategies that connect with your audience.";
    const stats = [
        { value: "800M+", label: "Views Generated" },
        { value: "5K+", label: "Projects Completed" },
        { value: "98%", label: "Client Satisfaction" },
    ];
    const servicesTitle = "Services I Offer";
    const servicesSubtitle = "Premium AI-powered visual and content creation services to elevate your brand";
    const services = [
         { icon: <Video />, title: "AI Video Generation", description: "Transform your ideas into captivating videos with our AI-powered video creation services.", link: "/services" },
         { icon: <PenTool />, title: "AI Ad Design", description: "Create eye-catching advertisements that convert viewers into customers with AI assistance.", link: "/services" },
         { icon: <BarChart3 />, title: "Social Growth", description: "Boost your social media presence with data-driven strategies powered by artificial intelligence.", link: "/services" },
         { icon: <MessageSquare />, title: "AI Content Writing", description: "Generate engaging, SEO-optimized content that resonates with your target audience.", link: "/services" },
    ];
    const whyWorkTitle = "Why Work With Me?";
    const whyWorkPoints = [
        "Unique creative vision, blending art & technology to create cutting-edge visuals",
        "Proven ability to generate viral engagement and reach new audiences",
        "Custom AI solutions tailored to your brand's unique voice and aesthetic",
        "Expertise in cutting-edge AI visual tools and technologies"
    ];
    const whyWorkStats = [ { value: "800M+", label: "views" }, { value: "5 years", label: "in AI art" } ];
    const portfolioTitle = "Portfolio Highlights";
    const portfolioSubtitle = "Explore a selection of my AI-generated artwork and projects";
    const ctaTitle = "Ready to Transform Your Brand with AI?";
    const ctaSubtitle = "Let's create stunning visuals and content that will elevate your brand and engage your audience.";
    // --- End Static Data ---

    if (isLoadingPage && !useFallback) {
      return <IndexSkeleton />; // Show skeleton loader
    }

    if ((pageError || !pageData?.page) && !useFallback) {
        // Handle error or page not found - show a more detailed error message but also display content
        console.error('Page data error:', pageError);
        
        // Create a banner to show error but let the user see static homepage content
        const ErrorBanner = () => (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
                <div className="flex">
                    <div>
                        <p className="text-sm text-red-700">
                            <strong>Note:</strong> We encountered an error connecting to our content API.
                            You're seeing a static version of our homepage.
                        </p>
                    </div>
                </div>
            </div>
        );
        
        // Show static version of homepage with error banner
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto pt-8">
                    <ErrorBanner />
                </div>
                
                {/* Static Hero Section */}
                <section className="relative py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-[#1A1F2C] to-[#2D324A]">
                    <div className="container mx-auto">
                        <div className="flex flex-col lg:flex-row items-center gap-12">
                            <div className="lg:w-1/2">
                                <h1
                                    className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight"
                                    dangerouslySetInnerHTML={{ __html: heroTitle }}
                                />
                                <p className="text-lg md:text-xl mb-8 text-gray-300">
                                    {heroSubtitle}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button size="lg" asChild className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white">
                                        <Link to="/contact">Get Started</Link>
                                    </Button>
                                    <Button size="lg" variant="outline" asChild className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10">
                                        <Link to="/portfolio">View Portfolio</Link>
                                    </Button>
                                </div>
                                
                                {/* Stats */}
                                <div className="flex flex-wrap gap-8 mt-12">
                                    {stats.map((stat, index) => (
                                        <div key={index} className="text-center">
                                            <p className="text-4xl font-bold text-[#9b87f5] mb-1">{stat.value}</p>
                                            <p className="text-white text-sm">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="lg:w-1/2">
                                {/* Placeholder image */}
                                <div className="rounded-lg w-full max-w-md mx-auto aspect-square bg-muted flex items-center justify-center">
                                    <span className="text-muted-foreground">Image Placeholder</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent"></div>
                </section>
                
                {/* Services Section */}
                <section className="py-20 px-4 md:px-8 lg:px-16">
                    <div className="container mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">{servicesTitle}</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                {servicesSubtitle}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {services.map((service, index) => (
                                <ServiceCard
                                    key={index}
                                    icon={service.icon}
                                    title={service.title}
                                    description={service.description}
                                    link={service.link}
                                />
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* CTA Section */}
                <section className="py-16 px-4 md:px-8 lg:px-16 bg-[#1A1F2C] text-white text-center">
                    <div className="container mx-auto max-w-3xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">{ctaTitle}</h2>
                        <p className="mb-8 text-gray-300">{ctaSubtitle}</p>
                        <Button size="lg" asChild className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white">
                            <Link to="/contact">Contact Us Today</Link>
                        </Button>
                    </div>
                </section>
            </div>
        );
    }

  // If using fallback content, display the static version
  if (useFallback) {
    return (
        <div className="min-h-screen bg-background">
            {/* Add an error banner when using fallback */}
            <div className="container mx-auto pt-8">
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8">
                    <div className="flex">
                        <div>
                            <p className="text-sm text-amber-700">
                                <strong>Note:</strong> You're seeing a static version of our homepage while we connect to our content API.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Static Hero Section */}
            <section className="relative py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-[#1A1F2C] to-[#2D324A]">
                <div className="container mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/2">
                            <h1
                                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight"
                                dangerouslySetInnerHTML={{ __html: heroTitle }}
                            />
                            <p className="text-lg md:text-xl mb-8 text-gray-300">
                                {heroSubtitle}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button size="lg" asChild className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white">
                                    <Link to="/contact">Get Started</Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10">
                                    <Link to="/portfolio">View Portfolio</Link>
                                </Button>
                            </div>
                            
                            {/* Stats */}
                            <div className="flex flex-wrap gap-8 mt-12">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <p className="text-4xl font-bold text-[#9b87f5] mb-1">{stat.value}</p>
                                        <p className="text-white text-sm">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            {/* Placeholder image */}
                            <div className="rounded-lg w-full max-w-md mx-auto aspect-square bg-muted flex items-center justify-center">
                                <span className="text-muted-foreground">Image Placeholder</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent"></div>
            </section>
            
            {/* Services Section */}
            <section className="py-20 px-4 md:px-8 lg:px-16">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">{servicesTitle}</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {servicesSubtitle}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {services.map((service, index) => (
                            <ServiceCard
                                key={index}
                                icon={service.icon}
                                title={service.title}
                                description={service.description}
                                link={service.link}
                            />
                        ))}
                    </div>
                </div>
            </section>
            
            {/* CTA Section */}
            <section className="py-16 px-4 md:px-8 lg:px-16 bg-[#1A1F2C] text-white text-center">
                <div className="container mx-auto max-w-3xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{ctaTitle}</h2>
                    <p className="mb-8 text-gray-300">{ctaSubtitle}</p>
                    <Button size="lg" asChild className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white">
                        <Link to="/contact">Contact Us Today</Link>
                    </Button>
                </div>
            </section>
        </div>
    );
  }

  // Regular rendering with WordPress data
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Use fetched data */}
      <section className="relative py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-[#1A1F2C] to-[#2D324A]">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              {/* Use HTML content from WordPress */}
              <div 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight"
                dangerouslySetInnerHTML={{ __html: pageContent || heroTitle }}
              />
              <p className="text-lg md:text-xl mb-8 text-gray-300">
                {heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white">
                  <Link to="/contact">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10">
                  <Link to="/portfolio">View Portfolio</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 mt-12">
                 {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <p className="text-4xl font-bold text-[#9b87f5] mb-1">{stat.value}</p>
                      <p className="text-white text-sm">{stat.label}</p>
                    </div>
                 ))}
              </div>
            </div>
            <div className="lg:w-1/2">
              {/* Use featured image from WordPress or fallback/placeholder */}
               {heroImage ? (
                  <img 
                     src={getImageUrl(heroImage.sourceUrl)} 
                     alt={heroImage.altText || "Hero Image"}
                     className="rounded-lg w-full h-auto max-w-md mx-auto object-cover"
                  />
               ) : (
                  <div className="rounded-lg w-full max-w-md mx-auto aspect-square bg-muted flex items-center justify-center">
                     <span className="text-muted-foreground">Image Coming Soon</span>
                  </div>
               )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{servicesTitle}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {servicesSubtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                link={service.link}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-[#1A1F2C] text-white text-center">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{ctaTitle}</h2>
          <p className="mb-8 text-gray-300">{ctaSubtitle}</p>
          <Button size="lg" asChild className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white">
            <Link to="/contact">Contact Us Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
