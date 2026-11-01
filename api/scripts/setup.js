import { randomBytes } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const template = await readFile(new URL(".env.example", root), "utf8");
try {
  await writeFile(
    new URL(".env", root),
    template.replace("BETTER_AUTH_SECRET=\n", `BETTER_AUTH_SECRET=${randomBytes(32).toString("base64url")}\n`),
    { flag: "wx", mode: 0o600 },
  );
  console.log("Created api/.env with a generated secret. Run npm run db:migrate next.");
} catch (error) {
  if (error.code !== "EEXIST") throw error;
  console.log("api/.env already exists; its settings and secret were preserved.");
}
