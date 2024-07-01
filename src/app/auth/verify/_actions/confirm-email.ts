"use server";

import { cookies } from "next/headers";
import { z } from "zod";

const schema = z.object({
  email: z.string().email().min(1),
  operationId: z.string(),
  code: z.string().length(4),
});

export default async function confirmEmail(form: FormData) {
  try {
    const data = await schema.parseAsync(Object.fromEntries(form));

    const searchParams = new URLSearchParams({
      email: data.email,
      operation_id: data.operationId,
      code: data.code,
    });

    const response = await fetch(
      `https://playshoptitans.com/api/xsolla/xsollaCompleteEmailAuth?${searchParams.toString()}`,
    );

    if (response.status !== 200) {
      return false;
    }

    const { message } = (await response.json()) as { message?: string };
    if (!message) {
      return false;
    }

    cookies().set("xsolla_token", message);

    return true;
  } catch {
    return false;
  }
}
