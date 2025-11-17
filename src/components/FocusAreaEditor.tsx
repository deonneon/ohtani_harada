import { useState, useEffect } from 'react';
import { type FocusArea, type CreateFocusAreaInput } from '../types';
import { useAutoSave, useAutoSaveIndicator } from '../utils';

interface FocusAreaEditorProps {
  /** Whether the editor is visible */
  isOpen: boolean;
  /** The current focus areas to edit */
  focusAreas: FocusArea[];
  /** The goal ID these areas belong to */
  goalId: string;
  /** Callback when areas are saved */
  onSave: (areas: CreateFocusAreaInput[]) => void;
  /** Callback when editor should be closed */
  onClose: () => void;
}

/**
 * Component for editing the 8 focus areas surrounding the central goal
 */
export const FocusAreaEditor: React.FC<FocusAreaEditorProps> = ({
  isOpen,
  focusAreas,
  goalId,
  onSave,
  onClose,
}) => {
  const [areas, setAreas] = useState<CreateFocusAreaInput[]>([]);
  const [errors, setErrors] = useState<
    Record<number, { title?: string; description?: string }>
  >({});

  // Auto-save functionality
  const autoSave = useAutoSave(areas, {
    storageKey: `focus-areas-editor-${goalId}`,
    delay: 2000, // Save after 2 seconds of inactivity
    enabled: isOpen,
  });
  const { saveStatus, saveStatusText } = useAutoSaveIndicator(autoSave);

  // Initialize areas when component opens or focusAreas change
  useEffect(() => {
    if (isOpen) {
      // Load from auto-saved draft or existing areas
      const savedData = autoSave.savedData;
      if (savedData && savedData.length === 8) {
        // Use saved draft
        setAreas(savedData);
      } else if (focusAreas.length === 8) {
        // Existing areas - convert to input format
        setAreas(
          focusAreas.map((area) => ({
            title: area.title,
            description: area.description,
          }))
        );
      } else {
        // Create empty areas (should be 8 total)
        setAreas(
          Array.from({ length: 8 }, () => ({ title: '', description: '' }))
        );
      }
      setErrors({});
    }
  }, [isOpen, focusAreas, autoSave.savedData]);

  // Update a specific area's field
  const updateArea = (
    index: number,
    field: 'title' | 'description',
    value: string
  ) => {
    setAreas((prev) =>
      prev.map((area, i) => (i === index ? { ...area, [field]: value } : area))
    );

    // Clear error for this field when user starts typing
    if (errors[index]?.[field]) {
      setErrors((prev) => ({
        ...prev,
        [index]: { ...prev[index], [field]: undefined },
      }));
    }
  };

  // Validate all areas
  const validateAreas = (): boolean => {
    const newErrors: Record<number, { title?: string; description?: string }> =
      {};
    let isValid = true;

    areas.forEach((area, index) => {
      const areaErrors: { title?: string; description?: string } = {};

      if (!area.title.trim()) {
        areaErrors.title = 'Focus area title is required';
        isValid = false;
      } else if (area.title.length > 50) {
        areaErrors.title = 'Title must be 50 characters or less';
        isValid = false;
      }

      if (!area.description.trim()) {
        areaErrors.description = 'Focus area description is required';
        isValid = false;
      } else if (area.description.length > 200) {
        areaErrors.description = 'Description must be 200 characters or less';
        isValid = false;
      }

      if (Object.keys(areaErrors).length > 0) {
        newErrors[index] = areaErrors;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle save
  const handleSave = () => {
    if (validateAreas()) {
      onSave(areas);
      // Clear auto-saved draft on successful save
      autoSave.clearSaved();
      onClose();
    }
  };

  // Handle close
  const handleClose = () => {
    setErrors({});
    onClose();
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && isOpen) {
        e.preventDefault();
        handleSave();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Define Your Focus Areas
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            The 8 areas that support your central goal
          </p>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close editor"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Help Text */}
        <div className="bg-green-50 p-4 rounded-md mb-6">
          <h3 className="text-sm font-medium text-green-900 mb-2">
            🎯 The Harada Method: 8 Focus Areas
          </h3>
          <div className="space-y-3 text-sm text-green-800">
            <p>
              <strong>Like Shohei Ohtani's approach:</strong> Instead of just
              "training harder," Ohtani broke down his development into 8
              specialized areas: Physical Conditioning, Mental Preparation,
              Hitting Mechanics, Pitching Technique, Game Strategy, Recovery
              Systems, Nutrition, and Injury Prevention.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">🏆 Sports Example:</h4>
                <ul className="text-xs space-y-1">
                  <li>
                    • <strong>Physical Conditioning</strong> - Strength, speed,
                    endurance
                  </li>
                  <li>
                    • <strong>Mental Preparation</strong> - Focus,
                    visualization, resilience
                  </li>
                  <li>
                    • <strong>Skill Development</strong> - Technique, form,
                    precision
                  </li>
                  <li>
                    • <strong>Strategy & Tactics</strong> - Game planning,
                    decision making
                  </li>
                  <li>
                    • <strong>Recovery & Health</strong> - Rest, nutrition,
                    injury prevention
                  </li>
                  <li>
                    • <strong>Equipment & Tools</strong> - Gear, training aids,
                    technology
                  </li>
                  <li>
                    • <strong>Support Network</strong> - Coaches, teammates,
                    mentors
                  </li>
                  <li>
                    • <strong>Measurement & Analysis</strong> - Tracking
                    progress, data analysis
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">💼 Career Example:</h4>
                <ul className="text-xs space-y-1">
                  <li>
                    • <strong>Technical Skills</strong> - Core competencies,
                    tools
                  </li>
                  <li>
                    • <strong>Soft Skills</strong> - Communication, leadership,
                    networking
                  </li>
                  <li>
                    • <strong>Industry Knowledge</strong> - Trends, best
                    practices, standards
                  </li>
                  <li>
                    • <strong>Project Management</strong> - Planning, execution,
                    delivery
                  </li>
                  <li>
                    • <strong>Work-Life Balance</strong> - Health,
                    relationships, personal growth
                  </li>
                  <li>
                    • <strong>Financial Management</strong> - Budgeting,
                    investing, planning
                  </li>
                  <li>
                    • <strong>Professional Development</strong> - Learning,
                    certifications, mentoring
                  </li>
                  <li>
                    • <strong>Personal Branding</strong> - Online presence,
                    reputation, visibility
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-green-100 p-3 rounded border-l-4 border-green-600">
              <p className="text-xs">
                <strong>Key Insight:</strong> Each focus area becomes a "lane"
                in your 64-task matrix. The goal of the Harada Method is
                systematic development across all areas simultaneously, creating
                compound growth that leads to extraordinary results.
              </p>
            </div>
          </div>
        </div>

        {/* Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {areas.map((area, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <h3 className="ml-3 text-sm font-medium text-gray-900">
                  Focus Area {index + 1}
                </h3>
              </div>

              {/* Title Field */}
              <div className="mb-3">
                <label
                  htmlFor={`area-title-${index}`}
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Title *
                </label>
                <input
                  id={`area-title-${index}`}
                  type="text"
                  value={area.title}
                  onChange={(e) => updateArea(index, 'title', e.target.value)}
                  className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 ${
                    errors[index]?.title
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder={`e.g., Physical Conditioning`}
                  maxLength={50}
                  aria-describedby={
                    errors[index]?.title ? `title-error-${index}` : undefined
                  }
                  aria-invalid={!!errors[index]?.title}
                />
                {errors[index]?.title && (
                  <p
                    id={`title-error-${index}`}
                    className="mt-1 text-xs text-red-600"
                    role="alert"
                  >
                    {errors[index]?.title}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {area.title.length}/50
                </p>
              </div>

              {/* Description Field */}
              <div>
                <label
                  htmlFor={`area-description-${index}`}
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Description *
                </label>
                <textarea
                  id={`area-description-${index}`}
                  value={area.description}
                  onChange={(e) =>
                    updateArea(index, 'description', e.target.value)
                  }
                  rows={3}
                  className={`w-full px-2 py-1 text-sm border rounded resize-none focus:outline-none focus:ring-1 ${
                    errors[index]?.description
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Describe what this focus area entails and how it supports your goal..."
                  maxLength={200}
                  aria-describedby={
                    errors[index]?.description
                      ? `description-error-${index}`
                      : undefined
                  }
                  aria-invalid={!!errors[index]?.description}
                />
                {errors[index]?.description && (
                  <p
                    id={`description-error-${index}`}
                    className="mt-1 text-xs text-red-600"
                    role="alert"
                  >
                    {errors[index]?.description}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {area.description.length}/200
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-4">
          {/* Auto-save indicator */}
          <div className="flex items-center gap-2 text-sm">
            {saveStatus === 'saving' && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </div>
            )}
            {saveStatus === 'saved' && (
              <div className="flex items-center gap-2 text-green-600">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{saveStatusText}</span>
              </div>
            )}
            {saveStatus === 'unsaved' && autoSave.savedData && (
              <div className="flex items-center gap-2 text-orange-600">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Draft available</span>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-600">
            <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Ctrl</kbd>{' '}
            +{' '}
            <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Enter</kbd>{' '}
            to save
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Save Focus Areas
          </button>
        </div>
      </div>
    </div>
  );
};
