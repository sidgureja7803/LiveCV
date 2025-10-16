import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { apiService } from '../services/api';

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    github: '',
    linkedIn: '',
    bio: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [savedResumes, setSavedResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [githubData, setGithubData] = useState(null);
  const [isConnectingGithub, setIsConnectingGithub] = useState(false);

  useEffect(() => {
    // Fetch user profile data
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userData = await apiService.getUserProfile();
        setUser(userData);
        
        // Check if GitHub is connected
        if (userData.githubUsername) {
          fetchGithubData(userData.githubUsername);
        }
        
        // Fetch saved resumes
        const resumes = await apiService.getUserResumes();
        setSavedResumes(resumes.slice(0, 4)); // Get only the last 4 resumes
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  const fetchGithubData = async (username) => {
    try {
      const data = await apiService.getGithubProfile(username);
      setGithubData(data);
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveProfile = async () => {
    try {
      await apiService.updateUserProfile(user);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };
  
  const handleConnectGithub = async () => {
    setIsConnectingGithub(true);
    try {
      // This would normally redirect to GitHub OAuth flow
      // For now, we'll simulate it with a prompt
      const githubUsername = prompt('Enter your GitHub username:');
      if (githubUsername) {
        await apiService.connectGithub(githubUsername);
        setUser(prev => ({ ...prev, githubUsername }));
        fetchGithubData(githubUsername);
        alert('GitHub account connected successfully!');
      }
    } catch (error) {
      console.error('Error connecting GitHub:', error);
      alert('Failed to connect GitHub account. Please try again.');
    } finally {
      setIsConnectingGithub(false);
    }
  };
  
  const handleDisconnectGithub = async () => {
    try {
      await apiService.disconnectGithub();
      setUser(prev => ({ ...prev, githubUsername: null }));
      setGithubData(null);
      alert('GitHub account disconnected successfully!');
    } catch (error) {
      console.error('Error disconnecting GitHub:', error);
      alert('Failed to disconnect GitHub account. Please try again.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-gray-400">Manage your personal information and connected accounts</p>
          </header>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Personal Information */}
              <section className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Personal Information</h2>
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <button 
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="name" 
                        value={user.name} 
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white"
                      />
                    ) : (
                      <p className="text-lg">{user.name || 'Not set'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                    {isEditing ? (
                      <input 
                        type="email" 
                        name="email" 
                        value={user.email} 
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white"
                      />
                    ) : (
                      <p className="text-lg">{user.email || 'Not set'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">LinkedIn Profile</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="linkedIn" 
                        value={user.linkedIn || ''} 
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white"
                        placeholder="e.g. linkedin.com/in/username"
                      />
                    ) : (
                      <p className="text-lg">{user.linkedIn || 'Not set'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                    {isEditing ? (
                      <textarea 
                        name="bio" 
                        value={user.bio || ''} 
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white"
                      />
                    ) : (
                      <p className="text-lg">{user.bio || 'Not set'}</p>
                    )}
                  </div>
                </div>
              </section>
              
              {/* GitHub Integration */}
              <section className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">GitHub Integration</h2>
                
                {githubData ? (
                  <div className="flex items-start space-x-4">
                    <img 
                      src={githubData.avatar_url} 
                      alt={`${githubData.login}'s avatar`}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">{githubData.name}</h3>
                      <p className="text-gray-400 mb-2">@{githubData.login}</p>
                      <p className="mb-4">{githubData.bio}</p>
                      <div className="flex space-x-4 text-sm text-gray-400">
                        <span>{githubData.public_repos} repositories</span>
                        <span>{githubData.followers} followers</span>
                      </div>
                      <button 
                        onClick={handleDisconnectGithub}
                        className="mt-4 px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                      >
                        Disconnect GitHub
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-700 rounded-lg p-6 text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <h3 className="text-lg font-medium mb-2">Connect your GitHub Account</h3>
                    <p className="text-gray-400 mb-4">
                      Connecting your GitHub account allows you to showcase your projects and contributions directly in your resume.
                    </p>
                    <button 
                      onClick={handleConnectGithub}
                      disabled={isConnectingGithub}
                      className="px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center mx-auto"
                    >
                      {isConnectingGithub ? (
                        <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                      ) : (
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      )}
                      Connect with GitHub
                    </button>
                  </div>
                )}
              </section>
              
              {/* Recent Resumes */}
              <section className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Recent Resumes</h2>
                  <Link 
                    to="/dashboard" 
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    View All
                  </Link>
                </div>
                
                {savedResumes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedResumes.map(resume => (
                      <div key={resume.id} className="bg-gray-700 rounded-lg overflow-hidden">
                        <div className="h-32 bg-gray-600 relative">
                          {resume.thumbnailUrl ? (
                            <img 
                              src={resume.thumbnailUrl} 
                              alt={resume.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <span className="text-gray-400">No preview</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium mb-1">{resume.name}</h3>
                          <p className="text-sm text-gray-400 mb-3">Last updated: {new Date(resume.updatedAt).toLocaleDateString()}</p>
                          <div className="flex space-x-2">
                            <Link 
                              to={`/builder/${resume.templateId}?id=${resume.id}`}
                              className="px-3 py-1 bg-indigo-600 rounded text-sm hover:bg-indigo-700 transition-colors"
                            >
                              Edit
                            </Link>
                            <a 
                              href={resume.pdfUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-green-600 rounded text-sm hover:bg-green-700 transition-colors"
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">You haven't created any resumes yet.</p>
                    <Link 
                      to="/templates" 
                      className="px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Create Your First Resume
                    </Link>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
