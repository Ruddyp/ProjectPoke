import mongoose from "mongoose";

const connectionString = process.env.CONNECTION_STRING as string;

if (!connectionString) {
  throw new Error("Veuillez définir CONNECTION_STRING dans votre .env");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(connectionString, {
        connectTimeoutMS: 5000,
      })
      .then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
