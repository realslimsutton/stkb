"use server";

import { type XSollaUser } from "~/types";
import { getSession } from ".";
import { revalidatePath } from "next/cache";

export async function login({
  token,
  user,
}: {
  token: string;
  user: XSollaUser;
}) {
  const session = await getSession();

  session.token = token;
  session.user = user;

  await session.save();

  revalidatePath("/");
}

export async function logout() {
  const session = await getSession();
  session.destroy();

  revalidatePath("/");
}
