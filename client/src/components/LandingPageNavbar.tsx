import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FileText, LogIn, UserPlus, Sun, Moon, Menu, X } from 'lucide-react';

export const LandingPageNavbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Debug: Log authentication state
  React.useEffect(() => {
    console.log('Auth State:', { isAuthenticated, loading });
  }, [isAuthenticated, loading]);

  // Handle scroll for navbar background
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [navigate]);

  // Handle menu toggle for mobile
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? (isDark ? 'bg-gray-900/95 shadow-2xl border-b border-gray-800' : 'bg-white/95 shadow-2xl border-b border-gray-200')
        : 'bg-transparent'
    } backdrop-blur-lg`}>
      <div className="container mx-auto px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-xl">
              <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              LiveCV
            </span>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/#features" 
              className={`font-medium hover:text-indigo-600 transition-colors ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Features
            </Link>
            <Link to="/#pricing" 
              className={`font-medium hover:text-indigo-600 transition-colors ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Pricing
            </Link>
            <Link to="/#faqs" 
              className={`font-medium hover:text-indigo-600 transition-colors ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              FAQs
            </Link>
          </div>

          {/* RIGHT SIDE: AUTH BUTTONS - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {loading ? (
              // Show loading skeleton while checking auth
              <div className="flex items-center space-x-3">
                <div className="w-16 h-8 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="w-24 h-8 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              </div>
            ) : isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`px-5 py-2 font-bold rounded-lg transition-all ${
                    isDark ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/templates')}
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-indigo-500/30"
                >
                  Create Resume
                </button>
              </>
            ) : (
              <>
                {/* Login Button */}
                <button
                  onClick={() => navigate('/login')}
                  className={`px-5 py-2 rounded-lg font-bold transition-all ${
                    isDark 
                      ? 'text-indigo-400 hover:text-indigo-300'
                      : 'text-indigo-600 hover:text-indigo-700'
                  }`}
                >
                  Log In
                </button>

                {/* Sign Up Button */}
                <button
                  onClick={() => navigate('/register')}
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-indigo-500/30"
                >
                  Sign Up Free
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-3">
            {/* Dark Mode Toggle - Mobile */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button 
              onClick={toggleMobileMenu}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              aria-label="Open menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${
        isMobileMenuOpen 
          ? 'max-h-[400px] opacity-100' 
          : 'max-h-0 opacity-0'
      }`}>
        <div className={`px-6 py-4 border-t ${
          isDark ? 'border-gray-800 bg-gray-900/95' : 'border-gray-200 bg-white/95'
        }`}>
          <div className="flex flex-col space-y-3 mb-4">
            <Link to="/#features" 
              className={`font-medium p-2 ${
                isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
              } rounded-lg`}
            >
              Features
            </Link>
            <Link to="/#pricing" 
              className={`font-medium p-2 ${
                isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
              } rounded-lg`}
            >
              Pricing
            </Link>
            <Link to="/#faqs" 
              className={`font-medium p-2 ${
                isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
              } rounded-lg`}
            >
              FAQs
            </Link>
          </div>

          {loading ? (
            <div className="p-3 text-center text-gray-500 dark:text-gray-400">
              Loading...
            </div>
          ) : isAuthenticated ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className={`p-3 rounded-lg font-bold text-center ${
                  isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/templates')}
                className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold text-center"
              >
                Create Resume
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/login')}
                className={`p-3 rounded-lg font-bold text-center ${
                  isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold text-center"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
