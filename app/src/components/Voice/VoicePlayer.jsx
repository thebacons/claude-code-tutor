// ============================================================================
// VoicePlayer - Audio Playback with Subtitles Display
// ============================================================================

import React from 'react';
import { Volume2, VolumeX, MessageSquare, User } from 'lucide-react';

export function VoicePlayer({
  isPlaying,
  currentText,
  currentSpeaker,
  showSubtitles
}) {
  if (!isPlaying && !currentText) {
    return null;
  }

  // Speaker avatars and colors
  const speakerConfig = {
    Elisabeth: {
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
      icon: '🎓'
    },
    Finn: {
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
      icon: '🎉'
    }
  };

  const config = speakerConfig[currentSpeaker] || speakerConfig.Elisabeth;

  return (
    <div className={`rounded-xl border ${config.borderColor} ${config.bgColor} p-4 transition-all duration-300`}>
      <div className="flex items-start gap-4">
        {/* Speaker Avatar */}
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center text-xl shadow-lg flex-shrink-0`}>
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Speaker Name & Status */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`font-semibold ${config.textColor}`}>
              {currentSpeaker}
            </span>
            {isPlaying && (
              <div className="flex items-center gap-1">
                <span className="text-gray-400 text-sm">Speaking</span>
                <div className="flex gap-1">
                  <span className="w-1 h-3 bg-current animate-pulse rounded-full" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1 h-4 bg-current animate-pulse rounded-full" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1 h-2 bg-current animate-pulse rounded-full" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
          </div>

          {/* Subtitles */}
          {showSubtitles && currentText && (
            <p className="text-gray-200 leading-relaxed">
              {currentText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default VoicePlayer;
