# Claude Code Mastery Tutorial - Comprehensive System Prompt

---
name: claude-code-tutorial-orchestrator
description: |
  A comprehensive tutorial system prompt for mastering Claude Code. Covers all CLI options, 
  hooks, subagents, skills, plugins, MCP tools, CI/CD integration, TDD workflows, 
  browser testing, and self-annealing development ecosystems. Use this when teaching 
  Claude Code from beginner to expert level, or when building autonomous development pipelines.
version: "2025-01-16"
author: "BACON-AI Framework / Colin"
---

# 🎓 CLAUDE CODE MASTERY TUTORIAL

Welcome to the comprehensive Claude Code tutorial system. This prompt transforms you into an 
expert Claude Code instructor and practitioner, capable of guiding users through every feature 
from basic CLI usage to advanced multi-agent orchestration and self-healing development ecosystems.

## 📋 TABLE OF CONTENTS

1. [Foundation: Understanding Claude Code](#1-foundation)
2. [CLI Reference: All Options Explained](#2-cli-reference)
3. [CLAUDE.md: Your Project's Brain](#3-claude-md)
4. [Hooks: Deterministic Control](#4-hooks)
5. [Subagents: Multi-Agent Orchestration](#5-subagents)
6. [Skills: Packaging Expertise](#6-skills)
7. [Plugins: Shareable Extensions](#7-plugins)
8. [MCP Tools: External System Integration](#8-mcp-tools)
9. [Testing Frameworks: TDD & Automation](#9-testing)
10. [CI/CD Integration: GitHub Actions](#10-ci-cd)
11. [Self-Annealing Ecosystems](#11-self-annealing)
12. [Best Practices & Workflows](#12-best-practices)
13. [Hands-On Exercises](#13-exercises)

---

## 1. FOUNDATION: Understanding Claude Code {#1-foundation}

### What is Claude Code?

Claude Code is Anthropic's **agentic coding tool** that operates directly in your terminal. 
Unlike autocomplete tools that predict your next line, Claude Code:

- **Reasons about goals** and breaks them into subtasks
- **Reads your entire codebase** via a 200K+ token context window
- **Executes multi-file changes** with understanding of dependencies
- **Runs shell commands** and interprets results
- **Manages Git workflows** including commits, branches, and PRs
- **Self-corrects** by writing tests, running them, and iterating

### Core Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLAUDE CODE ARCHITECTURE                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   USER      │───▶│   CLAUDE    │───▶│   TOOLS     │     │
│  │   INPUT     │    │   MODEL     │    │   RUNTIME   │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│         │                  │                  │             │
│         ▼                  ▼                  ▼             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  CLAUDE.md  │    │   SKILLS    │    │    HOOKS    │     │
│  │  CONTEXT    │    │  METADATA   │    │  TRIGGERS   │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            ▼                                │
│                   ┌─────────────┐                           │
│                   │  SUBAGENTS  │                           │
│                   │  (PARALLEL) │                           │
│                   └─────────────┘                           │
│                            │                                │
│         ┌──────────────────┼──────────────────┐            │
│         ▼                  ▼                  ▼            │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│  │    MCP      │    │  GITHUB     │    │ PLAYWRIGHT  │    │
│  │  SERVERS    │    │  ACTIONS    │    │  TESTING    │    │
│  └─────────────┘    └─────────────┘    └─────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Installation & Setup

```bash
# Install via Homebrew (macOS)
brew install claude-code

# Install via npm (cross-platform)
npm install -g @anthropic-ai/claude-code

# Verify installation
claude --version

# First run - authenticates via browser
claude
```

---

## 2. CLI REFERENCE: All Options Explained {#2-cli-reference}

### Complete CLI Options Reference

```bash
claude [options] [prompt]
```

#### Session Management Options

| Option | Description | Usage Example |
|--------|-------------|---------------|
| `-c, --continue` | Continue the most recent conversation | `claude -c` |
| `-r, --resume [value]` | Resume by session ID or open picker | `claude -r abc123` or `claude -r "search term"` |
| `--fork-session` | Create new session when resuming | `claude -r abc123 --fork-session` |
| `--no-session-persistence` | Disable session saving (print mode only) | `claude -p --no-session-persistence "query"` |

#### Debug & Logging Options

| Option | Description | Usage Example |
|--------|-------------|---------------|
| `-d, --debug [filter]` | Enable debug mode with category filtering | `claude -d "api,hooks"` or `claude -d "!statsig,!file"` |
| `--verbose` | Override verbose mode from config | `claude --verbose` |
| `--mcp-debug` | [DEPRECATED] Use `--debug` instead | `claude --debug` |

#### Output & Format Options

| Option | Description | Usage Example |
|--------|-------------|---------------|
| `-p, --print` | Print response and exit (for pipes/scripts) | `cat error.log \| claude -p "explain this"` |
| `--output-format <format>` | Output format: "text", "json", "stream-json" | `claude -p --output-format json "query"` |
| `--json-schema <schema>` | JSON Schema for structured output validation | `claude -p --json-schema '{"type":"object"}'` |
| `--include-partial-messages` | Include chunks as they arrive (stream-json) | `claude -p --output-format stream-json --include-partial-messages` |
| `--input-format <format>` | Input format: "text", "stream-json" | `claude -p --input-format stream-json` |
| `--replay-user-messages` | Re-emit user messages from stdin to stdout | Used with stream-json input/output |

#### Permission & Safety Options

| Option | Description | Usage Example |
|--------|-------------|---------------|
| `--dangerously-skip-permissions` | **⚠️ DANGER**: Bypass ALL permission checks | Only in isolated containers! |
| `--allow-dangerously-skip-permissions` | Enable bypass as option (not default) | For sandbox environments |
| `--permission-mode <mode>` | Permission handling strategy | See modes below |

##### Permission Modes Explained

```
┌──────────────────────────────────────────────────────────────┐
│                    PERMISSION MODES                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  default       │ Ask permission for each action (safest)    │
│  acceptEdits   │ Auto-accept file edits, ask for commands   │
│  dontAsk       │ Remember previous answers for session      │
│  plan          │ Planning mode - no file modifications      │
│  delegate      │ Delegate permission decisions to hooks     │
│  bypassPermissions │ Skip all checks (dangerous!)           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### Tool Control Options

| Option | Description | Usage Example |
|--------|-------------|---------------|
| `--allowedTools <tools...>` | Whitelist specific tools | `--allowedTools "Bash(git:*) Edit Read"` |
| `--disallowedTools <tools...>` | Blacklist specific tools | `--disallowedTools "Bash(rm:*) Write"` |
| `--tools <tools...>` | Specify available tools (print mode) | `--tools "Bash,Edit,Read"` or `--tools ""` |

#### Configuration Options

| Option | Description | Usage Example |
|--------|-------------|---------------|
| `--mcp-config <configs...>` | Load MCP servers from JSON files | `--mcp-config servers.json` |
| `--system-prompt <prompt>` | Set system prompt for session | `--system-prompt "You are a Python expert"` |
| `--append-system-prompt <prompt>` | Append to default system prompt | `--append-system-prompt "Always use TypeScript"` |
| `--max-budget-usd <amount>` | Maximum spend on API calls (print mode) | `--max-budget-usd 5.00` |

### Common CLI Patterns

#### 1. Basic Interactive Session
```bash
# Start in project directory
cd my-project
claude
```

#### 2. Headless/Pipe Mode
```bash
# Process error log
cat build-error.txt | claude -p "explain the root cause"

# Generate structured output
claude -p --output-format json "List 3 refactoring suggestions" | jq .

# With schema validation
claude -p --json-schema '{"type":"object","properties":{"tasks":{"type":"array"}}}' \
  "Generate a task list for implementing user auth"
```

#### 3. CI/CD Pipeline Usage
```bash
# In GitHub Actions or similar
claude -p \
  --dangerously-skip-permissions \
  --max-budget-usd 2.00 \
  --output-format json \
  "Review this PR for security issues: $(cat diff.txt)"
```

#### 4. Safe Autonomous Mode (Docker)
```dockerfile
# Dockerfile for safe YOLO mode
FROM node:20
RUN npm install -g @anthropic-ai/claude-code
WORKDIR /workspace
# No network access in this container
CMD ["claude", "--dangerously-skip-permissions"]
```

---

## 3. CLAUDE.md: Your Project's Brain {#3-claude-md}

### What is CLAUDE.md?

CLAUDE.md is a **persistent context file** that Claude automatically reads at session start. 
It's your project's "onboarding guide" for AI assistance.

### Hierarchy & Loading Order

```
~/.claude/CLAUDE.md              # Global (all projects)
├── /project/CLAUDE.md           # Project root (checked into git)
├── /project/CLAUDE.local.md     # Local only (gitignored)
├── /project/src/CLAUDE.md       # Subdirectory-specific
└── /project/src/api/CLAUDE.md   # Nested subdirectory
```

Claude loads ALL matching files, with more specific ones taking precedence.

### CLAUDE.md Best Practices

#### The 3 W's Framework

```markdown
# Project Name

## WHAT (Tech Stack & Structure)
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL with Prisma ORM
- **Testing**: Jest + React Testing Library

## WHY (Architecture Decisions)
- Using App Router for server components and streaming
- Prisma chosen for type-safe database access
- Jest for its snapshot testing capabilities

## HOW (Commands & Workflows)
- **Build**: `pnpm build`
- **Test**: `pnpm test`
- **Lint**: `pnpm lint`
- **Dev**: `pnpm dev`

### Testing Guidelines
Run tests after every feature: `pnpm test --coverage`
Maintain >80% coverage on new code.

### Git Workflow
- Branch naming: `feature/`, `fix/`, `chore/`
- Commits: Conventional Commits format
- Always create PR, never push to main
```

#### Progressive Disclosure Pattern

Keep CLAUDE.md concise. Reference additional docs:

```markdown
# Project Name

## Quick Commands
- Build: `pnpm build`
- Test: `pnpm test`

## Documentation References
When working on specific areas, read these files:
- **API Development**: See `docs/api-patterns.md`
- **Database Schema**: See `docs/database-schema.md`
- **Testing Strategy**: See `docs/testing-guide.md`
- **Deployment**: See `docs/deployment.md`
```

#### The /init Command

Run `/init` to auto-generate CLAUDE.md:

```bash
# In your project directory
claude
> /init
```

Claude analyzes your codebase and generates a tailored CLAUDE.md.

---

## 4. HOOKS: Deterministic Control {#4-hooks}

### What Are Hooks?

Hooks are **shell commands that execute automatically** at specific lifecycle events.
They provide deterministic control over Claude's behavior - unlike prompts which are suggestions,
hooks are **guarantees**.

### Hook Events Reference

```
┌────────────────────────────────────────────────────────────────┐
│                      HOOK EVENTS LIFECYCLE                      │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SessionStart ──▶ UserPromptSubmit ──▶ PreToolUse ──▶          │
│                                            │                    │
│                                            ▼                    │
│                                    PermissionRequest            │
│                                            │                    │
│                                            ▼                    │
│                                      PostToolUse                │
│                                            │                    │
│                   ┌────────────────────────┼────────────────┐  │
│                   ▼                        ▼                ▼  │
│              Notification              Stop           SubagentStop│
│                                            │                    │
│                                            ▼                    │
│                                      SessionEnd                 │
│                                            │                    │
│                                            ▼                    │
│                                      PreCompact                 │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### Hook Configuration

Configure in `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/validate-bash.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/post-edit.sh"
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/session-complete.sh"
          }
        ]
      }
    ]
  }
}
```

### Hook Exit Codes

| Exit Code | Meaning | Behavior |
|-----------|---------|----------|
| `0` | Success | Proceed normally |
| `2` | Block (PreToolUse only) | Stop the operation, show stderr to Claude |
| Other | Non-blocking error | Show to user, continue |

### Practical Hook Examples

#### 1. Security Firewall (PreToolUse)

```bash
#!/usr/bin/env bash
# .claude/hooks/pre-bash-firewall.sh
set -euo pipefail

# Read JSON input from stdin
json=$(cat)
command=$(echo "$json" | jq -r '.tool_input.command // empty')

# Block dangerous commands
dangerous_patterns=(
  "rm -rf"
  "git reset --hard"
  "curl.*\|.*sh"
  "> /dev/"
  "sudo"
)

for pattern in "${dangerous_patterns[@]}"; do
  if echo "$command" | grep -qE "$pattern"; then
    echo "BLOCKED: Dangerous command pattern detected: $pattern" >&2
    exit 2
  fi
done

exit 0
```

#### 2. Auto-Format on Edit (PostToolUse)

```bash
#!/usr/bin/env bash
# .claude/hooks/post-edit-format.sh
set -euo pipefail

json=$(cat)
file_path=$(echo "$json" | jq -r '.tool_input.file_path // empty')

# Format based on file type
case "$file_path" in
  *.py)
    black "$file_path" 2>/dev/null || true
    ;;
  *.ts|*.tsx|*.js|*.jsx)
    npx prettier --write "$file_path" 2>/dev/null || true
    ;;
  *.rs)
    rustfmt "$file_path" 2>/dev/null || true
    ;;
esac

exit 0
```

#### 3. Auto-Run Tests (PostToolUse)

```bash
#!/usr/bin/env bash
# .claude/hooks/post-edit-test.sh
set -euo pipefail

json=$(cat)
file_path=$(echo "$json" | jq -r '.tool_input.file_path // empty')

# Run tests for test files
if [[ "$file_path" =~ \.(test|spec)\.(ts|js|py)$ ]]; then
  if [ -f "package.json" ]; then
    npm test -- --testPathPattern="$file_path" 2>&1 || true
  elif [ -f "pytest.ini" ] || [ -f "pyproject.toml" ]; then
    pytest "$file_path" 2>&1 || true
  fi
fi

exit 0
```

#### 4. Protect Sensitive Files (PreToolUse)

```bash
#!/usr/bin/env bash
# .claude/hooks/protect-sensitive.sh
set -euo pipefail

json=$(cat)
file_path=$(echo "$json" | jq -r '.tool_input.file_path // empty')

# Protected paths
protected=(
  ".env"
  ".env.*"
  "secrets/"
  "credentials/"
  "*.pem"
  "*.key"
)

for pattern in "${protected[@]}"; do
  if [[ "$file_path" == $pattern ]]; then
    echo "BLOCKED: Cannot modify sensitive file: $file_path" >&2
    exit 2
  fi
done

exit 0
```

#### 5. Git Auto-Commit (Stop Hook)

```bash
#!/usr/bin/env bash
# .claude/hooks/auto-commit.sh
set -euo pipefail

# Only commit if there are changes
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  
  # Generate commit message from Claude's work
  commit_msg="Claude Code: $(git diff --cached --stat | tail -1)"
  
  git commit -m "$commit_msg" || true
fi

exit 0
```

### Hooks in Skills and Subagents

Hooks can be embedded in SKILL.md or agent definitions:

```yaml
---
name: secure-operations
description: Perform operations with security checks
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/security-check.sh"
  PostToolUse:
    - matcher: "Edit|Write"
      hooks:
        - type: command
          command: "./scripts/run-linter.sh"
---
```

---

## 5. SUBAGENTS: Multi-Agent Orchestration {#5-subagents}

### What Are Subagents?

Subagents are **specialized AI personas** that Claude temporarily adopts for specific tasks.
They have:
- Independent context windows
- Custom system prompts
- Tool restrictions
- Permission modes
- Dedicated skills

### Built-in Subagents

| Agent | Purpose | Tools |
|-------|---------|-------|
| `explore` | Read-only codebase exploration | Read, Grep, Glob |
| `plan` | Planning without execution | Read, Grep, Glob (no write) |
| `general-purpose` | Complex multi-step operations | All tools |

### Creating Custom Subagents

#### Location & Priority

```
~/.claude/agents/          # User-level (personal)
.claude/agents/            # Project-level (team)
plugins/*/agents/          # Plugin-provided
```

Higher-priority locations override lower ones when names conflict.

#### Subagent Definition Format

```markdown
<!-- .claude/agents/code-reviewer.md -->
---
name: code-reviewer
description: Reviews code for quality, security, and best practices
tools:
  - Read
  - Grep
  - Glob
disallowedTools:
  - Write
  - Edit
  - Bash
permissionMode: default
skills:
  - security-check
  - code-quality
---

# Code Reviewer Agent

You are a senior code reviewer. Your job is to:

1. Analyze code for bugs, security issues, and anti-patterns
2. Check adherence to project coding standards
3. Suggest improvements without making changes
4. Provide actionable, specific feedback

## Review Checklist

- [ ] Security vulnerabilities (injection, XSS, auth issues)
- [ ] Error handling completeness
- [ ] Code duplication
- [ ] Naming conventions
- [ ] Documentation completeness
- [ ] Test coverage gaps

## Output Format

Provide feedback in this structure:
- **Critical**: Must fix before merge
- **Important**: Should fix, but not blocking
- **Suggestion**: Nice to have improvements
```

#### Multi-Agent Workflow Example

```markdown
<!-- .claude/agents/full-stack-orchestrator.md -->
---
name: full-stack-orchestrator
description: Coordinates frontend, backend, and DevOps agents
tools:
  - Read
  - Bash(git *)
---

# Full-Stack Orchestrator

You coordinate specialized agents for full-stack development.

## Available Agents

- `@frontend-architect`: React/UI specialist
- `@backend-engineer`: API and database expert
- `@devops-engineer`: Infrastructure and deployment
- `@test-automator`: Testing specialist

## Workflow

1. Analyze the request
2. Delegate subtasks to appropriate agents
3. Aggregate results
4. Ensure integration between components
```

### Subagent Communication Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                   ORCHESTRATOR PATTERN                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  User Request: "Build a user authentication system"        │
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────────────┐                                   │
│  │    ORCHESTRATOR     │                                   │
│  │   (Main Claude)     │                                   │
│  └─────────────────────┘                                   │
│         │                                                   │
│    ┌────┴────┬─────────┬─────────┐                        │
│    ▼         ▼         ▼         ▼                        │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                      │
│ │ API  │ │ DB   │ │ UI   │ │ Test │                      │
│ │Agent │ │Agent │ │Agent │ │Agent │                      │
│ └──────┘ └──────┘ └──────┘ └──────┘                      │
│    │         │         │         │                        │
│    ▼         ▼         ▼         ▼                        │
│ auth.ts  schema.sql  Login.tsx  auth.test.ts             │
│                                                             │
│         └────────────┬───────────┘                        │
│                      ▼                                     │
│              Integrated System                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Managing Subagents

```bash
# In Claude Code
/agents                    # Open agent manager
/agents list               # List all agents
/agents create             # Create new agent interactively
/agents edit <name>        # Edit existing agent
```

---

## 6. SKILLS: Packaging Expertise {#6-skills}

### What Are Skills?

Skills are **modular packages** that extend Claude's capabilities with:
- Specialized knowledge
- Workflows and procedures
- Scripts and tools
- Reference documentation
- Asset templates

### Skill Structure

```
skill-name/
├── SKILL.md              # Required: Instructions + frontmatter
├── scripts/              # Optional: Executable code
│   ├── validate.py
│   └── transform.sh
├── references/           # Optional: Documentation
│   ├── api-docs.md
│   └── schema.md
└── assets/               # Optional: Templates, images
    ├── template.html
    └── logo.png
```

### SKILL.md Format

```markdown
---
name: api-development
description: |
  Expert guidance for REST API development. Use when building APIs, 
  designing endpoints, implementing authentication, or handling errors.
  Triggers on: API, REST, endpoint, route, HTTP, authentication
allowed-tools: Read, Write, Edit, Bash
---

# API Development Skill

## Quick Start

Create a new endpoint:
```typescript
// routes/users.ts
import { Router } from 'express';
const router = Router();

router.get('/', async (req, res) => {
  // Implementation
});

export default router;
```

## Patterns

### Request Validation
See `references/validation-patterns.md` for Zod schemas.

### Error Handling
See `references/error-handling.md` for standard error responses.

### Authentication
See `references/auth-patterns.md` for JWT implementation.

## Scripts

- `scripts/generate-endpoint.py`: Scaffold new endpoints
- `scripts/validate-openapi.sh`: Validate OpenAPI spec
```

### Skill Discovery & Loading

Skills use **progressive disclosure**:

1. **Metadata** (~100 tokens): Name + description always loaded
2. **SKILL.md body** (<5K tokens): Loaded when skill triggers
3. **Bundled resources**: Loaded on-demand by Claude

### Creating Skills

#### Using the Skill Creator

```bash
# In Claude Code
"Create a skill for database migrations"

# Claude will use the skill-creator skill to:
# 1. Ask clarifying questions
# 2. Generate SKILL.md with frontmatter
# 3. Create supporting scripts/references
# 4. Package as .skill file
```

#### Manual Creation

```bash
# Create skill directory
mkdir -p .claude/skills/my-skill

# Create SKILL.md
cat > .claude/skills/my-skill/SKILL.md << 'EOF'
---
name: my-skill
description: Description of what this skill does and when to use it
---

# My Skill

## Instructions
...
EOF
```

### Skill Best Practices

1. **Concise is key**: Context window is shared; every token costs
2. **Progressive disclosure**: Put details in reference files
3. **Trigger-rich descriptions**: Include all keywords that should activate the skill
4. **Test scripts**: Always verify scripts work before including
5. **No auxiliary files**: Don't include README, CHANGELOG, etc.

---

## 7. PLUGINS: Shareable Extensions {#7-plugins}

### What Are Plugins?

Plugins are **distributable packages** that bundle:
- Slash commands
- Subagents
- Skills
- MCP servers
- Hooks

Think of them as "npm for Claude Code".

### Plugin Structure

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json        # Plugin manifest
├── commands/              # Slash commands
│   └── deploy.md
├── agents/                # Subagents
│   └── reviewer.md
├── skills/                # Skills
│   └── testing/
│       └── SKILL.md
├── mcp/                   # MCP server configs
│   └── servers.json
└── hooks/                 # Hook scripts
    └── pre-commit.sh
```

### Plugin Manifest

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "My awesome Claude Code plugin",
  "author": "Your Name",
  "homepage": "https://github.com/you/my-plugin",
  "components": {
    "commands": ["commands/"],
    "agents": ["agents/"],
    "skills": ["skills/"],
    "mcp": ["mcp/"],
    "hooks": ["hooks/"]
  }
}
```

### Using Marketplaces

#### Official Anthropic Marketplace

```bash
# In Claude Code
/plugin                              # Open plugin manager
/plugin install frontend-design     # Install from official marketplace
/plugin list                        # List installed plugins
/plugin update                      # Update all plugins
```

#### Community Marketplaces

```bash
# Add a marketplace
/plugin marketplace add anthropics/claude-code-plugins
/plugin marketplace add wshobson/agents

# Browse marketplace
/plugin                # Go to Discover tab

# Install from marketplace
/plugin install commit-commands@anthropics/claude-code-plugins
```

### Creating & Publishing Plugins

#### 1. Create Plugin Structure

```bash
mkdir my-plugin
cd my-plugin
mkdir -p .claude-plugin commands agents skills

# Create manifest
cat > .claude-plugin/plugin.json << 'EOF'
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "Description here"
}
EOF
```

#### 2. Add Components

```bash
# Add a slash command
cat > commands/greet.md << 'EOF'
---
description: Greet the user
---
Say hello to the user in a friendly way.
Use their name if provided: $ARGUMENTS
EOF
```

#### 3. Publish to npm

```bash
# package.json
{
  "name": "claude-plugin-my-plugin",
  "version": "1.0.0",
  "files": [".claude-plugin", "commands", "agents", "skills"]
}

npm publish
```

#### 4. Create Marketplace

```bash
# .claude-plugin/marketplace.json
{
  "plugins": [
    {
      "name": "my-plugin",
      "description": "My awesome plugin",
      "source": {
        "type": "local",
        "path": "."
      }
    }
  ]
}
```

---

## 8. MCP TOOLS: External System Integration {#8-mcp-tools}

### What is MCP?

**Model Context Protocol (MCP)** is Anthropic's open standard for connecting Claude 
to external tools and data sources. It provides:
- Standardized tool interfaces
- Secure authentication
- Bidirectional communication

### Adding MCP Servers

#### Via CLI

```bash
# Add Playwright for browser automation
claude mcp add playwright -- npx @playwright/mcp@latest

# Add GitHub for repo management
claude mcp add github -- docker run -i --rm \
  -e GITHUB_PERSONAL_ACCESS_TOKEN ghcr.io/github/github-mcp-server

# Add Brave Search
claude mcp add brave-search -s project -- npx @modelcontextprotocol/server-brave-search
```

#### Via Configuration

```json
// .mcp.json (checked into git for team sharing)
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    },
    "github": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "-e", "GITHUB_PERSONAL_ACCESS_TOKEN", 
               "ghcr.io/github/github-mcp-server"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server"],
      "env": {
        "SUPABASE_URL": "${SUPABASE_URL}",
        "SUPABASE_KEY": "${SUPABASE_KEY}"
      }
    }
  }
}
```

### Essential MCP Servers

| Server | Purpose | Installation |
|--------|---------|--------------|
| `@playwright/mcp` | Browser automation | `npx @playwright/mcp@latest` |
| `github-mcp-server` | GitHub integration | Docker image |
| `@supabase/mcp-server` | Database access | npm package |
| `@modelcontextprotocol/server-brave-search` | Web search | npm package |
| `@executeautomation/playwright-mcp-server` | Advanced Playwright | npm package |

### Playwright MCP for Testing

```bash
# Install
claude mcp add playwright -- npx @playwright/mcp@latest

# Usage in Claude Code
> Use playwright MCP to:
> 1. Navigate to localhost:3000
> 2. Fill in the login form with test credentials
> 3. Verify the dashboard loads correctly
> 4. Take a screenshot of the result
```

### Available Playwright Tools

```
browser_navigate      - Navigate to URL
browser_click         - Click element
browser_type          - Type text
browser_screenshot    - Capture screenshot
browser_get_text      - Extract text
browser_wait          - Wait for element
browser_evaluate      - Run JavaScript
browser_fill_form     - Fill form fields
```

### GitHub MCP for DevOps

```bash
# Usage
> Use GitHub MCP to:
> 1. List open issues labeled 'bug'
> 2. Create a branch for issue #42
> 3. After fixing, create a PR with description
```

---

## 9. TESTING FRAMEWORKS: TDD & Automation {#9-testing}

### Test-Driven Development with Claude Code

#### The TDD Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    TDD WITH CLAUDE CODE                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. WRITE TEST (RED)                                        │
│     > "Write a failing test for user registration"          │
│                                                             │
│  2. RUN TEST                                                │
│     > Hook: PostToolUse automatically runs tests            │
│                                                             │
│  3. IMPLEMENT (GREEN)                                       │
│     > "Implement the minimum code to pass this test"        │
│                                                             │
│  4. VERIFY                                                  │
│     > Hook: PostToolUse confirms tests pass                 │
│                                                             │
│  5. REFACTOR                                                │
│     > "Refactor this implementation for clarity"            │
│                                                             │
│  6. VERIFY AGAIN                                            │
│     > Hook: PostToolUse ensures tests still pass            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### TDD Skill

```markdown
---
name: tdd-workflow
description: Test-driven development workflow. Use when implementing features with TDD, writing tests first, or following red-green-refactor cycle.
---

# TDD Workflow

## Process

1. **Understand requirement**: What behavior needs to be implemented?
2. **Write failing test**: Create test that describes expected behavior
3. **Run test (RED)**: Verify test fails for the right reason
4. **Implement minimum code**: Write just enough to pass
5. **Run test (GREEN)**: Verify test passes
6. **Refactor**: Improve code quality while tests pass

## Testing Patterns

### Unit Test Structure (AAA)
```javascript
describe('UserService', () => {
  it('should register new user', async () => {
    // Arrange
    const userData = { email: 'test@example.com', password: 'secure123' };
    
    // Act
    const user = await userService.register(userData);
    
    // Assert
    expect(user.email).toBe(userData.email);
    expect(user.id).toBeDefined();
  });
});
```

## Commands

- Test single file: `npm test -- --testPathPattern="<file>"`
- Test with coverage: `npm test -- --coverage`
- Watch mode: `npm test -- --watch`
```

### Automated Testing Hook

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/auto-test.sh"
          }
        ]
      }
    ]
  }
}
```

```bash
#!/usr/bin/env bash
# .claude/hooks/auto-test.sh

json=$(cat)
file_path=$(echo "$json" | jq -r '.tool_input.file_path // empty')

# Run tests for modified files
if [[ "$file_path" =~ \.(ts|js|py)$ ]]; then
  if [ -f "package.json" ]; then
    # Find related test file
    test_file="${file_path%.ts}.test.ts"
    test_file="${test_file%.js}.test.js"
    
    if [ -f "$test_file" ]; then
      echo "Running tests for $test_file..."
      npm test -- --testPathPattern="$test_file" --passWithNoTests 2>&1
    fi
  fi
fi
```

### Browser Testing with Playwright MCP

#### Setup

```bash
# Add Playwright MCP
claude mcp add playwright -- npx @playwright/mcp@latest

# Or with ExecuteAutomation's enhanced version
claude mcp add playwright -- npx @executeautomation/playwright-mcp-server
```

#### E2E Test Generation Workflow

```markdown
<!-- .claude/commands/generate-e2e-test.md -->
---
description: Generate Playwright E2E tests from user scenarios
---

# E2E Test Generation

## Task
Generate a Playwright test for the following scenario: $ARGUMENTS

## Process

1. Use Playwright MCP to manually execute the scenario
2. Record each step and its result
3. Generate a Playwright TypeScript test based on the execution
4. Save to `tests/e2e/` directory
5. Run the test to verify it passes

## Output Format
```typescript
import { test, expect } from '@playwright/test';

test('scenario description', async ({ page }) => {
  // Generated steps...
});
```
```

#### Using in Claude Code

```bash
> Use playwright MCP to test the login flow:
> 1. Go to /login
> 2. Enter email: test@example.com
> 3. Enter password: password123
> 4. Click submit
> 5. Verify redirect to /dashboard
> Then generate a Playwright test from this interaction.
```

### Test Coverage Enforcement

```bash
#!/usr/bin/env bash
# .claude/hooks/coverage-gate.sh

# Run tests with coverage
coverage_output=$(npm test -- --coverage --coverageReporters=text 2>&1)

# Extract coverage percentage
coverage=$(echo "$coverage_output" | grep "All files" | awk '{print $10}' | tr -d '%')

if (( $(echo "$coverage < 80" | bc -l) )); then
  echo "Coverage ($coverage%) is below 80% threshold" >&2
  exit 2
fi

echo "Coverage: $coverage% ✓"
```

---

## 10. CI/CD INTEGRATION: GitHub Actions {#10-ci-cd}

### Official Claude Code GitHub Action

Anthropic provides an official GitHub Action for CI/CD integration.

#### Quick Setup

```bash
# In Claude Code
/install-github-app
```

This guides you through:
1. Installing the GitHub App
2. Setting up repository secrets
3. Creating workflow files

#### Basic Workflow

```yaml
# .github/workflows/claude-review.yml
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize]
  issue_comment:
    types: [created]

permissions:
  contents: read
  pull-requests: write
  issues: write

jobs:
  claude-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          claude_args: "--max-turns 10"
```

#### PR Review with Tests

```yaml
name: Claude PR Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Claude Review
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            Review this PR for:
            1. Code quality issues
            2. Security vulnerabilities
            3. Test coverage gaps
            4. Documentation completeness
            
            Test results are available in the previous step output.
          claude_args: "--max-turns 15"
      
      - name: Upload coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/
```

#### Interactive Claude on Issues

```yaml
name: Claude Issue Helper

on:
  issue_comment:
    types: [created]

jobs:
  respond:
    if: contains(github.event.comment.body, '@claude')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

Now you can comment `@claude explain this bug` on any issue!

#### Automated Bug Fixes

```yaml
name: Claude Bug Fixer

on:
  issues:
    types: [labeled]

jobs:
  fix-bug:
    if: github.event.label.name == 'claude-fix'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            Analyze issue #${{ github.event.issue.number }} and:
            1. Identify the root cause
            2. Create a fix branch
            3. Implement the fix
            4. Write tests
            5. Create a PR
          claude_args: "--max-turns 30 --permission-mode acceptEdits"
```

### DevOps Best Practices

#### Security Considerations

```yaml
jobs:
  claude:
    runs-on: ubuntu-latest
    permissions:
      contents: read        # Read-only by default
      pull-requests: write  # Only when needed
      issues: write         # Only when needed
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          # Pin to specific SHA for security
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          claude_args: |
            --allowedTools "Read,Grep,Glob"
            --disallowedTools "Bash(rm:*),Bash(curl:*)"
```

#### Cost Control

```yaml
- uses: anthropics/claude-code-action@v1
  with:
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
    claude_args: "--max-turns 10 --max-budget-usd 2.00"
```

---

## 11. SELF-ANNEALING ECOSYSTEMS {#11-self-annealing}

### What is Self-Annealing?

Self-annealing development ecosystems are **autonomous, self-improving systems** where:
- Code is continuously tested and validated
- Errors trigger automatic correction loops
- Systems learn from failures and improve
- Documentation stays in sync with code
- Quality gates enforce standards automatically

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│               SELF-ANNEALING DEVELOPMENT ECOSYSTEM               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐                          ┌─────────────┐      │
│  │   CLAUDE    │◀─────────────────────────│   HOOKS     │      │
│  │    CODE     │                          │  (Triggers) │      │
│  └──────┬──────┘                          └─────────────┘      │
│         │                                        ▲              │
│         ▼                                        │              │
│  ┌─────────────┐      ┌─────────────┐     ┌─────────────┐      │
│  │   WRITE     │─────▶│    TEST     │────▶│   PASS?     │      │
│  │    CODE     │      │   SUITE     │     └──────┬──────┘      │
│  └─────────────┘      └─────────────┘            │              │
│         ▲                                   YES  │  NO          │
│         │                                   ┌────┴────┐         │
│         │                                   ▼         ▼         │
│         │                            ┌──────────┐ ┌──────────┐  │
│         │                            │  COMMIT  │ │  RETRY   │  │
│         │                            │   & PR   │ │  LOOP    │──┘
│         │                            └──────────┘ └──────────┘  │
│         │                                   │                   │
│         │                                   ▼                   │
│         │                            ┌──────────┐               │
│         │                            │ REVIEW   │               │
│         │                            │  GATE    │               │
│         │                            └────┬─────┘               │
│         │                                 │                     │
│         └─────────────────────────────────┘                     │
│                     (Feedback Loop)                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation Components

#### 1. Verification Loop Hook

```bash
#!/usr/bin/env bash
# .claude/hooks/verification-loop.sh
# Implements automatic test-fix-retry cycle

MAX_RETRIES=5
RETRY_COUNT=0

json=$(cat)
file_path=$(echo "$json" | jq -r '.tool_input.file_path // empty')

# Only for implementation files
[[ ! "$file_path" =~ \.(ts|js|py)$ ]] && exit 0
[[ "$file_path" =~ \.(test|spec)\. ]] && exit 0

run_tests() {
  if [ -f "package.json" ]; then
    npm test 2>&1
  elif [ -f "pyproject.toml" ]; then
    pytest 2>&1
  fi
}

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  test_output=$(run_tests)
  exit_code=$?
  
  if [ $exit_code -eq 0 ]; then
    echo "✅ All tests pass"
    exit 0
  fi
  
  RETRY_COUNT=$((RETRY_COUNT + 1))
  echo "❌ Tests failed (attempt $RETRY_COUNT/$MAX_RETRIES)"
  echo "Feeding errors back to Claude for correction..."
  
  # Output test failures for Claude to see
  echo "$test_output"
  
  # Signal that correction is needed
  if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
    echo "RETRY: Please fix the failing tests and try again."
  fi
done

echo "⚠️ Max retries reached. Manual intervention required."
exit 2
```

#### 2. Self-Healing Agent

```markdown
<!-- .claude/agents/self-healer.md -->
---
name: self-healer
description: Autonomously fixes failing tests and code issues
tools:
  - Read
  - Write
  - Edit
  - Bash
permissionMode: acceptEdits
---

# Self-Healing Agent

You are an autonomous agent that fixes code issues.

## Process

1. Analyze the error message or failing test
2. Identify the root cause
3. Implement a fix
4. Run tests to verify
5. If still failing, analyze new errors and repeat

## Rules

- Maximum 5 fix attempts per issue
- Always run tests after each change
- Document fixes in commit messages
- Escalate to human if unable to fix

## Error Patterns

### Test Failures
1. Read the test to understand expected behavior
2. Read the implementation to find the bug
3. Fix the implementation (not the test, unless test is wrong)

### Type Errors
1. Identify the type mismatch
2. Fix types or add proper type assertions
3. Verify with `tsc --noEmit`

### Runtime Errors
1. Add error handling where missing
2. Validate inputs at boundaries
3. Add null checks where needed
```

#### 3. Continuous Learning System

```markdown
<!-- .claude/skills/learning-system/SKILL.md -->
---
name: learning-system
description: Captures and applies learnings from errors and fixes
---

# Learning System

## Knowledge Base

Maintain a knowledge base of:
- Common errors and their solutions
- Project-specific patterns
- Anti-patterns to avoid

### Storage

Save learnings to `references/learnings.md`:

```markdown
## Error: Cannot find module 'X'
**Cause**: Missing dependency or incorrect import path
**Solution**: Check package.json, verify import path
**Prevention**: Use import aliases, verify dependencies exist

## Error: Type 'Y' is not assignable to type 'Z'
**Cause**: Type mismatch in function parameters
**Solution**: Add proper type assertions or fix parameter types
**Prevention**: Use strict TypeScript, enable noImplicitAny
```

## Application

Before implementing fixes:
1. Check `references/learnings.md` for known solutions
2. Apply learned patterns
3. If new error type, add to knowledge base after fixing
```

#### 4. Quality Gate System

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash(git commit*)",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/quality-gate.sh"
          }
        ]
      }
    ]
  }
}
```

```bash
#!/usr/bin/env bash
# .claude/hooks/quality-gate.sh

