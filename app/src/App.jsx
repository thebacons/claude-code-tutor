import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Terminal, FileText, Workflow, Cpu, Zap, Box, Layers, GitBranch,
  ChevronRight, ChevronDown, CheckCircle, Play, BookOpen, Code,
  Rocket, Award, Settings, Search, ExternalLink, Copy, Check,
  AlertCircle, Info, Star, Lock, Unlock, GraduationCap, Target,
  Wrench, Database, Globe, Shield, RefreshCw, Command
} from 'lucide-react';

// ============================================================================
// CLI COMMAND DATABASE - Complete Reference
// ============================================================================
const cliCommands = {
  arguments: [
    { name: 'prompt', desc: 'Your prompt to Claude', example: 'claude "explain this code"' }
  ],
  coreFlags: [
    { flag: '-p, --print', desc: 'Print response and exit (useful for pipes)', example: 'claude -p "summarize this file"', level: 'beginner' },
    { flag: '-c, --continue', desc: 'Continue the most recent conversation', example: 'claude -c', level: 'beginner' },
    { flag: '-r, --resume [value]', desc: 'Resume by session ID or open picker', example: 'claude -r abc123', level: 'beginner' },
    { flag: '--session-id <uuid>', desc: 'Use specific session ID (must be valid UUID)', example: 'claude --session-id "550e8400-..."', level: 'intermediate' },
    { flag: '--fork-session', desc: 'Create new session when resuming (use with --resume or --continue)', example: 'claude -r abc123 --fork-session', level: 'intermediate' },
    { flag: '-v, --version', desc: 'Output the version number', example: 'claude -v', level: 'beginner' },
    { flag: '-h, --help', desc: 'Display help for command', example: 'claude --help', level: 'beginner' },
  ],
  modelConfig: [
    { flag: '--model <model>', desc: 'Model alias (sonnet/opus) or full name', example: 'claude --model opus', level: 'beginner' },
    { flag: '--fallback-model <model>', desc: 'Auto fallback when default overloaded (--print only)', example: 'claude -p --fallback-model sonnet "query"', level: 'intermediate' },
    { flag: '--agent <agent>', desc: 'Custom agent for the session', example: 'claude --agent my-reviewer', level: 'intermediate' },
    { flag: '--agents <json>', desc: 'Define custom agents via JSON', example: 'claude --agents \'{"reviewer":{...}}\'', level: 'advanced' },
  ],
  toolConfig: [
    { flag: '--tools <tools...>', desc: 'Specify available tools ("" to disable all, "default" for all)', example: 'claude --tools "Bash,Edit,Read"', level: 'intermediate' },
    { flag: '--allowedTools <tools...>', desc: 'Tools that execute without prompting', example: 'claude --allowedTools "Bash(git:*)" "Read"', level: 'intermediate' },
    { flag: '--disallowedTools <tools...>', desc: 'Tools removed from context', example: 'claude --disallowedTools "Edit"', level: 'intermediate' },
    { flag: '--add-dir <directories...>', desc: 'Additional directories for tool access', example: 'claude --add-dir ../apps ../lib', level: 'intermediate' },
  ],
  systemPrompt: [
    { flag: '--system-prompt <prompt>', desc: 'Replace entire default system prompt', example: 'claude --system-prompt "You are a Python expert"', level: 'advanced' },
    { flag: '--append-system-prompt <prompt>', desc: 'Append to default system prompt', example: 'claude --append-system-prompt "Always use TypeScript"', level: 'intermediate' },
  ],
  permissions: [
    { flag: '--permission-mode <mode>', desc: 'Permission mode: acceptEdits, bypassPermissions, default, delegate, dontAsk, plan', example: 'claude --permission-mode plan', level: 'intermediate' },
    { flag: '--dangerously-skip-permissions', desc: '⚠️ Bypass ALL permission checks (sandboxes only!)', example: 'claude --dangerously-skip-permissions', level: 'advanced' },
    { flag: '--allow-dangerously-skip-permissions', desc: 'Enable bypassing option without enabling by default', example: 'claude --allow-dangerously-skip-permissions', level: 'advanced' },
  ],
  mcpConfig: [
    { flag: '--mcp-config <configs...>', desc: 'Load MCP servers from JSON files or strings', example: 'claude --mcp-config ./mcp.json', level: 'intermediate' },
    { flag: '--strict-mcp-config', desc: 'Only use MCP servers from --mcp-config', example: 'claude --strict-mcp-config --mcp-config ./mcp.json', level: 'advanced' },
  ],
  outputFormat: [
    { flag: '--output-format <format>', desc: 'Output: text (default), json, stream-json', example: 'claude -p --output-format json "query"', level: 'intermediate' },
    { flag: '--input-format <format>', desc: 'Input: text (default), stream-json', example: 'claude -p --input-format stream-json', level: 'advanced' },
    { flag: '--json-schema <schema>', desc: 'JSON Schema for structured output validation', example: 'claude -p --json-schema \'{"type":"object",...}\'', level: 'advanced' },
    { flag: '--include-partial-messages', desc: 'Include partial chunks (stream-json only)', example: 'claude -p --output-format stream-json --include-partial-messages', level: 'advanced' },
  ],
  advanced: [
    { flag: '--max-budget-usd <amount>', desc: 'Maximum spend on API calls (--print only)', example: 'claude -p --max-budget-usd 5.00 "big task"', level: 'advanced' },
    { flag: '--plugin-dir <paths...>', desc: 'Load plugins from directories', example: 'claude --plugin-dir ./my-plugins', level: 'advanced' },
    { flag: '--chrome / --no-chrome', desc: 'Enable/disable Chrome integration', example: 'claude --chrome', level: 'intermediate' },
    { flag: '--ide', desc: 'Auto-connect to IDE on startup', example: 'claude --ide', level: 'intermediate' },
    { flag: '--disable-slash-commands', desc: 'Disable all skills', example: 'claude --disable-slash-commands', level: 'advanced' },
    { flag: '-d, --debug [filter]', desc: 'Enable debug mode with optional filtering', example: 'claude --debug "api,hooks"', level: 'advanced' },
    { flag: '--verbose', desc: 'Override verbose mode setting', example: 'claude --verbose', level: 'intermediate' },
    { flag: '--settings <file-or-json>', desc: 'Load settings from file or JSON', example: 'claude --settings ./settings.json', level: 'advanced' },
    { flag: '--betas <betas...>', desc: 'Beta headers for API requests (API key users)', example: 'claude --betas interleaved-thinking', level: 'advanced' },
    { flag: '--no-session-persistence', desc: 'Dont save sessions to disk (--print only)', example: 'claude -p --no-session-persistence "query"', level: 'advanced' },
  ],
  subcommands: [
    { name: 'doctor', desc: 'Check health of auto-updater', example: 'claude doctor', level: 'beginner' },
    { name: 'install [target]', desc: 'Install native build (stable, latest, or version)', example: 'claude install latest', level: 'beginner' },
    { name: 'mcp', desc: 'Configure and manage MCP servers', example: 'claude mcp add my-server -- npx server', level: 'intermediate' },
    { name: 'plugin', desc: 'Manage Claude Code plugins', example: 'claude plugin install flow-next', level: 'intermediate' },
    { name: 'setup-token', desc: 'Set up long-lived auth token (requires subscription)', example: 'claude setup-token', level: 'beginner' },
    { name: 'update', desc: 'Check for updates and install', example: 'claude update', level: 'beginner' },
  ]
};

