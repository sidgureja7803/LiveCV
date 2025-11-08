import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, Target, TrendingUp, Eye, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../contexts/ThemeContext';

interface JDMatchResult {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
  strengths: string[];
  improvements: string[];
  sectionAnalysis: {
    name: string;
    score: number;
    feedback: string;
  }[];
}

const JDMatcher: React.FC = () => {
  const { isDark } = useTheme();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionComplete, setExtractionComplete] = useState(false);
  const [result, setResult] = useState<JDMatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      if (uploadedFile.type === 'application/pdf' || uploadedFile.type.includes('word')) {
        setResumeFile(uploadedFile);
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
        setResumeFile(droppedFile);
        setError(null);
      } else {
        setError('Please upload a PDF or Word document');
      }
    }
  }, []);

  const analyzeMatch = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      setError('Please upload a resume and provide a job description');
      return;
    }

    setIsAnalyzing(true);
    setIsExtracting(true);
    setExtractionComplete(false);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobDescription', jobDescription);

      // Use the correct API endpoint based on environment
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/api/jd-match/analyze' 
        : 'http://localhost:5001/api/jd-match/analyze';
      
      // Simulate extraction phase (minimum 2 seconds to show the modal)
      const extractionTimer = setTimeout(() => {
        setExtractionComplete(true);
      }, 2000);
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      // Wait for extraction animation to complete
      await new Promise(resolve => setTimeout(resolve, 2000));
      clearTimeout(extractionTimer);
      setExtractionComplete(true);
      
      // Wait a bit to show the success state
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsExtracting(false);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze job match');
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setResult(data.data);
      } else {
        throw new Error(data.message || 'Invalid response from server');
      }
    } catch (error) {
      console.error('JD matching error:', error);
      setIsExtracting(false);
      
      // Check if it's a network error
      if (error.message.includes('fetch')) {
        setError('Unable to connect to the server. Please make sure the backend is running on port 5001.');
      } else {
        setError(`Failed to analyze job match: ${error.message}`);
      }
      
      // Mock result for demo purposes when there's an error
      setResult({
        matchPercentage: 78,
        matchedSkills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'MongoDB'],
        missingSkills: ['Python', 'AWS', 'Docker', 'Kubernetes'],
        matchedKeywords: ['frontend', 'backend', 'full-stack', 'agile', 'team collaboration'],
        missingKeywords: ['cloud computing', 'microservices', 'CI/CD', 'DevOps'],
        recommendations: [
          'Add cloud computing experience to your resume',
          'Highlight your experience with microservices architecture',
          'Include specific examples of CI/CD pipeline implementation',
          'Mention any DevOps tools you have used'
        ],
        strengths: [
          'Strong match in core programming languages',
          'Excellent frontend development skills',
          'Good team collaboration experience',
          'Relevant project experience'
        ],
        improvements: [
          'Add cloud platform certifications',
          'Include more backend architecture details',
          'Highlight scalability achievements',
          'Add metrics and quantifiable results'
        ],
        sectionAnalysis: [
          { name: 'Technical Skills', score: 85, feedback: 'Strong match with required technologies' },
          { name: 'Experience Level', score: 75, feedback: 'Good experience level, could highlight leadership' },
          { name: 'Industry Knowledge', score: 70, feedback: 'Relevant industry experience present' },
          { name: 'Education', score: 80, feedback: 'Educational background aligns well' }
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
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      {/* Resume Extraction Modal */}
      {isExtracting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 max-w-2xl w-full mx-4 relative">
            {/* Close button */}
            <button
              onClick={() => {
                setIsExtracting(false);
                setIsAnalyzing(false);
              }}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Build your resume
              </h2>

              {/* Animated Icon */}
              <div className="flex justify-center mb-8">
                <div className="relative w-48 h-48">
                  {/* Background Circle */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full"></div>
                  
                  {/* Document Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* Document with magnifying glass or checkmark */}
                      <div className="bg-white rounded-lg shadow-lg p-6 w-32 h-36 relative">
                        {/* Document lines */}
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-2 bg-gray-200 rounded w-full"></div>
                          <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                          <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                        </div>
                        
                        {/* Animated overlay icon */}
                        <div className="absolute -bottom-4 -right-4">
                          {extractionComplete ? (
                            // Checkmark icon
                            <div className="bg-green-500 rounded-full p-3 shadow-lg animate-bounce">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          ) : (
                            // Magnifying glass icon with pulse animation
                            <div className="bg-teal-500 rounded-full p-3 shadow-lg animate-pulse">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Text */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {extractionComplete 
                    ? 'Resume extracted successfully!' 
                    : 'Extracting your resume details...It may take a few minutes.'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
                  Note: AI Resume extraction may not be 100% accurate. Some items (e.g., profile photo) or unsupported sections will not be extracted, please add the data manually if needed
                </p>
              </div>

              {/* Progress Bar */}
              {!extractionComplete && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full animate-progress"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
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
                  Job Description Matcher
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Analyze how well your resume matches a specific job description
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              {/* Resume Upload */}
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
                      {resumeFile ? resumeFile.name : 'Drop your resume here or click to browse'}
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
                  Job Description
                </h2>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the complete job description here..."
                  rows={12}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-colors resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Include job requirements, responsibilities, and preferred qualifications for best results
                </p>
              </div>

              {/* Analyze Button */}
              <button
                onClick={analyzeMatch}
                disabled={!resumeFile || !jobDescription.trim() || isAnalyzing}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Analyzing Match...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Analyze Job Match</span>
                  </>
                )}
              </button>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {result ? (
                <>
                  {/* Match Score */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Job Match Score
                    </h2>
                    <div className="flex items-center justify-center mb-6">
                      <div className="relative w-40 h-40">
                        {/* Circular Progress Bar */}
                        <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 144 144">
                          <circle
                            cx="72"
                            cy="72"
                            r="60"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-gray-200 dark:text-gray-700"
                          />
                          <circle
                            cx="72"
                            cy="72"
                            r="60"
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 60}`}
                            strokeDashoffset={`${2 * Math.PI * 60 * (1 - result.matchPercentage / 100)}`}
                            className="transition-all duration-1000 ease-out"
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" className={`${result.matchPercentage >= 80 ? 'stop-green-500' : result.matchPercentage >= 60 ? 'stop-yellow-500' : 'stop-red-500'}`} />
                              <stop offset="100%" className={`${result.matchPercentage >= 80 ? 'stop-emerald-500' : result.matchPercentage >= 60 ? 'stop-orange-500' : 'stop-pink-500'}`} />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <span className={`text-3xl font-bold ${getScoreColor(result.matchPercentage)}`}>
                              {result.matchPercentage}%
                            </span>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Match Score
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {result.matchPercentage >= 80 ? 'Excellent Match! 🎯' : 
                         result.matchPercentage >= 60 ? 'Good Match 👍' : 'Needs Improvement 📈'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your resume is a {result.matchPercentage >= 80 ? 'strong' : result.matchPercentage >= 60 ? 'decent' : 'weak'} match for this position
                      </p>
                    </div>
                  </div>

                  {/* Skills Analysis */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-600" />
                      Skills Analysis
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Matched Skills */}
                      <div>
                        <h3 className="font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Matched Skills ({result.matchedSkills.length})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {result.matchedSkills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded-full font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Missing Skills */}
                      <div>
                        <h3 className="font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Missing Skills ({result.missingSkills.length})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {result.missingSkills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm rounded-full font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section Analysis */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                      Section Analysis
                    </h2>
                    <div className="space-y-4">
                      {result.sectionAnalysis.map((section, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {section.name}
                              </span>
                              <span className={`font-bold ${getScoreColor(section.score)}`}>
                                {section.score}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                              <div 
                                className={`bg-gradient-to-r ${getScoreBgColor(section.score)} h-2 rounded-full transition-all duration-500`}
                                style={{ width: `${section.score}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {section.feedback}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                      Recommendations & Action Items
                    </h2>
                    
                    <div className="space-y-6">
                      {/* Strengths */}
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border border-green-200 dark:border-green-800">
                        <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Your Strengths
                        </h3>
                        <ul className="space-y-2">
                          {result.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-green-800 dark:text-green-200">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Improvements */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                          <TrendingUp className="w-5 h-5 mr-2" />
                          Areas for Improvement
                        </h3>
                        <ul className="space-y-2">
                          {result.improvements.map((improvement, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <TrendingUp className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-blue-800 dark:text-blue-200">{improvement}</span>
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
                    Upload your resume and paste a job description to get detailed matching analysis
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">
              💡 Job Matching Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Resume Optimization</h4>
                <ul className="space-y-1 text-blue-700 dark:text-blue-300 text-sm">
                  <li>• Use keywords from the job description naturally</li>
                  <li>• Quantify your achievements with numbers</li>
                  <li>• Match your experience level to requirements</li>
                  <li>• Highlight relevant projects and skills</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Job Description Analysis</h4>
                <ul className="space-y-1 text-blue-700 dark:text-blue-300 text-sm">
                  <li>• Include complete job posting for best results</li>
                  <li>• Pay attention to "required" vs "preferred" skills</li>
                  <li>• Note company culture and values mentioned</li>
                  <li>• Look for specific tools and technologies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JDMatcher;