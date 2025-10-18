import { LandingPageNavbar } from "../components/LandingPageNavbar"
import { FirstPage } from "../LandingPage/FirstPage";
import { Features } from "../LandingPage/Features";
import { Testimonials } from "../LandingPage/Testimonials";
import { Pricing } from "../LandingPage/Pricing";
import { CTA } from "../LandingPage/CTA";
import { FAQs } from "../LandingPage/FAQs"
import { Footer } from "../LandingPage/Footer";
import "../styles/LandingPage.css";

export const LandingPage = () => {
  return (
    <div className="landing-page bg-slate-900">
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
