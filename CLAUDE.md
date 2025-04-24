# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## SQL Utility Library for Node.js

### Build/Test Commands
- `npm install` - Install dependencies
- `npm run build` - Build the project
- `npm run test` - Run all tests
- `npm run test -- -t "test name"` - Run a specific test
- `npm run lint` - Run linting checks
- `npm run typecheck` - Check TypeScript types

### Code Style Guidelines
- Use TypeScript for all source files
- Format code with Prettier (2 space indentation)
- Import order: node modules, then project modules (alphabetically)
- Use camelCase for variables/functions, PascalCase for classes/types
- Error handling: use typed errors and Promise rejection patterns
- SQL template literals should use tagged template syntax
- Document public APIs with JSDoc comments
- Use strong typing for SQL parameters with runtime validation
- Follow functional programming patterns where appropriate