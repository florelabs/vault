# AGENTS.md

Monorepo **florelabs/vault** — technical framework + AI agents to accelerate development, quality, and releases of JS/TS libraries.

**⚠️ Important: All repository content must be written in English (code, documentation, comments, etc.)**

---

## 🎯 Repository Goals

* Centralize my front/back libraries under a single **pnpm monorepo** (visibility + reuse).
* Standardize **build/test/release** (ESM + CJS + d.ts).
* Introduce an **AI-assisted pipeline** (reviews, docs, changelogs, guided tests).
* Publish under the npm namespace `@florelabs/*`.

First two packages:

1. **`@florelabs/battle-viewer`**
   Auto-battle visualizer, using **PixiJS**, packaged as a **Web Component**.

2. **`@florelabs/battle-blocks`**
   A **Blockly Web Component** specialized for generating “battle arena” instructions.

---

## 🧱 Tech Stack & Conventions

* **pnpm workspaces** — dependency mgmt + controlled hoist
* **TypeScript** everywhere — shared `tsconfig.base.json`
* **tsup** — bundling (ESM, CJS, d.ts)
* **Turborepo** — caching, parallel tasks (Nx possible later)
* **Vitest** — unit tests
* **Biome** (or ESLint + Prettier) — lint/format
* **Changesets** — semantic versioning, release notes, automated publishing
* **GitHub Actions** — CI, npm provenance, AI agent triggers

---

## 📁 Monorepo Structure

```
.
├─ packages/
│  ├─ battle-viewer/
│  │  ├─ src/
│  │  ├─ package.json
│  │  ├─ tsup.config.ts
│  │  └─ vitest.config.ts
│  └─ battle-blocks/
│     ├─ src/
│     ├─ package.json
│     ├─ tsup.config.ts
│     └─ vitest.config.ts
├─ .github/
│  └─ workflows/
├─ turbo.json
├─ tsconfig.base.json
├─ package.json
├─ biome.json (or .eslintrc.* + .prettierrc)
└─ .changeset/
```

---

## 🔧 Scripts & Commands

### root package.json

```jsonc
{
  "name": "florelabs/vault",
  "private": true,
  "packageManager": "pnpm@10.17.1",
  "scripts": {
    "bootstrap": "pnpm install",
    "build": "turbo run build",
    "dev": "turbo run dev --parallel",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "format": "turbo run format",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "changeset publish",
    "ci": "pnpm lint && pnpm test && pnpm build"
  }
}
```

### inside each package

```jsonc
{
  "name": "@florelabs/battle-viewer",
  "version": "0.0.0",
  "type": "module",
  "main": "dist/index.cjs",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  },
  "scripts": {
    "dev": "tsup --watch",
    "build": "tsup",
    "test": "vitest run",
    "lint": "biome check .",
    "format": "biome format ."
  }
}
```

### minimal tsup config

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  dts: true,
  clean: true,
  format: ["esm", "cjs"],
  sourcemap: true,
  target: "es2022",
  treeshake: true,
  minify: false
});
```

### minimal vitest config

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    coverage: { reporter: ["text", "lcov"] }
  }
});
```

### Turborepo pipeline

```json
{
  "pipeline": {
    "build": {
      "outputs": ["dist/**"],
      "dependsOn": ["^build"]
    },
    "dev": { "cache": false },
    "test": { "dependsOn": ["build"] },
    "lint": {},
    "format": {}
  }
}
```

