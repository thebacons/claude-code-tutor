import { EventEmitter } from 'events';
import { Lesson, TutorialStep, TutorialState, TutorialCompleteData, VoiceSpeaker } from '../types/index.js';
import { VoiceManager } from './VoiceManager.js';
import { TerminalManager } from './TerminalManager.js';
export interface TutorialContext {
    lessonId: string;
    lesson: Lesson;
    currentStepIndex: number;
    state: TutorialState;
    hintIndex: number;
    startTime: number;
    terminalSessionId?: string;
    lastOutput: string;
    outputBuffer: string[];
}
export interface TutorialEngineEvents {
    'step': (context: TutorialContext, step: TutorialStep) => void;
    'voice': (text: string, speaker: VoiceSpeaker, audioUrl: string) => void;
    'demo-start': (command: string) => void;
    'demo-complete': () => void;
    'waiting-input': (step: TutorialStep) => void;
    'validation-success': (message: string) => void;
    'validation-fail': (message: string) => void;
    'complete': (data: TutorialCompleteData) => void;
    'error': (message: string, recoverable: boolean) => void;
}
export declare class TutorialEngine extends EventEmitter {
    private lessons;
    private contexts;
    private lessonsDir;
    private voiceManager;
    private terminalManager;
    constructor(lessonsDir: string, voiceManager: VoiceManager, terminalManager: TerminalManager);
    /**
     * Load all lesson YAML files from the lessons directory
     */
    private loadLessons;
    /**
     * Get list of available lessons
     */
    getLessons(): Lesson[];
    /**
     * Get a specific lesson by ID
     */
    getLesson(lessonId: string): Lesson | undefined;
    /**
     * Start a lesson for a session
     */
    startLesson(sessionId: string, lessonId: string, terminalSessionId?: string): Promise<{
        success: boolean;
        error?: string;
    }>;
    /**
     * Stop the current tutorial for a session
     */
    stopLesson(sessionId: string): void;
    /**
     * Get current tutorial context for a session
     */
    getContext(sessionId: string): TutorialContext | undefined;
    /**
     * Execute the current step
     */
    executeStep(sessionId: string): Promise<void>;
    /**
     * Handle a voice-only step
     */
    private handleVoiceStep;
    /**
     * Handle a demo step (automated typing)
     */
    private handleDemoStep;
    /**
     * Handle an interactive step (wait for user input)
     */
    private handleInteractiveStep;
    /**
     * Process terminal output for validation
     */
    processOutput(sessionId: string, output: string): void;
    /**
     * Validate user input against current step
     */
    validateInput(sessionId: string): Promise<boolean>;
    /**
     * Get a hint for the current step
     */
    getHint(sessionId: string): {
        hint: string;
        index: number;
        total: number;
    } | null;
    /**
     * Advance to the next step
     */
    private advanceStep;
    /**
     * Complete the lesson
     */
    private completelesson;
    /**
     * Skip current step
     */
    skipStep(sessionId: string): Promise<void>;
    /**
     * Reload lessons from disk
     */
    reloadLessons(): void;
    /**
     * Utility: sleep for ms milliseconds
     */
    private sleep;
}
//# sourceMappingURL=TutorialEngine.d.ts.map