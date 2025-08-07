import { RPCHandler } from "@orpc/server/fetch";
import { CORSPlugin, RequestHeadersPlugin } from "@orpc/server/plugins";
import { router } from "@/router";

const handler = new RPCHandler(router, {
  plugins: [
    new CORSPlugin({
      allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    }),
    new RequestHeadersPlugin(),
  ],
});

const server = Bun.serve({
  port: 4000,
  async fetch(request: Request) {
    const { matched, response } = await handler.handle(request, {
      prefix: "/api",
    });
    if (matched) {
      return response;
    }
    return new Response("Not found", { status: 404 });
  },
});

console.log(`Server running at http://${server.hostname}:${server.port}/api`);
