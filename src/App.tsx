import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import SinglePost from "./pages/SinglePost"; // Import new component
import SinglePortfolioItem from "./pages/SinglePortfolioItem"; // Import new component
import GenericPage from "./pages/GenericPage"; // Import new component

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout> {/* Wrap all routes in Layout */}
          <Routes>
            {/* Specific Routes (Order matters!) */}
            <Route path="/" element={<Index />} /> {/* Home page */}
            <Route path="/services" element={<GenericPage slug="services" />} /> {/* Use GenericPage */}
            <Route path="/portfolio" element={<Portfolio />} /> {/* Portfolio Archive */}
            <Route path="/portfolio/:slug" element={<SinglePortfolioItem />} /> {/* Single Portfolio Item */}
            <Route path="/about" element={<GenericPage slug="about" />} /> {/* Use GenericPage */}
            <Route path="/blog" element={<Blog />} /> {/* Blog Archive */}
            <Route path="/blog/:slug" element={<SinglePost />} /> {/* Single Blog Post */}
            <Route path="/contact" element={<GenericPage slug="contact" />} /> {/* Use GenericPage for Contact */}

            {/* Catch-all for other WordPress pages/posts */}
            {/* Important: Ensure this doesn't conflict with specific routes above */}
            {/* This assumes GenericPage can handle fetching based on the full path */}
            <Route path="/*" element={<GenericPage />} />

            {/* Fallback 404 Route - Only reached if GenericPage fails or path is truly invalid */}
            {/* <Route path="*" element={<NotFound />} /> */}
            {/* Note: The current GenericPage implementation needs refinement to handle 404s properly */}
             <Route path="*" element={<NotFound />} /> {/* Keep simple 404 for now */}

          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