// ============================================================================
// TRAINING MODULES - Organized by Level
// ============================================================================
const trainingModules = {
  beginner: [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Rocket,
      duration: '15 min',
      description: 'Install Claude Code and run your first commands',
      topics: [
        'Installation and setup',
        'Basic prompting',
        'Session management',
        'Understanding context',
      ],
      exercises: [
        { task: 'Install Claude Code', command: 'npm install -g @anthropic-ai/claude-code', hint: 'Or use the official installer' },
        { task: 'Start interactive session', command: 'claude', hint: 'Just type claude to begin' },
        { task: 'Run a one-shot query', command: 'claude -p "What is TypeScript?"', hint: 'Use -p for print mode' },
        { task: 'Check your context usage', command: '/context', hint: 'Run inside Claude Code session' },
      ]
    },
    {
      id: 'session-management',
      title: 'Session Management',
      icon: RefreshCw,
      duration: '10 min',
      description: 'Continue, resume, and manage conversations',
      topics: [
        'Continuing conversations',
        'Resuming by session ID',
        'Forking sessions',
        'Session persistence',
      ],
      exercises: [
        { task: 'Continue last session', command: 'claude -c', hint: 'Picks up where you left off' },
        { task: 'Resume specific session', command: 'claude -r', hint: 'Opens interactive picker' },
        { task: 'Fork a session', command: 'claude -r abc123 --fork-session', hint: 'Creates new branch from existing' },
      ]
    },
    {
      id: 'claude-md-basics',
      title: 'CLAUDE.md Basics',
      icon: FileText,
      duration: '20 min',
      description: 'Configure your projects with CLAUDE.md files',
      topics: [
        'What is CLAUDE.md',
        'File hierarchy and loading order',
        'Basic configuration',
        'Using /init command',
      ],
      exercises: [
        { task: 'Generate CLAUDE.md', command: '/init', hint: 'Auto-analyzes your project' },
        { task: 'View loaded context', command: '/context', hint: 'Shows CLAUDE.md files loaded' },
      ],
      codeExample: `# CLAUDE.md

## Project Overview
This is a React TypeScript project using Vite.

## Tech Stack
- React 18 with TypeScript
- Tailwind CSS for styling
- Vite for bundling

## Commands
- \`npm run dev\` - Start dev server
- \`npm run build\` - Production build
- \`npm test\` - Run tests

## Code Style
- Use functional components with hooks
- Prefer named exports
- Use TypeScript strict mode`
    },
  ],
  intermediate: [
    {
      id: 'hooks-system',
      title: 'Hooks System',
      icon: Workflow,
      duration: '30 min',
      description: 'Deterministic control with PreToolUse and PostToolUse hooks',
      topics: [
        'Hook events and lifecycle',
        'PreToolUse for validation',
        'PostToolUse for automation',
        'Exit codes and blocking',
        'Hook configuration in settings.json',
      ],
      exercises: [
        { task: 'Create a logging hook', hint: 'Log all Bash commands to a file' },
        { task: 'Auto-format on save', hint: 'Run prettier after Edit tool' },
        { task: 'Block sensitive files', hint: 'Prevent edits to .env files' },
      ],
      codeExample: `// .claude/settings.json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit",
        "hooks": [{
          "type": "command",
          "command": "if echo '$TOOL_INPUT' | jq -e '.file_path | test(\".env\")' > /dev/null; then echo 'Blocked: Cannot edit .env files' >&2; exit 2; fi"
        }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{
          "type": "command",
          "command": "if [[ '$TOOL_INPUT' == *.ts ]]; then npx prettier --write '$TOOL_INPUT'; fi"
        }]
      }
    ]
  }
}`
    },
    {
      id: 'custom-subagents',
      title: 'Custom Subagents',
      icon: Cpu,
      duration: '45 min',
      description: 'Create specialized AI personas for different tasks',
      topics: [
        'Built-in agents (explore, plan)',
        'Agent file structure',
        'Tool permissions per agent',
        'Model selection (sonnet/opus/haiku)',
        'Context isolation benefits',
      ],
      exercises: [
        { task: 'Use explore agent', command: 'Task tool with subagent_type="Explore"', hint: 'Read-only codebase exploration' },
        { task: 'Create code reviewer', hint: 'Create .claude/agents/reviewer.md' },
        { task: 'Chain agents in pipeline', hint: 'PM → Architect → Implementer' },
      ],
      codeExample: `---
name: code-reviewer
description: Expert code reviewer. Use proactively after code changes.
tools:
  - Read
  - Grep
  - Glob
  - Bash
model: sonnet
---

You are a senior code reviewer focusing on:

## Review Criteria
1. **Code Quality**: Clean, readable, maintainable
2. **Security**: No vulnerabilities, proper input validation
3. **Performance**: No obvious bottlenecks
4. **Best Practices**: Follow language idioms

## Output Format
Provide feedback as:
- 🔴 Critical: Must fix before merge
- 🟡 Warning: Should address
- 🟢 Suggestion: Nice to have

Always explain WHY something is an issue, not just what.`
    },
    {
      id: 'mcp-integration',
      title: 'MCP Server Integration',
      icon: Layers,
      duration: '40 min',
      description: 'Connect Claude to external tools via Model Context Protocol',
      topics: [
        'What is MCP',
        'Adding MCP servers',
        'Server scopes (local/user/project)',
        'Popular MCP servers',
        'Security considerations',
      ],
      exercises: [
        { task: 'Add filesystem server', command: 'claude mcp add fs -- npx @modelcontextprotocol/server-filesystem ~/Documents', hint: 'Gives Claude file access' },
        { task: 'List configured servers', command: 'claude mcp list', hint: 'Shows all MCP servers' },
        { task: 'Debug MCP issues', command: 'claude --debug mcp', hint: 'Shows MCP server errors' },
      ],
      codeExample: `// .mcp.json (project-level)
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-playwright"]
    },
    "github": {
      "command": "npx",
      "args": ["github-mcp-server"],
      "env": {
        "GITHUB_TOKEN": "\${GITHUB_TOKEN}"
      }
    },
    "database": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "\${DATABASE_URL}"
      }
    }
  }
}`
    },
  ],
  advanced: [
    {
      id: 'mcp-server-development',
      title: 'Build Your Own MCP Server',
      icon: Database,
      duration: '90 min',
      description: 'Create custom MCP servers to extend Claude capabilities',
      topics: [
        'MCP architecture overview',
        'Server types: stdio vs HTTP',
        'Implementing tools',
        'Implementing resources',
        'Error handling and validation',
        'Testing your server',
      ],
      exercises: [
        { task: 'Set up TypeScript MCP project', hint: 'npm init + install @modelcontextprotocol/sdk' },
        { task: 'Implement a weather tool', hint: 'Fetch from weather API' },
        { task: 'Add input validation with Zod', hint: 'Validate tool parameters' },
        { task: 'Test with Claude Code', hint: 'claude mcp add myserver -- node ./server.js' },
      ],
      codeExample: `// src/weather-server.ts
import { Server } from "@modelcontextprotocol/sdk/server";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { z } from "zod";

const server = new Server({
  name: "weather-server",
  version: "1.0.0"
});

// Define tool schema
const GetWeatherSchema = z.object({
  city: z.string().describe("City name"),
  units: z.enum(["celsius", "fahrenheit"]).default("celsius")
});

// Register tool
server.setRequestHandler("tools/list", async () => ({
  tools: [{
    name: "get_weather",
    description: "Get current weather for a city",
    inputSchema: {
      type: "object",
      properties: {
        city: { type: "string", description: "City name" },
        units: { type: "string", enum: ["celsius", "fahrenheit"] }
      },
      required: ["city"]
    }
  }]
}));

server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "get_weather") {
    const { city, units } = GetWeatherSchema.parse(request.params.arguments);

    // Fetch weather from API
    const response = await fetch(
      \`https://api.weather.com/v1/current?city=\${city}&units=\${units}\`
    );
    const data = await response.json();

    return {
      content: [{
        type: "text",
        text: \`Weather in \${city}: \${data.temp}° \${units}, \${data.condition}\`
      }]
    };
  }
  throw new Error(\`Unknown tool: \${request.params.name}\`);
});

// Start server
const transport = new StdioServerTransport();
server.connect(transport);`
    },
    {
      id: 'multi-agent-pipelines',
      title: 'Multi-Agent Pipelines',
      icon: GitBranch,
      duration: '60 min',
      description: 'Build reproducible software pipelines with chained agents',
      topics: [
        'Pipeline architecture design',
        'Agent handoff patterns',
        'State management between agents',
        'Using hooks for orchestration',
        'Error handling and recovery',
      ],
      exercises: [
        { task: 'Design 3-stage pipeline', hint: 'Spec → Architecture → Implementation' },
        { task: 'Implement status transitions', hint: 'DRAFT → READY_FOR_ARCH → READY_FOR_BUILD → DONE' },
        { task: 'Add quality gates', hint: 'Block progression on failing tests' },
      ],
      codeExample: `// Pipeline: PM Spec → Architect → Implementer

// .claude/agents/pm-spec.md
---
name: pm-spec
description: Product Manager who writes detailed specifications
tools: [Read, Write, WebSearch]
model: sonnet
---
Create detailed product specs. Output status: READY_FOR_ARCH when done.

// .claude/agents/architect.md
---
name: architect
description: Reviews specs and creates architecture decisions
tools: [Read, Write, Grep, Glob]
model: opus
---
Validate designs against platform constraints. Output ADR.
Set status: READY_FOR_BUILD when approved.

// .claude/agents/implementer.md
---
name: implementer
description: Implements features with tests
tools: [Read, Write, Edit, Bash, Grep, Glob]
model: sonnet
---
Implement code and tests. Run tests before marking DONE.

// Orchestration hook in settings.json
{
  "hooks": {
    "SubagentStop": [{
      "hooks": [{
        "type": "command",
        "command": "./scripts/check-status-transition.sh"
      }]
    }]
  }
}`
    },
    {
      id: 'github-actions-cicd',
      title: 'GitHub Actions CI/CD',
      icon: GitBranch,
      duration: '45 min',
      description: 'Operationalize Claude Code in your CI/CD pipeline',
      topics: [
        'GitHub Actions integration setup',
        'PR review automation',
        '@claude mentions in issues',
        'Automated code fixes',
        'Security and permissions',
      ],
      exercises: [
        { task: 'Set up Claude GitHub Action', hint: 'Add ANTHROPIC_API_KEY secret' },
        { task: 'Configure PR review trigger', hint: 'On pull_request events' },
        { task: 'Add @claude mention handling', hint: 'On issue_comment events' },
      ],
      codeExample: `# .github/workflows/claude-review.yml
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize]
  issue_comment:
    types: [created]

jobs:
  review:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Review PR
        env:
          ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p --output-format json "
            Review this PR for:
            1. Code quality issues
            2. Security vulnerabilities
            3. Performance concerns
            4. Test coverage gaps

            Output as GitHub review comments.
          " > review.json

      - name: Post Review
        uses: actions/github-script@v7
        with:
          script: |
            const review = require('./review.json');
            await github.rest.pulls.createReview({
              owner: context.repo.owner,
              repo: context.repo.repo,
              pull_number: context.issue.number,
              body: review.summary,
              comments: review.comments
            });

  mention:
    runs-on: ubuntu-latest
    if: |
      github.event_name == 'issue_comment' &&
      contains(github.event.comment.body, '@claude')
    steps:
      - uses: actions/checkout@v4
      - name: Handle @claude mention
        env:
          ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          COMMENT="\${{ github.event.comment.body }}"
          claude -p "$COMMENT" > response.txt
          gh issue comment \${{ github.event.issue.number }} -F response.txt`
    },
    {
      id: 'self-healing-systems',
      title: 'Self-Healing Development Systems',
      icon: Shield,
      duration: '75 min',
      description: 'Build autonomous development ecosystems that maintain themselves',
      topics: [
        'Self-annealing patterns',
        'Automated error detection',
        'Self-correction loops',
        'Continuous learning integration',
        'Human-in-the-loop guardrails',
      ],
      exercises: [
        { task: 'Implement test failure auto-fix', hint: 'PostToolUse hook triggers on test failures' },
        { task: 'Add regression detection', hint: 'Compare against baseline metrics' },
        { task: 'Build learning feedback loop', hint: 'Store successful patterns' },
      ],
      codeExample: `// Self-healing test runner hook
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "./scripts/self-heal.sh"
      }]
    }]
  }
}

// scripts/self-heal.sh
#!/bin/bash
# Check if this was a test command that failed
if [[ "$TOOL_INPUT" == *"npm test"* ]] && [[ $EXIT_CODE -ne 0 ]]; then
  echo "Test failure detected. Analyzing..."

  # Extract failing tests
  FAILURES=$(cat test-output.log | grep -A5 "FAIL")

  # Store for Claude to analyze
  echo "$FAILURES" > .claude/test-failures.txt

  # Signal Claude to attempt fix
  echo "AUTO_FIX_REQUESTED" >&2
fi

// In CLAUDE.md, add instruction:
## Self-Healing Protocol
When you see AUTO_FIX_REQUESTED:
1. Read .claude/test-failures.txt
2. Analyze the root cause
3. Propose minimal fix
4. Apply fix and re-run tests
5. If still failing after 3 attempts, ask for human help`
    }
  ]
};

