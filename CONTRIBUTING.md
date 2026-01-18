# Contributing to Claude Code Mastery

Thank you for your interest in contributing to the Claude Code Mastery training platform! This document provides guidelines and instructions for contributing.

## 🌟 Ways to Contribute

### 1. Content Contributions
- **New Training Modules** — Add tutorials for uncovered topics
- **Exercises & Challenges** — Create hands-on learning activities
- **Code Examples** — Share working configurations and scripts
- **Tips & Tricks** — Document your discoveries and optimizations

### 2. Technical Contributions
- **Bug Fixes** — Report and fix issues
- **New Features** — Implement roadmap items or propose new ones
- **Performance** — Optimize the application
- **Accessibility** — Improve a11y compliance

### 3. Documentation
- **README Improvements** — Clarify and expand documentation
- **Translations** — Help make this accessible in other languages
- **API Documentation** — Document components and utilities

### 4. Community
- **Answer Questions** — Help others in issues and discussions
- **Share Knowledge** — Write about your experience
- **Feedback** — Provide constructive suggestions

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (20+ recommended)
- Git
- A GitHub account

### Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/claude-code-mastery.git
   cd claude-code-mastery
   ```

2. **Install dependencies**
   ```bash
   cd app
   npm install
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

4. **Start development**
   ```bash
   npm run dev
   ```

---

## 📝 Contribution Guidelines

### Code Style

- **React**: Use functional components with hooks
- **Naming**: Use descriptive names (camelCase for variables, PascalCase for components)
- **Comments**: Add comments for complex logic
- **TypeScript**: Prefer TypeScript for new files (migration in progress)

### Commit Messages

Follow conventional commits:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(modules): add hooks system training module
fix(terminal): resolve xterm.js initialization race condition
docs(readme): add enterprise features roadmap
```

### Pull Request Process

1. **Update documentation** if your changes affect user-facing features
2. **Add tests** for new functionality where applicable
3. **Ensure the build passes** (`npm run build`)
4. **Request review** from maintainers

### PR Title Format
```
[TYPE] Brief description of changes
```

Examples:
- `[FEAT] Add MCP server development module`
- `[FIX] Terminal cursor position on mobile`
- `[DOCS] Expand BACON-AI methodology section`

---

## 🏗️ Project Structure

```
claude-code-mastery/
├── app/                          # React application
│   ├── src/
│   │   ├── App.jsx              # Main application
│   │   ├── components/          # Reusable components (planned)
│   │   ├── data/                # Training content (planned)
│   │   └── hooks/               # Custom React hooks (planned)
│   ├── public/
│   └── package.json
├── docs/                         # Additional documentation (planned)
├── CLAUDE.md                     # Claude Code configuration
├── README.md
├── CONTRIBUTING.md               # This file
└── LICENSE
```

---

## 🎯 Roadmap Items

We especially welcome contributions in these areas:

### High Priority
- [ ] TypeScript migration
- [ ] Component library extraction
- [ ] Test coverage
- [ ] Mobile responsiveness improvements

### Training Content
- [ ] Advanced hooks patterns
- [ ] BACON-AI testing methodology (TUT, FUT, SIT, UAT, RGT)
- [ ] OpenAI Agents SDK integration
- [ ] Gemini Live Voice tutorials
- [ ] Computer use automation

### Features
- [ ] Progress persistence (localStorage/backend)
- [ ] User authentication
- [ ] Certification system
- [ ] Team dashboards

---

## 🧪 Testing

Currently, the project has minimal test coverage. We welcome contributions to improve this:

```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint
```

---

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in this project a harassment-free experience for everyone, regardless of:
- Age, body size, disability, ethnicity
- Gender identity and expression
- Level of experience
- Nationality, personal appearance
- Race, religion, sexual identity and orientation

### Our Standards

**Positive behaviors:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Unacceptable behaviors:**
- Trolling, insulting/derogatory comments
- Public or private harassment
- Publishing others' private information
- Other conduct which could be considered inappropriate

### Enforcement

Project maintainers are responsible for clarifying standards and may take appropriate action in response to unacceptable behavior.

---

## 📬 Contact

- **Issues**: [GitHub Issues](https://github.com/bacon-ai/claude-code-mastery/issues)
- **Discussions**: [GitHub Discussions](https://github.com/bacon-ai/claude-code-mastery/discussions)
- **Email**: [hello@bacon-ai.cloud](mailto:hello@bacon-ai.cloud)

---

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- BACON-AI community highlights

---

Thank you for helping make Claude Code Mastery better! 🥓

*Built with 🥓 by the BACON-AI Team*
