# API Documentation

## Source of truth

`docs/CLIENT_REQUIREMENTS.md` is the authoritative requirements document. This API documentation is an implementation recommendation derived from those requirements. All endpoints, request/response formats, and authentication details are proposed and subject to client approval.

## Base URL

Production: `https://www.laboratory-of-algorithmic-life-sciences.example.com` (placeholder — confirm domain with client)
Staging: staging environment URL to be confirmed
Local development: `http://localhost:3000`

All API routes are under `/api/`.

## Authentication

### Session-based authentication

- HTTP-only cookie: `session` (JWT access token)
- Refresh token: HTTP-only cookie: `refresh_token`
- Tokens never exposed to client-side JavaScript
- Session validated on every protected request

### Endpoints

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/api/auth/login` | Authenticate user | No | — |
| POST | `/api/auth/logout` | Invalidate session | Yes | admin, editor |
| POST | `/api/auth/refresh` | Rotate access token | No (refresh cookie) | — |
| GET | `/api/auth/session` | Get current user session | Yes | admin, editor |

### Login request

```json
{
  "email": "string (required, email format)",
  "password": "string (required)"
}
```

### Login response (success)

```json
{
  "data": {
    "user": {
      "id": "ObjectId",
      "email": "string",
      "name": "string",
      "role": "admin | editor"
    }
  }
}
```

### Login response (error)

```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

## People API

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/people` | List people (public: current only; CMS: all) | No (public) / Yes (CMS) | — / admin, editor |
| GET | `/api/people/[id]` | Get person detail | No | — |
| POST | `/api/people` | Create person | Yes | admin, editor |
| PUT | `/api/people/[id]` | Update person | Yes | admin, editor |
| DELETE | `/api/people/[id]` | Soft delete person | Yes | admin, editor |

### List query parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | `current` \| `alumni` (default: current for public) |
| role | string | Filter by laboratory role |
| researchTheme | ObjectId | Filter by research interest |
| order | string | `asc` \| `desc` (default: asc by order field) |
| limit | number | Page size (default: 20) |
| offset | number | Pagination offset |

### Create/update person request

```json
{
  "fullName": "string (required)",
  "role": "leadership | research-associate | research-assistant | student-trainee | collaborator | alumni (required)",
  "status": "current | alumni (required)",
  "bio": "string (optional)",
  "researchInterests": ["ObjectId (optional)"],
  "education": "string (optional)",
  "email": "string (optional, email format)",
  "orcid": "string (optional)",
  "googleScholar": "string (optional, URL)",
  "github": "string (optional, URL)",
  "personalWebsite": "string (optional, URL)",
  "photo": "ObjectId (optional, references Media)",
  "cv": "ObjectId (optional, references Media)",
  "selectedPublications": ["ObjectId (optional)"],
  "order": "number (optional)"
}
```

### Response (person)

```json
{
  "data": {
    "id": "ObjectId",
    "fullName": "string",
    "role": "string",
    "status": "string",
    "bio": "string | null",
    "researchInterests": ["ObjectId"],
    "education": "string | null",
    "email": "string | null",
    "orcid": "string | null",
    "googleScholar": "string | null",
    "github": "string | null",
    "personalWebsite": "string | null",
    "photo": "ObjectId | null",
    "cv": "ObjectId | null",
    "selectedPublications": ["ObjectId"],
    "order": "number",
    "createdAt": "ISO string",
    "updatedAt": "ISO string"
  }
}
```

## Publications API

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/publications` | List publications | No | — |
| GET | `/api/publications/[id]` | Get publication detail | No | — |
| POST | `/api/publications` | Create publication | Yes | admin, editor |
| PUT | `/api/publications/[id]` | Update publication | Yes | admin, editor |
| DELETE | `/api/publications/[id]` | Soft delete publication | Yes | admin, editor |

### List query parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | `draft` \| `published` \| `archived` (default: published for public) |
| year | number | Filter by publication year |
| researchTheme | ObjectId | Filter by research tag |
| type | string | `journal-article` \| `review` \| `preprint` \| `other` |
| featured | boolean | Filter featured only |
| search | string | Title/author search |
| sort | string | `newest` \| `oldest` (default: newest) |
| limit | number | Page size (default: 20) |
| offset | number | Pagination offset |

### Create/update publication request

```json
{
  "title": "string (required)",
  "authors": ["string (required)"],
  "journal": "string (required)",
  "year": "number (required)",
  "volume": "string (optional)",
  "issue": "string (optional)",
  "pages": "string (optional)",
  "doi": "string (optional, DOI format)",
  "publisherUrl": "string (optional, URL)",
  "type": "journal-article | review | preprint | other (required)",
  "status": "draft | published | archived (required)",
  "researchTags": ["ObjectId (optional)"],
  "relatedPeople": ["ObjectId (optional)"],
  "relatedProject": "ObjectId (optional)",
  "abstract": "string (optional)",
  "figure": "ObjectId (optional, references Media)",
  "repositoryUrl": "string (optional, URL)",
  "datasetUrl": "string (optional, URL)",
  "featured": "boolean (optional)"
}
```

### Response (publication)

```json
{
  "data": {
    "id": "ObjectId",
    "title": "string",
    "authors": ["string"],
    "journal": "string",
    "year": "number",
    "volume": "string | null",
    "issue": "string | null",
    "pages": "string | null",
    "doi": "string | null",
    "publisherUrl": "string | null",
    "type": "string",
    "status": "string",
    "researchTags": ["ObjectId"],
    "relatedPeople": ["ObjectId"],
    "relatedProject": "ObjectId | null",
    "abstract": "string | null",
    "figure": "ObjectId | null",
    "repositoryUrl": "string | null",
    "datasetUrl": "string | null",
    "featured": "boolean",
    "createdAt": "ISO string",
    "updatedAt": "ISO string"
  }
}
```