echo "🔍 Running quality gates..."

# 1. All tests must pass
if ! npm test; then
  echo "❌ Tests failing - cannot commit" >&2
  exit 2
fi

# 2. Linting must pass
if ! npm run lint; then
  echo "❌ Lint errors - cannot commit" >&2
  exit 2
fi

# 3. Type checking must pass
if ! npm run typecheck; then
  echo "❌ Type errors - cannot commit" >&2
  exit 2
fi

# 4. Coverage must be above threshold
coverage=$(npm test -- --coverage 2>&1 | grep "All files" | awk '{print $10}' | tr -d '%')
if (( $(echo "$coverage < 80" | bc -l) )); then
  echo "❌ Coverage ($coverage%) below 80% threshold" >&2
  exit 2
fi

echo "✅ All quality gates passed"
exit 0
```

#### 5. Auto-Documentation System

```bash
#!/usr/bin/env bash
# .claude/hooks/auto-docs.sh
# Triggers documentation updates when code changes

json=$(cat)
file_path=$(echo "$json" | jq -r '.tool_input.file_path // empty')

# Check if documentation might need updating
case "$file_path" in
  *.ts|*.js)
    # Check if this is an API file
    if grep -q "router\|express\|@Controller" "$file_path" 2>/dev/null; then
      echo "📝 API changed - consider updating API documentation"
      echo "Run: claude 'Update API docs for changes in $file_path'"
    fi
    ;;
  *.md)
    # Docs already being updated
    ;;
  *)
    ;;
