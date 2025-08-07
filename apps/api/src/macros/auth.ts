import { Elysia } from "elysia";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { supabase } from "@/lib/supabase";
import { userCache } from "@/cache";
import { usersTable } from "@/db/schema";

export const auth = new Elysia({ name: "auth" }).macro({
  auth: {
    async resolve({ headers, status }) {
      const authorization = headers.authorization;
      if (!authorization || !authorization.startsWith("Bearer ")) {
        return status(401, "Missing or invalid authorization header");
      }

      const token = authorization.slice(7);
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser(token);
      if (!supabaseUser) {
        return status(401, "Unauthorized");
      }

      const userId = supabaseUser.id;
      let user = userCache.get(userId);
      if (!user) {
        const dbUser = await db.query.usersTable.findFirst({
          where: eq(usersTable.supabaseId, userId),
        });
        if (!dbUser) {
          return status(404, "User not found");
        }
        user = dbUser;
        userCache.set(userId, user);
      }

      return { supabaseUser, user };
    },
  },
});
