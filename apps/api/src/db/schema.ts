import { timestamp, smallint, text, pgTable, uuid } from "drizzle-orm/pg-core";

const createdAt = timestamp("created_at", {
  mode: "date",
  withTimezone: true,
})
  .defaultNow()
  .notNull();

const updatedAt = timestamp("updated_at", {
  mode: "date",
  withTimezone: true,
})
  .defaultNow()
  .notNull()
  .$onUpdate(() => new Date());

export const interestsTable = pgTable("interests", {
  id: uuid().primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt,
  updatedAt,
});

export const userInterestsTable = pgTable("user_interests", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  interestId: uuid("interest_id")
    .notNull()
    .references(() => interestsTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  createdAt,
  updatedAt,
});

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
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
  createdAt,
  updatedAt,
});

export const messagesTable = pgTable("messages", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  content: text("content").notNull(),
  createdAt,
  updatedAt,
});

export const chatsTable = pgTable("chats", {
  id: uuid().primaryKey().defaultRandom(),
  title: text("title"),
  createdAt,
  updatedAt,
});

export const chatUsersTable = pgTable("chat_users", {
  id: uuid().primaryKey().defaultRandom(),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chatsTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  createdAt,
  updatedAt,
});
