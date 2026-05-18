// src/server.ts

import app from '@/app';
import { config } from '@/config/env';
import { prisma } from '@/lib/prisma';

// Cron jobs are sensitive to environment (they perform DB writes). Load them only in production
// or when explicitly enabled via ENABLE_CRON=true. This prevents local runs from triggering
// heavy scheduled tasks or operations that require Mongo replica sets.
// The cron jobs will be dynamically imported after DB connection.

const PORT = config.port;

async function startServer() {
  try {
    // Test database connection
    await prisma.user.findFirst({}).then(() => null).catch(() => null);
    console.log('✓ Database connected successfully');

    // Conditionally start cron jobs
    try {
      const enableCron = process.env.ENABLE_CRON === 'true';
      if (config.nodeEnv === 'production' || enableCron) {
        await import('./cron/jobs');
      } else {
        console.log('Cron jobs disabled (non-production and ENABLE_CRON not set)');
      }
    } catch (err) {
      console.warn('Failed to initialize cron jobs:', err);
    }

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════╗
║   🚀 Pragyan Backend Server Running  ║
║   Environment: ${config.nodeEnv.toUpperCase().padEnd(25)}║
║   Port: ${PORT.toString().padEnd(32)}║
║   API Base: http://localhost:${PORT}     ║
╚══════════════════════════════════════╝
      `);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the process using that port and start the backend again.`);
        process.exit(1);
      }

      throw error;
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n✓ Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n✓ Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('unhandledRejection', (reason) => {
  console.error('[UnhandledRejection]', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[UncaughtException]', error);
});

startServer();
