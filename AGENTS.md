
# Project Instructions

## Project
Build the Laboratory of Algorithmic Life Sciences website
according to docs/CLIENT_REQUIREMENTS.md.

## Technology Stack
- Next.js App Router
- TypeScript (strict mode)
- MongoDB with Mongoose
- Redux Toolkit
- RTK Query
- Tailwind CSS

## General Rules
- Use TypeScript for all application code.
- Use reusable components.
- Follow Next.js App Router conventions.
- Keep business logic separate from UI components.
- Use server-side code for database operations.
- Never expose database credentials or secrets.
- Never fabricate laboratory information.
- Use clearly identified placeholders for missing content.
- Follow WCAG 2.2 AA accessibility requirements.
- Build responsive layouts.

## Database
- Use Mongoose models.
- Reuse database connections.
- Add appropriate indexes.
- Validate data on the server.
- Use timestamps where appropriate.
- Handle database errors consistently.

## Redux and API
- Use Redux Toolkit for global client state.
- Use RTK Query for API communication.
- Avoid unnecessary local/global state duplication.
- Keep API endpoints organized by feature.
- Handle loading, success and error states.

## Security
- Implement role-based access control.
- Support Admin and Editor roles.
- Validate all server inputs.
- Protect administrative routes and API endpoints.
- Never trust client-side authorization.

## Development Workflow
- Read relevant documentation before coding.
- Inspect existing files before modifying them.
- Plan complex tasks before implementation.
- Work in small, verifiable steps.
- Do not modify unrelated files.
- Run TypeScript checks and linting after changes.
- Report changed files and test results.
- Never claim a feature works without verification.

## Important
Do not start implementing features until the
architecture and development plan are approved.
