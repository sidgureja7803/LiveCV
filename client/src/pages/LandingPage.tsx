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
import Lenis from 'lenis';
import "../styles/LandingPage.css";

export const LandingPage = () => {
  const { isDark } = useTheme();
  
  // Initialize Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
      wrapper: window,
      content: document.documentElement,
    });

    // Add lenis class to html element
    document.documentElement.classList.add('lenis');

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Handle hash links for smooth scrolling
    const handleHashLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.hash) {
        const element = document.querySelector(target.hash);
        if (element) {
          e.preventDefault();
          lenis.scrollTo(element, { duration: 1.5 });
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
          lenis.scrollTo(element, { duration: 1.5 });
        }
      }, 100);
    }
    
    // Cleanup function
    return () => {
      lenis.destroy();
      document.documentElement.classList.remove('lenis');
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
