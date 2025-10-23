import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowRight, Star, Users, FileText, TrendingUp, CheckCircle, Clock, FileCheck } from 'lucide-react';
import livePreviewImage from '/images/live_preview.png';
import Lenis from 'lenis';

export const FirstPage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  // Initialize Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
  
  const stats = [
    { icon: <Users className="w-8 h-8" />, number: '10K+', label: 'Active Users' },
    { icon: <FileText className="w-8 h-8" />, number: '50K+', label: 'Resumes Created' },
    { icon: <Star className="w-8 h-8" />, number: '4.9/5', label: 'User Rating' },
    { icon: <TrendingUp className="w-8 h-8" />, number: '95%', label: 'Success Rate' }
  ];

  const features = [
    { icon: <CheckCircle className="w-6 h-6" />, text: 'ATS-optimized templates' },
    { icon: <CheckCircle className="w-6 h-6" />, text: 'Live PDF preview' },
    { icon: <CheckCircle className="w-6 h-6" />, text: 'AI content generation' },
    { icon: <Clock className="w-6 h-6" />, text: 'Ready in minutes' }
  ];

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left Column - Hero Text */}
            <div className="lg:w-3/5 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-full px-6 py-3 mb-8">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  #1 AI-Powered Resume Builder
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 text-transparent bg-clip-text">
                  Build Your Dream Resume
                </span>
                <br />
                <span className={isDark ? 'text-white' : 'text-gray-900'}>
                  In Minutes
                </span>
              </h1>

              {/* Subtitle */}
              <p className={`text-xl md:text-2xl mb-8 font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Create professional, ATS-optimized resumes with our AI-powered platform.
                Beat the bots, impress recruiters, and land your dream job faster.
              </p>
              
              {/* Feature bullets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      {feature.icon}
                    </div>
                    <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-6 mb-16">
                <button
                  onClick={() => navigate('/register')}
                  className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-2xl font-black text-xl transition-all transform hover:scale-105 shadow-2xl hover:shadow-blue-500/50 w-full sm:w-auto"
                >
                  <span className="flex items-center justify-center space-x-3">
                    <span>Get Started Free</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </span>
                </button>
                
                <button
                  onClick={() => {
                    const featuresSection = document.getElementById('features');
                    featuresSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`px-10 py-5 rounded-2xl font-black text-xl transition-all transform hover:scale-105 shadow-xl w-full sm:w-auto ${
                    isDark 
                      ? 'bg-gray-800 hover:bg-gray-700 text-white border-2 border-gray-700'
                      : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300'
                  }`}
                >
                  Learn More
                </button>
              </div>
            </div>
            
            {/* Right Column - Live Preview Image */}
            <div className="lg:w-2/5 relative">
              <div className="relative z-10 bg-gradient-to-br from-white/10 to-white/5 p-3 rounded-2xl border border-white/20 backdrop-blur-sm shadow-2xl">
                {/* Image with fallback */}
                <div className="relative rounded-xl w-full overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-700">
                  <img 
                    src={livePreviewImage} 
                    alt="LiveCV Resume Preview" 
                    className="w-full h-auto object-cover z-10 relative"
                    onError={(e) => {
                      // If image fails to load, show the fallback
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  {/* Fallback content */}
                  <div 
                    className="absolute inset-0 flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 hidden"
                    style={{minHeight: '300px'}}
                  >
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                      <FileCheck className="w-16 h-16 text-indigo-600 dark:text-indigo-400" />
                      <p className="text-lg font-medium text-center text-gray-700 dark:text-gray-300 px-6">
                        Professional Resume Preview
                        <br />
                        <span className="text-sm text-gray-500 dark:text-gray-400">ATS-Optimized Templates</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 rounded-xl text-white font-bold shadow-lg transform rotate-3">
                  ATS-Optimized
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/30 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className={`p-6 rounded-2xl ${
                isDark ? 'bg-gray-800/50' : 'bg-white/50'
              } backdrop-blur-sm border ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className={`mb-3 ${
                  isDark ? 'text-indigo-400' : 'text-indigo-600'
                }`}>
                  {stat.icon}
                </div>
                <div className={`text-3xl font-black mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.number}</div>
                <div className={`text-sm font-semibold ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          
          {/* Powered by Appwrite Badge */}
          <div className="flex items-center justify-center mt-12">
            <div className={`inline-flex items-center space-x-4 px-8 py-4 rounded-2xl border backdrop-blur-sm shadow-lg ${
              isDark 
                ? 'bg-gray-800/80 border-gray-700' 
                : 'bg-white/80 border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <span className={`text-sm font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Powered by</span>
                <a 
                  href="https://appwrite.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-3 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                  >
                    <path d="M12 0L1.608 6v12L12 24l10.392-6V6L12 0zm-1.02 14.004H6.984v3.996h3.996v-3.996zm0-8.004H6.984v3.996h3.996V6zm5.016 0h-3.996v3.996h3.996V6zm0 8.004h-3.996v3.996h3.996v-3.996z" />
                  </svg>
                  <span className="text-white text-sm font-bold">Appwrite</span>
                </a>
              </div>
              <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} max-w-xs`}>
                Secure database & authentication
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

