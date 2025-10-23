import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Briefcase } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import type { ResumeData } from '../types';

interface ExperienceEntry {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

const ExperienceBuilder: React.FC = () => {
  const [experiences, setExperiences] = useState<ExperienceEntry[]>([
    {
      id: '1',
      company: 'Tech Corp',
      position: 'Senior Software Engineer',
      startDate: '2021-01',
      endDate: '2024-01',
      current: false,
      description: 'Led development of microservices architecture...'
    }
  ]);

  const addExperience = () => {
    const newExperience: ExperienceEntry = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setExperiences([...experiences, newExperience]);
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof ExperienceEntry, value: any) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const saveExperiences = () => {
    // Save to localStorage or API
    localStorage.setItem('resumeExperiences', JSON.stringify(experiences));
    alert('Experience data saved successfully!');
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link 
                to="/templates" 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Briefcase className="w-8 h-8 mr-3 text-indigo-600" />
                  Work Experience
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Add your professional work experience and achievements
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={saveExperiences}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                Save Changes
              </button>
              <Link
                to="/builder/classic"
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Continue to Builder
              </Link>
            </div>
          </div>

          {/* Experience Entries */}
          <div className="space-y-8">
            {experiences.map((experience, index) => (
              <div key={experience.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Experience #{index + 1}
                  </h3>
                  {experiences.length > 1 && (
                    <button
                      onClick={() => removeExperience(experience.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      value={experience.position}
                      onChange={(e) => updateExperience(experience.id, 'position', e.target.value)}
                      placeholder="e.g. Senior Software Engineer"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company *
                    </label>
                    <input
                      type="text"
                      value={experience.company}
                      onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
                      placeholder="e.g. Google, Microsoft, Startup Inc."
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="month"
                      value={experience.startDate}
                      onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date
                    </label>
                    <div className="space-y-2">
                      <input
                        type="month"
                        value={experience.endDate}
                        onChange={(e) => updateExperience(experience.id, 'endDate', e.target.value)}
                        disabled={experience.current}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors disabled:opacity-50"
                      />
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={experience.current}
                          onChange={(e) => {
                            updateExperience(experience.id, 'current', e.target.checked);
                            if (e.target.checked) {
                              updateExperience(experience.id, 'endDate', '');
                            }
                          }}
                          className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          I currently work here
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Job Description & Achievements *
                  </label>
                  <textarea
                    value={experience.description}
                    onChange={(e) => updateExperience(experience.id, 'description', e.target.value)}
                    placeholder="• Led a team of 5 developers to build a new product feature&#10;• Increased system performance by 40% through optimization&#10;• Implemented CI/CD pipeline reducing deployment time by 60%"
                    rows={6}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors resize-none"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Use bullet points (•) to highlight key achievements. Focus on quantifiable results and impact.
                  </p>
                </div>
              </div>
            ))}

            {/* Add Experience Button */}
            <button
              onClick={addExperience}
              className="w-full py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Another Experience</span>
            </button>
          </div>

          {/* Tips Section */}
          <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              💡 Tips for Writing Great Experience Descriptions
            </h3>
            <ul className="space-y-2 text-blue-800 dark:text-blue-200 text-sm">
              <li>• Start each bullet point with an action verb (Led, Developed, Implemented, Increased)</li>
              <li>• Include specific numbers and metrics when possible (40% improvement, $2M revenue)</li>
              <li>• Focus on achievements and impact, not just job duties</li>
              <li>• Use keywords relevant to your target job</li>
              <li>• Keep descriptions concise but informative (2-4 bullet points per role)</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExperienceBuilder;