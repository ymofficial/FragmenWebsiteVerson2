import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn('MONGODB_URI is not defined in environment variables');
}

declare global {
  var _mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

let cached = global._mongoose || { conn: null, promise: null };
global._mongoose = cached;

async function dbConnect() {
  if (!MONGODB_URI) {
    console.error('Database connection failed: MONGODB_URI is missing');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Reduced timeout for faster fallback
      socketTimeoutMS: 10000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log('Successfully connected to MongoDB');
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('Database connection error:', e);
    return null; // Return null instead of throwing
  }

  return cached.conn;
}

export default dbConnect;
