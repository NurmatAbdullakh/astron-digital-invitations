import assert from "node:assert/strict";
import test from "node:test";
import { getDatabaseConfig } from "./config";

const validEnvironment = {
  DATABASE_URL: "postgresql://astron:secret@localhost:5432/astron_invitations",
};

test("builds a safe default PostgreSQL pool configuration", () => {
  const config = getDatabaseConfig(validEnvironment);

  assert.equal(config.max, 10);
  assert.equal(config.connectionTimeoutMillis, 5_000);
  assert.equal(config.idleTimeoutMillis, 30_000);
  assert.equal(config.statement_timeout, 10_000);
  assert.equal(config.ssl, false);
});

test("requires a PostgreSQL connection URL", () => {
  assert.throws(() => getDatabaseConfig({}), /DATABASE_URL is required/);
  assert.throws(
    () => getDatabaseConfig({ DATABASE_URL: "https://example.com" }),
    /postgres/,
  );
});

test("requires explicit supported SSL mode", () => {
  assert.throws(
    () => getDatabaseConfig({ ...validEnvironment, DATABASE_SSL: "prefer" }),
    /DATABASE_SSL/,
  );

  const config = getDatabaseConfig({ ...validEnvironment, DATABASE_SSL: "require" });
  assert.deepEqual(config.ssl, { rejectUnauthorized: true });
});

test("rejects unsafe or invalid pool sizes", () => {
  assert.throws(
    () => getDatabaseConfig({ ...validEnvironment, DATABASE_POOL_MAX: "0" }),
    /DATABASE_POOL_MAX/,
  );
  assert.throws(
    () => getDatabaseConfig({ ...validEnvironment, DATABASE_POOL_MAX: "1000" }),
    /DATABASE_POOL_MAX/,
  );
});