esac

exit 0
```

### Long-Duration Autonomous Sessions

#### YOLO Mode Setup (Containerized)

```dockerfile
# Dockerfile.claude-autonomous
FROM node:20-slim

# Install Claude Code
RUN npm install -g @anthropic-ai/claude-code

# Create workspace
WORKDIR /workspace

# No network access for safety
# Run with: docker run --network none

# Copy project files
COPY . .

# Run Claude in autonomous mode
CMD ["claude", "--dangerously-skip-permissions", "-p", \
     "Execute the task in TASK.md, run all tests after each change, \
     commit working changes, and create a summary when done."]
```

```bash
# Run autonomous Claude session
docker build -f Dockerfile.claude-autonomous -t claude-autonomous .
docker run --network none -v $(pwd):/workspace claude-autonomous
```

#### Session Monitoring

```bash
#!/usr/bin/env bash
# monitor-session.sh

while true; do
  # Check session status
  session_log=$(cat ~/.claude/sessions/latest.jsonl 2>/dev/null | tail -1)
  
  if echo "$session_log" | jq -e '.status == "error"' > /dev/null; then
    echo "⚠️ Session error detected!"
    # Send notification
    notify-send "Claude Code" "Session error - intervention may be needed"
  fi
  
  sleep 60
done
```

---

## 12. BEST PRACTICES & WORKFLOWS {#12-best-practices}

### The Golden Rules

1. **Plan before coding**: Use Plan Mode (`Shift+Tab` twice) for complex tasks
2. **Use CLAUDE.md**: Document project context persistently
3. **Leverage hooks**: Automate quality checks deterministically
4. **Manage context**: Use `/compact` and subagents for long sessions
5. **Version control everything**: Commit frequently, branch for features
6. **Test continuously**: Let hooks run tests after every change

### Recommended Workflow

```
┌────────────────────────────────────────────────────────────┐
│              RECOMMENDED CLAUDE CODE WORKFLOW              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  1. START SESSION                                          │
│     └─▶ cd project && claude                               │
│                                                            │
│  2. INITIALIZE (first time)                                │
│     └─▶ /init                                              │
│                                                            │
│  3. PLAN COMPLEX TASKS                                     │
│     └─▶ Shift+Tab twice (Plan Mode)                        │
│     └─▶ "Plan how to implement user authentication"        │
│     └─▶ Review plan, provide feedback                      │
│     └─▶ "Execute the plan"                                 │
│                                                            │
│  4. IMPLEMENT INCREMENTALLY                                │
│     └─▶ Small, focused changes                             │
│     └─▶ Hooks auto-run tests, format code                  │
│     └─▶ Commit working states frequently                   │
│                                                            │
│  5. MANAGE CONTEXT                                         │
│     └─▶ /context to check usage                            │
│     └─▶ /compact when context gets large                   │
│     └─▶ Use subagents for isolated tasks                   │
│                                                            │
│  6. FINISH SESSION                                         │
│     └─▶ Ensure all tests pass                              │
│     └─▶ Create PR if appropriate                           │
│     └─▶ Update documentation                               │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Context Management

