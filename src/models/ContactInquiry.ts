import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContactInquiry extends Document {
  name: string;
  email: string;
  institution?: string;
  subject: string;
  message: string;
  receivedAt: Date;
  ipAddress?: string;
  isRead?: boolean;
}

const ContactInquirySchema = new Schema<IContactInquiry>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [150, "Name cannot exceed 150 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    institution: {
      type: String,
      trim: true,
      maxlength: [150, "Institution cannot exceed 150 characters"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxlength: [300, "Subject cannot exceed 300 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [10000, "Message cannot exceed 10000 characters"],
    },
    receivedAt: {
      type: Date,
      required: [true, "Received date is required"],
      index: true,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const ContactInquiry: Model<IContactInquiry> =
  (mongoose.models.ContactInquiry as Model<IContactInquiry> | undefined) ??
  mongoose.model<IContactInquiry>("ContactInquiry", ContactInquirySchema);

export default ContactInquiry;
