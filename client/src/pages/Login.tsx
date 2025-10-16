import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FileText, LogIn, AlertCircle, Sun, Moon } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <div className="max-w-md w-full">
        {/* Dark Mode Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
                : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className={`inline-flex items-center space-x-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            <FileText className={`w-10 h-10 ${
              isDark ? 'text-indigo-500' : 'text-indigo-600'
            }`} />
            <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">LiveCV</span>
          </Link>
          <p className={`mt-2 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>Sign in to your account</p>
          
          {/* Powered by Appwrite */}
          <div className="flex items-center justify-center space-x-2 mt-4">
            <span className={`text-sm ${
              isDark ? 'text-gray-500' : 'text-gray-600'
            }`}>Powered by</span>
            <a 
              href="https://appwrite.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-2 py-1 rounded bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 transition-all transform hover:scale-105"
            >
              <span className="text-white text-sm font-semibold">Appwrite</span>
            </a>
          </div>
        </div>

        {/* Login Form */}
        <div className={`rounded-lg shadow-2xl p-8 border ${
          isDark 
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="you@example.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="••••••••"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className={`h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 focus:ring-offset-gray-800'
                      : 'bg-white border-gray-300'
                  }`}
                />
                <label htmlFor="remember" className={`ml-2 block text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" className={`text-sm transition-colors ${
                isDark 
                  ? 'text-indigo-400 hover:text-indigo-300'
                  : 'text-indigo-600 hover:text-indigo-700'
              }`}>
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all transform hover:scale-105"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Don't have an account?{' '}
              <Link to="/register" className={`font-semibold transition-colors ${
                isDark 
                  ? 'text-indigo-400 hover:text-indigo-300'
                  : 'text-indigo-600 hover:text-indigo-700'
              }`}>
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link to="/" className={`text-sm transition-colors ${
            isDark 
              ? 'text-gray-400 hover:text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