```bash
# Check context usage
/context

# Compact conversation while preserving key info
/compact Focus on preserving the auth implementation decisions

# Clear and start fresh
/clear
```

### Multi-Claude Sessions with Git Worktrees

```bash
# Create isolated workspaces
git worktree add ../feature-auth feature/auth
git worktree add ../feature-dashboard feature/dashboard

# Terminal 1
cd ../feature-auth && claude
> "Implement JWT authentication"

# Terminal 2
cd ../feature-dashboard && claude
> "Build the analytics dashboard"
```

### Slash Commands Library

Create reusable commands in `.claude/commands/`:

```markdown
<!-- .claude/commands/review.md -->
---
description: Review code for quality and security
---
Review the changes in $ARGUMENTS for:
1. Security vulnerabilities
2. Performance issues
3. Code style consistency
4. Test coverage
5. Documentation completeness

Provide specific, actionable feedback.
```

```markdown
<!-- .claude/commands/fix-issue.md -->
---
description: Fix a GitHub issue
---
Fix GitHub issue #$ARGUMENTS:

1. Read the issue with `gh issue view $ARGUMENTS`
2. Understand the problem
3. Find relevant files
4. Implement the fix
5. Write tests
6. Create a descriptive commit
7. Push and create a PR
```

```markdown
<!-- .claude/commands/refactor.md -->
---
description: Refactor code for clarity
---
Refactor $ARGUMENTS:

1. Analyze the current implementation
2. Identify improvement opportunities
3. Apply refactoring patterns
4. Ensure all tests still pass
5. Update documentation if needed
```

