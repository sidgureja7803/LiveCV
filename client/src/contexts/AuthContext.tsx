import React, { createContext, useContext, useState, useEffect } from 'react';
import { account } from '../config/appwrite';
import { Models, OAuthProvider, AppwriteException } from 'appwrite';
import { toast } from 'react-hot-toast';

// Define types for auth operations
type LoginResult = { success: boolean };

type RegisterResult = { 
  success: boolean; 
  loginError?: string; 
  message?: string;
};

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  register: (email: string, password: string, name: string) => Promise<RegisterResult>;
  loginWithGoogle: () => void;
  loginWithGithub: () => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  // Email verification methods
  sendMagicURL: (email: string) => Promise<{ success: boolean; message?: string }>;
  verifyMagicURL: (userId: string, secret: string) => Promise<{ success: boolean; message?: string }>;
  sendEmailOTP: (email: string) => Promise<{ success: boolean; message?: string }>;
  verifyEmailOTP: (userId: string, otp: string) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      // Check if Appwrite is properly configured
      const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
      if (!projectId || projectId === '') {
        console.warn('⚠️ Appwrite not configured: Missing VITE_APPWRITE_PROJECT_ID');
        setUser(null);
        setLoading(false);
        return;
      }

      // Let's add debug info to help diagnose issues
      console.log('🔍 Checking session with Appwrite...', {
        endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
        projectId
      });

      try {
        const currentUser = await account.get();
        console.log('✅ Session check: User found', currentUser);
        setUser(currentUser);
      } catch (sessionError: any) {
        // Handle 401 errors gracefully (expected when not logged in)
        if (sessionError?.code === 401 || sessionError?.response?.code === 401) {
          console.log('ℹ️ No active session - User not logged in');
        } else {
          console.error('❌ Session check failed with unexpected error:', sessionError);
        }
        setUser(null);
      }
    } catch (error: any) {
      console.error('❌ Session check: Unexpected error', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
      
      // Store authentication status in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('isAuthenticated', 'true');
      
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed';
      
      if (error instanceof AppwriteException) {
        // Handle specific Appwrite error codes
        switch (error.code) {
          case 401:
            errorMessage = 'Invalid email or password';
            break;
          case 429:
            errorMessage = 'Too many attempts. Please try again later';
            break;
          default:
            errorMessage = error.message || 'Authentication error';
        }
      }
      
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      // Log registration attempt with detailed info
      console.log('🔄 Registration attempt:', { 
        email, 
        name, 
        endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1',
        projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID || '68e970330382476bf61'
      });
      
      // Use 'unique()' - this is the recommended approach by Appwrite
      // Let Appwrite handle the ID generation to avoid collisions
      console.log('⏳ Creating account with Appwrite...');
            
      // Create account
      await account.create('unique()', email, password, name);
      console.log('✅ Account created successfully!');
      
      // Show important info for debugging
      console.log('📝 Account details:', {
        email,
        name,
        createdAt: new Date().toISOString()
      });
      
      // Don't auto-login - user needs to verify email first
      console.log('📧 Account created. User needs to verify email before logging in.');
      
      return { 
        success: true,
        message: 'Account created successfully. Please verify your email to continue.'
      };
    } catch (error: any) {
      console.error('Registration error details:', error);
      
      // Log more detailed info about the error
      if (error instanceof AppwriteException) {
        console.error('Appwrite error code:', error.code);
        console.error('Appwrite error type:', error.type);
        console.error('Appwrite error message:', error.message);
        console.error('Response:', error.response);
      }
      
      let errorMessage = 'Registration failed';
      
      if (error instanceof AppwriteException) {
        // Handle specific Appwrite error codes
        switch (error.code) {
          case 409:
            errorMessage = 'An account with this email already exists';
            break;
          case 400:
            if (error.message.includes('password')) {
              errorMessage = 'Password must be at least 8 characters long';
            } else if (error.message.includes('email')) {
              errorMessage = 'Please provide a valid email address';
            } else {
              errorMessage = error.message || 'Invalid registration data';
            }
            break;
          case 404:
            errorMessage = 'Server configuration error. Please check Appwrite project settings.';
            break;
          default:
            errorMessage = `Registration failed: ${error.message || 'Unknown error'}`;
        }
      }
      
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      
      // Clear authentication status from storage
      localStorage.removeItem('isAuthenticated');
      sessionStorage.removeItem('isAuthenticated');
      
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
      throw new Error(error.message || 'Logout failed');
    }
  };

  const loginWithGoogle = () => {
    try {
      // Show a message before redirecting
      console.log('Redirecting to Google OAuth...');
      
      // Just try to redirect - This is a synchronous operation that will navigate away from the page
      account.createOAuth2Session(
        OAuthProvider.Google,
        `${window.location.origin}/dashboard`, // Success redirect
        `${window.location.origin}/login?error=google-auth` // Failure redirect
      );
      
      // If we get here, something went wrong with the redirect
      setTimeout(() => {
        alert('Unable to redirect to Google login. Please check if Google OAuth is enabled in your Appwrite console.');
      }, 1000);
      
    } catch (error: any) {
      console.error('Google OAuth error:', error);
      alert('Failed to initialize Google login. Please make sure Google OAuth is enabled in Appwrite console.');
    }
  };

  const loginWithGithub = () => {
    try {
      // Show a message before redirecting
      console.log('Redirecting to GitHub OAuth...');
      
      // Just try to redirect - This is a synchronous operation that will navigate away from the page
      account.createOAuth2Session(
        OAuthProvider.Github,
        `${window.location.origin}/dashboard`, // Success redirect
        `${window.location.origin}/login?error=github-auth` // Failure redirect
      );
      
      // If we get here, something went wrong with the redirect
      setTimeout(() => {
        alert('Unable to redirect to GitHub login. Please check if GitHub OAuth is enabled in your Appwrite console.');
      }, 1000);
      
    } catch (error: any) {
      console.error('GitHub OAuth error:', error);
      alert('Failed to initialize GitHub login. Please make sure GitHub OAuth is enabled in Appwrite console.');
    }
  };

  // Email Verification - Magic URL
  const sendMagicURL = async (email: string) => {
    try {
      console.log('📧 Sending Magic URL to:', email);
      
      await account.createMagicURLToken(
        'unique()',
        email,
        `${window.location.origin}/verify-magic-url`
      );
      
      console.log('✅ Magic URL sent successfully');
      toast.success('Magic link sent! Check your email.');
      
      return { success: true, message: 'Magic link sent to your email' };
    } catch (error: any) {
      console.error('❌ Magic URL error:', error);
      
      let errorMessage = 'Failed to send magic link';
      if (error instanceof AppwriteException) {
        errorMessage = error.message || errorMessage;
      }
      
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const verifyMagicURL = async (userId: string, secret: string) => {
    try {
      console.log('🔐 Verifying Magic URL...');
      
      await account.createSession(userId, secret);
      const currentUser = await account.get();
      setUser(currentUser);
      
      // Store authentication status
      localStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('isAuthenticated', 'true');
      
      console.log('✅ Magic URL verified successfully');
      toast.success('Email verified! You are now logged in.');
      
      return { success: true };
    } catch (error: any) {
      console.error('❌ Magic URL verification error:', error);
      
      let errorMessage = 'Invalid or expired magic link';
      if (error instanceof AppwriteException) {
        errorMessage = error.message || errorMessage;
      }
      
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Email Verification - OTP
  const sendEmailOTP = async (email: string) => {
    try {
      console.log('📧 Sending OTP to:', email);
      
      await account.createEmailToken(
        'unique()',
        email
      );
      
      console.log('✅ OTP sent successfully');
      toast.success('Verification code sent! Check your email.');
      
      return { success: true, message: 'OTP sent to your email' };
    } catch (error: any) {
      console.error('❌ OTP send error:', error);
      
      let errorMessage = 'Failed to send verification code';
      if (error instanceof AppwriteException) {
        errorMessage = error.message || errorMessage;
      }
      
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const verifyEmailOTP = async (userId: string, otp: string) => {
    try {
      console.log('🔐 Verifying OTP...');
      
      await account.createSession(userId, otp);
      const currentUser = await account.get();
      setUser(currentUser);
      
      // Store authentication status
      localStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('isAuthenticated', 'true');
      
      console.log('✅ OTP verified successfully');
      toast.success('Email verified! You are now logged in.');
      
      return { success: true };
    } catch (error: any) {
      console.error('❌ OTP verification error:', error);
      
      let errorMessage = 'Invalid or expired verification code';
      if (error instanceof AppwriteException) {
        errorMessage = error.message || errorMessage;
      }
      
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    loginWithGoogle,
    loginWithGithub,
    logout,
    isAuthenticated: !!user,
    sendMagicURL,
    verifyMagicURL,
    sendEmailOTP,
    verifyEmailOTP
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
