# 08 - Workflow Rules

## Before coding

- Read `docs/CLIENT_REQUIREMENTS.md` and all relevant documentation before writing code
- Inspect existing files before modifying them
- Plan complex tasks before implementation; break into small, verifiable steps
- Do not modify unrelated files
- Do not initialize Next.js, install npm packages, create Mongoose models, or implement features until the architecture and development plan are approved

## During development

- Work in small, verifiable steps
- Keep business logic separate from UI components
- Use server-side code for database operations
- Never expose database credentials or secrets
- Never fabricate laboratory information
- Use clearly identified placeholders for missing content
- Follow WCAG 2.2 AA accessibility requirements
- Build responsive layouts

## Verification

- Run TypeScript checks (`tsc --noEmit`) after changes
- Run linting (`npm run lint`) after changes; zero errors required
- Report changed files and test results
- Never claim a feature works without verification

## Documentation

- Keep documentation in sync with implementation
- Document decisions, assumptions, and placeholders
- Update README and docs when architecture changes

## Approval

- Wait for client/architect approval before starting application development
- Do not implement features beyond the approved scope
- Design revisions agreed in writing before implementation
