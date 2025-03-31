import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to RiftSurge</h1>
        <p className="text-xl mb-8">
          This is a simplified static page for testing the Vercel deployment.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild>
            <Link to="/about">About Us</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/contact">Contact</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
