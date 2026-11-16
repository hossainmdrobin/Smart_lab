import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

import { dbConnect } from "@/src/lib/db/connect";
import { hashPassword } from "@/src/lib/auth/password";
import { User, type UserRole } from "@/src/models/User";
import { ResearchTheme } from "@/src/models/ResearchTheme";
import { Person } from "@/src/models/Person";
import { Publication, type PublicationType, type PublicationStatus } from "@/src/models/Publication";
import { Project, type ProjectStatus } from "@/src/models/Project";

const DEFAULT_DATA_PATH = "seed-data.json";
const DEFAULT_RESULTS_PATH = "seed-run-results.json";

function slugifyKebab(input: string): string {
  return input
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

const SeedSchema = z.object({
  wipe: z.boolean().optional().default(false),
  users: z
    .array(
      z.object({
        email: z.string().email().transform((v) => v.toLowerCase()),
        role: z.enum(["admin", "editor"]).transform((v) => v as UserRole),
        name: z.string().min(1),
        isActive: z.boolean().optional().default(true),
        password: z.string().min(1),
      }),
    )
    .optional()
    .default([]),
  researchThemes: z
    .array(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1).optional(),
        description: z.string().optional(),
        featured: z.boolean().optional().default(false),
        order: z.number().optional().default(0),
      }),
    )
    .optional()
    .default([]),
  people: z
    .array(
      z.object({
        fullName: z.string().min(1),
        role: z.string().min(1),
        status: z.enum(["current", "alumni"]),
        bio: z.string().optional(),
        email: z.string().email().optional(),
        researchInterests: z.array(z.string()).optional().default([]),
        order: z.number().optional().default(0),
      }),
    )
    .optional()
    .default([]),
  publications: z
    .array(
      z.object({
        title: z.string().min(1),
        authors: z.array(z.string()).min(1),
        journal: z.string().min(1),
        year: z.number().int().min(1900),
        type: z.enum(["journal-article", "review", "preprint", "other"]).transform((v) => v as PublicationType),
        status: z.enum(["draft", "published", "archived"]).transform((v) => v as PublicationStatus),
        researchTags: z.array(z.string()).optional().default([]),
        abstract: z.string().optional(),
        featured: z.boolean().optional().default(false),
      }),
    )
    .optional()
    .default([]),
  projects: z
    .array(
      z.object({
        title: z.string().min(1),
        summary: z.string().min(1),
        researchTheme: z.array(z.string()).optional().default([]),
        status: z.enum(["ongoing", "completed", "draft"]).transform((v) => v as ProjectStatus),
        methods: z.string().optional(),
        team: z.array(z.string()).optional().default([]),
        featured: z.boolean().optional().default(false),
      }),
    )
    .optional()
    .default([]),
});

async function readSeedData(filePath: string) {
  const raw = await fs.readFile(filePath, { encoding: "utf-8" });
  const parsed = JSON.parse(raw) as unknown;
  return SeedSchema.parse(parsed);
}

async function wipeByIdentity(params: {
  userEmails: string[];
  themeSlugs: string[];
  placeholderTitlePrefix?: string;
}) {
  // Default behavior: wipe only by identity keys provided in the JSON file.
  // If titles are needed for People/Publications/Projects, they should be encoded in JSON too.
  // This keeps the seeder non-destructive by default.
  if (params.userEmails.length > 0) {
    await User.deleteMany({ email: { $in: params.userEmails } }).exec();
  }
  if (params.themeSlugs.length > 0) {
    await ResearchTheme.deleteMany({ slug: { $in: params.themeSlugs } }).exec();
  }
  if (params.placeholderTitlePrefix) {
    const regex = `^${params.placeholderTitlePrefix}`;
    await Person.deleteMany({ fullName: { $regex: regex } }).exec();
    await Publication.deleteMany({ title: { $regex: regex } }).exec();
    await Project.deleteMany({ title: { $regex: regex } }).exec();
  }
}

