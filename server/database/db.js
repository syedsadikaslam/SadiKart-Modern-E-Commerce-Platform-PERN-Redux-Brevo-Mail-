import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

const database = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test DB Connection
database.query("SELECT NOW()")
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => {
    console.error("DB Connection Error:", err.message);
    process.exit(1);
  });

export default database;
