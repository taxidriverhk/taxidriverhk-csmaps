import type { FastifyInstance } from "fastify";

import { MockMapDatabase, SqlMapDatabase } from "./impl";
import { MapDatabase } from "./types";

export function getConnectionString(): string | undefined {
  return process.env.CSMAPS_DATABASE_URL;
}

export async function usingDatabase<T>(
  server: FastifyInstance,
  func: (db: MapDatabase) => Promise<T>
): Promise<T> {
  const database = await getDatabaseAsync(server);
  try {
    return await func(database);
  } finally {
    database.close();
  }
}

async function getDatabaseAsync(
  fastifyServer: FastifyInstance
): Promise<MapDatabase> {
  const connectionString = getConnectionString();
  if (!connectionString) {
    fastifyServer.log.info(
      "Connection string is not defined, will use a mock DB"
    );
    return new MockMapDatabase();
  }

  fastifyServer.log.info("Connecting to PostgreSQL database");
  const sqlClient = await fastifyServer.pg.connect();

  fastifyServer.log.info("Connected to PostgreSQL database successfully");
  return new SqlMapDatabase(sqlClient);
}
