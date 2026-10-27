import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { User } from '../models/User';

const sampleUsers = [
  {
    name: 'Sarah Connor',
    email: 'sarah.connor@example.com',
    role: 'admin',
    phone: '+1 555-0199',
    status: 'active',
    createdAt: new Date(),
  },
  {
    name: 'Ayush Jaiswal',
    email: 'ayush.jaiswal@example.com',
    role: 'admin',
    phone: '+91 98765 43210',
    status: 'active',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    role: 'editor',
    phone: '+1 555-0144',
    status: 'active',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    role: 'editor',
    phone: '+44 20 7946 0912',
    status: 'inactive',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    name: 'David Chen',
    email: 'david.chen@example.com',
    role: 'viewer',
    phone: '+1 555-0182',
    status: 'active',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago (older)
  },
  {
    name: 'Maya Patel',
    email: 'maya.patel@example.com',
    role: 'viewer',
    phone: '+91 91234 56789',
    status: 'active',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
  },
  {
    name: 'Marcus Vance',
    email: 'marcus.vance@example.com',
    role: 'viewer',
    phone: '+1 555-0163',
    status: 'inactive',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
  },
  {
    name: 'Hana Tanaka',
    email: 'hana.tanaka@example.com',
    role: 'editor',
    phone: '+81 3 5555 0143',
    status: 'active',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    name: 'Liam O’Connor',
    email: 'liam.oconnor@example.com',
    role: 'viewer',
    phone: '+353 1 496 0122',
    status: 'active',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
  },
];

async function seed() {
  console.log('[Seed] Starting database seed...');
  await connectDB();

  try {
    for (const userData of sampleUsers) {
      await User.findOneAndUpdate(
        { email: userData.email },
        { $set: userData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    const count = await User.countDocuments();
    console.log(`[Seed] Successfully seeded users. Total users in DB: ${count}`);
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('[Seed] Database connection closed.');
    process.exit(0);
  }
}

seed();
