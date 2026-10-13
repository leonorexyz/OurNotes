import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import fs from "fs";
import path from "path";

const tursoUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

let client: ReturnType<typeof createClient>;

if (tursoUrl) {
  client = createClient({
    url: tursoUrl,
    authToken: tursoAuthToken,
  });
} else {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const dbPath = path.join(dataDir, "ournotes.db");
  client = createClient({
    url: `file:${dbPath}`,
  });
}

export const db = drizzle(client, { schema });
export { schema };
