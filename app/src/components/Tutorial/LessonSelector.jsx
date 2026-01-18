// ============================================================================
// LessonSelector - Choose a Lesson to Start
// ============================================================================

import React, { useEffect } from 'react';
import { Play, Clock, BookOpen, Rocket, RefreshCw, FileText, Loader2 } from 'lucide-react';

// Icon mapping for lessons
const lessonIcons = {
  'getting-started': Rocket,
  'session-management': RefreshCw,
  'claude-md-basics': FileText
};

// Level colors
const levelColors = {
  beginner: 'from-green-500 to-emerald-600',
  intermediate: 'from-blue-500 to-indigo-600',
  advanced: 'from-purple-500 to-pink-600'
};

const levelBadgeColors = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-blue-100 text-blue-700',
  advanced: 'bg-purple-100 text-purple-700'
};

export function LessonSelector({
  lessons,
  isLoading,
  onSelect,
  onRefresh,
  currentLesson
}) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-400" />
          Available Lessons
        </h2>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Loading State */}
      {isLoading && lessons.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          <span className="text-gray-400 ml-3">Loading lessons...</span>
        </div>
      )}

      {/* Lessons List */}
      {lessons.length > 0 && (
        <div className="grid gap-4">
          {lessons.map((lesson) => {
            const Icon = lessonIcons[lesson.id] || BookOpen;
            const isActive = currentLesson?.id === lesson.id;

            return (
              <div
                key={lesson.id}
                className={`bg-gray-800 rounded-xl border transition-all ${
                  isActive
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="p-4 flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${levelColors[lesson.level]} flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-white">
                          {lesson.title}
                        </h3>
                        {lesson.description && (
                          <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                            {lesson.description}
                          </p>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${levelBadgeColors[lesson.level]}`}>
                        {lesson.level}
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {lesson.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {lesson.stepCount} steps
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="px-4 pb-4">
                  <button
                    onClick={() => onSelect(lesson.id)}
                    disabled={isActive}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                      isActive
                        ? 'bg-blue-500/20 text-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        In Progress...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Start Lesson
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && lessons.length === 0 && (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No lessons available</p>
          <button
            onClick={onRefresh}
            className="mt-3 text-blue-400 hover:text-blue-300 text-sm"
          >
            Try refreshing
          </button>
        </div>
      )}
    </div>
  );
}

export default LessonSelector;
