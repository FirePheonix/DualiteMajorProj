import React from 'react';
import { Check } from 'lucide-react';

interface NavigationStep {
  id: number;
  name: string;
  status: 'active' | 'completed' | 'pending';
}

interface NavigationSidebarProps {
  currentStep: number;
  onStepClick?: (stepNumber: number) => void;
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({ currentStep, onStepClick }) => {
  const steps: NavigationStep[] = [
    { id: 1, name: 'Question Types', status: currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : 'pending' },
    { id: 2, name: 'Source Selection', status: currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : 'pending' },
    { id: 3, name: 'Guidelines', status: currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : 'pending' },
    { id: 4, name: 'Generation', status: currentStep === 4 ? 'active' : currentStep > 4 ? 'completed' : 'pending' },
    { id: 5, name: 'Review', status: currentStep === 5 ? 'active' : currentStep > 5 ? 'completed' : 'pending' },
    { id: 6, name: 'Summary', status: currentStep === 6 ? 'active' : currentStep > 6 ? 'completed' : 'pending' },
  ];

  const handleStepClick = (step: NavigationStep) => {
    // Only allow clicking on completed steps or the current step
    if (onStepClick && (step.status === 'completed' || step.status === 'active')) {
      onStepClick(step.id);
    }
  };

  return (
    <div className="bg-white border-r border-gray-200 h-full p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-8">Navigation</h2>
      <nav className="space-y-4">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className={`flex items-center space-x-3 ${
              (step.status === 'completed' || step.status === 'active') && onStepClick
                ? 'cursor-pointer hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors'
                : ''
            }`}
            onClick={() => handleStepClick(step)}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step.status === 'active'
                  ? 'bg-blue-600 text-white'
                  : step.status === 'completed'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step.status === 'completed' ? (
                <Check className="w-5 h-5" />
              ) : (
                step.id
              )}
            </div>
            <span
              className={`text-sm font-medium transition-colors ${
                step.status === 'active'
                  ? 'text-blue-600'
                  : step.status === 'completed'
                  ? 'text-green-600'
                  : 'text-gray-500'
              }`}
            >
              {step.name}
            </span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default NavigationSidebar;
