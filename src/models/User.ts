import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole = "admin" | "editor";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: UserRole;
  name: string;
  isActive: boolean;
  lastLoginAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["admin", "editor"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    isActive: {
      type: Boolean,
      required: [true, "isActive is required"],
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const User: Model<IUser> =
  (mongoose.models.User as Model<IUser> | undefined) ??
  mongoose.model<IUser>("User", UserSchema);

export default User;
