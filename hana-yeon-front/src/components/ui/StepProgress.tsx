import React from "react";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  stepTitle?: string;
  description?: string;
  className?: string;
}

const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  totalSteps,
  stepTitle,
  description,
  className = "",
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* STEP 제목 */}
      <div className="mb-4">
        <h2 className="text-base font-medium text-gray-600 dark:text-gray-400">
          STEP {currentStep}
        </h2>
        {stepTitle && (
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
            {stepTitle}
          </h1>
        )}
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {description}
          </p>
        )}
      </div>

      {/* 진행률 인디케이터 */}
      <div className="flex items-center">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={stepNumber} className="flex items-center">
              {/* 원형 스텝 인디케이터 */}
              <div
                className={`
                  w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium
                  ${
                    isActive
                      ? "bg-olo text-white"
                      : isCompleted
                      ? "bg-olo text-white"
                      : "bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400"
                  }
                `}
              >
                {isCompleted ? (
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
                ) : (
                  stepNumber
                )}
              </div>

              {/* 연결선 (마지막 스텝이 아닌 경우에만) */}
              {stepNumber < totalSteps && (
                <div
                  className={`
                    w-5 h-0.5
                    ${
                      stepNumber < currentStep
                        ? "bg-olo"
                        : "bg-gray-300 dark:bg-gray-600"
                    }
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;
