# Database Schema

## Source of truth

`docs/CLIENT_REQUIREMENTS.md` is the authoritative requirements document. This schema document is an implementation recommendation derived from those requirements. All field names, types, and relationships are proposed and subject to client approval.

## Design principles

- Mongoose models with TypeScript interfaces
- Reused database connection (`lib/db.ts`)
- `timestamps: true` on all models (createdAt, updatedAt)
- Indexes on frequently queried fields
- Server-side validation (Mongoose schema + Zod at API layer)
- Draft/published states for content models
- Soft deletion where restoration may be needed
- No fabrication of laboratory information; placeholders clearly marked

## Models

### User

Authentication and authorization account.

| Field | Type | Required | Index | Notes |
|-------|------|----------|-------|-------|
| email | String | Yes | unique | Login identifier |
| passwordHash | String | Yes | | Bcrypt hash |
| role | String | Yes | | Enum: `admin` \| `editor` |
| name | String | Yes | | Display name |
| isActive | Boolean | Yes | | Account active flag |
| lastLoginAt | Date | No | | |
| createdAt | Date | Yes | | timestamps |
| updatedAt | Date | Yes | | timestamps |

### ResearchTheme

Research areas and themes.

| Field | Type | Required | Index | Notes |
|-------|------|----------|-------|-------|
| name | String | Yes | | e.g., "Computational Drug Design" |
| slug | String | Yes | unique | URL-friendly identifier |
| description | String | No | | Short accessible overview |
| featured | Boolean | No | | Show on homepage |
| order | Number | No | | Display ordering |
| createdAt | Date | Yes | | timestamps |
| updatedAt | Date | Yes | | timestamps |

Relationships:
- Publications reference ResearchTheme via `researchTags`
- Projects reference ResearchTheme via `researchTheme`
- People reference ResearchTheme via `researchInterests`

### Person

Laboratory member profile.

| Field | Type | Required | Index | Notes |
|-------|------|----------|-------|-------|
| fullName | String | Yes | | |
| role | String | Yes | | Enum: `leadership` \| `research-associate` \| `research-assistant` \| `student-trainee` \| `collaborator` \| `alumni` |
| status | String | Yes | | Enum: `current` \| `alumni` |
| bio | String | No | | Short biography |
| researchInterests | [ObjectId] | No | | References ResearchTheme |
| education | String | No | | |
| email | String | No | | Public contact email, with consent |
| orcid | String | No | | |
| googleScholar | String | No | | URL |
| github | String | No | | URL |
| personalWebsite | String | No | | URL |
| photo | ObjectId | No | | References Media |
| cv | ObjectId | No | | References Media, with explicit approval |
| selectedPublications | [ObjectId] | No | | References Publication |
| order | Number | No | | Admin-controlled display order |
| isDeleted | Boolean | No | | Soft delete |
| createdAt | Date | Yes | | timestamps |
| updatedAt | Date | Yes | | timestamps |

Relationships:
- Person ↔ Publication: many-to-many (Person.selectedPublications, Publication.relatedPeople)
- Person ↔ Project: many-to-many (Project.team, Person may have derived project list)
- Person ↔ ResearchTheme: many-to-many via researchInterests

### Publication

Scientific publication record.

| Field | Type | Required | Index | Notes |
|-------|------|----------|-------|-------|
| title | String | Yes | | |
| authors | [String] | Yes | | Complete author list |
| journal | String | Yes | | Journal/venue |
| year | Number | Yes | | |
| volume | String | No | | |
| issue | String | No | | |
| pages | String | No | | Article number where applicable |
| doi | String | No | | DOI, never invented |
| publisherUrl | String | No | | |
| type | String | Yes | | Enum: `journal-article` \| `review` \| `preprint` \| `other` |
| status | String | Yes | | Enum: `draft` \| `published` \| `archived` |
| researchTags | [ObjectId] | No | | References ResearchTheme |
| relatedPeople | [ObjectId] | No | | References Person |
| relatedProject | ObjectId | No | | References Project (optional) |
| abstract | String | No | | |
| figure | ObjectId | No | | References Media |
| repositoryUrl | String | No | | Code repository |
| datasetUrl | String | No | | Dataset link |
| featured | Boolean | No | | Homepage featuring |
| featuredAt | Date | No | | When featured |
| isDeleted | Boolean | No | | Soft delete |
| createdAt | Date | Yes | | timestamps |
| updatedAt | Date | Yes | | timestamps |

Editorial rules:
- Never invent a DOI or publication detail
- Do not label submitted/under-review as published
- Label preprints clearly
- Identify work completed before member joined
- Host PDFs only with permission
- Manual editing always available

Relationships:
- Publication ↔ Person: many-to-many
- Publication ↔ Project: optional many-to-one (or many-to-many via relatedProjects)
- Publication ↔ ResearchTheme: many-to-many via researchTags

### Project

Research project record.

