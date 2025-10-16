import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'password') {
      // Calculate password strength
      calculatePasswordStrength(value);
    }
    
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  };
  
  // Handle signup form submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    if (!acceptTerms) {
      setError('Please accept the terms and privacy policy');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await signup({
        email: formData.email,
        password: formData.password,
        fullName: `${formData.firstName} ${formData.lastName}`.trim()
      });
      
      if (result === true) {
        navigate('/dashboard');
      } else if (typeof result === 'object' && result.requireVerification) {
        // Instead of showing verification inline, redirect to the dedicated OTP verification page
        navigate('/verify-otp', { state: { email: result.email } });
      } else {
        setError('Failed to create account. Please try again.');
      }
    } catch (error: any) {
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        setError('This email is already registered. Please login instead.');
      } else {
        setError(error.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // OTP verification is now handled by the OTPVerificationPage component

  // Main Signup Screen
  return (
    <div className="min-h-screen flex">
      {/* Theme toggle in absolute position for small screens */}
      <div className="absolute top-4 right-4 lg:hidden">
        <ThemeToggle />
      </div>
      
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-900 opacity-90"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'overlay'
        }}></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-12 text-white text-center">
          <div className="absolute top-4 right-4">
            <ThemeToggle className="text-white hover:bg-white/20" />
          </div>
          <div className="bg-black bg-opacity-30 p-8 rounded-2xl backdrop-filter backdrop-blur-sm max-w-lg">
            <h2 className="text-3xl font-bold mb-4">Start building your perfect resume today</h2>
            <p className="text-lg">
              Join thousands of professionals using LiveCV to create stunning, 
              ATS-optimized resumes with real-time collaboration.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center bg-white bg-opacity-10 p-4 rounded-xl">
                <span className="text-3xl font-bold mb-2">100+</span>
                <span className="text-sm">Professional Templates</span>
              </div>
              <div className="flex flex-col items-center bg-white bg-opacity-10 p-4 rounded-xl">
                <span className="text-3xl font-bold mb-2">90%</span>
                <span className="text-sm">Higher Response Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 sm:p-12 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
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
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create your account</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Join thousands of professionals building better resumes</p>
          
          <form onSubmit={handleSignup} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                required
              />
              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                      <div 
                        className={`h-2 rounded-full ${
                          passwordStrength === 0 ? 'bg-red-500' : 
                          passwordStrength === 1 ? 'bg-red-500' : 
                          passwordStrength === 2 ? 'bg-yellow-500' : 
                          passwordStrength === 3 ? 'bg-yellow-500' : 'bg-green-500'
                        }`} 
                        style={{ width: `${25 * passwordStrength}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {passwordStrength === 0 ? 'Very weak' : 
                       passwordStrength === 1 ? 'Weak' : 
                       passwordStrength === 2 ? 'Medium' : 
                       passwordStrength === 3 ? 'Good' : 'Strong'}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            
            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={() => setAcceptTerms(!acceptTerms)}
                  className="h-4 w-4 text-purple-600 rounded border-gray-300 dark:border-gray-600 focus:ring-purple-500 dark:bg-gray-700"
                  required
                />
              </div>
              <div className="ml-3">
                <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-300">
                  I agree to the{' '}
                  <a href="#" className="text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300">Privacy Policy</a>
                </label>
              </div>
            </div>
            
            {/* Error message */}
            {error && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-sm">
                {error}
              </div>
            )}
            
            {/* Submit button */}
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
                    Creating account
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>
          
          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;