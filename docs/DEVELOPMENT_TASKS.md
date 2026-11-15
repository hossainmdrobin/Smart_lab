# Development Tasks

## Source of truth

`docs/CLIENT_REQUIREMENTS.md` is the authoritative requirements document. This development tasks document is an implementation plan derived from those requirements. All task details are proposed and subject to client approval.

**Restrictions:** Do not initialize Next.js, install npm packages, create Mongoose models, or implement application features until the architecture and development plan are approved.

## Phase 1: Project initialization

### Tasks

1.1 Review and confirm project requirements with the laboratory
1.2 Confirm laboratory details: official name, abbreviation, logo, email, address (if public)
1.3 Confirm design direction: colors, typography, imagery preferences
1.4 Set up project repository (Git) with .gitignore (node_modules, .env, .next, etc.)
1.5 Configure environment variables template (.env.example) — no secrets committed
1.6 Set up TypeScript strict mode configuration
1.7 Set up Tailwind CSS configuration with design tokens
1.8 Create project documentation review and approval (this document set)
1.9 Set up ESLint and Prettier configuration
1.10 Plan deployment target (hosting provider, MongoDB hosting)

### Deliverables

- Approved project scope and requirements
- Repository initialized
- Environment variable template
- Documentation approved by client

### Exit criteria

- Architecture and development plan approved by client
- Repository ready for development
- No application code written yet

---

## Phase 2: Architecture and database

### Tasks

2.1 Set up Mongoose connection reuse utility (`lib/db.ts`)
2.2 Create Mongoose models: User, ResearchTheme, Person, Publication, Project, News, Opportunity, Media, Setting, ContactInquiry
2.3 Add indexes on frequently queried fields
2.4 Define schema validation rules (required, enum, format)
2.5 Implement draft/published/archived status on content models
2.6 Implement soft deletion (isDeleted / deletedAt)
2.7 Create TypeScript interfaces for all models
2.8 Set up database seeding script for development (placeholder data only — clearly marked)
2.9 Document database relationships (People ↔ Publications ↔ Projects ↔ Research Themes)

### Deliverables

- Mongoose models (server-only)
- Database connection utility
- Schema definitions with indexes and validation
- Relationship documentation

### Exit criteria

- Database schema reviewed and approved
- Mongoose models compile without TypeScript errors
- No application features implemented yet

---

## Phase 3: Authentication and authorization

### Tasks

3.1 Set up authentication route handlers (`/api/auth/login`, `/api/auth/logout`, `/api/auth/refresh`, `/api/auth/session`)
3.2 Implement password hashing (bcrypt)
3.3 Implement JWT access tokens and refresh tokens with HTTP-only cookies
3.4 Create User model with role field (admin, editor)
3.5 Implement session validation middleware
3.6 Implement role-based access control (RBAC) middleware
3.7 Protect CMS routes (`/cms/*`) with middleware
3.8 Protect admin-only API endpoints
3.9 Create login page (`/cms/login`) as Client Component
3.10 Set up Redux Toolkit auth slice for client-side session state

### Deliverables

- Authentication API endpoints
- Session management with HTTP-only cookies
- RBAC middleware
- Protected CMS routes
- Auth state in Redux Toolkit

### Exit criteria

- Login/logout flow works
- Role-based access enforced server-side
- CMS routes protected
- No content management features implemented yet

---

## Phase 4: CMS development

### Tasks

4.1 Create CMS layout and navigation shell
4.2 Build CMS dashboard (overview stats, quick actions)
4.3 Build people management (list, create, edit, draft/publish, ordering)
4.4 Build publications management (list, create, edit, draft/publish, featuring)
4.5 Build projects management (list, create, edit, draft/publish)
4.6 Build news management (list, create, edit, draft/publish) — optional at launch
4.7 Build opportunities management (list, create, edit, draft/publish) — optional
4.8 Build settings management (site title, contact email, social links) — admin only
4.9 Build media upload (image only, restricted types/sizes)
4.10 Implement draft/preview functionality
4.11 Implement homepage highlight selection and ordering
4.12 Connect CMS to RTK Query API slices

### Deliverables

- Full CMS interface for content management
- Draft/published workflow
- Media upload with validation
- Settings management (admin only)
- RTK Query integration

### Exit criteria

- Editor can add a person and publication without developer help
- Draft content remains unpublished
- CMS accessible only to authenticated Admin/Editor users

---

## Phase 5: Public website development

### Tasks

