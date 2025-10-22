import React, { useState } from 'react';
import { GripVertical, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

interface Section {
  id: string;
  name: string;
  type: 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'custom';
  visible: boolean;
  order: number;
}

interface DraggableSectionManagerProps {
  sections: Section[];
  onReorder: (sections: Section[]) => void;
  onToggleVisibility: (sectionId: string) => void;
  className?: string;
}

const DraggableSectionManager: React.FC<DraggableSectionManagerProps> = ({
  sections,
  onReorder,
  onToggleVisibility,
  className = ''
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newSections = [...sections];
    const [draggedItem] = newSections.splice(draggedIndex, 1);
    newSections.splice(dropIndex, 0, draggedItem);

    // Update order property
    const reorderedSections = newSections.map((section, index) => ({
      ...section,
      order: index
    }));

    onReorder(reorderedSections);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const getSectionIcon = (type: Section['type']) => {
    switch (type) {
      case 'personal':
        return '👤';
      case 'summary':
        return '📝';
      case 'experience':
        return '💼';
      case 'education':
        return '🎓';
      case 'skills':
        return '⚡';
      case 'projects':
        return '🚀';
      case 'certifications':
        return '🏆';
      case 'custom':
        return '✨';
      default:
        return '📄';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Resume Sections
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Drag to reorder
        </span>
      </div>

      {sections.map((section, index) => (
        <div
          key={section.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          className={`
            group relative flex items-center gap-3 p-4 rounded-lg border-2 transition-all cursor-move
            ${draggedIndex === index ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
            ${dragOverIndex === index ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : ''}
            ${section.visible 
              ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-600' 
              : 'bg-gray-100 dark:bg-gray-900/50 border-gray-300 dark:border-gray-800 opacity-60'}
            hover:shadow-md
          `}
        >
          {/* Drag Handle */}
          <div className="flex-shrink-0 cursor-grab active:cursor-grabbing">
            <GripVertical className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" />
          </div>

          {/* Section Icon & Name */}
          <div className="flex-1 flex items-center gap-3">
            <span className="text-2xl">{getSectionIcon(section.type)}</span>
            <div>
              <h4 className={`font-medium ${
                section.visible 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-500 dark:text-gray-600'
              }`}>
                {section.name}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {section.type.charAt(0).toUpperCase() + section.type.slice(1)} section
              </p>
            </div>
          </div>

          {/* Order Badge */}
          <div className="flex-shrink-0">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-semibold">
              {index + 1}
            </span>
          </div>

          {/* Toggle Visibility Button */}
          <button
            onClick={() => onToggleVisibility(section.id)}
            className={`
              flex-shrink-0 p-2 rounded-lg transition-colors
              ${section.visible
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
              }
            `}
            title={section.visible ? 'Hide section' : 'Show section'}
          >
            {section.visible ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
          </button>

          {/* Drag Indicator */}
          {dragOverIndex === index && (
            <div className="absolute inset-0 border-2 border-dashed border-indigo-500 rounded-lg pointer-events-none" />
          )}
        </div>
      ))}

      {/* Help Text */}
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>💡 Tip:</strong> Drag and drop sections to change their order in your resume. 
          Click the eye icon to show/hide sections.
        </p>
      </div>
    </div>
  );
};

export default DraggableSectionManager;
