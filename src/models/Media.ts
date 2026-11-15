import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMedia extends Document {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  altText?: string;
  uploadedBy: mongoose.Types.ObjectId;
}

const MediaSchema = new Schema<IMedia>(
  {
    filename: {
      type: String,
      required: [true, "Filename is required"],
      trim: true,
    },
    originalName: {
      type: String,
      required: [true, "Original name is required"],
      trim: true,
    },
    mimeType: {
      type: String,
      required: [true, "MIME type is required"],
      trim: true,
      lowercase: true,
    },
    size: {
      type: Number,
      required: [true, "Size is required"],
      min: [0, "Size cannot be negative"],
    },
    url: {
      type: String,
      required: [true, "URL is required"],
      trim: true,
      match: [/^https?:\/\/.+/, "URL must be a valid URL"],
    },
    altText: {
      type: String,
      trim: true,
      maxlength: [250, "Alt text cannot exceed 250 characters"],
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "uploadedBy is required"],
    },
  },
  { timestamps: true },
);

export const Media: Model<IMedia> =
  (mongoose.models.Media as Model<IMedia> | undefined) ??
  mongoose.model<IMedia>("Media", MediaSchema);

export default Media;
