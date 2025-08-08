import { SendMessageSchema } from "@repo/zod-schemas";
import { eq } from "drizzle-orm";
import z from "zod";

import { baseAuth } from "@/base";
import { db } from "@/db";
import { messagesTable } from "@/db/schema";
import { chatAccessMiddleware } from "@/middlewares/chat-access";

export const chats = {
  list: baseAuth.handler(async () => {
    // TODO: Implement chat listing (paginated) using `user` from `context`
  }),
  messages: {
    list: baseAuth
      // TODO: Add pagination
      .input(z.object({ chatId: z.uuid() }))
      .handler(async ({ input }) => {
        const messages = await db.query.messagesTable.findMany({
          where: eq(messagesTable.chatId, input.chatId),
        });
        return messages;
      }),
    send: baseAuth
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
