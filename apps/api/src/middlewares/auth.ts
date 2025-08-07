import { userCache } from "@/cache";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { supabase } from "@/lib/supabase";
import { os } from "@orpc/server";
import type { RequestHeadersPluginContext } from "@orpc/server/plugins";
import { eq } from "drizzle-orm";

export const authMiddleware = os
  .$context<RequestHeadersPluginContext>()
  .middleware(async ({ context, next }) => {
    const authHeader = context.reqHeaders?.get("Authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");
    if (!token) {
      throw new Error("Unauthorized: No token provided");
    }
    const supabaseUser = await supabase.auth.getUser(token);
    if (!supabaseUser.data.user) {
      throw new Error("Unauthorized: Invalid token");
    }

    let user = userCache.get(token);
    if (!user) {
      user = await db.query.usersTable.findFirst({
        where: eq(usersTable.supabaseId, token),
      });
      if (!user) {
        throw new Error("Unauthorized: Invalid token");
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
