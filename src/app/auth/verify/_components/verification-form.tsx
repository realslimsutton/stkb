"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
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
import confirmEmail from "../_actions/confirm-email";
import { verificationFormSchema } from "../_lib/schema";

export default function VerificationForm({
  email,
  operationId,
}: {
  email: string;
  operationId: string;
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof verificationFormSchema>>({
    resolver: zodResolver(verificationFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const confirmationMutation = useMutation({
    mutationFn: async (data: z.infer<typeof verificationFormSchema>) => {
      const form = new FormData();
      form.append("email", email);
      form.append("operationId", operationId);
      form.append("code", data.code);

      return await confirmEmail(form);
    },
  });

  async function getAuthCode(data: z.infer<typeof verificationFormSchema>) {
    const code = await confirmationMutation.mutateAsync(data);
    if (!code) {
      throw new Error("Invalid code");
    }

    return code;
  }

  async function onSubmit(data: z.infer<typeof verificationFormSchema>) {
    const toastId = toast.loading("Verifying code...");

    try {
      await getAuthCode(data);

      toast.success("Successfully logged in", {
        id: toastId,
      });

      router.push("/");
    } catch {
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
