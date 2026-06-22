# Setup Guide

## Prerequisites

- **Node.js** (v16 or later)
- **npm** (comes with Node.js)

## Installation

```bash
# Install NestJS CLI globally (if not already installed)
npm i -g @nestjs/cli

# Clone the repo and navigate to the project
cd homeopath-api

# Install dependencies
npm install
Running the App
# Development
npm run start

# Watch mode (hot reload)
npm run start:dev

# Production mode
npm run start:prod
Testing
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
Build
npm run build
Lint & Format
# Lint
npm run lint

# Format (Prettier)
npm run format
Environment Setup
# Create .envrc file with environment variables
echo 'export PORT=5000' > .envrc

# Allow direnv to load the file
direnv allow

# If direnv is not installed:
sudo apt install direnv
# Then add to ~/.bashrc:
echo 'eval "$(direnv hook bash)"' >> ~/.bashrc
source ~/.bashrc