import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const VerifyMagicURL: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyMagicURL } = useAuth();
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const userId = searchParams.get('userId');
    const secret = searchParams.get('secret');

    if (!userId || !secret) {
      setStatus('error');
      setMessage('Invalid verification link. Missing required parameters.');
      return;
    }

    // Verify the magic URL
    const verify = async () => {
      try {
        const result = await verifyMagicURL(userId, secret);
        
        if (result.success) {
          setStatus('success');
          setMessage('Email verified successfully! Redirecting to dashboard...');
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          setStatus('error');
          setMessage(result.message || 'Verification failed. The link may have expired.');
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'An error occurred during verification.');
      }
    };

    verify();
  }, [searchParams, verifyMagicURL, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center">
            {/* Status Icon */}
            <div className="mb-6">
              {status === 'verifying' && (
                <div className="w-20 h-20 mx-auto bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin" />
                </div>
              )}
              
              {status === 'success' && (
                <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-scale-in">
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
              )}
              
              {status === 'error' && (
                <div className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {status === 'verifying' && 'Verifying Email'}
              {status === 'success' && 'Email Verified!'}
              {status === 'error' && 'Verification Failed'}
            </h1>

            {/* Message */}
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {message}
            </p>

            {/* Actions */}
            {status === 'success' && (
              <div className="space-y-3">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-sm text-green-800 dark:text-green-300">
                    🎉 Your account is now active. You'll be redirected shortly.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all"
                >
                  Go to Dashboard Now
                </button>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-800 dark:text-red-300 mb-2">
                    Common reasons for failure:
                  </p>
                  <ul className="text-xs text-red-700 dark:text-red-400 text-left space-y-1">
                    <li>• Link has expired (links are valid for 1 hour)</li>
                    <li>• Link has already been used</li>
                    <li>• Link is invalid or corrupted</li>
                  </ul>
                </div>

                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => navigate('/register')}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all"
                  >
                    Request New Link
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full py-3 border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-600 dark:hover:border-indigo-500 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            )}

            {status === 'verifying' && (
              <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
                <p className="text-sm text-indigo-800 dark:text-indigo-300">
                  Please wait while we verify your email address...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Need help? <a href="/support" className="text-indigo-600 dark:text-indigo-400 hover:underline">Contact Support</a>
        </p>
      </div>
    </div>
  );
};

export default VerifyMagicURL;
