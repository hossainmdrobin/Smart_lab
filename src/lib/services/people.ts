import { dbConnect } from "@/src/lib/db/connect";
import { Person, type IPerson } from "@/src/models/Person";
import { Setting, type ISetting } from "@/src/models/Setting";
import type { Types } from "mongoose";

export interface PublicPerson {
  id: string;
  fullName: string;
  role: string;
  status: string;
  bio?: string;
  education?: string;
  email?: string;
  orcid?: string;
  googleScholar?: string;
  github?: string;
  personalWebsite?: string;
  photo?: {
    id: string;
    url: string;
    altText?: string;
  } | null;
  cv?: {
    id: string;
    url: string;
    altText?: string;
  } | null;
  researchInterests: Array<{ id: string; name: string; slug: string }>;
  selectedPublications: Array<{
    id: string;
    title: string;
    journal: string;
    year: number;
    doi?: string;
    publisherUrl?: string;
    type: string;
  }>;
  order: number;
}

export interface PeopleDirectoryData {
  settings: {
    contactEmail: string | null;
    privacyPolicyLabel: string;
    privacyPolicyHref: string | null;
    socialLinks: Array<{ label: string; href: string }>;
  };
  people: PublicPerson[];
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

  pushIfValid("Twitter/X", obj.twitter);
  pushIfValid("LinkedIn", obj.linkedin);
  pushIfValid("GitHub", obj.github);
  pushIfValid("Google Scholar", obj.scholar);
  pushIfValid("Website", obj.website);

  return links;
}

export async function getPeopleDirectoryData(): Promise<PeopleDirectoryData> {
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
      people: [],
    };
  }

  type SettingLean = Pick<ISetting, "key" | "value">;

  type MediaLean = {
    _id: Types.ObjectId;
    url: string;
    altText?: string;
  };

  type ResearchThemeLean = {
    _id: Types.ObjectId;
    name: string;
    slug: string;
  };

  type PublicationLean = {
    _id: Types.ObjectId;
    title: string;
    journal: string;
    year: number;
    doi?: string;
    publisherUrl?: string;
    type: string;
  };

  type PersonLean = Pick<
    IPerson,
    | "fullName"
    | "role"
    | "status"
    | "bio"
    | "education"
    | "email"
    | "orcid"
    | "googleScholar"
    | "github"
    | "personalWebsite"
    | "order"
  > & {
    _id: Types.ObjectId;
    photo?: MediaLean | null;
    cv?: MediaLean | null;
    researchInterests?: ResearchThemeLean[];
    selectedPublications?: PublicationLean[];
  };

  const [settingsDocs, personDocs] = await Promise.all([
    (await Setting.find({
      key: { $in: ["contactEmail", "privacyPolicyUrl", "socialLinks"] },
    })
      .select("key value")
      .lean()
      .exec()) as unknown as SettingLean[],
    (await Person.find({
      isDeleted: { $ne: true },
    })
      .select(
        "fullName role status bio education email orcid googleScholar github personalWebsite photo cv researchInterests selectedPublications order",
      )
      .sort({ order: 1, fullName: 1 })
      .populate({
        path: "photo",
        select: "url altText",
      })
      .populate({
        path: "cv",
        select: "url altText",
      })
      .populate({
        path: "researchInterests",
        select: "name slug",
      })
      .populate({
        path: "selectedPublications",
        select: "title journal year doi publisherUrl type",
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

  const people: PublicPerson[] = personDocs.map((p) => {
    return {
      id: String(p._id),
      fullName: p.fullName,
      role: p.role,
      status: p.status,
      bio: safeString(p.bio) ?? undefined,
      education: safeString(p.education) ?? undefined,
      email: safeString(p.email) ?? undefined,
      orcid: safeString(p.orcid) ?? undefined,
      googleScholar: safeUrl(p.googleScholar) ?? undefined,
      github: safeUrl(p.github) ?? undefined,
      personalWebsite: safeUrl(p.personalWebsite) ?? undefined,
      photo: p.photo
        ? {
            id: String(p.photo._id),
            url: p.photo.url,
            altText: p.photo.altText ?? undefined,
          }
        : null,
      cv: p.cv
        ? {
            id: String(p.cv._id),
            url: p.cv.url,
            altText: p.cv.altText ?? undefined,
          }
        : null,
      researchInterests: Array.isArray(p.researchInterests)
        ? p.researchInterests.map((ri) => ({
            id: String(ri._id),
            name: ri.name,
            slug: ri.slug,
          }))
        : [],
      selectedPublications: Array.isArray(p.selectedPublications)
        ? p.selectedPublications.map((pub) => ({
            id: String(pub._id),
            title: pub.title,
            journal: pub.journal,
            year: pub.year,
            doi: pub.doi ? safeString(pub.doi) ?? undefined : undefined,
            publisherUrl: pub.publisherUrl ? safeUrl(pub.publisherUrl) ?? undefined : undefined,
            type: pub.type,
          }))
        : [],
      order: p.order ?? 0,
    };
  });

  return {
    settings: {
      contactEmail,
      privacyPolicyLabel: privacyPolicyUrl ? "Privacy Policy" : "Privacy Policy (pending)",
      privacyPolicyHref: privacyPolicyUrl,
      socialLinks,
    },
    people,
  };
}

export async function getPersonDetailData(id: string): Promise<{
  settings: PeopleDirectoryData["settings"];
  person: PublicPerson | null;
}> {
  const { settings, people } = await getPeopleDirectoryData();
  const person = people.find((p) => p.id === id) || null;
  return { settings, person };
}
