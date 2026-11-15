import { dbConnect } from "@/src/lib/db/connect";
import { Publication, type IPublication, type PublicationType } from "@/src/models/Publication";
import { Project, type IProject } from "@/src/models/Project";
import { Person, type IPerson } from "@/src/models/Person";
import { Setting, type ISetting } from "@/src/models/Setting";
import type { Types } from "mongoose";

export interface HomepageSettings {
  contactEmail: string | null;
  privacyPolicyLabel: string;
  privacyPolicyHref: string | null;
  socialLinks: Array<{ label: string; href: string }>; // validated URLs only
}

export interface FeaturedPublication {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi?: string;
  publisherUrl?: string;
  type: PublicationType;
  figure?: {
    id: string;
    url: string;
    altText?: string;
  } | null;
}

export interface FeaturedProject {
  id: string;
  title: string;
  summary: string;
  researchThemeNames: string[];
  status: string;
  image?: {
    id: string;
    url: string;
    altText?: string;
  } | null;
}

export interface SelectedPerson {
  id: string;
  fullName: string;
  role: string;
  photo?: {
    id: string;
    url: string;
    altText?: string;
  } | null;
  status: string;
}

function safeString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function safeUrl(value: unknown): string | null {
  const str = safeString(value);
  if (!str) return null;
  try {
    const url = new URL(str);
    return url.toString();
  } catch {
    return null;
  }
}

function parseSocialLinks(
  value: unknown,
): Array<{ label: string; href: string }> {
  if (!value || typeof value !== "object") return [];
  const obj = value as Record<string, unknown>;
  const links: Array<{ label: string; href: string }> = [];

  const pushIfValid = (label: string, href: unknown) => {
    const url = safeUrl(href);
    if (!url) return;
    links.push({ label, href: url });
  };

  // Expected common keys: twitter, linkedin, github, scholar, website.
  // Unknown keys are ignored.
  pushIfValid("Twitter/X", obj.twitter);
  pushIfValid("LinkedIn", obj.linkedin);
  pushIfValid("GitHub", obj.github);
  pushIfValid("Google Scholar", obj.scholar);
  pushIfValid("Website", obj.website);

  return links;
}

export async function getHomepageData(): Promise<{
  settings: HomepageSettings;
  featuredPublications: FeaturedPublication[];
  featuredProjects: FeaturedProject[];
  selectedPeople: SelectedPerson[];
}> {
  try {
    await dbConnect();
  } catch {
    return {
      settings: {
        contactEmail: null,
        privacyPolicyLabel: "Privacy Policy (pending)",
        privacyPolicyHref: null,
        socialLinks: [],
      },
      featuredPublications: [],
      featuredProjects: [],
      selectedPeople: [],
    };
  }

  type SettingLean = Pick<ISetting, "key" | "value">;

  type PublicationFigureLean = {
    _id: Types.ObjectId;
    url: string;
    altText?: string;
  };

  type PublicationLean = Pick<
    IPublication,
    | "title"
    | "authors"
    | "journal"
    | "year"
    | "doi"
    | "publisherUrl"
    | "type"
  > & {
    _id: Types.ObjectId;
    figure?: PublicationFigureLean | null;
  };

  type ProjectImageLean = {
    _id: Types.ObjectId;
    url: string;
    altText?: string;
  };

  type ResearchThemeLean = { name: string };

  type ProjectLean = Pick<IProject, "title" | "summary" | "status"> & {
    _id: Types.ObjectId;
    researchTheme: ResearchThemeLean[];
    image?: ProjectImageLean | null;
  };

  type PersonPhotoLean = {
    _id: Types.ObjectId;
    url: string;
    altText?: string;
  };

  type PersonLean = Pick<IPerson, "fullName" | "role" | "status"> & {
    _id: Types.ObjectId;
    photo?: PersonPhotoLean | null;
  };

  const [settingsDocs, publications, projects, people] = await Promise.all([
    (await Setting.find({
      key: { $in: ["contactEmail", "privacyPolicyUrl", "socialLinks"] },
    })
      .select("key value")
      .lean()
      .exec()) as unknown as SettingLean[],
    (await Publication.find({
      status: "published",
      featured: true,
      isDeleted: { $ne: true },
    })
      .select(
        "title authors journal year doi publisherUrl type figure featuredAt",
      )
      .sort({ featuredAt: -1, updatedAt: -1 })
      .limit(3)
      .populate({
        path: "figure",
        select: "url altText",
      })
      .lean()
      .exec()) as unknown as PublicationLean[],
    (await Project.find({
      status: { $in: ["ongoing", "completed"] },
      featured: true,
      isDeleted: { $ne: true },
    })
      .select("title summary status researchTheme image")
      .sort({ updatedAt: -1 })
      .limit(3)
      .populate({
        path: "researchTheme",
        select: "name",
      })
      .populate({
        path: "image",
        select: "url altText",
      })
      .lean()
      .exec()) as unknown as ProjectLean[],
    (await Person.find({
      status: "current",
      isDeleted: { $ne: true },
    })
      .select("fullName role status photo")
      .sort({ order: 1 })
      .limit(4)
      .populate({
        path: "photo",
        select: "url altText",
      })
      .lean()
      .exec()) as unknown as PersonLean[],
  ]);

  const settingsByKey = new Map(
    settingsDocs.map((s) => [s.key, s] as const),
  );

  const contactEmail = safeString(settingsByKey.get("contactEmail")?.value);
  const privacyPolicyUrl = safeUrl(
    settingsByKey.get("privacyPolicyUrl")?.value,
  );
  const socialLinks = parseSocialLinks(settingsByKey.get("socialLinks")?.value);

  const featuredPublications: FeaturedPublication[] = publications.map((p) => {
    const doi = p.doi ? safeString(p.doi) ?? undefined : undefined;
    const publisherUrl = p.publisherUrl
      ? safeUrl(p.publisherUrl) ?? undefined
      : undefined;

    return {
      id: String(p._id),
      title: p.title,
      authors: p.authors,
      journal: p.journal,
      year: p.year,
      doi,
      publisherUrl,
      type: p.type,
      figure: p.figure
        ? {
            id: String(p.figure._id),
            url: p.figure.url,
            altText: p.figure.altText ?? undefined,
          }
        : null,
    };
  });

  const featuredProjects: FeaturedProject[] = projects.map((proj) => {
    return {
      id: String(proj._id),
      title: proj.title,
      summary: proj.summary,
      researchThemeNames: Array.isArray(proj.researchTheme)
        ? proj.researchTheme
            .map((t) => safeString(t.name))
            .filter((name): name is string => Boolean(name))
        : [],
      status: proj.status,
      image: proj.image
        ? {
            id: String(proj.image._id),
            url: proj.image.url,
            altText: proj.image.altText ?? undefined,
          }
        : null,
    };
  });

  const selectedPeople: SelectedPerson[] = people.map((person) => {
    return {
      id: String(person._id),
      fullName: person.fullName,
      role: person.role,
      status: person.status,
      photo: person.photo
        ? {
            id: String(person.photo._id),
            url: person.photo.url,
            altText: person.photo.altText ?? undefined,
          }
        : null,
    };
  });

  return {
    settings: {
      contactEmail,
      privacyPolicyLabel: privacyPolicyUrl ? "Privacy Policy" : "Privacy Policy (pending)",
      privacyPolicyHref: privacyPolicyUrl,
      socialLinks,
    },
    featuredPublications,
    featuredProjects,
    selectedPeople,
  };
}
