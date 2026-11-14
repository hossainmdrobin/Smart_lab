import mongoose, { Schema, Document, Model } from "mongoose";

export interface INews extends Document {
  title: string;
  summary: string;
  content?: string;
  publishedAt: Date;
  featured?: boolean;
  image?: mongoose.Types.ObjectId;
  status: "draft" | "published" | "archived";
  isDeleted?: boolean;
}

const NewsSchema = new Schema<INews>(
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
    content: {
      type: String,
      trim: true,
    },
    publishedAt: {
      type: Date,
      required: [true, "Published date is required"],
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    image: {
      type: Schema.Types.ObjectId,
      ref: "Media",
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["draft", "published", "archived"],
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

NewsSchema.index({ publishedAt: 1, featured: 1 });

export const News: Model<INews> =
  (mongoose.models.News as Model<INews> | undefined) ??
  mongoose.model<INews>("News", NewsSchema);

export default News;
