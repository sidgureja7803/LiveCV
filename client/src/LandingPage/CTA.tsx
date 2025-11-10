import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowRight } from 'lucide-react';

export const CTA = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  return (
    <section className="py-24 px-6 relative overflow-hidden bg-black border-t border-zinc-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-blue-700/5 to-blue-900/5"></div>
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-5xl mx-auto text-center p-16 relative overflow-hidden bg-zinc-900/50 backdrop-blur-sm border border-zinc-800">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"></div>
          
          <div className="relative z-10">
            <h2 className="text-5xl md:text-6xl font-black mb-8 uppercase text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '-0.02em' }}>
              READY TO <span className="bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">GET HIRED?</span>
            </h2>
            <p className="text-lg mb-12 text-zinc-400 max-w-3xl mx-auto leading-relaxed uppercase tracking-wide font-medium" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              JOIN THOUSANDS OF PROFESSIONALS WHO LANDED THEIR DREAM JOBS WITH OUR ATS-OPTIMIZED RESUME BUILDER
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-black text-blue-500 mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '-0.02em' }}>10K+</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>USERS HIRED</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-blue-500 mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '-0.02em' }}>95%</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>ATS PASS RATE</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-blue-500 mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '-0.02em' }}>4.9★</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>USER RATING</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => navigate('/register')}
                className="group px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-wider transition-all transform hover:scale-105"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                <span className="flex items-center space-x-3">
                  <span>START BUILDING FREE</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </span>
              </button>
              
              <button 
                onClick={() => navigate('/ats-checker')}
                className="px-10 py-5 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 font-black text-sm uppercase tracking-wider transition-all transform hover:scale-105"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                TRY ATS CHECKER
              </button>
            </div>
            
            <p className="text-xs text-zinc-500 mt-6 uppercase tracking-wide font-semibold" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              NO CREDIT CARD REQUIRED • FREE FOREVER PLAN AVAILABLE
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
