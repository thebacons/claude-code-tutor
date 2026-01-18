// ============================================================================
// VoiceManager - Edge TTS CLI Integration for Voice Synthesis
// ============================================================================

import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { VoiceSpeaker, VOICE_MAPPING } from '../types/index.js';

const execAsync = promisify(exec);

export interface VoiceResult {
  success: boolean;
  audioPath?: string;
  audioUrl?: string;
  duration?: number;
  error?: string;
}

interface QueueItem {
  id: string;
  text: string;
  speaker: VoiceSpeaker;
  resolve: (result: VoiceResult) => void;
  reject: (error: Error) => void;
}

export class VoiceManager {
  private outputDir: string;
  private publicPath: string;
  private queue: QueueItem[] = [];
  private isProcessing: boolean = false;

  constructor(outputDir: string = './public/audio', publicPath: string = '/audio') {
    this.outputDir = outputDir;
    this.publicPath = publicPath;
    this.ensureOutputDir();
  }

  /**
   * Ensure the output directory exists
   */
  private ensureOutputDir(): void {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Synthesize speech using edge-tts CLI
   */
  async speak(text: string, speaker: VoiceSpeaker = 'Elisabeth'): Promise<VoiceResult> {
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      this.queue.push({ id, text, speaker, resolve, reject });
      this.processQueue();
    });
  }

  /**
   * Process the voice queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const item = this.queue.shift()!;

    try {
      const result = await this.synthesize(item.text, item.speaker, item.id);
      item.resolve(result);
    } catch (error) {
      item.reject(error as Error);
    }

    this.isProcessing = false;
    this.processQueue();
  }

  /**
   * Perform the actual synthesis using edge-tts CLI
   */
  private async synthesize(
    text: string,
    speaker: VoiceSpeaker,
    id: string
  ): Promise<VoiceResult> {
    const voice = VOICE_MAPPING[speaker];
    const filename = `voice_${id}.mp3`;
    const outputPath = path.join(this.outputDir, filename);
    const audioUrl = `${this.publicPath}/${filename}`;

    // Escape text for shell
    const escapedText = text
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\$/g, '\\$')
      .replace(/`/g, '\\`');

    // Build edge-tts command
    const command = `edge-tts --voice "${voice}" --text "${escapedText}" --write-media "${outputPath}"`;

    try {
      console.log(`[VoiceManager] Synthesizing: "${text.substring(0, 50)}..." with ${speaker}`);
      await execAsync(command, { timeout: 30000 });

      // Verify file was created
      if (!fs.existsSync(outputPath)) {
        return {
          success: false,
          error: 'Audio file was not created'
        };
      }

      // Get file stats for duration estimation (rough estimate based on file size)
      const stats = fs.statSync(outputPath);
      // Rough estimation: ~16KB per second for MP3 at 128kbps
      const estimatedDuration = Math.ceil(stats.size / 16000);

      console.log(`[VoiceManager] Generated: ${audioUrl} (~${estimatedDuration}s)`);

      return {
        success: true,
        audioPath: outputPath,
        audioUrl,
        duration: estimatedDuration
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[VoiceManager] Error: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Clean up old audio files (older than specified age)
   */
  async cleanup(maxAgeMs: number = 60 * 60 * 1000): Promise<number> {
    let cleaned = 0;
    const now = Date.now();

    try {
      const files = fs.readdirSync(this.outputDir);
      for (const file of files) {
        if (!file.startsWith('voice_') || !file.endsWith('.mp3')) {
          continue;
        }

        const filePath = path.join(this.outputDir, file);
        const stats = fs.statSync(filePath);
        const age = now - stats.mtimeMs;

        if (age > maxAgeMs) {
          fs.unlinkSync(filePath);
          cleaned++;
        }
      }
    } catch (error) {
      console.error('[VoiceManager] Cleanup error:', error);
    }

    if (cleaned > 0) {
      console.log(`[VoiceManager] Cleaned up ${cleaned} old audio files`);
    }

    return cleaned;
  }

  /**
   * Check if edge-tts is available
   */
  async checkAvailability(): Promise<boolean> {
    try {
      await execAsync('edge-tts --version', { timeout: 5000 });
      return true;
    } catch {
      console.error('[VoiceManager] edge-tts is not available. Install with: pip install edge-tts');
      return false;
    }
  }

  /**
   * Get available voices
   */
  async listVoices(): Promise<string[]> {
    try {
      const { stdout } = await execAsync('edge-tts --list-voices', { timeout: 10000 });
      return stdout.split('\n').filter(line => line.trim());
    } catch {
      return [];
    }
  }

  /**
   * Delete a specific audio file
   */
  deleteAudio(audioUrl: string): boolean {
    try {
      const filename = path.basename(audioUrl);
      const filePath = path.join(this.outputDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Start periodic cleanup
   */
  startPeriodicCleanup(intervalMs: number = 60 * 60 * 1000): NodeJS.Timeout {
    return setInterval(() => {
      this.cleanup();
    }, intervalMs);
  }
}

// Export singleton instance
export const voiceManager = new VoiceManager();
