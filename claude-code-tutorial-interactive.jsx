import React, { useState } from 'react';
import { Terminal, FileText, Workflow, Cpu, Zap, Box, Layers, GitBranch, ChevronRight, ChevronDown, CheckCircle } from 'lucide-react';

const tutorialSections = [
  {
    id: 'cli',
    title: 'CLI Options Reference',
    icon: Terminal,
    color: 'from-blue-500 to-blue-600',
    content: {
      description: 'Complete reference for all Claude Code command-line options',
      categories: [
        {
          name: 'Session Management',
          options: [
            { flag: '-c, --continue', desc: 'Continue most recent conversation' },
            { flag: '-r, --resume [id]', desc: 'Resume by session ID or picker' },
            { flag: '--fork-session', desc: 'Create new session when resuming' },
          ]
        },
        {
          name: 'Output & Format',
          options: [
            { flag: '-p, --print', desc: 'Print response and exit (for pipes)' },
            { flag: '--output-format', desc: 'text | json | stream-json' },
            { flag: '--json-schema', desc: 'Schema for structured output' },
          ]
        },
        {
          name: 'Permissions',
          options: [
            { flag: '--permission-mode', desc: 'default | acceptEdits | plan | delegate' },
            { flag: '--dangerously-skip-permissions', desc: '⚠️ Bypass ALL checks (containerized only!)' },
            { flag: '--allowedTools', desc: 'Whitelist specific tools' },
          ]
        }
      ]
    }
  },
  {
    id: 'claudemd',
    title: 'CLAUDE.md Configuration',
    icon: FileText,
    color: 'from-green-500 to-green-600',
    content: {
      description: "Your project's persistent brain - automatically loaded at session start",
      hierarchy: [
        '~/.claude/CLAUDE.md (Global)',
        '/project/CLAUDE.md (Project root)',
        '/project/src/CLAUDE.md (Subdirectory)',
      ]
    }
  },
  {
    id: 'hooks',
    title: 'Hooks System',
    icon: Workflow,
    color: 'from-purple-500 to-purple-600',
    content: {
      description: "Deterministic control - unlike prompts, hooks are guarantees",
      events: [
        { name: 'PreToolUse', desc: 'Before tool execution (can block!)' },
        { name: 'PostToolUse', desc: 'After tool completes' },
        { name: 'Stop', desc: 'When Claude finishes responding' },
      ]
    }
  },
  {
    id: 'subagents',
    title: 'Multi-Agent Orchestration',
    icon: Cpu,
    color: 'from-orange-500 to-orange-600',
    content: {
      description: 'Specialized AI personas with isolated contexts',
      builtIn: [
        { name: 'explore', desc: 'Read-only exploration' },
        { name: 'plan', desc: 'Planning without execution' },
      ]
    }
  },
  {
    id: 'skills',
    title: 'Skills System',
    icon: Zap,
    color: 'from-yellow-500 to-yellow-600',
    content: {
      description: 'Modular packages extending Claude with expertise',
      structure: ['SKILL.md (Required)', 'scripts/', 'references/', 'assets/']
    }
  },
  {
    id: 'plugins',
    title: 'Plugin Marketplace',
    icon: Box,
    color: 'from-pink-500 to-pink-600',
    content: {
      description: 'Shareable packages bundling commands, agents, skills',
      commands: ['/plugin install <name>', '/plugin list']
    }
  },
  {
    id: 'mcp',
    title: 'MCP Tools',
    icon: Layers,
    color: 'from-cyan-500 to-cyan-600',
    content: {
      description: 'Model Context Protocol - external tool connections',
      servers: [
        { name: '@playwright/mcp', desc: 'Browser automation' },
        { name: 'github-mcp-server', desc: 'GitHub integration' },
      ]
    }
  },
  {
    id: 'cicd',
    title: 'CI/CD Integration',
    icon: GitBranch,
    color: 'from-red-500 to-red-600',
    content: {
      description: 'GitHub Actions integration for automation',
      features: ['PR review', '@claude mentions', 'Automated fixes']
    }
  }
];

