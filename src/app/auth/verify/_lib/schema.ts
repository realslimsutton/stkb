import { z } from "zod";

export const searchParamsSchema = z.object({
  email: z.string().email().min(0),
  operationId: z.string(),
});

export const verificationFormSchema = z.object({
  code: z.string().length(4),
});
