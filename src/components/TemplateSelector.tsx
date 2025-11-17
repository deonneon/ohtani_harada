import React, { useState, useMemo } from 'react';
import {
  availableTemplates,
  TemplateMetadata,
  getTemplateById,
} from '../templates';
import { MatrixData } from '../types';
import TemplateCustomizer from './TemplateCustomizer';

interface TemplateSelectorProps {
  onSelectTemplate: (template: MatrixData) => void;
  onClose: () => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onSelectTemplate,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] =
    useState<TemplateMetadata | null>(null);
  const [customizingTemplate, setCustomizingTemplate] =
    useState<MatrixData | null>(null);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = availableTemplates.map((t) => t.category);
    return ['all', ...Array.from(new Set(cats))];
  }, []);

  // Filter templates based on category and search
  const filteredTemplates = useMemo(() => {
    return availableTemplates.filter((template) => {
      const matchesCategory =
        selectedCategory === 'all' || template.category === selectedCategory;
      const matchesSearch =
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleSelectTemplate = (template: TemplateMetadata) => {
    const matrixData = getTemplateById(template.id);
    if (matrixData) {
      setCustomizingTemplate(matrixData);
    }
  };

  const handleApplyCustomizedTemplate = (customizedData: MatrixData) => {
    onSelectTemplate(customizedData);
  };

  const handleBackToPreview = () => {
    setCustomizingTemplate(null);
  };

  const handleBackToSelector = () => {
    setPreviewTemplate(null);
    setCustomizingTemplate(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '🌱';
      case 'intermediate':
        return '⚡';
      case 'advanced':
        return '🏔️';
      default:
        return '📚';
    }
  };

  if (previewTemplate) {
    const template = previewTemplate;
    const matrixData = getTemplateById(template.id);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {template.name}
              </h2>
              <p className="text-gray-600 mt-1">{template.description}</p>
            </div>
            <button
              onClick={() => setPreviewTemplate(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close preview"
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

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Template Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Template Overview
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Category:
                    </span>
                    <span className="text-sm text-gray-900">
                      {template.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Difficulty:
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}
                    >
                      {getDifficultyIcon(template.difficulty)}{' '}
                      {template.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Estimated Time:
                    </span>
                    <span className="text-sm text-gray-900">
                      {template.estimatedHours} hours
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Total Tasks:
                    </span>
                    <span className="text-sm text-gray-900">64 tasks</span>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-md font-semibold mb-3">Focus Areas</h4>
                  {matrixData && (
                    <div className="grid grid-cols-2 gap-2">
                      {matrixData.focusAreas.map((area, index) => (
                        <div
                          key={area.id}
                          className="text-xs bg-gray-50 p-2 rounded"
                        >
                          <div className="font-medium">{area.title}</div>
                          <div className="text-gray-600 mt-1">
                            {area.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sample Tasks Preview */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Sample Tasks</h3>
                {matrixData && (
                  <div className="space-y-3">
                    {matrixData.focusAreas.slice(0, 4).map((area) => {
                      const areaTasks = matrixData.tasks
                        .filter((t) => t.areaId === area.id)
                        .slice(0, 2);
                      return (
                        <div
                          key={area.id}
                          className="border border-gray-200 rounded-lg p-3"
                        >
                          <h4 className="font-medium text-sm text-gray-900 mb-2">
                            {area.title}
                          </h4>
                          <div className="space-y-2">
                            {areaTasks.map((task) => (
                              <div key={task.id} className="text-xs">
                                <div className="flex items-start space-x-2">
                                  <span
                                    className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-xs ${
                                      task.priority === 'high'
                                        ? 'bg-red-100 text-red-800'
                                        : task.priority === 'medium'
                                          ? 'bg-yellow-100 text-yellow-800'
                                          : 'bg-green-100 text-green-800'
                                    }`}
                                  >
                                    {task.priority === 'high'
                                      ? 'H'
                                      : task.priority === 'medium'
                                        ? 'M'
                                        : 'L'}
                                  </span>
                                  <span className="flex-1 text-gray-700">
                                    {task.title}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setPreviewTemplate(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Back to Templates
            </button>
            <button
              onClick={() => handleSelectTemplate(template)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Use This Template
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show customizer if a template is being customized
  if (customizingTemplate) {
    return (
      <TemplateCustomizer
        templateData={customizingTemplate}
        onApplyTemplate={handleApplyCustomizedTemplate}
        onBack={handleBackToPreview}
        onCancel={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Choose a Template
            </h2>
            <p className="text-gray-600 mt-1">
              Select a pre-configured matrix to get started quickly
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close template selector"
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

        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <label
                htmlFor="template-search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Templates
              </label>
              <input
                id="template-search"
                type="text"
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label
                htmlFor="category-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No templates found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or category filter
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setPreviewTemplate(template)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {template.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}
                    >
                      {getDifficultyIcon(template.difficulty)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {template.description}
                  </p>

                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="font-medium">{template.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tasks:</span>
                      <span className="font-medium">64</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-medium">
                        ~{template.estimatedHours}h
                      </span>
                    </div>
                  </div>

                  <button
                    className="w-full mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewTemplate(template);
                    }}
                  >
                    Preview Template
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
