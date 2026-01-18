// ============================================================================
// VoiceControls - Mute, Volume, and Subtitle Controls
// ============================================================================

import React from 'react';
import { Volume2, VolumeX, Subtitles, SkipForward } from 'lucide-react';

export function VoiceControls({
  isMuted,
  volume,
  showSubtitles,
  isPlaying,
  onToggleMute,
  onVolumeChange,
  onToggleSubtitles,
  onSkip
}) {
  return (
    <div className="flex items-center gap-4 bg-gray-800 rounded-lg px-4 py-2">
      {/* Mute Button */}
      <button
        onClick={onToggleMute}
        className={`p-2 rounded-lg transition-colors ${
          isMuted
            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>

      {/* Volume Slider */}
      <div className="flex items-center gap-2">
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-24 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
          disabled={isMuted}
        />
        <span className="text-gray-400 text-sm w-8">
          {Math.round(volume * 100)}%
        </span>
      </div>

      {/* Subtitles Toggle */}
      <button
        onClick={onToggleSubtitles}
        className={`p-2 rounded-lg transition-colors ${
          showSubtitles
            ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
        title={showSubtitles ? 'Hide Subtitles' : 'Show Subtitles'}
      >
        <Subtitles className="w-5 h-5" />
      </button>

      {/* Skip Button (only visible when playing) */}
      {isPlaying && (
        <button
          onClick={onSkip}
          className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
          title="Skip current audio"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export default VoiceControls;
