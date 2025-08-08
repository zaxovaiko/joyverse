import { db } from "@/db";
import { messagesTable } from "@/db/schema";
import { authMiddleware } from "@/middlewares/auth";
import { chatAccessMiddleware } from "@/middlewares/chat-access";
import { loggerMiddleware } from "@/middlewares/logger";
import { ORPCError, os } from "@orpc/server";
import { SendMessageSchema, UserSchema } from "@repo/zod-schemas";
import { sql } from "drizzle-orm";
import z from "zod";

const base = os.use(loggerMiddleware);

const health = base.handler(async () => {
  const ok = await db.execute(sql`SELECT 1`);
  if (!ok) {
    throw new ORPCError("Database connection failed", { status: 500 });
  }
  return { status: "ok" };
});

export const router = {
  health,
  users: {
    create: base.input(z.object({ name: z.string() })).handler(async () => {
      //
    }),
    get: base.use(authMiddleware).handler(async () => {
      //
    }),
    update: base.use(authMiddleware).handler(async () => {
      //
    }),
    delete: base.use(authMiddleware).handler(async () => {
      //
    }),
    onboard: base
      .use(authMiddleware)
      .input(
        UserSchema.pick({
          firstName: true,
          lastName: true,
          city: true,
          country: true,
          age: true,
        }),
      )
      .handler(async () => {
        //
      }),
  },
  chats: {
    list: base.use(authMiddleware).handler(async () => {
      // TODO: Implement chat listing (paginated) using `user` from `context`
    }),
  },
  messages: {
    send: base
      .use(authMiddleware)
      .input(SendMessageSchema)
      .use(chatAccessMiddleware)
      .handler(async ({ input, context }) => {
        const { chatId, message } = input;
        const [newMessage] = await db
          .insert(messagesTable)
          .values({ userId: context.user.id, chatId, content: message })
          .returning();
        return newMessage;
      }),
  },
};
