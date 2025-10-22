import { useEffect } from "react";
import { LandingPageNavbar } from "../components/LandingPageNavbar"
import { FirstPage } from "../LandingPage/FirstPage";
import { Features } from "../LandingPage/Features";
import { Testimonials } from "../LandingPage/Testimonials";
import { Pricing } from "../LandingPage/Pricing";
import { CTA } from "../LandingPage/CTA";
import { FAQs } from "../LandingPage/FAQs"
import { Footer } from "../LandingPage/Footer";
import { DebugAuthButton } from "../components/DebugAuthButton";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/LandingPage.css";

export const LandingPage = () => {
  const { isDark } = useTheme();
  
  // Add smooth scrolling behavior to the document
  useEffect(() => {
    // Save the original scroll behavior
    const originalStyle = window.getComputedStyle(document.documentElement).scrollBehavior;
    
    // Apply smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Handle hash links for smooth scrolling
    const handleHashLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.hash) {
        const element = document.querySelector(target.hash);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: 'smooth' });
          // Update URL without reload
          window.history.pushState(null, '', target.hash);
        }
      }
    };
    
    // Add click event listener
    document.addEventListener('click', handleHashLinkClick);
    
    // Check if there's a hash in the URL on load
    if (window.location.hash) {
      setTimeout(() => {
        const element = document.querySelector(window.location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    
    // Cleanup function
    return () => {
      // Restore original scroll behavior
      document.documentElement.style.scrollBehavior = originalStyle;
      document.removeEventListener('click', handleHashLinkClick);
    };
  }, []);
  
  return (
    <div className={`landing-page transition-colors duration-300 ${
      isDark ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      {/* Debug Auth Button - Only in development */}
      <DebugAuthButton />
      
      {/* Fixed Navbar */}
      <LandingPageNavbar />
      
      {/* Main Content */}
      <main>
        <FirstPage />
        <Features />
        <Testimonials />
        <Pricing />
        <FAQs />
        <CTA />
        <Footer />
      </main>
    </div>
  );
};
