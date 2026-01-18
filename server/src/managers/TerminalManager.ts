// ============================================================================
// TerminalManager - PTY Process Management with Demo Mode
// ============================================================================

import * as pty from 'node-pty';
import { v4 as uuidv4 } from 'uuid';
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

export class TerminalManager extends EventEmitter {
  private sessions: Map<string, TerminalSession> = new Map();
  private timeoutMs: number;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(timeoutMs: number = 30 * 60 * 1000) {
    super();
    this.timeoutMs = timeoutMs;
    this.startCleanupInterval();
  }

  /**
   * Create a new terminal session
   */
  create(cols: number = 80, rows: number = 24): string {
    const sessionId = uuidv4();

    // Determine shell based on platform
    const shell = process.platform === 'win32' ? 'powershell.exe' : '/bin/bash';
    const shellArgs = process.platform === 'win32' ? [] : ['--login'];

    const ptyProcess = pty.spawn(shell, shellArgs, {
      name: 'xterm-256color',
      cols,
      rows,
      cwd: process.env.HOME || process.cwd(),
      env: {
        ...process.env,
        TERM: 'xterm-256color',
        COLORTERM: 'truecolor'
      }
    });

    const session: TerminalSession = {
      id: sessionId,
      pty: ptyProcess,
      lastActivity: Date.now(),
      cols,
      rows
    };

    // Handle output
    ptyProcess.onData((data) => {
      session.lastActivity = Date.now();
      this.emit('output', sessionId, data);
    });

    // Handle exit
    ptyProcess.onExit(({ exitCode }) => {
      this.emit('exit', sessionId, exitCode);
      this.sessions.delete(sessionId);
    });

    this.sessions.set(sessionId, session);
    return sessionId;
  }

  /**
   * Write data to a terminal session
   */
  write(sessionId: string, data: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }
    session.lastActivity = Date.now();
    session.pty.write(data);
    return true;
  }

  /**
   * Resize a terminal session
   */
  resize(sessionId: string, cols: number, rows: number): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }
    session.cols = cols;
    session.rows = rows;
    session.pty.resize(cols, rows);
    return true;
  }

  /**
   * Destroy a terminal session
   */
  destroy(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }
    session.pty.kill();
    this.sessions.delete(sessionId);
    return true;
  }

  /**
   * Check if a session exists
   */
  exists(sessionId: string): boolean {
    return this.sessions.has(sessionId);
  }

  /**
   * Get session info
   */
  getSession(sessionId: string): TerminalSession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Demo mode: Type a command character by character
   * Returns a promise that resolves when typing is complete
   */
  async demoType(
    sessionId: string,
    command: string,
    delayMs: number = 75,
    pressEnter: boolean = true
  ): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }

    // Type each character with delay
    for (const char of command) {
      session.pty.write(char);
      await this.sleep(delayMs);
    }

    // Press enter if requested
    if (pressEnter) {
      await this.sleep(delayMs * 2); // Slight pause before enter
      session.pty.write('\r');
    }

    return true;
  }

  /**
   * Execute a command immediately (no typing animation)
   */
  executeCommand(sessionId: string, command: string): boolean {
    return this.write(sessionId, command + '\r');
  }

  /**
   * Clean up inactive sessions
   */
  private cleanupInactiveSessions(): void {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions) {
      if (now - session.lastActivity > this.timeoutMs) {
        console.log(`Cleaning up inactive session: ${sessionId}`);
        this.destroy(sessionId);
      }
    }
  }

  /**
   * Start the cleanup interval
   */
  private startCleanupInterval(): void {
    // Check every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupInactiveSessions();
    }, 5 * 60 * 1000);
  }

  /**
   * Stop the cleanup interval and destroy all sessions
   */
  shutdown(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    // Destroy all active sessions
    for (const sessionId of this.sessions.keys()) {
      this.destroy(sessionId);
    }
  }

  /**
   * Get active session count
   */
  getActiveSessionCount(): number {
    return this.sessions.size;
  }

  /**
   * Utility: sleep for ms milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const terminalManager = new TerminalManager();
