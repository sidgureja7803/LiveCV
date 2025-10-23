import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RESUME_TEMPLATES } from "../config/templates";
import type { ResumeTemplate } from "../types/templates";
import Modal from "../components/Modal";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import LoadingOverlay from "../components/LoadingOverlay";
import { Moon, Sun } from "lucide-react";

// Using image previews for better reliability and performance

const TemplateSelector: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [previewTemplate, setPreviewTemplate] = useState<ResumeTemplate | null>(
    null
  );
  const [selectedTemplate, setSelectedTemplate] =
    useState<ResumeTemplate | null>(null);
  const [templateSelectionStep, setTemplateSelectionStep] = useState(1);
  const [isNavigating, setIsNavigating] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = "Select Resume Template | LiveCV";
  }, []);

  const categories = [
    { id: "all", name: "All Templates", count: RESUME_TEMPLATES.length },
    {
      id: "modern",
      name: "Modern",
      count: RESUME_TEMPLATES.filter((t) => t.category === "modern").length,
    },
    {
      id: "professional",
      name: "Professional",
      count: RESUME_TEMPLATES.filter((t) => t.category === "professional")
        .length,
    },
    {
      id: "creative",
      name: "Creative",
      count: RESUME_TEMPLATES.filter((t) => t.category === "creative").length,
    },
  ];

  const filteredTemplates =
    selectedCategory === "all"
      ? RESUME_TEMPLATES
      : RESUME_TEMPLATES.filter(
          (template) => template.category === selectedCategory
        );

  const openPreview = (template: ResumeTemplate) => {
    setPreviewTemplate(template);
  };

  const closePreview = () => {
    setPreviewTemplate(null);
  };

  const selectTemplate = async (template: ResumeTemplate) => {
    setSelectedTemplate(template);
    setTemplateSelectionStep(2);

    // Load the YAML file for this template
    try {
      const yamlFileName = template.pdfPreview?.replace(".pdf", ".yaml");
      if (yamlFileName) {
        const response = await fetch(yamlFileName);
        if (response.ok) {
          const yamlContent = await response.text();
          // Store in localStorage for the builder to use
          localStorage.setItem("selectedTemplateYaml", yamlContent);
          localStorage.setItem("selectedTemplateTheme", template.id);
          console.log("✅ Loaded template YAML:", template.name);
        }
      }
    } catch (error) {
      console.error("Failed to load template YAML:", error);
    }
  };

  const startEditingTemplate = () => {
    if (selectedTemplate) {
      setIsNavigating(true);
      // Small delay to ensure the loading state is shown before navigation
      setTimeout(() => {
        navigate(`/builder/${selectedTemplate.id}`);
      }, 500);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Loading Overlay */}
        <LoadingOverlay
          isLoading={isNavigating}
          message="Preparing Your Resume Builder"
        />

        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Resume Templates
            </h1>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-600"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Progress steps */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <ol className="flex items-center justify-center max-w-3xl mx-auto">
              <li
                className={`flex items-center ${
                  templateSelectionStep >= 1
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    templateSelectionStep >= 1
                      ? "border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30"
                      : "border-gray-500 dark:border-gray-600"
                  }`}
                >
                  1
                </span>
                <span className="ml-2 text-sm font-medium">
                  Choose Template
                </span>
              </li>
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  templateSelectionStep >= 2
                    ? "bg-indigo-600 dark:bg-indigo-400"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              ></div>
              <li
                className={`flex items-center ${
                  templateSelectionStep >= 2
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    templateSelectionStep >= 2
                      ? "border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30"
                      : "border-gray-500 dark:border-gray-600"
                  }`}
                >
                  2
                </span>
                <span className="ml-2 text-sm font-medium">
                  Customize Resume
                </span>
              </li>
              <div className="flex-1 h-0.5 mx-4 bg-gray-300 dark:bg-gray-600"></div>
              <li className="flex items-center text-gray-500 dark:text-gray-400">
                <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-500 dark:border-gray-600">
                  3
                </span>
                <span className="ml-2 text-sm font-medium">
                  Download & Share
                </span>
              </li>
            </ol>
          </div>

          {/* Content */}
          {templateSelectionStep === 1 ? (
            /* Step 1: Template Selection */
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 dark:text-white mb-4">
                  Choose Your Resume Template
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Select one of our professional templates. All are
                  ATS-optimized with real-time preview and job matching
                  features.
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                      selectedCategory === category.id
                        ? "bg-indigo-600 text-white shadow-lg dark:bg-indigo-700"
                        : "bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <span>{category.name}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        selectedCategory === category.id
                          ? "bg-white/20 text-white"
                          : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Template Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer ${
                      selectedTemplate?.id === template.id
                        ? "ring-4 ring-indigo-600 dark:ring-indigo-400"
                        : ""
                    }`}
                    onClick={() => selectTemplate(template)}
                  >
                    {/* Template Preview */}
                    <div
                      className="relative bg-white dark:bg-gray-900 overflow-hidden"
                      style={{ height: "400px" }}
                    >
                      <img
                        src={template.thumbnail}
                        alt={`${template.name} template`}
                        className="w-full h-full object-contain p-4"
                        onError={(e) => {
                          console.error(
                            "Failed to load template image:",
                            template.thumbnail
                          );
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/300x400?text=Template+Preview";
                        }}
                      />
                      {selectedTemplate?.id === template.id && (
                        <div className="absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Selected
                        </div>
                      )}
                    </div>

                    {/* Template Info */}
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
                          {template.name}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${
                            template.category === "modern"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                              : template.category === "professional"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                              : template.category === "creative"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                          }`}
                        >
                          {template.category}
                        </span>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 h-10 overflow-hidden">
                        {template.description}
                      </p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {template.features.slice(0, 2).map((feature, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded font-medium"
                          >
                            {feature}
                          </span>
                        ))}
                        {template.features.length > 2 && (
                          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded font-medium">
                            +{template.features.length - 2} more
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-3">
                        <button
                          onClick={() => selectTemplate(template)}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white text-center text-sm px-4 py-2.5 rounded-lg font-medium transition-colors"
                        >
                          Select Template
                        </button>
                        <button
                          onClick={() => openPreview(template)}
                          className="bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm px-4 py-2.5 rounded-lg font-medium transition-colors"
                        >
                          Preview
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Step 2: Template Confirmation */
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Ready to Start Building Your Resume
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    You've selected the {selectedTemplate?.name} template.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8 border dark:border-gray-700">
                  <div className="aspect-w-4 aspect-h-3 bg-gray-50 dark:bg-gray-900 overflow-hidden">
                    <img
                      src={selectedTemplate?.thumbnail}
                      alt={`${selectedTemplate?.name} template`}
                      className="object-contain w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/600x400?text=Template+Preview";
                      }}
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {selectedTemplate?.name}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                          {selectedTemplate?.description}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1.5 text-sm rounded-full font-medium ${
                          selectedTemplate?.category === "modern"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                            : selectedTemplate?.category === "professional"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                            : selectedTemplate?.category === "creative"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                        }`}
                      >
                        {selectedTemplate?.category}
                      </span>
                    </div>

                    {/* Features */}
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Features
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedTemplate?.features.map((feature, index) => (
                        <span
                          key={index}
                          className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Recommended for */}
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Perfect for
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {selectedTemplate?.recommended.map((item, index) => (
                        <span
                          key={index}
                          className="text-sm bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 px-3 py-1 rounded font-medium"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                      <button
                        onClick={startEditingTemplate}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white text-center px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        <span>Start Building Your Resume</span>
                      </button>
                      <button
                        onClick={() => setTemplateSelectionStep(1)}
                        className="bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        <span>Change Template</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-lg p-4 text-sm text-yellow-800 dark:text-yellow-300">
                  <div className="flex">
                    <svg
                      className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p>
                      <strong>Tip:</strong> Our templates are all ATS-optimized,
                      but remember that clean, well-structured content matters
                      most for getting past Applicant Tracking Systems.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preview Modal */}
          <Modal
            isOpen={!!previewTemplate}
            onClose={closePreview}
            closeOnOverlayClick={true}
          >
            {previewTemplate && (
              <div className="p-8 dark:bg-gray-800">
                <div className="mb-4">
                  <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                    {previewTemplate.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {previewTemplate.description}
                  </p>
                </div>

                <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg mb-6 min-h-[500px] flex flex-col items-center justify-center">
                  <div className="text-center">
                    <img
                      src={previewTemplate.thumbnail}
                      alt={`${previewTemplate.name} template`}
                      className="max-w-full max-h-[600px] mx-auto shadow-xl rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/600x800?text=Template+Preview";
                      }}
                    />
                    <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm">
                      Template Preview
                    </p>
                  </div>
                </div>

                <div className="mt-2 flex space-x-4">
                  <button
                    onClick={() => {
                      closePreview();
                      selectTemplate(previewTemplate);
                    }}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white text-center px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Use This Template
                  </button>
                  <button
                    onClick={closePreview}
                    className="bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default TemplateSelector;
