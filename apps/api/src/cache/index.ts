import { usersTable } from "@/db/schema";
import { LRUCache } from "lru-cache";

export type UserRecord = typeof usersTable.$inferSelect;

export const userCache = new LRUCache<UserRecord["supabaseId"], UserRecord>({
  max: 1000,
  ttl: 15 * 60 * 1000,
});