// ============================================================================
// TIPS AND TRICKS DATABASE
// ============================================================================
const tipsAndTricks = [
  {
    category: 'Context Management',
    icon: Database,
    tips: [
      { tip: 'Use /clear often', detail: 'Clear chat when starting new tasks. Saves tokens and prevents context confusion.' },
      { tip: 'Escape > Escape for history', detail: 'Press Escape twice to see list of all previous messages you can jump to.' },
      { tip: 'Control+V for images', detail: 'Command+V doesnt work for pasting images. Use Control+V instead.' },
      { tip: 'Escape to stop, not Ctrl+C', detail: 'Ctrl+C exits entirely. Use Escape to stop Claude mid-response.' },
    ]
  },
  {
    category: 'Productivity',
    icon: Zap,
    tips: [
      { tip: 'Start with /init', detail: 'Always run /init on new projects to generate CLAUDE.md automatically.' },
      { tip: 'Use plan mode for big changes', detail: 'Run with --permission-mode plan to align on approach before execution.' },
      { tip: 'Pipe data into Claude', detail: 'cat data.csv | claude -p "analyze this" - great for quick analysis.' },
      { tip: 'Draft PRs with low risk', detail: 'Let Claude create draft PRs. Review before marking ready.' },
    ]
  },
  {
    category: 'Git Workflow',
    icon: GitBranch,
    tips: [
      { tip: 'Use git revert freely', detail: 'If Claude makes unwanted changes, git revert is faster than fixing manually.' },
      { tip: 'Commit custom commands', detail: 'Store .claude/commands/ in git so your team shares workflows.' },
      { tip: 'MCP config in repo', detail: 'Add .mcp.json to repo so everyone gets the same MCP servers.' },
    ]
  },
  {
    category: 'Advanced',
    icon: Rocket,
    tips: [
      { tip: 'Use subagents for research', detail: 'Subagents have isolated context. Use Explore agent to keep main context small.' },
      { tip: 'Hooks are guarantees', detail: 'Unlike prompts, hooks always execute. Use for critical validations.' },
      { tip: 'JSON output for automation', detail: '--output-format json + --json-schema for structured, parseable responses.' },
      { tip: 'Budget limits for safety', detail: '--max-budget-usd prevents runaway costs in automation.' },
    ]
  }
];

