import mongoose, { Schema, Document, Model } from "mongoose";

export type ProjectStatus = "ongoing" | "completed" | "draft";

export interface IProject extends Document {
  title: string;
  summary: string;
  researchTheme: mongoose.Types.ObjectId[];
  status: ProjectStatus;
  team: mongoose.Types.ObjectId[];
  methods?: string;
  relatedPublications: mongoose.Types.ObjectId[];
  codeUrl?: string;
  datasetUrl?: string;
  fundingAcknowledgment?: string;
  image?: mongoose.Types.ObjectId;
  featured?: boolean;
  isDeleted?: boolean;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [300, "Title cannot exceed 300 characters"],
    },
    summary: {
      type: String,
      required: [true, "Summary is required"],
      trim: true,
    },
    researchTheme: [
      {
        type: Schema.Types.ObjectId,
        ref: "ResearchTheme",
        required: true,
        index: true,
      },
    ],
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["ongoing", "completed", "draft"],
      index: true,
    },
    team: [
      {
        type: Schema.Types.ObjectId,
        ref: "Person",
      },
    ],
    methods: {
      type: String,
      trim: true,
    },
    relatedPublications: [
      {
        type: Schema.Types.ObjectId,
        ref: "Publication",
      },
    ],
    codeUrl: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, "Code URL must be a valid URL"],
    },
    datasetUrl: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, "Dataset URL must be a valid URL"],
    },
    fundingAcknowledgment: {
      type: String,
      trim: true,
    },
    image: {
      type: Schema.Types.ObjectId,
      ref: "Media",
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

ProjectSchema.index({ status: 1, featured: 1 });

export const Project: Model<IProject> =
  (mongoose.models.Project as Model<IProject> | undefined) ??
  mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
