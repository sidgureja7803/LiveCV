import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, ArrowLeft, ExternalLink } from 'lucide-react';

const VerifyMagicURLSent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate('/verify-email', { state: { email } })}
          className="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Choose different method</span>
        </button>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          {/* Animated Icon */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full animate-pulse opacity-20"></div>
            <div className="absolute inset-2 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center">
              <Mail className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Header */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Check Your Email
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            We've sent a magic link to
          </p>
          <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-lg mb-6">
            {email}
          </p>

          {/* Instructions */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              What to do next:
            </h3>
            <ol className="text-left space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <span>Open your email inbox</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <span>Find the email from LiveCV</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <span>Click the magic link to verify and log in</span>
              </li>
            </ol>
          </div>

          {/* Email Providers Quick Links */}
          <div className="mb-6">
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
              Quick access to popular email providers:
            </p>
            <div className="flex justify-center space-x-3">
              <a
                href="https://mail.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors inline-flex items-center space-x-1"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Gmail</span>
              </a>
              <a
                href="https://outlook.live.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors inline-flex items-center space-x-1"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Outlook</span>
              </a>
            </div>
          </div>

          {/* Didn't Receive */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Didn't receive the email?
            </p>
            <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
              <li>• Check your spam or junk folder</li>
              <li>• Make sure the email address is correct</li>
              <li>• Wait a few minutes and check again</li>
            </ul>
            <button
              onClick={() => navigate('/verify-email', { state: { email } })}
              className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm transition-colors"
            >
              Try a different verification method
            </button>
          </div>
        </div>

        {/* Footer Help */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-6">
          The magic link will expire in 1 hour for security reasons.
        </p>
      </div>
    </div>
  );
};

export default VerifyMagicURLSent;