| Field | Type | Required | Index | Notes |
|-------|------|----------|-------|-------|
| title | String | Yes | | |
| summary | String | Yes | | Public summary |
| researchTheme | [ObjectId] | Yes | | References ResearchTheme |
| status | String | Yes | | Enum: `ongoing` \| `completed` \| `draft` |
| team | [ObjectId] | No | | References Person |
| methods | String | No | | Publicly shareable methods |
| relatedPublications | [ObjectId] | No | | References Publication |
| codeUrl | String | No | | |
| datasetUrl | String | No | | |
| fundingAcknowledgment | String | No | | Where applicable |
| image | ObjectId | No | | References Media |
| featured | Boolean | No | | Homepage featuring |
| isDeleted | Boolean | No | | Soft delete |
| createdAt | Date | Yes | | timestamps |
| updatedAt | Date | Yes | | timestamps |

Restrictions:
- Do not upload unpublished compound libraries, confidential partner info, sensitive datasets, detailed unpublished results without authorization

Relationships:
- Project ↔ Person: many-to-many via team
- Project ↔ Publication: many-to-many
- Project ↔ ResearchTheme: many-to-many

### News

News and updates (optional at launch).

| Field | Type | Required | Index | Notes |
|-------|------|----------|-------|-------|
| title | String | Yes | | |
| summary | String | Yes | | |
| content | String | No | | Rich text body |
| publishedAt | Date | Yes | | |
| featured | Boolean | No | | Homepage featuring |
| image | ObjectId | No | | References Media |
| status | String | Yes | | Enum: `draft` \| `published` \| `archived` |
| isDeleted | Boolean | No | | Soft delete |
| createdAt | Date | Yes | | timestamps |
| updatedAt | Date | Yes | | timestamps |

### Opportunity

Research positions, internships, collaborations.

| Field | Type | Required | Index | Notes |
|-------|------|----------|-------|-------|
| title | String | Yes | | |
| description | String | Yes | | |
| eligibility | String | Yes | | |
| expectedSkills | String | No | | |
| location | String | Yes | | Location/working arrangement |
| applicationInstructions | String | Yes | | |
| deadline | Date | No | | |
| status | String | Yes | | Enum: `open` \| `closed` |
| isDeleted | Boolean | No | | Soft delete |
| createdAt | Date | Yes | | timestamps |
| updatedAt | Date | Yes | | timestamps |

Restrictions:
- Do not imply paid, funded, remote, or available unless confirmed
- Initially direct applications to approved email

### Media

Uploaded images and files.

| Field | Type | Required | Index | Notes |
|-------|------|----------|-------|-------|
| filename | String | Yes | | |
| originalName | String | Yes | | |
| mimeType | String | Yes | | Validated image type |
| size | Number | Yes | | Byte size |
| url | String | Yes | | Storage URL |
| altText | String | No | | Accessibility |
| uploadedBy | ObjectId | Yes | | References User |
| createdAt | Date | Yes | | timestamps |

Restrictions:
- Images only; restricted MIME types and sizes
- No executable files or archives

### Setting

Site-wide configuration.

| Field | Type | Required | Index | Notes |
|-------|------|----------|-------|-------|
| key | String | Yes | unique | e.g., `siteTitle`, `contactEmail` |
| value | Mixed | Yes | | |
| type | String | Yes | | Enum: `string` \| `boolean` \| `number` |
| updatedBy | ObjectId | Yes | | References User |
| updatedAt | Date | Yes | | timestamps |

### ContactInquiry

Contact form submissions.

| Field | Type | Required | Index | Notes |
|-------|------|----------|-------|-------|
| name | String | Yes | | |
| email | String | Yes | | |
| institution | String | No | | |
| subject | String | Yes | | |
| message | String | Yes | | |
| receivedAt | Date | Yes | | |
| ipAddress | String | No | | For rate limiting |
| isRead | Boolean | No | | |
| createdAt | Date | Yes | | timestamps |

## Relationships summary

```
Person ──< selectedPublications >── Publication
Person ──< researchInterests >── ResearchTheme
Person ──< team >── Project

Publication ──< relatedPeople >── Person
Publication ──< researchTags >── ResearchTheme
Publication ──< relatedProject >── Project

Project ──< researchTheme >── ResearchTheme
Project ──< relatedPublications >── Publication
Project ──< team >── Person
```

## Indexes

| Collection | Fields | Type |
|------------|--------|------|
| User | email | unique |
| ResearchTheme | slug | unique |
| ResearchTheme | featured | |
| Person | role | |
| Person | status | |
| Person | order | |
| Publication | year | |
| Publication | status | |
| Publication | featured | |
| Publication | type | |
| Project | status | |
| Project | featured | |
| Opportunity | status | |
| News | publishedAt | |
| News | featured | |
| ContactInquiry | receivedAt | |
| ContactInquiry | email | |

## Validation rules

- Required fields enforced at schema level
- Enum fields constrained to allowed values
- Email format validated on User and ContactInquiry
- DOI format validated on Publication (when present)
- URL format validated on website/social fields
- File MIME type and size validated on Media uploads
- All validation occurs on the server before persistence

## Error handling

- Database errors caught and converted to structured API responses
- Connection failures return 503
- Validation failures return 400 with field-specific messages
- Not found returns 404
- Unauthorized returns 401/403
