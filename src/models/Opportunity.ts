import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOpportunity extends Document {
  title: string;
  description: string;
  eligibility: string;
  expectedSkills?: string;
  location: string;
  applicationInstructions: string;
  deadline?: Date;
  status: "open" | "closed";
  isDeleted?: boolean;
}

const OpportunitySchema = new Schema<IOpportunity>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [300, "Title cannot exceed 300 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    eligibility: {
      type: String,
      required: [true, "Eligibility is required"],
      trim: true,
    },
    expectedSkills: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    applicationInstructions: {
      type: String,
      required: [true, "Application instructions are required"],
      trim: true,
    },
    deadline: {
      type: Date,
      index: true,
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["open", "closed"],
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

OpportunitySchema.index({ status: 1, deadline: 1 });

export const Opportunity: Model<IOpportunity> =
  (mongoose.models.Opportunity as Model<IOpportunity> | undefined) ??
  mongoose.model<IOpportunity>("Opportunity", OpportunitySchema);

export default Opportunity;
