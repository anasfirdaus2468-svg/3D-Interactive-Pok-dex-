import { createServer } from "node:http";
import { loadConfig } from "./config.js";
import { assertSchema, openAuth } from "./auth.js";
import { createApp } from "./app.js";

let database;
try {
  const config = loadConfig();
  const context = openAuth(config);
  database = context.database;
  await assertSchema(context.auth);
  const server = createServer({
    maxHeaderSize: 16384,
    requestTimeout: 15000,
    headersTimeout: 10000,
    keepAliveTimeout: 5000,
  }, createApp({ ...context, config }));
  server.on("error", (error) => {
    console.error(`API server failed (${error.code || "startup"}).`);
    database.close();
    process.exitCode = 1;
  });
  server.listen(config.port, config.host, () => console.log(`Pokédex authentication API listening at ${config.baseURL}`));
  const shutdown = () => {
    server.close(() => { database.close(); });
    setTimeout(() => { server.closeAllConnections(); }, 5000).unref();
  };
  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);
} catch (error) {
  database?.close();
  console.error(error.message);
  process.exitCode = 1;
}
