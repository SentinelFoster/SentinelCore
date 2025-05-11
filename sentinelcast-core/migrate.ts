import { db } from "./server/db";
import { migrate } from "drizzle-orm/neon-serverless/migrator";

// This script will migrate the database schema
async function main() {
  console.log("Starting database migration...");
  
  try {
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

main();