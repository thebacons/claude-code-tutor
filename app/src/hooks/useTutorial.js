// ============================================================================
// useTutorial - Tutorial State Management Hook
// ============================================================================

import { useState, useCallback, useEffect } from 'react';

export function useTutorial(socket) {
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentStep, setCurrentStep] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [tutorialState, setTutorialState] = useState('IDLE');
  const [isComplete, setIsComplete] = useState(false);
  const [completionData, setCompletionData] = useState(null);
  const [error, setError] = useState(null);
  const [availableLessons, setAvailableLessons] = useState([]);

  // Fetch available lessons
  const fetchLessons = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/lessons');
      const data = await response.json();
      setAvailableLessons(data.lessons || []);
    } catch (err) {
      console.error('[Tutorial] Failed to fetch lessons:', err);
      setError('Failed to load lessons');
    }
  }, []);

  // Start a lesson
  const startLesson = useCallback((lessonId) => {
    return new Promise((resolve, reject) => {
      if (!socket?.emit) {
        reject(new Error('Socket not connected'));
        return;
      }

      setError(null);
      setIsComplete(false);
      setCompletionData(null);

      socket.emit('tutorial:start', { lessonId }, (response) => {
        if (response.success) {
          setCurrentLesson(response.lesson);
          setTotalSteps(response.lesson.totalSteps);
          setStepIndex(0);
          resolve(response.lesson);
        } else {
          setError(response.error);
          reject(new Error(response.error));
        }
      });
    });
  }, [socket]);

  // Request a hint
  const requestHint = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!socket?.emit) {
        reject(new Error('Socket not connected'));
        return;
      }

      socket.emit('tutorial:hint', (response) => {
        if (response.success) {
          resolve({
            hint: response.hint,
            index: response.hintIndex,
            total: response.totalHints
          });
        } else {
          resolve(null);
        }
      });
    });
  }, [socket]);

  // Skip current step
  const skipStep = useCallback(() => {
    if (socket?.emit) {
      socket.emit('tutorial:skip');
    }
  }, [socket]);

  // Stop tutorial
  const stopTutorial = useCallback(() => {
    if (socket?.emit) {
      socket.emit('tutorial:stop');
    }
    setCurrentLesson(null);
    setCurrentStep(null);
    setStepIndex(0);
    setTotalSteps(0);
    setTutorialState('IDLE');
    setIsComplete(false);
  }, [socket]);

  // Handle tutorial events
  useEffect(() => {
    if (!socket?.on) return;

    const handleStep = (data) => {
      console.log('[Tutorial] Step:', data);
      setCurrentStep(data.step);
      setStepIndex(data.stepIndex);
      setTotalSteps(data.totalSteps);
      setTutorialState(data.state);
    };

    const handleComplete = (data) => {
      console.log('[Tutorial] Complete:', data);
      setIsComplete(true);
      setCompletionData(data);
      setTutorialState('LESSON_COMPLETE');
    };

    const handleError = (data) => {
      console.error('[Tutorial] Error:', data);
      setError(data.message);
      if (!data.recoverable) {
        setTutorialState('IDLE');
      }
    };

    socket.on('tutorial:step', handleStep);
    socket.on('tutorial:complete', handleComplete);
    socket.on('tutorial:error', handleError);

    return () => {
      socket.off('tutorial:step', handleStep);
      socket.off('tutorial:complete', handleComplete);
      socket.off('tutorial:error', handleError);
    };
  }, [socket]);

  // Calculate progress percentage
  const progress = totalSteps > 0 ? Math.round((stepIndex / totalSteps) * 100) : 0;

  return {
    // State
    currentLesson,
    currentStep,
    stepIndex,
    totalSteps,
    tutorialState,
    isComplete,
    completionData,
    error,
    availableLessons,
    progress,

    // Actions
    fetchLessons,
    startLesson,
    requestHint,
    skipStep,
    stopTutorial
  };
}

export default useTutorial;
