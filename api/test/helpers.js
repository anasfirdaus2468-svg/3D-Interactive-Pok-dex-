import { randomBytes } from "node:crypto";
import { once } from "node:events";
import { mkdtemp, rm } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Readable } from "node:stream";
import { createApp } from "../src/app.js";
import { assertSchema, migrateAuth, openAuth } from "../src/auth.js";
import { loadConfig } from "../src/config.js";

export const password = "A-long-test-password-for-Trainers!";

export function cookies(response) {
  return response.headers.getSetCookie().map((item) => item.split(";", 1)[0]).join("; ");
}

export async function testAPI(t, environment = {}) {
  const directory = await mkdtemp(join(tmpdir(), "pokedex-auth-test-"));
  const config = loadConfig({
    NODE_ENV: "test",
    BETTER_AUTH_SECRET: randomBytes(32).toString("base64url"),
    BETTER_AUTH_URL: "http://localhost:3001",
    DATABASE_PATH: join(directory, "auth.sqlite"),
    ...environment,
  });
  let context;
  let server;
  let url;
  async function start(migrate = false) {
    context = openAuth(config, { validateSchema: !migrate });
    if (migrate) await migrateAuth(context.auth);
    await assertSchema(context.auth);
    server = createServer(createApp({ ...context, config }));
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    url = `http://127.0.0.1:${server.address().port}`;
  }
  async function stop() {
    if (server) {
      const current = server;
      server = undefined;
      await new Promise((resolve, reject) => current.close((error) => error ? reject(error) : resolve()));
    }
    context?.database.close();
    context = undefined;
  }
  t.after(async () => { await stop(); await rm(directory, { recursive: true, force: true }); });
  await start(true);
  return {
    config,
    get database() { return context.database; },
    async restart() { await stop(); await start(); },
    async streamRequest(path, chunks) {
      return fetch(url + path, {
        method: "POST", duplex: "half",
        headers: { "content-type": "application/json", origin: config.baseURL },
        body: Readable.from(chunks),
      });
    },
    async request(path, options = {}) {
      const { body, cookie, origin = config.baseURL, headers = {}, method = body === undefined ? "GET" : "POST" } = options;
      return fetch(url + path, {
        method,
        redirect: "manual",
        headers: {
          ...(body === undefined ? {} : { "content-type": "application/json" }),
          ...(cookie ? { cookie } : {}),
          ...(origin === null ? {} : { origin }),
          ...headers,
        },
        ...(body === undefined ? {} : { body: typeof body === "string" ? body : JSON.stringify(body) }),
      });
    },
  };
}
