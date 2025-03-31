import React, { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom'; // Use NavLink for active styles
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchGraphQL, getImageUrl } from '@/lib/api'; // Import API helpers
import { GET_MENU_ITEMS, GET_SITE_SETTINGS } from '@/lib/graphql'; // Import queries
import { Skeleton } from '@/components/ui/skeleton'; // For loading states

interface LayoutProps {
  children: React.ReactNode;
}

// Define types for menu items and site settings based on your GraphQL schema
interface MenuItemNode {
  id: string;
  label: string;
  path: string; // Relative path like '/about/'
}

interface MenuItemsData {
  menuItems: {
    nodes: MenuItemNode[];
  };
}

interface SiteSettingsData {
    generalSettings: {
        title: string;
        description: string;
    };
    // themeOptions?: { // Example if using ACF options
    //   footerText?: string;
    // }
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Fetch Menu Items
  const { data: menuData, isLoading: isLoadingMenu } = useQuery<MenuItemsData>({
    queryKey: ['menuItems', 'PRIMARY'], // Adjust location key if needed
    queryFn: () => fetchGraphQL(GET_MENU_ITEMS, { location: 'PRIMARY' }),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  // Fetch Site Settings (e.g., title, description, maybe footer text)
   const { data: siteSettingsData, isLoading: isLoadingSettings } = useQuery<SiteSettingsData>({
    queryKey: ['siteSettings'],
    queryFn: () => fetchGraphQL(GET_SITE_SETTINGS),
    staleTime: Infinity, // Cache indefinitely
  });

   const siteTitle = siteSettingsData?.generalSettings?.title || 'RiftSurge';
   // const siteDescription = siteSettingsData?.generalSettings?.description || '';
   // const footerText = siteSettingsData?.themeOptions?.footerText || `© ${new Date().getFullYear()} RiftSurge. All rights reserved.`;

  // Update document title (optional, consider react-helmet-async for better SEO)
   useEffect(() => {
    if (siteTitle) {
      document.title = siteTitle;
    }
   }, [siteTitle]);

   const navMenuItems = menuData?.menuItems?.nodes || [];
   // Filter or sort menu items if needed, e.g., based on order prop


  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-[#9b87f5]">
                {/* Use dynamic site title, split if needed */}
                {siteTitle.split(' ')[0]}<span className="text-foreground">{siteTitle.split(' ').slice(1).join(' ') || ''}</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {isLoadingMenu ? (
                 <NavLinksSkeleton count={5} />
              ) : (
                 <NavLinks menuItems={navMenuItems} />
              )}
              <Button asChild className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white">
                 <Link to="/contact">Contact</Link>
              </Button>
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border absolute top-full left-0 right-0 bg-background shadow-lg z-30">
            <div className="container mx-auto px-4 py-4 space-y-3 flex flex-col">
              {isLoadingMenu ? (
                 <NavLinksSkeleton count={5} vertical />
               ) : (
                 <MobileNavLinks menuItems={navMenuItems} setMobileMenuOpen={setMobileMenuOpen} />
               )}
              <Button asChild className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white" onClick={() => setMobileMenuOpen(false)}>
                 <Link to="/contact">Contact</Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-[#1A1F2C] text-white">
        <div className="container mx-auto px-4 md:px-8 py-12">
          {/* Footer content can also be fetched from WordPress options/widgets if needed */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
             <div>
               <Link to="/" className="text-2xl font-bold text-[#9b87f5]">
                  {siteTitle.split(' ')[0]}<span className="text-white">{siteTitle.split(' ').slice(1).join(' ') || ''}</span>
               </Link>
               <p className="mt-4 text-gray-400">
                 {/* This could be fetched */}
                 Transforming brands through AI-powered visuals and data-driven strategies that connect with your audience.
               </p>
             </div>
             <div>
               <h3 className="text-lg font-semibold mb-4">Services</h3>
               <ul className="space-y-2 text-gray-400">
                 {/* These could be fetched or linked to the main services page */}
                 <li><Link to="/services" className="hover:text-[#9b87f5]">AI Video Generation</Link></li>
                 <li><Link to="/services" className="hover:text-[#9b87f5]">AI Ad Design</Link></li>
                 <li><Link to="/services" className="hover:text-[#9b87f5]">Social Growth</Link></li>
                 <li><Link to="/services" className="hover:text-[#9b87f5]">AI Content Writing</Link></li>
               </ul>
             </div>
             <div>
               <h3 className="text-lg font-semibold mb-4">Links</h3>
                {isLoadingMenu ? (
                    <ul className="space-y-2"><FooterLinksSkeleton count={4} /></ul>
                ) : (
                    <ul className="space-y-2 text-gray-400">
                        {navMenuItems.map(item => (
                            <li key={item.id}>
                                <Link to={item.path} className="hover:text-[#9b87f5]">
                                {item.label}
                                </Link>
                            </li>
                         ))}
                         {/* Add contact separately if not in menu */}
                         <li><Link to="/contact" className="hover:text-[#9b87f5]">Contact</Link></li>
                    </ul>
                )}
             </div>
             <div>
               <h3 className="text-lg font-semibold mb-4">Contact</h3>
               <ul className="space-y-2 text-gray-400">
                 {/* Fetch these from WP options */}
                 <li>info@riftsurge.com</li>
                 <li>(555) 123-4567</li>
               </ul>
             </div>
           </div>
          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400">
             {/* Use fetched footer text or default */}
             <p>&copy; {new Date().getFullYear()} {siteTitle}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// NavLinks component using fetched data
const NavLinks = ({ menuItems }: { menuItems: MenuItemNode[] }) => (
  <>
    {menuItems.map((item) => (
      <NavLink
        key={item.id}
        to={item.path}
        className={({ isActive }) =>
          cn(
            "text-foreground hover:text-[#9b87f5]",
            isActive && "text-[#9b87f5] font-medium" // Style for active link
          )
        }
      >
        {item.label}
      </NavLink>
    ))}
  </>
);

// Mobile NavLinks component using fetched data
const MobileNavLinks = ({ menuItems, setMobileMenuOpen }: { menuItems: MenuItemNode[], setMobileMenuOpen: (open: boolean) => void }) => (
  <>
    {menuItems.map((item) => (
       <NavLink
         key={item.id}
         to={item.path}
         className={({ isActive }) =>
          cn(
            "text-foreground hover:text-[#9b87f5] py-2",
             isActive && "text-[#9b87f5] font-medium"
           )
         }
         onClick={() => setMobileMenuOpen(false)}
       >
         {item.label}
       </NavLink>
     ))}
  </>
);

// Skeleton loaders
const NavLinksSkeleton = ({ count = 5, vertical = false }: { count?: number, vertical?: boolean }) => (
    <div className={cn("flex items-center space-x-6", vertical && "flex-col space-x-0 space-y-3 items-start")}>
        {Array.from({ length: count }).map((_, i) => (
            <Skeleton key={i} className={cn("h-5 w-20", vertical && "w-full")} />
        ))}
    </div>
);

const FooterLinksSkeleton = ({ count = 4 }: { count?: number }) => (
    <>
        {Array.from({ length: count }).map((_, i) => (
            <li key={i}><Skeleton className="h-4 w-24" /></li>
        ))}
    </>
);


export default Layout;