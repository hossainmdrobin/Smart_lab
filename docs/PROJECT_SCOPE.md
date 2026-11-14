# Project Scope

## Source of truth

`docs/CLIENT_REQUIREMENTS.md` is the authoritative requirements document. This scope document summarizes and organizes those requirements; where they conflict, the client requirements take precedence.

## Project overview

The Laboratory of Algorithmic Life Sciences, based in Dhaka, Bangladesh, needs a professional, modern, and easy-to-maintain academic website. The laboratory's research focuses on computational methods in drug discovery and life sciences:

1. Computational drug design
2. Density functional theory (DFT)
3. Molecular docking
4. Molecular dynamics (MD) simulation
5. Network pharmacology
6. Machine learning
7. Artificial intelligence in drug discovery

The website must communicate the laboratory's research identity, introduce the team, showcase publications and projects, and support collaboration and recruitment inquiries. It must feel like a credible scientific laboratory website — not a pharmaceutical sales site, hospital site, or generic software company site.

## Placeholder policy

Any information not supplied by the laboratory must remain a clearly identified placeholder during development and must be removed or approved before publication. The developer must not invent an abbreviation, founding year, institutional relationship, or leadership structure.

## Objectives

- Establish a clear online identity for the laboratory
- Present research areas in an understandable and scientifically appropriate way
- Showcase verified publications, ongoing projects, and research outputs
- Introduce laboratory members and their expertise
- Support research collaboration and recruitment inquiries
- Allow designated laboratory members to update content without coding

## Target audiences

- Academic researchers and potential collaborators
- Prospective research students and research associates
- Universities and research institutions
- Funding organizations
- Scientific and industry partners

## Primary language

English. Bangla may be considered as a later addition.

## Website structure (sitemap)

| Page | Priority | Purpose |
|------|----------|---------|
| Home | Required | Introduce the laboratory and direct visitors to key content |
| About | Required | Explain identity, mission, and approach |
| Research | Required | Present research themes and computational methods |
| People | Required | Introduce current members and their roles |
| Publications | Required | Display verified scientific publications |
| Contact | Required | Provide inquiries and approved contact information |
| Projects | Recommended | Describe approved ongoing and completed projects |
| Opportunities | Recommended | Display genuine openings and collaboration opportunities |
| News & Updates | Optional at launch | Share publications, achievements, and events |
| Resources | Future expansion | Share approved code, datasets, protocols, tutorials |

**Rule:** Do not publish empty pages just to fill the navigation. Hide unused sections until content is ready.

## Main navigation

Home | About | Research | People | Publications | Contact

Projects, Opportunities, and News appear when content is ready.

## Design direction

- Clean, academic, contemporary design
- Readable text, generous spacing, restrained decoration
- Consistent desktop, tablet, and mobile layouts
- **Main colors:** Deep navy or dark blue
- **Accent colors:** Teal or cyan
- **Background:** White or very light gray
- **Body text:** Dark gray
- **Typography:** Readable sans-serif font, subject to approval
- **Scientific imagery:** Protein structures, molecular interactions, simulation snapshots, or network diagrams
- **Layout:** Clear sections, restrained cards, strong heading hierarchy

### Two homepage design concepts

Prepare two homepage design concepts for approval before building the full website.

### Avoid

- Stock imagery misrepresenting the laboratory as a hospital or wet laboratory
- Automatically playing videos, heavy rotating banners, excessive particle effects
- Fabricated statistics, awards, collaborators, or affiliations
- Unapproved university logos
- Unsupported claims such as "world-leading" or "internationally renowned"

## Homepage requirements

- **Main introduction:** Laboratory of Algorithmic Life Sciences, Dhaka, Bangladesh. Suggested headline: "Advancing Drug Discovery Through Computation"
- **Primary buttons:** Explore Our Research; View Publications
- **Secondary link:** Collaborate With Us
- **Scientific visual:** One relevant static image
- **Research areas:** Cards for all 7 research areas, each with short description and detail link
- **About preview:** Brief laboratory introduction with Learn About the Lab link
- **Featured publications:** 3–6 selected records with title, authors, journal, year, DOI/publisher link, optional approved thumbnail; selected through CMS
- **Selected projects:** Approved summaries; hide if no content is ready
- **People preview:** Selected current members with link to full directory
- **Latest updates:** Latest 3 news items, only if laboratory will maintain this section
- **Collaboration invitation:** "We welcome inquiries about research collaboration in computational life sciences and drug discovery." Button: Contact the Laboratory
- **Footer:** Laboratory name, Dhaka, Bangladesh, approved email, navigation, approved professional/social links, privacy policy, copyright
- **No invented street address or map location**

## About page