async function upsertUser(doc: {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  isActive: boolean;
}): Promise<{ created: boolean }> {
  const existing = await User.findOne({ email: doc.email }).exec();
  if (!existing) {
    const passwordHash = await hashPassword(doc.password);
    await User.create({
      email: doc.email,
      passwordHash,
      role: doc.role,
      name: doc.name,
      isActive: doc.isActive,
    });
    return { created: true };
  }

  const passwordHash = await hashPassword(doc.password);
  await User.updateOne(
    { _id: existing._id },
    {
      $set: {
        role: doc.role,
        name: doc.name,
        isActive: doc.isActive,
        passwordHash,
      },
    },
  ).exec();
  return { created: false };
}

async function upsertResearchTheme(doc: {
  name: string;
  slug?: string;
  description?: string;
  featured: boolean;
  order: number;
}): Promise<{ slug: string; id: string }> {
  const slug = (doc.slug ?? slugifyKebab(doc.name)).toLowerCase();
  const existing = await ResearchTheme.findOne({ slug }).exec();

  if (existing) {
    await ResearchTheme.updateOne(
      { _id: existing._id },
      {
        $set: {
          name: doc.name,
          slug,
          description: doc.description,
          featured: doc.featured,
          order: doc.order,
        },
      },
    ).exec();
    return { slug, id: String(existing._id) };
  }

  const created = await ResearchTheme.create({
    name: doc.name,
    slug,
    description: doc.description,
    featured: doc.featured,
    order: doc.order,
  });

  return { slug, id: String(created._id) };
}

async function upsertPerson(params: {
  doc: {
    fullName: string;
    role: string;
    status: "current" | "alumni";
    bio?: string;
    email?: string;
    researchInterests: string[];
    order: number;
  };
  themeIdBySlug: Map<string, string>;
}): Promise<{ created: boolean }> {
  const uniqueQuery = params.doc.email
    ? { email: params.doc.email }
    : { fullName: params.doc.fullName, role: params.doc.role, status: params.doc.status };

  const existing = await Person.findOne(uniqueQuery).exec();

  const researchInterests = params.doc.researchInterests
    .map((slug) => params.themeIdBySlug.get(slug))
    .filter((id): id is string => Boolean(id));

  const payload = {
    fullName: params.doc.fullName,
    role: params.doc.role,
    status: params.doc.status,
    bio: params.doc.bio,
    email: params.doc.email,
    researchInterests: researchInterests.map((id) => id),
    order: params.doc.order,
  };

  if (!existing) {
    await Person.create(payload);
    return { created: true };
  }

  await Person.updateOne({ _id: existing._id }, { $set: payload }).exec();
  return { created: false };
}

async function upsertPublication(params: {
  doc: {
    title: string;
    authors: string[];
    journal: string;
    year: number;
    type: PublicationType;
    status: PublicationStatus;
    researchTags: string[];
    abstract?: string;
    featured: boolean;
  };
  themeIdBySlug: Map<string, string>;
}): Promise<{ created: boolean }> {
  const existing = await Publication.findOne({
    title: params.doc.title,
    year: params.doc.year,
    type: params.doc.type,
    status: params.doc.status,
  }).exec();

  const researchTags = params.doc.researchTags
    .map((slug) => params.themeIdBySlug.get(slug))
    .filter((id): id is string => Boolean(id));

  const featuredAt = params.doc.featured ? new Date() : undefined;

  const payload = {
    title: params.doc.title,
    authors: params.doc.authors,
    journal: params.doc.journal,
    year: params.doc.year,
    type: params.doc.type,
    status: params.doc.status,
    researchTags: researchTags.map((id) => id),
    abstract: params.doc.abstract,
    featured: params.doc.featured,
    featuredAt,
  };

  if (!existing) {
    await Publication.create(payload);
    return { created: true };
  }

  await Publication.updateOne({ _id: existing._id }, { $set: payload }).exec();
  return { created: false };
}

