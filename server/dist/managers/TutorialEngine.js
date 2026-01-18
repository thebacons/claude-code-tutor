// ============================================================================
// TutorialEngine - Lesson Orchestration with State Machine
// ============================================================================
import * as fs from 'fs';
import * as path from 'path';
import { parse as parseYaml } from 'yaml';
import { EventEmitter } from 'events';
export class TutorialEngine extends EventEmitter {
    lessons = new Map();
    contexts = new Map(); // sessionId -> context
    lessonsDir;
    voiceManager;
    terminalManager;
    constructor(lessonsDir, voiceManager, terminalManager) {
        super();
        this.lessonsDir = lessonsDir;
        this.voiceManager = voiceManager;
        this.terminalManager = terminalManager;
        this.loadLessons();
    }
    /**
     * Load all lesson YAML files from the lessons directory
     */
    loadLessons() {
        if (!fs.existsSync(this.lessonsDir)) {
            console.warn(`[TutorialEngine] Lessons directory not found: ${this.lessonsDir}`);
            return;
        }
        const files = fs.readdirSync(this.lessonsDir);
        for (const file of files) {
            if (!file.endsWith('.yaml') && !file.endsWith('.yml')) {
                continue;
            }
            try {
                const filePath = path.join(this.lessonsDir, file);
                const content = fs.readFileSync(filePath, 'utf-8');
                const lesson = parseYaml(content);
                if (lesson.id && lesson.steps) {
                    this.lessons.set(lesson.id, lesson);
                    console.log(`[TutorialEngine] Loaded lesson: ${lesson.id} (${lesson.steps.length} steps)`);
                }
            }
            catch (error) {
                console.error(`[TutorialEngine] Error loading ${file}:`, error);
            }
        }
        console.log(`[TutorialEngine] Loaded ${this.lessons.size} lessons`);
    }
    /**
     * Get list of available lessons
     */
    getLessons() {
        return Array.from(this.lessons.values());
    }
    /**
     * Get a specific lesson by ID
     */
    getLesson(lessonId) {
        return this.lessons.get(lessonId);
    }
    /**
     * Start a lesson for a session
     */
    async startLesson(sessionId, lessonId, terminalSessionId) {
        const lesson = this.lessons.get(lessonId);
        if (!lesson) {
            return { success: false, error: `Lesson not found: ${lessonId}` };
        }
        // Create tutorial context
        const context = {
            lessonId,
            lesson,
            currentStepIndex: 0,
            state: 'IDLE',
            hintIndex: 0,
            startTime: Date.now(),
            terminalSessionId,
            lastOutput: '',
            outputBuffer: []
        };
        this.contexts.set(sessionId, context);
        // Start first step
        await this.executeStep(sessionId);
        return { success: true };
    }
    /**
     * Stop the current tutorial for a session
     */
    stopLesson(sessionId) {
        this.contexts.delete(sessionId);
    }
    /**
     * Get current tutorial context for a session
     */
    getContext(sessionId) {
        return this.contexts.get(sessionId);
    }
    /**
     * Execute the current step
     */
    async executeStep(sessionId) {
        const context = this.contexts.get(sessionId);
        if (!context) {
            return;
        }
        const step = context.lesson.steps[context.currentStepIndex];
        if (!step) {
            // No more steps, lesson complete
            await this.completelesson(sessionId);
            return;
        }
        // Reset hint index for new step
        context.hintIndex = 0;
        // Emit step event
        const stepData = {
            stepIndex: context.currentStepIndex,
            totalSteps: context.lesson.steps.length,
            step,
            state: context.state
        };
        this.emit('step', context, step);
        // Handle step based on type
        switch (step.type) {
            case 'voice':
                await this.handleVoiceStep(sessionId, step);
                break;
            case 'demo':
                await this.handleDemoStep(sessionId, step);
                break;
            case 'interactive':
                await this.handleInteractiveStep(sessionId, step);
                break;
        }
    }
    /**
     * Handle a voice-only step
     */
    async handleVoiceStep(sessionId, step) {
        const context = this.contexts.get(sessionId);
        if (!context || !step.voice) {
            return;
        }
        context.state = 'VOICE_PLAYING';
        // Synthesize and play voice
        const result = await this.voiceManager.speak(step.voice.text, step.voice.speaker);
        if (result.success && result.audioUrl) {
            this.emit('voice', step.voice.text, step.voice.speaker, result.audioUrl);
        }
        // Wait for estimated duration (frontend handles actual playback)
        await this.sleep((result.duration || 3) * 1000);
        // Auto-advance to next step
        context.state = 'STEP_COMPLETE';
        context.currentStepIndex++;
        await this.executeStep(sessionId);
    }
    /**
     * Handle a demo step (automated typing)
     */
    async handleDemoStep(sessionId, step) {
        const context = this.contexts.get(sessionId);
        if (!context) {
            return;
        }
        // Play voice first if present
        if (step.voice) {
            context.state = 'VOICE_PLAYING';
            const result = await this.voiceManager.speak(step.voice.text, step.voice.speaker);
            if (result.success && result.audioUrl) {
                this.emit('voice', step.voice.text, step.voice.speaker, result.audioUrl);
            }
            await this.sleep((result.duration || 3) * 1000);
        }
        // Then do the demo typing
        if (step.terminal && context.terminalSessionId) {
            context.state = 'DEMO_TYPING';
            this.emit('demo-start', step.terminal.command);
            const delayMs = step.terminal.demoDelay || 75;
            await this.terminalManager.demoType(context.terminalSessionId, step.terminal.command, delayMs, true);
            this.emit('demo-complete');
            // Wait a bit for command output
            await this.sleep(1500);
        }
        // Play success message if present
        if (step.onSuccess) {
            const successResult = await this.voiceManager.speak(step.onSuccess, 'Elisabeth');
            if (successResult.success && successResult.audioUrl) {
                this.emit('voice', step.onSuccess, 'Elisabeth', successResult.audioUrl);
            }
            await this.sleep((successResult.duration || 2) * 1000);
        }
        // Advance to next step
        context.state = 'STEP_COMPLETE';
        context.currentStepIndex++;
        await this.executeStep(sessionId);
    }
    /**
     * Handle an interactive step (wait for user input)
     */
    async handleInteractiveStep(sessionId, step) {
        const context = this.contexts.get(sessionId);
        if (!context) {
            return;
        }
        // Play voice instruction
        if (step.voice) {
            context.state = 'VOICE_PLAYING';
            const result = await this.voiceManager.speak(step.voice.text, step.voice.speaker);
            if (result.success && result.audioUrl) {
                this.emit('voice', step.voice.text, step.voice.speaker, result.audioUrl);
            }
            await this.sleep((result.duration || 3) * 1000);
        }
        // Clear output buffer and wait for input
        context.outputBuffer = [];
        context.state = 'WAITING_INPUT';
        this.emit('waiting-input', step);
    }
    /**
     * Process terminal output for validation
     */
    processOutput(sessionId, output) {
        const context = this.contexts.get(sessionId);
        if (!context || context.state !== 'WAITING_INPUT') {
            return;
        }
        context.lastOutput = output;
        context.outputBuffer.push(output);
    }
    /**
     * Validate user input against current step
     */
    async validateInput(sessionId) {
        const context = this.contexts.get(sessionId);
        if (!context || context.state !== 'WAITING_INPUT') {
            return false;
        }
        const step = context.lesson.steps[context.currentStepIndex];
        if (!step || !step.validation) {
            // No validation required, auto-pass
            return await this.advanceStep(sessionId);
        }
        context.state = 'VALIDATING';
        const combinedOutput = context.outputBuffer.join('');
        let isValid = false;
        switch (step.validation.type) {
            case 'output-contains':
                isValid = combinedOutput.includes(step.validation.value);
                break;
            case 'output-exact':
                isValid = combinedOutput.trim() === step.validation.value.trim();
                break;
            case 'command-match':
                // Check if the user typed the expected command
                isValid = combinedOutput.includes(step.validation.value);
                break;
        }
        if (isValid) {
            this.emit('validation-success', step.onSuccess || 'Correct!');
            // Play success message
            if (step.onSuccess) {
                const result = await this.voiceManager.speak(step.onSuccess, 'Elisabeth');
                if (result.success && result.audioUrl) {
                    this.emit('voice', step.onSuccess, 'Elisabeth', result.audioUrl);
                }
                await this.sleep((result.duration || 2) * 1000);
            }
            return await this.advanceStep(sessionId);
        }
        else {
            context.state = 'WAITING_INPUT';
            this.emit('validation-fail', 'Not quite right. Try again or ask for a hint.');
            return false;
        }
    }
    /**
     * Get a hint for the current step
     */
    getHint(sessionId) {
        const context = this.contexts.get(sessionId);
        if (!context) {
            return null;
        }
        const step = context.lesson.steps[context.currentStepIndex];
        if (!step || !step.hints || step.hints.length === 0) {
            return null;
        }
        const hint = step.hints[context.hintIndex];
        const result = {
            hint,
            index: context.hintIndex,
            total: step.hints.length
        };
        // Cycle through hints
        context.hintIndex = (context.hintIndex + 1) % step.hints.length;
        return result;
    }
    /**
     * Advance to the next step
     */
    async advanceStep(sessionId) {
        const context = this.contexts.get(sessionId);
        if (!context) {
            return false;
        }
        context.state = 'STEP_COMPLETE';
        context.currentStepIndex++;
        if (context.currentStepIndex >= context.lesson.steps.length) {
            await this.completelesson(sessionId);
            return true;
        }
        await this.executeStep(sessionId);
        return true;
    }
    /**
     * Complete the lesson
     */
    async completelesson(sessionId) {
        const context = this.contexts.get(sessionId);
        if (!context) {
            return;
        }
        context.state = 'LESSON_COMPLETE';
        const completionTime = Math.floor((Date.now() - context.startTime) / 1000);
        const data = {
            lessonId: context.lessonId,
            title: context.lesson.title,
            completionTime
        };
        this.emit('complete', data);
        // Clean up
        this.contexts.delete(sessionId);
    }
    /**
     * Skip current step
     */
    async skipStep(sessionId) {
        const context = this.contexts.get(sessionId);
        if (!context) {
            return;
        }
        context.state = 'STEP_COMPLETE';
        context.currentStepIndex++;
        if (context.currentStepIndex >= context.lesson.steps.length) {
            await this.completelesson(sessionId);
            return;
        }
        await this.executeStep(sessionId);
    }
    /**
     * Reload lessons from disk
     */
    reloadLessons() {
        this.lessons.clear();
        this.loadLessons();
    }
    /**
     * Utility: sleep for ms milliseconds
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
//# sourceMappingURL=TutorialEngine.js.map