- Laboratory overview: who we are, where based, computational research focus, how areas connect
- Suggested mission and vision (subject to approval)
- Research approach: approved diagram or narrative showing how methods relate
- Optional verified content: establishment year, history, leadership, affiliation, partnerships, funding, computing infrastructure

## Research page

- Required themes: computational drug design; DFT; molecular docking; molecular dynamics simulation; network pharmacology; machine learning and AI in drug discovery
- For each theme: short accessible overview, scientific questions addressed, methods actually used, related projects, related publications, approved image/diagram where available
- Laboratory review required before launch
- Do not invent methods, software expertise, therapeutic areas, or experimental capabilities
- Distinguish computational predictions from experimentally validated findings
- Do not imply predicted compound is proven medicine; computation alone does not establish clinical effectiveness

## People page

- Directory with individual profile pages
- Categories: leadership, research associates, research assistants, students/trainees, collaborators/affiliated researchers, alumni
- External collaborators kept separate from laboratory members

### Profile fields

| Field | Requirement |
|-------|-------------|
| Full name | Required |
| Laboratory role | Required |
| Profile photo | Preferred |
| Short biography | Preferred |
| Research interests | Preferred |
| Education | Optional |
| Public contact email | Optional, with consent |
| ORCID / Google Scholar / GitHub / personal website | Optional |
| Selected publications | Optional |
| CV | Optional, with explicit approval |
| Current/alumni status | Required internally |

- Do not publish private phone numbers, CVs, photos, or personal details without approval
- Administrators control profile order; can move former members to alumni

## Publications page

- Newest publications first
- Year and research-theme filters; title/author search
- Clear distinction among journal articles, reviews, preprints, and other outputs
- DOI or publisher links
- Administrator-controlled homepage featuring

### Data fields

Title; complete author list; journal/venue; year; volume, issue, and pages/article number where applicable; DOI; publisher URL; publication type; publication status; research tags; related members; related project; optional abstract; optional approved figure; optional repository, code, and dataset links

### Editorial rules

- Never invent a DOI or publication detail
- Do not label submitted or under-review manuscripts as published
- Label preprints clearly
- Identify work completed before a member joined
- Host PDFs only when laboratory has permission to share that version
- Keep manual editing available even if DOI import is implemented
- Optional later features: BibTeX/RIS export, DOI-based metadata import

## Projects page

- Each project: title, public summary, research theme, ongoing/completed status, approved team, publicly shareable methods, related publications, code/datasets, funding acknowledgment where applicable, approved image
- Support draft and published states
- Do not upload unpublished compound libraries, confidential partner information, sensitive datasets, or detailed unpublished results without authorization

## Opportunities page

- Support research positions, student research opportunities, internships, collaborations only where offered
- Each listing: title, description, eligibility, expected skills, location/working arrangement, application instructions, deadline where applicable, open/closed status
- Do not imply paid, funded, remote, or available unless confirmed
- Initially direct applications to approved email instead of application portal

## Contact page

- Laboratory name, Dhaka, Bangladesh, approved email, exact address only if supplied for public use, professional links, optional inquiry form
- Form fields: name, email, institution/organization, inquiry subject, message
- Clear success/failure messages; delivery to designated inbox
- Server-side validation (not browser checks alone)
- No public file uploads initially

## Content Management System (CMS)

- CMS for authorized members to update site without code
- Manage: people, publications, projects, news, opportunities
- Change contact details and upload approved images
- Select homepage highlights and control ordering
- Save drafts and preview content
- Edit page titles and search descriptions
- Roles: Administrator (accounts, settings, all content); Editor (approved editing/publishing permissions)
- Content relationships: People ↔ Publications ↔ Projects ↔ Research Themes; editors link records without re-entering information

### Custom CMS approach (vs WordPress/headless CMS alternatives)

**Rationale for custom CMS built into the Next.js application:**

1. **Scientific accuracy requirements:** The laboratory requires strict editorial controls — no fabricated DOIs, no preprints labeled as published, draft/published states, approval workflows. A custom CMS built on Mongoose + Next.js gives full control over these domain-specific rules.

2. **Content relationships:** People ↔ Publications ↔ Projects ↔ Research Themes is a core requirement. A custom schema in Mongoose can model these relationships natively, whereas adapting WordPress or a headless CMS requires custom post types and relationship plugins.

3. **Maintenance cost:** WordPress requires ongoing plugin/theme/security updates and a separate hosting environment. A custom Next.js CMS is a single codebase with the same stack as the frontend, reducing operational complexity.

4. **No subscription dependence:** Headless CMS platforms charge recurring fees and create vendor lock-in. The custom approach uses only open-source tools (Next.js, MongoDB, Mongoose, Redux Toolkit), giving the laboratory full ownership of code and data.

