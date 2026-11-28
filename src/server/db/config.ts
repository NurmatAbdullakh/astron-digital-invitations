import type { PoolConfig } from "pg";

const DEFAULT_POOL_MAX = 10;
const MAX_POOL_MAX = 50;

function parsePoolMax(value: string | undefined): number {
  if (!value) return DEFAULT_POOL_MAX;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > MAX_POOL_MAX) {
    throw new Error(`DATABASE_POOL_MAX must be an integer between 1 and ${MAX_POOL_MAX}.`);
  }
  return parsed;
}

export function getDatabaseConfig(env: NodeJS.ProcessEnv = process.env): PoolConfig {
  const connectionString = env.DATABASE_URL?.trim();
  if (!connectionString) {
    throw new Error("DATABASE_URL is required for database operations.");
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(connectionString);
  } catch {
    throw new Error("DATABASE_URL must be a valid PostgreSQL connection URL.");
  }

  if (parsedUrl.protocol !== "postgres:" && parsedUrl.protocol !== "postgresql:") {
    throw new Error("DATABASE_URL must use the postgres:// or postgresql:// protocol.");
  }

  const sslMode = (env.DATABASE_SSL ?? "disable").toLowerCase();
  if (sslMode !== "disable" && sslMode !== "require") {
    throw new Error("DATABASE_SSL must be either 'disable' or 'require'.");
  }

  return {
    connectionString,
    max: parsePoolMax(env.DATABASE_POOL_MAX),
    connectionTimeoutMillis: 5_000,
    idleTimeoutMillis: 30_000,
    statement_timeout: 10_000,
    application_name: "astron-digital-invitations",
    ssl: sslMode === "require" ? { rejectUnauthorized: true } : false,
  };
}
