# 03 - Coding Standards

## TypeScript

- Strict mode enabled for all `.ts` and `.tsx` files
- No `any` types; use explicit types or interfaces
- Prefer interfaces for object shapes; types for unions and primitives
- All exported functions and components must have typed parameters and return types
- Avoid `// @ts-ignore` or `// @ts-nocheck`; fix type errors instead

## Naming conventions

- Files and directories: kebab-case (`research-themes`, `publication-detail`)
- Components: PascalCase (`ResearchCard.tsx`, `PublicationList.tsx`)
- Hooks: camelCase with `use` prefix (`usePublications`, `useAuth`)
- Constants: UPPER_SNAKE_CASE
- Mongoose models: PascalCase singular (`Person`, `Publication`, `Project`)
- API routes: kebab-case directory names under `app/api/`

## Component standards

- Reusable UI primitives in `components/ui/` (Button, Input, Card, Modal, Badge, etc.)
- Feature components in `components/public/` or `components/cms/`
- Props destructured with types; default props avoided when possible
- Event handlers named `on<Action>` (`onSubmit`, `onDelete`)
- No inline styles; use Tailwind CSS utility classes
- Components must be self-contained; do not reach into global state unless shared state is required

## Business logic vs UI

- Database calls, validation, and business rules live outside components (in `lib/services/`, `lib/utils/`, or route handlers)
- Components receive data via props and call actions via callbacks
- Form submission handlers call service functions; components do not call Mongoose directly

## CSS / Tailwind

- Tailwind CSS 4 utility-first approach
- Responsive modifiers: `sm:`, `md:`, `lg:`, `xl:` for breakpoints
- No arbitrary values unless a design token does not exist
- Custom CSS only in `app/globals.css` for base styles and CSS variables

## Comments

- Do not add comments unless explicitly asked
- Self-documenting code through clear names and types is preferred
- JSDoc only for complex public APIs where types are insufficient

## Linting

- Run `npm run lint` after changes; zero lint errors required
- Follow ESLint config from `eslint.config.mjs`
- No unused imports or variables
- Consistent formatting enforced by the project's tooling
