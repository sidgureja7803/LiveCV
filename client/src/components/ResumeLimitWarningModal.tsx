import React from 'react';
import { AlertTriangle, Download, X } from 'lucide-react';

interface OldestResume {
  id: string;
  name: string;
  lastUpdated: string;
}

interface ResumeLimitWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  oldestResume: OldestResume | null;
  onDownload?: () => void;
}

const ResumeLimitWarningModal: React.FC<ResumeLimitWarningModalProps> = ({
  isOpen,
  onClose,
  onContinue,
  oldestResume,
  onDownload
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-white">Resume Limit Reached</h3>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            You've reached the maximum limit of <strong>5 resumes</strong>. To create a new resume, 
            your oldest resume will be automatically deleted.
          </p>

          {oldestResume && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-red-900 dark:text-red-300 mb-2">
                Resume to be deleted:
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-900 dark:text-red-200">{oldestResume.name}</p>
                  <p className="text-xs text-red-700 dark:text-red-400">
                    Last updated: {new Date(oldestResume.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
                {onDownload && (
                  <button
                    onClick={onDownload}
                    className="flex items-center gap-1 text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors"
                    title="Download before deletion"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900 dark:text-blue-300">
              <strong>Tip:</strong> Consider downloading your oldest resume before continuing if you want to keep a copy.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onContinue}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeLimitWarningModal;
