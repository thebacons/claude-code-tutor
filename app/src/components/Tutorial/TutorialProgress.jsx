// ============================================================================
// TutorialProgress - Step Indicator and Progress Display
// ============================================================================

import React from 'react';
import { CheckCircle, Circle, PlayCircle, Loader2 } from 'lucide-react';

export function TutorialProgress({
  currentStep,
  stepIndex,
  totalSteps,
  tutorialState,
  lessonTitle
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

      {/* Step Dots */}
      <div className="flex items-center justify-center gap-1 pt-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i < stepIndex
                ? 'bg-green-400'
                : i === stepIndex
                ? 'bg-blue-400 scale-125'
                : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default TutorialProgress;
