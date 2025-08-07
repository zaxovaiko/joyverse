import { ORPCError, os } from "@orpc/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { authMiddleware } from "@/middlewares/auth";
import { loggerMiddleware } from "@/middlewares/logger";
import z from "zod";
import { UserSchema } from "@repo/zod-schemas";

const base = os.use(loggerMiddleware);

const health = base.handler(async () => {
  const ok = await db.execute(sql`SELECT 1`);
  if (!ok) {
    throw new ORPCError("Database connection failed");
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
    list: base.use(authMiddleware).handler(async ({ context }) => {
      // TODO: Implement chat listing (paginated) using `user` from `context`
    }),
  },
};