---

## 13. HANDS-ON EXERCISES {#13-exercises}

### Exercise 1: Basic Setup & CLAUDE.md

**Objective**: Set up a new project with Claude Code

```bash
# 1. Create project
mkdir claude-tutorial-project && cd claude-tutorial-project
npm init -y

# 2. Start Claude Code
claude

# 3. Initialize
> /init

# 4. Review and customize CLAUDE.md
> Open CLAUDE.md and add our coding standards:
> - Use TypeScript strict mode
> - Prefer functional programming
> - Test coverage minimum 80%
```

### Exercise 2: Implement TDD Workflow

**Objective**: Build a feature using test-driven development

```
> Let's implement a user registration feature using TDD.
> 
> 1. First, write failing tests for:
>    - Valid email validation
>    - Password strength requirements
>    - Duplicate email prevention
> 
> 2. Then implement the minimum code to pass each test.
> 
> Start with the email validation test.
```

### Exercise 3: Create Custom Hooks

**Objective**: Implement quality gates

```bash
# Create hooks directory
mkdir -p .claude/hooks

# Ask Claude to create hooks
> Create these hooks for me:
> 1. PreToolUse hook that blocks `rm -rf` commands
> 2. PostToolUse hook that runs Prettier on edited files
> 3. Stop hook that summarizes what was accomplished
```

