"use server";

import { z } from "zod";
import { login } from "~/auth/utils";
import { getXSollaUser } from "~/shop-titans/utils";

const schema = z.object({
  token: z.string(),
});

export default async function fetchUser(form: FormData) {
  try {
    const data = await schema.safeParseAsync(Object.fromEntries(form));
    if (!data.success) {
      return false;
    }

    const user = await getXSollaUser(data.data.token);
    if (!user) {
      return false;
    }

    await login({
      token: data.data.token,
      user,
    });

    return true;
  } catch {
    return false;
  }
}
