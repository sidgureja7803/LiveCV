import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, FileText, TrendingUp, CheckCircle } from 'lucide-react';
import livePreviewImage from '/images/live_preview.png';

export const FirstPage = () => {
  const navigate = useNavigate();
  
  const stats = [
    { icon: <Users className="w-6 h-6" />, number: '10,000+', label: 'ACTIVE USERS' },
    { icon: <FileText className="w-6 h-6" />, number: '50,000+', label: 'RESUMES CREATED' },
    { icon: <TrendingUp className="w-6 h-6" />, number: '95%', label: 'SUCCESS RATE' }
  ];

  const features = [
    { icon: <CheckCircle className="w-5 h-5" />, text: 'ATS-OPTIMIZED TEMPLATES' },
    { icon: <CheckCircle className="w-5 h-5" />, text: 'LIVE PDF PREVIEW' },
    { icon: <CheckCircle className="w-5 h-5" />, text: 'AI CONTENT GENERATION' },
    { icon: <CheckCircle className="w-5 h-5" />, text: 'PROFESSIONAL THEMES' }
  ];

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-black">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black to-black"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Left Column - Hero Text */}
            <div className="lg:w-3/5 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center space-x-3 bg-zinc-900/50 border border-zinc-800 px-6 py-2.5 mb-8 backdrop-blur-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs font-semibold text-zinc-400 tracking-[0.15em] uppercase">
                  ENTERPRISE-GRADE RESUME BUILDER
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
                <span className="text-white font-black uppercase block mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '-0.02em' }}>
                  BUILD PROFESSIONAL
                </span>
                <span className="text-white font-black uppercase" style={{ fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '-0.02em' }}>
                  RESUMES IN
                </span>{' '}
                <span className="bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text font-black uppercase" style={{ fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '-0.02em' }}>
                  MINUTES
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl mb-10 text-zinc-400 leading-relaxed font-normal max-w-xl" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                CREATE ATS-OPTIMIZED RESUMES WITH OUR AI-POWERED PLATFORM. STAND OUT FROM THE COMPETITION AND LAND YOUR DREAM JOB FASTER.
              </p>
              
              {/* Feature bullets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 text-zinc-300">
                    <div className="text-blue-500 flex-shrink-0">
                      {feature.icon}
                    </div>
                    <span className="text-sm font-semibold tracking-wide" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-4 mb-16">
                <button
                  onClick={() => navigate('/register')}
                  className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wider uppercase transition-all w-full sm:w-auto border border-blue-500/20 hover:border-blue-400/40 shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>GET STARTED FREE</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                
                <button
                  onClick={() => {
                    const featuresSection = document.getElementById('features');
                    featuresSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 font-bold text-sm tracking-wider uppercase transition-all w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 hover:border-zinc-700"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  LEARN MORE
                </button>
              </div>
            </div>
            
            {/* Right Column - Live Preview Image */}
            <div className="lg:w-2/5 relative">
              <div className="relative z-10 bg-zinc-900 p-2 rounded-xl border border-zinc-800 shadow-2xl">
                {/* Image with fallback */}
                <div className="relative rounded-lg w-full overflow-hidden shadow-xl bg-zinc-800">
                  <img 
                    src={livePreviewImage} 
                    alt="Professional Resume Preview" 
                    className="w-full h-auto object-cover z-10 relative"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  {/* Fallback content */}
                  <div 
                    className="absolute inset-0 flex-col items-center justify-center bg-zinc-800 hidden"
                    style={{minHeight: '300px'}}
                  >
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                      <FileText className="w-16 h-16 text-blue-500" />
                      <p className="text-base font-medium text-center text-zinc-300 px-6">
                        Professional Resume Preview
                        <br />
                        <span className="text-sm text-zinc-500">ATS-Optimized Templates</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Subtle glow effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/10 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-20 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="p-6 bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 hover:border-zinc-700 transition-all">
                <div className="mb-3 text-zinc-600">
                  {stat.icon}
                </div>
                <div className="text-3xl font-black mb-1 text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '-0.02em' }}>
                  {stat.number}
                </div>
                <div className="text-xs font-bold text-zinc-500 tracking-[0.15em] uppercase" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          
          {/* Powered by Appwrite Badge */}
          <div className="flex items-center justify-center mt-16">
            <div className="inline-flex items-center space-x-6 px-8 py-4 border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm">
              <span className="text-xs font-bold text-zinc-500 tracking-[0.15em] uppercase" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                POWERED BY
              </span>
              <a 
                href="https://appwrite.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                >
                  <path d="M12 0L1.608 6v12L12 24l10.392-6V6L12 0zm-1.02 14.004H6.984v3.996h3.996v-3.996zm0-8.004H6.984v3.996h3.996V6zm5.016 0h-3.996v3.996h3.996V6zm0 8.004h-3.996v3.996h3.996v-3.996z" />
                </svg>
                <span className="text-white text-sm font-bold uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>APPWRITE</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

