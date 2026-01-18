# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**Claude Code Tutor** - A voice-guided, interactive training platform where Claude Code teaches users how to master Claude Code CLI.

**Key Innovation**: The AI tutor speaks to users, controls a real terminal to demonstrate commands, watches practice sessions, and provides instant feedback.

## Architecture

```
Frontend (React + Vite + xterm.js)
         ↓ WebSocket
Backend (Node.js + Express + node-pty)
         ↓
Claude Code CLI (via user's subscription)
         ↓
edge-tts (Voice synthesis - Elisabeth & Finn)
```

## Project Structure

```
claude-code-tutor/
├── app/                    # Frontend React application
│   ├── src/
│   │   ├── App.jsx         # Current MVP implementation
│   │   ├── components/     # To be created: Tutorial, Terminal, Voice, Auth
│   │   ├── hooks/          # React hooks for WebSocket, tutorial state
│   │   └── services/       # API and WebSocket clients
│   └── package.json
├── server/                 # Backend Node.js server (to be created)
│   ├── src/
│   │   ├── managers/       # TerminalManager, VoiceManager, SessionManager
│   │   ├── tutorials/      # YAML lesson definitions
│   │   └── index.ts        # Server entry point
│   └── package.json
├── shared/                 # Shared types (to be created)
└── docs/                   # Architecture documentation
```

## Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Frontend UI | React 18 + Vite | Fast, modern web app |
| Terminal | xterm.js | Browser terminal emulation |
| Backend | Node.js + Express | Server and WebSocket |
| PTY | node-pty | Real terminal process management |
| Voice | edge-tts | Microsoft TTS (FREE!) |
| Real-time | Socket.io | Bidirectional communication |
| Styling | Tailwind CSS | Utility-first CSS |

## Key Commands

```bash
# Development
cd app && npm run dev       # Start frontend
cd server && npm run dev    # Start backend (when created)

# Build
npm run build               # Build all packages
```

## Voice Integration

**Elisabeth** 🇬🇧 (en-GB-SoniaNeural): Explains concepts, guides lessons
**Finn** 🇳🇴 (nb-NO-FinnNeural): Celebrates successes, confirms completions

Voice announcements via edge-tts MCP server:
```javascript
edge-tts:text_to_speech("Hello Colin, let me explain this...", "en-GB-SoniaNeural")
edge-tts:text_to_speech("Hei! Fantastisk!", "nb-NO-FinnNeural")
```

## Authentication Strategy

1. **Primary**: User's Claude Code subscription (no extra cost)
2. **Fallback**: ANTHROPIC_API_KEY environment variable
3. **Demo Mode**: Simulated terminal with pre-recorded responses

## Tutorial Lesson Format (YAML)

```yaml
id: getting-started
title: Getting Started with Claude Code
level: beginner
steps:
  - id: welcome
    type: voice
    voice:
      speaker: Elisabeth
      text: "Hello, let me show you how this works..."
  - id: demo-version
    type: demo
    terminal:
      command: "claude --version"
      demo: true  # Tutor types this
  - id: try-yourself
    type: interactive
    voice:
      speaker: Elisabeth
      text: "Your turn! Type the command."
    validation:
      type: output-contains
      value: "Claude Code"
```

## Development Guidelines

1. **Backend First**: Build TerminalManager with node-pty before adding frontend WebSocket
2. **Voice Protocol**: Elisabeth announces actions, Finn celebrates completions
3. **Safety**: Use `--tools "Read,Grep,Glob"` for tutorial sandboxing
4. **State Machine**: Tutorial progression: IDLE → VOICE → DEMO/INTERACTIVE → VALIDATING → COMPLETE

## Related Skills & Resources

- `/skills/mcp-builder/` - For MCP server development tutorials
- `/skills/edge-tts/` - Voice synthesis integration
- `/skills/bacon-ai-deterministic-framework/` - 12-phase methodology
- `/skills/claude-code-wrapper/` - Full architecture reference (to be created)

## Current State

- ✅ MVP frontend with simulated terminal
- ✅ 10 training modules defined
- ✅ CLI command reference database
- 🔄 Backend with real terminal (in progress)
- 🔄 Voice integration (in progress)
- ⏳ Full tutorial suite with YAML lessons
