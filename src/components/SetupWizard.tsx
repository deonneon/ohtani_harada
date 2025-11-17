import { useState, useEffect } from 'react';
import { Goal, CreateGoalInput, FocusArea, CreateFocusAreaInput, MatrixData } from '../types';

interface SetupWizardProps {
  /** Whether the wizard is open */
  isOpen: boolean;
  /** Current matrix data */
  matrixData: MatrixData;
  /** Callback when wizard completes */
  onComplete: (goalData: CreateGoalInput, areasData: CreateFocusAreaInput[]) => void;
  /** Callback when wizard is closed */
  onClose: () => void;
}

type WizardStep = 'welcome' | 'goal' | 'areas' | 'review';

interface WizardState {
  currentStep: WizardStep;
  goalData: CreateGoalInput | null;
  areasData: CreateFocusAreaInput[];
  completedSteps: Set<WizardStep>;
}

/**
 * Multi-step wizard for initial goal and focus area setup
 */
export const SetupWizard: React.FC<SetupWizardProps> = ({
  isOpen,
  matrixData,
  onComplete,
  onClose
}) => {
  const [state, setState] = useState<WizardState>({
    currentStep: 'welcome',
    goalData: null,
    areasData: Array.from({ length: 8 }, () => ({ title: '', description: '' })),
    completedSteps: new Set()
  });

  // Reset wizard when opened
  useEffect(() => {
    if (isOpen) {
      setState({
        currentStep: 'welcome',
        goalData: null,
        areasData: Array.from({ length: 8 }, () => ({ title: '', description: '' })),
        completedSteps: new Set()
      });
    }
  }, [isOpen]);

  // Navigation functions
  const goToStep = (step: WizardStep) => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  const nextStep = () => {
    const steps: WizardStep[] = ['welcome', 'goal', 'areas', 'review'];
    const currentIndex = steps.indexOf(state.currentStep);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      setState(prev => ({
        ...prev,
        currentStep: nextStep,
        completedSteps: new Set([...prev.completedSteps, prev.currentStep])
      }));
    }
  };

  const prevStep = () => {
    const steps: WizardStep[] = ['welcome', 'goal', 'areas', 'review'];
    const currentIndex = steps.indexOf(state.currentStep);
    if (currentIndex > 0) {
      goToStep(steps[currentIndex - 1]);
    }
  };

  // Step validation
  const canProceedFromGoal = () => {
    return state.goalData?.title.trim() && state.goalData?.description.trim();
  };

  const canProceedFromAreas = () => {
    return state.areasData.every(area => area.title.trim() && area.description.trim());
  };

  // Handlers
  const handleGoalSubmit = (goalData: CreateGoalInput) => {
    setState(prev => ({ ...prev, goalData }));
    nextStep();
  };

  const handleAreasSubmit = (areasData: CreateFocusAreaInput[]) => {
    setState(prev => ({ ...prev, areasData }));
    nextStep();
  };

  const handleComplete = () => {
    if (state.goalData) {
      onComplete(state.goalData, state.areasData);
      onClose();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const steps: WizardStep[] = ['welcome', 'goal', 'areas', 'review'];
  const currentIndex = steps.indexOf(state.currentStep);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with progress */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Setup Your Harada Method Matrix
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close wizard"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Step indicators */}
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  index <= currentIndex
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                <span className={`text-xs mt-1 ${
                  index <= currentIndex ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}>
                  {step === 'welcome' && 'Welcome'}
                  {step === 'goal' && 'Your Goal'}
                  {step === 'areas' && 'Focus Areas'}
                  {step === 'review' && 'Review'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {state.currentStep === 'welcome' && <WelcomeStep />}
          {state.currentStep === 'goal' && (
            <GoalStep
              initialData={state.goalData || { title: '', description: '' }}
              onSubmit={handleGoalSubmit}
            />
          )}
          {state.currentStep === 'areas' && (
            <AreasStep
              initialData={state.areasData}
              onSubmit={handleAreasSubmit}
            />
          )}
          {state.currentStep === 'review' && (
            <ReviewStep
              goalData={state.goalData!}
              areasData={state.areasData}
              onEditGoal={() => goToStep('goal')}
              onEditAreas={() => goToStep('areas')}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              onClick={state.currentStep === 'welcome' ? onClose : prevStep}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {state.currentStep === 'welcome' ? 'Cancel' : 'Back'}
            </button>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              Step {currentIndex + 1} of {steps.length}
            </div>

            {state.currentStep === 'review' ? (
              <button
                onClick={handleComplete}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Complete Setup
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={
                  (state.currentStep === 'goal' && !canProceedFromGoal()) ||
                  (state.currentStep === 'areas' && !canProceedFromAreas())
                }
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.currentStep === 'welcome' ? 'Get Started' : 'Continue'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Welcome step introducing the Harada Method
 */
const WelcomeStep: React.FC = () => (
  <div className="p-8">
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to the Harada Method</h3>
      <p className="text-lg text-gray-600">Inspired by Shohei Ohtani's systematic approach to excellence</p>
    </div>

    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-blue-900 mb-3">How It Works</h4>
        <div className="space-y-3 text-blue-800">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">1</div>
            <div>
              <strong>Define Your Central Goal</strong>
              <p className="text-sm mt-1">Set an ambitious, specific goal that inspires and challenges you.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">2</div>
            <div>
              <strong>Identify 8 Focus Areas</strong>
              <p className="text-sm mt-1">Break down your goal into 8 key areas that need development.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">3</div>
            <div>
              <strong>Create 64 Actionable Tasks</strong>
              <p className="text-sm mt-1">Develop 8 specific tasks for each focus area (64 total).</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">4</div>
            <div>
              <strong>Systematic Progress</strong>
              <p className="text-sm mt-1">Work simultaneously across all areas for compound growth.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-green-900 mb-2">Why It Works</h4>
        <p className="text-green-800">
          Just as Ohtani didn't just "practice harder" but systematically developed every aspect of his game,
          the Harada Method ensures comprehensive development across all necessary areas. This creates
          compound growth that leads to extraordinary results.
        </p>
      </div>
    </div>
  </div>
);

/**
 * Goal definition step
 */
const GoalStep: React.FC<{
  initialData: CreateGoalInput;
  onSubmit: (data: CreateGoalInput) => void;
}> = ({ initialData, onSubmit }) => {
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [errors, setErrors] = useState<{title?: string; description?: string}>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: {title?: string; description?: string} = {};
    if (!title.trim()) newErrors.title = 'Goal title is required';
    if (!description.trim()) newErrors.description = 'Goal description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ title: title.trim(), description: description.trim() });
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Define Your Central Goal</h3>
        <p className="text-gray-600 mb-6">
          This is the big vision that will guide everything else. Make it specific, ambitious, and inspiring.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="wizard-goal-title" className="block text-sm font-medium text-gray-700 mb-2">
              Goal Title *
            </label>
            <input
              id="wizard-goal-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.title ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="e.g., Become a Professional Baseball Player"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="wizard-goal-description" className="block text-sm font-medium text-gray-700 mb-2">
              Goal Description *
            </label>
            <textarea
              id="wizard-goal-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 resize-none ${
                errors.description ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Describe your goal in detail. What does success look like?"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Examples</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• "Build a sustainable software company serving 10,000 customers"</li>
              <li>• "Become a world-class concert pianist performing internationally"</li>
              <li>• "Complete an Ironman triathlon in under 12 hours"</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * Focus areas definition step
 */
const AreasStep: React.FC<{
  initialData: CreateFocusAreaInput[];
  onSubmit: (data: CreateFocusAreaInput[]) => void;
}> = ({ initialData, onSubmit }) => {
  const [areas, setAreas] = useState<CreateFocusAreaInput[]>(initialData);
  const [errors, setErrors] = useState<Record<number, {title?: string; description?: string}>>({});

  const updateArea = (index: number, field: 'title' | 'description', value: string) => {
    setAreas(prev => prev.map((area, i) =>
      i === index ? { ...area, [field]: value } : area
    ));

    // Clear errors
    if (errors[index]?.[field]) {
      setErrors(prev => ({
        ...prev,
        [index]: { ...prev[index], [field]: undefined }
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<number, {title?: string; description?: string}> = {};
    areas.forEach((area, index) => {
      const areaErrors: {title?: string; description?: string} = {};
      if (!area.title.trim()) areaErrors.title = 'Required';
      if (!area.description.trim()) areaErrors.description = 'Required';

      if (Object.keys(areaErrors).length > 0) {
        newErrors[index] = areaErrors;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(areas);
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Define Your 8 Focus Areas</h3>
        <p className="text-gray-600 mb-6">
          Break down your goal into 8 key areas that need systematic development.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {areas.map((area, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Area {index + 1}</h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={area.title}
                      onChange={(e) => updateArea(index, 'title', e.target.value)}
                      className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 ${
                        errors[index]?.title ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      placeholder="e.g., Physical Conditioning"
                    />
                    {errors[index]?.title && (
                      <p className="mt-1 text-xs text-red-600">{errors[index]?.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={area.description}
                      onChange={(e) => updateArea(index, 'description', e.target.value)}
                      rows={2}
                      className={`w-full px-2 py-1 text-sm border rounded resize-none focus:outline-none focus:ring-1 ${
                        errors[index]?.description ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      placeholder="What does this area encompass?"
                    />
                    {errors[index]?.description && (
                      <p className="mt-1 text-xs text-red-600">{errors[index]?.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-green-900 mb-2">🎯 Remember</h4>
            <p className="text-sm text-green-800">
              Each focus area will become a "lane" in your 64-task matrix. Think about the different skills,
              knowledge areas, and support systems needed to achieve your goal.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * Review and confirmation step
 */
const ReviewStep: React.FC<{
  goalData: CreateGoalInput;
  areasData: CreateFocusAreaInput[];
  onEditGoal: () => void;
  onEditAreas: () => void;
}> = ({ goalData, areasData, onEditGoal, onEditAreas }) => (
  <div className="p-8">
    <div className="max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Review Your Setup</h3>
      <p className="text-gray-600 mb-6">
        Take a moment to review your goal and focus areas before completing the setup.
      </p>

      {/* Goal Review */}
      <div className="bg-blue-50 p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-semibold text-blue-900">Your Goal</h4>
          <button
            onClick={onEditGoal}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </button>
        </div>
        <h5 className="font-medium text-blue-800 mb-2">{goalData.title}</h5>
        <p className="text-blue-700">{goalData.description}</p>
      </div>

      {/* Areas Review */}
      <div className="bg-green-50 p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-semibold text-green-900">Your Focus Areas</h4>
          <button
            onClick={onEditAreas}
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {areasData.map((area, index) => (
            <div key={index} className="bg-white p-3 rounded border">
              <h5 className="font-medium text-gray-900">{area.title}</h5>
              <p className="text-sm text-gray-600 mt-1">{area.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-yellow-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-yellow-900 mb-3">What's Next?</h4>
        <div className="text-yellow-800 space-y-2">
          <p>🎯 <strong>Your 64-task matrix is ready!</strong></p>
          <p>📝 Next, you'll create 8 specific, actionable tasks for each focus area.</p>
          <p>⚡ Then you'll systematically work across all areas simultaneously for compound growth.</p>
          <p>🏆 Just like Ohtani's revolutionary two-way success, you'll develop extraordinary capabilities.</p>
        </div>
      </div>
    </div>
  </div>
);
