import { Pool } from "pg";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: "./.env" });

const pool = new Pool({
  user: "postgres", // Replace with your username
  host: "localhost", // Replace with your host
  database: "blk411_dev", // Replace with your database name
  password: "H2pagpt22!", // Replace with your password
  port: 5432, // Replace with your port if different
});

export default pool;
