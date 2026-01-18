// ============================================================================
// CompletionModal - Lesson Completion Celebration
// ============================================================================

import React from 'react';
import { Trophy, Clock, ArrowRight, X } from 'lucide-react';

export function CompletionModal({
  isOpen,
  completionData,
  onClose,
  onNextLesson
}) {
  if (!isOpen || !completionData) {
    return null;
  }

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gray-800 rounded-2xl border border-gray-700 p-8 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Trophy Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
            <Trophy className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          Lesson Complete!
        </h2>

        {/* Lesson Name */}
        <p className="text-gray-400 text-center mb-6">
          {completionData.title}
        </p>

        {/* Stats */}
        <div className="bg-gray-700/50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="text-gray-300">Completion time:</span>
            <span className="font-bold text-white">
              {formatTime(completionData.completionTime)}
            </span>
          </div>
        </div>

        {/* Celebration Message */}
        <p className="text-gray-300 text-center mb-6">
          Great job! You've mastered the basics of this topic.
          Keep practicing to build your skills!
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors font-medium"
          >
            Close
          </button>
          <button
            onClick={onNextLesson}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all font-medium flex items-center justify-center gap-2"
          >
            Next Lesson
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompletionModal;
