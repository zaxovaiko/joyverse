import { LRUCache } from "lru-cache";

import type { usersTable } from "@/db/schema";

export type UserRecord = typeof usersTable.$inferSelect;

export const userCache = new LRUCache<UserRecord["supabaseId"], UserRecord>({
  max: 1000,
  ttl: 15 * 60 * 1000,
});
