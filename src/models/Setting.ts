import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISetting extends Document {
  key: string;
  value: unknown;
  type: "string" | "boolean" | "number";
  updatedBy: mongoose.Types.ObjectId;
}

const SettingSchema = new Schema<ISetting>(
  {
    key: {
      type: String,
      required: [true, "Key is required"],
      unique: true,
      trim: true,
      index: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: [true, "Value is required"],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["string", "boolean", "number"],
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "updatedBy is required"],
    },
  },
  { timestamps: true },
);

export const Setting: Model<ISetting> =
  (mongoose.models.Setting as Model<ISetting> | undefined) ??
  mongoose.model<ISetting>("Setting", SettingSchema);

export default Setting;
