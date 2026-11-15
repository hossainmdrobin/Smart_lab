import { dbConnect } from "@/src/lib/db/connect";
import { hashPassword } from "@/src/lib/auth/password";
import { User, type UserRole } from "@/src/models/User";
import { ResearchTheme } from "@/src/models/ResearchTheme";
import { Person } from "@/src/models/Person";
import { Publication, type PublicationType } from "@/src/models/Publication";
import { Project, type ProjectStatus } from "@/src/models/Project";

type SeedScope = "draft-safe" | "user-only" | "public-samples";

type ParsedArgs = {
  adminEmail?: string;
  adminPassword?: string;
  editorEmail?: string;
  editorPassword?: string;
  seedScope: SeedScope;
  year: number;
  wipe: boolean;
};

const SEED_TITLE_PREFIX = "Seed Placeholder -";

function parseArgs(argv: string[]): ParsedArgs {
  const args: ParsedArgs = {
    seedScope: "draft-safe",
    year: 2000,
    wipe: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;

    const key = token.slice(2);
    const next = argv[i + 1];

    switch (key) {
      case "admin-email": {
        if (typeof next === "string") args.adminEmail = next;
        i++;
        break;
      }
      case "admin-password": {
        if (typeof next === "string") args.adminPassword = next;
        i++;
        break;
      }
      case "editor-email": {
        if (typeof next === "string") args.editorEmail = next;
        i++;
        break;
      }
      case "editor-password": {
        if (typeof next === "string") args.editorPassword = next;
        i++;
        break;
      }
      case "seed-scope": {
        if (typeof next === "string") {
          const value = next as SeedScope;
          if (value === "draft-safe" || value === "user-only" || value === "public-samples") {
            args.seedScope = value;
          }
        }
        i++;
        break;
      }
      case "year": {
        if (typeof next === "string") {
          const num = Number(next);
          if (Number.isFinite(num)) args.year = num;
        }
        i++;
        break;
      }
      case "wipe": {
        args.wipe = true;
        break;
      }
      default:
        break;
    }
  }

  return args;
}

