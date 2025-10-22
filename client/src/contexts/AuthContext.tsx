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
      // Create account
      await account.create('unique()', email, password, name);
      
      // Automatically login after registration
      await login(email, password);
      
      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      
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
          default:
            errorMessage = error.message || 'Registration failed';
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
