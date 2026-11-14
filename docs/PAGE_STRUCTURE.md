# Page Structure

## Source of truth

`docs/CLIENT_REQUIREMENTS.md` is the authoritative requirements document. This page structure document is an implementation recommendation derived from those requirements. All page layouts, component boundaries, and metadata are proposed and subject to client approval.

## Sitemap

```
/ (Home)
/about (About)
/research (Research)
/people (People directory)
/people/[id] (Person profile)
/publications (Publications list)
/publications/[id] (Publication detail)
/contact (Contact + inquiry form)
/projects (Projects — optional, when content ready)
/opportunities (Opportunities — optional, when content ready)
/news (News & Updates — optional at launch)
/cms/login (CMS login)
/cms/dashboard (CMS dashboard)
/cms/people (CMS people management)
/cms/publications (CMS publications management)
/cms/projects (CMS projects management)
/cms/settings (CMS site settings)
```

## Navigation

Main navigation (all pages): Home | About | Research | People | Publications | Contact

Projects, Opportunities, and News appear in navigation only when content is ready. Do not publish empty pages.

## Page-by-page structure

### Home (`/`)

**Server Component.** Data fetched server-side via Mongoose.

Sections:
1. Hero — laboratory name, Dhaka, Bangladesh, headline ("Advancing Drug Discovery Through Computation"), introduction, primary buttons (Explore Our Research, View Publications), secondary link (Collaborate With Us), one static scientific image
2. Research areas — 7 cards (Computational Drug Design; Quantum Chemical Modeling and DFT; Molecular Docking; Molecular Dynamics Simulation; Network Pharmacology; Machine Learning and AI in Drug Discovery), each with short description and detail link
3. About preview — brief laboratory introduction with Learn About the Lab link
4. Featured publications — 3–6 selected records (title, authors, journal, year, DOI/publisher link, optional thumbnail), CMS-controlled
5. Selected projects — approved summaries; hidden if no content
6. People preview — selected current members with link to full directory
7. Latest updates — latest 3 news items (only if laboratory will maintain)
8. Collaboration invitation — invitation text, Contact the Laboratory button
9. Footer — laboratory name, Dhaka, Bangladesh, approved email, navigation, social links, privacy policy, copyright

**Server/client boundary:** Entirely Server Component. No client interactivity required.

### About (`/about`)

**Server Component.**

Sections:
1. Laboratory overview — who we are, where based, computational research focus, how areas connect
2. Mission and vision (suggested text, subject to approval)
3. Research approach — approved diagram or narrative showing how methods relate
4. Optional verified content — establishment year, history, leadership, affiliation, partnerships, funding, computing infrastructure (placeholders until supplied)

**Server/client boundary:** Entirely Server Component.

### Research (`/research`)

**Server Component.**

Sections:
1. Research theme cards — 7 themes, each with: short accessible overview, scientific questions addressed, methods actually used, related projects, related publications, approved image/diagram where available
2. Editorial disclaimer — distinguish computational predictions from experimentally validated findings; do not imply predicted compound is proven medicine

**Server/client boundary:** Entirely Server Component.

### People (`/people`)

**Server Component.**

Sections:
1. Directory grid — person cards (photo, name, role, status badge)
2. Category filters — leadership, research associates, research assistants, students/trainees, collaborators/affiliated researchers, alumni
3. Link to individual profile pages

**Server/client boundary:** Server Component for listing. Client Component optional for category filtering (if client-side filter desired without page reload).

### Person profile (`/people/[id]`)

**Server Component.**

Sections:
1. Hero — photo, name, role, status badge
2. Biography — short biography
3. Research interests — linked to Research Themes
4. Education — optional
5. Contact email — optional, with consent
6. External links — ORCID, Google Scholar, GitHub, personal website
7. Selected publications — linked publication list
8. CV — optional, with explicit approval

**Server/client boundary:** Entirely Server Component.

### Publications (`/publications`)

**Server Component.**

Sections:
1. Publication list — newest first, cards or table view
2. Filters — year, research-theme, type; title/author search
3. Type badges — journal article, review, preprint, other
4. DOI/publisher links
5. Pagination

**Server/client boundary:** Server Component for listing. Client Components for filter UI (if client-side filtering desired).

### Publication detail (`/publications/[id]`)

**Server Component.**

Sections:
1. Header — title, authors, journal, year, type badge, status
2. Details — volume, issue, pages, DOI link, publisher URL
3. Abstract — optional
4. Related people — linked profiles
5. Related project — linked project
6. Figure — optional approved image
7. Repository/code/dataset links — optional
8. Editorial notes — preprint label, work-before-joining identification where applicable

**Server/client boundary:** Entirely Server Component.

### Contact (`/contact`)

**Server Component shell + Client Component form.**

