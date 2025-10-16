import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { FileText, Mail, ArrowLeft, CheckCircle, AlertCircle, Sun, Moon } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Implement Appwrite password recovery
      // await account.createRecovery(email, 'http://localhost:5173/reset-password');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 px-4 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        <div className="max-w-md w-full">
          <div className={`rounded-lg shadow-2xl p-8 border text-center ${
            isDark 
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Check Your Email
            </h2>
            <p className={`mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
            <p className={`text-sm mb-6 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 px-4 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <FileText className={`w-10 h-10 ${
              isDark ? 'text-indigo-500' : 'text-indigo-600'
            }`} />
            <span className={`text-3xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>LiveCV</span>
          </Link>
          <h1 className={`text-2xl font-bold mt-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Forgot Password?
          </h1>
          <p className={`mt-2 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            No worries, we'll send you reset instructions
          </p>
        </div>

        {/* Form */}
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
              <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`w-5 h-5 ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-indigo-600'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all transform hover:scale-105"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className={`inline-flex items-center space-x-1 text-sm transition-colors ${
                isDark 
                  ? 'text-indigo-400 hover:text-indigo-300'
                  : 'text-indigo-600 hover:text-indigo-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="mt-6 text-center">
          <button
            onClick={toggleTheme}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isDark 
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
            }`}
          >
            {isDark ? (
              <>
                <Sun className="w-5 h-5" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-5 h-5" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
