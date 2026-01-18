export interface ClientToServerEvents {
    'terminal:create': (callback: (response: TerminalCreateResponse) => void) => void;
    'terminal:input': (data: TerminalInputData) => void;
    'terminal:resize': (data: TerminalResizeData) => void;
    'terminal:destroy': (sessionId: string) => void;
    'tutorial:start': (data: TutorialStartData, callback: (response: TutorialStartResponse) => void) => void;
    'tutorial:hint': (callback: (response: TutorialHintResponse) => void) => void;
    'tutorial:skip': () => void;
    'tutorial:stop': () => void;
    'voice:mute': (muted: boolean) => void;
}
export interface ServerToClientEvents {
    'terminal:output': (data: TerminalOutputData) => void;
    'terminal:exit': (data: TerminalExitData) => void;
    'voice:speak': (data: VoiceSpeakData) => void;
    'voice:end': () => void;
    'tutorial:step': (data: TutorialStepData) => void;
    'tutorial:complete': (data: TutorialCompleteData) => void;
    'tutorial:error': (data: TutorialErrorData) => void;
    'error': (data: ErrorData) => void;
}
export interface TerminalCreateResponse {
    success: boolean;
    sessionId?: string;
    error?: string;
}
export interface TerminalInputData {
    sessionId: string;
    data: string;
}
export interface TerminalResizeData {
    sessionId: string;
    cols: number;
    rows: number;
}
export interface TerminalOutputData {
    sessionId: string;
    data: string;
}
export interface TerminalExitData {
    sessionId: string;
    exitCode: number;
}
export type VoiceSpeaker = 'Elisabeth' | 'Finn';
export interface VoiceSpeakData {
    audioUrl: string;
    text: string;
    speaker: VoiceSpeaker;
    duration?: number;
}
export interface VoiceConfig {
    speaker: VoiceSpeaker;
    text: string;
}
export declare const VOICE_MAPPING: Record<VoiceSpeaker, string>;
export type TutorialStepType = 'voice' | 'demo' | 'interactive';
export interface TutorialStep {
    id: string;
    type: TutorialStepType;
    voice?: VoiceConfig;
    terminal?: {
        command: string;
        demo?: boolean;
        demoDelay?: number;
    };
    validation?: {
        type: 'output-contains' | 'output-exact' | 'command-match';
        value: string;
    };
    hints?: string[];
    onSuccess?: string;
}
export interface Lesson {
    id: string;
    title: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    duration: string;
    description?: string;
    steps: TutorialStep[];
}
export interface TutorialStartData {
    lessonId: string;
}
export interface TutorialStartResponse {
    success: boolean;
    lesson?: {
        id: string;
        title: string;
        totalSteps: number;
    };
    error?: string;
}
export interface TutorialStepData {
    stepIndex: number;
    totalSteps: number;
    step: TutorialStep;
    state: TutorialState;
}
export interface TutorialCompleteData {
    lessonId: string;
    title: string;
    completionTime: number;
}
export interface TutorialHintResponse {
    success: boolean;
    hint?: string;
    hintIndex?: number;
    totalHints?: number;
}
export interface TutorialErrorData {
    message: string;
    recoverable: boolean;
}
export type TutorialState = 'IDLE' | 'VOICE_PLAYING' | 'DEMO_TYPING' | 'WAITING_INPUT' | 'VALIDATING' | 'STEP_COMPLETE' | 'LESSON_COMPLETE';
export interface Session {
    id: string;
    socketId: string;
    terminalSessionId?: string;
    currentLesson?: string;
    currentStep?: number;
    tutorialState: TutorialState;
    hintIndex: number;
    startTime?: number;
    lastActivity: number;
}
export interface ErrorData {
    code: string;
    message: string;
}
export interface ServerConfig {
    port: number;
    voiceOutputDir: string;
    sessionTimeoutMs: number;
    demoTypingDelayMs: number;
}
export declare const DEFAULT_CONFIG: ServerConfig;
//# sourceMappingURL=index.d.ts.map