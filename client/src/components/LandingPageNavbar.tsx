import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FileText, LogIn, UserPlus, Sun, Moon } from 'lucide-react';

export const LandingPageNavbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for navbar background
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? (isDark ? 'bg-gray-900/95 shadow-2xl border-b border-gray-800' : 'bg-white/95 shadow-2xl border-b border-gray-200')
        : 'bg-transparent'
    } backdrop-blur-lg`}>
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-xl">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              LiveCV
            </span>
          </div>

          {/* RIGHT SIDE: AUTH BUTTONS - UNMISSABLE */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode */}
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-xl transition-all ${
                isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {isDark ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6" />}
            </button>

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`px-8 py-3 font-bold text-lg rounded-xl transition-all ${
                    isDark ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/templates')}
                  className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-black text-lg transition-all transform hover:scale-110 shadow-2xl"
                >
                  Create Resume
                </button>
              </>
            ) : (
              <>
                {/* LOGIN BUTTON - MASSIVE AND UNMISSABLE */}
                <button
                  onClick={() => navigate('/login')}
                  className={`flex items-center space-x-3 px-10 py-4 rounded-xl font-black text-lg transition-all transform hover:scale-110 shadow-xl border-3 ${
                    isDark 
                      ? 'bg-gray-800 hover:bg-gray-700 text-white border-4 border-gray-600 hover:border-indigo-500'
                      : 'bg-white hover:bg-gray-50 text-gray-900 border-4 border-gray-900 hover:border-indigo-600'
                  }`}
                >
                  <LogIn className="w-7 h-7" />
                  <span className="text-xl">LOGIN</span>
                </button>

                {/* SIGNUP BUTTON - EVEN MORE MASSIVE */}
                <button
                  onClick={() => navigate('/register')}
                  className="flex items-center space-x-3 px-12 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl font-black text-xl transition-all transform hover:scale-110 shadow-2xl hover:shadow-indigo-500/50 animate-pulse"
                >
                  <UserPlus className="w-8 h-8" />
                  <span>SIGN UP FREE</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
