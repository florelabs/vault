# FloréLabs Vault

> Technical framework + AI agents to accelerate development, quality, and releases of JS/TS libraries.

## 🎯 Overview

This monorepo centralizes FloréLabs front/back libraries under a single **pnpm monorepo** for enhanced visibility and code reuse. It standardizes build/test/release processes and introduces an **AI-assisted pipeline** for reviews, documentation, changelogs, and guided testing.

All packages are published under the npm namespace `@florelabs/*`.

## 📦 Packages

### [@florelabs/battle-viewer](./packages/battle-viewer)

Auto-battle visualizer using **PixiJS**, packaged as a **Web Component**.

- 🎮 Real-time battle visualization
- 🎨 PixiJS-powered graphics  
- 📦 Framework agnostic Web Component
- 🔒 Isolated shadowDOM

### [@florelabs/battle-blocks](./packages/battle-blocks)

A **Blockly Web Component** specialized for generating "battle arena" instructions.

- 🧩 Visual programming interface
- ⚔️ Battle-specific blocks
- 🔧 Code generation (JS/TS/AST)
- 🎨 Customizable themes

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/florelabs/vault.git
cd vault
pnpm install

# Development
pnpm dev          # Start all packages in dev mode
pnpm build        # Build all packages
pnpm test         # Run all tests
pnpm lint         # Lint all packages
pnpm format       # Format all code

# Release workflow
pnpm changeset           # Create a changeset
pnpm version-packages    # Version packages locally
pnpm release            # Publish to npm (CI handles this)
```

## 🧱 Tech Stack

- **pnpm workspaces** — Dependency management + controlled hoisting
- **TypeScript** — Shared `tsconfig.base.json` configuration
- **tsup** — Bundling (ESM, CJS, d.ts)
- **Turborepo** — Build caching and parallel task execution
- **Vitest** — Unit testing with jsdom
- **Biome** — Lightning-fast linting and formatting
- **Changesets** — Semantic versioning and automated releases
- **GitHub Actions** — CI/CD with npm provenance

## 🏗️ Architecture

```
packages/
├── battle-viewer/     # PixiJS battle visualizer
│   ├── src/
│   ├── dist/         # Built outputs
│   └── package.json
└── battle-blocks/     # Blockly visual editor
    ├── src/
    ├── dist/
    └── package.json
```

## 🤖 AI Agents

The repository includes AI-powered assistance for:

- **Code Review** — Automated PR reviews for readability and best practices
- **Test Generation** — Skeleton unit tests based on code changes  
- **Documentation** — Auto-generated README updates with usage examples
- **Release Notes** — Human-readable summaries of changes
- **Security Scanning** — Dependency and configuration auditing

> **Important**: Agents assist but never push without human review.

## 📋 Scripts Reference

| Command | Description |
|---------|-------------|
| `pnpm bootstrap` | Install all dependencies |
| `pnpm dev` | Start development servers for all packages |
| `pnpm build` | Build all packages for production |
| `pnpm test` | Run test suites across all packages |
| `pnpm lint` | Lint all code |
| `pnpm format` | Format all code |
| `pnpm changeset` | Create a new changeset |
| `pnpm version-packages` | Apply version bumps locally |
| `pnpm release` | Publish packages to npm |

## 🔐 Security & Publishing

- **npm provenance** — All packages published with attestations
- **Restrictive exports** — Only intended APIs are exposed
- **No postinstall scripts** — Clean, secure installation
- **License compliance** — Automated dependency license checks

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes following our guidelines:
   - Use **Conventional Commits**
   - Document public APIs with JSDoc
   - Add tests for new functionality
   - Run `pnpm ci` before committing
4. **Create** a changeset: `pnpm changeset`
5. **Submit** a Pull Request

### Commit Convention

We use [Conventional Commits](https://conventionalcommits.org/):

```
feat(battle-viewer): add new animation system
fix(battle-blocks): resolve block positioning issue
docs: update installation instructions
chore: update dependencies
```

## 📄 License

MIT © Thomas Florelli

---

**⚠️ All repository content must be written in English (code, documentation, comments, etc.)**