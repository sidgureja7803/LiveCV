import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import PDFModal from '../components/PDFModal';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { databases, storage, APPWRITE_CONFIG } from '../config/appwrite';
import { Query } from 'appwrite';
import { FileText, Eye, Download, Trash2, Plus, Moon, Sun } from 'lucide-react';

interface ResumeItem {
  id: string;
  name: string;
  lastUpdated: string;
  templateId: string;
  theme: string;
  pdfUrl?: string;
  yamlUrl?: string;
  atsScore: number | null;
}

interface ResumeLimitInfo {
  count: number;
  limit: number;
  remaining: number;
}

interface TemplateFile {
  id?: string;
  name: string;
  theme: string;
  pdfPath: string;
  yamlPath: string;
  pdfUrl?: string;
  yamlUrl?: string;
  category?: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [resumeLimit, setResumeLimit] = useState<ResumeLimitInfo>({ count: 0, limit: 5, remaining: 5 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPDF, setSelectedPDF] = useState<{ url: string; name: string } | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchResumes();
    }
  }, [isAuthenticated]);

  const fetchResumes = async () => {
    setIsLoading(true);
    try {
      if (!user) return;

      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.resumes,
        [
          Query.equal('userId', user.$id),
          Query.orderDesc('$createdAt'),
          Query.limit(50)
        ]
      );

      const resumeList = response.documents.map((doc: any) => ({
        id: doc.$id,
        name: doc.name || 'Untitled Resume',
        lastUpdated: doc.$updatedAt,
        templateId: doc.templateId || 'classic',
        theme: doc.theme || 'classic',
        pdfUrl: doc.pdfUrl,
        yamlUrl: doc.yamlUrl,
        atsScore: doc.atsScore || null
      }));

      setResumes(resumeList);
      
      // Update resume limit info
      const count = resumeList.length;
      const limit = 5;
      const remaining = Math.max(0, limit - count);
      setResumeLimit({ count, limit, remaining });
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleViewPDF = (pdfUrl: string, name: string) => {
    setSelectedPDF({ url: pdfUrl, name });
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      await databases.deleteDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.resumes,
        resumeId
      );
      fetchResumes();
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('Failed to delete resume');
    }
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'bg-gray-600';
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };


  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </button>
      </header>
      
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Welcome back, {user?.name || 'User'}!</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your resumes and optimize them for job applications.</p>
        </div>

        {/* How It Works Section */}
        {resumes.length === 0 && (
          <div className="mb-10 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-indigo-100 dark:border-indigo-800">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">How LiveCV Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Choose Template</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Select from our ATS-optimized templates designed by professionals</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Live Editing</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Edit your resume with real-time PDF preview powered by RenderCV</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-red-600 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Download & Apply</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Download your professional PDF and start applying to jobs</p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link
                to="/templates"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Resume</span>
              </Link>
            </div>
          </div>
        )}

        {/* Platform Features */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">ATS-Optimized</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">All templates are designed to pass Applicant Tracking Systems</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Live Preview</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">See your changes instantly with real-time PDF generation</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">RenderCV Powered</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Built with RenderCV for professional LaTeX-quality output</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Secure & Private</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Your data is encrypted and stored securely with Appwrite</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-10">
          <Link
            to="/templates"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Resume</span>
          </Link>
          <Link
            to="/jd-matcher"
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>JD Matcher</span>
          </Link>
          <button className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl flex items-center gap-2 transition-all border border-gray-200 dark:border-gray-700">
            <Download className="w-5 h-5" />
            <span>Import Resume</span>
          </button>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Your Resumes</h3>
            <div className="flex items-center gap-2">
              <span className={`px-4 py-2 rounded-xl font-semibold text-sm shadow-md ${
                resumeLimit.count >= resumeLimit.limit 
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800' 
                  : resumeLimit.count >= resumeLimit.limit - 1
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800'
                  : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
              }`}>
                {resumeLimit.count}/{resumeLimit.limit} resumes
              </span>
              {resumeLimit.remaining > 0 && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ({resumeLimit.remaining} slot{resumeLimit.remaining !== 1 ? 's' : ''} remaining)
                </span>
              )}
            </div>
          </div>
          
          {/* My Resumes Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse shadow-lg">
                  <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))
            ) : resumes.length > 0 ? (
              resumes.map((resume) => (
                <div key={resume.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 hover:shadow-2xl transition-all shadow-lg border border-gray-100 dark:border-gray-700 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                      {new Date(resume.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg mb-2 truncate text-gray-900 dark:text-white">{resume.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Theme: {resume.theme}</p>
                  {resume.atsScore && (
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${getScoreColor(resume.atsScore)} text-white`}>
                      ATS: {resume.atsScore}%
                    </span>
                  )}
                  <div className="flex gap-2">
                    {resume.pdfUrl && (
                      <button
                        onClick={() => handleViewPDF(resume.pdfUrl!, resume.name)}
                        className="flex-1 flex items-center justify-center gap-2 p-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">View</span>
                      </button>
                    )}
                    <Link
                      to={`/builder/${resume.id}`}
                      className="flex-1 flex items-center justify-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span className="text-sm font-medium">Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDeleteResume(resume.id)}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No resumes yet. Create your first one!</p>
                <Link
                  to="/templates"
                  className="inline-block mt-4 text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  Browse Templates →
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* PDF Modal */}
      {selectedPDF && (
        <PDFModal
          isOpen={true}
          onClose={() => setSelectedPDF(null)}
          pdfUrl={selectedPDF.url}
          fileName={selectedPDF.name}
        />
      )}
    </div>
  );
};

export default Dashboard;
