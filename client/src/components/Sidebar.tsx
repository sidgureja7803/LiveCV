import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Settings, User } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    {
      title: 'Templates',
      links: [
        { name: 'Resume Templates', path: '/templates' },
        { name: 'Made by You', path: '/dashboard' },
      ],
    },
    {
      title: 'Resume Builder',
      links: [
        { name: 'Personal Info', path: '/builder/personal' },
        { name: 'Experience', path: '/builder/experience' },
        { name: 'Education', path: '/builder/education' },
        { name: 'Skills & Projects', path: '/builder/skills' },
      ],
    },
    {
      title: 'Tools',
      links: [
        { name: 'ATS Checker', path: '/ats-checker' },
      ],
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 h-screen flex-shrink-0 bg-gray-900 dark:bg-gray-950 border-r border-gray-700 dark:border-gray-800 p-6 flex flex-col justify-between shadow-xl">
      <div>
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">LiveCV</h1>
        </div>

        <nav className="space-y-8">
          <div>
            <Link
              to="/job-tracker"
              className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                isActive('/job-tracker')
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span>Job application tracker</span>
              <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">Beta</span>
            </Link>
          </div>
          {navItems.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">{section.title}</h2>
              <div className="space-y-1">
                {section.links.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive(link.path)
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* User Profile and Logout Section */}
      <div className="border-t border-gray-700 pt-4">
        <div className="flex items-center space-x-3 px-4 py-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        
        <div className="space-y-1">
          <Link
            to="/settings"
            className="flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-400 hover:bg-red-600/20 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
