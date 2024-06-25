"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { env } from "~/env";
import { generateUrl } from "~/lib/utils";
import { type XSollaUser } from "~/types";
import { verificationFormSchema } from "../_lib/schema";

export default function VerificationForm({
  email,
  operationId,
}: {
  email: string;
  operationId: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof verificationFormSchema>>({
    resolver: zodResolver(verificationFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const confirmationMutation = useMutation({
    mutationFn: (data: z.infer<typeof verificationFormSchema>) => {
      return fetch(
        generateUrl("https://login.xsolla.com/api/oauth2/login/email/confirm", {
          client_id: env.NEXT_PUBLIC_ST_CLIENT_ID,
          engine: "unity",
          engine_v: "2022.3.20f1",
          sdk: "login",
          sdk_v: "0.7.1",
        }),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            operation_id: operationId,
            code: data.code,
          }),
          cache: "no-store",
        },
      );
    },
  });

  const tokenMutation = useMutation({
    mutationFn: (data: { code: string }) =>
      fetch(
        generateUrl("https://login.xsolla.com/api/oauth2/token", {
          engine: "unity",
          engine_v: "2022.3.20f1",
          sdk: "login",
          sdk_v: "0.7.1",
        }),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: env.NEXT_PUBLIC_ST_CLIENT_ID,
            grant_type: "authorization_code",
            code: data.code,
            redirect_uri: "https://login.xsolla.com/api/blank",
          }),
          cache: "no-store",
        },
      ),
  });

  const userMutation = useMutation({
    mutationFn: (data: { token: string }) =>
      fetch(
        generateUrl("https://login.xsolla.com/api/users/me", {
          engine: "unity",
          engine_v: "2022.3.20f1",
          sdk: "login",
          sdk_v: "0.7.1",
        }),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
          cache: "no-store",
        },
      ),
  });

  async function getAuthCode(data: z.infer<typeof verificationFormSchema>) {
    const response = await confirmationMutation.mutateAsync(data);

    const { login_url: loginUrl } = (await response.json()) as {
      login_url?: string;
    };
    if (!loginUrl) {
      throw new Error("Invalid code");
    }

    const url = new URL(loginUrl);
    const code = url.searchParams.get("code");
    if (!code) {
      throw new Error("Invalid code");
    }

    return code;
  }

  async function getToken(code: string) {
    const response = await tokenMutation.mutateAsync({ code });

    const { access_token: accessToken } = (await response.json()) as {
      access_token?: string;
      expires_in?: number;
      refresh_token?: string;
      scope?: string;
      token_type?: string;
    };

    if (!accessToken) {
      throw new Error("Invalid code");
    }

    return accessToken;
  }

  async function getUser(token: string) {
    const response = await userMutation.mutateAsync({ token });

    const user = (await response.json()) as XSollaUser;
    if (response.status !== 200 || !user) {
      throw new Error("Invalid code");
    }

    return user;
  }

  async function onSubmit(data: z.infer<typeof verificationFormSchema>) {
    const toastId = toast.loading("Verifying code...");

    try {
      const code = await getAuthCode(data);

      toast.loading("Logging in...", {
        id: toastId,
      });

      const token = await getToken(code);

      toast.loading("Fetching user...", {
        id: toastId,
      });

      await getUser(token);
      sessionStorage.setItem("xsollaToken", token);
      await queryClient.invalidateQueries({ queryKey: ["user"] });

      toast.success("Successfully logged in");

      router.push("/");
    } catch (err) {
      console.log(err);

      toast.error("Invalid code", {
        id: toastId,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Verification</CardTitle>

            <CardDescription>
              Enter the code sent to your email below to login to your account.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-center">
                    <FormControl>
                      <InputOTP maxLength={4} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                  </div>

                  <FormDescription>
                    Please enter the one-time password sent to your email
                    address.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <Button className="w-full" disabled={form.formState.isSubmitting}>
              Sign in
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
