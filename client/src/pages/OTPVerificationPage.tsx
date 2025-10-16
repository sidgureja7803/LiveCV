import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const OTPVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, resendOTP } = useAuth();
  
  // Main state variables
  const [verificationEmail, setVerificationEmail] = useState<string>('');
  const [otpValue, setOtpValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [recoveryRequested, setRecoveryRequested] = useState(false);
  
  // OTP input reference
  const otpInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize with email from location state
  useEffect(() => {
    const email = location.state?.email;
    if (!email) {
      navigate('/signup');
      return;
    }
    
    setVerificationEmail(email);
    setOtpValue('');
    setError(null);
    
    // Focus the OTP input
    setTimeout(() => {
      if (otpInputRef.current) {
        otpInputRef.current.focus();
      }
    }, 100);
  }, [location.state, navigate]);
  
  // Handle OTP verification
  const handleVerifyOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Prevent duplicate submissions
    if (otpLoading) return;
    
    // Validate OTP format
    if (otpValue.length !== 6 || !/^\d{6}$/.test(otpValue)) {
      setError('Please enter a valid 6-digit verification code');
      if (otpInputRef.current) {
        otpInputRef.current.focus();
      }
      return;
    }

    setOtpLoading(true);
    setError(null);
    setResendSuccess(false);
    
    try {
      // Call verification API
      const success = await verifyOTP(verificationEmail, otpValue);
      
      if (success) {
        navigate('/templates');
      } else {
        setError('Invalid verification code. Please try again.');
        setOtpValue('');
        setTimeout(() => {
          if (otpInputRef.current) {
            otpInputRef.current.focus();
          }
        }, 100);
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to verify code';
      
      if (errorMsg.includes('session has expired')) {
        setRecoveryRequested(true);
      }
      
      setError(errorMsg);
      setOtpValue('');
      
      if (otpInputRef.current) {
        otpInputRef.current.focus();
      }
    } finally {
      setOtpLoading(false);
    }
  };
  
  // Handle resend OTP
  const handleResendOTP = async () => {
    if (resendLoading) return;
    
    setResendLoading(true);
    setResendSuccess(false);
    setError(null);
    
    try {
      const success = await resendOTP(verificationEmail);
      
      if (success) {
        setResendSuccess(true);
        setOtpValue('');
        
        setTimeout(() => {
          if (otpInputRef.current) {
            otpInputRef.current.focus();
          }
        }, 100);
        
        setTimeout(() => {
          setResendSuccess(false);
        }, 5000);
      } else {
        setError('Failed to resend code. Please try again.');
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to resend code';
      
      if (errorMsg.includes('No pending registration')) {
        setError('Your session has expired. Please sign up again.');
        setTimeout(() => navigate('/signup'), 3000);
      } else {
        setError(errorMsg);
      }
    } finally {
      setResendLoading(false);
    }
  };
  
  // Handle OTP input change
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits and limit to 6 characters
    const filtered = e.target.value.replace(/\D/g, '').substring(0, 6);
    setOtpValue(filtered);
    
    // Auto-submit when OTP is complete (all 6 digits entered)
    if (filtered.length === 6) {
      setTimeout(() => {
        // Make sure the OTP value hasn't changed during the timeout
        if (filtered === otpValue && !otpLoading) {
          handleVerifyOTP();
        }
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto px-4 py-24 flex justify-center">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-xl opacity-75"></div>
              <div className="relative bg-white dark:bg-gray-800 px-6 py-5 rounded-xl flex items-center justify-center">
                <svg className="w-10 h-10 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">Verify Your Email</h2>
              <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
                We've sent a verification code to <span className="font-medium text-purple-700 dark:text-purple-400">{verificationEmail}</span>
              </p>

              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Verification Code</label>
                  <input
                    ref={otpInputRef}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    className="w-full h-14 text-center text-2xl font-bold rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={otpValue}
                    onChange={handleOtpChange}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                    Enter the 6-digit code sent to your email
                  </div>
                </div>

                {error && (
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-sm">
                    {error}
                  </div>
                )}
                
                {resendSuccess && (
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 text-sm">
                    Verification code resent successfully! Please check your email.
                  </div>
                )}
                
                {recoveryRequested && (
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm">
                    Your verification session has been restored. A new code has been sent to your email.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={otpLoading || otpValue.length !== 6}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {otpLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying
                    </div>
                  ) : (
                    'Verify Email'
                  )}
                </button>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendLoading}
                    className="text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800/40 py-2 px-4 rounded-lg transition-all flex items-center justify-center mx-auto"
                  >
                    {resendLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-700 dark:text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Resending...
                      </>
                    ) : (
                      "Didn't receive the code? Resend"
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate('/signup')}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 mt-3 block mx-auto"
                  >
                    Back to signup
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
