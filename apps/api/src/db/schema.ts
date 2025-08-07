import {
  timestamp,
  smallint,
  text,
  integer,
  pgTable,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
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
