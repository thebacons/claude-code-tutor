// ============================================================================
// useVoice - Voice Playback Management Hook
// ============================================================================

import { useState, useCallback, useRef, useEffect } from 'react';

export function useVoice(socket) {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [currentSpeaker, setCurrentSpeaker] = useState('');
  const [volume, setVolume] = useState(1.0);
  const [showSubtitles, setShowSubtitles] = useState(true);

  const audioRef = useRef(null);
  const audioQueueRef = useRef([]);
  const isProcessingRef = useRef(false);

  // Process audio queue
  const processQueue = useCallback(async () => {
    if (isProcessingRef.current || audioQueueRef.current.length === 0) {
      return;
    }

    isProcessingRef.current = true;
    const { audioUrl, text, speaker } = audioQueueRef.current.shift();

    setCurrentText(text);
    setCurrentSpeaker(speaker);
    setIsPlaying(true);

    if (!isMuted && audioUrl) {
      try {
        // Create audio element
        const audio = new Audio(`http://localhost:3001${audioUrl}`);
        audio.volume = volume;
        audioRef.current = audio;

        // Wait for audio to finish
        await new Promise((resolve, reject) => {
          audio.onended = resolve;
          audio.onerror = reject;
          audio.play().catch(reject);
        });
      } catch (error) {
        console.error('[Voice] Playback error:', error);
      }
    } else {
      // If muted, wait based on text length (rough estimation)
      const estimatedDuration = Math.max(2000, text.length * 50);
      await new Promise(resolve => setTimeout(resolve, estimatedDuration));
    }

    setIsPlaying(false);
    setCurrentText('');
    setCurrentSpeaker('');
    isProcessingRef.current = false;

    // Process next item in queue
    processQueue();
  }, [isMuted, volume]);

  // Handle voice:speak event from server
  useEffect(() => {
    if (!socket?.on) return;

    const handleSpeak = (data) => {
      console.log('[Voice] Received:', data.speaker, data.text.substring(0, 50) + '...');
      audioQueueRef.current.push(data);
      processQueue();
    };

    const handleVoiceEnd = () => {
      console.log('[Voice] End signal received');
    };

    socket.on('voice:speak', handleSpeak);
    socket.on('voice:end', handleVoiceEnd);

    return () => {
      socket.off('voice:speak', handleSpeak);
      socket.off('voice:end', handleVoiceEnd);
    };
  }, [socket, processQueue]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);

    // Notify server
    if (socket?.emit) {
      socket.emit('voice:mute', newMuted);
    }

    // Stop current audio if muting
    if (newMuted && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isMuted, socket]);

  // Set volume
  const updateVolume = useCallback((newVolume) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  // Toggle subtitles
  const toggleSubtitles = useCallback(() => {
    setShowSubtitles(prev => !prev);
  }, []);

  // Skip current audio
  const skipAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = audioRef.current.duration;
    }
    setIsPlaying(false);
    isProcessingRef.current = false;
    processQueue();
  }, [processQueue]);

  // Clear queue
  const clearQueue = useCallback(() => {
    audioQueueRef.current = [];
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setCurrentText('');
    setCurrentSpeaker('');
    isProcessingRef.current = false;
  }, []);

  return {
    // State
    isMuted,
    isPlaying,
    currentText,
    currentSpeaker,
    volume,
    showSubtitles,

    // Actions
    toggleMute,
    updateVolume,
    toggleSubtitles,
    skipAudio,
    clearQueue
  };
}

export default useVoice;
