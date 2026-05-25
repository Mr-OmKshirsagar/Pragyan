import { config as runtimeConfig } from '@/config/env';

export type ValidatedDatabaseConfig = {
  url: string;
  provider: 'mongodb';
  scheme: 'mongodb' | 'mongodb+srv';
  host: string;
  usernamePresent: boolean;
  passwordPresent: boolean;
  isAtlasHost: boolean;
  isPlaceholderHost: boolean;
  isLocalHost: boolean;
  isReplicaSetCompatible: boolean;
};

export type ValidatedOptionalConfig = {
  redisUrl: string | null;
  geminiApiKeyPresent: boolean;
  groqApiKeyPresent: boolean;
};

export type ValidatedEnv = {
  nodeEnv: string;
  port: number;
  database: ValidatedDatabaseConfig;
  optional: ValidatedOptionalConfig;
};

function redactUrl(rawUrl: string): URL {
  try {
    return new URL(rawUrl);
  } catch {
    throw new Error('DATABASE_URL must be a valid MongoDB connection string.');
  }
}

function isPlaceholderToken(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    normalized.includes('your_') ||
    normalized.includes('<') ||
    normalized.includes('>') ||
    normalized.includes('placeholder')
  );
}

export function validateEnv(): ValidatedEnv {
  const rawDatabaseUrl = process.env.DATABASE_URL;
  if (!rawDatabaseUrl) {
    throw new Error('DATABASE_URL is missing. Set it to a MongoDB Atlas connection string before starting the backend.');
  }

  const databaseUrl = redactUrl(rawDatabaseUrl);
  const scheme = databaseUrl.protocol.replace(':', '').toLowerCase();
  if (scheme !== 'mongodb' && scheme !== 'mongodb+srv') {
    throw new Error('DATABASE_URL must start with mongodb:// or mongodb+srv://');
  }

  const host = databaseUrl.hostname.toLowerCase();
  const username = decodeURIComponent(databaseUrl.username || '');
  const password = decodeURIComponent(databaseUrl.password || '');
  const isLocalHost = ['localhost', '127.0.0.1', '0.0.0.0', '::1'].includes(host);
  const isAtlasHost = host.endsWith('.mongodb.net');
  const isPlaceholderHost =
    host === 'atlas-cluster.mongodb.net' ||
    host === 'your-cluster.mongodb.net' ||
    host.startsWith('your_') ||
    host.includes('<') ||
    host.includes('>') ||
    host.includes('placeholder');

  const placeholderDetails: string[] = [];
  if (isPlaceholderHost) {
    placeholderDetails.push(`Placeholder Atlas hostname detected: ${host}`);
  }
  if (!username || isPlaceholderToken(username)) {
    placeholderDetails.push('MongoDB Atlas username is missing or placeholder-based');
  }
  if (!password || isPlaceholderToken(password)) {
    placeholderDetails.push('MongoDB Atlas password is missing or placeholder-based');
  }

  if (placeholderDetails.length > 0) {
    throw new Error(
      [
        'MongoDB Atlas DATABASE_URL is invalid or still using placeholder values.',
        ...placeholderDetails,
        'Fix: replace DATABASE_URL in backend/.env with your real MongoDB Atlas URI.',
        'Example: mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/pragyan?retryWrites=true&w=majority',
      ].join('\n')
    );
  }

  if (runtimeConfig.nodeEnv === 'production' && isLocalHost) {
    throw new Error('Local MongoDB URLs are not allowed in production. Use a MongoDB Atlas replica-set connection string.');
  }

  const retryWrites = databaseUrl.searchParams.get('retryWrites');
  const writeConcern = databaseUrl.searchParams.get('w');
  const isReplicaSetCompatible = isAtlasHost && retryWrites === 'true' && (writeConcern === 'majority' || scheme === 'mongodb+srv');

  return {
    nodeEnv: runtimeConfig.nodeEnv,
    port: runtimeConfig.port,
    database: {
      url: rawDatabaseUrl,
      provider: 'mongodb',
      scheme: scheme as 'mongodb' | 'mongodb+srv',
      host,
      usernamePresent: Boolean(username),
      passwordPresent: Boolean(password),
      isAtlasHost,
      isPlaceholderHost,
      isLocalHost,
      isReplicaSetCompatible,
    },
    optional: {
      redisUrl: process.env.REDIS_URL || null,
      geminiApiKeyPresent: Boolean(process.env.GEMINI_API_KEY),
      groqApiKeyPresent: Boolean(process.env.GROQ_API_KEY),
    },
  };
}
