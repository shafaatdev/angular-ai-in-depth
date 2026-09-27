# Angular Chatbot — Copilot Instructions

## Repository purpose

This repository is an educational sample application for learning Angular with AI. It implements a simple chatbot backed by the OpenAI API.

- Frontend: signals-based, zoneless Angular application.
- Backend: plain Node.js + Express REST server.
- Backend development URL: `http://localhost:9000`.
- Start the backend with `npm run server`.
- There is no persistent database. Mutable mock data is initialized from `db-data.ts` and kept in memory.

## Source-of-truth rules

- For Angular implementation work, use the Angular CLI MCP server and consult its current `get_best_practices` guidance before making framework-specific decisions. If repository instructions and generic Angular guidance differ, follow the repository-specific instructions in this repo.
- Keep changes educational, explicit, maintainable, performant, and accessible. Prefer straightforward framework-native solutions over unnecessary abstractions.
- Follow the path-specific instructions under `.github/instructions/` for frontend and backend code.

## Global coding rules

- Put every model/custom data model in its own separate file. Do not colocate model declarations with components, services, routes, or other implementation code.
- Use descriptive variable names. Never use single-letter names such as `f` for a form.
- Do not prefix private variables or fields with `_`.
- Add appropriate structured logging where operationally useful; backend logging uses Pino. Never log passwords, password hashes, API keys, authorization headers, session/token secrets, or other sensitive data.

## TypeScript rules

- Use strict type checking.
- Prefer type inference when the type is obvious.
- Avoid `any`; use `unknown` when a value's type is genuinely uncertain, then narrow it safely.
- Use `type` rather than `interface` for custom object types.
- Do not write explicit `void` return types when TypeScript can infer them.
- Do not write explicit `Promise<...>` return types on `async` functions when TypeScript can infer them.

## Validation expectations

Before considering a change complete:

- Run the relevant build, type-check, lint, and tests already configured by the repository.
- For Angular UI changes, verify keyboard behavior, focus management, semantic markup, color contrast, and ARIA usage. The result must satisfy WCAG 2.1 AA minimums and pass AXE checks.
- Do not weaken security, type safety, accessibility, or tests to make a change pass.
