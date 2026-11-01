import { loadConfig } from "../src/config.js";
import { migrateAuth, openAuth } from "../src/auth.js";

let database;
try {
  const context = openAuth(loadConfig(), { validateSchema: false });
  database = context.database;
  await migrateAuth(context.auth);
  console.log("Authentication database schema is up to date.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  database?.close();
}
