import { Session, TutorialState } from '../types/index.js';
export declare class SessionManager {
    private sessions;
    private socketToSession;
    private timeoutMs;
    private cleanupInterval;
    constructor(timeoutMs?: number);
    /**
     * Create a new session for a socket connection
     */
    createSession(socketId: string): Session;
    /**
     * Get session by session ID
     */
    getSession(sessionId: string): Session | undefined;
    /**
     * Get session by socket ID
     */
    getSessionBySocket(socketId: string): Session | undefined;
    /**
     * Update session
     */
    updateSession(sessionId: string, updates: Partial<Session>): Session | undefined;
    /**
     * Update session tutorial state
     */
    setTutorialState(sessionId: string, state: TutorialState): void;
    /**
     * Associate terminal session with user session
     */
    setTerminalSession(sessionId: string, terminalSessionId: string): void;
    /**
     * Set current lesson
     */
    setCurrentLesson(sessionId: string, lessonId: string): void;
    /**
     * Clear current lesson
     */
    clearCurrentLesson(sessionId: string): void;
    /**
     * Update last activity timestamp
     */
    touch(sessionId: string): void;
    /**
     * Destroy session
     */
    destroySession(sessionId: string): boolean;
    /**
     * Destroy session by socket ID
     */
    destroySessionBySocket(socketId: string): boolean;
    /**
     * Get all active sessions
     */
    getAllSessions(): Session[];
    /**
     * Get active session count
     */
    getActiveSessionCount(): number;
    /**
     * Clean up inactive sessions
     */
    private cleanupInactiveSessions;
    /**
     * Start cleanup interval
     */
    private startCleanupInterval;
    /**
     * Shutdown and cleanup
     */
    shutdown(): void;
}
export declare const sessionManager: SessionManager;
//# sourceMappingURL=SessionManager.d.ts.map