// ============================================================================
// COMPONENT: Real Terminal (using xterm.js)
// ============================================================================
const RealTerminal = ({ onReady }) => {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let terminal = null;
    let fitAddon = null;

    const initTerminal = async () => {
      try {
        const { Terminal } = await import('@xterm/xterm');
        const { FitAddon } = await import('@xterm/addon-fit');
        const { WebLinksAddon } = await import('@xterm/addon-web-links');

        // Import CSS
        await import('@xterm/xterm/css/xterm.css');

        terminal = new Terminal({
          cursorBlink: true,
          fontSize: 14,
          fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
          theme: {
            background: '#1a1b26',
            foreground: '#a9b1d6',
            cursor: '#c0caf5',
            cursorAccent: '#1a1b26',
            selection: '#33467c',
            black: '#32344a',
            red: '#f7768e',
            green: '#9ece6a',
            yellow: '#e0af68',
            blue: '#7aa2f7',
            magenta: '#ad8ee6',
            cyan: '#449dab',
            white: '#787c99',
            brightBlack: '#444b6a',
            brightRed: '#ff7a93',
            brightGreen: '#b9f27c',
            brightYellow: '#ff9e64',
            brightBlue: '#7da6ff',
            brightMagenta: '#bb9af7',
            brightCyan: '#0db9d7',
            brightWhite: '#acb0d0',
          }
        });

        fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);
        terminal.loadAddon(new WebLinksAddon());

        if (terminalRef.current) {
          terminal.open(terminalRef.current);
          fitAddon.fit();

          // Welcome message
          terminal.writeln('\x1b[1;35m╔══════════════════════════════════════════════╗\x1b[0m');
          terminal.writeln('\x1b[1;35m║\x1b[0m   \x1b[1;36mClaude Code Training Terminal\x1b[0m              \x1b[1;35m║\x1b[0m');
          terminal.writeln('\x1b[1;35m║\x1b[0m   Practice commands in a safe environment    \x1b[1;35m║\x1b[0m');
          terminal.writeln('\x1b[1;35m╚══════════════════════════════════════════════╝\x1b[0m');
          terminal.writeln('');
          terminal.writeln('\x1b[33mNote:\x1b[0m This is a simulated environment for learning.');
          terminal.writeln('Type \x1b[32mhelp\x1b[0m for available commands.');
          terminal.writeln('');
          terminal.write('\x1b[32m❯\x1b[0m ');

          let currentLine = '';

          terminal.onKey(({ key, domEvent }) => {
            const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

            if (domEvent.keyCode === 13) { // Enter
              terminal.writeln('');
              handleCommand(terminal, currentLine.trim());
              currentLine = '';
              terminal.write('\x1b[32m❯\x1b[0m ');
            } else if (domEvent.keyCode === 8) { // Backspace
              if (currentLine.length > 0) {
                currentLine = currentLine.slice(0, -1);
                terminal.write('\b \b');
              }
            } else if (printable) {
              currentLine += key;
              terminal.write(key);
            }
          });

          xtermRef.current = terminal;
          setIsReady(true);
          onReady?.(terminal);
        }
      } catch (error) {
        console.error('Failed to initialize terminal:', error);
      }
    };

    initTerminal();

    const handleResize = () => {
      if (fitAddon) fitAddon.fit();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (terminal) terminal.dispose();
    };
  }, [onReady]);

  const handleCommand = (term, cmd) => {
    const commands = {
      'help': () => {
        term.writeln('\x1b[1;36mAvailable Commands:\x1b[0m');
        term.writeln('  \x1b[33mclaude\x1b[0m              Start interactive session');
        term.writeln('  \x1b[33mclaude -p "query"\x1b[0m   Print mode (one-shot)');
        term.writeln('  \x1b[33mclaude -c\x1b[0m           Continue last session');
        term.writeln('  \x1b[33mclaude -r\x1b[0m           Resume session picker');
        term.writeln('  \x1b[33mclaude mcp list\x1b[0m     List MCP servers');
        term.writeln('  \x1b[33mclaude --help\x1b[0m       Show all options');
        term.writeln('  \x1b[33mclear\x1b[0m               Clear terminal');
        term.writeln('  \x1b[33mhelp\x1b[0m                Show this help');
      },
      'clear': () => {
        term.clear();
      },
      'claude': () => {
        term.writeln('\x1b[1;35m');
        term.writeln('  ╭─────────────────────────────────────╮');
        term.writeln('  │     Claude Code v2.0.50             │');
        term.writeln('  │     Type /help for commands         │');
        term.writeln('  ╰─────────────────────────────────────╯');
        term.writeln('\x1b[0m');
        term.writeln('\x1b[90m(Simulated session - type "exit" to return)\x1b[0m');
      },
      'claude -p': () => {
        term.writeln('\x1b[36mProcessing query...\x1b[0m');
        setTimeout(() => {
          term.writeln('\x1b[37mThis is Claude responding to your query in print mode.');
          term.writeln('The response would appear here and then the command exits.\x1b[0m');
        }, 500);
      },
      'claude -c': () => {
        term.writeln('\x1b[33mContinuing most recent conversation...\x1b[0m');
        term.writeln('\x1b[90mSession: abc-123-def (2 hours ago)\x1b[0m');
      },
      'claude -r': () => {
        term.writeln('\x1b[36mRecent Sessions:\x1b[0m');
        term.writeln('  1. \x1b[33mabc-123\x1b[0m  "Fix authentication bug"  (2h ago)');
        term.writeln('  2. \x1b[33mdef-456\x1b[0m  "Add user dashboard"      (1d ago)');
        term.writeln('  3. \x1b[33mghi-789\x1b[0m  "Refactor API layer"      (3d ago)');
        term.writeln('\x1b[90mEnter number or session ID to resume\x1b[0m');
      },
      'claude mcp list': () => {
        term.writeln('\x1b[1;36mConfigured MCP Servers:\x1b[0m');
        term.writeln('  \x1b[32m✓\x1b[0m playwright     \x1b[90m(browser automation)\x1b[0m');
        term.writeln('  \x1b[32m✓\x1b[0m github         \x1b[90m(GitHub integration)\x1b[0m');
        term.writeln('  \x1b[32m✓\x1b[0m filesystem     \x1b[90m(file access)\x1b[0m');
      },
      'claude --help': () => {
        term.writeln('\x1b[1mUsage:\x1b[0m claude [options] [command] [prompt]');
        term.writeln('');
        term.writeln('\x1b[1mOptions:\x1b[0m');
        term.writeln('  -p, --print          Print response and exit');
        term.writeln('  -c, --continue       Continue most recent conversation');
        term.writeln('  -r, --resume [id]    Resume by session ID');
        term.writeln('  --model <model>      Set model (sonnet/opus)');
        term.writeln('  --permission-mode    Set permission mode');
        term.writeln('  -v, --version        Show version');
        term.writeln('  -h, --help           Show help');
        term.writeln('');
        term.writeln('\x1b[1mCommands:\x1b[0m');
        term.writeln('  mcp                  Configure MCP servers');
        term.writeln('  plugin               Manage plugins');
        term.writeln('  update               Check for updates');
      },
      'claude -v': () => {
        term.writeln('Claude Code v2.0.50');
      },
      'claude update': () => {
        term.writeln('\x1b[36mChecking for updates...\x1b[0m');
        setTimeout(() => {
          term.writeln('\x1b[32m✓ You are running the latest version (2.0.50)\x1b[0m');
        }, 800);
      },
      '/init': () => {
        term.writeln('\x1b[36mAnalyzing project structure...\x1b[0m');
        setTimeout(() => {
          term.writeln('\x1b[32m✓\x1b[0m Detected: React + TypeScript + Vite');
          term.writeln('\x1b[32m✓\x1b[0m Found: package.json, tsconfig.json');
          term.writeln('\x1b[32m✓\x1b[0m Generated: CLAUDE.md');
          term.writeln('\x1b[90mTip: Review and customize the generated file\x1b[0m');
        }, 1000);
      },
      '/context': () => {
        term.writeln('\x1b[1;36mContext Usage:\x1b[0m');
        term.writeln('  Tokens: \x1b[33m45,230 / 200,000\x1b[0m (22.6%)');
        term.writeln('  ');
        term.writeln('\x1b[1;36mLoaded Files:\x1b[0m');
        term.writeln('  ~/.claude/CLAUDE.md');
        term.writeln('  ./CLAUDE.md');
        term.writeln('  ./src/CLAUDE.md');
      },
      '/compact': () => {
        term.writeln('\x1b[36mCompacting conversation history...\x1b[0m');
        setTimeout(() => {
          term.writeln('\x1b[32m✓\x1b[0m Freed 32,450 tokens');
          term.writeln('\x1b[90mNew usage: 12,780 / 200,000 (6.4%)\x1b[0m');
        }, 600);
      },
      '/agents': () => {
        term.writeln('\x1b[1;36mAvailable Agents:\x1b[0m');
        term.writeln('  \x1b[1mBuilt-in:\x1b[0m');
        term.writeln('    explore      \x1b[90mRead-only codebase exploration\x1b[0m');
        term.writeln('    plan         \x1b[90mPlanning without execution\x1b[0m');
        term.writeln('  \x1b[1mCustom:\x1b[0m');
        term.writeln('    reviewer     \x1b[90mCode review specialist\x1b[0m');
        term.writeln('    debugger     \x1b[90mDebugging assistant\x1b[0m');
      },
      '/mcp': () => {
        term.writeln('\x1b[1;36mMCP Server Status:\x1b[0m');
        term.writeln('  \x1b[32m●\x1b[0m playwright    \x1b[90mconnected\x1b[0m');
        term.writeln('  \x1b[32m●\x1b[0m github        \x1b[90mconnected\x1b[0m');
        term.writeln('  \x1b[33m●\x1b[0m database      \x1b[90mstarting...\x1b[0m');
      },
      'exit': () => {
        term.writeln('\x1b[90mExiting simulated session...\x1b[0m');
      }
    };

    // Handle commands with arguments
    const cmdLower = cmd.toLowerCase();
    if (cmdLower === '') return;

    // Check for exact match first
    if (commands[cmd]) {
      commands[cmd]();
    } else if (commands[cmdLower]) {
      commands[cmdLower]();
    } else if (cmdLower.startsWith('claude -p')) {
      commands['claude -p']();
    } else if (cmdLower.startsWith('claude ') && !cmdLower.includes('-')) {
      term.writeln('\x1b[36mStarting Claude with prompt...\x1b[0m');
      term.writeln('\x1b[37mClaude would process: "' + cmd.slice(7) + '"\x1b[0m');
    } else {
      term.writeln(`\x1b[31mCommand not found: ${cmd}\x1b[0m`);
      term.writeln('\x1b[90mType "help" for available commands\x1b[0m');
    }
  };

  return (
    <div className="rounded-lg overflow-hidden border border-gray-700">
      <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-gray-400 ml-2 text-sm font-medium">Training Terminal</span>
        {isReady && <span className="ml-auto text-green-400 text-xs">● Connected</span>}
      </div>
      <div
        ref={terminalRef}
        className="h-80"
        style={{ backgroundColor: '#1a1b26' }}
      />
    </div>
  );
};

