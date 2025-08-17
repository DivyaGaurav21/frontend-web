// lib/mongodb.ts
import mongoose from "mongoose";

// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;

// Validate environment variable
if (!MONGODB_URI) {
  throw new Error(
    "⚠️ Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Type definition for cached connection
interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Use global variable to maintain connection across hot reloads in development
let cached: CachedConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB database
 * @returns Promise<typeof mongoose>
 */
export default async function connectDB(): Promise<typeof mongoose> {
  // Return existing connection if available
  if (cached.conn) {
    console.log("📦 Using cached MongoDB connection");
    return cached.conn;
  }

  // Create new connection if no cached promise exists
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds
      retryWrites: true,
      writeConcern: { w: "majority" }, // Write concern
    };

    console.log("🔄 Connecting to MongoDB...");
    
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB connected successfully");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset cached promise on error so next call attempts fresh connection
    cached.promise = null;
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }

  return cached.conn;
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectDB(): Promise<void> {
  if (cached.conn) {
    console.log("🔌 Disconnecting from MongoDB...");
    await cached.conn.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log("✅ MongoDB disconnected successfully");
  }
}

/**
 * Check if MongoDB is connected
 */
export function isConnected(): boolean {
  return cached.conn?.connection.readyState === 1;
}

/**
 * Get connection status
 */
export function getConnectionStatus(): string {
  if (!cached.conn) return "disconnected";
  
  const states = {
    0: "disconnected",
    1: "connected", 
    2: "connecting",
    3: "disconnecting",
  };
  
  return states[cached.conn.connection.readyState as keyof typeof states] || "unknown";
}

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("🟢 MongoDB connection established");
});

mongoose.connection.on("error", (err) => {
  console.error("🔴 MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("🟡 MongoDB connection lost");
});