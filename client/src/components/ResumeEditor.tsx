import React, { useState } from 'react';
import type { ResumeData } from '../types/index';
import LiveCoding from './LiveCoding';

interface ResumeEditorProps {
  resumeData: ResumeData;
  onResumeChange: (data: ResumeData) => void;
  previewHtml: string;
}

const ResumeEditor: React.FC<ResumeEditorProps> = ({ resumeData, onResumeChange, previewHtml }) => {
  const [activeTab, setActiveTab] = useState('personalInfo');

  const handleFieldChange = (field: string, value: any, section?: string, index?: number) => {
    const newData = { ...resumeData };
    
    if (section && index !== undefined) {
      (newData[section as keyof ResumeData] as any)[index] = {
        ...(newData[section as keyof ResumeData] as any)[index],
        [field]: value
      };
    } else if (section) {
      (newData[section as keyof ResumeData] as any)[field] = value;
    } else {
      (newData as any)[field] = value;
    }
    
    onResumeChange(newData);
  };
  
  const addExperienceEntry = () => {
    const newEntry = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    onResumeChange({ ...resumeData, experience: [...resumeData.experience, newEntry] });
  };
  
  const removeExperienceEntry = (index: number) => {
    const newExperience = resumeData.experience.filter((_, i) => i !== index);
    onResumeChange({ ...resumeData, experience: newExperience });
  };
  
  const addEducationEntry = () => {
    const newEntry = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    onResumeChange({ ...resumeData, education: [...resumeData.education, newEntry] });
  };
  
  const removeEducationEntry = (index: number) => {
    const newEducation = resumeData.education.filter((_, i) => i !== index);
    onResumeChange({ ...resumeData, education: newEducation });
  };
  
  const addProjectEntry = () => {
    const newEntry = {
        id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      githubLink: '',
      liveLink: ''
    };
    const projects = resumeData.projects || [];
    onResumeChange({ ...resumeData, projects: [...projects, newEntry] });
  };

  const removeProjectEntry = (index: number) => {
    const newProjects = (resumeData.projects || []).filter((_, i) => i !== index);
    onResumeChange({ ...resumeData, projects: newProjects });
  };


  const tabs = [
    { id: 'personalInfo', label: 'Personal Info' },
    { id: 'summary', label: 'Summary' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
  ];

  return (
    <div>
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Resume Editor</h2>
            <p className="text-gray-400">Fill in your details below.</p>
        </div>
        
        <div className="flex border-b border-gray-700 mb-6">
            {tabs.map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                    ? 'border-b-2 border-indigo-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
            >
                {tab.label}
              </button>
            ))}
        </div>
        
        <div>
            {activeTab === 'personalInfo' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Full Name" value={resumeData.personalInfo.fullName} onChange={(e) => handleFieldChange('fullName', e.target.value, 'personalInfo')} className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white" />
                    <input type="email" placeholder="Email" value={resumeData.personalInfo.email} onChange={(e) => handleFieldChange('email', e.target.value, 'personalInfo')} className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white" />
                    <input type="tel" placeholder="Phone" value={resumeData.personalInfo.phone} onChange={(e) => handleFieldChange('phone', e.target.value, 'personalInfo')} className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white" />
                    <input type="text" placeholder="Address" value={resumeData.personalInfo.address} onChange={(e) => handleFieldChange('address', e.target.value, 'personalInfo')} className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white" />
                    <input type="text" placeholder="LinkedIn Profile" value={resumeData.personalInfo.linkedIn || ''} onChange={(e) => handleFieldChange('linkedIn', e.target.value, 'personalInfo')} className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white" />
                    <input type="text" placeholder="GitHub Profile" value={resumeData.personalInfo.github || ''} onChange={(e) => handleFieldChange('github', e.target.value, 'personalInfo')} className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white" />
          </div>
            )}
            {activeTab === 'summary' && (
                <textarea placeholder="Write a brief professional summary..." value={resumeData.summary} onChange={(e) => handleFieldChange('summary', e.target.value)} rows={5} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white" />
            )}
            {activeTab === 'skills' && (
                <input type="text" placeholder="Enter skills separated by commas" value={resumeData.skills.join(', ')} onChange={(e) => handleFieldChange('skills', e.target.value.split(',').map(s => s.trim()))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white" />
            )}
            {activeTab === 'experience' && (
                <div>
                    {resumeData.experience.map((exp, index) => (
                        <div key={exp.id} className="mb-4 p-4 bg-gray-800 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <input type="text" placeholder="Position" value={exp.position} onChange={(e) => handleFieldChange('position', e.target.value, 'experience', index)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white" />
                                <input type="text" placeholder="Company" value={exp.company} onChange={(e) => handleFieldChange('company', e.target.value, 'experience', index)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white" />
                                <input type="month" placeholder="Start Date" value={exp.startDate} onChange={(e) => handleFieldChange('startDate', e.target.value, 'experience', index)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white" />
                                <input type="month" placeholder="End Date" value={exp.endDate} onChange={(e) => handleFieldChange('endDate', e.target.value, 'experience', index)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white" />
                            </div>
                            <textarea placeholder="Description..." value={exp.description} onChange={(e) => handleFieldChange('description', e.target.value, 'experience', index)} rows={3} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white" />
                            <button onClick={() => removeExperienceEntry(index)} className="text-red-500 hover:text-red-400 mt-2">Remove</button>
              </div>
                    ))}
                    <button onClick={addExperienceEntry} className="text-indigo-400 hover:text-indigo-300">Add Experience</button>
            </div>
            )}
             {activeTab === 'education' && (
                <div>
                    {resumeData.education.map((edu, index) => (
                        <div key={edu.id} className="mb-4 p-4 bg-gray-800 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <input type="text" placeholder="Institution" value={edu.institution} onChange={(e) => handleFieldChange('institution', e.target.value, 'education', index)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white" />
                                <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => handleFieldChange('degree', e.target.value, 'education', index)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white" />
                                <input type="text" placeholder="Field of Study" value={edu.fieldOfStudy} onChange={(e) => handleFieldChange('fieldOfStudy', e.target.value, 'education', index)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white" />
                                <input type="month" placeholder="End Date" value={edu.endDate} onChange={(e) => handleFieldChange('endDate', e.target.value, 'education', index)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white" />
      </div>
                            <input type="text" placeholder="GPA" value={edu.gpa || ''} onChange={(e) => handleFieldChange('gpa', e.target.value, 'education', index)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white" />
                            <button onClick={() => removeEducationEntry(index)} className="text-red-500 hover:text-red-400 mt-2">Remove</button>
        </div>
                    ))}
                    <button onClick={addEducationEntry} className="text-indigo-400 hover:text-indigo-300">Add Education</button>
          </div>
            )}
            {activeTab === 'projects' && (
                <div>
                    {(resumeData.projects || []).map((project, index) => (
                        <div key={project.id} className="mb-4 p-4 bg-gray-800 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <input type="text" placeholder="Project Name" value={project.name} onChange={(e) => handleFieldChange('name', e.target.value, 'projects', index)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white" />
                                <input type="text" placeholder="Technologies (comma-separated)" value={project.technologies.join(', ')} onChange={(e) => handleFieldChange('technologies', e.target.value.split(',').map(s => s.trim()), 'projects', index)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white" />
              </div>
                            <textarea placeholder="Description..." value={project.description} onChange={(e) => handleFieldChange('description', e.target.value, 'projects', index)} rows={3} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white" />
                            <button onClick={() => removeProjectEntry(index)} className="text-red-500 hover:text-red-400 mt-2">Remove</button>
              </div>
                    ))}
                    <button onClick={addProjectEntry} className="text-indigo-400 hover:text-indigo-300">Add Project</button>
      </div>
            )}
      </div>
    </div>
  );
};

export default ResumeEditor;