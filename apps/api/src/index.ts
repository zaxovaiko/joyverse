import { Elysia } from "elysia";

const app = new Elysia().get("/", () => true).listen(3000);

console.log(
  `🦊 Server is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
