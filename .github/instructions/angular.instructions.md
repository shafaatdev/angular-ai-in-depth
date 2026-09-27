---
applyTo: "src/**/*.{ts,html,css,scss}"
---

# Angular Frontend Instructions

These rules apply to the Angular frontend. They intentionally override generic Angular recommendations where this educational repository has made a specific architectural choice.

## Architecture and APIs

- The application is zoneless and signals-based. Use Angular signals for local and shared state where appropriate.
- Use standalone components only. Angular v20+ treats standalone as the default, so do not set `standalone: true` in decorators.
- Set `changeDetection: ChangeDetectionStrategy.OnPush` on components.
- Keep components small and focused on one responsibility.
- Implement lazy loading for feature routes.
- Use `inject()` rather than constructor injection.
- Use `input()` and `output()` instead of `@Input()` and `@Output()` decorators.
- Use `computed()` for derived state.
- Keep state transformations pure and predictable.
- Do not use signal `mutate`; use `set` or `update`.
- Do not use `@HostBinding` or `@HostListener`. Define host bindings/listeners through the `host` object on `@Component` or `@Directive`.

## Forms

- Always use Angular Signal Forms for application forms.
- Do not use Reactive Forms, template-driven forms, or model-driven forms unless the user explicitly asks to depart from this repository architecture.

## Async and service boundaries

- Prefer Promises and `async`/`await`.
- Do not introduce RxJS or expose Observables from application service APIs unless explicitly requested.
- Define service-layer asynchronous APIs with Promises.
- When an Angular API is Observable-based and a one-shot result is needed, convert it at the boundary with `firstValueFrom` rather than spreading Observable-based state through the application.
- Use the async pipe only when an Observable is genuinely required by an explicitly requested or unavoidable API; do not introduce Observables merely to use the async pipe.
- Keep services focused on one responsibility. Use `providedIn: 'root'` for singleton services.

## HTTP

- Every frontend HTTP request to this application's backend must use a URL beginning with `/api`.
- Keep transport concerns in focused services rather than components.

## Components, templates, and styles

- Always use external HTML templates and external CSS/SCSS files. Do not use inline `template` or `styles`, even for small components.
- Template and style paths must be relative to the component TypeScript file.
- Keep templates simple; move nontrivial computation into TypeScript or `computed()` state.
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, and `*ngSwitch`.
- Do not use `ngClass`; use `class` bindings.
- Do not use `ngStyle`; use `style` bindings.
- Do not assume JavaScript globals such as `new Date()` are available in templates. Expose required values from the component.
- Do not write arrow functions in templates.
- Use `NgOptimizedImage` for static images. Do not use it for inline base64 images.
- Where practical, keep reusable theme tokens and common styling in shared theme/style files imported or applied by components so the visual theme can be changed centrally.

## Accessibility

- UI work must pass AXE checks and meet WCAG AA minimums.
- Use semantic HTML first; add ARIA only when native semantics are insufficient.
- Preserve logical keyboard navigation and visible focus states.
- Manage focus deliberately for dialogs, dynamic chatbot updates, errors, and other interaction state changes.
- Ensure sufficient text and UI-component color contrast.
- Form controls must have programmatically associated labels, accessible validation messages, and understandable error states.
