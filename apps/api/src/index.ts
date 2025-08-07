import { Elysia } from "elysia";
import "dotenv/config";
import { db } from "./db";

const app = new Elysia()
  .get("/", async () => {
    return !!(await db.execute("SELECT 1;")).rowCount;
  })
  .listen(3000);

console.log(
  `🦊 Server is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
