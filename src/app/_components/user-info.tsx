"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { generateUrl } from "~/lib/utils";
import { type XSollaUser } from "~/types";

export default function UserInfo() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await fetch(
        generateUrl("/xsolla/users/me", {
          engine: "unity",
          engine_v: "2022.3.20f1",
          sdk: "login",
          sdk_v: "0.7.1",
        }),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("xsollaToken")}`,
          },
          cache: "no-store",
        },
      );

      if (response.status !== 200) {
        return null;
      }

      return (await response.json()) as XSollaUser;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data) {
    return (
      <Button asChild>
        <Link href="/auth/login">Login</Link>
      </Button>
    );
  }

  return <pre>{JSON.stringify(data)}</pre>;
}
