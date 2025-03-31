import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Video, PenTool, BarChart3, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchGraphQL, getImageUrl } from "@/lib/api"; // Import API helpers
import { GET_PAGE_BY_URI, GET_PORTFOLIO_ITEMS } from "@/lib/graphql"; // Import queries
import { Skeleton } from "@/components/ui/skeleton"; // For loading states

// Define types based on your GraphQL schema (adjust fields as needed)
interface PageData {
  page: {
    id: string;
    title: string;
    content: string; // This will be HTML content from WordPress editor
    // Add fields for custom data if you use ACF or similar
    // heroSection?: { title: string; subtitle: string; button1Text: string; button2Text: string; };
    // statsSection?: { stat1Value: string; stat1Label: string; ... };
    // servicesSection?: { title: string; subtitle: string; };
    // whyWorkSection?: { title: string; points: { pointText: string }[]; stat1: string; stat1Label: string; ... }
    // portfolioSection?: { title: string; subtitle: string; }
    // ctaSection?: { title: string; subtitle: string; buttonText: string; }
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

const Index = () => {
    // Fetch page content for the homepage (assuming its URI is '/')
    // Adjust '/ ' if your homepage is set differently in WordPress > Settings > Reading
    const { data: pageData, isLoading: isLoadingPage, error: pageError } = useQuery<PageData>({
        queryKey: ['page', '/'],
        queryFn: () => fetchGraphQL(GET_PAGE_BY_URI, { uri: '/' }),
        retry: 2, // Retry twice before showing error
        retryDelay: 1000, // Wait 1 second between retries
    });

     // Fetch recent portfolio items for the preview section
     const { data: portfolioData, isLoading: isLoadingPortfolio } = useQuery<PortfolioItemsData>({
        queryKey: ['portfolioItems', 'homepagePreview'],
        queryFn: () => fetchGraphQL(GET_PORTFOLIO_ITEMS, { first: 6 }), // Fetch 6 items
        retry: 2, // Retry twice
        retryDelay: 1000, // Wait 1 second between retries
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
         { icon: <Video />, title: "AI Video Generation", description: "Transform your ideas into captivating videos...", link: "/services" }, // Link should ideally be dynamic
         { icon: <PenTool />, title: "AI Ad Design", description: "Create eye-catching advertisements that convert...", link: "/services" },
         { icon: <BarChart3 />, title: "Social Growth", description: "Boost your social media presence with data-driven strategies...", link: "/services" },
         { icon: <MessageSquare />, title: "AI Content Writing", description: "Generate engaging, SEO-optimized content...", link: "/services" },
    ];
    const whyWorkTitle = "Why Work With Me?";
    const whyWorkPoints = [
        "Unique creative vision, blending art & technology...",
        "Proven ability to generate viral engagement...",
        "Custom AI solutions tailored to your brand's unique voice...",
        "Expertise in cutting-edge AI visual tools...",
    ];
    const whyWorkStats = [ { value: "800M+", label: "views" }, { value: "5 years", label: "in AI art" } ];
    const portfolioTitle = "Portfolio Highlights";
    const portfolioSubtitle = "Explore a selection of my AI-generated artwork and projects";
    const ctaTitle = "Ready to Transform Your Brand with AI?";
    const ctaSubtitle = "Let's create stunning visuals and content that will elevate your brand...";
    // --- End Static Data ---

    // TEMPORARY: Always show fallback content for testing purposes
    // Remove this return statement and uncomment the conditional rendering below after testing
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto pt-8">
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8">
                    <div className="flex">
                        <div>
                            <p className="text-sm text-amber-700">
                                <strong>Testing Mode:</strong> This is the static fallback version of our homepage.
                                We're using this to test deployment on Vercel.
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
                            <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                                <CardHeader className="text-center">
                                    <div className="w-12 h-12 mx-auto bg-[#9b87f5]/10 rounded-full flex items-center justify-center text-[#9b87f5]">
                                        {service.icon}
                                    </div>
                                    <CardTitle className="mt-4 mb-2">{service.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="mb-4 text-center">
                                        {service.description}
                                    </CardDescription>
                                    <div className="text-center">
                                        <Button variant="link" asChild className="text-[#9b87f5] p-0">
                                            <Link to={service.link}>
                                                Learn More <ArrowRight className="ml-1 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* CTA Section */}
            <section className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-[#1A1F2C] to-[#2D324A]">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{ctaTitle}</h2>
                    <p className="text-gray-300 max-w-2xl mx-auto mb-8">{ctaSubtitle}</p>
                    <Button size="lg" asChild className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white">
                        <Link to="/contact">Schedule a Consultation</Link>
                    </Button>
                </div>
            </section>
        </div>
    );

    /* COMMENTED OUT FOR TESTING - Uncomment after testing
    if (isLoadingPage) {
      return <IndexSkeleton />; // Show skeleton loader
    }

    if (pageError || !pageData?.page) {
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
                
                // Static content sections...
            </div>
        );
    }

    return (
        // Normal content rendering...
    );
    */
};

// --- Sub-Components (Keep or move to separate files) ---

// Service Card Component
const ServiceCard = ({ icon, title, description, link }: { icon: React.ReactNode, title: string, description: string, link: string }) => {
  return (
    <Card className="border border-border hover:border-[#9b87f5] transition-colors duration-300 flex flex-col">
      <CardHeader>
        <div className="h-12 w-12 rounded-md bg-[#9b87f5]/10 flex items-center justify-center text-[#9b87f5] mb-4">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <CardDescription className="text-base flex-grow">{description}</CardDescription>
        <Link to={link} className="text-[#9b87f5] flex items-center mt-4 text-sm hover:underline">
          Learn more <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
};

// Portfolio Card Component
const PortfolioCard = ({ title, image, alt, link }: { title: string, image: string, alt?: string | null, link: string }) => {
  return (
    <Link to={link} className="group relative block overflow-hidden rounded-lg">
      <div className="aspect-square w-full overflow-hidden rounded-lg border border-border">
        <img
          src={image}
          alt={alt || title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
      </div>
    </Link>
  );
};

// Why Work With Me Item Component
const WhyWorkItem = ({ text }: { text: string }) => {
  return (
    <li className="flex items-start">
      <span className="text-[#9b87f5] mr-3 mt-1">•</span>
      <p className="text-gray-300">{text}</p>
    </li>
  );
};

// --- Skeleton Loaders ---

const IndexSkeleton = () => (
  <div className="space-y-16 md:space-y-20 lg:space-y-24">
    {/* Hero Skeleton */}
    <section className="relative py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-[#1A1F2C] to-[#2D324A]">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-10 w-full" />
               <Skeleton className="h-10 w-full" />
               <div className="flex flex-wrap gap-8 mt-12">
                  <Skeleton className="h-16 w-24" />
                  <Skeleton className="h-16 w-24" />
                  <Skeleton className="h-16 w-24" />
               </div>
            </div>
            <div className="lg:w-1/2">
                <Skeleton className="rounded-lg w-full max-w-md mx-auto aspect-square" />
            </div>
          </div>
        </div>
      </section>

    {/* Services Skeleton */}
    <section className="py-20 px-4 container mx-auto">
        <div className="text-center mb-16 space-y-4">
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-5 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-lg" />)}
        </div>
    </section>

    {/* Why Work Skeleton */}
     <section className="py-16 px-4 bg-[#1A1F2C]">
         <div className="container mx-auto">
           <div className="flex flex-col lg:flex-row items-center gap-12">
             <div className="lg:w-1/2 space-y-6">
                 <Skeleton className="h-10 w-1/2" />
                 <Skeleton className="h-5 w-full" />
                 <Skeleton className="h-5 w-full" />
                 <Skeleton className="h-5 w-4/5" />
                 <Skeleton className="h-5 w-full" />
             </div>
             <div className="lg:w-1/2 space-y-4">
                  <Skeleton className="h-24 rounded-lg" />
                  <Skeleton className="h-24 rounded-lg" />
             </div>
           </div>
         </div>
       </section>

    {/* Portfolio Preview Skeleton */}
    <section className="py-20 px-4 container mx-auto">
        <div className="text-center mb-16 space-y-4">
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-5 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {Array.from({ length: 6 }).map((_, i) => <PortfolioCardSkeleton key={i} />)}
        </div>
         <div className="text-center mt-12">
             <Skeleton className="h-11 w-48 mx-auto rounded-md" />
         </div>
    </section>

    {/* CTA Skeleton */}
     <section className="py-20 px-4 bg-gradient-to-br from-[#1A1F2C] to-[#2D324A]">
         <div className="container mx-auto max-w-4xl text-center space-y-6">
             <Skeleton className="h-10 w-3/4 mx-auto" />
             <Skeleton className="h-5 w-full mx-auto" />
             <Skeleton className="h-12 w-40 mx-auto rounded-md" />
         </div>
       </section>
  </div>
);

const PortfolioCardSkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <Skeleton className="h-5 w-3/4" />
    </div>
);

export default Index;
