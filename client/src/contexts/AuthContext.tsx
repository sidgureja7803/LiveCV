import React, { createContext, useContext, useState, useEffect } from 'react';
import { account } from '../config/appwrite';
import { Models, OAuthProvider, AppwriteException } from 'appwrite';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean }>;
  loginWithGoogle: () => void;
  loginWithGithub: () => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
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
        console.warn('Appwrite not configured: Missing VITE_APPWRITE_PROJECT_ID');
        setUser(null);
        setLoading(false);
        return;
      }

      const currentUser = await account.get();
      console.log('Session check: User found', currentUser);
      setUser(currentUser);
    } catch (error: any) {
      console.log('Session check: No active session', error.message);
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
      // Using Dev Key - Log registration details for debugging
      console.log('🔄 Registering with Dev Key:', { 
        email, 
        name, 
        endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
        projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
        usingDevKey: true
      });
      
      // Generate a more specific ID with client prefix
      const generateId = () => {
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substring(2, 10);
        return `lcv_${timestamp}_${randomStr}`;
      };
      const userId = generateId();
      console.log('Generated userId:', userId);
      
      try {
        // Use specific error handling blocks to narrow down issues
        console.log('⏳ Creating account with Appwrite...');
        
        // Create account with the explicit userId - WITH RETRY LOGIC
        let accountCreated = false;
        let attempts = 0;
        const maxAttempts = 2;
        
        while (!accountCreated && attempts < maxAttempts) {
          attempts++;
          try {
            await account.create(userId, email, password, name);
            accountCreated = true;
            console.log('✅ Account created successfully on attempt', attempts);
          } catch (createError: any) {
            console.error(`❌ Attempt ${attempts} failed:`, createError);
            if (attempts >= maxAttempts) throw createError;
            
            // Short wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      
        // Delay briefly before login to ensure account is ready
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Automatically login after registration
        console.log('⏳ Auto-login after registration...');
        await login(email, password);
        console.log('✅ Auto-login successful');
        
        return { success: true };
      } catch (innerError: any) {
        // More specific error handling
        console.error('❌ Registration process failed in inner try block:', innerError);
        throw innerError;
      }
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

  const value = {
    user,
    loading,
    login,
    register,
    loginWithGoogle,
    loginWithGithub,
    logout,
    isAuthenticated: !!user
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