5. **Role-based access:** Admin/Editor RBAC with least-privilege is built directly into the custom CMS, matching the security requirements without plugin complexity.

6. **Initial scope is informational:** The site is not a computational platform. A custom CMS for content editing is proportionate; WordPress would be over-engineered for this scope, and headless CMS adds cost without benefit.

**Trade-offs evaluated:**
- Initial cost: Lower (no licenses/subscriptions)
- Annual hosting/subscriptions: Minimal (Next.js + MongoDB hosting only)
- Update usability: Custom CMS UI built specifically for the laboratory's workflows
- Technical support: Developer provides support during contract; laboratory owns source code
- Backup/restoration: MongoDB backups controlled by the laboratory
- Export/migration: Data in MongoDB is portable; no vendor lock-in
- Paid-theme/plugin dependence: None required

## Technical approach and scope

### In scope

- Next.js App Router frontend
- Custom CMS with Admin/Editor roles
- MongoDB with Mongoose
- Redux Toolkit + RTK Query for client state and API
- Tailwind CSS
- Public pages: Home, About, Research, People, Publications, Contact (+ Projects, Opportunities when content ready)
- Contact form with server-side validation
- SEO (titles, descriptions, sitemap, Open Graph)
- Accessibility (WCAG 2.2 AA)
- Performance optimization

### Out of scope (initial)

- Online docking/simulation submission
- GPU/HPC integration
- Public user accounts
- AI chatbot
- Online payments
- Learning management
- Manuscript submission portals
- Application portal for opportunities (direct to email initially)

## Accessibility, search visibility, and performance

### Accessibility (WCAG 2.2 AA)

- Keyboard navigation, visible focus
- Meaningful image alternatives, labeled fields, appropriate headings
- Minimum contrast 4.5:1 normal text, 3:1 large text

### Search visibility (SEO)

- Unique descriptive titles, clear headings, descriptive URLs
- Crawlable research/people/publication pages
- Suitable descriptions, XML sitemap, clear laboratory identity/location
- Suggested homepage title: "Laboratory of Algorithmic Life Sciences | Dhaka, Bangladesh"
- Suggested description: "Explore research in computational drug design, DFT, molecular docking, molecular dynamics, network pharmacology, and AI at the Laboratory of Algorithmic Life Sciences, Dhaka, Bangladesh."

### Performance

- Optimize image dimensions and sizes
- Avoid unnecessary plugins/scripts
- Load optional interactive elements only when needed
- Keep main content useful before decorative elements load
- Test mobile devices and throttled connection
- Supply performance reports for homepage and representative inner pages
- Agree measurable targets before development (testing tool, device profile, network conditions)

## Security, privacy, and ownership

- HTTPS and protected administrator accounts
- Least-privilege access, spam protection, submission rate limits
- Regular software updates
- Documented backup schedule, retention, tested restoration
- No passwords or API keys in public code
- Privacy notice explaining contact-form data handling
- Agreed process for deleting inquiry data
- Documented maintenance responsibility after launch
- Laboratory owns/controls domain, hosting, CMS admin access, source code, content, analytics/search accounts, paid assets
- Developer must not be sole account owner

## Content the laboratory will provide

| Content | Laboratory action |
|---------|-------------------|
| Official name and approved abbreviation | Confirm |
| Logo | Supply or commission separately |
| About text and research descriptions | Supply and approve |
| Leadership and member information | Supply |
| Approved photos and scientific visuals | Supply or approve |
| Verified publications and DOI links | Supply |
| Public project summaries | Supply |
| Email and public address | Confirm |
| Social/academic profile links | Supply |
| Collaboration and funding acknowledgments | Verify |
| Opportunities | Supply only when genuine |

## Milestones and deliverables

| Stage | Required output |
|-------|-----------------|
| Planning | Scope, sitemap, checklist, technology proposal, cost breakdown |
| Wireframes | Homepage and representative inner-page layouts |
| Visual design | Approved desktop and mobile designs |
| Development | Working website and CMS on private staging |
| Content entry | Approved content populated across agreed pages |
| Testing | Functional, mobile, accessibility, form, performance checks |
| Launch | Deployment and removal of demo/draft content |
| Handover | Accounts, source code, backups, documentation, admin training |

## Acceptance checklist

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

## Recommended initial launch scope

Prioritize Home, About, Research, People, Publications, Contact, and an easy-to-use CMS. Add Projects and Opportunities if approved content is available. Introduce News, Resources, interactive molecular viewers, or advanced features only with a clear purpose and a designated maintainer.

**Central requirement:** A scientifically accurate, well-organized website that the laboratory can update independently — not simply an attractive homepage.
