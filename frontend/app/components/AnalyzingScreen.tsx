import { Brain, Eye, FileText, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AnalyzingScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: Eye, label: 'Detecting medicine with YOLO...', color: 'text-purple-600' },
    { icon: FileText, label: 'Extracting text with OCR...', color: 'text-blue-600' },
    { icon: Brain, label: 'Analyzing results...', color: 'text-green-600' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-8 shadow-2xl animate-pulse">
        <Brain className="w-12 h-12 text-white" />
      </div>

      <h2 className="text-gray-900 mb-2 text-center">AI Analysis in Progress</h2>
      <p className="text-gray-600 mb-12 text-center">Please wait while we identify your medicine</p>

      <div className="w-full space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div
              key={index}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                isActive
                  ? 'bg-blue-50 border-2 border-blue-300'
                  : isCompleted
                  ? 'bg-green-50 border-2 border-green-300'
                  : 'bg-gray-50 border-2 border-gray-200'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isActive
                    ? 'bg-blue-600'
                    : isCompleted
                    ? 'bg-green-600'
                    : 'bg-gray-300'
                }`}
              >
                {isActive ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <Icon className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`${
                    isActive
                      ? 'text-gray-900'
                      : isCompleted
                      ? 'text-green-900'
                      : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
