
import React from 'react';
import { AppStep } from '../types';

interface StepIndicatorProps {
  currentStep: AppStep;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { id: AppStep.CONFIG, label: 'Configure' },
    { id: AppStep.OUTLINING, label: 'Outline' },
    { id: AppStep.GENERATING, label: 'Write' },
    { id: AppStep.PREVIEW, label: 'Publish' }
  ];

  const getStepStatus = (id: AppStep) => {
    const order = [AppStep.CONFIG, AppStep.OUTLINING, AppStep.GENERATING, AppStep.PREVIEW];
    const currentIndex = order.indexOf(currentStep);
    const stepIndex = order.indexOf(id);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto mb-12">
      {steps.map((step, index) => {
        const status = getStepStatus(step.id);
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  status === 'active' 
                    ? 'border-indigo-600 bg-indigo-600 text-white' 
                    : status === 'completed'
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-slate-300 bg-white text-slate-400'
                }`}
              >
                {status === 'completed' ? '✓' : index + 1}
              </div>
              <span className={`text-xs mt-2 font-medium ${status === 'active' ? 'text-indigo-600' : 'text-slate-500'}`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 bg-slate-200 mx-2 -mt-6">
                <div 
                  className={`h-full bg-indigo-600 transition-all duration-500 ${
                    status === 'completed' ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