5.1 Create root layout with navigation and footer
5.2 Build Home page (hero, research areas, about preview, featured publications, projects preview, people preview, collaboration invitation, footer)
5.3 Build About page
5.4 Build Research page (7 theme cards with details)
5.5 Build People directory page
5.6 Build Person profile page (`/people/[id]`)
5.7 Build Publications page (list with filters and search)
5.8 Build Publication detail page (`/publications/[id]`)
5.9 Build Contact page (contact info + inquiry form with server-side validation)
5.10 Build Projects page (optional, when content ready)
5.11 Build Opportunities page (optional, when content ready)
5.12 Build News page (optional at launch)
5.13 Implement metadata (generateMetadata) for all public pages
5.14 Generate XML sitemap
5.15 Implement Open Graph tags
5.16 Connect public pages to RTK Query API slices
5.17 Implement responsive design (mobile, tablet, desktop)

### Deliverables

- All required public pages (Home, About, Research, People, Publications, Contact)
- Optional pages (Projects, Opportunities, News) when content ready
- Responsive layouts
- SEO metadata and sitemap
- RTK Query data fetching on client side where needed

### Exit criteria

- All required pages render correctly
- Navigation works across all breakpoints
- Contact form submits with server-side validation
- Draft content not visible on public site

---

## Phase 6: Content management and relationships

### Tasks

6.1 Implement People ↔ Publications relationship (editors link people to publications)
6.2 Implement People ↔ Projects relationship (project team assignments)
6.3 Implement Publications ↔ Research Themes tagging
6.4 Implement Projects ↔ Research Themes tagging
6.5 Implement homepage featured content selection (publications, projects, people)
6.6 Implement content ordering control (admin-defined)
6.7 Implement relationship validation (prevent orphaned references)
6.8 Test CMS relationship editing end-to-end

### Deliverables

- Working content relationships in CMS
- Editors can link records without re-entering information
- Featured content controllable from CMS

### Exit criteria

- Content relationships functional in CMS
- No duplicate data entry for related records

---

## Phase 7: Testing and optimization

### Tasks

7.1 Functional testing — all forms, navigation, filters, search
7.2 Mobile testing — responsive layouts on mobile devices
7.3 Accessibility testing — WCAG 2.2 AA compliance (keyboard navigation, focus, contrast, labels, headings)
7.4 Form testing — contact form validation, success/failure messages, delivery to inbox
7.5 Performance testing — image optimization, load times on throttled connections
7.6 SEO testing — titles, descriptions, sitemap, crawlable URLs
7.7 Security testing — authentication, authorization, rate limiting, input validation
7.8 Backup restoration test — demonstrate MongoDB backup restoration
7.9 Performance reports for homepage and representative inner pages
7.10 Fix all bugs found during testing

### Deliverables

- Test results for all acceptance checklist items
- Accessibility audit report
- Performance reports
- Security review
- Bug fixes applied

### Exit criteria

- All acceptance checklist items pass
- WCAG 2.2 AA compliance verified
- Performance targets met
- Security vulnerabilities addressed

---

## Phase 8: Deployment and handover

### Tasks

8.1 Deploy website and CMS to private staging
8.2 Content entry — laboratory populates approved content across agreed pages
8.3 Client review and approval of staged content
8.4 Production deployment (domain, hosting, HTTPS)
8.5 Remove demo/draft content
8.6 Handover: accounts, source code, backups, documentation, admin training
8.7 Document maintenance responsibilities and backup schedule
8.8 Confirm laboratory owns/controls domain, hosting, CMS admin access, source repository
8.9 Post-launch support period (as agreed)

### Deliverables

- Live production website
- Staged and approved content
- Handover package (accounts, source code, documentation)
- Admin training completed
- Maintenance responsibility documented

### Exit criteria

- Website live and accessible
- Laboratory can update content independently via CMS
- All handover items delivered
- Developer is not sole account owner for any service

---

## Acceptance checklist (final)

- Laboratory name and location correct everywhere
- All claims and affiliations have approval
- Website works on mobile, tablet, desktop
- Navigation, buttons, DOI links, profile links work
- Editor can add a person and publication without developer help
- Publication and research-theme filters work
- Draft content remains unpublished
- Contact submissions reach correct inbox
- Form errors understandable and preserve valid entries
- Keyboard navigation and form labels tested
- No demo content, invented metrics, or broken images
- No confidential files or unapproved personal details public
- Backup restoration demonstrated
- Domain, hosting, CMS, source-code access handed over
- Administrator instructions and maintenance responsibilities documented
