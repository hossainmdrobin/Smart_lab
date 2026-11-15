import mongoose, { Schema, Document, Model } from "mongoose";

export interface IResearchTheme extends Document {
  name: string;
  slug: string;
  description?: string;
  featured?: boolean;
  order?: number;
}

const ResearchThemeSchema = new Schema<IResearchTheme>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [120, "Name cannot exceed 120 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must be URL-friendly (lowercase, letters, numbers, hyphens)",
      ],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const ResearchTheme: Model<IResearchTheme> =
  (mongoose.models.ResearchTheme as Model<IResearchTheme> | undefined) ??
  mongoose.model<IResearchTheme>("ResearchTheme", ResearchThemeSchema);

export default ResearchTheme;
