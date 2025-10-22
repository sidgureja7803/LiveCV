import React, { useState } from 'react';
import { Download, Save, Eye, FileText, Settings, List } from 'lucide-react';
import DraggableSectionManager from './DraggableSectionManager';

interface Section {
  id: string;
  name: string;
  type: 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'custom';
  visible: boolean;
  order: number;
}

interface ResumeToolbarProps {
  onDownload: () => void;
  onSave: (generatePdf?: boolean) => void;
  downloading?: boolean;
  saving?: boolean;
  sections: Section[];
  onReorderSections: (sections: Section[]) => void;
  onToggleSectionVisibility: (sectionId: string) => void;
}

const ResumeToolbar: React.FC<ResumeToolbarProps> = ({
  onDownload,
  onSave,
  downloading = false,
  saving = false,
  sections,
  onReorderSections,
  onToggleSectionVisibility
}) => {
  const [showSectionManager, setShowSectionManager] = useState(false);

  return (
    <>
      {/* Main Toolbar */}
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left Side - Info */}
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Resume Editor
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Auto-saves as you type
              </p>
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center space-x-3">
            {/* Section Manager Button */}
            <button
              onClick={() => setShowSectionManager(!showSectionManager)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105
                ${showSectionManager
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }
              `}
            >
              <List className="w-5 h-5" />
              <span className="hidden md:inline">Manage Sections</span>
            </button>

            {/* Save Button */}
            <button
              onClick={() => onSave(false)}
              disabled={saving}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all"
            >
              <Save className={`w-5 h-5 ${saving ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">
                {saving ? 'Saving...' : 'Save'}
              </span>
            </button>
            
            {/* Save with PDF Button */}
            <button
              onClick={() => onSave(true)}
              disabled={saving}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all"
            >
              <FileText className={`w-5 h-5 ${saving ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">
                {saving ? 'Processing...' : 'Save & Generate PDF'}
              </span>
              <span className="md:hidden">PDF</span>
            </button>

            {/* Download Button - PROMINENT */}
            <button
              onClick={onDownload}
              disabled={downloading}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Download className={`w-5 h-5 ${downloading ? 'animate-bounce' : ''}`} />
              <span>
                {downloading ? 'Downloading...' : 'Download PDF'}
              </span>
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="px-6 py-2 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600 dark:text-gray-400">Live Preview Active</span>
              </span>
              <span className="text-gray-400 dark:text-gray-500">•</span>
              <span className="text-gray-600 dark:text-gray-400">
                {sections.filter(s => s.visible).length} of {sections.length} sections visible
              </span>
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              Press <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl+S</kbd> to save
            </div>
          </div>
        </div>
      </div>

      {/* Section Manager Sidebar */}
      {showSectionManager && (
        <div className="fixed inset-0 z-40 flex items-start justify-end pt-16 bg-black/30 backdrop-blur-sm">
          <div 
            className="absolute inset-0" 
            onClick={() => setShowSectionManager(false)}
          />
          <div className="relative w-full max-w-md h-full bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Manage Resume Sections
                </h3>
                <button
                  onClick={() => setShowSectionManager(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <DraggableSectionManager
                sections={sections}
                onReorder={onReorderSections}
                onToggleVisibility={onToggleSectionVisibility}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResumeToolbar;
