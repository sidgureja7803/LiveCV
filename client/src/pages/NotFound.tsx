import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { FileText, Home, ArrowLeft, Search } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      <div className="max-w-2xl mx-auto px-4 text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className={`text-9xl font-bold ${
              isDark ? 'text-gray-800' : 'text-gray-200'
            }`}>404</div>
            <FileText className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 ${
              isDark ? 'text-indigo-500' : 'text-indigo-600'
            }`} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
          Page Not Found
        </h1>

        {/* Description */}
        <p className={`text-xl mb-8 ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Search Suggestion */}
        <div className={`mb-8 p-6 rounded-xl border ${
          isDark 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Search className={`w-5 h-5 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Looking for something specific?
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <button
              onClick={() => navigate('/dashboard')}
              className={`p-3 rounded-lg transition-colors ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => navigate('/templates')}
              className={`p-3 rounded-lg transition-colors ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              📄 Templates
            </button>
            <button
              onClick={() => navigate('/help')}
              className={`p-3 rounded-lg transition-colors ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              ❓ Help Center
            </button>
            <button
              onClick={() => navigate('/contact')}
              className={`p-3 rounded-lg transition-colors ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              📧 Contact Us
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
              isDark 
                ? 'bg-gray-800 hover:bg-gray-700 text-white'
                : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </button>
        </div>

        {/* Footer Note */}
        <p className={`mt-12 text-sm ${
          isDark ? 'text-gray-500' : 'text-gray-400'
        }`}>
          Error Code: 404 | Page Not Found
        </p>
      </div>
    </div>
  );
};

export default NotFound;
