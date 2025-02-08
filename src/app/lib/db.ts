import { Pool } from "pg";

const pool = new Pool({
  user: "postgres", // Replace with your actual username
  host: "blk-411-db.cr8q0mco2kl3.us-east-1.rds.amazonaws.com", // Replace with your actual RDS endpoint
  database: "blk-411", // Replace with your actual database name
  password: "B4dbpw4lp34!", // Replace with your actual password
  port: 5432, // Default PostgreSQL port
});

export default pool;
