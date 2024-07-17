"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
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
import fetchUser from "../_actions/fetch-user";
import { searchParamsSchema, verificationFormSchema } from "../_lib/schema";
import { useParsedSearchParamsSafe } from "~/hooks/use-parsed-search-params";

export default function VerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parsedSearchParams = useParsedSearchParamsSafe(
    searchParams,
    searchParamsSchema,
  );

  const form = useForm<z.infer<typeof verificationFormSchema>>({
    resolver: zodResolver(verificationFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: async (data: z.infer<typeof verificationFormSchema>) => {
      const searchParams = new URLSearchParams({
        email: parsedSearchParams.data?.email ?? "",
        operation_id: parsedSearchParams.data?.operationId ?? "",
        code: data.code,
      });

      const response = await fetch(
        `/api/xsolla/xsollaCompleteEmailAuth?${searchParams.toString()}`,
      );

      if (response.status !== 200) {
        return null;
      }

      const { message } = (await response.json()) as { message?: string };
      return message ?? null;
    },
  });

  const fetchUserMutation = useMutation({
    mutationFn: async (data: string) => {
      const form = new FormData();
      form.append("token", data);

      return await fetchUser(form);
    },
  });

  async function onSubmit(data: z.infer<typeof verificationFormSchema>) {
    const toastId = toast.loading("Verifying code...");

    try {
      const token = await verifyCodeMutation.mutateAsync(data);
      if (!token) {
        toast.error("Invalid code", {
          id: toastId,
        });
        form.setError("code", {
          message: "Invalid code",
        });

        return;
      }

      toast.loading("Fetching user data...", {
        id: toastId,
      });

      if (!(await fetchUserMutation.mutateAsync(token))) {
        toast.error("Failed to fetch user data", {
          id: toastId,
        });
        return;
      }

      toast.success("Successfully logged in", {
        id: toastId,
      });

      router.push("/");
    } catch (err) {
      toast.error("Unknown error occured", {
        description: "Please try again later.",
        id: toastId,
      });
    }
  }

  if (!parsedSearchParams.success || !parsedSearchParams.data) {
    router.push("/auth/login");
    return null;
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
            <Button
              className="w-full"
              disabled={
                form.formState.isSubmitting ||
                verifyCodeMutation.isPending ||
                fetchUserMutation.isPending
              }
            >
              Sign in
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
