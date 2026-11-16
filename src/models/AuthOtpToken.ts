import mongoose, { Schema, Document, Model } from "mongoose";

export type AuthOtpPurpose = "email_verification" | "password_reset";

export interface IAuthOtpToken extends Document {
  email: string;
  purpose: AuthOtpPurpose;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date;
}

const AuthOtpTokenSchema = new Schema<IAuthOtpToken>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      index: true,
    },
    purpose: {
      type: String,
      required: [true, "Purpose is required"],
      enum: ["email_verification", "password_reset"],
      index: true,
    },
    tokenHash: {
      type: String,
      required: [true, "tokenHash is required"],
    },
    expiresAt: {
      type: Date,
      required: [true, "expiresAt is required"],
      index: true,
    },
    usedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

AuthOtpTokenSchema.index({ email: 1, purpose: 1, expiresAt: 1 });

export const AuthOtpToken: Model<IAuthOtpToken> =
  (mongoose.models.AuthOtpToken as Model<IAuthOtpToken> | undefined) ??
  mongoose.model<IAuthOtpToken>("AuthOtpToken", AuthOtpTokenSchema);

export default AuthOtpToken;
