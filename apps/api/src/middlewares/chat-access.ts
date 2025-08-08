import { db } from "@/db";
import { chatUsersTable } from "@/db/schema";
import type { AppContext } from "@/middlewares/auth";
import { ORPCError, os } from "@orpc/server";
import type { SendMessageInput } from "@repo/zod-schemas";
import { and, eq } from "drizzle-orm";

export const chatAccessMiddleware = os
  .$context<AppContext>()
  .middleware(async ({ context, next }, input: SendMessageInput) => {
    const membership = await db.query.chatUsersTable.findFirst({
      where: and(
        eq(chatUsersTable.chatId, input.chatId),
        eq(chatUsersTable.userId, context.user.id),
      ),
    });
    if (!membership) {
      throw new ORPCError("User is not a member of this chat", { status: 403 });
    }
    return next({ context });
  });
