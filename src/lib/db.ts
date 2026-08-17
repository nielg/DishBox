import postgres from "postgres";

const connectionString =
  import.meta.env.DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing from your environment variables!");
}

// 2. Initialize the connection pool
const sql = postgres(connectionString, {
  max: 10, // Maximum number of connections in the pool
  idle_timeout: 30, // Max seconds a connection can sit idle before closing
  connect_timeout: 30, // Max seconds to wait for a connection to establish
});

export default sql;