function requireEnvOrArg(label: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required value: ${label}. Provide it via CLI arg or .env.local.`);
  }
  return value;
}

function slugifyKebab(input: string): string {
  return input
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

async function wipeSeededData(params: {
  userEmails: string[];
  themeSlugs: string[];
}): Promise<void> {
  // Identity keys are deterministic conventions used by this CLI.
  await User.deleteMany({ email: { $in: params.userEmails } }).exec();
  await ResearchTheme.deleteMany({ slug: { $in: params.themeSlugs } }).exec();
  await Person.deleteMany({ fullName: { $regex: `^${SEED_TITLE_PREFIX}` } }).exec();
  await Publication.deleteMany({ title: { $regex: `^${SEED_TITLE_PREFIX}` } }).exec();
  await Project.deleteMany({ title: { $regex: `^${SEED_TITLE_PREFIX}` } }).exec();
}

async function seedUsers(params: {
  adminEmail: string;
  adminPassword: string;
  editorEmail?: string;
  editorPassword?: string;
}): Promise<{ created: number; updated: number }> {
  const users: Array<{ email: string; password: string; role: UserRole }> = [
    { email: params.adminEmail, password: params.adminPassword, role: "admin" },
  ];

  if (params.editorEmail) {
    users.push({
      email: params.editorEmail,
      password: params.editorPassword ?? params.adminPassword,
      role: "editor",
    });
  }

  let created = 0;
  let updated = 0;

  for (const u of users) {
    const existing = await User.findOne({ email: u.email }).exec();
    if (existing) {
      await User.updateOne(
        { _id: existing._id },
        { $set: { role: u.role, isActive: true } },
      ).exec();
      updated++;
      continue;
    }

    const passwordHash = await hashPassword(u.password);
    await User.create({
      email: u.email,
      passwordHash,
      role: u.role,
      name: u.role === "admin" ? "CMS Seed Admin" : "CMS Seed Editor",
      isActive: true,
    });
    created++;
  }

  return { created, updated };
}

async function seedResearchThemes(): Promise<{
  created: number;
  updated: number;
  themeIds: string[];
}> {
  const themes = [
    {
      name: "Computational Drug Design",
      order: 0,
      description:
        "Content pending. Replace with laboratory-approved description before launch.",
    },
    {
      name: "Density Functional Theory (DFT)",
      order: 1,
      description:
        "Content pending. Replace with laboratory-approved description before launch.",
    },
    {
      name: "Molecular Docking",
      order: 2,
      description:
        "Content pending. Replace with laboratory-approved description before launch.",
    },
    {
      name: "Molecular Dynamics Simulation",
      order: 3,
      description:
        "Content pending. Replace with laboratory-approved description before launch.",
    },
    {
      name: "Network Pharmacology",
      order: 4,
      description:
        "Content pending. Replace with laboratory-approved description before launch.",
    },
    {
      name: "Machine Learning",
      order: 5,
      description:
        "Content pending. Replace with laboratory-approved description before launch.",
    },
    {
      name: "Artificial Intelligence in Drug Discovery",
      order: 6,
      description:
        "Content pending. Replace with laboratory-approved description before launch.",
    },
  ];

  let created = 0;
  let updated = 0;
  const themeIds: string[] = [];

  for (const t of themes) {
    const slug = slugifyKebab(t.name);
    const existing = await ResearchTheme.findOne({ slug }).exec();

    if (existing) {
      await ResearchTheme.updateOne(
        { _id: existing._id },
        {
          $set: {
            name: t.name,
            description: t.description,
            featured: false,
            order: t.order,
          },
        },
      ).exec();
      updated++;
      themeIds.push(String(existing._id));
      continue;
    }

    const doc = await ResearchTheme.create({
      name: t.name,
      slug,
      description: t.description,
      featured: false,
      order: t.order,
    });
    created++;
    themeIds.push(String(doc._id));
  }

  return { created, updated, themeIds };
}

async function seedPeople(params: {
  themeIds: string[];
  status: "current" | "alumni";
}): Promise<{ created: number; updated: number }> {
  const roles = [
    "leadership",
    "research-associate",
    "research-assistant",
    "student-trainee",
    "collaborator",
    "alumni",
  ] as const;

  let created = 0;
  let updated = 0;

  const fallbackThemeId = params.themeIds[0];
  if (!fallbackThemeId) return { created: 0, updated: 0 };

  for (const role of roles) {
    const email = `seed-placeholder-${slugifyKebab(role)}@seed.example`;
    const fullName = `${SEED_TITLE_PREFIX}${role} Member`;

    const existing = await Person.findOne({ email }).exec();
    if (existing) {
      await Person.updateOne(
        { _id: existing._id },
        {
          $set: {
            fullName,
            role,
            status: params.status,
            bio: "Content pending. Replace with laboratory-approved information before launch.",
            email,
            researchInterests: [fallbackThemeId],
            order: existing.order ?? 0,
          },
        },
      ).exec();
      updated++;
      continue;
    }

    await Person.create({
      fullName,
      role,
      status: params.status,
      bio: "Content pending. Replace with laboratory-approved information before launch.",
      email,
      researchInterests: [fallbackThemeId],
      order: 0,
    });
    created++;
  }

  return { created, updated };
}

async function seedPublications(params: {
  themeIds: string[];
  status: "draft" | "published";
  featured: boolean;
  year: number;
}): Promise<{ created: number; updated: number }> {
  const type: PublicationType = "journal-article";
  let created = 0;
  let updated = 0;

  const themeDocs = await ResearchTheme.find({ _id: { $in: params.themeIds } })
    .select("name")
    .lean()
    .exec();

  for (const t of themeDocs) {
    const title = `${SEED_TITLE_PREFIX}${t.name} Publication`;
    const existing = await Publication.findOne({
      title,
      year: params.year,
      type,
      status: params.status,
    }).exec();

    if (existing) {
      await Publication.updateOne(
        { _id: existing._id },
        {
          $set: {
            authors: ["Seed Placeholder Author"],
            journal: "Journal (pending)",
            researchTags: [String(t._id)],
            featured: params.featured,
            featuredAt: params.featured ? new Date() : undefined,
          },
        },
      ).exec();
      updated++;
      continue;
    }

    await Publication.create({
      title,
      authors: ["Seed Placeholder Author"],
      journal: "Journal (pending)",
      year: params.year,
      type,
      status: params.status,
      researchTags: [String(t._id)],
      featured: params.featured,
      featuredAt: params.featured ? new Date() : undefined,
    });
    created++;
  }

  return { created, updated };
}

async function seedProjects(params: {
  themeIds: string[];
  status: ProjectStatus;
  featured: boolean;
}): Promise<{ created: number; updated: number }> {
  let created = 0;
  let updated = 0;

  const themeDocs = await ResearchTheme.find({ _id: { $in: params.themeIds } })
    .select("name")
    .lean()
    .exec();

  for (const t of themeDocs) {
    const title = `${SEED_TITLE_PREFIX}${t.name} Project`;
    const existing = await Project.findOne({ title, status: params.status }).exec();

    if (existing) {
      await Project.updateOne(
        { _id: existing._id },
        {
          $set: {
            summary: "Content pending. Replace with laboratory-approved project summary.",
            methods: "Content pending. Replace with laboratory-approved methods.",
            researchTheme: [String(t._id)],
            featured: params.featured,
          },
        },
      ).exec();
      updated++;
      continue;
    }

    await Project.create({
      title,
      summary: "Content pending. Replace with laboratory-approved project summary.",
      methods: "Content pending. Replace with laboratory-approved methods.",
      researchTheme: [String(t._id)],
      status: params.status,
      team: [],
      featured: params.featured,
    });
    created++;
  }

  return { created, updated };
}

async function main() {
  const parsed = parseArgs(process.argv.slice(2));

  const adminEmail = requireEnvOrArg(
    "SEED_ADMIN_EMAIL",
    parsed.adminEmail ?? process.env.SEED_ADMIN_EMAIL,
  ).toLowerCase();
  const adminPassword = requireEnvOrArg(
    "SEED_ADMIN_PASSWORD",
    parsed.adminPassword ?? process.env.SEED_ADMIN_PASSWORD,
  );

  const editorEmailRaw = parsed.editorEmail ?? process.env.SEED_EDITOR_EMAIL;
  const editorEmail = editorEmailRaw ? editorEmailRaw.toLowerCase() : undefined;
  const editorPassword = parsed.editorPassword ?? process.env.SEED_EDITOR_PASSWORD;

  const yearNum = Number(parsed.year);
  if (!Number.isFinite(yearNum) || yearNum < 1900) {
    throw new Error("--year must be a valid number (>= 1900)."
    );
  }

  const themeNames = [
    "Computational Drug Design",
    "Density Functional Theory (DFT)",
    "Molecular Docking",
    "Molecular Dynamics Simulation",
    "Network Pharmacology",
    "Machine Learning",
    "Artificial Intelligence in Drug Discovery",
  ];
  const themeSlugs = themeNames.map(slugifyKebab);

  await dbConnect();

  if (parsed.wipe) {
    await wipeSeededData({
      userEmails: [adminEmail, editorEmail].filter(
        (v): v is string => Boolean(v),
      ),
      themeSlugs,
    });
  }

  const userCounts = await seedUsers({
    adminEmail,
    adminPassword,
    editorEmail,
    editorPassword,
  });

  if (parsed.seedScope === "user-only") {
    // Nothing else to seed.
    console.log(
      JSON.stringify(
        {
          scope: parsed.seedScope,
          users: userCounts,
        },
        null,
        2,
      ),
    );
    return;
  }

  const themes = await seedResearchThemes();

  const isPublicSamples = parsed.seedScope === "public-samples";
  const peopleStatus = isPublicSamples ? "current" : "alumni";
  const publicationsStatus = isPublicSamples ? "published" : "draft";
  const publicationsFeatured = isPublicSamples;
  const projectsStatus: ProjectStatus = isPublicSamples ? "ongoing" : "draft";
  const projectsFeatured = isPublicSamples;

  const peopleCounts = await seedPeople({
    themeIds: themes.themeIds,
    status: peopleStatus,
  });
  const publicationCounts = await seedPublications({
    themeIds: themes.themeIds,
    status: publicationsStatus,
    featured: publicationsFeatured,
    year: yearNum,
  });
  const projectCounts = await seedProjects({
    themeIds: themes.themeIds,
    status: projectsStatus,
    featured: projectsFeatured,
  });

  console.log(
    JSON.stringify(
      {
        scope: parsed.seedScope,
        users: userCounts,
        researchThemes: themes,
        people: peopleCounts,
        publications: publicationCounts,
        projects: projectCounts,
      },
      null,
      2,
    ),
  );

  const themeCount = await ResearchTheme.countDocuments({
    slug: { $in: themeSlugs },
  });
  if (themeCount !== themeSlugs.length) {
    throw new Error(
      `Theme seed verification failed: expected ${themeSlugs.length} themes, found ${themeCount}`,
    );
  }

  const userActiveCount = await User.countDocuments({
    email: { $in: [adminEmail, editorEmail].filter((v): v is string => Boolean(v)) },
    isActive: true,
  });
  if (userActiveCount < 1) {
    throw new Error("User seed verification failed: no active users found.");
  }
}

main().catch((err) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(JSON.stringify({ error: { code: "SEED_FAILED", message } }, null, 2));
  process.exitCode = 1;
});
