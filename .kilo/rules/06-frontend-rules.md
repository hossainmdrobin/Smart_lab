# 06 - Frontend Rules

## Styling

- Tailwind CSS 4 for all styling
- Responsive design: mobile-first, breakpoints `sm`, `md`, `lg`, `xl`
- No custom CSS unless a Tailwind utility cannot express the design
- Design tokens (colors, spacing, typography) defined in Tailwind config or CSS variables

## Component boundaries

- Server Components for all static content and data fetching
- Client Components (`'use client'`) only for interactivity: forms, filters, modals, mobile nav, CMS editor
- Client Components never import Mongoose or call database APIs directly; they call `app/api/` endpoints via RTK Query
- Props typed with TypeScript interfaces

## Accessibility (WCAG 2.2 AA)

- Keyboard navigable throughout; visible focus indicators
- All images have meaningful `alt` text; decorative images use `alt=""`
- Form fields have associated `<label>` elements
- Heading hierarchy (`h1` > `h2` > `h3` ...) without skipping levels
- Minimum contrast 4.5:1 for normal text, 3:1 for large text
- ARIA labels where native HTML is insufficient
- Skip-to-content link on all pages
- Focus trap in modals and drawers

## Performance

- `next/image` with `sizes` and `priority` for above-the-fold images
- Images optimized for dimensions and file size; WebP/AVIF where supported
- No auto-playing videos, heavy rotating banners, or excessive particle effects
- Optional interactive elements loaded only when needed (dynamic imports with `next/dynamic`)
- Main content useful before decorative elements load
- Test on mobile devices and throttled connections

## Images and media

- Laboratory-provided images preferred
- External visual assets must have appropriate usage rights
- No stock imagery misrepresenting the laboratory as a hospital or wet laboratory
- No unapproved university logos
- Placeholder images used only where content is pending, clearly marked

## Layout

- Clear sections, restrained cards, strong heading hierarchy
- Consistent desktop, tablet, and mobile layouts
- Generous spacing; restrained decoration
- Navigation: Home | About | Research | People | Publications | Contact (+ Projects, Opportunities, News when content ready)
- Hide unused sections until content is ready; do not publish empty pages

## SEO

- Unique descriptive titles per page (`generateMetadata`)
- Meta descriptions per page
- Descriptive, crawlable URLs
- XML sitemap generated
- Open Graph tags for social sharing
- Laboratory identity and location clearly stated

## State management

- Redux Toolkit for global client state (auth, UI preferences, form drafts)
- RTK Query for server state (API data, caching, invalidation)
- Avoid duplicating server state in local/global state
- Local component state only for ephemeral UI (toggles, input values before submit)
