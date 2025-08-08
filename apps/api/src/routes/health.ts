import { ORPCError } from "@orpc/server";
import { sql } from "drizzle-orm";

import { base } from "@/base";
import { db } from "@/db";

export const health = base.handler(async () => {
  const ok = await db.execute(sql`SELECT 1`);
  if (!ok) {
    throw new ORPCError("Database connection failed", { status: 500 });
  }
  return { status: "ok" };
});
