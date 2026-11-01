import express from "express";
import cors from "cors";
import helmet from "helmet";
import { fromNodeHeaders } from "better-auth/node";
import { setResponse } from "better-call/node";

export function createApp({ auth, database, config }) {
  const app = express();
  const allowedOrigins = new Set(config.trustedOrigins);
  app.disable("x-powered-by");
  app.set("trust proxy", config.trustProxy);
  app.use(helmet());
  app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    // Never let a caller choose the key used by the authentication rate limiter.
    req.headers["x-pokedex-client-ip"] = req.ip;
    next();
  });
  app.use(cors({
    origin: (requestOrigin, callback) => callback(null, !requestOrigin || allowedOrigins.has(requestOrigin)),
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    exposedHeaders: ["X-Retry-After"],
    maxAge: 600,
  }));

  app.get("/api/health", (req, res) => {
    database.prepare("SELECT 1").get();
    res.json({ status: "ok" });
  });

  // Bound both Content-Length and chunked bodies, then pass their unchanged bytes
  // through Better Auth's standard Request/Response handler. No JSON parser runs.
  app.all("/api/auth/{*path}", express.raw({ type: () => true, limit: "16kb" }), async (req, res) => {
    if (!["GET", "POST"].includes(req.method)) {
      return res.set("Allow", "GET, POST").status(405).json({ error: { code: "METHOD_NOT_ALLOWED", message: "Use GET or POST." } });
    }
    const request = new Request(config.baseURL + req.originalUrl, {
      method: req.method,
      headers: fromNodeHeaders(req.headers),
      ...(req.method === "POST" && req.body?.length ? { body: req.body } : {}),
    });
    return setResponse(res, await auth.handler(request));
  });

  app.get("/api/me", async (req, res) => {
    const result = await auth.api.getSession({ headers: fromNodeHeaders(req.headers), returnHeaders: true });
    const session = result.response;
    const renewedCookies = result.headers.getSetCookie();
    if (renewedCookies.length) res.set("Set-Cookie", renewedCookies);
    if (!session) return res.status(401).json({ error: { code: "UNAUTHENTICATED", message: "Sign in to continue." } });
    // Expose the user's identity, not their session token or password/account data.
    const { id, name, email, emailVerified } = session.user;
    return res.json({ user: { id, name, email, emailVerified } });
  });

  app.use((req, res) => res.status(404).json({ error: { code: "NOT_FOUND", message: "Endpoint not found." } }));
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error.type === "entity.too.large") {
      return res.status(413).json({ error: { code: "PAYLOAD_TOO_LARGE", message: "Request body must not exceed 16 KiB." } });
    }
    if (["encoding.unsupported", "charset.unsupported", "request.aborted", "request.size.invalid"].includes(error.type)) {
      return res.status(error.status || 400).json({ error: { code: "INVALID_BODY", message: "Unsupported or incomplete request body." } });
    }
    // Request bodies, cookies, tokens, and exception details never enter responses/logs.
    console.error("API request failed.");
    return res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "The request could not be completed." } });
  });
  return app;
}
