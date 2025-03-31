import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
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

// Add global error handler for debugging
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

// Create a simple query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  }
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout> {/* Wrap all routes in Layout */}
            <Routes>
              {/* Specific Routes (Order matters!) */}
              <Route path="/" element={<ErrorBoundary><Index /></ErrorBoundary>} /> {/* Home page */}
              <Route path="/services" element={<ErrorBoundary><GenericPage slug="services" /></ErrorBoundary>} /> {/* Use GenericPage */}
              <Route path="/portfolio" element={<ErrorBoundary><Portfolio /></ErrorBoundary>} /> {/* Portfolio Archive */}
              <Route path="/portfolio/:slug" element={<ErrorBoundary><SinglePortfolioItem /></ErrorBoundary>} /> {/* Single Portfolio Item */}
              <Route path="/about" element={<ErrorBoundary><GenericPage slug="about" /></ErrorBoundary>} /> {/* Use GenericPage */}
              <Route path="/blog" element={<ErrorBoundary><Blog /></ErrorBoundary>} /> {/* Blog Archive */}
              <Route path="/blog/:slug" element={<ErrorBoundary><SinglePost /></ErrorBoundary>} /> {/* Single Blog Post */}
              <Route path="/contact" element={<ErrorBoundary><GenericPage slug="contact" /></ErrorBoundary>} /> {/* Use GenericPage for Contact */}

              {/* Catch-all for other WordPress pages/posts */}
              {/* Important: Ensure this doesn't conflict with specific routes above */}
              {/* This assumes GenericPage can handle fetching based on the full path */}
              <Route path="/*" element={<ErrorBoundary><GenericPage /></ErrorBoundary>} />

              {/* Fallback 404 Route - Only reached if GenericPage fails or path is truly invalid */}
              {/* <Route path="*" element={<NotFound />} /> */}
              {/* Note: The current GenericPage implementation needs refinement to handle 404s properly */}
              <Route path="*" element={<ErrorBoundary><NotFound /></ErrorBoundary>} /> {/* Keep simple 404 for now */}

            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
