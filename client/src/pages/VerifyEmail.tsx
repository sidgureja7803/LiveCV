import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Link2, Shield, ArrowLeft } from 'lucide-react';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sendMagicURL, sendEmailOTP } = useAuth();
  
  // Get email from navigation state
  const email = location.state?.email || '';
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'magic-url' | 'otp' | null>(null);

  if (!email) {
    // If no email provided, redirect to register
    setTimeout(() => navigate('/register'), 100);
    return null;
  }

  const handleSendVerification = async (method: 'magic-url' | 'otp') => {
    setLoading(true);
    setSelectedMethod(method);

    try {
      if (method === 'magic-url') {
        const result = await sendMagicURL(email);
        if (result.success) {
          // Navigate to waiting page
          navigate('/verify-magic-url-sent', { state: { email } });
        }
      } else {
        const result = await sendEmailOTP(email);
        if (result.success) {
          // Navigate to OTP input page
          navigate('/verify-otp', { state: { email } });
        }
      }
    } catch (error) {
      console.error('Verification send error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate('/register')}
          className="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Register</span>
        </button>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              We need to verify your email address: <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Choose your preferred verification method
            </p>
          </div>

          {/* Verification Methods */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Magic URL Option */}
            <button
              onClick={() => handleSendVerification('magic-url')}
              disabled={loading}
              className="relative group p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-500 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Link2 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Magic URL
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Click a link in your email to instantly verify and log in
                  </p>
                  
                  {/* Benefits */}
                  <ul className="text-xs text-left text-gray-500 dark:text-gray-500 space-y-1">
                    <li>✓ One-click verification</li>
                    <li>✓ No code to type</li>
                    <li>✓ Fast and convenient</li>
                  </ul>
                </div>

                {loading && selectedMethod === 'magic-url' && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 rounded-xl flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-indigo-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Sending...</span>
                    </div>
                  </div>
                )}
              </div>
            </button>

            {/* OTP Option */}
            <button
              onClick={() => handleSendVerification('otp')}
              disabled={loading}
              className="relative group p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-500 dark:hover:border-purple-500 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Email OTP
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Enter a verification code sent to your email
                  </p>
                  
                  {/* Benefits */}
                  <ul className="text-xs text-left text-gray-500 dark:text-gray-500 space-y-1">
                    <li>✓ 6-digit secure code</li>
                    <li>✓ Works on any device</li>
                    <li>✓ Extra security</li>
                  </ul>
                </div>

                {loading && selectedMethod === 'otp' && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 rounded-xl flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-purple-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Sending...</span>
                    </div>
                  </div>
                )}
              </div>
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-medium mb-1">Why verify your email?</p>
                <p className="text-blue-700 dark:text-blue-400">
                  Email verification helps us keep your account secure and ensures you can recover access if needed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Didn't receive the email? Check your spam folder or try again.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
