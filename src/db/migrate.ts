import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from "./index";
import path from "path";

export async function runMigrations() {
  console.log("Menjalankan migrasi database...");
  const migrationsFolder = path.join(process.cwd(), "drizzle");
  migrate(db, { migrationsFolder });
  console.log("✓ Migrasi skema database berhasil diterapkan!");
}

if (require.main === module) {
  runMigrations().catch((err) => {
    console.error("Gagal menjalankan migrasi:", err);
    process.exit(1);
  });
}
