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
  supabaseId: uuid("supabase_id").unique().notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  age: smallint().notNull(),
  city: text(),
  country: text(),
  bio: text().notNull(),
  onboardedAt: timestamp("onboarded_at", {
    mode: "date",
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
