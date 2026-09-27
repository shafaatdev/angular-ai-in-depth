---
applyTo: "server/**/*.ts"
---

# Node / Express Backend Instructions

## Runtime and data model

- The backend is plain Node.js + Express and runs locally on port `9000`.
- The development command is `npm run server`.
- There is no persistent database. Initialize mutable in-memory mock data from `db-data.ts`.
- Keep model files separate from route and service implementation files.

## Express routing

- Put each Express route handler in its own file under `server/routes/`.
- Route files should export plain Express handler functions. Do not hide URL or HTTP-method registration inside the route module.
- Register each handler's URL and HTTP method centrally in `server.ts`.
- Validate and normalize untrusted request input before use. Return deliberate HTTP status codes and safe error bodies.

## Configuration and logging

- Load environment variables from `.env` with `dotenv`.
- Use Pino for structured backend logging and add appropriate logging to backend code.
- Never log passwords, password hashes, OpenAI API keys, authorization headers, tokens, cookies, or other secrets.
- Do not commit real secrets or a populated `.env` file.

## OpenAI integration

- Do not use the OpenAI Node SDK/wrapper.
- Call the OpenAI API with plain HTTP requests using the platform HTTP/fetch facilities available in the project.
- Keep the OpenAI API key server-side only and read it from environment configuration.
- Handle upstream failures, non-success status codes, timeouts/aborts where appropriate, malformed responses, and rate-limit responses without leaking secrets or internal details to clients.

## Authentication

- Authentication uses email and password only.
- Store only salted password hashes in application state; never store or compare plaintext passwords after initialization.
- Use a reputable password-hashing implementation suitable for passwords and safe comparison behavior. Do not invent cryptography.
- The authentication flow must be fully functional with the in-memory data model.
- Seed `db-data.ts` with a development-only mock account for `test@angular-university.io` whose initial password is `Angular123`. Generate/store its password representation according to the authentication implementation rather than treating plaintext as persisted application data.

## Security

Apply current OWASP guidance appropriate to an Express REST API, including:

- Treat all client input and upstream API output as untrusted.
- Validate request body shape, types, lengths, and allowed values; reject unexpected or oversized input where appropriate.
- Configure security headers and CORS deliberately for the application's deployment model.
- Use secure authentication/session or token handling appropriate to the existing app design; do not expose credentials in URLs.
- Avoid detailed internal errors in client responses; log diagnostic context safely on the server.
- Prevent brute-force-friendly authentication behavior with appropriate rate limiting/throttling when implementing auth endpoints.
- Keep dependencies and configuration minimal and avoid unsafe dynamic code execution.
- Never expose `.env` contents or server-only secrets to the Angular client.
