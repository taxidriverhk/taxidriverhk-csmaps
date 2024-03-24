import fastifyPostgres from "@fastify/postgres";
import fastify from "fastify";
import { getConnectionString, usingDatabase } from "./database/init";
import {
  GetMapsResponse,
  GetTutorialsResponse,
  Map as MapItem,
  Tutorial,
} from "./schemas";

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

server.get<{
  Params: {
    name: string;
  };
  Reply: MapItem;
}>("/maps/:name", async (request, reply) => {
  const { name } = request.params;
  const map = await usingDatabase(
    server,
    async (db) => await db.mapAsync(name)
  );

  if (map != null) {
    reply.status(200).send(map);
  } else {
    reply.status(404);
  }
});

server.get<{
  Reply: GetTutorialsResponse;
}>("/tutorials", async (_request, _reply) => {
  return await usingDatabase(server, async (db) => ({
    tutorials: await db.tutorialsAsync(),
  }));
});

server.get<{
  Params: {
    id: string;
  };
  Reply: Tutorial;
}>("/tutorials/:id", async (request, reply) => {
  const { id } = request.params;
  const tutorial = await usingDatabase(
    server,
    async (db) => await db.tutorialAsync(id)
  );

  if (tutorial != null) {
    reply.status(200).send(tutorial);
  } else {
    reply.status(404);
  }
});

server.listen({ port: 8090, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`CS Maps server started at ${address}`);
});
