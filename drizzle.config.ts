import { defineConfig } from "drizzle-kit";

const tursoUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: tursoUrl ? "turso" : "sqlite",
  dbCredentials: tursoUrl
    ? {
        url: tursoUrl,
        authToken: tursoAuthToken,
      }
    : {
        url: "./data/ournotes.db",
      },
});
