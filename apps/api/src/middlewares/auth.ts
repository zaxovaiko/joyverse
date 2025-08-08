import { ORPCError, os } from "@orpc/server";
import type { RequestHeadersPluginContext } from "@orpc/server/plugins";
import type { User } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";

import { userCache } from "@/cache";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { supabase } from "@/lib/supabase";

export type AppContext = {
  user: typeof usersTable.$inferSelect;
  supabaseUser: User;
};

export const authMiddleware = os
  .$context<RequestHeadersPluginContext>()
  .middleware(async ({ context, next }) => {
    const authHeader = context.reqHeaders?.get("Authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");
    if (!token) {
      throw new ORPCError("Unauthorized: No token provided");
    }
    const supabaseUser = await supabase.auth.getUser(token);
    if (!supabaseUser.data.user) {
      throw new ORPCError("Unauthorized: Invalid token");
    }

    let user = userCache.get(token);
    if (!user) {
      user = await db.query.usersTable.findFirst({
        where: eq(usersTable.supabaseId, token),
      });
      if (!user) {
        throw new ORPCError("Unauthorized: Invalid token");
      }
      userCache.set(token, user);
    }

    return await next({
      context: {
        ...context,
        supabaseUser: supabaseUser.data.user,
        user,
      },
    });
  });
