import { VoiceSpeaker } from '../types/index.js';
export interface VoiceResult {
    success: boolean;
    audioPath?: string;
    audioUrl?: string;
    duration?: number;
    error?: string;
}
export declare class VoiceManager {
    private outputDir;
    private publicPath;
    private queue;
    private isProcessing;
    constructor(outputDir?: string, publicPath?: string);
    /**
     * Ensure the output directory exists
     */
    private ensureOutputDir;
    /**
     * Synthesize speech using edge-tts CLI
     */
    speak(text: string, speaker?: VoiceSpeaker): Promise<VoiceResult>;
    /**
     * Process the voice queue
     */
    private processQueue;
    /**
     * Perform the actual synthesis using edge-tts CLI
     */
    private synthesize;
    /**
     * Clean up old audio files (older than specified age)
     */
    cleanup(maxAgeMs?: number): Promise<number>;
    /**
     * Check if edge-tts is available
     */
    checkAvailability(): Promise<boolean>;
    /**
     * Get available voices
     */
    listVoices(): Promise<string[]>;
    /**
     * Delete a specific audio file
     */
    deleteAudio(audioUrl: string): boolean;
    /**
     * Start periodic cleanup
     */
    startPeriodicCleanup(intervalMs?: number): NodeJS.Timeout;
}
export declare const voiceManager: VoiceManager;
//# sourceMappingURL=VoiceManager.d.ts.map