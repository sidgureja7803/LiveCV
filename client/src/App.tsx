import React from 'react';
import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LandingPage } from './pages/LandingPage';
import Login from './pages/Login';
import SignupPage from './pages/SignupPage';
import ForgotPassword from './pages/ForgotPassword';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import ResumeBuilder from './pages/ResumeBuilder';
import TemplateSelector from './pages/TemplateSelector';
import TailwindTest from './TailwindTest';
import './App.css';

// ProtectedRoute component that requires authentication
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark:from-gray-800 dark:via-gray-900 dark:to-black flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading...</div>
      </div>
    );
  }
  
  return isAuthenticated ? element : <Navigate to="/login" state={{ from: location }} replace />;  
};

// Resume redirect component - redirects from /resume/:templateId to /builder/:templateId
const ResumeRedirect: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  return <Navigate to={`/builder/${templateId}`} replace />;
};

// TemplateRequiredRoute component that requires a template selection
const TemplateRequiredRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const hasTemplateParam = location.pathname.includes('/builder/') && location.pathname.split('/builder/')[1]?.length > 0;
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark:from-gray-800 dark:via-gray-900 dark:to-black flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading...</div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If no template is selected, redirect to template selection
  if (!hasTemplateParam) {
    return <Navigate to="/templates" state={{ from: location }} replace />;
  }
  
  return element;
};

function App() {
  // Lazy load components for code splitting
  const Dashboard = React.lazy(() => import('./pages/Dashboard'));
  const ATSAnalysisPage = React.lazy(() => import('./pages/ATSAnalysisPage'));
  const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
  
  return (
    <ThemeProvider>
      <AuthProvider>
        {/* Toast notifications container */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10B981',
                color: '#fff',
              },
            },
            error: {
              style: {
                background: '#EF4444',
                color: '#fff',
              },
              duration: 5000,
            },
          }}
        />
        <React.Suspense fallback={
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark:from-gray-800 dark:via-gray-900 dark:to-black flex items-center justify-center">
            <div className="animate-pulse text-white text-xl">Loading page...</div>
          </div>
        }>
          <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
            <Routes>
              {/* Temporary Tailwind test route */}
              <Route path="/test" element={<TailwindTest />} />
              
              {/* Public routes - always accessible */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignupPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Templates route - protected with authentication */}
              <Route path="/templates" element={<ProtectedRoute element={<TemplateSelector />} />} />
              
              {/* Redirect /resume to /templates to force template selection */}
              <Route path="/resume" element={<Navigate to="/templates" replace />} />
              
              {/* ResumeBuilder route - requires both authentication and template selection */}
              <Route path="/builder/:templateId" element={<TemplateRequiredRoute element={<ResumeBuilder />} />} />
              <Route path="/builder" element={<Navigate to="/templates" replace />} />
              
              {/* Backwards compatibility route */}
              <Route path="/resume/:templateId" element={<ResumeRedirect />} />
              
              {/* Protected routes - require authentication */}
              <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
              <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
              <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
              <Route path="/analyze/:resumeId" element={<ProtectedRoute element={<ATSAnalysisPage />} />} />
              
              {/* 404 - Must be last route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </React.Suspense>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;