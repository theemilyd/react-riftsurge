import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Video, PenTool, BarChart3, MessageSquare, Image, Brush } from "lucide-react";
import { Link } from "react-router-dom";
// Note: This page likely corresponds to a 'Services' page in WordPress.
// Content should be fetched from that page. For now, using static content structure.

const Services = () => {

    // --- Static Data (Replace with fetched data from WP page/ACF fields) ---
    const pageTitle = "My <span class=\"text-[#9b87f5]\">AI</span> Services";
    const pageSubtitle = "Comprehensive AI visual solutions tailored to your brand's needs. From concept to creation, I'll bring your vision to life.";
    const services = [
        { icon: <Video />, title: "AI Video Generation", description: "Transform your ideas into captivating videos..." },
        { icon: <PenTool />, title: "AI Ad Design", description: "Create eye-catching advertisements that convert..." },
        { icon: <BarChart3 />, title: "Social Growth", description: "Boost your social media presence..." },
        { icon: <MessageSquare />, title: "AI Content Writing", description: "Generate engaging, SEO-optimized content..." },
        { icon: <Image />, title: "Custom AI Artwork", description: "Bespoke AI-generated artwork created..." },
        { icon: <Brush />, title: "Style Transfer", description: "Transform existing imagery into new artistic styles..." },
        { icon: <PenTool />, title: "Character Design", description: "Create unique AI-generated characters..." },
        { icon: <Image />, title: "AI Image Upscaling", description: "Enhance and upscale your existing images..." },
    ];
    const processTitle = "My Creative Process";
    const processSubtitle = "My systematic approach ensures I deliver the best AI-generated visuals tailored to your needs.";
    const processSteps = [
        { number: "01", title: "Discovery", description: "I learn about your brand, needs, and vision..." },
        { number: "02", title: "Concept", description: "I develop initial concepts and creative directions..." },
        { number: "03", title: "Creation", description: "Using cutting-edge AI tools, I create high-quality visuals..." },
        { number: "04", title: "Refinement", description: "I refine and perfect the AI-generated content..." },
    ];
    const pricingTitle = "Pricing Plans";
    const pricingSubtitle = "Flexible pricing options to suit your needs and budget";
    const pricingPlans = [
         { title: "Basic", price: "$99", description: "Perfect for individuals...", features: ["5 AI-generated images", "1 concept revision", "..."], popular: false },
         { title: "Professional", price: "$249", description: "Ideal for small businesses...", features: ["15 AI-generated images", "3 concept revisions", "..."], popular: true },
         { title: "Enterprise", price: "$599", description: "For businesses needing premium...", features: ["40 AI-generated images", "Unlimited revisions", "..."], popular: false },
    ];
    const ctaTitle = "Ready to Create Amazing AI Art?";
    const ctaSubtitle = "Contact me today to discuss your AI art and visual needs...";
    // --- End Static Data ---

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-[#1A1F2C] to-[#2D324A]">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight" dangerouslySetInnerHTML={{ __html: pageTitle }}/>
            <p className="text-lg md:text-xl mb-8 text-gray-300">
              {pageSubtitle}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Services List */}
      <section className="py-20 px-4 md:px-8 lg:px-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
                <ServiceCard
                    key={index}
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                />
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#1A1F2C]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{processTitle}</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              {processSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {processSteps.map((step, index) => (
                 <ProcessCard
                     key={index}
                     number={step.number}
                     title={step.title}
                     description={step.description}
                 />
             ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{pricingTitle}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {pricingSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
             {pricingPlans.map((plan, index) => (
                 <PricingCard
                     key={index}
                     title={plan.title}
                     price={plan.price}
                     description={plan.description}
                     features={plan.features}
                     popular={plan.popular}
                 />
             ))}
          </div>
           <div className="text-center mt-12 text-muted-foreground">
              Need a custom solution? <Link to="/contact" className="text-[#9b87f5] hover:underline">Contact me</Link> for a tailored quote.
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-[#1A1F2C] to-[#2D324A]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">{ctaTitle}</h2>
            <p className="text-lg mb-8 text-gray-300">
              {ctaSubtitle}
            </p>
            <Button size="lg" asChild className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Sub-Components (Consider moving to separate files) ---

const ServiceCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
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
        {/* Optionally add a "Learn More" link if each service has its own page */}
         <Link to="/contact" className="text-[#9b87f5] flex items-center mt-4 text-sm hover:underline">
           Inquire <ArrowRight className="ml-1 h-4 w-4" />
         </Link>
      </CardContent>
    </Card>
  );
};

const ProcessCard = ({ number, title, description }: { number: string, title: string, description: string }) => {
  return (
    <div className="bg-[#2D324A]/50 p-6 rounded-lg">
      <div className="text-[#9b87f5] text-5xl font-bold mb-4">{number}</div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

const PricingCard = ({
  title,
  price,
  description,
  features,
  popular = false
}: {
  title: string,
  price: string,
  description: string,
  features: string[],
  popular?: boolean
}) => {
  return (
    <Card className={`border ${popular ? 'border-[#9b87f5] shadow-lg' : 'border-border'} relative overflow-hidden flex flex-col`}>
      {popular && (
        <div className="absolute top-0 right-[-1px] bg-[#9b87f5] text-white px-4 py-1 text-xs font-medium rounded-bl-md">
          Popular
        </div>
      )}
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{title}</CardTitle>
        <div className="mt-4 mb-2">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground">/project</span>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <ul className="space-y-3 flex-grow">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-[#9b87f5] shrink-0" // Added shrink-0
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          className={`w-full mt-6 ${popular ? 'bg-[#9b87f5] hover:bg-[#8B5CF6] text-white' : 'bg-background border border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10'}`}
          asChild
        >
          <Link to="/contact">Choose Plan</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default Services;
