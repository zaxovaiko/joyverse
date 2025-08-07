import { Elysia } from "elysia";
import "dotenv/config";
import { requireAuth, authenticateUser } from "./middleware/auth";

const app = new Elysia()
  .get("/", () => ({ message: "API is running" }))
  .get("/protected", async ({ headers, set }) => {
    try {
      const user = await authenticateUser(headers.authorization || "");
      return {
        message: "Hello authenticated user!",
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };
    } catch (error) {
      set.status = 401;
      return { error: "Authentication failed" };
    }
  })
  // Example of using the auth middleware for protected routes
  .use(requireAuth)
  .get("/me", ({ user }) => user)
  .listen(3000);

console.log(
  `🦊 Server is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
