# Design System

## Source of truth

`docs/CLIENT_REQUIREMENTS.md` is the authoritative requirements document. This design system document is an implementation recommendation derived from those requirements. All colors, typography, spacing, and component specifications are proposed and subject to client approval.

## Design direction

- Clean, academic, contemporary design
- Readable text, generous spacing, restrained decoration
- Consistent desktop, tablet, and mobile layouts
- Credible scientific laboratory aesthetic — not pharmaceutical sales, hospital, wet lab, or generic software company

## Color palette

### Primary

| Role | Value (proposed) | Usage |
|------|-----------------|-------|
| Primary (deep navy/dark blue) | `#0F2A43` | Headings, primary buttons, navigation active states |
| Accent (teal/cyan) | `#0E7C7B` | Secondary buttons, links, highlight elements |
| Background | `#FFFFFF` / `#F8FAFC` | Page backgrounds, card backgrounds |
| Surface | `#F1F5F9` | Subtle section backgrounds, hover states |
| Body text | `#1E293B` | Primary body text |
| Secondary text | `#64748B` | Captions, helper text, metadata |
| Muted | `#94A3B8` | Placeholder text, disabled states |
| Border | `#E2E8F0` | Dividers, input borders, card borders |
| Inverse | `#FFFFFF` | Text on dark backgrounds |

### Semantic

| Role | Value (proposed) | Usage |
|------|-----------------|-------|
| Success | `#059669` | Success messages |
| Warning | `#D97706` | Warning messages |
| Error | `#DC2626` | Error messages, form validation |
| Info | `#0284C7` | Informational messages |

### Contrast requirements

- Normal text: minimum 4.5:1 against background
- Large text (18pt+ or 14pt+ bold): minimum 3:1 against background
- UI components and graphical objects: minimum 3:1 against adjacent colors

## Typography

### Font family

- Primary: Readable sans-serif font (subject to laboratory approval)
- Fallback: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- Mono (for code/DOI display): ui-monospace, SFMono-Regular, "Source Code Pro", monospace

### Type scale

| Size | Value | Usage |
|------|-------|-------|
| text-xs | 0.75rem (12px) | Captions, timestamps, metadata |
| text-sm | 0.875rem (14px) | Helper text, small labels |
| text-base | 1rem (16px) | Body text, form inputs |
| text-lg | 1.125rem (18px) | Lead paragraphs, small headings |
| text-xl | 1.25rem (20px) | Section headings |
| text-2xl | 1.5rem (24px) | Page subheadings |
| text-3xl | 1.875rem (30px) | Page headings |
| text-4xl | 2.25rem (36px) | Hero headings |

### Line height

- Body: 1.6 (readable academic text)
- Headings: 1.25 (tight for display text)
- Tight: 1.25, Snug: 1.375, Normal: 1.5, Relaxed: 1.625

### Font weight

- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| space-1 | 0.25rem (4px) | Tight internal padding |
| space-2 | 0.5rem (8px) | Small gaps, icon spacing |
| space-3 | 0.75rem (12px) | Component padding |
| space-4 | 1rem (16px) | Standard section padding |
| space-5 | 1.25rem (20px) | Component gaps |
| space-6 | 1.5rem (24px) | Section spacing |
| space-8 | 2rem (32px) | Large section gaps |
| space-10 | 2.5rem (40px) | Hero padding |
| space-12 | 3rem (48px) | Page section spacing |
| space-16 | 4rem (64px) | Major section breaks |
| space-20 | 5rem (80px) | Hero section height |

## Breakpoints (responsive)

| Breakpoint | Value | Usage |
|------------|-------|-------|
| sm | 640px | Small tablets, large phones |
| md | 768px | Tablets |
| lg | 1024px | Small laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large desktops |

Mobile-first approach: base styles for mobile, add `sm:`, `md:`, `lg:`, `xl:` modifiers for larger screens.

## Components

### Button

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| Primary | Primary color | White | None | Main CTAs (Explore Our Research, View Publications) |
| Secondary | Transparent | Primary color | 1px Primary | Secondary actions |
| Outline | Transparent | Current color | 1px Border | Tertiary actions |
| Ghost | Transparent | Secondary text | None | Subtle actions |

All buttons: rounded-full or rounded-md, padding px-4 py-2, focus-visible ring, hover states, disabled opacity.

### Card

- Background: white
- Border: 1px Border
- Border-radius: 0.5rem (rounded-xl)
- Padding: space-5 or space-6
- Shadow: subtle (0 1px 2px 0 rgb(0 0 0 / 0.05))
- Hover: slight elevation or border color change

### Badge

- Inline-flex, items-center, rounded-full, px-2 py-0.5, text-xs, font-medium
- Variants: primary, secondary, outline, success, warning, error

### Input

- Full-width, block, w-full, rounded-md, border Border, bg-white, px-3 py-2, text-body
- Focus: ring-2 ring-Accent, border-transparent
- Disabled: bg-surface, cursor-not-allowed
- Label: block, text-sm, font-medium, mb-1

### Label

- Block, text-sm (0.875rem), font-medium, text-body, mb-1

### Modal

- Fixed, inset-0, z-50, flex, items-center, justify-center
- Overlay: bg-black/50, backdrop-blur-sm
- Panel: bg-white, rounded-xl, shadow-lg, max-w-lg, w-full, m-4
- Focus trap, ESC to close, click outside to close

### Navigation link

- Text-sm or text-base, font-medium, text-secondary, hover:text-primary
- Active: text-primary, with underline or background indicator
- Mobile: hamburger menu, slide-out drawer

### Footer

- Border-top, bg-background, py-space-12
- Grid layout: logo/name, navigation, contact, social links
- Text-secondary, text-sm

## Imagery guidelines

### Allowed

- Laboratory-provided photos and scientific visuals
- Protein structures, molecular interactions, simulation snapshots, network diagrams
- External visual assets with appropriate usage rights

### Not allowed

- Stock imagery misrepresenting the laboratory as a hospital or wet laboratory
- Automatically playing videos
- Heavy rotating banners
- Excessive particle effects
- Unapproved university logos
- Fabricated statistics, awards, collaborators, affiliations

### Image optimization

- `next/image` with `sizes` and `priority` for above-the-fold images
- WebP/AVIF formats where supported
- Optimized dimensions and file sizes
- Meaningful `alt` text for all images; decorative images use `alt=""`
- Placeholder images clearly marked as pending

## Accessibility (WCAG 2.2 AA)

- Keyboard navigation throughout
- Visible focus indicators (focus-visible ring)
- Meaningful image alternatives (`alt` text)
- Labeled form fields (`<label>` elements)
- Appropriate heading hierarchy (no skipping levels)
- Minimum contrast 4.5:1 normal text, 3:1 large text
- Skip-to-content link
- ARIA labels where native HTML insufficient
- Focus trap in modals

## Performance

- Optimize image dimensions and sizes
- Avoid unnecessary plugins/scripts
- Load optional interactive elements only when needed (dynamic imports)
- Main content useful before decorative elements load
- Test on mobile devices and throttled connections

## Placeholder styling

Placeholder content must be visually distinct:
- Muted text color (`#94A3B8`)
- "Content pending" or "To be confirmed" labels
- Never mixed with approved published content
- Removed or replaced before launch
