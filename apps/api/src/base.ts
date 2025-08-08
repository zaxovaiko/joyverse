import { os } from "@orpc/server";

import { authMiddleware } from "@/middlewares/auth";
import { loggerMiddleware } from "@/middlewares/logger";

export const base = os.use(loggerMiddleware);
export const baseAuth = base.use(authMiddleware);
