// ============================================================================
// GuidedTutorial - Main Tutorial Interface with Voice and Terminal
// ============================================================================

import React, { useEffect, useState, useMemo } from 'react';
import { Wifi, WifiOff, HelpCircle, SkipForward, StopCircle, Lightbulb } from 'lucide-react';

import { useWebSocket } from '../../hooks/useWebSocket.js';
import { useTutorial } from '../../hooks/useTutorial.js';
import { useVoice } from '../../hooks/useVoice.js';

import { LiveTerminal } from '../Terminal/LiveTerminal.jsx';
import { VoicePlayer } from '../Voice/VoicePlayer.jsx';
import { VoiceControls } from '../Voice/VoiceControls.jsx';
import { TutorialProgress } from './TutorialProgress.jsx';
import { LessonSelector } from './LessonSelector.jsx';
import { CompletionModal } from './CompletionModal.jsx';

export function GuidedTutorial() {
  const [currentHint, setCurrentHint] = useState(null);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);

  // Initialize WebSocket connection
  const {
    isConnected,
    connectionError,
    emit,
    on,
    off,
    getSocket
  } = useWebSocket();

  // Memoize socket-like object to prevent re-renders causing duplicate terminals
  const socket = useMemo(() => ({ emit, on, off }), [emit, on, off]);

  // Initialize tutorial state
  const {
    currentLesson,
    currentStep,
    stepIndex,
    totalSteps,
    tutorialState,
    isComplete,
    completionData,
    error: tutorialError,
    availableLessons,
    progress,
    validationMessage,
    completedSteps,
    lastValidationResult,
    fetchLessons,
    startLesson,
    requestHint,
    skipStep,
    stopTutorial
  } = useTutorial(socket);

  // Initialize voice playback
  const {
    isMuted,
    isPlaying,
    currentText,
    currentSpeaker,
    volume,
    showSubtitles,
    toggleMute,
    updateVolume,
    toggleSubtitles,
    skipAudio,
    clearQueue
  } = useVoice(socket);

  // Fetch lessons on connection
  useEffect(() => {
    if (isConnected) {
      setIsLoadingLessons(true);
      fetchLessons().finally(() => setIsLoadingLessons(false));
    }
  }, [isConnected, fetchLessons]);

  // Handle lesson start
  const handleStartLesson = async (lessonId) => {
    setCurrentHint(null);
    try {
      await startLesson(lessonId);
    } catch (err) {
      console.error('Failed to start lesson:', err);
    }
  };

  // Handle hint request
  const handleRequestHint = async () => {
    const result = await requestHint();
    if (result) {
      setCurrentHint(result);
    }
  };

  // Handle stop tutorial
  const handleStop = () => {
    clearQueue();
    stopTutorial();
    setCurrentHint(null);
  };

  // Handle completion modal close
  const handleCloseCompletion = () => {
    // Reset state handled by stopTutorial
  };

  // Handle next lesson
  const handleNextLesson = () => {
    // Find current lesson index and start next one
    const currentIndex = availableLessons.findIndex(l => l.id === completionData?.lessonId);
    if (currentIndex >= 0 && currentIndex < availableLessons.length - 1) {
      handleStartLesson(availableLessons[currentIndex + 1].id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status Banner */}
      {!isConnected && (
        <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 flex items-center gap-3">
          <WifiOff className="w-6 h-6 text-red-400" />
          <div>
            <h3 className="font-medium text-red-300">Not Connected</h3>
            <p className="text-red-400 text-sm">
              {connectionError || 'Unable to connect to the tutorial server. Make sure the backend is running on port 3001.'}
            </p>
          </div>
        </div>
      )}

      {isConnected && (
        <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-4 flex items-center gap-3">
          <Wifi className="w-6 h-6 text-green-400" />
          <div>
            <h3 className="font-medium text-green-300">Connected to Tutorial Server</h3>
            <p className="text-green-400 text-sm">
              Ready for voice-guided training with real terminal sessions.
            </p>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Lesson Selector / Tutorial Progress */}
        <div className="lg:col-span-1 space-y-4">
          {!currentLesson ? (
            <LessonSelector
              lessons={availableLessons}
              isLoading={isLoadingLessons}
              onSelect={handleStartLesson}
              onRefresh={fetchLessons}
              currentLesson={currentLesson}
            />
          ) : (
            <>
              {/* Tutorial Progress */}
              <TutorialProgress
                currentStep={currentStep}
                stepIndex={stepIndex}
                totalSteps={totalSteps}
                tutorialState={tutorialState}
                lessonTitle={currentLesson.title}
                validationMessage={validationMessage}
                completedSteps={completedSteps}
                lastValidationResult={lastValidationResult}
              />

              {/* Tutorial Controls */}
              <div className="flex gap-2">
                <button
                  onClick={handleRequestHint}
                  disabled={tutorialState !== 'WAITING_INPUT'}
                  className="flex-1 py-2 px-4 rounded-lg bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                  Hint
                </button>
                <button
                  onClick={skipStep}
                  disabled={tutorialState === 'LESSON_COMPLETE'}
                  className="flex-1 py-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                  Skip
                </button>
                <button
                  onClick={handleStop}
                  className="py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <StopCircle className="w-4 h-4" />
                  Stop
                </button>
              </div>

              {/* Hint Display */}
              {currentHint && (
                <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-yellow-200">{currentHint.hint}</p>
                      <p className="text-yellow-400/70 text-sm mt-1">
                        Hint {currentHint.index + 1} of {currentHint.total}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Column: Terminal and Voice */}
        <div className="lg:col-span-2 space-y-4">
          {/* Voice Controls */}
          <VoiceControls
            isMuted={isMuted}
            volume={volume}
            showSubtitles={showSubtitles}
            isPlaying={isPlaying}
            onToggleMute={toggleMute}
            onVolumeChange={updateVolume}
            onToggleSubtitles={toggleSubtitles}
            onSkip={skipAudio}
          />

          {/* Voice Player (Subtitles) */}
          {(isPlaying || currentText) && (
            <VoicePlayer
              isPlaying={isPlaying}
              currentText={currentText}
              currentSpeaker={currentSpeaker}
              showSubtitles={showSubtitles}
            />
          )}

          {/* Live Terminal */}
          <LiveTerminal
            socket={socket}
            isConnected={isConnected}
            onReady={() => console.log('[GuidedTutorial] Terminal ready')}
          />

          {/* Error Display */}
          {tutorialError && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4">
              <p className="text-red-300">{tutorialError}</p>
            </div>
          )}
        </div>
      </div>

      {/* Completion Modal */}
      <CompletionModal
        isOpen={isComplete}
        completionData={completionData}
        onClose={handleCloseCompletion}
        onNextLesson={handleNextLesson}
      />
    </div>
  );
}

export default GuidedTutorial;
