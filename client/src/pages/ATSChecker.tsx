import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, CheckCircle, AlertCircle, Target, TrendingUp, Eye, Download } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../contexts/ThemeContext';

interface ATSResult {
  score: number;
  feedback: string[];
  suggestions: string[];
  keywordMatches: number;
  totalKeywords: number;
  sections: {
    name: string;
    found: boolean;
    importance: 'high' | 'medium' | 'low';
  }[];
}

const ATSChecker: React.FC = () => {
  const { isDark } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ATSResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      if (uploadedFile.type === 'application/pdf' || uploadedFile.type.includes('word')) {
        setFile(uploadedFile);
        setError(null);
      } else {
        setError('Please upload a PDF or Word document');
      }
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.type === 'application/pdf' || droppedFile.type.includes('word')) {
        setFile(droppedFile);
        setError(null);
      } else {
        setError('Please upload a PDF or Word document');
      }
    }
  }, []);

  const analyzeResume = async () => {
    if (!file) {
      setError('Please upload a resume file');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', jobDescription);

      const response = await fetch('/api/ats/analyze', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('ATS analysis error:', error);
      setError('Failed to analyze resume. Please try again.');
      
      // Mock result for demo purposes
      setResult({
        score: 78,
        feedback: [
          'Your resume has good keyword optimization',
          'Contact information is clearly visible',
          'Work experience section is well-structured',
          'Missing skills section could hurt ATS parsing'
        ],
        suggestions: [
          'Add a dedicated skills section with relevant keywords',
          'Include more industry-specific terms from the job description',
          'Use standard section headings like "Work Experience" and "Education"',
          'Consider adding a professional summary at the top'
        ],
        keywordMatches: 12,
        totalKeywords: 18,
        sections: [
          { name: 'Contact Information', found: true, importance: 'high' },
          { name: 'Professional Summary', found: false, importance: 'high' },
          { name: 'Work Experience', found: true, importance: 'high' },
          { name: 'Education', found: true, importance: 'medium' },
          { name: 'Skills', found: false, importance: 'high' },
          { name: 'Certifications', found: false, importance: 'low' }
        ]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Target className="w-8 h-8 mr-3 text-blue-600" />
                  ATS Resume Checker
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Optimize your resume for Applicant Tracking Systems
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-blue-600" />
                  Upload Your Resume
                </h2>
                
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {file ? file.name : 'Drop your resume here or click to browse'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Supports PDF, DOC, and DOCX files
                    </p>
                  </label>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
                  </div>
                )}
              </div>

              {/* Job Description */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Job Description (Optional)
                </h2>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here to get more targeted feedback..."
                  rows={8}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-colors resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Adding a job description helps us provide more specific keyword recommendations
                </p>
              </div>

              {/* Analyze Button */}
              <button
                onClick={analyzeResume}
                disabled={!file || isAnalyzing}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Analyzing Resume...</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5" />
                    <span>Analyze Resume</span>
                  </>
                )}
              </button>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {result ? (
                <>
                  {/* ATS Score */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      ATS Compatibility Score
                    </h2>
                    <div className="flex items-center justify-center mb-6">
                      <div className={`w-32 h-32 rounded-full ${getScoreBgColor(result.score)} flex items-center justify-center`}>
                        <span className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                          {result.score}%
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {result.score >= 80 ? 'Excellent' : result.score >= 60 ? 'Good' : 'Needs Improvement'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your resume is {result.score >= 80 ? 'highly' : result.score >= 60 ? 'moderately' : 'poorly'} optimized for ATS systems
                      </p>
                    </div>
                  </div>

                  {/* Keyword Analysis */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Keyword Analysis
                    </h2>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-600 dark:text-gray-400">Keywords Found</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {result.keywordMatches} / {result.totalKeywords}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-blue-800 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(result.keywordMatches / result.totalKeywords) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Section Analysis */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Resume Sections
                    </h2>
                    <div className="space-y-3">
                      {result.sections.map((section, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {section.found ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-red-500" />
                            )}
                            <span className="font-medium text-gray-900 dark:text-white">
                              {section.name}
                            </span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            section.importance === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                            section.importance === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                          }`}>
                            {section.importance}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Feedback & Suggestions
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">What's Working Well:</h3>
                        <ul className="space-y-2">
                          {result.feedback.map((item, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Recommendations:</h3>
                        <ul className="space-y-2">
                          {result.suggestions.map((item, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
                  <Eye className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Ready to Analyze
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Upload your resume and click "Analyze Resume" to get detailed ATS feedback
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">
              💡 ATS Optimization Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Format Guidelines</h4>
                <ul className="space-y-1 text-blue-700 dark:text-blue-300 text-sm">
                  <li>• Use standard fonts like Arial, Calibri, or Times New Roman</li>
                  <li>• Avoid images, graphics, and complex formatting</li>
                  <li>• Use standard section headings</li>
                  <li>• Save as PDF to preserve formatting</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Content Tips</h4>
                <ul className="space-y-1 text-blue-700 dark:text-blue-300 text-sm">
                  <li>• Include relevant keywords from job descriptions</li>
                  <li>• Use action verbs to describe achievements</li>
                  <li>• Quantify results with numbers and percentages</li>
                  <li>• Include both hard and soft skills</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ATSChecker;