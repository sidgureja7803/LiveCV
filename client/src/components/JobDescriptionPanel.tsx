import React, { useState } from 'react';
import type { JobDescription } from '../types';

interface JobDescriptionPanelProps {
  jobDescription: JobDescription | null;
  onJobDescriptionChange: (jd: JobDescription | null) => void;
}

const JobDescriptionPanel: React.FC<JobDescriptionPanelProps> = ({
  jobDescription,
  onJobDescriptionChange
}) => {
  const [title, setTitle] = useState(jobDescription?.title || '');
  const [company, setCompany] = useState(jobDescription?.company || '');
  const [description, setDescription] = useState(jobDescription?.description || '');

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      alert('Please enter job title and description');
      return;
    }

    const jd: JobDescription = {
      title: title.trim(),
      company: company.trim(),
      description: description.trim(),
      requirements: extractRequirements(description),
      text: description.trim() // Add the raw text content for ATS analysis
    };

    onJobDescriptionChange(jd);
  };

  const handleClear = () => {
    setTitle('');
    setCompany('');
    setDescription('');
    onJobDescriptionChange(null);
  };

  // Simple function to extract requirements from job description
  const extractRequirements = (desc: string): string[] => {
    const requirements: string[] = [];
    const lines = desc.split('\n');
    
    lines.forEach(line => {
      const cleanLine = line.trim();
      if (cleanLine.includes('•') || cleanLine.includes('-') || cleanLine.includes('*')) {
        const requirement = cleanLine.replace(/^[•\-*]\s*/, '').trim();
        if (requirement) {
          requirements.push(requirement);
        }
      }
    });

    return requirements;
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white">
            Job Description
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Job Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Senior Software Engineer"
              className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Company (Optional)
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g., Tech Corp"
              className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Job Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Paste the full job description here...&#10;&#10;Include:&#10;• Required skills&#10;• Experience requirements&#10;• Responsibilities&#10;• Qualifications"
              rows={8}
              className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 text-sm"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !description.trim()}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
            >
              Save Job Description
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm font-medium"
            >
              Clear
            </button>
          </div>

          {jobDescription && (
            <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-300">
                    <strong>{jobDescription.title}</strong>
                    {jobDescription.company && ` at ${jobDescription.company}`} has been saved.
                  </p>
                  <p className="text-xs text-green-400 mt-1">
                    Ready for ATS analysis! Use the panel below to check your score.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionPanel; 