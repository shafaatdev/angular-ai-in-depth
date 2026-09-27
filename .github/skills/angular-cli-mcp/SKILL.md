---
name: angular-cli-mcp
description: Use for Angular implementation, refactoring, review, architecture, forms, templates, routing, accessibility, or Angular API questions in this repository. Consult the Angular CLI MCP server so generated Angular code follows current Angular guidance while respecting this repository's explicit architectural rules.
---

# Angular CLI MCP workflow

When performing Angular-specific work in this repository:

1. Confirm the Angular CLI MCP server is available in the current agent environment.
2. Call the Angular CLI MCP `get_best_practices` tool before making framework-specific implementation decisions.
3. Use other Angular CLI MCP tools when they materially improve correctness, such as inspecting/building the application or validating framework usage.
4. Treat `.github/copilot-instructions.md` and the applicable `.github/instructions/*.instructions.md` file as repository-specific constraints. If generic MCP guidance conflicts with an explicit repository choice, preserve the repository choice. Important examples are Signal Forms, external component templates/styles, Promise-first service APIs, zoneless operation, and avoiding RxJS unless explicitly requested.
5. Implement the smallest maintainable change that satisfies the task.
6. Validate the result with the repository's existing build/type-check/lint/test commands and accessibility requirements relevant to the change.

Do not copy the full Angular best-practices guide into repository instructions. Retrieve current guidance from the MCP server when needed so the project does not accumulate stale duplicated framework documentation.