### shared TS config

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022", "DOM"],
    "strict": true,
    "declaration": true,
    "sourceMap": true,
    "skipLibCheck": true,
    "types": []
  }
}
```

---

## 🚀 Release Workflow (Changesets)

1. Dev locally: `pnpm dev` / `pnpm test` / `pnpm build`
2. Create changeset: `pnpm changeset`
3. Version locally: `pnpm version-packages` (bump + changelogs)
4. Merge to `main` → CI publishes: `pnpm release`

> **CI Secrets required**: `NPM_TOKEN`, `GITHUB_TOKEN`, optionally `ACTIONS_STEP_DEBUG`.

---

## 🤖 AI Agents — roles, triggers & safeguards

Agents **assist** but never push without human review. They run via **GitHub Actions** (PR comments) or locally.

### Roles

1. **Reviewer Agent**

   * Input: PR diffs + tsconfig + guidelines
   * Output: code review comments (readability, complexity, API, DX)
   * Safeguard: proposes patch via `git apply`, no direct commit

2. **Test Author Agent**

   * Input: changed code + coverage
   * Output: skeleton unit tests
   * Safeguard: minimal mocks, no blind snapshots

3. **Docs Agent**

   * Input: public exports + JSDoc
   * Output: `README.md` with usage examples
   * Safeguard: no fictional APIs

4. **Release Notes Agent**

   * Input: Changesets + commits
   * Output: human summary of “What’s new / Breaking / Migration”
   * Safeguard: adds to release PR, does not override generated changelog

5. **Security Agent**

   * Input: lockfiles + CI config + exports
   * Output: alerts (typosquatting, npm provenance, perms)
   * Safeguard: never removes deps automatically

6. **Playwright Agent**

   * Input: stories/examples
   * Output: accessibility checks, headless integration tests
   * Safeguard: no production merges

### CI Triggers

* On **PR opened/updated** → Reviewer + Test Author + Docs
* On **release PR** → Release Notes + Security
* On **push tags** → skip agents (build/publish only)

---

## 🔐 Security & Provenance

* Publish with **npm provenance** (GH Actions + attestations).
* Rules:

  * No secrets in repo.
  * Restrictive package exports.
  * No `postinstall` scripts.
  * License checks for dependencies.

---

## 📦 Package Details

### `@florelabs/battle-viewer`

* Goal: render auto-battle timeline (positions, actions, effects) with **PixiJS**.
* API Example (Web Component):

```ts
export class BattleViewer extends HTMLElement {
  // <battle-viewer data='{"turns":[...]]}'></battle-viewer>
}
customElements.define("battle-viewer", BattleViewer);
```

* Usage:

```html
<script type="module">
  import "@florelabs/battle-viewer";
  const data = { turns: [/* ... */] };
  document.querySelector("battle-viewer").setAttribute("data", JSON.stringify(data));
</script>

<battle-viewer></battle-viewer>
```

* Build: tsup (ESM/CJS/d.ts).
* Notes: isolate Pixi in shadowRoot, avoid globals.

### `@florelabs/battle-blocks`

* Goal: **Blockly Web Component** for “battle arena” logic.
* API Example:

```ts
// <battle-blocks oncodechange=(ev)=>...></battle-blocks>
```

* Output: AST/JS/TS compatible with combat SDK.
* Can emit JSON instructions compatible with `battle-viewer`.
* Build: tsup, lazy-load Blockly.

---

## 🧪 Tests & Examples

* Location: `packages/*/src/**/*.test.ts`
* Examples: `packages/<pkg>/examples/*`
* Coverage: 80% baseline

---

## 🧰 Common Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm test
pnpm lint
pnpm format

# changesets workflow
pnpm changeset
pnpm version-packages
git add -A && git commit -m "chore: version packages"
git push
pnpm release
```

---

## ⚙️ GitHub Actions Workflows

* **`ci.yml`** (PR & push)

  * `pnpm install` (frozen lockfile)
  * turbo cache
  * `pnpm lint && pnpm test && pnpm build`
  * agents post comments

* **`release.yml`** (release PR merge → tag)

  * `pnpm build`
  * `pnpm release` (with `NPM_TOKEN`)
  * npm provenance

---

## 📝 Contribution Guidelines

* Use **Conventional Commits**.
* Public APIs documented (JSDoc + README).
* Breaking changes require `major` + migration guide.
* **Agents propose, humans decide.**

---

## 🗺️ Agent Roadmap

* **v1**: Reviewer, Docs, Test Author, Release Notes, Security
* **v2**:

  * **SDK Alignment Agent** (ensures `battle-blocks` output is compatible with `battle-viewer`)
  * **DX Agent** (generates mini HTML playgrounds per package)
  * **Bench Agent** (micro-benchmarks Pixi/Blockly hot paths)

---

## 📄 License & Publishing

* Default: **MIT** (package-specific if needed).
* npm scope: `@florelabs/*`.
* Suggested npm tags: `web-components`, `pixijs`, `blockly`, `game-tools`, `battle-arena`.
