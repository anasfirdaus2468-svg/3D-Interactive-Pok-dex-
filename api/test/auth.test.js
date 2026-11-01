import assert from "node:assert/strict";
import test from "node:test";
import { cookies, password, testAPI } from "./helpers.js";

const signup = { name: "Test Trainer", email: "trainer@example.com", password };

async function register(api, body = signup) {
  const response = await api.request("/api/auth/sign-up/email", { body });
  assert.equal(response.status, 200, await response.clone().text());
  return response;
}

test("registration stores a salted password hash, sets a private cookie, and protects /api/me", async (t) => {
  const api = await testAPI(t);
  assert.equal((await api.request("/api/me")).status, 401);
  const response = await register(api);
  const setCookie = response.headers.getSetCookie().join(";");
  assert.match(setCookie, /HttpOnly/i);
  assert.match(setCookie, /SameSite=Lax/i);
  assert.match(setCookie, /Path=\//i);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const me = await api.request("/api/me", { cookie: cookies(response) });
  assert.equal(me.status, 200);
  const identity = await me.json();
  assert.equal(identity.user.email, signup.email);
  assert.equal(identity.user.emailVerified, false);
  assert.deepEqual(Object.keys(identity.user).sort(), ["email", "emailVerified", "id", "name"]);
  assert.equal(JSON.stringify(identity).includes("token"), false);
  const firstHash = api.database.prepare('SELECT password FROM "account"').get().password;
  assert.ok(firstHash.length > 32);
  assert.notEqual(firstHash, password);
  await register(api, { ...signup, email: "second@example.com" });
  const hashes = api.database.prepare('SELECT password FROM "account"').all();
  assert.notEqual(hashes[0].password, hashes[1].password);
});

test("login is case-insensitive for email and creates a usable session", async (t) => {
  const api = await testAPI(t);
  await register(api);
  const response = await api.request("/api/auth/sign-in/email", {
    body: { email: "TRAINER@EXAMPLE.COM", password },
  });
  assert.equal(response.status, 200);
  const me = await api.request("/api/me", { cookie: cookies(response) });
  assert.equal(me.status, 200);
});

test("wrong password and unknown email return the same generic error", async (t) => {
  const api = await testAPI(t);
  await register(api);
  const wrong = await api.request("/api/auth/sign-in/email", { body: { email: signup.email, password: "wrong" } });
  const missing = await api.request("/api/auth/sign-in/email", { body: { email: "missing@example.com", password } });
  assert.equal(wrong.status, 401);
  assert.equal(missing.status, 401);
  assert.deepEqual(await wrong.json(), await missing.json());
  assert.equal(cookies(wrong), "");
  assert.equal(cookies(missing), "");
});

test("duplicate registration cannot replace an existing account", async (t) => {
  const api = await testAPI(t);
  await register(api);
  const duplicate = await api.request("/api/auth/sign-up/email", { body: { ...signup, password: "A-different-long-password!" } });
  assert.equal(duplicate.status, 422);
  assert.equal(api.database.prepare('SELECT count(*) AS count FROM "user"').get().count, 1);
  const login = await api.request("/api/auth/sign-in/email", { body: { email: signup.email, password } });
  assert.equal(login.status, 200);
});

test("registration rejects short passwords, invalid email, and malformed JSON", async (t) => {
  const api = await testAPI(t);
  for (const body of [{ ...signup, password: "short" }, { ...signup, email: "invalid" }, "{"]) {
    const response = await api.request("/api/auth/sign-up/email", { body });
    assert.ok(response.status >= 400 && response.status < 500, await response.text());
  }
  assert.equal(api.database.prepare('SELECT count(*) AS count FROM "user"').get().count, 0);
});

test("accounts and existing sessions survive a server/database restart", async (t) => {
  const api = await testAPI(t);
  const response = await register(api);
  const cookie = cookies(response);
  await api.restart();
  const me = await api.request("/api/me", { cookie });
  assert.equal(me.status, 200);
  assert.equal((await me.json()).user.email, signup.email);
});

test("sign-out revokes the server session even if the old cookie is replayed", async (t) => {
  const api = await testAPI(t);
  const cookie = cookies(await register(api));
  const response = await api.request("/api/auth/sign-out", { body: {}, cookie });
  assert.equal(response.status, 200);
  assert.equal((await api.request("/api/me", { cookie })).status, 401);
});

test("protected identity forwards session-renewal cookies to the browser", async (t) => {
  const api = await testAPI(t);
  const cookie = cookies(await register(api));
  api.database.prepare('UPDATE "session" SET "updatedAt" = ?, "expiresAt" = ?')
    .run(Date.now() - 2 * 86400000, Date.now() + 5 * 86400000);
  const response = await api.request("/api/me", { cookie });
  assert.equal(response.status, 200);
  assert.match(response.headers.getSetCookie().join(";"), /pokedex\.session_token=/);
});

test("expired and tampered cookies cannot access protected identity", async (t) => {
  const api = await testAPI(t);
  const cookie = cookies(await register(api));
  const tampered = cookie.slice(0, -1) + (cookie.endsWith("a") ? "b" : "a");
  assert.equal((await api.request("/api/me", { cookie: tampered })).status, 401);
  api.database.prepare('UPDATE "session" SET "expiresAt" = ?').run(Date.now() - 60000);
  assert.equal((await api.request("/api/me", { cookie })).status, 401);
});

test("changing password revokes the other session and replaces the password", async (t) => {
  const api = await testAPI(t);
  const firstCookie = cookies(await register(api));
  const login = await api.request("/api/auth/sign-in/email", { body: { email: signup.email, password } });
  const currentCookie = cookies(login);
  const newPassword = "Another-long-password-for-the-trainer!";
  const changed = await api.request("/api/auth/change-password", {
    cookie: currentCookie,
    body: { currentPassword: password, newPassword, revokeOtherSessions: true },
  });
  assert.equal(changed.status, 200, await changed.clone().text());
  assert.equal((await api.request("/api/me", { cookie: firstCookie })).status, 401);
  assert.equal((await api.request("/api/auth/sign-in/email", { body: { email: signup.email, password } })).status, 401);
  assert.equal((await api.request("/api/auth/sign-in/email", { body: { email: signup.email, password: newPassword } })).status, 200);
});

test("untrusted origins cannot create accounts or sign out another browser", async (t) => {
  const api = await testAPI(t);
  const rejected = await api.request("/api/auth/sign-up/email", { body: signup, origin: "https://untrusted.example" });
  assert.equal(rejected.status, 403);
  assert.equal(rejected.headers.get("access-control-allow-origin"), null);
  assert.equal(api.database.prepare('SELECT count(*) AS count FROM "user"').get().count, 0);
  const cookie = cookies(await register(api));
  const signout = await api.request("/api/auth/sign-out", { body: {}, cookie, origin: "https://untrusted.example" });
  assert.equal(signout.status, 403);
  assert.equal((await api.request("/api/me", { cookie })).status, 200);
});

test("first-login cross-site form navigation is blocked even without an Origin header", async (t) => {
  const api = await testAPI(t);
  const response = await api.request("/api/auth/sign-up/email", {
    body: signup,
    origin: null,
    headers: { "sec-fetch-site": "cross-site", "sec-fetch-mode": "navigate", "sec-fetch-dest": "document" },
  });
  assert.equal(response.status, 403);
  assert.equal(api.database.prepare('SELECT count(*) AS count FROM "user"').get().count, 0);
});

test("credentialed CORS is restricted to configured exact frontend origins", async (t) => {
  const api = await testAPI(t, { TRUSTED_ORIGINS: "http://localhost:5173" });
  const allowed = await api.request("/api/auth/sign-in/email", {
    method: "OPTIONS", origin: "http://localhost:5173",
    headers: { "access-control-request-method": "POST", "access-control-request-headers": "content-type" },
  });
  assert.equal(allowed.status, 204);
  assert.equal(allowed.headers.get("access-control-allow-origin"), "http://localhost:5173");
  assert.equal(allowed.headers.get("access-control-allow-credentials"), "true");
  const denied = await api.request("/api/health", { origin: "http://localhost:5174" });
  assert.equal(denied.headers.get("access-control-allow-origin"), null);
});

test("login throttling persists across restart and ignores spoofed IP headers", async (t) => {
  const api = await testAPI(t);
  for (let index = 0; index < 10; index++) {
    const response = await api.request("/api/auth/sign-in/email", {
      body: { email: "absent@example.com", password },
      headers: { "x-forwarded-for": `192.0.2.${index + 1}`, "x-pokedex-client-ip": `198.51.100.${index + 1}` },
    });
    assert.equal(response.status, 401);
    await response.text();
  }
  await api.restart();
  const blocked = await api.request("/api/auth/sign-in/email", { body: { email: signup.email, password } });
  assert.equal(blocked.status, 429);
  assert.ok(Number(blocked.headers.get("x-retry-after")) > 0);
});

test("oversized fixed-length and chunked bodies are rejected before authentication", async (t) => {
  const api = await testAPI(t);
  const body = JSON.stringify({ ...signup, name: "a".repeat(20000) });
  const fixed = await api.request("/api/auth/sign-up/email", { body });
  assert.equal(fixed.status, 413);
  const chunked = await api.streamRequest("/api/auth/sign-up/email", [body.slice(0, 10000), body.slice(10000)]);
  assert.equal(chunked.status, 413);
  assert.equal(api.database.prepare('SELECT count(*) AS count FROM "user"').get().count, 0);
});

test("production sets Secure cookies and API errors do not expose server internals", async (t) => {
  const api = await testAPI(t, { NODE_ENV: "production", BETTER_AUTH_URL: "https://pokedex.example" });
  const response = await register(api);
  assert.match(response.headers.getSetCookie().join(";"), /; Secure/i);
  const missing = await api.request("/does-not-exist");
  assert.equal(missing.status, 404);
  assert.equal(missing.headers.get("x-powered-by"), null);
  assert.deepEqual(await missing.json(), { error: { code: "NOT_FOUND", message: "Endpoint not found." } });
});
