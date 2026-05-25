export type DatabaseDiagnostics = {
  rawUrl: string;
  scheme: string;
  host: string;
  usernamePresent: boolean;
  passwordPresent: boolean;
  isAtlasHost: boolean;
  isPlaceholderHost: boolean;
  isLocalHost: boolean;
  isReplicaSetCompatible: boolean;
  issues: string[];
};

function normalizeUrl(rawUrl: string): URL {
  try {
    return new URL(rawUrl);
  } catch {
    throw new Error('DATABASE_URL must be a valid MongoDB connection string.');
  }
}

function isPlaceholderValue(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    normalized.includes('your_') ||
    normalized.includes('<') ||
    normalized.includes('>') ||
    normalized.includes('placeholder')
  );
}

function buildDiagnostics(rawUrl: string): DatabaseDiagnostics {
  const url = normalizeUrl(rawUrl);
  const scheme = url.protocol.replace(':', '').toLowerCase();
  const host = url.hostname.toLowerCase();
  const username = decodeURIComponent(url.username || '');
  const password = decodeURIComponent(url.password || '');
  const usernamePresent = Boolean(username);
  const passwordPresent = Boolean(password);
  const isLocalHost = ['localhost', '127.0.0.1', '0.0.0.0', '::1'].includes(host);
  const isAtlasHost = host.endsWith('.mongodb.net');
  const isPlaceholderHost =
    host === 'atlas-cluster.mongodb.net' ||
    host.includes('<') ||
    host.includes('>') ||
    host.startsWith('your_') ||
    host.includes('placeholder') ||
    host === 'your_cluster.mongodb.net';

  const issues: string[] = [];

  if (!['mongodb', 'mongodb+srv'].includes(scheme)) {
    issues.push('DATABASE_URL must start with mongodb:// or mongodb+srv://');
  }

  if (!isAtlasHost) {
    issues.push('DATABASE_URL must point to a MongoDB Atlas host ending in .mongodb.net');
  }

  if (isLocalHost) {
    issues.push('Local MongoDB hosts are not allowed in production');
  }

  if (isPlaceholderHost) {
    issues.push('DATABASE_URL is still using placeholder Atlas host values');
  }

  if (!usernamePresent || isPlaceholderValue(username)) {
    issues.push('MongoDB Atlas username is missing or still a placeholder');
  }

  if (!passwordPresent || isPlaceholderValue(password)) {
    issues.push('MongoDB Atlas password is missing or still a placeholder');
  }

  const retryWrites = url.searchParams.get('retryWrites');
  const writeConcern = url.searchParams.get('w');
  const isReplicaSetCompatible = isAtlasHost && retryWrites === 'true' && (writeConcern === 'majority' || scheme === 'mongodb+srv');

  if (!isReplicaSetCompatible) {
    issues.push('DATABASE_URL should enable replica-set compatible options such as retryWrites=true&w=majority');
  }

  return {
    rawUrl,
    scheme,
    host,
    usernamePresent,
    passwordPresent,
    isAtlasHost,
    isPlaceholderHost,
    isLocalHost,
    isReplicaSetCompatible,
    issues,
  };
}

export function validateDatabaseEnvironment(): DatabaseDiagnostics {
  const rawUrl = process.env.DATABASE_URL;

  if (!rawUrl) {
    throw new Error('DATABASE_URL is missing. Set it to your MongoDB Atlas connection string before starting the backend.');
  }

  const diagnostics = buildDiagnostics(rawUrl);

  if (diagnostics.issues.length > 0) {
    throw new Error(
      'MongoDB Atlas DATABASE_URL is invalid or still using placeholder values.\n' +
        diagnostics.issues.map((issue) => `- ${issue}`).join('\n') +
        '\nUpdate backend/.env with a real Atlas connection string before starting the server.'
    );
  }

  return diagnostics;
}

export function formatDatabaseDiagnostics(diagnostics: DatabaseDiagnostics): string {
  return [
    `provider: mongodb`,
    `atlasDetected: ${diagnostics.isAtlasHost ? 'yes' : 'no'}`,
    `replicaSetCompatible: ${diagnostics.isReplicaSetCompatible ? 'yes' : 'no'}`,
    `credentialsPresent: ${diagnostics.usernamePresent && diagnostics.passwordPresent ? 'yes' : 'no'}`,
    `host: ${diagnostics.host}`,
  ].join('\n');
}
