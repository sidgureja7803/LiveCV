import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

// Import components
import JobDescriptionPanel from '../components/JobDescriptionPanel';
import ATSScorePanel from '../components/ATSScorePanel';

// Types
import type { ATSScore, JobDescription, ResumeData } from '../types';

const ATSAnalysisPage: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();
  
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(null);
  const [atsScore, setATSScore] = useState<ATSScore | null>(null);
  const [isCalculatingATS, setIsCalculatingATS] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch resume data
  useEffect(() => {
    const fetchResumeData = async () => {
      if (!resumeId) return;
      setIsLoading(true);
      
      try {
        // Fetch the real resume data from our API
        const response = await fetch(`/api/resume/${resumeId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include' // Important for authentication cookies
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch resume: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.success && data.data) {
          setResumeData(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch resume data');
        }
      } catch (error) {
        console.error('Error fetching resume data:', error);
        // If we can't fetch the data, we might want to show an error or redirect
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResumeData();
  }, [resumeId]);
  
  // Handle calculating ATS score
  const handleCalculateATS = async () => {
    if (!jobDescription || !resumeData) {
      alert('Please enter a job description and ensure resume is loaded');
      return;
    }

    setIsCalculatingATS(true);
    try {
      // Get resume HTML content from template
      const templateResponse = await fetch(`/api/resume/render/${resumeData.templateId || 'default'}?resumeId=${resumeData.id}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!templateResponse.ok) {
        throw new Error(`Failed to get resume HTML: ${templateResponse.status}`);
      }
      
      const resumeHtml = await templateResponse.text();
      
      // Call the ATS analysis API with resume content and job description
      const atsResponse = await fetch('/api/ats/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          resumeContent: resumeHtml,
          jobDescription: jobDescription.text,
          resumeId: resumeData.id,
          templateName: resumeData.templateId || 'default'
        })
      });
      
      if (!atsResponse.ok) {
        throw new Error(`ATS analysis failed: ${atsResponse.status}`);
      }
      
      const atsResult = await atsResponse.json();
      
      if (atsResult.success && atsResult.data) {
        // Map the API response to our ATSScore type
        const apiATSResult: ATSScore = {
          overallScore: atsResult.data.score,
          keywordMatches: atsResult.data.analysis?.keywordPresence || 0,
          totalKeywords: 100,
          suggestions: atsResult.data.suggestions || [],
          missingSkills: atsResult.data.missingSkills || []
        };
        
        setATSScore(apiATSResult);
      } else {
        throw new Error(atsResult.message || 'Failed to analyze resume');
      }
    } catch (error) {
      console.error('ATS calculation failed:', error);
      alert('Failed to calculate ATS score. Please try again.');
    } finally {
      setIsCalculatingATS(false);
    }
  };
  
  // Generate a resume preview text
  const generateResumePreview = (data: ResumeData): string => {
    if (!data) return '';
    
    return `
      ${data.personalInfo.fullName}
      ${data.personalInfo.email} | ${data.personalInfo.phone} | ${data.personalInfo.address}
      
      SUMMARY
      ${data.summary}
      
      SKILLS
      ${data.skills.join(', ')}
      
      EXPERIENCE
      ${data.experience.map(exp => `
        ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate})
        ${exp.description}
      `).join('\n')}
      
      EDUCATION
      ${data.education.map(edu => `
        ${edu.degree} in ${edu.fieldOfStudy}
        ${edu.institution} (${edu.endDate})
      `).join('\n')}
      
      ${data.projects ? `PROJECTS\n${data.projects.map(project => `
        ${project.name}: ${project.description}
        Technologies: ${project.technologies.join(', ')}
      `).join('\n')}` : ''}
    `.trim();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-white">LiveCV</h1>
              </Link>
              <span className="text-gray-500">•</span>
              <span className="text-gray-300">ATS Analysis</span>
              {resumeData && (
                <>
                  <span className="text-gray-500">•</span>
                  <span className="text-purple-400">{resumeData.personalInfo.fullName}'s Resume</span>
                </>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                Back
              </button>
              <Link
                to="/dashboard"
                className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : resumeData ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Resume Preview - Main Column */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-white">
                      Resume Preview
                    </h2>
                  </div>
                  
                  {/* Resume content */}
                  <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                    <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">
                      {generateResumePreview(resumeData)}
                    </pre>
                  </div>
                  
                  {/* Actions */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      to={`/resume/${resumeId}`}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span>Edit Resume</span>
                    </Link>
                    
                    <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-all flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Download PDF</span>
                    </button>
                    
                    <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-all flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Side Panel */}
            <div className="space-y-6">
              {/* Job Description Panel */}
              <JobDescriptionPanel 
                onJobDescriptionChange={setJobDescription}
                jobDescription={jobDescription}
              />
              
              {/* ATS Score Panel */}
              <ATSScorePanel 
                atsScore={atsScore}
                onCalculateATS={handleCalculateATS}
                isCalculating={isCalculatingATS}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-800/30 backdrop-blur border border-gray-700/30 rounded-xl">
            <div className="w-16 h-16 rounded-full bg-gray-700/50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="text-xl font-medium text-white mb-2">Resume not found</h4>
            <p className="text-gray-400 mb-6">The resume you're looking for doesn't exist or was removed</p>
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Back to Dashboard
            </Link>
          </div>
        )}
        
        {/* Related Resources */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-white mb-6">Resources to Improve Your Resume</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">ATS Optimization Tips</h4>
              <p className="text-gray-300 mb-4">Learn how to optimize your resume to pass through Applicant Tracking Systems.</p>
              <a href="#" className="text-purple-400 hover:text-purple-300 text-sm">Read guide →</a>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Action Verbs Library</h4>
              <p className="text-gray-300 mb-4">Powerful action verbs to make your resume achievements stand out.</p>
              <a href="#" className="text-purple-400 hover:text-purple-300 text-sm">View library →</a>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Industry Examples</h4>
              <p className="text-gray-300 mb-4">Browse through successful resumes from your industry for inspiration.</p>
              <a href="#" className="text-purple-400 hover:text-purple-300 text-sm">See examples →</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ATSAnalysisPage;
