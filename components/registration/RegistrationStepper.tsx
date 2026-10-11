import React from 'react';
import { Check } from 'lucide-react';

interface RegistrationStepperProps {
  currentStep: number; // 1, 2, 3
}

export const RegistrationStepper: React.FC<RegistrationStepperProps> = ({ currentStep }) => {
  const steps = [
    { id: 1, title: 'Personal Details' },
    { id: 2, title: 'KYC Details' },
    { id: 3, title: 'Address Details' },
  ];

  return (
    <div className="w-full bg-[#111111] px-4 py-3 text-white border-b border-gray-800">
      <div className="max-w-md mx-auto flex items-center justify-between relative">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-gray-700 -translate-y-1/2 z-0" />

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-[#397EF5] text-white ring-4 ring-[#397EF5]/30'
                    : 'bg-gray-800 text-gray-400 border border-gray-700'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.id}
              </div>
              <span
                className={`text-[10px] font-medium mt-1 transition-colors ${
                  isCurrent ? 'text-[#397EF5]' : isCompleted ? 'text-emerald-400' : 'text-gray-500'
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
