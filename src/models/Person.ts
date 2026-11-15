import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPerson extends Document {
  fullName: string;
  role: string;
  status: string;
  bio?: string;
  researchInterests: mongoose.Types.ObjectId[];
  education?: string;
  email?: string;
  orcid?: string;
  googleScholar?: string;
  github?: string;
  personalWebsite?: string;
  photo?: mongoose.Types.ObjectId;
  cv?: mongoose.Types.ObjectId;
  selectedPublications: mongoose.Types.ObjectId[];
  order: number;
  isDeleted?: boolean;
}

const PersonSchema = new Schema<IPerson>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [120, "Full name cannot exceed 120 characters"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: [
        "leadership",
        "research-associate",
        "research-assistant",
        "student-trainee",
        "collaborator",
        "alumni",
      ],
      index: true,
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["current", "alumni"],
      index: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [2000, "Biography cannot exceed 2000 characters"],
    },
    researchInterests: [
      {
        type: Schema.Types.ObjectId,
        ref: "ResearchTheme",
      },
    ],
    education: {
      type: String,
      trim: true,
      maxlength: [300, "Education cannot exceed 300 characters"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    orcid: {
      type: String,
      trim: true,
      maxlength: [100, "ORCID cannot exceed 100 characters"],
    },
    googleScholar: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, "Google Scholar must be a valid URL"],
    },
    github: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, "GitHub must be a valid URL"],
    },
    personalWebsite: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, "Personal website must be a valid URL"],
    },
    photo: {
      type: Schema.Types.ObjectId,
      ref: "Media",
    },
    cv: {
      type: Schema.Types.ObjectId,
      ref: "Media",
    },
    selectedPublications: [
      {
        type: Schema.Types.ObjectId,
        ref: "Publication",
      },
    ],
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Person: Model<IPerson> =
  (mongoose.models.Person as Model<IPerson> | undefined) ??
  mongoose.model<IPerson>("Person", PersonSchema);

export default Person;