const CLISimulator = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', content: 'Claude Code v2.0.50 - Welcome!' },
    { type: 'system', content: 'Type a command...' },
  ]);
  
  const commands = {
    '/init': '✓ Analyzing project...\n✓ Generated CLAUDE.md',
    '/context': 'Context: 45K/200K tokens used (22.5%)',
    '/compact': '✓ Freed 30K tokens',
    '/agents': 'Agents: explore, plan, code-reviewer',
    '/mcp': 'MCP: playwright ✓, github ✓',
    'help': 'Commands: /init, /context, /compact, /agents, /mcp',
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newHistory = [...history, { type: 'user', content: `> ${input}` }];
    newHistory.push({ 
      type: 'response', 
      content: commands[input.toLowerCase()] || `Processing: "${input}"...`
    });
    setHistory(newHistory);
    setInput('');
  };
  
  return (
    <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-gray-400 ml-2">Claude Code Terminal</span>
      </div>
      <div className="h-40 overflow-y-auto mb-3 space-y-1">
        {history.map((line, i) => (
          <div key={i} className={`${
            line.type === 'system' ? 'text-gray-500' :
            line.type === 'user' ? 'text-green-400' : 'text-blue-300'
          } whitespace-pre-wrap`}>
            {line.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <span className="text-green-400">❯</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Try: /init, /context, /agents"
          className="flex-1 bg-transparent text-white outline-none placeholder-gray-600"
        />
      </form>
    </div>
  );
};

const SectionCard = ({ section, isExpanded, onToggle }) => {
  const Icon = section.icon;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{section.title}</h3>
          <p className="text-sm text-gray-500">{section.content.description}</p>
        </div>
        {isExpanded ? 
          <ChevronDown className="w-5 h-5 text-gray-400" /> : 
          <ChevronRight className="w-5 h-5 text-gray-400" />
        }
      </button>
      
      {isExpanded && (
        <div className="p-4 pt-0 border-t border-gray-100">
          {section.content.categories && section.content.categories.map((cat, i) => (
            <div key={i} className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">{cat.name}</h4>
              <div className="space-y-1">
                {cat.options.map((opt, j) => (
                  <div key={j} className="flex gap-2 text-sm">
                    <code className="bg-gray-100 px-2 py-0.5 rounded text-blue-600">{opt.flag}</code>
                    <span className="text-gray-600">{opt.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {section.content.hierarchy && (
            <div className="font-mono text-sm bg-gray-50 rounded p-3 space-y-1">
              {section.content.hierarchy.map((h, i) => (
                <div key={i} className="text-gray-600">{h}</div>
              ))}
            </div>
          )}
          
          {section.content.events && (
            <div className="grid gap-2">
              {section.content.events.map((e, i) => (
                <div key={i} className="flex gap-2 text-sm bg-gray-50 rounded p-2">
                  <code className="text-purple-600 font-medium">{e.name}</code>
                  <span className="text-gray-500">→</span>
                  <span className="text-gray-600">{e.desc}</span>
                </div>
              ))}
            </div>
          )}
          
          {section.content.builtIn && (
            <div className="grid gap-2">
              {section.content.builtIn.map((a, i) => (
                <div key={i} className="flex gap-2 text-sm bg-gray-50 rounded p-2">
                  <code className="text-orange-600 font-medium">{a.name}</code>
                  <span className="text-gray-600">{a.desc}</span>
                </div>
              ))}
            </div>
          )}
          
          {section.content.structure && (
            <div className="font-mono text-sm bg-gray-50 rounded p-3 space-y-1">
              {section.content.structure.map((s, i) => (
                <div key={i} className="text-gray-600">{s}</div>
              ))}
            </div>
          )}
          
          {section.content.commands && (
            <div className="font-mono text-sm bg-gray-900 text-green-400 rounded p-3 space-y-1">
              {section.content.commands.map((c, i) => (
                <div key={i}>{c}</div>
              ))}
            </div>
          )}
          
          {section.content.servers && (
            <div className="grid gap-2">
              {section.content.servers.map((s, i) => (
                <div key={i} className="flex gap-2 text-sm bg-gray-50 rounded p-2">
                  <code className="text-cyan-600 font-medium">{s.name}</code>
                  <span className="text-gray-600">{s.desc}</span>
                </div>
              ))}
            </div>
          )}
          
          {section.content.features && (
            <div className="flex flex-wrap gap-2">
              {section.content.features.map((f, i) => (
                <span key={i} className="flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 rounded text-sm">
                  <CheckCircle className="w-3 h-3" />{f}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function ClaudeCodeTutorial() {
  const [expandedSections, setExpandedSections] = useState(new Set(['cli']));
  const [activeTab, setActiveTab] = useState('learn');
  
  const toggleSection = (id) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Terminal className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Claude Code Mastery</h1>
              <p className="text-white/80 text-sm">From basics to advanced orchestration</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {['learn', 'practice'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab 
                    ? 'bg-white text-purple-600' 
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                {tab === 'learn' ? '📚 Learn' : '🔧 Practice'}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'learn' ? (
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <h3 className="font-semibold text-blue-800 mb-1">🎯 Learning Path</h3>
              <p className="text-blue-700 text-sm">
                CLI basics → CLAUDE.md → Hooks → Subagents → Skills → CI/CD
              </p>
            </div>
            
            {tutorialSections.map(section => (
              <SectionCard
                key={section.id}
                section={section}
                isExpanded={expandedSections.has(section.id)}
                onToggle={() => toggleSection(section.id)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h3 className="font-semibold text-amber-800 mb-1">🔧 Interactive Practice</h3>
              <p className="text-amber-700 text-sm">
                Try commands in the simulated terminal below
              </p>
            </div>
            
            <CLISimulator />
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-2">📝 Quick Exercises</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <span>Run <code className="bg-gray-100 px-1 rounded">/init</code></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <span>Check <code className="bg-gray-100 px-1 rounded">/context</code></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <span>View <code className="bg-gray-100 px-1 rounded">/agents</code></span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-2">🚀 Advanced</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">A</span>
                    <span>Create custom hooks</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">B</span>
                    <span>Build multi-agent workflow</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">C</span>
                    <span>Set up GitHub Actions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-gray-800 text-white py-4 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            BACON-AI Framework • Research from Anthropic docs & community
          </p>
        </div>
      </div>
    </div>
  );
}