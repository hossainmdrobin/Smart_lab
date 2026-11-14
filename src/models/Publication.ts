import mongoose, { Schema, Document, Model } from "mongoose";

export type PublicationType =
  | "journal-article"
  | "review"
  | "preprint"
  | "other";

export type PublicationStatus = "draft" | "published" | "archived";

export interface IPublication extends Document {
  title: string;
  authors: string[];
  journal: string;
  year: number;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  publisherUrl?: string;
  type: PublicationType;
  status: PublicationStatus;
  researchTags: mongoose.Types.ObjectId[];
  relatedPeople: mongoose.Types.ObjectId[];
  relatedProject?: mongoose.Types.ObjectId;
  abstract?: string;
  figure?: mongoose.Types.ObjectId;
  repositoryUrl?: string;
  datasetUrl?: string;
  featured?: boolean;
  featuredAt?: Date;
  isDeleted?: boolean;
}

const PublicationSchema = new Schema<IPublication>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [500, "Title cannot exceed 500 characters"],
    },
    authors: {
      type: [String],
      required: [true, "Authors are required"],
      validate: {
        validator: (authors: string[]) => authors.length > 0,
        message: "At least one author is required",
      },
    },
    journal: {
      type: String,
      required: [true, "Journal is required"],
      trim: true,
      maxlength: [200, "Journal cannot exceed 200 characters"],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      index: true,
      min: [1900, "Year must be 1900 or later"],
      max: [new Date().getFullYear() + 1, "Year cannot be in the future"],
    },
    volume: {
      type: String,
      trim: true,
    },
    issue: {
      type: String,
      trim: true,
    },
    pages: {
      type: String,
      trim: true,
    },
    doi: {
      type: String,
      trim: true,
      match: [
        /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i,
        "DOI must be a valid DOI string (e.g. 10.1000/example)",
      ],
    },
    publisherUrl: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, "Publisher URL must be a valid URL"],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["journal-article", "review", "preprint", "other"],
      index: true,
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["draft", "published", "archived"],
      index: true,
    },
    researchTags: [
      {
        type: Schema.Types.ObjectId,
        ref: "ResearchTheme",
      },
    ],
    relatedPeople: [
      {
        type: Schema.Types.ObjectId,
        ref: "Person",
      },
    ],
    relatedProject: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
    abstract: {
      type: String,
      trim: true,
    },
    figure: {
      type: Schema.Types.ObjectId,
      ref: "Media",
    },
    repositoryUrl: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, "Repository URL must be a valid URL"],
    },
    datasetUrl: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, "Dataset URL must be a valid URL"],
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    featuredAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

PublicationSchema.index({ year: 1, status: 1 });
PublicationSchema.index({ featured: 1, status: 1 });

export const Publication: Model<IPublication> =
  (mongoose.models.Publication as Model<IPublication> | undefined) ??
  mongoose.model<IPublication>("Publication", PublicationSchema);

export default Publication;
