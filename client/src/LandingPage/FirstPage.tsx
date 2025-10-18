import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowRight, Star, Users, FileText, TrendingUp, Github } from 'lucide-react';

export const FirstPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  
  const stats = [
    { icon: <Users className="w-8 h-8" />, number: '10K+', label: 'Active Users' },
    { icon: <FileText className="w-8 h-8" />, number: '50K+', label: 'Resumes Created' },
    { icon: <Star className="w-8 h-8" />, number: '4.9/5', label: 'User Rating' },
    { icon: <TrendingUp className="w-8 h-8" />, number: '95%', label: 'Success Rate' }
  ];

  const handleOAuthLogin = (provider) => {
    console.log(`OAuth login with ${provider}`);
    alert(`${provider.toUpperCase()} OAuth will be implemented with Appwrite`);
  };

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-full px-6 py-3 mb-8">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              #1 AI-Powered Resume Builder
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
              Build Your Dream Resume
            </span>
            <br />
            <span className={isDark ? 'text-white' : 'text-gray-900'}>
              In Minutes
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`text-2xl md:text-3xl mb-12 font-medium ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            ATS-optimized resumes with live PDF preview,<br />
            powered by <span className="text-pink-500 font-bold">Appwrite</span> & <span className="text-indigo-500 font-bold">RenderCV</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <button
              onClick={() => navigate('/register')}
              className="group px-14 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-black text-2xl transition-all transform hover:scale-110 shadow-2xl hover:shadow-indigo-500/50"
            >
              <span className="flex items-center space-x-3">
                <span>Get Started Free</span>
                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
              </span>
            </button>
            
            <button
              onClick={() => {
                const featuresSection = document.getElementById('features');
                featuresSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-14 py-6 rounded-2xl font-black text-2xl transition-all transform hover:scale-110 shadow-xl ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-white border-2 border-gray-700'
                  : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300'
              }`}
            >
              Learn More
            </button>
          </div>

          {/* OAuth Buttons */}
          {!isAuthenticated && (
            <div className="mb-16">
              <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Or continue with:
              </p>
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => handleOAuthLogin('google')}
                  className={`flex items-center space-x-3 px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-110 shadow-xl ${
                    isDark 
                      ? 'bg-white text-gray-900 hover:bg-gray-100'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  onClick={() => handleOAuthLogin('github')}
                  className={`flex items-center space-x-3 px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-110 shadow-xl ${
                    isDark 
                      ? 'bg-white text-gray-900 hover:bg-gray-100'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  <Github className="w-6 h-6" />
                  <span>GitHub</span>
                </button>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
                <div className="text-3xl font-black mb-2">{stat.number}</div>
                <div className={`text-sm font-semibold ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
