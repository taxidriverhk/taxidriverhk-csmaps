import fastifyPostgres from "@fastify/postgres";
import fastify from "fastify";
import { getConnectionString, usingDatabase } from "./database/init";
import { GetMapsResponse } from "./schemas";

const server = fastify({
  logger: {
    level: "info",
  },
});

const connectionString = getConnectionString();
if (connectionString) {
  server.register(fastifyPostgres, {
    connectionString,
  });
}

server.get<{
  Reply: GetMapsResponse;
}>("/maps", async (_request, _reply) => {
  return await usingDatabase(server, async (db) => {
    const [categories, maps] = await Promise.all([
      db.categoriesAsync(),
      db.mapsAsync(),
    ]);
    return {
      categories,
      maps,
    };
  });
});

server.listen({ port: 8090 }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`CS Maps server started at ${address}`);
});
