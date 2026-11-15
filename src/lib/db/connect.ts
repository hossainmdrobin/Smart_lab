import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: CachedConnection | undefined;
}

let cached = globalThis.mongoose as CachedConnection | undefined;

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}

export async function dbConnect(): Promise<typeof mongoose> {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error(
      "Invalid/Missing environment variable: MONGODB_URI. Define it in .env.local and never commit credentials.",
    );
  }

  if (!cached?.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI!, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (error) {
    cached!.promise = null;
    throw new Error(
      `Database connection failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  return cached!.conn;
}
