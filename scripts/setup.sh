#!/bin/bash

# FloréLabs Vault - Setup Script
# This script sets up the development environment for the monorepo

set -e

echo "🚀 Setting up FloréLabs Vault monorepo..."

# Check Node.js version
node_version=$(node -v | sed 's/v//')
required_version="18.0.0"

if [ "$(printf '%s\n' "$required_version" "$node_version" | sort -V | head -n1)" != "$required_version" ]; then
    echo "❌ Node.js version $node_version is below the required minimum of $required_version"
    exit 1
fi

echo "✅ Node.js version: $node_version"

# Install pnpm if not available
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm@10.17.1
fi

echo "✅ pnpm version: $(pnpm -v)"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Run initial checks
echo "🔍 Running initial checks..."

# Lint code
echo "  - Linting..."
pnpm lint

# Type check
echo "  - Type checking..."
pnpm type-check

# Run tests
echo "  - Running tests..."
pnpm test

# Build packages
echo "  - Building packages..."
pnpm build

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Available commands:"
echo "  pnpm dev          # Start development servers"
echo "  pnpm build        # Build all packages"
echo "  pnpm test         # Run all tests"
echo "  pnpm lint         # Lint all code"
echo "  pnpm format       # Format all code"
echo "  pnpm changeset    # Create a changeset"
echo ""
echo "Package directories:"
echo "  packages/battle-viewer/    # PixiJS battle visualizer"
echo "  packages/battle-blocks/    # Blockly visual editor"
echo ""
echo "Example files:"
echo "  packages/battle-viewer/examples/basic-usage.html"
echo "  packages/battle-blocks/examples/basic-usage.html"
echo ""
echo "Happy coding! 🎮"