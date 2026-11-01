import { mkdirSync, chmodSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { betterAuth } from "better-auth";
import { getMigrations } from "better-auth/db/migration";

export function openAuth(config, { validateSchema = true } = {}) {
  mkdirSync(dirname(config.databasePath), { recursive: true, mode: 0o700 });
  const database = new DatabaseSync(config.databasePath);
  chmodSync(config.databasePath, 0o600);
  database.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
  const auth = betterAuth({
    appName: "Interactive Pokédex",
    baseURL: config.baseURL,
    basePath: "/api/auth",
    secret: config.secret,
    database,
    trustedOrigins: config.trustedOrigins,
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 15,
      maxPasswordLength: 128,
      autoSignIn: true,
    },
    session: {
      expiresIn: config.sessionTTL,
      updateAge: Math.min(86400, Math.floor(config.sessionTTL / 2)),
      cookieCache: { enabled: false },
    },
    rateLimit: {
      enabled: true,
      storage: "database",
      window: 60,
      max: 100,
      customRules: {
        "/sign-up/email": { window: 60, max: 3 },
        "/sign-in/email": { window: 60, max: 10 },
        "/change-password": { window: 60, max: 3 },
      },
    },
    advanced: {
      cookiePrefix: "pokedex",
      useSecureCookies: config.production || config.baseURL.startsWith("https:"),
      defaultCookieAttributes: { httpOnly: true, sameSite: "lax", path: "/" },
      // app.js overwrites this from Express's socket-aware, explicit proxy policy.
      ipAddress: { ipAddressHeaders: ["x-pokedex-client-ip"] },
      database: { validateSchema },
    },
    logger: {
      disabled: config.mode === "test",
      level: "warn",
      // Library errors can include request/database details; retain only severity.
      log: (level) => console.error(`[auth] ${level}: authentication event.`),
    },
  });
  return { auth, database };
}

export async function migrateAuth(auth) {
  const migration = await getMigrations(auth.options);
  await migration.runMigrations();
}

export async function assertSchema(auth) {
  const migration = await getMigrations(auth.options);
  if (migration.toBeCreated.length || migration.toBeAdded.length) {
    throw new Error("Authentication database needs migration. Run npm run db:migrate before starting the API.");
  }
}
