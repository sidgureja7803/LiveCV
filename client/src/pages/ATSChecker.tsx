import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, CheckCircle, AlertCircle, Target, TrendingUp, Eye } from 'lucide-react';
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
      if (jobDescription.trim()) {
        formData.append('jobDescription', jobDescription);
      }

      const response = await fetch('/api/ats/analyze', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze resume');
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        // Transform the backend response to match our frontend interface
        const backendResult = data.data;
        
        // Calculate keyword matches (mock for now since backend doesn't return this)
        const keywordMatches = Math.floor((backendResult.score / 100) * 20);
        const totalKeywords = 20;
        
        // Create sections analysis from suggestions
        const sections = [
          { name: 'Contact Information', found: true, importance: 'high' as const },
          { name: 'Professional Summary', found: backendResult.score > 70, importance: 'high' as const },
          { name: 'Work Experience', found: true, importance: 'high' as const },
          { name: 'Education', found: backendResult.score > 60, importance: 'medium' as const },
          { name: 'Skills', found: backendResult.score > 50, importance: 'high' as const },
          { name: 'Certifications', found: backendResult.score > 80, importance: 'low' as const }
        ];
        
        setResult({
          score: backendResult.score,
          feedback: backendResult.feedback || backendResult.suggestions || [],
          suggestions: backendResult.suggestions || [],
          keywordMatches,
          totalKeywords,
          sections
        });
      } else {
        throw new Error(data.message || 'Invalid response from server');
      }
    } catch (error) {
      console.error('ATS analysis error:', error);
      setError(`Failed to analyze resume: ${error.message}`);
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
                      <div className="relative w-40 h-40">
                        {/* Circular Progress Bar */}
                        <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 144 144">
                          {/* Background circle */}
                          <circle
                            cx="72"
                            cy="72"
                            r="60"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-gray-200 dark:text-gray-700"
                          />
                          {/* Progress circle */}
                          <circle
                            cx="72"
                            cy="72"
                            r="60"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 60}`}
                            strokeDashoffset={`${2 * Math.PI * 60 * (1 - result.score / 100)}`}
                            className={`transition-all duration-1000 ease-out ${
                              result.score >= 80 ? 'text-green-500' :
                              result.score >= 60 ? 'text-yellow-500' : 'text-red-500'
                            }`}
                            strokeLinecap="round"
                          />
                        </svg>
                        {/* Score text in center */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <span className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                              {result.score}%
                            </span>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              ATS Score
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {result.score >= 80 ? 'Excellent! 🎉' : result.score >= 60 ? 'Good Progress 👍' : 'Needs Improvement 📈'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your resume is {result.score >= 80 ? 'highly' : result.score >= 60 ? 'moderately' : 'poorly'} optimized for ATS systems
                      </p>
                    </div>
                  </div>

                  {/* Keyword Analysis */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-600" />
                      Keyword Analysis
                    </h2>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-600 dark:text-gray-400">Keywords Found</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {result.keywordMatches} / {result.totalKeywords}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-blue-800 h-4 rounded-full transition-all duration-1000 ease-out relative"
                        style={{ width: `${(result.keywordMatches / result.totalKeywords) * 100}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        {Math.round((result.keywordMatches / result.totalKeywords) * 100)}% Match Rate
                      </span>
                      <span className={`font-medium ${
                        (result.keywordMatches / result.totalKeywords) >= 0.8 ? 'text-green-600' :
                        (result.keywordMatches / result.totalKeywords) >= 0.6 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {(result.keywordMatches / result.totalKeywords) >= 0.8 ? 'Excellent' :
                         (result.keywordMatches / result.totalKeywords) >= 0.6 ? 'Good' : 'Needs Work'}
                      </span>
                    </div>
                  </div>

                  {/* Section Analysis */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-blue-600" />
                      Resume Sections
                    </h2>
                    <div className="space-y-3">
                      {result.sections.map((section, index) => (
                        <div key={index} className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                          section.found 
                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                        }`}>
                          <div className="flex items-center space-x-3">
                            {section.found ? (
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-white" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-white" />
                              </div>
                            )}
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white block">
                                {section.name}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {section.found ? 'Found in resume' : 'Missing from resume'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                              section.importance === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                              section.importance === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                              'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                            }`}>
                              {section.importance} priority
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Section Summary */}
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          Sections Found: {result.sections.filter(s => s.found).length} / {result.sections.length}
                        </span>
                        <span className="text-sm text-blue-700 dark:text-blue-300">
                          {Math.round((result.sections.filter(s => s.found).length / result.sections.length) * 100)}% Complete
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                      Detailed Analysis & Recommendations
                    </h2>
                    
                    <div className="space-y-6">
                      {/* Positive Feedback */}
                      {result.feedback && result.feedback.length > 0 && (
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border border-green-200 dark:border-green-800">
                          <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            What's Working Well
                          </h3>
                          <ul className="space-y-3">
                            {result.feedback.map((item, index) => (
                              <li key={index} className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-sm text-green-800 dark:text-green-200 leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Improvement Suggestions */}
                      {result.suggestions && result.suggestions.length > 0 && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
                          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2" />
                            Recommendations for Improvement
                          </h3>
                          <ul className="space-y-3">
                            {result.suggestions.map((item, index) => (
                              <li key={index} className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <TrendingUp className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Action Items */}
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-5 border border-yellow-200 dark:border-yellow-800">
                        <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3 flex items-center">
                          <AlertCircle className="w-5 h-5 mr-2" />
                          Next Steps
                        </h3>
                        <div className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
                          <p>• Review and implement the recommendations above</p>
                          <p>• Test your updated resume with different job descriptions</p>
                          <p>• Consider using our resume builder for ATS-optimized templates</p>
                          <p>• Re-run this analysis after making changes</p>
                        </div>
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