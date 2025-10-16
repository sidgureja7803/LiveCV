import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FileText, Zap, Award, Shield, ArrowRight, CheckCircle, Sun, Moon, Download, Eye, LogIn, UserPlus } from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Available templates from server/templates folder
  const templates = [
    { name: 'Classic Theme', file: 'John_Doe_ClassicTheme_CV.pdf', description: 'Clean and professional', icon: '📄' },
    { name: 'Engineering Classic', file: 'John_Doe_EngineeringclassicTheme_CV.pdf', description: 'Perfect for engineers', icon: '⚙️' },
    { name: 'Engineering Resumes', file: 'John_Doe_EngineeringresumesTheme_CV.pdf', description: 'Tech-focused design', icon: '💻' },
    { name: 'Modern CV', file: 'John_Doe_ModerncvTheme_CV.pdf', description: 'Modern and stylish', icon: '✨' },
    { name: 'Sb2nov Theme', file: 'John_Doe_Sb2novTheme_CV.pdf', description: 'Compact layout', icon: '📋' }
  ];

  // Top companies (professional text-based)
  const companies = [
    { name: 'Google', color: 'from-blue-600 to-green-600' },
    { name: 'Microsoft', color: 'from-blue-600 to-blue-400' },
    { name: 'Amazon', color: 'from-orange-600 to-yellow-500' },
    { name: 'Apple', color: 'from-gray-700 to-gray-900' },
    { name: 'Meta', color: 'from-blue-600 to-indigo-600' },
    { name: 'Netflix', color: 'from-red-600 to-red-800' },
    { name: 'Tesla', color: 'from-red-600 to-gray-900' },
    { name: 'IBM', color: 'from-blue-700 to-blue-900' }
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast',
      description: 'Generate professional PDFs in seconds with RenderCV'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'ATS Optimized',
      description: 'Beat applicant tracking systems with AI optimization'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure & Private',
      description: 'Your data is encrypted and stored securely with Appwrite'
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: `${templates.length} Professional Themes`,
      description: 'Choose from beautifully designed templates'
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      {/* Navigation - PROMINENT LOGIN/SIGNUP BUTTONS */}
      <nav className={`border-b transition-all duration-300 sticky top-0 z-50 ${
        isDark ? 'border-gray-800 bg-gray-900/95' : 'border-gray-200 bg-white/95'
      } backdrop-blur-lg ${
        isScrolled ? 'shadow-xl' : ''
      }`}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <FileText className={`w-8 h-8 ${
              isDark ? 'text-indigo-500' : 'text-indigo-600'
            }`} />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              LiveCV
            </span>
          </div>

          {/* Right Side - Auth Buttons */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`px-4 py-2 font-medium transition-colors ${
                    isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/templates')}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                  Create Resume
                </button>
              </>
            ) : (
              <>
                {/* LOGIN BUTTON - VERY VISIBLE */}
                <button
                  onClick={() => navigate('/login')}
                  className={`flex items-center space-x-2 px-5 py-2.5 font-semibold rounded-lg transition-all ${
                    isDark 
                      ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                      : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </button>

                {/* SIGNUP BUTTON - VERY VISIBLE */}
                <button
                  onClick={() => navigate('/register')}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Sign Up Free</span>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text leading-tight">
            Build Your Perfect Resume in Minutes
          </h1>
          <p className={`text-xl md:text-2xl mb-8 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Create ATS-optimized resumes with live PDF preview, powered by RenderCV
          </p>
          
          {/* Powered by Appwrite - PROMINENT LOGO */}
          <div className="flex items-center justify-center space-x-3 mb-10 p-5 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-2 border-pink-500/30 backdrop-blur-sm max-w-md mx-auto">
            <span className={`text-base font-semibold ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}>Powered by</span>
            <a 
              href="https://appwrite.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl"
            >
              {/* Appwrite Logo SVG */}
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.5 2C13.5 2 15.8 2.4 17.5 4.1C19.2 5.8 19.5 8.5 19.5 8.5L16 12L19.5 15.5C19.5 15.5 19.2 18.2 17.5 19.9C15.8 21.6 13.5 22 13.5 22L10 18.5L6.5 22C6.5 22 4.2 21.6 2.5 19.9C0.8 18.2 0.5 15.5 0.5 15.5L4 12L0.5 8.5C0.5 8.5 0.8 5.8 2.5 4.1C4.2 2.4 6.5 2 6.5 2L10 5.5L13.5 2Z"/>
              </svg>
              <span className="text-white font-bold text-xl">Appwrite</span>
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
            <button
              onClick={handleGetStarted}
              className="group px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-xl flex items-center space-x-3 transition-all transform hover:scale-105 shadow-2xl hover:shadow-indigo-500/50"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate(isAuthenticated ? '/templates' : '/login')}
              className={`px-10 py-5 rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-xl ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-white border-2 border-gray-700'
                  : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300'
              }`}
            >
              View Templates
            </button>
          </div>
        </div>
        
        {/* Company Logos Section */}
        <div className="mt-16">
          <p className={`text-sm font-semibold uppercase tracking-widest mb-10 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Trusted by professionals landing jobs at
          </p>
          
          {/* Professional Company Badges */}
          <div className="relative overflow-hidden py-6">
            <div className="flex animate-scroll whitespace-nowrap">
              {companies.concat(companies).map((company, index) => (
                <div
                  key={index}
                  className={`inline-flex items-center justify-center mx-4 px-8 py-4 rounded-xl ${
                    isDark ? 'bg-gray-800/70' : 'bg-white'
                  } backdrop-blur-sm border-2 ${
                    isDark ? 'border-gray-700' : 'border-gray-200'
                  } hover:scale-110 transition-all shadow-lg hover:shadow-2xl`}
                >
                  <span className={`font-bold text-2xl bg-gradient-to-r ${company.color} text-transparent bg-clip-text`}>
                    {company.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Professional Templates Showcase - THE KEY SECTION */}
      <section className={`py-20 ${isDark ? 'bg-gray-800/30' : 'bg-gray-100/50'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              Choose Your Professional Template
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {templates.length} beautifully designed resume templates ready to use
            </p>
          </div>

          {/* Template Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {templates.map((template, index) => (
              <div
                key={index}
                className={`group rounded-2xl p-6 border-2 transition-all hover:scale-105 hover:shadow-2xl cursor-pointer ${
                  isDark 
                    ? 'bg-gray-800/50 border-gray-700 hover:border-indigo-500 hover:bg-gray-800' 
                    : 'bg-white border-gray-200 hover:border-indigo-400 hover:shadow-indigo-500/20'
                }`}
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
              >
                {/* Template Preview */}
                <div className={`rounded-xl mb-6 p-10 flex flex-col items-center justify-center transition-all ${
                  isDark ? 'bg-gray-900 group-hover:bg-gray-950' : 'bg-gray-50 group-hover:bg-gray-100'
                }`}>
                  <span className="text-6xl mb-4">{template.icon}</span>
                  <FileText className={`w-20 h-20 ${
                    isDark ? 'text-indigo-400' : 'text-indigo-600'
                  } group-hover:scale-110 transition-transform`} />
                </div>

                {/* Template Info */}
                <h3 className={`text-2xl font-bold mb-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {template.name}
                </h3>
                <p className={`text-base mb-6 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {template.description}
                </p>

                {/* Actions */}
                <div className="flex items-center space-x-3">
                  <button className="flex-1 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center space-x-2">
                    <span>Use Template</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <button
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
              className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-indigo-500/50"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Sign Up to Access All Templates'} →
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Why Choose LiveCV?
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-8 rounded-2xl border-2 transition-all hover:scale-105 hover:shadow-xl ${
                isDark 
                  ? 'bg-gray-800/50 border-gray-700 hover:border-indigo-500'
                  : 'bg-white border-gray-200 hover:border-indigo-400'
              }`}
            >
              <div className={`mb-4 ${
                isDark ? 'text-indigo-400' : 'text-indigo-600'
              }`}>
                {feature.icon}
              </div>
              <h3 className={`text-xl font-bold mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {feature.title}
              </h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${isDark ? 'bg-gradient-to-br from-indigo-900/30 to-purple-900/30' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Ready to Build Your Resume?
          </h2>
          <p className={`text-xl mb-10 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Join thousands of professionals who've landed their dream jobs
          </p>
          <button
            onClick={handleGetStarted}
            className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-2xl hover:shadow-indigo-500/50"
          >
            Create Your Resume Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-12 ${
        isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-white/50'
      }`}>
        <div className="container mx-auto px-4 text-center">
          <p className={`text-base mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            © 2025 LiveCV. All rights reserved.
          </p>
          <div className="flex items-center justify-center space-x-2">
            <p className={isDark ? 'text-gray-500' : 'text-gray-600'}>
              Powered by RenderCV &
            </p>
            <a 
              href="https://appwrite.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold text-pink-500 hover:text-pink-600 transition-colors"
            >
              Appwrite
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
