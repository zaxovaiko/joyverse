/**
 * Example usage of the auth middleware
 * 
 * This file demonstrates how to use the auth middleware in different scenarios.
 */

import { Elysia } from "elysia";
import { authenticateUser } from "../middleware/auth";

// Example 1: Manual authentication in route handler
const manualAuthExample = new Elysia()
  .get("/user-profile", async ({ headers, set }) => {
    try {
      const user = await authenticateUser(headers.authorization || "");
      
      // Custom logic with authenticated user
      return {
        profile: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          bio: user.bio,
          location: user.city ? `${user.city}, ${user.country}` : user.country,
          memberSince: user.createdAt,
        }
      };
    } catch (error) {
      set.status = 401;
      return { error: "Authentication required" };
    }
  });

// Example 2: Conditional authentication
const conditionalAuthExample = new Elysia()
  .get("/user-data/:publicId", async ({ params, headers }) => {
    const { publicId } = params;
    
    // Public data that anyone can see
    const publicData = {
      id: publicId,
      publicInfo: "This is public information"
    };
    
    // Try to authenticate - if successful, add private data
    try {
      const user = await authenticateUser(headers.authorization || "");
      
      // If authenticated, return additional private data
      return {
        ...publicData,
        privateInfo: "This is private information",
        currentUser: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`
        }
      };
    } catch (error) {
      // If not authenticated, just return public data
      return publicData;
    }
  });

// Example 3: Role-based access (future enhancement)
const roleBasedExample = new Elysia()
  .get("/admin-only", async ({ headers, set }) => {
    try {
      const user = await authenticateUser(headers.authorization || "");
      
      // TODO: Add role checking logic here
      // if (!user.isAdmin) {
      //   set.status = 403;
      //   return { error: "Admin access required" };
      // }
      
      return { message: "Admin-only content" };
    } catch (error) {
      set.status = 401;
      return { error: "Authentication required" };
    }
  });

// Export examples for testing
export { manualAuthExample, conditionalAuthExample, roleBasedExample };