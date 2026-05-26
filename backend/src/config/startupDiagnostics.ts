import type { ValidatedEnv } from '@/config/validateEnv';

const color = {
  reset: '\u001b[0m',
  cyan: '\u001b[36m',
  green: '\u001b[32m',
  yellow: '\u001b[33m',
  red: '\u001b[31m',
  dim: '\u001b[2m',
  bold: '\u001b[1m',
};

function formatStatus(label: string, value: string, status: 'ok' | 'warn' | 'error' | 'info') {
  const tone = status === 'ok' ? color.green : status === 'warn' ? color.yellow : status === 'error' ? color.red : color.cyan;
  return `${tone}${label}${color.reset}: ${value}`;
}

export function formatMaskedDatabaseUrl(databaseUrl: string): string {
  try {
    const url = new URL(databaseUrl);
    const username = url.username ? '***' : '(missing)';
    const password = url.password ? '***' : '(missing)';
    const host = url.hostname;
    const databaseName = url.pathname.replace(/^\//, '') || '(default)';
    return `${url.protocol}//${username}:${password}@${host}/${databaseName}`;
  } catch {
    return '(invalid DATABASE_URL)';
  }
}

export function formatStartupDiagnostics(env: ValidatedEnv, prismaStatus: 'pending' | 'connected' | 'failed'): string {
  const redisStatus = env.optional.redisUrl ? 'configured' : 'fallback in-memory cache';
  const aiStatus = env.optional.geminiApiKeyPresent
    ? 'Gemini enabled'
    : env.optional.groqApiKeyPresent
      ? 'Groq enabled'
      : 'heuristic fallback';

  const lines = [
    `${color.bold}=====================================${color.reset}`,
    `${color.bold}Pragyan Startup Diagnostics${color.reset}`,
    `${color.bold}=====================================${color.reset}`,
    formatStatus('Environment mode', env.nodeEnv, 'info'),
    formatStatus('Database provider', env.database.provider, 'info'),
    formatStatus('Atlas detection', env.database.isAtlasHost ? 'enabled' : 'not detected', env.database.isAtlasHost ? 'ok' : 'warn'),
    formatStatus('Replica-set compatibility', env.database.isReplicaSetCompatible ? 'compatible' : 'not confirmed', env.database.isReplicaSetCompatible ? 'ok' : 'warn'),
    formatStatus('Prisma initialization', prismaStatus, prismaStatus === 'connected' ? 'ok' : prismaStatus === 'failed' ? 'error' : 'info'),
    formatStatus('Redis status', redisStatus, env.optional.redisUrl ? 'ok' : 'warn'),
    formatStatus('AI provider status', aiStatus, 'info'),
    `${color.dim}DATABASE_URL${color.reset}: ${formatMaskedDatabaseUrl(env.database.url)}`,
    `${color.bold}=====================================${color.reset}`,
  ];

  return lines.join('\n');
}

export function formatStartupFailure(title: string, issue: string, fix: string, example: string): string {
  return [
    `${color.bold}=====================================${color.reset}`,
    `${color.bold}${title}${color.reset}`,
    `${color.bold}=====================================${color.reset}`,
    `${color.red}Issue:${color.reset}`,
    issue,
    '',
    `${color.yellow}Fix:${color.reset}`,
    fix,
    '',
    `${color.cyan}Example:${color.reset}`,
    example,
    `${color.bold}=====================================${color.reset}`,
  ].join('\n');
}
