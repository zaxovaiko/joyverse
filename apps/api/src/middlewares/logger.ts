import pino from "pino";
import { os } from "@orpc/server";

const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

export const loggerMiddleware = os.middleware(
  async ({ context, next, path, procedure }) => {
    const startTime = Date.now();

    logger.info(
      {
        path: path.join("."),
        procedure: procedure["~orpc"]?.meta || "unknown",
      },
      "Request started",
    );

    try {
      const result = await next({
        context: {
          ...context,
          logger,
        },
      });

      const duration = Date.now() - startTime;
      logger.info(
        {
          path: path.join("."),
          duration,
        },
        "Request completed",
      );

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(
        {
          path: path.join("."),
          duration,
          error: error instanceof Error ? error.message : String(error),
        },
        "Request failed",
      );

      throw error;
    }
  },
);
