import {
  timestamp,
  smallint,
  text,
  integer,
  pgTable,
  uuid,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  supabaseId: uuid("supabase_id").unique(), // Link to Supabase user
  firstName: text().notNull(),
  lastName: text().notNull(),
  age: smallint().notNull(),
  city: text(),
  country: text(),
  bio: text().notNull(),
  onboardedAt: timestamp({ mode: "date", withTimezone: true }).defaultNow(),
  createdAt: timestamp({ mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ mode: "date", withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
