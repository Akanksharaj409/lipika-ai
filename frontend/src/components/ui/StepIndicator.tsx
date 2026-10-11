import React from 'react';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

export interface Step {
  id: number;
  label: string;
  description?: string;
}

export interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="w-full py-2">
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isLast = idx === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div
                onClick={() => onStepClick && onStepClick(step.id)}
                className={clsx(
                  'flex items-center gap-2 group cursor-pointer select-none',
                  onStepClick ? 'hover:opacity-90' : 'cursor-default'
                )}
              >
                {/* Circle */}
                <div
                  className={clsx(
                    'w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-semibold border transition-all duration-200',
                    isCompleted && 'bg-emerald-950 border-emerald-500 text-emerald-300',
                    isCurrent && 'bg-terracotta-600 border-amber-400 text-amber-50 shadow-md shadow-terracotta-900/40 ring-2 ring-amber-500/20',
                    !isCompleted && !isCurrent && 'bg-slate-900 border-slate-700 text-slate-500'
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4 text-emerald-400" /> : step.id}
                </div>

                {/* Step Label */}
                <div className="hidden sm:block text-left">
                  <p
                    className={clsx(
                      'text-xs font-medium font-sans leading-none',
                      isCurrent ? 'text-amber-200 font-semibold' : isCompleted ? 'text-slate-300' : 'text-slate-500'
                    )}
                  >
                    {step.label}
                  </p>
                </div>
              </div>

              {/* Connecting Line */}
              {!isLast && (
                <div
                  className={clsx(
                    'flex-1 h-[2px] mx-2 sm:mx-3 transition-colors duration-300',
                    currentStep > step.id ? 'bg-emerald-600/60' : 'bg-slate-800'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
