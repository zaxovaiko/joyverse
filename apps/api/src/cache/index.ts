import { LRUCache } from "lru-cache";
import type { usersTable } from "../db/schema";

export type UserRecord = typeof usersTable.$inferSelect;

// Cache for storing user records
// Cache up to 1000 users for 15 minutes
export const userCache = new LRUCache<string, UserRecord>({
  max: 1000,
  ttl: 15 * 60 * 1000, // 15 minutes in milliseconds
});