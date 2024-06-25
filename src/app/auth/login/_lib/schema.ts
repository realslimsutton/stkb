import { z } from "zod";

export const loginRequestSchema = z.object({
  email: z.string().email().min(1),
});
