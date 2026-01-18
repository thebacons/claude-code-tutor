// ============================================================================
// Type Definitions for Claude Code Tutor Backend
// ============================================================================
// Voice mapping to edge-tts voices
export const VOICE_MAPPING = {
    'Elisabeth': 'en-GB-SoniaNeural',
    'Finn': 'nb-NO-FinnNeural'
};
export const DEFAULT_CONFIG = {
    port: 3001,
    voiceOutputDir: './public/audio',
    sessionTimeoutMs: 30 * 60 * 1000, // 30 minutes
    demoTypingDelayMs: 75
};
//# sourceMappingURL=index.js.map