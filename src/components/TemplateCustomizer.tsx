import React, { useState } from 'react';
import { MatrixData, CreateGoalInput, CreateFocusAreaInput } from '../types';

interface TemplateCustomizerProps {
  templateData: MatrixData;
  onApplyTemplate: (customizedData: MatrixData) => void;
  onBack: () => void;
  onCancel: () => void;
}

const TemplateCustomizer: React.FC<TemplateCustomizerProps> = ({
  templateData,
  onApplyTemplate,
  onBack,
  onCancel
}) => {
  const [customizedGoal, setCustomizedGoal] = useState<CreateGoalInput>({
    title: templateData.goal.title,
    description: templateData.goal.description
  });

  const [customizedAreas, setCustomizedAreas] = useState<CreateFocusAreaInput[]>(
    templateData.focusAreas.map(area => ({
      title: area.title,
      description: area.description,
      goalId: area.goalId
    }))
  );

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!customizedGoal.title.trim()) {
      newErrors.goalTitle = 'Goal title is required';
    }

    if (!customizedGoal.description.trim()) {
      newErrors.goalDescription = 'Goal description is required';
    }

    customizedAreas.forEach((area, index) => {
      if (!area.title.trim()) {
        newErrors[`areaTitle-${index}`] = 'Area title is required';
      }
      if (!area.description.trim()) {
        newErrors[`areaDescription-${index}`] = 'Area description is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyTemplate = () => {
    if (!validateForm()) {
      return;
    }

    // Create the customized matrix data
    const customizedData: MatrixData = {
      goal: {
        id: `goal-${Date.now()}`,
        title: customizedGoal.title,
        description: customizedGoal.description,
        createdDate: new Date()
      },
      focusAreas: customizedAreas.map((area, index) => ({
        id: `area-${Date.now()}-${index}`,
        title: area.title,
        description: area.description,
        goalId: `goal-${Date.now()}`
      })),
      tasks: templateData.tasks.map(task => ({
        ...task,
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        areaId: customizedAreas[task.areaId === templateData.focusAreas[0].id ? 0 :
                task.areaId === templateData.focusAreas[1].id ? 1 :
                task.areaId === templateData.focusAreas[2].id ? 2 :
                task.areaId === templateData.focusAreas[3].id ? 3 :
                task.areaId === templateData.focusAreas[4].id ? 4 :
                task.areaId === templateData.focusAreas[5].id ? 5 :
                task.areaId === templateData.focusAreas[6].id ? 6 : 7] ?
                `area-${Date.now()}-${task.areaId === templateData.focusAreas[0].id ? 0 :
                task.areaId === templateData.focusAreas[1].id ? 1 :
                task.areaId === templateData.focusAreas[2].id ? 2 :
                task.areaId === templateData.focusAreas[3].id ? 3 :
                task.areaId === templateData.focusAreas[4].id ? 4 :
                task.areaId === templateData.focusAreas[5].id ? 5 :
                task.areaId === templateData.focusAreas[6].id ? 6 : 7}` : task.areaId
      }))
    };

    onApplyTemplate(customizedData);
  };

  const updateArea = (index: number, field: keyof CreateFocusAreaInput, value: string) => {
    setCustomizedAreas(prev => prev.map((area, i) =>
      i === index ? { ...area, [field]: value } : area
    ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Customize Template</h2>
            <p className="text-gray-600 mt-1">Personalize the goal and focus areas before applying</p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cancel customization"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Goal Customization */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="goal-title" className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Title
                </label>
                <input
                  id="goal-title"
                  type="text"
                  value={customizedGoal.title}
                  onChange={(e) => setCustomizedGoal(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.goalTitle ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your main goal..."
                />
                {errors.goalTitle && (
                  <p className="mt-1 text-sm text-red-600">{errors.goalTitle}</p>
                )}
              </div>

              <div>
                <label htmlFor="goal-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Description
                </label>
                <textarea
                  id="goal-description"
                  value={customizedGoal.description}
                  onChange={(e) => setCustomizedGoal(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.goalDescription ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe what you want to achieve..."
                />
                {errors.goalDescription && (
                  <p className="mt-1 text-sm text-red-600">{errors.goalDescription}</p>
                )}
              </div>
            </div>
          </div>

          {/* Focus Areas Customization */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Focus Areas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customizedAreas.map((area, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Area {index + 1}</h4>
                    <span className="text-xs text-gray-500">
                      {templateData.tasks.filter(t => t.areaId === templateData.focusAreas[index]?.id).length} tasks
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        errors[`areaTitle-${index}`] ? 'text-red-700' : 'text-gray-700'
                      }`}>
                        Area Title
                      </label>
                      <input
                        type="text"
                        value={area.title}
                        onChange={(e) => updateArea(index, 'title', e.target.value)}
                        className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`areaTitle-${index}`] ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                        }`}
                        placeholder={`Focus area ${index + 1}...`}
                      />
                      {errors[`areaTitle-${index}`] && (
                        <p className="mt-1 text-xs text-red-600">{errors[`areaTitle-${index}`]}</p>
                      )}
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        errors[`areaDescription-${index}`] ? 'text-red-700' : 'text-gray-700'
                      }`}>
                        Description
                      </label>
                      <textarea
                        value={area.description}
                        onChange={(e) => updateArea(index, 'description', e.target.value)}
                        rows={2}
                        className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`areaDescription-${index}`] ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                        }`}
                        placeholder="What does this area focus on..."
                      />
                      {errors[`areaDescription-${index}`] && (
                        <p className="mt-1 text-xs text-red-600">{errors[`areaDescription-${index}`]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Template Summary */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Template Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Tasks:</span>
                <span className="ml-2 font-medium">{templateData.tasks.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Focus Areas:</span>
                <span className="ml-2 font-medium">{templateData.focusAreas.length}</span>
              </div>
              <div>
                <span className="text-gray-600">High Priority:</span>
                <span className="ml-2 font-medium">
                  {templateData.tasks.filter(t => t.priority === 'high').length}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Estimated Time:</span>
                <span className="ml-2 font-medium">~2000h</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Back to Templates
          </button>

          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyTemplate}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Apply Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateCustomizer;
