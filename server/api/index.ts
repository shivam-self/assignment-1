import { createApp } from '../src/app';
import mongoose from 'mongoose';
import { env } from '../src/config/env';

let isConnected = false;

async function connectToDatabase() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }
  try {
    await mongoose.connect(env.MONGODB_URI);
    isConnected = true;
  } catch (err) {
    console.error('[MongoDB Serverless] Connection error:', err);
  }
}

const app = createApp();

export default async function handler(req: any, res: any) {
  await connectToDatabase();
  return app(req, res);
}
