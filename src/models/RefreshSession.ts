import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRefreshSession extends Document {
  userId: mongoose.Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  revokedAt?: Date;
}

const RefreshSessionSchema = new Schema<IRefreshSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
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
    revokedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

RefreshSessionSchema.index({ userId: 1 });
RefreshSessionSchema.index({ expiresAt: 1 });
RefreshSessionSchema.index({ tokenHash: 1 });

export const RefreshSession: Model<IRefreshSession> =
  (mongoose.models.RefreshSession as Model<IRefreshSession> | undefined) ??
  mongoose.model<IRefreshSession>("RefreshSession", RefreshSessionSchema);

export default RefreshSession;
