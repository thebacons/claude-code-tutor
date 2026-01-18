# Claude Code Tutor 🎓🥓

> **The AI That Teaches You AI** - A Voice-Guided, Interactive Training Platform Where Claude Code Teaches You How to Master Claude Code

[![BACON-AI Framework](https://img.shields.io/badge/BACON--AI-Framework-FF6B35?style=for-the-badge)](https://bacon-ai.cloud)
[![Claude Code](https://img.shields.io/badge/Claude-Code-7C3AED?style=for-the-badge)](https://claude.ai/code)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Voice Guided](https://img.shields.io/badge/Voice-Guided-00D4AA?style=for-the-badge)](https://github.com/thebacons/claude-code-tutor)

---

## 🚀 What Makes This Different?

**This isn't just documentation.** This is an **AI tutor** that:

1. **Speaks to you** via natural voice synthesis (Elisabeth guides, Finn celebrates)
2. **Controls a real terminal** to demonstrate commands live
3. **Watches you practice** and provides instant feedback
4. **Adapts to your level** from beginner to advanced
5. **Uses your own Claude Code subscription** - no separate API costs

```
┌─────────────────────────────────────────────────────────────────┐
│  "Hello Colin, let me show you how to use print mode..."       │
│                                          🔊 Elisabeth speaking  │
├─────────────────────────────────────────────────────────────────┤
│  $ claude -p "What is TypeScript?"                              │
│  TypeScript is a strongly typed programming language that...    │
│  ▌                                              [Live Terminal] │
├─────────────────────────────────────────────────────────────────┤
│  ✅ Step 3/10 Complete │ [Get Hint] │ [Skip] │ [Repeat]        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 The Vision

### The Problem
- Claude Code has 50+ CLI options and powerful features
- Documentation is scattered across READMEs, help output, and forums
- Learning by reading is slow; learning by doing is fast
- No interactive way to practice with immediate feedback

### The Solution
An embedded training platform where:
- **Claude Code (the AI)** acts as your personal tutor
- **Real terminal** shows actual command execution
- **Voice guidance** explains concepts naturally
- **Progressive lessons** take you from zero to expert
- **Your own subscription** powers the training (no extra cost)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + Vite)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                   │
│  │  Tutorial UI │  │ Voice Player │  │   Progress   │                   │
│  │  (Lessons)   │  │  (Subtitles) │  │   Tracker    │                   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                   │
│         │                 │                 │                           │
│  ┌──────▼─────────────────▼─────────────────▼───────┐                   │
│  │              xterm.js Live Terminal              │                   │
│  └──────────────────────┬───────────────────────────┘                   │
└─────────────────────────┼───────────────────────────────────────────────┘
                          │ WebSocket
┌─────────────────────────┼───────────────────────────────────────────────┐
│                         │      NODE.JS BACKEND                          │
│  ┌──────────────┐  ┌────▼─────────┐  ┌──────────────┐                   │
│  │   Tutorial   │  │   Terminal   │  │    Voice     │                   │
│  │    Engine    │──│   Manager    │──│   Manager    │                   │
│  │  (Orchestr.) │  │  (node-pty)  │  │  (edge-tts)  │                   │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘                   │
│         │                 │                                             │
│  ┌──────▼─────────────────▼─────────────────────────┐                   │
│  │           Session Manager (Auth + Credentials)    │                   │
│  └──────────────────────┬───────────────────────────┘                   │
└─────────────────────────┼───────────────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │    Claude Code CLI    │
              │  (Your Subscription)  │
              └───────────────────────┘
```

---

## 📚 Training Curriculum

### Level 1: Foundation (Beginner)
| Module | Duration | Topics |
|--------|----------|--------|
| Getting Started | 15 min | Installation, version check, first query |
| Session Management | 20 min | Starting sessions, resuming, context |
| CLAUDE.md Basics | 25 min | Project config, hierarchy, best practices |

### Level 2: Intermediate
| Module | Duration | Topics |
|--------|----------|--------|
| Hooks System | 30 min | PreToolUse, PostToolUse, Stop hooks |
| Custom Subagents | 35 min | Task spawning, explore/plan agents |
| MCP Integration | 30 min | Using MCP tools, server connections |

### Level 3: Advanced
| Module | Duration | Topics |
|--------|----------|--------|
| MCP Server Development | 45 min | Build your own MCP server |
| Multi-Agent Pipelines | 40 min | Orchestrating agent workflows |
| CI/CD Integration | 30 min | GitHub Actions, automation |
| Self-Healing Systems | 45 min | Autonomous development ecosystems |

### Level 4: Expert (Coming Soon)
| Module | Duration | Topics |
|--------|----------|--------|
| BACON-AI Framework | 60 min | 12-phase methodology |
| Testing Pyramid | 45 min | TUT, FUT, SIT, UAT, RGT |
| OpenAI Agents SDK | 40 min | Cross-platform agent development |
| Gemini Live Voice | 35 min | Real-time voice AI integration |
| Computer Use Tools | 50 min | Browser automation, screenshots |

---

## 🎭 Meet Your Tutors

### Elisabeth 🇬🇧
*British AI instructor - Clear, patient, professional*
- **Role**: Explains concepts, guides through lessons
- **Voice**: `en-GB-SoniaNeural`
- **Style**: "Hello Colin, let me show you how this works..."

### Finn 🇳🇴
*Norwegian AI assistant - Enthusiastic, encouraging*
- **Role**: Celebrates successes, confirms completions
- **Voice**: `nb-NO-FinnNeural`
- **Style**: "Hei! Fantastisk! You've mastered that perfectly!"

---

## 🔐 Authentication Options

### Option A: Claude Code Subscription (Recommended)
Use your existing Claude Code Pro subscription - no extra API costs!
```bash
# Your existing login is automatically used
claude --version  # If this works, you're ready!
```

### Option B: API Key Fallback
For users without subscription or for programmatic access:
```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

### Option C: Demo Mode
Try the platform without any credentials (simulated terminal):
```
[Demo Mode] - Full tutorial content, pre-recorded responses
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React + Vite | Fast, modern UI |
| Terminal | xterm.js | Real terminal emulation |
| Backend | Node.js + Express | Server & WebSocket |
| PTY | node-pty | Pseudo-terminal management |
| Voice | edge-tts | Microsoft TTS (FREE!) |
| Audio | Howler.js | Cross-browser audio playback |
| Styling | Tailwind CSS | Utility-first CSS |
| Real-time | Socket.io | WebSocket communication |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (LTS recommended)
- Claude Code CLI installed (`npm install -g @anthropic-ai/claude-code`)
- Claude Code subscription OR Anthropic API key

### Installation

```bash
# Clone the repository
git clone https://github.com/thebacons/claude-code-tutor.git
cd claude-code-tutor

# Install dependencies
npm install

# Start development servers
npm run dev
```

### Usage

```bash
# Start the tutor (opens in browser)
npm start

# Or run specific components
npm run dev:frontend  # Just the React app
npm run dev:backend   # Just the Node.js server
```

---

## 📁 Project Structure

```
claude-code-tutor/
├── app/                    # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Tutorial/   # Lesson UI components
│   │   │   ├── Terminal/   # xterm.js integration
│   │   │   ├── Voice/      # Audio controls, subtitles
│   │   │   └── Auth/       # Login, session management
│   │   ├── hooks/          # React hooks
│   │   ├── services/       # API & WebSocket clients
│   │   └── App.tsx         # Main application
│   └── package.json
│
├── server/                 # Backend Node.js server
│   ├── src/
│   │   ├── managers/
│   │   │   ├── TerminalManager.ts   # node-pty processes
│   │   │   ├── VoiceManager.ts      # edge-tts synthesis
│   │   │   ├── SessionManager.ts    # Auth & credentials
│   │   │   └── TutorialEngine.ts    # Lesson orchestration
│   │   ├── tutorials/
│   │   │   └── lessons/    # YAML lesson definitions
│   │   └── index.ts        # Server entry point
│   └── package.json
│
├── shared/                 # Shared types & utilities
├── docs/                   # Extended documentation
└── package.json            # Workspace root
```

---

## 🗺️ Roadmap

### Phase 1: MVP ✅
- [x] React frontend with tutorial UI
- [x] CLI command reference database
- [x] Simulated terminal for basics
- [x] 10 training modules

### Phase 2: Real Terminal (Current)
- [ ] Node.js backend with node-pty
- [ ] WebSocket terminal streaming
- [ ] Live Claude Code execution
- [ ] Session management

### Phase 3: Voice Integration
- [ ] edge-tts MCP integration
- [ ] Voice narration for lessons
- [ ] Subtitles display
- [ ] Mute/volume controls

### Phase 4: Full Tutorial Suite
- [ ] All 15+ lessons implemented
- [ ] Progress persistence
- [ ] Adaptive difficulty
- [ ] Practice exercises

### Phase 5: Production
- [ ] Docker deployment
- [ ] Multi-user support
- [ ] Analytics dashboard
- [ ] Mobile responsive

### Phase 6: Advanced Features
- [ ] BACON-AI Framework training
- [ ] Cross-vendor AI integration
- [ ] Custom lesson creation
- [ ] Collaborative learning

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/claude-code-tutor.git

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and test
npm test

# Submit PR
git push origin feature/amazing-feature
```

---

## 📊 Market Opportunity

The AI Agent market is exploding:
- **$5.4B → $52B** projected growth by 2030 (68% CAGR)
- **Claude Code** is the most capable AI coding assistant
- **Training gap**: Most users only scratch the surface of capabilities
- **Enterprise demand**: Companies need structured AI upskilling

---

## 🥓 BACON-AI Framework

This project follows the **BACON-AI 12-Phase Methodology**:

1. **Behavioral Alignment** - Voice protocols, personality consistency
2. **Analysis** - Deep research before implementation
3. **Context Engineering** - Progressive validation gates
4. **Orchestration** - Multi-agent coordination
5. **Novelty Integration** - Continuous learning and improvement

Learn more: [BACON-AI Framework](https://bacon-ai.cloud)

---

## 📬 Contact

- **Email**: hello@bacon-ai.cloud
- **GitHub**: [@thebacons](https://github.com/thebacons)
- **Project**: [claude-code-tutor](https://github.com/thebacons/claude-code-tutor)

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with 🥓 by BACON-AI**

*"The AI That Teaches You AI"*

</div>