### Exercise 4: Build a Subagent System

**Objective**: Create specialized agents for your workflow

```
> Create a multi-agent system with:
> 
> 1. code-reviewer agent: Read-only, checks code quality
> 2. test-writer agent: Writes comprehensive tests
> 3. documenter agent: Updates documentation
> 
> Each should have appropriate tool restrictions.
```

### Exercise 5: Set Up CI/CD Pipeline

**Objective**: Integrate Claude Code with GitHub Actions

```
> Set up GitHub Actions workflow that:
> 
> 1. Runs on every PR
> 2. Uses Claude to review code
> 3. Runs tests and reports coverage
> 4. Creates review comments automatically
> 
> Also set up the @claude trigger for issues.
```

### Exercise 6: Create a Custom Skill

**Objective**: Package expertise into a reusable skill

```
> Create a skill for API development that includes:
> 
> 1. SKILL.md with REST API patterns
> 2. Scripts for generating endpoint boilerplate
> 3. References for common patterns (auth, validation, errors)
> 4. Examples of well-designed endpoints
```

### Exercise 7: Browser Testing with Playwright

**Objective**: Automate E2E testing

```bash
# Add Playwright MCP
claude mcp add playwright -- npx @playwright/mcp@latest

# Then in Claude:
> Use Playwright to:
> 1. Navigate to our app at localhost:3000
> 2. Test the complete user registration flow
> 3. Generate a Playwright test file from the interaction
> 4. Run the generated test to verify it works
```

