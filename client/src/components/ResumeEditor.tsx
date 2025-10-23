import React, { useState } from "react";
import type { ResumeData } from "../types/index";

interface Section {
  id: string;
  name: string;
  type:
    | "personal"
    | "summary"
    | "experience"
    | "education"
    | "skills"
    | "projects"
    | "certifications"
    | "custom";
  visible: boolean;
  order: number;
}

interface ResumeEditorProps {
  resumeData: ResumeData;
  onResumeChange: (data: ResumeData) => void;
  previewHtml: string;
  sections?: Section[];
}

const ResumeEditor: React.FC<ResumeEditorProps> = ({
  resumeData,
  onResumeChange,
  previewHtml,
  sections,
}) => {
  const [activeTab, setActiveTab] = useState("personalInfo");

  const handleFieldChange = (
    field: string,
    value: any,
    section?: string,
    index?: number
  ) => {
    const newData = { ...resumeData };

    if (section && index !== undefined) {
      (newData[section as keyof ResumeData] as any)[index] = {
        ...(newData[section as keyof ResumeData] as any)[index],
        [field]: value,
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
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    onResumeChange({
      ...resumeData,
      experience: [...resumeData.experience, newEntry],
    });
  };

  const removeExperienceEntry = (index: number) => {
    const newExperience = resumeData.experience.filter((_, i) => i !== index);
    onResumeChange({ ...resumeData, experience: newExperience });
  };

  const addEducationEntry = () => {
    const newEntry = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      gpa: "",
    };
    onResumeChange({
      ...resumeData,
      education: [...resumeData.education, newEntry],
    });
  };

  const removeEducationEntry = (index: number) => {
    const newEducation = resumeData.education.filter((_, i) => i !== index);
    onResumeChange({ ...resumeData, education: newEducation });
  };

  const addProjectEntry = () => {
    const newEntry = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: [],
      githubLink: "",
      liveLink: "",
    };
    const projects = resumeData.projects || [];
    onResumeChange({ ...resumeData, projects: [...projects, newEntry] });
  };

  const removeProjectEntry = (index: number) => {
    const newProjects = (resumeData.projects || []).filter(
      (_, i) => i !== index
    );
    onResumeChange({ ...resumeData, projects: newProjects });
  };

  // Use sections prop if provided, otherwise fall back to default tabs
  const defaultTabs = [
    { id: "personalInfo", label: "Personal Info", type: "personal" as const },
    { id: "summary", label: "Summary", type: "summary" as const },
    { id: "experience", label: "Experience", type: "experience" as const },
    { id: "education", label: "Education", type: "education" as const },
    { id: "projects", label: "Projects", type: "projects" as const },
    { id: "skills", label: "Skills", type: "skills" as const },
  ];

  const tabs = sections
    ? sections
        .filter((section) => section.visible)
        .sort((a, b) => a.order - b.order)
        .map((section) => ({
          id: section.type === "personal" ? "personalInfo" : section.type,
          label: section.name,
          type: section.type,
        }))
    : defaultTabs;

  return (
    <div className="h-full flex flex-col">
      {/* Tabs - Fixed */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "personalInfo" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={resumeData.personalInfo.fullName}
                  onChange={(e) =>
                    handleFieldChange(
                      "fullName",
                      e.target.value,
                      "personalInfo"
                    )
                  }
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={resumeData.personalInfo.email}
                  onChange={(e) =>
                    handleFieldChange("email", e.target.value, "personalInfo")
                  }
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={resumeData.personalInfo.phone}
                  onChange={(e) =>
                    handleFieldChange("phone", e.target.value, "personalInfo")
                  }
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="New York, NY"
                  value={resumeData.personalInfo.address}
                  onChange={(e) =>
                    handleFieldChange("address", e.target.value, "personalInfo")
                  }
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  LinkedIn Profile
                </label>
                <input
                  type="text"
                  placeholder="linkedin.com/in/johndoe"
                  value={resumeData.personalInfo.linkedIn || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "linkedIn",
                      e.target.value,
                      "personalInfo"
                    )
                  }
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  GitHub Profile
                </label>
                <input
                  type="text"
                  placeholder="github.com/johndoe"
                  value={resumeData.personalInfo.github || ""}
                  onChange={(e) =>
                    handleFieldChange("github", e.target.value, "personalInfo")
                  }
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                />
              </div>
            </div>
          </div>
        )}
        {activeTab === "summary" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Professional Summary
              </label>
              <textarea
                placeholder="Write a brief professional summary highlighting your key skills and experience..."
                value={resumeData.summary}
                onChange={(e) => handleFieldChange("summary", e.target.value)}
                rows={6}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors resize-none"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Tip: Keep it concise (2-3 sentences) and focus on your most
                relevant achievements.
              </p>
            </div>
          </div>
        )}
        {activeTab === "skills" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Skills
              </label>
              <input
                type="text"
                placeholder="JavaScript, React, Node.js, Python, AWS..."
                value={resumeData.skills.join(", ")}
                onChange={(e) =>
                  handleFieldChange(
                    "skills",
                    e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s)
                  )
                }
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Separate skills with commas. Focus on relevant technical and
                soft skills.
              </p>
            </div>
            {resumeData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 text-sm rounded-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === "experience" && (
          <div className="space-y-6">
            {resumeData.experience.map((exp, index) => (
              <div
                key={exp.id}
                className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Experience #{index + 1}
                  </h3>
                  <button
                    onClick={() => removeExperienceEntry(index)}
                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Position
                      </label>
                      <input
                        type="text"
                        placeholder="Senior Software Engineer"
                        value={exp.position}
                        onChange={(e) =>
                          handleFieldChange(
                            "position",
                            e.target.value,
                            "experience",
                            index
                          )
                        }
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        placeholder="Tech Corp"
                        value={exp.company}
                        onChange={(e) =>
                          handleFieldChange(
                            "company",
                            e.target.value,
                            "experience",
                            index
                          )
                        }
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start Date
                      </label>
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) =>
                          handleFieldChange(
                            "startDate",
                            e.target.value,
                            "experience",
                            index
                          )
                        }
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        End Date
                      </label>
                      <input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) =>
                          handleFieldChange(
                            "endDate",
                            e.target.value,
                            "experience",
                            index
                          )
                        }
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      placeholder="Describe your key responsibilities and achievements..."
                      value={exp.description}
                      onChange={(e) =>
                        handleFieldChange(
                          "description",
                          e.target.value,
                          "experience",
                          index
                        )
                      }
                      rows={4}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors resize-none"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Use bullet points to highlight key achievements and
                      quantify results when possible.
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addExperienceEntry}
              className="w-full py-3 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              + Add Experience
            </button>
          </div>
        )}
        {activeTab === "education" && (
          <div className="space-y-6">
            {resumeData.education.map((edu, index) => (
              <div
                key={edu.id}
                className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Education #{index + 1}
                  </h3>
                  <button
                    onClick={() => removeEducationEntry(index)}
                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Institution
                      </label>
                      <input
                        type="text"
                        placeholder="University of Technology"
                        value={edu.institution}
                        onChange={(e) =>
                          handleFieldChange(
                            "institution",
                            e.target.value,
                            "education",
                            index
                          )
                        }
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Degree
                      </label>
                      <input
                        type="text"
                        placeholder="Bachelor of Science"
                        value={edu.degree}
                        onChange={(e) =>
                          handleFieldChange(
                            "degree",
                            e.target.value,
                            "education",
                            index
                          )
                        }
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Field of Study
                      </label>
                      <input
                        type="text"
                        placeholder="Computer Science"
                        value={edu.fieldOfStudy}
                        onChange={(e) =>
                          handleFieldChange(
                            "fieldOfStudy",
                            e.target.value,
                            "education",
                            index
                          )
                        }
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Graduation Date
                      </label>
                      <input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) =>
                          handleFieldChange(
                            "endDate",
                            e.target.value,
                            "education",
                            index
                          )
                        }
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      GPA (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="3.8"
                      value={edu.gpa || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          "gpa",
                          e.target.value,
                          "education",
                          index
                        )
                      }
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addEducationEntry}
              className="w-full py-3 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              + Add Education
            </button>
          </div>
        )}
        {activeTab === "projects" && (
          <div className="space-y-6">
            {(resumeData.projects || []).map((project, index) => (
              <div
                key={project.id}
                className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Project #{index + 1}
                  </h3>
                  <button
                    onClick={() => removeProjectEntry(index)}
                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Project Name
                      </label>
                      <input
                        type="text"
                        placeholder="E-commerce Platform"
                        value={project.name}
                        onChange={(e) =>
                          handleFieldChange(
                            "name",
                            e.target.value,
                            "projects",
                            index
                          )
                        }
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Technologies
                      </label>
                      <input
                        type="text"
                        placeholder="React, Node.js, MongoDB"
                        value={project.technologies.join(", ")}
                        onChange={(e) =>
                          handleFieldChange(
                            "technologies",
                            e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter((s) => s),
                            "projects",
                            index
                          )
                        }
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      placeholder="Describe the project, your role, and key achievements..."
                      value={project.description}
                      onChange={(e) =>
                        handleFieldChange(
                          "description",
                          e.target.value,
                          "projects",
                          index
                        )
                      }
                      rows={4}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        GitHub Link (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="github.com/username/project"
                        value={project.githubLink || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            "githubLink",
                            e.target.value,
                            "projects",
                            index
                          )
                        }
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Live Demo (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="example.com"
                        value={project.liveLink || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            "liveLink",
                            e.target.value,
                            "projects",
                            index
                          )
                        }
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                      />
                    </div>
                  </div>

                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <button
              onClick={addProjectEntry}
              className="w-full py-3 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              + Add Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeEditor;
