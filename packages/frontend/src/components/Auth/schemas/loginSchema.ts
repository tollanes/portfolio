import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  username: z.string().optional(),
  password: z.string()
});
