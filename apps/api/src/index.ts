import "dotenv/config";

import { Elysia } from "elysia";
import { db } from "./db";
import swagger from "@elysiajs/swagger";
import cors from "@elysiajs/cors";
import { rateLimit } from "elysia-rate-limit";
import { sql } from "drizzle-orm";

const app = new Elysia()
  .use(cors())
  .use(rateLimit())
  .use(swagger())
  .get("/", async () => {
    return !!(await db.execute(sql`SELECT 1;`));
  })
  .listen(4000);

console.log(
  `🦊 Server is running at http://${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
