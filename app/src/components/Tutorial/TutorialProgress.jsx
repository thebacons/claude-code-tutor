// ============================================================================
// TutorialProgress - Step Indicator and Progress Display
// ============================================================================

import React from 'react';
import { CheckCircle, Circle, PlayCircle, Loader2, XCircle, AlertCircle } from 'lucide-react';

export function TutorialProgress({
  currentStep,
  stepIndex,
  totalSteps,
  tutorialState,
  lessonTitle,
  validationMessage,
  completedSteps,
  lastValidationResult
}) {
  // Calculate progress percentage
  const progress = totalSteps > 0 ? Math.round((stepIndex / totalSteps) * 100) : 0;

  // Get state display info
  const getStateInfo = () => {
    switch (tutorialState) {
      case 'VOICE_PLAYING':
        return { text: 'Listening...', color: 'text-blue-400', icon: Loader2, animate: true };
      case 'DEMO_TYPING':
        return { text: 'Watch demo', color: 'text-yellow-400', icon: PlayCircle, animate: false };
      case 'WAITING_INPUT':
        return { text: 'Your turn!', color: 'text-green-400', icon: Circle, animate: false };
      case 'VALIDATING':
        return { text: 'Checking...', color: 'text-purple-400', icon: Loader2, animate: true };
      case 'STEP_COMPLETE':
        return { text: 'Complete', color: 'text-green-400', icon: CheckCircle, animate: false };
      case 'LESSON_COMPLETE':
        return { text: 'Lesson Done!', color: 'text-green-400', icon: CheckCircle, animate: false };
      default:
        return { text: 'Ready', color: 'text-gray-400', icon: Circle, animate: false };
    }
  };

  const stateInfo = getStateInfo();
  const StateIcon = stateInfo.icon;

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4 space-y-4">
      {/* Lesson Title */}
      {lessonTitle && (
        <div>
          <h3 className="text-lg font-semibold text-white">{lessonTitle}</h3>
        </div>
      )}

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm font-medium text-white">
            Step {stepIndex + 1} of {totalSteps}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current State */}
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-gray-700/50 ${stateInfo.color}`}>
          <StateIcon className={`w-5 h-5 ${stateInfo.animate ? 'animate-spin' : ''}`} />
        </div>
        <div>
          <span className={`font-medium ${stateInfo.color}`}>
            {stateInfo.text}
          </span>
          {currentStep?.type && (
            <span className="text-gray-500 text-sm ml-2">
              ({currentStep.type})
            </span>
          )}
        </div>
      </div>

      {/* Step Description (if available) */}
      {currentStep?.voice?.text && tutorialState === 'WAITING_INPUT' && (
        <div className="bg-gray-700/30 rounded-lg p-3">
          <p className="text-gray-300 text-sm">
            {currentStep.voice.text}
          </p>
        </div>
      )}

      {/* Validation Feedback */}
      {validationMessage && (
        <div
          className={`rounded-lg p-3 flex items-center gap-3 animate-pulse ${
            lastValidationResult?.success
              ? 'bg-green-900/50 border border-green-500/50'
              : 'bg-yellow-900/50 border border-yellow-500/50'
          }`}
        >
          {lastValidationResult?.success ? (
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          )}
          <div className="flex-1">
            <p className={`text-sm font-medium ${
              lastValidationResult?.success ? 'text-green-300' : 'text-yellow-300'
            }`}>
              {validationMessage}
            </p>
            {lastValidationResult?.hint && (
              <p className="text-xs text-yellow-400/70 mt-1">
                Hint: {lastValidationResult.hint}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step Checklist */}
      <div className="space-y-2 pt-2">
        <span className="text-xs text-gray-500 uppercase tracking-wider">Step Progress</span>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {Array.from({ length: totalSteps }, (_, i) => {
            const isCompleted = completedSteps?.has(i) || i < stepIndex;
            const isCurrent = i === stepIndex;

            return (
              <div
                key={i}
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green-500/20 border-2 border-green-500'
                    : isCurrent
                    ? 'bg-blue-500/20 border-2 border-blue-500 scale-110'
                    : 'bg-gray-700/50 border-2 border-gray-600'
                }`}
                title={`Step ${i + 1}${isCompleted ? ' (completed)' : isCurrent ? ' (current)' : ''}`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : isCurrent ? (
                  <span className="text-xs font-bold text-blue-400">{i + 1}</span>
                ) : (
                  <span className="text-xs text-gray-500">{i + 1}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TutorialProgress;
