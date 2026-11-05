import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/retailrocket';
  
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB] Notice: Could not connect to MongoDB at ${mongoUri}.`);
    console.warn(`[MongoDB] Operating in standalone memory-cached mode. All features (SVD recommendations, analytics, voice) will function normally.`);
    return false;
  }
}

export function isDbConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}

