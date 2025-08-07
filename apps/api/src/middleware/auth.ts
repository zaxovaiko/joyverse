import { Elysia } from "elysia";
import { createClient } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { userCache, type UserRecord } from "../cache";

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function authenticateUser(authHeader: string): Promise<UserRecord> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid authorization header");
  }
  
  const token = authHeader.slice(7); // Remove "Bearer " prefix
  
  // Verify the token with Supabase
  const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);
  
  if (error || !supabaseUser) {
    throw new Error("Invalid token");
  }
  
  const userId = supabaseUser.id;
  
  // Check cache first
  let user = userCache.get(userId);
  
  if (!user) {
    // Look up user in database by Supabase ID
    const dbUsers = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.supabaseId, userId));
      
    if (dbUsers.length === 0) {
      throw new Error("User not found");
    }
    
    user = dbUsers[0];
    
    // Cache the user record
    userCache.set(userId, user);
  }
  
  return user;
}

// Reusable auth middleware plugin following Elysia patterns
export const authMiddleware = (app: Elysia) =>
  app.derive(async ({ headers, set }) => {
    try {
      const user = await authenticateUser(headers.authorization || "");
      return { user };
    } catch (error) {
      set.status = 401;
      return { error: "Authentication failed" };
    }
  });

// Alternative middleware for optional authentication
export const optionalAuthMiddleware = (app: Elysia) =>
  app.derive(async ({ headers }) => {
    try {
      const user = await authenticateUser(headers.authorization || "");
      return { user };
    } catch (error) {
      return { user: null };
    }
  });

// Guard middleware for protected routes
export const requireAuth = (app: Elysia) =>
  app.derive(async ({ headers, set }) => {
    try {
      const user = await authenticateUser(headers.authorization || "");
      return { user };
    } catch (error) {
      set.status = 401;
      throw new Error("Authentication required");
    }
  });