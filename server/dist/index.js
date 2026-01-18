// ============================================================================
// Claude Code Tutor - Backend Server
// Voice-guided training platform with real terminal integration
// ============================================================================
import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { TerminalManager } from './managers/TerminalManager.js';
import { VoiceManager } from './managers/VoiceManager.js';
import { TutorialEngine } from './managers/TutorialEngine.js';
import { SessionManager } from './managers/SessionManager.js';
import { DEFAULT_CONFIG } from './types/index.js';
// Load environment variables
dotenv.config();
// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Configuration
const PORT = parseInt(process.env.PORT || String(DEFAULT_CONFIG.port), 10);
const VOICE_OUTPUT_DIR = process.env.VOICE_OUTPUT_DIR || path.join(__dirname, '../public/audio');
const LESSONS_DIR = process.env.LESSONS_DIR || path.join(__dirname, '../src/tutorials/lessons');
const SESSION_TIMEOUT_MS = parseInt(process.env.SESSION_TIMEOUT_MS || String(DEFAULT_CONFIG.sessionTimeoutMs), 10);
// Initialize Express
const app = express();
const httpServer = createServer(app);
// Initialize Socket.IO
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN || ['http://localhost:5173', 'http://localhost:5174'],
        methods: ['GET', 'POST']
    }
});
// Middleware
app.use(cors());
app.use(express.json());
// Serve static files (voice audio)
app.use('/audio', express.static(path.join(__dirname, '../public/audio')));
// Initialize managers
const terminalManager = new TerminalManager(SESSION_TIMEOUT_MS);
const voiceManager = new VoiceManager(VOICE_OUTPUT_DIR, '/audio');
const sessionManager = new SessionManager(SESSION_TIMEOUT_MS);
const tutorialEngine = new TutorialEngine(LESSONS_DIR, voiceManager, terminalManager);
// REST API Routes
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        sessions: sessionManager.getActiveSessionCount(),
        terminals: terminalManager.getActiveSessionCount()
    });
});
app.get('/api/lessons', (req, res) => {
    const lessons = tutorialEngine.getLessons().map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        level: lesson.level,
        duration: lesson.duration,
        description: lesson.description,
        stepCount: lesson.steps.length
    }));
    res.json({ lessons });
});
app.get('/api/lessons/:id', (req, res) => {
    const lesson = tutorialEngine.getLesson(req.params.id);
    if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
    }
    res.json({ lesson });
});
// WebSocket Connection Handler
io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);
    // Create session for this connection
    const session = sessionManager.createSession(socket.id);
    // ============================================================================
    // Terminal Events
    // ============================================================================
    socket.on('terminal:create', (callback) => {
        try {
            const terminalSessionId = terminalManager.create();
            sessionManager.setTerminalSession(session.id, terminalSessionId);
            // Forward terminal output to client
            terminalManager.on('output', (sessionId, data) => {
                if (sessionId === terminalSessionId) {
                    socket.emit('terminal:output', { sessionId: terminalSessionId, data });
                    // Also process for tutorial validation
                    const ctx = tutorialEngine.getContext(session.id);
                    if (ctx) {
                        tutorialEngine.processOutput(session.id, data);
                    }
                }
            });
            // Handle terminal exit
            terminalManager.on('exit', (sessionId, exitCode) => {
                if (sessionId === terminalSessionId) {
                    socket.emit('terminal:exit', { sessionId: terminalSessionId, exitCode });
                }
            });
            callback({ success: true, sessionId: terminalSessionId });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to create terminal';
            callback({ success: false, error: message });
        }
    });
    socket.on('terminal:input', (data) => {
        sessionManager.touch(session.id);
        if (!terminalManager.write(data.sessionId, data.data)) {
            socket.emit('error', {
                code: 'TERMINAL_NOT_FOUND',
                message: 'Terminal session not found'
            });
        }
        // Check for Enter key - trigger validation for interactive steps
        if (data.data === '\r' || data.data === '\n') {
            const ctx = tutorialEngine.getContext(session.id);
            if (ctx && ctx.state === 'WAITING_INPUT') {
                // Delay validation to allow command output to be captured
                setTimeout(() => {
                    tutorialEngine.validateInput(session.id);
                }, 500);
            }
        }
    });
    socket.on('terminal:resize', (data) => {
        terminalManager.resize(data.sessionId, data.cols, data.rows);
    });
    socket.on('terminal:destroy', (sessionId) => {
        terminalManager.destroy(sessionId);
    });
    // ============================================================================
    // Tutorial Events
    // ============================================================================
    socket.on('tutorial:start', async (data, callback) => {
        const lesson = tutorialEngine.getLesson(data.lessonId);
        if (!lesson) {
            callback({ success: false, error: 'Lesson not found' });
            return;
        }
        sessionManager.setCurrentLesson(session.id, data.lessonId);
        // Ensure terminal exists
        let terminalSessionId = session.terminalSessionId;
        if (!terminalSessionId || !terminalManager.exists(terminalSessionId)) {
            terminalSessionId = terminalManager.create();
            sessionManager.setTerminalSession(session.id, terminalSessionId);
            // Set up output forwarding
            const currentTerminalId = terminalSessionId;
            terminalManager.on('output', (sessionId, outputData) => {
                if (sessionId === currentTerminalId) {
                    socket.emit('terminal:output', { sessionId: currentTerminalId, data: outputData });
                    tutorialEngine.processOutput(session.id, outputData);
                }
            });
        }
        // Send callback IMMEDIATELY before starting the tutorial
        // (since startLesson is async and does voice synthesis which takes time)
        const lessonData = {
            success: true,
            lesson: {
                id: lesson.id,
                title: lesson.title,
                totalSteps: lesson.steps.length
            }
        };
        callback(lessonData);
        socket.emit('tutorial:started', lessonData);
        // Start the tutorial (this may take time for voice synthesis)
        const result = await tutorialEngine.startLesson(session.id, data.lessonId, terminalSessionId);
        if (!result.success) {
            // Emit error event since callback already sent
            socket.emit('tutorial:error', { message: result.error || 'Unknown error', recoverable: false });
        }
    });
    socket.on('tutorial:hint', (callback) => {
        const result = tutorialEngine.getHint(session.id);
        if (result) {
            callback({
                success: true,
                hint: result.hint,
                hintIndex: result.index,
                totalHints: result.total
            });
        }
        else {
            callback({ success: false });
        }
    });
    socket.on('tutorial:skip', () => {
        tutorialEngine.skipStep(session.id);
    });
    socket.on('tutorial:stop', () => {
        tutorialEngine.stopLesson(session.id);
        sessionManager.clearCurrentLesson(session.id);
    });
    // ============================================================================
    // Voice Events
    // ============================================================================
    socket.on('voice:mute', (muted) => {
        // Store mute preference in session if needed
        console.log(`[Voice] Mute state: ${muted}`);
    });
    // ============================================================================
    // Tutorial Engine Event Handlers
    // ============================================================================
    tutorialEngine.on('step', (context, step) => {
        socket.emit('tutorial:step', {
            stepIndex: context.currentStepIndex,
            totalSteps: context.lesson.steps.length,
            step,
            state: context.state
        });
    });
    tutorialEngine.on('voice', (text, speaker, audioUrl) => {
        socket.emit('voice:speak', {
            audioUrl,
            text,
            speaker
        });
    });
    tutorialEngine.on('complete', (data) => {
        socket.emit('tutorial:complete', data);
        sessionManager.clearCurrentLesson(session.id);
    });
    tutorialEngine.on('error', (message, recoverable) => {
        socket.emit('tutorial:error', { message, recoverable });
    });
    tutorialEngine.on('validation-success', (message) => {
        const ctx = tutorialEngine.getContext(session.id);
        socket.emit('tutorial:validation-success', {
            message,
            stepIndex: ctx?.currentStepIndex
        });
    });
    tutorialEngine.on('validation-fail', (message) => {
        const ctx = tutorialEngine.getContext(session.id);
        const hint = tutorialEngine.getHint(session.id);
        socket.emit('tutorial:validation-fail', {
            message,
            stepIndex: ctx?.currentStepIndex,
            hint: hint?.hint
        });
    });
    tutorialEngine.on('waiting-input', (step) => {
        socket.emit('tutorial:state', { state: 'WAITING_INPUT', step });
    });
    // ============================================================================
    // Disconnect Handler
    // ============================================================================
    socket.on('disconnect', () => {
        console.log(`[Socket] Client disconnected: ${socket.id}`);
        // Clean up terminal
        if (session.terminalSessionId) {
            terminalManager.destroy(session.terminalSessionId);
        }
        // Clean up tutorial
        tutorialEngine.stopLesson(session.id);
        // Clean up session
        sessionManager.destroySession(session.id);
    });
});
// Start server
httpServer.listen(PORT, () => {
    console.log(`
============================================
  Claude Code Tutor - Backend Server
============================================
  Port: ${PORT}
  Voice Output: ${VOICE_OUTPUT_DIR}
  Lessons Dir: ${LESSONS_DIR}
  Session Timeout: ${SESSION_TIMEOUT_MS / 1000 / 60} minutes
============================================
  `);
    // Check edge-tts availability
    voiceManager.checkAvailability().then(available => {
        if (available) {
            console.log('[VoiceManager] edge-tts is available');
        }
        else {
            console.warn('[VoiceManager] edge-tts not found. Voice synthesis will fail.');
            console.warn('Install with: pip install edge-tts');
        }
    });
});
// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down...');
    terminalManager.shutdown();
    sessionManager.shutdown();
    httpServer.close();
    process.exit(0);
});
process.on('SIGTERM', () => {
    console.log('\nShutting down...');
    terminalManager.shutdown();
    sessionManager.shutdown();
    httpServer.close();
    process.exit(0);
});
//# sourceMappingURL=index.js.map