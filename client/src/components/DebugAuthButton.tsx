import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { clearAllSessions } from '../utils/clearSession';

export const DebugAuthButton: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-red-600 text-white p-4 rounded-lg shadow-2xl max-w-sm">
      <h3 className="font-bold mb-2">Debug Auth State</h3>
      <div className="text-xs space-y-1 mb-3">
        <div>Loading: {loading ? 'Yes' : 'No'}</div>
        <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
        <div>User: {user ? user.email : 'null'}</div>
      </div>
      <button
        onClick={() => clearAllSessions()}
        className="w-full bg-white text-red-600 px-3 py-2 rounded font-bold text-sm hover:bg-gray-100"
      >
        Clear All Sessions
      </button>
    </div>
  );
};
