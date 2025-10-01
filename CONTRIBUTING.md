# Contributing to FloréLabs Vault

Thank you for your interest in contributing to FloréLabs Vault! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0.0 or later
- **pnpm** 8.0.0 or later (will be installed automatically)
- **Git** for version control

### Setup

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/your-username/vault.git
   cd vault
   ```
3. **Run the setup script**:
   ```bash
   ./scripts/setup.sh
   ```

This will install dependencies, run linting, tests, and build all packages.

## 🏗️ Development Workflow

### Making Changes

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Start development**:
   ```bash
   pnpm dev  # Starts all packages in development mode
   ```

3. **Make your changes** following our guidelines below

4. **Test your changes**:
   ```bash
   pnpm test        # Run tests
   pnpm lint        # Check code style
   pnpm type-check  # TypeScript validation
   pnpm build       # Build packages
   ```

### Before Committing

Always run the full CI pipeline locally:
```bash
pnpm ci  # Runs: lint + type-check + test + build
```

## 📝 Code Guidelines

### TypeScript

- Use **strict TypeScript** settings
- Provide **JSDoc** comments for public APIs
- Use **meaningful variable names**
- Prefer **explicit types** over `any`

### Commit Messages

We follow [Conventional Commits](https://conventionalcommits.org/):

```
feat(battle-viewer): add animation system
fix(battle-blocks): resolve block positioning issue
docs: update installation instructions
chore: update dependencies
test(battle-viewer): add unit tests for BattleViewer
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Code Style

We use **Biome** for consistent formatting:

```bash
pnpm format  # Format all files
pnpm lint    # Check for issues
```

Key conventions:
- **2 spaces** for indentation
- **Double quotes** for strings
- **Semicolons** required
- **Trailing commas** in ES5 contexts
- **100 character** line limit

## 🧪 Testing

### Writing Tests

- Place tests next to source files: `src/component.test.ts`
- Use **Vitest** with **jsdom** environment
- Aim for **80%+ code coverage**
- Test **public APIs** and **edge cases**

Example test structure:
```typescript
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { YourComponent } from "./your-component.js";

describe("YourComponent", () => {
  let component: YourComponent;

  beforeEach(() => {
    component = new YourComponent();
  });

  afterEach(() => {
    component.cleanup?.();
  });

  it("should do something", () => {
    expect(component.doSomething()).toBe(expected);
  });
});
```

### Running Tests

```bash
pnpm test                    # Run all tests once
pnpm test:watch              # Run tests in watch mode
pnpm test packages/battle-viewer  # Run specific package tests
```

## 📦 Package Structure

Each package follows this structure:
```
packages/package-name/
├── src/
│   ├── index.ts           # Main export
│   ├── component.ts       # Implementation
│   └── component.test.ts  # Tests
├── examples/              # Usage examples
├── dist/                  # Build output (generated)
├── package.json
├── tsconfig.json
├── tsup.config.ts         # Build configuration
└── vitest.config.ts       # Test configuration
```

## 🔄 Release Process

### Creating Changesets

When adding features or fixes that should be released:

1. **Create a changeset**:
   ```bash
   pnpm changeset
   ```

2. **Follow the prompts** to:
   - Select affected packages
   - Choose version bump type (major, minor, patch)
   - Write a user-facing description

3. **Commit the changeset file**:
   ```bash
   git add .changeset/
   git commit -m "chore: add changeset for feature X"
   ```

### Version Types

- **Major** (1.0.0 → 2.0.0): Breaking changes
- **Minor** (1.0.0 → 1.1.0): New features, backward compatible
- **Patch** (1.0.0 → 1.0.1): Bug fixes, backward compatible

## 🤖 AI Agents

Our repository uses AI agents for assistance. They will:

- **Review** your PRs for code quality
- **Suggest** improvements and tests
- **Generate** documentation updates
- **Check** for security issues

**Important**: Agents assist but never merge automatically. Human review is always required.

## 🔐 Security

### Reporting Vulnerabilities

Please report security vulnerabilities privately to the maintainers rather than opening public issues.

### Dependencies

- Keep dependencies **up to date**
- Avoid dependencies with **known vulnerabilities**
- Use **npm audit** to check for issues

## 📚 Documentation

### API Documentation

- Use **JSDoc** for all public APIs
- Include **usage examples**
- Document **parameters** and **return values**
- Explain **complex behavior**

### README Updates

When adding features, update relevant README files:
- Package-specific README for detailed API docs
- Main repository README for overview changes

## ❓ Getting Help

- **Issues**: Check existing issues or create a new one
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: Check AGENTS.md for detailed technical specs

## 🎉 Recognition

Contributors are recognized in:
- Git commit history
- Release notes (via changesets)
- Package.json contributors field

Thank you for contributing to FloréLabs Vault! 🚀