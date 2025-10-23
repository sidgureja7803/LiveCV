import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowRight } from 'lucide-react';

export const CTA = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-blue-700/10 to-blue-900/10"></div>
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto relative z-10">
        <div className={`max-w-5xl mx-auto text-center p-16 rounded-3xl relative overflow-hidden ${
          isDark ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80' : 'bg-gradient-to-br from-white/80 to-gray-50/80'
        } backdrop-blur-sm border-2 ${isDark ? 'border-blue-800/50' : 'border-blue-200/50'} shadow-2xl`}>
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800"></div>
          
          <div className="relative z-10">
            <h2 className="text-5xl md:text-6xl font-black mb-8">
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 text-transparent bg-clip-text">
                Ready to Get Hired?
              </span>
            </h2>
            <p className={`text-2xl mb-12 ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto leading-relaxed`}>
              Join thousands of professionals who landed their dream jobs with our ATS-optimized resume builder
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">10K+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Users Hired</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">95%</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">ATS Pass Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">4.9★</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">User Rating</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => navigate('/register')}
                className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-2xl font-black text-xl transition-all transform hover:scale-105 shadow-2xl hover:shadow-blue-500/50"
              >
                <span className="flex items-center space-x-3">
                  <span>Start Building Free</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
              </button>
              
              <button 
                onClick={() => navigate('/ats-checker')}
                className={`px-10 py-5 rounded-2xl font-black text-xl transition-all transform hover:scale-105 shadow-xl ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-600'
                    : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300'
                }`}
              >
                Try ATS Checker
              </button>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
              No credit card required • Free forever plan available
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
