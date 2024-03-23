import fastify from "fastify";

import { getDatabase } from "./database/init";
import { GetMapsResponse } from "./schemas";

const server = fastify({
  logger: {
    level: "info",
  },
});
const db = getDatabase();

server.get<{
  Reply: GetMapsResponse;
}>("/maps", async (_request, _reply) => {
  return {
    categories: [],
    maps: await db.mapsAsync(),
  };
});

server.listen({ port: 8090 }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`CS Maps server started at ${address}`);
});
