import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, GraduationCap } from 'lucide-react';
import Sidebar from '../components/Sidebar';

interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
  relevantCoursework?: string;
}

const EducationBuilder: React.FC = () => {
  const [educations, setEducations] = useState<EducationEntry[]>([
    {
      id: '1',
      institution: 'University of Technology',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2016-09',
      endDate: '2020-05',
      gpa: '3.8'
    }
  ]);

  const addEducation = () => {
    const newEducation: EducationEntry = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    setEducations([...educations, newEducation]);
  };

  const removeEducation = (id: string) => {
    setEducations(educations.filter(edu => edu.id !== id));
  };

  const updateEducation = (id: string, field: keyof EducationEntry, value: string) => {
    setEducations(educations.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const saveEducations = () => {
    localStorage.setItem('resumeEducations', JSON.stringify(educations));
    alert('Education data saved successfully!');
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
                  <GraduationCap className="w-8 h-8 mr-3 text-indigo-600" />
                  Education
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Add your educational background and academic achievements
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={saveEducations}
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

          {/* Education Entries */}
          <div className="space-y-8">
            {educations.map((education, index) => (
              <div key={education.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Education #{index + 1}
                  </h3>
                  {educations.length > 1 && (
                    <button
                      onClick={() => removeEducation(education.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Institution *
                    </label>
                    <input
                      type="text"
                      value={education.institution}
                      onChange={(e) => updateEducation(education.id, 'institution', e.target.value)}
                      placeholder="e.g. Harvard University, MIT, Stanford"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Degree *
                    </label>
                    <input
                      type="text"
                      value={education.degree}
                      onChange={(e) => updateEducation(education.id, 'degree', e.target.value)}
                      placeholder="e.g. Bachelor of Science, Master of Arts"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Field of Study *
                    </label>
                    <input
                      type="text"
                      value={education.fieldOfStudy}
                      onChange={(e) => updateEducation(education.id, 'fieldOfStudy', e.target.value)}
                      placeholder="e.g. Computer Science, Business Administration"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      GPA (Optional)
                    </label>
                    <input
                      type="text"
                      value={education.gpa || ''}
                      onChange={(e) => updateEducation(education.id, 'gpa', e.target.value)}
                      placeholder="e.g. 3.8, 3.9/4.0"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="month"
                      value={education.startDate}
                      onChange={(e) => updateEducation(education.id, 'startDate', e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Graduation Date *
                    </label>
                    <input
                      type="month"
                      value={education.endDate}
                      onChange={(e) => updateEducation(education.id, 'endDate', e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Honors & Awards (Optional)
                  </label>
                  <input
                    type="text"
                    value={education.honors || ''}
                    onChange={(e) => updateEducation(education.id, 'honors', e.target.value)}
                    placeholder="e.g. Magna Cum Laude, Dean's List, Phi Beta Kappa"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Relevant Coursework (Optional)
                  </label>
                  <textarea
                    value={education.relevantCoursework || ''}
                    onChange={(e) => updateEducation(education.id, 'relevantCoursework', e.target.value)}
                    placeholder="e.g. Data Structures, Algorithms, Machine Learning, Database Systems"
                    rows={3}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors resize-none"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    List relevant courses separated by commas. Focus on courses related to your target job.
                  </p>
                </div>
              </div>
            ))}

            {/* Add Education Button */}
            <button
              onClick={addEducation}
              className="w-full py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Another Education</span>
            </button>
          </div>

          {/* Tips Section */}
          <div className="mt-12 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
              🎓 Education Section Tips
            </h3>
            <ul className="space-y-2 text-green-800 dark:text-green-200 text-sm">
              <li>• List your most recent/highest degree first</li>
              <li>• Include GPA only if it's 3.5 or higher</li>
              <li>• Add relevant coursework if you're a recent graduate or changing careers</li>
              <li>• Include honors, awards, and academic achievements</li>
              <li>• For multiple degrees, list them in reverse chronological order</li>
              <li>• Consider adding certifications in a separate section</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EducationBuilder;