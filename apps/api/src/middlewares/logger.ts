import pino from "pino";
import { os } from "@orpc/server";

const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty",
    options: { colorize: true },
  },
});

export const loggerMiddleware = os.middleware(
  async ({ context, next, path, procedure }) => {
    logger.info(
      {
        path: path.join("."),
        procedure: procedure["~orpc"]?.meta || "unknown",
      },
      "Request started",
    );

    try {
      logger.info({ path: path.join(".") }, "Request completed");
      return await next({ context: { ...context, logger } });
    } catch (error) {
      logger.error(
        {
          path: path.join("."),
          error: error instanceof Error ? error.message : String(error),
        },
        "Request failed",
      );

      throw error;
    }
  },
);
