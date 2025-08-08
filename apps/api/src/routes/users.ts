import { UserSchema } from "@repo/zod-schemas";
import z from "zod";

import { base, baseAuth } from "@/base";

export const users = {
  create: base.input(z.object({ name: z.string() })).handler(async () => {
    // TODO: implement
  }),
  get: baseAuth.handler(async () => {
    // TODO: implement
  }),
  update: baseAuth.handler(async () => {
    // TODO: implement
  }),
  delete: baseAuth.handler(async () => {
    // TODO: implement
  }),
  onboard: baseAuth
    .input(
      UserSchema.pick({
        firstName: true,
        lastName: true,
        city: true,
        country: true,
        age: true,
      }),
    )
    .handler(async () => {
      // TODO: implement
    }),
};