// ============================================================================
// COMPONENT: Simulated Terminal (fallback)
// ============================================================================
const SimulatedTerminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', content: '╔══════════════════════════════════════════════╗' },
    { type: 'system', content: '║   Claude Code Training Terminal              ║' },
    { type: 'system', content: '╚══════════════════════════════════════════════╝' },
    { type: 'info', content: 'Type "help" for available commands' },
  ]);
  const historyEndRef = useRef(null);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const commands = {
    'help': [
      'Available Commands:',
      '  claude              Start interactive session',
      '  claude -p "query"   Print mode (one-shot)',
      '  claude -c           Continue last session',
      '  claude mcp list     List MCP servers',
      '  /init               Generate CLAUDE.md',
      '  /context            Show context usage',
      '  /compact            Free up tokens',
      '  clear               Clear terminal',
    ],
    'claude': [
      '╭─────────────────────────────────────╮',
      '│     Claude Code v2.0.50             │',
      '│     Type /help for commands         │',
      '╰─────────────────────────────────────╯',
    ],
    'claude -c': ['Continuing most recent conversation...', 'Session: abc-123-def (2 hours ago)'],
    'claude mcp list': [
      'Configured MCP Servers:',
      '  ✓ playwright     (browser automation)',
      '  ✓ github         (GitHub integration)',
      '  ✓ filesystem     (file access)',
    ],
    '/init': ['✓ Analyzing project...', '✓ Detected: React + TypeScript', '✓ Generated CLAUDE.md'],
    '/context': ['Context: 45K/200K tokens used (22.5%)', 'Loaded: ~/.claude/CLAUDE.md, ./CLAUDE.md'],
    '/compact': ['✓ Compacting conversation...', '✓ Freed 30K tokens'],
    '/agents': ['Agents: explore, plan, code-reviewer, debugger'],
    'clear': [],
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.toLowerCase().trim();
    let newHistory = [...history, { type: 'user', content: `❯ ${input}` }];

    if (cmd === 'clear') {
      setHistory([{ type: 'info', content: 'Terminal cleared' }]);
      setInput('');
      return;
    }

    const response = commands[cmd] || commands[cmd.split(' ')[0]] || [`Command not found: ${input}`, 'Type "help" for available commands'];
    response.forEach(line => {
      newHistory.push({ type: 'response', content: line });
    });

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
      <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-gray-400 ml-2 text-sm font-medium">Training Terminal (Simulated)</span>
      </div>
      <div className="p-4 font-mono text-sm h-80 overflow-y-auto">
        {history.map((line, i) => (
          <div key={i} className={`whitespace-pre-wrap ${
            line.type === 'system' ? 'text-purple-400' :
            line.type === 'info' ? 'text-gray-500' :
            line.type === 'user' ? 'text-green-400' : 'text-blue-300'
          }`}>
            {line.content}
          </div>
        ))}
        <div ref={historyEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="border-t border-gray-700 p-3 flex gap-2">
        <span className="text-green-400 font-mono">❯</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Try: claude, /init, help"
          className="flex-1 bg-transparent text-white font-mono outline-none placeholder-gray-600"
          autoFocus
        />
      </form>
    </div>
  );
};

