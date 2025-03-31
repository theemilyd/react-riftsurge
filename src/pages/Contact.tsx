import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
// Note: Actual form submission requires a backend or service.
// This component only handles the frontend state and provides a placeholder submit handler.

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Form data to be sent:", formData);

    // --- Placeholder for actual submission logic ---
    // Option 1: Use a WordPress form plugin API (e.g., Contact Form 7 REST API)
    // Option 2: Use a GraphQL mutation if your WP backend supports it
    // Option 3: Use a third-party service like Formspree, Netlify Forms, etc.
    try {
       // Example using fetch to a hypothetical endpoint (replace with actual implementation)
       /*
       const response = await fetch('/api/contact', { // Or your WP endpoint
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(formData),
       });

       if (!response.ok) {
         throw new Error('Failed to send message');
       }
       */

       // Simulate network delay
       await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Message sent! I'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" }); // Clear form

    } catch (error) {
       console.error("Form submission error:", error);
       toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
    // --- End Placeholder ---
  };

    // --- Static Data (Replace with fetched data if needed from WP Options) ---
    const contactInfo = [
      { icon: <Mail className="text-[#9b87f5]" />, title: "Email", content: "contact@riftsurge.com", description: "For quotes, inquiries, and collaboration" },
      { icon: <Phone className="text-[#9b87f5]" />, title: "Phone", content: "+1 (555) 123-4567", description: "Available weekdays 9AM-5PM EST" },
      { icon: <MessageSquare className="text-[#9b87f5]" />, title: "Social Media", content: "@RiftSurge", description: "Follow for latest AI art updates and inspiration" },
    ];
    const faqs = [
        { q: "What AI technologies do you use...", a: "I use a variety of cutting-edge AI tools..." },
        { q: "How does pricing work...", a: "Pricing depends on complexity..." },
        { q: "How many revisions are included...", a: "The number of revisions varies by package..." },
        { q: "Do I own the rights...", a: "Yes, when you purchase AI artwork from me..." },
        { q: "How long does it take...", a: "Turnaround time depends on project complexity..." },
        { q: "Can you create AI art in a specific style?", a: "Absolutely! I can create AI-generated artwork..." }
    ];
    // --- End Static Data ---

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section (Could fetch from a 'Contact' page in WP) */}
      <section className="relative py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-[#1A1F2C] to-[#2D324A]">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              Let's <span className="text-[#9b87f5]">Create</span> Together
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-300">
              Reach out to discuss your AI art needs and how we can collaborate
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                Whether you have a specific project in mind or just want to explore possibilities,
                I'm here to help bring your vision to life with AI-powered creativity.
              </p>

              <div className="space-y-6">
                {/* Map over fetched or static contact info */}
                {contactInfo.map((info, index) => (
                    <ContactInfoCard
                      key={index}
                      icon={info.icon}
                      title={info.title}
                      content={info.content}
                      description={info.description}
                    />
                ))}
              </div>
            </div>

            <div>
              <Card className="border border-border p-6">
                <h3 className="text-xl font-semibold mb-4">Send a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                       disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-1">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                       disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                       disabled={isSubmitting}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#9b87f5] hover:bg-[#8B5CF6] text-white"
                     disabled={isSubmitting}
                  >
                     {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section (Could fetch from custom post type or ACF Repeater) */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#1A1F2C]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-white">Frequently Asked Questions</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Common questions about my AI art services and process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
             {faqs.map((faq, index) => (
                 <FAQCard key={index} question={faq.q} answer={faq.a} />
             ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Sub-Components ---

const ContactInfoCard = ({
  icon,
  title,
  content,
  description
}: {
  icon: React.ReactNode,
  title: string,
  content: string,
  description: string
}) => {
  return (
    <div className="flex items-start">
      <div className="h-12 w-12 rounded-md bg-[#9b87f5]/10 flex items-center justify-center mr-4 shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-[#9b87f5] mb-1 break-words">{content}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
};

const FAQCard = ({
  question,
  answer
}: {
  question: string,
  answer: string
}) => {
  return (
    <div className="bg-[#2D324A]/50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-3 text-white">{question}</h3>
      <p className="text-gray-300">{answer}</p>
    </div>
  );
};

export default Contact;