async function upsertProject(params: {
  doc: {
    title: string;
    summary: string;
    researchTheme: string[];
    status: ProjectStatus;
    methods?: string;
    team: string[];
    featured: boolean;
  };
  themeIdBySlug: Map<string, string>;
}): Promise<{ created: boolean }> {
  const existing = await Project.findOne({ title: params.doc.title, status: params.doc.status }).exec();

  const researchTheme = params.doc.researchTheme
    .map((slug) => params.themeIdBySlug.get(slug))
    .filter((id): id is string => Boolean(id));

  const payload = {
    title: params.doc.title,
    summary: params.doc.summary,
    researchTheme: researchTheme.map((id) => id),
    status: params.doc.status,
    methods: params.doc.methods,
    team: [],
    relatedPublications: [],
    featured: params.doc.featured,
  };

  if (!existing) {
    await Project.create(payload);
    return { created: true };
  }

  await Project.updateOne({ _id: existing._id }, { $set: payload }).exec();
  return { created: false };
}

async function main() {
  const dataPath = path.resolve(process.cwd(), DEFAULT_DATA_PATH);
  const resultsPath = path.resolve(process.cwd(), DEFAULT_RESULTS_PATH);

  const seedData = await readSeedData(dataPath);

  await dbConnect();

  const themeSlugs = seedData.researchThemes.map((t) => {
    const slug = (t.slug ?? slugifyKebab(t.name)).toLowerCase();
    return slug;
  });
  const userEmails = seedData.users.map((u) => u.email);

  // Wipe only by identity keys present in JSON.
  if (seedData.wipe) {
    await wipeByIdentity({
      userEmails,
      themeSlugs,
    });
  }

  let createdUsers = 0;
  let updatedUsers = 0;
  for (const u of seedData.users) {
    const res = await upsertUser(u);
    if (res.created) createdUsers++;
    else updatedUsers++;
  }

  let createdThemes = 0;
  let updatedThemes = 0;
  const themeIdBySlug = new Map<string, string>();
  for (const t of seedData.researchThemes) {
    const before = await ResearchTheme.findOne({
      slug: (t.slug ?? slugifyKebab(t.name)).toLowerCase(),
    })
      .select("_id")
      .lean()
      .exec();

    const { slug, id } = await upsertResearchTheme(t);
    themeIdBySlug.set(slug, id);
    if (before) updatedThemes++;
    else createdThemes++;
  }

  let createdPeople = 0;
  let updatedPeople = 0;
  for (const p of seedData.people) {
    const res = await upsertPerson({ doc: p, themeIdBySlug });
    if (res.created) createdPeople++;
    else updatedPeople++;
  }

  let createdPublications = 0;
  let updatedPublications = 0;
  for (const pub of seedData.publications) {
    const res = await upsertPublication({ doc: pub, themeIdBySlug });
    if (res.created) createdPublications++;
    else updatedPublications++;
  }

  let createdProjects = 0;
  let updatedProjects = 0;
  for (const proj of seedData.projects) {
    const res = await upsertProject({ doc: proj, themeIdBySlug });
    if (res.created) createdProjects++;
    else updatedProjects++;
  }

  const results = {
    inputFile: DEFAULT_DATA_PATH,
    wipe: seedData.wipe,
    counts: {
      users: { created: createdUsers, updated: updatedUsers },
      researchThemes: { created: createdThemes, updated: updatedThemes },
      people: { created: createdPeople, updated: updatedPeople },
      publications: { created: createdPublications, updated: updatedPublications },
      projects: { created: createdProjects, updated: updatedProjects },
    },
    at: new Date().toISOString(),
  };

  await fs.writeFile(resultsPath, JSON.stringify(results, null, 2), {
    encoding: "utf-8",
  });

  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  const message = err instanceof Error ? err.message : String(err);
  const payload = { error: { code: "SEED_FAILED", message } };
  console.error(JSON.stringify(payload, null, 2));
  process.exitCode = 1;
});
