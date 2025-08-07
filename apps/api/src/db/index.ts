import { drizzle } from "drizzle-orm/bun-sql";
import * as schema from "@/db/schema";

const connectionString = process.env.DATABASE_URL!;
export const db = drizzle(connectionString, { schema });
