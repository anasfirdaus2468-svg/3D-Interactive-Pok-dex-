import assert from "node:assert/strict";
import test from "node:test";
import { loadConfig } from "../src/config.js";

const environment = { BETTER_AUTH_SECRET: "Only-a-generated-test-secret-for-config-checks!" };

test("startup requires an explicit secret", () => {
  assert.throws(() => loadConfig({}), /BETTER_AUTH_SECRET/);
  assert.throws(() => loadConfig({ BETTER_AUTH_SECRET: "short" }), /BETTER_AUTH_SECRET/);
});

test("production requires an explicit HTTPS origin", () => {
  assert.throws(() => loadConfig({ ...environment, NODE_ENV: "production" }), /BETTER_AUTH_URL/);
  assert.throws(() => loadConfig({ ...environment, NODE_ENV: "production", BETTER_AUTH_URL: "http://pokedex.example" }), /HTTPS/);
});

test("wildcards, credentials, paths, and opaque origins are rejected", () => {
  for (const value of ["*", "https://*.example.com", "https://user:password@example.com", "https://example.com/path", "null"]) {
    assert.throws(() => loadConfig({ ...environment, TRUSTED_ORIGINS: value }), /TRUSTED_ORIGINS/);
  }
});

test("trusted proxies require explicit addresses or nonzero CIDRs", () => {
  assert.equal(loadConfig(environment).trustProxy, false);
  assert.deepEqual(loadConfig({ ...environment, TRUST_PROXY_CIDRS: "127.0.0.1,10.2.3.0/24" }).trustProxy, ["127.0.0.1", "10.2.3.0/24"]);
  for (const value of ["true", "*", "0.0.0.0/0", "127.0.0.1/33", "::1/129"]) {
    assert.throws(() => loadConfig({ ...environment, TRUST_PROXY_CIDRS: value }), /TRUST_PROXY_CIDRS/);
  }
});

test("port, mode, and session lifetime are bounded and validated", () => {
  assert.throws(() => loadConfig({ ...environment, PORT: "-1" }), /PORT/);
  assert.throws(() => loadConfig({ ...environment, PORT: "65536" }), /PORT/);
  assert.throws(() => loadConfig({ ...environment, SESSION_TTL_SECONDS: "12" }), /SESSION_TTL_SECONDS/);
  assert.throws(() => loadConfig({ ...environment, NODE_ENV: "anything" }), /NODE_ENV/);
});
