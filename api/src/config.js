import { isIP } from "node:net";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const apiRoot = fileURLToPath(new URL("../", import.meta.url));

function integer(value, fallback, name, minimum, maximum) {
  if (value === undefined || value === "") return fallback;
  const parsed = Number(value);
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(parsed) || parsed < minimum || parsed > maximum) {
    throw new Error(`${name} must be an integer from ${minimum} to ${maximum}.`);
  }
  return parsed;
}

function origin(value, name, production) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${name} must be an absolute HTTP(S) origin.`);
  }
  if (
    !["http:", "https:"].includes(url.protocol) || url.username || url.password ||
    url.search || url.hash || url.pathname !== "/" || value.includes("*") ||
    (production && url.protocol !== "https:")
  ) {
    throw new Error(`${name} must be an exact ${production ? "HTTPS" : "HTTP(S)"} origin without a path, credentials, or wildcards.`);
  }
  return url.origin;
}

export function loadConfig(env = process.env) {
  const mode = env.NODE_ENV || "development";
  if (!["development", "test", "production"].includes(mode)) {
    throw new Error("NODE_ENV must be development, test, or production.");
  }
  const production = mode === "production";
  const secret = env.BETTER_AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("BETTER_AUTH_SECRET must contain at least 32 characters. Generate it with npm run setup.");
  }
  if (production && !env.BETTER_AUTH_URL) {
    throw new Error("BETTER_AUTH_URL is required in production.");
  }
  const baseURL = origin(env.BETTER_AUTH_URL || "http://localhost:3001", "BETTER_AUTH_URL", production);
  const trustedOrigins = [...new Set([
    baseURL,
    ...(env.TRUSTED_ORIGINS || "").split(",").map((item) => item.trim()).filter(Boolean)
      .map((item) => origin(item, "TRUSTED_ORIGINS", production)),
  ])];
  const proxies = (env.TRUST_PROXY_CIDRS || "").split(",").map((item) => item.trim()).filter(Boolean);
  for (const proxy of proxies) {
    const [address, prefix, extra] = proxy.split("/");
    const family = isIP(address);
    if (!family || extra !== undefined || (prefix !== undefined &&
      (!/^\d+$/.test(prefix) || Number(prefix) < 1 || Number(prefix) > (family === 4 ? 32 : 128)))) {
      throw new Error("TRUST_PROXY_CIDRS must contain explicit IP addresses or nonzero CIDR ranges.");
    }
  }
  return {
    mode,
    production,
    secret,
    baseURL,
    trustedOrigins,
    trustProxy: proxies.length ? proxies : false,
    host: env.HOST || "127.0.0.1",
    port: integer(env.PORT, 3001, "PORT", 1, 65535),
    databasePath: resolve(apiRoot, env.DATABASE_PATH || "./var/auth.sqlite"),
    sessionTTL: integer(env.SESSION_TTL_SECONDS, 604800, "SESSION_TTL_SECONDS", 3600, 2592000),
  };
}
