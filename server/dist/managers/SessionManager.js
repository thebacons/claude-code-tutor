// ============================================================================
// SessionManager - User Session Management
// ============================================================================
import { v4 as uuidv4 } from 'uuid';
export class SessionManager {
    sessions = new Map();
    socketToSession = new Map();
    timeoutMs;
    cleanupInterval = null;
    constructor(timeoutMs = 30 * 60 * 1000) {
        this.timeoutMs = timeoutMs;
        this.startCleanupInterval();
    }
    /**
     * Create a new session for a socket connection
     */
    createSession(socketId) {
        const sessionId = uuidv4();
        const session = {
            id: sessionId,
            socketId,
            tutorialState: 'IDLE',
            hintIndex: 0,
            lastActivity: Date.now()
        };
        this.sessions.set(sessionId, session);
        this.socketToSession.set(socketId, sessionId);
        console.log(`[SessionManager] Created session: ${sessionId} for socket: ${socketId}`);
        return session;
    }
    /**
     * Get session by session ID
     */
    getSession(sessionId) {
        return this.sessions.get(sessionId);
    }
    /**
     * Get session by socket ID
     */
    getSessionBySocket(socketId) {
        const sessionId = this.socketToSession.get(socketId);
        return sessionId ? this.sessions.get(sessionId) : undefined;
    }
    /**
     * Update session
     */
    updateSession(sessionId, updates) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            return undefined;
        }
        Object.assign(session, updates, { lastActivity: Date.now() });
        return session;
    }
    /**
     * Update session tutorial state
     */
    setTutorialState(sessionId, state) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.tutorialState = state;
            session.lastActivity = Date.now();
        }
    }
    /**
     * Associate terminal session with user session
     */
    setTerminalSession(sessionId, terminalSessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.terminalSessionId = terminalSessionId;
            session.lastActivity = Date.now();
        }
    }
    /**
     * Set current lesson
     */
    setCurrentLesson(sessionId, lessonId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.currentLesson = lessonId;
            session.currentStep = 0;
            session.hintIndex = 0;
            session.startTime = Date.now();
            session.lastActivity = Date.now();
        }
    }
    /**
     * Clear current lesson
     */
    clearCurrentLesson(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.currentLesson = undefined;
            session.currentStep = undefined;
            session.tutorialState = 'IDLE';
            session.hintIndex = 0;
            session.startTime = undefined;
            session.lastActivity = Date.now();
        }
    }
    /**
     * Update last activity timestamp
     */
    touch(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.lastActivity = Date.now();
        }
    }
    /**
     * Destroy session
     */
    destroySession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            return false;
        }
        this.socketToSession.delete(session.socketId);
        this.sessions.delete(sessionId);
        console.log(`[SessionManager] Destroyed session: ${sessionId}`);
        return true;
    }
    /**
     * Destroy session by socket ID
     */
    destroySessionBySocket(socketId) {
        const sessionId = this.socketToSession.get(socketId);
        if (!sessionId) {
            return false;
        }
        return this.destroySession(sessionId);
    }
    /**
     * Get all active sessions
     */
    getAllSessions() {
        return Array.from(this.sessions.values());
    }
    /**
     * Get active session count
     */
    getActiveSessionCount() {
        return this.sessions.size;
    }
    /**
     * Clean up inactive sessions
     */
    cleanupInactiveSessions() {
        const now = Date.now();
        const toRemove = [];
        for (const [sessionId, session] of this.sessions) {
            if (now - session.lastActivity > this.timeoutMs) {
                toRemove.push(sessionId);
            }
        }
        for (const sessionId of toRemove) {
            console.log(`[SessionManager] Cleaning up inactive session: ${sessionId}`);
            this.destroySession(sessionId);
        }
    }
    /**
     * Start cleanup interval
     */
    startCleanupInterval() {
        // Check every 5 minutes
        this.cleanupInterval = setInterval(() => {
            this.cleanupInactiveSessions();
        }, 5 * 60 * 1000);
    }
    /**
     * Shutdown and cleanup
     */
    shutdown() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
        // Destroy all sessions
        for (const sessionId of this.sessions.keys()) {
            this.destroySession(sessionId);
        }
    }
}
// Export singleton instance
export const sessionManager = new SessionManager();
//# sourceMappingURL=SessionManager.js.map