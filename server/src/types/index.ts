// ============================================================================
// Type Definitions for Claude Code Tutor Backend
// ============================================================================

// WebSocket Events - Client to Server
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

// WebSocket Events - Server to Client
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

// Terminal Types
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

// Voice Types
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

// Voice mapping to edge-tts voices
export const VOICE_MAPPING: Record<VoiceSpeaker, string> = {
  'Elisabeth': 'en-GB-SoniaNeural',
  'Finn': 'nb-NO-FinnNeural'
};

// Tutorial Types
export type TutorialStepType = 'voice' | 'demo' | 'interactive';

export interface TutorialStep {
  id: string;
  type: TutorialStepType;
  voice?: VoiceConfig;
  terminal?: {
    command: string;
    demo?: boolean;
    demoDelay?: number; // ms per character, default 75
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
  completionTime: number; // seconds
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

// Tutorial State Machine
export type TutorialState =
  | 'IDLE'
  | 'VOICE_PLAYING'
  | 'DEMO_TYPING'
  | 'WAITING_INPUT'
  | 'VALIDATING'
  | 'STEP_COMPLETE'
  | 'LESSON_COMPLETE';

// Session Types
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

// Error Types
export interface ErrorData {
  code: string;
  message: string;
}

// Server Configuration
export interface ServerConfig {
  port: number;
  voiceOutputDir: string;
  sessionTimeoutMs: number;
  demoTypingDelayMs: number;
}

export const DEFAULT_CONFIG: ServerConfig = {
  port: 3001,
  voiceOutputDir: './public/audio',
  sessionTimeoutMs: 30 * 60 * 1000, // 30 minutes
  demoTypingDelayMs: 75
};
