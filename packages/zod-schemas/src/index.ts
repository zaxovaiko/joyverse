import z from "zod";

export const UserSchema = z.object({
  id: z.uuid(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  city: z.string().min(1).max(100).optional(),
  country: z.string().min(1).max(100).optional(),
  age: z.int().min(0).max(120),
  onboardedAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
