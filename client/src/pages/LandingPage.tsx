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
