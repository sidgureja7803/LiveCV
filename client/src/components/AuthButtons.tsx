import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AuthButtonsProps {
  className?: string;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  if (isAuthenticated && user) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className="flex items-center space-x-2">
          <div 
            className="h-8 w-8 rounded-full border-2 border-purple-400 bg-purple-600 flex items-center justify-center text-white font-bold"
          >
            {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="text-sm font-medium text-white hidden md:inline-block">
            {user.fullName}
          </span>
        </div>
        <button
          onClick={() => logout()}
          className="p-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          title="Logout"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className={`flex space-x-3 ${className}`}>
      <button
        onClick={() => navigate('/login')}
        className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
      >
        Sign In
      </button>
      <button
        onClick={() => navigate('/signup')}
        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
      >
        Sign Up
      </button>
    </div>
  );
};

export default AuthButtons;
