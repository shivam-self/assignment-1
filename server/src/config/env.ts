import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || '*',
};
