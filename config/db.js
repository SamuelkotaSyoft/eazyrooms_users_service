import * as path from "path";
import * as dotenv from "dotenv";
const __dirname = path.resolve();

dotenv.config({ path: path.resolve(__dirname, "webhook/.env") });

import Pool from "pg";

const PL = Pool.Pool;

const pool = new PL({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export { pool };
