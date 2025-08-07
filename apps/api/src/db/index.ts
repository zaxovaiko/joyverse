import { drizzle } from "drizzle-orm/bun-sql";
import { usersTable } from "./schema";

const connectionString = process.env.DATABASE_URL!;
export const db = drizzle(connectionString, { schema: { usersTable } });
