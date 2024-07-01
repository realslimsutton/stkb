"use server";

import { loginRequestSchema } from "../_lib/schema";

export default async function loginRequest(form: FormData) {
  try {
    const data = await loginRequestSchema.parseAsync(Object.fromEntries(form));

    const searchParams = new URLSearchParams({ email: data.email });

    const response = await fetch(
      `https://playshoptitans.com/api/xsolla/xsollaStartEmailAuth?${searchParams.toString()}`,
    );

    if (response.status !== 200) {
      return;
    }

    const {
      message: { operation_id: operationId },
    } = (await response.json()) as {
      message: { operation_id?: string };
    };
    if (!operationId) {
      return;
    }

    return { operationId };
  } catch {}
}
