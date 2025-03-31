import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
// Note: This page likely corresponds to an 'About' page in WordPress.
// Content should be fetched from that page. For now, using static content structure.

const About = () => {

    // --- Static Data (Replace with fetched data from WP page/ACF fields) ---
    const pageTitle = "About <span class=\"text-[#9b87f5]\">AIStudio</span>"; // Assuming AIStudio is the intended name here
    const pageSubtitle = "Pioneering the future of business through intelligent AI solutions.";
    const storyContent = `
      <p class="text-muted-foreground mb-4">Founded in 2018, AIStudio began with a vision to democratize artificial intelligence and make cutting-edge technology accessible to businesses of all sizes.</p>
      <p class="text-muted-foreground mb-4">Our team of AI experts, data scientists, and business strategists came together with a shared passion for transforming how organizations operate through intelligent automation and data-driven decision making.</p>
      <p class="text-muted-foreground">Today, we've helped over 150 clients across 20+ countries implement AI solutions that have revolutionized their operations and created measurable business value.</p>
    `;
    const storyImage = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"; // Example
    const mission = "To empower organizations with intelligent AI solutions that drive innovation, efficiency, and growth...";
    const values = [
        { title: "Innovation", description: "We continuously push the boundaries..." },
        { title: "Integrity", description: "We operate with transparency..." },
        { title: "Impact", description: "We measure our success by the tangible results..." },
        { title: "Inclusion", description: "We believe diverse perspectives lead to better AI..." },
    ];
    const expertise = [
        { title: "Machine Learning", percentage: 95 },
        { title: "Natural Language Processing", percentage: 90 },
        { title: "Computer Vision", percentage: 85 },
        { title: "Predictive Analytics", percentage: 92 },
        { title: "Neural Networks", percentage: 88 },
        { title: "Robotics & Automation", percentage: 80 },
    ];
    const team = [
        { name: "Dr. Sarah Chen", role: "Founder & CEO", image: "https://randomuser.me/api/portraits/women/22.jpg" },
        { name: "James Wilson", role: "CTO", image: "https://randomuser.me/api/portraits/men/32.jpg" },
        { name: "Maria Rodriguez", role: "Head of AI Research", image: "https://randomuser.me/api/portraits/women/44.jpg" },
        { name: "David Kim", role: "Chief Data Scientist", image: "https://randomuser.me/api/portraits/men/56.jpg" },
    ];
    // --- End Static Data ---


  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-[#1A1F2C] to-[#2D324A]">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight" dangerouslySetInnerHTML={{ __html: pageTitle }} />
            <p className="text-lg md:text-xl mb-8 text-gray-300">
              {pageSubtitle}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              {/* Render HTML content fetched from WordPress */}
              <div dangerouslySetInnerHTML={{ __html: storyContent }} />
            </div>
            <div className="rounded-lg overflow-hidden">
              <img
                src={storyImage}
                alt="Team collaboration"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#1A1F2C]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">Our Mission</h2>
              <p className="text-gray-300">
                {mission}
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">Our Values</h2>
              <ul className="space-y-4 text-gray-300">
                {values.map((value, index) => (
                    <li key={index} className="flex items-start">
                    <span className="text-[#9b87f5] font-bold mr-3 w-8 text-right shrink-0">0{index + 1}.</span>
                    <div>
                        <h3 className="font-semibold text-white">{value.title}</h3>
                        <p>{value.description}</p>
                    </div>
                    </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Expertise */}
      <section className="py-20 px-4 md:px-8 lg:px-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
             {expertise.map((skill, index) => (
                 <ExpertiseBar key={index} title={skill.title} percentage={skill.percentage} />
             ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Leadership Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             {team.map((member, index) => (
                 <TeamMember
                     key={index}
                     name={member.name}
                     role={member.role}
                     image={member.image}
                 />
             ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Sub-Components ---

const ExpertiseBar = ({ title, percentage }: { title: string, percentage: number }) => {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-medium">{title}</span>
        <span>{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-2 [&>div]:bg-[#9b87f5]" /> {/* Custom color */}
    </div>
  );
};

const TeamMember = ({ name, role, image }: { name: string, role: string, image: string }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <Avatar className="h-32 w-32 mb-4">
        <AvatarImage src={image} alt={name} loading="lazy" />
        <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
      </Avatar>
      <h3 className="text-xl font-semibold">{name}</h3>
      <p className="text-muted-foreground">{role}</p>
    </div>
  );
};

export default About;