// ============================================================================
// COMPONENT: Code Block with Copy
// ============================================================================
const CodeBlock = ({ code, language = 'javascript' }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm font-mono">
        <code>{code}</code>
      </pre>
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors opacity-0 group-hover:opacity-100"
      >
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
      </button>
    </div>
  );
};

// ============================================================================
// COMPONENT: Training Module Card
// ============================================================================
const ModuleCard = ({ module, level, isExpanded, onToggle, onStartExercise }) => {
  const Icon = module.icon;
  const levelColors = {
    beginner: 'from-green-500 to-emerald-600',
    intermediate: 'from-blue-500 to-indigo-600',
    advanced: 'from-purple-500 to-pink-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${levelColors[level]} flex items-center justify-center shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{module.title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              level === 'beginner' ? 'bg-green-100 text-green-700' :
              level === 'intermediate' ? 'bg-blue-100 text-blue-700' :
              'bg-purple-100 text-purple-700'
            }`}>
              {level}
            </span>
          </div>
          <p className="text-sm text-gray-500">{module.description}</p>
          <span className="text-xs text-gray-400 mt-1 block">{module.duration}</span>
        </div>
        {isExpanded ?
          <ChevronDown className="w-5 h-5 text-gray-400" /> :
          <ChevronRight className="w-5 h-5 text-gray-400" />
        }
      </button>

      {isExpanded && (
        <div className="p-4 pt-0 border-t border-gray-100 space-y-4">
          {/* Topics */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Topics Covered
            </h4>
            <ul className="grid grid-cols-2 gap-1">
              {module.topics.map((topic, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                  {topic}
                </li>
              ))}
            </ul>
          </div>

          {/* Exercises */}
          {module.exercises && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" /> Exercises
              </h4>
              <div className="space-y-2">
                {module.exercises.map((exercise, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-medium text-gray-800 text-sm">{exercise.task}</span>
                        {exercise.command && (
                          <code className="block mt-1 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                            {exercise.command}
                          </code>
                        )}
                        <span className="text-xs text-gray-500 mt-1 block">
                          💡 {exercise.hint}
                        </span>
                      </div>
                      {exercise.command && (
                        <button
                          onClick={() => onStartExercise(exercise)}
                          className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                        >
                          <Play className="w-4 h-4 text-blue-600" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code Example */}
          {module.codeExample && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Code className="w-4 h-4" /> Example Code
              </h4>
              <CodeBlock code={module.codeExample} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// COMPONENT: CLI Reference Section
// ============================================================================
const CLIReference = ({ level }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState('coreFlags');

  const categories = [
    { key: 'coreFlags', name: 'Core Flags', icon: Command },
    { key: 'modelConfig', name: 'Model & Agent Config', icon: Cpu },
    { key: 'toolConfig', name: 'Tool Configuration', icon: Wrench },
    { key: 'systemPrompt', name: 'System Prompt', icon: FileText },
    { key: 'permissions', name: 'Permissions', icon: Shield },
    { key: 'mcpConfig', name: 'MCP Configuration', icon: Layers },
    { key: 'outputFormat', name: 'Output Format', icon: Code },
    { key: 'advanced', name: 'Advanced Options', icon: Settings },
    { key: 'subcommands', name: 'Subcommands', icon: Terminal },
  ];

  const filterByLevel = (items) => {
    if (level === 'all') return items;
    return items.filter(item => {
      if (level === 'beginner') return item.level === 'beginner';
      if (level === 'intermediate') return ['beginner', 'intermediate'].includes(item.level);
      return true;
    });
  };

  const filterBySearch = (items) => {
    if (!searchTerm) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(item =>
      (item.flag?.toLowerCase().includes(term) ||
       item.name?.toLowerCase().includes(term) ||
       item.desc?.toLowerCase().includes(term))
    );
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search commands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {categories.map(cat => {
          const Icon = cat.icon;
          const items = filterBySearch(filterByLevel(cliCommands[cat.key] || []));
          if (items.length === 0 && searchTerm) return null;

          return (
            <div key={cat.key} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => setExpandedCategory(expandedCategory === cat.key ? null : cat.key)}
                className="w-full p-3 flex items-center gap-3 text-left hover:bg-gray-50"
              >
                <Icon className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-800">{cat.name}</span>
                <span className="text-xs text-gray-400 ml-auto mr-2">{items.length} items</span>
                {expandedCategory === cat.key ?
                  <ChevronDown className="w-4 h-4 text-gray-400" /> :
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                }
              </button>

              {expandedCategory === cat.key && items.length > 0 && (
                <div className="border-t border-gray-100 divide-y divide-gray-50">
                  {items.map((item, i) => (
                    <div key={i} className="p-3 hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        <code className="text-sm bg-gray-100 text-blue-600 px-2 py-1 rounded font-mono whitespace-nowrap">
                          {item.flag || item.name}
                        </code>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-600">{item.desc}</p>
                          {item.example && (
                            <code className="text-xs text-gray-500 mt-1 block font-mono">
                              Example: {item.example}
                            </code>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                          item.level === 'beginner' ? 'bg-green-100 text-green-700' :
                          item.level === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {item.level}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: Tips & Tricks Section
// ============================================================================
const TipsSection = () => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {tipsAndTricks.map((category, i) => {
        const Icon = category.icon;
        return (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Icon className="w-5 h-5 text-blue-500" />
              {category.category}
            </h3>
            <div className="space-y-3">
              {category.tips.map((tip, j) => (
                <div key={j} className="group">
                  <div className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-700 text-sm">{tip.tip}</span>
                      <p className="text-xs text-gray-500 mt-0.5">{tip.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ============================================================================
// COMPONENT: Progress Tracker
// ============================================================================
const ProgressTracker = ({ completedModules, totalModules }) => {
  const percentage = Math.round((completedModules / totalModules) * 100);

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          <span className="font-semibold">Your Progress</span>
        </div>
        <span className="text-2xl font-bold">{percentage}%</span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-3">
        <div
          className="bg-white rounded-full h-3 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-white/80 text-sm mt-2">
        {completedModules} of {totalModules} modules completed
      </p>
    </div>
  );
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
export default function App() {
  const [activeTab, setActiveTab] = useState('learn');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [expandedModules, setExpandedModules] = useState(new Set(['getting-started']));
  const [completedModules, setCompletedModules] = useState(new Set());
  const [useRealTerminal, setUseRealTerminal] = useState(true);
  const [terminalReady, setTerminalReady] = useState(false);

  const toggleModule = (id) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleStartExercise = (exercise) => {
    setActiveTab('practice');
    // Could pre-fill the terminal with the command
  };

  const allModules = [
    ...trainingModules.beginner.map(m => ({ ...m, level: 'beginner' })),
    ...trainingModules.intermediate.map(m => ({ ...m, level: 'intermediate' })),
    ...trainingModules.advanced.map(m => ({ ...m, level: 'advanced' })),
  ];

  const filteredModules = selectedLevel === 'all'
    ? allModules
    : allModules.filter(m => m.level === selectedLevel);

  const totalModules = allModules.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
              <Terminal className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Claude Code Mastery</h1>
              <p className="text-white/80">Complete training from basics to advanced orchestration</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'learn', icon: BookOpen, label: 'Training Modules' },
              { id: 'practice', icon: Terminal, label: 'Practice Terminal' },
              { id: 'reference', icon: FileText, label: 'CLI Reference' },
              { id: 'tips', icon: Zap, label: 'Tips & Tricks' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-600'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Progress Tracker - Show on all tabs */}
        <div className="mb-6">
          <ProgressTracker
            completedModules={completedModules.size}
            totalModules={totalModules}
          />
        </div>

        {activeTab === 'learn' && (
          <div className="space-y-6">
            {/* Level Filter */}
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">Filter by level:</span>
              <div className="flex gap-2">
                {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedLevel === level
                        ? level === 'beginner' ? 'bg-green-500 text-white' :
                          level === 'intermediate' ? 'bg-blue-500 text-white' :
                          level === 'advanced' ? 'bg-purple-500 text-white' :
                          'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Learning Path */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Recommended Learning Path
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">CLI Basics</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">CLAUDE.md</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Hooks</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Subagents</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">MCP</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">Build MCP Server</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">CI/CD</span>
              </div>
            </div>

            {/* Modules */}
            <div className="space-y-4">
              {filteredModules.map(module => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  level={module.level}
                  isExpanded={expandedModules.has(module.id)}
                  onToggle={() => toggleModule(module.id)}
                  onStartExercise={handleStartExercise}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'practice' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h3 className="font-semibold text-amber-800 mb-1 flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                Interactive Practice Terminal
              </h3>
              <p className="text-amber-700 text-sm">
                Practice Claude Code commands in a safe, simulated environment. Try commands like{' '}
                <code className="bg-amber-100 px-1 rounded">claude</code>,{' '}
                <code className="bg-amber-100 px-1 rounded">/init</code>, or{' '}
                <code className="bg-amber-100 px-1 rounded">help</code>.
              </p>
            </div>

            {/* Terminal Toggle */}
            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useRealTerminal}
                  onChange={(e) => setUseRealTerminal(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">Use advanced terminal (xterm.js)</span>
              </label>
            </div>

            {/* Terminal */}
            {useRealTerminal ? (
              <RealTerminal onReady={() => setTerminalReady(true)} />
            ) : (
              <SimulatedTerminal />
            )}

            {/* Quick Reference */}
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-green-500" />
                  Beginner Exercises
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <span>Start a session: <code className="bg-gray-100 px-1 rounded">claude</code></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <span>Generate CLAUDE.md: <code className="bg-gray-100 px-1 rounded">/init</code></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <span>Check context: <code className="bg-gray-100 px-1 rounded">/context</code></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    <span>View MCP servers: <code className="bg-gray-100 px-1 rounded">claude mcp list</code></span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-500" />
                  Advanced Challenges
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">A</span>
                    <span>Create a custom code review agent</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">B</span>
                    <span>Set up PreToolUse hook for validation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">C</span>
                    <span>Build a custom MCP server</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">D</span>
                    <span>Configure GitHub Actions integration</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reference' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-semibold text-blue-800 mb-1 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Complete CLI Reference
              </h3>
              <p className="text-blue-700 text-sm">
                All Claude Code command-line options organized by category. Filter by skill level to focus on what's relevant for you.
              </p>
            </div>

            {/* Level Filter for Reference */}
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">Show commands for:</span>
              <div className="flex gap-2">
                {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedLevel === level
                        ? level === 'beginner' ? 'bg-green-500 text-white' :
                          level === 'intermediate' ? 'bg-blue-500 text-white' :
                          level === 'advanced' ? 'bg-purple-500 text-white' :
                          'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <CLIReference level={selectedLevel} />
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h3 className="font-semibold text-yellow-800 mb-1 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Tips & Tricks from the Community
              </h3>
              <p className="text-yellow-700 text-sm">
                Curated tips from Anthropic docs, GitHub discussions, and power users. These will save you time and tokens!
              </p>
            </div>

            <TipsSection />

            {/* Resources */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 mt-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                Additional Resources
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { name: 'Official Documentation', url: 'https://code.claude.com/docs', desc: 'Anthropic official docs' },
                  { name: 'CLI Reference', url: 'https://code.claude.com/docs/en/cli-reference', desc: 'Complete CLI options' },
                  { name: 'MCP Documentation', url: 'https://modelcontextprotocol.io', desc: 'Model Context Protocol' },
                  { name: 'GitHub - Claude Code Tips', url: 'https://github.com/ykdojo/claude-code-tips', desc: '40+ community tips' },
                  { name: 'Awesome Subagents', url: 'https://github.com/VoltAgent/awesome-claude-code-subagents', desc: '100+ agent examples' },
                  { name: 'Best Practices Guide', url: 'https://www.anthropic.com/engineering/claude-code-best-practices', desc: 'Anthropic engineering' },
                ].map((resource, i) => (
                  <a
                    key={i}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                    <div>
                      <span className="font-medium text-gray-700 group-hover:text-blue-600">{resource.name}</span>
                      <span className="text-xs text-gray-500 block">{resource.desc}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="font-semibold">Claude Code Mastery Training</p>
              <p className="text-gray-400 text-sm">Built with BACON-AI Framework</p>
            </div>
            <div className="text-center md:text-right text-sm text-gray-400">
              <p>Research sourced from:</p>
              <p>Anthropic Docs • GitHub • Community Forums</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
