import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

// safe fail instead of crashing Termux shell loops
if (!connectionString) {
  console.log("[DB] No DATABASE_URL found - running in MEMORY MODE");
}

export const sql = connectionString ? postgres(connectionString) : null;
