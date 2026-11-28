import "server-only";

import { Pool, type PoolClient } from "pg";
import { getDatabaseConfig } from "./config";

declare global {
  // Reuse the pool across Next.js development reloads.
  // eslint-disable-next-line no-var
  var astronDatabasePool: Pool | undefined;
}

export function getDatabasePool(): Pool {
  if (!globalThis.astronDatabasePool) {
    globalThis.astronDatabasePool = new Pool(getDatabaseConfig());
  }
  return globalThis.astronDatabasePool;
}

export async function checkDatabaseConnection(): Promise<void> {
  await getDatabasePool().query("SELECT 1");
}

export async function withDatabaseTransaction<T>(
  operation: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await getDatabasePool().connect();

  try {
    await client.query("BEGIN");
    const result = await operation(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // Preserve the original operation error; the connection is released below.
    }
    throw error;
  } finally {
    client.release();
  }
}
