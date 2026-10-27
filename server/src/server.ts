import { createApp } from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

async function bootstrap() {
  // Fail fast: Connect DB first
  await connectDB();

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    console.log(`[Server] User Management API running on http://localhost:${env.PORT}`);
    console.log(`[Server] Client Origin allowed: ${env.CLIENT_ORIGIN}`);
  });

  const shutdown = async (signal: string) => {
    console.log(`[Server] Received ${signal}. Gracefully shutting down...`);
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
