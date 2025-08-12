// lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://divyagaurav:4LiJ7E2sknZBErN1@cluster0.hqslhqd.mongodb.net/";

if (!MONGODB_URI) {
  throw new Error("⚠️ Please define the MONGODB_URI in your .env.local file");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
