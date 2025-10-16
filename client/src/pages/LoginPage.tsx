import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const result = await login(email, password);
      
      if (result === true) {
        navigate('/dashboard');
      } else if (typeof result === 'object' && result.requireVerification) {
        // Redirect to the dedicated OTP verification page
        navigate('/verify-otp', { state: { email: result.email } });
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@livecv.com');
    setPassword('demo123');
  };

  // OTP verification is now handled by the OTPVerificationPage component

  // Main Login Screen
  return (
    <div className="min-h-screen flex">
      {/* Theme toggle in absolute position for small screens */}
      <div className="absolute top-4 right-4 lg:hidden">
        <ThemeToggle />
      </div>
      
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 sm:p-12 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <Link to="/" className="inline-block">
              <div className="flex items-center justify-center">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-3 text-left">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">LiveCV</h1>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Professional Resume Builder</span>
                </div>
              </div>
            </Link>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Sign in to your account to continue building your resume</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {error && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-sm">
                {error}
              </div>
            )}
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">Or continue with</span>
              </div>
            </div>
            
            <div>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-900 transition-all flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Demo Account
              </button>
            </div>
          </form>
          
          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300">
              Create account
            </Link>
          </p>
        </div>
      </div>
      
      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-900 opacity-90"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'overlay'
        }}></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-12 text-white text-center">
          <div className="absolute top-4 right-4">
            <ThemeToggle className="text-white hover:bg-white/20" />
          </div>
          <div className="bg-black bg-opacity-30 p-8 rounded-2xl backdrop-filter backdrop-blur-sm max-w-lg">
            <h2 className="text-3xl font-bold mb-4">Create a professional resume in minutes</h2>
            <p className="text-lg">
              Build an impressive resume with our ATS-optimized templates and real-time collaboration.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <span className="px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm">ATS Optimized</span>
              <span className="px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm">Live Collaboration</span>
              <span className="px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm">Professional Templates</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;