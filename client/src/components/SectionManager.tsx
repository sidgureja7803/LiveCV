import React, { useState } from 'react';
import { Plus, GripVertical, Eye, EyeOff, X } from 'lucide-react';

export interface Section {
  id: string;
  name: string;
  type: 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'custom';
  visible: boolean;
  order: number;
}

interface SectionManagerProps {
  sections: Section[];
  onReorder: (sections: Section[]) => void;
  onToggleVisibility: (sectionId: string) => void;
  onAddSection: (sectionType: string) => void;
  onRemoveSection: (sectionId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const SectionManager: React.FC<SectionManagerProps> = ({
  sections,
  onReorder,
  onToggleVisibility,
  onAddSection,
  onRemoveSection,
  isOpen,
  onClose
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newSections = [...sections];
    const draggedSection = newSections[draggedIndex];
    newSections.splice(draggedIndex, 1);
    newSections.splice(index, 0, draggedSection);

    // Update order
    const reorderedSections = newSections.map((section, idx) => ({
      ...section,
      order: idx
    }));

    onReorder(reorderedSections);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const availableSectionTypes = [
    { type: 'summary', label: 'Professional Summary' },
    { type: 'experience', label: 'Work Experience' },
    { type: 'education', label: 'Education' },
    { type: 'skills', label: 'Skills' },
    { type: 'projects', label: 'Projects' },
    { type: 'certifications', label: 'Certifications' },
  ];

  const existingTypes = sections.map(s => s.type);
  const availableToAdd = availableSectionTypes.filter(
    s => !existingTypes.includes(s.type as any)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage Sections
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          {/* Current Sections */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Current Sections
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Drag to reorder, toggle visibility, or remove sections
            </p>

            <div className="space-y-2">
              {sections
                .sort((a, b) => a.order - b.order)
                .map((section, index) => (
                  <div
                    key={section.id}
                    draggable={section.type !== 'personal'}
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 ${
                      draggedIndex === index
                        ? 'border-indigo-500 opacity-50'
                        : 'border-transparent'
                    } ${
                      section.type !== 'personal' ? 'cursor-move' : 'cursor-default'
                    }`}
                  >
                    {/* Drag Handle */}
                    {section.type !== 'personal' ? (
                      <GripVertical className="w-5 h-5 text-gray-400" />
                    ) : (
                      <div className="w-5" />
                    )}

                    {/* Section Name */}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {section.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {section.type}
                      </p>
                    </div>

                    {/* Visibility Toggle */}
                    <button
                      onClick={() => onToggleVisibility(section.id)}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      title={section.visible ? 'Hide section' : 'Show section'}
                    >
                      {section.visible ? (
                        <Eye className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      ) : (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    {/* Remove Button (except for required sections) */}
                    {section.type !== 'personal' && (
                      <button
                        onClick={() => onRemoveSection(section.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Remove section"
                      >
                        <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Add New Section */}
          {availableToAdd.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Add Section
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {availableToAdd.map(({ type, label }) => (
                  <button
                    key={type}
                    onClick={() => {
                      onAddSection(type);
                      onClose();
                    }}
                    className="flex items-center space-x-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg transition-colors text-left"
                  >
                    <Plus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-sm font-medium text-indigo-900 dark:text-indigo-300">
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionManager;