## Projects API

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/projects` | List projects | No | — |
| GET | `/api/projects/[id]` | Get project detail | No | — |
| POST | `/api/projects` | Create project | Yes | admin, editor |
| PUT | `/api/projects/[id]` | Update project | Yes | admin, editor |
| DELETE | `/api/projects/[id]` | Soft delete project | Yes | admin, editor |

### List query parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | `ongoing` \| `completed` \| `draft` |
| researchTheme | ObjectId | Filter by research theme |
| featured | boolean | Filter featured only |
| limit | number | Page size (default: 20) |
| offset | number | Pagination offset |

### Create/update project request

```json
{
  "title": "string (required)",
  "summary": "string (required)",
  "researchTheme": ["ObjectId (required)"],
  "status": "ongoing | completed | draft (required)",
  "team": ["ObjectId (optional)"],
  "methods": "string (optional)",
  "relatedPublications": ["ObjectId (optional)"],
  "codeUrl": "string (optional, URL)",
  "datasetUrl": "string (optional, URL)",
  "fundingAcknowledgment": "string (optional)",
  "image": "ObjectId (optional, references Media)",
  "featured": "boolean (optional)"
}
```

## Research Themes API

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/research-themes` | List themes | No | — |
| GET | `/api/research-themes/[id]` | Get theme detail | No | — |
| POST | `/api/research-themes` | Create theme | Yes | admin, editor |
| PUT | `/api/research-themes/[id]` | Update theme | Yes | admin, editor |
| DELETE | `/api/research-themes/[id]` | Delete theme | Yes | admin |

### Create/update research theme request

```json
{
  "name": "string (required)",
  "slug": "string (required, unique)",
  "description": "string (optional)",
  "featured": "boolean (optional)",
  "order": "number (optional)"
}
```

## Opportunities API

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/opportunities` | List opportunities | No | — |
| GET | `/api/opportunities/[id]` | Get opportunity detail | No | — |
| POST | `/api/opportunities` | Create opportunity | Yes | admin, editor |
| PUT | `/api/opportunities/[id]` | Update opportunity | Yes | admin, editor |
| DELETE | `/api/opportunities/[id]` | Delete opportunity | Yes | admin, editor |

### Create/update opportunity request

```json
{
  "title": "string (required)",
  "description": "string (required)",
  "eligibility": "string (required)",
  "expectedSkills": "string (optional)",
  "location": "string (required)",
  "applicationInstructions": "string (required)",
  "deadline": "string (optional, ISO date)",
  "status": "open | closed (required)"
}
```

## Contact API

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/api/contact` | Submit inquiry | No | — |

### Contact form request

```json
{
  "name": "string (required)",
  "email": "string (required, email format)",
  "institution": "string (optional)",
  "subject": "string (required)",
  "message": "string (required)"
}
```

### Contact form response (success)

```json
{
  "data": {
    "message": "Your inquiry has been submitted successfully."
  }
}
```

### Contact form response (validation error)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": {
      "email": "Invalid email format",
      "message": "Message is required"
    }
  }
}
```

## Settings API

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/settings` | List settings | Yes | admin |
| PUT | `/api/settings/[key]` | Update setting | Yes | admin |

### Settings example

```json
{
  "siteTitle": "Laboratory of Algorithmic Life Sciences",
  "contactEmail": "info@lals.example.com",
  "siteDescription": "...",
  "socialLinks": { ... },
  "footerText": "..."
}
```

## Uploads API

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/api/uploads` | Upload image | Yes | admin, editor |

Restrictions:
- Images only (image/jpeg, image/png, image/webp, image/avif)
- Maximum file size: 5 MB
- No executable files or archives

## Error response format (all endpoints)

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": { "fieldName": "field-specific message" }
  }
}
```

### Standard error codes

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| VALIDATION_ERROR | 400 | Request validation failed |
| UNAUTHORIZED | 401 | Authentication required |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource conflict (e.g., duplicate slug) |
| TOO_MANY_REQUESTS | 429 | Rate limit exceeded |
| INTERNAL_SERVER_ERROR | 500 | Unexpected server error |
| SERVICE_UNAVAILABLE | 503 | Database connection failure |

## Rate limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/auth/login` | 5 requests | per minute per IP |
| `/api/contact` | 3 requests | per minute per IP |
| `/api/uploads` | 10 requests | per minute per user |
| CMS write endpoints | 30 requests | per minute per user |

## RTK Query integration

API slices organized by feature under `services/rtk/`:

- `peopleApi` — endpoints: `getPeople`, `getPerson`, `createPerson`, `updatePerson`, `deletePerson`
- `publicationsApi` — endpoints: `getPublications`, `getPublication`, `createPublication`, `updatePublication`, `deletePublication`
- `projectsApi` — endpoints: `getProjects`, `getProject`, `createProject`, `updateProject`, `deleteProject`
- `researchThemesApi` — endpoints: `getResearchThemes`, `getResearchTheme`, `createResearchTheme`, `updateResearchTheme`, `deleteResearchTheme`
- `opportunitiesApi` — endpoints: `getOpportunities`, `getOpportunity`, `createOpportunity`, `updateOpportunity`, `deleteOpportunity`
- `contactApi` — endpoint: `submitContact`
- `settingsApi` — endpoints: `getSettings`, `updateSetting`
- `authApi` — endpoints: `login`, `logout`, `refresh`, `getSession`

Tag types for cache invalidation: `People`, `Publications`, `Projects`, `ResearchThemes`, `Opportunities`, `Settings`.

Loading, success, and error states handled via RTK Query hooks (`isLoading`, `isError`, `data`, `error`).
