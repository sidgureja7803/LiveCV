import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from '../components/Sidebar';
import { User, Lock, Bell, Shield, Moon, Sun, Save, Mail } from 'lucide-react';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'preferences'>('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // Profile settings
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  // Security settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [atsAlerts, setAtsAlerts] = useState(true);

  const handleSaveProfile = async () => {
    setLoading(true);
    setSuccess('');
    try {
      // TODO: Update user profile via Appwrite
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    setLoading(true);
    try {
      // TODO: Update password via Appwrite
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Failed to change password:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Shield },
  ] as const;

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Tabs */}
          <div className="px-8 flex space-x-8">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 pb-4 border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 max-w-3xl">
          {success && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 border border-green-500 rounded-lg text-green-700 dark:text-green-400">
              {success}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                <Lock className="w-5 h-5" />
                <span>{loading ? 'Updating...' : 'Change Password'}</span>
              </button>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive email updates about your resumes</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">ATS Score Alerts</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get notified when ATS scores are analyzed</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={atsAlerts}
                    onChange={(e) => setAtsAlerts(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  {isDark ? <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Theme</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred theme</p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                >
                  {isDark ? 'Switch to Light' : 'Switch to Dark'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Settings;
