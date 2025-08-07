import { RPCHandler } from "@orpc/server/fetch";
import { CORSPlugin, RequestHeadersPlugin } from "@orpc/server/plugins";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { router } from "@/router";

const handler = new RPCHandler(router, {
  plugins: [
    new CORSPlugin({
      allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    }),
    new RequestHeadersPlugin(),
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
      specGenerateOptions: {
        info: {
          title: "Joyverse API",
          version: "1.0.0",
        },
      },
    }),
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