Sections:
1. Contact information — laboratory name, Dhaka, Bangladesh, approved email, address (only if supplied for public use), professional links
2. Inquiry form — Client Component: name, email, institution/organization, inquiry subject, message
3. Success/failure messages — displayed after submission

**Server/client boundary:** Page is Server Component. Contact form is `'use client'` (interactivity, form state, validation feedback). Form submits to `/api/contact` via RTK Query or fetch.

### Projects (`/projects`) — optional

**Server Component.** Hidden if no content ready.

Sections:
1. Project cards — title, public summary, research theme, status badge, related publications
2. Filters — research theme, ongoing/completed

### Opportunities (`/opportunities`) — optional

**Server Component.** Hidden if no content ready.

Sections:
1. Opportunity listings — title, description, eligibility, skills, location, deadline, status
2. Application instructions — direct to approved email

### News & Updates (`/news`) — optional at launch

**Server Component.** Hidden if not maintained.

Sections:
1. News list — latest first, title, summary, published date
2. Featured news — CMS-controlled

## CMS pages

### CMS login (`/cms/login`)

**Client Component.** Login form (email, password). Posts to `/api/auth/login`. Sets HTTP-only session cookie.

### CMS dashboard (`/cms/dashboard`)

**Server Component** (requires auth). Overview stats, quick actions, recent activity.

### CMS people management (`/cms/people`)

**Server Component** (requires auth: admin, editor). List all people (draft and published), create/edit/delete, draft/publish toggle, ordering control.

### CMS publications management (`/cms/publications`)

**Server Component** (requires auth: admin, editor). List all publications, create/edit, draft/publish, featuring control.

### CMS projects management (`/cms/projects`)

**Server Component** (requires auth: admin, editor). List all projects, create/edit, draft/publish.

### CMS settings (`/cms/settings`)

**Server Component** (requires auth: admin only). Site title, contact email, social links, footer text.

## Server vs Client component boundaries

| Page | Server Component | Client Component | Reason |
|------|-----------------|------------------|--------|
| Home | Yes | No | Static content, no interactivity |
| About | Yes | No | Static content |
| Research | Yes | No | Static content |
| People | Yes | Optional | Listing static; filters optional client-side |
| People/[id] | Yes | No | Static profile |
| Publications | Yes | Optional | Listing static; filters optional client-side |
| Publications/[id] | Yes | No | Static detail |
| Contact | Yes | Yes | Form interactivity |
| Projects | Yes | Optional | Static listing |
| Opportunities | Yes | Optional | Static listing |
| News | Yes | Optional | Static listing |
| CMS login | No | Yes | Form, auth state |
| CMS dashboard | Yes | No | Server-rendered overview |
| CMS people/publications/projects | Yes | Optional | List server-rendered; edit modals client-side |
| CMS settings | Yes | No | Server-rendered |

## Metadata and SEO

Each public page uses `generateMetadata` (Server Component) for:

- Unique `<title>` per page
- `<meta name="description">` per page
- Open Graph tags (`og:title`, `og:description`, `og:type`, `og:image`)
- Canonical URL
- Robots directives

### Suggested metadata

| Page | Title | Description |
|------|-------|-------------|
| Home | Laboratory of Algorithmic Life Sciences \| Dhaka, Bangladesh | Explore research in computational drug design, DFT, molecular docking, molecular dynamics, network pharmacology, and AI at the Laboratory of Algorithmic Life Sciences, Dhaka, Bangladesh. |
| About | About \| Laboratory of Algorithmic Life Sciences | Learn about the Laboratory of Algorithmic Life Sciences, our mission, vision, and computational research approach in Dhaka, Bangladesh. |
| Research | Research \| Laboratory of Algorithmic Life Sciences | Our research themes: computational drug design, DFT, molecular docking, molecular dynamics, network pharmacology, machine learning, and AI in drug discovery. |
| People | People \| Laboratory of Algorithmic Life Sciences | Meet the team at the Laboratory of Algorithmic Life Sciences — leadership, research associates, assistants, students, and collaborators. |
| Publications | Publications \| Laboratory of Algorithmic Life Sciences | Verified scientific publications from the Laboratory of Algorithmic Life Sciences, Dhaka, Bangladesh. |
| Contact | Contact \| Laboratory of Algorithmic Life Sciences | Contact the Laboratory of Algorithmic Life Sciences in Dhaka, Bangladesh for research collaboration and recruitment inquiries. |

## XML sitemap

Generated at `/sitemap.xml` including all public pages (Home, About, Research, People, Publications, Contact, Projects, Opportunities, News when content ready). Excludes draft content and CMS routes.

## Accessibility per page

- Skip-to-content link on all pages
- Keyboard-navigable navigation
- Visible focus indicators
- Heading hierarchy without skipping levels
- All images have meaningful `alt` text
- Form fields have associated labels
- Minimum contrast 4.5:1 normal text, 3:1 large text
