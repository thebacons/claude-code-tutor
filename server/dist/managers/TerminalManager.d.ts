import * as pty from 'node-pty';
import { EventEmitter } from 'events';
export interface TerminalSession {
    id: string;
    pty: pty.IPty;
    lastActivity: number;
    cols: number;
    rows: number;
}
export interface TerminalManagerEvents {
    'output': (sessionId: string, data: string) => void;
    'exit': (sessionId: string, exitCode: number) => void;
}
export declare class TerminalManager extends EventEmitter {
    private sessions;
    private timeoutMs;
    private cleanupInterval;
    constructor(timeoutMs?: number);
    /**
     * Create a new terminal session
     */
    create(cols?: number, rows?: number): string;
    /**
     * Write data to a terminal session
     */
    write(sessionId: string, data: string): boolean;
    /**
     * Resize a terminal session
     */
    resize(sessionId: string, cols: number, rows: number): boolean;
    /**
     * Destroy a terminal session
     */
    destroy(sessionId: string): boolean;
    /**
     * Check if a session exists
     */
    exists(sessionId: string): boolean;
    /**
     * Get session info
     */
    getSession(sessionId: string): TerminalSession | undefined;
    /**
     * Demo mode: Type a command character by character
     * Returns a promise that resolves when typing is complete
     */
    demoType(sessionId: string, command: string, delayMs?: number, pressEnter?: boolean): Promise<boolean>;
    /**
     * Execute a command immediately (no typing animation)
     */
    executeCommand(sessionId: string, command: string): boolean;
    /**
     * Clean up inactive sessions
     */
    private cleanupInactiveSessions;
    /**
     * Start the cleanup interval
     */
    private startCleanupInterval;
    /**
     * Stop the cleanup interval and destroy all sessions
     */
    shutdown(): void;
    /**
     * Get active session count
     */
    getActiveSessionCount(): number;
    /**
     * Utility: sleep for ms milliseconds
     */
    private sleep;
}
export declare const terminalManager: TerminalManager;
//# sourceMappingURL=TerminalManager.d.ts.map