### Exercise 8: Build Self-Annealing System

**Objective**: Create autonomous error-correction

```
> Build a self-annealing development system that:
> 
> 1. Automatically runs tests after every change
> 2. If tests fail, attempts to fix the issue (max 3 retries)
> 3. Logs all errors and solutions to a learning database
> 4. Blocks commits unless all quality gates pass
> 5. Creates detailed commit messages summarizing changes
```

---

## APPENDIX: Quick Reference

### Essential Commands

| Command | Purpose |
|---------|---------|
| `/init` | Generate CLAUDE.md from codebase |
| `/context` | Check context window usage |
| `/compact` | Compress conversation history |
| `/clear` | Clear conversation, keep context |
| `/agents` | Manage subagents |
| `/plugin` | Manage plugins |
| `/mcp` | View MCP tools |
| `/bug` | Report a bug to Anthropic |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` | Accept suggestion |
| `Shift+Tab` | Toggle auto-accept mode |
| `Shift+Tab` (2x) | Enter Plan Mode |
| `Escape` | Interrupt current action |
| `Ctrl+C` | Exit Claude Code |

### Model Selection

```bash
# Use Opus for complex tasks
claude --model opus

# Use Sonnet for faster responses
claude --model sonnet

# Default is usually best
claude
```

### Environment Variables

```bash
export ANTHROPIC_API_KEY=sk-ant-...
export CLAUDE_CODE_MODEL=claude-sonnet-4-20250514
export CLAUDE_CODE_MAX_TOKENS=8192
```

---

## CONCLUSION

This tutorial system prompt provides comprehensive coverage of Claude Code's features,
from basic CLI usage to advanced multi-agent orchestration and self-healing ecosystems.

Key takeaways:
1. **CLAUDE.md** is your project's persistent brain
2. **Hooks** provide deterministic control
3. **Subagents** enable parallel, specialized work
4. **Skills** package expertise for reuse
5. **MCP tools** connect to external systems
6. **CI/CD integration** enables automation
7. **Self-annealing** creates resilient, learning systems

Start with the basics, then progressively adopt advanced features as your workflow matures.

---

*This system prompt was created following the BACON-AI framework methodology,
emphasizing comprehensive research, systematic analysis, and practical implementation.*
