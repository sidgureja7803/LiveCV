import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowRight } from 'lucide-react';

export const CTA = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className={`max-w-5xl mx-auto text-center p-16 rounded-3xl ${
          isDark ? 'bg-gradient-to-br from-indigo-900/50 to-purple-900/50' : 'bg-gradient-to-br from-indigo-50 to-purple-50'
        } border-2 ${isDark ? 'border-indigo-800' : 'border-indigo-200'}`}>
          <h2 className="text-5xl md:text-6xl font-black mb-8">
            Ready to Get Hired?
          </h2>
          <p className={`text-2xl mb-12 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Join thousands of professionals who landed their dream jobs
          </p>
          <button 
            onClick={() => navigate('/register')}
            className={`px-8 py-4 text-xl font-bold rounded-full inline-flex items-center gap-2 ${
              isDark ? 'bg-indigo-500 hover:bg-indigo-400 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            } transition-all`}
          >
            Get Started <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};
