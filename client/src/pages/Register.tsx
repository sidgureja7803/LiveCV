import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FileText, UserPlus, AlertCircle, CheckCircle, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [detailedError, setDetailedError] = useState<any>(null);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  // Log debug info on mount
  React.useEffect(() => {
    console.log('🔍 Debug Info - Register Component:', { 
      appwriteEndpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
      appwriteProjectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
      devKeyConfigured: !!import.meta.env.VITE_APPWRITE_DEV_KEY
    });
  }, []);

  const validatePassword = () => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setDetailedError(null);

    // Validate password
    const passwordError = validatePassword();
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      console.log('⏳ Starting registration process...');
      
      // Add a loading message toast
      toast.loading('Creating your account...', { id: 'registration' });
      
      const result = await register(email, password, name);
      
      console.log('✅ Registration result:', result);
      
      // Account created successfully - now user needs to verify email
      toast.success('Account created! Please verify your email.', { id: 'registration' });
      
      // Navigate to email verification page
      setTimeout(() => {
        navigate('/verify-email', { state: { email } });
      }, 1000);
      
    } catch (err: any) {
      console.error('❌ Registration failed:', err);
      setDetailedError(err);
      
      // Display toast error with more details
      toast.error(err.message || 'Registration failed', { id: 'registration' });
      
      // Set more user-friendly error message
      if (err.code === 429) {
        setError('Too many attempts. Please try again later.');
      } else if (err.code === 400) {
        setError(err.message || 'Invalid registration data. Please check all fields.');
      } else {
        setError(
          'Registration failed. Please try again or contact support. ' + 
          (err.message || '')
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 8) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
    if (password.length < 12) return { label: 'Medium', color: 'bg-yellow-500', width: '66%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const strength = passwordStrength();

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-300 ${
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
          }`}>Create your account</p>
          
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

        {/* Registration Form */}
        <div className={`rounded-lg shadow-2xl p-8 border ${
          isDark 
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-500 font-medium">{error}</p>
                  
                  {/* Show detailed error if available (for development) */}
                  {detailedError && import.meta.env.DEV && (
                    <div className="mt-2 text-xs">
                      <details className="text-red-400">
                        <summary className="cursor-pointer font-mono">Technical details</summary>
                        <pre className="mt-2 p-2 bg-red-500/5 rounded overflow-auto max-h-32 text-red-300">
                          {JSON.stringify({
                            code: detailedError.code,
                            type: detailedError.type,
                            message: detailedError.message,
                            ...(detailedError.response ? { response: detailedError.response } : {})
                          }, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Full Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="John Doe"
              />
            </div>

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
              
              {/* Password Strength Indicator */}
              {strength && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">Password strength:</span>
                    <span className={`text-xs font-semibold ${
                      strength.label === 'Weak' ? 'text-red-400' :
                      strength.label === 'Medium' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: strength.width }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="••••••••"
              />
              {confirmPassword && password === confirmPassword && (
                <div className="mt-2 flex items-center space-x-2 text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Passwords match</span>
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                required
                className={`h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 mt-1 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 focus:ring-offset-gray-800'
                    : 'bg-white border-gray-300'
                }`}
              />
              <label htmlFor="terms" className={`ml-2 block text-sm ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                I agree to the{' '}
                <Link to="/terms" className={isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}>
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className={isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}>
                  Privacy Policy
                </Link>
              </label>
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
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Already have an account?{' '}
              <Link to="/login" className={`font-semibold transition-colors ${
                isDark 
                  ? 'text-indigo-400 hover:text-indigo-300'
                  : 'text-indigo-600 hover:text-indigo-700'
              }`}>
                Sign in
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

export default Register;
