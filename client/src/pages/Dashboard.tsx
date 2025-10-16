import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import PDFModal from '../components/PDFModal';
import { useAuth } from '../contexts/AuthContext';
import { databases, storage, APPWRITE_CONFIG } from '../config/appwrite';
import { Query } from 'appwrite';
import { FileText, Eye, Download, Trash2, Plus } from 'lucide-react';

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

interface TemplateFile {
  name: string;
  theme: string;
  pdfPath: string;
  yamlPath: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [templates, setTemplates] = useState<TemplateFile[]>([]);
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
      fetchTemplates();
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
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      // Fetch template files from backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/templates`);
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
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
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {/* Add user profile dropdown or other header items here */}
      </header>
      
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name || 'User'}!</h2>
          <p className="text-gray-400">Manage your resumes and optimize them for job applications.</p>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-10">
          <Link
            to="/templates"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Create New Resume</span>
          </Link>
          <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            <span>Import Resume</span>
          </button>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Your Resumes</h3>
            {/* Add sort button here if needed */}
          </div>
          
          {/* My Resumes Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-6 animate-pulse">
                  <div className="h-40 bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-5 bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              ))
            ) : resumes.length > 0 ? (
              resumes.map((resume) => (
                <div key={resume.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <FileText className="w-10 h-10 text-indigo-500" />
                    <span className="text-xs text-gray-400">
                      {new Date(resume.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg mb-2 truncate">{resume.name}</h4>
                  <p className="text-sm text-gray-400 mb-4">Theme: {resume.theme}</p>
                  {resume.atsScore && (
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white mb-4 ${getScoreColor(resume.atsScore)}`}>
                      ATS: {resume.atsScore}%
                    </span>
                  )}
                  <div className="flex gap-2">
                    {resume.pdfUrl && (
                      <button
                        onClick={() => handleViewPDF(resume.pdfUrl!, resume.name)}
                        className="flex-1 flex items-center justify-center gap-2 p-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">View</span>
                      </button>
                    )}
                    <Link
                      to={`/builder/${resume.id}`}
                      className="flex-1 flex items-center justify-center gap-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span className="text-sm">Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDeleteResume(resume.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-400">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No resumes yet. Create your first one!</p>
              </div>
            )}
          </div>

          {/* Template Gallery Section */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-4">Available Templates</h3>
            <p className="text-gray-400 mb-6">Choose from our professional templates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-all group">
                <div className="bg-gray-700 rounded-lg h-48 mb-4 flex items-center justify-center relative overflow-hidden">
                  <FileText className="w-16 h-16 text-indigo-500 opacity-50" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleViewPDF(`${import.meta.env.VITE_API_BASE_URL}/templates/${template.pdfPath}`, template.name)}
                      className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                      title="Preview"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <a
                      href={`${import.meta.env.VITE_API_BASE_URL}/templates/${template.pdfPath}`}
                      download
                      className="p-2 bg-green-600 hover:bg-green-700 rounded-lg"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </div>
                </div>
                <h4 className="font-semibold mb-1 truncate">{template.name}</h4>
                <p className="text-xs text-gray-400">Theme: {template.theme}</p>
              </div>
            ))}
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
